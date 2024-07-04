

class Projectile extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y , texture , a,b,speed ){
      super(scene,x,y,texture);
      this.speed = speed;
      this.scene = scene;
      this.scene.physics.world.enable(this);
      this.scene.add.existing(this);
      this.dirX = a;
      this.dirY = b;
      this.speed = speed;
      this.lifespan = 2000;
      this.setDepth(1);
  
      this.setActive(false);
      this.setVisible(false);
      this.setDepth(1);
     // console.log("pew L" + this.dirX, + " " + this.dirY);
    
      this.setDepth(1);
      this.setActive(true);
      this.setVisible(true);

      //console.log(a)
      //console.log(b)
      this.dir = [a,b]
      
      // Normalize directional vector
      this.magnitude = Math.sqrt((this.dir[0]*this.dir[0] + this.dir[1]*this.dir[1]))
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
  
  
    deactivate(){
      this.setActive(false);
      this.setVisible(false);
      //this.body.stop();
      this.destroy();
      }

      update(){ this.setVelocity(this.dir[0]/this.magnitude*this.speed,this.dir[1]/this.magnitude*this.speed);
      }
      
  
  }