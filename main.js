const canvas = document.getElementById("dvd");
const ctx = canvas.getContext("2d");

class Logo {
	constructor() {
		this.x = 1;
		this.y = 1;
		this.width = 110;
		this.height = 75;
		this.vector = {
			moveX = 4,
			moveY = 4
		}
		this.imagePaths = [
			"images/dvd-logo-white.svg",
			"images/dvd-logo-2.svg",
			"images/dvd-logo-3.svg",
			"images/dvd-logo-4.svg"
		]
		this.imagePathIndex = 0
	}
}

let logo = new Image();

// Globals
// let bgWidth = 900;
// let bgHeight = 600;
// let logoX = 1;
// let logoY = 1;
// let logoWidth = 110;
// let logoHeight = 75;
// let logoVector = {
// 	changeX: 4,
// 	changeY: 4
// };
// let logoImageIndex = 0;

const init = () => {
	setCanvasSize();
	changeColor();

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

	updateLogo();

	// Draw the logo
	ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
	window.requestAnimationFrame(draw);
};

// Update the logo position and color
const updateLogo = () => {
	// Bounce off edges
	const atTopOrBot = logoY <= 0 || logoY + logoHeight >= bgHeight;
	const atLeftOrRight = logoX <= 0 || logoX + logoWidth >= bgWidth;

	// Update logo's direction if necessary
	if (atTopOrBot) {
		addLogo();
		logoVector.changeY *= -1;
		changeColor();
	}

	if (atLeftOrRight) {
		addLogo();
		logoVector.changeX *= -1;
		changeColor();
	}

	// Move logo along its vector
	logoX += logoVector.changeX;
	logoY += logoVector.changeY;
};

const changeColor = () => {
	if (logoImageIndex === logoImages.length - 1) {
		logoImageIndex = 0;
	} else {
		logoImageIndex++;
	}

	logo.src = logoImages[logoImageIndex];
};

const addLogo = () => {
	console.log("added logo")
}

init();
