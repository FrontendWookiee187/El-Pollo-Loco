class World{

character = new Character();
level = level1;
canvas;
ctx;
keyboard;
camera_x = 0;
statusBar = new StatusBar();
statusBarBottles = new StatusBarBottles();
throwableObjects = [];

constructor(canvas, keyboard) {

    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
}

    setWorld(){
       this.character.world = this; 
    }

    run(){

        setInterval(() => {
           this.checkCollisions();
           this.checkThrowObjects();
        },200)

        
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.character.otherDirection == false) { // Check if the D key is pressed and character is facing right
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            bottle.throw(this.character.otherDirection); // Übergibt die Laufrichtung
            this.throwableObjects.push(bottle);

         } else if (this.keyboard.D && this.character.otherDirection == true) { // Check if the D key is pressed and character is facing left
            let bottle = new ThrowableObject(this.character.x - 100, this.character.y - 100);
            bottle.throw(this.character.otherDirection); // Übergibt die Laufrichtung
            this.throwableObjects.push(bottle);
         }
    }

    checkCollisions(){
        this.level.enemies.forEach(enemy => {
            if( this.character.isColliding(enemy)) {
             this.character.hit();
             this.statusBar.setPercentage(this.character.energy); // Update the status bar   
          }                
         });
    }

    draw(){

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0); // Move the canvas to the left by camera_x pixels

        this.addObjectsToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0); 
        // ----- Space for fixed objects -----
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarBottles);
        this.ctx.translate(this.camera_x, 0); 


        this.addToMap(this.character);         
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds); 
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.bottles); // Flaschen hinzufügen

        
                    
        this.ctx.translate(- this.camera_x, 0);

        self = this;
        requestAnimationFrame(function() {

            self.draw();
        });
        
    }

    addObjectsToMap(objects){
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo){

        if (mo.otherDirection) {
            this.flipImage(mo);            
        }

        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);        

        if (mo.otherDirection) {
            this.flipImageBack(mo); 
        }
    }

flipImage(mo){
    
            this.ctx.save();
            this.ctx.translate(mo.width, 0); // Translate to the right edge of the image
            this.ctx.scale(-1, 1); // Flip the image horizontally
            mo.x = mo.x * -1;
}

flipImageBack(mo){
    mo.x = mo.x * -1; // Reset the x position to the original value
    this.ctx.restore(); // Restore the original state

}}

