var gulp = require('gulp'),
less = require('gulp-less'),
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
	return gulp.src('public/stylesheet/main.less')
		.pipe(less())
		.pipe(gulp.dest('public/stylesheet'))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('public/stylesheet'));
});

gulp.task('jsx', function(){
	gulp.src('public/script/*.jsx')
		.pipe(react())
		.pipe(gulp.dest('public/script/js'));
});

gulp.task('watch-less', function(){
	gulp.src('public/stylesheet/*.less')
		.pipe(watch(function(files){
			return files
				.pipe(less())
				.pipe(gulp.dest('public/stylesheet'))
				.pipe(rename({suffix: '.min'}))
				.pipe(gulp.dest('public/stylesheet'));
		}));
})

gulp.task('watch-jsx', function(){
	gulp.src('public/script/*.jsx')
	.pipe(watch(function(files){
		return files
			.pipe(react())
			.pipe(gulp.dest('public/script/js'));
	}));
});

gulp.task('watch', function(){
	return gulp.start('watch-less'), gulp.start('watch-jsx');
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