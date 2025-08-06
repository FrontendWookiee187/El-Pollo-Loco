/** @type {HTMLCanvasElement} */
let canvas;
/** @type {World} */
let world;
/** @type {Keyboard} */
let keyboard = new Keyboard();	

/**
 * Initializes the game world, resets all relevant states and starts the game.
 * If a world already exists, it stops the previous game loop.
 * @returns {void}
 */
function init(){

    if (world) {
        world.stopGameLoop();
    }
    initLevel();

canvas=document.getElementById('canvas');
world = new World(canvas, keyboard);

world.character.energy = 100;
world.statusBar.setPercentage(100);
world.level = level1;
world.level.enemies.forEach(enemy => {
    if (enemy instanceof Endboss) {
        enemy.isKO = false;
        enemy.health = 100;
    } else {
        enemy.isKO = false;
    }
});
world.gameEnded = false;

console.log('Spiel neu gestartet');

}

/**
 * Handles keydown events and updates the keyboard state.
 * @param {KeyboardEvent} e
 */
window.addEventListener('keydown', (e) => {
    if(e.keyCode == 39) {
        keyboard.RIGHT = true;
        
    } else if(e.keyCode == 37) {
        keyboard.LEFT = true;
        
    } else if(e.keyCode == 38) {
        keyboard.UP = true;
       
    } else if(e.keyCode == 40) {
        keyboard.DOWN = true;
    } else if(e.keyCode == 32) {
        keyboard.SPACE = true;
       }  
    else if(e.keyCode == 68) {
        keyboard.D = true;
    } 
  });

  /**
 * Handles keyup events and updates the keyboard state.
 * @param {KeyboardEvent} e
 */
window.addEventListener('keyup', (e) => {
    if(e.keyCode == 39) {
        keyboard.RIGHT = false;
        
    } else if(e.keyCode == 37) {
        keyboard.LEFT = false;
        
    } else if(e.keyCode == 38) {
        keyboard.UP = false;
        
    } else if(e.keyCode == 40) {
        keyboard.DOWN = false;
    } else if(e.keyCode == 32) {
        keyboard.SPACE = false;
    }
    else if(e.keyCode == 68) {
        keyboard.D = false;
    } 
});

/**
 * Handles DOMContentLoaded event to set up UI elements and event listeners.
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('startScreen');
    const endScreen = document.getElementById('endScreen');
    const endScreenImage = document.getElementById('endScreenImage');
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const backToStartButton = document.getElementById('backToStartButton');
    const canvas = document.getElementById('canvas');
    let h1 = document.getElementById('h1');
    let description = document.getElementById('description');
    let mute = document.getElementById('mute');
    let touchControls = document.getElementById('touchControls');
    let muteIcon = document.getElementById('mute');

    /**
     * Updates the mute button icon and state based on localStorage.
     * @returns {void}
     */
    function updateMuteButton() {
        const muted = localStorage.getItem('muted') === '1';
        if (muted) {
            mute.innerHTML = '<span aria-hidden="true">&#128263;</span>';
            mute.classList.add('muted');
            mute.title = "Ton an";
        } else {
            mute.innerHTML = '<span aria-hidden="true">&#128266;</span>';
            mute.classList.remove('muted');
            mute.title = "Ton aus";
        }
    }

    updateMuteButton();

    mute.addEventListener('click', () => {
        if (typeof world !== 'undefined' && world) {
            world.toggleMute();
            updateMuteButton();
        }
    });

    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        muteIcon.style.display = 'flex';
        canvas.style.display = 'block';
        h1.style.display = 'block'; 
        description.style.display = 'flex';
        mute.style.display = 'block';
        
        init();
        hindViewTouchButtons();
    });

    restartButton.addEventListener('click', () => {
        console.log('Restart Button clicked');
        if (world) {
            world.resetWorld();
            world = null;
        }
        endScreen.style.display = 'none';
        canvas.style.display = 'block';
        h1.style.display = 'block'; 
        description.style.display = 'flex';
        mute.style.display = 'block';
        
        init();
        hindViewTouchButtons();
    });
    
    backToStartButton.addEventListener('click', () => {
        console.log('Back to Start Button clicked');
        if (world) {
            world.resetWorld();
            world = null;
        }
        endScreen.style.display = 'none';
        startScreen.style.display = 'flex';
        canvas.style.display = 'none';
        h1.style.display = 'none'; 
        description.style.display = 'none';
        mute.style.display = 'none';
        touchControls.style.display = 'none';
    });
});

/**
 * Checks the device orientation and shows/hides the rotate message.
 * @returns {void}
 */
function checkOrientation() {
    let rotateMessage = document.getElementById('rotateMessage');
    let canvas = document.getElementById('canvas');

    if (window.innerHeight > window.innerWidth) {
        rotateMessage.style.display = 'flex';
        
    } else {
        rotateMessage.style.display = 'none';
        
    }
}

//Check orientation on load and resize
window.addEventListener('load', checkOrientation);
window.addEventListener('resize', checkOrientation);

/**
 * Sets up touch controls for mobile devices.
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {
    const touchControls = document.getElementById('touchControls');

    if (window.innerWidth <= 1024) {
        touchControls.style.display = 'none';
    } else {
        touchControls.style.display = 'none';
    }

    /**
     * Adds touch event listeners for all control buttons.
     */
    document.getElementById('leftButton').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
    });
    document.getElementById('leftButton').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.LEFT = false;
    });
    document.getElementById('leftButton').addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    document.getElementById('rightButton').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
    });
    document.getElementById('rightButton').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.RIGHT = false;
    });
    document.getElementById('rightButton').addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    document.getElementById('jumpButton').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.SPACE = true;
    });
    document.getElementById('jumpButton').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.SPACE = false;
    });
    document.getElementById('jumpButton').addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    document.getElementById('throwButton').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.D = true;
    });
    document.getElementById('throwButton').addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.D = false;
    });
    document.getElementById('throwButton').addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    /**
     * Global event listener for all touch controls to prevent default behaviors.
     */
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
});

/**
 * Shows touch buttons if on a mobile device.
 * @returns {void}
 */
function hindViewTouchButtons(){
    let touchControls = document.getElementById('touchControls');

if (window.innerWidth <= 1400){
    touchControls.style.display = 'flex';
}
};

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

    /**
     * Automatically enters fullscreen mode for mobile devices
     * @returns {void}
     */
    function autoFullscreenForMobile() {
        if (isMobileDevice() && !document.fullscreenElement) {
            const startScreen = document.getElementById('startScreen');
            const endScreen = document.getElementById('endScreen');
            
            const startScreenVisible = startScreen && startScreen.style.display !== 'none';
            const endScreenVisible = endScreen && endScreen.style.display !== 'none';
            
            let elem = gameContainer;
            if (startScreenVisible) {
                elem = startScreen;
            } else if (endScreenVisible) {
                elem = endScreen;
            }
            
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
    }

    fullscreenButton.style.display = 'none';

    /**
     * Event listeners for fullscreen functionality on game start and restart.
     */
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
        fullscreenButton.style.display = 'none';
    });

    window.addEventListener('resize', showFullscreenButtonIfMobile);

    /**
     * Auto-fullscreen on orientation change for mobile devices.
     */
    window.addEventListener('orientationchange', () => {
        if (isMobileDevice()) {
            setTimeout(() => {
                autoFullscreenForMobile();
            }, 500);
        }
    });

    /**
     * Fullscreen button click handler to toggle fullscreen mode.
     */
    fullscreenButton.addEventListener('click', () => {
    const startScreen = document.getElementById('startScreen');
    const endScreen = document.getElementById('endScreen');
    const gameContainer = document.getElementById('gameContainer');

    const startScreenVisible = startScreen && startScreen.style.display !== 'none' && startScreen.style.display !== '';
    const endScreenVisible = endScreen && endScreen.style.display !== 'none' && endScreen.style.display !== '';

    let elem = gameContainer;
    if (startScreenVisible) {
        elem = startScreen;
    } else if (endScreenVisible) {
        elem = endScreen;
    }

    if (document.fullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    } else {
        document.body.classList.remove('post-fullscreen-exit');
        
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }
    });
    
    /**
     * Fullscreen state change event listeners for different browsers.
     */
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            fullscreenButton.textContent = '⤫'; 
            document.body.classList.add('fullscreen-active');
        } else {
            fullscreenButton.textContent = '⛶'; 
            document.body.classList.remove('fullscreen-active');
            handleFullscreenExit();
        }
    });

    document.addEventListener('webkitfullscreenchange', () => {
        if (document.webkitFullscreenElement) {
            document.body.classList.add('fullscreen-active');
        } else {
            document.body.classList.remove('fullscreen-active');
            handleFullscreenExit();
        }
    });

    document.addEventListener('msfullscreenchange', () => {
        if (document.msFullscreenElement) {
            document.body.classList.add('fullscreen-active');
        } else {
            document.body.classList.remove('fullscreen-active');
            handleFullscreenExit();
        }
    });
});/**
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
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.style.width = '100vw';
            gameContainer.style.height = '100vh';
            gameContainer.style.position = 'fixed';
            gameContainer.style.top = '0';
            gameContainer.style.left = '0';
            gameContainer.style.zIndex = '1000';
        }
        
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.objectFit = 'cover';
        canvas.style.display = 'block';
        
        resizeCanvasForFullscreen();
    }
}

/**
 * Shows a hint to return to fullscreen mode
 * @returns {void}
 */
function showFullscreenHint() {
    const existingHint = document.getElementById('fullscreenHint');
    if (existingHint) {
        existingHint.remove();
    }
    
    const hint = document.createElement('div');
    hint.id = 'fullscreenHint';
    hint.innerHTML = `
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
    
    if (!document.getElementById('fullscreenHintStyles')) {
        const style = document.createElement('style');
        style.id = 'fullscreenHintStyles';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                20% { opacity: 1; transform: translateX(-50%) translateY(0); }
                80% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(hint);
    
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
    let w = window.innerWidth;
    let h = window.innerHeight;

    if (document.fullscreenElement) {
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
    } else {
        canvas.style.width = '';
        canvas.style.height = '';
    }
}

document.addEventListener('fullscreenchange', resizeCanvasForFullscreen);
document.addEventListener('webkitfullscreenchange', resizeCanvasForFullscreen);
document.addEventListener('msfullscreenchange', resizeCanvasForFullscreen);
window.addEventListener('resize', resizeCanvasForFullscreen);