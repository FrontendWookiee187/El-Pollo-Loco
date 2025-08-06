/**
 * @fileoverview Level class for El Pollo Loco game.
 * Manages and contains all game objects and elements for a specific game level.
 * @author Frontend Wookiee
 * @version 1.0.0
 */

/**
 * Level class representing a complete game level with all its objects.
 * Contains and manages enemies, environmental elements, collectibles, and level boundaries.
 * Serves as a container for all objects that make up a playable game level.
 * 
 * @class
 */
class Level {
    /**
     * Array of enemy objects in the level.
     * @type {MovableObject[]}
     */
    enemies;
    
    /**
     * Array of cloud objects for atmospheric effects.
     * @type {Cloud[]}
     */
    clouds;
    
    /**
     * Array of background objects for visual depth and parallax effects.
     * @type {BackgroundObject[]}
     */
    backgroundObjects;
    
    /**
     * Array of collectible bottle objects.
     * @type {Bottle[]}
     */
    bottles;
    
    /**
     * Array of collectible coin objects.
     * @type {Coin[]}
     */
    coins;
    
    /**
     * X-coordinate where the level ends.
     * @type {number}
     * @default 2200
     */
    level_end_x = 2200;

    /**
     * Creates a new Level instance with all game objects.
     * Initializes the level with enemies, environmental elements, and collectibles.
     * Provides default empty arrays for bottles and coins if not specified.
     * 
     * @constructor
     * @param {MovableObject[]} enemies - Array of enemy objects
     * @param {Cloud[]} clouds - Array of cloud objects
     * @param {BackgroundObject[]} backgroundObjects - Array of background objects
     * @param {Bottle[]} [bottles=[]] - Array of bottle objects (optional, defaults to empty array)
     * @param {Coin[]} [coins=[]] - Array of coin objects (optional, defaults to empty array)
     */
    constructor(enemies, clouds, backgroundObjects, bottles, coins) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.bottles = bottles || [];
        this.coins = coins || [];
    }
}