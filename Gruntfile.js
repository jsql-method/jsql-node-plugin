/*
 * jsql-node
 *
 * Copyright (c) 2018 JSQL
 * Licensed under the ISC license.
 */

"use strict";

module.exports = function(grunt) {
  grunt.initConfig({
    express: {
      server: {
        options: {
          port: 9000,
          bases: "public"
        }
      }
    },
    clean: {
      files: ["dist"]
    },

    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: ".",
            src: [
              "isc.md",
              "jsql-node.d.ts",
              "package.json",
              "src/message-helper.js",
              "src/validate-env.js",
              "src/member-options.js",
              "src/hash-to-query.js",
              "src/params-to-sqlquery.js",
              "src/database-postgresql.js",
              "src/database-mysql.js",
              "src/database-proxy.js",
              "src/status-codes.js",
              "src/jsql-node-plugin.js"
            ],
            dest: "./dist"
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-clean");

  grunt.registerTask("default", ["clean", "copy"]);
};
