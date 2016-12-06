angular
  .module('Mobidul')
  .controller('ListStationsController', ListStationsController);

ListStationsController.$inject = [
  '$log', '$scope', '$rootScope', '$translate',
  '$state', '$stateParams', 'StateManager',
  'ListService', 'MobidulService', 'FontService',
  'UserService', 'HeaderService', 'RallyService'
];

function ListStationsController (
  $log, $scope, $rootScope, $translate,
  $state, $stateParams, StateManager,
  ListService, MobidulService, FontService,
  UserService, HeaderService, RallyService
) {
  /// ListStationsController
  var list = this;

  /// constants
  // ...

  /// vars
  list.isCordovaIos   = isCordova && isIos;

  list.stations       = [];
  list.loading        = 'block';
  list.searchQuery    = '';
  list.canEditStation = false;
  list.myFont         = '';
  list.dragControlListenersStation = {
    orderChanged: function(event) {
      list.moveStation(event.dest.index);
    },
    containerPositioning: 'relative',
    containment: '#sortableContainerStations',
  };



  /// functions
  list.switchContent  = switchContent;
  list.editStation    = editStation;
  list.moveStation    = moveStation;

  /// construct

  _init();


  /// private functions

  function _init ()
  {
    // $log.debug('ListStationsController init');

    HeaderService.refresh();


    _initDefaultValues();

    _getStations();

    _listenToConfig();
    _listenToSessionUpdate();
  }


  function _initDefaultValues () {
    _refreshStationActions();
  }


  function _refreshStationActions ()
  {
    UserService.getEditStationPermit()
    .then(function (permit) {
      list.canEditStation = permit;
    });
  }


  function _getStations ()
  {
    var currentStateParams = StateManager.state.params;

    ListService.getStations(
      currentStateParams.mobidulCode,
      currentStateParams.category
    )
    .then(function (response) {
      //console.info('ListStationsController - _getStations');
      //console.log(response);

      var hasPermission = response.hasPermission;
      var stations = response.stations;

      if (hasPermission) {
        MobidulService.getMobidulMode(currentStateParams.mobidulCode)
        .then(function (mode) {
          if (
            mode == MobidulService.MOBIDUL_MODE_RALLY &&
            currentStateParams.category !== ListService.ALL_STATIONS
          ) {
            RallyService.filterStations(stations)
            .then(function (stations) {
              list.stations = stations;
            });
          }
          else {
            list.stations = stations;
          }
        })
        .then(function () {
          list.loading = 'none';
          ListService.hideAppLoader();
        });
      }
      else {
        list.stations = [];
        list.loading  = 'none';
        ListService.hideAppLoader();
        // TODO: check if the above lines are necessary

        $state.go('mobidul.map', {
          mobidulCode : currentStateParams.mobidulCode
        });
      }
    });

    // $log.debug('getStationsResponse : ');
    // $log.debug(list.params);
    // $log.debug(currentStateParams);
    // $log.debug(getStationsResponse);
  }


  function _listenToConfig ()
  {
    var setConfigListener =
      $rootScope.$on('rootScope:setConfig', function (event, config) {
        // $log.debug('Listened to "rootScope:setConfig" in ListStationsController');
        // $log.debug(config);

        list.myFont = FontService.getFontClass( MobidulService.Mobidul.font );
      });

    $scope.$on('$destroy', setConfigListener);
  }


  function _listenToSessionUpdate ()
  {
    var sessionUpdatedListener =
      $rootScope.$on('UserService::sessionUpdated', function (event, data) {
        _init();
      });

    $scope.$on('$destroy', sessionUpdatedListener);
  }


  /// public functions

  function switchContent (mobidulCode, stationCode)
  {
    // $log.debug("switching content to " + mobidulCode + " " + stationCode);

    $state.go('mobidul.station', { stationCode : stationCode });
  }


  function editStation (stationCode)
  {
    // $log.debug('go to edit station');
    // $log.debug(stationCode);
    // $log.debug($stateParams);

    var currentStateParams = StateManager.state.params;

    var stateParams = {
      from        : 'mobidul.list',
      category    : currentStateParams.category,
      mobidulCode : currentStateParams.mobidulCode,
      stationCode : stationCode
    };

    $state.go('mobidul.station.edit.basis', stateParams);
  }


  function moveStation (index)
  {
    //list.stations.splice(index, 1);
    console.debug("Station New Index: ", index);

    angular.forEach(list.stations, function (station, i) {
      station.order = i;
    });

    ListService.saveOrder(StateManager.state.params.mobidulCode, list.stations);
  }


  /// events
  // ...

}
