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

  IMAGES_ATTACK = [

    './img/4_enemie_boss_chicken/3_attack/G13.png',
    './img/4_enemie_boss_chicken/3_attack/G14.png',
    './img/4_enemie_boss_chicken/3_attack/G15.png',
    './img/4_enemie_boss_chicken/3_attack/G16.png',
    './img/4_enemie_boss_chicken/3_attack/G17.png',
    './img/4_enemie_boss_chicken/3_attack/G18.png',
    './img/4_enemie_boss_chicken/3_attack/G19.png',
    './img/4_enemie_boss_chicken/3_attack/G20.png',
  ];



  constructor(world) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_ATTACK);
    this.x = 2500;
    this.y = 55;
    this.health = 100; // Gesundheit des Endbosses
    this.zIndex = 90
    this.world = world; // Zugriff auf die Welt
    this.currentAnimation = this.IMAGES_WALKING; // Aktuelle Animation initialisieren
    // this.animate();
    


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
            this.setAnimation(this.IMAGES_DEAD); // Spiele die Dead-Animation ab
        } else if (this.isKO) {
            this.setAnimation(this.IMAGES_DEAD); // Spiele weiterhin die Dead-Animation ab
        } else if (this.isCharacterInRange()) {
            this.setAnimation(this.IMAGES_ATTACK); // Spiele die Angriffsanimation ab
        } else {
            this.setAnimation(this.IMAGES_WALKING); // Spiele die Laufanimation ab
        }

        // Spiele die aktuelle Animation
        this.playAnimation(this.currentAnimation);
    }, 200);
}

isCharacterInRange() {
  
  

  if (!this.world || !this.world.character) {
      console.warn('World oder Character ist nicht definiert');
      return false; // Charakter ist nicht in Reichweite
  }

  const character = this.world.character; // Zugriff auf den Charakter
  const distance = Math.abs(this.x - character.x); // Berechne die horizontale Entfernung

  return distance < 500; // Sichtbarer Bereich: 500 Pixel
}

setAnimation(images) {
  if (this.currentAnimation !== images) {
      this.currentAnimation = images; // Setze die aktuelle Animation
      this.currentImage = 0; // Starte die Animation von vorne
      this.playAnimation(images); // Spiele die neue Animation ab
  }
}




}