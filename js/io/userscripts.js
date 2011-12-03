/**
 * UserScripts for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

function importScript() {
        var module = {
                name: getValue("a2a_linkname"),
                author: $('.author a').text(),
                includes: '*',
                about: getAbout(),
                isEnabled: true,
                options: [
                        {
                                description: 'Imported Script',
                                isEnabled: true,
                                tab: 'Imported',
                                section: 'Imported',
                                type: 'checkbox',
                                head: {
                                        js: getJS()
                                },
                                load: {}
                        }
                ]
        }
        chrome.extension.sendRequest({name: 'addModule', module: module}, function(response) {
                $('#minimalistInstall').text('Installed!');
        });
}

function getValue(name) { // a2a_linkname, a2a_linkurl
        var temp = document.body.innerHTML.match(new RegExp(name + ' = "(.*)"'));
        if (temp && temp.length == 2) {
                return temp[1];
        } else {
                return "";
        }
}

function getAbout() {
        var link = getValue("a2a_linkurl");
        var summary;
        if (location.href.indexOf("/show/") >= 0) {
                summary = $("#summary").html();
        } else {
                $.ajax({
                        url: link,
                        async: false,
                        success: function (data) {
                                summary = $("<div id='minimalistTemp' style='display: none;'>" + data + "</div>").appendTo("body").find("#summary").html();
                                $("#minimalistTemp").remove();
                        }
                });
        }

        return ["<p><b>Link: </b><a href='" + link + "'>" + link + "</a></p>" + summary];
}

function getJS() {
        var code;

        if (location.href.indexOf("/review/") >= 0) {
                code = $('#source').text().split('\n');
        } else {
                var link = getValue("a2a_linkurl").replace("/show/", "/review/");
                $.ajax({
                        url: link,
                        async: false,
                        success: function (data) {
                                code = $("<div id='minimalistTemp' style='display: none;'>" + data + "</div>").appendTo("body").find("#source").text().split('\n');
                                $("#minimalistTemp").remove();
                        }
                });
        }

        return code;
}

function disableInstall() {
        $('#minimalistInstall')
                .removeClass('blue')
                .text('Installed. Force update')
        ;
}

function initMinimalist() {
        $('<a href="javascript:;" id="minimalistInstall" class="button big blue">Install with Minimalist</a>').appendTo($('#details'));
        $('#minimalistInstall').click(function() {
                $(this)
                        .removeClass('blue')
                        .addClass('disabled')
                        .text('Installing...')
                ;
                window.setTimeout(importScript, 1000);
        });
}

$(document).ready(function() {
        initMinimalist();
        chrome.extension.sendRequest({name: 'checkForInstall', meta: {
                name: getValue("a2a_linkname"),
                author: $('.author a').text()
        }}, function(response) {
                if (response.isInstalled) {
                        disableInstall();
                }
        });
});