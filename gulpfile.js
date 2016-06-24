var gulp = require("gulp");
var del = require("del");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var ts = require("gulp-typescript");
var watchify = require("watchify");
var gutil = require("gulp-util");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var typedoc = require("gulp-typedoc");
var packageJson = require("./package.json");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var streamify = require("gulp-streamify");

var tsProject = ts.createProject("tsconfig.json");

var b = browserify({
		basedir: ".",
		debug: true,
		entries: ["src/tenogy.ts"],
		cache: {},
		packageCache: {},
		standalone: "tjs"
		}).plugin(tsify, {
			"noImplicitAny": false,
			"noEmitOnError": true,
			"removeComments": true,
			"sourceMap": true,
			"target": "es5",
			"module": "umd",
			"declaration": true,
			"experimentalDecorators": true,
			"emitDecoratorMetadata": true
		});

var watchedBrowserify = null;

function bundle(task) {
	return task.
		bundle().
		on("error", gutil.log).
		pipe(source("tenogy.js")).
		pipe(buffer()).
		pipe(sourcemaps.init({ loadMaps: true })).
		pipe(sourcemaps.write("./")).
		pipe(gulp.dest("dist"));
}

gulp.task("watch", function () {
	if (!watchedBrowserify) {
		watchedBrowserify = watchify(b);
		watchedBrowserify.on("update", function() {
			return bundle(b);
		});
		watchedBrowserify.on("log", gutil.log);
	}
	return bundle(watchedBrowserify);
});

gulp.task("min", function () {
	return b.
		bundle().
		on("error", gutil.log).
		pipe(source("tenogy.min.js")).
		pipe(buffer()).
		pipe(sourcemaps.init({ loadMaps: true })).
		pipe(uglify()).
		pipe(gulp.dest("dist"));
});

gulp.task("compile", function () {
	return bundle(b);
});

gulp.task("clean", function () {
	return del(["./dist/*"]);
});

gulp.task("dev", function () {
	var tsResult = tsProject.src().pipe(sourcemaps.init()).pipe(ts(tsProject));

	tsResult.dts.pipe(gulp.dest("./"));
	tsResult.js.pipe(sourcemaps.write("./")).pipe(gulp.dest("./"));
	return tsResult.js.pipe(uglify()).pipe(rename({ suffix: ".min" })).pipe(gulp.dest("./"));
});


gulp.task("dts", function () {
	var tsResult = tsProject.src().pipe(sourcemaps.init()).pipe(ts(tsProject));

	return tsResult.dts.pipe(rename(packageJson.typings)).pipe(gulp.dest("./"));
});


gulp.task("default", ["clean", "min", "dts", "compile"]);
