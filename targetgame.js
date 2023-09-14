//define the size of the target game canvas
var WIDTH = 800, HEIGHT = 600;
//define Target's colors
var TargetColor2 = "white", TargetColor1 = "red", BackgroundColor = "black";
//Define a Target class
var Target = /** @class */ (function () {
    function Target(x, y) {
        this.grothRate = 0.2;
        this.maxSize = 30;
        this.size = 0;
        this.grow = true;
        this.x = x;
        this.y = y;
    }
    Target.prototype.update = function () {
        if (this.size + this.grothRate >= this.maxSize) {
            this.grow = false;
        }
        if (this.grow) {
            this.size += this.grothRate;
        }
        else {
            this.size -= this.grothRate;
        }
    };
    Target.prototype.collide = function (x, y) {
        var distance = Math.sqrt(Math.pow((this.x - x), 2) + Math.pow((this.y - y), 2));
        return distance <= this.size;
    };
    //function that draws a target
    Target.prototype.drawTarget = function (context) {
        //const x:number = Math.random()*600 + 30;
        //const y:number = Math.random()*400 + 30;
        drawCircle(this.x, this.y, this.size * 1.2, TargetColor1, context);
        drawCircle(this.x, this.y, this.size, TargetColor2, context);
        drawCircle(this.x, this.y, this.size * 0.8, TargetColor1, context);
        drawCircle(this.x, this.y, this.size * 0.6, TargetColor2, context);
    };
    return Target;
}());
//define a function that draws a circle
function drawCircle(x, y, z, color, context) {
    context.beginPath();
    context.arc(x, y, z, 0, Math.PI * 2, true);
    context.fillStyle = color;
    context.fill();
}
;
// change
function main() {
    var targets = [];
    //clock = pygame.time.Clock()
    var target_pressed = 0;
    var clicks = 0;
    var start_time = new Date(Date.now());
    var misses = 0;
    var run = true;
    var click = false;
    var mousePosX, mousePosY;
    var _loop_1 = function () {
        //clock.tick(60)
        click = false;
        //mouse_position = pygame.mouse.get_pos()
        //let diff = (Date.now() - start_time);
        //let elapsed_time = Math.floor((diff % (1000 * 60)) / 1000);
        var myTarget = new Target(Math.random() * 600 + 30, Math.random() * 400 + 30);
        var myCanvas = document.querySelector("#canvas1");
        if (myCanvas.getContext) {
            var ctx_1 = myCanvas.getContext("2d");
            //ctx.fillStyle = "rgb(0,25,40)";
            //ctx.fillRect(0, 0, WIDTH, HEIGHT);
            var i = 0;
            while (i < 200) {
                i += 1;
                setTimeout(function () {
                    myTarget.update();
                    myTarget.drawTarget(ctx_1);
                }, 900);
            }
            ;
        }
        return "break";
    };
    while (run) {
        var state_1 = _loop_1();
        if (state_1 === "break")
            break;
    }
    ;
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
