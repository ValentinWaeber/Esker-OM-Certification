/* LIB_DEFINITION{
  "name": "LIB_CA_CUSTOMIZATION_EXTRACTION_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "all extraction customization function",
  "require": []
}*/

/**
 * Package CA extraction customization callbacks for all processes
 * @namespace Lib.CA.Customization.Extraction
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.Customization = Lib.CA.Customization || {};

Lib.CA.Customization.Extraction = (function ()
{
	/**
	 * @lends Lib.CA.Customization.Extraction
	 */
	var Extraction =
	{
		/**
		 * @method Lib.CA.Customization.Extraction.InitializeRemittanceAdviceProcessingExtraction
		 * @description
		 * This function is used to customize the Remittance Advice Processing on extracted data, at the beginning of the extraction process.
		 * There are several variables that you can set :
		 * - <code>ForceFTR</code> : force the FTR processing. Default value : <code>false</code>
		 * - <code>DisableFTR</code> : disable the FTR. Default value : <code>false</code>
		 * - <code>FTRPagesThreshold</code> : page threshold at which the FTR will be disabled. Default value : <code>20</code>
		 * - <code>FindSimilarLines</code> : activate FindSimilarLines FTR feature.
		 * - <code>SkipFTRWithPaymentDate</code> : skip FTR when you already have Payment Date
		 * @example
		 * Variable.SetValueAsString("FTRPagesThreshold", 15);
		 */
		/*InitializeRemittanceAdviceProcessingExtraction: function ()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Extraction.FinalizeRemittanceAdviceProcessingExtraction
		 * @description
		 * This function is used to customize the Remittance Advice Processing on extracted data, at the end of the extraction process
		 *
		 */
		/*FinalizeRemittanceAdviceProcessingExtraction: function ()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Extraction.CleanInvoiceNumber
		 * @description
		 * This function is used to modify the Remittance Advice Processing extracted invoice number before trying to look it up.
		 * @param {string} invoiceNumber the value of Col_invoice_number__ of the evaluated line in Table_invoice_lines__.
		 * @param {Item} item the evaluated line in Table_invoice_lines__.
		 * @returns {string} The modified invoice number
		 * @example This example removes the 00 prefix from the invoice number extracted from the remittance.
		 * CleanInvoiceNumber: function (invoiceNumber, item)
		 * {
		 *	let cleanedInvoiceNumber = invoiceNumber;
		 *	if (invoiceNumber && item.GetValue("Col_document_type__") === Lib.CA.Remittance.Common.RemittanceItemType.Invoice)
		 *	{
		 *		cleanedInvoiceNumber = invoiceNumber.replace(/^00/, ""); // remove prefix of 00
		 *	}
		 *	return cleanedInvoiceNumber;
		 * }
		 */
		/*CleanInvoiceNumber: function (invoiceNumber, item)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Extraction.ModifyInvoiceNumber
		 * @description
		 * This function is used to modify the Remittance Advice Processing extracted invoice number. If the "Fill document number from related document"
		 * feature is enabled, this function does not run if the document number is filled from a related document.
		 * @param {string} invoiceNumber the value of Col_invoice_number__ of the evaluated line in Table_invoice_lines__.
		 * @param {Array<{ invoiceNum: string, invoiceType: string, matchedField: string }>} matchingInvoices an array containing the set of matching invoices in the application, as well as invoice types, and matched fields
		 * @param {Item} item the evaluated line in Table_invoice_lines__.
		 * @returns {string} modifiedInvoiceNumber
		 * @example This example adds leading zeroes if the invoice number extracted from the remittance is not found in the application.
		 * ModifyInvoiceNumber: function (invoiceNumber, matchingInvoices, item)
		 * {
		 *	let modifiedInvoiceNumber;
		 *	if (matchingInvoices.length === 0)
		 *	{
		 *		modifiedInvoiceNumber = invoiceNumber.padStart(10, '0');
		 *	}
		 *	return modifiedInvoiceNumber;
		 * }
		 */
		/*ModifyInvoiceNumber: function (invoiceNumber, matchingInvoices, item)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Extraction.CustomizeInvoiceExtractionFilter
		 * @description
		 * Customizes the filter used when querying invoices that match the extracted document numbers,
		 * only when using using the "Fill document number from related document" setting or when {@link Lib.CA.Customization.Extraction.ModifyInvoiceNumber ModifyInvoiceNumber} is defined.
		 * This changes the filter for those additional searches, but does not affect the standard search for invoices.
		 * @param {Sys.Helpers.LdapUtil.IFilter} filter - Filter created by the standard process
		 * @param {string[]} extractedDocumentNumbers = List of potential invoice/order numbers from the current batch for the remittance
		 * @param {string[]} fieldList - List of attributes that the extractedDocumentNumbers may match, including Invoice_number__
		 * @param {Sys.Helpers.LdapUtil.IFilter} companyCodeFilter - Company code filter for invoices
		 * @returns {Sys.Helpers.LdapUtil.IFilter} The updated filter
		 * @example This example filters out Paid invoices
		 * CustomizeInvoiceExtractionFilter: function(filter, extractedDocumentNumbers, fieldList, companyCodeFilter)
		 * {
		 * 	const customFilter = Sys.Helpers.LdapUtil.FilterAnd(
		 * 		filter,
		 * 		Sys.Helpers.LdapUtil.FilterNotEqual("Payment_status__", "PAID")
		 * 	);
		 * 	return customFilter;
		 * }
		 */
		/*CustomizeInvoiceExtractionFilter: function(filter, extractedDocumentNumbers, fieldList, companyCodeFilter)
		{
		},*/
	};

	return Extraction;

})();
