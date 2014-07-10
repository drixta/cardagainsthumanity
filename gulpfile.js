var gulp = require('gulp'),
less = require('gulp-less'),
concat = require('gulp-concat'),
refresh = require('gulp-livereload'),
minifyCSS = require('gulp-minify-css'),
uglify = require('gulp-uglify'),
jshint = require('gulp-jshint');
rename = require('gulp-rename');

gulp.task('styles', function(){
	gulp.src('public/stylesheet/main.less')
		.pipe(less())
		.pipe(gulp.dest('public/stylesheet'))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('public/stylesheet'));
});
gulp.task('default', function(){
	gulp.start('styles');
});