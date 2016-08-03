(function () {
  'use strict';

angular
  .module('Mobidul')
  .directive('mblPhotoUpload', PhotoUpload);


PhotoUpload.$inject = [
  '$log', '$rootScope',
  'PhotoService', 'ActivityService'
];


function PhotoUpload (
  $log, $rootScope,
  PhotoService, ActivityService
) {
  return {
    restrict: 'E',
    template: '
      <div class="PhotoUpload">
        {{ content }}

        <form>
          <input
            type="file"
            class="hidden"
            id="{{ id }}"
            onchange="angular.element(this).scope().uploadPhoto(this)"
            accept="image/*"
          >
        </form>

        <md-button
          class="md-raised md-primary"
          ng-click="photoUpload.selectPhoto()"
        >Foto hochladen</md-button>
      </div>
    ',
    scope: {
      id: '@',
      content: '@',
      success: '@'
    },

    link: function ($scope, $element, $attr) {
      /// functions
      $scope.uploadPhoto = function (event) {
        PhotoService.uploadPhoto(event.files[0], $scope.id)
          .then(function (photo) {
            ActivityService.commitActivity({
              type: ActivityService.TYPES.USER_ACTION,
              name: ActivityService.USER_ACTIONS.UPLOAD_PICTURE,
              payload: {
                picture: photo.fileName,
                componentId: $scope.id
              }
            });

            ActivityService.pushActivity();

            $rootScope.$broadcast('action', $scope.success);
          }, function(error) {
            $log.error('Error while uploading a photo:');
            $log.debug(error);
          });
      };
    },

    controller: PhotoUploadController,
    controllerAs: 'photoUpload'
  };


  function PhotoUploadController ($scope, $element, $attrs) {
    var photoUpload = this;

    photoUpload.selectPhoto = function () {
      if (isCordova) {
        // TODO: implement native camera
        // ...
      } else {
        document.getElementById($scope.id).click();
      }
    };
  }
}
})();
