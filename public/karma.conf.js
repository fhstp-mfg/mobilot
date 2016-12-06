// Karma configuration
// Generated on Sat Jul 30 2016 14:27:42 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      './lib/angular/angular.min.js',
      './lib/angular-mocks/angular-mocks.js',
      './lib/angular-animate/angular-animate.min.js',
      './lib/angular-aria/angular-aria.min.js',
      './lib/angular-material/angular-material.min.js',
      './lib/angular-ui-router/release/angular-ui-router.min.js',
      './lib/angular-qrcode/angular-qrcode.js',
      './lib/angulartics/dist/angulartics.min.js',
      './lib/angulartics-google-analytics/dist/angulartics-google-analytics.min.js',
      './lib/ngGeolocation/ngGeolocation.min.js',
      './lib/angular-sanitize/angular-sanitize.min.js',
      './lib/ngmap/build/scripts/ng-map.min.js',
      './temp/ngWYSIWYG/js/wysiwyg.js',
      './lib/ngstorage/ngStorage.min.js',
      './lib/angular-pan-zoom/release/panzoom.min.js',
      './assets/js/angular-drag-and-drop-lists.js',
      './lib/angular-mousewheel/mousewheel.js',
      './lib/angular-translate/angular-translate.min.js',
      './lib/angular-cookies/angular-cookies.min.js',

      './app/app.module.js',
      // './app/app.config.js',

      './app/modules/core/StateManager.js',
      './app/modules/core/models/StateModel.js',
      './app/modules/common/UtilityService.js',
      './app/modules/core/HeaderService.js',
      './app/modules/mobidul/MobidulService.js',
      './app/modules/mobidul/MobidulServiceSpec.js',
      './app/modules/common/LocalStorageService.js',
      './app/modules/mobidul/station/creator/StationCreatorService.js',
      './app/modules/creator/CreatorService.js',
      './app/modules/common/GeoLocationService.js',
      './assets/js/mobile_imports.js',

      './app/modules/common/UserService.js',
      './app/modules/common/UserServiceSpec.js',

      './app/modules/core/LanguageService.js',
      './app/modules/core/LanguageServiceSpec.js',

      './app/modules/common/AttachmentService.js',
      './app/modules/common/AttachmentServiceSpec.js',

      './app/modules/common/LocalStorageService.js',
      './app/modules/common/LocalStorageServiceSpec.js',

      './app/modules/common/RallyService.js',
      './app/modules/common/RallyServiceSpec.js',

	  './app/modules/common/ActivityService.js',
      './app/modules/common/ActivityServiceSpec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
};
