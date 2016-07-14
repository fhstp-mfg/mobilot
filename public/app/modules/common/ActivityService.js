angular
  .module('Mobilot')
  .factory('ActivityService', ActivityService);

ActivityService.$inject = [
  '$log', '$http'
];


function ActivityService (
  $log, $http
) {
  /// ActivityService
  var service =
  {
    // constants
    TYPES: {
      APP_EVENT: 'APP_EVENT',
      USER_ACTION: 'USER_ACTION'
    },

    APP_EVENTS: {
      USER_POSITION: 'USER_POSITION',
      GEOLOCATION_SUCCESS: 'GEOLOCATION_SUCCESS',
      GEOLOCATION_ERROR: 'GEOLOCATION_ERROR',
      INPUTCODE_SUCCESS: 'INPUTCODE_SUCCESS'
    },

    USER_ACTIONS: {
      UPLOAD_PICTURE: 'UPLOAD_PICTURE'
    },

    // vars
    _activityStore: [],

    // services
    commitActivity: commitActivity,
    pushActivity: pushActivity
  }


  /// services

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
      }
      service._activityStore.push(activityObj)

      return true
    } else {
      console.error('Passed an invalid activity object: ', activity);
      console.info('Please provide an object with type, name and a payload activity.');

      return false
    }
  }


  function pushActivity () {
    return $http.post(cordovaUrl + '/PushActivity', service._activityStore)
    .success(function (response) {
      console.debug('pushActivity response: ', response);
    })
    .error(function (error) {
      console.error('pushActivity error: ', error);
    });
  }


  return service;
}
