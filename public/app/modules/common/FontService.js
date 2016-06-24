angular
  .module('Mobilot')
  .factory('FontService', FontService);

FontService.$inject = [
  '$log'
];


function FontService (
  $log
) {
  /// FontService
  var service =
  {
    // constants
    DEFAULT_FONT : 'default',

    // vars
    fontClass : '',

    // services
    getFontClass : getFontClass
  }


  /// services

  function getFontClass (fontKey)
  {
    var fontClass  = 'font--';
        fontClass += fontKey ? fontKey : service.DEFAULT_FONT;

    return fontClass;
  }


  return service;
}
