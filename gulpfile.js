const gulp = require('gulp');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const purgeCss = require('gulp-purgecss');
const cleanCss = require('gulp-clean-css');

const browserSync = require('browser-sync');
const del = require('del');

const paths = {
  pages: {
    src: './src/pages/*.ejs',
    dest: './dist'
  },
  styles: {
    src: './src/styles/styles.scss',
    dest: './dist/styles'
  },
  images: {
    src: './src/images/*',
    dest: './dist/images'
  }
};

const server = browserSync.create();

const reload = done => {
  server.reload();
  done();
};

const serve = done => {
  server.init({
    server: {
      baseDir: './dist'
    }
  });
  done();
};

const clean = () => del(['dist']);

const pages = () => {
  return gulp.src(paths.pages.src)
    .pipe(ejs())
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(paths.pages.dest));
};

const styles = () => {
  return gulp.src(paths.styles.src)
    .pipe(sass({
      outputStyle: 'nested',
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe(purgeCss({
      content: ['./src/pages/**/*.ejs']
    }))
    .pipe(cleanCss())
    .pipe(gulp.dest(paths.styles.dest));
};

const images = () => {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
}

const watch = () => {
  gulp.watch([paths.pages.src], gulp.series(pages, reload));
  gulp.watch([paths.styles.src], gulp.series(styles, reload));
  gulp.watch([paths.images.src], gulp.series(images, reload));
};

gulp.task('dev', gulp.series(clean, pages, styles, images, serve, watch));

gulp.task('build', gulp.series(clean, pages, styles, images));
