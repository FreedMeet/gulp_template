const {src, dest} = require('gulp')
function fonts() {
    return src("src/assets/fonts/**/*.{eot,svg,ttf,woff,woff2}").pipe(
        dest("build/assets/fonts/")
    )
}

module.exports.fonts = fonts
