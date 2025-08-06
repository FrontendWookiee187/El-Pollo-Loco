/**
 * @fileoverview World class that manages the main game world, including character movement,
 * collision detection, enemy interactions, status bars, audio management, and game loop.
 * Handles the overall game state and coordinates between all game objects.
 * 
 * @version 1.0.0
 * @author Developer Academy
 * @since 2024               });
           });
       }
    }

    /**
     * Main rendering method that draws all game objects to the canvas.
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
        this.draw();
        this.setWorld(); 
        
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
            if (enemy instanceof Endboss) {
                enemy.animate();
            }
        });

        this.initAudioObjects();
        this.run();
        this.initBackgroundMusic();
    }

    /**
     * Initializes all audio objects for centralized mute control.
     * Collects character sounds, enemy sounds, and world sounds into a single array.
     * Includes special handling for Endboss audio objects.
     * 
     * @method
     * @returns {void}
     */
    initAudioObjects() {
        this.allAudioObjects = [
            this.backgroundMusic,
            this.chickenKOSound,
            this.soundBottleCollect,
            this.soundCoinCollect,
            this.character.jumpSound,
            this.character.stepSound,
            this.character.hurtSound,
            this.character.snorSound,
            this.character.idleSound,
            this.character.deadSound,
        ];

        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {
                this.allAudioObjects.push(enemy.bossSound, enemy.bossDeadSound, enemy.winnerSound);
            }
        });

        console.log('Audio-Objekte initialisiert:', this.allAudioObjects);
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
     * Manages game end state transitions with appropriate delays.
     * 
     * @method
     * @returns {void}
     */
    run() {
        this.intervalId = setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();

            if (!this.gameEnded) {
                if (this.character.isDead()) {
                    this.gameEnded = true;
                    
                    setTimeout(() => {
                    this.showEndScreen(false);
                    }, 3500);

                } else if (this.level.enemies.some(enemy => enemy instanceof Endboss && enemy.isKO)) {
                    this.gameEnded = true;

                    setTimeout(() => {
                    this.showEndScreen(true);
                    }, 3500);}
            }
        }, 1000 / 60);
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
     * Handles all collision detection in the game world.
     * Manages bottle-enemy collisions, collectible pickups, and character-enemy interactions.
     * Includes advanced logic for jump attacks, damage dealing, and invulnerability frames.
     * 
     * @method
     * @returns {void}
     */
    checkCollisions() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            if (bottle.hasCollided) return;
    
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy)) {
                    console.log('Flasche trifft Gegner:', enemy);
    
                    bottle.hasCollided = true;
    
                    clearInterval(bottle.throwInterval);
                    bottle.speedY = 0;
    
                    bottle.x = enemy.x + enemy.width / 2 - bottle.width / 2;
                    bottle.y = enemy.y + enemy.height / 2 - bottle.height / 2;
    
                    if (enemy instanceof Endboss) {
                        enemy.health -= 20;
                        this.statusBarEndboss.setPercentage(enemy.health);
                        if (enemy.health <= 0) {
                            enemy.isKO = true;
                        }
                    } else {
                        enemy.isKO = true;
                        enemy.speed = 0;
                        enemy.applyGravity = () => {};
                    }
    
                    bottle.startSplashAnimation();

                    setTimeout(() => {
                        if (this.throwableObjects.includes(bottle)) {
                            console.log('Entferne Flasche nach Splash-Animation:', bottle);
                            this.throwableObjects.splice(bottleIndex, 1);
                        }
                    }, bottle.IMAGES_SPLASH.length * 100);
                }
            });
        });
    
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isCollidingForCollecting(bottle)) {
                if (this.statusBarBottles.percentage < 100) {
                    this.level.bottles.splice(index, 1);
                    this.updateBottleStatusBar();
                    this.soundBottleCollect.play();
                    this.soundBottleCollect.volume = 0.3;
                } else {                    
                }
            }
        });
    
        this.level.coins.forEach((coin, index) => {
            if (this.character.isCollidingForCollecting(coin)) {
                if (this.statusBarCoins.percentage < 100) {
                    this.level.coins.splice(index, 1);
                    this.updateCoinStatusBar();
                    this.soundCoinCollect.play();
                    this.soundCoinCollect.volume = 0.3;
                } else {                    
                }
            }
        });
    
       let successfulJumpAttack = false;
       let enemiesToRemove = [];
       
       this.level.enemies.forEach(enemy => {
           if (this.character.isColliding(enemy)) {
               if ((enemy instanceof Chicken || enemy instanceof ChickenSmall) &&
                   this.character.speedY < -5 &&
                   this.character.y + this.character.height - this.character.offset.bottom >= enemy.y + enemy.offset.top &&
                   this.character.y + this.character.height - this.character.offset.bottom <= enemy.y + enemy.offset.top + 30 &&
                   this.character.x + this.character.offset.left < enemy.x + enemy.width - enemy.offset.right &&
                   this.character.x + this.character.width - this.character.offset.right > enemy.x + enemy.offset.left &&
                   !this.character.isInvulnerableAfterJumpAttack()
               ) {
                   console.log('Charakter trifft das Huhn von oben:', enemy);
                   enemy.isKO = true;
                   enemy.speed = 0;
       
                   this.chickenKOSound.play();
                   this.chickenKOSound.volume = 0.1;
       
                   enemiesToRemove.push(enemy);
                   successfulJumpAttack = true;
               }
           }
       });
       
       if (successfulJumpAttack) {
           this.character.speedY = 8;
           this.character.setJumpAttackInvulnerability();
       }
       
       if (enemiesToRemove.length > 0) {
           setTimeout(() => {
               enemiesToRemove.forEach(enemyToRemove => {
                   const index = this.level.enemies.indexOf(enemyToRemove);
                   if (index > -1) {
                       this.level.enemies.splice(index, 1);
                   }
               });
           }, 1000);
       }
       
       if (!successfulJumpAttack && !this.character.isInvulnerableAfterJumpAttack() && !this.character.isHurt()) {
           this.level.enemies.forEach(enemy => {
               if (this.character.isColliding(enemy)) {
                   this.character.hit();
                   this.statusBar.setPercentage(this.character.energy);
                   return;
               }
           });
       }
        }

    /**
     * Main rendering method that draws all game objects to the canvas.
     * Handles camera movement, layer ordering, and recursive frame drawing.
     * Includes status bar rendering and conditional endboss health display.
     * 
     * @method
     * @returns {void}
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);    
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
    this.level.enemies.forEach(enemy => {
        this.addToMap(enemy);
    });
    
        this.addToMap(this.character);
    
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
    
        this.throwableObjects.forEach(obj => this.addToMap(obj));
    
        this.ctx.translate(-this.camera_x, 0);
    
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarBottles);
        this.addToMap(this.statusBarCoins);     

        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss && enemy.isCharacterInRange()) {
                this.addToMap(this.statusBarEndboss);
            }
        });
  
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
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
     * Initializes and starts the background music for the game.
     * Sets up looping, volume, and mute state based on localStorage.
     * Applies mute setting to all audio objects.
     * 
     * @method
     * @returns {void}
     */
    initBackgroundMusic() {
        this.backgroundMusic = new Audio('./audio/background_game_2.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5;    
        const muted = localStorage.getItem('muted') === '1';
        this.backgroundMusic.muted = muted;
        this.backgroundMusic.play();    
        this.allAudioObjects.forEach(audio => {
            if (audio) {
                audio.muted = muted;
            }
        });
    }

    /**
     * Toggles mute state for all audio objects in the game.
     * Updates localStorage setting and applies to all audio elements.
     * Includes DOM audio elements, character sounds, and enemy sounds.
     * 
     * @method
     * @returns {void}
     */
    toggleMute() {    
        const isMuted = this.backgroundMusic.muted;    
        const newMuted = !isMuted;
        localStorage.setItem('muted', newMuted ? '1' : '0');

        const allAudioElements = document.querySelectorAll('audio');
        allAudioElements.forEach(audio => {
            audio.muted = newMuted;
        });

        this.allAudioObjects = [
            this.backgroundMusic,
            this.chickenKOSound,
            this.soundBottleCollect,
            this.soundCoinCollect,
            this.character.jumpSound,
            this.character.stepSound,
            this.character.hurtSound,
            this.character.snorSound,
            this.character.idleSound,
            this.character.deadSound,        
        ];

        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {
                this.allAudioObjects.push(enemy.bossSound, enemy.bossDeadSound, enemy.winnerSound);
            }
        });

        this.throwableObjects.forEach(bottle => {
            if (bottle.soundBrokenBottle) {
                this.allAudioObjects.push(bottle.soundBrokenBottle);
            }
        });

        this.allAudioObjects.forEach(audio => {
            if (audio) {
                audio.muted = newMuted;
            }
        });
    }

    /**
     * Displays the end screen when the game finishes.
     * Shows victory or defeat screen based on game outcome.
     * Hides game canvas and UI elements, stops all audio.
     * 
     * @method
     * @param {boolean} won - Whether the player won (true) or lost (false)
     * @returns {void}
     */
    showEndScreen(won) {
        console.log('showEndScreen aufgerufen:', won ? 'You Won' : 'You Lost');
        const endScreen = document.getElementById('endScreen');
        const endScreenImage = document.getElementById('endScreenImage');
        const canvas = document.getElementById('canvas');
        let h1 = document.getElementById('h1');
        let description = document.getElementById('description');
        let mute = document.getElementById('mute');

        canvas.style.display = 'none';
        endScreen.style.display = 'flex';
        document.getElementById('touchControls').style.display = 'none';

        h1.style.display = 'none';
        description.style.display = 'none';
        mute.style.display = 'none';  
        
        if (won) {
            endScreenImage.src = './img/You won, you lost/YouWonB.png';
        } else {
            endScreenImage.src = './img/You won, you lost/YouLost.png';
        }

        this.allAudioObjects.forEach(audio => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
                audio.muted = true;
                this.backgroundMusic.pause();        
            }      
        });    
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



