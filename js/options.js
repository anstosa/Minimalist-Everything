/**
 * Options page for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

/* === NAVIGATION HANDLER === */
var last = "das";
$("nav li a:not(#n_don)").click(function(){
	var next = $(this).attr("href").substring(1);
	$("#p_" + last + ", #n_" + last).removeClass("current");
	$("#p_" + next + ", #n_" + next).addClass("current");
	last = next;
});
var hash = window.location.hash.substr(1);
if (hash == "update") {
	$("#n_abo, #p_abo").addClass("current");
	last = "abo";
} else if (hash == "s_syn") {
	$("#n_syn, #p_syn").addClass("current");
	$("#m_welcome").removeClass("current");
	$("#m_import").removeClass("current");
	last = "syn";
} else if (hash == null || hash === "") {
	$("#n_das, #p_das").addClass("current");
} else {
	$("#n_" + hash + ", #p_" + hash).addClass("current");			
	last = hash;
}
/* === END NAVIGATION HANDLER === */

	
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

/*function export(EIid) {
	var prefOut = new Array();
		prefOut[0] = localStorage["options"];
		prefOut[1] = localStorage["BTNcolor"];
		prefOut[2] = localStorage["BTNborder"];
		prefOut[3] = localStorage["BTNbottom"];
		prefOut[4] = localStorage["BTNtop"];
		prefOut[5] = localStorage["customCSSval"];
		prefOut[6] = localStorage["appsURL"];
		prefOut[7] = localStorage["starCLR"];
		prefOut[8] = localStorage["uCLR"];
		prefOut[9] = localStorage["highCLR"];
		prefOut[10] = ""//localStorage["highCLRu"];
	var prefsOut = prefOut[0];	// fencepost
	for (var i = 1; i <= 10; i++) {
		prefsOut += '\n' + prefOut[i];
	}
	document.getElementById(EIid).innerHTML = prefsOut;
	if (EIid == "EIC_3") localStorage["EIC_3"] = prefsOut;	// backup existing to Custom 3
}

function import(EIid) {
	var prefsIn = document.getElementById(EIid).value;
	var prefIn = prefsIn.split("\n");
		localStorage["options"] = prefIn[0];
		localStorage["BTNcolor"] = prefIn[1];
		localStorage["BTNborder"] = prefIn[2];
		localStorage["BTNbottom"] = prefIn[3];
		localStorage["BTNtop"] = prefIn[4];
		localStorage["customCSSval"] = prefIn[5];
		localStorage["appsURL"] = prefIn[6];
		localStorage["starCLR"] = prefIn[7];
		localStorage["uCLR"] = prefIn[8];
		localStorage["highCLR"] = prefIn[9];
		//localStorage["highCLRu"] = prefIn[10];
	window.location.hash = "imps";
	window.location.reload();
}*/