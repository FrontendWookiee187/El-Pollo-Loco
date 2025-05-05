class ThrowableObject extends MovableObject {

    constructor(x, y) {

        super().loadImage('./img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 50;
        this.width = 50;
        this.throw();
        
        
    }

    throw(otherDirection) {
        this.speedY = 20; // Anfangsgeschwindigkeit in der Y-Richtung
        this.applayGravity(); // Starte die Schwerkraft
    
        // Horizontale und vertikale Bewegung der Flasche
        this.throwInterval = setInterval(() => {
            // Horizontale Bewegung
            if (otherDirection) {
                this.x -= 20; // Bewegt die Flasche nach links
            } else {
                this.x += 20; // Bewegt die Flasche nach rechts
            }
    
            // Stoppe die Bewegung, wenn die Flasche den Bildschirm verlässt
            if (this.x < 0 || this.x > 720 || this.y > 480) { // 480 ist die Bildschirmhöhe
                clearInterval(this.throwInterval);
            }
        }, 25);
    }
}