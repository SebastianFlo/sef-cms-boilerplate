export class AssetManager {
    assets = [
        'http://placehold.it/350x250/78c5d6/fff/image1.jpg',
        {
            src: 'http://placehold.it/700x250/459ba8/fff/image2.jpg',
            width: 700,
            height: 250
        },
        {
            src: 'http://placehold.it/350x250/79c267/fff/image3.jpg',
            height: 350,
            width: 250
        },
    ];

    uploadText = 'Dropper filer here or click to upload';
    noAssets = 'No assets here';
    dropzone = 0;
    modalTitle = 'Select Billede';
}
