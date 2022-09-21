const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg, torreImg;
var cannonball;
var balls=[];
var boat;
var boats=[];
var canvas, angle, torre, ground, cannon;
var boatAnimation=[]; 
var boatSpritdata,boatSpritesheet;

function preload() {
  backgroundImg=loadImage("assets/background.gif");
  torreImg=loadImage("assets/tower.png");
  boatSpritdata=loadJSON("json/navegando.json");
  boatSpritesheet=loadImage("json/navegando.png");
}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES);
  angle=15;
  var options={
    isStatic: true
  }
  ground= Bodies.rectangle(0,height-1,width*2,1,options);
  World.add(world,ground);
  torre= Bodies.rectangle(160,350,160,310,options);
  World.add(world,torre);
  cannon= new Cannon(180,110,130,100,angle);
  //cannonball= new Cannonball(cannon.x,cannon.y);
  //boat=new Boat(width-79,height-60,170,170,-80);

  //animaçao navio navegando
  var boatFrame=boatSpritdata.frames;
  for(var i=0; i<boatFrame.length; i++){
    var pos=boatFrame[i].position;
    var img=boatSpritesheet.get(pos.x,pos.y,pos.w,pos.h);
    boatAnimation.push(img);
  }
 
}

function draw() {
  image(backgroundImg,0,0,1200,600);
  Engine.update(engine);
  rect(ground.position.x,ground.position.y,width*2,1);
  push();
  imageMode(CENTER);
  image(torreImg,torre.position.x,torre.position.y,160,310);
  pop();
  cannon.display();
  //boat.display();
  //showBoat();
  //cannonball.display();

  for(var i=0; i<balls.length; i++){
    showBall(balls[i], i);
    collisionWithBoat(i);
  }
  
}
function keyReleased(){
  if(keyCode === DOWN_ARROW){
    balls[balls.length-1].shoot();
  }
}
function keyPressed(){
  if(keyCode === DOWN_ARROW){
    var cannonball=new Cannonball(cannon.x,cannon.y);
    balls.push(cannonball);
  }
}
function showBall(ball,index){
  if(ball){
    ball.display();
    if(ball.body.position.x>=width || ball.body.position.y>=height-50){
      ball.remove(index);
    }

  };
}

function showBoat(){
// analisar se tem algum argumento no array
  if(boats.length>0){
    //analisar a posiçao do elemento no array
    if(boats[boats.length-1]===undefined || boats[boats.length-1].body.position.x<width-300){
        //selecionar posiçoes de forma aleatoria
        var positions=[-40,-60,-70,-20];
        var position=random(positions);
        var boat=new Boat(width,height-100,170,170,position,boatAnimation);
        boats.push(boat);
    } 
    //for para ler a posiçao dos elementos do arrays
    for(var i=0; i<boats.length; i++){
      if(boats[i]){
        Matter.Body.setVelocity(boats[i].body,{x:-0.9,y:0});
        boats[i].display();
        boats[i].animate();
      }
    }
  }
  else {
    var boat=new Boat(width,height-60,170,170,-60,boatAnimation);
    boats.push(boat);
  }
}
function collisionWithBoat(index) {
  for(var i=0; i<boats.length; i++){
    if(balls[index]!==undefined && boats[i]!== undefined){
    var collision=Matter.SAT.collides(balls[index].body,boats[i].body);
    if(collision.collided){
      boats[i].remove(i);
      Matter.World.remove(world,balls[index].body);
      delete balls[index];
    }
    }
  }
}