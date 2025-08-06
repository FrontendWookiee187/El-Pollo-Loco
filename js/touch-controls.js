/**
 * Sets up touch controls for mobile devices.
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {
    const touchControls = document.getElementById('touchControls');
    setupTouchControlsVisibility(touchControls);
    setupTouchButtons();
    setupTouchControlsGlobalEvents(touchControls);
});

/**
 * Sets up touch controls visibility.
 * @param {HTMLElement} touchControls - Touch controls container
 * @returns {void}
 */
function setupTouchControlsVisibility(touchControls) {
    if (window.innerWidth <= 1024) {
        touchControls.style.display = 'none';
    } else {
        touchControls.style.display = 'none';
    }
}

/**
 * Sets up all touch button event listeners.
 * @returns {void}
 */
function setupTouchButtons() {
    setupLeftButton();
    setupRightButton();
    setupJumpButton();
    setupThrowButton();
}

/**
 * Sets up left button touch events.
 * @returns {void}
 */
function setupLeftButton() {
    const leftButton = document.getElementById('leftButton');
    leftButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
    });
    leftButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.LEFT = false;
    });
    leftButton.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

/**
 * Sets up right button touch events.
 * @returns {void}
 */
function setupRightButton() {
    const rightButton = document.getElementById('rightButton');
    rightButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
    });
    rightButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.RIGHT = false;
    });
    rightButton.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

/**
 * Sets up jump button touch events.
 * @returns {void}
 */
function setupJumpButton() {
    const jumpButton = document.getElementById('jumpButton');
    jumpButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.SPACE = true;
    });
    jumpButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.SPACE = false;
    });
    jumpButton.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

/**
 * Sets up throw button touch events.
 * @returns {void}
 */
function setupThrowButton() {
    const throwButton = document.getElementById('throwButton');
    throwButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.D = true;
    });
    throwButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.D = false;
    });
    throwButton.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

/**
 * Sets up global touch controls event listeners.
 * @param {HTMLElement} touchControls - Touch controls container
 * @returns {void}
 */
function setupTouchControlsGlobalEvents(touchControls) {
    if (touchControls) {
        touchControls.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        touchControls.addEventListener('selectstart', (e) => {
            e.preventDefault();
        });
        touchControls.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
    }
}

/**
 * Shows touch buttons if on a mobile device.
 * @returns {void}
 */
function hindViewTouchButtons(){
    let touchControls = document.getElementById('touchControls');
    if (window.innerWidth <= 1400){
        touchControls.style.display = 'flex';
    }
}
