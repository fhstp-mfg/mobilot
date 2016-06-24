angular
	.module('Login')
	.factory('UserService', UserService);


UserService.$inject = [
	'$log', '$rootScope', '$http',
	'HeaderService'
];


function UserService (
	$log, $rootScope, $http,
	HeaderService
)
{
	/// constants
	var _Roles =
	{
		_isGuest  : 0,
		_isPlayer : 2,
		_isAdmin  : 1
	};

	// NOTE - these are permissions for Guest users
	var _Permits =
	{
		RequestAllStations 		: false,
		RequestCategoryStations : false,
		EditStation 			: false
	};


	var service =
	{
		// _guestName 		: 'Gast',
		_guestName 		: 'Anmelden',

		login  		    : login,
		logout          : logout,
		isLoggedIn      : isLoggedIn,
		register        : register,
		restoreUser     : restoreUser,
		restoreUserRole : restoreUserRole,
		changePassword  : changePassword,
		requestRestore  : requestRestore,

		getEditStationPermit 			 : getEditStationPermit,
		getRequestAllStationsPermit 	 : getRequestAllStationsPermit,
		getRequestCategoryStationsPermit : getRequestCategoryStationsPermit,


		Role   : _Roles,
		Permit : _Permits,

		Session :
		{
			isLoggedIn     : false,
			id 			   : null,
			username       : null,
			email          : null,
			created_at     : null,
			remember_token : null,

			role 		   : _Roles._isGuest
		}
	};


	/// construct
	// ...


	/// private functions
	// ...


	/// services

	function login (credentials)
	{
		var postData = {
			user     : credentials.username,
			password : credentials.password
		};


		return $http
				.post('login', postData)
				.success(function (response, status, headers, config)
				{
					// $log.debug(response);

					if ( response === 'success' )
					{
						service.Session.isLoggedIn = true;
						service.Session.username   = credentials.username;
					}
				})
				.error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
	}


	function logout ()
	{
		return $http
				.get('logout')
				.success(function (response, status, headers, config)
				{
					if ( response === 'success' )
					{
						var guestName = service._guestName;
						var isGuest   = _Roles._isGuest;

						service.Session.isLoggedIn = false;
						service.Session.username   = guestName;
						service.Session.role 	   = isGuest;

						service.Permit = angular.copy( _Permits );
					}
				})
				.error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				})
				.then(function (response)
				{
					// $rootScope.$emit('Header::refresh');
					HeaderService.refresh();

					$rootScope.$emit('UserService::sessionUpdated');


					return response;
				});
	}


	function isLoggedIn ()
	{
		return $http
				.get('IsLoggedIn')
				.success(function (data, status, headers, config)
				{
					if ( data === 'true' )
						service.Session.isLoggedIn = true;
				})
				.error(function (data, status, headers, config)
				{
					$log.error(data);
					$log.error(status);
				});
	}


	function register (credentials)
	{
		var postData = {
			user     : credentials.username,
			email    : credentials.email,
			password : credentials.password
		};


		return $http
				.post('register', postData)
				.success(function (response, status, headers, config)
				{
					// $log.debug(response);

					service.Session.username = credentials.username;
				})
				.error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
	}


	function restoreUser ()
	{
		return $http
				.get( cordovaUrl + '/currentUser' )
				.success(function (response, status, headers, config)
				{
					// $log.debug('> restored current user successfully');
					// $log.debug(response);
					// $log.debug(response.guest);

					var isGuest    = response.guest === true ||
									 response.guest == 1;
					var isGuestNot = ! isGuest;
					// $log.debug('isGuestNot : ' + isGuestNot);

					var email      = isGuestNot ? response.email    : null;
					var guestId    = isGuest    ? response.username : null;
					var username   = isGuestNot ? response.username : service._guestName;

					var userData   =
					{
						isLoggedIn     : isGuestNot,

						id 			   : response.id,
						username       : username,
						email          : email,
						created_at     : response.created_at,
						remember_token : response.remember_token,
					};


					if ( isGuest )
						userData.guestId = response.usernam;


					service.Session = userData;
				})
				.error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
	}


	function restoreUserRole (mobidulCode)
	{
		var url = 'RoleForMobidul/' + mobidulCode;


		return $http
				.get( url )
				.success(function (response, status, headers, config)
				{
					// $log.debug('> Restore user role :');
					// $log.debug(response);

					var role = angular.isDefined( response.role ) ? response.role : null;

					if ( role !== null )
					{
						// $log.debug('> Setting Session role');
						// $log.debug(role);

						service.Session.role = role;


						var permittedActions =
						{
							// @description - TODO
							RequestAllStations : role == _Roles._isAdmin ||
												 true /* editMode permits */ // TODO - see previous (inline-block) comment
							,
							// @description - TODO
							RequestCategoryStations : role == _Roles._isAdmin ||
													  true /* editMode permits */ // TODO - see previous (inline-block) comment
							,
							// @description - TODO
							EditStation : role == _Roles._isAdmin ||
										  ( role == _Roles._isPlayer &&
										  	true /* editMode permits */ ) // TODO - see previous (inline-block) comment
						};

						service.Permit = permittedActions;
					}
				})
				.error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				})
				.then(function ()
				{
					// $log.debug('UserService restoreUserRole data :');
					// $log.debug(data);

					// $rootScope.$emit('UserService::sessionUpdated');
					// $rootScope.$emit('Header::refresh');

					HeaderService.refresh();
				});
	}


	function changePassword (data)
	{
		var postData;


		if ( data.resetToken )
			postData =
			{
				route 		    : 'changePasswordNoAuth',
				resetToken      : data.resetToken,
				newPassword     : data.newPassword,
				confirmPassword : data.confirmPassword
			};
		else
			postData =
			{
				route 		: 'changePassword',
				oldPassword : data.oldPassword,
				newPassword : data.newPassword
			};


		return $http
				.post( postData.route, postData )
				.success(function (response, status, headers, config)
				{
					// $log.debug(response);
				})
				.error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
	}


	function requestRestore (userEmail)
	{
		// $log.debug('request restore');

		var postData = {
			email : userEmail
		};

		return $http
				.post('requestRestore', postData)
				.success(function (response, status, headers, config)
				{
					// $log.debug(response);
				})
				.error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
	}


	/// Permits

	function getEditStationPermit ()
	{
		return service.Permit.EditStation;
	}

	function getRequestAllStationsPermit ()
	{
		return service.Permit.RequestAllStations;
	}

	function getRequestCategoryStationsPermit ()
	{
		return service.Permit.RequestCategoryStations;
	}


	return service;
}
