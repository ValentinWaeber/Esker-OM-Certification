/* LIB_DEFINITION{
  "name": "LIB_AR_CUSTOMIZATION_EDI_FRENCH_B2B_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "COMMON",
  "comment": "EDI French B2B implementation functions",
  "versionable": false,
  "require": []
}*/

/**
 * This module contains
 *   - functions used to implement custom delivery systems for "AR System EDI French B2B" processes
 * @namespace Lib.AR.Customization.EDI.FrenchB2B
 */

///#GLOBALS Lib Sys
var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};
Lib.AR.Customization.EDI = Lib.AR.Customization.EDI || {};

Lib.AR.Customization.EDI.FrenchB2B = (function ()
{
	var Customization =
	{
		/**
		* @method Lib.AR.Customization.EDI.FrenchB2B.CustomizeTransactionExtractionBegin
		* @description
		* Called at the begining of "AR System EDI French B2B Transaction" extraction script
		*/
		/*CustomizeTransactionExtractionBegin: function ()
		{

		},*/

		/**
		* @method Lib.AR.Customization.EDI.FrenchB2B.CustomizeTransactionExtractionEnd
		* @description
		 * Called at the end of "AR System EDI French B2B Transaction" extraction script
		 */
		/*CustomizeTransactionExtractionEnd: function ()
		{
		},*/

		/**
		* @method Lib.AR.Customization.EDI.FrenchB2B.CustomizeTransactionPaymentExtractionBegin
		* @description
		* Called at the begining of "AR System EDI French B2B Transaction Payment" extraction script
		*/
		/*CustomizeTransactionPaymentExtractionBegin: function ()
		{

		},*/

		/**
		* @method Lib.AR.Customization.EDI.FrenchB2B.CustomizeTransactionPaymentExtractionEnd
		* @description
		 * Called at the end of "AR System EDI French B2B Transaction Payment" extraction script
		 */
		/*CustomizeTransactionPaymentExtractionEnd: function ()
		{
		},*/

	};

	return Customization;

})();
