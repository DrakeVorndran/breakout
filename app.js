const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const debug = document.getElementById("debug");
let score = 0;
let lives = 3;



//BALL INIT
let ballx = canvas.width/2;
let bally = canvas.height-30;
let ballDx = 2;
let ballDy = -2;
const ballRadius = 10;



//PADDLE INIT
const paddleHeight = 10;
const paddleWidth = 100;
let paddleX = (canvas.width-paddleWidth)/2;
let paddleV = 0

let rightPressed = false;
let leftPressed = false;


//BRICKS INIT
const brickRowCount = 3;
const brickWidth = 75;
const brickColumnCount = parseInt(canvas.width/brickWidth);
const brickHeight = 20;
const brickPadding = (canvas.width%brickWidth)/(brickColumnCount+2);
//const brickPadding = 6.25;
console.log(brickPadding);
const brickOffsetTop = 30;
const brickOffsetLeft = brickPadding;


let bricks = [];
for(let c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(let r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

//BALL





drawBall = () => {
    ctx.beginPath();
    ctx.arc(ballx, bally, ballRadius, 0, Math.PI*2, false);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}


checkBallCollision = () => {
    if( ballx + ballDx + ballRadius > canvas.width  || ballx + ballDx - ballRadius < 0){

        ballDx*=-1;
    }

    if(bally + ballDy - ballRadius < 0){
        ballDy*=-1;
    }
    else if( bally + ballDy + ballRadius > canvas.width-paddleHeight){
        if(ballx>paddleX && ballx<paddleX+paddleWidth){
            ballDy*=-1;
        }
        else{
            lives--;
            if(lives===0){
                alert("game over")
                document.location.reload();
            }
            else{
                ballx = canvas.width/2;
                bally = canvas.height-30;
                ballDx = 2;
                ballDy = -2;
            }
        }
    }


}

moveBall = () => {
    ballx += ballDx;
    bally += ballDy;
    collision();
}


//PADDLE

//document.addEventListener("mousemove", mouseMoveHandler, false); //This is here, but it completly ruins the momentum that I added, so I removed it
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}


function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

keyDownHandler = (e) => {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

keyUpHandler = (e) => {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }

}

document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);


movePaddle = () => {
    if(rightPressed) {
        paddleV += .3;
    }
    else if(leftPressed) {
        paddleV -= .3;
    }
    paddleX += paddleV;
    if(!(rightPressed || leftPressed)){
        paddleV-=paddleV*.02;
    }
    if(paddleX < 3){
        paddleV = paddleV*-.1;
        paddleX = 3;
    }
    else if(paddleX > canvas.width-(paddleWidth+3)){
        paddleV = paddleV*-.1;
        paddleX = canvas.width-(paddleWidth+3);
    }
}


//BRICKS

function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status===1){
                let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function brickCollision(){
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status===1){
                if(ballx+ballRadius > b.x && ballx+ballRadius < b.x+brickWidth && bally+ballRadius > b.y && bally-ballRadius < b.y+brickHeight) {
                    ballDy = -ballDy;
                    b.status=0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}



//DRAWING

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}


function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

collision = () => {
    checkBallCollision();
    brickCollision();
}


draw = () => {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    moveBall();
    movePaddle();
    requestAnimationFrame(draw);
}

draw();


