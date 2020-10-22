class World {
	constructor(canvasEl) {
		this.canvas = canvasEl;
		this.ctx = this.canvas.getContext("2d");
		this.logos = [];
		this.height = 600;
		this.width = 900;
	}

	draw = function () {
		// Clear the canvas
		this.ctx.clearRect(0, 0, this.width, this.height);

		// Draw black background
		this.ctx.fillStyle = "#000";
		this.ctx.strokeStyle = "rgba(0, 153, 255, 0.4)";
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.save();

		// Draw the logos
		this.logos.forEach((logo) => {
			logo.update(this.width, this.height);
			this.ctx.drawImage(logo.image, logo.x, logo.y, logo.width, logo.height);
		});

		window.requestAnimationFrame(this.draw);
	}.bind(this);

	setSize = function () {
		// This prevent the "offscreen" bug;
		this.logos.forEach((logo) => {
			logo.x = 1;
			logo.y = 1;
		});

		const w = window.innerWidth;
		const h = window.innerHeight;

		this.canvas.setAttribute("width", `${w}px`);
		this.canvas.setAttribute("height", `${h}px`);

		this.width = w;
		this.height = h;
	}.bind(this);

	addLogo = function () {
		this.logos.push(new Logo());
	}.bind(this);
}

class Logo {
	constructor() {
		this.image = new Image();
		this.x = 1;
		this.y = 1;
		this.width = 110;
		this.height = 75;
		this.vector = {
			moveX: 4,
			moveY: 4
		};
		this.imagePaths = [
			"images/dvd-logo-white.svg",
			"images/dvd-logo-pink.svg",
			"images/dvd-logo-yellow.svg",
			"images/dvd-logo-blue.svg"
		];
		this.imagePathIndex = Math.floor(Math.random() * this.imagePaths.length);
		this.setSrc();
	}

	setSrc() {
		this.image.src = this.imagePaths[this.imagePathIndex];
	}

	changeColor() {
		if (this.imagePathIndex === this.imagePaths.length - 1) {
			this.imagePathIndex = 0;
		} else {
			this.imagePathIndex++;
		}

		this.setSrc();
	}

	update(canvasWidth, canvasHeight) {
		// Bounce off edges
		const atTopOrBot = this.y <= 0 || this.y + this.height >= canvasHeight;
		const atLeftOrRight = this.x <= 0 || this.x + this.width >= canvasWidth;

		// Update logo's direction if necessary
		if (atTopOrBot) {
			this.vector.moveY *= -1;
			this.changeColor();
		}

		if (atLeftOrRight) {
			this.vector.moveX *= -1;
			this.changeColor();
		}

		// Move logo along its vector
		this.x += this.vector.moveX;
		this.y += this.vector.moveY;
	}
}

const init = () => {
	const world = new World(document.getElementById("dvd"));
	world.setSize();
	world.addLogo();

	window.requestAnimationFrame(world.draw);
	window.addEventListener("resize", world.setSize);

	world.canvas.addEventListener("click", world.addLogo);
};

init();
