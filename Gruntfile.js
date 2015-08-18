'use strict';
var path = require('path');

module.exports = function(grunt) {
    // Project configuration
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-filerev');
    grunt.loadNpmTasks('grunt-regex-replace');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-coveralls');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        'copy': {
            'kbase-config': {
                src: 'config/prod.yml',
                dest: 'build/client/config.yml'
            },
            'ui-config': {
                src: 'config/ui.yml',
                dest: 'build/client/ui.yml'
            },
            client: {
                cwd: 'app/client',
                src: '**/*', 
                dest: 'build/client',
                expand: true
            },
            bower: {
                cwd: 'bower_components',
                src: '**/*',
                dest: 'build/client/bower_components',
                expand: true
            },
            lib: {
                cwd: 'lib',
                src: '**/*',
                dest: 'build/client/lib',
                expand: true
            },
            plugins: {
                cwd: 'plugins',
                src: '**/*',
                dest: 'build/client/plugins',
                expand: true
            }
        },
        
        clean: {
            build: ['build']
        },

        // Compile the requirejs stuff into a single, uglified file.
        // the options below are taken verbatim from a standard build.js file
        // used for r.js (if we were doing this outside of a grunt build)
    //    'requirejs': {
    //        compile: {
    //            options: {
     //               baseUrl: ".",
    //                mainConfigFile: "app/client/require-config.js",
    //                findNestedDependencies: true,
    //                optimize: "uglify2",
    //                generateSourceMaps: true,
    //                preserveLicenseComments: false,
    //                name: "functional-site/js/require-config",
    //                out: "functional-site/js/dist/kbase-min.js"
    //            }
    //        }
    //    },

        // Put a 'revision' stamp on the output file. This attaches an 8-character 
        // md5 hash to the end of the requirejs built file.
        'filerev': {
            options: {
                algorithm: 'md5',
                length: 8
            },
            source: {
                files: [{
                    src: [
                        'functional-site/js/dist/kbase-min.js',
                    ],
                    dest: 'functional-site/js/dist/'
                }]
            }
        },

        // Once we have a revved file, this inserts that reference into page.html at
        // the right spot (near the top, the narrative_paths reference)
        'regex-replace': {
            dist: {
                src: ['functional-site/index.html'],
                actions: [
                    {
                        name: 'requirejs-onefile',
                        search: 'js/require-config.js',
                        replace: function(match) {
                            // do a little sneakiness here. we just did the filerev thing, so get that mapping
                            // and return that (minus the .js on the end)
                            var revvedFile = grunt.filerev.summary['functional-site/js/dist/kbase-min.js'];
                            // starts with 'functional-site/' so return all but the first 16 characters
                            return revvedFile.substr(16);
                        },
                        flags: ''
                    }
                ]
            }
        },

        // Testing with Karma!
        'karma': {
            unit: {
                configFile: 'test/karma.conf.js'
            },
            dev: {
                // to do - add watch here
                configFile: 'test/karma.conf.js',
                reporters: ['progress', 'coverage'],
                coverageReporter: {
                    dir: 'build/test-coverage/',
                    reporters: [
                        { type: 'html', subdir: 'html' },
                    ],
                },

                autoWatch: true,
                singleRun: false,

            }
        },

        // Run coveralls and send the info.
        'coveralls': {
            options: {
                force: true,
            },
            'ui-common': {
                src: 'build/test-coverage/lcov/**/*.info',
            },
        },

    });

    // Does the task of building the main config file.
    // **Might get moved to an external shell script if this gets
    // more complex.
    grunt.registerTask('build-config', [
        'copy'
    ]);
    
    grunt.registerTask('clean', [
        'clean'
    ]);

    // Does the whole building task
    grunt.registerTask('build', [
        'build-config'
        //'requirejs',
        //'filerev',
        //'regex-replace'
    ]);

    // Does a single, local, unit test run.
    grunt.registerTask('test', [
        'karma:unit',
    ]);

    // Does a single unit test run, then sends 
    // the lcov results to coveralls. Intended for running
    // from travis-ci.
    grunt.registerTask('test-travis', [
        'karma:unit',
        'coveralls'
    ]);

    // Does an ongoing test run in a watching development
    // mode.
    grunt.registerTask('develop', [
        'karma:dev',
    ]);
};