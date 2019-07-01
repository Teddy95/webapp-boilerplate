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
 * Package App to /release
 */
if (process.platform === 'win32') {
	var packageInfo = JSON.parse(fs.readFileSync('./package.json'))
	gulp.task('package-mac', shell.task('electron-packager . --overwrite --platform=darwin --arch=x64 --icon=' + packageInfo.build.icon.mac + ' --prune=true --out=release'))
	gulp.task('package-windows', shell.task('electron-packager . ' + packageInfo.name + ' --overwrite --asar=true --platform=win32 --arch=ia32 --icon=' + packageInfo.build.icon.windows + ' --prune=true --out=release --version-string.CompanyName=CE --version-string.FileDescription=CE --version-string.ProductName=' + packageInfo.productName))
	gulp.task('package-linux', shell.task('electron-packager . ' + packageInfo.name + ' --overwrite --asar=true --platform=linux --arch=x64 --icon=' + packageInfo.build.icon.linux + ' --prune=true --out=release'))
} else {
	gulp.task('package-mac', shell.task('electron-packager . --overwrite --platform=darwin --arch=x64 --icon=$npm_package_build_icon_mac --prune=true --out=release'))
	gulp.task('package-windows', shell.task('electron-packager . $npm_package_name --overwrite --asar=true --platform=win32 --arch=ia32 --icon=$npm_package_build_icon_windows --prune=true --out=release --version-string.CompanyName=CE --version-string.FileDescription=CE --version-string.ProductName=$npm_package_productName'))
	gulp.task('package-linux', shell.task('electron-packager . $npm_package_name --overwrite --asar=true --platform=linux --arch=x64 --icon=$npm_package_build_icon_linux --prune=true --out=release'))
}

gulp.task('release', gulp.series('compile:sass', gulp.parallel('package-mac', 'package-windows', 'package-linux')))

/**
 * Add watch task for Scss files
 */
gulp.task('watch', done => {
	gulp.watch('sass/*', gulp.series('compile:sass'))
	done()
})
