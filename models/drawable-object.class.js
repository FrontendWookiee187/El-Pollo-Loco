class DrawableObject{

    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;

    offset= {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
        
        }

    draw(ctx){
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
     }

     drawFrame(ctx) {
        // Zeichne den Rahmen für bestimmte Objekte
        if (this instanceof Character || this instanceof Chicken || this instanceof ThrowableObject || this instanceof Endboss) {
            // Originalgröße (blauer Rahmen)
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
    
            // Hitbox basierend auf den Offsets (roter Rahmen)
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'red';
            ctx.rect(
                this.x + this.offset.left,
                this.y + this.offset.top,
                this.width - this.offset.left - this.offset.right,
                this.height - this.offset.top - this.offset.bottom
            );
            ctx.stroke();
        }
    }

 //      drawFrame(ctx) {

//         if(this instanceof Character || this instanceof Chicken) {        

//     ctx.beginPath();
//         ctx.lineWidth = '5';
//         ctx.strokeStyle = 'blue';
//         ctx.rect(this.x, this.y, this.width, this.height);
//         ctx.stroke();

//     }
// }

     loadImages(arr) {
    arr.forEach((path) => {                
     let img = new Image();
     img.src = path;
      this.imageCache[path] = img;                
       });                
         }  
}