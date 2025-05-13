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
statusBarEndboss = new StatusBarEndboss();
throwableObjects = [];
chickenKOSound = new Audio('./audio/chicken_head_edited.mp3')
soundBottleCollect = new Audio('./audio/collect_bottle.mp3')
soundCoinCollect = new Audio('./audio/coin_collect.mp3')
gameEnded = false; // Flag, um das Spielende zu verfolgen
intervalId;
allAudioObjects = [];

constructor(canvas, keyboard) {

    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld(); 
    
    // Setze die World-Referenz für alle Gegner, einschließlich des Endbosses
    this.level.enemies.forEach(enemy => {
        enemy.world = this; // Setze die World-Referenz
        if (enemy instanceof Endboss) {
            enemy.animate(); // Starte die Animation des Endbosses
        }
    });

    this.initAudioObjects();
    this.run();
    this.initBackgroundMusic();
}

initAudioObjects() {
    this.allAudioObjects = [
        this.backgroundMusic,
        this.chickenKOSound,
        this.soundBottleCollect,
        this.soundCoinCollect,
        this.character.jumpSound,
        this.character.stepSound,
        this.character.hurtSound,
        this.character.snorSound,
        this.character.idleSound,
        this.character.deadSound,
    ];

    this.level.enemies.forEach(enemy => {
        if (enemy instanceof Endboss) {
            this.allAudioObjects.push(enemy.bossSound, enemy.bossDeadSound);
        }
    });

    console.log('Audio-Objekte initialisiert:', this.allAudioObjects);
}

    setWorld(){
       this.character.world = this; 
    }

    run() {
        this.intervalId = setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();

            if (!this.gameEnded) {
                if (this.character.isDead()) {
                    this.gameEnded = true;
                    
                    setTimeout(() => {
                    this.showEndScreen(false);
                    }, 3500);

                } else if (this.level.enemies.some(enemy => enemy instanceof Endboss && enemy.isKO)) {
                    this.gameEnded = true;

                    setTimeout(() => {
                    this.showEndScreen(true);
                    }, 3500);}
            }
        }, 200);
    }

    stopGameLoop() {
        clearInterval(this.intervalId); // Stoppe den Spiel-Loop
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
            bottle.soundBrokenBottle.muted = this.backgroundMusic.muted;
            bottle.throw(this.character.otherDirection); // Übergibt die Laufrichtung
            this.throwableObjects.push(bottle);
    
                // Flaschen-Leiste aktualisieren
                this.updateBottleStatusBarOnThrow();
            }
        }
    }

    checkCollisions() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            if (bottle.hasCollided) return; // Überspringe bereits behandelte Flaschen
    
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy)) {
                    console.log('Flasche trifft Gegner:', enemy);
    
                    // Markiere die Flasche als kollidiert
                    bottle.hasCollided = true;
    
                    // Stoppe die Bewegung der Flasche
                    clearInterval(bottle.throwInterval); // Stoppe die Bewegung
                    bottle.speedY = 0; // Setze die vertikale Geschwindigkeit auf 0
    
                    // Setze die Position der Splash-Animation auf die aktuelle Position der Flasche
                    bottle.x = enemy.x + enemy.width / 2 - bottle.width / 2; // Zentriere die Flasche horizontal auf den Gegner
                    bottle.y = enemy.y + enemy.height / 2 - bottle.height / 2; // Zentriere die Flasche vertikal auf den Gegner
    
                    // Gegner als K.O. markieren oder Schaden zufügen
                    if (enemy instanceof Endboss) {
                        enemy.health -= 20; // Reduziere die Gesundheit des Endbosses
                        this.statusBarEndboss.setPercentage(enemy.health); // Aktualisiere die Statusleiste des Endbosses
                        if (enemy.health <= 0) {
                            enemy.isKO = true; // Markiere den Endboss als K.O.
                        }
                    } else {
                        enemy.isKO = true; // Markiere normale Gegner als K.O.
                        enemy.speed = 0; // Geschwindigkeit des Gegners auf 0 setzen
                        enemy.applyGravity = () => {}; // Schwerkraft für den Gegner deaktivieren
                    }
    
                    // Starte die Splash-Animation der Flasche
                    bottle.startSplashAnimation();

                    // Entferne die Flasche erst nach der Dauer der Splash-Animation
                    setTimeout(() => {
                        if (this.throwableObjects.includes(bottle)) {
                            console.log('Entferne Flasche nach Splash-Animation:', bottle);
                            this.throwableObjects.splice(bottleIndex, 1);
                        }
                    }, bottle.IMAGES_SPLASH.length * 100); // Warte, bis die Splash-Animation vollständig abgespielt wurde
                }
            });
        });
    
        // Kollision mit Flaschen (zum Aufnehmen)
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                if (this.statusBarBottles.percentage < 100) { // Nur aufnehmen, wenn die Leiste nicht voll ist
                    this.level.bottles.splice(index, 1); // Entferne die Flasche aus dem Level
                    this.updateBottleStatusBar(); // Aktualisiere die Flaschen-Leiste
                    this.soundBottleCollect.play(); // Spiele den Sound ab
                    this.soundBottleCollect.volume = 0.3; // Lautstärke anpassen
                } else {                    
                }
            }
        });
    
        // Kollision mit Coins
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                if (this.statusBarCoins.percentage < 100) { // Nur aufnehmen, wenn die Leiste nicht voll ist
                    this.level.coins.splice(index, 1); // Entferne die Münze aus dem Level
                    this.updateCoinStatusBar(); // Aktualisiere die Münzen-Leiste
                    this.soundCoinCollect.play(); // Spiele den Sound ab
                    this.soundCoinCollect.volume = 0.3; // Lautstärke anpassen
                } else {                    
                }
            }
        });
    
       // Kollision mit Gegnern
this.level.enemies.forEach(enemy => {
    if (this.character.isColliding(enemy)) {
        // Prüfe, ob der Charakter auf ein Huhn springt
        if ((enemy instanceof Chicken || enemy instanceof ChickenSmall) &&
            this.character.speedY < -5 && // Der Charakter bewegt sich nach unten
            this.character.y + this.character.height - this.character.offset.bottom >= enemy.y + enemy.offset.top && // Untere Kante des Charakters trifft obere Kante des Huhns
            this.character.y + this.character.height - this.character.offset.bottom <= enemy.y + enemy.offset.top + 57 // Toleranz für die Erkennung
        ) {
            console.log('Charakter trifft das Huhn von oben:', enemy);
            enemy.isKO = true;
            enemy.speed = 0;

            // Vertikale Geschwindigkeit des Charakters zurücksetzen
            this.character.speedY = 15; // Charakter springt leicht zurück nach oben

            // Huhn-K.O.-Geräusch abspielen
            this.chickenKOSound.play();
            this.chickenKOSound.volume = 0.1;

            // Entferne das Huhn nach kurzer Verzögerung
            setTimeout(() => {                
                this.level.enemies.splice(this.level.enemies.indexOf(enemy), 1);
            }, 1000);
            return; // Beende die Verarbeitung für diese Kollision
        }
        // Standard-Kollisionslogik für Gegner
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy); // Aktualisiere die Lebensanzeige
    }
});
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);    
        this.ctx.translate(this.camera_x, 0); // Verschiebe die Kamera    
        // Zeichne den Hintergrund
        this.addObjectsToMap(this.level.backgroundObjects);    
        // Zeichne die Gegner (z. B. Endboss)
    this.level.enemies.forEach(enemy => {
        this.addToMap(enemy);
        // Zeichne die Statusleiste des Endbosses über dem Endboss
        if (enemy instanceof Endboss) {
            this.statusBarEndboss.x = enemy.x + enemy.width / 2 - this.statusBarEndboss.width / 2; // Zentriere die Statusleiste
            this.statusBarEndboss.y = enemy.y - 20; // Positioniere die Statusleiste über dem Endboss
            this.addToMap(this.statusBarEndboss);
        }
    });
    
        // Zeichne den Charakter
        this.addToMap(this.character);
    
        // Zeichne die restlichen Objekte
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
    
        // Zeichne die Flaschen (inklusive Splash-Animationen) zuletzt
        this.throwableObjects.forEach(obj => this.addToMap(obj));
    
        this.ctx.translate(-this.camera_x, 0);
    
        // Zeichne die Statusleisten
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarBottles);
        this.addToMap(this.statusBarCoins);     
  
    // Rekursives Zeichnen
        let self = this;
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

initBackgroundMusic() {
    this.backgroundMusic = new Audio('./audio/background_game_2.mp3');
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.5;    
    const muted = localStorage.getItem('muted') === '1';
    this.backgroundMusic.muted = muted;
    this.backgroundMusic.play();    
    this.allAudioObjects.forEach(audio => {
        if (audio) {
            audio.muted = muted;
        }
    });
}

toggleMute() {    
    const isMuted = this.backgroundMusic.muted;    
    const newMuted = !isMuted;
    localStorage.setItem('muted', newMuted ? '1' : '0');

    // Alle Audio-Elemente im DOM stummschalten/entschalten
    const allAudioElements = document.querySelectorAll('audio');
    allAudioElements.forEach(audio => {
        audio.muted = newMuted;
    });

    // Stummschalten/entschalten aller direkt erstellten Audio-Objekte
    this.allAudioObjects = [
        this.backgroundMusic,
        this.chickenKOSound,
        this.soundBottleCollect,
        this.soundCoinCollect,
        this.character.jumpSound,
        this.character.stepSound,
        this.character.hurtSound,
        this.character.snorSound,
        this.character.idleSound,
        this.character.deadSound,        
    ];

    this.level.enemies.forEach(enemy => {
        if (enemy instanceof Endboss) {
            this.allAudioObjects.push(enemy.bossSound, enemy.bossDeadSound);
        }
    });

    this.throwableObjects.forEach(bottle => {
        if (bottle.soundBrokenBottle) {
            this.allAudioObjects.push(bottle.soundBrokenBottle);
        }
    });

    this.allAudioObjects.forEach(audio => {
        if (audio) {
            audio.muted = newMuted;
        }
    });
}

showEndScreen(won) {
    console.log('showEndScreen aufgerufen:', won ? 'You Won' : 'You Lost');
    const endScreen = document.getElementById('endScreen');
    const endScreenImage = document.getElementById('endScreenImage');
    const canvas = document.getElementById('canvas');
    let h1 = document.getElementById('h1');
    let description = document.getElementById('description');
    let mute = document.getElementById('mute');

    canvas.style.display = 'none'; // Verstecke das Canvas
    endScreen.style.display = 'flex'; // Zeige den Endbildschirm
    document.getElementById('touchControls').style.display = 'none';

    h1.style.display = 'none';
    description.style.display = 'none';
    mute.style.display = 'none';  
    
     if (won) {
        endScreenImage.src = './img/You won, you lost/YouWonB.png'; // Bild für "You Won"        
    } else {
        endScreenImage.src = './img/You won, you lost/YouLost.png'; // Bild für "You Lost"        
    }

    this.allAudioObjects.forEach(audio => {
        if (audio) {
            audio.pause(); // Stoppe die Wiedergabe
        audio.currentTime = 0; // Setze die Wiedergabeposition auf den Anfang
        audio.muted = true; // Stummschalten
        this.backgroundMusic.pause();        
        }      

    });    
}

resetWorld() {
    this.stopGameLoop(); // Stoppe den Spiel-Loop    
}
}



