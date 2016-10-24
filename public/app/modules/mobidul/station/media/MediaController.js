angular
  .module('Mobidul')
  .controller('MediaController', MediaController);

MediaController.$inject = [
  '$log', '$stateParams', '$rootScope'
];


function MediaController ($log, $stateParams, $rootScope) {
  var media = this;

  // vars
  media.src = cordovaUrl + '/image/2000/' + $stateParams.media;
  media.panzoomConfig = {
    scalePerZoomLevel : 1.5,
    initialZoomLevel  : 0.25
  };

  // $scope.panzoomConfig = {
  //   zoomLevels: 12,
  //   neutralZoomLevel: 5,
  //   scalePerZoomLevel: 1.5,
  //   initialZoomToFit: shark
  // };

  media.height = window.screen.availHeight - 164;
  media.panzoomModel = {};

  // functions
  init();

  /// functions
  function init () {
    // $log.debug("got to mediacontroller");
    // $log.debug($stateParams);

    $rootScope.$emit('rootScope:toggleAppLoader', { action : 'hide' });
  }
}
