(function () {
'use strict';

angular
  .module('Mobidul')
  .directive('mblStationProgress', StationProgress);


StationProgress.$inject = [
  '$log',
  'RallyService'
];


function StationProgress (
  $log,
  RallyService
) {
  return {
    restrict: 'E',
    scope: {
      current: '@',
      length: '@'
    },
    template: '
      <div>
        <ul
          id="ProgressBar"
          class="progressbar clearfix"
          data-progtrckr-steps="{{ length }}"
        >
          <li
            ng-class="( $index == current ) ? \'current\' : \'\'"
            ng-repeat="i in stationProgress.getNumber(length) track by $index"
            ng-click="stationProgress.goToStation($index)">
          </li>
        </ul>
      </div>
    ',

    link: function ($scope, $element, $attrs, StationProgress) {
      $scope.length = parseInt($scope.length);

      if ($scope.length > 10 ) {
        var progressBar = document.getElementById('ProgressBar');
        progressBar.style.width = ($scope.length * 80) + 'px';
      }
    },

    controller: StationProgressController,
    controllerAs: 'stationProgress'
  }



  function StationProgressController (
    $scope, $element, $attrs
  ) {
    var stationProgress = this;

    stationProgress.goToStation = function (order) {
      RallyService.setProgress(order)
        .then(function () {
          RallyService.goToStation(order);
        });
    };

    stationProgress.getNumber = function (number) {
      number = parseInt(number);
      return new Array(number);
    };
  }
}

})();
