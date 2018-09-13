export class DeviceManager {
    devices = [];

    desktop = {
        name: 'Desktop',
        width: ''
    };

    mobile = {
        name: 'Mobile',
        width: '320px', // this value will be used on canvas width
        widthMedia: '480px', // this value will be used in CSS @media
    }

    constructor() {
        this.devices = [
            this.desktop,
            this.mobile
        ]
    }

}
