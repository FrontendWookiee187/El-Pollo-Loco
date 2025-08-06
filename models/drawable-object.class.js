/**
 * @fileoverview DrawableObject base class for El Pollo Loco game.
 * Provides fundamental drawing, image loading, and positioning capabilities for all drawable game objects.
 * @author Daniel Grabowski
 * @version 1.0.0
 */

/**
 * DrawableObject base class for all drawable game elements.
 * Provides core functionality for image handling, positioning, drawing, and collision detection.
 * Serves as the foundation for all visual game objects including characters, enemies, and collectibles.
 * 
 * @class
 */
class DrawableObject{

    /**
     * The main image object for this drawable object.
     * @type {Image}
     */
    img;
    
    /**
     * Cache for storing loaded images to improve performance.
     * @type {Object.<string, Image>}
     */
    imageCache = {};
    
    /**
     * Index of the current image in animation sequences.
     * @type {number}
     * @default 0
     */
    currentImage = 0;
    
    /**
     * X-coordinate position of the object.
     * @type {number}
     * @default 120
     */
    x = 120;
    
    /**
     * Y-coordinate position of the object.
     * @type {number}
     * @default 280
     */
    y = 280;
    
    /**
     * Height of the object in pixels.
     * @type {number}
     * @default 150
     */
    height = 150;
    
    /**
     * Width of the object in pixels.
     * @type {number}
     * @default 100
     */
    width = 100;

    /**
     * Collision detection offsets for precise hitbox calculation.
     * @type {Object}
     * @property {number} top - Offset from the top edge
     * @property {number} bottom - Offset from the bottom edge
     * @property {number} left - Offset from the left edge
     * @property {number} right - Offset from the right edge
     */
    offset= {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    /**
     * Loads a single image from the specified path.
     * Creates a new Image object and sets its source to the provided path.
     * 
     * @method
     * @param {string} path - The file path to the image
     * @returns {void}
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
        
        }

    /**
     * Draws the object on the canvas at its current position.
     * Renders the image with the object's current dimensions and coordinates.
     * 
     * @method
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @returns {void}
     */
    draw(ctx){
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
     }

     /**
      * Draws debug frames around objects for collision detection visualization.
      * Shows both the original object bounds (blue) and the collision hitbox (red) 
      * for specific object types during development and debugging.
      * 
      * @method
      * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
      * @returns {void}
      */
     drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof ThrowableObject || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
    
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'red';
            ctx.rect(
                this.x + this.offset.left,
                this.y + this.offset.top,
                this.width - this.offset.left - this.offset.right,
                this.height - this.offset.top - this.offset.bottom
            );
            ctx.stroke();
        }
    }

     /**
      * Loads multiple images into the image cache for animation sequences.
      * Pre-loads all images from the provided array to ensure smooth animation playback.
      * 
      * @method
      * @param {string[]} arr - Array of image file paths to load
      * @returns {void}
      */
     loadImages(arr) {
    arr.forEach((path) => {                
     let img = new Image();
     img.src = path;
      this.imageCache[path] = img;                
       });                
         }  
}