class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 55;



    IMAGES_WALKING = [
        
        './img/4_enemie_boss_chicken/2_alert/G5.png',
        './img/4_enemie_boss_chicken/2_alert/G6.png',
        './img/4_enemie_boss_chicken/2_alert/G7.png',
        './img/4_enemie_boss_chicken/2_alert/G8.png',
        './img/4_enemie_boss_chicken/2_alert/G9.png',
        './img/4_enemie_boss_chicken/2_alert/G10.png',
        './img/4_enemie_boss_chicken/2_alert/G11.png',
        './img/4_enemie_boss_chicken/2_alert/G12.png',



    ];



  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.x = 2500;
    this.animate();
    // this.y = 50;
    // this.width = 300;
    // this.height = 300;
    // this.speed = 0.15;
    // this.health = 100;
    // this.lastHit = 0;
    // this.lastHitTime = 0;
    // this.isDead = false;
    // this.isAttacking = false;
    // this.attackInterval = 2000; // Time between attacks in milliseconds
    // this.attackTimer = null; // Timer for attack interval


    // Offsets für präzise Kollisionserkennung
    this.offset = {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
  };
  }

  animate(){
    setInterval(() => {
        this.playAnimation(this.IMAGES_WALKING); // Spielt die Animation ab
        },200);
  }

}