class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 55;
    bossSound = new Audio('./audio/boss_sound.mp3');
    bossDeadSound = new Audio('./audio/boss_dead.mp3');
    winnerSound = new Audio('./audio/yeaoh-82662.mp3');

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
    this.speed = 20; // Geschwindigkeit des
    this.zIndex = 90    
    this.currentAnimation = this.IMAGES_WALKING; // Aktuelle Animation initialisieren
    this.lastJumpTime = Date.now();
    this.isJumping = false;  

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
        const now = Date.now();

        if (this.health <= 0) {
            this.isKO = true; // Markiere den Endboss als K.O.
            this.setAnimation(this.IMAGES_DEAD); // Spiele die Dead-Animation ab
            this.stopRageSound(); // Stoppe den Boss-Sound
            this.bossDeadSound.play(); // Spiele den Boss-Tod-Sound ab
            this.bossDeadSound.volume = 0.5; // Setze die Lautstärke des Boss-Tod-Sounds           
        
            // Jubel-Sound NUR EINMAL abspielen:
            if (!this.yeahSoundPlayed) {
                this.playYeahSound();
                this.yeahSoundPlayed = true;
            }
        
        } else if (this.isKO) {
            this.setAnimation(this.IMAGES_DEAD); // Spiele weiterhin die Dead-Animation ab
            this.bossDeadSound.play(); // Spiele den Boss-Tod-Sound ab
            this.bossDeadSound.volume = 0.5; // Setze die Lautstärke des Boss-Tod-Sounds
        
        } else if (this.isCharacterInRange()) {
            this.setAnimation(this.IMAGES_ATTACK); // Spiele die Angriffsanimation ab

            // Sprung alle 2 Sekunden
            if (!this.isJumping && now - this.lastJumpTime > 2500) {
                this.isJumping = true;
                this.speedY = 50; // Sprungstärke
                this.lastJumpTime = now;
            }

            // Bewegung auf den Charakter zu
            const character = this.world.character;
            if (this.x > character.x) {
                this.x -= this.speed;
            } else if (this.x < character.x) {
                this.x += this.speed;
            }

            // Schwerkraft anwenden, wenn gesprungen wird
            if (this.isJumping) {
                this.y -= this.speedY;
                this.speedY -= 10; // Schwerkraft
                if (this.y >= 55) { // Bodenhöhe für Endboss
                    this.y = 55;
                    this.speedY = 0;
                    this.isJumping = false;
                }
            }

            // Spiele den Boss-Sound nur, wenn er nicht bereits läuft
            if (this.bossSound.paused) {
                this.bossSound.play();
                this.bossSound.volume = 0.5;
            }
        } else {
            this.setAnimation(this.IMAGES_WALKING); // Spiele die Laufanimation ab
            this.stopRageSound(); // Stoppe den Boss-Sound
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

stopRageSound(){

  this.bossSound.pause(); // Stoppe den Boss-Sound
  this.bossSound.currentTime = 0; // Setze die Wiedergabezeit auf den Anfang
}

playYeahSound(){
 if (this.health <= 0) {           
this.winnerSound.play(); // Spiele den Gewinner-Sound ab
this.winnerSound.volume = 0.5; // Setze die Lautstärke des Gewinner-Sounds}
}}

}