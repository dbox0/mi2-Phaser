

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
      this.load.image("sprHouse", "content/sprites/sprHouse.png");
      this.load.image("ship","content/sprites/shipplayerB.png");
      this.load.image("enemy","content/sprites/shiptest.png")
      this.load.image("projectile","content/sprites/projectile.png")
      this.load.image("playerproj","content/sprites/playerprojectile.png")

    }
  
    makeBar(x, y,color) {
      //draw the bar
      let bar = this.add.graphics();

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

    setBarPercentage(bar,percentage) {
      //scale the bar
      bar.scaleX = percentage/100;
  }

  

    meineFunktion (){
      console.log (this.healthBar)
    }

    create() {
      this.health = 5;

      // Health bar
      this.healthBar=this.makeBar(140,100,0x2ecc71);
 
 
      this.setBarPercentage(this.healthBar,100);
      this.healthBar.setDepth ( 3 );  
    
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

      this.chunkSize = 16;
      this.tileSize = 16;
      this.movSpeed = 2;
  
      this.cameras.main.setZoom(1.4);
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
      
      this.physics.add.collider(this.enemyprojectiles,this.ship,this.handlePlayerOnHit,null,this);
     
      // Mouse position
      this.mousePosX = game.input.mousePointer.x;
      this.mousePosY = game.input.mousePointer.y;

      this.ship.setDepth(1);
      this.enemies.setDepth(1);
      


      
      this.time.addEvent(
        {
          delay: 1000,
          callback:this.printplayer,
          callbackScope:this,
          loop: true
        }
      )
      //this.spawnEnemy();

      // GET MOUSECLICK to shoot
      this.input.on('pointerdown', function (pointer) {
        // Get the x and y coordinates of the pointer
        const screenX = pointer.x;
        const screenY = pointer.y;

        const playerX = this.ship.x;
        const playerY = this.ship.y;

        const worldX = playerX + (screenX - this.cameras.main.centerX);
        const worldY = playerY + (screenY - this.cameras.main.centerY);

        const chunkAt = this.getChunkAtPos(worldX,worldY);
        console.log(this.getTileType(worldX,worldY,chunkAt,this.chunkSize,this.tileSize))
        // Log the coordinates to the console
        //console.log('Pointer down at:', worldX, worldY);
        let dirX = worldX - this.ship.x;
        let dirY = worldY - this.ship.y;
        let normalized = Math.sqrt(dirX*dirX + dirY*dirY)

      
        const a = dirX/normalized
  
        const b = dirY/normalized;
        console.log("B: " + b)
        var projectile = new Projectile(this,this.ship.x ,this.ship.y,"playerproj",a,b,100)
        projectile.setDepth(2);
        this.projectiles.add(projectile);
      
        // Optionally, you can do something with these coordinates
        // For example, create a sprite at the clicked position
        // this.add.sprite(x, y, 'someSpriteKey');
    }, this);
    
    
  
  }
    
    printplayer(){
      //console.log(this.ship.x,this.ship.y)
    }
    handleProjectileCollision(projectile, enemy) {
      projectile.deactivate();
      enemy.takeDamage();
     }

  handlePlayerOnHit(player, projectile,){
    console.log(projectile)
    projectile.deactivate();
    this.takeDamage()
  }
  
  takeDamage(){
    //console.log("OUCH WATCH WHERE YER SAILIN ARRRR")
    if(this.health > 0){
    this.health -= 1;
    this.setBarPercentage(this.healthBar,this.health*10*2)
    }  
    
  }

  handleProjectileProjectileCollision(playerProjectile, enemyProjectile) {
    playerProjectile.deactivate();
    enemyProjectile.deactivate();

    // Play explosion animation at the point of collision
    //let explosion = this.add.sprite(playerProjectile.x, playerProjectile.y, 'explosion');
    //explosion.play('explode');
}



getTileType(worldX, worldY, chunk, chunksize, tilesize) {
  //console.log("Chunk size:", chunksize, "Tile size:", tilesize);
  
  // Determine the tile coordinates within the chunk
  const tileXInChunk = Math.floor((worldX % (chunksize * tilesize)) / tilesize);
  const tileYInChunk = Math.floor((worldY % (chunksize * tilesize)) / tilesize);
 // console.log("Tile X in Chunk:", tileXInChunk, "Tile Y in Chunk:", tileYInChunk);
  
  // Calculate the tile's exact world position
  const tileWorldX = chunk.x * chunksize * tilesize + tileXInChunk * tilesize;
  const tileWorldY = chunk.y * chunksize * tilesize + tileYInChunk * tilesize;
 // console.log("Expected tile world position:", tileWorldX, tileWorldY , worldX,worldY);
  
  // Find the tile in the chunk's tile group
  const tile = chunk.tiles.getChildren().find(tile => {
    //console.log("Checking tile at:", tile.x, tile.y);
    return tile.x === Math.floor(tileWorldX) && tile.y === Math.floor(tileWorldY);
  });

  if (tile) {
   // console.log("Tile found:", tile.texture.key);
    return tile.texture.key; // Assuming `type` is stored in `texture.key`
  } else {
    //console.log("Tile not found at:", tileXInChunk, tileYInChunk);
    return null;
  }
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
    var enemy = this.enemies.create(x, y,'enemy',this.ship);
    enemy.setDepth(1);
    }
    
    
    getChunkAtPos(x,y){
      var snappedChunkX = (this.chunkSize * this.tileSize) * Math.round(this.ship.x / (this.chunkSize * this.tileSize));
      var snappedChunkY = (this.chunkSize * this.tileSize) * Math.round(this.ship.y / (this.chunkSize * this.tileSize));
  
      snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
      snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;

      var returnchunk = null;

      for(var i = 0; i < this.chunks.length;i++){
        if(this.chunks[i].x == snappedChunkX && this.chunks[i].y == snappedChunkY){
          returnchunk = this.chunks[i]
        }
      }
      return returnchunk
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
            //console.log("loaded chunk at " +chunk.x + " " + chunk.y)
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

      var chunk = this.getChunkAtPos(this.ship.x,this.ship.y);
      if(this.getTileType(this.ship.x,this.ship.y,chunk,16,16) == 'SprSand'){
        console.log("boop")
        this.ship.setVelocity(-this.ship.velocity)
      }

      this.healthBar.x = this.ship.x -15
      this.healthBar.y = this.ship.y + 20
      //console.log(this.getChunk(this.ship.x,this.ship.y));
      

      this.cameras.main.centerOn(this.ship.x, this.ship.y);
    }
  }