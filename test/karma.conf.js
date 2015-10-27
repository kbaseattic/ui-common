// Karma configuration
// Generated on Thu Jul 30 2015 17:38:26 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'requirejs'],

    // list of Karma plugins to use
    // This is someone redundant with what's in package.json,
    // but I like it to be explicit here.
    plugins: [
        'karma-jasmine',
        'karma-phantomjs-launcher',
        'karma-coverage',
        'karma-requirejs',
    ],


    // list of files / patterns to load in the browser
    // currently, should load everything but the search subdirectory.
    // This 'loading' just includes them in the paths provided
    // Karma's webserver
    files: [
      {pattern: 'build/client/!(search)/**/*.js', included: false},
      {pattern: 'build/client/!(search)/**/*.css', included: false},
      {pattern: 'build/client/js/require-config.js', included: true},
      {pattern: 'build/client/*.yml', included: false},
      {pattern: 'test/spec/**/*.js', included: false},

      'test/test-main.js',
    ],


    // list of files to exclude
    exclude: [
      '**/*.swp'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'build/client/!(bower_components)/**/*.js': ['coverage']
    },

    coverageReporter: {
      dir: 'build/test-coverage/',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcov', subdir: 'lcov' }
      ]
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
