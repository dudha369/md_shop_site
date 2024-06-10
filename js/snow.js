let canvas = document.querySelector('.snow');
let ctx = canvas.getContext('2d');

let pixelRatio = window.devicePixelRatio || 1;

let snowflakes = [];

class Snowflake {
	letructor() {
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height;
		
		let maxSize = 3;
		this.size = Math.random() * (maxSize - 1) + 1;
		this.velocity = this.size * 0.35;
		let opacity = this.size / maxSize;
		this.fill = `rgb(255 255 255 / ${opacity})`;
		
		this.windSpeed = (Math.random() - 0.5) * 0.1;
		this.windAngle = Math.random() * Math.PI * 2;
	}
	isOutsideCanvas() {
		return this.y > canvas.height + this.size;
	}
	reset() {
		this.x = Math.random() * canvas.width;
		this.y = -this.size;
	}
	update() {
		this.windAngle += this.windSpeed;
		this.wind = Math.cos(this.windAngle) * 0.5;
		
		this.x += this.wind;
		this.y += this.velocity;
		
		if (this.isOutsideCanvas()) {
			this.reset();
		}
	}
	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fillStyle = this.fill;
		ctx.fill();
		ctx.closePath();
	}
}

let createSnowflakes = () => {
	snowflakeCount = Math.floor(window.innerWidth * window.innerHeight / 1400);
	
	for (let i = 0; i < snowflakeCount; i++) {
		snowflakes.push(new Snowflake());
	}
}

let resizeCanvas = () => {
	let width = window.innerWidth;
	let height = window.innerHeight;
	canvas.width = width * pixelRatio;
	canvas.height = height * pixelRatio;
	canvas.style.width = `${width}px`;
	canvas.style.height = `${height}px`;
	ctx.scale(pixelRatio, pixelRatio);
	snowflakes.length = 0;
	createSnowflakes();
};

window.addEventListener('resize', resizeCanvas);

resizeCanvas();

let render = () => {
	requestAnimationFrame(render);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	snowflakes.forEach(snowflake => {
		snowflake.update();
		snowflake.draw();
	});
};

render();
