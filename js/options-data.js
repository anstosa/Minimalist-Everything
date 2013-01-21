/**
 * Import/Export for Minimalist
 *
 * © 2013 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

var exportTimer;

/* Initialize data tab*/
(function() {
    $('#reset').on('click', function() {
        $('#reset-cancel, #reset-confirm')
            .removeClass('hidden')
            .siblings('#reset')
                .addClass('hidden')
        ;
    });

    $('#reset-cancel').on('click', function() {
        $('#reset-cancel, #reset-confirm')
            .addClass('hidden')
            .siblings('#reset')
                .removeClass('hidden')
        ;
    });

    $('#reset-confirm').on('click', function() {
        chrome.extension.sendMessage({name: 'reset'});
        $('#reset-cancel').click();
        $('#reset').html(
            '<div class="icon-spinner icon-spin pull-left"></div>' +
            'Reseting Data...'
        );
        setTimeout(buildDashboard,2000);
    });

    $('#export').on('click', function() {
        clearTimeout(exportTimer);
        $(this)
            .addClass('hidden')
            .siblings('#exportSome, #exportAll')
                .removeClass('hidden')
                .end()
            .siblings('#exportCopy')
                .addClass('hidden')
        ;
        exportTimer = setTimeout(hideExportOptions, 10000);
    });

    $('#exportAll').on('click', function() {
        chrome.extension.sendMessage({name: 'getRawData'}, function(response) {
            $('#dataField').val(response.data);
            $('#import span').text('Import');
            $('#exportCopy').removeClass('hidden');
            hideExportOptions();
        });
    });

    $('#exportSelected').on('click', function() {
        chrome.extension.sendMessage({name: 'getGranularRawData'}, function(response) {
            var modulesData = response.modules;
                exportData = response.version + '$$$';

            for (var i = modulesData.length - 1; i >= 0; i--) {
                if (!$('#export-' + i).is(':checked')) {
                    modulesData.splice(i,1);
                } else {
                    modulesData[i] = JSON.stringify(modulesData[i]);
                }
            }
            exportData += modulesData.join('|||');
            $('#dataField').val(exportData);
            $('#import span').text('Import');
            $('#exportCopy').removeClass('hidden');
            hideExportOptions();
        });
    });

    $('#exportSome').on('click', buildExportList);

    $('#import').on('click', function() {
        var importData = $('#dataField').val();
        if (importData.length < 1) {
            $('#import')
                .removeClass('green')
                .addClass('red')
                .find('span')
                    .text('Nothing to Import!')
            ;
            setTimeout(function() {
                $('#import')
                    .removeClass('red')
                    .addClass('green')
                    .find('span')
                        .text('Import')
                ;
            }, 2000);
        } else if (importData.indexOf('$$$') > -1) {
            var newModules = importData.split('$$$')[1].split('|||');

            for (var i = 0, l = newModules.length; i < l; i++) {
                newModules[i] = JSON.parse(newModules[i]);
                var hasFoundMatch = false;
                for (var j = 0, m = modules.length; j < m; j++) {
                    if (newModules[i].name == modules[j].name && newModules[i].author == modules[j].author) {
                        hasFoundMatch = true;
                        modules[j] = newModules[i];
                        break;
                    }
                }
                if (!hasFoundMatch) {
                    modules.push(newModules[i]);
                }
            }
            chrome.extension.sendMessage({name: 'save', modules: modules}, function(response) {
                $('#import span').text('Success!');
                buildDashboard(false);
            });
        } else {
            // check for alpha
            if (importData.indexOf('###') < 0) {
                importData = '0.1.3###true|||' + importData;
            }
            chrome.extension.sendMessage({name: 'setRawData', prefs: {isEnabled: importData.split('###')[1].split('|||')[0]}, moduleData: importData.split('###')[1].split('|||')[1]}, function(response) {
                if (response.wasSuccessful) {
                    $('#import').text('Success!');
                    buildDashboard(false);
                } else {
                    $('#import')
                        .removeClass('green')
                        .addClass('red')
                        .find('span')
                            .text('Failed!')
                    ;
                }
            });
        }
    });

    $('#exportCopy').on('click', function() {
        copyContents();
        $('#exportCopy')
            .addClass('disabled')
            .addClass('subtle')
            .find('span')
                .text('Copied!')
        ;
        setTimeout(function() {
            $('#exportCopy')
                .removeClass('subtle')
                .removeClass('disabled')
                .addClass('hidden')
                .find('span')
                    .text('Copy Code')
            ;
        }, 2000);
    });

    $('#checkAll + label').toggle(function() {
        $(this)
            .find('span')
                .text('Uncheck All')
                .end()
            .prev()
                .prop('checked', true)
                .end()
            .parent().siblings().children('input').prop('checked', true)
        ;
    }, function() {
        $(this)
            .find('span')
                .text('Check All')
                .end()
            .prev()
                .prop('checked', false)
                .end()
            .parent().siblings().children('input').prop('checked', false)
        ;
    });
})();

/**
 * Hide all the export buttons except the parent
 */
function hideExportOptions() {
    $('#export')
        .removeClass('hidden')
        .siblings('#exportSome, #exportAll, #exportSelected, #exportCopy')
            .addClass('hidden')
    ;
}

/**
 * Copy export into clipboard
 * @return {[type]} [description]
 */
function copyContents() {
    var targetField = document.io.dataField;
        targetField.focus();
        targetField.select();
        document.execCommand('Copy');
}

/**
 * Build list of modules to selectively export
 */
function buildExportList() {
    hideExportOptions();
    clearTimeout(exportTimer);
    $('#export')
        .addClass('hidden')
        .next()
            .removeClass('hidden')
    ;
    $('#exportList').removeClass('hidden');
    $('#exportList li:not(#checkAllWrap)').remove();
    for (var i = 0, l = modules.length; i < l; i++) {
        $('<li><input type="checkbox" id="export-' + i + '" /><label for="export-' + i + '"><div class="input">&#10003;</div>' + modules[i].name + '</li>').appendTo($('#exportList'));
    }
}