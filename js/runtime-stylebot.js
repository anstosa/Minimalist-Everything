/**
 * Stylebot for Minimalist
 *
 * © 2011 jiefoxi based on Ansel Santosa
 * Licensed under GNU GPL v3
 **/

function importStyle(index) {
    var module = {
        name: $(".stylebot_install_div").eq(index).attr("data-title"),
        author: $(".stylebot_install_div").eq(index).attr("data-author"),
        includes: getIncludes($(".stylebot_install_div").eq(index).attr("data-url")),
        version: $(".stylebot_install_div").eq(index).attr("data-timestamp"),
        about: [$(".post_name").eq(index).attr("href") + "\n", $(".stylebot_install_div").eq(index).attr("data-description")],
        isEnabled: true,
        options: [
            {
                description: "Imported Styles",
                isEnabled: true,
                tab: "Imported",
                section: "Imported",
                type: "checkbox",
                head: {
                    css: sanitizeCSS(index)
                },
                load: {}
            }
        ]
    };
    chrome.extension.sendMessage({name: "installModule", module: module}, function(response) {
        $(".minimalistInstall").eq(index).text("Installed!");
    });
}

function getIncludes(data) {
    data = data.split(",");

    for (var i = 0, l = data.length; i < l; i++) {
        data[i] = data[i].replace(/["']/g, "").replace(/^\*?(.*)\*?$/, "*$1*");
    }

    return data.join(",");
}

function sanitizeCSS(index) {
    var css = $(".stylebot_install_div").eq(index).text();
    while (css.indexOf("@-moz") != -1) {
        css = css.substring(0,css.indexOf("@-moz")) + css.substr(css.indexOf("{",css.indexOf("@-moz")) + 1);
    }
    return css.split("\n");
}

function disableInstall(index) {
    $(".minimalistInstall").eq(index)
        .removeClass("blue")
        .text("Installed. Force update")
    ;
}

function initMinimalist() {
    $('<div><a href="javascript:;" class="minimalistInstall button big blue">Install with Minimalist</a></div>').appendTo($(".post_links"));

    $(".post_links").each(function (index) {
        $(".minimalistInstall").eq(index).click(function() {
            $(this)
                .removeClass("blue")
                .addClass("disabled")
                .text("Installing...")
            ;
            window.setTimeout(function () {
                importStyle(index);
            }, 1000);
        });
    });
}

$(document).ready(function() {
    initMinimalist();

    $(".post_links").each(function (index) {
        chrome.extension.sendMessage({name: "getModuleIndex", meta: {
            name: $(".stylebot_install_div").eq(index).attr("data-title"),
            author: $(".stylebot_install_div").eq(index).attr("data-author")
        }}, function(response) {
            if (response.isInstalled) {
                disableInstall(index);
            }
        });
    });
});
