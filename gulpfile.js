const { src, dest, series, watch } = require(`gulp`),
  CSSLinter = require(`gulp-stylelint`),
  { deleteAsync } = require(`del`),
  babel = require(`gulp-babel`),
  htmlCompressor = require(`gulp-htmlmin`),
  jsCompressor = require(`gulp-terser`),
  cssCompressor = require(`gulp-clean-css`),
  jsLinter = require(`gulp-eslint`),
  browserSync = require(`browser-sync`),
  reload = browserSync.reload;

// Development
let lintJS = () => {
  return src(`scripts/main.js`)
    .pipe(jsLinter())
    .pipe(jsLinter.format());
};

let lintCSS = () => {
  return src(`styles/main.css`)
    .pipe(
      CSSLinter({
        failAfterError: false,
        reporters: [{ formatter: `string`, console: true }]
      })
    );
};

let transpileJSForDev = () => {
  return src(`scripts/main.js`)
    .pipe(babel())
    .pipe(dest(`temp/scripts`));
};

// Production
let compressJS = () => {
  return src(`scripts/main.js`)
    .pipe(jsCompressor({ compress: true }))
    .pipe(dest(`prod/scripts`));
};

let compressHTML = () => {
  return src(`index.html`)
    .pipe(htmlCompressor({ collapseWhitespace: true }))
    .pipe(dest(`prod`));
};

let compressCSS = () => {
  return src(`styles/main.css`)
    .pipe(cssCompressor())
    .pipe(dest(`prod/styles`));
};

let copyUnprocessedAssetsForProd = () => {
  return src(
    [
      `./**/*`,
      `!.git/**`,
      `!index.html`,
      `!styles/main.css`,
      `!scripts/**`,
      `!prod/**`,
      `!temp/**`,
      `!.gitignore`,
      `!package.json`,
      `!package-lock.json`,
      `!node_modules/**`
    ],
    { base: `.`, dot: true }
  ).pipe(dest(`prod`));
};

async function clean() {
  const foldersToDelete = await deleteAsync([`./temp`, `prod`]);
  console.log(`The following directories were deleted:`, foldersToDelete);
}

let serve = () => {
  browserSync({
    notify: true,
    reloadDelay: 50,
    server: {
      baseDir: [`temp`, `.`]
    }
  });

    watch(`scripts/main.js`, series(lintJS, transpileJSForDev))
        .on(`change`, reload);

    watch(`styles/main.css`, lintCSS)
        .on(`change`, reload);

    watch(`img/**/*`)
        .on(`change`, reload);
};

exports.lintJS = lintJS;
exports.lintCSS = lintCSS;
exports.transpileJSForDev = transpileJSForDev;
exports.compressJS = compressJS;
exports.compressHTML = compressHTML;
exports.compressCSS = compressCSS;
exports.copyUnprocessedAssetsForProd = copyUnprocessedAssetsForProd;
exports.clean = clean;

exports.serve = series(
  lintJS,
  lintCSS,
  transpileJSForDev,
  serve);

exports.build = series(
  compressJS,
  compressHTML,
  compressCSS,
  copyUnprocessedAssetsForProd
);

exports.default = exports.serve;
