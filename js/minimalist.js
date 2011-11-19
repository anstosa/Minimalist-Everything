/**
 * Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

// var modules [init.js]
// var prefs [init.js]

/* === SETUP === */
var bodyScripts = '',
	headScripts = '',
	styles = '',
	MIN = [];
/* === END SETUP === */

/* === CONSTRUCTION === */
function buildModules() {
	for (var i = 0, l = modules.length; i < l; i++) {
		var moduleOptions = modules[i].options;
		buildStyles(moduleOptions, i);
		buildHeadScripts(moduleOptions, i);
		buildBodyScripts(moduleOptions, i);
		swapVars(i);
	}
	headScripts = '\n    var MIN = [' + MIN + '];' + headScripts;
}

function swapVars(m) {
	bodyScripts = bodyScripts.replace('MIN.', 'MIN[' + m + '].');
	headScripts = headScripts.replace('MIN.', 'MIN[' + m + '].');
	while (styles.indexOf('MIN.') != -1) {
		styles = styles.replace(styles.substring(styles.indexOf('MIN.'), styles.indexOf(' ', styles.indexOf('MIN.'))), JSON.parse(MIN[m])[styles.substring(styles.indexOf('MIN.') + 4,styles.indexOf(' ', styles.indexOf('MIN.')))]);
	}
}

function buildStyles(options, m) {
	var styleData;
	for (var i = 0, l = options.length; i < l; i++) {
		if (options[i].hasOwnProperty('head') && options[i].head.hasOwnProperty('css') && (styleData = options[i].head.css) != null && options[i].isEnabled) {
			for (var j = 0, e = styleData.length; j < e; j++) {
				styles += '\n    ' + styleData[j];
			}
			styles += '\n';
		}
	}
}

function buildHeadScripts(options, m) {
	var scriptData,
		fields = {};
	for (var i = 0, l = options.length; i < l; i++) {
		if (options[i].hasOwnProperty('head') && options[i].head.hasOwnProperty('js') && (scriptData = options[i].head.js) && options[i].isEnabled) {
			for (var j = 0, e = scriptData.length; j < e; j++) {
				headScripts += '\n    ' + scriptData[j];
			}
			headScripts += '\n';
		}
		if (options[i].fields != null && options[i].fields.length > 0) {
			for (var k = 0, m = options[i].fields.length; k < m; k++) {
				fields[options[i].fields[k].name] = options[i].fields[k].val;
			}
		}
	}
	MIN.push(JSON.stringify(fields));
}

function buildBodyScripts(options, m) {
	var scriptData;
	for (var i = 0, l = options.length; i < l; i++) {
		if (options[i].hasOwnProperty('load') && (scriptData = options[i].load.js) && options[i].isEnabled) {
			for (var j = 0, e = scriptData.length; j < e; j++) {
				bodyScripts += '\n    ' + scriptData[j];
			}
			bodyScripts += '\n';
		}
	}
}
/* === END CONSTURCTION === */