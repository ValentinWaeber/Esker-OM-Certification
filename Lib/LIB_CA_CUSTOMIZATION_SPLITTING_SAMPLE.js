/* LIB_DEFINITION{
  "name": "LIB_CA_CUSTOMIZATION_SPLITTING_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "all splitting customization function",
  "require": []
}*/

/**
 * Package CA Splitting customization callbacks for all processes
 * @namespace Lib.CA.Customization.Splitting
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.Customization = Lib.CA.Customization || {};

Lib.CA.Customization.Splitting = (function ()
{
	/**
	 * @lends Lib.CA.Customization.Splitting
	 */
	var Splitting =
	{
		/**
		 * @method Lib.CA.Customization.Splitting.InitializeRemittanceAdviceSplitting
		 * @description
		 * This function is called at the beginning of the remittance advice splitting process Extraction
		 */
		/*InitializeRemittanceAdviceSplitting: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Splitting.FinalizeRemittanceAdviceSplitting
		 * @description
		 * This function is used to customize the Remittance Advice Splitting process Extraction
		 */
		/*FinalizeRemittanceAdviceSplitting: function ()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Splitting.InitializeRemittanceAdviceSplittingValidation
		 * @description
		 * This function is called at the beginning of the remittance advice splitting process Validation
		 */
		/*InitializeRemittanceAdviceSplittingValidation: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Splitting.FinalizeRemittanceAdviceSplittingValidation
		 * @description
		 * This function is used to customize the Remittance Advice Splitting process Validation
		 */
		/*FinalizeRemittanceAdviceSplittingValidation: function ()
		{
		},*/
	};

	return Splitting;

})();
