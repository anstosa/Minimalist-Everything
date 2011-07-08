/**
 * Bootstrap for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

var lastCheck = null,
	bootstrapTarget,
	modules;

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
		//runModules();	// fencepost
	}
}

chrome.extension.sendRequest({name: "getModules", target: window.location.toString()}, function(response) {
	modules = response.modules;
	if (modules.length > 0) {
		bootstrapTarget = modules[0].bootstrapTarget;	// TODO: find way of prioritizing bootstrap targets
		if (bootstrapTarget != null) {
			window.addEventListener("DOMSubtreeModified", init, false);
		} else {
			debug("no bootstrap target. Skipping load...");
			injectBody();
		}
		buildModules();
		injectHead();
		chrome.extension.sendRequest({name: "activateBrowserAction"}, function(response){});
	}
});