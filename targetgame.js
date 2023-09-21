//define the size of the target game canvas
var WIDTH = 800, HEIGHT = 600;
//define Target's colors
var TargetColor2 = "white", TargetColor1 = "red", BackgroundColor = "rgb(0,25,40)";
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
        ;
        if (this.grow) {
            this.size += this.grothRate;
        }
        else {
            this.size -= this.grothRate;
        }
        ;
    };
    Target.prototype.collide = function (x, y) {
        var distance = Math.sqrt(Math.pow((this.x - x), 2) + Math.pow((this.y - y), 2));
        return distance <= this.size;
    };
    //function that draws a target
    Target.prototype.drawTarget = function () {
        //const x:number = Math.random()*600 + 30;
        //const y:number = Math.random()*400 + 30;
        drawCircle(this.x, this.y, this.size * 1.2, TargetColor1, this.context);
        drawCircle(this.x, this.y, this.size, TargetColor2, this.context);
        drawCircle(this.x, this.y, this.size * 0.8, TargetColor1, this.context);
        drawCircle(this.x, this.y, this.size * 0.6, TargetColor2, this.context);
        if (this.size + this.grothRate >= this.maxSize) {
            this.grow = false;
        }
        else {
            this.size = this.size + this.grothRate;
        }
        ;
        if (this.grow) {
            this.size += this.grothRate;
        }
        else {
            this.size -= this.grothRate;
        }
        ;
    };
    ;
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
    //control boolean to stop the flow in some cases
    var run = true;
    //a list with the targets on the screen
    var targets = [];
    //how manny targets were succsessfully pressed
    var target_pressed = 0;
    //how many clicks
    var clicks = 0;
    var click = false;
    //how manny clicks outside the target
    var misses = 0;
    var start_time = new Date(Date.now());
    //mouse position when user clicks
    var mousePosX, mousePosY;
    //Lives
    var lives = 3;
    //Calculate the elapsed time
    //
    var startTime = performance.now();
    var displayElapsedTime = function () {
        var currentTime = performance.now();
        var elapsedTime = currentTime - startTime;
        var minutes = Math.floor(elapsedTime / 60000);
        var strMinutes = (minutes < 10) ? '0' + minutes : JSON.stringify(minutes);
        var seconds = Math.floor((elapsedTime % 60000) / 1000);
        var strSeconds = (seconds < 10) ? '0' + seconds : JSON.stringify(seconds % 100);
        var milisecondLength = JSON.stringify(Math.floor(elapsedTime)).length;
        var milliseconds = JSON.stringify(Math.floor(elapsedTime)).slice(milisecondLength - 3, milisecondLength - 2);
        // Display the elapsed time.
        if (run) {
            document.querySelector(".elapsedTime").textContent = "".concat(strMinutes, ":").concat(strSeconds, ":").concat(milliseconds);
            document.querySelector(".lives").textContent = "".concat(lives);
        }
        ;
    };
    var interval = setInterval(displayElapsedTime, 1);
    document.addEventListener("DOMContentLoaded", function () {
        // Clear the interval when the page is closed.
        window.addEventListener("unload", function () {
            clearInterval(interval);
        });
    });
    // while (run) {
    click = false;
    //get canvas
    var myCanvas = document.querySelector(".canvas1");
    //get context
    if (myCanvas.getContext) {
        var ctx = myCanvas.getContext("2d");
        //create a target
        var myTarget_1 = new Target(Math.random() * 650 + 30, Math.random() * 450 + 30);
        myTarget_1.context = ctx;
        //Add target to an array of targets
        targets.push(myTarget_1);
        //Animate target
        function AnimateTarget() {
            myTarget_1.update();
            if (!myTarget_1.grow) {
                drawCircle(myTarget_1.x, myTarget_1.y, 36, BackgroundColor, myTarget_1.context);
            }
            if (myTarget_1.size >= 0) {
                myTarget_1.drawTarget();
                requestAnimationFrame(AnimateTarget);
            }
            ;
        }
        ;
        AnimateTarget();
        console.log('grow ' + myTarget_1.grow);
        if (!myTarget_1.grow) {
            drawCircle(myTarget_1.x, myTarget_1.y, myTarget_1.size * 1.25, BackgroundColor, myTarget_1.context);
            if (myTarget_1.size < 0.2) {
                run = false;
            }
            ;
        }
        ;
        var gameCanvas = document.querySelector('.gameCanvas');
        gameCanvas.addEventListener("click", function (event) {
            //gameCanvas.onclick = function(event) {
            var mouseX = event.clientX;
            var mouseY = event.clientY;
            //for(let i = 0; i < targets.length; i++){
            var i = 0;
            while (i < targets.length && targets[i] !== null) {
                console.log('y ' + (targets[i].y + 70));
                if (targets[i].collide(mouseX, mouseY - 100)) {
                    drawCircle(targets[i].x, targets[i].y, targets[i].size * 1.25, BackgroundColor, targets[i].context);
                    targets[i].size = 0;
                    targets.splice(i, 1);
                    run = false;
                }
                ;
                i++;
            }
            ;
        });
        // ); 
    }
    ;
    //};
    //stop execution with ctrl+q
    document.addEventListener("keydown", function (event) {
        // Check if the `Ctrl` key is pressed and the `keyCode` is 81.
        if (event.ctrlKey && event.key === 'q') {
            console.log('s-a apasat ctrl q');
            run = false;
        }
        ;
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
