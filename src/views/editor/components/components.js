export class ImageComponent {
    model;
    view;

    constructor(DomComponents) {
        const imageType = DomComponents.getType('image');

        this.model = imageType.model.extend({
            init() {
                this.listenTo(this, 'change:zoomable', this.setZoomable);
            },
            defaults: {
                ...imageType.model.prototype.defaults,
                traits: [
                    ...imageType.model.prototype.defaults.traits,
                    {
                        label: 'Source',
                        name: 'src',
                        type: 'src',
                        changeProp: 1,
                    },
                    {
                        label: 'Zoomable',
                        type: 'checkbox',
                        name: 'zoomable',
                        changeProp: 1,
                    }
                ]
            },
            setZoomable(value) {
                console.log('Set Zoomable', value);
            }
        });

        this.view = imageType.view;
    }
}