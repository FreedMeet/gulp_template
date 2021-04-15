const imagemin = require("gulp-imagemin");
const imageminOptiPng = require('imagemin-optipng');
const newer = require("gulp-newer");
const del = require("del");
const {src, dest} = require('gulp')

function img_compress() {
    return src("./src/assets/img/**/*")
        .pipe(newer("./build/assets/img/"))
        .pipe(imagemin([imageminOptiPng()]))
        .pipe(dest("./build/assets/img/"));
}

function clean_img() {
    return del("./build/assets/img/**/*", {force: true});
}

module.exports.img_compress = img_compress;
module.exports.clean_img = clean_img;
