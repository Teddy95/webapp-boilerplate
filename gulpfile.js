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

/**
 * Package App to /release
 */
if (process.platform === 'win32') {
	var packageInfo = JSON.parse(fs.readFileSync('./package.json'))
	gulp.task('package:mac', shell.task('electron-packager . --overwrite --platform=darwin --arch=x64 --icon=' + packageInfo.build.icon.mac + ' --prune=true --out=release'))
	gulp.task('package:windows', shell.task('electron-packager . ' + packageInfo.name + ' --overwrite --asar=true --platform=win32 --arch=ia32 --icon=' + packageInfo.build.icon.windows + ' --prune=true --out=release --version-string.CompanyName=CE --version-string.FileDescription=CE --version-string.ProductName=' + packageInfo.productName))
	gulp.task('package:linux', shell.task('electron-packager . ' + packageInfo.name + ' --overwrite --asar=true --platform=linux --arch=x64 --icon=' + packageInfo.build.icon.linux + ' --prune=true --out=release'))
} else {
	gulp.task('package:mac', shell.task('electron-packager . --overwrite --platform=darwin --arch=x64 --icon=$npm_package_build_icon_mac --prune=true --out=release'))
	gulp.task('package:windows', shell.task('electron-packager . $npm_package_name --overwrite --asar=true --platform=win32 --arch=ia32 --icon=$npm_package_build_icon_windows --prune=true --out=release --version-string.CompanyName=CE --version-string.FileDescription=CE --version-string.ProductName=$npm_package_productName'))
	gulp.task('package:linux', shell.task('electron-packager . $npm_package_name --overwrite --asar=true --platform=linux --arch=x64 --icon=$npm_package_build_icon_linux --prune=true --out=release'))
}

gulp.task('release', gulp.series('compile:sass', gulp.parallel('package:mac', 'package:windows', 'package:linux')))
