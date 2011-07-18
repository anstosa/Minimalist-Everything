/**
 * Background helper methods for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

/* === INIT HELPERS === */
function setDebugging() {
	if (localStorage["isDebugging"] != null) {
		return localStorage["isDebugging"];
	} else {
		return false;
	}
}

function checkUpdate() {
	debug("checking for updates...");
	if (!localStorage["version"]) {
		localStorage["version"] = VERSION;
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

function loadPrefs() {
	debug("loading preferences...");
	var value;
	for (var key in prefs) {
		value = localStorage[key];
		if (value != null) {
			prefs[key] = value;
		} else {
			localStorage[key] = prefs[key];
		}
	}
}

function disable(target) {
	if (target < 0) {
		debug("Minimalist disabled");
		prefs.isEnabled = false;
	} else {
		
	}
	save();
}

function enable(target) {
	if (target < 0) {
		debug("Minimalist enabled");
		prefs.isEnabled = true;
	} else {
		
	}
	save();
}

function loadModules() {
	debug("loading modules...");
	if ((modules = localStorage["modules"]) != null) {
		 modules = modules.split("|||");
		try {
			for (var i = 0, l = modules.length; i < l; i++) {
				modules[i] = JSON.parse(modules[i]);
			}
		} catch (e) {
			console.error("Minimalist: " + e);
		}
	} else {
		debug("no modules, reseting to starter...");
		modules = new Array();
		modules[0] = new Module({
			name: "Starter Module",
			author: "Ansel Santosa",
			includes: "http://minimalistsuite.com/*",
			isEnabled: true,
			options: [
				{
					description: "theme",
					isEnabled: true,
					section: "Debug test",
					type: "checkbox",
					head: {
						css: [
							"h1 {",
							"	color: #09f;",
							"}"
						],
						js: [
							"var line1 = \"Subtract until it breaks\",",
							"\tline2 = \"The way of the Minimalist\";"
						]
					},
					load: {
						js: [
							"console.log(line1);",
							"console.log(line2);"
						]
					}
				}
			]
		});
		save();
	}
}
/* === END INIT HELPERS === */

/* === LISTENERS === */
function getActiveModules(target){
	debug("getting modules that target " + target + "...");
	var matchedModules = new Array();
	for (var i = 0, l = modules.length; i < l; i++) {
		if (isMatch(target, modules[i].includes)) {
			matchedModules.push(modules[i]);
		}
	}
	return matchedModules;
}

function activateBrowserAction(tab) {
	debug("activating browser action for " + tab.url + "...");
	chrome.browserAction.setIcon({path: "img/icons/icon19_active.png", tabId: tab.id})
}

function reloadAll() {
	debug("reloading all targetted tabs...");
	chrome.windows.getAll({populate: true},function(windows) {
		for (var i = 0, l = windows.length; i < l; i++) {
			//chrome.tabs.getAllInWindow(windows[i], function(tabs) {
				var tabs = windows[i].tabs;
				for (var j = 0, m = tabs.length; j < m; j++) {
					if (getActiveModules(tabs[j].url).length > 0) {
						reloadTab(tabs[j]);	
					}				
				}
			//});	
		}
	});
}

function reloadTab(tab) {
	debug("reloading " + tab.url);
	chrome.tabs.update(tab.id, {url: tab.url, selected: tab.selected}, null);
}

String.prototype.copy = function() {
	var copyTextarea = document.createElement("textarea");
	document.body.appendChild(copyTextarea);
	copyTextarea.value = this;
	copyTextarea.select();
	document.execCommand("copy");
	document.body.removeChild(copyTextarea);
};

function save() {
	debug("saving preferences...");
	for (var pref in prefs) {
		localStorage[pref] = prefs[pref];
		console.log(pref + ": " + prefs[pref]);
	}
	debug("saving modules...");
	var modulesString = new Array();	
	for (var i = 0, l = modules.length; i < l; i++) {
		modulesString[i] = JSON.stringify(modules[i]);
	}
	localStorage["modules"] = modulesString.join("|||");
}
/* === END LISTENERS === */

function isMatch(target, includeString) {
	debug("checking regex match...");
	includeString.replace("*", ".*");
	var includes = includeString.split(",");
	for (var i = 0, l = includes.length; i < l; i++) {
		if (target.match(includes[i]) != null) {
			return true;
		} else {
			return false;
		}
	}
}

/*function arrayReplacer(key, value) {
	if (Array.isArray(value)) {
		for (var i = 0, l = value.length; i < l; i++) {
			value[i] = JSON.stringify(value[i], arrayReplacer);
		}
		return value.join("|||");
	} else {
		return value;
	}
}*/

function debug(message) {
	if (prefs.isDebugging == "true") {
		console.log("Minimalist: " + message);
	}
}