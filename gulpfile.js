const {series, parallel, watch} = require('gulp')
const {styles} = require('./gulpTask/stylesTask')
const {scripts} = require('./gulpTask/scriptsTask')
const {pugToHtml, beautyHtml} = require('./gulpTask/markupTask')
const {img_compress} = require('./gulpTask/imageTask')
const {fonts} = require('./gulpTask/fontsTask')

const browserSync = require("browser-sync").create()
const del = require("del")

let preprocessor = "less"

function browser_sync() {
    browserSync.init({
        server: {baseDir: "build"},
        notify: false,
        online: true
    })
}

function clean_build() {
    return del("build", {force: true})
}

function start_watch() {
    watch("src/scripts/**/*.js", scripts)
    watch("src/styles/**/*." + preprocessor, styles)
    watch("src/pages/**/*.pug", pugToHtml)
    watch("src/assets/img/**/*", img_compress)
    watch("src/assets/fonts/**/*.{eot,svg,ttf,woff,woff2}", fonts)
}

exports.clean_build = clean_build

exports.build = series(
    clean_build,
    pugToHtml,
    img_compress,
    styles,
    scripts,
    fonts,
    beautyHtml
)

exports.default = series(
    clean_build,
    parallel(
        styles,
        scripts,
        pugToHtml,
        fonts,
        img_compress,
        browser_sync,
        start_watch
    )
)
