class ThrowableObject extends MovableObject {
    hasHit = false; // Status, ob die Flasche bereits getroffen hat
    soundBrokenBottle = new Audio('./audio/broken_bottle.mp3'); // Sound für zerbrochene Flasche


    IMAGES_ROTATION = [

        './img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        './img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        './img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        './img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'

    ];


    IMAGES_SPLASH = [

        './img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        './img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];

    constructor(x, y) {

        super().loadImage('./img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 50;
        this.width = 50;
        this.zIndex = 100; // Setze den Z-Index für die Flasche
        this.throw();

        // Offsets für präzise Kollisionserkennung
    this.offset = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    };
        
        
    }

    throw(otherDirection) {
        this.speedY = 20; // Anfangsgeschwindigkeit in der Y-Richtung
        this.acceleration = 1.5; // Beschleunigung durch Schwerkraft
    
        // Starte die Rotationsanimation
        let animationInterval = setInterval(() => {
            if (!this.hasHit) {
                this.playAnimation(this.IMAGES_ROTATION); // Spiele die Rotationsanimation ab
            }
        }, 100); // Wechsle das Bild alle 100ms
    
        // Starte die Bewegung der Flasche
        this.throwInterval = setInterval(() => {
            if (this.hasHit) {
                clearInterval(this.throwInterval); // Stoppe die Bewegung
                clearInterval(animationInterval); // Stoppe die Animation
                return; // Beende die Schleife
            }
    
            // Horizontale Bewegung
            if (otherDirection) {
                this.x -= 10; // Bewegt die Flasche nach links
            } else {
                this.x += 10; // Bewegt die Flasche nach rechts
            }
    
            // Vertikale Bewegung
            this.y -= this.speedY; // Bewege die Flasche nach oben
            this.speedY -= this.acceleration; // Reduziere die Geschwindigkeit durch Schwerkraft 
            
    
            // Stoppe die Bewegung, wenn die Flasche den Boden erreicht
            if (this.y >= 390) { // 480 ist die Bildschirmhöhe                
                this.y = 390; // Setze die Flasche auf den Boden
                this.speedY = 0; // Stoppe die vertikale Bewegung
                this.hasHit = true; // Markiere die Flasche als getroffen
                this.startSplashAnimation(); // Starte die Splash-Animation
                this.soundBrokenBottle.play(); // Spiele den Sound ab
                this.soundBrokenBottle.volume = 0.3; // Setze die Lautstärke des Sounds
            }
        }, 1000 / 60); // 60 FPS
    }
 
    handleBottleCollision(enemies) {
        // Prüfe nur, wenn die Flasche sichtbar ist
        if (this.x >= 0 && this.x <= 720 && this.y >= 0 && this.y <= 390) {
            enemies.forEach((enemy) => {
                if (!this.hasCollided && this.isColliding(enemy)) {
                    console.log('Flasche trifft Gegner:', enemy);
    
                    // Markiere die Flasche als getroffen
                    this.hasCollided = true;
    
                    // Stoppe die Bewegung der Flasche
                    clearInterval(this.throwInterval); // Stoppe die Bewegung
                    this.speedY = 0; // Setze die vertikale Geschwindigkeit auf 0
    
                    // Setze die Position der Splash-Animation auf die aktuelle Position der Flasche
                    this.x = enemy.x + enemy.width / 2 - this.width / 2; // Zentriere die Flasche horizontal auf den Gegner
                    this.y = enemy.y + enemy.height / 2 - this.height / 2; // Zentriere die Flasche vertikal auf den Gegner
    
                    // Gegner als K.O. markieren oder Schaden zufügen
                    if (enemy instanceof Endboss) {
                        enemy.health -= 20; // Reduziere die Gesundheit des Endbosses
                        if (enemy.health <= 0) {
                            enemy.isKO = true; // Markiere den Endboss als K.O.
                        }
                    } else {
                        enemy.isKO = true; // Markiere normale Gegner als K.O.
                        enemy.speed = 0; // Geschwindigkeit des Gegners auf 0 setzen
                        enemy.applyGravity = () => {}; // Schwerkraft für den Gegner deaktivieren
                    }
    
                    // Starte die Splash-Animation
                    this.startSplashAnimation();
                }
            });
        }
    }

    startSplashAnimation() {
        if (this.hasCollided) return; // Verhindere mehrfaches Starten der Animation
    
        console.log('Starte Splash-Animation an Position:', this.x, this.y);
        this.loadImages(this.IMAGES_SPLASH);
        this.playAnimation(this.IMAGES_SPLASH);
    
        // Entferne die Flasche nach der Animation
        setTimeout(() => {
            const bottleIndex = this.world.throwableObjects.indexOf(this);
            if (bottleIndex > -1) {
                console.log('Entferne Flasche nach Splash-Animation:', this);
                this.world.throwableObjects.splice(bottleIndex, 1);
            }
        }, this.IMAGES_SPLASH.length * 100); // Warte, bis die Animation vollständig abgespielt wurde
    }
} 