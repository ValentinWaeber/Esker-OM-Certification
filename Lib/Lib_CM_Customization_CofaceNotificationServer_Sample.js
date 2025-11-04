/* LIB_DEFINITION{
  "name": "Lib_CM_Customization_CofaceNotificationServer_Sample",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "Customizing Coface Notification server scripts",
  "require": []
}*/

/**
 * This module contains functions allowing to perform additional actions in CofaceNotification process.
 * It provides customization hooks for the Coface notification workflow during extraction, validation, and finalization phases.
 * @namespace Lib.CM.Customization.CofaceNotificationServer
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.CM = Lib.CM || {};
Lib.CM.Customization = Lib.CM.Customization || {};

Lib.CM.Customization.CofaceNotificationServer = (function ()
{
	/**
	 * @lends Lib.CM.Customization.CofaceNotificationServer
	 */
	var CofaceNotificationServer = {

		/**
		 * Customizes the extractionScript of the Coface notification process.
		 * This function is called during the extraction
		 * to be executed after the standard extraction operations.
		 * 
		 * @method Lib.CM.Customization.CofaceNotificationServer.CustomizeExtraction
		 * @description Performs custom actions during the Coface notification extraction
		 * @returns {void} This function does not return a value
		 * @example
		 * 		CustomizeExtraction : function() {
		 *     		Log.Info("Custom extraction executed");
		 *		};
		 */
		CustomizeExtraction: function ()
		{ },

		/**
		 * Customizes the validationScript phase of the Coface notification process.
		 * This function is called during the validation
		 * to be executed after the standard validation operations.
		 * 
		 * @method Lib.CM.Customization.CofaceNotificationServer.CustomizeValidation
		 * @description Performs custom actions during the Coface notification validation
		 * @returns {void} This function does not return a value
		 * @example
		 * 		CustomizeValidation : function() {
		 *     		Log.Info("Custom validation executed");
		 *		};
		 */
		CustomizeValidation: function ()
		{ },

		/**
		 * Customizes the finalizationScript phase of the Coface notification process.
		 * This function is called during the finalization
		 * to be executed after the standard finalization operations.
		 * 
		 * @method Lib.CM.Customization.CofaceNotificationServer.CustomizeFinalization
		 * @description Performs custom actions during the Coface notification finalization
		 * @returns {void} This function does not return a value
		 * @example
		 * 		CustomizeFinalization : function() {
		 *     		Log.Info("Custom finalization executed");
		 *		};
		 */
		CustomizeFinalization: function ()
		{ },
	};

	return CofaceNotificationServer;
})();

