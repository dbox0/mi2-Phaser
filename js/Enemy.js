
class Enemy extends Phaser.Physics.Arcade.Sprite{

  constructor(scene, x, y, texture, player ){
    super(scene,x,y,texture);
    this.player = player;
   
    //console.log(this.player.x)
    //console.log(this.player.y)
    scene.physics.world.enable(this);
    this.scene.add.existing(this);


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
      this.isdead = true;
      this.healthBar.destroy();
      this.destroy();
      
    }else{
    this.setValue (this.healthBar, this.health*10*3)}
  }

  setVelocity(x,y){
    this.setVelocityX(x);
    this.setVelocityY(y);
  }
  update(){
    let dirX =this.player.x-this.x
    let dirY = this.player.y-this.y
    
    this.healthBar.x = this.x -10
    this.healthBar.y = this.y +20
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
