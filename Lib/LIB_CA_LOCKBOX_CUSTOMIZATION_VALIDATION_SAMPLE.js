/* LIB_DEFINITION{
  "name": "LIB_CA_LOCKBOX_CUSTOMIZATION_VALIDATION_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "Lockbox file processing Validation customization functions",
  "require": []
}*/

/**
 * @namespace Lib.CA.Lockbox.Customization.Validation
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.Lockbox = Lib.CA.Lockbox || {};
Lib.CA.Lockbox.Customization = Lib.CA.Lockbox.Customization || {};

Lib.CA.Lockbox.Customization.Validation = (function ()
{
	/**
	 * This module contains functions allowing to
	 * - perform additional processing before/after Lockbox file validation
	 * @lends Lib.CA.Lockbox.Customization.Validation
	 */
	var Validation =
	{
		/**
		 * @method Lib.CA.Lockbox.Customization.Validation.InitializeLockboxFileProcessingValidation
		 * @since 330
		 * @description
		 * Function called at the beginning of the Lockbox File Processing validation script
		 */
		/*InitializeLockboxFileProcessingValidation: function()
		{
		},*/

		/**
		 * @method Lib.CA.Lockbox.Customization.Validation.FinalizeLockboxFileProcessingValidation
		 * @since 330
		 * @description
		 * Function called at the end of the Lockbox File Processing validation script
		 */
		/*FinalizeLockboxFileProcessingValidation: function()
		{
		},*/
	};

	return Validation;
})();
