/**
 * Options page for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

var modules,
	prefs,
	last;

/* === NAVIGATION HANDLER === */
function addNavHandler() {
	last = 'das';
	$('.nav, nav li a:not(.noNav)').live('click', function() {
		navigate($(this).attr('href').substr(1));
	});
	var hash = window.location.hash.substr(1);
	if (hash === 'update') {
		$('#n_abo, #p_abo').addClass('current');
		last = 'abo';
	} else if (hash === 's_syn') {
		$('#n_syn, #p_syn').addClass('current');
		$('#m_welcome').removeClass('current');
		$('#m_import').removeClass('current');
		last = 'syn';
	} else if (hash == null || hash === '' || hash === 'opt' || hash === 'edi' || hash.indexOf('new') != -1) {
		$('#n_das, #p_das').addClass('current');
	} else {
		$('#n_' + hash + ', #p_' + hash).addClass('current');			
		last = hash;
	}

	if (hash.indexOf('new') != -1) {
		var host = null;
			title = null;
		if (hash.indexOf('new=') != -1) {
			host = hash.substr(hash.indexOf('new=') + 4, hash.indexOf('&title=') - hash.indexOf('new=') - 4);
		}
		if (hash.indexOf('&title') != -1) {
			title = hash.substr(hash.indexOf('&title=') + 7, 30);
		}
		window.location.hash = '';
		makeNewModule(host, title);
		
	}
}
function navigate(tag) {
	$('#p_' + last + ', #n_' + last).removeClass('current');
	$('#p_' + tag + ', #n_' + tag).addClass('current');
	last = tag;
}
/* === END NAVIGATION HANDLER === */

/*$('.default').live('focus', function() {
	$(this)
		.removeClass('default')
		.val('')
	;
});

$('[default]').live('blur', function() {
	var currentText = $(this).val(),
		defaultText = $(this).attr('default');

	if (currentText.length < 1 || currentText == defaultText) {
		$(this)
			.val(defaultText)
			.addClass('default')
		;
	}
});*/

function debug(message) {
	if (prefs.isDebugging == 'true') {
		console.log('Minimalist: ' + message);
	}
}

window.onload = function() {
	buildDashboard(true);
	initSyntax();
};
$(function() {
	$('[tip]:not(input)').tipsy({live: true, fade: true, gravity: 'n'});
	$('.w[tip]:not(input)').tipsy({live: true, fade: true, gravity: 'w'});
	$('.s[tip]:not(input)').tipsy({live: true, fade: true, gravity: 's'});
	$('input[tip]').tipsy({live: true, trigger: 'focus', gravity: 'w'});
	$('input.s[tip]').tipsy({live: true, trigger: 'focus', gravity: 's'});
});