let preprocessor = "less";

const { src, dest, series, parallel, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const del = require("del");
const sourcemaps = require("gulp-sourcemaps");
const stylus = require("gulp-stylus");
const sass = require("gulp-sass");
const less = require("gulp-less");
const htmlbeautify = require("gulp-html-beautify");
const imagemin = require("gulp-imagemin");
const plumber = require("gulp-plumber");
const pug = require("gulp-pug");
const newer = require('gulp-newer')

function browsersync() {
  browserSync.init({
    server: { baseDir: "./build" },
    notify: false,
    online: true,
  });
}

function scripts() {
  return src("./src/scripts/**/*.js")
    .pipe(plumber())
    .pipe(concat("script.min.js"))
    .pipe(uglify({ toplevel: true }))
    .pipe(dest("./build/scripts"))
    .pipe(browserSync.stream());
}

function styles() {
  return src("./src/styles/**/*." + preprocessor)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(eval(preprocessor)())
    .pipe(concat("style.min.css"))
    .pipe(
      autoprefixer({ overrideBrowserslist: ["last 10 versions"], grid: true })
    )
    .pipe(cleanCSS({ level: { 1: { specialComments: 0 } } }))
    .pipe(sourcemaps.write("./"))
    .pipe(dest("./build/styles"))
    .pipe(browserSync.stream());
}

function pugToHtml() {
  return src("./src/pages/*.pug")
    .pipe(plumber())
    .pipe(pug())
    .pipe(dest("build"))
    .pipe(browserSync.stream());
}

function img_compress() {
  return src("./src/assets/img/**/*")
    .pipe(newer("./build/assets/img/"))
    .pipe(imagemin())
    .pipe(dest("./build/assets/img/"));
}

function clean_img() {
  return del("./build/assets/img/**/*", { force: true });
}

function clean_build() {
    return del("./build", { force: true });
  }

function fonts() {
  return src("./src/assets/fonts/**/*.{eot,svg,ttf,woff,woff2}").pipe(
    dest("./build/assets/fonts/")
  );
}

function beauty() {
  return src("./build/*.html")
    .pipe(htmlbeautify({ indentSize: 2 }))
    .pipe(dest("./build"));
}

function startwatch() {
    watch("./src/scripts/**/.js", scripts);
    watch("./src/styles/**/*." + preprocessor, styles);
    watch("./src/pages/**/*.pug", pugToHtml);
    watch("./src/assets/img/**/*", img_compress);
    watch("./src/assets/fonts/**/*.{eot,svg,ttf,woff,woff2}", fonts)
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.pugToHtml = pugToHtml;
exports.img_compress = img_compress;
exports.clean_img = clean_img;
exports.clean_build = clean_build
exports.fonts = fonts;
exports.beauty = beauty;

exports.build = series(clean_build, pugToHtml, img_compress, styles, scripts, fonts);

exports.default = parallel(styles, scripts, pugToHtml, browsersync, startwatch);