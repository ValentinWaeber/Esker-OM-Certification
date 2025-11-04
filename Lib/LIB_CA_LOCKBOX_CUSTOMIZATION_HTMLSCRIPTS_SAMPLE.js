/* LIB_DEFINITION{
  "name": "LIB_CA_LOCKBOX_CUSTOMIZATION_HTMLSCRIPTS_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "CLIENT",
  "versionable": false,
  "comment": "Cash application additional processing for lockbox file processing",
  "require": []
}*/

/**
 * This module contains functions allowing to
 * - perform additional processing in the lockbox file processing form
 * - customize the display/functionality of various fields in the lockbox file processing form
 * @namespace Lib.CA.Lockbox.Customization.HTMLScripts
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.Lockbox = Lib.CA.Lockbox || {};
Lib.CA.Lockbox.Customization = Lib.CA.Lockbox.Customization || {};

Lib.CA.Lockbox.Customization.HTMLScripts = (function ()
{
	/**
	 * @lends Lib.CA.Lockbox.Customization.HTMLScripts
	 */
	var HTMLScripts =
	{
		/**
		 * @method Lib.CA.Lockbox.Customization.HTMLScripts.LockboxFileProcessingInitialization
		 * @since 330
		 * @description
		 * Function called at the beginning of CA Lockbox File Processing custom script
		 */
		/*LockboxFileProcessingInitialization: function()
		{
		},*/

		/**
		 * @method Lib.CA.Lockbox.Customization.HTMLScripts.LockboxFileProcessingFinalization
		 * @since 330
		 * @description
		 * Function called at the end of CA Lockbox File Processing custom script
		 */
		/*LockboxFileProcessingFinalization: function()
		{
		},*/

	};

	return HTMLScripts;
})();
