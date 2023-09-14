function drawCircle(x:number, y:number, z: size, color: string, context: object){
    context.beginPath();
    context.arc(x, y, z, 0, Math.PI * 2, true);
    context.fillStyle = color;
    context.fill();  
};