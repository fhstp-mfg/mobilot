angular
	.module('Creator')
	.factory('CreatorService', CreatorService);


CreatorService.$inject = [
	'$log', '$http'
];


function CreatorService (
	$log, $http
)
{
	var service =
    {
		/// constants
		BASIS_TAB_INDEX      : 0,
		CATEGORIES_TAB_INDEX : 1,
		MENU_TAB_INDEX       : 2,
		SETTINGS_TAB_INDEX   : 3,

		MOBIDUL_CODE_EXAMPLE : 'mobidul-code',

		CREATE_MOBIDUL       : 'Mobidul erstellen',
		CREATING_MOBIDUL     : 'Mobidul wird erstellt',
		UPDATE_MOBIDUL       : 'Speichern',
		UPDATING_MOBIDUL     : 'Mobidul wird gespeichert',


		/// services
		getCategories    : getCategories,
		getOptions	     : getOptions,
		getConfig        : getConfig,

        existsMobidul    : existsMobidul,
        createMobidul    : createMobidul,
        updateMobidul    : updateMobidul,
		deleteMobidul 	 : deleteMobidul,
        saveOptions      : saveOptions,
        updateCategories : updateCategories,
		removeCategory   : removeCategory,
        saveMenu         : saveMenu,

        getCodes         : getCodes,
        requestCode      : requestCode,
        lockCode         : lockCode,
        unlockCode       : unlockCode,
        deleteCode       : deleteCode,
    };


    /// services

    function existsMobidul (mobidulCode)
    {
        var mobidulCode = mobidulCode.replace(/[^a-z0-9]/g, '');
		var serviceUrl  = 'existsMobidul/' + mobidulCode;

		return $http
				.get( serviceUrl )
				.error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
    }


    function createMobidul (params)
    {
        var serviceUrl = 'NewMobidul';

        return $http
                .post ( serviceUrl, JSON.stringify( params ) )
                .error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
    }


    function updateMobidul (mobidulCode, params)
    {
        var serviceUrl  = mobidulCode + '/UpdateMobidul';
		var mobidulData = JSON.stringify( params );

        return $http
                .post( serviceUrl, mobidulData )
                .error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
    }


	function deleteMobidul (mobidulCode)
	{
		var params = { mobidulCode : mobidulCode };
		var mobidulData = JSON.stringify( params );

		return $http
				.post('DeleteMobidul', mobidulData)
				.error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
	}


    function saveOptions ( mobidulCode, params )
    {
        var serviceUrl = mobidulCode + '/SetOptions';

        return $http
                .post ( serviceUrl, params )
                .error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
    }


    function updateCategories (mobidulCode, params)
    {
        var serviceUrl = mobidulCode + '/UpdateCategories';

        return $http
                .post ( serviceUrl, params)
                .error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
    }


	function removeCategory (mobidulCode, categoryId)
	{
		var serviceUrl = mobidulCode + '/RemoveCategory/' + categoryId;

		return $http
				.get( serviceUrl )
				.error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
	}


    function getCategories (mobidulCode)
    {
        var serviceUrl = mobidulCode + '/GetCategories';

        return $http
                .get( serviceUrl )
                .error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
    }


    function getOptions (mobidulCode)
    {
        var serviceUrl = mobidulCode + '/GetOptions';

        return $http
                .get( serviceUrl )
                .error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
    }


    function getConfig (mobidulCode)
    {
        var serviceUrl = mobidulCode + '/getConfig';

        return $http
                .get ( serviceUrl )
                .error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
    }

    function getCodes (mobidulCode)
    {
        var serviceUrl = 'Codes/' + mobidulCode;

        return $http
                .get ( serviceUrl )
                .error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
    }

    function requestCode (mobidulCode)
    {
        var serviceUrl = mobidulCode + '/GetPlayCode';

        return $http
                .post( serviceUrl, {})
                .error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
    }

    function lockCode (codeToLock)
    {
        var serviceUrl = 'CloseCode/' + codeToLock;

        return $http
                .get ( serviceUrl )
                .error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
    }

    function unlockCode (codeToUnlock)
    {
        var serviceUrl = 'OpenCode/' + codeToUnlock;

        return $http
                .get ( serviceUrl )
                .error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
    }

    function deleteCode (codeToDelete)
    {
        var serviceUrl = 'DeleteCode/' + codeToDelete;

        return $http
                .get ( serviceUrl )
                .error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
    }




    function saveMenu (mobidulCode, params)
    {
        var serviceUrl = mobidulCode + '/UpdateNavigation';

        return $http
                .post ( serviceUrl, JSON.stringify( params ) )
                .error(function (response, status, headers, config)
				{
					$log.error(response);
					$log.error(status);
				});
    }


    return service;
}
