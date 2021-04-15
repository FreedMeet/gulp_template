const plumber = require("gulp-plumber");
const pug = require("gulp-pug");
const {src, dest} = require('gulp')
const browserSync = require("browser-sync").create();
const html_beautify = require("gulp-html-beautify");

function pugToHtml() {
    return src("./src/pages/*.pug")
        .pipe(plumber())
        .pipe(pug())
        .pipe(dest("build"))
        .pipe(browserSync.stream());
}

function beautyHtml() {
    return src("./build/*.html")
        .pipe(html_beautify({indentSize: 2}))
        .pipe(dest("./build"));
}

module.exports.pugToHtml = pugToHtml
module.exports.beautyHtml = beautyHtml
