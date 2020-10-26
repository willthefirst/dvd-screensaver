class World {
	constructor(canvasEl) {
		this.canvas = canvasEl;
		this.ctx = this.canvas.getContext("2d");
		this.logos = [];
		this.height = 600;
		this.width = 900;
		this.mousePos = { x: 0, y: 0 };
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
			logo.updatePos(this.width, this.height);
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

	addLogo = function (x, y, moveX, moveY) {
		this.logos.push(new Logo(x, y, moveX, moveY));
	}.bind(this);

	getMousePos = function (e) {
		const rect = this.canvas;
		return {
			x: e.clientX - rect.clientLeft,
			y: e.clientY - rect.clientTop
		};
	}.bind(this);

	onMouseUpdate = function (e) {
		const p = this.getMousePos(e);
		const secondLogo = this.logos[1];
		secondLogo.x = p.x;
		secondLogo.y = p.y;

		if (secondLogo.rectVsRect(this.logos[0])) {
			secondLogo.imagePathIndex = 0;
			secondLogo.setSrc();
		} else {
			secondLogo.imagePathIndex = 1;
			secondLogo.setSrc();
		}
	}.bind(this);
}

class Point {
	constructor(xCoor, yCoor) {
		(this.x = xCoor), (this.y = yCoor);
	}
}

/** Class representing a rectangle. */
class Rect {
	/**
	 * Creates a rectangle.
	 * @param  {number} xCoor
	 * @param  {number} yCoor
	 * @param  {number} width
	 * @param  {number} height
	 * @param  {number} moveX
	 * @param  {number} moveY
	 */
	constructor(xCoor, yCoor, width, height, moveX, moveY) {
		this.x = xCoor;
		this.y = yCoor;
		this.width = 110;
		this.height = 75;
		this.vector = {
			moveX: moveX,
			moveY: moveY
		};
	}

	/**
	 * Determines if a point overlaps this rectangle.
	 * @param  {x: number, y: number} p
	 * @returns {Boolean}
	 */
	pointVsRect = function (p) {
		const isInsideX = p.x >= this.x && p.x <= this.x + this.width;
		const isInsideY = p.y >= this.y && p.y <= this.y + this.height;
		return isInsideX && isInsideY;
	}.bind(this);

	
	/**
	 * Determines if a rectangle overlaps this rectangle.
	 * @param  {Rect} r
	 * @returns {Boolean}
	 */
	rectVsRect = function (r) {
		const isInsideX = this.x <= r.x + r.width && this.x + this.width >= r.x;
		const isInsideY = this.y <= r.y + r.height && this.y + this.height >= r.y;
		return isInsideX && isInsideY;
	}.bind(this);
}

/** Class representing a DVD logo.
 * @extends Rect
 */
class Logo extends Rect {
	/**
	 * @param  {number} xCoor
	 * @param  {number} yCoor
	 * @param  {number} moveX
	 * @param  {number} moveY
	 */
	constructor(xCoor, yCoor, moveX, moveY) {
		super(xCoor, yCoor, 110, 75, moveX, moveY);
		this.image = new Image();
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

	nextColor() {
		if (this.imagePathIndex === this.imagePaths.length - 1) {
			this.imagePathIndex = 0;
		} else {
			this.imagePathIndex++;
		}

		this.setSrc();
	}

	updatePos(canvasWidth, canvasHeight) {
		// Bounce off edges
		const verticalImpact = this.y <= 0 || this.y + this.height >= canvasHeight;
		const horizontalImpact = this.x <= 0 || this.x + this.width >= canvasWidth;

		// Update logo's direction if necessary
		if (verticalImpact) {
			this.vector.moveY *= -1;
			this.nextColor();
		}

		if (horizontalImpact) {
			this.vector.moveX *= -1;
			this.nextColor();
		}

		// Move logo along its vector
		this.x += this.vector.moveX;
		this.y += this.vector.moveY;
	}
}

const init = () => {
	const world = new World(document.getElementById("dvd"));
	world.setSize();

	world.addLogo(500, 250, 0, 0);
	world.addLogo(0, 0, 0, 0);

	// Temporary testing of pointVSRect
	window.addEventListener("mousemove", world.onMouseUpdate);

	window.requestAnimationFrame(world.draw);
	window.addEventListener("resize", world.setSize);

	world.canvas.addEventListener("click", world.addLogo);
};

init();

/* Utilities */
function posOrNeg(n) {
	return Math.floor(Math.random() * 2) === 0 ? n : -n;
}
