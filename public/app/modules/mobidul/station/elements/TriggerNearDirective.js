(function () {
'use strict';

angular
  .module('Mobidul')
  .directive('mblTriggerNear', TriggerNear);


TriggerNear.$inject = [
  '$log', '$translate', '$rootScope',
  'GeoLocationService', 'ActivityService'
];


function TriggerNear (
  $log, $translate, $rootScope,
  GeoLocationService, ActivityService
) {
  return {
    restrict: 'E',
    scope: {
      fallback: '@',
      success: '@',
      range: '@'
    },
    template: '' +
      '<div>' +
        '<div ng-if="triggerNear.inaccurate">' +
          '<span translate="GPS_INACCURATE_FALLBACK"></span>' +
          '<mbl-input-code ' +
            'data-verifier="{{ fallback }}" ' +
            'data-success="verifyIfNear:{{ success }}" ' +
            'data-error="say:Das war der falsche Code. Probiere es nochmal!"' +
          '></mbl-input-code>' +
        '</div>' +

        '<div ng-if=" ! triggerNear.inaccurate">' +
          '<md-icon ng-if="triggerNear.trigger">room</md-icon>' +
          '<div ng-if=" ! triggerNear.trigger">' +
            '<span>{{ triggerNear.default }}</span>' +
            '<span ng-if="triggerNear.distance" translate="DISTANCE_FEEDBACK" translate-values="{distance: triggerNear.distance, accuracy: triggerNear.accuracy}"></span>' +
            '<md-icon class="search-anim">track_changes</md-icon>' +
          '</div>' +
        '</div>' +
      '</div>'
    ,

    link: function ($scope, $element, $attrs, TriggerNear) {
      $scope.$on('inaccurate', function (event, inaccurate) {
        if (inaccurate) {
          TriggerNear.inaccurate = true;
        }
      });

      $scope.$on('distance', function (event, msg) {
        if (msg) {
          TriggerNear.default = null;
          TriggerNear.inaccurate = false;
          TriggerNear.distance = parseInt(msg.d);
          TriggerNear.accuracy = parseInt(msg.a);

          TriggerNear.range = parseInt($attrs.range) + TriggerNear.accuracy;

          ActivityService.commitActivity({
            type: ActivityService.TYPES.APP_EVENT,
            name: ActivityService.APP_EVENTS.USER_POSITION,
            payload: {
              distance: TriggerNear.distance,
              accuracy: TriggerNear.accuracy,
              range: TriggerNear.range,
              inaccurate: false
            }
          });

          if ( TriggerNear.distance <= TriggerNear.range ) {
            GeoLocationService.stopPositionWatching();

            TriggerNear.trigger = true;

            $rootScope.$broadcast('action', $attrs.success);
          }
        }
      });
    },

    controller: TriggerNearController,
    controllerAs: 'triggerNear'
  }



  function TriggerNearController (
    $scope, $element, $attrs
  ) {
    var triggerNear = this;

    triggerNear.default = $translate.instant('GPS_FETCHING');
    triggerNear.inaccurate = false;
    triggerNear.trigger = false;
  }
}

})();
