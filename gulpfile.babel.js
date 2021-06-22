import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import browserify from 'gulp-browserify';
import browserSync from 'browser-sync';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import imagemin from 'gulp-imagemin';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import cleanCSS from 'gulp-clean-css';
import purgecss from 'gulp-purgecss';
import ejs from'gulp-ejs';
import rename from'gulp-rename';

const server = browserSync.create();

const paths = {
  distDir: './dist/',
  srcImages: 'src/images/*.{jpg,jpeg,png,svg,ico}',
  distImages: 'dist/images/',
  srcFonts: 'src/fonts/**/*',
  distFonts: 'dist/fonts/',
  srcScripts: 'src/javascripts/app.js',
  distScripts: 'dist/javascripts/',
  srcStyles: 'src/stylesheets/**/*.scss',
  distStyles: 'dist/stylesheets/',
  srcHtml: 'src/*.ejs',
  distHtml: 'dist/',
};

let notifyOnError = function(err) {
  notify.onError({
    title: 'Itou',
    subtitle: 'Error!',
    message: '<%= error.message %>'
  })(err);
  this.emit('end');
};

// Styles Task
export function styles() {
  return gulp.src(paths.srcStyles)
    .pipe(
      plumber({
        errorHandler: notifyOnError,
      }),
    )
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.distStyles));
}

// Purge Styles Task
export function purgestyles() {
  return (
    gulp.src(paths.srcStyles)
      .pipe(
        plumber({
          errorHandler: notifyOnError,
        }),
      )
      .pipe(sass())
      .pipe(cleanCSS())
      .pipe(
        purgecss({
          content: [paths.distHtml + '*.html', paths.distScripts + 'app.js']
        }),
      )
      .pipe(gulp.dest(paths.distStyles))
  );
}

export function scripts() {
  return gulp.src(paths.srcScripts, {
    sourcemaps: true
  })
    .pipe(plumber({
      errorHandler: notifyOnError
    }))
    .pipe(browserify())
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest(paths.distScripts));
}

// Compress Images Task
export function images() {
  return gulp.src(paths.srcImages, {
    since: gulp.lastRun(images)
  })
    .pipe(plumber({
      errorHandler: notifyOnError
    }))
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true,
      svgoPlugins: [{
        removeViewBox: false
      }]
    }))
    .pipe(gulp.dest(paths.distImages));
}

// Copy the Font files
export function fonts() {
  return gulp.src(paths.srcFonts)
    .pipe(gulp.dest(paths.distFonts));
}

// Templates to HTML Task
export function html() {
  return gulp.src(paths.srcHtml)
    .pipe(ejs())
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(paths.distHtml));
}

// BrowserSync Reload Task
function reload(done) {
  server.reload();
  done();
}

// BrowserSync Serve Task
export function serve(done) {
  server.init({
    server: {
      baseDir: paths.distDir
    },
    open: false,
    notify: false,
    injectChanges: true,
    reloadDebounce: 1000
  });
  done();
}

// Watch Task
function watch() {
  gulp.watch(paths.srcHtml, gulp.series(html, reload));
  gulp.watch(paths.srcScripts, gulp.series(scripts, reload));
  gulp.watch(paths.srcStyles, gulp.series(styles, reload));
  gulp.watch(paths.srcImages, gulp.series(images, reload));
}

const dev = gulp.series(html, scripts, styles, images, fonts, serve, watch);
gulp.task('dev', dev);

const build = gulp.series(html, scripts, purgestyles, images, fonts);
gulp.task('build', build);

export default dev;