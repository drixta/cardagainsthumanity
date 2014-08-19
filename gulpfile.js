var gulp = require('gulp'),
less = require('gulp-less'),
util = require('gulp-util'),
watch = require('gulp-watch'),
concat = require('gulp-concat'),
livereload = require('gulp-livereload'),
browserSync = require('browser-sync'),
reload = browserSync.reload,
minifyCSS = require('gulp-minify-css'),
uglify = require('gulp-uglify'),
jshint = require('gulp-jshint');
rename = require('gulp-rename');
react = require('gulp-react');
plumber = require('gulp-plumber');
open = require('gulp-open');
exec0 = require('child_process').exec;
exec1 = require('child_process').exec;

var onError = function (err){
	util.beep();
	console.log(err);
};

gulp.task('browser-sync', function(){
	browserSync({
	});
});

gulp.task('less', function(){
	return gulp.src('src/less/main.less')
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(less())
		.pipe(gulp.dest('public/stylesheet'))
		.pipe(minifyCSS())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('public/stylesheet'))
		.pipe(reload({stream:true}));
});

gulp.task('jsx', function(){
	return gulp.src('src/js/*.jsx')
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(react())
		.on('error', util.log)
		.on('error', util.beep)
		.pipe(gulp.dest('src/js'))
		.pipe(gulp.dest('public/script'))
		.pipe(reload({stream:true}));
});

gulp.task('watch', function(){
	gulp.start('browser-sync');
	gulp.watch('./src/less/*.less', ['less']);
	gulp.watch('./src/js/*.jsx', ['jsx', browserSync.reload]);
	gulp.watch('./public/**');
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