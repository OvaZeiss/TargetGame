//define the size of the target game canvas
const WIDTH:number = 800, HEIGHT:number = 600

//define Target's colors
const TargetColor2:string = "white", TargetColor1:string = "red", BackgroundColor:string = "rgb(0,25,40)"
type Context = CanvasRenderingContext2D;
const grothRate:number = 0.2;
const maxSize:number = 30;

//Define a Target class
class Target{
    x:number;
    y:number;
    size:number = 0;
    grow:boolean = true;
    context: Context;

    constructor(x:number, y:number){
        this.x = x;
        this.y = y;
    }

    update(): void{
        if( this.size + grothRate >= maxSize){
            this.grow = false;
        };
        if(this.grow){
            this.size += grothRate;} else 
            {
                this.size -= grothRate;
        };
    }

    collide(x: number, y:number): boolean{
        const distance: number = Math.sqrt((this.x - x)**2 + (this.y - y)**2)
        return distance <= this.size
    }

    //function that draws a target
    drawTarget(){        
        if(!this.grow){
            drawCircle(this.x, this.y, this.size * 1.2 + 1, BackgroundColor, this.context);
        };

        drawCircle(this.x, this.y, this.size * 1.2, TargetColor1, this.context);
        drawCircle(this.x, this.y, this.size, TargetColor2, this.context);
        drawCircle(this.x, this.y, this.size * 0.8, TargetColor1, this.context);
        drawCircle(this.x, this.y, this.size * 0.6, TargetColor2, this.context);
        // Call update to calculate the new target size
        this.update();     
    }; 

}

//define a function that draws a circle
function drawCircle(x:number, y:number, z: number, color: string, context: Context){
    context.beginPath();
    context.arc(x, y, Math.abs(z), 0, Math.PI * 2, true);
    context.fillStyle = color;
    context.fill();  
};

function CreateNewTarget(context: Context):Target{
    const myTarget: Target = new Target(Math.random()*650 + 30, Math.random()*450 + 30);
    myTarget.context = context;
    return myTarget;
}

function gameOver() {
    const ctx = GetContext();
    // Set the fill style to background color
    ctx.fillStyle = BackgroundColor;
    // Fill the canvas with the current fill style
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.font = ("50px serif");
    ctx.fillStyle = 'white';
    ctx.fillText('Game Over', WIDTH/2 -100, HEIGHT/2);
    ctx.font = ("18px serif");
    ctx.fillText('Press r to restart', WIDTH/2 -50, HEIGHT/2 + 50);
}

function GetContext(): Context {
    const gameCanvas = document.querySelector('.canvas1');
    const ctx = (gameCanvas as HTMLCanvasElement).getContext("2d");
    return ctx;    
}


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
    let clickOnTarget: boolean = false;
    //how manny clicks outside the target
    let misses: number = 0  ;
    let start_time: Date = new Date(Date.now());
    //mouse position when user clicks
    let mousePosX:number , mousePosY:number;
    //Number of Lives
    let lives:number = 3;
    //How many new targets to create each second
    const TargetsPerSecond: number = 2;
    //context
    let ctx: Context;

    //Calculate the elapsed time    
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
        };
    };
    document.querySelector(".missed").textContent = `${misses}`;
    document.querySelector(".hits").textContent = `${target_pressed}`;
    document.querySelector(".lives").textContent = `${lives}`;    
    
    const displyTimeInterval = setInterval(displayElapsedTime, 1);
    
    clickOnTarget = false;
    //get canvas
    const myCanvas = document.querySelector(".canvas1");        
    //get context
    ctx = GetContext();
    let requestId:number;

    const CreateAndAnimateTarget = () => {
        //Create new target and add it to the array of targets
        targets.push(CreateNewTarget(ctx));
        //Animate targets
        for (let i:number = 0; i < targets.length; i+= 1){
            function AnimateTarget(){
                if(run){
                    if(targets[i]){ 
                        targets[i].update();
                        if (targets[i].size >= 0) {
                            targets[i].drawTarget();
                            requestId = requestAnimationFrame(AnimateTarget);
                        };            
                    };
                };
            };
            if(run){ AnimateTarget()};  
            //Is target shrinking ? 
            if(!targets[i].grow && run === true){
                if(targets[i].size <= grothRate){
                    // target shrinking and size 0 then delete the target from the screnn and from targets array
                    drawCircle(targets[i].x, targets[i].y, Math.abs(targets[i].size * 1.25), BackgroundColor, targets[i].context);
                    lives -= 1;
                    document.querySelector(".lives").textContent = `${lives}`;
                    targets[i] = null;
                    targets.splice(i,1); 
                    // if no more lives => game over                       
                    if(lives === 0)
                    {
                        gameOver();
                        targets = null;
                        run = false; 
                        window.cancelAnimationFrame(requestId);
                        return ;} 
                };
            };                            
        };
    };

    //set timer for target creation  
    setInterval(() => {
        if (run) {
            CreateAndAnimateTarget();
        }
        }, 800);
        
    //Add a listner for mouse click. 
    //If the click is on a target, the target should be deleted from screen and targets array                
    const gameCanvas = document.querySelector('.gameCanvas');
    gameCanvas.addEventListener("click", function(event:MouseEvent) {
        const mouseX:number = event.clientX;
        const mouseY:number = event.clientY;
        if(run){
            let i = 0;
            while(i < targets.length && targets[i] !== null){
                if(targets[i].collide(mouseX  , mouseY - 100)){
                    target_pressed += 1;
                    document.querySelector(".hits").textContent = `${target_pressed}`;
                    //delete target from screen by drawing a circle with the background color over the target
                    drawCircle(targets[i].x, targets[i].y, targets[i].size * 1.25, BackgroundColor, targets[i].context);
                    targets[i].size = 0;
                    targets.splice(i,1);
                    clickOnTarget = true;
                };
                i++;
            };
            if(!clickOnTarget){
                misses += 1;
                document.querySelector(".missed").textContent = `${misses}`;
            } else { clickOnTarget = false}; 
        };           
    });          

    document.addEventListener("DOMContentLoaded", () => {
        // Clear the interval when the page is closed.
        window.addEventListener("unload", () => {
          clearInterval(displyTimeInterval);
          //clearInterval(createTargetIntervall);
        });
      });   

    //stop execution with ctrl+q
    document.addEventListener("keydown", (event) => {
        // Check if the `Ctrl` key is pressed and the `keyCode` is 81.
        if (event.ctrlKey && event.key === 'q') {
            console.log('s-a apasat ctrl q');
          run = false;
        };
      }); 

    //restart game
    document.addEventListener("keydown", (event) => {
        // Check if the `r` key is pressed
        if ( event.key === 'r') {
            ctx = GetContext();
            // Set the fill style to background color
            ctx.fillStyle = BackgroundColor;
            // Fill the canvas with the current fill style
            ctx.fillRect(0, 0, WIDTH, HEIGHT);            
            document.location.reload();
        };
      });      

    return; 
}
