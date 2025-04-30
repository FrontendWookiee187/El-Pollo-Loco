class ThrowableObject extends MovableObject {

    constructor(x, y) {

        super().loadImage('./img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 50;
        this.width = 50;
        this.throw();
        
        
    }

    throw(otherDirection){        
        this.speedY = 20; // Set the initial speed in the Y direction
        this.applayGravity(); // Start applying gravity

        setInterval(() => {
            if (otherDirection) {                
                this.x -= 10;
                
            }else {                
                this.x += 10;
                }
        }, 25)
    }
}