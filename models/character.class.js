class Character extends MovableObject {

    height = 300;
    width = 150;
    y = 130;
    speed = 10;
    jumpSound = new Audio('./audio/jump.mp3')


    IMAGES_IDLE = [

        './img/2_character_pepe/1_idle/idle/I-1.png',
        './img/2_character_pepe/1_idle/idle/I-2.png',
        './img/2_character_pepe/1_idle/idle/I-3.png',
        './img/2_character_pepe/1_idle/idle/I-4.png',
        './img/2_character_pepe/1_idle/idle/I-5.png',
        './img/2_character_pepe/1_idle/idle/I-6.png',
        './img/2_character_pepe/1_idle/idle/I-7.png',
        './img/2_character_pepe/1_idle/idle/I-8.png',
        './img/2_character_pepe/1_idle/idle/I-9.png',
        './img/2_character_pepe/1_idle/idle/I-10.png'
    ];


    IMAGES_LONG_IDLE = [

        './img/2_character_pepe/1_idle/long_idle/I-11.png',
        './img/2_character_pepe/1_idle/long_idle/I-12.png',
        './img/2_character_pepe/1_idle/long_idle/I-13.png',
        './img/2_character_pepe/1_idle/long_idle/I-14.png',
        './img/2_character_pepe/1_idle/long_idle/I-15.png',
        './img/2_character_pepe/1_idle/long_idle/I-16.png',
        './img/2_character_pepe/1_idle/long_idle/I-17.png',
        './img/2_character_pepe/1_idle/long_idle/I-18.png',
        './img/2_character_pepe/1_idle/long_idle/I-19.png',
        './img/2_character_pepe/1_idle/long_idle/I-20.png'

    ];

    IMAGES_WALKING =[

        './img/2_character_pepe/2_walk/W-21.png',
        './img/2_character_pepe/2_walk/W-22.png',
        './img/2_character_pepe/2_walk/W-23.png',
        './img/2_character_pepe/2_walk/W-24.png',
        './img/2_character_pepe/2_walk/W-25.png',
        './img/2_character_pepe/2_walk/W-26.png',            
    ];

    IMAGES_JUMPING =[
        './img/2_character_pepe/3_jump/J-31.png',
        './img/2_character_pepe/3_jump/J-32.png',
        './img/2_character_pepe/3_jump/J-33.png',
        './img/2_character_pepe/3_jump/J-34.png',
        './img/2_character_pepe/3_jump/J-35.png',
        './img/2_character_pepe/3_jump/J-36.png',
        './img/2_character_pepe/3_jump/J-37.png',
        './img/2_character_pepe/3_jump/J-38.png',
        './img/2_character_pepe/3_jump/J-39.png',
    ]

    IMAGES_DEAD = [
        './img/2_character_pepe/5_dead/D-51.png',
        './img/2_character_pepe/5_dead/D-52.png',
        './img/2_character_pepe/5_dead/D-53.png',
        './img/2_character_pepe/5_dead/D-54.png',
        './img/2_character_pepe/5_dead/D-55.png',
        './img/2_character_pepe/5_dead/D-56.png',
        './img/2_character_pepe/5_dead/D-57.png'


    ]

    IMAGES_HURT = [
        './img/2_character_pepe/4_hurt/H-41.png',
        './img/2_character_pepe/4_hurt/H-42.png',
        './img/2_character_pepe/4_hurt/H-43.png'

    ]

    world;

    

    constructor() {
        super().loadImage('./img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.applayGravity();

        // Offsets für präzise Kollisionserkennung
    this.offset = {
        top: 50,    // Abstand von oben
        bottom: -30, // Abstand von unten
        left: 20,   // Abstand von links
        right: 20   // Abstand von rechts
    };

        this.animate();
        this.getRealFrame();
        

    }

    animate(){
        let inactivityTimer = 0; // Timer für Inaktivität

        setInterval(() => {
            if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x){  
                this.moveRight();
                this.otherDirection = false; // Set otherDirection to false when moving right
                inactivityTimer = 0; // Timer zurücksetzen bei Bewegung
            }

            if(this.world.keyboard.LEFT && this.x > 0){ // Prevent moving left if x is less than or equal to 0
                this.moveLeft();
                this.otherDirection = true; // Set otherDirection to true when moving left
                inactivityTimer = 0; // Timer zurücksetzen bei Bewegung
            }

            if(this.world.keyboard.SPACE && !this.isAboveGround()){
                this.jump(); // Call the jump method when UP key is pressed and character is on the ground
                inactivityTimer = 0; // Timer zurücksetzen bei Sprung
            }

            this.world.camera_x = -this.x + 100;

        },1000/60)

        setInterval(() => {

            inactivityTimer += 100; // Timer um 100ms erhöhen

            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD); // Play dead animation            
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT); // Play hurt animation
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING); // Play jumping animation
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING); // Play walking animation
            } else if (inactivityTimer >= 15000) { // Nach 15 Sekunden Inaktivität
                this.playAnimation(this.IMAGES_LONG_IDLE);
            }else {
                this.playAnimation(this.IMAGES_IDLE); // Play idle animation
            }
        }, 100); // Update animation every 50ms
    }
 
    jump() {
        this.speedY = 30; // Set the speedY to a positive value to make the character jump
        this.jumpSound.play(); // Spiele den Sprung-Sound ab
        this.jumpSound.volume = 0.2; // Lautstärke (0.0 bis 1.0)
    }
    
}