/* LIB_DEFINITION{
  "name": "LIB_DD_CUSTOMIZATION_VALIDATION_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "comment": "additional process validation",
  "versionable": false,
  "require": []
}*/

/**
 * This module contains functions allowing to perform additional process validation
 * @namespace Lib.DD.Customization.Validation
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.DD = Lib.DD || {};
Lib.DD.Customization = Lib.DD.Customization || {};

Lib.DD.Customization.Validation = (function ()
{
	/**
	 * @lends Lib.DD.Customization.Validation
	 */
	var validation =
	{
		/**
		 * Function called by the SenderForm process at the start of the validation script
		 */
		InitializeSenderFormValidation: function ()
		{
		},
		/**
		 * Function called by the SenderForm process at the end of the validation script
		 */
		FinalizeSenderFormValidation: function ()
		{
		},

		/**
		 * Function called by the Splitting process at the end of the validation script
		 */
		FinalizeSplittingValidation: function ()
		{
		}
	};

	return validation;
})();
