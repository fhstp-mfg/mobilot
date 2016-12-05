(function () {
  'use strict';

angular
  .module('StationCreator')
  .directive('photoUploadConfig', PhotoUploadConfig);

PhotoUploadConfig.$inject = [
  '$log', '$stateParams', '$translate',
  'UtilityService', 'RallyService', 'PhotoService',
  'AttachmentService'
];

function PhotoUploadConfig(
  $log, $stateParams, $translate,
  util, RallyService, PhotoService,
  AttachmentService
) {
  return {

    restrict: 'E',
    template:
    '<div>' +
      '{{content}}' +
      '<md-button class="md-raised md-primary md-mobilot" translate="UPLOAD_PHOTO">' +
        '{{ \'UPLOAD_PHOTO\' | translate }}' +
      '</md-button><br />' +
      '<div class="config-part">' +
        '<md-input-container>' +
          '<input type="text" ng-model="content" placeholder="{{ \'EXPLAINATION\' | translate }}">' +
        '</md-input-container>' +
        '<action-selector' +
          ' data-opts="ctrl.actionOpts"' +
          ' data-selection="success"' +
          ' data-name="SUCCESS_ACTION"' +
        '></action-selector>' +
        '<md-button data-ng-click="ctrl.exportPictures()">' +
          '{{ \'DOWNLOAD_PHOTOS\' | translate }}' +
        '</md-button>' +
      '</div>' +
    '</div>',
    scope: {
      content: '=',
      success: '=',
      id: '='
    },
    link: function ($scope, $element, $attr, ctrl) {
      //$log.info('PhotoUploadConfig - $scope:');
      //$log.debug($scope);

      if ( ! $scope.id ) {
        $scope.id = util.getGUID();
      }
    },
    controller: PhotoUploadConfigController,
    controllerAs: 'ctrl'
  };

  function PhotoUploadConfigController($scope, $element, $attrs) {
    var ctrl = this;

    ctrl.actionOpts = RallyService.getActions();

    ctrl.exportPictures = function(){

      var stationCode = $stateParams.stationCode;

      AttachmentService.exportPicturesFromComponent(stationCode, $scope.id);
    };
  }
}
})();
