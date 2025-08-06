/** @type {HTMLCanvasElement} */
let canvas;
/** @type {World} */
let world;
/** @type {Keyboard} */
let keyboard = new Keyboard();	

/**
 * Initializes the game world, resets all relevant states and starts the game.
 * If a world already exists, it stops the previous game loop.
 * @returns {void}
 */
function init(){
    if (world) {
        world.stopGameLoop();
    }
    initLevel();
    setupCanvas();
    resetGameState();
    console.log('Spiel neu gestartet');
}

/**
 * Sets up the canvas element for the game.
 * @returns {void}
 */
function setupCanvas() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

/**
 * Resets the game state to initial values.
 * @returns {void}
 */
function resetGameState() {
    world.character.energy = 100;
    world.statusBar.setPercentage(100);
    world.level = level1;
    resetEnemies();
    world.gameEnded = false;
}

/**
 * Resets all enemies to their initial state.
 * @returns {void}
 */
function resetEnemies() {
    world.level.enemies.forEach(enemy => {
        if (enemy instanceof Endboss) {
            enemy.isKO = false;
            enemy.health = 100;
        } else {
            enemy.isKO = false;
        }
    });
}

/**
 * Handles keydown events and updates the keyboard state.
 * @param {KeyboardEvent} e
 */
window.addEventListener('keydown', (e) => {
    if(e.keyCode == 39) {
        keyboard.RIGHT = true;
    } else if(e.keyCode == 37) {
        keyboard.LEFT = true;
    } else if(e.keyCode == 38) {
        keyboard.UP = true;
    } else if(e.keyCode == 40) {
        keyboard.DOWN = true;
    } else if(e.keyCode == 32) {
        keyboard.SPACE = true;
    } else if(e.keyCode == 68) {
        keyboard.D = true;
    } 
});

/**
 * Handles keyup events and updates the keyboard state.
 * @param {KeyboardEvent} e
 */
window.addEventListener('keyup', (e) => {
    if(e.keyCode == 39) {
        keyboard.RIGHT = false;
    } else if(e.keyCode == 37) {
        keyboard.LEFT = false;
    } else if(e.keyCode == 38) {
        keyboard.UP = false;
    } else if(e.keyCode == 40) {
        keyboard.DOWN = false;
    } else if(e.keyCode == 32) {
        keyboard.SPACE = false;
    } else if(e.keyCode == 68) {
        keyboard.D = false;
    } 
});

/**
 * Handles DOMContentLoaded event to set up UI elements and event listeners.
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {
    const elements = getUIElements();
    setupMuteButton(elements.mute);
    setupGameButtons(elements);
});

/**
 * Gets all required UI elements.
 * @returns {Object} Object containing all UI element references
 */
function getUIElements() {
    return {
        startScreen: document.getElementById('startScreen'),
        endScreen: document.getElementById('endScreen'),
        endScreenImage: document.getElementById('endScreenImage'),
        startButton: document.getElementById('startButton'),
        restartButton: document.getElementById('restartButton'),
        backToStartButton: document.getElementById('backToStartButton'),
        canvas: document.getElementById('canvas'),
        h1: document.getElementById('h1'),
        description: document.getElementById('description'),
        mute: document.getElementById('mute'),
        touchControls: document.getElementById('touchControls'),
        muteIcon: document.getElementById('mute')
    };
}

/**
 * Sets up the mute button functionality.
 * @param {HTMLElement} mute - The mute button element
 * @returns {void}
 */
function setupMuteButton(mute) {
    updateMuteButton(mute);
    mute.addEventListener('click', () => {
        if (typeof world !== 'undefined' && world) {
            world.toggleMute();
            updateMuteButton(mute);
        }
    });
}

/**
 * Updates the mute button icon and state based on localStorage.
 * @param {HTMLElement} mute - The mute button element
 * @returns {void}
 */
function updateMuteButton(mute) {
    const muted = localStorage.getItem('muted') === '1';
    if (muted) {
        mute.innerHTML = '<span aria-hidden="true">&#128263;</span>';
        mute.classList.add('muted');
        mute.title = "Ton an";
    } else {
        mute.innerHTML = '<span aria-hidden="true">&#128266;</span>';
        mute.classList.remove('muted');
        mute.title = "Ton aus";
    }
}

/**
 * Sets up all game control buttons.
 * @param {Object} elements - UI elements object
 * @returns {void}
 */
function setupGameButtons(elements) {
    setupStartButton(elements);
    setupRestartButton(elements);
    setupBackToStartButton(elements);
}

/**
 * Sets up the start button functionality.
 * @param {Object} elements - UI elements object
 * @returns {void}
 */
function setupStartButton(elements) {
    elements.startButton.addEventListener('click', () => {
        elements.startScreen.style.display = 'none';
        elements.muteIcon.style.display = 'flex';
        elements.canvas.style.display = 'block';
        elements.h1.style.display = 'block'; 
        elements.description.style.display = 'flex';
        elements.mute.style.display = 'block';
        init();
        hindViewTouchButtons();
    });
}

/**
 * Sets up the restart button functionality.
 * @param {Object} elements - UI elements object
 * @returns {void}
 */
function setupRestartButton(elements) {
    elements.restartButton.addEventListener('click', () => {
        console.log('Restart Button clicked');
        if (world) {
            world.resetWorld();
            world = null;
        }
        elements.endScreen.style.display = 'none';
        elements.canvas.style.display = 'block';
        elements.h1.style.display = 'block'; 
        elements.description.style.display = 'flex';
        elements.mute.style.display = 'block';
        init();
        hindViewTouchButtons();
    });
}

/**
 * Sets up the back to start button functionality.
 * @param {Object} elements - UI elements object
 * @returns {void}
 */
function setupBackToStartButton(elements) {
    elements.backToStartButton.addEventListener('click', () => {
        console.log('Back to Start Button clicked');
        if (world) {
            world.resetWorld();
            world = null;
        }
        hideGameShowStart(elements);
    });
}

/**
 * Hides game elements and shows start screen.
 * @param {Object} elements - UI elements object
 * @returns {void}
 */
function hideGameShowStart(elements) {
    elements.endScreen.style.display = 'none';
    elements.startScreen.style.display = 'flex';
    elements.canvas.style.display = 'none';
    elements.h1.style.display = 'none'; 
    elements.description.style.display = 'none';
    elements.mute.style.display = 'none';
    elements.touchControls.style.display = 'none';
}

/**
 * Checks the device orientation and shows/hides the rotate message.
 * @returns {void}
 */
function checkOrientation() {
    let rotateMessage = document.getElementById('rotateMessage');
    if (window.innerHeight > window.innerWidth) {
        rotateMessage.style.display = 'flex';
    } else {
        rotateMessage.style.display = 'none';
    }
}

/**
 * Event listeners for orientation change and canvas resize.
 */
window.addEventListener('load', checkOrientation);
window.addEventListener('resize', checkOrientation);