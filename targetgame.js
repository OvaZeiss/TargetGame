//define the size of the target game canvas
var WIDTH = 800, HEIGHT = 600;
//define Target's colors
var TargetColor2 = "white", TargetColor1 = "red", BackgroundColor = "rgb(0,25,40)";
var grothRate = 0.2;
var maxSize = 30;
//Define a Target class
var Target = /** @class */ (function () {
    function Target(x, y) {
        this.size = 0;
        this.grow = true;
        this.x = x;
        this.y = y;
    }
    Target.prototype.update = function () {
        if (this.size + grothRate >= maxSize) {
            this.grow = false;
        }
        ;
        if (this.grow) {
            this.size += grothRate;
        }
        else {
            this.size -= grothRate;
        }
        ;
    };
    Target.prototype.collide = function (x, y) {
        var distance = Math.sqrt(Math.pow((this.x - x), 2) + Math.pow((this.y - y), 2));
        return distance <= this.size;
    };
    //function that draws a target
    Target.prototype.drawTarget = function () {
        if (!this.grow) {
            drawCircle(this.x, this.y, this.size * 1.2 + 1, BackgroundColor, this.context);
        }
        ;
        drawCircle(this.x, this.y, this.size * 1.2, TargetColor1, this.context);
        drawCircle(this.x, this.y, this.size, TargetColor2, this.context);
        drawCircle(this.x, this.y, this.size * 0.8, TargetColor1, this.context);
        drawCircle(this.x, this.y, this.size * 0.6, TargetColor2, this.context);
        // Call update to calculate the new target size
        this.update();
    };
    ;
    return Target;
}());
//define a function that draws a circle
function drawCircle(x, y, z, color, context) {
    context.beginPath();
    context.arc(x, y, Math.abs(z), 0, Math.PI * 2, true);
    context.fillStyle = color;
    context.fill();
}
;
function CreateNewTarget(context) {
    var myTarget = new Target(Math.random() * 650 + 30, Math.random() * 450 + 30);
    myTarget.context = context;
    return myTarget;
}
function gameOver() {
    var ctx = GetContext();
    // Set the fill style to background color
    ctx.fillStyle = BackgroundColor;
    // Fill the canvas with the current fill style
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.font = ("50px serif");
    ctx.fillStyle = 'white';
    ctx.fillText('Game Over', WIDTH / 2 - 100, HEIGHT / 2);
    ctx.font = ("18px serif");
    ctx.fillText('Press r to restart', WIDTH / 2 - 50, HEIGHT / 2 + 50);
}
function GetContext() {
    var gameCanvas = document.querySelector('.canvas1');
    var ctx = gameCanvas.getContext("2d");
    return ctx;
}
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
    var clickOnTarget = false;
    //how manny clicks outside the target
    var misses = 0;
    var start_time = new Date(Date.now());
    //mouse position when user clicks
    var mousePosX, mousePosY;
    //Number of Lives
    var lives = 3;
    //How many new targets to create each second
    var TargetsPerSecond = 2;
    //context
    var ctx;
    //Calculate the elapsed time    
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
        }
        ;
    };
    document.querySelector(".missed").textContent = "".concat(misses);
    document.querySelector(".hits").textContent = "".concat(target_pressed);
    document.querySelector(".lives").textContent = "".concat(lives);
    var displyTimeInterval = setInterval(displayElapsedTime, 1);
    clickOnTarget = false;
    //get canvas
    var myCanvas = document.querySelector(".canvas1");
    //get context
    ctx = GetContext();
    var requestId;
    var CreateAndAnimateTarget = function () {
        //Create new target and add it to the array of targets
        targets.push(CreateNewTarget(ctx));
        var _loop_1 = function (i) {
            function AnimateTarget() {
                if (run) {
                    if (targets[i]) {
                        targets[i].update();
                        if (targets[i].size >= 0) {
                            targets[i].drawTarget();
                            requestId = requestAnimationFrame(AnimateTarget);
                        }
                        ;
                    }
                    ;
                }
                ;
            }
            ;
            if (run) {
                AnimateTarget();
            }
            ;
            //Is target shrinking ? 
            if (!targets[i].grow && run === true) {
                if (targets[i].size <= grothRate) {
                    // target shrinking and size 0 then delete the target from the screnn and from targets array
                    drawCircle(targets[i].x, targets[i].y, Math.abs(targets[i].size * 1.25), BackgroundColor, targets[i].context);
                    lives -= 1;
                    document.querySelector(".lives").textContent = "".concat(lives);
                    targets[i] = null;
                    targets.splice(i, 1);
                    // if no more lives => game over                       
                    if (lives === 0) {
                        gameOver();
                        targets = null;
                        run = false;
                        window.cancelAnimationFrame(requestId);
                        return { value: void 0 };
                    }
                }
                ;
            }
            ;
        };
        //Animate targets
        for (var i = 0; i < targets.length; i += 1) {
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        ;
    };
    //set timer for target creation  
    setInterval(function () {
        if (run) {
            CreateAndAnimateTarget();
        }
    }, 800);
    //Add a listner for mouse click. 
    //If the click is on a target, the target should be deleted from screen and targets array                
    var gameCanvas = document.querySelector('.gameCanvas');
    gameCanvas.addEventListener("click", function (event) {
        var mouseX = event.clientX;
        var mouseY = event.clientY;
        if (run) {
            var i = 0;
            while (i < targets.length && targets[i] !== null) {
                if (targets[i].collide(mouseX, mouseY - 100)) {
                    target_pressed += 1;
                    document.querySelector(".hits").textContent = "".concat(target_pressed);
                    //delete target from screen by drawing a circle with the background color over the target
                    drawCircle(targets[i].x, targets[i].y, targets[i].size * 1.25, BackgroundColor, targets[i].context);
                    targets[i].size = 0;
                    targets.splice(i, 1);
                    clickOnTarget = true;
                }
                ;
                i++;
            }
            ;
            if (!clickOnTarget) {
                misses += 1;
                document.querySelector(".missed").textContent = "".concat(misses);
            }
            else {
                clickOnTarget = false;
            }
            ;
        }
        ;
    });
    document.addEventListener("DOMContentLoaded", function () {
        // Clear the interval when the page is closed.
        window.addEventListener("unload", function () {
            clearInterval(displyTimeInterval);
            //clearInterval(createTargetIntervall);
        });
    });
    //stop execution with ctrl+q
    document.addEventListener("keydown", function (event) {
        // Check if the `Ctrl` key is pressed and the `keyCode` is 81.
        if (event.ctrlKey && event.key === 'q') {
            console.log('s-a apasat ctrl q');
            run = false;
        }
        ;
    });
    //restart game
    document.addEventListener("keydown", function (event) {
        // Check if the `r` key is pressed
        if (event.key === 'r') {
            ctx = GetContext();
            // Set the fill style to background color
            ctx.fillStyle = BackgroundColor;
            // Fill the canvas with the current fill style
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            document.location.reload();
        }
        ;
    });
    return;
}
