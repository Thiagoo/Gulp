'use strict';

let gulp = require('gulp');
let sass = require('gulp-sass');
let less = require('gulp-less');
let watch = require('gulp-watch');
let concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
let uglify = require('gulp-uglify');
let pipeline = require('readable-stream').pipeline;
const htmlmin = require('gulp-htmlmin');
let imageop = require('gulp-image-optimization');

sass.compiler = require('node-sass');

//task for sass
gulp.task(
  'sass',
  gulp.series(function () {
    console.log('Getting the sccs and transforming in a css');
    return gulp
      .src(['assets/*.scss'])
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('style.css'))
      .pipe(gulp.dest('build'));
  })
);

//task for concat
gulp.task('concat', function () {
  console.log('Concating and moving all the scss files in styles folder');
  return gulp
    .src('scss/*.scss')
    .pipe(concat('concatStyles.css'))
    .pipe(gulp.dest('css'));
});

//task for minify css
gulp.task('minify-css', () => {
  return gulp
    .src('build/*.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('build'));
});

//task for minify js
gulp.task('minify-js', function () {
  return pipeline(gulp.src('js/*.js'), uglify(), gulp.dest('js'));
});

//task for html
gulp.task('minify', () => {
  return gulp
    .src('html/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('html'));
});

//task for compress image
gulp.task('images', function (cb) {
  gulp
    .src(['src/**/*.png', 'src/**/*.jpg', 'src/**/*.gif', 'src/**/*.jpeg'])
    .pipe(
      imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true,
      })
    )
    .pipe(gulp.dest('public/images'))
    .on('end', cb)
    .on('error', cb);
});

//task for watch
console.log('Watching the changes in the scss styles');
gulp.task(
  'watch',
  gulp.series(function () {
    gulp.watch(['scss/*.scss'], gulp.parallel(['sass']));
  })
);

gulp.task('default', gulp.series(['sass', 'minify-css', 'watch']));

//task for less
gulp.task('compile-less', function () {
  return gulp
    .src(['*.less', 'assets/*.less'])
    .pipe(
      less().on('error', function (err) {
        console.log(err);
      })
    )
    .pipe(concat('style.css'))
    .pipe(gulp.dest('build'));
});

//task for monitoring
gulp.task('monitoring', function () {
  gulp.watch(['*.less', 'assets/*.less'], gulp.series('compile-less'));
});

gulp.task('default', gulp.series('monitoring'));
