var Circle = /** @class */ (function () {
    function Circle(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocityY = 0;
        this.gravity = 0.1;
        this.damping = 0.9;
    }
    Circle.prototype.draw = function (context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    };
    Circle.prototype.update = function () {
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.velocityY *= -this.damping;
        }
    };
    return Circle;
}());
var canvas = document.getElementById('gravityCanvas');
var context = canvas.getContext('2d');
var circles = [];
canvas.addEventListener('click', function (event) {
    var mouseX = event.clientX - canvas.getBoundingClientRect().left;
    var mouseY = event.clientY - canvas.getBoundingClientRect().top;
    var circle = new Circle(mouseX, mouseY, 20, getRandomColor());
    circles.push(circle);
});
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var _i = 0, circles_1 = circles; _i < circles_1.length; _i++) {
        var circle = circles_1[_i];
        circle.update();
        circle.draw(context);
    }
    requestAnimationFrame(animate);
}
animate();
