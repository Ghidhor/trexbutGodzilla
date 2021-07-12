var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var coinGroup,coin1;
var doubleCoinGroup,coin2
var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound
var birdBadGroup , birdBadAnimation

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  coin1=loadImage("Allthemodium.png")
  coin2 = loadImage("AllthemodiumDouble.png")
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  birdBadAnimation = loadAnimation("BadBird1.png","BadBird1.3.png","BadBird1.8.png","BadBird2.png","BadBird1.8.png","BadBird1.3.png")
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("calm3.ogg")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
createCanvas(displayWidth,displayHeight);

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(20,50,20,50);

  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  
 
  trex.scale = 0.5;
  
  ground = createSprite(displayWidth/2,displayHeight -20,displayWidth,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(displayWidth/2,displayHeight/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/2,gameOver.y - 50);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(displayWidth/2,displayHeight -10,displayWidth,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  coinGroup = createGroup();
  doubleCoinGroup = createGroup();
  birdBadGroup = createGroup();
  trex.setCollider("circle",0,0,45);
  trex.debug = false
  obstaclesGroup.debug = true
  score = 0;
  
}

function draw() {
  
  background(0,200,255);
  //displaying score
  text("Score: "+ score, windowWidth - 100,windowHeight - 400);

  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    

    if(trex.isTouching(coinGroup)){
      score = score+100
      coinGroup.destroyEach()
    }
    if(trex.isTouching(doubleCoinGroup)){
      score = score + 400
      doubleCoinGroup.destroyEach()

    }

    /*if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }*/
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
      trex.x = mouseX
  trex.y = mouseY
  trex.debug = true
    //jump when the space key is pressed
    if(keyDown("space")){
        trex.velocityY = -12   ;
        jumpSound.play();
    }
    console.log(trex.y)
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    spawnBirdyThing()

    spawnCoins();
    if(obstaclesGroup.isTouching(trex) || birdBadGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        //dieSound.play()
        //trex.y = trex.y + Math.round(random(10,-10))
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 5
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
     coinGroup.setVelocityXEach(0); 
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
}

function reset(){
  gameState=PLAY
obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  coinGroup.destroyEach()
  trex.changeAnimation("running", trex_running);
}


function spawnObstacles(){
 if (frameCount % 2 === 0){
   var obstacle = createSprite(displayWidth,120,10,40);
   obstacle.y = Math.round(random(0,3000))
   obstacle.velocityX = -6
   obstacle.debug = false
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() { 
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
function spawnCoins(){
  if (frameCount % 6 === 0){
    var coin = createSprite(displayWidth,120,10,40);
    coin.y = Math.round(random(0,3000))
    coin.velocityX = -6 
    coin.addImage(coin1)
    coin.scale = 0.25
   coin.debug = true
    coinGroup.add(coin)
  }
}
function spawnDoubleCoins(){
  if (frameCount % 20 === 0){
    var doubleCoin = createSprite(displayWidth,120,10,40);
    doubleCoin.y = Math.round(random(0,3000))
    doubleCoin.velocityX = -6 
    doubleCoin.addImage(coin2)
    doubleCoin.scale = 0.25
    doubleCoinGroup.add(doubleCoin)
  }
}

function spawnBirdyThing(){
   if (frameCount % 30 === 0){
     var badBird =createSprite(displayWidth,120,20,50)
     badBird.y = Math.round(random(0,3000))
     badBird.velocityX = -6
     
     badBird.addAnimation("fly",birdBadAnimation)
      //assign scale and lifetime to the obstacle           
      badBird.scale = 0.5;
      badBird.lifetime = 300;
     
     //add each obstacle to the group
      birdBadGroup.add(badBird);
   }

}