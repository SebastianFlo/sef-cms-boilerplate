const LayerPanel = {
    id: 'layers',
    el: '.panel__right',
    // Make the panel resizable
    resizable: {
        maxDim: 550,
        minDim: 200,
        tc: 0, // Top handler
        cl: 1, // Left handler
        cr: 0, // Right handler
        bc: 0, // Bottom handler
        // Being a flex child we need to change `flex-basis` property
        // instead of the `width` (default)
        keyWidth: 'flex-basis',
    }
};

const TopPanel = {
    id: 'panel-top',
    el: '.panel__top',
};

const BasicActionsPanel = {
    id: 'basic-actions',
    el: '.panel__basic-actions',
    buttons: [
        {
            id: 'visibility',
            active: true, // active by default
            className: 'btn-toggle-borders',
            label: '<u>B</u>',
            command: 'sw-visibility', // Built-in command
        }, {
            id: 'export',
            className: 'btn-open-export',
            label: 'Exp',
            command: 'export-template',
            context: 'export-template', // For grouping context of buttons from the same panel
        }, {
            id: 'show-json',
            className: 'btn-show-json',
            label: 'JSON',
            context: 'show-json',
            command(editor) {
                editor.Modal.setTitle('Components JSON')
                    .setContent(`<textarea style="width:100%; height: 250px;">${JSON.stringify(editor.getComponents())}</textarea>`)
                    .open();
            },
        }
    ],
};

const SwitcherPanel = {
    id: 'panel-switcher',
    el: '.panel__switcher',
    buttons: [
        {
            id: 'show-layers',
            label: 'Layers',
            command: 'show-layers',
            // Once activated disable the possibility to turn it off
            togglable: false,
        }, {
            id: 'show-style',
            label: 'Styles',
            command: 'show-styles',
            togglable: false,
        }, {
            id: 'show-traits',
            label: 'Traits',
            command: 'show-traits',
            togglable: false,
        }, {
            id: 'show-blocks',
            active: true,
            label: 'Blocks',
            command: 'show-blocks',
            togglable: false,
        }
    ]
};

const DevicesPanel = {
    id: 'panel-devices',
    el: '.panel__devices',
    buttons: [{
        id: 'device-desktop',
        label: 'D',
        command: 'set-device-desktop',
        active: true,
        togglable: false,
    }, {
        id: 'device-mobile',
        label: 'M',
        command: 'set-device-mobile',
        togglable: false,
    }]
}

export const DefaultPanels = [
    LayerPanel,
    TopPanel,
    BasicActionsPanel,
    SwitcherPanel,
    DevicesPanel,
];
