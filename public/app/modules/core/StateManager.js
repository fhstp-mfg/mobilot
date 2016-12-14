angular
  .module('Mobilot')
  .factory('StateManager', StateManager);


StateManager.$inject = [
  '$log', '$state', '$stateParams', 'StateModel', '$translate',
  'UtilityService', 'HeaderService',
  'MobidulService', 'StationCreatorService', 'CreatorService'
];


function StateManager (
  $log, $state, $stateParams, State, $translate,
  UtilityService, HeaderService,
  MobidulService, StationCreatorService, CreatorService
) {
  var service = {
    /// constants
    DEFAULT_NAME: 'home',
    DEFAULT_PARAMS: {},
    DEFAULT_TITLE: 'Mobilot',

    BACK_TO_LOGIN: $translate.instant('LOGIN'),
    PLAY_TITLE: $translate.instant('JOIN'),

    HOME: 'home',
    HOME_LOGIN: 'home.login',
    LOGIN: 'login',
    REGISTER: 'register',
    ACTIVATE: 'activate',
    RESTORE: 'restore',
    RESET: 'reset',
    PROFILE: 'profile',
    PLAY: 'play',
    IMPRESSUM: 'impressum',
    MOBIDUL: 'mobidul',
    MOBIDUL_MAP: 'mobidul.map',
    MOBIDUL_STATION: 'mobidul.station',
    MOBIDUL_ABOUT: 'mobidul.about',
    LIST: 'mobidul.list',
    STATION: 'mobidul.station',
    STATION_VERIFY: 'mobidul.station.verify',
    STATION_CREATOR: 'mobidul.station.edit',
    STATION_CREATOR_BASIS: 'mobidul.station.edit.basis',
    STATION_CREATOR_PLACE: 'mobidul.station.edit.place',
    STATION_CREATOR_CATEGORIES: 'mobidul.station.edit.categories',
    STATION_CREATOR_SETTINGS: 'mobidul.station.edit.settings',
    MEDIA: 'mobidul.media',
    CREATOR: 'mobidul.creator',
    CREATOR_BASIS: 'mobidul.creator.basis',
    CREATOR_CATEGORIES: 'mobidul.creator.categories',
    CREATOR_MENU: 'mobidul.creator.menu',
    CREATOR_SETTINGS: 'mobidul.creator.settings',

    NEW_MOBIDUL_CODE: 'new-mobidul',
    NEW_STATION_CODE: 'new-station',

    // vars
    state: {},
    previous: null,

    reverseState: false,

    // services
    set: set,
    back: back,
    comesFrom: comesFrom,
    redirectLogin: redirectLogin,

    getParams: getParams,
    getTitle: getTitle,
    setTitle: setTitle,

    // is state services
    is: is,
    isHome: isHome,
    isHomeLogin: isHomeLogin,
    isLogin: isLogin,
    isRegister: isRegister,
    isActivate: isActivate,
    isRestore: isRestore,
    isReset: isReset,
    isProfile: isProfile,
    isPlay: isPlay,
    isImpressum: isImpressum,
    isMobidul: isMobidul,
    isMobidulMap: isMobidulMap,
    isMobidulStation: isMobidulStation,
    isList: isList,
    isStation: isStation,
    isStationVerify: isStationVerify,
    isStationCreator: isStationCreator,
    isStationCreatorBasis: isStationCreatorBasis,
    isStationCreatorPlace: isStationCreatorPlace,
    isStationCreatorCategories: isStationCreatorCategories,
    isStationCreatorSettings: isStationCreatorSettings,
    isMedia: isMedia,
    isCreator: isCreator,
    isCreatorBasis: isCreatorBasis,
    isCreatorCategories: isCreatorCategories,
    isCreatorMenu: isCreatorMenu,
    isCreatorSettings: isCreatorSettings,

    // state params services
    isNewMobidul: isNewMobidul,
    isNewStation: isNewStation
  };



  /// services

  function set (toState, toParams) {
    // $log.debug('Setting currentState:');
    // $log.debug(toState);
    // $log.debug(toParams);

    var previousState = null;

    if ( ! service.reverseState ) {
      var state = State.make();

      state.name = toState.name || service.DEFAULT_NAME;
      state.params = toParams || service.DEFAULT_PARAMS;

      if (service.state.name) {
        // NOTE: make object copy without reference
        previousState = angular.copy(service.state);
      }

      service.state = state;

      _initStateHelpers();
      _rememberPreviousState(previousState);
    } else {
      service.state = angular.copy(service.state.previous);
      service.reverseState = false;
    }

    $log.debug('Current State:');
    $log.debug(service.state);

    _refreshTitle();
  }


  function back () {
    var previous = _getPrevious();

    $log.debug('StateManager go back to:');
    $log.debug(previous);

    if (previous) {
      if (previous.name) {
        service.reverseState = true;

        $state.go(previous.name, previous.params);
      } else {
        $log.error('Previous state has no name.');

        return false;
      }
    } else {
      $log.error('There is no previous state.')

      // NOTE: don't leave the user hanging; at least help the user back to the start.
      $state.go(service.DEFAULT_NAME, service.DEFAULT_PARAMS);

      return false;
    }
  }


  /**
   * NOTE: use only after previous state has been set, or pass previous state object
   */
  function comesFrom (stateName, previousState) {
    var previousState = previousState || service.state.previous;

    if (previousState) {
      var prevStateName = previousState.name || null;

      if ( stateName && prevStateName ) {
        return (
          stateName === prevStateName
          || UtilityService.startsWithIn(stateName, prevStateName)
        )
      }
    }

    return false
  }


  function redirectLogin() {
    $log.debug('StateManager redirect Login:');

    var backSuccess = service.back();

    if ( ! backSuccess ) {
      $state.reload();
    }
  }



  function getParams() {
    return service.state.params;
  }


  function getTitle() {
    return service.state.title || service.DEFAULT_TITLE;
  }

  function setTitle (title) {
    service.state.title = title;
  }



  function is (stateName) {
    return service.state.name === stateName;
  }

  function isHome() {
    return service.state.name === service.HOME;
  }

  function isHomeLogin() {
    return service.state.name === service.HOME_LOGIN;
  }

  function isLogin() {
    return service.state.name === service.LOGIN;
  }

  function isRegister() {
    return service.state.name === service.REGISTER;
  }

  function isActivate() {
    return service.state.name === service.ACTIVATE;
  }

  function isRestore() {
    return service.state.name === service.RESTORE;
  }

  function isReset() {
    return service.state.name === service.RESET;
  }

  function isProfile() {
    return service.state.name === service.PROFILE;
  }

  function isPlay() {
    return service.state.name === service.PLAY;
  }

  function isImpressum() {
    return service.state.name === service.IMPRESSUM;
  }

  function isMobidul() {
    return UtilityService.startsWithIn( service.MOBIDUL, service.state.name );
  }

  function isMobidulMap() {
    return service.state.name === service.MOBIDUL_MAP;
  }

  function isMobidulStation() {
    return service.state.name === service.MOBIDUL_STATION;
  }

  function isList() {
    return service.state.name === service.LIST;
  }

  function isStation() {
    return service.state.name === service.STATION;
  }

  function isStationVerify() {
    return service.state.name === service.STATION_VERIFY;
  }

  function isStationCreator() {
    return UtilityService.startsWithIn( service.STATION_CREATOR, service.state.name );
  }

  function isStationCreatorBasis() {
    return service.state.name === service.STATION_CREATOR_BASIS;
  }

  function isStationCreatorPlace() {
    return service.state.name === service.STATION_CREATOR_PLACE;
  }

  function isStationCreatorCategories() {
    return service.state.name === service.STATION_CREATOR_CATEGORIES;
  }

  function isStationCreatorSettings() {
    return service.state.name === service.STATION_CREATOR_SETTINGS;
  }

  function isMedia() {
    return service.state.name === service.MEDIA;
  }

  function isCreator() {
    return UtilityService.startsWithIn( service.CREATOR, service.state.name );
  }

  function isCreatorBasis() {
    return service.state.name === service.CREATOR_BASIS;
  }

  function isCreatorCategories() {
    return service.state.name === service.CREATOR_CATEGORIES;
  }

  function isCreatorMenu() {
    return service.state.name === service.CREATOR_MENU;
  }

  function isCreatorSettings() {
    return service.state.name === service.CREATOR_SETTINGS;
  }


  function isNewMobidul() {
    return service.state.params.mobidulCode === service.NEW_MOBIDUL_CODE;
  }

  function isNewStation() {
    return service.state.params.stationCode === service.NEW_STATION_CODE;
  }



  /// private functions


  /**
   * NOTE: use only after state has been set
   */
  function _initStateHelpers() {
    $log.debug('Init helper params in StateManager: ');
    $log.debug(service.state);

    service.state.helpers = {};

    if ( isStationCreator() ) {
      if ( isStationCreatorBasis() ) {
        service.state.helpers.tabIndex = StationCreatorService.BASIS_TAB_INDEX;
      } else if ( isStationCreatorPlace() ) {
        service.state.helpers.tabIndex = StationCreatorService.PLACE_TAB_INDEX;
      } else if ( isStationCreatorCategories() ) {
        service.state.helpers.tabIndex = StationCreatorService.CATEGORIES_TAB_INDEX;
      } else if ( isStationCreatorSettings() ) {
        service.state.helpers.tabIndex = StationCreatorService.SETTINGS_TAB_INDEX;
      }
    } else if ( isCreator() ) {
      if ( isCreatorBasis() ) {
        service.state.helpers.tabIndex = CreatorService.BASIS_TAB_INDEX;
      } else if ( isCreatorCategories() ) {
        service.state.helpers.tabIndex = CreatorService.CATEGORIES_TAB_INDEX;
      } else if ( isCreatorMenu() ) {
        service.state.helpers.tabIndex = CreatorService.MENU_TAB_INDEX;
      } else if ( isCreatorSettings() ) {
        service.state.helpers.tabIndex = CreatorService.SETTINGS_TAB_INDEX;
      }
    }
  }



  /**
   * NOTE: use only after state has been set
   */
  function _rememberPreviousState(previousState) {
    // NOTE: make object copy without reference
    // var potentialState = angular.copy(service.state);

    $log.debug('Remembering previous state:');
    $log.debug(previousState);
    // $log.debug(comesFrom( service.HOME_LOGIN, previousState ));


    // NOTE: these are "same-level" states which replace the previous state
    // TODO: collection for "same-level" states
    if (
      // NOTE: LOGIN and REGISTER
      ( isLogin() && comesFrom( service.REGISTER, previousState ) ) ||
      ( isRegister() && comesFrom( service.LOGIN, previousState ) ) ||
      // NOTE: LOGIN and PROFILE
      ( isProfile() && comesFrom( service.LOGIN, previousState ) ) ||
      ( isLogin() && comesFrom( service.PROFILE, previousState ) ) ||
      // NOTE: PROFILE and REGISTER
      // TODO: isProfile and comesFrom REGISTER
      // ( isProfile()   && comesFrom( service.REGISTER, previousState ) ) ||
      // ( isRegister()   && comesFrom( service.PROFILE, previousState ) ) ||
      // HOME and HOME_LOGIN
      ( isHomeLogin() && comesFrom( service.HOME, previousState ) ) ||
      ( isHome() && comesFrom( service.HOME_LOGIN, previousState ) ) ||
      ( isHomeLogin() && comesFrom( service.HOME_LOGIN, previousState ) ) ||
      /*( isRestore()   && comesFrom( service.HOME_LOGIN, previousState ) ) ||*/
      // NOTE: MOBIDUL (mobidul.*)
      (
        isMobidul() && comesFrom( service.MOBIDUL, previousState ) &&
        (
          isStationCreator() &&
          ! comesFrom( service.STATION, previousState ) &&
          ! comesFrom( service.LIST, previousState )
        )
      )
    ) {
      $log.debug('SAME-LEVEL STATE');
      // NOTE: this is the previous state of the previous state,
      // which we want to replace with the current previous state
      var previousPreviousState = previousState.previous;

      service.state.previous = previousPreviousState;
    } else {
      $log.debug('NON SAME-LEVEL STATE');

      service.state.previous = previousState;
    }
  }



  /**
   * NOTE: use only after state has been set
   */
  function _refreshTitle() {
    $log.debug('Refreshing Header title: ');
    $log.debug(service.state);


    if ( isHome() || isHomeLogin() ) {
      $log.debug('STATE: home or home.login ->');

      service.setTitle('Mobilot');
    } else if (
      ( isRegister() || isLogin() ) &&
      comesFrom( service.HOME_LOGIN )
    ) {
      $log.debug('STATE: ( register or login ) and comes from home.login ->');

      service.setTitle( service.BACK_TO_LOGIN );
    } else if (
      isMobidul() ||
      (
        ( isLogin() || isProfile() ) &&
        comesFrom( service.MOBIDUL )
      )
    ) {
      $log.debug('STATE: comes from mobidul.* ->');
      $log.debug('WARN: in case of isMobidul don\'t set Header title after "rootScope:setConfig" anymore !');
      // $log.debug('MobidulService.Mobidul.categoryName: ')
      // $log.debug( MobidulService.Mobidul.categoryName );

      $translate.onReady(function() {
        // TODO: fix here new mobidul flickering title !!! + play title
        var mobidulName  = MobidulService.Mobidul.mobidulName ||
        $translate.instant('NEW_MOBIDUL_NAME');

        var categoryName = MobidulService.Mobidul.categoryName;
        categoryName = (categoryName) ?
          ( ': ' + MobidulService.Mobidul.categoryName ): '';

        // TODO: add category to header (probably not best place here)
        var mobidulTitle = mobidulName + categoryName;
        mobidulTitle = mobidulName; // NOTE: not finished yet ...

        service.setTitle(mobidulTitle);

        MobidulService.Mobidul.categoryName = null;
      });
    } else if ( isLogin() || isRegister() || isReset() || isProfile() ) {
      $log.debug('STATE: login or register or reset or profile ->');

      service.setTitle('MOBIDUL_SELECTION');
    } else if ( isRestore() ) {
      // TODO: check if this can be moved up to escape code duplication

      $log.debug('STATE: restore ->');

      service.setTitle( service.BACK_TO_LOGIN );
    } else if ( isPlay() ) {
      $log.debug('STATE: play ->');

      service.setTitle( service.PLAY_TITLE );
    } else {
      $log.debug('STATE: another state ->');
    }
  }


  function _getPrevious() {
    return service.state.previous || null;
  }


  return service;
}
