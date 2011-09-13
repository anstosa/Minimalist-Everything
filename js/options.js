/**
 * Options page for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

var modules,
	prefs,
	last;

/* === NAVIGATION HANDLER === */
function addNavHandler() {
	last = "das";
	$(".nav, nav li a:not(.noNav)").live("click", function() {
		navigate($(this).attr("href").substr(1));
	});
	var hash = window.location.hash.substr(1);
	if (hash === "update") {
		$("#n_abo, #p_abo").addClass("current");
		last = "abo";
	} else if (hash === "s_syn") {
		$("#n_syn, #p_syn").addClass("current");
		$("#m_welcome").removeClass("current");
		$("#m_import").removeClass("current");
		last = "syn";
	} else if (hash == null || hash === "" || hash === "opt" || hash === "edi" || hash.indexOf("new") != -1) {
		$("#n_das, #p_das").addClass("current");
	} else {
		$("#n_" + hash + ", #p_" + hash).addClass("current");			
		last = hash;
	}

	if (hash.indexOf("new") != -1) {
		var host = null;
			title = null;
		if (hash.indexOf("new=") != -1) {
			host = hash.substr(hash.indexOf("new=") + 4, hash.indexOf("&title=") - hash.indexOf("new=") - 4);
		}
		if (hash.indexOf("&title") != -1) {
			title = hash.substr(hash.indexOf("&title=") + 7, 30);
		}
		window.location.hash = "";
		makeNewModule(host, title);
		
	}
}
function navigate(tag) {
	$("#p_" + last + ", #n_" + last).removeClass("current");
	$("#p_" + tag + ", #n_" + tag).addClass("current");
	last = tag;
}
/* === END NAVIGATION HANDLER === */

function debug(message) {
	if (prefs.isDebugging == "true") {
		console.log("Minimalist: " + message);
	}
}
	
	//---- SYNC ----//
	/*$("#sncDirDlg").dialog({ 
		modal: true, 
		autoOpen: false, 
		title: "Initial Sync",
		closeText: "cancel",
		open: function(event, ui) { $(this).removeAttr("isOk"); },
		close: function(event, ui) {
			if (!$(this).attr("isOk")) {
				$("#SNC_on").removeAttr("checked");
			}
		},
		buttons: { 
			"Ok": function() {
				var backgroundWindow = chrome.extension.getBackgroundPage();
				if ($("#SNC_usebookmark").attr("checked")) {
					console.log("Sync: enabling, loading from bookmark.");
					backgroundWindow.syncLoad(true, false);
					backgroundWindow.attachSyncListeners();
					load(true);
				} else if ($("#SNC_uselocal").attr("checked")) {
					console.log("Sync: enabling, saving local settings.");
					save();
					backgroundWindow.attachSyncListeners();
				}
				$(this).attr("isOk", true);
				$(this).dialog("close");
			}
		}
	});
	function handleSyncChange() {
		var wasSyncing = (localStorage["SNC_on"] == 'true');
		var isSyncingNow = $("#SNC_on").attr('checked');
		var backgroundWindow = chrome.extension.getBackgroundPage();
		if (!wasSyncing && isSyncingNow) {
			// Sync was just enabled. If we have a sync bookmark created, ask
			// which way to sync. Otherwise, just start syncing by creating
			// the bookmark.
			backgroundWindow.hasSyncData(function(hasData) {
				if (hasData) {
					$("#sncDirDlg").dialog("open");
				} else {
					save();
					backgroundWindow.attachSyncListeners();
				}
			});
		} else if (wasSyncing && !isSyncingNow) {
			// Sync was just disabled.
			save();
			backgroundWindow.detachSyncListeners();
		} else {
			// Sync didn't change, but some options (like notifications)
			// may have. Just save.
			save();
		}
	}*/
	//---- END SYNC ----//

window.onload = initSyntax;
$(function() {
	$("[tip]:not(input)").tipsy({fade: true, gravity: 'n'});
	$(".w[tip]:not(input)").tipsy({fade: true, gravity: 'w'});
	$(".s[tip]:not(input)").tipsy({fade: true, gravity: 's'});
	$("input[tip]").tipsy({trigger: "focus", gravity: 'w'});
});
buildDashboard(true);