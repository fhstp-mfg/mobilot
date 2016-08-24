/// Home
angular
  .module('Home')
  .controller('HomeController', HomeController);


HomeController.$inject = [
  '$log', '$scope', '$rootScope', '$q', '$translate',
  '$state', '$stateParams', 'StateManager',
  '$mdDialog',
  '$geolocation', 'MapService',
  'HomeService', 'UserService', 'LocalStorageService'
];


function HomeController (
  $log, $scope, $rootScope, $q, $translate,
  $state, $stateParams, StateManager,
  $mdDialog,
  $geolocation, MapService,
  HomeService, UserService, LocalStorageService
) {
  /// HomeController
  var home = this;

  /// vars
  home.isCordovaIos = isCordova && isIos;

  // home.hasPosition     = false;
  home.myPosition         = null;
  home.mobiduls           = [];
  home.isLoading          = true;

  home.searchTypeIndex    = ! StateManager.isHomeLogin()
                              ? ( $stateParams.type || HomeService.DEFAULT_SEARCH_TYPE )
                              : HomeService.MY_MOBIDULE;

  home.showFABLabels      = false;

  home.requiredLogin      = false;

  /// functions
  home.hasPosition         = hasPosition;
  // home.getCurrentPosition  = getCurrentPosition;
  home.getMyPosition       = getMyPosition;
  home.selectRequiredTab   = selectRequiredTab;
  home.changeSearchType    = changeSearchType;
  home.checkRequiredLogin  = checkRequiredLogin;
  home.loadMobiduls        = loadMobiduls;
  home.prepareMobidulsData = prepareMobidulsData;
  home.switchContent       = switchContent;
  home.switchToCreator     = switchToCreator;
  home.switchToPlay        = switchToPlay;


  /// construct

  _init();


  /// private functions

  function _init ()
  {
    $log.debug('HomeController init');

    LocalStorageService.init();
    LocalStorageService.explainNearGeoPermit(true);
  }


  function _switchSearchType ()
  {
    var path;

    switch ( home.searchTypeIndex )
    {
      case 0 :
        if ( home.myPosition )
          path = '/MobidulNearMe/' +
              home.myPosition.coords.latitude + '/' +
              home.myPosition.coords.longitude;
          home.searchPlaceholder = $translate.instant('HOME_SEARCH_PLACEHOLDER_NEAR');
        break;

      case 1 :
        path = '/GetNewestMobiduls';
        home.searchPlaceholder = $translate.instant('HOME_SEARCH_PLACEHOLDER_ALL');
        break;

      case 2 :
        path = '/MyMobiduls';
        home.searchPlaceholder = $translate.instant('HOME_SEARCH_PLACEHOLDER_MINE');
        break;

      default :
        path = '/EmptyCall';
        break;
    }


    home.checkRequiredLogin();

    if ( ! home.requiredLogin )
    {
      if ( StateManager.isHomeLogin() )
        $state
          .go('home')
          .then(function ()
          {
            home.loadMobiduls( path );
          });

      else if ( path )
        home.loadMobiduls( path );
    }
    else
    {
      // NOTE - this is important in order to hide the AppLoader
      // for home.login when e.g. redirected from Activate view
      $rootScope.$emit('rootScope:toggleAppLoader', { action : 'hide' });
    }
  }


  /// public functions

  function hasPosition ()
  {
    return MapService.hasPosition;
  }


  function getMyPosition ()
  {
    var q = $q.defer();

    MapService
      .getCurrentPosition()
      .then(function (response)
      {
        //$log.debug('HomeController getCurrentPosition callback :');
        //$log.debug(response);

        if ( response.error )
        {
          var retryPossible = true;
          var errorMessage  = $translate.instant('UNKNOWN_ERROR_MSG');

          switch ( response.error.code )
          {
            case MapService.PERMISSION_DENIED :
              errorMessage  = $translate.instant('PERMISSION_DENIED_MSG');
              retryPossible = false;
              break;

            case MapService.POSITION_UNAVAILABLE :
              errorMessage = $translate.instant('POSITION_UNAVAILABLE_MSG');
              break;

            case MapService.TIMEOUT :
              errorMessage = $translate.instant('TIMEOUT_MSG');
              break;

          }


          if ( retryPossible )
          {
            var positionErrorDialog =
              $mdDialog.alert()
                .parent(angular.element(document.body))
                .title($translate.instant('POSITION_ERROR_TITLE'))
                .textContent(errorMessage)
                .ariaLabel($translate.instant('POSITION_ERROR_TITLE'))
                .ok($translate.instant('TRY_AGAIN'))
                .cancel($translate.instant('CANCEL'));

            $mdDialog.show( positionErrorDialog )
              .then(function ()
              {
                home.getMyPosition()
                  .then(function (position)
                  {
                    _switchSearchType();
                  });

              }, function ()
              {
                home.searchTypeIndex = HomeService.ALL_MOBIDULE;
              });
          }
          else
          {
            var positionErrorDialog =
              $mdDialog.alert()
                .parent(angular.element(document.body))
                .title($translate.instant('POSITION_ERROR_TITLE'))
                .textContent( errorMessage )
                .ariaLabel($translate.instant('POSITION_ERROR_TITLE'))
                .ok($translate.instant('BACK_TO_MOBIDULS'));

            $mdDialog.show( positionErrorDialog )
              .then(function ()
              {
                home.searchTypeIndex = HomeService.ALL_MOBIDULE;
              });
          }
        }
        else if ( response.coords )
        {
          home.myPosition = response;
        }

        q.resolve( response );
      });

    return q.promise;
  }


  function selectRequiredTab ()
  {
    // $log.debug('select required tab');

    if ( StateManager.isHomeLogin() )
      home.searchTypeIndex = HomeService.NEAR_ME_MOBIDULE;

    home.changeSearchType();
  }


  function changeSearchType ()
  {
    //$log.debug('changeSearchType called at tab index :');
    //$log.debug(home.searchTypeIndex);

    home.mobiduls  = [];
    home.isLoading = true;

    if (
      home.searchTypeIndex == HomeService.NEAR_ME_MOBIDULE &&
      home.myPosition == null &&
      LocalStorageService.shouldExplainNearGeoPermit()
    ) {
      var informAboutGeoPermitDialog =
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .title($translate.instant('INFORMATION'))
          .textContent($translate.instant('EXPLAIN_NEAR_GEO_PERMIT'))
          .ariaLabel($translate.instant('INFORMATION'))
          .ok($translate.instant('OK'));

      $mdDialog.show( informAboutGeoPermitDialog )
      .then(function () {
        LocalStorageService.explainNearGeoPermit(false);

        home.getMyPosition()
          .then(function (position)
          {
            _switchSearchType();
          });
      });
    } else {
      _switchSearchType();
    }
  }


  function checkRequiredLogin () {
    // $log.debug('check required login');
    // $log.debug(home.searchTypeIndex);

    if ( home.searchTypeIndex == HomeService.MY_MOBIDULE ) {
      // $log.debug(UserService.Session);

      var  requiredLogin = ! UserService.Session.isLoggedIn;

      home.requiredLogin = requiredLogin;

      if ( requiredLogin )
        $state.go('home.login');
    } else {
      home.requiredLogin = false;

      // TODO - check if this is necessary
      // $state.go('home', { from : 'home' });
    }
  }


  function loadMobiduls (path)
  {
    // $log.debug('> HomeController loading : ' + path);

    HomeService.getMobiduls( cordovaUrl + path )
    .success(function (data, status, headers, config) {
      // $log.debug('HomeController loadMobiduls callback :');
      // $log.debug(data);

      var mobidulsData = home.prepareMobidulsData( data );

      // NOTE - save mobiduls data to show
      home.mobiduls = mobidulsData;
    })
    .error(function (data, status, headers, config) {
      $log.error(data);
      $log.error(status);
    })
    .then(function () {
      home.isLoading = false;

      $rootScope.$emit('rootScope:toggleAppLoader', { action : 'hide' });
    });
  }


  function prepareMobidulsData (data) {
    for ( var i = 0; i < data.length; i++ )
    {
      // $log.debug(data[ i ].name);
      // $log.debug(data[ i ].background);

      // mobidul background color
      data[ i ].background =
        data[ i ].background
          ? data[ i ].background : '#ccc';

      // mobidul foreground color
      data[ i ].foreground =
        data[ i ].foreground
          ? data[ i ].foreground : '#fff';


      var noDescription = data[ i ].description == '';
      data[ i ].noDescription = noDescription;

      var distance = data[ i ].distance;

      // NOTE - check if : if ( distance ) condition is better
      if ( distance )

        if ( distance < 1 )
          data[ i ].distance = Math.round(distance * 1000) + 'm';

        else
          data[ i ].distance = Math.round(distance) + 'km';


      if ( ! noDescription ) {
        // break lines
      }
    }

    return data;
  }


  function switchContent (code)
  {
    $state.go('mobidul.map', { mobidulCode : code });
  }


  /// events

  function switchToCreator ()
  {
    if ( ! UserService.Session.isLoggedIn ) {
      var stateParams = StateManager.state.params;
      $state.go(StateManager.LOGIN, stateParams);
    } else {
      $state.go('mobidul.creator.basis',
        {
          mobidulCode: StateManager.NEW_MOBIDUL_CODE
        });
    }
  }

  function switchToPlay ()
  {
    $state.go('play');
  }

}
