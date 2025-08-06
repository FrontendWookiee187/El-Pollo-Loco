/**
 * @fileoverview Character class for El Pollo Loco game.
 * Represents the main playable character with movement, animation, and sound capabilities.
 * @author Daniel Grabowski
 * @version 1.0.0
 */

/**
 * Character class representing the main playable character (Pepe).
 * Extends MovableObject to inherit movement, collision detection, and physics.
 * Handles character animations, sound effects, and player input responses.
 * 
 * @class
 * @extends MovableObject
 */
class Character extends MovableObject {

    /**
     * Height of the character in pixels.
     * @type {number}
     * @default 300
     */
    height = 300;
    
    /**
     * Width of the character in pixels.
     * @type {number}
     * @default 150
     */
    width = 150;
    
    /**
     * Y-coordinate position of the character.
     * @type {number}
     * @default 130
     */
    y = 130;
    
    /**
     * Movement speed of the character.
     * @type {number}
     * @default 10
     */
    speed = 10;
    
    /**
     * Audio object for jump sound effect.
     * @type {Audio}
     */
    jumpSound = new Audio('./audio/jump.mp3');
    
    /**
     * Audio object for walking step sound effect.
     * @type {Audio}
     */
    stepSound = new Audio('./audio/step.mp3');
    
    /**
     * Audio object for hurt sound effect.
     * @type {Audio}
     */
    hurtSound = new Audio('./audio/hurt.mp3');
    
    /**
     * Audio object for snoring sound effect during long idle.
     * @type {Audio}
     */
    snorSound = new Audio('./audio/snoring.mp3');
    
    /**
     * Audio object for idle whistle sound effect.
     * @type {Audio}
     */
    idleSound = new Audio('./audio/whistle.mp3');
    
    /**
     * Audio object for death sound effect.
     * @type {Audio}
     */
    deadSound = new Audio('./audio/dying.mp3');
    
    /**
     * Flag to prevent death sound from playing multiple times.
     * @type {boolean}
     * @default false
     */
    deadSoundPlayed = false;

    /**
     * Array of image paths for idle animation.
     * @type {string[]}
     * @constant
     */
    IMAGES_IDLE = [

        './img/2_character_pepe/1_idle/idle/I-1.png',
        './img/2_character_pepe/1_idle/idle/I-2.png',
        './img/2_character_pepe/1_idle/idle/I-3.png',
        './img/2_character_pepe/1_idle/idle/I-4.png',
        './img/2_character_pepe/1_idle/idle/I-5.png',
        './img/2_character_pepe/1_idle/idle/I-6.png',
        './img/2_character_pepe/1_idle/idle/I-7.png',
        './img/2_character_pepe/1_idle/idle/I-8.png',
        './img/2_character_pepe/1_idle/idle/I-9.png',
        './img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    /**
     * Array of image paths for long idle animation (sleeping/snoring).
     * @type {string[]}
     * @constant
     */
    IMAGES_LONG_IDLE = [

        './img/2_character_pepe/1_idle/long_idle/I-11.png',
        './img/2_character_pepe/1_idle/long_idle/I-12.png',
        './img/2_character_pepe/1_idle/long_idle/I-13.png',
        './img/2_character_pepe/1_idle/long_idle/I-14.png',
        './img/2_character_pepe/1_idle/long_idle/I-15.png',
        './img/2_character_pepe/1_idle/long_idle/I-16.png',
        './img/2_character_pepe/1_idle/long_idle/I-17.png',
        './img/2_character_pepe/1_idle/long_idle/I-18.png',
        './img/2_character_pepe/1_idle/long_idle/I-19.png',
        './img/2_character_pepe/1_idle/long_idle/I-20.png'

    ];

    /**
     * Array of image paths for walking animation.
     * @type {string[]}
     * @constant
     */
    IMAGES_WALKING =[

        './img/2_character_pepe/2_walk/W-21.png',
        './img/2_character_pepe/2_walk/W-22.png',
        './img/2_character_pepe/2_walk/W-23.png',
        './img/2_character_pepe/2_walk/W-24.png',
        './img/2_character_pepe/2_walk/W-25.png',
        './img/2_character_pepe/2_walk/W-26.png',            
    ];

    /**
     * Array of image paths for jumping animation.
     * @type {string[]}
     * @constant
     */
    IMAGES_JUMPING =[
        './img/2_character_pepe/3_jump/J-31.png',
        './img/2_character_pepe/3_jump/J-32.png',
        './img/2_character_pepe/3_jump/J-33.png',
        './img/2_character_pepe/3_jump/J-34.png',
        './img/2_character_pepe/3_jump/J-35.png',
        './img/2_character_pepe/3_jump/J-36.png',
        './img/2_character_pepe/3_jump/J-37.png',
        './img/2_character_pepe/3_jump/J-38.png',
        './img/2_character_pepe/3_jump/J-39.png',
    ]

    /**
     * Array of image paths for death animation.
     * @type {string[]}
     * @constant
     */
    IMAGES_DEAD = [
        './img/2_character_pepe/5_dead/D-51.png',
        './img/2_character_pepe/5_dead/D-52.png',
        './img/2_character_pepe/5_dead/D-53.png',
        './img/2_character_pepe/5_dead/D-54.png',
        './img/2_character_pepe/5_dead/D-55.png',
        './img/2_character_pepe/5_dead/D-56.png',
        './img/2_character_pepe/5_dead/D-57.png'
    ]

    /**
     * Array of image paths for hurt animation.
     * @type {string[]}
     * @constant
     */
    IMAGES_HURT = [
        './img/2_character_pepe/4_hurt/H-41.png',
        './img/2_character_pepe/4_hurt/H-42.png',
        './img/2_character_pepe/4_hurt/H-43.png'
    ]

    /**
     * Reference to the game world object.
     * @type {World}
     */
    world;    

    /**
     * Creates a new Character instance.
     * Initializes the character with default image, loads all animation images,
     * applies gravity physics, sets up collision offsets, and starts animations.
     * 
     * @constructor
     */
    constructor() {
        super().loadImage('./img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.applyGravity();

        this.offset = {
            top: 10,
            bottom: 20,
            left: 40,
            right: 40
        };

        this.animate();
        this.getRealFrame();      

    }

    /**
     * Handles character animation and movement based on keyboard input.
     * Sets up two main intervals: one for movement/input handling and one for animation states.
     * Manages inactivity timer for idle animations and sound effects.
     * 
     * @method
     * @returns {void}
     */
    animate(){
        let inactivityTimer = 0;

        setInterval(() => {
            if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x){  
                this.moveRight();
                this.otherDirection = false;
                inactivityTimer = 0;
                this.idleSound.pause();
                this.snorSound.pause();
                this.stepSound.play();
                this.stepSound.volume = 0.5;    
            }

            if(this.world.keyboard.LEFT && this.x > 0){
                this.moveLeft();
                this.otherDirection = true;
                inactivityTimer = 0;
                this.idleSound.pause();
                this.snorSound.pause();
                this.stepSound.play();
                this.stepSound.volume = 0.5;
            }

            if(this.world.keyboard.SPACE && !this.isAboveGround()){
                this.jump();
                inactivityTimer = 0;
            }

            this.world.camera_x = -this.x + 100;

        },1000/60)

        setInterval(() => {

            inactivityTimer += 100;

            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                this.stopAllSounds();

                if (!this.deadSoundPlayed) {
                    this.deadSound.play();
                    this.deadSound.volume = 0.5;
                    this.deadSoundPlayed = true;
                }
                this.y += 5;               

            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                
                this.hurtSound.play();
                this.hurtSound.volume = 0.5;

            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);

            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);

            } else if (inactivityTimer >= 15000) {
                this.playAnimation(this.IMAGES_LONG_IDLE);
                this.stopIdleSound();
                this.snorSound.play();
                this.snorSound.volume = 0.5;

            }else if (inactivityTimer >= 2000) {
                this.playAnimation(this.IMAGES_IDLE);             
                this.idleSound.play();
                this.idleSound.volume = 0.5;
            }

            else {
                this.playAnimation(this.IMAGES_IDLE);               
            }
            
        }, 100);
    }
 
    /**
     * Makes the character jump by setting vertical speed.
     * Stops all sounds and plays jump sound effect.
     * 
     * @method
     * @returns {void}
     */
    jump() {
        this.speedY = 35;
        this.stopAllSounds();
        this.jumpSound.play();
        this.jumpSound.volume = 0.2;
    }

    /**
     * Stops and resets all character sound effects.
     * Pauses all audio and resets playback position to beginning.
     * 
     * @method
     * @returns {void}
     */
    stopAllSounds(){
    this.stepSound.pause();
    this.stepSound.currentTime = 0;

    this.hurtSound.pause();
    this.hurtSound.currentTime = 0;

    this.snorSound.pause();
    this.snorSound.currentTime = 0;

    this.idleSound.pause();
    this.idleSound.currentTime = 0;
    
    if (!this.isDead()) {
        this.deadSound.pause();
        this.deadSound.currentTime = 0;
    }            
    }

    /**
     * Stops only the idle sound effect.
     * Used when transitioning from idle to other states.
     * 
     * @method
     * @returns {void}
     */
    stopIdleSound(){
        this.idleSound.pause();
        this.idleSound.currentTime = 0;

    }
    
}