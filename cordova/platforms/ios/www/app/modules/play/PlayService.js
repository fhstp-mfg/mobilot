angular
	.module('Play')
	.factory('PlayService', PlayService);


PlayService.$inject = [
	'$log', '$http'
];


function PlayService (
	$log, $http
)
{
	var service =
	{
		// vars
		// ...

		// services
		play : play
	};


	/// services

	function play (code)
	{
		$log.debug('would try to join mobidul');

		return $http
				.get('/JoinMobidul/' + code)
				.error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);

					return response;
				});
	}


	return service;
}
