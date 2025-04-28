class MovableObject {
x = 120;
y = 280;
img;
height = 150;
width = 100;
speed = 0.15;
otherDirection = false;

imageCache = {};
currentImage = 0;

loadImage(path) {
this.img = new Image();
this.img.src = path;

}

loadImages(arr) {

arr.forEach((path) => {

let img = new Image();
img.src = path;
this.imageCache[path] = img;

});

}

playAnimation(images){
    let i = this.currentImage % this.IMAGES_WALKING.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;

}

moveRight(){
    console.log('Moving right');
    
}

moveLeft(){
    
        this.x -= this.speed;
    
}


}