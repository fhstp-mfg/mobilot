cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "com.unarin.cordova.beacon.underscorejs",
    "file": "plugins/com.unarin.cordova.beacon/www/lib/underscore-min-1.6.js",
    "pluginId": "com.unarin.cordova.beacon",
    "runs": true
  },
  {
    "id": "com.unarin.cordova.beacon.Q",
    "file": "plugins/com.unarin.cordova.beacon/www/lib/q.min.js",
    "pluginId": "com.unarin.cordova.beacon",
    "runs": true
  },
  {
    "id": "com.unarin.cordova.beacon.LocationManager",
    "file": "plugins/com.unarin.cordova.beacon/www/LocationManager.js",
    "pluginId": "com.unarin.cordova.beacon",
    "merges": [
      "cordova.plugins"
    ]
  },
  {
    "id": "com.unarin.cordova.beacon.Delegate",
    "file": "plugins/com.unarin.cordova.beacon/www/Delegate.js",
    "pluginId": "com.unarin.cordova.beacon",
    "runs": true
  },
  {
    "id": "com.unarin.cordova.beacon.Region",
    "file": "plugins/com.unarin.cordova.beacon/www/model/Region.js",
    "pluginId": "com.unarin.cordova.beacon",
    "runs": true
  },
  {
    "id": "com.unarin.cordova.beacon.Regions",
    "file": "plugins/com.unarin.cordova.beacon/www/Regions.js",
    "pluginId": "com.unarin.cordova.beacon",
    "runs": true
  },
  {
    "id": "com.unarin.cordova.beacon.CircularRegion",
    "file": "plugins/com.unarin.cordova.beacon/www/model/CircularRegion.js",
    "pluginId": "com.unarin.cordova.beacon",
    "runs": true
  },
  {
    "id": "com.unarin.cordova.beacon.BeaconRegion",
    "file": "plugins/com.unarin.cordova.beacon/www/model/BeaconRegion.js",
    "pluginId": "com.unarin.cordova.beacon",
    "runs": true
  },
  {
    "id": "cordova-plugin-geolocation.Coordinates",
    "file": "plugins/cordova-plugin-geolocation/www/Coordinates.js",
    "pluginId": "cordova-plugin-geolocation",
    "clobbers": [
      "Coordinates"
    ]
  },
  {
    "id": "cordova-plugin-geolocation.PositionError",
    "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
    "pluginId": "cordova-plugin-geolocation",
    "clobbers": [
      "PositionError"
    ]
  },
  {
    "id": "cordova-plugin-geolocation.Position",
    "file": "plugins/cordova-plugin-geolocation/www/Position.js",
    "pluginId": "cordova-plugin-geolocation",
    "clobbers": [
      "Position"
    ]
  },
  {
    "id": "cordova-plugin-geolocation.geolocation",
    "file": "plugins/cordova-plugin-geolocation/www/geolocation.js",
    "pluginId": "cordova-plugin-geolocation",
    "clobbers": [
      "navigator.geolocation"
    ]
  },
  {
    "id": "cordova-plugin-inappbrowser.inappbrowser",
    "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
    "pluginId": "cordova-plugin-inappbrowser",
    "clobbers": [
      "cordova.InAppBrowser.open",
      "window.open"
    ]
  },
  {
    "id": "cordova-plugin-splashscreen.SplashScreen",
    "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
    "pluginId": "cordova-plugin-splashscreen",
    "clobbers": [
      "navigator.splashscreen"
    ]
  },
  {
    "id": "phonegap-plugin-barcodescanner.BarcodeScanner",
    "file": "plugins/phonegap-plugin-barcodescanner/www/barcodescanner.js",
    "pluginId": "phonegap-plugin-barcodescanner",
    "clobbers": [
      "cordova.plugins.barcodeScanner"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "com.unarin.cordova.beacon": "3.4.0",
  "cordova-plugin-compat": "1.1.0",
  "cordova-plugin-crosswalk-webview": "2.1.0",
  "cordova-plugin-geolocation": "2.4.1",
  "cordova-plugin-inappbrowser": "1.6.1",
  "cordova-plugin-splashscreen": "5.0.2",
  "cordova-plugin-whitelist": "1.3.1",
  "phonegap-plugin-barcodescanner": "6.0.4"
};
// BOTTOM OF METADATA
});