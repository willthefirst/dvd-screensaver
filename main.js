const canvas = document.getElementById("dvd");
const ctx = canvas.getContext("2d");

let logo = new Image();

// Globals
let bgWidth = 900;
let bgHeight = 600;
let logoX = 1;
let logoY = 1;
let logoWidth = 110;
let logoHeight = 75;
let logoVector = {
	changeX: 10,
	changeY: 10
};
let logoColorOptions = ["#FF228A", "#002FF4", "#FFEC0A"];
let logoCurrentColor = 0;

const init = () => {
	logo.src = "dvd-logo.svg";
	setCanvasSize();

	window.requestAnimationFrame(draw);
	window.addEventListener("resize", setCanvasSize);
};

const setCanvasSize = () => {

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

const changeColor = () => {

};

init();
