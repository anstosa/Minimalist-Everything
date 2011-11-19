/**
 * Module editor for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

var editorCSS,
	editorHeadJS,
	editorBodyJS,
	hasEditorChanged = false;

function buildEditor(i) {
	var options = modules[i].options;
	var tree = {};

	$('#p_edi h1').attr('id', 'module_' + i).text(modules[i].name);
	$('#optionTree').html('<li id="moduleMetaLi">Module Metadata<li>');

	$('#moduleName').val(modules[i].name);
	$('#moduleAuthor').val(modules[i].author);
	$('#moduleIncludes').val(modules[i].includes);
	if (modules[i].hasOwnProperty('version')) {
		$('#moduleVersion').val(modules[i].version);
	}

	for (var j = 0, l = options.length; j < l; j++) {

		var option = options[j],
			$bud = $(
				'<li id="treeOption_' + j + '">'
			 		+ '<span>' + option.description + '</span>'
			 		+ '<a href="javascript:;">&#10008;</a>'
			 		+ '<a href="javascript:;" class="hidden">&#10008;</a>'
			 		+ '<a href="javascript:;" class="hidden">&#10004;</a>'
		 		+ '</li>'
			);
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
		var $root = $(
				'<li>'
					+ '<span>' + root + '</span>' 
				+ '</li>'
			),
			$branches = $('<ul></ul>');

		for (branch in tree[root]) {
			var $branch = $(
					'<li>'
						+ '<span>' + branch + '</span>'
					+ '</li>'
				),
				$buds = $('<ul></ul>');
			
			for (var j = 0, l = tree[root][branch].length; j < l; j++) {
				$buds.append(tree[root][branch][j]);
			}
			$buds.appendTo($branch);
			$branch.appendTo($branches);
			$branches.appendTo($root);
		}
		$('#optionTree').append($root);
	}

	$('<li id="optionNew">+ Add Option</li>').appendTo($('#optionTree'));

	$('#moduleMetaLi').addClass('current');
	$('#moduleMeta').removeClass('hidden');
	$('#optionMeta, #editors').addClass('hidden');


	moduleAbout.getSession().setValue('');
	editorCSS.getSession().setValue('');
	editorHeadJS.getSession().setValue('');
	editorBodyJS.getSession().setValue('');

	if (modules[i].hasOwnProperty('about')) {
		var source = modules[i].about,
			content = source[0];
		for (var j = 1, l = source.length; j < l; j++) {
			content += '\n' + source[j];
		}
		moduleAbout.getSession().setValue(content);
	}
	$('#optionTree ul ul').sortable({
		update: function(event, ui) {
			/*var $item = $(ui.item);
				if ($item.next().length > 0) {
					var length = $item.attr('id').substr(11) - $item.next().attr('id').substr(11);
				} else {
					var length = $item.attr('id').substr(11) - $item.prev().attr('id').substr(11);
				}
				if (length < 0) {
					length *= -1;
				}
			lowest = $item.attr('id').substr(11);
			if (lowest != $item.siblings(':first-child').attr('id').substr(11)) {
				lowest = $item.siblings(':first-child').attr('id').substr(11);
			}
			$item.parent().children().each(function() {
				$(this).attr('id', 'treeOption_' + lowest);
				lowest++;
			});
			buildEditor(i);
			navigateToOption($('#optionTree .current').attr('id').substr(11));*/
		}
	});
	addEditorListeners();
}

function initSyntax() {
	$('#p_edi, #editors, pre').addClass('loading');

	var editorModeHTML = require('ace/mode/html').Mode;
	var editorModeCSS = require('ace/mode/css').Mode;
	var editorModeJS = require('ace/mode/javascript').Mode;

	moduleAbout = ace.edit('moduleAbout');
	moduleAbout.setTheme('ace/theme/twilight');
	moduleAbout.getSession().setMode(new editorModeHTML());

	editorCSS = ace.edit('editorCSS');
	editorCSS.setTheme('ace/theme/twilight');
	editorCSS.getSession().setMode(new editorModeCSS());

	editorHeadJS = ace.edit('editorHeadJS');
	editorHeadJS.setTheme('ace/theme/twilight');
	editorHeadJS.getSession().setMode(new editorModeJS());

	editorBodyJS = ace.edit('editorBodyJS');
	editorBodyJS.setTheme('ace/theme/twilight');
	editorBodyJS.getSession().setMode(new editorModeJS());

	$('#p_edi, #editors, pre').removeClass('loading');
}

function makeNewOption() {
	var i = $('#p_edi h1').attr('id').substr(7),
		option = {
			description: 'New Option',
			isEnabled: true,
			tab: 'New Tab',
			section: 'New Section',
			type: 'checkbox',
			fields: [],
			head: {},
			load: {}
		};
		modules[i].options.push(option);
	chrome.extension.sendRequest({name: 'save', modules: modules}, function(response) {});
	buildEditor($('#p_edi h1').attr('id').substr(7));
	navigateToOption(modules[i].options.length - 1);
}

function deleteOption(j) {
	var i = $('#p_edi h1').attr('id').substr(7);
	modules[i].options.splice(j,1);
	chrome.extension.sendRequest({name: 'save', modules: modules}, function(response) {});
	buildEditor($('#p_edi h1').attr('id').substr(7));
}

function addEditorListeners() {	
	$('#saveEdits').addClass('disabled').text('Save Changes');
	$('#saveEdits').click(saveEdits);

	$('#moduleMetaLi').click(function(){
		$('#optionTree .current').removeClass('current');
		$(this).addClass('current');
		
		$('#moduleMeta').removeClass('hidden');
		$('#optionMeta, #editors').addClass('hidden');
	});

	$('#optionAdvanced').click(function() {
		$('#optionMeta .row.hidden').removeClass('hidden');
		$(this).parent().parent().addClass('hidden');
	});

	$('#newField').live('click', function() {
		var count = $(this).siblings('.fieldRow').length + 1;
		$(this).before($(
			'<div class="fieldRow" count="' + count + '">'
				+ '<input type="field" class="s desc normal" size="20" tip="field description">'
	 			+ '<input type="field" class="s var normal" size="10" tip="var name">'
				+ '<input class="isColor" id="isColor_' + count + '" type="checkbox">'
				+ '<label for="isColor_' + count + '" tip="whether this field should have a color picker attached to it."><div class="input"></div>Color Picker</label>'
				+ '<a href="javascript:;" class="removeField">&#10008;</a>'
			+ '</div>'
		));
	});

	$('#optionNew').click(makeNewOption);

	$('#optionTree > li > span, #optionTree > li > ul > li > span').click(function() {
		var $self = $(this);
		if ($self.parent().hasClass('collapsed')) {
			$self.parent()
				.animate({
					height: $self.parent().attr('min_height')
				}, 150, function() {
					$(this)
						.removeClass('collapsed')
						.attr('style','')
					;
				})
			;
		} else {
			$self
				.parent()
					.attr('min_height', $self.parent().height())
					.animate({
						height: 16
					}, 150)
					.addClass('collapsed')
			;
		}
	});

	$('#optionTree a:first-of-type').click(function() {
		$(this)
			.addClass('hidden')
			.next().removeClass('hidden')
			.next().removeClass('hidden')
		;
	});

	$('#optionTree a:nth-of-type(2)').click(function() {
		$(this)
			.addClass('hidden')
			.next().addClass('hidden')
			.end().prev().removeClass('hidden')
		;
	});

	$('#optionTree a:nth-of-type(3)').click(function() {
		deleteOption($(this).parent().attr('id').substr(11));
	});

	$('#optionTree ul ul span').click(function() {
		navigateToOption($(this).parent().attr('id').substr(11));
	});

	$('.removeField').live('click', function() {
		$(this).parent().remove();
		activateEditSaveButton();
	});

	$('#moduleMeta input, #optionMeta input').live('keypress', activateEditSaveButton);
	$('#moduleMeta input, #optionMeta input').live('keydown', checkForChange);
	$('#optionMeta input[type="checkbox"]').live('change', activateEditSaveButton);
	moduleAbout.getSession().on('change', activateEditSaveButton);
	editorCSS.getSession().on('change', activateEditSaveButton);
	editorHeadJS.getSession().on('change', activateEditSaveButton);
	editorBodyJS.getSession().on('change', activateEditSaveButton);

	addSaveHotkey();
}

function navigateToOption(j) {
	//if (editNavConfirmed()) {
		var module = modules[$('#p_edi h1').attr('id').substr(7)],
			option = module.options[j];

		if ($('#moduleMetaLi').hasClass('current')) {
			$('#optionMeta, #editors').removeClass('hidden');
			$('#moduleMeta').addClass('hidden');
		}
		$('#optionTree .current').removeClass('current');
		$('#treeOption_' + j).addClass('current');

		$('#optionMeta .row:not(:first-child)')
			.addClass('hidden')
		;
		$('#optionMeta .row:nth-child(4)').removeClass('hidden');
		$('#optionMeta .row:nth-child(5) .cell:last-child').html('<a id="newField" href="javascript:;">Add new Field</a>');

		if (option.fields != null && option.fields.length > 0) {
			for (var i = 0, l = option.fields.length; i < l; i++) {
				var isColor = option.fields[i].isColor ? 'checked ' : '';
				$('#newField').before($(
					'<div class="fieldRow" count="' + i + '">'
						+ '<input type="field" class="s desc ormal" size="20" value="' + option.fields[i].description + '" tip="field description">'
			 			+ '<input type="field" class="s var normal" size="10" value="' + option.fields[i].name + '" tip="var name">'
						+ '<input class="isColor" id="isColor_' + i + '" ' + isColor + 'type="checkbox">'
						+ '<label for="isColor_' + i + '" tip="whether this field should have a color picker attached to it."><div class="input"></div>Color Picker</label>'
						+ '<a href="javascript:;" class="removeField">&#10008;</a>'
					+ '</div>'
				));
			}
		}

		if (option.tab.length < 1 || option.tab == 'New Tab') {
			$('#optionMeta .row:nth-child(2)').removeClass('hidden');				
		}
		if (option.section.length < 1 || option.section == 'New Section') {
			$('#optionMeta .row:nth-child(3)').removeClass('hidden');				
		}

		$('#optionDescription').val(option.description);
		$('#optionTab').val(option.tab);
		$('#optionSection').val(option.section);

		$('#optionPreview').parent().html('<div id="optionPreview"></div><input type="file" onchange="updateScreenshot(this.files)">');
		if (option.hasOwnProperty('screen')) {
			$('#optionPreview').append('<img src="' + option.screen + '"/>');				
		}
		
		editorCSS.getSession().setValue('');
		editorHeadJS.getSession().setValue('');
		editorBodyJS.getSession().setValue('');

		if (option.hasOwnProperty('head') && option.head.hasOwnProperty('css')) {
			var source = option.head.css,
				content = source[0];
			for (var i = 1, l = source.length; i < l; i++) {
				content += '\n' + source[i];
			}
			editorCSS.getSession().setValue(content);
		}
		if (option.hasOwnProperty('head') && option.head.hasOwnProperty('js')) {
			var source = option.head.js,
				content = source[0];
			for (var i = 1, l = source.length; i < l; i++) {
				content += '\n' + source[i];
			}
			editorHeadJS.getSession().setValue(content);
		}
		if (option.hasOwnProperty('load') && option.load.hasOwnProperty('js')) {
			var source = option.load.js,
				content = source[0];
			for (var i = 1, l = source.length; i < l; i++) {
				content += '\n' + source[i];
			}
			editorBodyJS.getSession().setValue(content);
		}
		disableEditSaveButton();
	//}
}

function addSaveHotkey() {
	$(window).keydown(function(event) {
		if ((event.which == 83 && event.ctrlKey) || (event.which == 19)) {
			if ($('#p_edi').hasClass('current') && !$('#saveEdits').hasClass('disabled')) {
				saveEdits();
			} else if ($('#p_opt').hasClass('current') && !$('#saveOptions').hasClass('disabled')) {
				saveOptions();
			}
			
			event.preventDefault();
			return false;
		}
	});
}

function checkForChange() {
	if (event.which == 8) {
		activateEditSaveButton();		
	}
}
function activateEditSaveButton() {
	if (!hasEditorChanged) {
		hasEditorChanged = true;
		$('#saveEdits').removeClass('disabled').text('Save Changes');
	}
}

function disableEditSaveButton() {
	hasEditorChanged = false;
	$('#saveEdits').addClass('disabled').text('Save Changes');
}

/*function editNavConfirmed() {
	$('#saveEdits').addClass('hidden')
		.next().removeClass('hidden')
		.next().removeClass('hidden');
		$('#cancelNav').click(function() {
		$('#saveEdits').removeClass('hidden')
			.next().addClass('hidden')
			.next().addClass('hidden');
		return true;
	});
}*/

function saveEdits() {
	if (!$(this).hasClass('disabled')) {
		var i = $('#p_edi h1').attr('id').substr(7),
			j = null;
		if ($('#moduleMetaLi').hasClass('current')) {
			isOption = false;
			modules[i].name = $('#moduleName').val();
			modules[i].author = $('#moduleAuthor').val();
			modules[i].includes = $('#moduleIncludes').val().split(' ').join('');
			modules[i].version = $('#moduleVersion').val();
			
			var editsAbout = moduleAbout.getSession().getValue();
			if (editsAbout.length > 0) {
				modules[i].about = editsAbout.split('\n');
			} else if(modules[i].hasOwnProperty('about')) {
				delete modules[i].about;
			}
		} else {
			var j = $('#optionTree .current').attr('id').substr(11),
				option = modules[i].options[j],
				editsCSS = editorCSS.getSession().getValue(),
				editsHJS = editorHeadJS.getSession().getValue(),
				editsBJS = editorBodyJS.getSession().getValue();
			
			if (editsCSS.length > 0) {
				option.head.css = editsCSS.split('\n');
			} else if (option.hasOwnProperty('head') && option.head.hasOwnProperty('css')) {
				delete option.head.css;
			}
			if (editsHJS.length > 0) {
				option.head.js = editsHJS.split('\n');
			} else if (option.hasOwnProperty('head') && option.head.hasOwnProperty('js')) {
				delete option.head.js;
			}
			if (editsBJS.length > 0) {
				option.load.js = editsBJS.split('\n');
			} else if (option.hasOwnProperty('head') && option.head.hasOwnProperty('js')) {
				delete option.load.js;
			}

			option.description = $('#optionDescription').val();
			option.tab = $('#optionTab').val();
			option.section = $('#optionSection').val();
			option.fields = [];
			for (var k = 0, l = $('.fieldRow').length; k < l; k++) {
				var oldVal = null;
				console.log(modules[i].options[j].fields);
				console.log(k);
				if (modules[i].options[j].fields != null && modules[i].options[j].fields[k] != null) {
					oldVal = modules[i].options[j].fields[k].val;
				}
				option.fields[k] = {
					description: $('.fieldRow:nth-child(' + (k + 1) + ') .desc').val(),
					name: $('.fieldRow:nth-child(' + (k + 1) + ') .var').val(),
					isColor: $('.fieldRow:nth-child(' + (k + 1) + ') .isColor').is(':checked'),
					val: oldVal
				};
			}

			if ($('#optionPreview').children('img').length > 0) {
				option.screen = $('#optionPreview img').attr('src');
			}
			modules[i].options[j] = option;
		}

		chrome.extension.sendRequest({name: 'save', modules: modules}, function(response) {});
		hasEditorChanged = false;
		chrome.extension.sendRequest({name: 'reload', module: i}, function(response) {});
		buildEditor($('#p_edi h1').attr('id').substr(7));
		buildDashboard(false);
		if (j != null) {
			navigateToOption(j);
		}
		$('#saveEdits').addClass('disabled').text('Changes Saved!');
	}
}

function updateScreenshot(files) {
	var reader = new FileReader();
    	reader.onload = previewImage;
    	reader.readAsDataURL(files[0]);
}

function previewImage(e) { 
    $('#optionPreview').empty().append('<img src="' + e.target.result + '"/>');  
    activateEditSaveButton();
}