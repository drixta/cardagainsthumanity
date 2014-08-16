var gulp = require('gulp'),
less = require('gulp-less'),
util = require('gulp-util'),
watch = require('gulp-watch'),
concat = require('gulp-concat'),
livereload = require('gulp-livereload'),
minifyCSS = require('gulp-minify-css'),
uglify = require('gulp-uglify'),
jshint = require('gulp-jshint');
rename = require('gulp-rename');
react = require('gulp-react');
open = require('gulp-open');
shell = require('gulp-shell');
exec0 = require('child_process').exec;
exec1 = require('child_process').exec;


gulp.task('less', function(){
	return gulp.src('src/less/main.less')
		.pipe(less())
		.pipe(gulp.dest('public/stylesheet'))
		.pipe(minifyCSS())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('public/stylesheet'));
});

gulp.task('jsx', function(){
	return gulp.src('src/js/*.jsx')
		.pipe(react())
		.on('error', util.log)
		.on('error', util.beep)
		.pipe(gulp.dest('src/js'))
		.pipe(gulp.dest('public/script'));
});

gulp.task('watch', function(){
	var lr = require('gulp-livereload')(),
		stream;
	gulp.watch('./src/less/*.less', ['less']);
	gulp.watch('./src/js/*.jsx', ['jsx']);
	gulp.watch('./public/**', function(file){
		lr.changed(file.path);
	});
});

gulp.task('server', function(){
	exec0('node server.js');
	exec1('open http://localhost:3000');
	return gulp.start('watch');
});

gulp.task('default', function(){
	gulp.start('less');
	gulp.start('jsx');
});