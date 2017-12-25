var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var less        = require('gulp-less');
var sourcemaps  = require('gulp-sourcemaps');
var cssmin      = require('gulp-minify-css');
var notify      = require('gulp-notify');
var plumber     = require('gulp-plumber');
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
autoprefix = new LessPluginAutoPrefix({
    browsers: ['last 2 versions', 'Android >= 4.0', 'iOS 7']
});


// Static server
gulp.task('browser-sync',['less-watcher'], function() {
    var files = [
    '**/*.html',
    '**/*.css',
    '**/*.js'
    ];
    browserSync.init(files,{
        server: {
            baseDir: "./"
        },
        logConnections: true,
        notify: false
    });
});

gulp.task('less-watcher',function(){
    gulp.watch('css/less/**/*.less',['less2css']);
});

gulp.task('less2css',function(){
    gulp.src(['css/less/*.less','!css/less/**/{reset}.less'])
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(sourcemaps.init())
        .pipe(less({
            plugins: [autoprefix]
        }))
        .pipe(sourcemaps.write())
        .pipe(cssmin())
        .pipe(gulp.dest('css'))
});

// Domain server
//gulp.task('browser-sync', function() {
//    browserSync.init({
//        proxy: "yourlocal.dev"
//    });
//});

gulp.task('default',['browser-sync']); //定义默认任务

gulp.task('build',function(){
    gulp.src(['css/**/*.css','!css/reset.css'])
        .pipe(gulp.dest('build/css'));
    gulp.src('images/**/*.*')
        .pipe(gulp.dest('build/images'));
    gulp.src('js/**/*.*')
        .pipe(gulp.dest('build/js'));
    gulp.src('*.html')
        .pipe(gulp.dest('build'));        
})