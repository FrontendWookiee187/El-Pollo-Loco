class StatusBar extends DrawableObject{

IMAGES = [
    './img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png', //0
    './img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
    './img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
    './img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
    './img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
    './img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png', //5
]

percentage = 100; // Initial health percentage

constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(100); // Set the initial health percentage
    this.x = 30;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.percentage = 100; // Initial health percentage
    this.responsivePositioning();
     window.addEventListener('resize', () => this.responsivePositioning());
}

// setPercentage(50);
setPercentage(percentage){
  this.percentage = percentage; // Set the health percentage  // => 0....5
  let path = this.IMAGES[this.resolveImageIndex()]; // Get the image path based on the percentage
  this.img = this.imageCache[path]; 
}

responsivePositioning(){
   if(window.innerWidth <= 768){      
      this.y = 20;      
   }
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

