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
                <div style="display: none" class="layers-container"></div>
                <div style="display: none" class="styles-container"></div>
                <div style="display: none" class="traits-container"></div>
                <div class="blocks-container"></div>
            </div>
        </div>
    </section>
</template>

<script>
    import grapesjs from 'grapesjs';
    import axios from 'axios';
    import Drawing from '@/components/Drawing.vue';
    import Vue from 'vue'
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
        components: {
            'drawing': Drawing
        },
        mounted: function () {
            editorVM = this;
            this.editor = this.generateEditor();
            this.defineCommands(this.editor);
            this.expandTraints(this.editor);
            this.expandComponents(this.editor);
            this.defineComponents(this.editor);
            this.addCustomBlocks(this.editor);

            this.connectToVue(this.editor);
        },
        methods: {
            change() {
                this.$emit('change', this.editor.getHtml());
            },
            generateEditor() {
                console.log('Editor: generating editor');

                const layerManager = {
                    appendTo: '.layers-container'
                };

                const selectorManager = {
                    appendTo: '.styles-container'
                };

                const styleManager = {
                    appendTo: '.styles-container',
                    sectors: [
                        {
                            name: 'Alignment',
                            open: false,
                            buildProps: ['text-align'],
                            }, {
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
                        }
                    ]
                };

                const storageManager = { type: null };

                const traitManager = {
                    appendTo: '.traits-container',
                };

                // TODO: Define blocks as separate components. Maybe Vue comp?
                const blockManager = {
                    appendTo: '.blocks-container',
                    blocks: [
                        {
                            id: 'section',
                            label: '<b>Section</b>', // You can use HTML/SVG inside labels
                            attributes: { class: 'gjs-block-section' },
                            content: `<section>
                                <h1 style="font-size: 32px">This is a simple title</h1>
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
                        }, {
                            id: 'sef-drawing',
                            label: 'Drawing',
                            select: true,
                            // You can pass components as a JSON instead of a simple HTML string,
                            // in this case we also use a defined component type `image`
                            content: {
                                style: { width: '350px', height: '400px' },
                                components: `
                                    <drawing src="https://via.placeholder.com/350x150"></drawing>
                                `,
                            },
                            // This triggers `active` event on dropped components and the `image`
                            // reacts by opening the AssetManager
                            activate: true,
                        }
                    ]
                };

                const sefPanels = [
                    {
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
                                active: false,
                                label: 'Layers',
                                command: 'show-layers',
                                // Once activated disable the possibility to turn it off
                                togglable: false,
                            }, {
                                id: 'show-style',
                                active: false,
                                label: 'Styles',
                                command: 'show-styles',
                                togglable: false,
                            }, {
                                id: 'show-traits',
                                active: false,
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
                    }
                ];

                return grapesjs.init({
                    container: '#gjs',
                    fromElement: true,
                    height: '100%',
                    layerManager,
                    selectorManager,
                    styleManager,
                    storageManager,
                    traitManager,
                    blockManager,
                    panels: {
                        defaults: [ ...sefPanels ],
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

                editor.Commands.add('show-traits', {
                    run() {
                        editorVM.showContainer('.traits-container');
                    },
                    stop() {
                        editorVM.hideContainer('.traits-container');
                    }
                });
            },
            expandTraints(editor) {
                const traitManager = editor.TraitManager;
                traitManager.addType('src', {
                    onValueChange: function () {
                        // this.target.attributes.src = this.model.get('value');
                        this.target.set('src', this.model.get('value'));
                    }
                })
            },
            expandComponents(editor) {
                const dc = editor.DomComponents;
                const imageType = dc.getType('image');

                dc.addType('image', {
                    model: imageType.model.extend({
                        init() {
                            this.listenTo(this, 'change:zoomable', this.setZoomable);
                        },
                        defaults: {
                            ...imageType.model.prototype.defaults,
                            traits:[
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
                    }),
                    view: imageType.view
                });
            },
            defineComponents(editor) {
                // Get DomComponents module
                const comps = editor.DomComponents;

                // Get the model and the view from the default Component type
                const defaultType = comps.getType('default');
                const defaultModel = defaultType.model;
                const defaultView = defaultType.view;

                // The `input` will be the Component type ID
                comps.addType('drawing', {
                    // Define the Model
                    model: defaultModel.extend({
                        init() {
                            this.listenTo(this, 'change:image-link', this.updateImage);
                        },
                        // Extend default properties
                        defaults: Object.assign({}, defaultModel.prototype.defaults, {
                            traits: [
                                {
                                    type: 'link',
                                    label: 'Image Link',
                                    name: 'image-link',
                                    changeProp: 1,
                                },{
                                    type: 'text',
                                    label: 'Name',
                                    name: 'name',
                                    changeProp: 1,
                            }],
                        }),
                        updateImage(model) {
                            this.view.el.firstChild.firstChild.src = model.get('image-link');
                        }
                    },
                    {
                        isComponent: function(el) {
                            if(el.tagName == 'DRAWING'){
                                return { type: 'drawing' };
                            }
                        },
                    }),

                    // Define the View
                    view: defaultType.view.extend({
                        // Bind events
                        events: {
                                // If you want to bind the event to children elements
                                // 'click .someChildrenClass': 'methodName',
                                click: 'handleClick', dblclick: function(){
                                    alert('Hi!');
                                }
                            },

                        // It doesn't make too much sense this method inside the component
                        // but it's ok as an example
                        randomHex: function() {
                            return '#' + Math.floor(Math.random()*16777216).toString(16);
                        },

                        handleClick: function(e) {
                            this.model.set('style', {color: this.randomHex()}); // <- Affects the final HTML code
                            this.el.style.backgroundColor = this.randomHex(); // <- Doesn't affect the final HTML code
                            // Tip: updating the model will reflect the changes to the view, so, in this case,
                            // if you put the model change after the DOM one this will override the backgroundColor
                            // change made before
                        },

                        // The render() should return 'this'
                        render: function () {
                            var ComponentClass = Vue.extend(Drawing);
                            var instance = new ComponentClass({
                                propsData: {
                                    url: 'https://via.placeholder.com/350x150'
                                }
                            }
                            );
                            instance.$mount() // pass nothing
                            const drawingEl = instance.$el;

                            // Extend the original render method
                            // this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
                            defaultType.view.prototype.render.apply(this, arguments);
                            this.el = drawingEl;
                            return this;
                        },
                    }),
                });
            },
            addCustomBlocks(editor) {
                const blockManager = editor.BlockManager;

                blockManager.add('input', {
                    label: 'Input',
                    content: '<input type="text" placeholder="Add input here">',
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
            connectToVue(editor) {
                editor.on('change', this.change); // vue helper method

                editor.on('component:add', () => {
                // when new component is added, re-render the vue components to normal html
                    this.$forceUpdate();
                });
            }
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
        color: red;
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