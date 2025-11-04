/* LIB_DEFINITION{
  "name": "LIB_CA_CUSTOMIZATION_VALIDATION_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "additional process validation",
  "require": []
}*/

/**
 * This module contains functions allowing to perform additional process validation
 * @namespace Lib.CA.Customization.Validation
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.Customization = Lib.CA.Customization || {};

Lib.CA.Customization.Validation = (function ()
{
	/**
	 * @lends Lib.CA.Customization.Validation
	 */
	var validation =
	{
		/**
		 * @method Lib.CA.Customization.Validation.InitializeRemittanceAdviceProcessingValidation
		 * @description
		 * Function called by the Remittance Advice processing process at the beginning of the validation script
		 * @example <caption>Set Variables to configure</caption>
		 * InitializeRemittanceAdviceProcessingValidation: function()
		 * {
		 *	// Set to "1" to always skip searching for database items on Other type lines.
		 *	// This causes skipping of all standard validation and lookup for items when performing first extraction and auto completing.
		 *	Variable.SetValueAsString("SkipValidateFirstExtractionDataConsistency", "1");
		 *	// Set to "1" to force the validation of the remittance items to query by batch.
		 *	// This allows using the faster method of validating remittance advice items in all cases.
		 *	// This is necessary when the {@link Lib.CA.Customization.Common.CustomizeSearchedInvoiceFilter}
		 *	// or {@link Lib.CA.Customization.Common.CustomizeSearchedDeductionFilter} functions exist, but
		 *	// neither {@link Lib.CA.Customization.Common.CustomizeSearchedInvoiceByBatchFilter}
		 *	// or {@link Lib.CA.Customization.Common.CustomizeSearchedDeductionByBatchFilter} are defined.
		 *	// By default, the item-by-item algorithm is used over the batch algorithm for backwards compatibility, since
		 *	// the batch algorithm (and the 'ByBatch' user exits) were added after the original algorithm (and user exits) were already in place.
		 *	Variable.SetValueAsString("ForceRemittanceItemsValidationQueryByBatch", "1");
		 *	// Set the maximum number of remittance items to include in each query when performing validation.
		 *	// By default this is set to 50, with a hard-limit on the query of 500 returned items.
		 *	// Please consider the number of items we may expect to find with the same document number for a single remittance item,
		 *	// as we will want to ensure we can find all results for all items in each query.
		 *	// E.g. if we expect up to 5 items matching a document number, then we should only consider 100 items per
		 *	// query to ensure we retrieve all matching items from the database.
		 *	Variable.SetValueAsString("RemittanceItemsValidationQueryBatchSize", "100");
		 * }
		 */
		/*InitializeRemittanceAdviceProcessingValidation: function ()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Validation.FinalizeRemittanceAdviceProcessingValidation
		 * @description
		 * Function called by the Remittance Advice processing process at the end of the validation script
		 */
		/*FinalizeRemittanceAdviceProcessingValidation: function ()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Validation.CustomizeRemittanceAdviceProcessingValidation
		 * @description
		 * Function called by the Remittance Advice processing during the validation script. If this function is defined it will be used instead of the predefined checks
		 * Call Process.PreventApproval(); if the form must be sent back to validation
		 */
		/*CustomizeRemittanceAdviceProcessingValidation: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Validation.AllowOtherRemittanceLineInTouchless
		 * @description
		 * Function called by the Remittance Advice processing during the validation script.
		 * This can allow Touchless with OTHER type lines, where those normally prevent it.
		 * @param {Item} lineItem Current Invoice table line item
		 * @returns {boolean} True allows touchless, unless another line prevents it
		 * @example <caption>Checks the current line value to determine whether to allow or not.</caption>
		 * AllowOtherRemittanceLineInTouchless: function (lineItem)
		 * {
		 * 	let value = lineItem.GetValue("Col_document_number__") || lineItem.GetValue("Col_invoice_number__") || "";
		 * 	if (value.startsWith("5"))
		 * 	{
		 * 		return true; //allow touchless
		 * 	}
		 * 	return false; //prevent touchless
		 * }
		 */
		/*AllowOtherRemittanceLineInTouchless: function(lineItem)
		{
		},

		*//**
		 * @method Lib.CA.Customization.Validation.CustomizeExtractedDocumentType
		 * @since 336
		 * @description
		 * Function called by the Remittance Advice processing during the validation script.
		 * This can determine whether extracted lines that don't match existing invoices are extracted with a line type of Other, Deduction, or Invoice.
		 * You can return INVOICE_TYPE if the item somehow corresponds to an invoice, that is either not in the system or e.g. needs a manual modification from the user to associate.
		 * @param {Item} lineItem Current Invoice table line item
		 * @param {"OTHER_TYPE" | "DEDUCTION_TYPE"} extractAsType Default document type assumed for this item
		 * @returns {"INVOICE_TYPE" | "OTHER_TYPE" | "DEDUCTION_TYPE"} The document type to set for this item.
		 * @example <caption>Forces the type to OTHER_TYPE if REBATE is contained in the document number, otherwise uses default logic</caption>
		 * CustomizeExtractedDocumentType: function (lineItem, extractAsType)
		 * {
		 * 	let value = lineItem.GetValue("Col_document_number__") || lineItem.GetValue("Col_invoice_number__") || "";
		 * 	value = value.toUpperCase();
		 * 	if (value.includes("REBATE"))
		 * 	{
		 * 		return "OTHER_TYPE";
		 * 	}
		 * 	return extractAsType;
		 * }
		 */
		/*CustomizeExtractedDocumentType: function(lineItem, extractAsType)
		{
		},*/
	};

	return validation;
})();
