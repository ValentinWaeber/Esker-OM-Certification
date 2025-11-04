/* LIB_DEFINITION{
  "name": "Lib_Deductions_Customization_Extraction_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "Deductions Extraction customizations functions",
  "require": []
}*/

/**
 * This module contains
 *	- CustomizeExtractionBegin
 *	- CustomizeExtractionEnd
 * @namespace Lib.Deductions.Customization.Extraction
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.Deductions = Lib.Deductions || {};
Lib.Deductions.Customization = Lib.Deductions.Customization || {};

Lib.Deductions.Customization.Extraction = (function ()
{
	/**
	 * @lends Lib.Deductions.Customization.Extraction
	 */
	var Extraction =
	{
		/**
		* @method Lib.Deductions.Customization.Extraction.CustomizeExtractionBegin
		* @description
		* Called at the begining of deduction processing extraction script
		*/
		/*CustomizeExtractionBegin: function ()
		{

		},*/

		/**
		 * @method Lib.Deductions.Customization.Extraction.CustomizeExtractionEnd
		 * @description
		 * Called at the end of deduction processing extraction script
		 */
		/*CustomizeExtractionEnd: function ()
		{
		},*/

		/**
		 * @method Lib.Deductions.Customization.Extraction.FillItemsBegin
		 * @description
		 * call before starting to initialize the items
		 */
		/*FillItemsBegin: function ()
		{
		},*/

		/**
		 * @method Lib.Deductions.Customization.Extraction.filterClaimTypeFromKeywords
		 * @description
		 * Called in InitDeductionType to modify the filter to search for the claim type by keywords
		 * @param {String} filter Actual filter
		 * @returns {String} Modified filter
		 */
		/*filterClaimTypeFromKeywords: function (filter)
		{
			return filter;
		},*/

	};

	return Extraction;

})();
