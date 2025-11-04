/* LIB_DEFINITION{
  "name": "LIB_CA_Lockbox_CUSTOMIZATION_FINALIZATION_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "Lockbox file processing Finalization customization functions",
  "require": []
}*/

/**
 * This module contains
 * - functions to modify the processing of lockbox files during finalization
 * @namespace Lib.CA.Lockbox.Customization.Finalization
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.Lockbox = Lib.CA.Lockbox || {};
Lib.CA.Lockbox.Customization = Lib.CA.Lockbox.Customization || {};

Lib.CA.Lockbox.Customization.Finalization = (function ()
{
	/**
	 * @lends Lib.CA.Lockbox.Customization.Finalization
	 */
	var Finalization =
	{
		/**
		 * @method Lib.CA.Lockbox.Customization.Finalization.InitializeLockboxFileProcessingGeneration
		 * @since 330
		 * @description
		 * Function called at the beginning of the Lockbox File Processing finalization script
		 */
		/*InitializeLockboxFileProcessingGeneration: function()
		{
		},*/

		/**
		 * @method Lib.CA.Lockbox.Customization.Finalization.FinalizeLockboxFileProcessingGeneration
		 * @since 330
		 * @description
		 * Function called at the end of the Lockbox File Processing finalization script
		 */
		/*FinalizeLockboxFileProcessingGeneration: function()
		{
		},*/

		/**
		 * @method Lib.CA.Lockbox.Customization.Finalization.DoCreateRemittanceForItem
		 * @since 330
		 * @description
		 * Allows for customization whether a remittance advice will be created in addition to the payment allocation.
		 * This function is called for each transaction extracted from the lockbox file.
		 * @param {Lib.CA.Lockbox.Extraction.LockboxItem} lockboxItem The transaction item from which a payment and potentially a remittance will be created
		 * @return {boolean|null} True if a remittance advice should be created. False if a remittance advice should not be created. Null if the default behavior should be used.
		 * @example <caption>This example will force every transaction parsed from the lockbox to create a remittance advice.</caption>
		 * DoCreateRemittanceForItem: function (lockboxItem)
		 * {
		 * 	return true;
		 * }
		*/
		/*DoCreateRemittanceForItem: function (lockboxItem)
		{
		},*/
	};

	return Finalization;

})();
