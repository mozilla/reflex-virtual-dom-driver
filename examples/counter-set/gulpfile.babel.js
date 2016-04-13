import browserify from 'browserify';
import gulp from 'gulp';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import gutil from 'gulp-util';
import watchify from 'watchify';
import child from 'child_process';
import http from 'http';
import path from 'path';
import babelify from 'babelify';
import sequencial from 'gulp-sequence';
import ecstatic from 'ecstatic';
import hmr from 'browserify-hmr';
import hotify from 'hotify';
import manifest from './package.json';

class Bundler {
  constructor(options) {
    this.options = options

    this.build = this.build.bind(this);
    this.plugin = []
    this.transform = []
    this.cache = {}
    this.entry = path.join
      ( options.input
      , options.main
      )


    if (options.babel != null) {
      this.transform.push(babelify)
    }

    if (options.hotreload != null) {
      this.plugin.push(hmr)
      this.transform.push(hotify)
    }

    this.bundler = browserify
    ( { entries: [this.entry]
      , debug:
        ( options.sourceMaps == null
        ? false
        : options.sourceMaps === false
        ? false
        : true
        )
      , cache: this.cache
      , transform: this.transform
      , plugin: this.plugin
      }
    )

    if (options.watch) {
      this.watcher =
        watchify(this.bundler)
        .on('update', this.build)
    }
  }
  bundle() {
    gutil.log(`Begin bundling: '${this.entry}'`);
    const output =
      ( this.options.watch
      ? this.watcher.bundle()
      : this.bundler.bundle()
      )
    return output
  }
  build() {
    const transforms =
      [ source(this.options.main)
      , buffer()
      , ( this.options.sourceMaps == null
        ? null
        : sourcemaps.init({loadMaps: true})
        )
      , ( this.options.compression == null
        ? null
        : uglify(this.options.compression)
        )
      , ( this.options.sourceMaps == null
        ? null
        : sourcemaps.write(this.options.sourceMaps.output)
        )
      , gulp.dest(this.options.output)
      ]

    const output =
      transforms.reduce
      ( (input, transform) =>
        ( transform != null
        ? input.pipe(transform)
        : input
        )
      , this
        .bundle()
        .on('error', (error) => {
          gutil.beep();
          console.error(`Failed to browserify: '${this.entry}'`, error.message)
        })
      )

    return output.on('end', () => gutil.log(`Completed bundling: '${this.entry}'`))
  }
}

var server = config => () => {
  var server = http.createServer(ecstatic({
    root: path.join(module.filename, config.root),
    cache: config.cache
  }));
  server.listen(config.port);
  gutil.log(`Navigate to http://localhost:${config.port}/`)
}
var bundler = config => () => new Bundler(config).build()


Object.keys(manifest.builds).forEach(name => {
  const config = manifest.builds[name]

  if (config.server) {
    gulp.task(`serve ${name}`, server(config.server))
    gulp.task(`build ${name}`, bundler(config))
    gulp.task(name, sequencial(`build ${name}`, `serve ${name}`))
  }
  else {
    gulp.task(name, bundler(config))
  }
})
