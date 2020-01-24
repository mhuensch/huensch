var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cssvariables = require('postcss-css-variables');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('autoprefixer');
var rename = require('gulp-rename');
var wait = require('gulp-wait');
var merge = require('merge2');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var zip = require('gulp-zip');
var browserSync = require('browser-sync').create();

gulp.task('css', function() {
    return gulp.src('./assets/scss/screen.scss')
    .pipe(wait(100))
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssvariables({preserve: true})]))
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.stream())
    .pipe(cleanCSS({
        level: {1: {specialComments: 0}},
        compatibility: 'ie9'}))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.stream());
});

gulp.task('ampcss', function() {
    return gulp.src(['./assets/scss/amp-style.scss'])
    .pipe(wait(100))
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssvariables()]))
    .pipe(cleanCSS({
        level: {1: {specialComments: 0}},
        compatibility: 'ie9'}))
    .pipe(rename({extname: '.hbs'}))
    .pipe(gulp.dest('./partials'));
});

gulp.task('concat-js', function() {
    return gulp.src([
        './assets/js/vendor/reframe.js',
        './assets/js/vendor/prism.js',
        './assets/js/vendor/prism-toolbar.min.js',
        './assets/js/vendor/prism-show-language.min.js',
        './assets/js/vendor/prism-copy-to-clipboard.min.js',
        './assets/js/vendor/fuse.min.js',
        './assets/js/vendor/medium-zoom.min.js',
        './assets/js/vendor/clipboard.min.js',
        './assets/js/index.js'
    ], { allowEmpty: true })
    .pipe(concat('app.bundle.min.js'))
    .pipe(gulp.dest('./assets/js'));
});

gulp.task('watch', gulp.series('css', 'ampcss', 'concat-js', function() {
    browserSync.init({
        proxy: "http://localhost:2368"
    });
    gulp.watch(['./assets/scss/**/*.scss'], { allowEmpty: true }).on('change', gulp.series('css'));
    gulp.watch(['./assets/scss/amp-style.scss',
                './assets/scss/components/_color-and-font.scss',
                './assets/scss/components/_common.scss'], { allowEmpty: true }).on('change', gulp.series('ampcss'));
    gulp.watch(['./assets/scss/amp-style.scss']).on('change', gulp.series('ampcss'));
    gulp.watch(['./assets/js/**/*.js', '!./assets/js/app.bundle.min.js'], { allowEmpty: true }).on('change', gulp.series('concat-js', browserSync.reload));
    gulp.watch('./**/*.hbs').on('change', browserSync.reload);
}));

gulp.task('clean', function() {
    return del(['./build', './dist']);
});

gulp.task('build', gulp.series('clean', 'css', 'concat-js', function () {
    var targetDir = 'build/';
    return gulp.src([
        '**',
        '!assets/scss', '!assets/scss/**/*',
        'assets/js/**', '!assets/js/vendor', '!assets/js/vendor/**/*',
        '!node_modules', '!node_modules/**',
        '!build', '!build/**',
        '!dist', '!dist/**'
    ])
    .pipe(gulp.dest(targetDir));
}));

gulp.task('zip', function () {
    var targetDir = 'dist/';
    var themeName = require('./package.json').name;
    var filename = themeName + '.zip';

    return gulp.src([
        './build/**/*'
    ])
    .pipe(zip(filename))
    .pipe(gulp.dest(targetDir));
});

gulp.task('default', gulp.parallel('watch'));