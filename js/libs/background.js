/**
 * Background helper methods for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

/* === INIT HELPERS === */
function checkUpdate() {
	debug("checking for updates...");
	if (!localStorage["version"]) {
		localStorage["version"] = VERSION
		return true;
	}
	if (localStorage["version"] != VERSION) {
		if (parseFloat(localStorage["version"]) < parseFloat(VERSION)) {
			debug("Updated to version " + VERSION);
			localStorage["version"] = VERSION;
			var notification = webkitNotifications.createHTMLNotification(
				"modal/notifyUpdate.html"
			);
			notification.show();
		}
	}
}

function loadOptions() {
	debug("loading options...");
	var value;
	for (var option in options) {
		value = localStorage[option];
		if (value != null) {
			options[option] = value;
		} else {
			localStorage[option] = options[option];
		}
	}
}

function loadModules() {
	debug("loading modules...");
	if ((modules = localStorage["modules"]) != null) {
		try {
			for (var i = 0, l = modules.length; i < l; i++) {
				modules[i] = JSON.parse(localStorage["modules"][i]);
			}
		} catch (e) {
			console.log("Minimalist: " + e);
			modules = new Array();
		}
	} else {
		modules = new Array();
		save();
	}
}
/* === END INIT HELPERS === */

/* === LISTENERS === */

function getModules(target){
	var modules = localStorage[modules],
		matchedModules = new Array();
	for (var i = 0, l = modules.length; i < l; i++) {
		if (isMatch(target, modules[i].includes)) {
			matchedModules.push(modules[i]);
		}
	}
	return matchedModules;
}

function activateBrowserAction(tab) {
	chrome.browserAction.setIcon({path: "img/icons/icon19_active.png", tabId: tab.id})
}

function deactivateBrowserAction(tab) {
	chrome.browserAction.setIcon({path: "img/icons/icon19.png", tabId: tab.id})
}

String.prototype.copy = function() {
	var copyTextarea = document.createElement('textarea');
	document.body.appendChild(copyTextarea);
	copyTextarea.value = this;
	copyTextarea.select();
	document.execCommand('copy');
	document.body.removeChild(copyTextarea);
};

function save() {
	debug("saving options...");
	for (var option in options) {
		localStorage[option] = options[option];
	}
	debug("saving modules...");
	var modulesString = new Array();	
	for (var i = 0, l = modules.length; i < l; i++) {
		modulesString[i] = JSON.stringify(modules[i]);
	}
	localStorage["modules"] = modulesString;
}
/* === END LISTENERS === */

function debug(message) {
	if (options.isDebugging) {
		console.log("Minimalist: " + message);
	}
}