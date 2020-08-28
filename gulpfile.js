const Server        = require('browser-sync')               ;
const Gulp          = require('gulp')                       ;
const Sass          = require('gulp-sass')                  ;
const Tilder        = require('node-sass-tilde-importer')   ;
const Autoprefixer  = require('autoprefixer')               ;
const Cssnano       = require('cssnano')                    ;
const Plumber       = require('gulp-plumber')               ;
const Postcss       = require('gulp-postcss')               ;
const Rename        = require('gulp-rename')                ;
const Sourcemaps    = require('gulp-sourcemaps')            ;
const Watch         = require('gulp-watch')                 ;

const serverOptions = {
    watch:true,
    notify:false,
    port:3000,
    server:{
        baseDir:'./'
    }
},

reloadFiles = [
    './Stylite.scss'
],

sassOptions = {
    import:Tilder,
    sourceComments:true,
    outputStyle:'expanded'
},

postcssOptions = [
    Autoprefixer,
    Cssnano({
        core:true,
        zindex:false
    })
]

Gulp.task('Server', () =>{
    Server.init(
        serverOptions
    )
});

Gulp.task('Dev', ()=>{
    return Gulp.src('./Stylite.scss')
        .pipe(Sourcemaps.init({loadMaps:true}))
        .pipe(Plumber())
        .pipe(Sass(sassOptions))
        .pipe(Sourcemaps.write('.'))
        .pipe(Gulp.dest('./css'))
        .pipe(Server.stream(reloadFiles))
});

Gulp.task('Build', ()=>{
    return Gulp.src('./Stylite.scss')
        .pipe(Plumber())
        .pipe(Sass(sassOptions))
        .pipe(Postcss(postcssOptions))
        .pipe(Rename('Stylite.min.css'))
        .pipe(Gulp.dest('./css'))
        .pipe(Server.stream(reloadFiles))
});

Gulp.task('default', Gulp.parallel('Server', 'Dev', (cb)=>{
    Gulp.watch('index.html').on('change', Server.reload);
    Watch('./**/*.scss',Gulp.series('Dev')).on('change', Server.reload);
    cb();
}));