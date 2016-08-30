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
      './public/lib/angular/angular.min.js',
      './public/lib/angular-mocks/angular-mocks.js',
      './public/lib/angular-animate/angular-animate.min.js',
      './public/lib/angular-aria/angular-aria.min.js',
      './public/lib/angular-material/angular-material.min.js',
      './public/lib/angular-ui-router/release/angular-ui-router.min.js',
      './public/lib/angular-qrcode/angular-qrcode.js',
      './public/lib/angulartics/dist/angulartics.min.js',
      './public/lib/angulartics-google-analytics/dist/angulartics-google-analytics.min.js',
      './public/lib/ngGeolocation/ngGeolocation.min.js',
      './public/lib/angular-sanitize/angular-sanitize.min.js',
      './public/lib/ngmap/build/scripts/ng-map.min.js',
      './public/temp/ngWYSIWYG/js/wysiwyg.js',
      './public/lib/ngstorage/ngStorage.min.js',
      './public/lib/angular-pan-zoom/release/panzoom.min.js',
      './public/assets/js/angular-drag-and-drop-lists.js',
      './public/lib/angular-mousewheel/mousewheel.js',
      './public/lib/angular-translate/angular-translate.min.js',
      './public/lib/angular-cookies/angular-cookies.min.js',

      './public/app/app.module.js',
      //'./public/app/app.config.js',

      './public/app/modules/core/StateManager.js',
      './public/app/modules/core/models/StateModel.js',
      './public/app/modules/common/UtilityService.js',
      './public/app/modules/core/HeaderService.js',
      './public/app/modules/mobidul/MobidulService.js',
      './public/app/modules/mobidul/MobidulServiceSpec.js',
      './public/app/modules/common/LocalStorageService.js',
      './public/app/modules/mobidul/station/creator/StationCreatorService.js',
      './public/app/modules/creator/CreatorService.js',
      './public/app/modules/common/GeoLocationService.js',
       './public/assets/js/mobile_imports.js',

      './public/app/modules/common/UserService.js',
      './public/app/modules/common/UserServiceSpec.js',

      './public/app/modules/core/LanguageService.js',
      './public/app/modules/core/LanguageServiceSpec.js',

      './public/app/modules/common/AttachmentService.js',
      './public/app/modules/common/AttachmentServiceSpec.js',

      './public/app/modules/common/LocalStorageService.js',
      './public/app/modules/common/LocalStorageServiceSpec.js',

      './public/app/modules/common/RallyService.js',
      './public/app/modules/common/RallyServiceSpec.js',
	  
	  './public/app/modules/common/ActivityService.js',
      './public/app/modules/common/ActivityServiceSpec.js'
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
