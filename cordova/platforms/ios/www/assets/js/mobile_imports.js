// IMPORTANT - use jsconsole.com for developement only !
// jsconsole vars
jsconsole_web    = false;
jsconsole_mobile = false;

// is mobile vars
mobilePattern = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
iosPattern = /iPhone|iPad|iPod/i;

var isMobile  = mobilePattern.test(navigator.userAgent);
var isIos     = iosPattern.test(navigator.userAgent);

delete mobilePattern;
delete iosPattern;


// cordova global vars

// IMPORTANT - use the default value to make difference between cordova and web browsers !
// isCordova - default : false
var isCordova  = false;
// var isCordova  = true;
var cordovaUrl = '';


if ( jsconsole_web ) {
  // load jsconsole (:listen mobilot-remote)
  document.write('<' + 'script src="http://jsconsole.com/remote.js?mobilot-remote"></script' + '>');
}


if ( isMobile ) {
  if ( ! jsconsole_web && jsconsole_mobile ) {
    // load jsconsole (:listen mobilot-remote)
    document.write('<' + 'script src="http://jsconsole.com/remote.js?mobilot-remote"></script' + '>');
  }


  // load cordova

  // possible protocols to test against => file:, ftp:, http:, https:, mailto:, etc.
  protocolPattern = /^http/i;
  isCordova = ! protocolPattern.test(location.protocol);
  delete protocolPattern;

  if ( isCordova ) {
    // var timestamp = new Date().getUTCMilliseconds();
    // document.write('<' + 'script type="text/javascript" src="cordova.js?' + timestamp + '"></script' + '>');
    document.write('<' + 'script type="text/javascript" src="cordova.js"></script' + '>');
    document.write('<' + 'script type="text/javascript" src="assets/js/mobile_index.js"></script' + '>');


    // _online_server from constants.js
    cordovaUrl = _online_server;


    // @todo - after cordova has finished loading, recheck if windows.cordova is available,
    //          in order to correctly set isCordova global variable
    // @note - not necessary yet

    //isCordova  = typeof window.cordova !== undefined;
    //cordovaUrl = isCordova ? 'http://mobilot.at' : '';
  }
}


delete jsconsole_web;
delete jsconsole_mobile;
