angular
  .module('Mobilot')
  .service('UtilityService', UtilityService);


UtilityService.$inject = [
  '$log'
];


function UtilityService (
  $log
) {
  /// UtilityService
  var util = this;

  /// constants
  util._maxCodeCharLimit = 20;


  /// services

  // NOTE: adapted from http://stackoverflow.com/a/136411/2035807
  util.hasOwnProperty = function (obj, prop) {
    var proto = obj.__proto__ || obj.constructor.prototype;

    return (
      ( prop in obj ) && (
        ! ( prop in proto ) ||
        proto[prop] !== obj[prop]
      )
    );
  };


  // NOTE: adapted from http://rickyrosario.com/blog/javascript-startswith-and-endswith-implementation-for-strings/
  util.startsWithIn = function (needle, haystack) {
    return haystack.indexOf(needle) === 0;
  };


  util.getCodeFromName = function (mobidulName) {
    var code = mobidulName || '';

    // make code lower case
    code = code.toLowerCase();
    // replace everything but (lower case) letters and numbers and trim
    // code = code.replace(/[^a-z0-9]/g, '');
    code = util.formatCode(code);

    // limit the code to <n> chars
    code = code.slice(0, util._maxCodeCharLimit);

    return code;
  };


  util.formatCode = function (code) {
    var code = code || '';

    return code.replace(/[^a-z0-9]/g, '').trim();
  };


  util.getGUID = function () {
    // NOTE: adapted from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/2117523#2117523
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = ( c == 'x' ) ? r : ( r&0x3 | 0x8 );

      return v.toString(16);
    });
  };

  // ...
}
