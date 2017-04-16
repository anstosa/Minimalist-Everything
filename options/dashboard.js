var modules,
    preferences;

/**
 * Initialize
 */
(function(){
    chrome.extension.sendMessage({name: 'getPreferences'}, function(response) {
        if (typeof response === 'undefined') {
            setTimeout(function() {
                window.location.reload();
            }, 1000);
        }

        preferences = response.preferences;
        buildDashboard(true, function() {
            var hash = window.location.hash.replace(/^#/,'');
            if (hash.indexOf('new') > -1) {
                // module creation request
                var options = getOptions(hash);
                window.location.hash = '';
                makeNewModule(options.title, options['new']);
            }
            // check for shortcut commands in url
            var option = getOptions();  // ?cmd=[option, edit]&index=[0, 1, ...]
            if (option['cmd'] && option['index'] >= 0) {
                $('#module-' + option['index'] + ' .module' + option['cmd']).click();
            }
        });
        $('#module-list').on('click', '#updateCoreModules', function() {
            chrome.extension.sendMessage({name: 'updateCoreModulesModule'}, function(response) {
                buildDashboard();
            });
        });

        // listen for module controls
        $('#module-list')
            .on('click', '.moduleOptions', function() {
                buildOptions($(this).parent().parent().attr('id').substr(7));
            })
            .on('click', '.moduleEdit', function() {
                buildEditor($(this).parent().parent().attr('id').substr(7));
            })
            .on('click', '.moduleToggle', function() {
                var module = $(this).parent().parent().attr('id').substr(7);
                if ($(this).find('span').text() === 'Disable') {
                    chrome.extension.sendMessage({name: 'disable', module: module}, function(response) {});
                    $('#module-' + module)
                        .addClass('disabled')
                        .find('.moduleToggle')
                            .removeClass('red')
                            .addClass('green')
                            .find('span')
                                .text('Enable')
                    ;
                } else {
                    chrome.extension.sendMessage({name: 'enable', module: module}, function(response) {});
                    $('#module-' + module)
                        .removeClass('disabled')
                        .find('.moduleToggle')
                            .addClass('red')
                            .removeClass('green')
                            .find('span')
                                .text('Disable')
                    ;
                }
                buildDashboard();
            })
            .on('click', '.moduleDelete', function() {
                $(this).addClass('hidden').next().removeClass('hidden').next().removeClass('hidden');
            })
            .on('click', '.moduleDeleteCancel', function() {
                $(this).addClass('hidden').next().addClass('hidden').end().prev().removeClass('hidden');
            })
            .on('click', '.moduleDeleteConfirm', function() {
                chrome.extension.sendMessage({
                    name: 'uninstallModule',
                    module: $(this).closest('li').attr('id').replace('module-','')
                }, function(response) {
                    buildDashboard();
                });
            })
        ;

        $(document.body)
            // listen for disabled buttons
            .on('click', '.disabled', function(event) {
                event.stopPropagation();
                event.preventDefault();
            })
            // listen for navigation links
            .on('click', '.nav', function() {
                navigate($(this).attr('href'));
            })
        ;

        $('#new-module').on('click', function() {
            makeNewModule();
        });

        addOptionsListeners();
        addEditorListeners();

        // check for special hashes
        if (window.location.hash.length > 0) {
            var hash = window.location.hash.substr(1);
            if (hash === 'update') {
                navigate('about');
            } else if (hash === 'data') {
                navigate('data');
            }
        }

        // populate version
        $('#version').text(localStorage.version);

        // populate update
        if (localStorage.hasUpdated) {
            // show notice
            $('#update-notice').removeClass('hidden');
            $('#update-dismiss').on('click', function() {
                $('#update-notice').addClass('hidden');
                delete localStorage.hasUpdated;
            });
        }
    });
})();

/**
 * Populates modules list on dashboard
 * @param {Boolean}  andSwitch optional, false if view should NOT switch to dashboard after build
 * @param {Function} callback  optional callback function
 */
function buildDashboard(andSwitch, callback) {
    modules = undefined;
    console.debug('Loading Dashboard...');

    chrome.extension.sendMessage({name: 'getAllModules'}, function(response) {
        modules = _.map(response.modules, module => new Module(module));

        var $moduleControls = $(
            '<div class="module-control">' +
                '<button href="#options" class="moduleOptions nav button group first subtle blue"><div class="icon-cog pull-left"></div>Options</button>' +
                '<button href="#edit" class="moduleEdit nav button group subtle green"><div class="icon-pencil pull-left"></div>Edit</button>' +
                '<button class="moduleToggle button group subtle red"><div class="icon-off pull-left"></div><span>Disable</span></button>' +
                '<button class="moduleDelete button group last subtle red"><div class="icon-trash pull-left"></div>Delete</button>' +
                '<button class="moduleDeleteCancel button group green hidden"><div class="icon-remove pull-left"></div>Cancel Delete</button>' +
                '<button class="moduleDeleteConfirm button group last red hidden"><div class="icon-ok pull-left"></div>Confirm Delete</button>' +
            '</div>'
        );
        var $moduleList = $('#module-list').empty();

        if (modules.length === 0) {
            if (localStorage.hasUpdated) {
                chrome.extension.sendMessage({name: 'updateCoreModulesModule'}, function(response) {
                    buildDashboard();
                });
            }
            $moduleList.html(
                '<h2>You have no modules installed...</h2>' +
                '<br>' +
                '<button id="updateCoreModules" class="button first group big blue">' +
                    '<div class="icon-plus-sign pull-left"></div>' +
                    'Install Core Modules' +
                '</button>' +
                '<a href="http://code.google.com/p/minimalist/wiki/Modules" class="button big last group red" target="_blank">' +
                    '<div class="icon-question-sign pull-left"></div>' +
                    'What is a Module?' +
                '</a>'
            );
        }

        // create module list
        for (var i = 0, l = modules.length; i < l; i++) {
            $('\
                <li id="module-' + i + '" class="' + modules[i].isEnabled + '">\
                    <h2>' + modules[i].name + '</h2>\
                    <h4>' + modules[i].includes + '</h4>\
                </li>\
            ')
                .append($moduleControls.clone())
                .appendTo($moduleList)
            ;
            if (!modules[i].isEnabled) {
                $('#module-' + i)
                    .addClass('disabled')
                    .find('.moduleToggle')
                        .removeClass('red')
                        .addClass('green')
                        .find('span')
                            .text('Enable')
                ;
            }
        }

        for (var i = 0, l = modules.length; i < l; i++) {
            if (modules[i].author === 'Ansel Santosa' &&
                modules[i].name.indexOf('Minimalist for') > -1
            ) {
                chrome.extension.sendMessage({
                    name: 'uninstallModule',
                    module: i
                }, function(response) {
                    buildDashboard();
                });
            }
        }

        if (typeof andSwitch === 'undefined' || andSwitch) {
            navigate('dashboard');
        }
        if (typeof callback === 'function') { callback(); }
    });
}

/**
 * Creates a new module and edits it
 * @param  {String} title optional starting title of module
 * @param  {String} host  optional starting include of module
 */
function makeNewModule(title, host) {
    var name = title || 'New Module',
        includes = host || '*minimalistsuite.com*';

    modules.push(new Module({
        name: name,
        author: 'Your Name',
        includes: includes,
        version: '1.0.0',
        isEnabled: true,
        options: [{
            description: 'New Option',
            isEnabled: true,
            tab: 'General',
            section: 'General',
            type: 'checkbox',
            fields: [],
            head: {},
            load: {}
        }]
    }));
    chrome.extension.sendMessage({name: 'save', modules: modules}, function(response) {});
    buildDashboard(false);
    buildEditor(modules.length - 1);
    navigate('edit');
}

/**
 * Navigates the user's view to the given page
 * @param  {String} tag Strips '#' and any characters after the first 3
 */
function navigate(tag) {
    // truncate readable tags
    tag = tag.toLowerCase().replace('#','');
    console.debug('Navigating to ' + tag + '...');
    $('nav a.current, .page.current').removeClass('current');
    $('#page-' + tag + ', #nav-' + tag).addClass('current');
}

/**
 * Parses options from query params
 * @param  {String} url to parse from
 * @return {Object}     options parsed from url
 */
var getOptions = function (url) {
    url = url || location.href;
    var option = {};
    url.replace(/^.*\?/, '').replace(/([^=&]*)=([^=&]*)&?/g, function (str, p1, p2) {
        if (option[p1]) {
            option[p1] = typeof option[p1] === 'string' ? [option[p1], p2] : option[p1].push(p2);
        } else {
            option[p1] = p2;
        }
    });
    return option;
};
