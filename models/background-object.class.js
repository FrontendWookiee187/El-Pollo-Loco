/**
 * @fileoverview Background object class for El Pollo Loco game.
 * Represents static background images used for creating parallax scrolling effects.
 * @author Daniel Grabowski
 * @version 1.0.0
 */

/**
 * BackgroundObject class for creating static background elements.
 * Extends MovableObject to inherit basic positioning and image loading capabilities.
 * Used for creating layered background images that provide depth and visual appeal.
 * 
 * @class
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject{

    /**
     * Width of the background object in pixels.
     * @type {number}
     * @default 720
     */
    width = 720;
    
    /**
     * Height of the background object in pixels.
     * @type {number}
     * @default 480
     */
    height = 480;    

    /**
     * Creates a new BackgroundObject instance.
     * Loads the specified image and positions it at the given x-coordinate.
     * The y-position is automatically calculated to align with the bottom of the canvas.
     * 
     * @constructor
     * @param {string} imagePath - Path to the background image file
     * @param {number} x - X-coordinate position for the background object
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;        
    }

}