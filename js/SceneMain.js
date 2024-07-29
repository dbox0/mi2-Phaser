

class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMain" });
    this.shootingDelay = 1000;
    this.pointer = {x: 0, y:0};
    this.shootingEvent = null;
    this.movspeed = 20;
    this.delays = [1000,2000,3500];
    this.attackSpeedUpgrades = 0;
  }

  preload() {
    this.load.spritesheet("sprWater", "content/sprites/sprWater.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.image("sprSand", "content/sprites/sprSand.png");
    this.load.image("sprGrass", "content/sprites/sprGrass.png");
    this.load.image("sprHouse", "content/sprites/sprHouse.png");
    this.load.image("ship", "content/sprites/player.png");

    this.load.image("enemysmall", "content/sprites/enemysmall.png")
    this.load.image("enemy", "content/sprites/enemy.png")
    this.load.image("enemybig", "content/sprites/enemybig.png")


    this.load.image("projectile", "content/sprites/projectile.png")
    this.load.image("playerproj", "content/sprites/playerprojectile.png")

    this.load.audio('shot', 'content/sounds/enemycannonfire.mp3');
    this.load.audio('shotplayer', 'content/sounds/playercannonfire.mp3');
    this.load.audio('playerdmg', 'content/sounds/ownshipdemage.mp3');
    this.load.audio('spawn','content/sounds/spawn.wav');
    this.load.audio('gameover','content/sounds/gameover.mp3')


  }

  makeBar(x, y, color) {
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

  setBarPercentage(bar, percentage) {
    //scale the bar
    bar.scaleX = percentage / 100;
  }




  meineFunktion() {
    console.log(this.healthBar)
  }

  incrementProjNum(){
    this.playerprojnum += 1;
  }

  create() {
    this.playerprojnum = 1;
    this.tested = false;
    this.accepted = false;
    
    this.health = 5;

    this.enemienumbercoefficient = 1;
    this.enemiecount = 0;
    this.startingenemies = 7;
    this.maxEnemies = this.startingenemies;
    this.gameOverText = this.add.text(16, 16, 'GAME OVER', { fontSize: '32px', fill: '#f00' });
    this.gameOverText.setDepth(3);
    this.gameOverText.setVisible(false)
    this.gameEnded = false;

    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
    this.scoreText.setDepth(4);


    this.maxhealth = this.health
    // Health bar
    this.healthBar = this.makeBar(140, 100, 0x2ecc71);


    this.setBarPercentage(this.healthBar, 100);
    this.healthBar.setDepth(3);

    this.i = 0;
    this.j = 0;
    this.currentFrameIndex = 0
    this.anims.create({
      key: "sprWater",
      frames: this.anims.generateFrameNumbers("sprWater"),
      frameRate: 5,
      repeat: -1,

      onUpdate: function (animation, frame) {
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


    this.cameras.main.setZoom(1);
    this.followPoint = new Phaser.Math.Vector2(
      this.cameras.main.worldView.x + (this.cameras.main.worldView.width * 0.5),
      this.cameras.main.worldView.y + (this.cameras.main.worldView.height * 0.5)
    );

    this.chunks = [];

    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

    // player init
    this.ship = this.physics.add.sprite(this.cameras.main.worldView.x, this.cameras.main.worldView.y, 'ship');
    this.ship.body.setSize(this.ship.width * 0.7, this.ship.height * 0.7)

    this.input.setDefaultCursor('url(content/sprites/crosshair.png), pointer');



    // Add collision detection for player projectiles hitting enemy projectiles


    this.physics.add.collider(this.projectiles, this.enemies, this.handleProjectileCollision, null, this);
    //this.physics.add.collider(this.projectiles, this.enemyProjectiles, this.handleProjectileProjectileCollision, null, this);
    //this.physics.add.collider(this.projectiles, this.projectiles, this.handleProjectileProjectileCollision, null, this);

    this.physics.add.collider(this.enemyprojectiles, this.ship, this.handlePlayerOnHit, null, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileCollision, null, this);
    // Mouse position
    this.mousePosX = game.input.mousePointer.x;
    this.mousePosY = game.input.mousePointer.y;
    this.ship.x = -302
    this.ship.y = -272
    this.ship.setDepth(1);
    this.enemies.setDepth(1);

    this.vel = null

    this.input.on('pointermove', function (pointer) {
      this.pointer.x = pointer.x;
      this.pointer.y = pointer.y;
    }, this);
    
 this.startShootingRoutine();
  }

  startShootingRoutine() {
    this.shootingEvent = this.time.addEvent({
      delay: this.delays[0],
      callback: this.shoot,
      callbackScope: this,
      loop: true
    });
  }

  startDoubleShootRoutine(){
    if(!this.startedDouble){
      this.doubleshootevent = this.time.addEvent({
        delay: this.delays[1],
        callback: this.shootCone,
        callbackScope: this,
        loop:true
      });
      this.startedDouble = true;
    }
   
  }

  shoot() {
    if (!this.gameEnded) {
      const screenX = this.pointer.x;
      const screenY = this.pointer.y;
      const playerX = this.ship.x;
      const playerY = this.ship.y;
  
      const worldX = playerX + (screenX - this.cameras.main.centerX);
      const worldY = playerY + (screenY - this.cameras.main.centerY);
  
      let dirX = worldX - this.ship.x;
      let dirY = worldY - this.ship.y;
      let normalized = Math.sqrt(dirX * dirX + dirY * dirY);
  
      const projX = dirX / normalized;
      const projY = dirY / normalized;
  
      const numProjectiles = this.playerprojnum || 1;
      const offset = 20; 

      const spawnoffset = 0;
  
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
  
        var projectile = new Projectile(this, this.ship.x + offsetX
          + Math.random() * spawnoffset, this.ship.y + offsetY + Math.random() * spawnoffset, "playerproj", projX, projY, 100);
        projectile.setDepth(2);
        this.projectiles.add(projectile);
      }
    }
  }

  shootCone(){
    if (!this.gameEnded) {
      const screenX = this.pointer.x;
      const screenY = this.pointer.y;
      const playerX = this.ship.x;
      const playerY = this.ship.y;
  
      const worldX = playerX + (screenX - this.cameras.main.centerX);
      const worldY = playerY + (screenY - this.cameras.main.centerY);
  
      let dirX = worldX - this.ship.x;
      let dirY = worldY - this.ship.y;
      let normalized = Math.sqrt(dirX * dirX + dirY * dirY);
  
      const projX = dirX / normalized;
      const projY = dirY / normalized;
  
    
      const spreadAngle = Math.PI / 12; // 15 degrees in radians for spread
      const baseAngle = Math.atan2(projY, projX);
      const angles = [-spreadAngle, 0, spreadAngle];

      for (let i = 0; i < 3; i++) {
        const angle = baseAngle + angles[i];
        const projXOffset = Math.cos(angle);
        const projYOffset = Math.sin(angle);

        var projectile = new Projectile(this, this.ship.x, this.ship.y, "playerproj", projXOffset, projYOffset, 100);
        projectile.setDepth(2);
        this.projectiles.add(projectile);
      }
    }
  }

  shootTriangle(){

  }


  updateShootingDelay() {

    console.log('Before:', this.shootingDelay);

    // Calculate the multiplier using exponential decay
    const baseMultiplier = 0.8; // Base multiplier for the first upgrade
    const decayRate = 0.9; // Decay rate to reduce the effect of each subsequent upgrade

    // Apply diminishing returns
    const multiplier = Math.pow(baseMultiplier, Math.pow(decayRate, this.attackSpeedUpgrades));
    this.shootingDelay *= multiplier;
    this.attackSpeedUpgrades++; // Increment the counter

    console.log('After:', this.shootingDelay);

    if (this.shootingEvent) {
        this.shootingEvent.remove();
        this.startShootingRoutine();
    }
  }

  increaseScore() {
    //score++
    this.score += 1;
    this.scoreText.setText('Score: ' + this.score);
    const baseInterval = 10; // Base number of kills needed for an upgrade
    const scalingFactor = 1.5; // How quickly the interval increases with the score
    
    // Calculate the interval at which to offer upgrades
    const upgradeInterval = Math.ceil(baseInterval * Math.pow(scalingFactor, this.score / 100));

    // Check if the score is at an upgrade point
    if (this.score % (upgradeInterval - 1) === 0 && this.score > 1) {
        this.showUpgradeChoice();
    }
    
      const k = 3;
      this.maxEnemies = this.startingenemies + Math.floor(k * Math.log(this.score + 1))
    
  }

  showUpgradeChoice() {
    // Show the upgrade choice UI
    this.scene.pause();
    this.scene.launch('UpgradeScene');
}

  printplayer() {
    //console.log(this.ship.x,this.ship.y)
  }
  handleProjectileCollision(projectile, enemy) {
    projectile.deactivate();
    enemy.takeDamage();
  }

  handlePlayerOnHit(player, projectile,) {
    //console.log(projectile)
    this.playerTakeDamage()
    projectile.deactivate();
    if (!this.gameEnded) {

      this.flasheffect();
      let vel = this.ship.body.velocity;
      if (!this.gameEnded) {
        player.setVelocityX(-vel.x * 1.25)
        player.setVelocityY(-vel.y * 1.25)
      }
    }
  }

  flasheffect(){
    const flashDuration = 100; // Duration of each flash (in ms)
    const repeatCount = 3; // Number of times to flash

    this.tweens.add({
        targets: this.ship,
        alpha: 0, // Set transparency to 0 to create flash effect
        ease: 'Cubic.easeOut',
        duration: flashDuration,
        repeat: repeatCount,
        yoyo: true, // Return to original state after each flash
        onComplete: () => {
            this.ship.clearTint(); // Clear any tint applied
            this.ship.setAlpha(1); // Ensure alpha is reset to 1
        }
    });
  }

  findClosestWaterTile(posX, posY) {
    const searchRadius = 256; // Example search radius, adjust as needed
    const tileSize = this.tileSize; // Your tile size
    const chunkSize = this.chunkSize; // Your chunk size

    let closestWaterTile = null;
    let shortestDistance = Infinity;

    // Define the search area
    const startX = posX - searchRadius;
    const endX = posX + searchRadius;
    const startY = posY - searchRadius;
    const endY = posY + searchRadius;

    for (let x = startX; x <= endX; x += tileSize) {
      for (let y = startY; y <= endY; y += tileSize) {
        const chunk = this.getChunkAtPos(x, y);
        if (chunk) {
          const tileType = chunk.getTileAtWorldPosition(x, y);
          if (tileType === 'sprWater') {
            const distance = Phaser.Math.Distance.Between(posX, posY, x, y);
            if (distance < shortestDistance) {
              shortestDistance = distance;
              closestWaterTile = { x, y };
            }
          }
        }
      }
    }
    //let proj = new Projectile(this,closestWaterTile.x,closestWaterTile.y,"a",0,0,0,false,100,true);
    return closestWaterTile
  }
  playerTakeDamage() {
    //console.log("OUCH WATCH WHERE YER SAILIN ARRRR")
    this.health -= 1;
    if (this.health > 0) {

      this.setBarPercentage(this.healthBar, this.health / this.maxhealth * 100)
      let sound = this.sound.add('playerdmg');
      sound.setLoop(false)
      sound.setVolume(0.1)
      sound.setDetune(Phaser.Math.Between(-700, 10))
      sound.play()
    } else {
      this.setBarPercentage(this.healthBar, 0)
      let sound = this.sound.add('gameover');
      sound.setLoop(false)
      sound.setVolume(0.7)
      sound.play()
      
      this.gameOver();
    }

  }

  gameOver() {
    this.ship.destroy();
    this.gameEnded = true;
    this.gameOverText.setVisible(true)
   

  }

  handleProjectileProjectileCollision(playerProjectile, enemyProjectile) {
    console.log("a")
    enemyProjectile.deactivate();


  }



  getTileType(worldX, worldY, chunk, chunksize, tilesize) {
    //console.log("Chunk size:", chunksize, "Tile size:", tilesize);

    // Determine the tile coordinates within the chunk
    const tileXInChunk = Math.floor((worldX % (chunksize * tilesize)));
    const tileYInChunk = Math.floor((worldY % (chunksize * tilesize)));

    console.log(tileXInChunk, tileYInChunk)

    // Find the tile in the chunk's tile group
    const tile = chunk.tiles.getChildren().find(tile => {
      //console.log("Checking tile at:", tile.x, tile.y);
      return tile.x === tileXInChunk && tile.y === tileYInChunk;
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


   
  spawnEnemyAt(x,y){
    var type = 0;
    if(this.maxEnemies >= 25 || this.score > 20){
      if(Math.random() > 0.25){
        type = 2;
      }
      type = 1;
    }
    if(this.score > 30){
      if(Math.random() < 0.1){
        type = 2;
      }
    }
    if(this.score > 50){
      if(Math.random() < 0.2){
        type = 2;
      }
    }
    if(this.score > 80){
      if(Math.random() < 0.4){
        type = 2;
      }
    }
    this.spawnEnemy(x,y,type);
  }

 
  spawnEnemy(x, y,type) {
 
    var texture = 'enemy';
    var hp = 3;
    var spawner = false;
    var speed = 1;
    var attacktype = 1;
    var rangebonus = 0;
    switch(type){

      case 0:
        texture = 'enemysmall';
        hp = 2;
        speed = 25;
        break;
      case 1:
        texture = 'enemy';
        hp = 4;
        speed = 30;
        rangebonus = 10;
        break;
      case 2 : 
        texture = 'enemybig';
        spawner = true;
        hp = 8;
        speed = 15;
        attacktype = 3;
        rangebonus = 40;
        break;
    }

    if (this.enemiecount < this.maxEnemies) {
      let enemy = new Enemy(this, x, y, texture, this.ship, hp, spawner,speed,false,attacktype,rangebonus);
      this.enemies.add(enemy);

    
      this.enemiecount++;
    };
  }

  spawnBoatEnemy(x,y){
    let enemy = new Enemy(this, x, y, 'enemysmall', this.ship, 2, false,30,true);
    this.enemies.add(enemy);


  }


  getChunkAtPos(x, y) {
    var snappedChunkX = (this.chunkSize * this.tileSize) * Math.round(x / (this.chunkSize * this.tileSize));
    var snappedChunkY = (this.chunkSize * this.tileSize) * Math.round(y / (this.chunkSize * this.tileSize));

    snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
    snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;

    var returnchunk = null;

    for (var i = 0; i < this.chunks.length; i++) {
      if (this.chunks[i].x == snappedChunkX && this.chunks[i].y == snappedChunkY) {
        returnchunk = this.chunks[i]
      }
    }
    return returnchunk
  }


  update() {

    console.log(this.enemiecount , this.maxEnemies)
    var snappedChunkX = (this.chunkSize * this.tileSize) * Math.round(this.ship.x / (this.chunkSize * this.tileSize));
    var snappedChunkY = (this.chunkSize * this.tileSize) * Math.round(this.ship.y / (this.chunkSize * this.tileSize));

    snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
    snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;
    let b = 2
    for (var x = snappedChunkX - b; x < snappedChunkX + b; x++) {
      for (var y = snappedChunkY - b; y < snappedChunkY + b; y++) {
        var existingChunk = this.getChunk(x, y);

        if (existingChunk == null) {
          var newChunk = new Chunk(this, x, y, this.currentFrameIndex, this.ship);
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


    if (!this.gameEnded) {
     if(this.keyP.isDown){
      this.startDoubleShootRoutine();
     }
      if (this.keyW.isDown) {
        this.ship.y -= 0.2;
        this.ship.setVelocityY(-this.movspeed);
      }
      if (this.keyS.isDown) {
        this.ship.y += 0.2;
        this.ship.setVelocityY(this.movspeed);
      }
      if (this.keyA.isDown) {
        this.ship.x -= 0.2;
        this.ship.setVelocityX(-this.movspeed);
        this.ship.flipX = true;

      }
      if (this.keyD.isDown) {
        this.ship.x += 0.2;
        this.ship.setVelocityX(this.movspeed);
        this.ship.flipX = false;
      }

      var chunk = this.getChunkAtPos(this.ship.x, this.ship.y);
      let ontiletype = chunk.getTileAtWorldPosition(this.ship.x, this.ship.y)
      //console.log(ontiletype)

      if (ontiletype) {
        if (ontiletype == 'sprGrass' || ontiletype == 'sprSand') {

          this.vel = this.ship.body.velocity
          this.ship.setVelocity(-this.vel.x, -this.vel.y)
          console.log("STUCK")
          //var particle = new Projectile(this, this.ship.x,this.ship.y, 'a', 0, 0, 0, true, 100,true)
        }
      }
      //console.log(chunk.x,chunk.y,"  ",);

      this.healthBar.x = this.ship.x - 15
      this.healthBar.y = this.ship.y + 20
    }

    this.findClosestWaterTile(this.ship.x,this.ship.y)

    this.mousePosX = game.input.mousePointer.x;
    this.mousePosY = game.input.mousePointer.y;
   
    if (this.ship) {
      this.cameras.main.centerOn(this.ship.x, this.ship.y);
    }
    this.scoreText.y = this.ship.y - 200
    this.scoreText.x = this.ship.x + 55
    this.gameOverText.x = this.ship.x - 50
    this.gameOverText.y = this.ship.y
    this.cameras.main.centerOn(this.ship.x, this.ship.y);
  }
}