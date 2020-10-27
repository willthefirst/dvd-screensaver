class World {
	constructor(canvasEl) {
		this.canvas = canvasEl;
		this.ctx = this.canvas.getContext("2d");
		this.logos = [];
		this.height = 600;
		this.width = 900;
		this.mousePos = { x: 0, y: 0 };
		this.cursorRay = new Ray(0, 0, 0, 0)
		this.rects = [
			{
				color: "#fff",
				dims: new Rect(500, 200, 100, 100, 0, 0)
			}
		];
		this.collisionRay = new Ray(0, 0, 0, 0);
	}

	draw = function () {
		// Clear the canvas
		this.ctx.clearRect(0, 0, this.width, this.height);

		// Draw black background
		this.ctx.fillStyle = "#000";
		this.ctx.strokeStyle = "rgba(0, 153, 255, 0.4)";
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.save();

		// // Draw the logos
		// this.logos.forEach((logo) => {
		// 	logo.updatePos(this.width, this.height);
		// 	this.ctx.drawImage(logo.image, logo.x, logo.y, logo.width, logo.height);
		// });

		this.rects.forEach((rect) => {
			this.ctx.fillStyle = rect.color;
			this.ctx.fillRect(rect.dims.x, rect.dims.y, rect.dims.width, rect.dims.height);
		});

		// Draw a collision ray
		this.ctx.strokeStyle = "yellow";
		this.ctx.beginPath();
		this.ctx.moveTo(this.collisionRay.x, this.collisionRay.y);
		this.ctx.lineTo(
			this.collisionRay.x + this.collisionRay.dX * 100,
			this.collisionRay.y + this.collisionRay.dY * 100
		);
		this.ctx.lineWidth = 5;
		this.ctx.stroke();

		// Temp: draw our cursorRay
		this.ctx.strokeStyle = "white";
		this.ctx.beginPath();
		this.ctx.moveTo(this.cursorRay.x, this.cursorRay.y);
		this.ctx.lineTo(this.cursorRay.x + this.cursorRay.dX, this.cursorRay.y + this.cursorRay.dY);
		this.ctx.lineWidth = 5;
		this.ctx.stroke();

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
		const ray = new Ray(0, 0, p.x - 0, p.y - 0);

		this.cursorRay = ray;

		const collisionResult = this.rects[0].dims.rayVsRect(ray);
		if (collisionResult.doesIntersect && collisionResult.t < 1) {
			this.rects[0].color = "red";
			this.collisionRay = collisionResult.cRay;
		} else {
			this.rects[0].color = "white";
			this.collisionRay = new Ray(0, 0, 0, 0);
		}
	}.bind(this);
}

/** Class representing a point. */
class Point {
	/**
	 * @param  {number} xCoor
	 * @param  {number} yCoor
	 */
	constructor(xCoor, yCoor) {
		(this.x = xCoor), (this.y = yCoor);
	}
}

/** Class representing a vector. */
class Ray extends Point {
	/**
	 * Creates a vector.
	 * @param  {number} oX - Origin x
	 * @param  {number} oY - Origin y
	 * @param  {number} dX - Direction x
	 * @param  {number} dY - Direction y
	 */
	constructor(oX, oY, dX, dY) {
		super(oX, oY);
		this.dX = dX;
		this.dY = dY;
	}
}

/** Class representing a rectangle. */
class Rect extends Point {
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
		super(xCoor, yCoor);
		this.width = 110;
		this.height = 75;
		this.vector = {
			moveX: moveX,
			moveY: moveY
		};
	}

	/**
	 * Determines if a point overlaps this rectangle.
	 * @param  {Point} p
	 * @returns {boolean}
	 */
	pointVsRect = function (p) {
		const isInsideX = p.x >= this.x && p.x <= this.x + this.width;
		const isInsideY = p.y >= this.y && p.y <= this.y + this.height;
		return isInsideX && isInsideY;
	}.bind(this);

	/**
	 * Determines if a rectangle overlaps this rectangle.
	 * @param  {Rect} r
	 * @returns {boolean}
	 */
	rectVsRect = function (r) {
		const isInsideX = this.x <= r.x + r.width && this.x + this.width >= r.x;
		const isInsideY = this.y <= r.y + r.height && this.y + this.height >= r.y;
		return isInsideX && isInsideY;
	}.bind(this);

	/**
	 * @typedef {Object} CollisionInfo
	 * @property {boolean} doesIntersect - True if the ray intersects
	 * @property {Ray} cRay - The coordinates (origin) and normal (direction) of the near contact point.
	 * @property {number} t - Time until contact
	 */

	/**
	 * Determines if a ray intersects this rectangle.
	 * @param  {Ray} r
	 * @returns {CollisionInfo} collisionInfo - Object containing information about possible intersection.
	 */
	rayVsRect = function (r) {
		let collisionInfo = {
			doesIntersect: false,
			cRay: null,
			t: null
		};

		let tNear = {
			x: (this.x - r.x) / r.dX,
			y: (this.y - r.y) / r.dY
		};
		let tFar = {
			x: (this.x + this.width - r.x) / r.dX,
			y: (this.y + this.height - r.y) / r.dY
		};

		// Sort tNear and tFar
		if (tNear.x > tFar.x) {
			const tNearX_ = tNear.x;
			tNear.x = tFar.x;
			tFar.x = tNearX_;
		} 
		
		if (tNear.y > tFar.y) {
			const tNearY_ = tNear.y;
			tNear.y = tFar.y;
			tFar.y = tNearY_;
		}

		// If no intersection, return false
		if (tNear.x > tFar.y || tNear.y > tFar.x) {
			return collisionInfo;
		}

		const tNearHit = Math.max(tNear.x, tNear.y);
		const tFarHit = Math.min(tFar.x, tFar.y);

		if (tFarHit < 0) {
			return collisionInfo;
		}

		const contactPoint = new Point(r.x + tNearHit * r.dX, r.y + tNearHit * r.dY);

		let contactNormal;

		if (tNear.x > tNear.y) {
			if (r.dX < 0) {
				contactNormal = { x: 1, y: 0 };
			} else {
				contactNormal = { x: -1, y: 0 };
			}
		} else {
			if (r.dY < 0) {
				contactNormal = { x: 0, y: 1 };
			} else {
				contactNormal = { x: 0, y: -1 };
			}
		}

		collisionInfo.doesIntersect = true;
		collisionInfo.tNearHit = tNearHit;
		collisionInfo = {
			doesIntersect: true,
			cRay: new Ray(contactPoint.x, contactPoint.y, contactNormal.x, contactNormal.y),
			t: tNearHit
		};
		return collisionInfo;
	};
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

	// Temporary testing of rayVsRect
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
