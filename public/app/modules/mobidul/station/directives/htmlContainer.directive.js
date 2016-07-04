(function () {
  'use strict';

  angular
    .module('Mobidul')
    .directive('htmlcontainer', htmlContainer);

  htmlContainer.$inject = [
  ];

  function htmlContainer(
  ){

    return {
      restrict: 'E',
      transclude: true,
      template: '<div><div ng-transclude></div><br/></div>'
    };
  }

})();