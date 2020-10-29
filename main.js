class World {
	constructor(canvasEl) {
		this.canvas = canvasEl;
		this.ctx = this.canvas.getContext("2d");
		this.rects = [];
		this.logos = [];
		this.height = 600;
		this.width = 900;
		this.mousePos = { x: 0, y: 0 };
		this.cursorRay = new Ray(0, 0, 0, 0);
		this.collisionRay = new Ray(0, 0, 0, 0);
	}

	draw = function () {
		// Clear the canvas
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.drawBackground();

		// // Draw the logos
		// this.logos.forEach((logo) => {
		// 	logo.updatePos(this.width, this.height);
		// 	this.ctx.drawImage(logo.image, logo.x, logo.y, logo.width, logo.height);
		// });

		// Update all rectangle positions
		this.rects = this.findAndResolveCollisions(this.rects);

		// Draw each rectangle onto the canvas
		this.rects.forEach((rect) => {
			rect.updatePos(this.width, this.height);
			this.ctx.fillStyle = rect.fillColor;
			this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
		});

		// const staticRect = this.rects[0];

		// this.ctx.fillStyle = staticRect.fillColor;
		// staticRect.updatePos(this.width, this.height);
		// this.ctx.fillRect(staticRect.x, staticRect.y, staticRect.width, staticRect.height);

		// const movingRect = this.rects[1];

		// const collisionInfo = staticRect.dynamicRectVsRect(movingRect);

		// if (collisionInfo.doesIntersect && collisionInfo.t < 1) {
		// 	// If moving in a non-zero direction, switch directions.
		// 	if (collisionInfo.cRay.dX !== 0) {
		// 		movingRect.vector.moveX *= -1;
		// 	}
		// 	if (collisionInfo.cRay.dY !== 0) {
		// 		movingRect.vector.moveY *= -collisionInfo.cRay.dY;
		// 	}
		// }
		// this.ctx.fillStyle = movingRect.fillColor;
		// movingRect.updatePos(this.width, this.height);
		// this.ctx.fillRect(movingRect.x, movingRect.y, movingRect.width, movingRect.height);

		window.requestAnimationFrame(this.draw);
	}.bind(this);

	drawBackground = function () {
		this.ctx.fillStyle = "#000";
		this.ctx.strokeStyle = "rgba(0, 153, 255, 0.4)";
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.save();
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

	addRect = function (x, y, moveX, moveY, color) {
		this.rects.push(new Rect(x, y, 100, 100, moveX, moveY, color));
	}.bind(this);

	addLogo = function (x, y, moveX, moveY) {
		this.logos.push(new Logo(x, y, moveX, moveY));
	}.bind(this);

	/**
	 * Updates positions of all ells by checking for collisions and updating vectors accordingly.
	 * @param  {Object[]} els
	 * @return {Object[]}
	 */
	updatePositions = function (els) {
		return findAndResolveCollisions(els);
	};

	/**
	 * Returns any rects that are colliding
	 * @param  {Rect[]} rects
	 * @returns {Rect[]} - rects with updated vectors and positions
	 */
	findAndResolveCollisions = function (rects) {
		// if (rects.length <= 1) {
		// 	return rects;
		// }

		let rects_ = [];

		// TODO find the highest variance axis (then you can sort on that)
		const sorted = sortObjectsByKey("x", rects);

		for (let i = 0; i < sorted.length - 1; i++) {
			let testNextTarget = true;
			let targetIndex = i + 1;

			while (testNextTarget && targetIndex < sorted.length) {
				const rect = sorted[i];
				const target = sorted[targetIndex];

				if (target.x - Math.abs(2 * target.vector.moveX) <= rect.x + rect.width) {
					const collisionInfo = rect.dynamicRectVsRect(target);
					if (collisionInfo.doesIntersect && collisionInfo.t < 1) {
						let newRects = this.resolveCollision(rect, target, collisionInfo.cRay);
						sorted[i] = newRects[0];
						sorted[targetIndex] = newRects[1];
						testNextTarget = false;
					}
					targetIndex++;
				} else {
					testNextTarget = false;
				}
			}
		}
		return sorted;
	}.bind(this);

	// returns [rect1, rect2]
	resolveCollision = function (rect1, rect2, cRay) {
		// If moving in a non-zero direction, switch directions.
		if (cRay.dX !== 0) {
			rect1.vector.moveX *= -1;
			rect2.vector.moveX *= -1;
		}
		if (cRay.dY !== 0) {
			rect1.vector.moveY *= -1;
			rect2.vector.moveY *= -1;
		}

		return [rect1, rect2];
	};

	getMousePos = function (e) {
		const rect = this.canvas;
		return {
			x: e.clientX - rect.clientLeft,
			y: e.clientY - rect.clientTop
		};
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

/** Class representing a ray. */
class Ray extends Point {
	/**
	 * Creates a ray.
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
	 * @param {string} fillColor
	 */
	constructor(xCoor, yCoor, width, height, moveX = 0, moveY = 0, fillColor = "#fff") {
		super(xCoor, yCoor);
		this.width = width;
		this.height = height;
		this.vector = {
			moveX: moveX,
			moveY: moveY
		};
		this.fillColor = fillColor;
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

	/**
	 * Determines if a moving rectangle intersects this rectangle
	 * @param  {Rect} r - The moving rectangle
	 * @returns {CollisionInfo} collisionInfo
	 */
	dynamicRectVsRect = function (r) {
		const largerRect = new Rect(
			this.x - r.width / 2,
			this.y - r.height / 2,
			this.width + r.width,
			this.height + r.height
		);

		const centerX = r.x + r.width / 2;
		const centerY = r.y + r.height / 2;
		const ray = new Ray(centerX, centerY, r.vector.moveX, r.vector.moveY);

		const collisionInfo = largerRect.rayVsRect(ray);
		return collisionInfo;
	}.bind(this);

	updatePos(canvasWidth, canvasHeight) {
		// Check for collision with walls.

		// Bounce off edges
		const verticalImpact = this.y <= 0 || this.y + this.height >= canvasHeight;
		const horizontalImpact = this.x <= 0 || this.x + this.width >= canvasWidth;

		if (verticalImpact) {
			this.vector.moveY *= -1;
		}

		if (horizontalImpact) {
			this.vector.moveX *= -1;
		}

		// Move logo along its vector
		this.x += this.vector.moveX;
		this.y += this.vector.moveY;
	}
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
}

const init = () => {
	const world = new World(document.getElementById("dvd"));
	world.setSize();

	// Add rectangles
	world.addRect(10, 10, 1, 0, "#666");
	world.addRect(150, 10, 1, 0, "#666");
	world.addRect(300, 10, 1, 0, "#666");
	// world.addRect(, 10, 1, 0, "#666");
	// world.addRect(50, 10, 1, 0, "#666");


	// world.addRect(250, 10, 0, 0, "#999");
	// world.addRect(375, 60, 0, 0, "#aaa");
	// world.addRect(400, 40, 0, 0, "#bbb");
	// world.addRect(600, 1, 0, 0, "#ccc");
	// world.addRect(900, 1, 0, 0, "#ddd");

	window.requestAnimationFrame(world.draw);

	world.findAndResolveCollisions(world.rects);
	// window.addEventListener("resize", world.setSize);
	// world.canvas.addEventListener("click", world.addLogo);
};

init();

/* Utilities */

/**
 * Makes a number positive or negative, randomly.
 * @param  {number} n
 * @returns {number}
 */
function posOrNeg(n) {
	return Math.floor(Math.random() * 2) === 0 ? n : -n;
}

/**
 * Returns an array of objects sorted by a key from lowest to highest.
 * @param  {string} key - key to sort on
 * @param  {Object.<string, number>[]} objects - array of objects
 * @returns {Object.<string, number>[]}
 */
function sortObjectsByKey(key, objects) {
	// Base case
	if (objects.length <= 1) {
		return objects;
	}

	// Pivot will be the last element in the array
	const pivot = objects[0];
	let left = [],
		right = [];

	// Check all elements after the pivot.
	for (let i = 1; i < objects.length; i++) {
		const object = objects[i];

		if (object[key] > pivot[key]) {
			right.push(object);
		} else {
			left.push(object);
		}
	}

	return sortObjectsByKey(key, left).concat([pivot]).concat(sortObjectsByKey(key, right));
}
