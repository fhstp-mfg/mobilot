angular
	.module('Creator')
	.controller('PlayController', PlayController);

PlayController.$inject = [
	'$log', '$rootScope', '$scope',
	'$state', '$stateParams', 'StateManager',
	'$mdDialog',
	'PlayService'
];

function PlayController (
	$log, $rootScope, $scope,
	$state, $stateParams, StateManager,
	$mdDialog,
	PlayService
)
{
	var play = this;

	/// constrants
	// ...

	/// vars
	play.code;

	/// functions
	play.join = join;


	/// construct

	_init();


	/// private functions

	function _init ()
	{
		$log.debug('init PlayController');

		_initDefaultValues();
	}

	function _initDefaultValues ()
	{
		play.code = '';
	}


	/// public functions

	function join ()
	{
		PlayService
			.play( play.code )
			.success(function (response)
			{
				// console.warn('join mobidul play callback : ');
				// console.info(response);

				if ( response )
				{
					if ( response.success )
						$state.go('mobidul.map', { mobidulCode : response.code });
					else
					{
						var msg = 'Dieser Mitmach-Code ist ungültig. Bitte versuche es nochmal oder kontaktiere den Ersteller des Mobiduls.';

						var invalidPlayDialog =
							$mdDialog
								.alert()
								.parent( angular.element(document.body) )
								.title('Mitmachen nicht möglich')
								.textContent( msg )
								.ariaLabel('Anmeldung Fehler')
								.ok('Daten überarbeiten');

						$mdDialog.show( invalidPlayDialog );
					}
				}
			});
	}

}
