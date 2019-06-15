/**
 * Import all required node modules
 */
var gulp = require('gulp')
var sass = require('gulp-sass')

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
 * Add watch task for Scss files
 */
gulp.task('watch', done => {
	gulp.watch('sass/*', gulp.series('compile:sass'))
	done()
})
