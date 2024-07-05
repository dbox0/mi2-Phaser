
class Enemy extends Phaser.Physics.Arcade.Sprite{

  constructor(scene, x, y, texture, player ){
    super(scene,x,y,texture);
    this.player = player;
    this.freeze = false;

    scene.physics.world.enable(this);
    this.scene.add.existing(this);

    let dirX =this.player.x-this.x
    let dirY = this.player.y-this.y
    let magnitude = Math.sqrt(dirX*dirX + dirY*dirY);
    
    let vectorx = dirX/magnitude;
    let vectory = dirY/magnitude


    this.x += vectorx *128
    this.y += vectory*128


 
    //console.log(this.player.x)
    //console.log(this.player.y)

    this.healthBar=this.makeBar(3,2,0x911c1e);
    this.setValue(this.healthBar,100);
    this.healthBar.setDepth ( 1 );  

    this.firerate = 2000; // fire every 2 seconds
  
    this.isdead = false;
    this.health = 3;
    this.maxhealth = this.health;
    this.scene = scene;
    this.texture = texture
    this.setDepth(1);
    this.attackspeed = 100;
    this.speed = 20;
    
    this.rand = Math.random()*1000
    this.scene.time.addEvent({

      delay: (this.firerate + this.rand),
      callback: this.fireProjectile,
      callbackScope: this,
      loop: true
    });

    if(!this.checkTile){
      this.die();
    }

  
  }
  checkTile() {
    var chunk = this.scene.getChunkAtPos(this.x, this.y);
    if (chunk.getTileAtWorldPosition(this.x, this.y) === 'sprWater') {
      return true;
    }
  }

  makeBar(x, y,color) {
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


  die(){
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

  setValue(bar,percentage) {
    //scale the bar
    bar.scaleX = percentage/100;
}

  fireProjectile(){

    if(!this.isdead){
//console.log(this.player);
    var dirx = this.player.x - this.x;
    //console.log(this.player.y - this.y)
    
    let distanceVector = [this.x - this.player.x,this.y - this.player.y];
    const distance = Math.sqrt(distanceVector[0]*distanceVector[0]+distanceVector[1]*distanceVector[1]);
    if(distance < 300){
      var diry = this.player.y - this.y;
      var projectile = new Projectile(this.scene,this.x,this.y,"projectile",dirx,diry,this.attackspeed,true)
      this.scene.enemyprojectiles.add(projectile);
      projectile.setDepth(1);
      
      }
    }
    
    
    }
  
  takeDamage(){
    this.health -= 1;
    if(this.health <= 0){
      // play death anim () function
      if(this.scene){
        this.scene.increaseScore();
      }
      this.die()
      
    } else{
      this.setValue (this.healthBar, this.health*10*3)
    }

  }

  setVelocity(x,y){
    this.setVelocityX(x);
    this.setVelocityY(y);
  }
  update(time,delta){
    if(!this.isdead){
      let dirX =this.player.x-this.x
      let dirY = this.player.y-this.y
      let magnitude = Math.sqrt(dirX*dirX + dirY*dirY);
      let normalizedX = dirX/magnitude
      let normalizedY = dirY/magnitude
  
  
      this.healthBar.x = this.x -10
      this.healthBar.y = this.y +20
      if(this.freezetimer > 1500){
        this.freeze = false
        }
      if(magnitude > 120){
        
      if(!this.freeze){
        this.setVelocityX(normalizedX * this.speed)
        this.setVelocityY(normalizedY * this.speed)
       }
      }

      if(magnitude < 5000){
  
        
        var dV = this.body.velocity
        let dMagnitude = Math.sqrt(dV.x*dV.x + dV.y+dV.y)
        var dx = dV.x/dMagnitude
        var dy = dV.y/dMagnitude     // normalize the vector
  
        var offset = 32
        var chunk = this.scene.getChunkAtPos(Math.floor(this.x + dx*offset),Math.floor(this.y+dy*offset))
        let ontiletype = chunk.getTileAtWorldPosition(this.x + dx*offset,this.y+dy*offset)
      
        

        if(ontiletype && !this.freeze){
          if(ontiletype == 'sprGrass' || ontiletype == 'sprSand' || !this.checkTile()){
            
            this.vel = this.body.velocity
            this.setVelocity(-this.vel.x,-this.vel.y)
            this.freezetimer = 0;
            this.freeze = true;
          }
        }
  
  
        this.freezetimer += delta;
      }
  
    
    }
   

  }
}
