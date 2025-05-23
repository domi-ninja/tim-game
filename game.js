// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions to match CSS
canvas.width = 1200;
canvas.height = 800;

// Game assets and variables
const gravity = 0.5;
let gameOver = false;
let aiEnabled = false; // Flag to enable/disable AI

// Platforms arrayss
const platforms = [
    { x: 0, y: 350, width: 200, height: 20, color: '#4CAF50' },
    { x: 280, y: 350, width: 150, height: 20, color: '#4CAF50' },
    { x: 450, y: 200, width: 150, height: 20, color: '#4CAF50' },
    { x: 650, y: 350, width: 200, height: 20, color: '#4CAF50' },
    { x: 500, y: 650, width: 200, height: 20, color: '#4CAF50' },
    { x: 200, y: 560, width: 200, height: 20, color: '#4CAF50' },
    { x: 500, y: 475, width: 100, height: 20, color: '#4CAF50' },
    { x: 0, y: 150, width: 300, height: 20, color: '#4CAF50' },
    { x: 850, y: 650, width: 200, height: 20, color: '#4CAF50' },
]

// Player properties
const player1= {
    m: 1,
    x: 100,
    y: 200,
    width: 32,
    height: 48,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumpForce: 12,
    isJumping: false,
    color: '#FF5733',
    score: 0,
    lastDirection: 1, // 1 for right, -1 for left
    shootCooldown: 0
};

const player2 = {
    x: 700,
    m: 2,
    y: 200,
    width: 32,
    height: 48,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumpForce: 12,
    isJumping: false,
    color: '#3717b1',
    score: 0,
    lastDirection: -1, // 1 for right, -1 for left
    shootCooldown: 0,
    aiActions: {
        moveLeft: false,
        moveRight: false,
        jump: false,
        shoot: false
    },
    aiTimer: 0,
    aiDecisionInterval: 5 // Make decisions every 5 frames
};

resetPlayer1()
resetPlayer2()

// Bullets array
const bullets = [];
const BULLET_SPEED = 10;
const SHOOT_COOLDOWN = 50; // Frames between shots

function resetPlayer1() {
    player1.x = 100
    player1.y = 200
    player1.velocityX = 0
    player1.velocityY = 0
    player1.isJumping = false

    const platformNr = Math.floor(Math.random() * platforms.length)
    const randomPlatform = platforms[platformNr]
    player1.platformNr = platformNr
    player1.x = randomPlatform.x + randomPlatform.width/2 - player1.width/2
    player1.y = randomPlatform.y - player1.height
}

function resetPlayer2() {
    player2.x = 700
    player2.y = 200
    player2.velocityX = 0
    player2.velocityY = 0
    player2.isJumping = false

    let platformNr = Math.floor(Math.random() * platforms.length)
    // wenn der zufällige platformnr gleich der platformnr von player1 ist, dann wiederhole die schleife
    while (platformNr === player1.platformNr) {
        platformNr = Math.floor(Math.random() * platforms.length)
    }
    const randomPlatform = platforms[platformNr]
    player2.x = randomPlatform.x + randomPlatform.width/2 - player2.width/2
    player2.y = randomPlatform.y - player2.height
}

// Create bullet function
function createBullet(player) {
    if (player.shootCooldown > 0) return;
    
    bullets.push({
        x: player.x + player.width/2,
        y: player.y + player.height/2,
        width: 8,
        height: 8,
        velocityX: BULLET_SPEED * player.lastDirection,
        velocityY: -3,
        color: player.color,
        owner: player.m
    });
    
    player.shootCooldown = SHOOT_COOLDOWN;
}

// Update bullets function
function updateBullets() {
    // für jeden bullet
    for (let i = bullets.length - 1; i >= 0; i--) {
        // aktuelles bullet in variable
        const bullet = bullets[i];

        // bullet fallen
        bullet.velocityY += gravity * 0.3;

        // bullet bewegen
        bullet.x += bullet.velocityX;
        bullet.y += bullet.velocityY;
        
        // Remove bullets that go off-screen
        if (bullet.x < 0 || bullet.x > canvas.width) {
            bullets.splice(i, 1);
            continue;
        }
        
        // Check for collision with players
        if (bullet.owner !== player1.m && checkCollision(bullet, player1)) {
            playerHit(player1);
            bullets.splice(i, 1);
        }
        
        if (bullet.owner !== player2.m && checkCollision(bullet, player2)) {
            playerHit(player2);
            bullets.splice(i, 1);
        }
    }
    
    // Update cooldowns
    if (player1.shootCooldown > 0) player1.shootCooldown--;
    if (player2.shootCooldown > 0) player2.shootCooldown--;
}

// Draw bullets
function drawBullets() {
    for (const bullet of bullets) {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x - bullet.width/2, bullet.y - bullet.height/2, bullet.width, bullet.height);
    }
}

// Collision detection
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Player hit by bullet
function playerHit(player) {
    if (player.m === 1) {
        playerDie(player1);
    } else {
        playerDie(player2);
     }
}


// Input handling
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    
    // Toggle AI with 'T' key
    if (e.code === 'KeyT') {
        aiEnabled = !aiEnabled;
        console.log(`AI ${aiEnabled ? 'enabled' : 'disabled'}`);
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Game functions
function drawPlayer(player) {
    if (!player) return;
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    for (const platform of platforms) {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
}

function movePlayer(player) {
    if (!player) return;

    if (player.m === 1) {
        //spieler 1
        // Horizontal movement
        if (keys.KeyA) {
            player.velocityX = -player.speed;
            player.lastDirection = -1;
        } else if (keys.KeyD) {
            player.velocityX = player.speed;
            player.lastDirection = 1;
        } else {
            player.velocityX = 0;
        }

        // Jumping
        if (keys.KeyW && !player.isJumping) {
            player.velocityY = -player.jumpForce;
            player.isJumping = true;
        }
        
        // Shooting
        if (keys.KeyF || keys.Capsadaock) {
            createBullet(player);
        }

    } else {
        // spieler2 - AI or keyboard control
        if (aiEnabled) {
            // AI controls
            if (player.aiActions.moveLeft) {
                player.velocityX = -player.speed;
                player.lastDirection = -1;
            } else if (player.aiActions.moveRight) {
                player.velocityX = player.speed;
                player.lastDirection = 1;
            } else {
                player.velocityX = 0;
            }
            
            if (player.aiActions.jump && !player.isJumping) {
                player.velocityY = -player.jumpForce;
                player.isJumping = true;
            }
            
            if (player.aiActions.shoot) {
                createBullet(player);
            }
        } else {
            // Keyboard controls (unchanged)
            if (keys.ArrowLeft) {
                player.velocityX = -player.speed;
                player.lastDirection = -1;
            } else if (keys.ArrowRight) {
                player.velocityX = player.speed;
                player.lastDirection = 1;
            } else {
                player.velocityX = 0;
            }

            // Jumping
            if ((keys.ArrowUp || keys.ShiftRight) && !player.isJumping) {
                player.velocityY = -player.jumpForce;
                player.isJumping = true;
            }
            
            // Shooting
            if (keys.ControlRight || keys.Numpad0) {
                createBullet(player);
            }
        }
    }

    // Apply velocity
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Apply gravity
    player.velocityY += gravity;

    // Platform collision detection
    for (const platform of platforms) {
        if (player.y + player.height > platform.y &&
            player.y < platform.y + platform.height &&
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width &&
            player.velocityY > 0) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isJumping = false;
        }
    }

    // Boundary checks
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    // Game over if player falls off the screen
    if (player.y > canvas.height) {
        playerDie(player)
    }
}

function playerDie(player) {    
    if (player.m === 1) {
        resetPlayer1()
        resetPlayer2()
        player2.score++
    } else if (player.m === 2) {
        resetPlayer1()
        resetPlayer2()
        player1.score++
    }

    if (player1.score > 4) {
        gameOver = true
        console.log(`Player 1 wins!`)
    } else if (player2.score > 4) {
        gameOver = true
        console.log(`Player 2 wins!`)
    }
}


function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '20px Arial';
    if (player1.score > player2.score) {
        ctx.fillStyle = player1.color;
        ctx.fillText(`Player 1 gewinnt! ${player1.score}:${player2.score}`, canvas.width / 2, canvas.height / 2 + 20);
    } else {
        ctx.fillStyle = player2.color;
        ctx.fillText(`Player 2 gewinnt! ${player2.score}: ${player1.score}`, canvas.width / 2, canvas.height / 2 + 20);
    }
    ctx.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2 + 60);
}

function restartGame() {
    player1.x = 100;
    player1.y = 200;
    player2.x = 700;
    player2.y = 200;
    player1.score = 0;
    player2.score = 0;
    gameOver = false;
    bullets.length = 0; // Clear all bullets
}



// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        // Update AI
        updateAI();
        
        // Update game state
        movePlayer(player1);
        movePlayer(player2);
        updateBullets();

        // Draw elements
        drawPlatforms();
        drawPlayer(player1);
        drawPlayer(player2);
        drawBullets();
        drawScore();
    } else {
        drawGameOver();
        if (keys.Space) {
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

function drawScore() {
    ctx.font = '20px Arial';

    ctx.fillStyle = player1.color;
    ctx.fillText(`Score: ${player1.score}`, 100, 30);

    ctx.fillStyle = player2.color;
    ctx.fillText(`Score: ${player2.score}`, 600, 30);
}

// AI logic for player 2
function updateAI() {
    if (!aiEnabled) return;
    
    player2.aiTimer++;
    
    // Make decisions at regular intervals
    if (player2.aiTimer >= player2.aiDecisionInterval) {
        player2.aiTimer = 0;
        const aiDecision = makeAIDecision();
        player2.aiActions = aiDecision;
    }
}

function makeAIDecision() {
    const actions = {
        moveLeft: false,
        moveRight: false,
        jump: false,
        shoot: false
    };
    
    // Decide horizontal movement - follow player1
    if (player1.x < player2.x - 100) {
        actions.moveLeft = true;
        player2.lastDirection = -1;
    } else if (player1.x > player2.x + 100) {
        actions.moveRight = true;
        player2.lastDirection = 1;
    }
    
    // Decide when to jump
    // 1. Jump if player1 is above
    const needToJumpForTarget = player1.y < player2.y - 50 && !player2.isJumping;
    
    // 2. Jump if close to edge of platform
    let aboutToFallOffPlatform = true;
    for (const platform of platforms) {
        if (player2.y + player2.height === platform.y) { // Standing on a platform
            // Check if we're near the edge
            const onPlatformEdge = 
                (player2.x < platform.x + 30 && actions.moveLeft) || 
                (player2.x + player2.width > platform.x + platform.width - 30 && actions.moveRight);
            
            if (!onPlatformEdge) {
                aboutToFallOffPlatform = false;
                break;
            }
        }
    }
    
    // 3. Sometimes jump randomly to navigate platforms
    const randomJump = !player2.isJumping && Math.random() < 0.03;
    
    // Combine jump conditions
    actions.jump = needToJumpForTarget || randomJump || (aboutToFallOffPlatform && !player2.isJumping);
    
    // Shoot with some probability when player1 is roughly at the same height
    const heightDifference = Math.abs(player1.y - player2.y);
    if (heightDifference < 100 && player2.shootCooldown === 0 && Math.random() < 0.3) {
        actions.shoot = true;
    }
    
    return actions;
}
