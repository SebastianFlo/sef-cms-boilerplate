<template>
    <section>
        <div class="panel__top">
            <div class="panel__basic-actions"></div>
            <div class="panel__switcher"></div>
        </div>
        <div class="editor-row">
            <div class="editor-canvas">
                <div id="gjs" style="overflow:hidden;">
                    <img alt="SEF CMS logo" src="../assets/logo.png"  width="200">
                </div>
            </div>
            <div class="panel__right">
                <div class="layers-container"></div>
                <div class="styles-container"></div>
                <div class="traits-container"></div>
                <div class="blocks-container"></div>
            </div>
        </div>
    </section>
</template>

<script>
    import grapesjs from 'grapesjs';
    import axios from 'axios';
    // import 'grapesjs-blocks-basic';
    // import 'grapesjs-preset-webpage';
    let editorVM;

    export default {
        name: 'editor',
        data: function () {
            return {
                editor: null,
                templateId: 2
            }
        },
        mounted: function () {
            editorVM = this;
            this.editor = this.generateEditor();
            this.defineCommands(this.editor);
        },
        methods: {
            generateEditor() {
                console.log('Editor: generating editor');
                return grapesjs.init({
                    container: '#gjs',
                    fromElement: true,
                    height: '100%',
                    layerManager: {
                        appendTo: '.layers-container'
                    },
                    selectorManager: {
                        appendTo: '.styles-container'
                    },
                    styleManager: {
                        appendTo: '.styles-container',
                        sectors: [{
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
                        }, {
                            name: 'Extra',
                            open: false,
                            buildProps: ['background-color', 'box-shadow', 'custom-prop'],
                            properties: [
                                {
                                    id: 'custom-prop',
                                    name: 'Custom Label',
                                    property: 'font-size',
                                    type: 'select',
                                    defaults: '32px',
                                    // List of options, available only for 'select' and 'radio'  types
                                    options: [
                                        { value: '12px', name: 'Tiny' },
                                        { value: '18px', name: 'Medium' },
                                        { value: '32px', name: 'Big' },
                                    ],
                                }
                            ]
                        }]
                    },
                    storageManager: { type: null },
                    traitManager: {
                        appendTo: '.traits-container',
                    },
                    blockManager: {
                        appendTo: '.blocks-container',
                        blocks: [
                            {
                                id: 'section',
                                label: '<b>Section</b>', // You can use HTML/SVG inside labels
                                attributes: { class: 'gjs-block-section' },
                                content: `<section>
                                <h1>This is a simple title</h1>
                                <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
                                </section>`,
                            },
                            {
                                id: 'text',
                                label: 'Text',
                                content: '<div data-gjs-type="text">Insert your text here</div>',
                            }, {
                                id: 'image',
                                label: 'Image',
                                // Select the component once it's dropped
                                select: true,
                                // You can pass components as a JSON instead of a simple HTML string,
                                // in this case we also use a defined component type `image`
                                content: { type: 'image' },
                                // This triggers `active` event on dropped components and the `image`
                                // reacts by opening the AssetManager
                                activate: true,
                            }
                        ]
                    },
                    panels: {
                        defaults: [
                            {
                                id: 'layers',
                                el: '.panel__right',
                                // Make the panel resizable
                                resizable: {
                                    maxDim: 350,
                                    minDim: 200,
                                    tc: 0, // Top handler
                                    cl: 1, // Left handler
                                    cr: 0, // Right handler
                                    bc: 0, // Bottom handler
                                    // Being a flex child we need to change `flex-basis` property
                                    // instead of the `width` (default)
                                    keyWidth: 'flex-basis',
                                }
                            },
                            {
                                id: 'panel-top',
                                el: '.panel__top',
                            },
                            {
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
                            },
                            {
                                id: 'panel-switcher',
                                el: '.panel__switcher',
                                buttons: [
                                {
                                    id: 'show-layers',
                                    active: true,
                                    label: 'Layers',
                                    command: 'show-layers',
                                    // Once activated disable the possibility to turn it off
                                    togglable: false,
                                }, {
                                    id: 'show-style',
                                    active: true,
                                    label: 'Styles',
                                    command: 'show-styles',
                                    togglable: false,
                                }, {
                                    id: 'show-traits',
                                    active: true,
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
                                ],
                            }
                        ]
                    },
                })
            },
            defineCommands(editor) {
                // Define commands
                editor.Commands.add('show-layers', {
                    run() {
                        editorVM.showContainer('.layers-container');
                    },
                    stop() {
                        editorVM.hideContainer('.layers-container');
                    }
                });

                editor.Commands.add('show-styles', {
                    run() {
                        editorVM.showContainer('.styles-container');
                    },
                    stop() {
                        editorVM.hideContainer('.styles-container');
                    }
                });

                editor.Commands.add('show-blocks', {
                    run() {
                        editorVM.showContainer('.blocks-container');
                    },
                    stop() {
                        editorVM.hideContainer('.blocks-container');
                    }
                });
            },
            getElInRow(row, container) {
                return row.querySelector(container);
            },
            showContainer(container) {
                this.getElInRow(this.editor.getContainer().closest('.editor-row'), container).style.display = '';
            },
            hideContainer(container) {
                this.getElInRow(this.editor.getContainer().closest('.editor-row'), container).style.display = 'none';
            },
        }
    }
</script>

<style lang="scss">
    section {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        width: 100%;
    }

    #gjs {
        border: 3px solid #444;
    }

    .gjs-cv-canvas {
        top: 0;
        width: 100%;
        height: 100%;
    }

    .gjs-block {
        width: auto;
        height: auto;
        min-height: auto;
    }

    .panel__top {
        padding: 0;
        width: 100%;
        display: flex;
        position: initial;
        justify-content: center;
        justify-content: space-between;
        flex: 1;
    	min-height: 35px;
    }

    .panel__basic-actions {
        position: initial;
    }

    .editor-row {
        display: flex;
        justify-content: flex-start;
        align-items: stretch;
        flex-wrap: nowrap;
        flex: 20;
    }

    .editor-canvas {
        flex-grow: 1;
    }

    .panel__right {
        flex-basis: 230px;
        position: relative;
        overflow-y: auto;
    }

    .panel__switcher {
        position: initial;
    }
</style>