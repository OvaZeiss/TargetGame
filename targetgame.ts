//define the size of the target game canvas
const WIDTH:number = 800, HEIGHT:number = 600
//define Target's colors
const TargetColor1:string = "white", TargetColor2:string = "red", BackgroundColor:string = "black"

type Context = CanvasRenderingContext2D;

//define a function that draws a circle
function drawCircle(x:number, y:number, z: number, color: string, context: Context){
    context.beginPath();
    context.arc(x, y, z, 0, Math.PI * 2, true);
    context.fillStyle = color;
    context.fill();  
};
//function taht draws a target
function drawTarget(context: Context){
	const x:number = Math.random()*600 + 60;
    const y:number = Math.random()*400 + 60;
    drawCircle(x, y, 65, TargetColor1, context);
    drawCircle(x, y, 50, TargetColor2, context);
    drawCircle(x, y, 35, TargetColor1, context);
    drawCircle(x, y, 20, TargetColor2, context);
}

//
function main() {
    const myCanvas = document.getElementById("canvas");
    if ((myCanvas as HTMLCanvasElement).getContext) {
        const ctx = (myCanvas as HTMLCanvasElement).getContext("2d");
        ctx.fillStyle = BackgroundColor;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        drawTarget(ctx);
    }
}