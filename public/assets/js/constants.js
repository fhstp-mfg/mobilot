/// wait for debug
// alert('start safari debug');

/// constants

var _live = false;

// NOTE: https is an iOS 9 Safari requirement !
var _https = !!_live;

// NOTE: don't add any trailing slashes (/) at the end or the URL !
var _online_server = _live ? 'mobilot.at' : 'mobilot.fhstp.ac.at';

// NOTE: adapted from: http://stackoverflow.com/a/6969486/2035807
// var _online_server_regex = _online_server.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
// NOTE: adapted from: https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions
var _online_server_regex = _online_server.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

var protocolPrefix = _https ? 'https://' : 'http://';
    _online_server = protocolPrefix + _online_server;

var _QR_CODE_REGEX = new RegExp('^http(?:s)?://' + _online_server_regex + '(?:/)+([\\w]{1,20}){1,}(?:(?:/)+([\\w]{1,20}))?(?:/)*$');



var _mobimer_url   = 'mobimer.html?';
var _mob_code      = 'code';
var _mob_name      = 'name';
var _station_code  = 'scode';
var _start_ability = 'ability';
var _start_item_id = 'startid';


/// MOBIDUL-ONLY SETTINGS

// change this variable to use Mobilot as "mobidul-only"
//  also this only works for mobile devices.
var _START_MOBIDUL          = null;    // default : null
// _START_MOBIDUL          = 'guide';
// _START_MOBIDUL          = 'vfrankl';

// enables/disables the menu point "Mobidulauswahl" inside a mobidul
var _enable_mobidulauswahl  = true;        // default : true
// enables/disables the menu point "Über uns" inside a mobidul
var _enable_aboutus         = true;        // default : true

/// MOBIDUL SETTINGS END



/// functions

// adapted from: http://stackoverflow.com/a/827378/2035807
function getUrlParameter (variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');

    if (pair[ 0 ] == variable) {
      return pair[ 1 ].replace('/', '');
    }
  }

  return '';
}


// NOTE - adapted from: http://stackoverflow.com/a/3646923/2035807
function urlExists (url) {
  var http = new XMLHttpRequest();

  http.open('HEAD', url, false);
  http.send();

  var urlExists = http.status != 404;

  return urlExists;
}


// before anything else, we have to extract some GET parameters from the url

// GET parameters
var mobidulParam      = getUrlParameter(_mob_code);
var mobidulNameParam  = getUrlParameter(_mob_name);
var stationCodeParam  = getUrlParameter(_station_code);
var startAbilityParam = getUrlParameter(_start_ability);
var startItemIdParam  = getUrlParameter(_start_item_id);


// ...
