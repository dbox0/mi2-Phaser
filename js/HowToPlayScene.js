

class HowToPlay extends Phaser.Scene {
    constructor() {
        super({ key: "HowToPlayScene" })
        this.buttons = [];
        this.buttonLabels = ['MenueScene'];
        this.selectedButtonIndex = 0;
    }

    preload() {
        // Bild preloaden
        this.load.image('panel', './content/ui/panel_brown.png');
        this.load.image('button1', './content/ui/buttonLong_brown.png');
        this.load.image('button1Active', './content/ui/buttonLong_brown_pressed.png');
        this.load.image('cursor', './content/ui/cursorGauntlet_grey.png');
    }

    create() {
        const { width, height  } = this.scale

        // Bild hinzufügen und zentrieren
        const background = this.add.image(width / 2, height / 2, 'panel')
            .setDisplaySize(475, 300)

        // Text hinzufügen und zentrieren
        const instructionText = this.add.text(background.x, background.y, 'Welcome to the game!\nUse WASD keys to move.\nUse your Cursor to aim.\n\nnow you are pretty much ready to go!\nJust sail ahead and shoot at everything\n that stands in your way but watch out,\n they might shoot back ;)\n\npress Esc to go back to Pause-Menu\n', {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: 'Arial',
            align: 'center'
        })

        // Textursprungspunkt setzen, um Text zu zentrieren
        instructionText.setOrigin(0.5, 0.5)


        // Back button Erstellen
        const backButton = this.add.image(width * 0.5, height * 0.8, 'button1')
            .setDisplaySize(75, 50)
            .setInteractive() // Button interaktiv machen
        
        var a = this.add.text(backButton.x, backButton.y, 'Back')
            .setOrigin(0.5)

            backButton.on('pointerdown', () => {
                this.confirmSelection()
            })
    
            backButton.on('pointerover', () => {
                this.selectButton(this.buttons.indexOf(backButton))
            })
    
            backButton.on('pointerout', () => {
                this.selectButton(this.selectedButtonIndex)
            })


        // Store buttons in an array
        this.buttons.push(backButton)

        this.selectButton(0)

        this.cursors = this.input.keyboard.createCursorKeys()

        this.input.setDefaultCursor('url(content/ui/cursorGauntlet_grey.png), pointer');
        //this.cursor.setScale(0.5); // Größe des Cursors anpassen

        this.input.on('pointermove', (pointer) => {
           // this.cursor.setPosition(pointer.x, pointer.y)
        })
    }


    update() {
        const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up)
        const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down)
        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
        
        if (upJustPressed) {
            this.selectNextButton(-1)
        } else if (downJustPressed) {
            this.selectNextButton(1)
        } else if (spaceJustPressed) {
            this.confirmSelection()
        }
    }


    selectButton(index) {
        const currentButton = this.buttons[this.selectedButtonIndex]
        if (currentButton) {
            currentButton.setTexture('button1') // Reset to default texture
            currentButton.clearTint()
        }

        const button = this.buttons[index]
        if (button) {
            button.setTexture('button1Active') // Change to active texture
            button.setTint(0x66ff7f)


            this.selectedButtonIndex = index
        }
    }


    selectNextButton(change = 1) {
        let index = this.selectedButtonIndex + change

        if (index >= this.buttons.length) {
            index = 0
        } else if (index < 0) {
            index = this.buttons.length - 1
        }

        this.selectButton(index)
    }


    confirmSelection() {
        const selectedLabel = this.buttonLabels[this.selectedButtonIndex]
                this.scene.stop('MenueScene');
                this.scene.start('MenueScene');
                
            

        }        
    }

    




