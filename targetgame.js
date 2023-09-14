//define the size of the target game canvas
const WIDTH = 800, HEIGHT = 600;

function drawCircle(x, y, z, color, context) {
    context.beginPath();
    context.arc(x, y, z, 0, Math.PI * 2, true);
    context.fillStyle = color;
    context.fill();
}
;
