/**
 * Module Object for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

var name = "",
	includes = "",
	isEnabled = true,
	css = new Array(),
	js = new Array();

function Module(params) {
    for (param in params) {
    	eval("this." + param + " = params[param]");	// TODO: find better way to do this
    }
}