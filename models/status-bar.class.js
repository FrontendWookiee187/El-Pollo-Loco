/**
 * @fileoverview StatusBar class for El Pollo Loco game.
 * Displays the current health status of the player character in the UI.
 * @author Daniel Grabowski
 * @version 1.0.0
 */

/**
 * StatusBar class for displaying player health status.
 * Extends DrawableObject to show a visual status bar indicating the player's remaining health.
 * Features responsive positioning and percentage-based visual states.
 * 
 * @class
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject{

    /**
     * Array of image paths for different player health states.
     * Images represent 0%, 20%, 40%, 60%, 80%, and 100% health levels.
     * @type {string[]}
     * @constant
     */
    IMAGES = [
        './img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        './img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        './img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        './img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        './img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        './img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png',
    ]

    /**
     * Current player health percentage.
     * @type {number}
     * @default 100
     */
    percentage = 100;

    /**
     * Creates a new StatusBar instance.
     * Initializes the status bar with images, position, dimensions, and responsive behavior.
     * Sets up resize event listener for responsive positioning.
     * 
     * @constructor
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setPercentage(100);
        this.x = 30;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.percentage = 100;
        this.responsivePositioning();
         window.addEventListener('resize', () => this.responsivePositioning());
    }

    /**
     * Sets the player health percentage and updates the visual display.
     * Updates the status bar image based on the current player health percentage.
     * 
     * @method
     * @param {number} percentage - The new player health percentage (0-100)
     * @returns {void}
     */
    setPercentage(percentage){
      this.percentage = percentage;
      let path = this.IMAGES[this.resolveImageIndex()];
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
          this.y = 20;      
       }
    }

      /**
       * Resolves the appropriate image index based on the current health percentage.
       * Maps percentage ranges to corresponding image indices for visual representation.
       * 
       * @method
       * @returns {number} Index (0-5) corresponding to the appropriate status bar image
       */
      resolveImageIndex(){
        if (this.percentage == 100){
           return 5; 
        } else if(this.percentage >= 80){
           return 4; 
        } else if(this.percentage >= 60){
           return 3; 
        } else if(this.percentage >= 40){
           return 2; 
        } else if(this.percentage >= 20){
           return 1; 
        } else {
           return 0; 
        }
        
    }  
}

