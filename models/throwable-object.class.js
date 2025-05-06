class ThrowableObject extends MovableObject {
    hasHit = false; // Status, ob die Flasche bereits getroffen hat


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
            }
        }, 1000 / 60); // 60 FPS
    }
 
    handleBottleCollision(enemies) {
        // Prüfe nur, wenn die Flasche sichtbar ist
        if (this.x >= 0 && this.x <= 720 && this.y >= 0 && this.y <= 390) {
            console.log('Prüfe Kollisionen mit Gegnern:', enemies);
    
            let collisionDetected = false;
    
            // Prüfe Kollisionen mit Gegnern
            enemies.forEach((enemy) => {
                if (!this.hasHit && this.isColliding(enemy)) {
                    console.log('Flasche trifft Gegner:', enemy);
                
                    this.hasHit = true;
                    collisionDetected = true;
                
                    // Gegner als K.O. markieren
                    enemy.isKO = true;
                    enemy.speed = 0; // Geschwindigkeit des Gegners auf 0 setzen
                    enemy.applyGravity = () => {}; // Schwerkraft für den Gegner deaktivieren
                } else {
                    console.log('Keine Kollision mit Gegner:', enemy);
                }
            });
    
            // Prüfe, ob die Flasche den Boden erreicht hat
            if (!this.hasHit && this.y >= 400) { // 400 ist die Bodenhöhe
                console.log('Flasche trifft den Boden');
                this.hasHit = true; // Markiere die Flasche als getroffen
                collisionDetected = true;
            }
    
            // Starte die Splash-Animation, wenn eine Kollision erkannt wurde
            if (collisionDetected) {
                console.log('Starte Splash-Animation');
                this.startSplashAnimation();
            }
        }
    }

    startSplashAnimation() {        
        // Starte die Splash-Animation
        let animationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_SPLASH);
        }, 100); // Wechsle das Bild alle 100ms
    
        // Entferne die Flasche nach der Animation
        setTimeout(() => {
            clearInterval(animationInterval); // Stoppe die Animation            
            if (this.world) {
                const bottleIndex = this.world.throwableObjects.indexOf(this);
                if (bottleIndex > -1) {
                    this.world.throwableObjects.splice(bottleIndex, 1); // Entferne die Flasche
                }
            }
        }, this.IMAGES_SPLASH.length * 100); // Warte, bis die Animation vollständig abgespielt wurde
    }
} 