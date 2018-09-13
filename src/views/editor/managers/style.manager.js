export class StyleManager {
    appendTo = '.styles-container';
    sectors = [];

    alignmentSector = {
        name: 'Alignment',
        open: false,
        buildProps: ['text-align'],
    };

    dimensionSector = {
        name: 'Dimension',
        open: false,
        // Use built-in properties
        buildProps: ['width', 'min-height', 'padding'],
        // Use `properties` to define/override single property
        properties: [
            {
                property: 'width', // CSS property (if buildProps contains it will be extended)
                // Type of the input,
                // options: integer | radio | select | color | slider | file | composite | stack
                type: 'integer',
                name: 'The width', // Label for the property
                units: ['px', '%'], // Units, available only for 'integer' types
                defaults: 'auto', // Default value
                min: 0, // Min value, available only for 'integer' types
            }
        ]
    };

    extraSector = {
        name: 'Extra',
        open: false,
        buildProps: ['color', 'background-color', 'box-shadow', 'custom-prop'],
        properties: [
            {
                id: 'custom-prop',
                name: 'Custom Label',
                property: 'font-size',
                type: 'select',
                defaults: '32px',
                options: [
                    { value: '12px', name: 'Tiny' },
                    { value: '18px', name: 'Medium' },
                    { value: '32px', name: 'Big' },
                ],
            }
        ]
    };

    constructor() {
        this.sectors = [
            this.alignmentSector,
            this.dimensionSector,
            this.extraSector
        ]
    }
}
