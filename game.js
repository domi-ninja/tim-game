// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions to match CSS
canvas.width = 800;
canvas.height = 400;

// Game assets and variables
const gravity = 0.5;
let score = 0;
let gameOver = false;

// Player properties
const player = {
    x: 100,
    y: 200,
    width: 32,
    height: 48,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumpForce: 12,
    isJumping: false,
    color: '#FF5733'
};

// Platforms array
let platforms = [
    { x: 0, y: 350, width: 200, height: 20, color: '#4CAF50' },
    { x: 250, y: 320, width: 150, height: 20, color: '#4CAF50' },
    { x: 450, y: 280, width: 150, height: 20, color: '#4CAF50' },
    { x: 650, y: 350, width: 200, height: 20, color: '#4CAF50' }
];

// Input handling
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Game functions
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function movePlayer() {
    // Horizontal movement
    if (keys['ArrowLeft'] || keys['KeyA']) {
        player.velocityX = -player.speed;
    } else if (keys['ArrowRight'] || keys['KeyD']) {
        player.velocityX = player.speed;
    } else {
        player.velocityX = 0;
    }
    
    // Jumping
    if ((keys['ArrowUp'] || keys['KeyW'] || keys['Space']) && !player.isJumping) {
        player.velocityY = -player.jumpForce;
        player.isJumping = true;
    }
    
    // Apply velocity
    player.x += player.velocityX;
    player.y += player.velocityY;
    
    // Apply gravity
    player.velocityY += gravity;
    
    // Platform collision detection
    platforms.forEach(platform => {
        if (player.y + player.height > platform.y && 
            player.y < platform.y + platform.height && 
            player.x + player.width > platform.x && 
            player.x < platform.x + platform.width &&
            player.velocityY > 0) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isJumping = false;
        }
    });
    
    // Boundary checks
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
    
    // Game over if player falls off the screen
    if (player.y > canvas.height) {
        gameOver = true;
    }
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2 + 60);
}

function restartGame() {
    player.x = 100;
    player.y = 200;
    player.velocityX = 0;
    player.velocityY = 0;
    score = 0;
    gameOver = false;
    generatePlatforms();
}

function generatePlatforms() {
    platforms = [
        { x: 0, y: 350, width: 200, height: 20, color: '#4CAF50' },
        { x: 250, y: 320, width: 150, height: 20, color: '#4CAF50' },
        { x: 450, y: 280, width: 150, height: 20, color: '#4CAF50' },
        { x: 650, y: 350, width: 200, height: 20, color: '#4CAF50' }
    ];
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!gameOver) {
        // Update game state
        movePlayer();
        
        // Draw elements
        drawPlatforms();
        drawPlayer();
        drawScore();
        
        // Increase score over time
        if (frameCount % 10 === 0) {
            score++;
        }
    } else {
        drawGameOver();
        if (keys['Space']) {
            restartGame();
        }
    }
    
    // Next frame
    frameCount++;
    requestAnimationFrame(gameLoop);
}

// Initialize and start game
let frameCount = 0;
gameLoop();

// Handle window resizing
window.addEventListener('resize', () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}); 