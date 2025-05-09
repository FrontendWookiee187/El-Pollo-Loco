let canvas;
let world;
let keyboard = new Keyboard();	

function init(){
canvas=document.getElementById('canvas');
world = new World(canvas, keyboard);



console.log('My Character is: ', world['character']);
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

    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none'; // Verstecke den Startbildschirm
        canvas.style.display = 'block'; // Zeige das Canvas an
        init(); // Starte das Spiel
    });

    restartButton.addEventListener('click', () => {
        endScreen.style.display = 'none'; // Verstecke den Endbildschirm
        canvas.style.display = 'block'; // Zeige das Canvas an
        console.log('Endscreen hidden, Canvas shown');
        init(); // Starte das Spiel neu
    });

    backToStartButton.addEventListener('click', () => {
        console.log('Back to Start Button clicked');
        endScreen.style.display = 'none'; // Verstecke den Endbildschirm
        startScreen.style.display = 'flex'; // Zeige den Startbildschirm
        console.log('Endscreen hidden, Startscreen shown');
    });
});