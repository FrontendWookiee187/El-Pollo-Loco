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
        world.stopGameLoop(); // Stop the old game loop
    }
    initLevel();

canvas=document.getElementById('canvas');
world = new World(canvas, keyboard);

// Reset state
world.character.energy = 100; // Full energy for the character
world.statusBar.setPercentage(100); // Update health bar
world.level = level1; // Reload the level
world.level.enemies.forEach(enemy => {
    if (enemy instanceof Endboss) {
        enemy.isKO = false; // Reset endboss state
        enemy.health = 100; // Full health for endboss
    } else {
        enemy.isKO = false; // Reset normal enemy state
    }
});
world.gameEnded = false;// Reset game end flag

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
            mute.innerHTML = '<span aria-hidden="true">&#128263;</span>'; // Speaker with X
            mute.classList.add('muted');
            mute.title = "Ton an";
        } else {
            mute.innerHTML = '<span aria-hidden="true">&#128266;</span>'; // Speaker
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
        startScreen.style.display = 'none'; // Hide start screen
        muteIcon.style.display = 'flex'; // Show mute button
        canvas.style.display = 'block'; // Show canvas
        h1.style.display = 'block'; 
        description.style.display = 'flex';
        mute.style.display = 'block';
        
        init(); // Start the game
        hindViewTouchButtons();
    });

    restartButton.addEventListener('click', () => {
        console.log('Restart Button clicked');
        if (world) {
            world.resetWorld(); // Reset the world
            world = null; // Remove current world
        }
        endScreen.style.display = 'none'; // Hide end screen
        canvas.style.display = 'block'; // Show canvas
        h1.style.display = 'block'; 
        description.style.display = 'flex';
        mute.style.display = 'block';
        
        init(); // Restart the game
        hindViewTouchButtons();
    });
    
    backToStartButton.addEventListener('click', () => {
        console.log('Back to Start Button clicked');
        if (world) {
            world.resetWorld(); // Reset the world
            world = null; // Remove current world
        }
        endScreen.style.display = 'none'; // Hide end screen
        startScreen.style.display = 'flex'; // Show start screen
        canvas.style.display = 'none'; // Hide canvas
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
        // Portrait
        rotateMessage.style.display = 'flex'; // Zeige die Hinweismeldung
        
    } else {
        // Landscape
        rotateMessage.style.display = 'none'; // Verstecke die Hinweismeldung
        
    }
}

// Check orientation on load and resize
window.addEventListener('load', checkOrientation);
window.addEventListener('resize', checkOrientation);

/**
 * Sets up touch controls for mobile devices.
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {
    const touchControls = document.getElementById('touchControls');

    // Show touch buttons only on mobile devices
    if (window.innerWidth <= 1024) {
        touchControls.style.display = 'none';
    } else {
        touchControls.style.display = 'none';
    }

    // Touch button event listeners
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

    // Globaler Event-Listener für alle Touch-Controls
    if (touchControls) {
        // Verhindert Kontextmenü für den gesamten Touch-Control-Container
        touchControls.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Verhindert Textauswahl
        touchControls.addEventListener('selectstart', (e) => {
            e.preventDefault();
        });
        
        // Verhindert Drag & Drop
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
    touchControls.style.display = 'flex'; // Zeige die Touch-Buttons
}
};

/**
 * Sets up and toggles fullscreen mode for the game container.
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {
    const fullscreenButton = document.getElementById('fullscreenButton');
    const gameContainer = document.getElementById('gameContainer');

    /**
     * Checks if the device is a mobile device (smartphone/tablet)
     * @returns {boolean}
     */
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
               || window.innerWidth <= 768; // Smartphones meist unter 768px
    }

    /**
     * Automatically enters fullscreen mode for mobile devices
     * @returns {void}
     */
    function autoFullscreenForMobile() {
        if (isMobileDevice() && !document.fullscreenElement) {
            const startScreen = document.getElementById('startScreen');
            const endScreen = document.getElementById('endScreen');
            
            // Bestimme welches Element in den Fullscreen soll
            const startScreenVisible = startScreen && startScreen.style.display !== 'none';
            const endScreenVisible = endScreen && endScreen.style.display !== 'none';
            
            let elem = gameContainer;
            if (startScreenVisible) {
                elem = startScreen;
            } else if (endScreenVisible) {
                elem = endScreen;
            }
            
            // Fullscreen aktivieren
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

    /**
     * Shows the fullscreen button on mobile devices.
     * @returns {void}
     */
    function showFullscreenButtonIfMobile() {
        if (window.innerWidth <= 1024) {
            fullscreenButton.style.display = 'block';
        } else {
            fullscreenButton.style.display = 'none';
        }
    }

    // Hide by default
    fullscreenButton.style.display = 'none';

    // Show after game start and auto-fullscreen for mobile
    document.getElementById('startButton').addEventListener('click', () => {
        showFullscreenButtonIfMobile();
        // Kleine Verzögerung für bessere UX
        setTimeout(() => {
            autoFullscreenForMobile();
        }, 100);
    });

    // Show after restart and auto-fullscreen for mobile
    document.getElementById('restartButton').addEventListener('click', () => {
        showFullscreenButtonIfMobile();
        setTimeout(() => {
            autoFullscreenForMobile();
        }, 100);
    });

    // Hide when returning to start
    document.getElementById('backToStartButton').addEventListener('click', () => {
        fullscreenButton.style.display = 'none';
    });

    // Adjust on window resize
    window.addEventListener('resize', showFullscreenButtonIfMobile);

    // Auto-Fullscreen bei Orientierungsänderung auf mobilen Geräten
    window.addEventListener('orientationchange', () => {
        if (isMobileDevice()) {
            setTimeout(() => {
                autoFullscreenForMobile();
            }, 500); // Verzögerung für Orientierungsänderung
        }
    });

    // Fullscreen-Button toggelt Fullscreen-Modus
    fullscreenButton.addEventListener('click', () => {
    const startScreen = document.getElementById('startScreen');
    const endScreen = document.getElementById('endScreen');
    const gameContainer = document.getElementById('gameContainer');

    // Prüfe, welcher Screen sichtbar ist
    const startScreenVisible = startScreen && startScreen.style.display !== 'none' && startScreen.style.display !== '';
    const endScreenVisible = endScreen && endScreen.style.display !== 'none' && endScreen.style.display !== '';

    let elem = gameContainer;
    if (startScreenVisible) {
        elem = startScreen;
    } else if (endScreenVisible) {
        elem = endScreen;
    }

    if (document.fullscreenElement) {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    } else {
        // Enter fullscreen
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }
});
    
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            fullscreenButton.textContent = '⤫'; 
            document.body.classList.add('fullscreen-active'); // CSS-Klasse hinzufügen
        } else {
            fullscreenButton.textContent = '⛶'; 
            document.body.classList.remove('fullscreen-active'); // CSS-Klasse entfernen
        }
    });

    // Für verschiedene Browser-Präfixe
    document.addEventListener('webkitfullscreenchange', () => {
        if (document.webkitFullscreenElement) {
            document.body.classList.add('fullscreen-active');
        } else {
            document.body.classList.remove('fullscreen-active');
        }
    });

    document.addEventListener('msfullscreenchange', () => {
        if (document.msFullscreenElement) {
            document.body.classList.add('fullscreen-active');
        } else {
            document.body.classList.remove('fullscreen-active');
        }
    });
});

/**
 * Resizes the canvas to maintain the correct aspect ratio in fullscreen mode.
 * @returns {void}
 */
function resizeCanvasForFullscreen() {
    const canvas = document.getElementById('canvas');
    const aspect = 720 / 480; // Seitenverhältnis deines Spiels
    let w = window.innerWidth;
    let h = window.innerHeight;

    if (document.fullscreenElement) {
        if (w / h > aspect) {
            // Window is wider than aspect ratio → height is limiting
            h = window.innerHeight;
            w = h * aspect;
        } else {
            // Window is narrower or equal → width is limiting
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