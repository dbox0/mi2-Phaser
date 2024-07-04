class Chunk {
    constructor(scene, x, y, animationkey,player) {
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
  
    load(player) {
      if (!this.isLoaded) {
        for (var x = 0; x < this.scene.chunkSize; x++) {
          for (var y = 0; y < this.scene.chunkSize; y++) {
  
            var tileX = (this.x * (this.scene.chunkSize * this.scene.tileSize)) + (x * this.scene.tileSize);
            var tileY = (this.y * (this.scene.chunkSize * this.scene.tileSize)) + (y * this.scene.tileSize);
  
            var perlinValue = noise.perlin2(0.5* tileX / 100
            , 0.5* tileY / 100);
  
            var key = "";
            var animationKey = "";
            var water = true;
            var spawner = false;
              
            if (perlinValue < 0.2) {
              key = "sprWater";
              animationKey = "sprWater";
            }
            else if (perlinValue >= 0.2 && perlinValue < 0.3037) {
              key = "sprSand";
              water = false;
            }
            else if(perlinValue >= 0.3037 && perlinValue < 0.31){
              key = "sprHouse";
              spawner = true;


            }
            else if (perlinValue >= 0.31) {
              key = "sprGrass";
              water = false;
            }
  
  
            var tile = new Tile(this.scene, tileX, tileY, key, water,this.keyframe,spawner,player);
  
            if (animationKey !== "") {
              tile.play(animationKey);
            }
            if(spawner){
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
    constructor(scene, x, y, key, water,keyframe, spawner,player) {
      super(scene, x, y, key);
      this.key = key;
      this.water = water;
      this.scene = scene;
      this.scene.add.existing(this);
      this.setOrigin(0);
      this.spawner = spawner;
      this.player = player;
      if(keyframe !== ""){
        this.play(keyframe)
      }
      
      this.scene.time.addEvent(
        {
         delay: 100000000,
         callback: this.spawn(this.scene),
         callbackscope: this,
         loop: true,
        }
        
      )
      }
      spawn(scene){
        if(this.spawner){
          scene.spawnEnemy(this.x,this.y)
        }
      }
      
      
    }
    

      
  

  
  
