var VERSION = '0.6.0',
    preferences = {
        isEnabled: true,
        isDebugging: setDebugging() // must pre-load for init debugging
    },
    modules = [],
    minDB = {
        db: null,
        mods: 0,
        onSave: null
    }
;

/**
 * Initialize
 */
(function() {
    debug('initializing...');
    loadPreferences();
    // Request local database
    var request = webkitIndexedDB.open('Minimalist', 2);
    request.onupgradeneeded = function(e) {
        debug('migrating database...');
        request.result.createObjectStore('Modules', {keyPath: 'index'});
        minDB.onSave = function() {
            window.location.reload();
        };
    };

    request.onsuccess = function(e) {
        minDB.db = request.result;
        loadModules(function() {
            checkUpdate();
            loadMessageService();
            debug('initialized!');
        });
    };

    request.onerror = function(e) { console.error(e.value); };
})();

/**
 * Returns whether or not Minimalist should initialize in debug mode
 */
function setDebugging() {
    return localStorage.isDebugging || false;
}

/**
 * Loads preferences and saves defaults if preferences are not set
 */
function loadPreferences() {
    debug('loading preferences...');
    for (var option in preferences) {
        if (localStorage.hasOwnProperty(option)) {
            // Load preference to runtime
            preferences[option] = localStorage[option];
        } else {
            // Save default preference
            localStorage[option] = preferences[option];
        }
    }
}

/**
 * Loads module data from local database
 * @param  {Function} callback optional callback function
 */
function loadModules(callback) {
    debug('loading modules...');
    var request = minDB.db.transaction('Modules').objectStore('Modules').openCursor();
    request.onsuccess = function(e) {
        var cursor = request.result;
        if (!cursor) {
            minDB.mods = modules.length;
            callback();
        } else {
            modules.push(cursor.value.data);
            cursor.advance(1);
        }
    };
}

/**
 * Checks if extension has updated
 */
function checkUpdate() {
    debug('checking for updates...');
    if (localStorage.version === '0.5.20') {
        debug('INCOMPATIBLE VERSION FOUND. Nuking DB...');
        localStorage.isLegacy = true;
        minDB.reset();
    }
    if (!localStorage.version) {
        localStorage.version = VERSION;
        updateCoreModules();
        return;
    }
    if (localStorage.version !== VERSION) {
        debug('Updated to version ' + VERSION);
        updateCoreModules();
        if (isMajorUpdate(localStorage.version)) {
            var notification = webkitNotifications.createHTMLNotification('html/notifyUpdate.html#-1');
                notification.show();
        }
        localStorage.version = VERSION;
    }
}

/**
 * Listens for messages passed from other parts of Minimalist
 */
function loadMessageService() {
    debug('loading message service...');
    chrome.extension.onMessage.addListener(
        function(request, sender, sendResponse) {
            switch (request.name) {

                case 'activateBrowserAction':
                    activateBrowserAction(sender.tab);
                    sendResponse();
                    break;

                case 'installModule':
                    installModule(request.module);
                    sendResponse();
                    break;

                case 'uninstallModule':
                    uninstallModule(request.module);
                    sendResponse();
                    break;

                case 'getModuleIndex':
                    sendResponse({isInstalled: getModuleIndex(request.meta.name, request.meta.author) > -1});
                    break;

                case 'disable':
                    disable(request.module);
                    sendResponse();
                    break;

                case 'enable':
                    enable(request.module);
                    sendResponse();
                    break;

                case 'getActiveModules':
                    sendResponse({modules: getTargetModules(sender.tab.url, true)});
                    break;

                case 'getAllModules':
                    if (modules.length > 0) {
                        sendResponse({modules: modules});
                    } else {
                        sendResponse({modules: []});
                    }
                    break;

                case 'getGranularRawData':
                    sendResponse({
                        modules: modules,
                        isEnabled: preferences.isEnabled,
                        version: VERSION
                    });
                    break;

                case 'getPreferences':
                    sendResponse({preferences: preferences});
                    break;

                case 'getRawData':
                    sendResponse({data: getRawData()});
                    break;

                case 'getTargetModulesOfURL':
                    sendResponse({modules: getTargetModules(request.url, false)});
                    break;

                case 'updateCoreModulesModule':
                    updateCoreModules();
                    sendResponse();
                    break;

                case 'openTab':
                    chrome.tabs.create({'url': request.url, 'selected': request.isSelected});
                    sendResponse();
                    break;

                case 'reinit':
                    init();
                    sendResponse();
                    break;

                case 'reload':
                    if (request.module < 0) {
                        reloadAll();
                    } else {
                        reload(request.module);
                    }
                    sendResponse();
                    break;

                case 'reset':
                    minDB.reset(sendResponse);
                    break;

                case 'isEnabled':
                    sendResponse({isEnabled: preferences.isEnabled});
                    break;

                case 'save':
                    if (request.hasOwnProperty('modules')) {
                        modules = request.modules;
                    }
                    if (request.hasOwnProperty('preferences')) {
                        preferences = request.preferences;
                    }
                    save();
                    sendResponse();
                    break;

                case 'setRawData':
                    sendResponse({wasSuccessful: setRawData(request.preferences, request.moduleData)});
                    break;

                default:
                    console.error('Unexpected message: ' + request.name);
                    break;
            }
        }
    );
}

/**
 * Non-destructively updates core modules
 */
function updateCoreModules() {
    debug('Updating core modules...');
    var core = [PLUS, MAIL, CALENDAR, READER];
    var isCoreFound = false;
    // loop through core modules
    for (var i = 0, l = core.length; i < l; i++) {
        if (core[i] !== null) {
            // loop through existing modules
            for (var j = 0, m = modules.length; j < m; j++) {
                if (
                    core[i].name === modules[j].name &&
                    core[i].author == modules[j].author
                ) {
                    debug(core[i].name + ' installed. Preserving options.');
                    isCoreFound = true;
                    core[i].isEnabled = modules[j].isEnabled;
                    // loop through options in core module
                    for (var k = 0, n = core[i].options.length; k < n; k++) {
                        // loop through options in existing module
                        for (var h = 0, o = modules[j].options.length; h < o; h++) {
                            if (core[i].options[k].description == modules[j].options[h].description) {
                                core[i].options[k].isEnabled = modules[j].options[h].isEnabled;
                                // loop through fields in option
                                for (var g = 0, p = modules[j].options[h].fields.length; g < p; g++) {
                                    core[i].options[k].fields[g].val = modules[j].options[h].fields[g].val;
                                }
                            }
                        }
                    }
                    // replace module with updated core
                    modules[j] = core[i];
                }
            }
            if (!isCoreFound) {
                modules.push(core[i]);
            }
            isCoreFound = false;
        }
    }
    save();
}

/**
 * Adds module to database
 * @param {Object}   module   module to add to database
 * @param {int}      i        index of module to add
 * @param {Function} callback optional callback function
 */
minDB.add = function(module, i, callback) {
    var request = minDB.db.transaction('Modules', 'readwrite').objectStore('Modules').put({
        "data": module,
        "index": i
    });
    request.onerror = function(e) { console.error(e.value); };
    request.onsuccess = function(e) {
        if (typeof callback === 'function') {
            callback(e);
        }
    };
};

/**
 * Deletes module from database
 * @param  {int}      i        index of module to delete
 * @param  {Function} callback optional callback function
 */
minDB.remove = function(i, callback) {
    var trans = minDB.db.transaction(['Modules'], 'readwrite'),
        store = trans.objectStore('Modules'),
        request = store.delete(i);

    request.onerror = function(e) { console.error(e.value); };
    request.onsuccess = function(e) {
        if (typeof callback === 'function') {
            callback(e);
        }
    };
};

/**
 * Deletes the database and localStorage
 * @param {function} callback optional callback function
 */
minDB.reset = function(callback) {
    debug('reseting data...');
    var resetRequest = webkitIndexedDB.deleteDatabase('Minimalist');
        resetRequest.onblocked = resetRequest.onblocked = function(e) {
            if (typeof callback === 'function') { callback(); }
            window.location.reload();
        };
};

/**
 * Recursively write modules to database
 * @param  {int} i current index
 * @param  {int} l total modules
 */
minDB.write = function(i, l) {
    if (i < l) {
        modules[i].index = i;
        debug('saving ' + modules[i].name + '...');
        minDB.add(modules[i], i, function() {
            minDB.write(i + 1, l);
        });
    } else {
        minDB.clean(i);
    }
};

/**
 * Trim extra object store indexes
 * @param  {int} i index to start purge
 */
minDB.clean = function(i) {
    if (i < minDB.mods) {
        minDB.remove(i, function() {
            minDB.clean(i + 1);
        });
    } else {
        if (typeof minDB.onSave === 'function') {
            minDB.onSave();
        }
    }
};

/**
 * Persist preferences and modules
 */
function save() {
    debug('saving preferences...');
    for (var option in preferences) {
        localStorage[option] = preferences[option];
    }
    debug('saving modules...');
    minDB.write(0, modules.length);
}

/**
 * Disable module or Minimalist
 * @param  {int} i index of module to disable (-1 if Minimalist)
 */
function disable(i) {
    if (i < 0) {
        preferences.isEnabled = false;
        debug('Minimalist disabled');
    } else {
        modules[i].isEnabled = false;
        debug(modules[i].name + ' disabled');
    }
    save();
}

/**
 * Enable module or Minimalist
 * @param  {int} i index of module to disable (-1 if Minimalist)
 */
function enable(i) {
    if (i < 0) {
        preferences.isEnabled = true;
        debug('Minimalist enabled');
    } else {
        modules[i].isEnabled = true;
        debug(modules[i].name + ' enabled');
    }
    save();
}

/**
 * Gets index of module with given metadata
 * @param  {String} name   name of module
 * @param  {String} author name of module author
 * @return {int} index of module, -1 if not installed
 */
function getModuleIndex(name, author) {
    for (var i = 0, l = modules.length; i < l; i++) {
        if (
            modules[i].name == name &&
            modules[i].author == author
        ) {
            return i;
        }
    }
    return -1;
}

/**
 * Installs or updates given module
 * @param {Object} module module to be added
 */
function installModule(module) {
    var i = getModuleIndex(module.name, module.author);
    if (i < 0) {
        // module not installed, add it
        modules.push(new Module(module));
    } else {
        // module installed, update it
        modules[i] = new Module(module);
    }
    save();
}

/**
 * uninstalls module at given index
 * @param  {int} i index of module to remote
 */
function uninstallModule(i) {
    debug(modules[i].name + ' deleted');
    modules.splice(i, 1);
    save();
}

/**
 * Replace all local data with given data
 * @param {Object} preferenceData new preferences
 * @param {Array} moduleData      Array of Stringified modules
 * @param {function} callback     optional callback function
 */
function setRawData(preferenceData, moduleData, callback) {
    try {
        for (var i = 0, l = moduleData.length; i < l; i++) {
            try {
                moduleData[i] = JSON.parse(moduleData[i]);
            } catch(e) {
                debug(e);
            }
        }
        preferences = preferenceData;
        modules = moduleData;
        save();
        if (typeof callback === 'function') { callback(true); }
    } catch(e) {
        if (typeof callback === 'function') { callback(false); }
    }
}

/**
 * Get raw data for export
 * @return {String} raw data
 */
function getRawData() {
    var moduleString = JSON.stringify(modules[0]);
    for (var i = 1, l = modules.length; i < l; i++) {
        moduleString += '|||' + JSON.stringify(modules[i]);
    }
    return VERSION + '###' + preferences.isEnabled + '|||' + moduleString;
}

/**
 * Get modules that target given url
 * @param  {String}  url        query url
 * @param  {Boolean} activeOnly optional, only gets enabled modules
 * @return {Array}              matched modules
 */
function getTargetModules(url, activeOnly) {
    if (!url) {
        debug('getting current tab...');
        chrome.tabs.getSelected(null, function(tab) {
            return getTargetModules(tab.url);
        });
    }
    debug('getting' + (activeOnly ? ' active' : '') + ' modules that target ' + url + '...');
    var matchedModules = [];
    for (var i = 0, l = modules.length; i < l; i++) {
        if (isMatch(url, modules[i].includes)) {
            if (!activeOnly || modules[i].isEnabled) {
                matchedModules.push(modules[i]);
            }
        }
    }
    return matchedModules;
}

/**
 * Gets active modules for given page
 * @param  {String} url query url
 * @return {Array}      matched modules
 */
function getActiveModules(url) {
    return getTargetModules(url, true);
}

/**
 * Set browserAction to active state
 * @param  {Tab} tab active browserAction on given tab
 */
function activateBrowserAction(tab) {
    debug('activating browser action for ' + tab.url + '...');
    chrome.browserAction.setIcon({
        path: 'img/icons/19_active.png',
        tabId: tab.id
    });
}

/**
 * Reload all tabs targetted by active modules
 */
function reloadAll() {
    debug('reloading tabs targetted by all active modules...');
    chrome.windows.getAll({populate: true}, function(windows) {
        // loop through windows
        for (var i = 0, l = windows.length; i < l; i++) {
            var tabs = windows[i].tabs;
            // loop through tabs
            for (var j = 0, m = tabs.length; j < m; j++) {
                if (getTargetModules(tabs[j].url, true).length > 0) {
                    reload(tabs[j]);
                }
            }
        }
    });
}

/**
 * Reload all tabs containing URL or reload given tab
 * @param  {Int|Tab} target index of module or Tab
 */
function reload(target) {
    if (typeof target === 'string') {
        // target is url
        debug('reloading tabs targetted by ' + modules[target].name + '...');
        chrome.windows.getAll({populate: true},function(windows) {
            for (var i = 0, l = windows.length; i < l; i++) {
                var tabs = windows[i].tabs;
                for (var j = 0, m = tabs.length; j < m; j++) {
                    if (isMatch(tabs[j].url, modules[target].includes)) {
                        reload(tabs[j]);
                    }
                }
            }
        });
    } else {
        // target is Tab
        debug('reloading ' + target.url);
        chrome.tabs.update(target.id, {url: target.url, selected: target.selected}, null);
    }
}

/**
 * Checks if given include String matches given URL
 * @param  {String}  url      query URL
 * @param  {String}  includes includes String
 * @return {Boolean}          matches
 */
function isMatch(url, includes) {
    debug('checking regex matches for ' + url + ' against ' + includes);
    includes = includes.split(',');
    // loop through includes
    for (var i = 0, l = includes.length; i < l; i++) {
        if (url.match(toRegExp(includes[i])) !== null) {
            return true;
        }
    }
    return false;
}

/**
 * Check if given version number qualifies as major update
 * @param  {String}  query   query version
 * @param  {String}  against optional query against
 * @return {Boolean}         major update
 */
function isMajorUpdate(query, against) {
    query = query.split('.');
    against = against || VERSION;
    against = against.split('.');
    if (
        against[0] > query[0] || (
            against[0] == query[0] &&
            against[1] > query[1]
        )) {
        return true;
    }
    return false;
}

/**
 * Wildcard to RegEx conversion based on AdBlock's implementation. http://www.mozdev.org/source/browse/adblock/adblock/
 * @param  {String} wildcard String to convert to wildcard
 * @return {RegExp}          resulting regex
 */
function toRegExp(wildcard) {
    var s = String(wildcard),
        res = String('^');

    for (var i = 0, l = s.length; i < l; i++) {
        switch(s[i]) {
            case '*':
                res += '.*';
                break;
            case '.':
            case '?':
            case '^':
            case '$':
            case '+':
            case '{':
            case '[':
            case '|':
            case '(':
            case ')':
            case ']':
                res += '\\' + s[i];
                break;
            case '\\':
                res += '\\\\';
                break;
            case ' ':
                break;
            default:
                res += s[i];
                break;
        }
    }

    var tldRegExp = new RegExp('^(\\^(?:[^/]*)(?://)?(?:[^/]*))(\\\\\\.tld)((?:/.*)?)$'),
        tldRes = res.match(tldRegExp);
    if (tldRes) {
        var tldStr = '\.(?:demon\\.co\\.uk|esc\\.edu\\.ar|(?:c[oi]\\.)?[^\\.]\\.(?:vt|ne|ks|il|hi|sc|nh|ia|wy|or|ma|vi|tn|in|az|id|nc|co|dc|nd|me|al|ak|de|wv|nm|mo|pr|nj|sd|md|va|ri|ut|ct|pa|ok|ky|mt|ga|la|oh|ms|wi|wa|gu|mi|tx|fl|ca|ar|mn|ny|nv)\\.us|[^\\.]\\.(?:(?:pvt\\.)?k12|cc|tec|lib|state|gen)\\.(?:vt|ne|ks|il|hi|sc|nh|ia|wy|or|ma|vi|tn|in|az|id|nc|co|dc|nd|me|al|ak|de|wv|nm|mo|pr|nj|sd|md|va|ri|ut|ct|pa|ok|ky|mt|ga|la|oh|ms|wi|wa|gu|mi|tx|fl|ca|ar|mn|ny|nv)\\.us|[^\\.]\\.vt|ne|ks|il|hi|sc|nh|ia|wy|or|ma|vi|tn|in|az|id|nc|co|dc|nd|me|al|ak|de|wv|nm|mo|pr|nj|sd|md|va|ri|ut|ct|pa|ok|ky|mt|ga|la|oh|ms|wi|wa|gu|mi|tx|fl|ca|ar|mn|ny|nvus|ne|gg|tr|mm|ki|biz|sj|my|hn|gl|ro|tn|co|br|coop|cy|bo|ck|tc|bv|ke|aero|cs|dm|km|bf|af|mv|ls|tm|jm|pg|ky|ga|pn|sv|mq|hu|za|se|uy|iq|ai|com|ve|na|ba|ph|xxx|no|lv|tf|kz|ma|in|id|si|re|om|by|fi|gs|ir|li|tz|td|cg|pa|am|tv|jo|bi|ee|cd|pk|mn|gd|nz|as|lc|ae|cn|ag|mx|sy|cx|cr|vi|sg|bm|kh|nr|bz|vu|kw|gf|al|uz|eh|int|ht|mw|gm|bg|gu|info|aw|gy|ac|ca|museum|sk|ax|es|kp|bb|sa|et|ie|tl|org|tj|cf|im|mk|de|pro|md|fm|cl|jp|bn|vn|gp|sm|ar|dj|bd|mc|ug|nu|ci|dk|nc|rw|aq|name|st|hm|mo|gq|ps|ge|ao|gr|va|is|mt|gi|la|bh|ms|bt|gb|it|wf|sb|ly|ng|gt|lu|il|pt|mh|eg|kg|pf|um|fr|sr|vg|fj|py|pm|sn|sd|au|sl|gh|us|mr|dz|ye|kn|cm|arpa|bw|lk|mg|tk|su|sc|ru|travel|az|ec|mz|lb|ml|bj|edu|pr|fk|lr|nf|np|do|mp|bs|to|cu|ch|yu|eu|mu|ni|pw|pl|gov|pe|an|ua|uk|gw|tp|kr|je|tt|net|fo|jobs|yt|cc|sh|io|zm|hk|th|so|er|cz|lt|mil|hr|gn|be|qa|cv|vc|tw|ws|ad|sz|at|tg|zw|nl|info\\.tn|org\\.sd|med\\.sd|com\\.hk|org\\.ai|edu\\.sg|at\\.tt|mail\\.pl|net\\.ni|pol\\.dz|hiroshima\\.jp|org\\.bh|edu\\.vu|net\\.im|ernet\\.in|nic\\.tt|com\\.tn|go\\.cr|jersey\\.je|bc\\.ca|com\\.la|go\\.jp|com\\.uy|tourism\\.tn|com\\.ec|conf\\.au|dk\\.org|shizuoka\\.jp|ac\\.vn|matsuyama\\.jp|agro\\.pl|yamaguchi\\.jp|edu\\.vn|yamanashi\\.jp|mil\\.in|sos\\.pl|bj\\.cn|net\\.au|ac\\.ae|psi\\.br|sch\\.ng|org\\.mt|edu\\.ai|edu\\.ck|ac\\.yu|org\\.ws|org\\.ng|rel\\.pl|uk\\.tt|com\\.py|aomori\\.jp|co\\.ug|video\\.hu|net\\.gg|org\\.pk|id\\.au|gov\\.zw|mil\\.tr|net\\.tn|org\\.ly|re\\.kr|mil\\.ye|mil\\.do|com\\.bb|net\\.vi|edu\\.na|co\\.za|asso\\.re|nom\\.pe|edu\\.tw|name\\.et|jl\\.cn|gov\\.ye|ehime\\.jp|miyazaki\\.jp|kanagawa\\.jp|gov\\.au|nm\\.cn|he\\.cn|edu\\.sd|mod\\.om|web\\.ve|edu\\.hk|medecin\\.fr|org\\.cu|info\\.au|edu\\.ve|nx\\.cn|alderney\\.gg|net\\.cu|org\\.za|mb\\.ca|com\\.ye|edu\\.pa|fed\\.us|ac\\.pa|alt\\.na|mil\\.lv|fukuoka\\.jp|gen\\.in|gr\\.jp|gov\\.br|gov\\.ac|id\\.fj|fukui\\.jp|hu\\.com|org\\.gu|net\\.ae|mil\\.ph|ltd\\.je|alt\\.za|gov\\.np|edu\\.jo|net\\.gu|g12\\.br|org\\.tn|store\\.co|fin\\.tn|ac\\.nz|gouv\\.fr|gov\\.il|org\\.ua|org\\.do|org\\.fj|sci\\.eg|gov\\.tt|cci\\.fr|tokyo\\.jp|net\\.lv|gov\\.lc|ind\\.br|ca\\.tt|gos\\.pk|hi\\.cn|net\\.do|co\\.tv|web\\.co|com\\.pa|com\\.ng|ac\\.ma|gov\\.bh|org\\.zw|csiro\\.au|lakas\\.hu|gob\\.ni|gov\\.fk|org\\.sy|gov\\.lb|gov\\.je|ed\\.cr|nb\\.ca|net\\.uy|com\\.ua|media\\.hu|com\\.lb|nom\\.pl|org\\.br|hk\\.cn|co\\.hu|org\\.my|gov\\.dz|sld\\.pa|gob\\.pk|net\\.uk|guernsey\\.gg|nara\\.jp|telememo\\.au|k12\\.tr|org\\.nz|pub\\.sa|edu\\.ac|com\\.dz|edu\\.lv|edu\\.pk|com\\.ph|net\\.na|net\\.et|id\\.lv|au\\.com|ac\\.ng|com\\.my|net\\.cy|unam\\.na|nom\\.za|net\\.np|info\\.pl|priv\\.hu|rec\\.ve|ac\\.uk|edu\\.mm|go\\.ug|ac\\.ug|co\\.dk|net\\.tt|oita\\.jp|fi\\.cr|org\\.ac|aichi\\.jp|org\\.tt|edu\\.bh|us\\.com|ac\\.kr|js\\.cn|edu\\.ni|com\\.mt|fam\\.pk|experts-comptables\\.fr|or\\.kr|org\\.au|web\\.pk|mil\\.jo|biz\\.pl|org\\.np|city\\.hu|org\\.uy|auto\\.pl|aid\\.pl|bib\\.ve|mo\\.cn|br\\.com|dns\\.be|sh\\.cn|org\\.mo|com\\.sg|me\\.uk|gov\\.kw|eun\\.eg|kagoshima\\.jp|ln\\.cn|seoul\\.kr|school\\.fj|com\\.mk|e164\\.arpa|rnu\\.tn|pro\\.ae|org\\.om|gov\\.my|net\\.ye|gov\\.do|co\\.im|org\\.lb|plc\\.co\\.im|net\\.jp|go\\.id|net\\.tw|gov\\.ai|tlf\\.nr|ac\\.im|com\\.do|net\\.py|tozsde\\.hu|com\\.na|tottori\\.jp|net\\.ge|gov\\.cn|org\\.bb|net\\.bs|ac\\.za|rns\\.tn|biz\\.pk|gov\\.ge|org\\.uk|org\\.fk|nhs\\.uk|net\\.bh|tm\\.za|co\\.nz|gov\\.jp|jogasz\\.hu|shop\\.pl|media\\.pl|chiba\\.jp|city\\.za|org\\.ck|net\\.id|com\\.ar|gon\\.pk|gov\\.om|idf\\.il|net\\.cn|prd\\.fr|co\\.in|or\\.ug|red\\.sv|edu\\.lb|k12\\.ec|gx\\.cn|net\\.nz|info\\.hu|ac\\.zw|info\\.tt|com\\.ws|org\\.gg|com\\.et|ac\\.jp|ac\\.at|avocat\\.fr|org\\.ph|sark\\.gg|org\\.ve|tm\\.pl|net\\.pg|gov\\.co|com\\.lc|film\\.hu|ishikawa\\.jp|hotel\\.hu|hl\\.cn|edu\\.ge|com\\.bm|ac\\.om|tec\\.ve|edu\\.tr|cq\\.cn|com\\.pk|firm\\.in|inf\\.br|gunma\\.jp|gov\\.tn|oz\\.au|nf\\.ca|akita\\.jp|net\\.sd|tourism\\.pl|net\\.bb|or\\.at|idv\\.tw|dni\\.us|org\\.mx|conf\\.lv|net\\.jo|nic\\.in|info\\.vn|pe\\.kr|tw\\.cn|org\\.eg|ad\\.jp|hb\\.cn|kyonggi\\.kr|bourse\\.za|org\\.sb|gov\\.gg|net\\.br|mil\\.pe|kobe\\.jp|net\\.sa|edu\\.mt|org\\.vn|yokohama\\.jp|net\\.il|ac\\.cr|edu\\.sb|nagano\\.jp|travel\\.pl|gov\\.tr|com\\.sv|co\\.il|rec\\.br|biz\\.om|com\\.mm|com\\.az|org\\.vu|edu\\.ng|com\\.mx|info\\.co|realestate\\.pl|mil\\.sh|yamagata\\.jp|or\\.id|org\\.ae|greta\\.fr|k12\\.il|com\\.tw|gov\\.ve|arts\\.ve|cul\\.na|gov\\.kh|org\\.bm|etc\\.br|or\\.th|ch\\.vu|de\\.tt|ind\\.je|org\\.tw|nom\\.fr|co\\.tt|net\\.lc|intl\\.tn|shiga\\.jp|pvt\\.ge|gov\\.ua|org\\.pe|net\\.kh|co\\.vi|iwi\\.nz|biz\\.vn|gov\\.ck|edu\\.eg|zj\\.cn|press\\.ma|ac\\.in|eu\\.tt|art\\.do|med\\.ec|bbs\\.tr|gov\\.uk|edu\\.ua|eu\\.com|web\\.do|szex\\.hu|mil\\.kh|gen\\.nz|okinawa\\.jp|mob\\.nr|edu\\.ws|edu\\.sv|xj\\.cn|net\\.ru|dk\\.tt|erotika\\.hu|com\\.sh|cn\\.com|edu\\.pl|com\\.nc|org\\.il|arts\\.co|chirurgiens-dentistes\\.fr|net\\.pa|takamatsu\\.jp|net\\.ng|org\\.hu|net\\.in|net\\.vu|gen\\.tr|shop\\.hu|com\\.ae|tokushima\\.jp|za\\.com|gov\\.eg|co\\.jp|uba\\.ar|net\\.my|biz\\.et|art\\.br|ac\\.fk|gob\\.pe|com\\.bs|co\\.ae|de\\.net|net\\.eg|hyogo\\.jp|edunet\\.tn|museum\\.om|nom\\.ve|rnrt\\.tn|hn\\.cn|com\\.fk|edu\\.dz|ne\\.kr|co\\.je|sch\\.uk|priv\\.pl|sp\\.br|net\\.hk|name\\.vn|com\\.sa|edu\\.bm|qc\\.ca|bolt\\.hu|per\\.kh|sn\\.cn|mil\\.id|kagawa\\.jp|utsunomiya\\.jp|erotica\\.hu|gd\\.cn|net\\.tr|edu\\.np|asn\\.au|com\\.gu|ind\\.tn|mil\\.br|net\\.lb|nom\\.co|org\\.la|mil\\.pl|ac\\.il|gov\\.jo|com\\.kw|edu\\.sh|otc\\.au|gmina\\.pl|per\\.sg|gov\\.mo|int\\.ve|news\\.hu|sec\\.ps|ac\\.pg|health\\.vn|sex\\.pl|net\\.nc|qc\\.com|idv\\.hk|org\\.hk|gok\\.pk|com\\.ac|tochigi\\.jp|gsm\\.pl|law\\.za|pro\\.vn|edu\\.pe|info\\.et|sch\\.gg|com\\.vn|gov\\.bm|com\\.cn|mod\\.uk|gov\\.ps|toyama\\.jp|gv\\.at|yk\\.ca|org\\.et|suli\\.hu|edu\\.my|org\\.mm|co\\.yu|int\\.ar|pe\\.ca|tm\\.hu|net\\.sb|org\\.yu|com\\.ru|com\\.pe|edu\\.kh|edu\\.kw|org\\.qa|med\\.om|net\\.ws|org\\.in|turystyka\\.pl|store\\.ve|org\\.bs|mil\\.uy|net\\.ar|iwate\\.jp|org\\.nc|us\\.tt|gov\\.sh|nom\\.fk|go\\.th|gov\\.ec|com\\.br|edu\\.do|gov\\.ng|pro\\.tt|sapporo\\.jp|net\\.ua|tm\\.fr|com\\.lv|com\\.mo|edu\\.uk|fin\\.ec|edu\\.ps|ru\\.com|edu\\.ec|ac\\.fj|net\\.mm|veterinaire\\.fr|nom\\.re|ingatlan\\.hu|fr\\.vu|ne\\.jp|int\\.co|gov\\.cy|org\\.lv|de\\.com|nagasaki\\.jp|com\\.sb|gov\\.za|org\\.lc|com\\.fj|ind\\.in|or\\.cr|sc\\.cn|chambagri\\.fr|or\\.jp|forum\\.hu|tmp\\.br|reklam\\.hu|gob\\.sv|com\\.pl|saitama\\.jp|name\\.tt|niigata\\.jp|sklep\\.pl|nom\\.ni|co\\.ma|net\\.la|co\\.om|pharmacien\\.fr|port\\.fr|mil\\.gu|au\\.tt|edu\\.gu|ngo\\.ph|com\\.ve|ac\\.th|gov\\.fj|barreau\\.fr|net\\.ac|ac\\.je|org\\.kw|sport\\.hu|ac\\.cn|net\\.bm|ibaraki\\.jp|tel\\.no|org\\.cy|edu\\.mo|gb\\.net|kyoto\\.jp|sch\\.sa|com\\.au|edu\\.lc|fax\\.nr|gov\\.mm|it\\.tt|org\\.jo|nat\\.tn|mil\\.ve|be\\.tt|org\\.az|rec\\.co|co\\.ve|gifu\\.jp|net\\.th|hokkaido\\.jp|ac\\.gg|go\\.kr|edu\\.ye|qh\\.cn|ab\\.ca|org\\.cn|no\\.com|co\\.uk|gov\\.gu|de\\.vu|miasta\\.pl|kawasaki\\.jp|co\\.cr|miyagi\\.jp|org\\.jp|osaka\\.jp|web\\.za|net\\.za|gov\\.pk|gov\\.vn|agrar\\.hu|asn\\.lv|org\\.sv|net\\.sh|org\\.sa|org\\.dz|assedic\\.fr|com\\.sy|net\\.ph|mil\\.ge|es\\.tt|mobile\\.nr|co\\.kr|ltd\\.uk|ac\\.be|fgov\\.be|geek\\.nz|ind\\.gg|net\\.mt|maori\\.nz|ens\\.tn|edu\\.py|gov\\.sd|gov\\.qa|nt\\.ca|com\\.pg|org\\.kh|pc\\.pl|com\\.eg|net\\.ly|se\\.com|gb\\.com|edu\\.ar|sch\\.je|mil\\.ac|mil\\.ar|okayama\\.jp|gov\\.sg|ac\\.id|co\\.id|com\\.ly|huissier-justice\\.fr|nic\\.im|gov\\.lv|nu\\.ca|org\\.sg|com\\.kh|org\\.vi|sa\\.cr|lg\\.jp|ns\\.ca|edu\\.co|gov\\.im|edu\\.om|net\\.dz|org\\.pl|pp\\.ru|tm\\.mt|org\\.ar|co\\.gg|org\\.im|edu\\.qa|org\\.py|edu\\.uy|targi\\.pl|com\\.ge|gub\\.uy|gov\\.ar|ltd\\.gg|fr\\.tt|net\\.qa|com\\.np|ass\\.dz|se\\.tt|com\\.ai|org\\.ma|plo\\.ps|co\\.at|med\\.sa|net\\.sg|kanazawa\\.jp|com\\.fr|school\\.za|net\\.pl|ngo\\.za|net\\.sy|ed\\.jp|org\\.na|net\\.ma|asso\\.fr|police\\.uk|powiat\\.pl|govt\\.nz|sk\\.ca|tj\\.cn|mil\\.ec|com\\.jo|net\\.mo|notaires\\.fr|avoues\\.fr|aeroport\\.fr|yn\\.cn|gov\\.et|gov\\.sa|gov\\.ae|com\\.tt|art\\.dz|firm\\.ve|com\\.sd|school\\.nz|edu\\.et|gob\\.pa|telecom\\.na|ac\\.cy|gz\\.cn|net\\.kw|mobil\\.nr|nic\\.uk|co\\.th|com\\.vu|com\\.re|belgie\\.be|nl\\.ca|uk\\.com|com\\.om|utazas\\.hu|presse\\.fr|co\\.ck|xz\\.cn|org\\.tr|mil\\.co|edu\\.cn|net\\.ec|on\\.ca|konyvelo\\.hu|gop\\.pk|net\\.om|info\\.ve|com\\.ni|sa\\.com|com\\.tr|sch\\.sd|fukushima\\.jp|tel\\.nr|atm\\.pl|kitakyushu\\.jp|com\\.qa|firm\\.co|edu\\.tt|games\\.hu|mil\\.nz|cri\\.nz|net\\.az|org\\.ge|mie\\.jp|net\\.mx|sch\\.ae|nieruchomosci\\.pl|int\\.vn|edu\\.za|com\\.cy|wakayama\\.jp|gov\\.hk|org\\.pa|edu\\.au|gov\\.in|pro\\.om|2000\\.hu|szkola\\.pl|shimane\\.jp|co\\.zw|gove\\.tw|com\\.co|net\\.ck|net\\.pk|net\\.ve|org\\.ru|uk\\.net|org\\.co|uu\\.mt|com\\.cu|mil\\.za|plc\\.uk|lkd\\.co\\.im|gs\\.cn|sex\\.hu|net\\.je|kumamoto\\.jp|mil\\.lb|edu\\.yu|gov\\.ws|sendai\\.jp|eu\\.org|ah\\.cn|net\\.vn|gov\\.sb|net\\.pe|nagoya\\.jp|geometre-expert\\.fr|net\\.fk|biz\\.tt|org\\.sh|edu\\.sa|saga\\.jp|sx\\.cn|org\\.je|org\\.ye|muni\\.il|kochi\\.jp|com\\.bh|org\\.ec|priv\\.at|gov\\.sy|org\\.ni|casino\\.hu|res\\.in|uy\\.com)';

        res = tldRes[1] + tldStr + tldRes[3];
    }
    return new RegExp(res + '$', 'i');
}

/**
 * Prints debug messages to console if debugging is enabled
 * @param  {Mixed} message message to print
 */
function debug(message) {
    if (localStorage.isDebugging) {
        console.log('Minimalist: ' + message);
    }
}