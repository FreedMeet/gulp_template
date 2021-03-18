const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
// const stylus = require('gulp-stylus');
// const sass = require('gulp-sass');
const less = require('gulp-less');
const htmlbeautify = require('gulp-html-beautify');
const imagemin = require('gulp-imagemin');

const styleFiles = [
    './src/styles/*.less',
]

const scriptFiles = [
    './src/scripts/*.js',
]

const htmlFiles = [
    './src/*.html',
]

const fonts = [
    './src/assets/fonts/**/*.{eot,svg,ttf,woff,woff2}',
]

gulp.task('html_main', () => {
    return gulp.src(htmlFiles)
        .pipe(concat('index.html'))
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
});

gulp.task('styles', () => {
    return gulp.src(styleFiles)
        .pipe(sourcemaps.init())
        //Choice stylus() , sass() или less()
        .pipe(less())
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build/styles'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', () => {
    return gulp.src(scriptFiles)
        .pipe(concat('script.js'))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(gulp.dest('./build/scripts'))
        .pipe(browserSync.stream());
});

gulp.task('img-compress', () => {
    return gulp.src('./src/assets/img/**')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('./build/assets/img/'))
});

gulp.task('beauty', () => {
    gulp.src('./build/*.html')
        .pipe(htmlbeautify({indentSize: 2}))
        .pipe(gulp.dest('./build'))
});

gulp.task('fonts', () => {
    gulp.src('./src/assets/fonts/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest('./build/assets/fonts/'));
});

gulp.task('del', () => {
    return del(['build/*'])
});

gulp.task('watch', () => {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
    gulp.watch('./src/assets/img/**', gulp.series('img-compress'))
    gulp.watch('./src/styles/**/*.{css,stylus,less,sass,scss}', gulp.series('styles'))
    gulp.watch('./src/scripts/**/*.js', gulp.series('scripts'))
    gulp.watch('./src/**/*.html', gulp.series('html_main'))
    gulp.watch("./**/*.html").on('change', browserSync.reload)
});

gulp.task('default', gulp.series('del', gulp.parallel('html_main', 'styles', 'scripts', 'img-compress'), 'watch'));