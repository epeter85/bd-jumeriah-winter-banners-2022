const gulp = require('gulp'),
  concat = require('gulp-concat'),
  merge = require('merge-stream'),
  header = require('gulp-header'),
  gutil = require('gutil'),
  del = require('del'),
  pug = require('gulp-pug'),
  gulpif = require('gulp-if'),
  runSequence = require('run-sequence'),
  sass = require('gulp-sass'),
  cssnano = require('gulp-cssnano'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  args = require('yargs').argv,
  rename = require('gulp-rename'),
  fs = require('fs'),
  es = require('event-stream'),
  spritesmith = require('gulp.spritesmith'),
  tinypng = require('gulp-tinypng-compress'),
  zip = require('gulp-zip'),
  HubRegistry = require('gulp-hub'),
  browsersync = require('browser-sync').create();

/* load some gulpfiles into the registry */
var hub = new HubRegistry('tasks/*.js');

/* tell gulp to use the tasks just loaded */
gulp.registry(hub);

// hub.currentCreative = 'v1';
// hub.currentSize = '728x90';

var config = JSON.parse(fs.readFileSync('./config_fr.json'));
var isProduction = false;
var des = config.dest.build;
var bannerName = config.ad.name;
var url_links = config.URL;

var creatives = config.creatives;
var creativesArray = [];

creatives.forEach(function (creative) {
  creativesArray.push(creative.name);
});

var sizesArray = [];
creatives.forEach(function (creative) {
  sizesArray.push(creative.sizes);
});

function sprite() {
  let ms = [];

  creatives.forEach(function (creative) {
    let sizes = creative.sizes;

    sizes.forEach(function (size) {
      let currentSize = size.width + 'x' + size.height;

      let spriteData = gulp
        .src(
          './src/creatives/' +
            creative.name +
            '/' +
            currentSize +
            '/assets/*-assets/sprite/' +
            '*.+(png)'
        )
        .pipe(
          spritesmith({
            imgName: '../images/sprite.png',
            cssName: '_sprite.scss',
            cssFormat: 'css',
          })
        );

      let imgStream = spriteData.img.pipe(
        gulp.dest(des + '/' + creative.name + '/' + currentSize + '/images/')
      );

      let cssStream = spriteData.css.pipe(
        gulp.dest(
          './src/creatives/' + creative.name + '/' + currentSize + '/sass'
        )
      );

      ms.push(imgStream, cssStream);
    });
  });
  return merge(ms);
}

function tinyPNG() {
  let ms = [];

  creatives.forEach(function (creative) {
    let sizes = creative.sizes;

    sizes.forEach(function (size) {
      let currentSize = size.width + 'x' + size.height;

      let spriteMinify = gulp
        .src(
          des + '/' + creative.name + '/' + currentSize + '/images/sprite.png'
        )
        .pipe(tinypng('W4hvzCmPFZ271xhxMbKsVV7FPlxpXnCL'))
        .pipe(
          gulp.dest(des + '/' + creative.name + '/' + currentSize + '/images/')
        );

      ms.push(spriteMinify);
    });
  });
  return merge(ms);
}

function sassIt() {
  // create an empty array to push the streams into
  // ** due to the nature of gulp (for lack of a better explanation), it's not recomended
  // 		to return multiple streams in a task, so the streams are merged and returned
  //		in one statement below
  let ms = [];

  // define the loops for the groups and sizes
  creatives.forEach(function (creative) {
    let sizes = creative.sizes;

    sizes.forEach(function (size) {
      let currentSize = size.width + 'x' + size.height;

      // assign the entire stream to a variable
      let m = gulp
        .src(
          './src/creatives/' +
            creative.name +
            '/' +
            currentSize +
            '/sass/style.scss'
        )

        // use gulp-header to inject sass variables at the top of the sass file
        .pipe(
          header(
            "$size: '" +
              String(currentSize) +
              "'; $creative: '" +
              creative.name +
              "'; $isProduction:" +
              isProduction +
              ';\n'
          )
        )

        // cover your ass?
        .pipe(sass().on('error', sass.logError))

        // minify the css file
        .pipe(gulpif(isProduction, cssnano()))
        .pipe(
          gulp.dest(des + '/' + creative.name + '/' + currentSize + '/css/')
        );

      // push the stream variable into the array
      ms.push(m);
    });
  });
  // return the merged streams
  // merging is the only way to return multiple streams in a single gulp task
  return merge(ms);
}

function images() {
  let ms = [];

  creatives.forEach(function (creative) {
    let sizes = creative.sizes;

    sizes.forEach(function (size) {
      let currentSize = size.width + 'x' + size.height;

      let m = es.merge(
        // grouped images
        gulp
          .src(
            './src/creatives/' +
              creative.name +
              '/' +
              currentSize +
              '/assets/*-assets/' +
              '*.+(jpg|gif|png|svg)'
          )
          .pipe(gulpif(isProduction, imagemin()))
          .pipe(rename({ dirname: '' }))
          .pipe(
            gulp.dest(
              des + '/' + creative.name + '/' + currentSize + '/images/'
            )
          ),

        // non-grouped images
        gulp
          .src('./src/global/images/' + currentSize + '*.+(jpg|gif|png|svg)')
          .pipe(gulpif(isProduction, imagemin()))
          .pipe(
            gulp.dest(
              des + '/' + creative.name + '/' + currentSize + '/images/'
            )
          ),

        // global images
        gulp
          .src('./src/global/images/' + '*.+(jpg|gif|png|svg)')
          .pipe(gulpif(isProduction, imagemin()))
          .pipe(
            gulp.dest(
              des + '/' + creative.name + '/' + currentSize + '/images/'
            )
          ),

        //copy templates over to build
        gulp
          .src(
            './src/creatives/' +
              creative.name +
              '/' +
              currentSize +
              '/assets/*-assets/template/' +
              '*.+(jpg|gif|png)'
          )
          .pipe(gulpif(!isProduction, rename({ dirname: 'template' })))
          .pipe(
            gulpif(
              !isProduction,
              gulp.dest(
                des + '/' + creative.name + '/' + currentSize + '/images/'
              )
            )
          )
      );
      ms.push(m);
    });
  });
  return merge(ms);
}

function fonts() {
  let ms = [];

  creatives.forEach(function (creative) {
    let sizes = creative.sizes;

    sizes.forEach(function (size) {
      let currentSize = size.width + 'x' + size.height;

      let m = es.merge(
        // global fonts
        gulp
          .src('./src/global/fonts/' + '*.+(woff|woff2)')
          .pipe(gulpif(isProduction, imagemin()))
          .pipe(
            gulp.dest(des + '/' + creative.name + '/' + currentSize + '/fonts/')
          )
      );
      ms.push(m);
    });
  });
  return merge(ms);
}

function pugIt() {
  let ms = [];

  creatives.forEach(function (creative) {
    let sizes = creative.sizes;
    let name = creative.name;

    url_links.country = name;

    sizes.forEach(function (size) {
      let YOUR_LOCALS = {
        url_links: url_links,
        bannerName: bannerName,
        isProduction: isProduction,
        bannerWidth: size.width,
        bannerHeight: size.height,
      };
      console.log(YOUR_LOCALS.url_links);
      let currentSize = size.width + 'x' + size.height;
      let m = gulp
        .src(
          './src/creatives/' + creative.name + '/' + currentSize + '/pug/*.pug'
        )
        .pipe(
          pug({
            locals: YOUR_LOCALS,
            pretty: isProduction ? false : true,
            //pretty: true
          })
        )
        .pipe(gulp.dest(des + '/' + creative.name + '/' + currentSize + '/'));

      ms.push(m);
    });
  });

  return merge(ms);
}

function js() {
  let ms = [];

  creatives.forEach(function (creative) {
    let sizes = creative.sizes;

    sizes.forEach(function (size) {
      let currentSize = size.width + 'x' + size.height;
      let jsSources = [
        './src/global/js/global_functions.js',
        './src/global/js/main.js',
        './src/creatives/' + creative.name + '/' + currentSize + '/js/main.js',
      ];

      let m = gulp
        .src(jsSources)
        .pipe(concat('main.js'))
        .pipe(header('var config = ' + JSON.stringify(config.JSVars) + ';\n'))
        .pipe(
          header('var isProduction = ' + JSON.stringify(isProduction) + ';\n')
        )
        //.pipe(gulpif(isProduction, uglify()))
        .pipe(
          gulp.dest(des + '/' + creative.name + '/' + currentSize + '/js/')
        );

      // let n = es.merge(
      // 	// global js packages
      // 	gulp.src('./src/global/js/DrawSVGPlugin.min.js')
      // 	.pipe(gulp.dest(des + '/' + creative.name + '/' + currentSize + '/js/')),
      // );

      ms.push(m);
    });
  });

  return merge(ms);
}

function zipFolders() {
  let ms = [];

  creatives.forEach(function (creative) {
    let sizes = creative.sizes;

    sizes.forEach(function (size) {
      let currentSize = size.width + 'x' + size.height;

      let zipFolders = gulp
        .src(des + '/' + creative.name + '/' + currentSize + '/**/*')
        .pipe(zip(creative.name + '_' + currentSize + '.zip'))
        .pipe(gulp.dest(des));

      ms.push(zipFolders);
    });

    let staticBanners = gulp
      .src('./static/**/*')
      .pipe(zip('statics.zip'))
      .pipe(gulp.dest(des));

    ms.push(staticBanners);
  });
  return merge(ms);
}

function cleanBuild(done) {
  del.sync('build');
  done();
}

function cleanPackaged(done) {
  del.sync('package');
  done();
}

function production(done) {
  des = config.dest.package;
  isProduction = true;
  done();
}

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './build/',
      directory: true,
    },
    port: 3000,
  });
  done();
}

function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function watchFiles() {
  gulp.watch('src/creatives/**/*.png', gulp.series(sprite, browserSyncReload));
  gulp.watch('src/global/pug/**/*.pug', gulp.series(pugIt, browserSyncReload));
  gulp.watch(
    ['src/global/sass/**/*.{scss,css}', 'src/creatives/**/*.{scss,css}'],
    gulp.series(sassIt, browserSyncReload)
  );
  gulp.watch(
    ['src/global/js/**/*.js', 'src/creatives/**/*.js'],
    gulp.series(js, browserSyncReload)
  );
  gulp.watch(
    ['src/global/images/**/*', 'src/creatives/**/*.jpg'],
    gulp.series(images, browserSyncReload)
  );
}

const build = gulp.series(cleanBuild, sprite, sassIt, images, pugIt, js);
const package = gulp.series(
  //cleanPackaged,
  production,
  sprite,
  sassIt,
  images,
  pugIt,
  js,
  tinyPNG,
  zipFolders
);
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

exports.sprite = sprite;
exports.pugIt = pugIt;
exports.sassIt = sassIt;
exports.js = js;
exports.images = images;
exports.tinyPNG = tinyPNG;
exports.cleanBuild = cleanBuild;
exports.cleanPackaged = cleanPackaged;
exports.zipFolders = zipFolders;
exports.production = production;
//exports.screenshotFrames = screenshotFrames;

//exports.takeScreenshots = takeScreenshots;
exports.package = package;
exports.build = build;
exports.default = watch;
