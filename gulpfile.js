var gulp = require('gulp');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var zip = require('gulp-zip');
var through = require('through');
var fs = require('fs');
var less = require('gulp-less');
var rsync = require('gulp-rsync');
var browserify = require('browserify');

var config = {};
try{
    config = require('./config');
} catch(e){
    console.error('config not found');
    // Sample config
    // module.exports = {
    //     rsync: {
    //         root: 'dist',
    //         hostname: 'my.host',
    //         destination: '/var/ww/whatever'
    //     }
    // }
}

function browserifyTask(src, dest){
    var b = browserify({
        entries: src
    });
    return b.bundle()
        // .pipe(through(function(data){
        //     if(data.indexOf('no window object present')){
        //         data = data.replace('')
        //     }
        // }))
        .pipe(fs.createWriteStream(dest));
}

gulp.task('js-index', function() {
    return browserifyTask('./src/scripts/index.js', 'dist/index.js');
});
gulp.task('js-sandbox', function() {
    return browserifyTask('./src/scripts/sandbox.js', 'dist/sandbox.js');
});
gulp.task('js-worker', function() {
    return browserifyTask('./src/scripts/worker.js', 'dist/worker.js');
});

gulp.task('js', ['js-index', 'js-sandbox', 'js-worker']);

gulp.task('html', function(){
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('css', function(){
    gulp.src('src/css/style.less')
        .pipe(less())
        .pipe(gulp.dest('dist/'));
});

gulp.task('connect',function(){
    connect.server({
        root: 'dist',
        livereload: false
    });
});

gulp.task('chrome-dev', ['js'], function(){
    gulp.src([
        'src/chrome/**',
        'dist/**'
        ])
        .pipe(gulp.dest('chrome/'));
});

gulp.task('chrome-dist', ['chrome-dev'], function(){
    gulp.src([
        'chrome/**',
        ])
        .pipe(zip('chrome.zip'))
        .pipe(gulp.dest('./'));
});

if(config.rsync){
    gulp.task('web-dist',function(){
        gulp.src(['dist/**']).pipe(rsync(config.rsync));
    });
}

gulp.task('watch', function () {
    gulp.watch(['src/index.html','src/**/*'], ['build']);
});

gulp.task('build',['js','css','html','chrome-dev','chrome-dist']);
gulp.task('deploy',['build','web-dist']);
gulp.task('default',['build','connect','watch']);
