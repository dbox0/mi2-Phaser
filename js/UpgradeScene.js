class UpgradeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UpgradeScene' });
        this.chosen = false;
        this.takenUpgrades = new Set(); // Track taken upgrades
        this.takenNum = 0;
    }

    preload(){
        this.load.image('button1', './content/ui/buttonLong_brown.png')
        this.load.image('button1Active', './content/ui/buttonLong_brown_pressed.png')
    }
    create() {
        // Create a semi-transparent background
        this.add.rectangle(400, 300, 800, 800, 0x000000, 0.5);

        // Create upgrade options
        this.upgradeOptions = [
            { text: 'Faster Cannons', effect: this.increaseSpeed },
            { text: 'Repair Ship', effect: this.increaseHealth },
            { text: '+1 Cannons', effect: this.increaseDamage },
            { text: 'Add Triple Cannon', effect: this.tripleUpgrade }, 
            { text: '+3% Movement speed', effect: this.movspeed  }
        ];

        const availableUpgrades = this.upgradeOptions.filter((option, index) => 
        index === 0 || !this.takenUpgrades.has(option.text)
    );

        // Display upgrade options
       for (let i = 0; i < availableUpgrades.length; i++) {
        let option = availableUpgrades[i];

        let button = this.add.sprite(0, 0, 'button1').setInteractive();
        // Create text with smaller font size
        let buttonText = this.add.text(0, 0, option.text, { fontSize: '18px', fill: '#fff' }).setOrigin(0.5);
        
        let container = this.add.container(350, 100 + i * 100, [button, buttonText])
            .setAlpha(0)
            .setScale(0)
            .setSize(button.width, button.height)
            .setInteractive(new Phaser.Geom.Rectangle(0, 0, button.width, button.height), Phaser.Geom.Rectangle.Contains);

        button.on('pointerdown', () => this.applyUpgrade(option.effect, option.text));
        buttonText.setInteractive().on('pointerdown', () => this.applyUpgrade(option.effect, option.text));

        this.tweens.add({
            targets: container,
            alpha: 1,
            scale: 1,
            duration: 500,
            ease: 'Power2',
            delay: i * 200
        });
    }
}

movspeed(){
    if(!this.chosen){
        let mainscene = this.scene.get('SceneMain');
        mainscene.upgradespeed();
        this.chosen = true;
    }
}

applyUpgrade(effect, upgradeText) {
    if (!this.chosen) {
        
        effect.call(this);
        this.takenUpgrades.add(upgradeText); // Track taken upgrade
        this.scene.resume('SceneMain');
        this.chosen = false;
        this.takenNum++;
        if(this.takenNum > 0 && this.takenNum % 5 == 0){
            this.takenUpgrades.clear()
        }
        this.scene.stop();
    }
   
}

increaseSpeed() {
    if (!this.chosen) {
        let mainscene = this.scene.get('SceneMain');
        mainscene.updateShootingDelay();
        this.chosen = true;
    }
}

increaseHealth() {
    if (!this.chosen) {
        let mainscene = this.scene.get('SceneMain');
        mainscene.increaseHealth();
        this.chosen = true;
    }
}

increaseDamage() {
    if (!this.chosen) {
        let mainscene = this.scene.get('SceneMain');
        mainscene.incrementProjNum();
        this.chosen = true;
    }
}
tripleUpgrade(){
   
    if (!this.chosen) {
        let mainscene = this.scene.get('SceneMain');
        mainscene.startDoubleShootRoutine();
        this.chosen = true;
    }
}
}