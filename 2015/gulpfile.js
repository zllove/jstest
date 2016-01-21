var gulp = require('gulp'),
	minifycss = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat');

gulp.task('css', function(){
   	gulp.src('static/css/*.css') 
   	.pipe(minifycss())
   	.pipe(concat('all.css'))
   	.pipe(gulp.dest('dist/css'))
});

gulp.task('script', function(){
    gulp.src('static/js/*/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});