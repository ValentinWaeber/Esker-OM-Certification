/* LIB_DEFINITION{
  "name": "Lib_Deductions_Customization_FTR_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "all extraction customization function",
  "require": []
}*/

/**
 * This module contains functions allowing for customization of First time recognition
 * @namespace Lib.Deductions.Customization.Ftr
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.Deductions = Lib.Deductions || {};
Lib.Deductions.Customization = Lib.Deductions.Customization || {};

Lib.Deductions.Customization.Ftr = (function ()
{
	/**
	 * @lends Lib.Deductions.Customization.Ftr
	 */
	var Ftr =
	{
		/**
		 * @method Lib.Deductions.Customization.Ftr.CustomizeFtrRegex
		 * @description
		 * Function called by the FTR script to customize the regexValues used.
		 * The regexValues is a json with 1 node:
		 * - totalAmount containing the regexValues used to extract the related field.
		 *
		 * The search word subnode contain the words where we expect the searched data to be.
		 * @param {object} regexValues the default regexValues
		 * @return {object} the customized regexValues
		 * @example
		 * CustomizeFtrRegex: function(regexValues)
		 * {
		 * 	return {
		 * 		"totalAmount": {
					"searchWord": ["total claim amount", "claim total"],
					"excludeWord": ["capital", "tva"]
				},
				"netAmount": {
					"searchWord": ["total h.t.", "total net"]
				},
				"documentNumber": {
					"searchWord": ["deduction claim number", "document number"],
					"excludeWord": []
				}
		 * 	};
		 * }
		 * @example
		 * CustomizeFtrRegex: function(regexValues)
		 * {
		 * 	return {
		 * 		"totalAmount": {
					"searchWord": ["total claim amount", "claim total"],
					"excludeWord": ["capital", "tva"]
				},
				"netAmount": {
					"searchWord": ["total h.t.", "total net"]
				},
				"documentNumber": {
					"searchWord": ["deduction claim number", "document number"],
					"excludeWord": []
				}
		 * 	};
		 * }
		 */
		/*CustomizeFtrRegex: function(regexValues)
		{
		},*/

		/**
		 * @method Lib.Deductions.Customization.Ftr.DiscardAddress
		* @description Allows you to exclude an address from the list of addresses used for the first-time recognition mechanism.
		* This user exit is called each time an address block is extracted in the Deductions Processing process.
		*
		* @param {string} addressString - This string contains the exact words of the address.
		* @param {Area} addressArea - The area in the document from where the address has been extracted (see documentation for more details).
		*
		* @returns Boolean value specifying the address exclusion:
		* - true: This address is excluded. The first-time recognition mechanism ignores this address.
		* - false: This address is not excluded. The first-time recognition mechanism uses this address.
		*
		* @example <caption>This user exit excludes all the addresses containing Computer Club Market using an insensitive case regular expression.
		* - An address containing COMPUTER CLUB MARKET is excluded,
		* - An address containing COmpuTEr clUB mArKEt is excluded,
		* - An address containing Computer-Club-Market is not excluded.</caption>
		*function DiscardAddress(addressString, addressArea)
		*{
		*	// discard address matching the specified regurar expression
		*	var regExp = /Computer Club Market/gmi;
		*	if (regExp.exec(addressString) !== null)
		*	{
		*		return true;
		*	}
		*	return false;
		*}
		**/
		/*DiscardAddress: function (addressString, addressArea)
		{
		}*/
	};

	return Ftr;
})();
