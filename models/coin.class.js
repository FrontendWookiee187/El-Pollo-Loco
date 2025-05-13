class Coin extends DrawableObject{

    IMAGES_COIN = [
        './img/8_coin/coin_1.png',
        './img/8_coin/coin_2.png'
    ]

    constructor(x, y) {
        super(); // Ruft den Konstruktor der Elternklasse DrawableObject auf
        this.loadImage(this.IMAGES_COIN[Math.floor(Math.random() * this.IMAGES_COIN.length)]); // Zufälliges Bild
        this.x = x || 200 + Math.random() * 1987; // Verwende übergebenes x oder generiere zufälliges x
        this.y = y || 300; // Verwende übergebenes y oder Standardwert 380
        this.height = 200; // Höhe der Münze
        this.width = 200; // Breite der Münze

        this.offset = {
            top: 50,    // Abstand von oben
            bottom: 50, // Abstand von unten
            left: 50,   // Abstand von links
            right: 50   // Abstand von rechts
        };
    }    

    animate() {
        let currentImageIndex = 0; // Start mit dem ersten Bild
        setInterval(() => {
            currentImageIndex = (currentImageIndex + 1) % this.IMAGES_COIN.length; // Zyklisch zwischen 0 und 1 wechseln
            this.img = this.imageCache[this.IMAGES_COIN[currentImageIndex]]; // Aktualisiere das Bild
        }, 200); // Wechsle das Bild alle 200ms
    }
}