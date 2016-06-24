angular
	.module('Mobidul')
	.factory('MobidulService', MobidulService);


MobidulService.$inject = [
	'$log', '$rootScope', '$http'
];


function MobidulService (
	$log, $rootScope, $http
)
{
	var service =
	{
		// constants
		ALL_STATIONS 	: 0,
		NEW_STATION 	: 1,
		MOBIDUL_OPTIONS : 2,

		NEW_MOBIDUL_TITLE : 'Neues Mobidul',

		// services
		menuReady : menuReady,
		getConfig : getConfig,

		// app config
		Config :
		{
			// TODO - these belong into a core ConfigService
			isMenuEnabled     : true,
		    isHomeViewEnabled : true,

			// NOTE - these are directly tied to a Mobidul
		    isGoToHomeEnabled  : true,
		    isGoToAboutEnabled : true
		},

		// mobidul config
		Mobidul : {}
	};


	/// services

	function menuReady ()
	{
		// $log.debug('menuReady in MobidulService');

		$rootScope.$emit('Menu::ready');
	}


	function getConfig (mobidulCode)
	{
		// $log.debug('getConfig in MobidulService');
		// $log.debug(mobidulCode);

		return $http
				.get( mobidulCode + '/getConfig' )
				.success(function (response, status, headers, config)
				{
					$log.debug('Loaded Config for "' + mobidulCode + '" :');
					$log.debug(response);

					if ( response )
						service.Mobidul = response;

					return response;
				})
				.error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
	}


	return service;
}
