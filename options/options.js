/**
 * Build options page
 * @param  {Int} i index of module to load options for
 */
function buildOptions(moduleIndex) {
    console.debug('Loading options page for ' + modules[moduleIndex].name + '...');
    var options = modules[moduleIndex].options,
        tabs = {};

    // set name
    $('#page-options h1').text(modules[moduleIndex].name).attr('id', 'module-' + moduleIndex);

    // clear existing content
    $('#options-nav ~ .tab, #options-nav li').remove();

    // loop through options
    for (var i = 0, l = options.length; i < l; i++) {
        var option = options[i];

        // create input element
        var $input = $('<input id="option-' + i + '" type="' + option.type + '">').prop('checked', option.isEnabled),
            $label = $('<label for="option-' + i + '"><div class="input">&#10003;</div>' + option.description + '</label>');

        // check if option belongs to tab
        var optionTab = option.tab;
        // create tab if it doesn't exist
        if (!tabs.hasOwnProperty(optionTab)) {
            tabs[optionTab] = {};
        }

        // check if option belongs to section
        var optionSection = option.section;
        // create section if it doesn't exist
        if (!tabs[optionTab].hasOwnProperty(optionSection)) {
            tabs[optionTab][optionSection] = [];
        }

        // add option to section or tab
        tabs[optionTab][optionSection].push($input, $label);

        // check if option has fields
        if (option.fields && option.fields.length > 0) {
            var $fields = $('<div></div>');
            // loop through fields
            for (var j = 0, m = option.fields.length; j < m; j++) {
                // build field
                var classes = option.fields[j].isColor ? 'color' : '',
                    value = option.fields[j].val || '';
                $fields.append($(
                    '<div class="option-' + i + ' field-row">' +
                        '<label>' + option.fields[j].description + ': </label>' +
                        '<input type="text" class="' + classes + '" value="' + value + '">' +
                    '</div>'
                ));
            }
            // add field to option
            tabs[optionTab][optionSection].push($fields);
        }
    }

    // clear existing tab
    $('#options-nav > li:first-child').remove();
    // loop through tabs
    for (var tab in tabs) {
        // create tab and tab wrappers
        $('<li href="#options-tab-' + tab.replace(' ','').toLowerCase() + '">' + tab + '</li>').appendTo($('#options-nav'));
        var $tab = $('<div id="options-tab-' + tab.split(' ').join('').toLowerCase() + '" class="tab"></div>');
        var $tabContent = $('<div class="table"></div>');

        // loop through sections
        for (var section in tabs[tab]) {
            // create section
            var $section = $(
                '<section>' +
                    '<h3>' + section + '</h3>' +
                '</section>'
            );
            // create options wrapper
            var $options = $('<div></div>');
            // loop through options
            for (var i = 0, l = tabs[tab][section].length; i < l; i++) {
                $options.append(tabs[tab][section][i]);
            }
            $options.appendTo($section);
            $section.appendTo($tabContent);
        }
        $tabContent.appendTo($tab);
        $('#options-wrapper').append($tab);
    }

    // create about tab
    $('<li href="#options-tab-about">About</li>').appendTo($('#options-nav'));
    var $tabAbout = $('<div id="options-tab-about" class="tab"></div>');

    // check if module has about page
    if (modules[moduleIndex].hasOwnProperty('about')) {
        var content = modules[moduleIndex].about[0];
        for (var i = 1, l = modules[moduleIndex].about.length; i < l; i++) {
            content += '\n' + modules[moduleIndex].about[i];
        }
        $tabAbout.html(content);
    } else {
        $tabAbout.text('No about page...');
    }

    $tabAbout.appendTo($('#options-wrapper'));

    // Select first tab
    $('#options-nav li:first-child, #options-nav + .tab').addClass('current');

    // Initialize color fields
    $('.color').colorPicker({
        dir: '../img/libs/',
        format: 'rgba',
        preview: true,
        userinput: true,
        validate: true,
        color: null
    });

    // reset Save Changes button
    $('#save-options')
        .addClass('disabled')
        .find('span')
            .text('Save Changes')
    ;
}

/**
 * Adds event listeners for options page
 */
function addOptionsListeners() {
    console.debug('Adding options listeners...');
    $('#save-options').on('click', saveOptions);
    addSaveHotkey();

    // listen for options tab navigation
    $('#options-nav').on('click', 'li', function() {
        // select current tab
        $('#options-nav .current').removeClass('current');
        $(this).addClass('current');

        // show current content
        $('.tab.current').removeClass('current');
        $($(this).attr('href')).addClass('current');
    });

    // listen for options changes
    $('#page-options')
        .on('change', 'input', activatesaveOptionsButton)
        .on('focusout', '.color', activatesaveOptionsButton)
        .on('keypress', '.field', activatesaveOptionsButton)
    ;
}

/**
 * Sets Save Changes button to active state
 */
function activatesaveOptionsButton() {
    $('#save-options')
        .removeClass('disabled')
        .find('span')
            .text('Save Changes')
    ;
}

/**
 * Saves current options
 */
function saveOptions() {
    var moduleIndex = $('#page-options h1').attr('id').replace('module-',''),
        options = modules[moduleIndex].options;

    // loop through options
    for (var i = 0, l = options.length; i < l; i++) {
        modules[moduleIndex].options[i].isEnabled = $('#option-' + i).is(':checked');

        // loop through fields
        for (var j = 0, m = $('.option-' + i + '.field-row').length; j < m; j++) {
            modules[moduleIndex].options[i].fields[j].val = $('.option-' + i + '.field-row:nth-child(' + (j + 1) + ') input').val();
        }
    }
    // send updated module
    chrome.extension.sendMessage({name: 'save', modules: modules}, function() {
        // inform user and reload relevant pages
        $('#save-options')
            .addClass('disabled')
            .find('span')
                .text('Changes Saved!')
        ;
        chrome.extension.sendMessage({name: 'reload', module: moduleIndex});
    });
}
