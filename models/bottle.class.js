class Bottle extends DrawableObject{

    IMAGES_BOTTLE = [
        './img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        './img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ]

    constructor(x, y) {
        super(); // Ruft den Konstruktor der Elternklasse DrawableObject auf
        this.loadImage(this.IMAGES_BOTTLE[Math.floor(Math.random() * this.IMAGES_BOTTLE.length)]); // Zufälliges Bild
        this.x = x || 200 + Math.random() * 2000; // Verwende übergebenes x oder generiere zufälliges x
        this.y = y || 380; // Verwende übergebenes y oder Standardwert 380
        this.height = 50; // Höhe der Flasche
        this.width = 50; // Breite der Flasche
    }

}