//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34; //width/height ratio = 408/228 = 17/12 = 34/24
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width: birdWidth,
    height: birdHeight
}

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moveing left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;

//pipes
let pipeArray = [];
let pipeWidth = 64; // width-height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;




window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");   //used for drawing on the board

    //draw flappy bird
    // context.fillStyle = "green";
    context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load images
    birdImg = new Image();
    birdImg.src = "./images/corgi.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./images/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./images/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //every 1.5 seconds, place pipes function
    document.addEventListener("keydown", moveBird);
    document.addEventListener("click", moveBird);
}




function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0,0, board.width, board.height);

    //bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limited to top of canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    //if you fall down, game is over
    if (bird.y > board.height) {
        gameOver = true;
    }



    //pipes
    for (let i=0; i<pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;       //we pass 2 pipes, so score needs to increment by 0.5 (0.5 * 2 = 1);
            pipe.passed = true;
        }
        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    //clear pipes to address memory issues
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {    //pipes that have gone to left of canvas after right side of pipes go off canvas
        pipeArray.shift();      //removes first element from array
    }

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
}




function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random()*(pipeHeight/2);

    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height: pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed : false
    }

    pipeArray.push(bottomPipe);
}


function moveBird(e) {
    // if (e.code == "Space" || e.code == "Click" || e.code("KeyX")) {
        //jump
        velocityY = -6;

        //reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
// }

function detectCollision (a, b) {
    return  a.x < b.x + b.width && 
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}