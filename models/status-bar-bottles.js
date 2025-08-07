/**
 * @fileoverview StatusBarBottles class for El Pollo Loco game.
 * Displays the current bottle/hot sauce inventory count in the UI.
 * @author Daniel Grabowski
 * @version 1.0.0
 */

/**
 * StatusBarBottles class for displaying bottle inventory status.
 * Extends DrawableObject to show a visual status bar indicating the number of collected bottles.
 * Features responsive positioning and percentage-based visual states.
 * 
 * @class
 * @extends DrawableObject
 */
class StatusBarBottles extends DrawableObject{

    /**
     * Array of image paths for different bottle count states.
     * Images represent 0%, 20%, 40%, 60%, 80%, and 100% bottle capacity.
     * @type {string[]}
     * @constant
     */
    IMAGES = [
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png'
    ]

    /**
     * Current bottle inventory percentage.
     * @type {number}
     * @default 100
     */
    percentage = 100;

    /**
     * Creates a new StatusBarBottles instance.
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
        this.y = 60;
        this.width = 200;
        this.height = 60;
        this.responsivePositioning();
         window.addEventListener('resize', () => this.responsivePositioning());
    }

    /**
     * Sets the bottle inventory percentage and updates the visual display.
     * Updates the status bar image based on the current bottle count percentage.
     * 
     * @method
     * @param {number} percentage - The new bottle inventory percentage (0-100)
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
      this.y = 80;      
   }
}
}



