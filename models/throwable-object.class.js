/**
 * @fileoverview ThrowableObject class for El Pollo Loco game.
 * Represents bottles that can be thrown as projectiles with physics, animations, and collision detection.
 * @author Frontend Wookiee
 * @version 1.0.0
 */

/**
 * ThrowableObject class representing throwable bottle projectiles.
 * Extends MovableObject to add throwing physics, rotation animation, splash effects, and enemy collision.
 * Features parabolic trajectory, collision detection, and visual/audio feedback on impact.
 * 
 * @class
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
    /**
     * Flag indicating whether the bottle has hit a target or ground.
     * @type {boolean}
     * @default false
     */
    hasHit = false;
    
    /**
     * Audio object for broken bottle sound effect.
     * @type {Audio}
     */
    soundBrokenBottle = new Audio('./audio/broken_bottle.mp3');

    /**
     * Array of image paths for bottle rotation animation during flight.
     * @type {string[]}
     * @constant
     */
    IMAGES_ROTATION = [
        './img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        './img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        './img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        './img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    /**
     * Array of image paths for bottle splash animation on impact.
     * @type {string[]}
     * @constant
     */
    IMAGES_SPLASH = [
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
        ];

    /**
     * Creates a new ThrowableObject instance.
     * Initializes the bottle with position, animations, physics properties, and collision offsets.
     * Automatically starts the throwing motion upon creation.
     * 
     * @constructor
     * @param {number} x - Initial X-coordinate position
     * @param {number} y - Initial Y-coordinate position
     */
    constructor(x, y) {

        super().loadImage('./img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 60;
        this.speedX = 6;
        this.zIndex = 100;
        this.throw();

        this.offset = {
            top: 12,
            bottom: 12,
            left: 12,
            right: 12
        };        
        
    }

    /**
     * Initiates the throwing motion with parabolic trajectory and rotation animation.
     * Sets up physics properties, starts rotation animation, and handles movement intervals.
     * Supports throwing in both directions and includes ground collision detection.
     * 
     * @method
     * @param {boolean} [otherDirection=false] - Whether to throw in the opposite direction (left instead of right)
     * @returns {void}
     */
    throw(otherDirection) {
        this.speedY = 20;
        this.acceleration = 1.5;
        this.speedX = 6;
    
        let animationInterval = setInterval(() => {
            if (!this.hasHit) {
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 120);
    
        this.throwInterval = setInterval(() => {
            if (this.hasHit) {
                clearInterval(this.throwInterval);
                clearInterval(animationInterval);
                return;
            }
    
            if (otherDirection) {
                this.x -= this.speedX;
            } else {
                this.x += this.speedX;
            }
    
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            
            if (this.y >= 390) {
                this.y = 390;
                this.speedY = 0;
                this.hasHit = true;
                this.startSplashAnimation();
            }
        }, 1000 / 50);
    }
 
    /**
     * Handles collision detection between the bottle and enemies.
     * Checks for collisions only when bottle is visible on screen.
     * Applies different damage/effects based on enemy type (Endboss vs normal enemies).
     * 
     * @method
     * @param {MovableObject[]} enemies - Array of enemy objects to check collision against
     * @returns {void}
     */
    handleBottleCollision(enemies) {
        if (this.x >= 0 && this.x <= 720 && this.y >= 0 && this.y <= 390) {
            enemies.forEach((enemy) => {
                if (!this.hasHit && this.isColliding(enemy)) {                    
    
                    this.hasHit = true;
    
                    clearInterval(this.throwInterval);
                    this.speedY = 0;
    
                    this.x = enemy.x + enemy.width / 2 - this.width / 2;
                    this.y = enemy.y + enemy.height / 2 - this.height / 2;
    
                    if (enemy instanceof Endboss) {
                        enemy.health -= 20;
                        if (enemy.health <= 0) {
                            enemy.isKO = true;
                        }
                    } else {
                        enemy.isKO = true;
                        enemy.speed = 0;
                        enemy.applyGravity = () => {};
                    }
    
                    this.startSplashAnimation();
                }
            });
        }
    }

    /**
     * Starts the splash animation when bottle hits an enemy.
     * Loads splash images, plays break animation, and handles audio playback.
     * Removes the bottle from the world's throwableObjects array after animation completes.
     * 
     * @method
     * @returns {void}
     */
    startSplashAnimation() {        
        console.log('Starte Splash-Animation an Position:', this.x, this.y);
        this.loadImages(this.IMAGES_SPLASH);
        this.playAnimation(this.IMAGES_SPLASH);

        if (this.world && this.soundBrokenBottle) {
            try {
                this.soundBrokenBottle.muted = this.world.backgroundMusic.muted;
                this.soundBrokenBottle.volume = 0.3;
                this.soundBrokenBottle.currentTime = 0;
                this.soundBrokenBottle.play().catch(error => {
                    console.log('Audio play interrupted:', error);
                });
            } catch (error) {
                console.log('Audio error:', error);
            }
        }
        
        setTimeout(() => {
            const bottleIndex = this.world.throwableObjects.indexOf(this);
            if (bottleIndex > -1) {
                console.log('Entferne Flasche nach Splash-Animation:', this);
                this.world.throwableObjects.splice(bottleIndex, 1);
            }
        }, this.IMAGES_SPLASH.length * 100);
    }
} 