angular
  .module('Mobilot')
  .controller('HeaderController', HeaderController);


HeaderController.$inject = [
  '$log', '$scope', '$rootScope',
  '$state', '$stateParams', 'StateManager',
  '$mdSidenav', '$mdMedia',
  'UtilityService', 'UserService', 'GeoLocationService',
  'MobidulService', 'StationService', 'ListService', 'FontService'
];


function HeaderController (
  $log, $scope, $rootScope,
  $state, $stateParams, StateManager,
  $mdSidenav, $mdMedia,
  UtilityService, UserService, GeoLocationService,
  MobidulService, StationService, ListService, FontService
) {
  var header = this;

  /// constants
  header._defaultParamType = 0;

  header._isEditStationEnabled   = false;
  header._isCancelEditEnabled    = false;
  header._isSaveStationEnabled   = false;
  header._isCancelPanzoomEnabled = false;

  header._mobidulStationState = 'mobidul.station';


  /// vars
  header.config = {
    mobidulName : '',
    background  : '#3797c4',
    foreground  : '#fff',
    font        : ''
  };
  header.myFont = '';


  header.isCordovaIos = isCordova && isIos;
  // NOTE - removed condition : $mdMedia('sm')
  header.isMenuEnabled = isMobidul() && MobidulService.Config.isMenuEnabled;
  header.isAccountEnabled = isHome();

  header.showGoBack = (
    isLogin()           ||
    isRegister()        ||
    isRestore()         ||
    isProfile()         ||
    isPlay()            ||
    isImpressum()       ||
    ( isCreator() && isNewMobidul() )
  );

  header.isEditStationEnabled   = header._isEditStationEnabled;
  header.isCancelPanzoomEnabled = header._isCancelPanzoomEnabled;

  header.isShowImpressumEnabled = isHome();


  /// functions
  header.getTitle         = getTitle;

  header.isHome           = isHome;
  header.isHomeLogin      = isHomeLogin;
  header.isLogin          = isLogin;
  header.isRegister       = isRegister;
  header.isActivate       = header.isActivate;
  header.isRestore        = isRestore;
  header.isReset          = isReset;
  header.isProfile        = isProfile;
  header.isPlay           = header.isPlay;
  header.isImpressum      = header.isImpressum;
  header.isMobidul        = isMobidul;
  header.isStation        = isStation;
  header.isStationCreator = isStationCreator;
  header.isMedia          = isMedia;
  header.isCreator        = isCreator;
  header.isNewMobidul     = isNewMobidul;


  /// events
  header.menuOpen         = menuOpen;
  header.goToProfile      = goToProfile;
  header.goBack           = goBack;
  header.editStation      = editStation;
  header.cancelEdit       = cancelEdit;
  header.saveStation      = saveStation;
  header.cancelPanzoom    = cancelPanzoom;
  header.showImpressum    = showImpressum;


  /// construct

  _init();



  /// private functions

  function _init ()
  {
    // $log.debug('HeaderController init');
    // $log.debug(header.state);
    // $log.debug(header.params);

    _initDefaultValues();

    _refreshControls();

    // _checkIsLoggedIn();

    _listenToConfig();
    //_listenToSessionUpdate();
    _listenToRefreshHeader();
  }


  function _initDefaultValues ()
  {
    // ...
  }


  function _refreshTitle ()
  {
    $log.debug('> Refreshing Header title');
    // $log.debug(UserService.getEditStationPermit());

    if ( isMobidul() && ! isNewMobidul() )
      StateManager.setTitle( header.config.mobidulName );
  }


  function _refreshControls ()
  {
    header.isStation     = isStation();
    header.isEditStation = isStationCreator();

    // $log.debug('>> Refreshed current state');
    // $log.debug(isHome());

    header.isMenuEnabled =
      isMobidul() && ! isNewMobidul() &&
      // $mdMedia('sm') &&
      MobidulService.Config.isMenuEnabled;

    header.isAccountEnabled = isHome();


    if(header.isStation){
      UserService.getEditStationPermit()
        .then(function(EditStationPermit){
          header.isEditStationEnabled = EditStationPermit;
        });
    }else{
      header.isEditStationEnabled = header._isEditStationEnabled;
    }

    header.isCancelEditEnabled =
      ( header.isEditStation )
        ? true
        : header._isCancelEditEnabled;

    if(header.isEditStation){
      UserService.getEditStationPermit()
        .then(function(EditStationPermit){
          header.isSaveStationEnabled = EditStationPermit;
        });
    }else{
      header.isSaveStationEnabled = header._isSaveStationEnabled;
    }


    header.isCancelPanzoomEnabled =
      ( header.isMedia() )
        ? true
        : header._isCancelPanzoomEnabled;
  }


  function _listenToConfig ()
  {
    var setConfigListener =
      $rootScope.$on('rootScope:setConfig', function (event, config)
      {
        // $log.debug('Listened to "rootScope:setConfig" in HeaderController');
        // $log.debug(config);

        header.config = config;

        header.myFont = FontService.getFontClass( MobidulService.Mobidul.font );

        _refreshTitle();
      });

    $scope.$on('$destroy', setConfigListener);
  }


  function _listenToRefreshHeader ()
  {
    var refreshHeaderControlsListener =
      $rootScope.$on('Header::refresh', function (event, config)
      {
        _refreshTitle();
        _refreshControls();

        GeoLocationService.stopPositionWatching();
      });

    $scope.$on('$destroy', refreshHeaderControlsListener);
  }


  /// public functions

  function getTitle () {
    return StateManager.getTitle();
  }


  function isHome () {
    return StateManager.isHome();
  }

  function isHomeLogin () {
    return StateManager.isHomeLogin();
  }

  function isLogin () {
    return StateManager.isLogin();
  }

  function isRegister () {
    return StateManager.isRegister();
  }

  function isActivate () {
    return StateManager.isActivate();
  }

  function isRestore () {
    return StateManager.isRestore();
  }

  function isReset () {
    return StateManager.isReset();
  }

  function isProfile () {
    return StateManager.isProfile();
  }

  function isPlay () {
    return StateManager.isPlay();
  }

  function isImpressum () {
    return StateManager.isImpressum();
  }

  function isMobidul () {
    return StateManager.isMobidul();
  }

  function isStation () {
    return StateManager.isStation();
  }

  function isStationCreator () {
    return StateManager.isStationCreator();
  }

  function isMedia () {
    return StateManager.isMedia();
  }

  function isCreator () {
    return StateManager.isCreator();
  }


  function isNewMobidul () {
    return StateManager.isNewMobidul();
  }


  /// events

  function menuOpen ()
  {
    $mdSidenav('menu').toggle();
  }


  function goToProfile ()
  {
    var state = UserService.Session.isLoggedIn ? 'profile' : 'login';

    $state.go(state);
  }


  function goBack ()
  {
    // $log.debug('go back');

    StateManager.back();
  }


  function editStation ()
  {
    $log.debug('> editStation call');

    var currentStateParams = StateManager.getParams();

    var stateParams =
    {
      mobidulCode : currentStateParams.mobidulCode,
      stationCode : currentStateParams.stationCode
    };

    $log.debug('stateParams goto mobidul.station.edit.basis : ');
    $log.debug(stateParams);

    $state.go('mobidul.station.edit.basis', stateParams);
  }


  function cancelEdit ()
  {
    $rootScope.$broadcast('Header::cancelEdit');
  }


  function saveStation ()
  {
    $rootScope.$broadcast('Header::saveStation');
  }


  function cancelPanzoom ()
  {
    window.history.back();
  }


  function showImpressum ()
  {
    $state.go( StateManager.IMPRESSUM );
  }
}
