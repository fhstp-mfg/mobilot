(function () {
  'use strict';

  angular
    .module('Mobidul')
    .directive('ifnear', ifNear);

  ifNear.$inject = [
    '$log', '$rootScope',
    'GeoLocationService'
  ];

  function ifNear(
    $log, $rootScope,
    GeoLocationService
  ){
    return {
      restrict: 'E',
      scope:{
        fallback: '@',
        success: '@',
        range: '@'
      },
      template: "<div>" +
      "<div ng-if='ctrl.inaccurate'>" +
      "<span>GPS zu ungenau - gib den Code bei der Station ein:</span>" +
      "<inputcode verifier='{{fallback}}' success='verifyIfNear:{{success}}' error='say:Falscher Code, probiers nochmal!'></inputcode>" +
      "</div>" +
      "<div ng-if='!ctrl.inaccurate'>" +
      "<md-icon ng-if='ctrl.trigger'>room</md-icon>" +
      "<div ng-if='!ctrl.trigger'>" +
      "<span>{{ctrl.default}}</span>" +
      "<span ng-if='ctrl.distance'>Du bist noch {{ctrl.distance}} Meter entfernt. (± {{ctrl.accuracy}}m)</span>" +
      "<md-icon class='search-anim'>track_changes</md-icon>" +
      "</div>" +
      "</div>" +
      "</div>",

      link: function($scope, $element, $attrs, ctrl){

        //$log.info('positionicon - link - attrs:');
        //$log.debug($attrs);

        $scope.$on('inaccurate', function(event, msg){
          if(msg){
            ctrl.inaccurate = true;
          }
        });

        $scope.$on('distance', function(event, msg){
          if(msg){
            ctrl.default = null;
            ctrl.inaccurate = false;
            ctrl.distance = parseInt(msg.d);
            ctrl.accuracy = parseInt(msg.a);

            ctrl.range = parseInt($attrs.range) + ctrl.accuracy;

            if (ctrl.distance <= ctrl.range) {
              $log.info('User in Range!');
              GeoLocationService.stopPositionWatching();

              ctrl.trigger = true;

              $rootScope.$broadcast('action', $attrs.success);
            }
          }
        });

      },
      controller: function($scope, $element, $attrs){
        var ctrl = this;

        ctrl.default = "GPS wird abgerufen..."
        ctrl.inaccurate = false;
        ctrl.trigger = false;
      },
      controllerAs: 'ctrl'

    };
  }
})();
