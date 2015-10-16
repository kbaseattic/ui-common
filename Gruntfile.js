'use strict';
var path = require('path');
var iniParser = require('node-ini');

module.exports = function (grunt) {
    // Config
    // TODO: maybe read something from the runtime/config directory so we don't 
    // need to tweak this and accidentally check it in...
    var RUNTIME_DIR = '../../runtime';
    var BUILD_DIR = RUNTIME_DIR + '/build';
    BUILD_DIR = 'build';
    
    function buildDir(subdir) {
        if (subdir) {
            return path.normalize(BUILD_DIR + '/' + subdir);
        } 
        return path.normalize(BUILD_DIR);
    }
    
    // Project configuration
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-filerev');
    grunt.loadNpmTasks('grunt-regex-replace');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-shell');

    var deployCfg = iniParser.parseSync('deploy.cfg');

    /* 
     * This section sets up a mapping for bower packages.
     * Believe it or not this is shorter and easier to maintain 
     * than plain grunt-contrib-copy
     * 
     */
    var bowerFiles = [
        {
            name: 'require',
            dir: 'requirejs'
        },
        {
            name: 'jquery',
            src: ['dist/jquery.js']
        },
        {
            name: 'jquery-ui',
            src: ['jquery-ui.js', 'themes/ui-lightness/**/*']
        },
        {
            name: 'bootstrap',
            src: 'dist/**/*'
        },
        {
            name: 'bluebird',
            src: ['js/browser/bluebird.js']
        },
        {
            name: 'd3'
        },
        {
            name: 'd3-plugins-sankey',
            src: ['sankey.js', 'sankey.css']
        },
        {
            name: 'nunjucks',
            path: 'browser'
        },
        {
            name: 'spark-md5'
        },
        {
            name: 'lodash'
        },
        {
            name: 'postal',
            dir: 'postal.js',
            path: 'lib'
        },
        {
            name: 'domReady',
            dir: 'requirejs-domready'
        },
        {
            name: 'text',
            dir: 'requirejs-text'
        },
        {
            name: 'json',
            dir: 'requirejs-json'
        },
        {
            name: 'yaml',
            dir: 'require-yaml'
        },
        {
            name: 'require-css',
            src: 'css.js'
        },
        {
            name: 'underscore'
        },
        {
            name: 'datatables',
            path: 'media',
            src: ['css/jquery.dataTables.css', 'images/*', 'js/jquery.dataTables.js']
        },
        {
            name: 'datatables-bootstrap3',
            dir: 'datatables-bootstrap3-plugin',
            path: 'media',
            src: ['css/datatables-bootstrap3.css', 'js/datatables-bootstrap3.js']
        },
        {
            name: 'knockout',
            path: 'dist'
        },
        {
            name: 'knockout-mapping',
            src: 'knockout.mapping.js'
        },
        {
            name: 'blockUI',
            src: 'jquery.blockUI.js',
        },
        {
            name: 'uuid',
            dir: 'node-uuid'
        },
        {
            name: 'google-code-prettify',
            path: 'bin',
            src: ['prettify.min.js', 'prettify.min.css']
        },
        {
            name: 'font-awesome',
            src: ['css/font-awesome.css', 'fonts/*']
        },
        {
            name: 'stacktrace',
            dir: 'stacktrace-js',
            path: 'dist'
        },
        {
            name: 'js-yaml',
            path: 'dist'
        },
        {
            name: 'handlebars',
            src: 'handlebars.amd.js'
        },
        // And some plugins too...
        {
            name: 'kb-ui-plugin-demo',
            src: 'src/**/*'
        },
        {
            name: 'kbase-ui-plugin-sample',
            src: 'src/**/*'
        },
         {
            name: 'kbase-ui-plugin-databrowser',
            src: 'src/**/*'
        },
         {
            dir: 'kbase-data-api-js-wrappers',
            cd: 'dist/bower/pkg/js',
            src: '**/*'
        },
        {
            dir: 'thrift-binary-protocol',
            cd: 'src',
            src: '**/*'
        },
        {
            dir: 'kbase-ui-plugin-vis-widgets',
            src: '**/*'
        }
        
//        {
//            dir: 'kbase-ui-plugin-demo-vis-widget',
//            src: '**/*'
//        }
    ],

    bowerCopy = bowerFiles.map(function (cfg) {
        // path is like dir/path/name
        var path = [];
        // dir either dir or name is the first level directory.
        // path.unshift(cfg.dir || cfg.name);

        // If there is a path (subdir) we add that too.
        if (cfg.path) {
            path.unshift(cfg.path);
        }

        // Until we get a path which we use as a prefix to the src.
        var pathString = path
            .filter(function (el) {
                if (el === null || el === undefined || el === '') {
                    return false;
                }
                return true;
            })
            .join('/');
        // console.log(path);


        var srcs;
        if (cfg.src === undefined) {
            srcs = [cfg.name + '.js'];
        } else {
            if (typeof cfg.src === 'string') {
                srcs = [cfg.src];
            } else {
                srcs = cfg.src;
            }
        }

        var sources = srcs.map(function (s) {
            return [pathString, s]
                .filter(function (el) {
                    if (el === null || el === undefined || el === '') {
                        return false;
                    }
                    return true;
                })
                .join('/');

        });

        var cd = cfg.cd;
        var entry = {
            nonull: true,
            expand: true,
            cwd: 'bower_components/' + (cfg.dir || cfg.name) + (cd ? '/' + cd : ''),
            src: sources,
            dest: 'build/client/bower_components/' + (cfg.dir || cfg.name)
        };
        // console.log(entry);
        return entry;
    });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            build: {
                files: [
                    {
                        src: 'config/prod.yml',
                        dest: buildDir('client/config.yml')
                    },
                    {
                        src: 'config/ui-prod.yml',
                        dest: buildDir('client/ui.yml')
                    },
                    {
                        cwd: 'src/app/client',
                        src: '**/*',
                        dest: buildDir('client'),
                        expand: true
                    },
                    {
                        cwd: 'lib',
                        src: '**/*',
                        dest: buildDir('client/lib'),
                        expand: true
                    },
                    {
                        cwd: 'src/plugins',
                        src: '**/*',
                        dest: buildDir('client/plugins'),
                        expand: true
                    },
                    {
                        cwd: 'src/data',
                        src: '**/*',
                        dest: buildDir('client/data'),
                        expand: true
                    },
                    {
                        cwd: 'src/app/server',
                        src: '**/*',
                        dest: buildDir('server'),
                        expand: true
                    },
                    {
                        src: 'loading.html',
                        dest: buildDir('client/loading.html')
                    }
                ]
            },
            'config-prod': {
                files: [
                    {
                        src: 'config/prod.yml',
                        dest: 'build/client/config.yml'
                    },
                    {
                        src: 'config/ui-prod.yml',
                        dest: 'build/client/ui.yml'
                    }
                ]
            },
            'config-test': {
                files: [
                    {
                        src: 'config/ci.yml',
                        dest: 'build/client/config.yml'
                    },
                    {
                        src: 'config/ui-test.yml',
                        dest: 'build/client/ui.yml'
                    }
                ]
            },
            bower: {
                files: bowerCopy
            },
            deploy: {
                files: [
                    {
                        cwd: 'build/client',
                        src: '**/*',
                        dest: deployCfg['ui-common']['deploy_target'],
                        expand: true
                    }
                ]
            },
        },
        clean: {
            build: {
                src: [buildDir()],
                // We force, because our build directory is up a level 
                // in the runtime directory.
//                options: {
//                    force: true
//                }
            }
        },
        connect: {
            server: {
                port: 8887,
                base: 'build/client',
                keepalive: false,
                onCreateServer: function (server, connect, options) {
                    console.log('created...');
                }
            }
        },
        'http-server': {
            dev: {
                root: buildDir('client'),
                port: 8887,
                host: '0.0.0.0',
                autoIndex: true,
                runInBackground: true
            }
        },
        open: {
            dev: {
                path: 'http://localhost:8887'
            }
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
                        replace: function (match) {
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
                        {type: 'html', subdir: 'html'},
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
        bower: {
            install: {
                options: {
                    copy: false
                }
            }
        },
        markdown: {
            build: {
                files: [
                    {
                        expand: true,
                        src: 'src/docs/**/*.md',
                        dest: buildDir('docs'),
                        ext: '.html'
                    }
                ],
                options: {
                }
            }
        },
        shell: {
            config: {
                command: [
                    'node',
                    'tools/process_config.js'
                ].join(' '),
                options: {
                    stderr: false
                }
            }
        },

    });

    // Does the whole building task
    grunt.registerTask('build', [
        'bower:install',
        'copy:build',
        'copy:bower',
        'shell:config'
        // 'copy:config-prod'
    ]);

    grunt.registerTask('build-test', [
        'bower:install',
        'copy:build',
        'copy:bower',
        'copy:config-test'
    ]);

    grunt.registerTask('deploy', [
        'copy:deploy'
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

    grunt.registerTask('preview', [
        'open:dev',
        'connect'
    ]);
};
