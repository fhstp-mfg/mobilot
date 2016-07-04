angular
	.module('Mobidul')
	.controller('InfoWindowController', InfoWindowController);

InfoWindowController.$inject = [
	'$log', '$state', 'StateManager'
];


function InfoWindowController (
	$log, $state, StateManager
)
{
	var info = this;

	// vars
	// ...

	// functions
	info.goToStation = goToStation;


	/// private functions

	//...
	

	/// public functions

	function goToStation (stationCode)
	{
		// $log.debug('go to station');
		// $log.debug(info.mobidul.code);
		// $log.debug(stationCode);

		var mobidulCode = StateManager.state.params.mobidulCode;

		var routeParams =
		{
			mobidulCode : mobidulCode,
			stationCode : stationCode
		};

		$state.go('mobidul.station', routeParams);
	}
}
