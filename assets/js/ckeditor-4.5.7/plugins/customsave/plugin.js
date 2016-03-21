/*
* Custom plugin for mathseditor.
*/

CKEDITOR.plugins.add('customsave', {
    icons: 'customsave',
    init: function(editor) {
		editor.addCommand('customsave', {
			exec: function(e) {
				saveDocument(e);
			}
		});
		editor.ui.addButton('customsave', {
			label: 'Save document',
			command: 'customsave',
			toolbar: 'document'
		});
    }
});