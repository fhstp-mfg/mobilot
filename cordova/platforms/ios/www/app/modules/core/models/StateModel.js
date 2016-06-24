angular
	.module('Mobilot')
	.factory('StateModel', StateModel);


StateModel.$inject = [
	'$log'
];


function StateModel (
	$log
)
{
	var service = {
		make : function () {
			return new State();
		}
	};


	/// construct

	var State = State;
		// properties
		State.prototype.name 	  = '';
		State.prototype.params   = {};
		State.prototype.previous = null;
		// functions
		// State.prototype.go	= _go;



	/// functions

	function State ()
	{
		$log.debug('** new state **');
	}


	// function _go (stateName)
	// {
	// 	$log.debug('StateModel go to "' + stateName  + '"');
	// }


	return service;
}
