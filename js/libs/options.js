/**
 * Module Options for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

var hasOptionsChanged = false,
	hasOptionsLoaded = false;

function buildOptions(i) {
	var options = modules[i].options;
	var tabs = {};
	
	$('#p_opt h1').text(modules[i].name).attr('id', 'module_' + i);
	$('#optionNav ~ .tab, #optionNav li').remove();
	for (var j = 0, l = options.length; j < l; j++) {
		var option = options[j];

		var $input = $('<input id="option_' + j + '" type="' + option.type + '" />');
		if (option.isEnabled) {
			$input.prop('checked', true);
		}
		/*if (option.type === 'radio') {
			$input.attr(name) = option.radio;
		}*/

		var $label = $('<label for="option_' + j + '"><div class="input"></div>' + option.description + '</label>');
		if (option.screen != null) {
			$label.attr('screen', option.screen);
		}

		var tab = options[j].tab;
		if (!tabs.hasOwnProperty(tab)) {
			tabs[tab] = {};
		}
		var section = options[j].section;
		if (!tabs[tab].hasOwnProperty(section)) {
			tabs[tab][section] = new Array();
		}
		tabs[tab][section].push($input, $label);
		if (option.fields != null && option.fields.length > 0) {
			var $fields = $('<div></div>');
			for (var k = 0, m = option.fields.length; k < m; k++) {
				var isColor = option.fields[k].isColor ? 'color' : '',
					value = (option.fields[k].val == null) ? '' : option.fields[k].val;
				$fields.append($('<div class="option_' + j + ' varField"><span class="field">' + option.fields[k].description + ': </span><input type="field" class="' + isColor + '" value="' + value + '" /></div>'));
			}
			tabs[tab][section].push($fields);
		}
	}

	$('#optionNav > li:first-child').remove();
	for (tab in tabs) {
		$('<li id="optNav_' + tab.split(' ').join('').toLowerCase() + '">' + tab + '</li>').appendTo($('#optionNav'));
		var $tab = $('<div id="optTab_' + tab.split(' ').join('').toLowerCase() + '" class="tab"></div>');
		var $tabContent = $('<div class="table"></div>');
		for (section in tabs[tab]) {
			var $section = $(
				'<section>'
					+ '<h3>' + section + '</h3>'
				+ '</section>'
			);
			var $options = $('<div></div>');
			for (var j = 0, l = tabs[tab][section].length; j < l; j++) {
				$options.append(tabs[tab][section][j]);
			}
			$options.appendTo($section);
			$section.appendTo($tabContent);
		}
		$tabContent.appendTo($tab);
		$('#optWrapper').append($tab);
	}
	
	$('<li id="optNav_about">about</li>').appendTo($('#optionNav'));
	var $tabAbout = $('<div id="optTab_about" class="tab"></div>');
	
	if (modules[i].about != null) {
		var source = modules[i].about,
			content = source[0];
		for (var j = 1, l = source.length; j < l; j++) {
			content += '\n' + source[j];
		}
		$tabAbout.html(content);
	} else {
		$tabAbout.text('No about page...');
	}	

	$tabAbout.appendTo($('#optWrapper'));
	
	$('#optionNav li:first-child, #optionNav + .tab').addClass('current');
	$('.color').wheelColorPicker({
		dir: '../../img/colorpicker/',
		format: 'rgba',
		preview: true,
		userinput: true,
		validate: true,
		color: null
	});

	addOptionsListeners();
	if (!hasOptionsLoaded) {
		addOptionsOneTimeListeners();
		hasOptionsLoaded = true;
	}
}

function addOptionsListeners() {	
	$('#saveOptions').addClass('disabled').text('Save Changes');

	$('#optionNav li').click(function() {
		$('#optionNav .current').removeClass('current');
		$(this).addClass('current');

		$('.tab.current').removeClass('current');
		$('#optTab_' + $(this).attr('id').substr(7)).addClass('current');
	});

	$('#p_opt input').change(function() {
		if (!hasOptionsChanged) {
			hasOptionsChanged = true;
			activateSaveOptionsButton()
		}
	});

	$('.color').focusout(activateSaveOptionsButton);
	$('.varfield').keypress(activateSaveOptionsButton);
}

function addOptionsOneTimeListeners() {
	$('#saveOptions').click(saveOptions);
	addSaveHotkey();
}

function activateSaveOptionsButton() {
	$('#saveOptions').removeClass('disabled').text('Save Changes');
}

function saveOptions() {
	if (!$(this).hasClass('disabled')) {
		var i = $('#p_opt h1').attr('id').substr(7),
			options = modules[i].options;
			
		$('.color').each(function() {
			if ($(this).val().indexOf('#') < 0) {
				$(this).val('#' + $(this).val());	
			}
		});

		for (var j = 0, l = options.length; j < l; j++) {
			if ($('#option_' + j).is(':checked')) {
				modules[i].options[j].isEnabled = true;	
			} else {
				modules[i].options[j].isEnabled = false;
			}
			for (var k = 0, m = $('.option_' + j + '.varfield').length; k < m; k++) {
				modules[i].options[j].fields[k].val = $('.option_' + j + '.varfield:nth-child(' + (k + 1) + ') input').val();
			}
		}
		chrome.extension.sendRequest({name: 'save', modules: modules}, function(response) {});
		hasOptionsChanged = false;
		$('#saveOptions').addClass('disabled').text('Changes Saved!');
		chrome.extension.sendRequest({name: 'reload', module: i}, function(response) {});
	}
}