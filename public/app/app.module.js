
/// Mobilot module

angular.module('Mobilot',
[
  'ngRoute', 'ngMaterial',
  'ui.router',
  'monospaced.qrcode',
  'angulartics', 'angulartics.google.analytics',
  'Home', 'Login', 'Profile', 'Play', 'Mobidul', 'Creator'
]);


/// Mobilot submodules

angular.module('Home', [
  'ngGeolocation'
]);


angular.module('Login', [
  // ...
]);

angular.module('Profile', [
  // ...
]);

angular.module('Play', [
  // ...
]);

angular.module('Creator', [
    'monospaced.qrcode'
]);

angular.module('Mobidul',
[
  'ngGeolocation', 'ngSanitize',
  // 'uiGmapgoogle-maps',
  'ngMap', 'ngWYSIWYG', 'ngStorage',
  'panzoom',
  'StationCreator'
]);

angular.module('Creator', [
  // ...
]);


/// Mobidul submodules

angular.module('StationCreator', [
  'dndLists'
]);
