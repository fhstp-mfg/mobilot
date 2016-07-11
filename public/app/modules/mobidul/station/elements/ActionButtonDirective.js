(function () {
  'use strict';

  angular
    .module('Mobidul')
    .directive('mblActionButton', ActionButton);

  ActionButton.$inject = [
    '$rootScope'
  ];

  function ActionButton(
    $rootScope
  ){
    return {
      restrict: "E",
      transclude: true,
      scope:{
        success: '@'
      },
      template: "<div><md-button class='md-raised md-primary' ng-click='ctrl.clicked()'><ng-transclude></ng-transclude></md-button></div>",
      controller: function($scope, $element, $attrs){
        var ctrl = this;

        ctrl.clicked = function(){
          $rootScope.$broadcast('action', $attrs.success);
        }
      },
      controllerAs: 'ctrl'
    };
  }

})();

