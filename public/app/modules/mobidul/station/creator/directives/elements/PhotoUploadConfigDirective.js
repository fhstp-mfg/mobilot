(function () {
  'use strict';

  angular
    .module('StationCreator')
    .directive('photoUploadConfig', PhotoUploadConfig);

  PhotoUploadConfig.$inject = [
    '$log',
    'UtilityService', 'RallyService'
  ];

  function PhotoUploadConfig(
    $log,
    util, RallyService
  ) {
    return {

      restrict: 'E',
      template: '<div>' +
        '{{content}}' +
        '<md-button class="md-raised md-primary">Foto hochladen</md-button><br>' +
        '<div class="config-part">' +
          '<md-input-container><input type="text" ng-model="content" placeholder="Erklärungstext"></md-input-container>' +
          '<action-selector data-opts="ctrl.actionOpts" data-selection="success" data-name="Erflogsaktion"></action-selector>' +
          '<md-button>Fotos runterladen</md-button>' +
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
    }
  }
})();