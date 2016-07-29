(function () {
  'use strict';

angular
.module('Mobilot')
.factory('ExportService', ExportService);

ExportService.$inject = [
  '$log', '$http',
  '$stateParams'
];

function ExportService (
  $log, $http,
  $stateParams
) {
  /// ExportService
  var service =
  {
    /// constants
    // ...


    /// vars
    // ...


    /// functions
    exportPicturesFromComponent: exportPicturesFromComponent

  };


  /// private helpers
  // ...


  /// services
  function exportPicturesFromComponent (id)
  {
    //$log.info('PhotoService - exportPicturesFromComponent: ');
    //$log.debug(id);

    var stationCode = $stateParams.stationCode;

    $http.get( '/' + stationCode + '/exportImages/' + id)
    .success(function(result){
      $log.info('result from export:');
      $log.debug(result);

      if( ! result.empty ){
        var anchor = angular.element('<a/>');
        anchor.attr({
          href: result.url,
          download: 'export.zip'
        })[0].click();
      } else {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .title('Keine Fotos')
          .textContent( 'Zu dieser Station wurden noch keine Fotos hochgeladen' )
          .ariaLabel('OK')
          .ok('OK')
        );
      }

    })
    .error(function(error){
      $log.error('error from component picture export:');
      $log.debug(error);
    });

  }


  return service;
}
})();