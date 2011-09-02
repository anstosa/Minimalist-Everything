/**
 * Options page for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

var modules,
	prefs;

/* === NAVIGATION HANDLER === */
function addNavHandler() {
	var last = "das";
	$(".nav, nav li a:not(#n_don)").click(function(){
		var next = $(this).attr("href").substr(1);
		$("#p_" + last + ", #n_" + last).removeClass("current");
		$("#p_" + next + ", #n_" + next).addClass("current");
		last = next;
	});
}
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
function buildDashboard() {
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
			href: "#opt",
			class: "moduleOptions nav button subtle blue"
		}).text("Options").appendTo($moduleControls);
		$("<a></a>", {
			href: "#edi",
			class: "moduleEdit nav button subtle green"
		}).text("Edit").appendTo($moduleControls);
		$("<a></a>", {		
			href: "javascript:void(0);",
			class: "moduleToggle button subtle red"
		}).text("Disable").appendTo($moduleControls);
		$("<a></a>", {
			href: "javascript:void(0);",
			class: "moduleDelete button subtle red"
		}).text("Delete").appendTo($moduleControls);
		$("<a></a>", {
			href: "javascript:void(0);",
			class: "moduleDeleteCancel button green hidden"
		}).text("Cancel Delete").appendTo($moduleControls);
		$("<a></a>", {
			href: "javascript:void(0);",
			class: "moduleDeleteConfirm button red hidden"
		}).text("Confirm Delete").appendTo($moduleControls);

		var $moduleList;
		
		if (modules.length > 0) {
			$moduleList = $("#moduleList").empty()
		}
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
			if (!modules[i].isEnabled) {
				$("#module_" + i).addClass("disabled");
				$("#module_" + i + " .moduleToggle").removeClass("red").addClass("green").text("Enable");
			}
		}
		addModuleListeners();
		addNavHandler();
	});
}
/* === END LOAD MODULES === */

/* === MODULE OPTIONS === */
function addModuleListeners() {
	$("#installStarter").click(function() {
		chrome.extension.sendRequest({name: "installStarterModule"}, function(response) {});
		window.location.reload();
	});
	$(".moduleOptions").click(function() {
		buildOptions($(this).parent().parent().attr("id").substr(7));
	});
	$(".moduleEdit").click(function() {
		buildEditor($(this).parent().parent().attr("id").substr(7));
	});
	$(".moduleToggle").click(function() {
		var module = $(this).parent().parent().attr("id").substr(7);
		if ($(this).text() === "Disable") {
			chrome.extension.sendRequest({name: "disable", module: module}, function(response) {});
			$("#module_" + module).addClass("disabled");
			$("#module_" + module + " .moduleToggle").removeClass("red").addClass("green").text("Enable");
		} else {
			chrome.extension.sendRequest({name: "enable", module: module}, function(response) {});
			$("#module_" + module).removeClass("disabled");
			$("#module_" + module + " .moduleToggle").removeClass("green").addClass("red").text("Disable");
		}
	});
	$(".moduleDelete").click(function() {
		$(this).addClass("hidden").next().removeClass("hidden").next().removeClass("hidden");
	});
	$(".moduleDeleteCancel").click(function() {
		$(this).addClass("hidden").next().addClass("hidden").end().prev().removeClass("hidden");
	});
	$(".moduleDeleteConfirm").click(function() {
		var module = $(this).parent().parent().attr("id").substr(7);
		chrome.extension.sendRequest({name: "deleteModule", module: module}, function(response) {});
		window.location.reload();
	});
}

function buildOptions(i) {
	var options = modules[i].options;
	var tabs = {};
	
	$("#p_opt h1").text(modules[i].name).attr("id", "module_" + i);
	$("#optWrapper").empty();
	for (var j = 0, l = options.length; j < l; j++) {
		var option = options[j];

		var $input = $("<input />", {
			id: "option_" + j,
			type: option.type
		});
		if (option.isEnabled) {
			$input.prop("checked", true);
		}
		if (option.type === "radio") {
			$input.attr(name) = option.radio;
		}

		var $label = $("<label></label>", {
			text: option.description,
			for: "option_" + j
		});
		var $inputStyled = $("<div></div>", {
			class: "input"
		});
			$inputStyled.prependTo($label);
		if (option.hasOwnProperty("screen")) {
			$label.attr("screen") = option.screen;
		}

		var tab = options[j].tab;
		if (!tabs.hasOwnProperty(tab)) {
			tabs[tab] = {};
		}
		var section = options[j].section;
		if (!tabs[tab].hasOwnProperty(section)) {
			tabs[tab][section] = new Array();
		}
		tabs[tab][section].push($input, $label);
	}
	for (tab in tabs) {
		var $tab = $("<div></div>", {
			class: "tab"
		});
		var $tabContent = $("<div></div>", {
			class: "table"
		});
		for (section in tabs[tab]) {
			var $section = $("<section></section>");
			var $title = $("<h3>" + section + "</h3>");
			var $options = $("<div></div>");
			for (var j = 0, l = tabs[tab][section].length; j < l; j++) {
				$options.append(tabs[tab][section][j]);
			}
			$title.appendTo($section);
			$options.appendTo($section);
			$section.appendTo($tabContent);
		}
		$tabContent.appendTo($tab);
		$("#optWrapper").append($tab);
	}


	addOptionsListeners();
}
/* === END MODULE OPTIONS === */

/* === MODULE EDITOR === */
var editorCSS,
	editorHeadJS,
	editorBodyJS;

function buildEditor(i) {
	var options = modules[i].options;
	var tree = {};

	$("#p_edi .h1").val(modules[i].name).attr("id", "module_" + i);
	$("#optionTree").empty();

	for (var j = 0, l = options.length; j < l; j++) {
		var option = options[j],
			$bud = $("<li></li>", {
				id: "treeOption_" + j
			}),
			$budLink = $("<span></span>", {
				text: option.description
			}).appendTo($bud),
			root = options[j].tab;
		if (!tree.hasOwnProperty(root)) {
			tree[root] = {};
		}
		var branch = options[j].section;
		if (!tree[root].hasOwnProperty(branch)) {
			tree[root][branch] = new Array();
		}
		tree[root][branch].push($bud);
	}

	for (root in tree) {
		var $root = $("<li></li>"),
			$rootLink = $("<span></span>", {
				text: root,
			}).appendTo($root),
			$branches = $("<ul></ul>").appendTo($root);
		for (branch in tree[root]) {
			var $branch = $("<li></li>"),
				$branchLink = $("<span></span>", {
					text: branch,
				}).appendTo($branch),
				$buds = $("<ul></ul>");
			
			for (var j = 0, l = tree[root][branch].length; j < l; j++) {
				$buds.append(tree[root][branch][i]);
			}
			$buds.appendTo($branch);
			$branch.appendTo($branches);
			$branches.appendTo($root);
		}
		$("#optionTree").append($root);
	}

	var option = modules[i].options[0];
	$("#optionTree #treeOption_0 span").addClass("current");
	$("#optionDescription").val(option.description);
	
	editorCSS.getSession().setValue("");
	editorHeadJS.getSession().setValue("");
	editorBodyJS.getSession().setValue("");

	if (option.hasOwnProperty("head") && option.head.hasOwnProperty("css")) {
		var content = option.head.css[0];
		for (var i = 1, l = option.head.css.length; i < l; i++) {
			content += "\n" + option.head.css[i];
		}
		editorCSS.getSession().setValue(content);
	}
	if (option.hasOwnProperty("head") && option.head.hasOwnProperty("js")) {
		var content = option.head.js[0];
		for (var i = 1, l = option.head.js.length; i < l; i++) {
			content += "\n" + option.head.js[i];
		}
		editorHeadJS.getSession().setValue(content);
	}
	if (option.hasOwnProperty("load") && option.load.hasOwnProperty("js")) {
		var content = option.load.js[0];
		for (var i = 1, l = option.load.js.length; i < l; i++) {
			content += "\n" + option.load.js[i];
		}
		editorBodyJS.getSession().setValue(content);
	}

	addEditorListeners();
}

window.onload = function() {
	$("#p_edi").addClass("loading");

	var editorModeCSS = require("ace/mode/css").Mode;
	var editorModeJS = require("ace/mode/javascript").Mode;

	editorCSS = ace.edit("editorCSS");
	editorCSS.setTheme("ace/theme/twilight");
	editorCSS.getSession().setMode(new editorModeCSS());

	editorHeadJS = ace.edit("editorHeadJS");
	editorHeadJS.setTheme("ace/theme/twilight");
	editorHeadJS.getSession().setMode(new editorModeJS());

	editorBodyJS = ace.edit("editorBodyJS");
	editorBodyJS.setTheme("ace/theme/twilight");
	editorBodyJS.getSession().setMode(new editorModeJS());

	$("#p_edi").removeClass("loading");
};
/* === END MODULE EDITOR === */

/* === LOAD & SAVE === */
var hasOptionsChanged = false,
	hasEditorChanged = false;

function addOptionsListeners() {	
	$("#saveOptions").addClass("disabled").text("Save Changes");
	$("#saveOptions").click(saveOptions);
	
	$("#p_opt input").change(function() {
		console.log("ss");
		if (!hasOptionsChanged) {
			hasOptionsChanged = true;
			$("#saveOptions").removeClass("disabled").text("Save Changes");
		}
	});	
}

function addEditorListeners() {	
	$("#saveEdits").addClass("disabled").text("Save Changes");
	$("#saveEdits").click(saveEdits);

	$("#optionTree > li > span, #optionTree > li > ul > li > span").click(function() {
		var $self = $(this);
		if ($self.parent().hasClass("collapsed")) {
			$self.parent()
				.animate({
					height: $self.parent().attr("min_height")
				}, 150)
				.removeClass("collapsed");
		} else {
			$self.parent()
				.attr("min_height", $self.parent().height())
				.animate({
					height: 16
				}, 150)
				.addClass("collapsed");
		}
	});

	$("#optionTree ul ul span").click(function() {
//		if (editNavConfirmed()) {
			var module = modules[$("#p_edi .h1").attr("id").substr(7)],
				option = module.options[$(this).parent().attr("id").substr(11)];

			$("#optionTree .current").removeClass("current");
			$(this).addClass("current");

			$("#optionDescription").val(option.description);
			
			editorCSS.getSession().setValue("");
			editorHeadJS.getSession().setValue("");
			editorBodyJS.getSession().setValue("");

			if (option.hasOwnProperty("head") && option.head.hasOwnProperty("css")) {
				var content = option.head.css[0];
				for (var i = 1, l = option.head.css.length; i < l; i++) {
					content += "\n" + option.head.css[i];
				}
				editorCSS.getSession().setValue(content);
			}
			if (option.hasOwnProperty("head") && option.head.hasOwnProperty("js")) {
				var content = option.head.js[0];
				for (var i = 1, l = option.head.js.length; i < l; i++) {
					content += "\n" + option.head.js[i];
				}
				editorHeadJS.getSession().setValue(content);
			}
			if (option.hasOwnProperty("load") && option.load.hasOwnProperty("js")) {
				var content = option.load.js[0];
				for (var i = 1, l = option.load.js.length; i < l; i++) {
					content += "\n" + option.load.js[i];
				}
				editorBodyJS.getSession().setValue(content);
			}
			disableEditSaveButton();
//		}
	});

	$("#optionMeta input, .h1").bind("keypress", activateEditSaveButton);
	editorCSS.getSession().on("change", activateEditSaveButton);
	editorHeadJS.getSession().on("change", activateEditSaveButton);
	editorBodyJS.getSession().on("change", activateEditSaveButton);
}

function activateEditSaveButton() {
	if (!hasEditorChanged) {
		hasEditorChanged = true;
		$("#saveEdits").removeClass("disabled").text("Save Changes");
	}
}

function disableEditSaveButton() {
	hasEditorChanged = false;
	$("#saveEdits").addClass("disabled").text("Save Changes");
}

/*function editNavConfirmed() {
	$("#saveEdits").addClass("hidden")
		.next().removeClass("hidden")
		.next().removeClass("hidden");
		$("#cancelNav").click(function() {
		$("#saveEdits").removeClass("hidden")
			.next().addClass("hidden")
			.next().addClass("hidden");
		return true;
	});
}*/

function saveOptions() {
	if (!$(this).hasClass("disabled")) {
		var i = $("#p_opt h1").attr("id").substr(7),
			options = modules[i].options;
			
		for (var j = 0, l = options.length; j < l; j++) {
			if ($("#option_" + j).is(":checked")) {
				modules[i].options[j].isEnabled = true;	
			} else {
				modules[i].options[j].isEnabled = false;
			}
		}
		chrome.extension.sendRequest({name: "save", modules: modules}, function(response) {});
		hasOptionsChanged = false;
		$("#saveOptions").addClass("disabled").text("Changes Saved!");
		chrome.extension.sendRequest({name: "reload", module: i}, function(response) {});
	}
}

function saveEdits() {
	if (!$(this).hasClass("disabled")) {
		var i = $("#p_edi .h1").attr("id").substr(7),
			j = $("#optionTree .current").parent().attr("id").substr(11),
			editsCSS = editorCSS.getSession().getValue(),
			editsHJS = editorHeadJS.getSession().getValue(),
			editsBJS = editorBodyJS.getSession().getValue();
		
		if (editsCSS.length > 0) {
			modules[i].options[j].head.css = editsCSS.split("\n");
		}
		if (editsHJS.length > 0) {
			modules[i].options[j].head.js = editsHJS.split("\n");
		}
		if (editsBJS.length > 0) {
			modules[i].options[j].load.js = editsBJS.split("\n");
		}

		modules[i].name = $(".h1").val();
		modules[i].options[j].description = $("#optionDescription").val();

		chrome.extension.sendRequest({name: "save", modules: modules}, function(response) {});
		hasEditorChanged = false;
		$("#saveEdits").addClass("disabled").text("Changes Saved!");
		chrome.extension.sendRequest({name: "reload", module: i}, function(response) {});
		buildEditor($(this).prev().attr("id").substr(7));
		buildDashboard();
	}
}

/* === END LOAD & SAVE === */
	
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

buildDashboard();