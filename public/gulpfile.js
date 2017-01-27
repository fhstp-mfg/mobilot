var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var notify = require('gulp-notify')
var ngAnnotate = require('gulp-ng-annotate')
var sourcemaps = require('gulp-sourcemaps')
var rimraf = require('rimraf')

/// constants
var BUNDLE_NAME = 'app.bundle.js'
var BUNDLE_OUTPUT = 'bin/'

/// dependencies

var JS_DEPENDENCIES = [
  // startup
  'assets/js/constants.js',
  'assets/js/mobile_imports.js',
  // libs
  'lib/jquery/dist/jquery.min.js',
  'lib/angular/angular.min.js',
  'lib/angular-animate/angular-animate.min.js',
  'lib/angular-aria/angular-aria.min.js',
  'lib/angular-route/angular-route.min.js',
  'lib/angular-ui-router/release/angular-ui-router.min.js',
  'lib/angular-resource/angular-resource.min.js',
  'lib/angular-material/angular-material.min.js',
  'lib/ngGeolocation/ngGeolocation.min.js',
  'lib/angular-sanitize/angular-sanitize.min.js',
  'lib/lodash/lodash.min.js',
  'lib/ng-sortable/dist/ng-sortable.min.js',
  // 'https://maps.google.com/maps/api/js?key=AIzaSyD2a1NXYQjRKYaU0Vyym9JJvIMcZervnkw',
  'lib/ngmap/build/scripts/ng-map.min.js',
  'lib/angular-mousewheel/mousewheel.js',
  'lib/angular-pan-zoom/release/panzoom.min.js',
  'assets/js/exif.js',
  'assets/js/md5.js',
  'temp/ngWYSIWYG/js/wysiwyg.js',
  'assets/js/angular-drag-and-drop-lists.js',
  'lib/ngstorage/ngStorage.min.js',
  'lib/angular-cookies/angular-cookies.min.js',
  'lib/angular-translate/angular-translate.min.js',
  'lib/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
  'lib/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js',
  'lib/angular-translate-storage-local/angular-translate-storage-local.min.js',
  'assets/js/qrcode.js',
  'assets/js/qrcode_UTF8.js',
  'lib/angular-qrcode/angular-qrcode.js',
  'assets/js/ng-cordova-beacon.min.js',
  'lib/angulartics/dist/angulartics.min.js',
  'lib/angulartics-google-analytics/dist/angulartics-google-analytics.min.js',
  // init
  'assets/js/check_offline.js',
  // angular
  'app/app.modules.js',
  'app/app.config.js',
  'app/modules/mobidul/menu/MenuDirective.js',
  'app/modules/core/models/StateModel.js',
  'app/modules/login/LoginController.js',
  'app/modules/profile/ProfileController.js',
  'app/modules/play/PlayService.js',
  'app/modules/play/PlayController.js',
  'app/modules/social/SocialService.js',
  'app/modules/social/SocialController.js',
  'app/modules/mobidul/menu/dialog/CloneMobidulDialogController.js',
  'app/modules/mobidul/menu/MenuController.js',
  'app/modules/mobidul/MobidulService.js',
  'app/modules/mobidul/MobidulController.js',
  'app/modules/mobidul/station/elements/HtmlContainerDirective.js',
  'app/modules/mobidul/station/elements/InputCodeDirective.js',
  'app/modules/mobidul/station/elements/ActionButtonDirective.js',
  'app/modules/mobidul/station/elements/TriggerNearDirective.js',
  'app/modules/mobidul/station/elements/BlueToothDirective.js',
  'app/modules/mobidul/station/elements/PhotoUploadDirective.js',
  'app/modules/mobidul/station/elements/SetTimeoutDirective.js',
  'app/modules/mobidul/station/elements/FreeTextInputDirective.js',
  'app/modules/mobidul/station/elements/ConfirmSocialDirective.js',
  'app/modules/mobidul/station/elements/ShowScoreDirective.js',
  'app/modules/creator/CreatorService.js',
  'app/modules/creator/CreatorController.js',
  'app/modules/core/StateManager.js',
  'app/modules/core/HeaderService.js',
  'app/modules/core/CoreController.js',
  'app/modules/core/HeaderController.js',
  'app/modules/core/LanguageService.js',
  'app/modules/common/ActivityService.js',
  'app/modules/common/FontService.js',
  'app/modules/common/GeoLocationService.js',
  'app/modules/common/InfoWindowController.js',
  'app/modules/common/LocalStorageService.js',
  'app/modules/common/RallyService.js',
  'app/modules/common/UserService.js',
  'app/modules/common/UtilityService.js',
  'app/modules/common/PhotoService.js',
  'app/modules/common/AttachmentService.js',
  'app/modules/home/HomeService.js',
  'app/modules/home/HomeController.js',
  'app/modules/mobidul/station/StationService.js',
  'app/modules/mobidul/station/StationController.js',
  'app/modules/mobidul/station/elements/StationProgressDirective.js',
  'app/modules/mobidul/map/MapService.js',
  'app/modules/mobidul/map/MapController.js',
  'app/modules/mobidul/list/ListService.js',
  'app/modules/mobidul/list/ListStationsController.js',
  'app/modules/mobidul/station/creator/StationCreatorService.js',
  'app/modules/mobidul/station/creator/StationCreatorController.js',
  'app/modules/mobidul/station/creator/BluetoothBeaconService.js',
  'app/modules/mobidul/station/creator/directives/EditorDirective.js',
  'app/modules/mobidul/station/creator/directives/EditorTabDirective.js',
  'app/modules/mobidul/station/creator/directives/ElementContainerDirective.js',
  'app/modules/mobidul/station/creator/directives/elements/_ActionSelectorDirective.js',
  'app/modules/mobidul/station/creator/directives/elements/HtmlContainerConfigDirective.js',
  'app/modules/mobidul/station/creator/directives/elements/InputCodeConfig.js',
  'app/modules/mobidul/station/creator/directives/elements/ActionButtonConfigDirective.js',
  'app/modules/mobidul/station/creator/directives/elements/TriggerNearConfigDirective.js',
  'app/modules/mobidul/station/creator/directives/elements/BluetoothConfigDirective.js',
  'app/modules/mobidul/station/creator/directives/EditorToolsDirective.js',
  'app/modules/mobidul/station/creator/directives/elements/PhotoUploadConfigDirective.js',
  'app/modules/mobidul/station/creator/directives/elements/SetTimeoutConfigDirective.js',
  'app/modules/mobidul/station/creator/directives/elements/FreeTextInputConfigDirective.js',
  'app/modules/mobidul/station/creator/directives/elements/ConfirmSocialConfigDirective.js',
  'app/modules/mobidul/station/creator/directives/elements/ShowScoreConfigDirective.js',
  'app/modules/mobidul/station/media/MediaController.js',
  'app/modules/mobidul/about/AboutController.js'
]


/// tasks

gulp.task('default', ['clean'], function() {
  return gulp.src(JS_DEPENDENCIES)
    .pipe(sourcemaps.init())
    .pipe(concat(BUNDLE_NAME))
    .pipe(ngAnnotate())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(BUNDLE_OUTPUT))
    .pipe(notify({ message: 'Yuhuu! Successfully build Mobilot!' }))
})


gulp.task('build', ['clean'], function() {
  return gulp.src(JS_DEPENDENCIES)
    .pipe(concat(BUNDLE_NAME))
    .pipe(ngAnnotate())
    // .pipe(uglify())
    .pipe(gulp.dest(BUNDLE_OUTPUT))
    .pipe(notify({ message: 'Yuhuu! Successfully build Mobilot!' }))
})

gulp.task('test', function() {
  return gulp.src(JS_DEPENDENCIES)
    .pipe(ngAnnotate())
    .pipe(notify({ message: 'Yuhuu! This file seems to be ok!' }))
})


/// cleaning

gulp.task('clean', function (cb) {
  rimraf(BUNDLE_OUTPUT, cb)
})


/// watchers

gulp.task('watch', ['default'], function() {
  gulp.watch(JS_DEPENDENCIES, ['default'])
})
