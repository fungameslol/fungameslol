document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('myCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const c = canvas.getContext('2d');

    let xPos = canvas.width / 2 - 25;
    let yPos = 600;
    const rectangleWidth = 50;
    const rectangleHeight = 50;
    let movementSpeed = 15;
    let velocity = 0;
    let acceleration = 0;
    let friction = 0.9;
    

    let speed = 3;
    let direction = 1;

    const fotbollImage = new Image();
    fotbollImage.src = 'bilder/fotboll2.png';

    const enemyY = 50;
    let enemyX = Math.random() * (canvas.width - rectangleWidth);

    let ballY = enemyY;
    let ballX = enemyX;
    const ballMove = 1;

    let touched = false;
    let score = 0;

    let speedFactor = 1;

    function update() {
        c.clearRect(0, 0, canvas.width, canvas.height);

        c.fillStyle = 'blue';
        c.fillRect(xPos, yPos, rectangleWidth, rectangleHeight);

        c.fillStyle = 'red';
        c.fillRect(enemyX, enemyY, rectangleWidth, rectangleHeight);

        c.drawImage(fotbollImage, ballX, ballY + ballMove, 50, 50);

        c.fillStyle = 'black';
        c.font = '40px Arial';
        c.fillText('Score: ' + score, 650, 55);

        if(ballY>700){
        c.fillStyle = 'black';
        c.fillRect(500, 200, 400, 450);

        c.fillStyle = 'white';
        c.font = '40px Arial';
        c.fillText('Well played!', 600, 300)
        c.fillText('your score was: ' + score, 550, 400)
        c.fillText('refresh page to restart', 505, 450)
        
        
        updateLeaderboard();
        displayLeaderboard();
    }
        

        enemyX += direction * speed * speedFactor;

        velocity += acceleration;
        velocity *= friction;
        xPos += velocity;

        xPos = Math.max(0, Math.min(canvas.width - rectangleWidth, xPos));
        if (
            ballX < xPos + rectangleWidth &&
            ballX + 50 > xPos &&
            ballY < yPos + rectangleHeight &&
            ballY + 50 > yPos
        ) {
            ballY = enemyY; // Reset ball position
            ballX = enemyX;
            score++;
        }

        if (enemyX + rectangleWidth >= canvas.width || enemyX <= 0) {
            direction *= -1;
        }

        moveBall();
        requestAnimationFrame(update);
    }

    function moveBall() {
        if (score <= 0) {
            ballY += 1.5;
        } else {
            ballY += 1 + score * 0.3;
            speedFactor = 1 + score * 0.1;
        }
    }

    function handleKeyPress(event) {
        switch (event.key) {
            case 'a':
            case 'ArrowLeft':
                acceleration = -0.4 - score * 0.04;
                break;
            case 'd':
            case 'ArrowRight':
                acceleration = 0.4 + score * 0.04;
                break;
        }
    }

    function handleKeyRelease(event) {
        switch (event.key) {
            case 'a':
            case 'd':
            case 'ArrowLeft':
            case 'ArrowRight':
                acceleration = 0;
                break;
        }
    }
    function displayLeaderboard() {
        const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
    
        const leaderboardCanvas = document.getElementById('leaderboardCanvas');
        const ctx = leaderboardCanvas.getContext('2d');
    
        // Clear existing content.
        ctx.clearRect(0, 0, leaderboardCanvas.width, leaderboardCanvas.height);
    
        // Set the font and alignment for the text.
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';
    
        // Display the top score (if available).
        if (leaderboardData.length > 0) {
            ctx.fillText(`Top Score: ${leaderboardData[0]}`, leaderboardCanvas.width / 2, 30);
        } else {
            ctx.fillText('No scores yet.', leaderboardCanvas.width / 2, 30);
        }
        const topScore = leaderboardData.length > 0 ? leaderboardData[0] : null;
    }

    function updateLeaderboard() {
        // Retrieve existing leaderboard data from localStorage.
        let leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
    
        // Add the current score to the leaderboard.
        leaderboardData.push(score);
    
        // Keep only the top N scores (adjust N as needed).
        const maxScores = 10;
        leaderboardData = leaderboardData.slice(0, maxScores);
    
        // Save the updated leaderboard back to localStorage.
        localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
    }
    
    
    
    

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyRelease);

    requestAnimationFrame(update);
});
