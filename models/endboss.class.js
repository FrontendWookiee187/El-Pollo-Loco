/**
 * @fileoverview Endboss class for El Pollo Loco game.
 * Represents the final boss enemy with complex AI, multiple animations, and sound effects.
 * @author Daniel Grabowski
 * @version 1.0.0
 */

/**
 * Endboss class representing the final boss enemy.
 * Extends MovableObject to inherit movement, collision detection, and physics.
 * Features multiple animation states, AI behavior, sound effects, and jumping mechanics.
 * 
 * @class
 * @extends MovableObject
 */
class Endboss extends MovableObject {

    /**
     * Height of the endboss in pixels.
     * @type {number}
     * @default 400
     */
    height = 400;
    
    /**
     * Width of the endboss in pixels.
     * @type {number}
     * @default 250
     */
    width = 250;
    
    /**
     * Y-coordinate position of the endboss.
     * @type {number}
     * @default 55
     */
    y = 55;
    
    /**
     * Audio object for boss rage/alert sound effect.
     * @type {Audio}
     */
    bossSound = new Audio('./audio/boss_sound.mp3');
    
    /**
     * Audio object for boss death sound effect.
     * @type {Audio}
     */
    bossDeadSound = new Audio('./audio/boss_dead.mp3');
    
    /**
     * Audio object for victory sound effect.
     * @type {Audio}
     */
    winnerSound = new Audio('./audio/yeaoh-82662.mp3');

    /**
     * Array of image paths for walking/alert animation.
     * @type {string[]}
     * @constant
     */
    IMAGES_WALKING = [
        
        './img/4_enemie_boss_chicken/2_alert/G5.png',
        './img/4_enemie_boss_chicken/2_alert/G6.png',
        './img/4_enemie_boss_chicken/2_alert/G7.png',
        './img/4_enemie_boss_chicken/2_alert/G8.png',
        './img/4_enemie_boss_chicken/2_alert/G9.png',
        './img/4_enemie_boss_chicken/2_alert/G10.png',
        './img/4_enemie_boss_chicken/2_alert/G11.png',
        './img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    /**
     * Array of image paths for death animation.
     * @type {string[]}
     * @constant
     */
    IMAGES_DEAD = [
        
      './img/4_enemie_boss_chicken/5_dead/G24.png',
      './img/4_enemie_boss_chicken/5_dead/G25.png',
      './img/4_enemie_boss_chicken/5_dead/G26.png',
  ];

  /**
   * Array of image paths for attack animation.
   * @type {string[]}
   * @constant
   */
  IMAGES_ATTACK = [

    './img/4_enemie_boss_chicken/3_attack/G13.png',
    './img/4_enemie_boss_chicken/3_attack/G14.png',
    './img/4_enemie_boss_chicken/3_attack/G15.png',
    './img/4_enemie_boss_chicken/3_attack/G16.png',
    './img/4_enemie_boss_chicken/3_attack/G17.png',
    './img/4_enemie_boss_chicken/3_attack/G18.png',
    './img/4_enemie_boss_chicken/3_attack/G19.png',
    './img/4_enemie_boss_chicken/3_attack/G20.png',
  ];

  /**
   * Creates a new Endboss instance.
   * Initializes the boss with animations, position, health, speed, and collision offsets.
   * Sets up initial state for AI behavior and jumping mechanics.
   * 
   * @constructor
   * @param {World} world - Reference to the game world object
   */
  constructor(world) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_ATTACK);
    this.x = 2500;
    this.y = 55;
    this.health = 100;
    this.speed = 20;
    this.zIndex = 90    
    this.currentAnimation = this.IMAGES_WALKING;
    this.lastJumpTime = Date.now();
    this.isJumping = false;  

    this.offset = {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
  };
  }

  /**
   * Handles the endboss AI behavior and animation states.
   * Manages different states: death, attack (when character in range), and walking.
   * Controls jumping mechanics, movement towards character, sound effects, and animations.
   * 
   * @method
   * @returns {void}
   */
  animate() {
    setInterval(() => {
        const now = Date.now();

        if (this.health < 20) {
            this.isKO = true;
            this.setAnimation(this.IMAGES_DEAD);
            this.stopRageSound();
            this.bossDeadSound.play();
            this.bossDeadSound.volume = 0.5;
        
            if (!this.yeahSoundPlayed) {
                this.playYeahSound();
                this.yeahSoundPlayed = true;
            }
        
        } else if (this.isKO) {
            this.setAnimation(this.IMAGES_DEAD);
            this.bossDeadSound.play();
            this.bossDeadSound.volume = 0.5;
        
        } else if (this.isCharacterInRange()) {
            this.setAnimation(this.IMAGES_ATTACK);

            if (!this.isJumping && now - this.lastJumpTime > 2500) {
                this.isJumping = true;
                this.speedY = 50;
                this.lastJumpTime = now;
            }

            const character = this.world.character;
            if (this.x > character.x) {
                this.x -= this.speed;
            } else if (this.x < character.x) {
                this.x += this.speed;
            }

            if (this.isJumping) {
                this.y -= this.speedY;
                this.speedY -= 10;
                if (this.y >= 55) {
                    this.y = 55;
                    this.speedY = 0;
                    this.isJumping = false;
                }
            }

            if (this.bossSound.paused) {
                this.bossSound.play();
                this.bossSound.volume = 0.5;
            }
        } else {
            this.setAnimation(this.IMAGES_WALKING);
            this.stopRageSound();
        }

        this.playAnimation(this.currentAnimation);
    }, 200);
}

/**
 * Checks if the character is within the endboss's detection range.
 * Calculates horizontal distance between endboss and character to determine if attack mode should activate.
 * 
 * @method
 * @returns {boolean} True if character is within 500 pixels, false otherwise
 */
isCharacterInRange() { 

  if (!this.world || !this.world.character) {
      console.warn('World oder Character ist nicht definiert');
      return false;
  }

  const character = this.world.character;
  const distance = Math.abs(this.x - character.x);

  return distance < 500;
}

/**
 * Sets a new animation sequence for the endboss.
 * Only changes animation if it's different from the current one to avoid restarting the same animation.
 * 
 * @method
 * @param {string[]} images - Array of image paths for the new animation
 * @returns {void}
 */
setAnimation(images) {
  if (this.currentAnimation !== images) {
      this.currentAnimation = images;
      this.currentImage = 0;
      this.playAnimation(images);
  }
}

/**
 * Stops the boss rage sound effect.
 * Pauses the sound and resets playback position to the beginning.
 * 
 * @method
 * @returns {void}
 */
stopRageSound(){

  this.bossSound.pause();
  this.bossSound.currentTime = 0;
}

/**
 * Plays the victory sound effect when the boss is defeated.
 * Only plays if the boss health is below 20 (near death state).
 * 
 * @method
 * @returns {void}
 */
playYeahSound(){
 if (this.health < 20) {           
this.winnerSound.play();
this.winnerSound.volume = 0.5;
}}

}