/**
 * Grunt build/deployment script for Echo Reference Solutions.
 *
 * Environment setup:
 * 1. npm install
 * 2. Copy config-sample.json to config.json and edit the file to supply your
 *    API keys and settings.
 * 3. Run "grunt deploy" and/or other scripts as desired.
 */

module.exports = function(grunt) {
    "use strict";

    grunt.util.linefeed = '\n';

    var apps = [ "gallery", "poll" ];
    var config = grunt.file.readJSON('config.json');

    grunt.initConfig({
        config: config,
        pkg: grunt.file.readJSON('package.json'),
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: [ 'package.json' ],
                createTag: false,
                push: true,
                pushTo: 'upstream',
            }
        },
        aws: grunt.file.readJSON('config.json'),
        aws_s3: {
            options: {
                accessKeyId: '<%= config.aws.key %>',
                secretAccessKey: '<%= config.aws.secret %>',
                uploadConcurrency: 5,
                downloadConcurrency: 5,
            },
            dev: {
                options: {
                    bucket: '<%= config.aws.bucket %>',
                    differential: true
                },
                files: [
                    {expand: true, cwd: 'apps/', src: ['**'], dest: 'dev/apps/'},
                    {expand: true, cwd: 'plugins/', src: ['**'], dest: 'dev/plugins/'},
                    {expand: true, cwd: 'polyfills/', src: ['**'], dest: 'dev/polyfills/'},
                    {expand: true, cwd: 'controls/', src: ['**'], dest: 'dev/controls/'},
                   //{dest: 'src/app', action: 'delete'},
                ]
            },
            beta: {
                options: {
                    bucket: '<%= config.aws.bucket %>',
                    differential: true
                },
                files: [
                    {expand: true, cwd: 'apps/', src: ['**'], dest: 'beta/apps/'},
                    {expand: true, cwd: 'plugins/', src: ['**'], dest: 'beta/plugins/'},
                    {expand: true, cwd: 'polyfills/', src: ['**'], dest: 'beta/polyfills/'},
                    {expand: true, cwd: 'controls/', src: ['**'], dest: 'beta/controls/'},
                   //{dest: 'src/app', action: 'delete'},
                ]
            },
            prod: {
                options: {
                    bucket: '<%= config.aws.bucket %>',
                    differential: true
                },
                files: [
                    {expand: true, cwd: 'apps/', src: ['**'], dest: 'apps/'},
                    {expand: true, cwd: 'plugins/', src: ['**'], dest: 'plugins/'},
                    {expand: true, cwd: 'polyfills/', src: ['**'], dest: 'polyfills/'},
                    {expand: true, cwd: 'controls/', src: ['**'], dest: 'controls/'},
                   //{dest: 'src/app', action: 'delete'},
                ]
            },
        },
        invalidate_cloudfront: {
            options: {
                key: '<%= config.aws.key %>',
                secret: '<%= config.aws.secret %>',
                distribution: '<%= config.aws.distribution %>'
            },
            production: {
                files: [{
                    expand: true,
                    cwd: './apps/',
                    src: ['**/*.js', '**/*.json'],
                    filter: 'isFile',
                    dest: 'apps/'
                }, {
                    expand: true,
                    cwd: './controls/',
                    src: ['**/*.js', '**/*.json'],
                    filter: 'isFile',
                    dest: 'controls/'
                }, {
                    expand: true,
                    cwd: './plugins/',
                    src: ['**/*.js', '**/*.json'],
                    filter: 'isFile',
                    dest: 'plugins/'
                }, {
                    expand: true,
                    cwd: './polyfills/',
                    src: ['**/*.js', '**/*.json', '**/*.png', '**/*.css'],
                    filter: 'isFile',
                    dest: 'polyfills/'
                }]
            }
        },
        html2js: {
            options: {
                base: "apps",
                target: "js",
                rename: function (moduleName) {
                    return '/' + moduleName.replace('.tpl.html', '');
                },
                fileHeaderString: "/* Generated by Grunt, do not edit directly. */",
                useStrict: true
            },
            main: {
                src: ['apps/**/*.tpl.html'],
                dest: 'apps/dashboard-templates.js'
            },
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-aws-s3');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-invalidate-cloudfront');
    grunt.loadNpmTasks('grunt-html2js');

    // Default task
    grunt.registerTask('default', [ ]);

    // Watch dev files for recompilation requirements
    grunt.registerTask('watch', [ 'watch' ]);

    // TODO: Should do a TIDY here. Our template processing is pretty crude, and
    // we don't handle these like unclosed-SELECT elements very well.
    grunt.registerTask('cc', [ 'html2js' ]);

    // Deployment tasks
    grunt.registerTask('deploy-dev', [ 'cc', 'aws_s3:dev' ]);
    grunt.registerTask('deploy-beta', [ 'cc', 'aws_s3:beta' ]);
    grunt.registerTask('deploy-prod', [ 'cc', 'aws_s3:prod', 'invalidate_cloudfront' ]);
};
