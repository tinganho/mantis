
var jshintGlobals = require('jshint-globals')
  , compassRequires = ['susy', 'compass-placeholder', 'compass-retina-sprites', 'toolkit', 'animation', 'compass-h5bp'];

module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({
    jshint: {
      options: {
        curly : true,
        eqeqeq : true,
        loopfunc : true,
        forin : false,
        immed : true,
        latedef : true,
        newcap : true,
        noarg : true,
        sub : true,
        undef : true,
        boss : true,
        eqnull : true,
        node : true,
        es5 : true,
        supernew : true,
        laxbreak : true,
        strict : true,
        expr : true,
        laxcomma : true,
        globals: {

          // Native DOM
          open : true,
          document : true,
          navigator : true,
          confirm : true,
          performance : true,
          alert : true,
          window : true,
          Image : true,
          FileReader : true,
          localStorage : true,
          sessionStorage : true,
          cancelAnimationFrame : true,
          requestAnimationFrame : true,
          FormData : true,
          atob : true,
          Blob : true,
          Uint8Array : true,

          // Mocha testing
          describe : true,
          it : true,
          before : true,

          // Libs
          define : true,
          requirejs : true,
          Modernizr : true,
          mixpanel : true,

          // Application
          App             : true,
          cf              : true,
          loginTmpl       : true,
          streetstyleTmpl : true,
          tmpl            : true,
          ENV             : true,
          terms           : true,
          JPEG            : true,
          URL             : true
        }
      },

      files: [
        'grunt.js',
        'application/**/*.js',
        'lib/**/*.js',
        '!application/build/tmpl.js',
        '!application/vendor/**',
        '!application/public/templates/**/*.js',
        '!application/public/scripts/**/*.js',
        '!application/translations/output/**/*.js',
        'src/**/*.js'
      ]
    },


    compass : {
      documents : {
        options : {
          require : compassRequires,
          sassDir : 'application/documents/styles',
          cssDir : 'application/public/styles/documents',
          debugInfo : true,
          noLineComments : true,
          imagesDir : 'application/public/images',
          relativeAssets : true
        }
      },

      content : {
        options : {
          require : compassRequires,
          sassDir : 'application/content/styles',
          cssDir : 'application/public/styles/content',
          debugInfo : true,
          noLineComments : true,
          imagesDir : 'application/public/images',
          relativeAssets : true
        }
      }
    },

    watch: {

      jshint : {
        files: [
          '**/*.js'
        ],
        tasks: ['jshint']
      },

      loginTemplates: {
        files: [
          'application/components/**/*.{dot,part}',
          'application/modules/**/*.{dot,part}',
          'application/scaffolds/**/*.{dot,part}',
          '!application/modules/streetstyle/**/*.{dot,part}',
          '!application/scaffolds/streetstyle/**/*.{dot,part}'
        ],
        tasks: ['dot:devLogin']
      },

      streetStyleTemplates: {
        files: [
          'application/components/**/*.{dot,part}',
          'application/modules/streetstyle/**/*.{dot,part}',
          'application/scaffolds/streetstyle/**/*.{dot,part}'
        ],
        tasks: ['dot:devStreetstyle']
      },

      compass: {
        files: ['application/**/*.scss'],
        tasks: ['compass:dev']
      }
    },

    clean: {
      app: [
        'dist',
        'application/public/styles/*',
        'application/public/scripts/*',
        'application/public/images-webp/*',
        'application/public/tmp/*',
        'application/public/uploads/*',
        'application/public/templates/*'
      ],
      dist: [
        'dist/vendor/**/*',
        '!dist/vendor/requirejs/*.require.js',
        '!dist/vendor/modernizr/*.modernizr.js',
        'dist/components'
      ],
      deploy: ['deploy'],
      css: ['application/public/styles/*']
    },

    rev: {
      options: {
        algorithm: 'sha1',
        length: 8
      },
      files: {
        src: [
          'dist/public/styles/**/*.css',
          'dist/public/conf/**/*.js',
          'dist/public/scripts/**/*.js',
          'dist/vendor/modernizr/modernizr.js',
          'dist/vendor/requirejs/require.js',
          'dist/modules/device/features.js',
          'dist/public/images/**/*.{png,jpg}',
          '!dist/public/images/main/**/*',
          '!dist/public/images/main2x/**/*',
          '!dist/public/images/flags/**/*',
          '!dist/public/images/flags2x/**/*',
          'dist/public/images-webp/**/*.webp',
        ]
      }
    },

    dot : {
      core : {
        options : {
          variable : 'tmpl',
          requirejs : true,
          node : true
        },
        src : ['application/core/**/*.dot'],
        dest : 'application/public/templates/core/templates.js'
      },

      documents : {
        options : {
          variable : 'tmpl',
          requirejs : true,
          node : true
        },
        src : ['application/documents/**/*.dot'],
        dest : 'application/public/templates/documents/templates.js'
      },

      layouts : {
        options : {
          variable : 'tmpl',
          requirejs : true,
          node : true
        },
        src : ['application/layouts/**/*.dot'],
        dest : 'application/public/templates/layouts/templates.js'
      },

      content_app : {
        options : {
          variable : 'tmpl',
          requirejs : true,
          node : true
        },
        src : [
          'application/content/translations/**/*.dot',
          'application/content/search/**/*.dot',
          'application/content/translation/**/*.dot'
        ],
        dest : 'application/public/templates/content/app.js'
      }
    },

    mocha: {
      test: {
        src: ['interface/specifications/*.html'],
        options: {
          run: false,
          reporter: './node_modules/mocha/lib/reporters/spec.js'
        }
      },
    },

    translate: {
      dist: {
        options: {
          config          : './application/translations',
          requirejs       : true,
          defaultLanguage : 'en', // grunt-translate use it to update translation.
          output          : './application/translations/output',
          src             : ['./application/**/*.js', '!./application/vendor/**/*.js'],
          interface: {
            autoOpen : false,
            port     : 3001
          }
        }
      }
    },

    useminPrepare: {
      html: 'application/profiles/p1/lib/templates/layout/login-shell.dot',
      options: {
        dest: 'dist'
      }
    },

    usemin: {
      html: ['dist/**/*.dot', 'dist/**/*.part'],
      css: ['dist/**/*.css', '!dist/vendor/**'],
      options: {
        root : 'dist',
        basedir : 'dist',
        dirs: ['dist']
      }
    },

    copy: {
      main: {
        files: [
          {expand: true, cwd: 'application/', src: ['**'], dest: 'dist/'}, // makes all src relative to cwd
        ]
      }
    },



    uglify: {
      dist: {
        files: {
          'dist/vendor/requirejs/require.js'   : ['dist/vendor/requirejs/require.js'],
          'dist/vendor/modernizr/modernizr.js' : ['dist/vendor/modernizr/modernizr.js'],
          'dist/translations/output/en.js'     : ['dist/translations/output/en.js'],
          'dist/translations/output/zh.js'     : ['dist/translations/output/zh.js']
        }
      }
    },

    webp: {
      dev : {
        expand: true,
        cwd : 'application/public/images',
        src : [
          '*.{jpg,png}',
          'mobile/*.{jpg,png}',
          'streetstyle/*.{jpg,png}'
        ],
        dest : 'application/public/images-webp'
      },
      dist : {
        expand: true,
        cwd: 'dist/public/images',
        src: [
          '*.{jpg,png}',
          'mobile/*.{jpg,png}',
          'streetstyle/*.{jpg,png}'
        ],
        dest: 'dist/public/images-webp'
      },
      options: {
        lossless: true,
      }
    },

    requirejs: {
    }


  });

  // Build task
  grunt.registerTask('build', [
    'clean:app',
    'compass:dist',
    'dot:devLogin',
    'dot:devStreetstyle',
    'requirejs',
    'copy:main',
    'webp:dist',
    'uglify:dist',
    'rev',
    'usemin',

    // // Because the dot templates has changed
    // // we need to run the process again
    'dot:distLogin',
    'dot:distStreetstyle'
  ]);

  grunt.registerTask('deploy', [
    'clean:deploy',
    'zip:dist',
    'sftp-deploy:dist',
    'clean:deploy'
  ]);

  grunt.registerTask('css', [
    'clean:css',
    'compass:dev',
    'webp'
  ]);

  // Loading of NPM tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-dot-compiler');
  grunt.loadNpmTasks('grunt-sftp-deploy');
  grunt.loadNpmTasks('grunt-rev');
  grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks('grunt-webp');
  grunt.loadNpmTasks('grunt-contrib-uglify');

};
