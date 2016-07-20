(function () {
  'use strict';

  angular
    .module('Mobidul')
    .directive('mblPhotoUpload', PhotoUpload);

  PhotoUpload.$inject = [
    '$log', '$rootScope',
    'PhotoService'
  ];

  function PhotoUpload(
    $log, $rootScope,
    PhotoService
  ) {
    return {

      restrict: 'E',
      template: '<div>' +
      '{{content}}' +
      '<form><input type="file" style="display: none;" id="{{id}}" onchange="angular.element( this ).scope().uploadPhoto( this )" accept="image/*"></form>' +
      '<md-button class="md-raised md-primary" data-ng-click="ctrl.selectPhoto()">Foto hochladen!</md-button>' +
      '</div>',
      scope: {
        content: '@',
        id: '@',
        success: '@'
      },
      link: function ($scope, $element, $attr, ctrl) {

        $scope.uploadPhoto = function (e) {
          //$log.debug(e.files[0]);
          PhotoService.uploadPhoto(e.files[0], $scope.id)
            .then(function(photo){
              $log.info('upload was successful:');
              $log.debug(photo);

              $rootScope.$broadcast('action', $scope.success);
            }, function(error){
              $log.error('Error while uploading a photo:');
              $log.debug(error);
            });
        };

      },
      controller: PhotoUploadController,
      controllerAs: 'ctrl'
    };

    function PhotoUploadController($scope, $element, $attrs) {
      var ctrl = this;

      ctrl.selectPhoto = function () {
        if(isCordova){
          // TODO: implement native camera
          // ...
        }else{
          document.getElementById($scope.id).click();
        }
      };

    }
  }
})();