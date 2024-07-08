

class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, dirX, dirY, speed, enemy, lifetime,mute) {
    super(scene, x, y, texture);
    this.speed = speed;
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.dirX = dirX;
    this.dirY = dirY;
    this.speed = speed;
    this.lifespan = 2000;
    this.setDepth(2);

    this.enemy = enemy;
    this.setActive(false);
    this.setVisible(false);
    this.setDepth(1);

    if (!enemy) {
      this.lifespan += 100;
    }
    if (lifetime) {
      this.lifespan = lifetime
    }

    // console.log("pew L" + this.dirX, + " " + this.dirY);


    if(!mute){
    if (enemy) {
      let sound = this.scene.sound.add('shot');
      sound.setVolume(0.5);
      sound.setLoop(false);
      sound.setDetune(Phaser.Math.Between(-1000, 200))
      sound.play();
    }
    else {
      let sound = this.scene.sound.add('shot' /*shotplayer*/);
      sound.setVolume(0.2);
      sound.setLoop(false);
      sound.setDetune(Phaser.Math.Between(-1000, -500))
      sound.play();
    }
    }



    this.setDepth(1);
    this.setActive(true);
    this.setVisible(true);

    //console.log(a)
    //console.log(b)
    this.dir = [dirX, dirY]

    // Normalize directional vector
    this.magnitude = Math.sqrt((this.dir[0] * this.dir[0] + this.dir[1] * this.dir[1]))
    // console.log("Magnitude " + magnitude)
    //this.dir[0] = this.dirX/this.magnitude;
    //this.dir[1] = this.dirY/this.magnitude;
    //console.log(this.dir[0] + ": " + this.dir[1])


    //console.log("Projectile : " + this.dir[0] + ": " + this.dir[1] +" "+ magnitude)


    this.scene.time.addEvent({
      delay: this.lifespan,
      callback: this.deactivate,
      callbackScope: this
    });

  }


  deactivate() {
    this.setActive(false);
    this.setVisible(false);
    //this.body.stop();
    this.destroy();
  }

  update() {
    this.setVelocity(this.dir[0] / this.magnitude * this.speed, this.dir[1] / this.magnitude * this.speed);
  }


}