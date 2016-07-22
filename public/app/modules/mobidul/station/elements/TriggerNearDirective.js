(function () {
  'use strict';

  angular
    .module('Mobidul')
    .directive('mblTriggerNear', TriggerNear);

  TriggerNear.$inject = [
    '$log', '$rootScope',
    'GeoLocationService', 'ActivityService'
  ];

  function TriggerNear (
    $log, $rootScope,
    GeoLocationService, ActivityService
  ) {
    return {
      restrict: 'E',
      scope: {
        fallback: '@',
        success: '@',
        range: '@'
      },
      template: "<div>" +
        "<div data-ng-if='ctrl.inaccurate'>" +
          "<span>GPS zu ungenau - gib den Code bei der Station ein:</span>" +
          "<mbl-input-code data-verifier='{{fallback}}' data-success='verifyIfNear:{{success}}' data-error='say:Falscher Code, probiers nochmal!'></mbl-input-code>" +
        "</div>" +
        "<div data-ng-if='!ctrl.inaccurate'>" +
          "<md-icon data-ng-if='ctrl.trigger'>room</md-icon>" +
          "<div data-ng-if='!ctrl.trigger'>" +
            "<span>{{ctrl.default}}</span>" +
            "<span data-ng-if='ctrl.distance'>Du bist noch {{ctrl.distance}} Meter entfernt. (± {{ctrl.accuracy}}m)</span>" +
            "<md-icon class='search-anim'>track_changes</md-icon>" +
          "</div>" +
        "</div>" +
      "</div>",

      link: function ($scope, $element, $attrs, ctrl) {
        // $log.info('positionicon - link - attrs:');
        // $log.debug($attrs);

        $scope.$on('inaccurate', function (event, inaccurate) {
          if (inaccurate) {
            ctrl.inaccurate = true;

            /* to much noise in activity logs, is this necessary?
            ActivityService.commitActivity({
              type: ActivityService.TYPES.APP_EVENT,
              name: ActivityService.APP_EVENTS.USER_POSITION,
              payload: {
                inaccurate: true
              }
            });
            */
          }
        });

        $scope.$on('distance', function (event, msg) {
          if (msg) {
            ctrl.default = null;
            ctrl.inaccurate = false;
            ctrl.distance = parseInt(msg.d);
            ctrl.accuracy = parseInt(msg.a);

            ctrl.range = parseInt($attrs.range) + ctrl.accuracy;

            ActivityService.commitActivity({
              type: ActivityService.TYPES.APP_EVENT,
              name: ActivityService.APP_EVENTS.USER_POSITION,
              payload: {
                distance: ctrl.distance,
                accuracy: ctrl.accuracy,
                range: ctrl.range,
                inaccurate: false
              }
            });

            if (ctrl.distance <= ctrl.range) {
              $log.info('User in Range!');
              GeoLocationService.stopPositionWatching();

              ctrl.trigger = true;

              $rootScope.$broadcast('action', $attrs.success);
            }
          }
        });
      },
      controller: function ($scope, $element, $attrs) {
        var ctrl = this;

        ctrl.default = 'GPS wird abgerufen...';
        ctrl.inaccurate = false;
        ctrl.trigger = false;
      },
      controllerAs: 'ctrl'
    }
  }
})();
