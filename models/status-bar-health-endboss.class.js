/**
 * @fileoverview StatusBarEndboss class for El Pollo Loco game.
 * Displays the current health status of the endboss in the UI.
 * @author Daniel Grabowski
 * @version 1.0.0
 */

/**
 * StatusBarEndboss class for displaying endboss health status.
 * Extends DrawableObject to show a visual status bar indicating the endboss's remaining health.
 * Positioned in the top-right area of the screen during boss encounters.
 * 
 * @class
 * @extends DrawableObject
 */
class StatusBarEndboss extends DrawableObject{

    /**
     * Array of image paths for different endboss health states.
     * Images represent 0%, 20%, 40%, 60%, 80%, and 100% health levels.
     * @type {string[]}
     * @constant
     */
    IMAGES = [
        './img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        './img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        './img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        './img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        './img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        './img/7_statusbars/2_statusbar_endboss/orange/orange100.png'            
    ]    

    /**
     * Current endboss health percentage.
     * @type {number}
     * @default 100
     */
    percentage = 100;

    /**
     * Creates a new StatusBarEndboss instance.
     * Initializes the status bar with images, position in top-right area, and dimensions.
     * Sets initial health to 100% for the start of boss encounters.
     * 
     * @constructor
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setPercentage(100);
        this.x = 500;
        this.y = 10;
        this.width = 200;
        this.height = 60;
    }

    /**
     * Sets the endboss health percentage and updates the visual display.
     * Updates the status bar image based on the current endboss health percentage.
     * 
     * @method
     * @param {number} percentage - The new endboss health percentage (0-100)
     * @returns {void}
     */
    setPercentage(percentage){
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex(percentage)];
        this.img = this.imageCache[path]; 
      }
}



