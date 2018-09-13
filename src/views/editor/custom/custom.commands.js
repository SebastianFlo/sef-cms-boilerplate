let editorVM;

export class CustomCommands {
    constructor(grapes) {
        editorVM = grapes;

        grapes.editor.Commands.add('show-layers', {
            run() {
                // TODO: See how this can be avoided
                editorVM.showContainer('.layers-container');
            },
            stop() {
                editorVM.hideContainer('.layers-container');
            }
        });

        grapes.editor.Commands.add('show-styles', {
            run() {
                editorVM.showContainer('.styles-container');
            },
            stop() {
                editorVM.hideContainer('.styles-container');
            }
        });

        grapes.editor.Commands.add('show-blocks', {
            run() {
                editorVM.showContainer('.blocks-container');
            },
            stop() {
                editorVM.hideContainer('.blocks-container');
            }
        });

        grapes.editor.Commands.add('show-traits', {
            run() {
                editorVM.showContainer('.traits-container');
            },
            stop() {
                editorVM.hideContainer('.traits-container');
            }
        });

        grapes.editor.Commands.add('set-device-desktop', {
            run: (editor) => {
                editor.setDevice('Desktop')
            }
        });

        grapes.editor.Commands.add('set-device-mobile', {
            run: (editor) => {
                editor.setDevice('Mobile')
            }
        });
    }
}