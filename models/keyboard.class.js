/**
 * @fileoverview Keyboard class for El Pollo Loco game.
 * Manages keyboard input state for game controls and player interactions.
 * @author Frontend Wookiee
 * @version 1.0.0
 */

/**
 * Keyboard class for tracking keyboard input states.
 * Stores the current state of various keyboard keys used for game controls.
 * Used by game objects to respond to player input for movement, actions, and interactions.
 * 
 * @class
 */
class Keyboard {

    /**
     * State of the LEFT arrow key or 'A' key for moving left.
     * @type {boolean}
     */
    LEFT;
    
    /**
     * State of the RIGHT arrow key or 'D' key for moving right.
     * @type {boolean}
     */
    RIGHT;
    
    /**
     * State of the UP arrow key or 'W' key for jumping or moving up.
     * @type {boolean}
     */
    UP;
    
    /**
     * State of the DOWN arrow key or 'S' key for crouching or moving down.
     * @type {boolean}
     */
    DOWN;
    
    /**
     * State of the SPACE key for jumping or primary actions.
     * @type {boolean}
     */
    SPACE;
    
    /**
     * State of the 'D' key for throwing objects or secondary actions.
     * @type {boolean}
     * @default false
     */
    D = false;
}