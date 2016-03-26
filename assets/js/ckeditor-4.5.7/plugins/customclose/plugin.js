/*
* Custom plugin for MathEditor.
*/

CKEDITOR.plugins.add('customclose', {
    icons: 'customclose',
    init: function(editor) {
		editor.addCommand('customclose', {
			exec: function(e) {
				closeEditor(e);
			}
		});
		editor.ui.addButton('customclose', {
			label: 'Close editor',
			command: 'customclose',
			toolbar: 'about'
		});
    }
});