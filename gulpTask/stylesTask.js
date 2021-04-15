const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const stylus = require("gulp-stylus");
const sass = require("gulp-sass");
const less = require("gulp-less");
const plumber = require("gulp-plumber");
const {src, dest} = require("gulp");
const browserSync = require("browser-sync").create();

let preprocessor = "less";

function styles() {
    return src("./src/styles/**/*." + preprocessor)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(eval(preprocessor)())
        .pipe(concat("style.min.css"))
        .pipe(
            autoprefixer({overrideBrowserslist: ["last 10 versions"], grid: true})
        )
        .pipe(cleanCSS({level: {1: {specialComments: 0}}}))
        .pipe(sourcemaps.write("./"))
        .pipe(dest("./build/styles"))
        .pipe(browserSync.stream());
}

module.exports.styles = styles;
