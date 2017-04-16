/**
 * Minimalist
 *
 * © 2013 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

var preferences,
    modules,
    bootstrapTarget,
    bodyScripts = '',
    headScripts = '',
    styles = '',
    _min = [],
    lastCheck = null
;

(function() {
    chrome.extension.sendMessage({name: 'getPreferences'}, function(response) {
        preferences = response.preferences;
        if (preferences.isEnabled) {
            chrome.extension.sendMessage({name: 'getActiveModules'}, function(response) {
                modules = response.modules;
                if (modules.length > 0) {
                    buildModules();
                    injectHead();
                    chrome.extension.sendMessage({name: 'activateBrowserAction'});
                    if (modules[0].bootstrapTarget) {
                        window.addEventListener('DOMSubtreeModified', init);
                    } else {
                        console.debug('no bootstrap target. Skipping load...');
                        injectBody();
                    }
                }
            });
        }
    });

    // listen for openTab requests
    document.addEventListener('openTab', function() {
        chrome.extension.sendMessage({
            name: 'openTab',
            url: event.detail.url,
            isSelected: event.detail.isSelected
        });
    });
})();

/**
 * Gets bootstrap target
 * @return {HTMLElement} boostrapTarget
 */
function getTarget() {
    return document.querySelectorAll(bootstrapTarget)[0];
}

/**
 * Recursively check for full initialization for AJAX pages
 */
function init() {
    console.debug('bootstrapping...');
    if (getTarget() == lastCheck) {
        return;
    }
    if (lastCheck !== null) {
        lastCheck.removeEventListener('DOMSubtreeModified', injectBody);
    }
    lastCheck = getTarget();
    if (lastCheck !== null) {
        lastCheck.addEventListener('DOMSubtreeModified', injectBody);
    }
}

/**
 * Build modules for injection
 */
function buildModules() {
    // loop through modules
    for (var i = 0, l = modules.length; i < l; i++) {
        var options = modules[i].options;
        // process styles
        var styleData;
        // loop through options
        for (var j = 0, m = options.length; j < m; j++) {
            if (options[j].isEnabled && options[j].head && options[j].head.css && (styleData = options[j].head.css) != null) {
                // loop through lines
                for (var k = 0, n = styleData.length; k < n; k++) {
                    styles += '\n    ' + styleData[k];
                }
                styles += '\n';
            }
        }

        // process head scripts
        var scriptData,
            fields = {};
        // loop through options
        for (var j = 0, m = options.length; j < m; j++) {
            if (options[j].isEnabled && options[j].head && options[j].head.js && (scriptData = options[j].head.js)) {
                // loop through lines
                for (var k = 0, n = scriptData.length; k < n; k++) {
                    headScripts += '\n    ' + scriptData[k];
                }
                headScripts += '\n';
            }
            if (options[j].fields && options[j].fields.length > 0) {
                // loop through fields
                for (var k = 0, n = options[j].fields.length; k < n; k++) {
                    fields[options[j].fields[k].name] = options[j].fields[k].val;
                }
            }
        }
        _min.push(JSON.stringify(fields));

        // process body scripts
        var scriptData;
        // loop through options
        for (var j = 0, m = options.length; j < m; j++) {
            if (options[j].isEnabled && options[j].load && (scriptData = options[j].load.js)) {
                // loop through lines
                for (var k = 0, n = scriptData.length; k < n; k++) {
                    bodyScripts += '\n    ' + scriptData[k];
                }
                bodyScripts += '\n';
            }
        }

        // populate variables
        bodyScripts = bodyScripts.replace(/_min\./g, '_min[' + i + '].');
        headScripts = headScripts.replace(/_min\./g, '_min[' + i + '].');
        while (styles.indexOf('_min.') != -1) {
            styles = styles.replace(styles.substring(styles.indexOf('_min.'), styles.indexOf(' ', styles.indexOf('_min.'))), JSON.parse(_min[i])[styles.substring(styles.indexOf('_min.') + 5, styles.indexOf(' ', styles.indexOf('_min.')))]);
        }
    }
    headScripts = '\n    var _min = [' + _min + '];' + headScripts;
}

/**
 * Inject scripts into body
 */
function injectBody() {
    if (bodyScripts.length > 0) {
        console.debug('injecting body JavaScript...');
        var bodies = document.getElementsByTagName('body');
        if (bodies.length > 0) {
            var scriptBlock = document.createElement('script');
                scriptBlock.appendChild(document.createTextNode(bodyScripts));
            bodies[0].appendChild(scriptBlock);
        }
    }
}

/**
 * Inject style and scripts into head
 */
function injectHead() {
    if (styles.length > 0 || headScripts.length > 0) {
        console.debug('injecting CSS...');
        var heads = document.getElementsByTagName('head');
        if (heads.length > 0) {
            if (styles.length > 0) {
                var styleBlock = document.createElement('style');
                    styleBlock.appendChild(document.createTextNode(styles));
                heads[0].appendChild(styleBlock);
            }
            if (headScripts.length > 0) {
                var scriptBlock = document.createElement('script');
                    scriptBlock.appendChild(document.createTextNode(headScripts));
                heads[0].appendChild(scriptBlock);
            }
        }
    }
}
