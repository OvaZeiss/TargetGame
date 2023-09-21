//define the size of the target game canvas
const WIDTH:number = 800, HEIGHT:number = 600
//define Target's colors
const TargetColor2:string = "white", TargetColor1:string = "red", BackgroundColor:string = "rgb(0,25,40)"

type Context = CanvasRenderingContext2D;

//Define a Target class
class Target{
    x:number;
    y:number;
    grothRate: number = 0.2;
    maxSize:number = 30;
    size:number = 0;
    grow:boolean = true;
    context: CanvasRenderingContext2D;

    constructor(x:number, y:number){
        this.x = x;
        this.y = y;
    }

    update(): void{
        if( this.size + this.grothRate >= this.maxSize){
            this.grow = false;
        };
        if(this.grow){
            this.size += this.grothRate;} else 
            {
                this.size -= this.grothRate;
        };
    }

    collide(x: number, y:number): boolean{
        const distance: number = Math.sqrt((this.x - x)**2 + (this.y - y)**2)
        return distance <= this.size
    }

    //function that draws a target
    drawTarget(){
        //const x:number = Math.random()*600 + 30;
        //const y:number = Math.random()*400 + 30;
        
        drawCircle(this.x, this.y, this.size * 1.2, TargetColor1, this.context);
        drawCircle(this.x, this.y, this.size, TargetColor2, this.context);
        drawCircle(this.x, this.y, this.size * 0.8, TargetColor1, this.context);
        drawCircle(this.x, this.y, this.size * 0.6, TargetColor2, this.context);
     
        if( this.size + this.grothRate >= this.maxSize){
            this.grow = false;
        }else{
            this.size = this.size + this.grothRate;
        };
        if(this.grow){
            this.size += this.grothRate;} else 
            {
                this.size -= this.grothRate;
        };      
    }; 

}

//define a function that draws a circle
function drawCircle(x:number, y:number, z: number, color: string, context: Context){
    context.beginPath();
    context.arc(x, y, z, 0, Math.PI * 2, true);
    context.fillStyle = color;
    context.fill();  
};

// change
function main() {
    //control boolean to stop the flow in some cases
    let run: boolean = true;
    //a list with the targets on the screen
    let targets: Target[] = [];
    //how manny targets were succsessfully pressed
    let target_pressed:number = 0
    //how many clicks
    let clicks: number = 0
    let click: boolean = false;
    //how manny clicks outside the target
    let misses: number = 0  ;
    let start_time: Date = new Date(Date.now());
    //mouse position when user clicks
    let mousePosX:number , mousePosY:number;
    //Lives
    let lives:number = 3;

    //Calculate the elapsed time
    //
    const startTime = performance.now();

    const displayElapsedTime = () => {
    const currentTime = performance.now();
    const elapsedTime = currentTime - startTime;
    
    const minutes: number = Math.floor(elapsedTime / 60000);
    const strMinutes: string = (minutes < 10) ? '0' + minutes : JSON.stringify(minutes);
      
    const seconds: number = Math.floor((elapsedTime % 60000) / 1000);
    const strSeconds: string = (seconds < 10) ? '0' + seconds : JSON.stringify(seconds%100);
    const milisecondLength: number = JSON.stringify(Math.floor(elapsedTime)).length;

    const milliseconds: string = JSON.stringify(Math.floor(elapsedTime)).slice(milisecondLength - 3, milisecondLength - 2);
    
    
    // Display the elapsed time.
    if(run){
        document.querySelector(".elapsedTime").textContent = `${strMinutes}:${strSeconds}:${milliseconds}`;
        document.querySelector(".lives").textContent = `${lives}`;
     };
};
    
    const interval = setInterval(displayElapsedTime, 1);
    
    document.addEventListener("DOMContentLoaded", () => {
      // Clear the interval when the page is closed.
      window.addEventListener("unload", () => {
        clearInterval(interval);
      });
    });
    


   // while (run) {
        click = false;
        //get canvas
        const myCanvas = document.querySelector(".canvas1");        
        //get context
        if ((myCanvas as HTMLCanvasElement).getContext) {
            const ctx = (myCanvas as HTMLCanvasElement).getContext("2d");
            //create a target
            let myTarget: Target = new Target(Math.random()*650 + 30, Math.random()*450 + 30);
            myTarget.context = ctx;
            //Add target to an array of targets
            targets.push(myTarget);
            //Animate target
            function AnimateTarget(){
                myTarget.update(); 
                if(!myTarget.grow){
                    drawCircle(myTarget.x, myTarget.y, 36, BackgroundColor, myTarget.context);
                }    
                
                if (myTarget.size >= 0) {
                    myTarget.drawTarget();
                    requestAnimationFrame(AnimateTarget);
                };            
            };
            AnimateTarget(); 
            console.log('grow '+ myTarget.grow);
            if(!myTarget.grow){
                drawCircle(myTarget.x, myTarget.y, myTarget.size * 1.25, BackgroundColor, myTarget.context);
                if(myTarget.size < 0.2){
                    run = false;
                };
    
            };                        

            const gameCanvas = document.querySelector('.gameCanvas');
            gameCanvas.addEventListener("click", function(event:MouseEvent) {
            //gameCanvas.onclick = function(event) {

                const mouseX = event.clientX;
                const mouseY = event.clientY;
            
                //for(let i = 0; i < targets.length; i++){
                    let i = 0;
                    while(i < targets.length && targets[i] !== null){
                    console.log('y '+ (targets[i].y + 70));
                    if(targets[i].collide(mouseX  , mouseY - 100)){
                        drawCircle(targets[i].x, targets[i].y, targets[i].size * 1.25, BackgroundColor, targets[i].context);
                        targets[i].size = 0;
                        targets.splice(i,1);
                        run = false;
                    };
                    i++;
                };
            });          
       // ); 
        };
    //};
    //stop execution with ctrl+q
    document.addEventListener("keydown", function(event) {
        // Check if the `Ctrl` key is pressed and the `keyCode` is 81.
        if (event.ctrlKey && event.key === 'q') {
            console.log('s-a apasat ctrl q');
          run = false;
        };
      });  
      
        
          
    /*
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False
                break

            if event.type == TARGET_EVENT:
                x = random.randint(TARGET_PADDING, WIDTH - TARGET_PADDING)
                y = random.randint(TARGET_PADDING + TOP_BAR_HEIGHT, HEIGHT - TARGET_PADDING)
                target = Target(x, y)
                targets.append(target)

            if event.type == pygame.MOUSEBUTTONDOWN:
                click = True
                clicks += 1
                print("mouse down click = ", clicks)

        for target in targets:
            target.update()
            if target.size <= 0:
                targets.remove(target)
                misses += 1

            if click and target.collide(*mouse_position):
                targets.remove(target)
                target_pressed += 1
                print(target_pressed)

        end_time = elapsed_time
        if misses >= LIVES:
            run = False
            end_screen(WIN, end_time, target_pressed, clicks)

        draw(WIN, targets)
        draw_top_bar(WIN, elapsed_time, target_pressed, misses)

        pygame.display.update()

    pygame.quit()   */ 
    
 //   const myCanvas = document.querySelector("#canvas1");
 //   myCanvas.addEventListener("mousemove", (event) => {
 //       mousePosX = event.offsetX;
 //       mousePosY = event.offsetY;
 //     });

}