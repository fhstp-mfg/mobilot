angular
  .module('Login')
  .factory('UserService', UserService);


UserService.$inject = [
  '$log', '$rootScope', '$http', '$q', '$timeout',
  '$stateParams', '$translate',
  'HeaderService'
];


function UserService (
  $log, $rootScope, $http, $q, $timeout,
  $stateParams, $translate,
  HeaderService
) {
  /// constants
  var _Roles =
  {
    _isGuest  : 0,
    _isPlayer : 2,
    _isAdmin  : 1
  };

  // NOTE: these are permissions for Guest users
  var _Permits =
  {
    //RequestAllStations     : false,
    //RequestCategoryStations : false,
    //EditStation       : false
  };


  /// UserService
  var service =
  {
    // _guestName     : 'Gast',
    _guestName     : $translate.instant('LOGIN'),

    login          : login,
    logout          : logout,
    isLoggedIn      : isLoggedIn,
    register        : register,
    restoreUser     : restoreUser,
    restoreUserRole : restoreUserRole,
    changePassword  : changePassword,
    requestRestore  : requestRestore,

    getEditStationPermit        : getEditStationPermit,
    getRequestAllStationsPermit    : getRequestAllStationsPermit,
    getRequestCategoryStationsPermit : getRequestCategoryStationsPermit,


    Role   : _Roles,
    Permit : _Permits,

    Session :
    {
      isLoggedIn     : false,
      id          : null,
      username       : null,
      email          : null,
      created_at     : null,
      remember_token : null,

      role        : _Roles._isGuest
    }
  };


  /// construct
  // ...


  /// private functions

  function _checkPermits(role){
    return {
      // @description - TODO
      RequestAllStations : role == _Roles._isAdmin ||
      true /* editMode permits */ // TODO - see previous (inline-block) comment
      ,
      // @description - TODO
      RequestCategoryStations : role == _Roles._isAdmin ||
      true /* editMode permits */ // TODO - see previous (inline-block) comment
      ,
      // @description - TODO
      EditStation : role == _Roles._isAdmin ||
      ( role == _Roles._isPlayer &&
      true /* editMode permits */ ) // TODO - see previous (inline-block) comment
    };
  }


  /// services

  function login (credentials)
  {
    var postData = {
      user     : credentials.username,
      password : credentials.password
    };


    return $http.post(cordovaUrl + '/login', postData)
        .success(function (response, status, headers, config)
        {
          // $log.debug(response);

          if ( response === 'success' )
          {
            service.Session.isLoggedIn = true;
            service.Session.username   = credentials.username;
          }
        })
        .error(function (response, status, headers, config)
        {
          $log.error(response);
          $log.error(status);
        });
  }


  function logout ()
  {
    return $http.get(cordovaUrl + '/logout')
        .success(function (response, status, headers, config)
        {
          if ( response === 'success' )
          {
            var guestName = service._guestName;
            var isGuest   = _Roles._isGuest;

            service.Session.isLoggedIn = false;
            service.Session.username   = guestName;
            service.Session.role      = isGuest;

            service.Permit = angular.copy( _Permits );
          }
        })
        .error(function (response, status, headers, config)
        {
          $log.error(response);
          $log.error(status);
        })
        .then(function (response)
        {
          // $rootScope.$emit('Header::refresh');
          HeaderService.refresh();

          $rootScope.$emit('UserService::sessionUpdated');


          return response;
        });
  }


  function isLoggedIn ()
  {
    return $http.get(cordovaUrl + '/IsLoggedIn')
        .success(function (data, status, headers, config)
        {
          if ( data === 'true' )
            service.Session.isLoggedIn = true;
        })
        .error(function (data, status, headers, config)
        {
          $log.error(data);
          $log.error(status);
        });
  }


  function register (credentials)
  {
    var postData = {
      user     : credentials.username,
      email    : credentials.email,
      password : credentials.password
    };


    return $http.post(cordovaUrl + '/register', postData)
        .success(function (response, status, headers, config)
        {
          // $log.debug(response);

          service.Session.username = credentials.username;
        })
        .error(function (response, status, headers, config)
        {
          $log.error(response);
          $log.error(status);
        });
  }


  function restoreUser ()
  {
    return $http.get(cordovaUrl + '/currentUser')
        .success(function (response, status, headers, config)
        {
          // $log.debug('> restored current user successfully');
          // $log.debug(response);
          // $log.debug(response.guest);

          var isGuest    = response.guest === true ||
                   response.guest == 1;
          var isGuestNot = ! isGuest;
          // $log.debug('isGuestNot : ' + isGuestNot);

          var email      = isGuestNot ? response.email    : null;
          var guestId    = isGuest    ? response.username : null;
          var username   = isGuestNot ? response.username : service._guestName;

          var userData   =
          {
            isLoggedIn     : isGuestNot,

            id          : response.id,
            username       : username,
            email          : email,
            created_at     : response.created_at,
            remember_token : response.remember_token,
          };


          if ( isGuest )
            userData.guestId = response.usernam;


          service.Session = userData;
        })
        .error(function (response, status, headers, config)
        {
          $log.error(response);
          $log.error(status);
        });
  }


  function restoreUserRole (mobidulCode)
  {
    return $http.get( cordovaUrl + '/RoleForMobidul/' + mobidulCode )
        .success(function (response, status, headers, config)
        {
           //$log.info('> Restore user role :');
           //$log.debug(response);

          var role = angular.isDefined( response.role ) ? response.role : null;

          if ( role !== null )
          {
             //$log.info('> Setting Session role');
             //$log.debug(role);

            service.Session.role = role;

            service.Permit = _checkPermits(role);

            //$log.info('UserService - restoreUserRole - permit:');
            //$log.debug(service.Permit);
          }
        })
        .error(function (response, status, headers, config)
        {
          $log.error(response);
          $log.error(status);
        })
        .then(function ()
        {
          // $log.debug('UserService restoreUserRole data :');
          // $log.debug(data);

          // $rootScope.$emit('UserService::sessionUpdated');
          // $rootScope.$emit('Header::refresh');

          HeaderService.refresh();
        });
  }


  function changePassword (data)
  {
    var postData;


    if ( data.resetToken )
      postData = {
        route           : 'changePasswordNoAuth',
        resetToken      : data.resetToken,
        newPassword     : data.newPassword,
        confirmPassword : data.confirmPassword
      };
    else
      postData = {
        route       : 'changePassword',
        oldPassword : data.oldPassword,
        newPassword : data.newPassword
      };

    postData.route = cordovaUrl + '/' + postData.route;

    return $http.post( postData.route, postData )
        .success(function (response, status, headers, config)
        {
          // $log.debug(response);
        })
        .error(function (response, status, headers, config)
        {
          $log.error(response);
          $log.error(status);
        });
  }


  function requestRestore (userEmail)
  {
    // $log.debug('request restore');

    var postData = {
      email : userEmail
    };

    return $http.post(cordovaUrl + '/requestRestore', postData)
        .success(function (response, status, headers, config)
        {
          // $log.debug(response);
        })
        .error(function (response, status, headers, config)
        {
          $log.error(response);
          $log.error(status);
        });
  }


  /// Permits

  function getEditStationPermit ()
  {
    //$log.info('UserService - getEditStationPermit - service.Permit.EditStation:');
    //$log.debug(service.Permit);
    //return service.Permit.EditStation;

    return $q(function (resolve, reject) {
      if (service.Permit.EditStation) {
        $timeout(function () {
          resolve(service.Permit.EditStation);
        });
      } else {
        $http.get( cordovaUrl + '/RoleForMobidul/' + $stateParams.mobidulCode )
        .success(function (response, status, headers, config)
        {
          var role = angular.isDefined( response.role ) ? response.role : null;

          if ( role !== null )
          {
            service.Session.role = role;
            service.Permit = _checkPermits(role);

            resolve(service.Permit.EditStation);
          }
        });
      }
    });
  }

  function getRequestAllStationsPermit ()
  {
    return $q(function (resolve, reject) {
      if (service.Permit.RequestAllStations) {
        $timeout(function () {
          resolve(service.Permit.RequestAllStations);
        });
      } else {
        $http.get( cordovaUrl + '/RoleForMobidul/' + $stateParams.mobidulCode )
          .success(function (response, status, headers, config)
          {
            var role = angular.isDefined( response.role ) ? response.role : null;

            if ( role !== null )
            {
              service.Session.role = role;
              service.Permit = _checkPermits(role);

              resolve(service.Permit.RequestAllStations);
            }
          })
      }
    });
  }

  function getRequestCategoryStationsPermit ()
  {
    return $q(function (resolve, reject) {
      if (service.Permit.RequestCategoryStations) {
        $timeout(function () {
          resolve(service.Permit.RequestCategoryStations);
        });
      } else {
        $http.get( cordovaUrl + '/RoleForMobidul/' + $stateParams.mobidulCode )
          .success(function (response, status, headers, config)
          {
            var role = angular.isDefined( response.role ) ? response.role : null;

            if ( role !== null )
            {
              service.Session.role = role;
              service.Permit = _checkPermits(role);

              resolve(service.Permit.RequestCategoryStations);
            }
          })
      }
    });
  }


  return service;
}
