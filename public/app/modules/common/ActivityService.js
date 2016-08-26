angular
  .module('Mobilot')
  .factory('ActivityService', ActivityService);

ActivityService.$inject = [
  '$log', '$http', '$interval', '$q',
  'StateManager'
];


function ActivityService (
  $log, $http, $interval, $q,
  StateManager
) {
  /// ActivityService
  var service =
  {
    /// constants
    TYPES: {
      APP_EVENT: 'APP_EVENT',
      USER_ACTION: 'USER_ACTION'
    },

    APP_EVENTS: {
      USER_POSITION: 'USER_POSITION',
      GEOLOCATION_SUCCESS: 'GEOLOCATION_SUCCESS',
      GEOLOCATION_ERROR: 'GEOLOCATION_ERROR'
    },

    USER_ACTIONS: {
      UPLOAD_PICTURE: 'UPLOAD_PICTURE',
      INPUTCODE_SUCCESS: 'INPUTCODE_SUCCESS',
      INPUTCODE_ERROR: 'INPUTCODE_ERROR',
      FREE_TEXT_INPUT: 'FREE_TEXT_INPUT'
    },

    PUSH_INTERVAL: 15000, //ms

    /// vars
    // private
    _activityStore: [],
    _interval: null,

    /// functions
    /// services
    commitActivity: commitActivity,
    pushActivity: pushActivity,
    startPushInterval: startPushInterval,
    stopPushInterval: stopPushInterval
  };


  /// services

  /**
   * commitActivity:
   * Commiting an activity object locally to a private activity store.
   *
   * @param activity An object describing the activity that should be commited locally.
   * The activity object requires the following format:
   *
   * var activity = {
   *   type: ActivityService.TYPES.{ACTIVITY_TYPE},
   *   name: ActivityService.{ACTIVITY_TYPE}.{ACTIVITY_NAME}
   *   payload: {
   *     {ACTIVITY_PAYLOAD}
   *   }
   * }
   */
  function commitActivity (activity) {
    if (
      typeof activity === 'object' &&
      typeof activity.type !== 'undefined' &&
      activity.type in service.TYPES &&
      typeof activity.name !== 'undefined' &&
      ( activity.name in service.APP_EVENTS ||
        activity.name in service.USER_ACTIONS
      ) &&
      typeof activity.payload === 'object'
    ) {
      var activityObj = {
        type: activity.type,
        name: activity.name,
        payload: activity.payload
      };

      service._activityStore.push(activityObj);
      // $log.debug(service._activityStore);

      return true
    } else {
      $log.error('Passed an invalid activity object:', activity);
      $log.info('Please provide an object with type, name and a payload activity.');

      return false
    }
  }


  function pushActivity () {
    var stateParams = StateManager.getParams();
    var mobidulCode = stateParams.mobidulCode;

    var defer = $q.defer();

    $http.post(
      cordovaUrl + '/' + mobidulCode + '/PushActivity',
      service._activityStore
    )
    .success(function (response) {

      //$log.debug('pushActivity response:', response);
      defer.resolve(response);
      // Clear activity store, ready for next chunk
      _clearActivityStore();
    })
    .error(function (error) {
      defer.reject(error);
      $log.error("Couldn't push activity to server.");
      $log.error(error);
    });

    return defer.promise;
  }

  function startPushInterval () {

    service._interval = $interval(function () {

      //$log.debug('interval', service._activityStore);

      if (service._activityStore[0]) {
        service.pushActivity().then(function () {
        });
      }
    }, service.PUSH_INTERVAL);

  }

  function stopPushInterval () {

    if (service._interval) {
      $interval.cancel(service._interval);
      service.pushActivity();
    }
  }


  /// private

  function _clearActivityStore () {
    service._activityStore = [];
  }


  return service;
}
