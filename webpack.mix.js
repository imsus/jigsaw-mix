let mix = require('laravel-mix')
var tailwind = require('tailwindcss')

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

mix
  .js(
    'source/_assets/js/index.js',
    mix.inProduction() ? 'build_production/js' : 'build_local/js'
  )
  .postCss(
    'source/_assets/css/style.css',
    mix.inProduction() ? 'build_production/css' : 'build_local/css',
    [tailwind('tailwind.js')]
  )
  .browserSync({
    proxy: false,
    server: 'build_local',
    files: [
      'build_local/**/*',
      {
        match: [
          'source/_layouts/**/*',
          'source/_assets/**/*',
          'source/**/*.blade.*'
        ],
        fn: function (event, file) {
          if (event === 'change') {
            const exec = require('child_process').exec
            exec('jigsaw build', (error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error}`)
                return
              }
              console.log(`${stdout}`)
              console.log(`${stderr}`)
            })
          }
        }
      }
    ]
  })

if (mix.inProduction()) {
  mix.options({
    purifyCss: {
      paths: ['build_local/**/*.html'],
      verbose: true
    }
  })
}

// Full API
// mix.js(src, output);
// mix.react(src, output); <-- Identical to mix.js(), but registers React Babel compilation.
// mix.ts(src, output); <-- Requires tsconfig.json to exist in the same folder as webpack.mix.js
// mix.extract(vendorLibs);
// mix.sass(src, output);
// mix.standaloneSass('src', output); <-- Faster, but isolated from Webpack.
// mix.fastSass('src', output); <-- Alias for mix.standaloneSass().
// mix.less(src, output);
// mix.stylus(src, output);
// mix.postCss(src, output, [require('postcss-some-plugin')()]);
// mix.browserSync('my-site.dev');
// mix.combine(files, destination);
// mix.babel(files, destination); <-- Identical to mix.combine(), but also includes Babel compilation.
// mix.copy(from, to);
// mix.copyDirectory(fromDir, toDir);
// mix.minify(file);
// mix.sourceMaps(); // Enable sourcemaps
// mix.version(); // Enable versioning.
// mix.disableNotifications();
// mix.setPublicPath('path/to/public');
// mix.setResourceRoot('prefix/for/resource/locators');
// mix.autoload({}); <-- Will be passed to Webpack's ProvidePlugin.
// mix.webpackConfig({}); <-- Override webpack.config.js, without editing the file directly.
// mix.then(function () {}) <-- Will be triggered each time Webpack finishes building.
// mix.options({
//   extractVueStyles: false, // Extract .vue component styling to file, rather than inline.
//   globalVueStyles: file, // Variables file to be imported in every component.
//   processCssUrls: true, // Process/optimize relative stylesheet url()'s. Set to false, if you don't want them touched.
//   purifyCss: false, // Remove unused CSS selectors.
//   uglify: {}, // Uglify-specific options. https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
//   postCss: [] // Post-CSS options: https://github.com/postcss/postcss/blob/master/docs/plugins.md
// });
