/**
 * @fileoverview StatusBarCoins class for El Pollo Loco game.
 * Displays the current coin collection count in the UI.
 * @author Daniel Grabowski
 * @version 1.0.0
 */

/**
 * StatusBarCoins class for displaying coin collection status.
 * Extends DrawableObject to show a visual status bar indicating the number of collected coins.
 * Features responsive positioning and percentage-based visual states.
 * 
 * @class
 * @extends DrawableObject
 */
class StatusBarCoins extends DrawableObject{

    /**
     * Array of image paths for different coin collection states.
     * Images represent 0%, 20%, 40%, 60%, 80%, and 100% coin collection progress.
     * @type {string[]}
     * @constant
     */
    IMAGES = [
        './img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        './img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        './img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        './img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        './img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        './img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
    ]

    /**
     * Current coin collection percentage.
     * @type {number}
     * @default 100
     */
    percentage = 100;

    /**
     * Creates a new StatusBarCoins instance.
     * Initializes the status bar with images, position, dimensions, and responsive behavior.
     * Sets up resize event listener for responsive positioning.
     * 
     * @constructor
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setPercentage(0);
        this.x = 30;
        this.y = 120;
        this.width = 200;
        this.height = 60;
        this.responsivePositioning();
         window.addEventListener('resize', () => this.responsivePositioning());
    }

    /**
     * Sets the coin collection percentage and updates the visual display.
     * Updates the status bar image based on the current coin collection percentage.
     * 
     * @method
     * @param {number} percentage - The new coin collection percentage (0-100)
     * @returns {void}
     */
    setPercentage(percentage){
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex(percentage)];
        this.img = this.imageCache[path]; 
      }

  /**
   * Adjusts the status bar position for responsive design.
   * Moves the status bar down on smaller screens (tablets and mobile devices).
   * 
   * @method
   * @returns {void}
   */
  responsivePositioning(){
   if(window.innerWidth <= 1024){      
      this.y = 140;      
   }
}
}