
/**
 * Module editor for Minimalist
 *
 * © 2013 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

var editorCss,
    editorJs,
    editorAbout;

/**
 * Build module editor
 * @param {Int}      i        index of module to edit
 * @param {Function} callback optional callback function
 */
function buildEditor(moduleIndex, callback) {
    var options = modules[moduleIndex].options,
        tree = {};

    // set name
    $('#page-edit h1').attr('id', 'module-' + moduleIndex).text(modules[moduleIndex].name);

    // reset tree
    $('#options-tree').html('<li id="metadata">Module Metadata<li>');

    // populate metadata
    $('#moduleName').val(modules[moduleIndex].name);
    $('#moduleAuthor').val(modules[moduleIndex].author);
    $('#moduleIncludes').val(modules[moduleIndex].includes);
    $('#moduleVersion').val(modules[moduleIndex].version || '');

    // loop through options
    for (var j = 0, l = options.length; j < l; j++) {
        var option = options[j],
            $option = $(
                '<li id="edit-option-' + j + '" class="edit-option">' +
                    '<span>' + option.description + '</span>' +
                '</li>'
            );

        // make sure tab exists
        var optionTab = options[j].tab;
        if (!tree.hasOwnProperty(optionTab)) {
            tree[optionTab] = {};
        }

        // make sure section exists
        var optionSection = options[j].section;
        if (!tree[optionTab].hasOwnProperty(optionSection)) {
            tree[optionTab][optionSection] = [];
        }

        // add bud to tree
        tree[optionTab][optionSection].push($option);
    }

    // loop through tabs
    for (var tab in tree) {
        var $tab = $(
                '<li class="collapsed">' +
                    '<span class="edit-tab"> ' + tab + '</span>' +
                '</li>'
            ),
            $sections = $('<ul></ul>');

        // loop through sections
        for (var section in tree[tab]) {
            var $section = $(
                    '<li class="collapsed">' +
                        '<span class="edit-section"> ' + section + '</span>' +
                    '</li>'
                ),
                $options = $('<ul></ul>');

            // loop through options
            for (j = 0, l = tree[tab][section].length; j < l; j++) {
                $options.append(tree[tab][section][j]);
            }
            $options.appendTo($section);
            $section.appendTo($sections);
        }
        $sections.appendTo($tab);
        $tab.appendTo('#options-tree');
    }

    // add option creator
    $(
        '<li>' +
            '<button id="option-new" class="button blue"><div class="icon-plus-sign pull-left"></div>Add Option</button>' +
        '</li>'
    ).appendTo($('#options-tree'));

    // view metadata by default
    $('#metadata').addClass('current');
    $('#meta-module').removeClass('hidden');
    $('#meta-option, #editors').addClass('hidden');

    editorAbout = editorAbout || CodeMirror.fromTextArea($('#editor-about')[0], {
        mode: 'html',
        indentUnit: 4
    });

    editorCss = editorCss || CodeMirror.fromTextArea($('#editor-css')[0], {
        mode: 'css',
        indentUnit: 4,
        lineNumbers: true
    });

    editorJs = editorJs || CodeMirror.fromTextArea($('#editor-js')[0], {
        mode: 'javascript',
        indentUnit: 4,
        lineNumbers: true
    });

    // populate about field
    if (modules[moduleIndex].hasOwnProperty('about')) {
        var content = modules[moduleIndex].about[0];
        for (j = 1, l = modules[moduleIndex].about.length; j < l; j++) {
            content += '\n' + modules[moduleIndex].about[j];
        }
        editorAbout.setValue(content);
    }


    editorAbout.on('change', activateEditSaveButton);
    editorCss.on('change', activateEditSaveButton);
    editorJs.on('change', activateEditSaveButton);

    if (typeof callback === 'function') { callback(); }
}

/**
 * Create new option
 */
function makeNewOption() {
    var moduleIndex = $('#page-edit h1').attr('id').replace('module-',''),
        option = {
            description: 'New Option',
            isEnabled: true,
            tab: 'General',
            section: 'General',
            type: 'checkbox',
            fields: [],
            head: {},
            load: {}
        };
        modules[moduleIndex].options.push(option);
    chrome.extension.sendMessage({name: 'save', modules: modules}, function() {
        buildEditor(moduleIndex);
        editOption(modules[moduleIndex].options.length - 1);
    });
}

/**
 * Delete option from module
 * @param  {Int} optionIndex index of option to be deleted
 */
function deleteOption(optionIndex) {
    var moduleIndex = $('#page-edit h1').attr('id').replace('module-','');
    modules[moduleIndex].options.splice(optionIndex, 1);

    chrome.extension.sendMessage({name: 'save', modules: modules}, function() {
        buildEditor($('#page-edit h1').attr('id').replace('module-',''));
    });
}

/**
 * Add event listeners to editor
 */
function addEditorListeners() {
    console.debug('Adding editor listeners...');

    // reset save button
    $('#save-edits').addClass('disabled').text('Save Changes');

    $('#optionAdvanced').on('click', function() {
        $('#meta-option .editor-row.hidden').removeClass('hidden');
        $(this).parent().parent().addClass('hidden');
    });

    $('#options-tree')
        .on('click', '#metadata', function(){
            $('#options-tree .current').removeClass('current');
            $(this).addClass('current');

            $('#meta-module').removeClass('hidden');
            $('#meta-option, #editors').addClass('hidden');
        })
        .on('click', '#option-new', makeNewOption)
        // toggle tree
        .on('click', '.edit-tab, .edit-section', function() {
            var $self = $(this);
            if ($self.parent().hasClass('collapsed')) {
                $self.parent()
                    .animate({
                        height: $self.parent().attr('min_height')
                    }, 150, function() {
                        $(this)
                            .removeClass('collapsed')
                            .attr('style','')
                        ;
                    })
                ;
            } else {
                $self
                    .parent()
                        .attr('min_height', $self.parent().height())
                        .animate({
                            height: 16
                        }, 150)
                        .addClass('collapsed')
                ;
            }
        })
        // navigate to option
        .on('click', '.edit-option', function() {
            editOption($(this).attr('id').replace('edit-option-',''));
        })
    ;

    $('#option-delete').on('click', function() {
        $(this)
            .addClass('hidden')
            .siblings()
                .removeClass('hidden')
        ;
    });
    $('#option-delete-cancel').on('click', function() {
        $(this)
            .add('#option-delete-confirm')
            .addClass('hidden')
            .siblings('#option-delete')
                .removeClass('hidden')
        ;
    });
    $('#option-delete-confirm').on('click', function() {
        deleteOption($('#options-tree .current').attr('id').replace('edit-option-',''));
    });

    // listen for content changes
    $('#meta-module input, #meta-option input').on('keypress', activateEditSaveButton);
    $('#meta-module input, #meta-option input').on('keydown', checkForChange);
    $('#meta-option input[type="checkbox"]').on('change', activateEditSaveButton);

    $('#save-edits').click(function(event) {
        saveEdits(event.shiftKey);
    });

    $('#deleteScreen').on('click', function() {
        $('#optionPreview').removeAttr('src');
        $('#uploadScreenButton').removeClass('group last');
        activateEditSaveButton();
    });

    $('#page-edit')
        // init color picker
        .on('click', '.isColor', function() {
            if ($(this).is(':checked')) {
                $(this).prev().colorPicker({
                    dir: '../../img/libs/',
                    format: 'rgba',
                    preview: true,
                    userinput: true,
                    validate: true,
                    color: null
                });
            } else {
                $(this).prev().colorPicker('destroy');
            }
        })
        .on('click', '#newField', function() {
            var count = $(this).siblings('.field-row').length + 1;
            $(this).before($(
                '<div class="field-row" count="' + count + '">' +
                    '<input type="text" class="s desc normal" size="20" tip="field description">' +
                    '<input type="text" class="s var normal" size="10" tip="var name">' +
                    '<input type="text" class="s def normal" size="10" tip="default value">' +
                    '<input class="isColor" id="isColor_' + count + '" type="checkbox">' +
                    '<label for="isColor_' + count + '" tip="whether this field should have a color picker attached to it."><div class="input"></div>Color Picker</label>' +
                    '<button class="removeField button red subtle">' +
                        '<div class="icon-trash"></div>' +
                    '</button>' +
                '</div>'
            ));
        })
        .on('click', '.removeField', function() {
            $(this).parent().remove();
            activateEditSaveButton();
        })
    ;

    addSaveHotkey();
}

/**
 * edit given option in current module
 * @param  {Int} optionIndex index of option to edit
 */
function editOption(optionIndex) {
    var module = modules[$('#page-edit h1').attr('id').replace('module-','')],
        option = module.options[optionIndex];

    if ($('#metadata').hasClass('current')) {
        $('#meta-option, #editors').removeClass('hidden');
        $('#meta-module').addClass('hidden');
    }
    $('#options-tree .current').removeClass('current');

    $('#option-delete-cancel').click();

    // select and reveal option
    $('#edit-option-' + optionIndex)
        .addClass('current')
        .parents('.collapsed')
            .removeClass('collapsed')
    ;

    $('#meta-option .editor-row.hidden')
        .removeClass('hidden')
        .siblings('.advanced')
            .addClass('hidden')
        .parent()
            .find('#editor-fields')
                .html(
                    '<button id="newField" class="button blue subtle">' +
                        '<div class="icon-plus-sign pull-left"></div>' +
                        'Add new Field' +
                    '</button>'
                )
    ;

    if (option.fields && option.fields.length > 0) {
        for (var i = 0, l = option.fields.length; i < l; i++) {
            var isColor = option.fields[i].isColor ? 'checked ' : '';
            $('#newField').before($(
                '<div class="field-row" count="' + i + '">' +
                    '<input type="text" class="s field-description normal" size="20" value="' + option.fields[i].description + '" tip="field description">' +
                    '<input type="text" class="s field-variable normal" size="10" value="' + option.fields[i].name + '" tip="var name">' +
                    '<input type="text" class="s field-default normal" size="10" value="' + option.fields[i].val + '" tip="default value">' +
                    '<input class="isColor" id="isColor_' + i + '" ' + isColor + 'type="checkbox">' +
                    '<label for="isColor_' + i + '" tip="whether this field should have a color picker attached to it.">' +
                        '<div class="input">&#10003;</div>' +
                        'Color Picker' +
                    '</label>' +
                    '<button class="removeField button red subtle">' +
                        '<div class="icon-trash"></div>' +
                    '</button>' +
                '</div>'
            ));
        }
    }

    if (option.tab.length < 1 || option.tab == 'New Tab') {
        $('#meta-option .editor-row:nth-child(3)').removeClass('hidden');
    }
    if (option.section.length < 1 || option.section == 'New Section') {
        $('#meta-option .editor-row:nth-child(4)').removeClass('hidden');
    }

    $('#optionState').prop('checked', option.isEnabled);
    $('#optionDescription').val(option.description);
    $('#optionTab').val(option.tab);
    $('#optionSection').val(option.section);

    if (option.screen) {
        $('#optionPreview').attr('src', option.screen);
        $('#uploadScreenButton').addClass('group last');
    } else {
        $('#optionPreview').removeAttr('src');
        $('#uploadScreenButton').removeClass('group last');
    }

    editorCss.setValue('');
    if (option.head && option.head.css) {
        var content = option.head.css[0];
        for (var i = 1, l = option.head.css.length; i < l; i++) {
            content += '\n' + option.head.css[i];
        }
        editorCss.setValue(content);
    }

    editorJs.setValue('');
    if (option.head && option.head.js) {
        var content = option.head.js[0];
        for (var i = 1, l = option.head.js.length; i < l; i++) {
            content += '\n' + option.head.js[i];
        }
        editorJs.setValue(content);
    }

    disableEditSaveButton();

    $('.isColor:checked').prev().colorPicker({
        dir: '../../img/libs/',
        format: 'rgba',
        preview: true,
        userinput: true,
        validate: true,
        color: null
    });
    window.location = '#';
}

/**
 * Listen for [ Ctrl ] + [ S ]
 */
function addSaveHotkey() {
    $(window).keydown(function(event) {
        if ((event.which == 83 && event.ctrlKey) || (event.which == 19)) {
            event.preventDefault();
            if ($('#page-edit').hasClass('current') && !$('#save-edits').hasClass('disabled')) {
                saveEdits(event.shiftKey);
            } else if ($('#page-options').hasClass('current') && !$('#save-options').hasClass('disabled')) {
                saveOptions();
            }
            return false;
        }
    });
}

/**
 * Check for change
 */
function checkForChange() {
    if (event.which == 8) {
        activateEditSaveButton();
    }
}

/**
 * Enable the Save Changes button
 */
function activateEditSaveButton() {
    $('#save-edits')
        .removeClass('disabled')
        .find('span')
            .text('Save Changes')
    ;
}

/**
 * Disable the Save Changes button
 * @return {[type]} [description]
 */
function disableEditSaveButton() {
    $('#save-edits')
        .addClass('disabled')
        .find('span')
            .text('Save Changes')
    ;
}

/**
 * Save current edits
 * @param {Boolean} andSuppressReload optional, false if relevant tabs should NOT reload after save
 */
function saveEdits(andSuppressReload) {
    if (!$('#save-edits').hasClass('disabled')) {

        var moduleIndex = $('#page-edit h1').attr('id').replace('module-',''),
            optionIndex;

        if ($('#metadata').hasClass('current')) {
            isOption = false;
            modules[moduleIndex].name = $('#moduleName').val();
            modules[moduleIndex].author = $('#moduleAuthor').val();
            modules[moduleIndex].includes = $('#moduleIncludes').val().split(' ').join('');
            modules[moduleIndex].version = $('#moduleVersion').val();

            var editsAbout = editorAbout.getValue();
            if (editsAbout.length > 0) {
                modules[moduleIndex].about = editsAbout.split('\n');
            } else if(modules[moduleIndex].hasOwnProperty('about')) {
                delete modules[moduleIndex].about;
            }
        } else {
            var optionIndex = $('#options-tree .current').attr('id').replace('edit-option-',''),
                option = modules[moduleIndex].options[optionIndex],
                css = editorCss.getValue(),
                jsHead = editorJs.getValue();

            if (css.length > 0) {
                option.head.css = css.split('\n');
            } else if (option.head && option.head.css) {
                delete option.head.css;
            }
            if (jsHead.length > 0) {
                option.head.js = jsHead.split('\n');
            } else if (option.head && option.head.js) {
                delete option.head.js;
            }

            option.isEnabled = $('#optionState').is(':checked');
            option.description = $('#optionDescription').val();
            option.tab = $('#optionTab').val();
            option.section = $('#optionSection').val();
            option.fields = [];
            // loop through fields
            for (var i = 0, l = $('#page-edit .field-row').length; i < l; i++) {
                var oldVal = null;
                option.fields[i] = {
                    description: $('.field-row:nth-child(' + (i + 1) + ') .field-description').val(),
                    name: $('.field-row:nth-child(' + (i + 1) + ') .field-variable').val(),
                    val: $('.field-row:nth-child(' + (i + 1) + ') .field-default').val(),
                    isColor: $('.field-row:nth-child(' + (i + 1) + ') .isColor').is(':checked')
                };
            }

            if ($('#optionPreview').attr('src') !== undefined) {
                option.screen = $('#optionPreview').attr('src');
            } else {
                delete option.screen;
            }
            modules[moduleIndex].options[optionIndex] = option;
        }

        chrome.extension.sendMessage({name: 'save', modules: modules});
        if (typeof andSuppressReload === 'undefined' || !andSuppressReload) {
            chrome.extension.sendMessage({name: 'reload', module: moduleIndex});
        }

        buildEditor($('#page-edit h1').attr('id').replace('module-',''), function() {
            if (optionIndex) {
                editOption(optionIndex);
            }
        });
        buildDashboard(false);

        $('#save-edits')
            .addClass('disabled')
            .find('sapn')
                .text('Changes Saved!')
        ;
    }
}
