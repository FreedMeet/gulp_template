const plumber = require("gulp-plumber")
const concat = require("gulp-concat")
const uglify = require("gulp-uglify")
const browserSync = require("browser-sync").create()
const {src, dest} = require('gulp')

function scripts() {
    return src("./src/scripts/**/*.js")
        .pipe(plumber())
        .pipe(concat("script.min.js"))
        .pipe(uglify({toplevel: true}))
        .pipe(dest("./build/scripts"))
        .pipe(browserSync.stream())
}

module.exports.scripts = scripts
