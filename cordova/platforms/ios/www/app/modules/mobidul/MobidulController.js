angular
	.module('Mobidul')
	.controller('MobidulController', MobidulController);


MobidulController.$inject = [
	'$log', '$scope', '$rootScope',
	'$state', '$stateParams', 'StateManager',
	'$geolocation', '$mdSidenav', '$mdComponentRegistry', '$mdDialog',
	'MobidulService', 'HeaderService', 'MapService',
  'LocalStorageService', 'FontService'
];


function MobidulController (
	$log, $scope, $rootScope,
	$state, $stateParams, StateManager,
	$geolocation, $mdSidenav, $mdComponentRegistry, $mdDialog,
	MobidulService, HeaderService, MapService,
  LocalStorageService, FontService
)
{
	var mobidul = this;

	// vars
	mobidul.menu 	= [];


	// functions
	mobidul.switchContent      = switchContent;
	mobidul.switchState        = switchState;
	mobidul.switchAdminContent = switchAdminContent;


	/// construct

	_init();


	/// private functions

	function _init ()
	{
		$log.debug('init MobidulController');
		// $log.debug(StateManager.state);
    LocalStorageService.explainGenericGeoPermit(true);


		_initDefaultValues();

		if ( ! mobidul.isNewMobidul )
			_listenToMenuReady();
	}


	function _initDefaultValues ()
	{
		mobidul.isNewMobidul =
			StateManager.state.params.mobidulCode === StateManager.NEW_MOBIDUL_CODE;

		if(!mobidul.isNewMobidul){
			MobidulService.initProgress();
		}
	}


	function _listenToMenuReady ()
	{
		// $log.debug('Listening to "Menu::ready"');

		var menuReadyListener =
			$rootScope.$on('Menu::ready', function (event)
			{
				// $log.debug('Heard "Menu::ready" in MobidulController');
				// $log.debug(data);

				_requestConfig();
			});

		$scope.$on('$destroy', menuReadyListener);
	}


	function _requestConfig ()
	{
		$log.debug('requestConfig in MobidulController');

		var mobidulCode = StateManager.state.params.mobidulCode;
		$log.debug(mobidulCode);

		MobidulService
			.getConfig( mobidulCode )
			.then(function (response, status, headers, config, statusText)
			{
				$log.debug('MobidulService getConfig callback : ');
				$log.debug(response);

				// TODO - check case where response.data is not defined
				var mobidulConfig = response.data;

				// TODO - save the whole configuration without overriding
				// MobidulService.Config.title = config.mobidulName;
				// HeaderService.title = config.mobidulName;
				HeaderService.title = mobidulConfig.mobidulName;


				// TODO - recheck the $emit event and other solutions
				$rootScope.$emit('rootScope:setConfig', mobidulConfig);


				// TODO - adapt services to return necessary data
				var menuData = mobidulConfig.customNav.navigation;

        // RESET menu before getting it
        mobidul.menu = [];

				angular.forEach( menuData, function (item, key)
				{
					var menuItem = {};
						menuItem.code = item.id;
            menuItem.func = item.func;
						menuItem.href = '';
						menuItem.text = item.text;
						menuItem.isDivider = item.isDivider;


					if ( item.href )
						menuItem.href = ( item.href != 'map.html')
											? item.href : 'map';


					mobidul.menu.push(menuItem);
				});


        // TODO: get Starting page from config
        //
        // "startAbility" : "", "switchContent" || "getForCategory"
        // "startItemId"  : "",  id || map.html


				if ( StateManager.isMobidul() )
                {
										//save all stations in Service for rally
										MobidulService.fetchStations(StateManager.getParams().mobidulCode);

                    var switchContentParams = {};


                    if ( mobidulConfig.startAbility === '' )
                    {
                        switchContentParams.href = 'map';
                    }
                    else if ( mobidulConfig.startAbility === 'getForCategory' )
                    {
                        switchContentParams.func = 'getForCategory';
                        switchContentParams.href = mobidulConfig.startItemId;
                    }
                    else if ( mobidulConfig.startAbility === 'switchcontent' )
                    {
                        if ( mobidulConfig.startItemId === 'map.html' )
						{
                            switchContentParams.href = 'map';
						}
                        else
                        {
                            switchContentParams.func = 'switchcontent';
                            switchContentParams.href = mobidulConfig.startItemId;
                        }
                    }


					// NOTE - in some cases the menu isn't ready yet,
					//			therefore we first have to wait for the menu to be ready,
					//			and only switch content afterwards



					// NOTE - this is only for development !
					// TODO - implement system to check if is developer version

					var is_developer_mode = true;

					// if ( is_developer_mode )
					// {
					// 	var confirmDeleteStationDialog =
					// 		$mdDialog
					// 			.confirm()
					// 			.parent( angular.element(document.body) )
					// 			.title('Developer mode')
					// 			.textContent('Redirect to start page ?')
					// 			.ariaLabel('Developer mode')
					// 			.ok('Redirect')
					// 			.cancel('Stay');
					//
					// 	$mdDialog
					// 		.show( confirmDeleteStationDialog )
					// 		.then(function ()
					// 		{
					// 			mobidul.switchContent( switchContentParams );
					// 		});
					// }
					// else
					// 	mobidul.switchContent( switchContentParams );


					// NOTE - simply don't redirect when is developer mode
					if ( ! is_developer_mode )
						mobidul.switchContent( switchContentParams );
                }
			})
			.then(function ()
			{
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
		// 	.when('menu')
		// 	.then(function (menu)
		// 	{
		// 		menu.close();
		//
		// 		defer.resolve();
		// 	});
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

        if ( ! item.isDivider )
        {
            _closeMenu()
				.then(function ()
				{
					var mobidulCode = StateManager.state.params.mobidulCode;


					if ( item.href == 'map' )
					{
		                $state.go('mobidul.map');
					}
		            else if ( item.func == 'getForCategory' )
					{
		                MobidulService.Mobidul.categoryName = item.text;

						var stateParams = {
							mobidulCode : mobidulCode,
			                category    : item.href
						};

						$state.go('mobidul.list', stateParams);
					}
		            else
					{
		                $state.go('mobidul.station',
						{
		                    mobidulCode : mobidulCode,
		                    stationCode : item.href
		                });
					}
				});
        }
	}


	function switchState (state)
	{
		_closeMenu().then(function ()
		{
			if ( state === StateManager.HOME )
				MapService.reset();

			$state.go(state);
		});
	}


	function switchAdminContent (adminContentId)
	{
		_closeMenu()
			.then(function ()
			{
				// $log.debug('closeMenu callback in MobidulController')

				var mobidulCode = StateManager.state.params.mobidulCode;

				switch ( adminContentId )
				{
					case MobidulService.ALL_STATIONS :

						$state.go('mobidul.list', { category : 'all' });

						break;

					case MobidulService.NEW_STATION :

						var stateParams = {
							mobidulCode : mobidulCode,
							stationCode : StateManager.NEW_STATION_CODE
						};

						// $log.debug('switchAdminContent params:');
						// $log.debug(stateParams);

						$state.go('mobidul.station.edit.basis', stateParams);

						break;

					case MobidulService.MOBIDUL_OPTIONS :
                        var stateParams = {
							mobidulCode : mobidulCode
						};
                        $state.go('mobidul.creator.basis', stateParams);

						break;

					default : break;
				}
			});
	}
}
