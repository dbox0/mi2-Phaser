

class HowToPlay extends Phaser.Scene {
    constructor() {
        super({ key: "HowToPlayScene" })
    }

    preload() {
        // Bild preloaden
        this.load.image('panel', './content/ui/panel_brown.png')
    }

    create() {
        const { width, height  } = this.scale

        // Bild hinzufügen und zentrieren
        const background = this.add.image(width / 2, height / 2, 'panel')

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



