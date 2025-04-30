class MovableObject extends DrawableObject {



speed = 0.15;
otherDirection = false;
speedY = 0;
acceleration = 2.5;
energy = 100;

lastHit = 0;




applayGravity() {

setInterval(() => {
    if(this.isAboveGround() || this.speedY > 0) {
    this.y -= this.speedY;
    this.speedY -= this.acceleration; // Gravity effect
}}, 1000 / 25);
    
}

isAboveGround() {
    if(this instanceof ThrowableObject) { // throwable object should always fall
        return true;
    } else{
    return this.y < 130
}
}

//character.isColliding(chicken);
isColliding(mo) {
    return this.x + this.width > mo.x &&
        this.y + this.height > mo.y &&
        this.x < mo.x &&
        this.y < mo.y + mo.height;
}

hit(){
    this.energy -= 5;
    if(this.energy < 0) {
        this.energy = 0;
    } else{
        this.lastHit = new Date().getTime(); // Set the time of the last hit
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