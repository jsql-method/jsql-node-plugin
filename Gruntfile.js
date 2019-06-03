/*
 * Copyright (c) 2017-2019 JSQL Sp. z.o.o. (Ltd, LLC) www.jsql.it
 * See LICENSE or https://jsql.it/public-packages-license
 */

'use strict';

module.exports = function (grunt) {

    grunt.initConfig({

        clean: {
            files: ['dist']
        },

        uglify: {
            options: {
                mangle: false
            },
            target: {
                files: {
                    'dist/index.js': ['src/jsql-node.js']
                }
            }
        },

        copy: {

            dist: {

                files: [
                    {
                        expand: true,
                        cwd: '.',
                        src: ['LICENSE.md', 'package.json'],
                        dest: './dist'
                    }
                ]

            }

        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['clean', 'copy', 'uglify']);

};
