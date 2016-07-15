(function () {
  'use strict';

  angular
    .module('Mobidul')
    .directive('mblPhotoUpload', PhotoUpload);

  PhotoUpload.$inject = [];

  function PhotoUpload() {
    return {

      restrict: 'E',
      template: '<div>' +
      '{{content}}' +
      '<md-button class="md-raised md-primary">Foto hochladen!</md-button>' +
      '</div>',
      scope: {
        content: '@',
        id: '@',
        success: '@'
      },
      link: function ($scope, $element, $attr, ctrl) {

      },
      controller: PhotoUploadController,
      controllerAs: 'ctrl'
    };

    function PhotoUploadController($scope, $element, $attrs) {
      var ctrl = this;

    }
  }
})();