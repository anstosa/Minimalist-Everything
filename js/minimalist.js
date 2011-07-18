/**
 * Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

// var modules [init.js]
// var prefs [init.js]

/* === SETUP === */
var bodyScripts = "",
	headScripts = "",
	styles = "";
/* === END SETUP === */

/* === CONSTRUCTION === */
function buildModules() {
	for (var i = 0, l = modules.length; i < l; i++) {
		var moduleOptions = modules[i].options;
		buildStyles(moduleOptions);
		buildHeadScripts(moduleOptions);
		buildBodyScripts(moduleOptions);
	}
}
/* === END CONSTURCTION === */