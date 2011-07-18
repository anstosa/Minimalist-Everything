/**
 * Bootstrap for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

var lastCheck = null,
	bootstrapTarget,
	modules,
	prefs;


function getTarget() {
	return document.getElementById(bootstrapTarget);
}

function init() {
	debug("bootstrapping...");
	if (getTarget() == lastCheck) {
		return;
	}
	if (lastCheck != null) {
		lastCheck.removeEventListener("DOMSubtreeModified", injectBody, false);
	}
	lastCheck = getTarget()
	if (lastCheck != null) {
		lastCheck.addEventListener("DOMSubtreeModified", injectBody, false);
	}
}
chrome.extension.sendRequest({name: "getPrefs"}, function(response) {
	prefs = response.prefs;
	if (prefs.isEnabled == true) {
		chrome.extension.sendRequest({name: "getActiveModules"}, function(response) {
			modules = response.modules;
			if (modules.length > 0) {
				buildModules();
				injectHead();
				chrome.extension.sendRequest({name: "activateBrowserAction"}, function(response){});
				bootstrapTarget = modules[0].bootstrapTarget;	// TODO: find way of prioritizing bootstrap targets
				if (bootstrapTarget != null) {
					window.addEventListener("DOMSubtreeModified", init, false);
				} else {
					debug("no bootstrap target. Skipping load...");
					injectBody();
				}
			}
		});
	}
});