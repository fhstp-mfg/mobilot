angular
  .module('Mobidul')
  .controller('ListStationsController', ListStationsController);


ListStationsController.$inject = [
  '$log', '$scope', '$rootScope',
  '$state', '$stateParams', 'StateManager',
  'ListService', 'MobidulService', 'FontService',
  'UserService', 'HeaderService', 'RallyService'
];


function ListStationsController (
  $log, $scope, $rootScope,
  $state, $stateParams, StateManager,
  ListService, MobidulService, FontService,
  UserService, HeaderService, RallyService
) {
  var list = this;

  /// constants
  // ...

  /// vars
  list.stations       = [];
  list.loading        = 'block';
  list.searchQuery    = '';
  list.showEditButton = false;
  list.myFont         = '';

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
    var userRole = UserService.Session.role;

    list.showEditButton = userRole == UserService.Role._isAdmin ||
                          userRole == UserService.Role._isPlayer;
  }


  function _getStations ()
  {
    var currentStateParams = StateManager.state.params;

    var getStationsResponse =
      ListService
        .getStations(
          currentStateParams.mobidulCode,
          currentStateParams.category
        );


    $log.debug('getStationsResponse : ');
    // $log.debug(list.params);
    $log.debug(currentStateParams);
    $log.debug(getStationsResponse);


    //TODO: if all stations get called first the user doesn't have permission and gets redirected (probably because userservice doesn't know roles yet)
    if ( getStationsResponse !== 'no-permission' )
    {
      getStationsResponse
        .success(function (stations, status, headers, config)
        {
          $log.debug('_getStations:');
          $log.debug(stations);

          MobidulService.getMobidulMode(currentStateParams.mobidulCode)
            .then(function(mode)
            {
              if(mode == MobidulService.MOBIDUL_MODE_RALLY)
              {
                //TODO: is this still necessary?
                //RallyService.refresh();

                if ( currentStateParams.category !== ListService.ALL_STATIONS )
                  RallyService.filterStations(stations)
                    .then(function(stations){
                      list.stations = stations;
                    });
                else
                  list.stations = stations;
              }
              else
                list.stations = stations;
            });

        })
        .error(function (response, status, headers, config)
        {
          $log.error(response);
          $log.error(status);
        })
        .then(function ()
        {
          list.loading = 'none';

          // $rootScope.$emit('rootScope:toggleAppLoader', { action : 'hide' });
          ListService.hideAppLoader();
        });
    }
    else
    {
      list.stations = [];

      list.loading  = 'none';

      ListService.hideAppLoader();

      // TODO - check if the above lines are necessary


      $state.go('mobidul.map',
      {
        mobidulCode : currentStateParams.mobidulCode
      });
    }
  }


  function _listenToConfig ()
  {
    var setConfigListener =
      $rootScope.$on('rootScope:setConfig', function (event, config)
      {
        // $log.debug('Listened to "rootScope:setConfig" in ListStationsController');
        // $log.debug(config);

        list.myFont = FontService.getFontClass( MobidulService.Mobidul.font );
      });

    $scope.$on('$destroy', setConfigListener);
  }


  function _listenToSessionUpdate ()
  {
    var sessionUpdatedListener =
      $rootScope.$on('UserService::sessionUpdated', function (event, data)
      {
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

    var stateParams =
    {
      from        : 'mobidul.list',
      category    : currentStateParams.category,
      mobidulCode : currentStateParams.mobidulCode,
      stationCode : stationCode
    };

    $state.go('mobidul.station.edit.basis', stateParams);
  }


	function moveStation (station, dir)
	{

		if(!((dir == 'up' && station.order == 0) || (dir == 'down' && station.order == (list.stations.length-1)))){
			var tempOrder = station.order;
			station.order += (dir == 'up') ? -1 : 1;

			var neighbour = list.stations.filter(function(s){
				var order = (dir == 'up') ? tempOrder-1 : tempOrder+1;
				return parseInt(s.order) == order;
			})[0];

			neighbour.order = tempOrder;

			var currentStateParams = StateManager.state.params;

			var response = ListService.saveOrder(currentStateParams.mobidulCode, list.stations);

			response
				.success(function (data, status, headers, config)
					{
						if(data == "success"){
              //Todo: refresh list
						}else{
							$log.error(data)
						}
					})
				.error(function (data, status, headers, config)
					{
						$log.error(data);
						$log.error(status);
					})
				.then(function (response)
					{

					});

		}

	}


	/// events
	// ...

}
