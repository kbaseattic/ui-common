
/*global
 module
 */
/*jslint
 white: true
 */

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            build: {
                files: [{
                        src: 'config/prod.yml',
                        dest: 'build/client/config.yml'
                    },
                    {
                        src: 'config/ui.yml',
                        dest: 'build/client/ui.yml'
                    },
                    {
                        cwd: 'app/client',
                        src: '**/*',
                        dest: 'build/client',
                        expand: true
                    },
                    {
                        cwd: 'lib',
                        src: '**/*',
                        dest: 'build/client/lib',
                        expand: true
                    },
                    {
                        cwd: 'plugins',
                        src: '**/*',
                        dest: 'build/client/plugins',
                        expand: true
                    },
                    {
                        cwd: 'data',
                        src: '**/*',
                        dest: 'build/client/data',
                        expand: true
                    }
                ]
            },
            bower: {
                blockuid: {
                    nonull: true,
                    cwd: 'bower_components/blockUI',
                    src: 'jquery.blockUI.js',
                    xdest: 'build/client/bower_components/blockUI',
                    dest: 'build',
                    expand: false
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('build', [
        'copy:build'
    ]);
};