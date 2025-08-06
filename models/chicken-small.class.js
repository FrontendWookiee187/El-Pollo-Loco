/**
 * @fileoverview Small chicken enemy class for El Pollo Loco game.
 * Represents smaller chicken enemies with walking animation and knockout behavior.
 * @author Daniel Grabowski
 * @version 1.0.0
 */

/**
 * ChickenSmall class representing small chicken enemies.
 * Extends MovableObject to inherit movement and collision detection capabilities.
 * Features walking animation, knockout states, and continuous leftward movement.
 * 
 * @class
 * @extends MovableObject
 */
class ChickenSmall extends MovableObject{
    
    /**
     * Width of the small chicken in pixels.
     * @type {number}
     * @default 60
     */
    width = 60;
    
    /**
     * Height of the small chicken in pixels.
     * @type {number}
     * @default 60
     */
    height = 60;
    
    /**
     * Y-coordinate position of the small chicken.
     * @type {number}
     * @default 365
     */
    y = 365;
    
    /**
     * Knockout state flag indicating if the chicken is defeated.
     * @type {boolean}
     * @default false
     */
    isKO = false;

    /**
     * Array of image paths for small chicken walking animation.
     * @type {string[]}
     * @constant
     */
    IMAGES_WALKING_SMALL = [
        './img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        './img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        './img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
]; 

    /**
     * Array of image paths for knockout/dead animation.
     * @type {string[]}
     * @constant
     */
    IMAGES_KO = [
        './img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    /**
     * Creates a new ChickenSmall instance.
     * Initializes the chicken with random position and speed, loads animations,
     * sets up collision offsets, and starts the animation loop.
     * 
     * @constructor
     */
    constructor() {
        super().loadImage('./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING_SMALL);
        this.loadImages(this.IMAGES_KO);
        
        this.x = 300 + Math.random() * 800;
        this.speed = 0.15 + Math.random() * 0.5;

        this.offset = {
            top: 5,
            bottom: 5,
            left: 0,
            right: 0
        };

        this.animate();
    }

    /**
     * Handles animation and movement behavior for the small chicken.
     * Sets up two intervals: one for movement logic and one for animation playback.
     * When alive, moves left continuously. When knocked out, falls down and plays death animation.
     * 
     * @method
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            if (!this.isKO) {
                this.moveLeft();
            } else {
                this.y += 5;
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isKO) {
                this.playAnimation(this.IMAGES_KO);
            } else {
                this.playAnimation(this.IMAGES_WALKING_SMALL);
            }
        }, 200);
    }
}
