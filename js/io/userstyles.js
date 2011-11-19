/**
 * UserStyles for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

function importStyle() {
	var module = {
		name: $('title').text().substr(0, $('title').text().indexOf(' -')).trim(),
		author: $('#miscellaneous-info tr:first-child a').text(),
		includes: getIncludes($('#stylish-code').text()),
		isEnabled: true,
		options: [
			{
				description: 'Imported Styles',
				isEnabled: true,
				tab: 'Imported',
				section: 'Imported',
				type: 'checkbox',
				head: {
					css: sanitizeCSS()
				},
				load: {}
			}
		]
	};
	chrome.extension.sendRequest({name: 'addModule', module: module}, function(response) {
		$('#minimalistInstall').text('Installed!');
	});
}

function getIncludes(code) {
	var includes = '',
		data = code.substr(code.indexOf('@-moz-document'));
		data = data.substr(0, data.indexOf('{')).split(',');
	for (var i = 0, l = data.length; i < l; i++) {
		var current = data[i];
		if (current.indexOf('prefix') != -1) {
			includes += current.slice(current.indexOf('(') + 1, current.indexOf(')')) + '*,';
		} else if (current.indexOf('domain') != -1) {
			includes += '*' + current.slice(current.indexOf('(') + 1, current.indexOf(')')) + '*,';
		} else {
			includes += current.slice(current.indexOf('(') + 1, current.indexOf(')')) + ',';
		}
	}
	return includes.replace(/["']/g,'').substr(0,includes.length - 1);
}

function sanitizeCSS() {
	var css = $('#stylish-code').text();
	while (css.indexOf('@-moz') != -1) {
		css = css.substring(0,css.indexOf('@-moz')) + css.substr(css.indexOf('{',css.indexOf('@-moz')) + 1);
	}
	return css.split('\n');
}

function disableInstall() {
	$('#minimalistInstall')
		.removeClass('blue')
		.text('Installed. Force update')
	;
}

function initMinimalist() {
	$('<div class="minimalist"><a href="javascript:;" id="minimalistInstall" onclick="toggleCode()" class="button big blue">Install with Minimalist</a></div>').appendTo($('#style-info'));
	$('#minimalistInstall').click(function() {
		$(this)
			.removeClass('blue')
			.addClass('disabled')
			.text('Installing...')
		;
		window.setTimeout(importStyle, 1000);
	});
}

$(document).ready(function() {
	initMinimalist();
	chrome.extension.sendRequest({name: 'checkForInstall', meta: {
		name: $('title').text().substr(0, $('title').text().indexOf(' -')).trim(),
		author: $('#miscellaneous-info tr:first-child a').text()
	}}, function(response) {
		if (response.isInstalled) {
			disableInstall();
		}
	});
});