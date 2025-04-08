// JavaScript / Canvas API
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// JavaScript / DOM Manipulation (Code for interacting with HTML elements)
const gameBoard = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start");
const restartButton = document.getElementById("play-again-btn");
const homeButton = document.getElementById("home-btn");
const gameOverImg = document.getElementById("game-over-img");

// Game Variables
let player;
let meteors = [];
let startTime;
let gameRunning = false;
let difficulty = 0.2;

gameBoard.style.display = "none";

// Player Image
const playerImg = new Image();
playerImg.src = "./assets/x-wing-starfighter.png";

// Meteor Image
const meteorImg = new Image();
meteorImg.src = "./assets/meteor.png";

// Player object
class Player {
    constructor() {
        this.width = 30;
        this.height = 30;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - 100;
        this.speed = 1;
    }

    move(keys) {
        if (keys["ArrowLeft"] && this.x > 0) this.x -= this.speed;
        if (keys["ArrowRight"] && this.x + this.width < canvas.width) this.x += this.speed;
        if (keys["ArrowUp"] && this.y > 0) this.y -= this.speed;
        if (keys["ArrowDown"] && this.y + this.height < canvas.height) this.y += this.speed;
    }

    draw() {
        ctx.drawImage(playerImg, this.x, this.y, this.width, this.height);
    }
}

// Meteor object
class Meteor {
    constructor() {
        this.width = 5;
        this.height = 5;
        this.speed = difficulty + Math.random() * 0.1;
        const side = Math.floor(Math.random() * 4);

        switch (side) {
            case 0:
                this.x = Math.random() * (canvas.width - this.width);
                this.y = -this.height;
                this.dx = 0;
                this.dy = this.speed;
                break;
            case 1:
                this.x = canvas.width;
                this.y = Math.random() * (canvas.height - this.height);
                this.dx = -this.speed;
                this.dy = 0;
                break;
            case 2:
                this.x = Math.random() * (canvas.width - this.width);
                this.y = canvas.height;
                this.dx = 0;
                this.dy = -this.speed;
                break;
            case 3:
                this.x = -this.width;
                this.y = Math.random() * (canvas.height - this.height);
                this.dx = this.speed;
                this.dy = 0;
                break;
        }
        // The meteor to fly in a random direction
        const angle = Math.random() * Math.PI * 2;
        this.dx = Math.cos(angle) * this.speed;
        this.dy = Math.sin(angle) * this.speed;
    }
    move() {
        this.x += this.dx;
        this.y += this.dy;
    }

    draw() {
        ctx.drawImage(meteorImg, this.x, this.y, this.width, this.height);
    }
}

// Game Reset / Initialize
function initGame() {
    player = new Player();
    meteors = [];
    startTime = Date.now();
    gameRunning = true;
    scoreDisplay.innerText = "Time: 0";

    // Hide the game over image and buttons at the start
    gameOverImg.style.display = "none";
    restartButton.style.display = "none";
    homeButton.style.display = "none";
    keys = {};

}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.move(keys);
    player.draw();

    meteors.forEach((meteor, index) => {
        meteor.move();
        meteor.draw();

        if (checkCollision(player, meteor)) {
            gameOver();
        }

        if (
            meteor.y > canvas.height || meteor.y < -meteor.height ||
            meteor.x > canvas.width || meteor.x < -meteor.width
        ) {
            meteors.splice(index, 1);
        }
    });

    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    scoreDisplay.innerText = `Time: ${elapsedTime}`;

    requestAnimationFrame(gameLoop);
}

function checkCollision(player, meteor) {
    return (
        player.x < meteor.x + meteor.width &&
        player.x + player.width > meteor.x &&
        player.y < meteor.y + meteor.height &&
        player.y + player.height > meteor.y
    );
}

function spawnMeteor() {
    if (!gameRunning) return;
    meteors.push(new Meteor());
    setTimeout(spawnMeteor, 30);
}

startButton.addEventListener("click", () => {
    startScreen.style.display = "none";
    gameBoard.style.display = "block";
    initGame();
    gameLoop();
    spawnMeteor();
});

function gameOver() {
    gameRunning = false;
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    alert(`Game Over! Final Time: ${elapsedTime} seconds`);
    restartButton.style.display = "block";
    gameOverImg.style.display = "block";
    restartButton.style.display = "block";
    homeButton.style.display = "block";
}

restartButton.addEventListener("click", () => {
    restartButton.style.display = "none";
    keys = {};
    initGame();
    gameLoop();
    spawnMeteor();
});

homeButton.addEventListener("click", () => {
    gameBoard.style.display = "none";
    startScreen.style.display = "block";

});

let keys = {};
document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));