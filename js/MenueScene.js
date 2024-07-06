

class MenueScene extends Phaser.Scene {
    constructor() {
        super({ key: "MenueScene" })
        this.buttons = []
        this.buttonLabels = ['Play', 'How2Play', 'Credits']
        this.selectedButtonIndex = 0
    }

    preload() {
        this.load.image('button1', './content/ui/buttonLong_brown.png')
        this.load.image('button1Active', './content/ui/buttonLong_brown_pressed.png')
        this.load.image('cursor', './content/ui/cursorGauntlet_grey.png')
        this.load.image('background', './content/sprites/menuebg.jpg')
        this.load.audio('backgroundmusic', 'content/sounds/flat-8-bit-gaming-music-instrumental-211547.mp3');
    }

    create() {

        let image = this.add.image(0, 0, 'background');
        image.setOrigin(0, 0);
        image.displayWidth = this.sys.game.config.width;
        image.displayHeight = this.sys.game.config.height;

        console.log("Entered Main Menu")
        const { width, height } = this.scale


        let button = this.add.image(40000, 100, 'button1');
        button.setInteractive();

        let music = this.sound.add('backgroundmusic');
        music.setVolume(0.1);
        music.setLoop(true);
        music.play();

        button.on('pointerdown', function () {
            if (musik.isPlaying) {
                musik.pause();
            } else {
                musik.resume();
            }
        });

        // Play button Erstellen
        const playButton = this.add.image(width * 0.5, height * 0.6, 'button1')
            .setDisplaySize(150, 50)
            .setInteractive() // Button interaktiv machen

        this.add.text(playButton.x, playButton.y, 'Play')
            .setOrigin(0.5)


        playButton.on('pointerdown', () => {
            this.confirmSelection()
        })

        playButton.on('pointerover', () => {
            this.selectButton(this.buttons.indexOf(playButton))
        })

        playButton.on('pointerout', () => {
            this.selectButton(this.selectedButtonIndex)
        })



        // How2Play button Erstellen
        const How2PlayButton = this.add.image(playButton.x, playButton.y + playButton.displayHeight + 10, 'button1')
            .setDisplaySize(150, 50)
            .setInteractive()

        this.add.text(How2PlayButton.x, How2PlayButton.y, 'How2Play')
            .setOrigin(0.5)


        How2PlayButton.on('pointerdown', () => {
            this.confirmSelection()
        })

        How2PlayButton.on('pointerover', () => {
            this.selectButton(this.buttons.indexOf(How2PlayButton))
        })

        How2PlayButton.on('pointerout', () => {
            this.selectButton(this.selectedButtonIndex)
        })


        // Credits button Erstellen 
        const CreditsButton = this.add.image(How2PlayButton.x, How2PlayButton.y + How2PlayButton.displayHeight + 10, 'button1')
            .setDisplaySize(150, 50)
            .setInteractive()

        this.add.text(CreditsButton.x, CreditsButton.y, 'Credits')
            .setOrigin(0.5)

        CreditsButton.on('pointerdown', () => {
            this.confirmSelection()
        })

        CreditsButton.on('pointerover', () => {
            this.selectButton(this.buttons.indexOf(CreditsButton))
        })

        CreditsButton.on('pointerout', () => {
            this.selectButton(this.selectedButtonIndex)
        })


        // Store buttons in an array
        this.buttons.push(playButton)
        this.buttons.push(How2PlayButton)
        this.buttons.push(CreditsButton)

        // Initialize button selector


        // Select the initial button
        this.selectButton(0)

        // Set up keyboard input
        this.cursors = this.input.keyboard.createCursorKeys()


        this.input.setDefaultCursor('url(content/ui/cursorGauntlet_grey.png), pointer');
        //this.cursor.setScale(0.5); // Größe des Cursors anpassen


        /*
    this.input.on('pointermove', (pointer) => {
        this.cursors.setPosition(pointer.x, pointer.y)
    })*/
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
        switch (selectedLabel) {
            case 'How2Play':
                this.scene.start('HowToPlayScene') // Beispiel: Wechsel zur How2Play-Szene
                break;
            case 'Play':
                this.scene.start('SceneMain') // Beispiel: Wechsel zur Play-Szene
                break;
            case 'Credits':
                this.scene.start('creditsScene') // Beispiel: Wechsel zur Credits-Szene
                break;
            default:
                break;

        }
    }
}
