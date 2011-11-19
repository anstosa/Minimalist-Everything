/**
 * UserScripts for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

function importScript() {
	if (window.location.hash != null && window.location.hash != '#install') {
		window.location.hash = 'install';
		window.location.href = window.location.href.replace('show','review');
	} else {
		var module = {
			name: $('h2').text(),
			author: $('.author a').text(),
			includes: '*',
			isEnabled: true,
			options: [
				{
					description: 'Imported Script',
					isEnabled: true,
					tab: 'Imported',
					section: 'Imported',
					type: 'checkbox',
					head: {
						js: getJS()
					},
					load: {}
				}
			]
		}
		chrome.extension.sendRequest({name: 'addModule', module: module}, function(response) {
			window.location.hash = 'installed';
			window.location.href = window.location.href.replace('review','show');		
		});
	}
}

function getJS() {
	return $('#source').text().split('\n');
}

function disableInstall() {
	$('#minimalistInstall')
		.removeClass('blue')
		.text('Installed. Force update')
	;
}

function initMinimalist() {
	$('<a href="javascript:;" id="minimalistInstall" class="button big blue">Install with Minimalist</a>').appendTo($('#install_script'));
	$('#minimalistInstall').click(function() {
		importScript();
		$(this)
			.removeClass('blue')
			.addClass('disabled')
			.text('Installing...')
		;
	});
}

$(document).ready(function() {
	initMinimalist();
	if (window.location.hash != null && window.location.hash == '#installed') {
		$('#minimalistInstall')
			.text('Installed!')
		;
	} else if (window.location.hash != null && window.location.hash == '#install') {
		importScript();
	} else {
		chrome.extension.sendRequest({name: 'checkForInstall', meta: {
			name: $('h2').text(),
			author: $('.author a').text()
		}}, function(response) {
			if (response.isInstalled) {
				disableInstall();
			}
		});
	}
});