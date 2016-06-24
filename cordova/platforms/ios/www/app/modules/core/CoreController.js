angular
	.module('Mobilot')
	.controller('CoreController', CoreController);


CoreController.$inject = [
	'$log', '$scope', '$rootScope'
];

function CoreController (
	$log, $scope, $rootScope
)
{
	var core = this;

	// constants
	core._showAppLoader = true;


	// vars
	core.config = {
		background : '#3797c4',
		foreground : '#fff'
	};

	core.auth = {
		ariaLabel : 'Login'
	};

	core.showAppLoader = core._showAppLoader;


	// functions
	core.showAppLoader = showAppLoader;
	core.hideAppLoader = hideAppLoader;


	// construct

	_init();


	/// private functions

	function _init ()
	{
		// $log.debug('CoreController init');

		_initDefaultValues();

		_listenToAppLoaderEvents();
	}


	function _initDefaultValues ()
	{
		core.showAppLoader = true;
	}


	function _listenToAppLoaderEvents ()
	{
		var toggleAppLoaderListener =
			$rootScope.$on('rootScope:toggleAppLoader', function (event, data)
			{
				$log.debug('Listened to "rootScope:toggleAppLoader"');

				var action = data.action ? data.action : null;

				if ( action )
					if ( action === 'show' )
						core.showAppLoader();
					else // if ( action === 'hide' ) // hide
						core.hideAppLoader();
			});

		$scope.$on('$destroy', toggleAppLoaderListener);
	}


	/// public functions

	function showAppLoader ()
	{
		// core.showAppLoader = core._showAppLoader;
		core.showAppLoader = true;
	}


	function hideAppLoader ()
	{
		// core.showAppLoader = ! core._showAppLoader;
		core.showAppLoader = false;
	}

	/// events
	// ...
}
