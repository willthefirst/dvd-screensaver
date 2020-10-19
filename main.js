const canvas = document.getElementById("dvd");
const ctx = canvas.getContext("2d");

let logo = new Image();

// Globals
let width = 900;
let height = 600;
let logoX = 1;
let logoY = 1;
let logoWidth = 50;
let logoHeight = 30;
let logoVector = {
	changeX: 3,
	changeY: 3
};
let logoColorOptions = ["#FF228A", "#002FF4", "#FFEC0A"];
let logoCurrentColor = 0;

const init = () => {
	// Initialize logo
	logo.src = "images/dvd-logo.svg";
	window.requestAnimationFrame(draw);
};

const setCanvasSize = () => {
	const w = window.innerWidth;
	const h = window.innerHeight;

	canvas.style.width = `${w}px`;
	canvas.style.height = `${h}px`;

	width = window.innerWidth;
	height = window.innerHeight;
};

const draw = () => {
	// Clear the canvas
	ctx.clearRect(0, 0, width, height);

	setCanvasSize();

	// Draw black background
	ctx.fillStyle = "#000";
	ctx.strokeStyle = "rgba(0, 153, 255, 0.4)";
	ctx.fillRect(0, 0, width, height);
	ctx.save();

	updateLogo();

	// Draw the logo
	ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
	window.requestAnimationFrame(draw);
};

// Update the logo position and color
const updateLogo = () => {
	// Bounce off edges
	const atTopOrBot = logoY <= 0 || logoY + logoHeight >= height;
	const atLeftOrRight = logoX <= 0 || logoX + logoWidth >= width;

	// Update logo's direction if necessary
	if (atTopOrBot) {
		logoVector.changeY *= -1;
		changeColor();
	}

	if (atLeftOrRight) {
		logoVector.changeX *= -1;
		changeColor();
	}

	// Move logo along its vector
	logoX += logoVector.changeX;
	logoY += logoVector.changeY;
};

const changeColor = () => {};

init();
