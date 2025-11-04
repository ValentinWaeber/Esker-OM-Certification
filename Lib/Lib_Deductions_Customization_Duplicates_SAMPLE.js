/* LIB_DEFINITION{
  "name": "Lib_Deductions_Customization_Duplicates_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "Deductions Duplicates customizations functions",
  "require": []
}*/

/**
 * @namespace Lib.Deductions.Customization.Duplicates
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.Deductions = Lib.Deductions || {};
Lib.Deductions.Customization = Lib.Deductions.Customization || {};

Lib.Deductions.Customization.Duplicates = (function ()
{
	/**
	 * @lends Lib.Deductions.Customization.Duplicates
	 */
	var Duplicates =
	{
		/**
		 * @method Lib.Deductions.Customization.Duplicates.KeepNewDeductionAfterMerge
		 * @description
		 * Function called to customize if you want to keep the new deduction (the one in extraction) and mark the old one as merged (the one currently in the workflow).
		 * The default behavior is to keep the deduction with supporting document.
		 * @param {Object.<string, any>} oldDeduction Old deduction already present
		 * @param {Object.<string, any>} newDeduction New deduction in extraction
		 * @param {boolean} keepNewDeduction Indicate wether the new deduction is kept after merge
		 * @returns {boolean} Customized choice
		 * @example <caption>Example of a function that always keep the old deduction</caption>
			KeepNewDeductionAfterMerge: function (oldDeduction, newDeduction, keepNewDeduction)
			{
				// we always want to keep the old deduction because it is potentially more advanced in the workflow and we value that over having the pdf
				return false;
			}
		 */
		/*KeepNewDeductionAfterMerge: function (oldDeduction, newDeduction, keepNewDeduction)
		{
			return keepNewDeduction;
		},*/

	};

	return Duplicates;

})();
