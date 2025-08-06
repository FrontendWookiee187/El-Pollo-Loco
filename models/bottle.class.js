/**
 * @fileoverview Bottle class for El Pollo Loco game.
 * Represents collectible bottle objects that can be picked up by the player for throwing.
 * @author Frontend Wookiee
 * @version 1.0.0
 */

/**
 * Bottle class for creating collectible bottle objects.
 * Extends DrawableObject to inherit basic drawing and positioning capabilities.
 * Bottles are randomly positioned collectibles that serve as ammunition for the player.
 * 
 * @class
 * @extends DrawableObject
 */
class Bottle extends DrawableObject{

    /**
     * Array of bottle image paths for random visual variation.
     * Contains different bottle sprites to add visual diversity.
     * @type {string[]}
     * @constant
     */
    IMAGES_BOTTLE = [
        './img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        './img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ]

    /**
     * Creates a new Bottle instance.
     * Loads a random bottle image and positions it either at specified coordinates
     * or at randomly generated coordinates within the game world.
     * 
     * @constructor
     * @param {number} [x] - X-coordinate position. If not provided, generates random position between 200-2200
     * @param {number} [y=380] - Y-coordinate position. Defaults to 380 if not provided
     */
    constructor(x, y) {
        super();
        this.loadImage(this.IMAGES_BOTTLE[Math.floor(Math.random() * this.IMAGES_BOTTLE.length)]);
        this.x = x || 200 + Math.random() * 2000;
        this.y = y || 380;
        this.height = 50;
        this.width = 50;
    }

}