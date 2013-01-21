/**
 * Module Object for Minimalist
 *
 * © 2013 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

var name = '',
    includes = '',
    isEnabled = true,
    options = [];

function Module(params) {
    debug('creating module: ' + params.name);
    for (var param in params) {
        this[param] = params[param];
    }
}

function set(key, value) {
    this[key] = value;
}