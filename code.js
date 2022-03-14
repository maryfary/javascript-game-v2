let player;

let bullets = [];

let enemies = [];

let intObject;

let can = document.getElementById("drawingCanvas");
let brush = can.getContext("2d");

function ToRadians(degrees){
    return degrees * Math.PI / 180;
} 

function GetRandomInteger(a, b){

    if (a > b){
        small = b;
        large = a;
    }
    else{
        small = a;
        large = b;
    }
    
    let x = parseInt(Math.random() * (large - small + 1)) + small;
    return x;
}

function RandomColor(min = 0, max = 255){
    let r = GetRandomInteger(min, max);
    let g = GetRandomInteger(min, max);
    let b = GetRandomInteger(min, max);
    return "rgba(" + r + ", " + g + ", " + b + ", 1.0)";
}

/** Draw background Image **/
let bgX = 0;
let bgY = 0;
let bgImage = new Image();
bgImage.src = "street.jpg";
bgImage.width = 300;
bgImage.height = 210;
/** Draw background Image **/

class RectSprite{
    constructor(x,y,width,height,ImageSrc){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = new Image();
        this.img.src = ImageSrc;
        this.spriteStartX = 0;
        this.spriteStartY = 0;
        this.spriteWidth = 34;
        this.spriteHeight = 52;
        this.dY = 1;
        this.dX = 20;
    }

    Draw(){
        brush.drawImage(this.img,
            this.spriteStartX,this.spriteStartY,
            this.spriteWidth,this.spriteHeight,
            this.x, this.y,
            this.spriteWidth,this.spriteHeight);

        this.spriteStartX += this.spriteWidth;
        if(this.spriteStartX >= this.img.width){
            this.spriteStartX = 0;
        }
    }

    DrawPlayer(){
        brush.drawImage(this.img,this.x,this.y);
    }

    MoveEnemy(){
        let newY = this.y + this.dY;
        this.y = newY;
    }

    MoveRight(){
        let newX = this.x + this.dX;
        if(newX + (this.width - 1) < can.width){
            this.x = newX;
        }
    }

    MoveLeft(){
        let newX = this.x - this.dX;
        if(newX >= 0){
            this.x = newX;
        }
    }

}

class Circle{
    constructor(x,y,radius,dX,dY,color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dX = dX;
        this.dY = dY;
        this.color = color;
    }

    Update(){
        this.x = this.x + this.dX;
        this.y = this.y + this.dY;
    }

    Draw(){
        brush.beginPath();
        brush.arc(this.x,this.y,this.radius,ToRadians(0),ToRadians(360))
        brush.fillStyle = this.color;
        brush.fill();
        brush.stroke();
    }
}


let circles =[];
can.addEventListener('click',function(event){
    let angel = Math.atan2(event.clientY-can.height, event.clientX-can.width/2);
    let dX = Math.cos(angel);
    let dY = Math.sin(angel);
    let c = new Circle(can.width/2,can.height,5,dX,dY,'red');
    circles.push(c);
});


function animate(){
    requestAnimationFrame(animate);
    circles.forEach(function(circ){
        circ.Draw();
        circ.Update();
    });
}

function CreatePlayer(){
     player = new RectSprite(can.width/2-25,can.height-73,50,73, "player.png");
     player.DrawPlayer();
}

function CreateEnemy(){

    let en = new RectSprite(GetRandomInteger(0 , can.width - 75),0,10, 10, "walk_down.png");
    enemies.push(en);
}


function DrawAndMoveAllEnemies(){

    for (let i = 0; i< enemies.length; i++){
        if(enemies[i] !== undefined){
            enemies[i].Draw();
            enemies[i].MoveEnemy();
        }
    }
    
}

function RemoveOffScreenBullets(){
     for (let i = circles.length - 1; i >= 0; i--){
         if(circles[i] !== undefined ){
             if (circles[i].y <= 1){
                circles.splice(i,1);
             }
         }
     }
    
}

function Collides(rect1, rect2){

    let overlap;

    if ( rect1.x + rect1.width < rect2.x || rect2.x + rect2.spriteWidth < rect1.x || rect2.y + rect2.spriteHeight < rect1.y || rect1.y + rect1.height < rect2.y){
        overlap = false;
    }else{
        overlap = true;
    }

    console.log(overlap);
    return overlap;
    
}

function CheckBulletHit(){

    for (let i = circles.length - 1; i >=0; i--){
        let coll;
        for (let j =  enemies.length - 1; j >=0; j--){
            console.log(enemies[j]);
            coll = Collides(circles[i],enemies[j]);
            if (coll){
                enemies.splice(j,1);
                let elem = document.getElementById('lblHitCount');
                let count = parseInt(elem.innerHTML);
                count++;
                elem.innerHTML = count;
                break;
                
            }
        }
        if(coll){
            circles.splice(i,1);
        }
    }
    
}

function CheckGameEnd(){

    for (let i=0; i < enemies.length; i++){

        if(enemies[i].y + enemies[i].height - 1 >= can.height){
            EndGame();
            brush.font = "35px Arial";
            brush.fillText("Game Over", can.width/2 - 80, can.height/2);
        }
    }
}

function DrawGameScreen(){
    brush.clearRect(0,0,can.width, can.height);

    /* Draw background image */
    brush.drawImage(bgImage,bgX,bgY,can.width,can.height);

    if(enemies.length < 4){
        CreateEnemy();
    }
    
    player.DrawPlayer();

    DrawAndMoveAllEnemies();

    CheckBulletHit();

    RemoveOffScreenBullets();

    CheckGameEnd();
}

function StartGame(){

    intObject = setInterval(DrawGameScreen, 100);
}

function EndGame(){
    clearInterval(intObject);
}

animate();
