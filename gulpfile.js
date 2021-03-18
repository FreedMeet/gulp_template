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
   './src/js/*.js',
]

gulp.task('beauty', () => {
    gulp.src('./build/*.html')
      .pipe(htmlbeautify({indentSize: 2}))
      .pipe(gulp.dest('./build'))
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
      .pipe(gulp.dest('./build/css'))
      .pipe(browserSync.stream());
});

gulp.task('scripts', () => {

   return gulp.src(scriptFiles)
      .pipe(concat('script.js'))
      .pipe(uglify({
         toplevel: true
      }))
      .pipe(gulp.dest('./build/js'))
      .pipe(browserSync.stream());
});

gulp.task('del', () => {
   return del(['build/*'])
});

gulp.task('img-compress', () => {
   return gulp.src('./src/img/**')
   .pipe(imagemin({
      progressive: true
   }))
   .pipe(gulp.dest('./build/img/'))
});

gulp.task('watch', () => {
   browserSync.init({
      server: {
         baseDir: "./build"
      }
   });
   gulp.watch('./src/img/**', gulp.series('img-compress'))
   gulp.watch('./src/styles/**/*.less', gulp.series('styles'))
   gulp.watch('./src/js/**/*.js', gulp.series('scripts'))
   gulp.watch("./*.html").on('change', browserSync.reload)
});

gulp.task('default', gulp.series('del', gulp.parallel('styles', 'scripts', 'img-compress'), 'watch'));