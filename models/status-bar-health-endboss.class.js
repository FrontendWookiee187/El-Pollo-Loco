class StatusBarEndboss extends DrawableObject{

   
        IMAGES = [
    
            './img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
            './img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
            './img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
            './img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
            './img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
            './img/7_statusbars/2_statusbar_endboss/orange/orange100.png'            
        ]
    
    
        percentage = 100; // Initial coin percentage
    
        constructor() {
            super();
            this.loadImages(this.IMAGES);
            this.setPercentage(0); // Set the initial coin percentage
            this.x = 30;
            this.y = 120;
            this.width = 200;
            this.height = 60;
            console.log('StatusBarCoins initialisiert:', this.IMAGES);
        }
    
        // setPercentage(50);
    setPercentage(percentage){
        this.percentage = percentage; // Set the coin percentage  // => 0....5
        let path = this.IMAGES[this.resolveImageIndex()]; // Get the image path based on the percentage
        this.img = this.imageCache[path]; 
      }
      
        resolveImageIndex(){
          if (this.percentage == 100){
             return 5; 
          } else if(this.percentage >= 80){
             return 4; 
          } else if(this.percentage >= 60){
             return 3; 
          } else if(this.percentage >= 40){
             return 2; 
          } else if(this.percentage >= 20){
             return 1; 
          } else {
             return 0; 
          }
          
      }
    
    
    
    
    }



