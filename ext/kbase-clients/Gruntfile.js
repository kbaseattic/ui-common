module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            },
            my_target: {
                src : 'js_clients/*.js',
                dest : 'kbase-client-api.min.js',
            }
        }
    });

    grunt.registerTask('default', ['uglify']);
};
