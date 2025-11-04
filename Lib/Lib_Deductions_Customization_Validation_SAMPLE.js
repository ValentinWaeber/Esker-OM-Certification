/* LIB_DEFINITION{
  "name": "Lib_Deductions_Customization_Validation_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "Deductions Validation customizations functions",
  "require": []
}*/

/**
 * This module contains
 *	- CustomizeValidationBegin
 *	- CustomizeValidationEnd
 * @namespace Lib.Deductions.Customization.Validation
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.Deductions = Lib.Deductions || {};
Lib.Deductions.Customization = Lib.Deductions.Customization || {};

Lib.Deductions.Customization.Validation = (function ()
{
	/**
	 * @lends Lib.Deductions.Customization.Validation
	 */
	var Validation =
	{
		/**
		* @method Lib.Deductions.Customization.Validation.CustomizeValidationBegin
		* @description
		* Called at the begining of deduction processing Validation script
		* @return {boolean} return true to prevent the standard execution
		*/
		/*CustomizeValidationBegin: function ()
		{
			return false;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Validation.CustomizeValidationEnd
         * @param action the action that was performed, see enum Lib.Deductions.Processing.Common.ValidationScriptAction for possible string values
		 * @description
		 * Called at the end of deduction processing Validation script
		 */
		/*CustomizeValidationEnd: function (action)
		{
		},*/

		/**
		 * @method Lib.Deductions.Customization.Validation.CustomizeIgnoredFieldsForAutomaticProcessingRate
		 * @description
		 * Customize the list of fields ignored when filling manual and automatic fields counters
		 * @param defaultList the default list of ignored fields. its a array of string containing controls names to ignore
		 * @return the customized list
		 */
		/*CustomizeIgnoredFieldsForAutomaticProcessingRate: function (defaultList)
		{
			var customizedList = defaultList;
			return customizedList;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Validation.CustomizeIgnoredColumnsForAutomaticProcessingRate
		 * @description
		 * Customize the list of line item columns ignored when filling manual and automatic fields counters
		 * @param defaultList the default list of ignored line item columns. its a array of string containing columns names to ignore
		 * @return the customized list
		 */
		/*CustomizeIgnoredColumnsForAutomaticProcessingRate: function (defaultList)
		{
			var customizedList = defaultList;
			return customizedList;
		},*/

	};

	return Validation;

})();
