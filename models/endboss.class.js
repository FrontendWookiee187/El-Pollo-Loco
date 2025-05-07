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

    IMAGES_DEAD = [
        
      './img/4_enemie_boss_chicken/5_dead/G24.png',
      './img/4_enemie_boss_chicken/5_dead/G25.png',
      './img/4_enemie_boss_chicken/5_dead/G26.png',
  ];



  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2500;
    this.y = 55;
    this.health = 100; // Gesundheit des Endbosses
    this.zIndex = 90
    this.animate();
    


    // Offsets für präzise Kollisionserkennung
    this.offset = {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
  };
  }

  animate() {
    setInterval(() => {
        if (this.health <= 0) {
            this.isKO = true; // Markiere den Endboss als K.O.
            this.playAnimation(this.IMAGES_DEAD); // Spiele die Dead-Animation ab
        } else if (this.isKO) {
            this.playAnimation(this.IMAGES_DEAD); // Spiele weiterhin die Dead-Animation ab
        } else {
            this.playAnimation(this.IMAGES_WALKING); // Spiele die Laufanimation ab
        }
    }, 200);
}
}