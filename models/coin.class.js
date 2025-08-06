/**
 * @fileoverview Coin class for El Pollo Loco game.
 * Represents collectible coin objects with animated spinning effect.
 * @author Frontend Wookiee
 * @version 1.0.0
 */

/**
 * Coin class for creating collectible coin objects with animation.
 * Extends DrawableObject to inherit basic drawing and positioning capabilities.
 * Features animated spinning effect and can be positioned randomly or at specific coordinates.
 * 
 * @class
 * @extends DrawableObject
 */
class Coin extends DrawableObject{

    /**
     * Array of image paths for coin animation (spinning effect).
     * @type {string[]}
     * @constant
     */
    IMAGES_COIN = [
        './img/8_coin/coin_1.png',
        './img/8_coin/coin_2.png'
    ]

    /**
     * Creates a new Coin instance.
     * Loads a random initial coin image and positions it either at specified coordinates
     * or at randomly generated coordinates. Sets up collision offsets and starts animation.
     * 
     * @constructor
     * @param {number} [x] - X-coordinate position. If not provided, generates random position between 200-2187
     * @param {number} [y=300] - Y-coordinate position. Defaults to 300 if not provided
     */
    constructor(x, y) {
        super();
        this.loadImage(this.IMAGES_COIN[Math.floor(Math.random() * this.IMAGES_COIN.length)]);
        this.x = x || 200 + Math.random() * 1987;
        this.y = y || 300;
        this.height = 200;
        this.width = 200;

        this.offset = {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
        };
    }    

    /**
     * Handles the coin's spinning animation by cycling through images.
     * Creates a continuous animation effect by switching between coin images every 200ms.
     * 
     * @method
     * @returns {void}
     */
    animate() {
        let currentImageIndex = 0;
        setInterval(() => {
            currentImageIndex = (currentImageIndex + 1) % this.IMAGES_COIN.length;
            this.img = this.imageCache[this.IMAGES_COIN[currentImageIndex]];
        }, 200);
    }
}