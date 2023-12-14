class Circle {
  private x: number;
  private y: number;
  private radius: number;
  private color: string;
  public velocityY: number;
  private gravity: number;
  private damping: number;
  private rotation: number;
  private canvas: HTMLCanvasElement;

  constructor(x: number, y: number, radius: number, color: string, canvas: HTMLCanvasElement) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocityY = 0;
    this.gravity = 0.2;
    this.damping = 0.7;
    this.rotation = 0;
    this.canvas = canvas;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.translate(-this.x, -this.y);

    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();

    context.restore();
  }

  update(deltaTime: number): void {
    this.velocityY += this.gravity * deltaTime / 1000;
    this.y += this.velocityY * deltaTime / 1000;

    if (this.y + this.radius > this.canvas.height) {
      this.y = this.canvas.height - this.radius;
      this.velocityY *= -this.damping;
    }

    this.rotation += 0.02;
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }

  getRadius(): number {
    return this.radius;
  }

  getVelocityY(): number {
    return this.velocityY;
  }

  setY(y: number): void {
    this.y = y;
  }

  setVelocityY(velocityY: number): void {
    this.velocityY = velocityY;
  }
}

class Game {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private circles: Circle[];
  private lastTime: number;
  private maxCircles: number = 15;

  constructor() {
    this.canvas = document.getElementById('gravityCanvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.circles = [];
    this.lastTime = 0;

    this.setup();
  }

  private spawnCircle(mouseX: number, mouseY: number): void {
    if (this.circles.length < this.maxCircles) {
      const newCircle = new Circle(mouseX, mouseY, 20, this.getRandomColor(), this.canvas);
      this.spawnParticles(newCircle.getX(), newCircle.getY(), 5);
      this.circles.push(newCircle);
    }
  }

  private setup(): void {
    this.gameLoop();

    this.canvas.addEventListener('click', (event) => {
      const mouseX = event.clientX - this.canvas.getBoundingClientRect().left;
      const mouseY = event.clientY - this.canvas.getBoundingClientRect().top;
      
      if (this.circles.length < this.maxCircles) {
        this.spawnCircle(mouseX, mouseY);
      }
    });
  }

  private gameLoop(): void {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    this.update(deltaTime);
    this.render();

    this.lastTime = currentTime;

    requestAnimationFrame(() => this.gameLoop());
  }

  private render(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const circle of this.circles) {
      circle.draw(this.context);
    }
  }

  private update(deltaTime: number): void {
    for (const circle of this.circles) {
      if (circle.getY() + circle.getRadius() > this.canvas.height) {
        circle.setY(this.canvas.height - circle.getRadius());
        circle.setVelocityY(circle.getVelocityY() * -circle.getDamping());
      }

      circle.update(deltaTime);
    }
  }

  private spawnParticles(x: number, y: number, count: number): void {
    const remainingSlots = this.maxCircles - this.circles.length;
    const spawnCount = Math.min(remainingSlots, count);

    for (let i = 0; i < spawnCount; i++) {
      const particle = new Circle(x, y, 5, this.getRandomColor(), this.canvas);
      particle.setVelocityY(this.getRandomNumber(-2, 5));
      this.circles.push(particle);
    }
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}

const game = new Game();
