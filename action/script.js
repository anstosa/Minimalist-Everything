let allModules;
let isEnabled = false;
let modules;
let title;
let url;

$('#open-dashboard').on('click', function() {
    openOptions('dashboard');
});
$('#toggle-minimalist').on('click', function() {
    toggle(-1);
});
$('body')
    .on('click', '.toggle-module', function() {
        toggle($(this).data('index'));
    })
    .on('click', '.anchor', function() {
        openPage($(this).attr('href'));
    })
;
$('#new-module').on('click', function() {
    openOptions('new');
});

chrome.extension.sendMessage({name: 'isEnabled'}, function(response) {
    isEnabled = response.isEnabled;
    $('#toggle-minimalist').removeClass('disabled');
    toggleButton(-1);
});

chrome.tabs.getSelected(null, function(tab) {
    url = tab.url;
    title = tab.title;
    chrome.extension.sendMessage({
        name: 'getTargetModulesOfURL',
        url: tab.url
    }, function(response) {
        modules = response.modules;
        chrome.extension.sendMessage({name: 'getAllModules'}, function(responseAll) {
            allModules = _.map(responseAll.modules, module => new Module(module));
            if (modules.length > 0) {
                $('#activeModules li').remove();
            } else if (url.indexOf('chrome://') != -1) {
                $('#activeModules li')
                    .html('<a href="http://code.google.com/chrome/extensions/faq.html#faq-dev-15" class="anchor">Can\'t modify "chrome://" pages</a>')
                    .parent()
                        .css('border-bottom-color', 'transparent;')
                        .end()
                    .siblings('a')
                        .remove()
                ;
            } else {
                $('#activeModules li').text('No modules for this page...');
            }

            for (let i = 0, l = modules.length; i < l; i++) {
                $('\
                    <li>\
                        <button class="toggle-module button subtle square" data-index="' + i + '" tip="Error: Could not get module state"><div class="icon-off"></div></button>\
                        <span>' + modules[i].name + '&nbsp;</span>\
                    </li>\
                ').appendTo($('#activeModules'));
                toggleButton(i);
            }

            $('li span').on('click', function(event) {
                let i = $(this).prev().data('index');
                if (event.ctrlKey) {
                    chrome.tabs.create({url: chrome.extension.getURL('/html/options.html?cmd=Options&index=' + getTrueIndex(i))});
                } else if (event.shiftKey) {
                    chrome.tabs.create({url: chrome.extension.getURL('/html/options.html?cmd=Edit&index=' + getTrueIndex(i))});
                }
            });
        });
    });
});

/**
 * Toggle's the visual and interactive state of the button for target module
 * @param  {int} target index of target module
 */
function toggleButton(target) {
    if (
        (target === -1 && isEnabled) ||
        (target !== -1 && modules[target].isEnabled)
    ) {
        $('.toggle-module[data-index="' + target + '"]')
            .removeClass('green')
            .addClass('red')
            .attr('tip', 'Disable module')
        ;
        if (target === -1) {
            $('#toggle-minimalist span').text('Disable');
        }
    } else {
        $('.toggle-module[data-index="' + target + '"]')
            .removeClass('red')
            .addClass('green')
            .attr('tip', 'Enable module')
        ;
        if (target === -1) {
            $('#toggle-minimalist span').text('Enable');
        }
    }
}

/**
 * Toggles the enabled state of target module
 * @param  {int} target index of target module
 */
function toggle(target) {
    chrome.extension.sendMessage({
        name: $('.toggle-module[data-index="' + target + '"]').hasClass('red') ? 'disable' : 'enable',
        module: getTrueIndex(target)
    });
    chrome.extension.sendMessage({
        name: 'getTargetModulesOfURL',
        url: url
    }, function(response) {
        modules = response.modules;
        toggleButton(target);
        if (isEnabled || target === -1) {
            chrome.extension.sendMessage({
                name: 'reload',
                module: getTrueIndex(target)
            });
        }
    });
}

/**
 * Gets the storage-side index of the module
 * @param  {int} target index of the module in the UI popup
 * @return {int}        index of the module in localStorage
 */
function getTrueIndex(target) {
    if (target !== -1) {
        for (let i = 0, l = allModules.length; i < l; i++) {
            if (
                allModules[i].name === modules[target].name &&
                allModules[i].author == modules[target].author
            ) {
                return i;
            }
        }
    }
    return -1;
}

/**
 * Open the options page to target deep-link
 * @param  {String} target deep link for options page
 */
function openOptions(target) {
    if (target === 'new') {
        chrome.tabs.create({url:chrome.extension.getURL('html/options.html#new=' + stripHost(url) + '&title=' + title)});
    } else if (target === 'find') {
        chrome.tabs.create({url:'http://wiki.minimalistsuite.com/modules'});
    } else {
        chrome.tabs.create({url:chrome.extension.getURL('html/options.html')});
    }
}

/**
 * Strips a url down to its hostname
 * @param  {String} url url to strip
 * @return {String}     hostname of url
 */
function stripHost(url) {
    return url.match(/:\/\/(www\.)?(.[^\/:]+)/)[2];
}

/**
 * Opens a new tab with the given URL
 * @param  {String} target url to open
 */
function openPage(target) {
    chrome.tabs.create({url:target});
}
