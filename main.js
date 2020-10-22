const canvas = document.getElementById("dvd");
const ctx = canvas.getContext("2d");

class Logo {
	constructor() {
		this.image = new Image();
		this.x = Math.random() * 100;
		this.y = Math.random() * 100;
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
		this.imagePathIndex = 0;
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

	update() {
		// Bounce off edges
		const atTopOrBot = this.y <= 0 || this.y + this.height >= bgHeight;
		const atLeftOrRight = this.x <= 0 || this.x + this.width >= bgWidth;

		// Update logo's direction if necessary
		if (atTopOrBot) {
			addLogo();
			this.vector.moveY *= -1;
			this.changeColor();
		}

		if (atLeftOrRight) {
			addLogo();
			this.vector.moveX *= -1;
			this.changeColor();
		}

		// Move logo along its vector
		this.x += this.vector.moveX;
		this.y += this.vector.moveY;
	}
}

// Globals
let bgWidth = 900;
let bgHeight = 600;
let logos = [new Logo()];

const init = () => {
	setCanvasSize();
	addLogo();

	window.requestAnimationFrame(draw);
	window.addEventListener("resize", setCanvasSize);
};

const setCanvasSize = () => {
	// This prevent the "offscreen" bug;
	logoX = 1;
	logoY = 1;

	const w = window.innerWidth;
	const h = window.innerHeight;

	canvas.setAttribute("width", `${w}px`);
	canvas.setAttribute("height", `${h}px`);
	bgWidth = w;
	bgHeight = h;
};

const draw = () => {
	// Clear the canvas
	ctx.clearRect(0, 0, bgWidth, bgHeight);

	// Draw black background
	ctx.fillStyle = "#000";
	ctx.strokeStyle = "rgba(0, 153, 255, 0.4)";
	ctx.fillRect(0, 0, bgWidth, bgHeight);
	ctx.save();

	// Draw the logos
	logos.forEach((logo) => {
		logo.update();
		ctx.drawImage(logo.image, logo.x, logo.y, logo.width, logo.height);
	});

	window.requestAnimationFrame(draw);
};

const addLogo = () => {
	return new Logo();
};

init();
