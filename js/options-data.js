/**
 * Import/Export for Minimalist
 *
 * © 2013 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

var exportTimer;
var tabId;

/* Initialize data tab*/
(function() {
    chrome.tabs.getCurrent(function(response) {
        tabId = response.id;
    });

    $('#repair').on('click', function() {
        $('#repair').html(
            '<div class="icon-spinner icon-spin pull-left"></div>' +
            'Repairing...'
        );
        chrome.extension.sendMessage({name: 'updateCoreModulesModule'}, function(response) {
            buildDashboard(false);
            setTimeout(function() {
                $('#repair').html(
                    '<div class="icon-ambulance pull-left"></div>' +
                    'Repairing Core Modules'
                );
                navigate('Dashboard');
            }, 750);
        });

    });

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
        setTimeout(function() {
            $('#reset').html(
                '<div class="icon-warning-sign pull-left"></div>' +
                'Nuke Settings'
            );
            buildDashboard();
        }, 2000);
    });

    $('#sync-upload').on('click', function() {
        $(this).find('span').text('Uploading...');
        chrome.extension.sendMessage({name: 'upload'}, function() {
            setTimeout(function() {
                $('#sync-upload span').text('Uploaded!');
                setTimeout(function() {
                    $('#sync-upload span').text('Upload Data');
                }, 2000);
            }, 750);
        });
    });

    $('#sync-download').on('click', function() {
        $(this).find('span').text('Downloading...');
        chrome.extension.onMessage.addListener(function(request) {
            if (request.action == 'onDownload') {
                if (request.response) {
                    setTimeout(function() {
                        $('#sync-download span').text('Downloaded!');
                        setTimeout(buildDashboard, 2000);
                    }, 750);
                } else {
                    setTimeout(function() {
                        $('#sync-download span').text('No Cloud Data!');
                    }, 750);
                }
                setTimeout(function() {
                    $('#sync-download span').text('Download Data');
                }, 2000);
            }
        });
        chrome.extension.sendMessage({
            name: 'download',
            tabId: tabId
        });
    });

    $('#export').on('click', function() {
        clearTimeout(exportTimer);
        $(this)
            .addClass('hidden')
            .siblings('#exportSome, #exportAll')
                .removeClass('hidden')
                .end()
        ;
        exportTimer = setTimeout(hideExportOptions, 10000);
    });

    $('#exportAll').on('click', function() {
        chrome.extension.sendMessage({name: 'getRawData'}, function(response) {
            $('#dataField').val(response.data);
            $('#import span').text('Import');
            hideExportOptions();
        });
    });

    $('#exportSelected').on('click', function() {
        chrome.extension.sendMessage({name: 'getGranularRawData'}, function(response) {
            var exportData = response;

            for (var i = exportData.modules.length - 1; i >= 0; i--) {
                if (!$('#export-' + i).is(':checked')) {
                    exportData.modules.splice(i,1);
                }
            }
            $('#dataField').val(JSON.stringify(exportData));
            $('#import span').text('Import');
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
        } else if (importData.substr(0,1) !== '{') {
            $('#import')
                .removeClass('green')
                .addClass('red')
                .find('span')
                    .text('Incompatible!')
            ;
            setTimeout(function() {
                $('#import')
                    .removeClass('red')
                    .addClass('green')
                    .find('span')
                        .text('Import')
                ;
            }, 2000);
        } else {
            chrome.extension.sendMessage({name: 'importRawData', data: importData}, function(response) {
                $('#import span').text('Success!');
                setTimeout(function() {
                    $('#import span').text('Import');
                    buildDashboard();
                }, 2000);
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

    $('#dataField').on('input propertychange', function() {
        if ($(this).val().length > 0) {
            $('#exportCopy').removeClass('hidden');
        } else {
            $('#exportCopy').addClass('hidden');
        }
    });
})();

/**
 * Hide all the export buttons except the parent
 */
function hideExportOptions() {
    $('#export')
        .removeClass('hidden')
        .siblings('#exportSome, #exportAll, #exportSelected')
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