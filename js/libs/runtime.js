/**
 * Script helper methods for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

function debug(message) {
	if (prefs.isDebugging == "true") {
		console.log("Minimalist: " + message);
	}
}

function buildStyles(options) {
	var styleData;
	for (var i = 0, l = options.length; i < l; i++) {
		if ((styleData = options[i].head.css) != null && options[i].isEnabled) {
			for (var j = 0, e = styleData.length; j < e; j++) {				
				styles += "\n    " + styleData[j];
			}
			styles += "\n";
		}
	}
}

function buildHeadScripts(options) {
	var scriptData;
	for (var i = 0, l = options.length; i < l; i++) {
		if (scriptData = options[i].head.js) {
			for (var j = 0, e = scriptData.length; j < e; j++) {
				headScripts += "\n    " + scriptData[j];
			}
			headScripts += "\n";
		}
	}
}

function buildBodyScripts(options) {
	var scriptData;
	for (var i = 0, l = options.length; i < l; i++) {
		if (scriptData = options[i].load.js) {
			for (var j = 0, e = scriptData.length; j < e; j++) {
				bodyScripts += "\n    " + scriptData[j];
			}
			bodyScripts += "\n";
		}
	}
}