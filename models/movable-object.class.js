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

getRealFrame(){
    this.rX = this.x + this.offset.left;
    this.rY = this.y + this.offset.top;
    this.rW = this.width - this.offset.left - this.offset.right;
    this.rH = this.height - this.offset.top - this.offset.bottom;
}

//character.isColliding(chicken);
isColliding(mo) {
    return this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
           this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
           this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom &&
           this.y + this.height - this.offset.bottom > mo.y + mo.offset.top;
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