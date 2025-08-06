/**
 * @fileoverview Cloud class for El Pollo Loco game.
 * Represents moving cloud objects that create atmospheric background elements.
 * @author Daniel Grabowski
 * @version 1.0.0
 */

/**
 * Cloud class for creating animated background cloud elements.
 * Extends MovableObject to inherit movement capabilities.
 * Clouds move continuously from right to left to create a parallax effect.
 * 
 * @class
 * @extends MovableObject
 */
class Cloud extends MovableObject{

    /**
     * Y-coordinate position of the cloud (high in the sky).
     * @type {number}
     * @default 20
     */
    y = 20;
    
    /**
     * Width of the cloud in pixels.
     * @type {number}
     * @default 500
     */
    width = 500;
    
    /**
     * Height of the cloud in pixels.
     * @type {number}
     * @default 250
     */
    height = 250;   
    
    /**
     * Creates a new Cloud instance.
     * Loads the cloud image, sets a random horizontal position,
     * and starts the continuous movement animation.
     * 
     * @constructor
     */
    constructor() {
        super().loadImage('./img/5_background/layers/4_clouds/1.png');
        
         this.x = Math.random() * 500;
         this.animate();
       
    }

    /**
     * Handles the cloud's continuous leftward movement animation.
     * Creates a smooth scrolling effect at 60 FPS for atmospheric background motion.
     * 
     * @method
     * @returns {void}
     */
    animate(){
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }

   
}