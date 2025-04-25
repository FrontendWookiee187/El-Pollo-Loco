let canvas;
let world;
let keyboard = new Keyboard();	

function init(){
canvas=document.getElementById('canvas');
world = new World(canvas, keyboard);



console.log('My Character is: ', world['character']);


}

window.addEventListener('keydown', (e) => {
    if(e.keyCode == 39) {
        keyboard.RIGHT = true;
        world.character.moveRight();
    } else if(e.keyCode == 37) {
        keyboard.LEFT = true;
        world.character.moveLeft();
    } else if(e.keyCode == 38) {
        keyboard.UP = true;
        world.character.jump();
    } else if(e.keyCode == 40) {
        keyboard.DOWN = true;
    } else if(e.keyCode == 32) {
        keyboard.SPACE = true;
    }
    
    console.log(keyboard);

   console.log(e);
    

});

window.addEventListener('keyup', (e) => {
    if(e.keyCode == 39) {
        keyboard.RIGHT = false;
        world.character.moveRight();
    } else if(e.keyCode == 37) {
        keyboard.LEFT = false;
        world.character.moveLeft();
    } else if(e.keyCode == 38) {
        keyboard.UP = false;
        world.character.jump();
    } else if(e.keyCode == 40) {
        keyboard.DOWN = false;
    } else if(e.keyCode == 32) {
        keyboard.SPACE = false;
    }
    
    console.log(keyboard);

   console.log(e);
    

});