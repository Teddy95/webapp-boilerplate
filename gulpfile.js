/**
 * Import all required node modules
 */
var fs = require('fs')
var gulp = require('gulp')
var sass = require('gulp-sass')
var shell = require('gulp-shell')

/**
 * Compile sass/*.scss -> assets/css/*
 */
gulp.task('compile:sass', () => {
	return gulp.src([
		'src/sass/*.scss'
	])
	.pipe(sass({
		includePaths: ['node_modules']
	}))
	.pipe(gulp.dest('assets/css'))
})

/**
 * Compile and bundle Marko files
 * *.marko + dependencies -> assets/js/bundle.min.js
 */
if (process.platform === 'win32') {
	gulp.task('compile:app', shell.task('webpack.cmd --config webpack.config.js --mode production'))
} else {
	gulp.task('compile:app', shell.task('./node_modules/.bin/webpack --config webpack.config.js --mode production'))
}

/**
 * Compile and bundle Marko files + watching for reload
 * *.marko + dependencies -> assets/js/bundle.min.js
 */
if (process.platform === 'win32') {
	gulp.task('compile:app:watch', shell.task('webpack.cmd --config webpack.config.js --mode development --watch'))
} else {
	gulp.task('compile:app:watch', shell.task('./node_modules/.bin/webpack --config webpack.config.js --mode development --watch'))
}

/**
 * Add watch task for Scss files
 */
gulp.task('watch', done => {
	gulp.watch('sass/*', gulp.series('compile:sass'))
	done()
})

/**
 * Compile Tasks
 */
gulp.task('compile', gulp.parallel('compile:sass', 'compile:app'))
gulp.task('compile:dev', gulp.parallel('compile:sass', 'compile:app:watch'))
