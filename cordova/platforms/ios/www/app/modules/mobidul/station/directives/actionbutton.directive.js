(function () {
  'use strict';

  angular
    .module('Mobidul')
    .directive('actionbutton', actionButton);

  actionButton.$inject = [
    '$rootScope'
  ];

  function actionButton(
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

