var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');

// @source - https://laracasts.com/forum/?p=2417-gulpfile-for-minifying-javascript/p1#p10181
gulp.task('js', function () {
    return gulp.src('js/**/*.js') //select all javascript files under js/ and any subdirectory
        .pipe(concat('plugin.min.js')) //the name of the resulting file
        .pipe(uglify())
        .pipe(gulp.dest('min')) //the destination folder
        .pipe(notify({ message: 'Finished minifying JavaScript'}));
});
