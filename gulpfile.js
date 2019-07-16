var gulp = require('gulp'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    insert = require('gulp-insert'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    sass = require('gulp-sass'),
    pipeline = require('readable-stream').pipeline;

// Gulp Sass Compiler
sass.compiler = require('node-sass');
gulp.task('sass', function () {
    return gulp.src([
        './dev/sass/app.scss',
    ])
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(['./']));
});

//Gulp Script Concat
gulp.task('script', function () {
    return gulp.src([
        './dev/js/plugin/*.js',
        './dev/js/config.js',
        './dev/js/ajax.js',
        './dev/js/placeholder.js',
        './dev/js/helper.js',
        './dev/js/run.js',
    ])
        .pipe(concat('app.min.js'))
        .pipe(insert.prepend('jQuery(document).ready(function ($) {'))
        .pipe(insert.append('});'))
        .pipe(gulp.dest('./'))
        .pipe(babel({presets: ['@babel/env']}))
        .pipe(replace("\\n", ''))
        .pipe(replace("\\t", ''))
        .pipe(replace("  ", ''))
        .pipe(uglify())
        .pipe(gulp.dest('./'));
});

// Gulp Script Minify
gulp.task('js', function () {
    return gulp.src(['./js/*.js', '!./assets/js/*.min.js'])
        .pipe(babel({presets: ['@babel/env']}))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});

// Gulp Css Minify
gulp.task('css', function () {
    return gulp.src(['./assets/css/*.css', '!./assets/css/*.min.css'])
        .pipe(cleanCSS({
            keepSpecialComments: 1,
            level: 2
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});

// Gulp Watch
gulp.task('watch', function () {
    gulp.watch('assets/dev/js/**/*.js', gulp.series('script'));
    gulp.watch('assets/dev/sass/**/*.scss', gulp.series('sass'));
});

// global Task
gulp.task('default', gulp.parallel('sass', 'script'));