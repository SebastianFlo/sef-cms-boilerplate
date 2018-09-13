import { ImageComponent } from '../components/components.js';

export class CustomComponents {
    DomComponents;

    constructor(editor) {
        this.defineComponents(editor);
        this.expandComponents(editor);
    }

    defineComponents(editor) {
        // Get DomComponents module
        const comps = editor.DomComponents;

        // Get the model and the view from the default Component type
        // const defaultType = comps.getType('default');
        // const defaultModel = defaultType.model;
        // const defaultView = defaultType.view;
    }

    expandComponents(editor) {
        this.DomComponents.addType('image', new ImageComponent(editor.DomComponents));
    }
}