const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const mazeContainer = document.getElementById("maze-container");
const baseCellSize = 40; // A base cell size
let cellSize = baseCellSize;
let maze = [];
let player = { x: 0, y: 0 };
let difficulty = "easy";
let mazeSize;

const moveSound = new Audio("beep.mp3");

function setDifficulty() {
    difficulty = document.getElementById("difficulty").value;
    generateMaze();
}

function adjustCellSize() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Set a max maze size based on screen size
    const maxMazeWidth = screenWidth * 0.9; // 90% of screen width
    const maxMazeHeight = screenHeight * 0.7; // 70% of screen height

    cellSize = Math.min(baseCellSize, maxMazeWidth / mazeSize, maxMazeHeight / mazeSize);
    cellSize = Math.round(cellSize)
}

function generateMaze() {
    mazeSize = difficulty === "easy" ? 15 : difficulty === "medium" ? 25 : difficulty === "hard" ? 40 : difficulty === "extreme" ? 100 : 15;
    // Adjust cell size based on difficulty. Make them smaller.
    cellSize = Math.round(difficulty === "easy" ? baseCellSize :
               difficulty === "medium" ? baseCellSize * 0.65 : // Smaller for medium
               difficulty === "hard" ? baseCellSize * 0.4 :              // A bit more smaller for hard
               baseCellSize * 0.2);    // A lot more smaller for extreme
    maze = Array.from({ length: mazeSize }, () => Array(mazeSize).fill(1));
    player = { x: 0, y: 0 };

    function carvePath(x, y) {
        maze[y][x] = 0;
        const directions = shuffle([
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 },
        ]);

        for (const dir of directions) {
            const newX = x + dir.dx * 2;
            const newY = y + dir.dy * 2;
            const wallX = x + dir.dx;
            const wallY = y + dir.dy;

            if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize && maze[newY][newX] === 1) {
                maze[wallY][wallX] = 0;
                carvePath(newX, newY);
            }
        }
    }

    carvePath(0, 0);
    maze[0][0] = 0;
    const endX = mazeSize - 1;
    const endY = mazeSize - 1;

    if (endX >= 0 && endY >= 0) maze[endY][endX] = 0;
    if (endX - 1 >= 0 && endY >= 0) maze[endY][endX - 1] = 0;
    if (endX >= 0 && endY - 1 >= 0) maze[endY - 1][endX] = 0;
    if (endX - 1 >= 0 && endY - 1 >= 0) maze[endY - 1][endX - 1] = 0;

adjustCellSize();
    drawMaze();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function drawMaze() {
    canvas.width = Math.round(mazeSize * cellSize); // Ensure whole pixels
    canvas.height = Math.round(mazeSize * cellSize);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            ctx.fillStyle = maze[y][x] === 1 ? "#444" : "#fff"; // Wall & path colors
            ctx.fillRect(Math.round(x * cellSize), Math.round(y * cellSize), Math.ceil(cellSize), Math.ceil(cellSize));
        }
    }

    // Draw the player
    ctx.fillStyle = "blue";
    ctx.fillRect(Math.round(player.x * cellSize), Math.round(player.y * cellSize), Math.floor(cellSize), Math.floor(cellSize));
}

function move(direction) {
    let { x, y } = player;
    let newX = x;
    let newY = y;

    if (direction === "up") newY--;
    if (direction === "down") newY++;
    if (direction === "left") newX--;
    if (direction === "right") newX++;

    if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize && maze[newY][newX] === 0) {
        player.x = newX;
        player.y = newY;
        drawMaze();
    }

    if (player.x === mazeSize - 1 && player.y === mazeSize - 1) {
        alert("You solved the maze!");
        generateMaze();
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const links = "https://gostiee.github.io/linktree"
    const copyrightLink = document.querySelector(".copyright a");
        copyrightLink.href = links;
});

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") move("up");
    if (event.key === "ArrowDown") move("down");
    if (event.key === "ArrowLeft") move("left");
    if (event.key === "ArrowRight") move("right");
    if (event.keyCode == 87) move("up");
    if (event.keyCode == 83) move("down");
    if (event.keyCode == 65) move("left");
    if (event.keyCode == 68) move("right");
});

document.addEventListener("DOMContentLoaded", () => {
    const difficultySelect = document.getElementById("difficulty");
    difficultySelect.addEventListener("change", setDifficulty);
    generateMaze();
});


document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault(); // Stop the page from scrolling with arrow keys, disables their normal/default behaviour
    }
});


let slidingMode = false;

function toggleSlidingMode() {
    slidingMode = !slidingMode;
    document.getElementById("toggleSlide").innerText = slidingMode ? "Sliding Mode: ON" : "Sliding Mode: OFF";
}

// Listen for 'M' key to toggle sliding mode on/off
document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "m") {
        toggleSlidingMode();
    }
});


function move(direction) {
    if (!slidingMode) {
        moveStep(direction);
    } else {
        slide(direction);
    }
}

function moveStep(direction) {
    let { x, y } = player;
    let newX = x, newY = y;

    if (direction === "up") newY--;
    if (direction === "down") newY++;
    if (direction === "left") newX--;
    if (direction === "right") newX++;

    if (isValidMove(newX, newY)) {
        player.x = newX;
        player.y = newY;
        drawMaze();
    }

    if (player.x === mazeSize - 1 && player.y === mazeSize - 1) {
        showAlert("🎉You solved the maze!🎉");
    }
}

function move(direction) {
    if (!slidingMode) {
        moveStep(direction);
    } else {
        slide(direction);
    }
}

function slide(direction) {
    let { x, y } = player;
    let newX = x, newY = y;

    if (!isValidMove(x + (direction === "right" ? 1 : direction === "left" ? -1 : 0),
                      y + (direction === "down" ? 1 : direction === "up" ? -1 : 0))) {
        return; // Checks if your move is valid, if not it doesnt do it therefore doesnt make the cube disappear
    }

    while (isValidMove(newX + (direction === "right" ? 1 : direction === "left" ? -1 : 0), 
                        newY + (direction === "down" ? 1 : direction === "up" ? -1 : 0))) {
        newX += (direction === "right" ? 1 : direction === "left" ? -1 : 0);
        newY += (direction === "down" ? 1 : direction === "up" ? -1 : 0);
    }

    animateSlide(player.x, player.y, newX, newY, () => {
        player.x = Math.round(newX); // Ensure correct positioning, makes it so you dont get stuck on walls (bugfix)
        player.y = Math.round(newY);
        drawMaze();

        if (player.x === mazeSize - 1 && player.y === mazeSize - 1) {
            showAlert("🎉You solved the maze!🎉");
        }
    });
}


function animateSlide(startX, startY, endX, endY, callback) {
    const speed = 0.01; // Pixels per millisecond (consistent speed)
    const distance = Math.hypot(endX - startX, endY - startY); // Calculate total distance
    const duration = distance / speed;
    const startTime = performance.now();

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        player.x = startX + (endX - startX) * progress;
        player.y = startY + (endY - startY) * progress;

        drawMaze(); 

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            player.x = endX;
            player.y = endY;
            drawMaze();
            if (callback) callback(); // Executes win check after slide finishes, so that you can also finish while in sliding mode
        }
    }

    requestAnimationFrame(step);
}


function isValidMove(x, y) {
    return x >= 0 && x < mazeSize && y >= 0 && y < mazeSize && maze[y][x] === 0;
}


function showAlert(title, message) {
    document.getElementById("alertTitle").textContent = title;
    
    const alertBox = document.getElementById("customAlert");
    const overlay = document.getElementById("blurOverlay");

    alertBox.style.display = "block";
    overlay.style.display = "block";

    alertBox.style.animation = "popIn 0.3s ease-out forwards";
    overlay.style.opacity = "1"; // Smooth fade-in effect
}

function closeAlert() {
    const alertBox = document.getElementById("customAlert");
    const overlay = document.getElementById("blurOverlay");

    alertBox.style.animation = "popOut 0.3s ease-in forwards";
    overlay.style.opacity = "0"; // Smooth fade-out effect
    generateMaze()

    setTimeout(() => {
        alertBox.style.display = "none";
        overlay.style.display = "none";
    }, 300); // Ensures animations finishes before hiding overlay
}

document.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        let alertBox = document.getElementById("customAlert");
        if (alertBox && alertBox.style.display === "block") {
            closeAlert();
        }
    }
});

document.addEventListener("keydown", function(event){
    if (event.key === "Backspace") {
        event.preventDefault();
        closeAlert();
    }
    })

let cm = false;

function tcm() {
    cm = !cm;
    document.getElementById("cmb").innerText = cm ? "ON" : "OFF";
}

function isValidMove(x, y) {
    // Ensure player stays within maze boundaries
    return (
        x >= 0 && x < mazeSize &&
        y >= 0 && y < mazeSize &&
        (cm || maze[y][x] === 0) // I wonder what it is.... hmmmm
    );
}

document.addEventListener("keydown", (event) => {
    if (event.keyCode == 67) { // use event.key.toLowerCase() if you dont mind others reading the code to know which key it is instantly
        document.getElementById("cmb").style.display = "block";
    }
});

document.addEventListener("keyup", (event) => {
    if (event.keyCode == 67) {
        document.getElementById("cmb").style.display = "none";
    }
});

document.addEventListener("contextmenu", function(event) {
    event.preventDefault();
  });

// Touch screen stuff below, for swiping movement etc.
let touchStartX = 0, touchStartY = 0;
let touchEndX = 0, touchEndY = 0;

document.getElementById("mazeCanvas").addEventListener("touchstart", (event) => {
    event.preventDefault();
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

document.getElementById("mazeCanvas").addEventListener("touchend", (event) => {
    event.preventDefault();
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;
    handleSwipe();
});

function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Set a threshold to prevent accidental small movements
    const swipeThreshold = 20; // Increase/decrease based on preference

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > swipeThreshold) move("right");
        else if (deltaX < -swipeThreshold) move("left");
    } else {
        // Vertical swipe
        if (deltaY > swipeThreshold) move("down");
        else if (deltaY < -swipeThreshold) move("up");
    }
}
