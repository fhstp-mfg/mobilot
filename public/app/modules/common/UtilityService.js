angular
	.module('Mobilot')
	.service('UtilityService', UtilityService);


UtilityService.$inject = [
	'$log'
];


function UtilityService (
	$log
)
{
	var util = this;

	// constants
	util._maxCodeCharLimit = 20;


	/// services

	util.hasOwnProperty = function (obj, prop)
	{
		// NOTE - adapted from http://stackoverflow.com/a/136411/2035807

		var proto = obj.__proto__ || obj.constructor.prototype;

	    return ( prop in obj ) &&
	           ( ! ( prop in proto ) ||
			     proto[ prop ] !== obj[ prop ] );
	};



	util.startsWithIn = function (needle, haystack)
	{
		// NOTE - adapted from http://stackoverflow.com/a/646643/2035807
		// return needle.slice(0, haystack.length) == needle;

		// NOTE - adapted from http://rickyrosario.com/blog/javascript-startswith-and-endswith-implementation-for-strings/
		return haystack.indexOf(needle) === 0;
	};



	util.getCodeFromName = function (mobidulName)
	{
		var code = mobidulName || '';

		// make code lower case
		code = code.toLowerCase();
		// replace everything but (lower case) letters
		// code = code.replace(/[^a-z0-9]/g, '');
		code = util.formatCode( code );
		code = code; // NOTE - check if this is necessary

		// limit the code to <n> chars
		code = code.slice(0, util._maxCodeCharLimit);

		return code;
	};


	util.formatCode = function (code)
	{
		var code = code || '';

		return code.replace(/[^a-z0-9]/g, '').trim();
	};


	// ...
}
