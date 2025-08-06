/**
 * @fileoverview MovableObject class for El Pollo Loco game.
 * Extends DrawableObject with physics, collision detection, animation, and movement capabilities.
 * @author Daniel Grabowski
 * @version 1.0.0
 */

/**
 * MovableObject class providing physics and movement capabilities.
 * Extends DrawableObject to add gravity, collision detection, health system,
 * animation handling, and various movement mechanics for game entities.
 * 
 * @class
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {

    /**
     * Movement speed of the object.
     * @type {number}
     * @default 0.15
     */
    speed = 0.15;
    
    /**
     * Flag indicating if the object is facing the opposite direction.
     * @type {boolean}
     * @default false
     */
    otherDirection = false;
    
    /**
     * Vertical speed for jumping and gravity calculations.
     * @type {number}
     * @default 0
     */
    speedY = 0;
    
    /**
     * Gravity acceleration value.
     * @type {number}
     * @default 2.5
     */
    acceleration = 2.5;
    
    /**
     * Health/energy points of the object.
     * @type {number}
     * @default 100
     */
    energy = 100;

    /**
     * Timestamp of the last hit received.
     * @type {number}
     * @default 0
     */
    lastHit = 0;
    
    /**
     * Timestamp of the last successful jump attack performed.
     * @type {number}
     * @default 0
     */
    lastJumpAttack = 0;

    /**
     * Real X coordinate after applying offsets.
     * @type {number}
     */
    rX;
    
    /**
     * Real Y coordinate after applying offsets.
     * @type {number}
     */
    rY;
    
    /**
     * Real width after applying offsets.
     * @type {number}
     */
    rW;
    
    /**
     * Real height after applying offsets.
     * @type {number}
     */
    rH;

    /**
     * Collision detection offsets for precise hitbox calculation.
     * @type {Object}
     * @property {number} top - Offset from the top edge
     * @property {number} bottom - Offset from the bottom edge  
     * @property {number} left - Offset from the left edge
     * @property {number} right - Offset from the right edge
     */
    offset= {
        top: 50,
        bottom: 10,
        left: 0,
        right: 0
    };

    /**
     * Applies gravity physics to the object.
     * Continuously updates vertical position based on speedY and acceleration.
     * Handles different behavior for KO state and ground collision.
     * 
     * @method
     * @returns {void}
     */
    applyGravity() {
        setInterval(() => {
            if (!this.isKO && (this.isAboveGround() || this.speedY > 0)) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else if (this.isKO) {
                this.y = 400;
                this.speedY = 0;
            }
        }, 1000 / 60);
    }

    /**
     * Checks if the object is above ground level.
     * Different ground levels for different object types.
     * 
     * @method
     * @returns {boolean} True if object is above ground, false otherwise
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) { 
            return this.y < 480;
        } else {
            return this.y < 130;
        }
    }

    /**
     * Calculates the real frame boundaries considering collision offsets.
     * Updates rX, rY, rW, rH properties with offset-adjusted values.
     * 
     * @method
     * @returns {void}
     */
    getRealFrame(){
        this.rX = this.x + this.offset.left;
        this.rY = this.y + this.offset.top;
        this.rW = this.width - this.offset.left - this.offset.right;
        this.rH = this.height - this.offset.top - this.offset.bottom;
    }

    /**
     * Checks if this object is colliding with another movable object.
     * Uses offset-based collision detection for precise hitbox calculation.
     * 
     * @method
     * @param {MovableObject} mo - The other movable object to check collision with
     * @returns {boolean} True if objects are colliding, false otherwise
     */
    isColliding(mo) {
        let colliding = this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
               this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
               this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom &&
               this.y + this.height - this.offset.bottom > mo.y + mo.offset.top;       
        
        return colliding;
    }

    /**
     * Specialized collision detection for collecting objects (bottles and coins).
     * Uses smaller collision areas to ensure the character's body actually touches the objects.
     * Different offset calculations for different object types (coins vs bottles).
     * 
     * @method
     * @param {MovableObject} mo - The collectible object to check collision with
     * @returns {boolean} True if objects are colliding for collection, false otherwise
     */
    isCollidingForCollecting(mo) {
        const characterCollectOffset = {
            top: 30,
            bottom: 30,
            left: 35,
            right: 35
        };
        
        let objectCollectOffset;
        
        if (mo.constructor.name === 'Coin' || mo.height >= 150) {
            objectCollectOffset = {
                top: mo.height * 0.4,
                bottom: mo.height * 0.4,
                left: mo.width * 0.4,
                right: mo.width * 0.4
            };
        } else {
            objectCollectOffset = {
                top: mo.height * 0.3,
                bottom: mo.height * 0.3,
                left: mo.width * 0.3,
                right: mo.width * 0.3
            };
        }
        
        let colliding = this.x + characterCollectOffset.left < mo.x + mo.width - objectCollectOffset.right &&
               this.x + this.width - characterCollectOffset.right > mo.x + objectCollectOffset.left &&
               this.y + characterCollectOffset.top < mo.y + mo.height - objectCollectOffset.bottom &&
               this.y + this.height - characterCollectOffset.bottom > mo.y + objectCollectOffset.top;       
        
        return colliding;
    }

    /**
     * Handles damage received by the object.
     * Special logic for jump attacks - no damage if enemy is hit from above.
     * 
     * @method
     * @param {boolean} [enemyHitFromAbove=false] - Whether the enemy was hit from above (jump attack)
     * @returns {void}
     */
    hit(enemyHitFromAbove = false) {
        if (enemyHitFromAbove) {
            console.log('Kein Schaden, da der Charakter ein Huhn von oben getroffen hat.');
            return;
        }
    
        this.energy -= 20;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Checks if the object is currently in a hurt state.
     * Returns true for 1 second after being hit.
     * 
     * @method
     * @returns {boolean} True if object was hit within the last second, false otherwise
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1; 
    }

    /**
     * Checks if the object is invulnerable after performing a jump attack.
     * Provides 0.2 seconds of invulnerability after a successful jump attack.
     * 
     * @method
     * @returns {boolean} True if object is invulnerable after jump attack, false otherwise
     */
    isInvulnerableAfterJumpAttack() {
        let timepassed = new Date().getTime() - this.lastJumpAttack;
        timepassed = timepassed / 1000;
        return timepassed < 0.2;
    }

    /**
     * Sets the invulnerability period after a jump attack.
     * Records the current timestamp for jump attack invulnerability calculation.
     * 
     * @method
     * @returns {void}
     */
    setJumpAttackInvulnerability() {
        this.lastJumpAttack = new Date().getTime();
    }

    /**
     * Checks if the object is dead (energy below 20).
     * 
     * @method
     * @returns {boolean} True if object is dead, false otherwise
     */
    isDead() {
        return this.energy < 20;
    }

    /**
     * Plays an animation by cycling through the provided images.
     * Updates the current image and advances to the next frame.
     * 
     * @method
     * @param {string[]} images - Array of image paths for the animation
     * @returns {void}
     */
    playAnimation(images){
        let i = this.currentImage % images.length;
            let path = images[i];
            this.img = this.imageCache[path];
            this.currentImage++;
    }

    /**
     * Moves the object to the right by its speed value.
     * 
     * @method
     * @returns {void}
     */
    moveRight(){
        this.x += this.speed;
    }

    /**
     * Moves the object to the left by its speed value.
     * 
     * @method
     * @returns {void}
     */
    moveLeft(){
        this.x -= this.speed;
    }

    /**
     * Makes the object jump by setting vertical speed.
     * 
     * @method
     * @returns {void}
     */
    jump(){
        this.speedY = 30;
    }
}