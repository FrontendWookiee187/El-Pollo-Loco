/**
 * @fileoverview UI Manager class that handles user interface operations.
 * Manages end screens, UI visibility, and game state transitions.
 * 
 * @version 1.0.0
 * @author Daniel Grabowski
 * @since 2024
 */

/**
 * Manages all user interface operations for the game.
 * Handles end screen display, UI element visibility, and state transitions.
 * 
 * @class
 */
class UIManager {
    /** @type {World} Reference to the world instance */
    world;

    /**
     * Creates a new UIManager instance.
     * 
     * @constructor
     * @param {World} world - The world instance to manage UI for
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Displays the end screen when the game finishes.
     * Shows victory or defeat screen based on game outcome.
     * 
     * @method
     * @param {boolean} won - Whether the player won (true) or lost (false)
     * @returns {void}
     */
    showEndScreen(won) {
        this.hideGameElements();
        this.showEndScreenElement();
        this.setEndScreenImage(won);
        this.world.audioManager.stopAllAudio();
    }

    /**
     * Hides all game-related UI elements.
     * Removes canvas, touch controls, and game UI from view.
     * 
     * @method
     * @returns {void}
     */
    hideGameElements() {
        const canvas = document.getElementById('canvas');
        const h1 = document.getElementById('h1');
        const description = document.getElementById('description');
        const mute = document.getElementById('mute');
        const touchControls = document.getElementById('touchControls');
        
        canvas.style.display = 'none';
        touchControls.style.display = 'none';
        h1.style.display = 'none';
        description.style.display = 'none';
        mute.style.display = 'none';
    }

    /**
     * Shows the end screen element container.
     * Makes the end screen visible with flex display.
     * 
     * @method
     * @returns {void}
     */
    showEndScreenElement() {
        const endScreen = document.getElementById('endScreen');
        endScreen.style.display = 'flex';
    }

    /**
     * Sets the appropriate end screen image based on outcome.
     * Displays victory or defeat image depending on result.
     * 
     * @method
     * @param {boolean} won - Whether the player won
     * @returns {void}
     */
    setEndScreenImage(won) {
        const endScreenImage = document.getElementById('endScreenImage');
        if (won) {
            endScreenImage.src = './img/You won, you lost/YouWonB.png';
        } else {
            endScreenImage.src = './img/You won, you lost/YouLost.png';
        }
    }
}
