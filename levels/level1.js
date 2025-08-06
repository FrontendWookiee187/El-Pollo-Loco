/**
 * @fileoverview Level 1 configuration for El Pollo Loco game.
 * Contains the initialization and setup for the first game level including
 * enemies, clouds, background objects, collectible bottles and coins.
 * @author Frontend Wookiee
 * @version 1.0.0
 */

/**
 * Global variable holding the Level 1 instance.
 * Contains all game objects for the first level including enemies, backgrounds, and collectibles.
 * @type {Level}
 * @global
 */
let level1;

/**
 * Initializes Level 1 with all game objects.
 * Creates a new Level instance containing enemies (chickens and endboss),
 * clouds, layered background objects, collectible bottles and coins.
 * 
 * The level structure includes:
 * - 6 chicken enemies (3 normal, 3 small) and 1 endboss
 * - 1 cloud object
 * - Multiple layered background objects for parallax scrolling
 * - 8 collectible bottles
 * - 5 collectible coins
 * 
 * @function
 * @returns {void}
 */
function initLevel() {

level1 = new Level([
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new ChickenSmall(),
        new ChickenSmall(),
        new ChickenSmall(),
        new Endboss(),
],
[
    new Cloud(),
],
[
    new BackgroundObject('./img/5_background/layers/air.png', -719),
    new BackgroundObject('./img/5_background/layers/3_third_layer/2.png', -719),
    new BackgroundObject('./img/5_background/layers/2_second_layer/2.png', -719),
    new BackgroundObject('./img/5_background/layers/1_first_layer/2.png', -719),

    new BackgroundObject('./img/5_background/layers/air.png', 0),
    new BackgroundObject('./img/5_background/layers/3_third_layer/1.png', 0),
    new BackgroundObject('./img/5_background/layers/2_second_layer/1.png', 0),
    new BackgroundObject('./img/5_background/layers/1_first_layer/1.png', 0),

    new BackgroundObject('./img/5_background/layers/air.png', 719),
    new BackgroundObject('./img/5_background/layers/3_third_layer/2.png', 719),
    new BackgroundObject('./img/5_background/layers/2_second_layer/2.png', 719),
    new BackgroundObject('./img/5_background/layers/1_first_layer/2.png', 719),

    new BackgroundObject('./img/5_background/layers/air.png', 719*2),
    new BackgroundObject('./img/5_background/layers/3_third_layer/1.png', 719*2),
    new BackgroundObject('./img/5_background/layers/2_second_layer/1.png', 719*2),
    new BackgroundObject('./img/5_background/layers/1_first_layer/1.png', 719*2),

    new BackgroundObject('./img/5_background/layers/air.png', 719*3),
    new BackgroundObject('./img/5_background/layers/3_third_layer/2.png', 719*3),
    new BackgroundObject('./img/5_background/layers/2_second_layer/2.png', 719*3),
    new BackgroundObject('./img/5_background/layers/1_first_layer/2.png', 719*3),
   
],

[
    new Bottle(),
    new Bottle(),
    new Bottle(),
    new Bottle(),
    new Bottle(),
    new Bottle(),
    new Bottle(),
    new Bottle(),
],

[
    new Coin(),
    new Coin(),
    new Coin(),
    new Coin(),
    new Coin(),
    
],


);

}