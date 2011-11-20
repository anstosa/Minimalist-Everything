/**
 * Dashboard for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

 /* === LOAD MODULES === */
function buildDashboard(andSwitch) {
	chrome.extension.sendRequest({name: 'getPrefs'}, function(response) {
		prefs = response.prefs;
		initSync();
	});

	chrome.extension.sendRequest({name: 'getAllModules'}, function(response) {
		
		modules = response.modules;

		var $moduleControls = $(
			'<div>'
				+ '<a href="#opt" class="moduleOptions nav button group first subtle blue">Options</a>'
				+ '<a href="#edi" class="moduleEdit nav button group subtle green">Edit</a>'
				+ '<a href="javascript:;" class="moduleToggle button group subtle red">Disable</a>'
			 	+ '<a href="javascript:;" class="moduleDelete button group last subtle red">Delete</a>'
			 	+ '<a href="javascript:;" class="moduleDeleteCancel button group green hidden">Cancel Delete</a>'
			 	+ '<a href="javascript:;" class="moduleDeleteConfirm button group last red hidden">Confirm Delete</a>'
			+ '</div>'
		);
		var $moduleList;
		
		if (modules.length > 0) {
			$moduleList = $('#moduleList').empty()
		}
		for (var i = 0, l = modules.length; i < l; i++) {
			var current = modules[i];
			var $module = $(
				'<li id="module_' + i + '" class="' + current.isEnabled + '">'
					+ '<h2>' + current.name + '</h2>'
					+ '<h4>' + current.includes + '</h4>'
				+ '</li>'
			);
			$module.append($moduleControls.clone());
			$moduleList.append($module);
			if (!modules[i].isEnabled) {
				$('#module_' + i).addClass('disabled');
				$('#module_' + i + ' .moduleToggle').removeClass('red').addClass('green').text('Enable');
			}
		}
		addDashboardListeners();
		if (andSwitch) {
			addNavHandler();
		}
	});
}
/* === END LOAD MODULES === */

/* === MODULE OPTIONS === */
function addDashboardListeners() {
	$('#installStarter').click(function() {
		chrome.extension.sendRequest({name: 'installStarterModule'}, function(response) {
			buildDashboard(true);
		});
	});
	$('.moduleOptions').click(function() {
		buildOptions($(this).parent().parent().attr('id').substr(7));
	});
	$('.moduleEdit').click(function() {
		buildEditor($(this).parent().parent().attr('id').substr(7));
	});
	$('.moduleToggle').click(function() {
		var module = $(this).parent().parent().attr('id').substr(7);
		if ($(this).text() === 'Disable') {
			chrome.extension.sendRequest({name: 'disable', module: module}, function(response) {});
			$('#module_' + module).addClass('disabled');
			$('#module_' + module + ' .moduleToggle').removeClass('red').addClass('green').text('Enable');
		} else {
			chrome.extension.sendRequest({name: 'enable', module: module}, function(response) {});
			$('#module_' + module).removeClass('disabled');
			$('#module_' + module + ' .moduleToggle').removeClass('green').addClass('red').text('Disable');
		}
		window.location.reload();
	});
	$('.moduleDelete').click(function() {
		$(this).addClass('hidden').next().removeClass('hidden').next().removeClass('hidden');
	});
	$('.moduleDeleteCancel').click(function() {
		$(this).addClass('hidden').next().addClass('hidden').end().prev().removeClass('hidden');
	});
	$('.moduleDeleteConfirm').click(function() {
		chrome.extension.sendRequest({name: 'deleteModule', module: $(this).parent().parent().attr('id').substr(7)}, function(response) {
			window.location.reload();
			//buildDashboard(true);
		});
	});
}

function makeNewModule(host, title) {
	var includes = '*minimalistsuite.com*',
		name = 'New Module';
	if (host != null && host != 'null') {
		includes = '*' + host + '*';
	}
	if (title != null && title != 'null') {
		name = title;
	}
	modules.push(new Module({
		name: title,
		author: 'Your Name',
		includes: includes,
		version: '1.0.0',
		isEnabled: true,
		options: [
			{
				description: 'New Option',
				isEnabled: true,
				tab: 'New Tab',
				section: 'New Section',
				type: 'checkbox',
				fields: [],
				head: {},
				load: {}
			}
		]
	}));
	chrome.extension.sendRequest({name: 'save', modules: modules}, function(response) {});
	buildDashboard(false);
	buildEditor(modules.length - 1);
	navigate('edi');
}
/* === END MODULE OPTIONS === */