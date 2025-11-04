/* LIB_DEFINITION{
  "name": "LIB_AR_CUSTOMIZATION_SIGNATURE_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "comment": "override signature command",
  "versionable": false,
  "require": []
}*/

/**
 * This module contains functions allowing to override default signature commands
 * @namespace Lib.AR.Customization.Signature
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};

Lib.AR.Customization.Signature = (function ()
{
	var signature =
	{
		/**
		 * @method Lib.AR.Customization.Signature.OverrideTrustweaverSignatureCommand
		 * @description
		 * Allows you to customize the invoice signature settings for the Customer invoice (supplier copy) process.
		 * This user exit is called before the Trustweaver command is run.
		 * The OverrideTrustweaverSignatureCommand function signature should also be used for the OverrideTrustweaverValidationCommand.
		 * @param {object} context Object properties to customize.
		 * @param {function} context.GetSupplierUser() Function that return a Supplier user
		 * @param {function} context.GetCustomerUser() Function that return a Customer user
		 * @return {string} The new command line to use to sign invoices.
		 * 
		 * @example This user exit changes the default signature settings to retrieve the information file when signing with archive signature jobs.
		 * OverrideTrustweaverSignatureCommand: function(context)
		 * {
		 *		var fromCountry = context.GetSupplierUser().GetVars().GetValue_String("Country", 0);
		 *		var toCountry = context.GetCustomerUser().GetVars().GetValue_String("Country", 0);
		 *		var customTwCommand = "-sign %infile[1]% -country " + fromCountry + " " + toCountry + " -archive -nodetail";
		 *		return customTwCommand;
		 * }
		 */
		/*OverrideTrustweaverSignatureCommand: function(context)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Signature.OverrideTrustweaverValidationCommand
		 * @description
		 * Allows you to customize the invoice signature validation settings for the Customer invoice (customer copy) process.
		 * This user exit is called by the process before the Trustweaver command is run.
		 * @param {object} context Object properties to customize.
		 * @param {function} context.GetSupplierUser() Function that return a Supplier user
		 * @param {function} context.GetCustomerUser() Function that return a Customer user
		 * @return {string} The new command line to use to sign invoices.
		 * 
		 * @example
		 * OverrideTrustweaverValidationCommand: function(context)
		 * {
		 *		var fromCountry = context.GetSupplierUser().GetVars().GetValue_String("Country", 0);
		 *		var toCountry = context.GetCustomerUser().GetVars().GetValue_String("Country", 0);
		 *		var customTwCommand = "-validate %infile[1]% -country " + fromCountry + " " + toCountry + " -nodetail";
		 *		return customTwCommand;
		 * }
		 */
		/*OverrideTrustweaverValidationCommand: function(context)
		{
		}*/
	};

	return signature;
})();
