/**
 * Options page for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

var modules,
	prefs;

/* === NAVIGATION HANDLER === */
var last = "das";
$("nav li a:not(#n_don)").click(function(){
	var next = $(this).attr("href").substring(1);
	$("#p_" + last + ", #n_" + last).removeClass("current");
	$("#p_" + next + ", #n_" + next).addClass("current");
	last = next;
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
} else if (hash == null || hash === "" || hash === "opt") {
	$("#n_das, #p_das").addClass("current");
} else {
	$("#n_" + hash + ", #p_" + hash).addClass("current");			
	last = hash;
}
/* === END NAVIGATION HANDLER === */

/* === LOAD MODULES === */
chrome.extension.sendRequest({name: "getPrefs"}, function(response) {
	prefs = response.prefs;
});

chrome.extension.sendRequest({name: "getAllModules"}, function(response) {
	
	modules = response.modules;

	/**
	 * CONTROL PANEL
	 *
	 * <div>
	 *   <a href="javascript:void(0)" class="moduleOptions button blue">Options</a>
	 *   <a href="javascript:void(0)" class="moduleEdit button green">Edit</a>
	 *   <a href="javascript:void(0)" class="moduleToggle button gray">Disable</a>
	 *   <a href="javascript:void(0)" class="moduleDelete button red">Delete</a>
	 * </div>
	 **/
	var $moduleControls = $("<div></div>");
	$("<a></a>", {
		href: "javascript:void(0)",
		class: "moduleOptions button subtle blue"
	}).text("Options").appendTo($moduleControls);
	$("<a></a>", {
		href: "javascript:void(0)",
		class: "moduleEdit button subtle green"
	}).text("Edit").appendTo($moduleControls);
	$("<a></a>", {		
		href: "javascript:void(0)",
		class: "moduleToggle button subtle"
	}).text("Disable").appendTo($moduleControls);
	$("<a></a>", {
		href: "javascript:void(0)",
		class: "moduleDelete button subtle red"
	}).text("Delete").appendTo($moduleControls);

	var $moduleList = $("#moduleList").empty();

	for (var i = 0, l = modules.length; i < l; i++) {
		var current = modules[i];

		/**
		 * SINGLE MODULE
		 *
		 * <li id="module_X", >
		 *   <h2>Module Name</h2>
		 *   <h4>Module targets</h4>
		 *   <!-- Control Panel -->
		 * </li>
		 **/
		var $module = $("<li></li>",{
			id: "module_" + i,
			class: current.isEnabled
		});
		$("<h2></h2>").text(current.name).appendTo($module);
		$("<h4></h4>").text(current.includes).appendTo($module);
		$module.append($moduleControls);
		$moduleList.append($module);
	}
	addModuleListeners();
});
/* === END LOAD MODULES === */

/* === MODULE OPTIONS === */
function addModuleListeners() {
	$(".moduleOptions").click(function() {
		buildOptions($(this).parent().parent().attr("id").substr(7));
	});
}

function buildOptions(i) {
	var options = modules[i].options,
		sections = {};
	$("#p_opt h1").text(modules[i].name);
	for (var j = 0, l = options.length; j < l; j++) {
		var option = options[j];
		
		var $input = $("<input />", {
			type: option.type,
			id: "option_" + j
		});
		if (option.type === "radio") {
			$input.attr(name) = option.radio;
		}
		
		var $label = $("<label></label>", {
			for: "option_" + j
		}).append($("<div></div>", {
				class: "input"
			}))
		.end().text(option.decription);
		if (option.hasOwnProperty("screen")) {
			$label.attr("screen") = option.screen;
		}

		var section = options[j].section;
		if (!sections.hasOwnProperty(section)) {
			sections[section] = new Array();
		}
		sections[section].push($input, $label);
	}
	console.log(sections);

	// switch to page
	$("#p_" + last + ", #n_" + last).removeClass("current");
	$("#p_opt").addClass("current");
	last = "opt";
}
/* === END MODULE OPTIONS === */
	
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