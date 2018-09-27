<template>
    <section>
        <div class="panel__top">
            <div class="panel__basic-actions"></div>
            <div class="panel__devices"></div>
            <div class="panel__switcher"></div>
        </div>
        <div class="editor-row">
            <div class="editor-canvas">
                <div id="gjs" style="overflow:hidden;">
                    <img alt="SEF CMS logo" src="../../assets/logo.png"  width="200">
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
    import Vue from 'vue'

    // Managers
    import { StorageManager } from './managers/storage.manager.js';
    import { AssetManager } from './managers/asset.manager.js';
    import { LayerManager } from './managers/layer.manager.js';
    import { SelectorManager } from './managers/selector.manager.js';
    import { StyleManager } from './managers/style.manager.js';
    import { TraitManager } from './managers/trait.manager.js';
    import { BlockManager } from './managers/block.manager.js';
    import { DeviceManager } from './managers/device.manager.js';

    // Panels
    import { DefaultPanels } from './panels/default.panels.js';

    // Customizer Classes
    import { CustomCommands } from './custom/custom.commands.js';
    import { CustomTraits } from './custom/custom.traits.js';

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

            this.customCommands = new CustomCommands(this);
            this.customTraits = new CustomTraits(this);
            // this.defineComponents(this.editor);
            // this.addCustomBlocks(this.editor);
            // this.addListeners(this.editor);

            this.connectToVue(this.editor);
        },
        methods: {
            change() {
                this.$emit('change', this.editor.getHtml());
            },
            generateEditor() {
                return grapesjs.init({
                    container: '#gjs',
                    fromElement: true,
                    height: '100%',
                    layerManager: new LayerManager(),
                    selectorManager: new SelectorManager(),
                    styleManager: new StyleManager(),
                    storageManager: new StorageManager(),
                    assetManager: new AssetManager(),
                    traitManager: new TraitManager(),
                    blockManager: new BlockManager(),
                    deviceManager: new DeviceManager(),
                    panels: {
                        defaults: DefaultPanels,
                    },
                })
            },
            defineComponents(editor) {
                // // Get DomComponents module
                // const comps = editor.DomComponents;

                // // Get the model and the view from the default Component type
                // const defaultType = comps.getType('default');
                // const defaultModel = defaultType.model;
                // const defaultView = defaultType.view;
                // TODO: Find if this is needed
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
            },
            addListeners(editor) {
                editor.on('change:device', () => {
                    console.log('Current device: ', editor.getDevice());
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

    .gjs-mdl-content {
        text-align: left;
    }

    .gjs-cm-editor-c {
        width: 100%;
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

    .panel__devices {
        position: initial;
    }
</style>