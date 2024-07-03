

class SceneMain extends Phaser.Scene {
    constructor() {
      super({ key: "SceneMain" });
    }
  
    preload() {
      this.load.spritesheet("sprWater", "content/sprites/sprWater.png", {
        frameWidth: 16,
        frameHeight: 16
      });
      this.load.image("sprSand", "content/sprites/sprSand.png");
      this.load.image("sprGrass", "content/sprites/sprGrass.png");
      this.load.image("ship","content/sprites/shiptest.png");
      this.load.image("enemy","content/sprites/enemy.png");
      this.load.image("projectile","content/sprites/projectile.png")
    }
  
    create() {
      
      this.input.on('pointerdown', function (pointer) {
        // Get the x and y coordinates of the pointer
        const screenX = pointer.x;
        const screenY = pointer.y;

        const playerX = this.ship.x;
        const playerY = this.ship.y;

        const worldX = playerX + (screenX - this.cameras.main.centerX);
        const worldY = playerY + (screenY - this.cameras.main.centerY);

        // Log the coordinates to the console
        console.log('Pointer down at:', worldX, worldY);
        let dirX = worldX - this.ship.x;
        let dirY = worldY - this.ship.y;
        let normalized = Math.sqrt(dirX*dirX + dirY*dirY)

      
        const a = dirX/normalized
      
        const b = dirY/normalized;
        console.log("B: " + b)
        var projectile = new Projectile(this,this.ship.x,this.ship.y,"projectile",a,b,100)
        projectile.setDepth(2);
      
        // Optionally, you can do something with these coordinates
        // For example, create a sprite at the clicked position
        // this.add.sprite(x, y, 'someSpriteKey');
    }, this);


      this.i = 0;
      this.j = 0;
      this.currentFrameIndex = 0
      this.anims.create({
        key: "sprWater",
        frames: this.anims.generateFrameNumbers("sprWater"),
        frameRate: 5,
        repeat: -1,

        onUpdate:function(animation, frame) {
          this.currentFrameIndex = frame.index;
      }

       // onUpdate: function(animation.frame){
         // currentFrameIndex = frame.index;
        //}
      });
      this.projectiles = this.physics.add.group({
        classType: Projectile,
        runChildUpdate: true
    });


      this.enemies = this.physics.add.group({
        classType: Enemy,
        runChildUpdate: true
      })
      
      this.enemyprojectiles = this.physics.add.group({
        classType: Projectile,
        runChildUpdate: true
      })

      this.chunkSize = 12;
      this.tileSize = 16;
      this.movSpeed = 2;
  
      this.cameras.main.setZoom(0.8);
      this.followPoint = new Phaser.Math.Vector2(
        this.cameras.main.worldView.x + (this.cameras.main.worldView.width * 0.5),
        this.cameras.main.worldView.y + (this.cameras.main.worldView.height * 0.5)
      );
      
      this.chunks = [];
  
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.ship = this.physics.add.sprite( this.cameras.main.worldView.x,this.cameras.main.worldView.y,'ship');

      this.input.setDefaultCursor('url(content/sprites/crosshair.png), pointer');

      this.physics.add.collider(this.projectiles, this.enemies, this.handleProjectileCollision, null, this);

      // Add collision detection for player projectiles hitting enemy projectiles
      this.physics.add.collider(this.projectiles, this.enemyProjectiles, this.handleProjectileProjectileCollision, null, this);
      
      
      // Mouse position
      this.mousePosX = game.input.mousePointer.x;
      this.mousePosY = game.input.mousePointer.y;

      this.ship.setDepth(1);
      this.enemies.setDepth(1);

      //this.spawnEnemy();
      
    }
    

   
    getChunk(x, y) {
      var chunk = null;
      for (var i = 0; i < this.chunks.length; i++) {
        if (this.chunks[i].x == x && this.chunks[i].y == y) {
          chunk = this.chunks[i];
        }
      }
      return chunk;
    }

    spawnEnemy(x,y){
    var enemy = this.enemies.create(x, y,'ship',this.ship);
    enemy.setDepth(1);
      
      
    }
    
    spawnProjectile(){
      
    }

    update() {
      
     
      var snappedChunkX = (this.chunkSize * this.tileSize) * Math.round(this.ship.x / (this.chunkSize * this.tileSize));
      var snappedChunkY = (this.chunkSize * this.tileSize) * Math.round(this.ship.y / (this.chunkSize * this.tileSize));
  
      snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
      snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;
  
      for (var x = snappedChunkX - 2; x < snappedChunkX + 2; x++) {
        for (var y = snappedChunkY - 2; y < snappedChunkY + 2; y++) {
          var existingChunk = this.getChunk(x, y);
  
          if (existingChunk == null) {
            var newChunk = new Chunk(this, x, y,this.currentFrameIndex,this.ship);
            this.chunks.push(newChunk);
          }
        }
      }
  
      for (var i = 0; i < this.chunks.length; i++) {
        var chunk = this.chunks[i];
  
        if (Phaser.Math.Distance.Between(
          snappedChunkX,
          snappedChunkY,
          chunk.x,
          chunk.y
        ) < 3) {
          if (chunk !== null) {
            chunk.load(this.ship);
          }
        }
        else {
          if (chunk !== null) {
            chunk.unload();
          }
        }
      }

      
  
      if (this.keyW.isDown) {
        this.ship.y -= 0.5;
        this.ship.setVelocityY(-20);
      }
      if (this.keyS.isDown) {
        this.ship.y += 0.5;
        this.ship.setVelocityY(20);
      }
      if (this.keyA.isDown) {
        this.ship.x -= 0.5;
        this.ship.setVelocityX(-20);
        this.ship.flipX = true;
        
      }
      if (this.keyD.isDown) {
        this.ship.x += 0.5;
        this.ship.setVelocityX(20);
        this.ship.flipX = false;
      }


      //console.log(this.getChunk(this.ship.x,this.ship.y));
  
      this.cameras.main.centerOn(this.ship.x, this.ship.y);
    }
  }