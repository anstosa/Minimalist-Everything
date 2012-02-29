/**
 * Import/Export for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

$('#sync').click(function() {
	if ($(this).text() == 'Disable Sync') {
		chrome.extension.sendRequest({name: 'disableSync'}, function(response) {});
		$(this)
			.removeClass('red')
			.addClass('green')
			.text('Enable Sync')
		;
	} else {
		chrome.extension.sendRequest({name: 'enableSync'}, function(response) {});
		$(this)
			.removeClass('green')
			.addClass('red')
			.text('Disable Sync')
		;
	}
});

$('#reset').click(function() {
	chrome.extension.sendRequest({name: 'reset'}, function(response) {
		window.close();
	});
});

/*$('#reinit').click(function() {
	chrome.extension.sendRequest({name: 'reinit'}, function(response) {});
});*/

var exportTimer;

$('#export').click(function() {
	clearTimeout(exportTimer);
	$(this)
		.addClass('hidden')
		.prev().removeClass('hidden')
		.prev().removeClass('hidden')
		.prev().removeClass('hidden')
	;
	$('#exportShare')
		.addClass('hidden')
		.text('Share via URL')
		.next().addClass('hidden')
	;
	exportTimer = window.setTimeout(hideExportOptions, 10000);
});
$('#exportAll').click(function() {
	chrome.extension.sendRequest({name: 'getRawData'}, function(response) {
		$('#dataField').val(response.data);
		$('#import').text('Import');
		$('#exportShare')
			.removeClass('hidden')
			.next().removeClass('hidden')
		;
		hideExportOptions();
	});
});
$('#exportSelected').click(function() {
	chrome.extension.sendRequest({name: 'getGranularRawData'}, function(response) {
		var modulesData = response.modules;
			exportData = response.version + '$$$';
			
		for (var i = modulesData.length - 1; i >= 0; i--) {
			if (!$('#export_' + i).is(':checked')) {
				modulesData.splice(i,1);
			} else {
				modulesData[i] = JSON.stringify(modulesData[i]);
			}
		}
		exportData += modulesData.join('|||');
		$('#dataField').val(exportData);
		$('#import').text('Import');
		$('#exportShare')
			.removeClass('hidden')
			.next().removeClass('hidden')
		;
		hideExportOptions();
	});
});
$('#exportSome').click(function() {
	buildExportList();
});
$('#import').click(function() {
	var importData = $('#dataField').val();
	if (importData.length < 1) {
		$('#import')
			.text('Nothing to Import!')
			.removeClass('green')
			.addClass('red')
		;
		window.setTimeout(function() {
			$('#import')
				.text('Import')
				.removeClass('red')
				.addClass('green')
			;	
		}, 2000);
	} else if (importData.indexOf('$$$') != -1) {
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
		chrome.extension.sendRequest({name: 'save', modules: modules}, function(response) {
			$('#import').text('Success!');
			buildDashboard(false);
		});
	} else {
		// check for alpha
		if (importData.indexOf('###') == -1) {
			importData = '0.1.3###true|||' + importData;
		}
		chrome.extension.sendRequest({name: 'setRawData', prefs: {isSyncing: importData.split('###')[1].split('|||')[0], isEnabled: importData.split('###')[1].split('|||')[1]}, moduleData: importData.split('###')[1].split('|||')[2]}, function(response) {
			if (response.wasSuccessful) {
				$('#import').text('Success!');
				buildDashboard(false);
			} else {
				$('#import')
					.text('Failed!')
					.removeClass('green')
					.addClass('red')
				;
			}
		});
	}
});

$('#exportShare').click(function() {
	$('#exportShare')
		.removeClass('green')
		.text('Encoding...')
		.next().removeClass('hidden')
	;
	// from goo.gl URL Shortener: https://chrome.google.com/webstore/detail/iblijlcdoidgdpfknkckljiocdbnlagk
	var	xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', 'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyCB9SUxPKlUCg2bmZ-eg5nGX8TTFNlQJh4', true);
		xmlhttp.setRequestHeader('Content-Type', 'application/json');
	
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4 && xmlhttp.status != 0) {
			clearTimeout(timer);

			var response = JSON.parse(xmlhttp.responseText);

			if(response.id == undefined) {
				$('#exportShare')
					.addClass('red')
					.text('Failed')
				;
			} else {
				$('#dataField').val(response.id);
				$('#exportShare')
					.addClass('hidden')
					.addClass('green')
					.removeClass('red')
					.text('Share via URL')
					.next().text('Copy URL')
				;
			}
		}
	}

	chrome.extension.sendRequest({name: 'getRawData'}, function(response) {
		var encodedUrl = 'http://minimalistsuite.com/import#' + encodeURIComponent(response.data);
		xmlhttp.send(JSON.stringify({'longUrl': encodedUrl}));
	});

	timer = setTimeout(function() {
		xmlhttp.abort();
		$('#exportShare')
			.addClass('red')
			.text('Failed')
		;
	}, 10000);
});

$('#exportCopy').click(function() {
	copyContents();
	$('#exportCopy')
		.text('Copied!')
		.addClass('disabled')
		.addClass('subtle')
	;
	window.setTimeout(function() {
		$('#exportCopy')
			.text('Copy Code')
			.removeClass('subtle')
			.removeClass('disabled')
			.addClass('hidden')
		;
	}, 2000);
});

$('#checkAll + label').toggle(function() {
	$(this)
		.html('<div class="input"></div>Uncheck All')
		.parent().siblings().children('input').prop('checked', true)
	;
}, function() {
	$(this)
		.html('<div class="input"></div>Check All')
		.parent().siblings().children('input').prop('checked', false)
	;
});

function initSync() {
	if (!prefs.isSyncing) {
		$('#sync')
			.removeClass('red')
			.addClass('green')
			.text('Enable Sync')
		;
	}
}

function hideExportOptions() {
	$('#export')
		.removeClass('hidden')
		.next().addClass('hidden')
		.end()
			.prev().addClass('hidden')
			.prev().addClass('hidden')
			.prev().addClass('hidden')
	;
}
function copyContents() {
	var targetField = document.io.dataField;
		targetField.focus();
		targetField.select();
		document.execCommand('Copy');
}

function buildExportList() {
	hideExportOptions();
	window.clearTimeout(exportTimer);
	$('#export')
		.addClass('hidden')
		.next().removeClass('hidden')
	;
	$('#exportList').removeClass('hidden');
	$('#exportList li:not(#checkAllWrap)').remove();
	for (var i = 0, l = modules.length; i < l; i++) {
		$('<li><input type="checkbox" id="export_' + i + '" /><label for="export_' + i + '"><div class="input"></div>' + modules[i].name + '</li>').appendTo($('#exportList'));
	}
}