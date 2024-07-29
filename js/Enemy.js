
class Enemy extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, texture, player, hp , spawner, speed, dontgiveScore,attacktype , rangebonus,parent) {
    super(scene, x, y, texture);
    this.scene = scene;
    if(parent){
      this.parent = parent;
    }
    this.player = player;
    this.freeze = false;
    this.accepted = false;
    this.attacktype = attacktype;
    this.numspawned = 0;
    scene.physics.world.enable(this);
    this.scene.add.existing(this);

    let dirX = this.player.x - this.x
    let dirY = this.player.y - this.y
    let magnitude = Math.sqrt(dirX * dirX + dirY * dirY);

    let vectorx = dirX / magnitude;
    let vectory = dirY / magnitude

    if(this.parent){
      console.log(parent)
    }

    var newxy = this.scene.findClosestWaterTile(this.x,this.y)
    var vectorD = new Phaser.Math.Vector2(newxy.x - this.x,newxy.y - this.y);
    vectorD.normalize()
    if(dontgiveScore != null || dontgiveScore != false){
      
    
    this.x = this.x  + vectorD.x*64
    this.y = this.y +  vectorD.y*64   
    }

    if(dontgiveScore){
      this.givesscore = false;
    } else{
      this.givesscore = true;
    }
    

    //console.log(this.player.x)
    //console.log(this.player.y)

    this.healthBar = this.makeBar(3, 2, 0x911c1e);
    this.setBarValue(this.healthBar, 100);
    this.healthBar.setDepth(1);

    this.firerate = 1800; // 1000 = 1 sec
    this.isdead = false;
    this.yBaroffset = 10;
    if(hp){
      if(hp == 2){
        this.yBaroffset = 0;
      }
      this.health = hp;
    } else {
      this.health = 3;
    }
    this.maxhealth = this.health;
    this.scene = scene;
    this.texture = texture
    this.setDepth(1);
    this.rangebonus = 0;
    if(rangebonus){
      this.rangebonus = rangebonus
    }
    this.attackspeed = 100 + this.rangebonus;
    
    this.speed = 20;
    if(speed){
      this.speed = speed;
    }

    this.scene.time.addEvent({

      delay: 1000,
      callback: this.startFiring,
      callbackScope: this,
      loop: false
    });

    if(spawner){
      this.scene.time.addEvent({
        delay: 5000,
        callback : this.spawnboats,
        callbackScope: this,
        loop:true
      })
    }
    this.playSpawnSound();
  }

  decrementSpawnedNum(){
    this.numspawned--;
  }
  startFiring(){
    
    var rand = Math.random() * 800
    if(this.scene){
      this.scene.time.addEvent({

        delay: (this.firerate + rand),
        callback: this.fireProjectile,
        callbackScope: this,
        loop: true
      });
    }
   
  }
getNumSpawned(){
  return this.numspawned;
}

  playSpawnSound(){
    let sound = this.scene.sound.add('spawn');
    sound.setVolume(0.1);
    sound.setLoop(false);
    
    if(!this.givesscore){
      sound.setDetune(Phaser.Math.Between(100, 300))
    } else {
      sound.setDetune(Phaser.Math.Between(-100, 100))
    }
    sound.play();
  }
  checkTile() {
    var chunk = this.scene.getChunkAtPos(this.x, this.y);
    if (chunk.getTileAtWorldPosition(this.x, this.y) === 'sprWater') {
      return true;
    }
  }

  spawnboats(){
  if(!this.isdead){
    if (this.scene) {
      if(this.scene.spawnBoatEnemy(this.x, this.y,this)){
          this.numspawned++;
      }
  } else {
    return;
  }
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
    if(this.givesscore){
      this.scene.enemiecount--;
    } else {
      this.parent.decrementSpawnedNum();
    }
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

  setBarValue(bar, percentage) {
    //scale the bar
    bar.scaleX = percentage / 100;
  }

  fireProjectile() {

    if (!this.isdead && !this.scene.gameEnded) {
      //console.log(this.player);
   
      //console.log(this.player.y - this.y)
      
      let distanceVector = [this.x - this.player.x, this.y - this.player.y];
      const distance = Math.sqrt(distanceVector[0] * distanceVector[0] + distanceVector[1] * distanceVector[1])
      if (distance < 300) {
        let predictionTime = Math.random() * 4
        var invert = 1
        if(Math.random() > 0.6){
          invert = -1;
        }
        var dirX =  (this.player.x + this.player.body.velocity.x *invert* predictionTime) - this.x;
        var dirY = (this.player.y + this.player.body.velocity.y *invert* predictionTime) - this.y;
        var normalized = Math.sqrt(dirX * dirX + dirY * dirY);
        if(!this.attacktype){
        var projectile = new Projectile(this.scene, this.x, this.y, "projectile", dirX, dirY, this.attackspeed, true)
        this.scene.enemyprojectiles.add(projectile);
        projectile.setDepth(1); 
        return;
        }
       
  
        const projX = dirX / normalized;
        const projY = dirY / normalized;
        const numProjectiles = this.attacktype;
        const offset = 20; 
        for (let i = 0; i < numProjectiles; i++) {
          // Determine dominant aiming direction
          let offsetX = 0;
          let offsetY = 0;
          if (Math.abs(projX) > Math.abs(projY)) {
            // More horizontal aiming, offset along y-axis
            offsetY = i * offset - ((numProjectiles - 1) * offset) / 2;
          } else {
            // More vertical aiming, offset along x-axis
            offsetX = i * offset - ((numProjectiles - 1) * offset) / 2;
          }

          var spawnoffset = 1;
          var projectile = new Projectile(this.scene, this.x + offsetX
            + Math.random() * spawnoffset, this.y + offsetY + Math.random() * spawnoffset, "projectile", projX, projY, this.attackspeed,true);
          
          this.scene.enemyprojectiles.add(projectile);
          projectile.setDepth(1); 
          }
      }
    }


  }

  flasheffect(){
    const flashDuration = 150; // Duration of each flash (in ms)
        const repeatCount = 0; // Number of times to flash

        this.scene.tweens.addCounter({
          from: 0,
          to: 1,
          duration: flashDuration,
          repeat: repeatCount,
          yoyo: true,
          onUpdate: (tween) => {
              const value = tween.getValue();
              const tint = Phaser.Display.Color.Interpolate.ColorWithColor(
                  { r: 255, g: 255, b: 255 },
                  { r: 255, g: 0, b: 0 }, 
                 
                  1,
                  value
              );
              this.setTint(Phaser.Display.Color.GetColor(tint.r, tint.g, tint.b));
          },
          onComplete: () => {
              this.clearTint(); // Clear the tint after the tween completes
          }
      });
    }
  

  takeDamage() {
    this.health -= 1;
    this.flasheffect()
    if (this.health <= 0) {
      // play death anim () function
      if (this.scene && this.givesscore) {
        this.scene.increaseScore();
      }
      
      let sound = this.scene.sound.add('hit');
      sound.setVolume(0.3);
      sound.setDetune(Phaser.Math.Between(-500, -300))
    
      sound.setLoop(false);
      sound.play()
      
      this.die()

    } else {
      let sound = this.scene.sound.add('hit');
      sound.setDetune(Phaser.Math.Between(200, 300))
      sound.setVolume(0.3);
      sound.setLoop(false);
      sound.play()
      let percentage = this.health/this.maxhealth
      this.setBarValue(this.healthBar, percentage*100)
    }

  }

  setVelocity(x, y) {
    this.setVelocityX(x);
    this.setVelocityY(y);
  }


  handleCollision(velocityNormalized , depth) {
    let offsets = [0, 16, 32, 64,128]
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
            //var particle = new Projectile(this.scene, this.x + velocityNormalized.x * offsets[i], this.y + velocityNormalized.y * offsets[i], 'a', 0, 0, 0, true, 100, true)
            return true;
          }
        }
      }



    } return false;
  }


  update(time, delta) {
    // hacky bullshit. Warum geht das nicht bei Erzeugung des Enemies??? Jetzt ist es in der Update-Methode :(
    if (!this.tested) {

      let dirX = this.player.x - this.x
      let dirY = this.player.y - this.y
      let distanceToPlayer = Math.sqrt(dirX * dirX + dirY * dirY);

      if ( distanceToPlayer < 200 && this.givesscore) {
        this.accepted = false;
        this.tested = true
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


      this.healthBar.x = this.x - 15
      this.healthBar.y = this.y + 10 + this.yBaroffset

      if (this.freezetimer > 1250) {
        this.freeze = false
        this.freeze = 0;
      }

      let dV = new Phaser.Math.Vector2(this.body.velocity)
      let dV2 = dV

      if (!this.freeze) { 
        if(distanceToPlayer > 200){

          this.setVelocityX(xToPlayer * this.speed)
          this.setVelocityY(yToPlayer * this.speed)
        }
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
      if (distanceToPlayer > 700) {
        console.log("I should die")
        this.die()
      }
    }


  }
}
