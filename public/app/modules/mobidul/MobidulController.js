angular
  .module('Mobidul')
  .controller('MobidulController', MobidulController);


MobidulController.$inject = [
  '$log', '$scope', '$rootScope', '$translate',
  '$state', '$stateParams', 'StateManager',
  '$geolocation', '$mdSidenav', '$mdComponentRegistry', '$mdDialog',
  'MobidulService', 'HeaderService', 'MapService', 'PlayService',
  'LocalStorageService', 'FontService'
];


function MobidulController (
  $log, $scope, $rootScope, $translate,
  $state, $stateParams, StateManager,
  $geolocation, $mdSidenav, $mdComponentRegistry, $mdDialog,
  MobidulService, HeaderService, MapService, PlayService,
  LocalStorageService, FontService
) {
  /// MobidulController
  var mobidul = this;

  /// vars
  mobidul.menu = [];

  // functions
  mobidul.switchContent      = switchContent;
  mobidul.switchState        = switchState;
  mobidul.switchAdminContent = switchAdminContent;
  // mobidul.cloneMyMobidul     = cloneMyMobidul;
  mobidul.scanJoinCode       = scanJoinCode;


  /// construct

  _init();


  /// private functions

  function _init ()
  {
    $log.debug('init MobidulController');
    // $log.debug(StateManager.state);
    // LocalStorageService.explainGenericGeoPermit(true);

    _initDefaultValues();

    if ( ! mobidul.isNewMobidul ) {
      _listenToMenuReady();
    }
  }


  function _initDefaultValues ()
  {
    mobidul.isNewMobidul =
      StateManager.state.params.mobidulCode === StateManager.NEW_MOBIDUL_CODE;

    if ( ! mobidul.isNewMobidul ) {
      MobidulService.initProgress();
    }
  }


  function _listenToMenuReady ()
  {
    // $log.debug('Listening to "Menu::ready"');

    var menuReadyListener =
      $rootScope.$on('Menu::ready', function (event) {
        // $log.debug('Heard "Menu::ready" in MobidulController');
        // $log.debug(data);

        _requestConfig();
      });

    $scope.$on('$destroy', menuReadyListener);
  }


  function _requestConfig ()
  {
    $log.debug('requestConfig in MobidulController');

    var mobidulCode = StateManager.getParams().mobidulCode;
    $log.debug(mobidulCode);

    MobidulService.getConfig(mobidulCode)
    .then(function (mobidulConfig) {

      // TODO: save the whole configuration without overriding
      // MobidulService.Config.title = config.mobidulName;
      // HeaderService.title = config.mobidulName;
      HeaderService.title = mobidulConfig.mobidulName;

      // TODO: recheck the $emit event and other solutions
      $rootScope.$emit('rootScope:setConfig', mobidulConfig);


      // TODO: adapt services to return necessary data
      var menuData = mobidulConfig.customNav.navigation;

      var menuItems = [];

      angular.forEach( menuData, function (item) {
        var menuItem = {};
        menuItem.code = item.id;
        menuItem.func = item.func;
        menuItem.href = '';
        menuItem.text = item.text;
        menuItem.isDivider = item.isDivider;

        if (item.href) {
          menuItem.href = ( item.href != 'map.html' ) ? item.href : 'map';
        }

        menuItems.push(menuItem)
      });


      // NOTE: Divide all menuItems into dividerBlocks
      // Reset menu before receiving it
      mobidul.menu = [];
      var currentBlock = [];

      angular.forEach(menuItems, function (item, key) {
        currentBlock.push(item);

        var nextItem = menuItems[key+1];
        if (
          typeof nextItem === 'undefined' ||
          nextItem.isDivider !== item.isDivider
        ) {
          mobidul.menu.push(currentBlock);
          currentBlock = [];
        }
      });


      if ( StateManager.isMobidul() )
      {
        // save all stations in Service for rally
        MobidulService.fetchStations( StateManager.getParams().mobidulCode );

        var switchContentParams = {};

        if ( mobidulConfig.startAbility === '' ) {
          switchContentParams.href = 'map';
        }
        else if ( mobidulConfig.startAbility === 'getForCategory' ) {
          switchContentParams.func = 'getForCategory';
          switchContentParams.href = mobidulConfig.startItemId;
        }
        else if ( mobidulConfig.startAbility === 'switchcontent' ) {
          if ( mobidulConfig.startItemId === 'map.html' ) {
            switchContentParams.href = 'map';
          }
          else {
            switchContentParams.func = 'switchcontent';
            switchContentParams.href = mobidulConfig.startItemId;
          }
        }

        // NOTE: in some cases the menu isn't ready yet,
        // therefore we first have to wait for the menu to be ready,
        // and only switch content afterwards


        // NOTE: this is only for development !
        // TODO: implement system to check if is developer version

        var is_developer_mode = true;



        // NOTE: simply don't redirect when is developer mode
        if ( ! is_developer_mode ) {
          mobidul.switchContent(switchContentParams);
        }
      }
    })
    .then(function () {
      $rootScope.$emit('rootScope:toggleAppLoader', { action : 'hide' });
    });
  }


  function _closeMenu ()
  {
    // $log.debug('close menu in MobidulController');

    // TODO - review and implement as needed
    // var defer = $q.defer();
    //
    // $mdComponentRegistry
    //   .when('menu')
    //   .then(function (menu)
    //   {
    //     menu.close();
    //
    //     defer.resolve();
    //   });
    //
    // return defer.promise;

    return $mdSidenav('menu').close();
  }


  /// public functions

  // ...


  /// events

  function switchContent (item)
  {
    $log.debug('switchContent in MobidulController : ');
    $log.debug(item);

    if ( ! item.isDivider ) {
      _closeMenu()
      .then(function () {
        var mobidulCode = StateManager.state.params.mobidulCode;

        if ( item.href == 'map' ) {
          $state.go('mobidul.map');
        }
        else if ( item.func == 'getForCategory' ) {
          MobidulService.Mobidul.categoryName = item.text;

          var stateParams = {
            mobidulCode : mobidulCode,
            category    : item.href
          };

          $state.go('mobidul.list', stateParams);
        }
        else {
          $state.go('mobidul.station', {
            mobidulCode : mobidulCode,
            stationCode : item.href
          });
        }
      });
    }
  }


  function switchState (state)
  {
    _closeMenu()
    .then(function () {
      if ( state === StateManager.HOME ) {
        MapService.reset();
      }
      $state.go(state);
    });
  }


  function switchAdminContent (adminContentId)
  {
    _closeMenu()
    .then(function () {
      // $log.debug('closeMenu callback in MobidulController')

      var mobidulCode = StateManager.state.params.mobidulCode;

      switch (adminContentId) {
        case MobidulService.ALL_STATIONS:
          $state.go('mobidul.list', { category : 'all' });
          break;

        case MobidulService.NEW_STATION:
          var stateParams = {
            mobidulCode : mobidulCode,
            stationCode : StateManager.NEW_STATION_CODE
          };
          // $log.debug('switchAdminContent params:');
          // $log.debug(stateParams);
          $state.go('mobidul.station.edit.basis', stateParams);
          break;

        case MobidulService.MOBIDUL_OPTIONS:
          var stateParams = {
            mobidulCode : mobidulCode
          };
          $state.go('mobidul.creator.basis', stateParams);
          break;

        default : break;
      }
    });
  }


  /**
   * Opens a dialog and initializes the Mobidul cloning process.
   */
  // function cloneMyMobidul () {
  //   var mobidulName = StateManager.getTitle();
  //   var mobidulCode = StateManager.state.params.mobidulCode;
  //
  //   var cloneDialogOptions = {
  //     parent       : angular.element(document.body),
  //     title        : $translate.instant('CLONE_MOBIDUL'),
  //     templateUrl  : 'app/modules/mobidul/menu/dialog/CloneMobidulDialog.html',
  //     controller   : CloneMobidulDialogController,
  //     controllerAs : 'cloneMobidulDialog',
  //
  //     clickOutsideToClose: true
  //   };
  //
  //   $mdDialog.show(cloneDialogOptions);
  //   // .then(function () {
  //   //   $log.debug('opened dialog');
  //   // });
  // }


  function scanJoinCode () {
    $state.go('play', { triggerScan: true });
  }

  // ...
}
