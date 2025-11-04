/* LIB_DEFINITION{
  "name": "Lib_CM_Customization_CreditApplicationImport_Sample",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "additional customizations of credit application import",
  "require": []
}*/

/**
 * This module contains functions allowing to perform additional actions in finalization of credit management processes
 * @namespace Lib.CM.Customization.CreditApplicationImport
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.CM = Lib.CM || {};
Lib.CM.Customization = Lib.CM.Customization || {};

Lib.CM.Customization.CreditApplicationImport = (function ()
{
	/**
	 * @lends Lib.CM.Customization.CreditApplicationImport
	 */
	var creditApplicationImport = {
		/**
		 * Allows you to customize the credit application process before it is started.
		 * @param {object} creditAppProcess - The process instance for the credit application.
		 * @param {object} args - The arguments passed to the credit application creation.
		 * @example
		 * CustomizeCreditApplicationProcess: function (creditAppProcess, args)
		 * {
		 *     // Example: Set a custom variable
		 *     creditAppProcess.GetUninheritedVars().AddValue_String("CustomField__", "CustomValue", true);
		 * }
		 */
		CustomizeCreditApplicationProcess: function (creditAppProcess, args)
		{ },

		/**
		 * Allows you to customize the properties of the contact before it is created.
		 * @param {object} args - The arguments passed to the contact creation.
		 * @returns {object} An object containing additional or overridden properties.
		 * @example
		 * CustomizeContactProperties: function (args)
		 * {
		 *     // Example: Add a custom property
		 *     return { CustomProperty: "CustomValue" };
		 * }
		 */
		CustomizeContactProperties: function (args)
		{ },

		/**
		 * Allows you to customize the import arguments of the credit application given in the CSV import before processing.
		 * @param {object} args - The arguments passed to the import.
		 * @returns {object} An object containing additional or overridden arguments.
		 * @example
		 * CustomizeImportArguments: function (args)
		 * {
		 *     // Example: Add or override an argument
		 *     args.CustomArg = "CustomValue";
		 *     return args;
		 * }
		 */
		CustomizeImportArguments: function (args)
		{ }
	};

	return creditApplicationImport;
})();