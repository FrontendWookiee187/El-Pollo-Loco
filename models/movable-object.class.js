class MovableObject extends DrawableObject {



speed = 0.15;
otherDirection = false;
speedY = 0;
acceleration = 2.5;
energy = 100;

lastHit = 0;
lastJumpAttack = 0; // Zeitpunkt des letzten erfolgreichen Kopfsprungs

rX;
rY;
rW;
rH;

offset= {
    top: 50,
    bottom: 10,
    left: 30,
    right: 30
};


applyGravity() {
    setInterval(() => {
        if (!this.isKO && (this.isAboveGround() || this.speedY > 0)) {
            this.y -= this.speedY; // Bewege das Objekt nach oben oder unten
            this.speedY -= this.acceleration; // Reduziere die Geschwindigkeit durch Schwerkraft
        } else if (this.isKO) {
            this.y = 400; // Setze den Gegner auf die Bodenhöhe
            this.speedY = 0; // Stoppe die vertikale Bewegung
        }
    }, 1000 / 60); // 60 FPS
}

isAboveGround() {
    if (this instanceof ThrowableObject) { 
        // ThrowableObject ist immer in der Luft
        return this.y < 480; // 480 ist die Bildschirmhöhe
    } else {
        // Prüfen, ob der Charakter über dem Boden ist
        return this.y < 130; // 130 ist die Bodenhöhe
    }
}

getRealFrame(){
    this.rX = this.x + this.offset.left;
    this.rY = this.y + this.offset.top;
    this.rW = this.width - this.offset.left - this.offset.right;
    this.rH = this.height - this.offset.top - this.offset.bottom;
}

//character.isColliding(chicken);
isColliding(mo) {
    let colliding = this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
           this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
           this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom &&
           this.y + this.height - this.offset.bottom > mo.y + mo.offset.top;       
    
        return colliding;
        }

// Präzisere Kollisionserkennung für das Sammeln von Objekten (Flaschen und Münzen)
// Verwendet kleinere Kollisionsbereiche um sicherzustellen, dass der Körper des Charakters die Objekte berührt
isCollidingForCollecting(mo) {
    // Verwende kleinere Offsets für den Charakter beim Sammeln
    const characterCollectOffset = {
        top: 30,    // Größerer Abstand von oben
        bottom: 30, // Größerer Abstand von unten  
        left: 35,   // Größerer Abstand von links
        right: 35   // Größerer Abstand von rechts
    };
    
    // Verwende unterschiedliche Kollisionsbereiche je nach Objekttyp
    let objectCollectOffset;
    
    // Prüfe ob es sich um eine Münze handelt (größere Objekte brauchen mehr Offset)
    if (mo.constructor.name === 'Coin' || mo.height >= 150) {
        // Für Münzen: Noch kleinere Kollisionsbereiche (40% statt 30%)
        objectCollectOffset = {
            top: mo.height * 0.4,      // 40% vom oberen Rand
            bottom: mo.height * 0.4,   // 40% vom unteren Rand
            left: mo.width * 0.4,      // 40% vom linken Rand
            right: mo.width * 0.4      // 40% vom rechten Rand
        };
    } else {
        // Für Flaschen: Weniger restriktiv (30%)
        objectCollectOffset = {
            top: mo.height * 0.3,      // 30% vom oberen Rand
            bottom: mo.height * 0.3,   // 30% vom unteren Rand
            left: mo.width * 0.3,      // 30% vom linken Rand
            right: mo.width * 0.3      // 30% vom rechten Rand
        };
    }
    
    let colliding = this.x + characterCollectOffset.left < mo.x + mo.width - objectCollectOffset.right &&
           this.x + this.width - characterCollectOffset.right > mo.x + objectCollectOffset.left &&
           this.y + characterCollectOffset.top < mo.y + mo.height - objectCollectOffset.bottom &&
           this.y + this.height - characterCollectOffset.bottom > mo.y + objectCollectOffset.top;       
    
    return colliding;
}

        hit(enemyHitFromAbove = false) {
            // Wenn der Charakter ein Huhn von oben trifft, erleidet er keinen Schaden
            if (enemyHitFromAbove) {
                console.log('Kein Schaden, da der Charakter ein Huhn von oben getroffen hat.');
                return;
            }
        
            // Standard-Schaden-Logik
            this.energy -= 5;
            if (this.energy < 0) {
                this.energy = 0;
            } else {
                this.lastHit = new Date().getTime(); // Setze die Zeit des letzten Treffers
            }
        }

isHurt() {

    let timepassed = new Date().getTime() - this.lastHit; // Calculate the time since the last hit / diff. in ms
    timepassed = timepassed / 1000; // Convert to seconds
    return timepassed < 1; 

}

isInvulnerableAfterJumpAttack() {
    let timepassed = new Date().getTime() - this.lastJumpAttack; // Zeit seit letztem Kopfsprung
    timepassed = timepassed / 1000; // In Sekunden umrechnen
    return timepassed < 0.2; // 0.2 Sekunden Unverwundbarkeit nach Kopfsprung (reduziert von 0.5)
}

setJumpAttackInvulnerability() {
    this.lastJumpAttack = new Date().getTime(); // Setze den Zeitpunkt des Kopfsprungs
}

isDead() {
    return this.energy < 20;
}

playAnimation(images){
    let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
}

moveRight(){
    this.x += this.speed; // Move right
}

moveLeft(){
    this.x -= this.speed; // Move left
}

jump(){
    this.speedY = 30;
}
}