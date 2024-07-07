class Chunk {
  constructor(scene, x, y, animationkey, player) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.tiles = this.scene.add.group();
    this.spawners = this.scene.add.group();
    this.isLoaded = false;
    this.keyframe = animationkey;
    this.player = player;
  }



  unload() {
    if (this.isLoaded) {
      this.tiles.clear(true, true);

      this.isLoaded = false;
    }
  }


  getTileAtWorldPosition(worldX, worldY) {
    // Calculate local tile coordinates
    //console.log(this.x,this.y)
    const chunkOffsetX = this.x * this.scene.chunkSize * this.scene.tileSize;
    const chunkOffsetY = this.y * this.scene.chunkSize * this.scene.tileSize;
    const localX = Math.floor((worldX - (this.x * this.scene.chunkSize * this.scene.tileSize)) / this.scene.tileSize);
    const localY = Math.floor((worldY - (this.y * this.scene.chunkSize * this.scene.tileSize)) / this.scene.tileSize)



    // console.log(worldX,worldY,localX,localY, "BLAS");
    // Check if the local coordinates are within the chunk
    let tile = null;

    // console.log(localX,localY)
    if (localX >= -8 && localX <= 7 && localY >= -8 && localY <= 7) {
      // Correctly calculate the tile's world position
      const tileX = chunkOffsetX + (localX * this.scene.tileSize);
      const tileY = chunkOffsetY + (localY * this.scene.tileSize);
      // Find the tile at the local coordinates
      const tile = this.tiles.getChildren().find(t => t.x === tileX && t.y === tileY);
      // console.log(tileX,tileY,tile)
      if (tile) {
        return tile.texture.key;
      }
    }
    return null; // Return null if no tile is found or coordinates are out of bounds
    // Return null if no tile is found or coordinates are out of bounds
  }

  load(player) {

    if (!this.isLoaded) {
      for (let localX = -8; localX <= 7; localX++) {
        for (let localY = -8; localY <= 7; localY++) {
          const tileX = (this.x * this.scene.chunkSize * this.scene.tileSize) + (localX * this.scene.tileSize);
          const tileY = (this.y * this.scene.chunkSize * this.scene.tileSize) + (localY * this.scene.tileSize);
          const perlinValue = noise.perlin2( tileX / 320, tileY /312);

          let key = "";
          let animationKey = "";
          let water = true;
          let spawner = false;

          if (perlinValue < 0.2) {
            key = "sprWater";
            animationKey = "sprWater";
          } else if (perlinValue >= 0.2 && perlinValue < 0.3033) {
            key = "sprSand";
            water = false;
          } else if (perlinValue >= 0.3033 && perlinValue < 0.31) {
            key = "sprHouse";
            spawner = true;
          } else if (perlinValue >= 0.31) {
            key = "sprGrass";
            water = false;
          }

          const tile = new Tile(this.scene, tileX, tileY, key, water, this.keyframe, spawner, player);

          if (animationKey !== "") {
            tile.play(animationKey);
          }
          if (spawner) {
            this.spawners.add(tile);
          }
          this.tiles.add(tile);
        }
      }
      this.isLoaded = true;
    }
  }




}


class Tile extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key, water, keyframe, spawner, player) {
    super(scene, x, y, key);
    this.key = key;
    this.water = water;
    this.scene = scene;
    this.scene.add.existing(this);
    this.setOrigin(0);
    this.spawner = spawner;
    this.player = player;
    if (keyframe !== "") {
      this.play(keyframe)
    }

    if(spawner){
    this.scene.time.addEvent(
      {
        delay: 1000,
        callback: this.spawn(this.scene),
        callbackscope: this,
        loop: true,
      }
    )
  }
  }
  spawn(scene) {
      scene.spawnEnemy(this.x, this.y)

  }


}







