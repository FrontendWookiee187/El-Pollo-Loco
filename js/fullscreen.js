/**
 * Checks if the device is a mobile device (smartphone/tablet)
 * @returns {boolean} True if the device is mobile, false otherwise
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
           || window.innerWidth <= 768;
}

/**
 * Shows the fullscreen button on mobile devices.
 * @returns {void}
 */
function showFullscreenButtonIfMobile() {
    const fullscreenButton = document.getElementById('fullscreenButton');
    if (fullscreenButton) {
        if (window.innerWidth <= 1024) {
            fullscreenButton.style.display = 'flex';
            fullscreenButton.style.alignItems = 'center';
            fullscreenButton.style.justifyContent = 'center';
        } else {
            fullscreenButton.style.display = 'none';
        }
    }
}

/**
 * Sets up and toggles fullscreen mode for the game container.
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {
    const fullscreenButton = document.getElementById('fullscreenButton');
    const gameContainer = document.getElementById('gameContainer');
    setupFullscreenFeature(fullscreenButton, gameContainer);
});

/**
 * Sets up all fullscreen functionality.
 * @param {HTMLElement} fullscreenButton - The fullscreen button
 * @param {HTMLElement} gameContainer - The game container
 * @returns {void}
 */
function setupFullscreenFeature(fullscreenButton, gameContainer) {
    fullscreenButton.style.display = 'none';
    setupFullscreenEventListeners(fullscreenButton, gameContainer);
    setupFullscreenStateChangeListeners(fullscreenButton);
}

/**
 * Sets up fullscreen event listeners.
 * @param {HTMLElement} fullscreenButton - The fullscreen button
 * @param {HTMLElement} gameContainer - The game container
 * @returns {void}
 */
function setupFullscreenEventListeners(fullscreenButton, gameContainer) {
    setupGameStartFullscreenEvents();
    setupOrientationChangeFullscreen();
    setupFullscreenButtonClickHandler(fullscreenButton, gameContainer);
    window.addEventListener('resize', showFullscreenButtonIfMobile);
}

/**
 * Sets up game start and restart fullscreen events.
 * @returns {void}
 */
function setupGameStartFullscreenEvents() {
    document.getElementById('startButton').addEventListener('click', () => {
        showFullscreenButtonIfMobile();
        setTimeout(() => {
            autoFullscreenForMobile();
        }, 100);
    });
    document.getElementById('restartButton').addEventListener('click', () => {
        showFullscreenButtonIfMobile();
        setTimeout(() => {
            autoFullscreenForMobile();
        }, 100);
    });
    document.getElementById('backToStartButton').addEventListener('click', () => {
        document.getElementById('fullscreenButton').style.display = 'none';
    });
}

/**
 * Automatically enters fullscreen mode for mobile devices.
 * @returns {void}
 */
function autoFullscreenForMobile() {
    if (isMobileDevice() && !document.fullscreenElement) {
        const elem = getFullscreenElement();
        requestFullscreenForElement(elem);
    }
}

/**
 * Gets the appropriate element for fullscreen mode.
 * @returns {HTMLElement} The element to put in fullscreen
 */
function getFullscreenElement() {
    const startScreen = document.getElementById('startScreen');
    const endScreen = document.getElementById('endScreen');
    const gameContainer = document.getElementById('gameContainer');
    const startScreenVisible = startScreen && startScreen.style.display !== 'none';
    const endScreenVisible = endScreen && endScreen.style.display !== 'none';
    if (startScreenVisible) {
        return startScreen;
    } else if (endScreenVisible) {
        return endScreen;
    }
    return gameContainer;
}

/**
 * Requests fullscreen for the given element.
 * @param {HTMLElement} elem - Element to put in fullscreen
 * @returns {void}
 */
function requestFullscreenForElement(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {
            console.log('Fullscreen konnte nicht automatisch aktiviert werden');
        });
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

/**
 * Sets up orientation change fullscreen functionality.
 * @returns {void}
 */
function setupOrientationChangeFullscreen() {
    window.addEventListener('orientationchange', () => {
        if (isMobileDevice()) {
            setTimeout(() => {
                autoFullscreenForMobile();
            }, 500);
        }
    });
}

/**
 * Sets up fullscreen button click handler.
 * @param {HTMLElement} fullscreenButton - The fullscreen button
 * @param {HTMLElement} gameContainer - The game container
 * @returns {void}
 */
function setupFullscreenButtonClickHandler(fullscreenButton, gameContainer) {
    fullscreenButton.addEventListener('click', () => {
        toggleFullscreenMode(gameContainer);
    });
}

/**
 * Toggles fullscreen mode on or off.
 * @param {HTMLElement} gameContainer - The game container
 * @returns {void}
 */
function toggleFullscreenMode(gameContainer) {
    const elem = getFullscreenElement();
    if (document.fullscreenElement) {
        exitFullscreen();
    } else {
        enterFullscreen(elem);
    }
}

/**
 * Exits fullscreen mode.
 * @returns {void}
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

/**
 * Enters fullscreen mode.
 * @param {HTMLElement} elem - Element to put in fullscreen
 * @returns {void}
 */
function enterFullscreen(elem) {
    document.body.classList.remove('post-fullscreen-exit');
    requestFullscreenForElement(elem);
}

/**
 * Sets up fullscreen state change listeners.
 * @param {HTMLElement} fullscreenButton - The fullscreen button
 * @returns {void}
 */
function setupFullscreenStateChangeListeners(fullscreenButton) {
    document.addEventListener('fullscreenchange', () => {
        handleFullscreenStateChange(fullscreenButton);
    });
    document.addEventListener('webkitfullscreenchange', () => {
        handleWebkitFullscreenChange();
    });
    document.addEventListener('msfullscreenchange', () => {
        handleMsFullscreenChange();
    });
}

/**
 * Handles fullscreen state changes.
 * @param {HTMLElement} fullscreenButton - The fullscreen button
 * @returns {void}
 */
function handleFullscreenStateChange(fullscreenButton) {
    if (document.fullscreenElement) {
        fullscreenButton.textContent = '⤫'; 
        document.body.classList.add('fullscreen-active');
    } else {
        fullscreenButton.textContent = '⛶'; 
        document.body.classList.remove('fullscreen-active');
        handleFullscreenExit();
    }
}

/**
 * Handles webkit fullscreen changes.
 * @returns {void}
 */
function handleWebkitFullscreenChange() {
    if (document.webkitFullscreenElement) {
        document.body.classList.add('fullscreen-active');
    } else {
        document.body.classList.remove('fullscreen-active');
        handleFullscreenExit();
    }
}

/**
 * Handles ms fullscreen changes.
 * @returns {void}
 */
function handleMsFullscreenChange() {
    if (document.msFullscreenElement) {
        document.body.classList.add('fullscreen-active');
    } else {
        document.body.classList.remove('fullscreen-active');
        handleFullscreenExit();
    }
}

/**
 * Handles fullscreen exit on mobile devices.
 * Adjusts canvas and shows fullscreen hint.
 * @returns {void}
 */
function handleFullscreenExit() {
    if (isMobileDevice()) {
        document.body.classList.add('post-fullscreen-exit');
        adjustCanvasForExitFullscreen();
        showFullscreenButtonIfMobile();
        showFullscreenHint();
    }
}

/**
 * Adjusts canvas size when exiting fullscreen
 * @returns {void}
 */
function adjustCanvasForExitFullscreen() {
    const canvas = document.getElementById('canvas');
    if (canvas) {
        adjustGameContainer();
        adjustCanvasStyles(canvas);
        resizeCanvasForFullscreen();
    }
}

/**
 * Adjusts the game container for exit fullscreen.
 * @returns {void}
 */
function adjustGameContainer() {
    const gameContainer = document.getElementById('gameContainer');
    if (gameContainer) {
        gameContainer.style.width = '100vw';
        gameContainer.style.height = '100vh';
        gameContainer.style.position = 'fixed';
        gameContainer.style.top = '0';
        gameContainer.style.left = '0';
        gameContainer.style.zIndex = '1000';
    }
}

/**
 * Adjusts canvas styles for exit fullscreen.
 * @param {HTMLElement} canvas - The canvas element
 * @returns {void}
 */
function adjustCanvasStyles(canvas) {
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.objectFit = 'cover';
    canvas.style.display = 'block';
}

/**
 * Shows a hint to return to fullscreen mode
 * @returns {void}
 */
function showFullscreenHint() {
    removeExistingHint();
    const hint = createFullscreenHint();
    addHintStyles();
    document.body.appendChild(hint);
    removeHintAfterDelay(hint);
}

/**
 * Removes existing fullscreen hint if present.
 * @returns {void}
 */
function removeExistingHint() {
    const existingHint = document.getElementById('fullscreenHint');
    if (existingHint) {
        existingHint.remove();
    }
}

/**
 * Creates the fullscreen hint element.
 * @returns {HTMLElement} The hint element
 */
function createFullscreenHint() {
    const hint = document.createElement('div');
    hint.id = 'fullscreenHint';
    hint.innerHTML = getHintHTML();
    return hint;
}

/**
 * Gets the HTML content for the fullscreen hint.
 * @returns {string} HTML content for the hint
 */
function getHintHTML() {
    return `
        <div style="
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-family: 'Sombrero', Arial, sans-serif;
            font-size: 16px;
            font-weight: bold;
            z-index: 10001;
            text-align: center;
            animation: fadeInOut 4s ease-in-out;
            border: 2px solid #FFD700;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        ">
            🔄 Für optimales Spielerlebnis Vollbild verwenden
        </div>
    `;
}

/**
 * Adds CSS styles for the fullscreen hint animation.
 * @returns {void}
 */
function addHintStyles() {
    if (!document.getElementById('fullscreenHintStyles')) {
        const style = document.createElement('style');
        style.id = 'fullscreenHintStyles';
        style.textContent = getHintCSSAnimation();
        document.head.appendChild(style);
    }
}

/**
 * Gets the CSS animation for the hint.
 * @returns {string} CSS animation styles
 */
function getHintCSSAnimation() {
    return `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            20% { opacity: 1; transform: translateX(-50%) translateY(0); }
            80% { opacity: 1; transform: translateX(-50%) translateY(0); }
            100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
    `;
}

/**
 * Removes the hint after a delay.
 * @param {HTMLElement} hint - The hint element to remove
 * @returns {void}
 */
function removeHintAfterDelay(hint) {
    setTimeout(() => {
        if (hint && hint.parentNode) {
            hint.remove();
        }
    }, 4000);
}

/**
 * Resizes the canvas to maintain the correct aspect ratio in fullscreen mode.
 * @returns {void}
 */
function resizeCanvasForFullscreen() {
    const canvas = document.getElementById('canvas');
    const aspect = 720 / 480;
    if (document.fullscreenElement) {
        setFullscreenCanvasSize(canvas, aspect);
    } else {
        resetCanvasSize(canvas);
    }
}

/**
 * Sets canvas size for fullscreen mode.
 * @param {HTMLElement} canvas - The canvas element
 * @param {number} aspect - The aspect ratio
 * @returns {void}
 */
function setFullscreenCanvasSize(canvas, aspect) {
    let w = window.innerWidth;
    let h = window.innerHeight;
    if (w / h > aspect) {
        h = window.innerHeight;
        w = h * aspect;
    } else {
        w = window.innerWidth;
        h = w / aspect;
    }
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.style.display = 'block';
}

/**
 * Resets canvas size to default.
 * @param {HTMLElement} canvas - The canvas element
 * @returns {void}
 */
function resetCanvasSize(canvas) {
    canvas.style.width = '';
    canvas.style.height = '';
}

/**
 * Canvas resize event listeners for fullscreen mode across different browsers.
 */
document.addEventListener('fullscreenchange', resizeCanvasForFullscreen);
document.addEventListener('webkitfullscreenchange', resizeCanvasForFullscreen);
document.addEventListener('msfullscreenchange', resizeCanvasForFullscreen);
window.addEventListener('resize', resizeCanvasForFullscreen);
