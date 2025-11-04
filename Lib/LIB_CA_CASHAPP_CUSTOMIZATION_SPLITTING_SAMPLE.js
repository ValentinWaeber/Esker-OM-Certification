/* LIB_DEFINITION{
  "name": "LIB_CA_CASHAPP_CUSTOMIZATION_SPLITTING_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "CashApplication Bank statements splitting customization functions",
  "require": []
}*/

/**
 * @namespace Lib.CA.CashApp.Customization.Splitting
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.CashApp = Lib.CA.CashApp || {};
Lib.CA.CashApp.Customization = Lib.CA.CashApp.Customization || {};

Lib.CA.CashApp.Customization.Splitting = (function ()
{
	/**
	 * This module contains functions to customize the splitting of bank files
	 * @lends Lib.CA.CashApp.Customization.Splitting
	 */
	var Splitting =
	{
		/**
		 * @method Lib.CA.CashApp.Customization.Splitting.InitializePaymentFileSplittingExtraction
		 * @description
		 * Customization function called at the beginning of bank statement splitting extraction script.
		 */
		/*InitializePaymentFileSplittingExtraction: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Splitting.FinalizePaymentFileSplittingExtraction
		 * @description
		 * Customization function called at the end of bank statement splitting extraction script.
		 */
		/*FinalizePaymentFileSplittingExtraction: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Splitting.InitializePaymentFileSplittingValidation
		 * @description
		 * Customization function called at the beginning of bank statement splitting validation script.
		 */
		/*InitializePaymentFileSplittingValidation: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Splitting.FinalizePaymentFileSplittingValidation
		 * @description
		 * Customization function called at the end of bank statement splitting validation script.
		 */
		/*FinalizePaymentFileSplittingValidation: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Splitting.InitializePaymentFileSplittingGeneration
		 * @description
		 * Customization function called at the beginning of bank statement splitting generation script.
		 */
		/*InitializePaymentFileSplittingGeneration: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Splitting.GetSplitOnSetting
		 * @since 336
		 * @description
		 * Customization function to provide a custom segment for splitting the attached file.
		 * This is called before the file is split.
		 * This can be useful to override the default option of "BANKACCOUNT" when there are more than one matching configurations on the original file submitted to the Payment File Splitting process.
		 * @param {string} fileType The detected file type.
		 * @param {"EXPORTDATE" | "BANKACCOUNT"} splitOnBankAccount The split on setting. Defaults to "BANKACCOUNT" when a single configuration is not found.
		 * When set to "BANKACCOUNT", the file will be split on "GS" segments for EDI820 and "03" segments for BAI2.
		 * When set to "EXPORTDATE", the file will be split on "ISA" segments for EDI820 and "01" segments for BAI2.
		 * @returns {"EXPORTDATE" | "BANKACCOUNT"} The updated split on setting.
		 * @example <caption>This example will override the default value for EDI820 files</caption>
		 * GetSplitOnSetting: function (fileType, splitOnBankAccount)
		 * {
		 * 	if (fileType === "EDI820")
		 * 	{
		 * 		return "EXPORTDATE";
		 * 	}
		 * }
		 */
		/*GetSplitOnSetting: function(fileType, splitOnBankAccount)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Splitting.SplitBankStatement
		 * @description
		 * Customization function to provide a custom splitting of attached file.
		 * @param {string} fileType The detected file type.
		 * @param {string} fileContent The first attachment content.
		 */
		/*SplitBankStatement: function(fileType, fileContent)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Splitting.FinalizePaymentFileSplittingProcess
		 * @description
		 * Customization function called before processing the "CA Payment File Processing" sub-process.
		 * @param {xTransport} transport The "CA Payment File Processing" transport.
		 */
		/*FinalizePaymentFileSplittingProcess: function(transport)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Splitting.FinalizePaymentFileSplittingGeneration
		 * @description
		 * Customization function called at the end of bank statement splitting generation script.
		 */
		/*FinalizePaymentFileSplittingGeneration: function()
		{
		}*/
	};

	return Splitting;

})();
