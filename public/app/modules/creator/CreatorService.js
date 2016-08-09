angular
  .module('Creator')
  .factory('CreatorService', CreatorService);


CreatorService.$inject = [
  '$log', '$http', '$translate'
];


function CreatorService (
  $log, $http, $translate
) {
  /// CreatorService
  var service = {
    /// constants
    BASIS_TAB_INDEX      : 0,
    CATEGORIES_TAB_INDEX : 1,
    MENU_TAB_INDEX       : 2,
    SETTINGS_TAB_INDEX   : 3,

    MOBIDUL_CODE_EXAMPLE : 'mobidul-code',

    DEFAULT_FONT         : 'default',


    /// services
    getCategories    : getCategories,
    getOptions       : getOptions,
    getConfig        : getConfig,

    existsMobidul    : existsMobidul,
    createMobidul    : createMobidul,
    updateMobidul    : updateMobidul,
    deleteMobidul    : deleteMobidul,
    saveOptions      : saveOptions,
    updateCategories : updateCategories,
    removeCategory   : removeCategory,
    saveMenu         : saveMenu,

    getCodes         : getCodes,
    requestCode      : requestCode,
    lockCode         : lockCode,
    unlockCode       : unlockCode,
    deleteCode       : deleteCode,
  };



  /// services

  function existsMobidul (mobidulCode) {
    var mobidulCode = mobidulCode.replace(/[^a-z0-9]/g, '');

    return $http.get(cordovaUrl + '/existsMobidul/' + mobidulCode)
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);

      // TODO: Check whether returning the response might be needed for
      // follow-up promise call such as .success()
      return response;
    });
  }


  function createMobidul (params) {
    var mobidulData = JSON.stringify(params);

    return $http.post(cordovaUrl + '/NewMobidul', mobidulData)
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);

      // TODO: Check whether returning the response might be needed for
      // follow-up promise call such as .success()
      return response;
    });
  }


  function updateMobidul (mobidulCode, params) {
    var mobidulData = JSON.stringify(params);

    return $http.post(cordovaUrl + '/' + mobidulCode + '/UpdateMobidul', mobidulData)
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);

      // TODO: Check whether returning the response might be needed for
      // follow-up promise call such as .success()
      return response;
    });
  }


  function deleteMobidul (mobidulCode) {
    var params = { mobidulCode : mobidulCode };
    var mobidulData = JSON.stringify( params );

    return $http.post(cordovaUrl + '/DeleteMobidul', mobidulData)
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);

      // TODO: Check whether returning the response might be needed for
      // follow-up promise call such as .success()
      return response;
    });
  }


  function saveOptions (mobidulCode, params) {
    return $http.post(cordovaUrl + '/' + mobidulCode + '/SetOptions', params)
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);

      // TODO: Check whether returning the response might be needed for
      // follow-up promise call such as .success()
      return response;
    });
  }


  function updateCategories (mobidulCode, params) {
    return $http.post(cordovaUrl + '/' + mobidulCode + '/UpdateCategories', params)
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);

      // TODO: Check whether returning the response might be needed for
      // follow-up promise call such as .success()
      return response;
    });
  }


  function removeCategory (mobidulCode, categoryId) {
    return $http.get(cordovaUrl + '/' + mobidulCode + '/RemoveCategory/' + categoryId)
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);

      // TODO: Check whether returning the response might be needed for
      // follow-up promise call such as .success()
      return response;
    });
  }


  function getCategories (mobidulCode) {
    return $http.get(cordovaUrl + '/' + mobidulCode + '/GetCategories')
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);

      // TODO: Check whether returning the response might be needed for
      // follow-up promise call such as .success()
      return response;
    });
  }


  function getOptions (mobidulCode) {
    return $http.get(cordovaUrl + '/' + mobidulCode + '/GetOptions')
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);

      // TODO: Check whether returning the response might be needed for
      // follow-up promise call such as .success()
      return response;
    });
  }


  function getConfig (mobidulCode) {
    return $http.get(cordovaUrl + '/' + mobidulCode + '/getConfig')
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);

      // TODO: Check whether returning the response might be needed for
      // follow-up promise call such as .success()
      return response;
    });
  }

  function getCodes (mobidulCode) {
    return $http.get(cordovaUrl + '/Codes/' + mobidulCode)
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);

      // TODO: Check whether returning the response might be needed for
      // follow-up promise call such as .success()
      return response;
    });
  }

  function requestCode (mobidulCode) {
    return $http.post(cordovaUrl + '/' + mobidulCode + '/GetPlayCode', {})
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);

      // TODO: Check whether returning the response might be needed for
      // follow-up promise call such as .success()
      return response;
    });
  }

  function lockCode (codeToLock) {
    return $http.get(cordovaUrl + '/CloseCode/' + codeToLock)
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);

      // TODO: Check whether returning the response might be needed for
      // follow-up promise call such as .success()
      return response;
    });
  }

  function unlockCode (codeToUnlock) {
    return $http.get(cordovaUrl + '/OpenCode/' + codeToUnlock)
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);

      // TODO: Check whether returning the response might be needed for
      // follow-up promise call such as .success()
      return response;
    });
  }

  function deleteCode (codeToDelete) {
    return $http.get(cordovaUrl + '/DeleteCode/' + codeToDelete)
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);

      // TODO: Check whether returning the response might be needed for
      // follow-up promise call such as .success()
      return response;
    });
  }



  function saveMenu (mobidulCode, params) {
    var params = JSON.stringify(params);
    return $http.post(cordovaUrl + '/' + mobidulCode + '/UpdateNavigation', params)
    .error(function (response, status, headers, config) {
      $log.error(response);
      $log.error(status);

      // TODO: Check whether returning the response might be needed for
      // follow-up promise call such as .success()
      return response;
    });
  }


  return service;
}
