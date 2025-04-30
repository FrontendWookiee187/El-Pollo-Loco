class DrawableObject{

    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
        
        }

    draw(ctx){
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
     }

     drawFrame(ctx) {

        if(this instanceof Character || this instanceof Chicken) {        

    ctx.beginPath();
        ctx.lineWidth = '5';
        ctx.strokeStyle = 'blue';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();

    }
}

     loadImages(arr) {
    arr.forEach((path) => {                
     let img = new Image();
     img.src = path;
      this.imageCache[path] = img;                
       });                
         }


         // Statische Methode zum Erstellen zufälliger Flaschen
    static createRandomBottles(amount) {
        let bottles = [];
        for (let i = 0; i < amount; i++) {
            let x = 200 + Math.random() * 2000; // Zufällige x-Position
            let y = 130; // Feste y-Position (z. B. auf dem Boden)
            bottles.push(new ThrowableObject(x, y));
        }
        return bottles;
    }




}