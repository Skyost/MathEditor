const MIME_TYPE = 'text/plain';

var texts = {
	'button-editor': 'Editor',
	'dialog-about-title': 'About MathEditor',
	'dialog-about-message-1': 'A text editor that supports math input thanks to CKEditor and its plugins.',
	'dialog-about-message-2': 'Softwares used :',
	'dialog-about-message-3': 'Created with /heart/ by /skyost/.',
	'dialog-about-message-4': 'Licensed under /gnugpl/.',
	'dialog-about-button-issue': 'Bug, issue or idea ?',
	'dialog-update-title': 'Update available !',
	'dialog-update-message': 'An update of this software is available ! It will be available in your browser when you will refresh this page.',
	'dialog-update-button-refresh': 'Refresh this page',
	'alert-changes': 'Your changes are not saved !\nAre you sure you want to leave ?'
}

var editor;
var lastSavedData = '';

function toggleElement(element) {
	element = $(element);
	if(element.css('display') == 'none') {
		element.css('display', '');
		return;
	}
	element.css('display', 'none');
}

function openEditor() {
	toggleElement('.row');
	toggleElement('.editor');
	editor.execCommand('maximize');
}

function openDocument(event) {
	var file = event.target.files[0];
	if(!file) {
		return;
	}
	var reader = new FileReader();
	reader.onload = function(event) {
		editor.setData(event.target.result);
		lastSavedData = editor.getData();
		openEditor();
	};
	reader.readAsText(file);
}

/*
* Took on http://html5-demos.appspot.com/static/a.download.html.
*/

function saveDocument(editor) {
	var data = editor.getData();
	window.URL = window.webkitURL || window.URL;
	var prevLink = $('.blob-download');
	if(prevLink) {
		window.URL.revokeObjectURL(prevLink.attr('href'));
		prevLink.remove();
	}
	var bb = new Blob([data], {type: MIME_TYPE});
	var a = document.createElement('a');
	a.class = 'blob-download';
	a.download = 'document.html';
	a.href = window.URL.createObjectURL(bb);
	a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(':');
	a.draggable = true; // Don't really need, but good practice.
	a.onclick = function(event) {
		if('disabled' in this.dataset) {
			return false;
		}
		a.dataset.disabled = true;
		setTimeout(function() {
			window.URL.revokeObjectURL(a.href);
		}, 1500);
	};
	a.click();
	lastSavedData = data;
}

function openCredits() {
	BootstrapDialog.show({
		type: BootstrapDialog.TYPE_INFO,
		title: texts['dialog-about-title'],
		message:
			'<strong>' + texts['dialog-about-message-1'] + '</strong><br/>' +
			texts['dialog-about-message-2'] + '<br/><ul style="margin-top: 0.4em; padding-left: 1.4em;">' +
			'<li><a href="http://jquery.com/">jQuery v2.2.2</a></li>' +
			'<li><a href="http://getbootstrap.com/">Bootstrap v3.3.6</a></li>' +
			'<li><a href="https://github.com/nakupanda/bootstrap3-dialog">BootstrapDialog v1.35.0</a></li>' +
			'<li><a href="http://ckeditor.com/">CKEditor v4.5.7</a></li>' +
			'<li><a href="https://github.com/eligrey/Blob.js/">Blob.js 20140724</a></li>' +
			'<li><a href="https://github.com/coderifous/jquery-localize">jquery.localize.js v0.1.0</a></li>' +
			'<li><a href="https://www.mathjax.org/">MathJax v2.6.1</a></li>' +
			'</ul>' +
			'<strong>' + texts['dialog-about-message-3'].replace('/heart/', '<span id="heartbeat" class="glyphicon glyphicon-heart"></span>').replace('/skyost/', '<a href="https://www.skyost.eu">Skyost</a>') + ' ' +
			texts['dialog-about-message-4'].replace('/gnugpl/', '<a href="http://www.gnu.org/licenses/gpl-3.0.html">GNU GPL v3</a>') + '</strong>',
		buttons: [
		{
			icon: 'glyphicon glyphicon-console',
			cssClass: 'btn-default',
			label: 'Github',
			action: function(dialog) {
				window.open('https://github.com/Skyost/MathEditor', '_self');
			}
		},
		{
			icon: 'glyphicon glyphicon-user',
			cssClass: 'btn-default',
			label: texts['dialog-about-button-issue'],
			action: function(dialog) {
				window.open('https://github.com/Skyost/MathEditor/issues', '_self');
			}
		},
		{
			icon: 'glyphicon glyphicon-heart',
			cssClass: 'btn-info',
			label: 'OK',
			action: function(dialog) {
				dialog.close();
			}
		}]
	});
}

function closeEditor(editor) {
	editor.execCommand('maximize');
	toggleElement('.editor');
	toggleElement('.row');
	if(editor.getData() != '') {
		$('#button-new').html('<span class="glyphicon glyphicon-text-background" aria-hidden="true"></span> ' + texts['button-editor']);
	}
}

function showUpdateDialogIfNeeded() {
	try {
		window.applicationCache.addEventListener('updateready', function() {
			BootstrapDialog.show({
				type: BootstrapDialog.TYPE_INFO,
				title: texts['dialog-update-title'],
				message: texts['dialog-update-message'],
				buttons: [
				{
					icon: 'glyphicon glyphicon-refresh',
					cssClass: 'btn-default',
					label: texts['dialog-update-button-refresh'],
					action: function(dialog) {
						window.location.reload();
					}
				},
				{
					icon: 'glyphicon glyphicon-ok',
					cssClass: 'btn-info',
					label: 'OK',
					action: function(dialog) {
						dialog.close();
					}
				}]
			});
		}, false);
		window.applicationCache.update();
	}
	catch(ex) {
		console.error(ex);
	}
}

$(document).ready(function() {
	$('[data-localize]').localize('translation', {
		pathPrefix: './assets/translations',
		callback: function(data, defaultCallback) {
			defaultCallback(data);
			$('[data-localize]').each(function() {
				delete(data[$(this).attr('data-localize')]);
			});
			texts = data;
		}
	});
	showUpdateDialogIfNeeded();
	CKEDITOR.timestamp = null;
	editor = CKEDITOR.replace($('#matheditor').get(0), {
		removeButtons: 'Maximize',
		extraPlugins: 'customclose,customsave,print,justify,font,mathjax',
		mathJaxLib: './assets/js/mathjax-2.6.1/MathJax.js?config=TeX-AMS_HTML'
	});
	CKEDITOR.on('instanceReady', function(event) {
		$('#button-new').click(openEditor);
		var fileInput = $('#file-input');
		fileInput.get(0).addEventListener('change', openDocument, false);
		$('#button-open').click(function() {
			var exitMessage = getExitMessage();
			if(exitMessage != undefined && !confirm(exitMessage)) {
				return;
			}
			fileInput.click();
		});
		$('.header h2').click(openCredits);
	});
});

$(window).load(function() {
	$('.loading').fadeOut(500, function() {
		toggleElement('.header');
		toggleElement('.nav');
	});
});

$(window).bind('beforeunload', function() {
	return getExitMessage();
});

function getExitMessage() {
	if(lastSavedData != editor.getData()) {
		return texts['alert-changes'];
	}
}