/**
 * @fileoverview World class that manages the main game world, including character movement,
 * collision detection, enemy interactions, status bars, audio management, and game loop.
 * Handles the overall game state and coordinates between all game objects.
 * 
 * @version 1.0.0
 * @author Daniel Grabowski
 * @since 2024
 */

/**
 * Main game world class that coordinates all game elements and manages the game loop.
 * Handles rendering, collision detection, audio management, and game state transitions.
 * 
 * @class
 */
class World{
    /** @type {Character} The main playable character */
    character = new Character();
    /** @type {Level} The current game level containing enemies, objects, and backgrounds */
    level = level1;
    /** @type {HTMLCanvasElement} The HTML canvas element for rendering */
    canvas;
    /** @type {CanvasRenderingContext2D} The 2D rendering context for the canvas */
    ctx;
    /** @type {Keyboard} The keyboard input handler */
    keyboard;
    /** @type {number} Camera X-offset for scrolling background */
    camera_x = 0;
    /** @type {StatusBar} Health status bar display */
    statusBar = new StatusBar();
    /** @type {StatusBarBottles} Bottle inventory status bar */
    statusBarBottles = new StatusBarBottles();
    /** @type {StatusBarCoins} Coin collection status bar */
    statusBarCoins = new StatusBarCoins();
    /** @type {StatusBarEndboss} Endboss health status bar */
    statusBarEndboss = new StatusBarEndboss();
    /** @type {ThrowableObject[]} Array of thrown bottle objects */
    throwableObjects = [];
    /** @type {Audio} Sound effect for chicken knockout */
    chickenKOSound = new Audio('./audio/chicken_head_edited.mp3')
    /** @type {Audio} Sound effect for bottle collection */
    soundBottleCollect = new Audio('./audio/collect_bottle.mp3')
    /** @type {Audio} Sound effect for coin collection */
    soundCoinCollect = new Audio('./audio/coin_collect.mp3')
    /** @type {boolean} Flag to track if the game has ended */
    gameEnded = false;
    /** @type {number} Interval ID for the main game loop */
    intervalId;
    /** @type {Audio[]} Array containing all audio objects for mute control */
    allAudioObjects = [];
    /** @type {number} Timestamp of the last bottle throw for rate limiting */
    lastBottleThrow = 0;
    /** @type {CollisionManager} Handles all collision detection */
    collisionManager;
    /** @type {RenderingManager} Handles all rendering operations */
    renderingManager;
    /** @type {AudioManager} Handles all audio operations */
    audioManager;
    /** @type {UIManager} Handles all UI operations */
    uiManager;

    /**
     * Creates a new World instance and initializes the game environment.
     * Sets up canvas context, keyboard input, starts rendering and game loop.
     * Initializes all enemies, audio objects, and background music.
     * 
     * @constructor
     * @param {HTMLCanvasElement} canvas - The HTML canvas element for rendering
     * @param {Keyboard} keyboard - The keyboard input handler object
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.initializeManagers();
        this.draw();
        this.setWorld(); 
        this.initializeEnemies();
        this.audioManager.initAudioObjects();
        this.run();
        this.audioManager.initBackgroundMusic();
    }

    /**
     * Initializes all manager classes for the world.
     * Creates instances of specialized managers for different aspects.
     * 
     * @method
     * @returns {void}
     */
    initializeManagers() {
        this.collisionManager = new CollisionManager(this);
        this.renderingManager = new RenderingManager(this);
        this.audioManager = new AudioManager(this);
        this.uiManager = new UIManager(this);
    }

    /**
     * Initializes all enemies in the level.
     * Sets world reference and starts Endboss animation.
     * 
     * @method
     * @returns {void}
     */
    initializeEnemies() {
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
            if (enemy instanceof Endboss) {
                enemy.animate();
            }
        });
    }

    /**
     * Sets the world reference for the character to enable world interaction.
     * Allows the character to access world properties and methods.
     * 
     * @method
     * @returns {void}
     */
    setWorld(){
       this.character.world = this; 
    }

    /**
     * Starts the main game loop with collision detection and game state checks.
     * Runs at 60 FPS and handles character death and endboss victory conditions.
     * 
     * @method
     * @returns {void}
     */
    run() {
        this.intervalId = setInterval(() => {
            this.collisionManager.checkAllCollisions();
            this.checkThrowObjects();
            this.checkGameEndConditions();
        }, 1000 / 60);
    }

    /**
     * Checks for game end conditions and handles transitions.
     * Monitors character death and endboss defeat scenarios.
     * 
     * @method
     * @returns {void}
     */
    checkGameEndConditions() {
        if (!this.gameEnded) {
            if (this.character.isDead()) {
                this.handleGameLoss();
            } else if (this.level.enemies.some(enemy => enemy instanceof Endboss && enemy.isKO)) {
                this.handleGameWin();
            }
        }
    }

    /**
     * Handles the game loss scenario.
     * Sets game end flag and shows defeat screen after delay.
     * 
     * @method
     * @returns {void}
     */
    handleGameLoss() {
        this.gameEnded = true;
        setTimeout(() => {
            this.uiManager.showEndScreen(false);
        }, 3500);
    }

    /**
     * Handles the game win scenario.
     * Sets game end flag and shows victory screen after delay.
     * 
     * @method
     * @returns {void}
     */
    handleGameWin() {
        this.gameEnded = true;
        setTimeout(() => {
            this.uiManager.showEndScreen(true);
        }, 3500);
    }

    /**
     * Stops the main game loop by clearing the interval.
     * Used when the game ends or needs to be paused.
     * 
     * @method
     * @returns {void}
     */
    stopGameLoop() {
        clearInterval(this.intervalId);
    }

    /**
     * Handles bottle throwing mechanics with rate limiting and direction control.
     * Checks keyboard input, bottle availability, and throw cooldown.
     * Creates new ThrowableObject instances and updates bottle status bar.
     * 
     * @method
     * @returns {void}
     */
    checkThrowObjects() {
        const now = Date.now();
        if (this.keyboard.D && this.statusBarBottles.percentage > 0 && (now - this.lastBottleThrow > 1500)) {
            let bottleX;
            let bottleY = this.character.y + 100;
            if (this.character.otherDirection) {
                bottleX = this.character.x - 100;
            } else {
                bottleX = this.character.x + 100;
            }
            let bottle = new ThrowableObject(bottleX, bottleY);
            bottle.world = this;
            bottle.soundBrokenBottle.muted = this.backgroundMusic.muted;
            bottle.throw(this.character.otherDirection);
            this.throwableObjects.push(bottle);
            this.updateBottleStatusBarOnThrow();
            this.lastBottleThrow = now;
        }
    }

    /**
     * Main rendering method that draws all game objects to the canvas.
     * Delegates to the rendering manager for actual drawing operations.
     * 
     * @method
     * @returns {void}
     */
    draw() {
        this.renderingManager.draw();
    }

    /**
     * Helper method to add multiple objects to the rendering map.
     * Iterates through an array of objects and renders each one.
     * 
     * @method
     * @param {DrawableObject[]} objects - Array of drawable objects to render
     * @returns {void}
     */
    addObjectsToMap(objects){
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Adds a single movable object to the rendering context.
     * Handles image flipping for directional sprites and draws the object.
     * 
     * @method
     * @param {MovableObject} mo - The movable object to render
     * @returns {void}
     */
    addToMap(mo){
        if (mo.otherDirection) {
            this.flipImage(mo);            
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo); 
        }
    }

    /**
     * Flips an image horizontally for directional rendering.
     * Saves canvas state and applies horizontal scale transformation.
     * 
     * @method
     * @param {MovableObject} mo - The movable object to flip
     * @returns {void}
     */
    flipImage(mo){
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the original image orientation after flipping.
     * Resets object position and restores canvas state.
     * 
     * @method
     * @param {MovableObject} mo - The movable object to restore
     * @returns {void}
     */
    flipImageBack(mo){
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * Updates the bottle status bar when a bottle is collected.
     * Increases the bottle count up to a maximum of 5 bottles (100%).
     * 
     * @method
     * @returns {void}
     */
    updateBottleStatusBar() {
        let maxBottles = 5;
        let currentPercentage = this.statusBarBottles.percentage;
        if (currentPercentage < 100) {
            let newPercentage = currentPercentage + (100 / maxBottles);
            this.statusBarBottles.setPercentage(Math.min(newPercentage, 100));
        }
    }

    /**
     * Updates the bottle status bar when a bottle is thrown.
     * Decreases the bottle count down to a minimum of 0 bottles (0%).
     * 
     * @method
     * @returns {void}
     */
    updateBottleStatusBarOnThrow() {
        let maxBottles = 5;
        let currentPercentage = this.statusBarBottles.percentage;
        if (currentPercentage > 0) {
            let newPercentage = currentPercentage - (100 / maxBottles);
            this.statusBarBottles.setPercentage(Math.max(newPercentage, 0));
        }
    }

    /**
     * Updates the coin status bar when a coin is collected.
     * Increases the coin count up to a maximum of 5 coins (100%).
     * 
     * @method
     * @returns {void}
     */
    updateCoinStatusBar() {
        let maxCoins = 5;
        let currentPercentage = this.statusBarCoins.percentage;
        if (currentPercentage < 100) {
            let newPercentage = currentPercentage + (100 / maxCoins);
            this.statusBarCoins.setPercentage(Math.min(newPercentage, 100));
        }
    }

    /**
     * Toggles mute state for all audio objects in the game.
     * Delegates to the audio manager for mute handling.
     * 
     * @method
     * @returns {void}
     */
    toggleMute() {
        this.audioManager.toggleMute();
    }

    /**
     * Resets the world state and stops all game processes.
     * Called when the game needs to be restarted or cleaned up.
     * 
     * @method
     * @returns {void}
     */
    resetWorld() {
        this.stopGameLoop();
    }
}



