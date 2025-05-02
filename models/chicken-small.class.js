class ChickenSmall extends MovableObject{
    
    width = 60;
    height = 60;
    y = 350;
    

    IMAGES_WALKING_SMALL = [
        './img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        './img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        './img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
]; 


    constructor() {
        super().loadImage('./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING_SMALL);
        
        this.x = 300 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

    animate(){
        setInterval(() => {
            this.moveLeft(); // Bewegt das Huhn kontinuierlich nach links
        }, 1000 / 60);

        setInterval(() => {
        this.playAnimation(this.IMAGES_WALKING_SMALL); // Spielt die Animation ab
        },200);
    }
}
