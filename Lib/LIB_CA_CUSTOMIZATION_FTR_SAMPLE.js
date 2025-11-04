/* LIB_DEFINITION{
  "name": "LIB_CA_CUSTOMIZATION_FTR_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "all extraction customization function",
  "require": []
}*/

/**
 * This module contains functions allowing for customization of First time recognition
 * @namespace Lib.CA.Customization.Ftr
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.Customization = Lib.CA.Customization || {};

Lib.CA.Customization.Ftr = (function ()
{
	/**
	 * @lends Lib.CA.Customization.Ftr
	 */
	var Ftr =
	{
		/**
		 * @method Lib.CA.Customization.Ftr.CustomizeFtrRegex
		 * @description
		 * Function called by the FTR script to customize the regexValues used.
		 * The regexValues is a json with 4 nodes:
		 * - totalAmount, checkNumber and payerName, containing each the regexValues used to extract the related field.
		 * - orgs: a list of organization or business entities to find payer name. See {@link https://en.wikipedia.org/wiki/List_of_legal_entity_types_by_country}
		 * for more examples by country.
		 *
		 * The search word subnode contain the words where we expect the searched data to be.
		 * The "search area" is the area from which we extract the data. The zone can be to the right, to the left, above or below the extracted words.
		 * Locations used (right, left...) depends on which customized ftr regexValues we search.
		 * For example, for paymentDate search zone are above and left but for checkNumber it's the right and below.
		 * The exclude word subnode contain words that should not be in the searched area (for example to not mix up Check Date and Check Number).
		 * For the check number the excludedWord regexValues is split in two : the word that should not be near the area like the others and the word that should not be on the same line.
		 * This is used to handle the line we often find on check that say something like "This check has microprinted background to ensure it's authenticity".
		 * If one or more of the nodes are useless, no need to delete them, just affect the regexValues parameters as null just as shown in Example 2
		 * @param {object} regexValues the default regexValues
		 * @return {object} the customized regexValues
		 * @example
		 * CustomizeFtrRegex: function(regexValues)
		 * {
		 * 	return {
		 * 		"totalAmount" :
		 * 		{
		 * 			"searchWord": ["payment amount", "check amount", "total"],
		 * 			"excludeWord": null
		 * 		},
		 * 		"checkNumber" :
		 * 		{
		 * 			"searchWord":["check", "cheque", "chéque"],
		 * 			"excludeWordNear":["amount", "date"],
		 * 			"excludeWordFar":["background", "detach", "secur[a-z]*", "signature[s]*", "print[a-z]*"]
		 * 		},
		 * 		"payerName" :
		 * 		{
		 * 			"searchWord":["Remittance Address", "Beneficiary", "To:", "From:", "From", "Payer", "Paiement en faveur de "],
		 * 			"excludeWord": null
		 * 		},
		 * 		"orgs": regexValues.orgs
		 * 	};
		 * }
		 * @example
		 * CustomizeFtrRegex: function(regexValues)
		 * {
		 * 	return {
		 * 		"totalAmount":
		 * 		{
		 * 			"searchWord": ["payment amount", "check amount", "total"],
		 * 			"excludeWord": null
		 * 		},
		 * 		"checkNumber":
		 * 		{
		 * 			"searchWord":["check", "cheque", "chéque"],
		 * 			"excludeWordNear":["amount", "date"],
		 * 			"excludeWordFar":["background", "detach", "secur[a-z]*", "signature[s]*", "print[a-z]*"]
		 * 		},
		 * 		"orgs": regexValues.orgs
		 * 	};
		 * }
		 * @example
		 * CustomizeFtrRegex: function(regexValues)
		 * {
		 * 	regexValues.totalAmount.searchWord.push("total amount");
		 *
		 * 	// Add organization to find payer name in Spain (Sociedad Limitada Nueva Empresa)
		 * 	regexValues.orgs.push("S.L.N.E.");
		 * 	return regexValues;
		 * }
		 */
		/*CustomizeFtrRegex: function(regexValues)
		{
		}*/
	};

	return Ftr;
})();
