//
// Variables ===================================
//

// Load dependencies
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const cached = require("gulp-cached");
const cleancss = require("gulp-clean-css");
const del = require("del");
const fileinclude = require("gulp-file-include");
const gulp = require("gulp");
const gulpif = require("gulp-if");
const concat = require("gulp-concat");
const npmdist = require("gulp-npm-dist");
const replace = require("gulp-replace");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const useref = require("gulp-useref");
const reload = browsersync.reload;

const staticDirs = "./walkup_effect/static";
const templateDirs = "./walkup_effect/templates";

const paths = {
  base: {
    base: {
      dir: "./", // E.g.: '~./walkup_effect/'. Location relative to this gulpfile
    },
    node: {
      dir: "./node_modules", // Located in project root
    },
  },
  dist: {
    base: {
      dir: staticDirs + "/dist",
    },
    libs: {
      dir: staticDirs + "/dist/libs",
    },
  },
  src: {
    base: {
      dir: staticDirs,
      files: `${staticDirs}/**/*`,
    },
    css: {
      dir: `${staticDirs}/css`,
      files: `${staticDirs}/css/**/*`,
    },
    html: {
      dir: templateDirs,
      files: templateDirs + "/**/*.html",
    },
    img: {
      dir: staticDirs + "/images",
      files: staticDirs + "/images/**/*",
    },
    js: {
      dir: `${staticDirs}/js`,
      files: `${staticDirs}/js/**/*`,
    },
    partials: {
      dir: `${templateDirs}/partials`,
      files: `${templateDirs}/partials/**/*`,
    },
    scss: {
      dir: staticDirs + "/scss",
      files: staticDirs + "/scss/**/*",
      main: staticDirs + "/scss/*.scss",
    },
    tmp: {
      dir: `${templateDirs}/.tmp`,
      files: `${templateDirs}/.tmp/**/*`,
    },
  },
};

const gtag =
  '<script async src="https://www.googletagmanager.com/gtag/js?id=UA-156446909-2"></script>' +
  '<script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag("js", new Date());gtag("config", "UA-156446909-2");' +
  "</script>";

//
// Tasks ===================================
//

gulp.task("browsersync", (callback) => {
  browsersync.init(
    {
      server: {
        baseDir: [paths.src.tmp.dir, paths.src.base.dir, paths.base.base.dir],
      },
    },
    {
      // https://www.browsersync.io/docs/options/#option-proxy
      proxy: "localhost:8000",
    }
  );
  callback();
});

gulp.task("watch", () => {
  gulp.watch(paths.src.scss.files, gulp.series("scss"));
  gulp.watch([paths.src.js.files, paths.src.img.files], gulp.series(reload));
  gulp.watch(
    [paths.src.html.files, paths.src.partials.files],
    gulp.series("fileinclude", reload)
  );
});

gulp.task("scss", () =>
  gulp
    .src(paths.src.scss.main)
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.src.css.dir))
    .pipe(browsersync.stream())
);

gulp.task("fileinclude", (callback) =>
  gulp
    .src([
      paths.src.html.files,
      "!" + paths.src.tmp.files,
      "!" + paths.src.partials.files,
    ])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
        indent: true,
      })
    )
    .pipe(cached())
    .pipe(gulp.dest(paths.src.tmp.dir))
);

gulp.task("clean:tmp", (callback) => {
  del.sync(paths.src.tmp.dir);
  callback();
});

gulp.task("clean:dist", (callback) => {
  del.sync(paths.dist.base.dir);
  callback();
});

gulp.task("copy:all", () =>
  gulp
    .src([
      paths.src.base.files,
      `!${paths.src.partials.dir}`,
      `!${paths.src.partials.files}`,
      `!${paths.src.scss.dir}`,
      `!${paths.src.scss.files}`,
      `!${paths.src.tmp.dir}`,
      `!${paths.src.tmp.files}`,
      `!${paths.src.js.dir}`,
      `!${paths.src.js.files}`,
      `!${paths.src.css.dir}`,
      `!${paths.src.css.files}`,
      `!${paths.src.html.files}`,
    ])
    .pipe(gulp.dest(paths.dist.base.dir))
);

gulp.task("copy:libs", () =>
  gulp
    .src(npmdist(), {
      base: paths.base.node.dir,
    })
    .pipe(gulp.dest(paths.dist.libs.dir))
);

gulp.task("html", () =>
  gulp
    .src([
      paths.src.html.files,
      "!" + paths.src.tmp.files,
      "!" + paths.src.partials.files,
    ])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
        indent: true,
      })
    )
    .pipe(replace(/href="(.{0,10})node_modules/g, 'href="$1libs'))
    .pipe(replace(/src="(.{0,10})node_modules/g, 'src="$1libs'))
    .pipe(useref())
    .pipe(cached())
    .pipe(gulpif("*.js", uglify()))
    .pipe(gulpif("*.css", cleancss()))
    .pipe(gulp.dest(paths.dist.base.dir))
);

gulp.task("html:preview", () =>
  gulp
    .src([
      paths.src.html.files,
      "!" + paths.src.tmp.files,
      "!" + paths.src.partials.files,
    ])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
        indent: true,
      })
    )
    .pipe(
      replace(
        "</head>",
        "\n    <!-- Global site tag (gtag.js) - Google Analytics -->\n    " +
          gtag +
          "\n\n  </head>"
      )
    )
    .pipe(replace(/href="(.{0,10})node_modules/g, 'href="$1libs'))
    .pipe(replace(/src="(.{0,10})node_modules/g, 'src="$1libs'))
    .pipe(useref())
    .pipe(cached())
    .pipe(gulpif("*.js", uglify()))
    .pipe(gulpif("*.css", cleancss()))
    .pipe(gulp.dest(paths.dist.base.dir))
);

gulp.task(
  "build",
  gulp.series(
    gulp.parallel("clean:tmp", "clean:dist", "copy:all", "copy:libs"),
    "scss",
    "html"
  )
);

gulp.task(
  "build:preview",
  gulp.series(
    gulp.parallel("clean:tmp", "clean:dist", "copy:all", "copy:libs"),
    "scss",
    "html:preview"
  )
);

gulp.task(
  "default",
  gulp.series(
    gulp.parallel("fileinclude", "scss"),
    gulp.parallel("browsersync", "watch")
  )
);

// .pipe(gulpif("*.css", cleancss()))
gulp.task("concat", () =>
  gulp
    .src(`${staticDirs}/js/*.js`)
    .pipe(concat("project.js"))
    .pipe(gulpif("*.js", uglify()))
    .pipe(gulp.dest(staticDirs + "/js"))
);

gulp.task("cleancss", () =>
  gulp
    .src(`${staticDirs}/css/*.css`)
    .pipe(concat("project.min.css"))
    .pipe(gulpif("*.css", cleancss()))
    .pipe(gulp.dest(staticDirs + "/css"))
);
