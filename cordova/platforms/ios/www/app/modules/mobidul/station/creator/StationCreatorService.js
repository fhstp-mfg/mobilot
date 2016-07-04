angular
	.module('StationCreator')
	.factory('StationCreatorService', StationCreatorService);


StationCreatorService.$inject = [
	'$log', '$http'
];


function StationCreatorService (
	$log, $http
)
{
	var service =
	{
		// constants
		BASIS_TAB_INDEX      : 0,
		PLACE_TAB_INDEX      : 1,
		CATEGORIES_TAB_INDEX : 2,
		SETTINGS_TAB_INDEX   : 3,

		STATION_CODE_EXAMPLE : 'station-code',

		// vars
		marker : {
			coords : null
		},
		markersAll : [],

		// functions
		loadCategories 			: loadCategories,
		loadStation    			: loadStation,
		addStation     			: addStation,
		saveStation    			: saveStation,
		deleteStation  			: deleteStation,
		updateStationContent: updateStationContent
	};


	/// services

	function loadCategories (mobidulCode)
	{
		return $http.get( mobidulCode + '/GetCategories' );
	}


	function loadStation (mobidulCode, stationCode)
	{
		return $http.get( mobidulCode + '/GetForCode/' + stationCode );
	}


	function addStation (mobidulCode, stationData)
	{
		return $http.post( mobidulCode + '/AddStation', stationData );
	}


	function saveStation (mobidulCode, stationCode, stationData)
	{
		return $http.post( mobidulCode + '/SaveStation/' + stationCode, stationData );
	}

	function updateStationContent (mobidulCode, stationCode, content){
		return $http.post( mobidulCode + '/UpdateContent/' + stationCode, {content: content});
	}

	function deleteStation (mobidulCode, stationCode)
	{
		return $http.get( mobidulCode + '/RemoveStationByCode/' + stationCode );
	}


	return service;
}
