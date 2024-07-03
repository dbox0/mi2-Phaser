

class HowToPlay extends Phaser.Scene {
    constructor() {
        super({ key: "How2PlayScene" })
    }

    preload() {
        // Bild preloaden
        this.load.image('background', 'path/to/your/image.png')
    }

    create() {
        console.log('Hello');
        const { width, height } = this.scale

        // Bild hinzufügen und zentrieren
        const background = this.add.image(width / 2, height / 2, 'background')

        // Text hinzufügen und zentrieren
        const instructionText = this.add.text(background.x, background.y, 'Welcome to the game!\nUse arrow keys to move.', {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: 'Arial',
            align: 'center'
        })

        // Textursprungspunkt setzen, um Text zu zentrieren
        instructionText.setOrigin(0.5, 0.5)
    }
}



