module.exports = function( grunt ) {

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
        'app/**/*.js',
        'lib/**/*.js',
        '!app/build/tmpl.js',
        '!app/vendor/**',
        '!app/public/templates/**/*.js',
        '!app/public/scripts/**/*.js',
        '!app/translations/output/**/*.js',
        'src/**/*.js'
      ]
    },


    compass: {
      dist: {
        options: {
          config         : 'app/conf/compass.rb',
          require        : [
            'compass-placeholder',
            'compass-retina-sprites',
            'breakpoint',
            'animation',
            'sass-css-importer'
          ],
          sassDir        : 'scaffolds',
          cssDir         : 'public/styles',
          debugInfo      : false,
          noLineComments : true,
          imagesDir      : 'public/images',
          outputStyle    : 'compressed'
        }
      },

      dev: {
        options: {
          config         : 'app/conf/compass.rb',
          require        : [
            'compass-placeholder',
            'compass-retina-sprites',
            'breakpoint',
            'animation',
            'sass-css-importer'
          ],
          sassDir        : 'scaffolds',
          cssDir         : 'public/styles',
          debugInfo      : true,
          noLineComments : false,
          imagesDir      : 'public/images'
        }
      }
    },

    exec: {
      gt : {
        command: 'gt compile'
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
          'app/components/**/*.{dot,part}',
          'app/modules/**/*.{dot,part}',
          'app/scaffolds/**/*.{dot,part}',
          '!app/modules/streetstyle/**/*.{dot,part}',
          '!app/scaffolds/streetstyle/**/*.{dot,part}'
        ],
        tasks: ['dot:devLogin']
      },

      streetStyleTemplates: {
        files: [
          'app/components/**/*.{dot,part}',
          'app/modules/streetstyle/**/*.{dot,part}',
          'app/scaffolds/streetstyle/**/*.{dot,part}'
        ],
        tasks: ['dot:devStreetstyle']
      },

      compass: {
        files: ['app/**/*.scss'],
        tasks: ['compass:dev']
      }
    },

    clean: {
      app: [
        'dist',
        'app/public/styles/*',
        'app/public/scripts/*',
        'app/public/images-webp/*',
        'app/public/tmp/*',
        'app/public/uploads/*',
        'app/public/templates/*'
      ],
      dist: [
        'dist/vendor/**/*',
        '!dist/vendor/requirejs/*.require.js',
        '!dist/vendor/modernizr/*.modernizr.js',
        'dist/components'
      ],
      deploy: ['deploy'],
      css: ['app/public/styles/*']
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

    dot: {
      devLogin: {
        options: {
          variable  : 'tmpl',
          root      : __dirname + '/app',
          requirejs : true,
          node      : true
        },
        src : ['app/**/*.dot'],
        dest : 'app/public/templates/login.js'
      },

      devStreetstyle : {
        options: {
          variable  : 'tmpl',
          root      : __dirname + '/app',
          requirejs : true,
          node      : true
        },
        src : ['app/**/*.dot'],
        dest : 'app/public/templates/streetstyle.js'
      },

      distLogin : {
        options: {
          variable  : 'tmpl',
          root      : __dirname + '/dist',
          requirejs : true,
          node      : true
        },
        src : ['dist/**/*.dot'],
        dest : 'dist/public/templates/login.js'
      },

      distStreetstyle : {
        options: {
          variable  : 'tmpl',
          root      : __dirname + '/dist',
          requirejs : true,
          node      : true
        },
        src : ['dist/**/*.dot'],
        dest : 'dist/public/templates/streetstyle.js'
      },
    },

    translate: {
      dist: {
        options: {
          config          : './app/translations',
          requirejs       : true,
          defaultLanguage : 'en', // grunt-translate use it to update translation.
          output          : './app/translations/output',
          src             : ['./app/**/*.js', '!./app/vendor/**/*.js'],
          interface: {
            autoOpen : false,
            port     : 3001
          }
        }
      }
    },

    useminPrepare: {
      html: 'app/profiles/p1/lib/templates/layout/login-shell.dot',
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
          {expand: true, cwd: 'app/', src: ['**'], dest: 'dist/'}, // makes all src relative to cwd
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
        cwd : 'app/public/images',
        src : [
          '*.{jpg,png}',
          'mobile/*.{jpg,png}',
          'streetstyle/*.{jpg,png}'
        ],
        dest : 'app/public/images-webp'
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
