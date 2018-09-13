import {
    SectionBlock,
    TextBlock,
    ImageBlock
} from '../blocks/default.blocks.js';

export class BlockManager {
    appendTo = '.blocks-container';
    blocks = []

    constructor() {
        this.blocks = [
            SectionBlock,
            TextBlock,
            ImageBlock
        ]
    }
}
