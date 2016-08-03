(function () {
'use strict';

angular
.module('Mobilot')
.factory('LanguageService', LanguageService);

LanguageService.$inject = [
  '$log',
  '$translate'
];

function LanguageService (
  $log,
  $translate
) {
  /// LanguageService
  var service =
  {
    /// constants
    LANGUAGES: {
      GERMAN: 'de_DE',
      ENGLISH: 'en_US'
    },


    /// vars
    // ...


    /// functions
    switchLanguage: switchLanguage,
    getCurrentLanguage: getCurrentLanguage

  };


  /// private helpers
  // ...


  /// services
  function getCurrentLanguage () {
    return $translate.use();
  }

  function switchLanguage ( newLanguage ) {

    for (var l in service.LANGUAGES) {

      if ( service.LANGUAGES[l] == newLanguage ) {
        $translate.use(newLanguage);
        return;
      }
    }

    $log.error(newLanguage, 'is not supported');

  }


  return service;
}
})();