(function () {
  'use strict';

angular
.module('Mobilot')
.factory('AttachmentService', AttachmentService);

AttachmentService.$inject = [
  '$log', '$http', '$q', '$translate',
  '$mdDialog'
];

function AttachmentService (
  $log, $http, $q, $translate,
  $mdDialog
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
    exportPicturesFromComponent: exportPicturesFromComponent,
    startDownloadFromUrl: startDownloadFromUrl

  };


  /// private helpers
  function _getPhotoExportUrl (stationCode, componentId) {

    return $q(function (resolve, reject) {

      $http.get( '/' + stationCode + '/exportImages/' + componentId )
      .success(function (result) {
        //$log.info('result from _getPhotoExportUrl:', result);
        resolve(result);
      })
      .error(function(response){
        reject(response);
      });
    });
  }

  // Todo: should be private - needs better test
  function startDownloadFromUrl (url, name) {
    var anchor = angular.element('<a/>');
    anchor.attr({
      href: url,
      download: name
    })[0].click();
  }


  /// services
  function saveTextInput (text, mobidulCode, stationCode, componentId) {

    var url = '/' + mobidulCode + '/' + stationCode + '/saveText/' + componentId,
        data = {payload: {text: text}};

    return $q(function (resolve, reject) {
      $http.post(url, data)
      .success(function (response, status, headers, config) {
        resolve(response);
      })
      .error(function (response, status, headers, config) {
        reject(response);
      })
    });
  }

  function exportTextsFromComponent (mobidulCode, stationCode, componentId) {

    var url = '/' + mobidulCode + '/' + stationCode + '/exportTexts/' + componentId;

    return $q(function (resolve, reject) {
      $http.get(url)
      .success(function(response, status, headers, config){
        resolve(response);
      })
      .error(function(response, status, headers, config){
        reject(response);
      })
    });
  }
  
  function exportPicturesFromComponent (stationCode, componentId)
  {
    return $q(function (resolve, reject) {
      _getPhotoExportUrl(stationCode, componentId)
      .then(function (result) {

        if( ! result.empty ){

          startDownloadFromUrl(result.url, 'export.zip');

        } else {
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.body))
            .title($translate.instant('NO_PHOTOS'))
            .textContent($translate.instant('NO_PHOTOS_FOR_STATION'))
            .ariaLabel($translate.instant('OK'))
            .ok($translate.instant('OK'))
          );

        }

      }, function (error) {
        reject(error);
      });
    });
  }

  return service;
}
})();