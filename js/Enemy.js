
class Enemy extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, texture, player, debug) {
    super(scene, x, y, texture);
    this.player = player;
    this.freeze = false;
    this.accepted = false;


    scene.physics.world.enable(this);
    this.scene.add.existing(this);

    let dirX = this.player.x - this.x
    let dirY = this.player.y - this.y
    let magnitude = Math.sqrt(dirX * dirX + dirY * dirY);

    let vectorx = dirX / magnitude;
    let vectory = dirY / magnitude


    this.x += vectorx * 128
    this.y += vectory * 128
    let vec = new Phaser.Math.Vector2(dirX, dirY)



    //console.log(this.player.x)
    //console.log(this.player.y)

    this.healthBar = this.makeBar(3, 2, 0x911c1e);
    this.setValue(this.healthBar, 100);
    this.healthBar.setDepth(1);

    this.firerate = 2000; // fire every 2 seconds

    this.isdead = false;
    this.health = 3;
    this.maxhealth = this.health;
    this.scene = scene;
    this.texture = texture
    this.setDepth(1);
    this.attackspeed = 100;
    this.speed = 20;

    this.rand = Math.random() * 1000
    this.scene.time.addEvent({

      delay: (this.firerate + this.rand),
      callback: this.fireProjectile,
      callbackScope: this,
      loop: true
    });







  }
  checkTile() {
    var chunk = this.scene.getChunkAtPos(this.x, this.y);
    if (chunk.getTileAtWorldPosition(this.x, this.y) === 'sprWater') {
      return true;
    }
  }

  makeBar(x, y, color) {
    //draw the bar
    let bar = this.scene.add.graphics();

    //color the bar
    bar.fillStyle(color, 1);

    //fill the bar with a rectangle
    bar.fillRect(0, 0, 30, 5);

    //position the bar
    bar.x = x;
    bar.y = y;

    //return the bar
    return bar;
  }


  die() {
    console.log("Died")
    this.isdead = true;
    if (this.body) {
      this.body.setEnable(false); // Disable physics body
    }
    if (this.healthBar) {
      this.healthBar.destroy();
    }
    this.setVisible(false)
    this.destroy();
  }

  setValue(bar, percentage) {
    //scale the bar
    bar.scaleX = percentage / 100;
  }

  fireProjectile() {

    if (!this.isdead && !this.scene.gameEnded) {
      //console.log(this.player);
      var dirx = this.player.x - this.x;
      //console.log(this.player.y - this.y)

      let distanceVector = [this.x - this.player.x, this.y - this.player.y];
      const distance = Math.sqrt(distanceVector[0] * distanceVector[0] + distanceVector[1] * distanceVector[1]);
      if (distance < 300) {
        var diry = this.player.y - this.y;
        var projectile = new Projectile(this.scene, this.x, this.y, "projectile", dirx, diry, this.attackspeed, true)
        this.scene.enemyprojectiles.add(projectile);
        projectile.setDepth(1);

      }
    }


  }

  takeDamage() {
    this.health -= 1;
    if (this.health <= 0) {
      // play death anim () function
      if (this.scene) {
        this.scene.increaseScore();
      }
      this.scene.enemiecount--;
      this.die()

    } else {
      this.setValue(this.healthBar, this.health * 10 * 3)
    }

  }

  setVelocity(x, y) {
    this.setVelocityX(x);
    this.setVelocityY(y);
  }


  handleCollision(velocityNormalized , depth) {


    let offsets = [0, 16, 32, 64]
    let iterateTo = -1
    if(depth){
      iterateTo = depth
    } else {
      iterateTo = offsets.length
    }
    for (var i = 0; i < iterateTo; i++) {
      var chunk = this.scene.getChunkAtPos(this.x + velocityNormalized.x * offsets[i], this.y + velocityNormalized.y * offsets[i]);
      //console.log(chunk.x, chunk.y)
      if (chunk) {
        let ontiletype = chunk.getTileAtWorldPosition(this.x + velocityNormalized.x * offsets[i], this.y + velocityNormalized.y * offsets[i])
        //console.log(ontiletype)
        if (ontiletype) {
          //var particle = new Projectile(this.scene, this.x + velocityNormalized.x * offsets[i],this.y + velocityNormalized.y * offsets[i], 'a', 0, 0, 0, true, 100,true)
          if (ontiletype == 'sprGrass' || ontiletype == 'sprSand') {
            this.vel = this.body.velocity
            //this.ship.setVelocity(-this.vel.x, -this.vel.y)
            //console.log("collision at offset " + i)
            var particle = new Projectile(this.scene, this.x + velocityNormalized.x * offsets[i], this.y + velocityNormalized.y * offsets[i], 'a', 0, 0, 0, true, 100, true)
            return true;
          }
        }
      }



    } return false;
  }


  update(time, delta) {
    //hacky bullshit. Warum geht das nicht bei Erzeugung des Enemies??? Jetzt ist es in der Update-Methode :(
    if (!this.tested) {

      let dirX = this.player.x - this.x
      let dirY = this.player.y - this.y
      let distanceToPlayer = Math.sqrt(dirX * dirX + dirY * dirY);

      if (!this.checkTile(this.x, this.y) || distanceToPlayer < 250 || this.handleCollision(new Phaser.Math.Vector2(dirX/distanceToPlayer,dirY/distanceToPlayer),3)) {
        this.accepted = false;
        this.tested = true
        this.scene.enemiecount--;
        this.die();
      } else { 
        
        let dirX = this.player.x - this.x
        let dirY = this.player.y - this.y

        this.tested = true;
      }
    }
    if (!this.isdead) {



      let dirX = this.player.x - this.x
      let dirY = this.player.y - this.y
      let distanceToPlayer = Math.sqrt(dirX * dirX + dirY * dirY);

      let xToPlayer = dirX / distanceToPlayer
      let yToPlayer = dirY / distanceToPlayer


      this.healthBar.x = this.x - 10
      this.healthBar.y = this.y + 20

      if (this.freezetimer > 750) {
        this.freeze = false
        this.freeze = 0;
      }

      let dV = new Phaser.Math.Vector2(this.body.velocity)
      let dV2 = dV

      if (!this.freeze) {
        this.setVelocityX(xToPlayer * this.speed)
        this.setVelocityY(yToPlayer * this.speed)
        if (this.handleCollision(dV.normalize())) {
          this.freeze = true;
          this.freezetimer = 0;
         
          var newpath = this.scene.findClosestWaterTile(this.x,this.y);
          var newdir = new Phaser.Math.Vector2(newpath.x - this.x, newpath.y - this.y);
          var velmagnitude = this.body.velocity.normalize();
         
          newdir.normalize();
         
          this.setVelocityX(newdir.x*this.speed);
          this.setVelocityY(newdir.y*this.speed)


        }
      }
      if (this.freeze) {
        this.freezetimer += delta;
      }
      if (distanceToPlayer > 900) {
        console.log("I should die")
        this.die()
      }
    }


  }
}
