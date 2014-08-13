
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
        'Application/**/*.js',
        'lib/**/*.js',
        '!Application/build/tmpl.js',
        '!Application/vendor/**',
        '!Application/public/templates/**/*.js',
        '!Application/public/scripts/**/*.js',
        '!Application/translations/output/**/*.js',
        'src/**/*.js'
      ]
    },


    compass: {
      dev_documents: {
        options: {
          config: 'Application/Configurations/Compass.rb',
          require: compassRequires,
          sassDir: 'Documents/Styles',
          cssDir: 'Public/Styles/documents',
          debugInfo: true,
          noLineComments: true,
          imagesDir: 'Application/Public/Images'
        }
      },

      dev_contents: {
        options: {
          config: 'Application/Configurations/Compass.rb',
          require: compassRequires,
          sassDir: 'Contents/Styles',
          cssDir: 'Public/Styles/Contents',
          debugInfo: true,
          noLineComments: true,
          imagesDir: 'Public/Images'
        }
      },

      dist_documents: {
        options: {
          config: 'Application/Configurations/Compass.rb',
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
          config: 'Application/Configurations/Compass.rb',
          require: compassRequires,
          sassDir: 'Contents/Styles',
          cssDir: 'Public/Styles/Contents',
          debugInfo: true,
          noLineComments: true,
          imagesDir: 'Public/Images',
          outputStyle: 'compressed'
        }
      }
    },

    watch: {
      jshint: {
        files: [
          'Application/Contents/**/*.js',
          'Application/Configurations/**/*.js',
          'Application/Core/**/*.js',
          'Application/Libraries/**/*.js'
        ],
        tasks: ['jshint']
      },

      templates : {
        files: [
          'Application/Contents/**/*.{part,dot}',
          'Application/Layouts/**/*.{part,dot}',
          'Application/Documents/**/*.{part,dot}'
        ],
        tasks: ['dot']
      },

      compass_documents: {
        files: [
          'Application/Documents/**/*.scss',
          'Application/Layouts/**/*.scss',
          'Application/Components/**/*.scss'
        ],
        tasks: ['compass:dev_documents']
      },

      compass_contents: {
        files: ['Application/contents/**/*.scss'],
        tasks: ['compass:dev_contents']
      }
    },

    clean: {
      app: [
        'distribution',
        'Application/Public/Styles/*',
        'Application/Public/Scripts/Configurations/*',
        'Application/Public/Scripts/Distribution/*',
        'Application/Public/ImagesWEBP/*',
        'Application/Public/Uploads/*',
        'Application/Public/Templates/*'
      ],
      deploy: ['deploy'],
      css: ['Application/public/styles/*']
    },

    copy: {
      dist: {
        files: [
          { expand: true, cwd: 'Application/', src: ['**'], dest: 'distribution/' }
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
        src: ['Application/Core/**/*.tmpl'],
        dest: 'Application/Public/Templates/Core/Templates.js'
      },

      dev_documents: {
        options: {
          variable: 'tmpl',
          requirejs: true,
          node: true
        },
        src: ['Application/Documents/**/*.tmpl'],
        dest: 'Application/Public/Templates/Documents/Templates.js'
      },

      dev_layouts: {
        options: {
          variable: 'tmpl',
          requirejs: true,
          node: true
        },
        src: ['Application/Layouts/**/*.tmpl'],
        dest: 'Application/Public/Templates/Layouts/Templates.js'
      },

      dev_content_app: {
        options: {
          variable: 'tmpl',
          requirejs: true,
          node: true
        },
        src: [
          'Application/Contents/RollingNumbers/**/*.tmpl'
        ],
        dest: 'Application/Public/Templates/Contents/Templates.js'
      },

      dist_core: {
        options: {
          variable: 'tmpl',
          requirejs: true,
          node: true
        },
        src: ['Distribution/Core/**/*.tmpl'],
        dest: 'Distribution/Public/Templates/Core/Templates.js'
      },

      dist_documents: {
        options: {
          variable: 'tmpl',
          requirejs: true,
          node: true
        },
        src: ['Distribution/Documents/**/*.tmpl'],
        dest: 'Distribution/Public/Templates/Documents/Templates.js'
      },

      dist_layouts: {
        options: {
          variable: 'tmpl',
          requirejs: true,
          node: true
        },
        src: ['Distribution/Layouts/**/*.tmpl'],
        dest: 'Distribution/Public/Templates/Layouts/Templates.js'
      },

      dist_content_app: {
        options: {
          variable: 'tmpl',
          requirejs: true,
          node: true
        },
        src: [
          'Distribution/Contents/RollingNumbers/**/*.tmpl'
        ],
        dest: 'Distribution/Public/Templates/Contents/Templates.js'
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
      html: ['distribution/**/*.tmpl', 'distribution/**/*.part'],
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
          'Distribution/Vendors/requirejs/require.js': ['Distribution/Vendors/requirejs/require.js'],
          'Distribution/Vendors/modernizr/modernizr.js': ['Distribution/Vendors/modernizr/modernizr.js']
        }
      }
    },

    requirejs: {
      Application: {
        options: {
          optimize: 'uglify',
          preserveLicenseComments : false,
          // generateSourceMaps : true,
          baseUrl: 'Application',
          mainConfigFile: 'Application/documents/mains/Application.js',
          out: 'Application/public/scripts/distribution/Application.js',
          name: 'Documents/Mains/Application',
          paths: {
            'modernizr': 'empty:'
          }
        }
      }
    },

    webp: {
      dev: {
        expand: true,
        cwd: 'Application/Public/Images',
        src: [
          '*.{jpg,png}',
          'backgrounds/*.{jpg,png}'
        ],
        dest: 'Application/Public/ImagesWEBP'
      },
      dist: {
        expand: true,
        cwd: 'Distribution/Public/Images',
        src: [
          '*.{jpg,png}',
          'backgrounds/*.{jpg,png}'
        ],
        dest: 'Distribution/Public/ImagesWEBP'
      },
      options: {
        lossless: true,
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

};
