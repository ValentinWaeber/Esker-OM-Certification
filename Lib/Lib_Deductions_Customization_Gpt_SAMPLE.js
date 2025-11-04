/* LIB_DEFINITION{
  "name": "Lib_Deductions_Customization_Gpt_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "COMMON",
  "versionable": false,
  "comment": "Customization GPT on Claims and Deductions",
  "require": []
}*/

/**
 * @namespace Lib.Deductions.Customization.Gpt
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.Deductions = Lib.Deductions || {};
Lib.Deductions.Customization = Lib.Deductions.Customization || {};

Lib.Deductions.Customization.Gpt = (function ()
{
	/**
	 * @lends Lib.Deductions.Customization.Gpt
	 */
	var Gpt =
	{
		/**
		 * @method Lib.Deductions.Customization.Gpt.CustomizeGptExtractionFields
		 * @description
		 * Function called during GPT extraction. It allows to change the header fields and line items columns to be filled by ChatGPT.
		 * @param {Object} gptSettings - an object with the following structure:
		 *  {
		 *   fields: {
		 *    <field_name>: {
		 *     label: <field_label>,
		 *     description: <field_description>,
		 *     type: "string" | "number" | "boolean",
		 *     replaceData: boolean
		 *    },
		 *   },
		 *   lineItems: {
		 *    <field_name>: {
		 *     label: <field_label>,
		 *     description: <field_description>,
		 *     type: "string" | "number" | "boolean",
		 *     replaceData: boolean
		 *    },
		 *   },
		 *  }
		 * @param {string} context - the context of the GPT extraction, e.g., "CSVExtraction", "EmailExtraction", etc.
		 * @returns No return value expected
		 * @example
		 * CustomizeGptExtractionFields: function(gptSettings, context)
		 * {
		 * 		gptSettings.Z_Tax_code__: {
		 *  		label: "Tax code",
		 * 			description: "Tax code of the invoice",
		 * 			type: "string"
		 * 		};
		 * 		gptSettings.lineItems.Z_Col_unit__: {
		 *  		label: "Unit of measure",
		 * 			description: "Unit of measure of the material",
		 * 			type: "string"
		 * 		};
		 * }
		**/
		/*
		CustomizeGptExtractionFields: function (gptSettings, context)
		{
		}
		*/
	};

	return Gpt;
})();
