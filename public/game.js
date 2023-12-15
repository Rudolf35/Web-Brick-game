const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//ball default setting
const ballRadius = 5;
ballspeed = 2
let x = canvas.width/2;
let y = canvas.height - 30;
let dx = ballspeed;
let dy = -ballspeed;

//paddle default setting
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

//brick default setting
let brickRowCount = 3;
const brickColumnCount = 10;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 5;
const brickOffsetTop = 30;
const brickOffsetLeft = 5;

let bricks = [];
for(let c = 0; c < brickColumnCount; c++){
  bricks[c] = [];
  for(let r=0; r<brickRowCount;r++){
    bricks[c][r] = {x:0, y:0, status:1};
  }
}

let score = 0;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
   if(e.keyCode == 39) {
 rightPressed = true;
   }
    else if(e.keyCode == 37) {
  leftPressed = true;
   }
}
function keyUpHandler(e) {
   if(e.keyCode == 39) {
  rightPressed = false;
   }
   else if(e.keyCode == 37) {
 leftPressed = false;
   }
}


function drawBall(){
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#DD0000";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle(){
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for(let c=0; c<brickColumnCount; c++){
    for(let r=0; r<brickRowCount; r++){
    
if(bricks[c][r].status == 1){
  let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
  let brickY = r * (brickHeight + brickPadding) + brickOffsetTop
  bricks[c][r].x = brickX;
  bricks[c][r].y = brickY;
  ctx.beginPath();
  ctx.rect(brickX,brickY,brickWidth, brickHeight);
  ctx.fillStyle = "#0095DD"
  ctx.fill();
  ctx.closePath();
}
    }
  }
}

function collisionDetection() {
  for(let c=0; c<brickColumnCount; c++){
    for(let r=0; r<brickRowCount;r++){
const b = bricks[c][r];
if(b.status == 1){
  if(x>b.x && x<b.x+brickWidth && y>b.y && y<b.y+brickHeight){
    dy = -dy;
    b.status = 0;
    score++;
  }
}
    }
  }
}

function drawScore()  {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 8, 20);
}

let Username = "Guest"
fetch('/username')
    .then(response => response.json())
    .then(data => {
        Username = data.username;
    });

function drawID(name) {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`User : ${name}`, 100, 20)
}

function draw() {
  ctx.clearRect(0,0,canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  drawScore();
  drawID(Username);
  x+= dx;
  y+= dy;
  
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
   dy = -dy;
  }
  else if (y + dy > canvas.height - ballRadius){
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    }
    else {
      clearInterval(timer);
      fetch('/gameover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: Username,
          score: score,
        }),
      })
      .then(response => response.json())
      .then(data => {
        alert("Game Over");
        if (data.redirect) {
          window.location.href = data.redirect;
        } else {
          document.location.reload();
        }
      });
    }
  }
  
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
   paddleX += 7;
  } 
  else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

}

timer = setInterval(draw, 10);
