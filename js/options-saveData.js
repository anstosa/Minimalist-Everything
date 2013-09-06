/**
 * Options page for Minimalist
 *
 * © 2013 Ansel Santosa
 * Licensed under GNU GPL v3
 *
 * Option to save the file data made by Thiago Talma (www.thiagomt.com)
 *
 **/
 
var saveButton,
    loadButton, 
    configFile, 
    dataToSave;

/* Initializing the option to save the data file */
(function(){
    saveButton = document.querySelector('#config-save');
    loadButton = document.querySelector('#config-load');
    configFile = document.querySelector('#config-file');
    
    saveButton.draggable = true;

    saveButton.addEventListener('mousedown', function(e) {
        chrome.extension.sendMessage({name: 'getRawData'}, function(response) {
            dataToSave = response.data;
            prepareFile();
        });
    }, false);

    loadButton.addEventListener('click', function(e) {
        configFile.click();
    }, false);

    configFile.addEventListener('change',function(e) {
        if (!this.value)
            return false;
        
        var files = this.files;
        if (files)
            for (var i = 0, f; f = files[i]; i++) {
                loadFile(f);
            }
        this.value = '';
    }, false);

    saveButton.addEventListener('dragstart', function(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('DownloadURL', e.target.dataset.downloadurl);
    }, false);

    window.addEventListener('drop',function (e) {
        if (currentPage == 'data')
        {
            e.stopPropagation(); 
            e.preventDefault();
            if (currentPage == 'data' && e.dataTransfer.files.length > 0 && confirm('Your settings will be overwritten! Confirms loading the file?'))
            {
                var files = e.dataTransfer.files;
                for (var i = 0, f; f = files[i]; i++) {
                    loadFile(f);
                }  
            }
            e.returnValue = false;
            return false;
        }
    }, false);

    window.addEventListener('dragover', function (e) {
        if (currentPage == 'data')
        {
            e.stopPropagation(); 
            e.preventDefault();
            e.dataTransfer.dropEffect  = 'move';
            e.returnValue  = false;
            return false;
        }
    }, false);
    
})();

/**
 * Preparation of the file to download.
 */
var prepareFile = function() {
    debug('Preparing data file...');    
    
    window.URL = window.webkitURL || window.URL;
    
    if (saveButton.href) {
        window.URL.revokeObjectURL(saveButton.href);
    }
    
    var bb = new Blob([dataToSave], {type: 'text/plain'});
    
    var d = new Date();
    var curr_date = ("0" + d.getDate()).slice(-2);
    var curr_month = ("0" + d.getMonth()).slice(-2);
    var curr_year = d.getFullYear();
    
    saveButton.download = 'minimalist-'+curr_year+curr_month+curr_date+'.txt';  
    saveButton.href = window.URL.createObjectURL(bb);
    saveButton.dataset.downloadurl = ['text/plain', saveButton.download, saveButton.href].join(':');
};

/**
 * Loading the file sent by the user.
 */
var loadFile =  function(dataFile) {
    var oFReader = new FileReader();

    oFReader.onloadend = function (e) {
        if (!this.error) {
            importData = this.result;
            if (importData.length < 1) {
                $('#config-load')
                    .removeClass('green')
                    .addClass('red')
                    .find('span')
                        .text('Nothing to Load!')
                ;
                setTimeout(function() {
                    $('#config-load')
                        .removeClass('red')
                        .addClass('green')
                        .find('span')
                            .text('Load File')
                    ;
                }, 2000);
            } else if (importData.substr(0,1) !== '{') {
                $('#config-load')
                    .removeClass('green')
                    .addClass('red')
                    .find('span')
                        .text('Incompatible!')
                ;
                setTimeout(function() {
                    $('#config-load')
                        .removeClass('red')
                        .addClass('green')
                        .find('span')
                            .text('Load File')
                    ;
                }, 2000);
            } else {
                chrome.extension.sendMessage({name: 'importRawData', data: importData}, function(response) {
                    $('#config-load span').text('Success!');
                    setTimeout(function() {
                        $('#config-load span').text('Load File');
                        buildDashboard();
                    }, 2000);
                });
            }
        }
    };

    oFReader.readAsText(dataFile);
};