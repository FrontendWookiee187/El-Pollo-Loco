class ChickenSmall extends MovableObject{
    
    width = 60;
    height = 60;
    y = 350;
    isKO = false; // Zustand des Huhns (k.o. oder nicht)
    

    IMAGES_WALKING_SMALL = [
        './img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        './img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        './img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
]; 


    IMAGES_KO = [

        './img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];


    constructor() {
        super().loadImage('./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING_SMALL);
        this.loadImages(this.IMAGES_KO);
        
        this.x = 300 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;

        // Offsets für präzise Kollisionserkennung
        this.offset = {
            top: -20,     // Abstand von oben
            bottom: 5,  // Abstand von unten
            left: 5,    // Abstand von links
            right: 5    // Abstand von rechts
        };

        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.isKO) {
                this.moveLeft(); // Bewegt das kleine Huhn kontinuierlich nach links
            } else {
                this.y += 5; // Lässt das kleine Huhn nach unten fallen, wenn es k.o. ist
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isKO) {
                this.playAnimation(this.IMAGES_KO); // Spielt die K.O.-Animation ab
            } else {
                this.playAnimation(this.IMAGES_WALKING_SMALL); // Spielt die Laufanimation ab
            }
        }, 200);
    }
}
