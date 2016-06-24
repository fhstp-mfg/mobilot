angular
	.module('Home')
	.factory('HomeService', HomeService);


HomeService.$inject = [
	'$log', '$http'
];


function HomeService (
	$log, $http
)
{
	var service =
	{
		/// constants
		NEAR_ME_MOBIDULE 	: 0,
		ALL_MOBIDULE     	: 1,
		MY_MOBIDULE 	 	: 2,
		DEFAULT_SEARCH_TYPE : 1,

		/// vars
		lastSearchType : 0,

		/// services
		getMobiduls : getMobiduls
	};


	/// services

	function getMobiduls (path)
	{
        return $http.get(path);
	}


	return service;
}
