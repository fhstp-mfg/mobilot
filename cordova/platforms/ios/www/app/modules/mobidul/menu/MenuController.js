angular
	.module('Mobilot')
	.controller('MenuController', MenuController);


MenuController.$inject = [
	'$log', '$scope', '$rootScope',
	'$state', '$stateParams',
	'$mdSidenav',
	'MobidulService', 'UserService'
];


function MenuController (
	$log, $scope, $rootScope,
	$state, $stateParams,
	$mdSidenav,
	MobidulService, UserService
)
{
	var menu = this;

	/// constants
	menu._loginAccountText  = 'Anmelden';
	menu._logoutAccountText = 'Abmelden';

	menu._profileFlexThird  = '60';
	menu._profileFlexFull   = '';


	/// vars
	menu.profile = {};

	menu.isGoToHomeEnabled    = MobidulService.Config.isGoToHomeEnabled;
    menu.isGoToAboutEnabled   = MobidulService.Config.isGoToAboutEnabled;
    menu.isLastDividerEnabled = true;

	menu.isLoggedIn      = false;
	menu.accountItemText = menu._loginAccountText;


	/// functions
	menu.init = init;

	/// events
	menu.goToProfile      	    = goToProfile;
	menu.loginLogoutButtonClick = loginLogoutButtonClick;


	/// construct

	// init();


	function init ()
	{
		$log.debug('MenuController init');
		// $log.debug(MobidulService.Config);
		// $log.debug(MobidulService.Mobidul);

		_initDefaultValues();

		_listenToConfig();

		MobidulService.menuReady();
	}


	/// private functions

	function _initDefaultValues ()
	{
		menu.config = MobidulService.Mobidul;


		if ( ! menu.isGoToHomeEnabled &&
			 ! menu.isGoToAboutEnabled )

	        menu.isLastDividerEnabled = false;


		var  currentUser = UserService.Session;
		menu.currentUser = currentUser;

		var isLoggedIn   = currentUser.isLoggedIn;


		if ( isLoggedIn )
		{
			menu.isLoggedIn   	 = isLoggedIn;
			menu.accountItemText = menu._logoutAccountText;

			menu.profile.flex    = menu._profileFlexThird;
		}
		else
			menu.profile.flex    = menu._profileFlexFull;
	}


	function _listenToConfig ()
	{
		var configListener =
			$rootScope.$on('rootScope:setConfig', function (event, config)
			{
				$log.debug('Heard "rootScope:setConfig" in MenuController');
				$log.debug(config);

				menu.config.background = MobidulService.Mobidul.background + ' !important';
				menu.config.foreground = MobidulService.Mobidul.foreground + ' !important';
			});

		$scope.$on('$destroy', configListener);
	}


	/// public functions

	/**
	 * Performs login / logout action
	 */
	function loginLogoutButtonClick ()
	{
		if ( menu.accountItemText == menu._loginAccountText )

			$state.go('login');

		else
			UserService
				.logout()
				.then(function (response)
				{
					$log.debug('menu logout callback');
					$log.debug(response);

					var closeSidenavOnLogout = true;


					if ( response.data &&
						 response.data === 'success' &&
						 closeSidenavOnLogout )
					{
						$mdSidenav('menu')
							.close()
							.then(function ()
							{
								menu.isLoggedIn  	 	  = false;
								menu.profile.flex    	  = menu._profileFlexFull;
								menu.accountItemText 	  = menu._loginAccountText;
								menu.currentUser.username = UserService._guestName;
							});
					}
					else
					{
						menu.isLoggedIn  	      = false;
						menu.profile.flex    	  = menu._profileFlexThird;
						menu.accountItemText      = menu._loginAccountText;
						menu.currentUser.username = UserService._guestName;
					}
				});
	}


	/// events

	function goToProfile ()
	{
		$state.go('profile');
	}

}
