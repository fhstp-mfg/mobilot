angular
  .module('Mobilot')
  .controller('AboutController', AboutController);

AboutController.$inject = [
  '$log', '$translate'
];


function AboutController (
  $log, $translate
) {
  var about = this;

  /// constants
  // ...

  /// vars
  about.isCordovaIos = isCordova && isIos;


  /// functions
  // ...


  /// construct
  // _init();


  /// public functions
  // ...


  /// private functions

  function _init () {
    $log.debug('AboutController init');

    // ...
  }


  /// events
  // ...
}
