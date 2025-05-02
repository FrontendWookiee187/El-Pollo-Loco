class StatusBarBottles extends DrawableObject{

    IMAGES = [

        './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
        './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png'
    ]


    percentage = 100; // Initial hot sauce percentage

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setPercentage(100); // Set the initial health percentage
        this.x = 30;
        this.y = 60;
        this.width = 200;
        this.height = 60;
        this.percentage = 100; // Initial hot sauce percentage
    }

    // setPercentage(50);
setPercentage(percentage){
    this.percentage = percentage; // Set the hot sauce percentage  // => 0....5
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



