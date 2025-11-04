/* LIB_DEFINITION{
  "name": "Lib_Deductions_Customization_Finalization_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "Deductions Finalization customizations functions",
  "require": []
}*/

/**
 * This module contains
 *	- CustomizeFinalizationBegin
 *	- CustomizeFinalizationEnd
 * @namespace Lib.Deductions.Customization.Finalization
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.Deductions = Lib.Deductions || {};
Lib.Deductions.Customization = Lib.Deductions.Customization || {};

Lib.Deductions.Customization.Finalization = (function ()
{
	/**
	 * @lends Lib.Deductions.Customization.Finalization
	 */
	var Finalization =
	{
		/**
		* @method Lib.Deductions.Customization.Finalization.CustomizeFinalizationBegin
		* @description
		* Called at the beginning of deduction processing Finalization script
		* @return {boolean} return true to prevent the standard execution
		*/
		/*CustomizeFinalizationBegin: function ()
		{
			return false;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Finalization.CustomizeFinalizationEnd
		 * @description
		 * Called at the end of deduction processing Finalization script
		 */
		/*CustomizeFinalizationEnd: function ()
		{
		},*/

	};

	return Finalization;

})();
