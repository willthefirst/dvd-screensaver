var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var watchify = require("watchify");
var tsify = require("tsify");
var fancy_log = require("fancy-log");
var browserSync = require("browser-sync");

var paths = {
	pages: ["src/*.html"],
	assets: ["src/assets/**/*.*"]
};

var watchedBrowserify = watchify(
	browserify({
		basedir: ".",
		debug: true,
		entries: ["src/main.ts"],
		cache: {},
		packageCache: {}
	}).plugin(tsify)
);

gulp.task("copy-html", function () {
	return gulp.src(paths.pages).pipe(gulp.dest("dist"));
});

gulp.task("copy-assets", function () {
	return gulp.src(paths.assets).pipe(gulp.dest("dist"));
});

function bundle() {
	return watchedBrowserify
		.bundle()
		.on("error", fancy_log)
		.pipe(source("bundle.js"))
		.pipe(gulp.dest("dist"));
}

const server = browserSync.create();

function reload(done) {
	server.reload();
	done();
}

function serve(done) {
	server.init({
		server: {
			baseDir: "./dist/"
		},
		browser: "google chrome"
	});
	done();
}

const watch = () => gulp.watch("./dist", reload);

gulp.task("default", gulp.series(gulp.parallel(["copy-html", "copy-assets"]), bundle, serve, watch));
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", fancy_log);
