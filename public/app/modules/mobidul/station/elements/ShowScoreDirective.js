(function () {
'use strict';

angular
.module('Mobidul')
.directive('mblShowScore', ShowScore);

ShowScore.$inject = [
  '$log', '$stateParams',
  'LocalStorageService'
];

function ShowScore (
  $log, $stateParams,
  LocalStorageService
) {
  return {

    restrict: 'E',
    template: '<div>{{ctrl.parsedScore}}' +
              '<md-divider style="margin-bottom: 1em; margin-top: 0.5em"></md-divider>'+
              '</div>',
    scope: {
      content : '@'
    },
    link: function ( $scope, $element, $attr, ctrl ) {
      ctrl.replaceScore();
    },
    controller: ShowScoreController,
    controllerAs: 'ctrl'
  };

  function ShowScoreController ( $scope, $element, $attrs ) {
    var ctrl = this;

    ctrl.replaceScore = function ( ) {

      LocalStorageService.getScore($stateParams.mobidulCode)
      .then(function (score) {
        ctrl.parsedScore = $scope.content.replace(/SCORE/g, score);
      });
    }
  }
}
})();