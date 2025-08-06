/**
 * @fileoverview Rendering Manager class that handles all canvas drawing operations.
 * Manages camera movement, object rendering, and frame animation for the game world.
 * 
 * @version 1.0.0
 * @author Daniel Grabowski
 * @since 2024
 */

/**
 * Manages all rendering operations for the game world.
 * Handles drawing order, camera transformations, and animation frames.
 * 
 * @class
 */
class RenderingManager {
    /** @type {World} Reference to the world instance */
    world;

    /**
     * Creates a new RenderingManager instance.
     * 
     * @constructor
     * @param {World} world - The world instance to manage rendering for
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Main rendering method that draws all game objects to the canvas.
     * Handles camera movement, layer ordering, and recursive frame drawing.
     * 
     * @method
     * @returns {void}
     */
    draw() {
        this.clearCanvas();
        this.setupCamera();
        this.drawWorldObjects();
        this.resetCamera();
        this.drawUI();
        this.requestNextFrame();
    }

    /**
     * Clears the entire canvas for the next frame.
     * Removes all previously drawn content.
     * 
     * @method
     * @returns {void}
     */
    clearCanvas() {
        this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
    }

    /**
     * Sets up camera transformation for world rendering.
     * Applies horizontal offset for scrolling background.
     * 
     * @method
     * @returns {void}
     */
    setupCamera() {
        this.world.ctx.translate(this.world.camera_x, 0);
    }

    /**
     * Draws all world objects in the correct order.
     * Renders backgrounds, enemies, character, and effects.
     * 
     * @method
     * @returns {void}
     */
    drawWorldObjects() {
        this.world.addObjectsToMap(this.world.level.backgroundObjects);
        this.drawEnemies();
        this.world.addToMap(this.world.character);
        this.world.addObjectsToMap(this.world.level.clouds);
        this.world.addObjectsToMap(this.world.level.bottles);
        this.world.addObjectsToMap(this.world.level.coins);
        this.drawThrowableObjects();
    }

    /**
     * Draws all enemies to the canvas.
     * Iterates through level enemies and renders each one.
     * 
     * @method
     * @returns {void}
     */
    drawEnemies() {
        this.world.level.enemies.forEach(enemy => {
            this.world.addToMap(enemy);
        });
    }

    /**
     * Draws all throwable objects to the canvas.
     * Renders bottles and other projectiles.
     * 
     * @method
     * @returns {void}
     */
    drawThrowableObjects() {
        this.world.throwableObjects.forEach(obj => this.world.addToMap(obj));
    }

    /**
     * Resets camera transformation after world rendering.
     * Restores original coordinate system for UI elements.
     * 
     * @method
     * @returns {void}
     */
    resetCamera() {
        this.world.ctx.translate(-this.world.camera_x, 0);
    }

    /**
     * Draws all UI elements on top of the world.
     * Renders status bars and conditional endboss health.
     * 
     * @method
     * @returns {void}
     */
    drawUI() {
        this.drawStatusBars();
        this.drawEndbossHealthBar();
    }

    /**
     * Draws the main status bars for the player.
     * Renders health, bottles, and coins status bars.
     * 
     * @method
     * @returns {void}
     */
    drawStatusBars() {
        this.world.addToMap(this.world.statusBar);
        this.world.addToMap(this.world.statusBarBottles);
        this.world.addToMap(this.world.statusBarCoins);
    }

    /**
     * Draws the endboss health bar when appropriate.
     * Only shows when character is in range of endboss.
     * 
     * @method
     * @returns {void}
     */
    drawEndbossHealthBar() {
        this.world.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss && enemy.isCharacterInRange()) {
                this.world.addToMap(this.world.statusBarEndboss);
            }
        });
    }

    /**
     * Requests the next animation frame for continuous rendering.
     * Maintains the game loop for smooth animation.
     * 
     * @method
     * @returns {void}
     */
    requestNextFrame() {
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }
}
