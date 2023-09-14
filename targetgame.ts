//define the size of the target game canvas
const WIDTH:number = 800, HEIGHT:number = 600
//define Target's colors
const TargetColor2:string = "white", TargetColor1:string = "red", BackgroundColor:string = "black"

type Context = CanvasRenderingContext2D;

//Define a Target class
class Target{
    x:number;
    y:number;
    grothRate: number = 0.2;
    maxSize:number = 30;
    size:number = 0;
    grow:boolean = true;

    constructor(x:number, y:number){
        this.x = x;
        this.y = y;
    }

    update(): void{
        if( this.size + this.grothRate >= this.maxSize){
            this.grow = false;
        }
        if(this.grow){
            this.size += this.grothRate;} else 
            {
                this.size -= this.grothRate;
        }
    }

    collide(x: number, y:number): boolean{
        const distance = Math.sqrt((this.x - x)**2 + (this.y - y)**2)
        return distance <= this.size
    }

    //function that draws a target
    drawTarget(context: Context){
        //const x:number = Math.random()*600 + 30;
        //const y:number = Math.random()*400 + 30;
        drawCircle(this.x, this.y, this.size * 1.2, TargetColor1, context);
        drawCircle(this.x, this.y, this.size, TargetColor2, context);
        drawCircle(this.x, this.y, this.size * 0.8, TargetColor1, context);
        drawCircle(this.x, this.y, this.size * 0.6, TargetColor2, context);
    }    
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
    let targets: Target[] = [];
    //clock = pygame.time.Clock()
    let target_pressed:number = 0
    let clicks:number = 0
    let start_time:Date = new Date(Date.now());
    let misses:number = 0  ;
    let run = true;
    let click: boolean = false;
    let mousePosX:number , mousePosY:number;

    while (run) {
        //clock.tick(60)
        click = false;
        //mouse_position = pygame.mouse.get_pos()
        //let diff = (Date.now() - start_time);
        //let elapsed_time = Math.floor((diff % (1000 * 60)) / 1000);
       
        let myTarget: Target = new Target(Math.random()*600 + 30, Math.random()*400 + 30);
        const myCanvas = document.querySelector("#canvas1");        
        if ((myCanvas as HTMLCanvasElement).getContext) {
            const ctx = (myCanvas as HTMLCanvasElement).getContext("2d");
            //ctx.fillStyle = "rgb(0,25,40)";
            //ctx.fillRect(0, 0, WIDTH, HEIGHT);
            let i:number = 0;
            while( i < 200){
                i += 1;
                setTimeout(() => {
                    myTarget.update();
                    myTarget.drawTarget(ctx);
                  }, 900);   
            } ;                                       
        } 

        break; 
    };
    /*    for event in pygame.event.get():
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