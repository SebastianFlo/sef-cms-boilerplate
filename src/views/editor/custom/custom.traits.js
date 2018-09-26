export class CustomTraits {
    traitManager;

    srcTrait = {
        onValueChange: function () {
            this.target.set('src', this.model.get('value'));
        }
    }

    constructor(editor) {
        this.traitManager = editor.TraitManager;
        this.traitManager.addType('src', this.srcTrait);
    }
}