/**
 * @fileoverview Normal chicken enemy class for El Pollo Loco game.
 * Represents standard-sized chicken enemies with walking animation and knockout behavior.
 * @author Frontend Wookiee
 * @version 1.0.0
 */

/**
 * Chicken class representing normal-sized chicken enemies.
 * Extends MovableObject to inherit movement and collision detection capabilities.
 * Features walking animation, knockout states, and continuous leftward movement.
 * 
 * @class
 * @extends MovableObject
 */
class Chicken extends MovableObject{
    
    /**
     * Width of the chicken in pixels.
     * @type {number}
     * @default 80
     */
    width = 80;
    
    /**
     * Height of the chicken in pixels.
     * @type {number}
     * @default 80
     */
    height = 80;
    
    /**
     * Y-coordinate position of the chicken.
     * @type {number}
     * @default 350
     */
    y = 350;
    
    /**
     * Knockout state flag indicating if the chicken is defeated.
     * @type {boolean}
     * @default false
     */
    isKO = false;

    /**
     * Array of image paths for chicken walking animation.
     * @type {string[]}
     * @constant
     */
    IMAGES_WALKING = [
        './img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        './img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        './img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',                
    ]

    /**
     * Array of image paths for knockout/dead animation.
     * @type {string[]}
     * @constant
     */
    IMAGES_KO =[
        './img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    /**
     * Creates a new Chicken instance.
     * Initializes the chicken with random position and speed, loads animations,
     * sets up collision offsets, and starts the animation loop.
     * 
     * @constructor
     */
    constructor() {
        super().loadImage('./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_KO);
        
        this.x = 450 + Math.random() * 800;
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
     * Handles animation and movement behavior for the chicken.
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
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }
}
