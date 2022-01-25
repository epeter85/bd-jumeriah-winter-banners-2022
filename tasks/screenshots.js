const   gulp = require('gulp'),
		localScreenshots = require('gulp-banners-screenshots');
		

// var currentCreative;
// var currentSize;

var currentCreative = 'v1';
var currentWidth = '728';
var currentHeight = '90';
var currentSize = currentWidth + 'x' + currentHeight;

function screenshotFrames(done) {

	var screenshotSource = './build/' + currentCreative + '/' + currentSize + '/*.html';
	var screenshotPath = './build/' + currentCreative + '/' + currentSize +'/';
	var screenshotDest = './screenshots/' + currentCreative + '/' + currentSize + '/';

    gulp.src(screenshotSource)
    .pipe(localScreenshots({
        width: [currentWidth], // The banner width
        timeout: 30000, // Time to exit if no console.log message is received
        folder: screenshotDest, // Where the screenshot will be placed
        port: '3001', // Usually 8889 for 'gulp serve'
		path: screenshotPath, // Where is you html
		suffix: '_frame01',
		zoom: '2',
        waitLastFrame: 'frame01' // Message to trigger the screenshot action
	}))
	.pipe(localScreenshots({
        width: [currentWidth], // The banner width
        timeout: 30000, // Time to exit if no console.log message is received
        folder: screenshotDest, // Where the screenshot will be placed
        port: '3002', // Usually 8889 for 'gulp serve'
		path: screenshotPath, // Where is you html
		suffix: '_frame02',
		zoom: '2',
        waitLastFrame: 'frame02' // Message to trigger the screenshot action
	}))
	.pipe(localScreenshots({
        width: [currentWidth], // The banner width
        timeout: 30000, // Time to exit if no console.log message is received
        folder: screenshotDest, // Where the screenshot will be placed
        port: '3003', // Usually 8889 for 'gulp serve'
		path: screenshotPath, // Where is you html
		suffix: '_frame03',
		zoom: '2',
        waitLastFrame: 'frame3' // Message to trigger the screenshot action
	}))
	done();
};


gulp.task('screenshotFrames', screenshotFrames);