class MovableObject extends DrawableObject {



speed = 0.15;
otherDirection = false;
speedY = 0;
acceleration = 2.5;
energy = 100;

lastHit = 0;

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

isDead() {
    return this.energy == 0;
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