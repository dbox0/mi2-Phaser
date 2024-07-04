
class Enemy extends Phaser.Physics.Arcade.Sprite{

  constructor(scene, x, y, texture, player ){
    super(scene,x,y,texture);
    this.player = player;
    //console.log(this.player.x)
    //console.log(this.player.y)
    scene.physics.world.enable(this);
    this.scene.add.existing(this);

    this.firerate = 2000; // fire every 2 seconds
  
    this.health = 3;
    this.scene = scene;
    this.texture = texture
    this.setDepth(1);
    this.attackspeed = 100;
    this.speed = 20;
    this.isDead = false;

    let rand = Math.random()*1000
    this.scene.time.addEvent({

      delay: (this.firerate + rand),
      callback: this.fireProjectile,
      callbackScope: this,
      loop: true
    });
    

  
  }

  fireProjectile(){
    if(!this.isDead){
  //console.log(this.player);
    var dirx = this.player.x - this.x;
    //console.log(this.player.y - this.y)
    var diry = this.player.y - this.y;

    var projectile = new Projectile(this.scene,this.x,this.y,"projectile",dirx,diry,this.attackspeed)
    this.scene.enemyprojectiles.add(projectile);
    projectile.setDepth(1);
    }
    
    }
  
  takeDamage(){
    console.log("Enemy: Ouch. Health remaining :" +this.health)
    this.health -= 1;
    if(this.health <= 0){
      this.isDead = true;
      // play death anim () function
      console.log("Im dead")
      this.scene.physics.world.disable(this);
      this.setActive(false)
      this.scene.enemies.remove(this)
      this.destroy();
    }
  }

  setVelocity(x,y){
    this.setVelocityX(x);
    this.setVelocityY(y);
  }
  update(){
    let dirX =this.player.x-this.x
    let dirY = this.player.y-this.y
    
    let magnitude = Math.sqrt(dirX*dirX + dirY*dirY);
    if(magnitude > 150){
 let normalizedX = dirX/magnitude
    let normalizedY = dirY/magnitude

    /*
    this.setVelocityX(normalizedX * this.speed);
    this.setVelocityY(normalizedY * this.speed);
    */
    this.setVelocityX(normalizedX * this.speed)
    this.setVelocityY(normalizedY * this.speed)
    }
   

  }

  
  //TODO : Death animation 
}
