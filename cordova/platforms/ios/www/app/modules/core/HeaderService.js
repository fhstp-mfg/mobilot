angular
	.module('Mobilot')
	.service('HeaderService', HeaderService);


HeaderService.$inject = [
	'$log', '$rootScope'
];


function HeaderService (
	$log, $rootScope
)
{
	var service =
	{
		// vars
		title : 'Mobilot',

		showMenu        : false,
		showGoBack      : false,
		showEditStation : false,
		showSaveStation : false,

		// services
		refresh	 : refresh
	};


	/// services

	function refresh ()
	{
		$rootScope.$emit('Header::refresh');
	}


	return service;
}
