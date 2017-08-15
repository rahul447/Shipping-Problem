"use strict";

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    "babel": {
      "options": {
        "sourceMap": true,
        "presets": ["babel-preset-es2015"]
      },
      "dist": {
        "files": [{
          "expand": true,
          "cwd": "lib/",
          "src": ["**/*.es6"],
          "dest": "dist/",
          "ext": ".js"
        }]
      }
    },
    "clean": [
      "dist/"
    ],
    "watch": {
      "es6": {
        "files": ["lib/**/*.es6"],
        "tasks": ["babel:dist"]
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-clean");
  // Default task.
  grunt.registerTask("default", [
    "buildCommon"
  ]);

  // Common build task
  grunt.registerTask("buildCommon", [
    "clean",
    "babel"
  ]);
};
