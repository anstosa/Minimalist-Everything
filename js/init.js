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
	if (getTarget() == lastCheck) {
		return;
	}
	if (lastCheck != null) {
		lastCheck.removeEventListener("DOMSubtreeModified", runModules, false);
	}
	lastCheck = getTarget()
	if (lastCheck != null) {
		lastCheck.addEventListener("DOMSubtreeModified", runModules, false);
		runModules();	// fencepost
	}
}

chrome.extension.sendRequest({name: "getModules", target: window.location}, function(response) {
	modules = response.modules;
	if (modules.length > 0) {
		bootstrapTarget = modules[0].bootstrapTarget;	// TODO: find way of prioritizing bootstrap targets
		if (bootstrapTarget != null) {
			window.addEventListener("DOMSubtreeModified", init, false);
		} else {
			runModules();
		}
		injectCSS(staticStyles);	// static styles don't need page load
		chrome.extension.sendRequest({name: "activateBrowserAction"}, false);
	}
});