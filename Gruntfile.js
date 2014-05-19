
var jshintGlobals = require('jshint-globals')
  , compassRequires = ['susy', 'compass-placeholder', 'compass-retina-sprites', 'toolkit', 'animation', 'compass-h5bp'];

module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        loopfunc: true,
        forin: false,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true,
        supernew: true,
        laxbreak: true,
        strict: true,
        expr: true,
        laxcomma: true,
        globals: {

          // Native DOM
          open: true,
          document: true,
          navigator: true,
          confirm: true,
          performance: true,
          alert: true,
          window: true,
          Image: true,
          FileReader: true,
          localStorage: true,
          sessionStorage: true,
          cancelAnimationFrame: true,
          requestAnimationFrame: true,
          FormData: true,
          atob: true,
          Blob: true,
          Uint8Array: true,

          // Mocha testing
          describe: true,
          it: true,
          before: true,

          // Libs
          define: true,
          requirejs: true,
          Modernizr: true,
          mixpanel: true,

          // Application
          aoo: true,
          App: true,
          cf: true,
          loginTmpl: true,
          streetstyleTmpl: true,
          tmpl: true,
          ENV: true,
          terms: true,
          JPEG: true,
          URL: true
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


    compass: {
      dev_documents: {
        options: {
          config: 'application/configurations/compass.rb',
          require: compassRequires,
          sassDir: 'documents/styles',
          cssDir: 'public/styles/documents',
          debugInfo: true,
          noLineComments: true,
          imagesDir: 'application/public/images'
        }
      },

      dev_contents: {
        options: {
          config: 'application/configurations/compass.rb',
          require: compassRequires,
          sassDir: 'contents/styles',
          cssDir: 'public/styles/contents',
          debugInfo: true,
          noLineComments: true,
          imagesDir: 'public/images'
        }
      },

      dist_documents: {
        options: {
          config: 'application/configurations/compass.rb',
          require: compassRequires,
          sassDir: 'documents/styles',
          cssDir: 'public/styles/documents',
          debugInfo: true,
          noLineComments: true,
          imagesDir: 'public/images',
          outputStyle: 'compressed'
        }
      },

      dist_contents: {
        options: {
          config: 'application/configurations/compass.rb',
          require: compassRequires,
          sassDir: 'contents/styles',
          cssDir: 'public/styles/contents',
          debugInfo: true,
          noLineComments: true,
          imagesDir: 'public/images',
          outputStyle: 'compressed'
        }
      }
    },

    watch: {
      jshint: {
        files: [
          'application/contents/**/*.js',
          'application/configurations/**/*.js',
          'application/core/**/*.js',
          'application/libraries/**/*.js'
        ],
        tasks: ['jshint']
      },

      templates : {
        files: [
          'application/contents/**/*.{part,dot}',
          'application/layouts/**/*.{part,dot}',
          'application/documents/**/*.{part,dot}'
        ],
        tasks: ['dot']
      },

      compass_documents: {
        files: [
          'application/documents/**/*.scss',
          'application/layouts/**/*.scss',
          'application/components/**/*.scss'
        ],
        tasks: ['compass:dev_documents']
      },

      compass_contents: {
        files: ['application/contents/**/*.scss'],
        tasks: ['compass:dev_contents']
      }
    },

    clean: {
      app: [
        'distribution',
        'application/public/styles/*',
        'application/public/scripts/configurations/*',
        'application/public/scripts/distribution/*',
        'application/public/images-webp/*',
        'application/public/tmp/*',
        'application/public/uploads/*',
        'application/public/templates/*'
      ],
      deploy: ['deploy'],
      css: ['application/public/styles/*']
    },

    copy: {
      dist: {
        files: [
          { expand: true, cwd: 'application/', src: ['**'], dest: 'distribution/' }
        ]
      }
    },

    dot: {
      dev_core: {
        options: {
          variable: 'tmpl',
          requirejs: true,
          node: true
        },
        src: ['application/core/**/*.dot'],
        dest: 'application/public/templates/core/templates.js'
      },

      dev_documents: {
        options: {
          variable: 'tmpl',
          requirejs: true,
          node: true
        },
        src: ['application/documents/**/*.dot'],
        dest: 'application/public/templates/documents/templates.js'
      },

      dev_layouts: {
        options: {
          variable: 'tmpl',
          requirejs: true,
          node: true
        },
        src: ['application/layouts/**/*.dot'],
        dest: 'application/public/templates/layouts/templates.js'
      },

      dev_content_app: {
        options: {
          variable: 'tmpl',
          requirejs: true,
          node: true
        },
        src: [
          'application/contents/share/**/*.dot'
        ],
        dest: 'application/public/templates/content/templates.js'
      },

      dist_core: {
        options: {
          variable: 'tmpl',
          requirejs: true,
          node: true
        },
        src: ['distribution/core/**/*.dot'],
        dest: 'distribution/public/templates/core/templates.js'
      },

      dist_documents: {
        options: {
          variable: 'tmpl',
          requirejs: true,
          node: true
        },
        src: ['distribution/documents/**/*.dot'],
        dest: 'distribution/public/templates/documents/templates.js'
      },

      dist_layouts: {
        options: {
          variable: 'tmpl',
          requirejs: true,
          node: true
        },
        src: ['distribution/layouts/**/*.dot'],
        dest: 'distribution/public/templates/layouts/templates.js'
      },

      dist_content_app: {
        options: {
          variable: 'tmpl',
          requirejs: true,
          node: true
        },
        src: [
          'distribution/contents/share/**/*.dot'
        ],
        dest: 'distribution/public/templates/content/templates.js'
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

    rev: {
      options: {
        algorithm: 'sha1',
        length: 8
      },
      files: {
        src: [
          'distribution/public/styles/**/*.css',
          'distribution/public/scripts/**/*.js',
          'distribution/vendor/modernizr/modernizr.js',
          'distribution/vendor/requirejs/require.js',
          'distribution/public/images/**/*.{png,jpg}',
          'distribution/public/images-webp/**/*.webp',
        ]
      }
    },

    usemin: {
      html: ['distribution/**/*.dot', 'distribution/**/*.part'],
      css: ['distribution/public/**/*.css', '!distribution/vendor/**'],
      options: {
        root : 'distribution',
        basedir : 'distribution',
        dirs: ['distribution']
      }
    },

    uglify: {
      dist: {
        files: {
          'distribution/vendor/requirejs/require.js': ['distribution/vendor/requirejs/require.js'],
          'distribution/vendor/modernizr/modernizr.js': ['distribution/vendor/modernizr/modernizr.js']
        }
      }
    },

    requirejs: {
      application: {
        options: {
          optimize: 'uglify',
          preserveLicenseComments : false,
          // generateSourceMaps : true,
          baseUrl: 'application',
          mainConfigFile: 'application/documents/mains/application.js',
          out: 'application/public/scripts/distribution/application.js',
          name: 'documents/mains/application',
          paths: {
            'modernizr': 'empty:'
          }
        }
      }
    },

    webp: {
      dev: {
        expand: true,
        cwd: 'application/public/images',
        src: [
          '*.{jpg,png}',
          'backgrounds/*.{jpg,png}'
        ],
        dest: 'application/public/images-webp'
      },
      dist: {
        expand: true,
        cwd: 'distribution/public/images',
        src: [
          '*.{jpg,png}',
          'backgrounds/*.{jpg,png}'
        ],
        dest: 'distribution/public/images-webp'
      },
      options: {
        lossless: true,
      }
    },

    modernizr: {
      dist: {
        'devFile': 'distribution/vendor/modernizr/modernizr.js',
        'outputFile': 'distribution/vendor/modernizr/modernizr.js',

        // Based on default settings on http://modernizr.com/download/
        'extra' : {
          'shiv' : true,
          'printshiv' : false,
          'load' : true,
          'mq' : false,
          'cssclasses' : true
        },

        // Based on default settings on http://modernizr.com/download/
        'extensibility' : {
          'addtest' : false
        },

        // By default, source is uglified before saving
        'uglify' : true,

        // Define any tests you want to implicitly include.
        'tests' : [
          'csstransforms'
        ],

        // When parseFiles = true, matchCommunityTests = true will attempt to
        // match user-contributed tests.
        'matchCommunityTests' : false
      }
    }
  });

  // Build task
  grunt.registerTask('build', [
    'clean:app',
    'compass:dist_documents',
    'compass:dist_contents',
    'dot:dev_core',
    'dot:dev_documents',
    'dot:dev_layouts',
    'dot:dev_content_app',
    'requirejs',
    'copy:dist',
    'webp:dist',
    'uglify:dist',
    'rev',
    'usemin',

    // // Because the dot templates has changed
    // // we need to run the process again
    'dot:dist_core',
    'dot:dist_documents',
    'dot:dist_layouts',
    'dot:dist_content_app',
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
  grunt.loadNpmTasks("grunt-modernizr");

};
