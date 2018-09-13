export const SectionBlock = {
    id: 'section',
    label: '<b>Section</b>',
    attributes: { class: 'gjs-block-section' },
    content: `<section>
                    <h1 style="font-size: 32px">This is a simple title</h1>
                    <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
                </section>`,
    activate: true,
}

export const TextBlock = {
    id: 'text',
    label: 'Text',
    content: '<div data-gjs-type="text">Insert your text here</div>',
    activate: true,
}

export const ImageBlock = {
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