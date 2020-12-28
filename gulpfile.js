//uncomment what you need

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

const htmlHomeFiles = [
   './src/html/head_and_styles.html',
   './src/html/home_page/*.html',
   './src/html/end_and_scripts.html',
]

gulp.task('html_main', () =>{
   return gulp.src(htmlHomeFiles)
      .pipe(concat('home_page.html'))
      .pipe(gulp.dest('./build'))
      .pipe(browserSync.stream());
});

//-------------------
//================
// const htmlAuthFiles = [
//    './src/html/head_and_styles.html',
//    './src/html/auth_and_reg/auth.html',
//    './src/html/end_and_scripts.html',
// ]

// gulp.task('html_auth', () =>{
//    return gulp.src(htmlAuthFiles)
//       .pipe(concat('auth_page.html'))
//       .pipe(gulp.dest('./build'))
//       .pipe(browserSync.stream());
// });


// const htmlRegFiles = [
//    './src/html/head_and_styles.html',
//    './src/html/auth_and_reg/reg.html',
//    './src/html/end_and_scripts.html',
// ]

// gulp.task('html_reg', () =>{
//    return gulp.src(htmlRegFiles)
//       .pipe(concat('reg_page.html'))
//       .pipe(gulp.dest('./build'))
//       .pipe(browserSync.stream());
// });


// const htmlProfileFiles = [
//    './src/html/head_and_styles.html',
//    './src/html/auth_and_reg/profile.html',
//    './src/html/end_and_scripts.html',
// ]

// gulp.task('html_profile', () =>{
//    return gulp.src(htmlProfileFiles)
//       .pipe(concat('profile_page.html'))
//       .pipe(gulp.dest('./build'))
//       .pipe(browserSync.stream());
// });
//================
//-------------------

gulp.task('beauty', () => {
    gulp.src('./build/*.html')
      .pipe(htmlbeautify({indentSize: 2}))
      .pipe(gulp.dest('./build'))
});

gulp.task('styles', () => {

   return gulp.src(styleFiles)
      .pipe(sourcemaps.init())
      //Choise stylus() , sass() или less()
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
   gulp.watch('./src/html/**/*.html', gulp.series('html_main'))
   // gulp.watch('./src/html/**/*.html', gulp.series('html_auth'))
   // gulp.watch('./src/html/**/*.html', gulp.series('html_reg'))
   // gulp.watch('./src/html/**/*.html', gulp.series('html_profile'))
   gulp.watch("./*.html").on('change', browserSync.reload)
});

// const htmlAd = [
//    'html_auth',
//    'html_reg',
//    'html_profile',
// ]

const htmlAd = []

gulp.task('default', gulp.series('del', gulp.parallel('html_main', htmlAd, 'styles', 'scripts', 'img-compress'), 'watch'));