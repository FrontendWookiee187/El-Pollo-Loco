let canvas;
let world;
let keyboard = new Keyboard();	

function init(){

    if (world) {
        world.stopGameLoop(); // Stoppe den alten Spiel-Loop
    }

    initLevel();

canvas=document.getElementById('canvas');
world = new World(canvas, keyboard);


// Setze den Zustand zurück
world.character.energy = 100; // Volle Energie für den Charakter
world.statusBar.setPercentage(100); // Aktualisiere die Lebensanzeige
world.level = level1; // Lade das Level neu
world.level.enemies.forEach(enemy => {
    if (enemy instanceof Endboss) {
        enemy.isKO = false; // Setze den Zustand des Endbosses zurück
        enemy.health = 100; // Volle Gesundheit für den Endboss
    } else {
        enemy.isKO = false; // Setze den Zustand normaler Gegner zurück
    }
});
world.gameEnded = false; // Setze das Spielende-Flag zurück

console.log('Spiel neu gestartet');


}

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

    function updateMuteButton() {
        const muted = localStorage.getItem('muted') === '1';
        if (muted) {
            mute.innerHTML = '<span aria-hidden="true">&#128263;</span>'; // Lautsprecher mit X
            mute.classList.add('muted');
            mute.title = "Ton an";
        } else {
            mute.innerHTML = '<span aria-hidden="true">&#128266;</span>'; // Lautsprecher
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
        startScreen.style.display = 'none'; // Verstecke den Startbildschirm
        muteIcon.style.display = 'flex'; // Zeige den Mute-Button
        canvas.style.display = 'block'; // Zeige das Canvas an
        h1.style.display = 'block'; 
        description.style.display = 'flex';
        mute.style.display = 'block';
        
        init(); // Starte das Spiel
        hindViewTouchButtons();
    });

    restartButton.addEventListener('click', () => {
        console.log('Restart Button clicked');
        if (world) {
            world.resetWorld(); // Setze die Welt zurück
            world = null; // Entferne die aktuelle Welt
        }
        endScreen.style.display = 'none'; // Verstecke den Endbildschirm
        canvas.style.display = 'block'; // Zeige das Canvas an
        h1.style.display = 'block'; 
        description.style.display = 'flex';
        mute.style.display = 'block';
        
        init(); // Starte das Spiel neu
        hindViewTouchButtons();
    });
    
    backToStartButton.addEventListener('click', () => {
        console.log('Back to Start Button clicked');
        if (world) {
            world.resetWorld(); // Setze die Welt zurück
            world = null; // Entferne die aktuelle Welt
        }
        endScreen.style.display = 'none'; // Verstecke den Endbildschirm
        startScreen.style.display = 'flex'; // Zeige den Startbildschirm
        canvas.style.display = 'none'; // Verstecke das Canvas
        h1.style.display = 'none'; 
        description.style.display = 'none';
        mute.style.display = 'none';
        touchControls.style.display = 'none';
    });
});

function checkOrientation() {
    let rotateMessage = document.getElementById('rotateMessage');
    let canvas = document.getElementById('canvas');

    if (window.innerHeight > window.innerWidth) {
        // Hochformat
        rotateMessage.style.display = 'flex'; // Zeige die Hinweismeldung
        
    } else {
        // Querformat
        rotateMessage.style.display = 'none'; // Verstecke die Hinweismeldung
        
    }
}

// Überprüfe die Orientierung beim Laden der Seite und bei Änderungen
window.addEventListener('load', checkOrientation);
window.addEventListener('resize', checkOrientation);

document.addEventListener('DOMContentLoaded', () => {
    const touchControls = document.getElementById('touchControls');

    // Zeige die Touch-Buttons nur auf mobilen Geräten
    if (window.innerWidth <= 1024) {
        touchControls.style.display = 'none'; // Zeige die Touch-Buttons
    } else {
        touchControls.style.display = 'none'; // Verstecke die Touch-Buttons
    }

    // Event-Listener für die Touch-Buttons
    document.getElementById('leftButton').addEventListener('touchstart', () => {
        keyboard.LEFT = true;
    });
    document.getElementById('leftButton').addEventListener('touchend', () => {
        keyboard.LEFT = false;
    });

    document.getElementById('rightButton').addEventListener('touchstart', () => {
        keyboard.RIGHT = true;
    });
    document.getElementById('rightButton').addEventListener('touchend', () => {
        keyboard.RIGHT = false;
    });

    document.getElementById('jumpButton').addEventListener('touchstart', () => {
        keyboard.SPACE = true;
    });
    document.getElementById('jumpButton').addEventListener('touchend', () => {
        keyboard.SPACE = false;
    });

    document.getElementById('throwButton').addEventListener('touchstart', () => {
        keyboard.D = true;
    });
    document.getElementById('throwButton').addEventListener('touchend', () => {
        keyboard.D = false;
    });
});

function hindViewTouchButtons(){
    let touchControls = document.getElementById('touchControls');

if (window.innerWidth <= 1024){
    touchControls.style.display = 'flex'; // Zeige die Touch-Buttons
}

};

document.addEventListener('DOMContentLoaded', () => {
    const fullscreenButton = document.getElementById('fullscreenButton');
    const gameContainer = document.getElementById('gameContainer');

    function showFullscreenButtonIfMobile() {
        if (window.innerWidth <= 1024) {
            fullscreenButton.style.display = 'block';
        } else {
            fullscreenButton.style.display = 'none';
        }
    }

    // Standardmäßig ausblenden
    fullscreenButton.style.display = 'none';

    // Nach Spielstart anzeigen
    document.getElementById('startButton').addEventListener('click', () => {
        showFullscreenButtonIfMobile();
    });

    // Auch nach Neustart anzeigen
    document.getElementById('restartButton').addEventListener('click', () => {
        showFullscreenButtonIfMobile();
    });

    // Beim Zurück zum Start ausblenden
    document.getElementById('backToStartButton').addEventListener('click', () => {
        fullscreenButton.style.display = 'none';
    });

    // Bei Fenstergröße ändern ggf. anpassen
    window.addEventListener('resize', showFullscreenButtonIfMobile);

    // Fullscreen-Button toggelt Fullscreen-Modus
    fullscreenButton.addEventListener('click', () => {
        if (document.fullscreenElement) {
            // Fullscreen verlassen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } else {
            // Fullscreen aktivieren
            let elem = document.getElementById('gameContainer');
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
        } else {
            fullscreenButton.textContent = '⛶'; 
        }
    });
});


function resizeCanvasForFullscreen() {
    const canvas = document.getElementById('canvas');
    const aspect = 720 / 480; // Seitenverhältnis deines Spiels
    let w = window.innerWidth;
    let h = window.innerHeight;

    if (document.fullscreenElement) {
        if (w / h > aspect) {
            // Fenster ist breiter als das Seitenverhältnis → Höhe begrenzt
            h = window.innerHeight;
            w = h * aspect;
        } else {
            // Fenster ist schmaler oder gleich → Breite begrenzt
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
window.addEventListener('resize', resizeCanvasForFullscreen);