// Karma configuration
// Generated on Thu Jul 30 2015 17:38:26 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '.',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
      // had to add these all by hand, or Karma goes bugnuts.
      /* These are the external dependencies. The bower components
       * come with a LOT of stuff that isn't necessary, and causes
       * problems when loaded in the test browser. Things like tests,
       * or auto-generated minified AND maxified files that overlap.
       * 
       * It's cleaner to just load the list of them by hand, then
       * have the Require apparatus take over.
       */
      {pattern: 'bower_components/jquery/dist/jquery.min.js', included: false},
      {pattern: 'bower_components/q/q.js', included: false},
      {pattern: 'bower_components/underscore/underscore-min.js', included: false},
      {pattern: 'bower_components/jquery-ui/jquery-ui.min.js', included: false},
      {pattern: 'bower_components/jquery-ui/themes/ui-lightness/jquery-ui.min.css', included: false},
      {pattern: 'bower_components/bootstrap/dist/js/bootstrap.min.js', included: false},
      {pattern: 'bower_components/bootstrap/dist/css/bootstrap.min.css', included: false},
      {pattern: 'bower_components/nunjucks/browser/nunjucks.min.js', included: false},
      {pattern: 'bower_components/spark-md5/spark-md5.min.js', included: false},
      {pattern: 'bower_components/lodash/lodash.min.js', included: false},
      {pattern: 'bower_components/postal.js/lib/postal.min.js', included: false},
      {pattern: 'bower_components/datatables/media/js/jquery.dataTables.min.js', included: false},
      {pattern: 'bower_components/datatables/media/css/jquery.dataTables.min.css', included: false},
      {pattern: 'bower_components/datatables-bootstrap3-plugin/media/js/datatables-bootstrap3.min.js', included: false},
      {pattern: 'bower_components/datatables-bootstrap3-plugin/media/css/datatables-bootstrap3.min.css', included: false},
      {pattern: 'bower_components/knockout/dist/knockout.debug.js', included: false},
      {pattern: 'bower_components/knockout-mapping/knockout.mapping.js', included: false},
      {pattern: 'bower_components/angular/angular.js', included: false},
      {pattern: 'bower_components/angular-ui/build/angular-ui.min.js', included: false},
      {pattern: 'bower_components/angular-ui-router/release/angular-ui-router.min.js', included: false},
      {pattern: 'bower_components/angular-ui-bootstrap-bower/ui-bootstrap.min.js', included: false},
      {pattern: 'bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min.js', included: false},
      {pattern: 'bower_components/blockUI/jquery.blockUI.js', included: false},
      {pattern: 'bower_components/d3/d3.min.js', included: false},
      {pattern: 'bower_components/d3-plugins-sankey/sankey.js', included: false},
      {pattern: 'bower_components/d3-plugins-sankey/sankey.css', included: false},
      {pattern: 'src/etc/jquery-svg-graph-stacked-area.js', included: false},
      {pattern: 'bower_components/node-uuid/uuid.js', included: false},
      {pattern: 'lib/canvastext.js', included: false}, 
      {pattern: 'lib/popit.js', included: false},
      {pattern: 'lib/knhx.js', included: false},
      {pattern: 'lib/googlepalette.js', included: false},
      {pattern: 'bower_components/google-code-prettify/bin/prettify.min.js', included: false},
      {pattern: 'bower_components/google-code-prettify/bin/prettify.min.css', included: false},
      {pattern: 'bower_components/ace-builds/src-min/ace.js', included: false},
      {pattern: 'bower_components/font-awesome/css/font-awesome.min.css', included: false},
      {pattern: 'bower_components/stacktrace-js/dist/stacktrace.min.js', included: false},

      {pattern: 'bower_components/requirejs-text/text.js', included: false},
      {pattern: 'bower_components/requirejs-json/json.js', included: false},
      {pattern: 'bower_components/require-yaml/yaml.js', included: false},
      {pattern: 'bower_components/js-yaml/dist/js-yaml.min.js', included: false},
      {pattern: 'build/*.yml', included: false},
      {pattern: 'functional-site/config.json', served: true, included: false},

      {pattern: 'src/**/*.js', included: false},
      {pattern: 'test/spec/*.js', included: false},

      'test/test-main.js',
    ],


    // list of files to exclude
    exclude: [
      '**/*.swp'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'src/**/!(datavis|Tiling_widget|postal.request-response.q).js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  })
}
