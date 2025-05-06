class World{

character = new Character();
level = level1;
canvas;
ctx;
keyboard;
camera_x = 0;
statusBar = new StatusBar();
statusBarBottles = new StatusBarBottles();
statusBarCoins = new StatusBarCoins();
throwableObjects = [];
chickenKOSound = new Audio('./audio/chicken_head_edited.mp3')

constructor(canvas, keyboard) {

    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
    this.initBackgroundMusic();
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
        // Überprüfen, ob die D-Taste gedrückt ist
        if (this.keyboard.D) {
            // Überprüfen, ob Flaschen verfügbar sind
            if (this.statusBarBottles.percentage > 0) {
                let bottleX;
                let bottleY = this.character.y + 100;
    
                // Überprüfen, ob der Charakter nach links schaut
                if (this.character.otherDirection) {
                    bottleX = this.character.x - 100; // Position links vom Charakter
                } else {
                    bottleX = this.character.x + 100; // Position rechts vom Charakter
                }
    
                // Flasche erstellen und werfen
            let bottle = new ThrowableObject(bottleX, bottleY);
            bottle.world = this; // Setze die Referenz zur Welt
            bottle.throw(this.character.otherDirection); // Übergibt die Laufrichtung
            this.throwableObjects.push(bottle);
    
                // Flaschen-Leiste aktualisieren
                this.updateBottleStatusBarOnThrow();
            }
        }
    }

    checkCollisions() {

        this.throwableObjects.forEach((bottle) => {
            bottle.handleBottleCollision(this.level.enemies); // Überprüfe Kollisionen mit Gegnern
        });

        // Prüfe zuerst, ob ein Huhn getroffen wurde
        const chickenHit = this.checkChickenKO();
    
        // Wenn ein Huhn getroffen wurde, überspringe die allgemeine Kollisionsprüfung
        if (!chickenHit) {
            // Kollision mit Gegnern (z. B. Hühnern)
            this.level.enemies.forEach(enemy => {
                if (this.character.isColliding(enemy)) {
                    console.log('Charakter wird getroffen von:', enemy);
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy); // Aktualisiere die Lebensanzeige
                }
            });
        }
    
        // Kollision mit Flaschen
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                if (this.statusBarBottles.percentage < 100) { // Nur aufnehmen, wenn die Leiste nicht voll ist
                    this.level.bottles.splice(index, 1); // Entferne die Flasche aus dem Level
                    this.updateBottleStatusBar(); // Aktualisiere die Flaschen-Leiste
                } else {
                    console.log('Flaschen-Leiste ist voll!'); // Debugging-Ausgabe
                }
            }
        });
    
        // Kollision mit Coins
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                if (this.statusBarCoins.percentage < 100) { // Nur aufnehmen, wenn die Leiste nicht voll ist
                    this.level.coins.splice(index, 1); // Entferne die Münze aus dem Level
                    this.updateCoinStatusBar(); // Aktualisiere die Münzen-Leiste
                } else {
                    console.log('Münzen-Leiste ist voll!'); // Debugging-Ausgabe
                }
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
        this.addToMap(this.statusBarCoins);
        this.ctx.translate(this.camera_x, 0); 


        this.addToMap(this.character);         
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds); 
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.bottles); // Flaschen hinzufügen
        this.addObjectsToMap(this.level.coins);
        
                    
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

}


updateBottleStatusBar() {
    let maxBottles = 5; // Maximale Anzahl an Flaschen
    let currentPercentage = this.statusBarBottles.percentage;

    if (currentPercentage < 100) {
        let newPercentage = currentPercentage + (100 / maxBottles); // Erhöhe die Anzeige
        this.statusBarBottles.setPercentage(Math.min(newPercentage, 100)); // Begrenze auf 100%
    }
}

updateBottleStatusBarOnThrow() {
    let maxBottles = 5; // Maximale Anzahl an Flaschen
    let currentPercentage = this.statusBarBottles.percentage;

    if (currentPercentage > 0) {
        let newPercentage = currentPercentage - (100 / maxBottles); // Verringere die Anzeige
        this.statusBarBottles.setPercentage(Math.max(newPercentage, 0)); // Begrenze auf 0%
    }
}

updateCoinStatusBar() {
    let maxCoins = 5; // Maximale Anzahl an Coins
    let currentPercentage = this.statusBarCoins.percentage;

    if (currentPercentage < 100) {
        let newPercentage = currentPercentage + (100 / maxCoins); // Erhöhe die Anzeige
        this.statusBarCoins.setPercentage(Math.min(newPercentage, 100)); // Begrenze auf 100%
    }
}

checkChickenKO() {
    let chickenHit = false; // Flag, um zu prüfen, ob ein Huhn getroffen wurde

    this.level.enemies.forEach((enemy, index) => {
        if (this.character.isColliding(enemy)) {
            if (
                this.character.speedY < 0 && // Der Charakter bewegt sich nach unten
                this.character.y + this.character.height - this.character.offset.bottom < enemy.y + enemy.height - enemy.offset.bottom + 20
            ) {
                console.log('Charakter trifft das Huhn von oben:', enemy);
                enemy.isKO = true;
                enemy.speed = 0;

                // Vertikale Geschwindigkeit des Charakters zurücksetzen
                this.character.speedY = 15; // Charakter springt leicht zurück nach oben

                // Huhn-K.O.-Geräusch abspielen
                this.chickenKOSound.play(); 
                this.chickenKOSound.volume = 0.1; // Lautstärke anpassen

                // Kein Schaden, da der Charakter das Huhn von oben trifft
                this.character.hit(true);

                setTimeout(() => {
                    console.log('Huhn wird entfernt:', enemy);
                    this.level.enemies.splice(index, 1); // Entferne das Huhn                    
                }, 1000);

                chickenHit = true; // Markiere, dass ein Huhn getroffen wurde
            }
        }
    });

    return chickenHit; // Gibt zurück, ob ein Huhn getroffen wurde
}

initBackgroundMusic() {
    this.backgroundMusic = new Audio('./audio/background_game.mp3'); // Pfad zur Musikdatei
    this.backgroundMusic.loop = true; // Musik in Endlosschleife abspielen
    this.backgroundMusic.volume = 0.2; // Lautstärke (0.0 bis 1.0)
    this.backgroundMusic.play(); // Musik starten
}

toggleMute() {
    if (this.backgroundMusic.muted) {
        this.backgroundMusic.muted = false; // Musik wieder einschalten
        console.log('Musik eingeschaltet');
    } else {
        this.backgroundMusic.muted = true; // Musik stummschalten
        console.log('Musik stummgeschaltet');
    }
}


}



