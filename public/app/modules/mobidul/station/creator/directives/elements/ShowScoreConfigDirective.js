(function () {
  'use strict';

angular
.module('StationCreator')
.directive('showScoreConfig', ShowScoreConfig);

ShowScoreConfig.$inject = [
  '$log', '$translate'
];

function ShowScoreConfig (
  $log, $translate
) {
  return {

    restrict: 'E',
    template: '<div>' +
      '<p class="preview">{{ctrl.replaceScore(content)}}</p>' +
      '<md-input-container class="config-part">' +
        '<input type="text" data-ng-model="content">' +
        '<p translate="SCORE_PLACEHOLDER_EXPLANATION"></p>' +
      '</md-input-container>' +
    '</div>',
    scope: {
      content: '='
    },
    link: function ( $scope, $element, $attr, ctrl ) {
      if ( ! $scope.content ) {
        $scope.content = $translate.instant('DEFAULT_SCORE_MESSAGE');
      }
    },
    controller: ShowScoreConfigController,
    controllerAs: 'ctrl'
  };

  function ShowScoreConfigController ( $scope, $element, $attrs ) {
    var ctrl = this;

    ctrl.replaceScore = function (string) {
      return string.replace(/SCORE/g, '100')
    }
  }
}
})();