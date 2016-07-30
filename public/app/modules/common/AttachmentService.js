(function () {
  'use strict';

angular
.module('Mobilot')
.factory('AttachmentService', AttachmentService);

AttachmentService.$inject = [
  '$log', '$http',
  '$stateParams'
];

function AttachmentService (
  $log, $http,
  $stateParams
) {
  /// AttachmentService
  var service =
  {
    /// constants
    // ...


    /// vars
    // ...


    /// functions
    saveTextInput: saveTextInput,
    exportTextsFromComponent: exportTextsFromComponent,
    exportPicturesFromComponent: exportPicturesFromComponent

  };


  /// private helpers
  // ...


  /// services
  function saveTextInput (text, componentId) {

    var stationCode = $stateParams.stationCode,
        mobidulCode = $stateParams.mobidulCode,
        url = '/' + mobidulCode + '/' + stationCode + '/saveText/' + componentId,
        data = {payload: {text: text}};

    return $http.post(url, data);
  }

  function exportTextsFromComponent (componentId) {

    var stationCode = $stateParams.stationCode,
        mobidulCode = $stateParams.mobidulCode,
        url = '/' + mobidulCode + '/' + stationCode + '/exportTexts/' + componentId;

    $http.get(url).success(function(response, status, headers, config){
      $log.info('response from exportTextsFromComponent:', response);
    })
    .error(function(response, status, headers, config){
      $log.error('error while exporting texts:', response);
    })

  }


  function exportPicturesFromComponent (id)
  {
    //$log.info('PhotoService - exportPicturesFromComponent: ');
    //$log.debug(id);

    var stationCode = $stateParams.stationCode;

    $http.get( '/' + stationCode + '/exportImages/' + id )
    .success(function(result){
      //$log.info('result from export:');
      //$log.debug(result);

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