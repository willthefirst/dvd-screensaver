/**
 * Class representing a world, which keeps track of overall state.
 * @class World
 */
class World {
	/**
	 * Creates a world
	 * @param  {HTMLCanvasElement} canvasEl
	 */
	constructor(canvasEl) {
		this.canvas = canvasEl;
		this.ctx = this.canvas.getContext("2d");
		this.walls = [];
		this.logos = [];
		this.rectangles = [];
		this.height = 600;
		this.width = 900;
		this.speed = 2;
		this.mousePos = { x: 0, y: 0 };
		this.cursorRay = new Ray(0, 0, 0, 0);
		this.collisionRay = new Ray(0, 0, 0, 0);
		this.isMouseDown = false;
		this.makeItRain;
	}

	/**
	 * Dispatches multiple functions, and gets called every frame.
	 */
	nextFrame = function () {
		this.updatePositions();
		this.drawCanvas();
		window.requestAnimationFrame(this.nextFrame);
	}.bind(this);

	/**
	 *
	 * View methods, for drawing to the canvas
	 *
	 */

	/**
	 * Draws the whole world, background and logos.
	 */
	drawCanvas() {
		// Clear the canvas
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.drawBackground();

		// Draw each logo onto the canvas
		this.logos.forEach((logo) => {
			this.ctx.drawImage(logo.image, logo.x, logo.y, logo.width, logo.height);
		});

		this.rectangles.forEach((rect) => {
			this.ctx.fillStyle = rect.fillColor;
			this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
		});
	}

	drawBackground() {
		this.ctx.fillStyle = "#000";
		this.ctx.strokeStyle = "rgba(0, 153, 255, 0.4)";
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.save();
	}

	/**
	 *
	 *
	 * Model methods, for updating the World's model
	 *
	 */

	/**
	 * Sets the size of our world.
	 */
	setSize() {
		const w = window.innerWidth;
		const h = window.innerHeight;

		// Set up dimensions
		this.width = w;
		this.height = h;
		this.canvas.setAttribute("width", `${w}px`);
		this.canvas.setAttribute("height", `${h}px`);

		// Add boundaries to the four sides of the window
		const pad = 200;
		this.walls = [
			new Rect(0, -pad, w, pad), // top
			new Rect(w, 0, pad, h), // right
			new Rect(0, h, w, pad), // bottom
			new Rect(-pad, 0, pad, h) // left
		];
	}

	/**
	 * Adds a logo to the world.
	 * @param  {number} x
	 * @param  {number} y
	 * @param  {number} moveX
	 * @param  {number} moveY
	 * @param  {number} vel
	 */
	addLogo = function (x, y, moveX, moveY, vel) {
		this.logos.push(new Logo(x, y, moveX, moveY, vel));
	}.bind(this);

	addRectangle = function (x, y, w, h, moveX, moveY, vel, fillColor) {
		this.rectangles.push(new Rect(x, y, w, h, moveX, moveY, vel, fillColor));
	}.bind(this);

	/**
	 * Adds a logo to the world, at its center.
	 */
	addLogoAtCenter = function () {
		// Add logo
		const dir = getRandomVector();
		const centerX = this.width / 2 - 110 / 2;
		const centerY = this.height / 2 - 75 / 2;
		this.addLogo(centerX, centerY, dir.x, dir.y, this.speed);
	};

	/**
	 * Adds a logo to the world, at the current mouse position.
	 */
	addLogoAtMousePos = function () {
		const mouse = this.mousePos;
		const dir = getRandomVector();
		this.addLogo(mouse.x, mouse.y, dir.x, dir.y, this.speed);
	}.bind(this);

	/**
	 * Resolves collisions, then updates positions of all logos
	 */
	updatePositions() {
		// Resolve collisions between logos and walls
		this.logos = this.findAndResolveCollisions(this.logos, this.walls);
		this.rectangles = this.findAndResolveCollisions(this.rectangles, this.walls);

		// Update each logos position
		this.logos = this.logos.map((logo) => {
			logo.updatePos();
			return logo;
		});

		// Update each logos position
		this.rectangles = this.rectangles.map((rect) => {
			rect.updatePos();
			return rect;
		});
	}

	/**
	 * Returns an updated array of rectangles with collision-adjusted vectors.
	 * @param  {Rect[]} rects - The moving Rects to update
	 * @param {Rect[]} walls - The boundaries of our world
	 * @returns {Rect[]} - rects with updated vectors
	 */
	findAndResolveCollisions(rects, walls) {
		// TODO find the highest variance axis (then you can sort on that)
		//  Sort rects along the X-axis
		const sorted = sortObjectsByKey("x", rects);

		// Iterate through each object and check for collisions
		for (let i = 0; i < sorted.length; i++) {
			const rect = sorted[i];

			// Check rectangle vs. wall collisions (so things don't fly out of bounds)

			walls.forEach((wall) => {
				const test = wall.dynamicRectVsRect(rect);

				if (test.doesIntersect.x && test.doesIntersect.y && test.t < 1) {
					const rectAndWall = this.resolveCollision(rect, wall, test.cRay);
					rectAndWall[0].updateColor();
					sorted[i] = rectAndWall[0];
				}
			});

			// Check rectangle vs. rectangle collisions.

			let testNextTarget = true;
			let targetIndex = i + 1;

			while (testNextTarget && targetIndex < sorted.length) {
				const target = sorted[targetIndex];

				// Test collision
				const collisionInfo = rect.dynamicRectVsRect(target);

				// Detects whether the two rectangles intersect on the X axis
				if (collisionInfo.doesIntersect.x) {  
					if (collisionInfo.doesIntersect.y && collisionInfo.t < 1) {
						let newRects = this.resolveCollision(rect, target, collisionInfo.cRay);
						newRects[0].updateColor();
						newRects[1].updateColor();
						sorted[i] = newRects[0];
						sorted[targetIndex] = newRects[1];
					}
					targetIndex++;
				} else {
					testNextTarget = false;
				}
			}
		}
		return sorted;
	}

	/**
	 * Returns rects with updated vectors after collision
	 * @param  {Rect} rect
	 * @param  {Rect} target
	 * @param  {Object} cRay
	 * @returns {Rect[]}
	 */
	resolveCollision = function (rect, target, cRay) {
		// Left right collision
		if (cRay.dX !== 0) {
			if (rect.vector.moveX < 0 !== target.vector.moveX < 0) {
				// Opposite directions
				rect.vector.moveX *= -1;
				target.vector.moveX *= -1;
			} else {
				// Same direction
				if (Math.abs(rect.vector.moveX * rect.vel) > Math.abs(target.vector.moveX * target.vel)) {
					rect.vector.moveX *= -1;
				} else {
					target.vector.moveX *= -1;
				}
			}
		}
		// Up/down collision
		if (cRay.dY !== 0) {
			if (rect.vector.moveY < 0 !== target.vector.moveY < 0) {
				// Opposite directions
				rect.vector.moveY *= -1;
				target.vector.moveY *= -1;
				// BUT: We don't always want to switch!!!!
				// If they are already overlapping and trying to move in opposite directions, then we want to let them!
			} else {
				// Same direction
				if (Math.abs(rect.vector.moveY * rect.vel) > Math.abs(target.vector.moveY * target.vel)) {
					rect.vector.moveY *= -1;
				} else {
					target.vector.moveY *= -1;
				}
			}
		}

		return [rect, target];
	};

	/**
	 * Returns mouse position relative to canvas
	 * @param  {Event} e
	 * @returns {Point}
	 */
	getMousePos(e) {
		const rect = this.canvas;
		return new Point(e.clientX - rect.clientLeft, e.clientY - rect.clientTop);
	}

	/**
	 *
	 * Event handlers
	 *
	 */

	/**
	 * Handles window resize event.
	 * @param  {Event} e
	 */
	handleResize = function (e) {
		const v = this.speed;
		this.setSize();
		this.logos = [];
		this.addLogoAtCenter();
	}.bind(this);

	/**
	 * Handles a change to world's overall speed.
	 * @param  {Event} e
	 */
	handleSpeedChange = function (e) {
		this.speed = parseInt(e.target.value);
		this.logos = this.logos.map((logo) => {
			logo.vel = this.speed;
			return logo;
		});
	}.bind(this);

	/**
	 * Handles a mousedown event.
	 * @param  {Event} e
	 */
	handleMousedown = function (e) {
		this.isMouseDown = true;
		this.mousePos = this.getMousePos(e);
		this.addLogoAtMousePos();
		this.makeItRain = window.setInterval(this.addLogoAtMousePos, 90);
		window.addEventListener("mouseMove", this.handleMousemove);
	}.bind(this);

	/**
	 * Handles a mousemove event.
	 * @param  {Event} e
	 */
	handleMousemove = function (e) {
		if (this.isMouseDown) {
			this.mousePos = this.getMousePos(e);
		}
	}.bind(this);

	/**
	 * @param  {Event} e - Handles a mouseout event.
	 */
	handleMouseup = function (e) {
		this.isMouseDown = false;
		clearInterval(this.makeItRain);
		window.removeEventListener("mousemove", this.handleMousemove);
	}.bind(this);
}

/**
 *
 *
 * Body classes
 *
 */

/**
 * Class representing a point.
 * @class Point
 */
class Point {
	/**
	 * @param  {number} xCoor
	 * @param  {number} yCoor
	 */
	constructor(xCoor, yCoor) {
		(this.x = xCoor), (this.y = yCoor);
	}
}

/**
 * Class representing ray.
 * @class
 */
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

/**
 * Class representing rectangle.
 * @extends Point
 */
class Rect extends Point {
	/**
	 * Creates a rectangle.
	 * @param  {number} xCoor
	 * @param  {number} yCoor
	 * @param  {number} width
	 * @param  {number} height
	 * @param  {number} vel
	 * @param  {number} moveX
	 * @param  {number} moveY
	 * @param {string} fillColor
	 */
	constructor(xCoor, yCoor, width, height, moveX = 0, moveY = 0, vel = 1, fillColor = "#fff") {
		super(xCoor, yCoor);
		this.width = width;
		this.height = height;
		this.vel = vel;
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
	pointVsRect(p) {
		const isInsideX = p.x >= this.x && p.x <= this.x + this.width;
		const isInsideY = p.y >= this.y && p.y <= this.y + this.height;
		return isInsideX && isInsideY;
	}

	/**
	 * Determines if a rectangle overlaps this rectangle.
	 * @param  {Rect} r
	 * @returns {boolean}
	 */
	rectVsRect(r) {
		const isInsideX = this.x <= r.x + r.width && this.x + this.width >= r.x;
		const isInsideY = this.y <= r.y + r.height && this.y + this.height >= r.y;
		return isInsideX && isInsideY;
	}

	/**
	 * @typedef {Object} CollisionInfo
	 * @property {{x: boolean, y: boolean}} doesIntersect - True if the ray intersects
	 * @property {Ray} cRay - The coordinates (origin) and normal (direction) of the near contact point.
	 * @property {number} t - Time until contact
	 */

	/**
	 * Determines if a ray intersects this rectangle.
	 * @param  {Ray} r
	 * @returns {CollisionInfo} collisionInfo - Object containing information about possible intersection.
	 */
	rayVsRect(r) {
		let collisionInfo = {
			doesIntersect: { x: false, y: false },
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
		
		const tNearHit = Math.max(tNear.x, tNear.y);
		
		// TODO NEXT UP: the bug is here. this should be firing when the green and yellow mess up, and it doesn't
		// If the ray does not collide (at any point in time, pos or neg) with the rect
		if (tNear.x > tFar.y || tNear.y > tFar.x) {
			const closestHit = Math.min(tNear.x, tNear.y)
			// If crossing an axis (but no collision). This is important for our sort and sweep algorithm.
			if (closestHit < 1) {
				if (tNear.x < tNear.y) {
					collisionInfo.doesIntersect.x = true;
				} else {
					collisionInfo.doesIntersect.y = true;
				}
			}
			return collisionInfo;
		}

		const tFarHit = Math.min(tFar.x, tFar.y);

		if (tFarHit < 0) {
			return collisionInfo;
		}

		if (tNearHit < 0) {
			// If they're going in opposite directions and we're within reach of "escaping", don't collide.
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

		collisionInfo = {
			doesIntersect: { x: true, y: true },
			cRay: new Ray(contactPoint.x, contactPoint.y, contactNormal.x, contactNormal.y),
			t: tNearHit
		};
		return collisionInfo;
	}

	/**
	 * Determines if a moving rectangle intersects this rectangle
	 * @param  {Rect} r - The moving rectangle
	 * @returns {CollisionInfo} collisionInfo
	 */
	dynamicRectVsRect(r) {
		// this = gray rect --> gets larger rectangle
		// r = white rectangle --> we draw the ray from this
		const largerRect = new Rect(
			this.x - r.width / 2,
			this.y - r.height / 2,
			this.width + r.width,
			this.height + r.height,
			this.vector.moveX,
			this.vector.moveY,
			this.vel
		);

		const centerX = r.x + r.width / 2;
		const centerY = r.y + r.height / 2;
		const ray = new Ray(
			centerX,
			centerY,
			r.vector.moveX * r.vel - this.vector.moveX * this.vel,
			r.vector.moveY * r.vel - this.vector.moveY * this.vel
		);

		const collisionInfo = largerRect.rayVsRect(ray);
		return collisionInfo;
	}

	/**
	 * Updates this rects x and y properties.
	 */
	updatePos() {
		// Move logo along its vector
		this.x += this.vector.moveX * this.vel;
		this.y += this.vector.moveY * this.vel;
	}

	/**
	 * Updates this Rect's color.
	 */
	updateColor() {
		const colors = ["red", "green", "blue", "yellow", "pink"];
		this.fillColor = colors[Math.floor(Math.random() * colors.length)];
	}
}

/**
 * Class representing a DVD logo.
 * @extends Rect
 */
class Logo extends Rect {
	/**
	 * @param  {number} xCoor
	 * @param  {number} yCoor
	 * @param  {number} moveX
	 * @param  {number} moveY
	 */
	constructor(xCoor, yCoor, moveX, moveY, vel) {
		super(xCoor, yCoor, 110, 75, moveX, moveY, vel);
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

	/**
	 * Sets this Logo's image src (for different colored logos)
	 */
	setSrc() {
		this.image.src = this.imagePaths[this.imagePathIndex];
	}

	/**
	 * Round-robin rotation of this logos color.
	 */
	updateColor() {
		if (this.imagePathIndex === this.imagePaths.length - 1) {
			this.imagePathIndex = 0;
		} else {
			this.imagePathIndex++;
		}
		this.setSrc();
	}
}

/**
 *
 * Utilities
 *
 */

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

		if (object[key] >= pivot[key]) {
			right.push(object);
		} else {
			left.push(object);
		}
	}

	return sortObjectsByKey(key, left).concat([pivot]).concat(sortObjectsByKey(key, right));
}

/**
 * Returns a random vector (in the form of a point)
 * @returns {Point}
 */
function getRandomVector() {
	const hyp = Math.sqrt(2);
	const x = Math.random();
	const y = Math.sqrt(hyp - Math.sqrt(x, 2));
	return new Point(posOrNeg(x), posOrNeg(y));
}

/**
 *
 *
 * Initializer
 *
 */
(function () {
	// Pre-load all images
	let imagePaths = new Logo().imagePaths;
	imagePaths.forEach((path) => {
		new Image().src = path;
	});

	const world = new World(document.getElementById("dvd"));
	world.setSize();
	
	world.addLogoAtCenter();
	window.requestAnimationFrame(world.nextFrame);

	// Event listeners
	window.addEventListener("resize", world.handleResize);
	world.canvas.addEventListener("mousedown", world.handleMousedown);
	world.canvas.addEventListener("mousemove", world.handleMousemove);
	world.canvas.addEventListener("mouseup", world.handleMouseup);
	world.canvas.addEventListener("mouseout", world.handleMouseup);
	document.getElementById("dvd-screensaver-speed").addEventListener("input", world.handleSpeedChange);
})();
