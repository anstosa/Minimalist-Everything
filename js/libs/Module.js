/**
 * Module Object for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

var name = "",
	includes = "",
	isEnabled = true;

function Module(params) {
	debug("creating module: " + params.name);
    for (param in params) {
    	eval("this." + param + " = params[param]");	// TODO: find better way to do this
    }
}

function set(key, value) {
	eval("this." + key + " = value");				// TODO: find better way to do this
}