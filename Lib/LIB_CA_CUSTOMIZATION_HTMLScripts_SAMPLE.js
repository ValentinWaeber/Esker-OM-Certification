/* LIB_DEFINITION{
  "name": "LIB_CA_CUSTOMIZATION_HTMLScripts_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "CLIENT",
  "versionable": false,
  "comment": "additional process HTMLScripts",
  "require": []
}*/

/**
 * This module contains functions allowing to perform additional process HTMLScripts
 * @namespace Lib.CA.Customization.HTMLScripts
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.Customization = Lib.CA.Customization || {};

Lib.CA.Customization.HTMLScripts = (function ()
{
	/**
	 * @lends Lib.CA.Customization.HTMLScripts
	 */
	var HTMLScripts =
	{
		/**
		 * @method Lib.CA.Customization.HTMLScripts.CleanInvoiceNumber
		 * @description
		 * This function is used in Remittance Advice Processing to modify the invoice number before trying to look it up.
		 * @param {string} invoiceNumber the value of Col_invoice_number__ of the changed line in Table_invoice_lines__.
		 * @param {IControlInTable} control the control of the changed line in Table_invoice_lines__. You can access data with control.GetRow().Colxxxxx
		 * @param {boolean} isCapturedText true if the text was captured directly from the document, false if entered manually by the user
		 * @returns {string} The modified invoice number
		 * @example <caption>This example removes the 00 prefix from the invoice number extracted from the remittance.</caption>
		 * CleanInvoiceNumber: function (invoiceNumber, control, isCapturedText)
		 * {
		 *	let cleanedInvoiceNumber = invoiceNumber;
		 *	if (invoiceNumber && isCapturedText && control.GetRow().Col_document_type__.GetValue() === Lib.CA.Remittance.Common.RemittanceItemType.Invoice)
		 *	{
		 *		cleanedInvoiceNumber = invoiceNumber.replace(/^00/, ""); // remove prefix of 00
		 *	}
		 *	return cleanedInvoiceNumber;
		 * }
		 */
		/*CleanInvoiceNumber: function (invoiceNumber, control, isCapturedText)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.HTMLScripts.ModifyInvoiceNumber
		 * @description
		 * This function is used in Remittance Advice Processing to modify the invoice number. If the "Fill document number from related document"
		 * feature is enabled, this function does not run if the document number is filled from a related document.
		 * @param {string} invoiceNumber the value of Col_invoice_number__ of the changed line in Table_invoice_lines__.
		 * @param {Lib.CA.Remittance.Common.RemittanceMatchingItems} matchingItemsFound Invoices and related data found in the application that match entered the invoice number.
		 * @param {IControlInTable} control the control of the changed line in Table_invoice_lines__. You can access data with control.GetRow().Colxxxxx
		 * @param {boolean} isCapturedText true if the text was captured directly from the document, false if entered manually by the user
		 * @returns {string|IPromise<string>} modifiedInvoiceNumber or promise that resolves to modifiedInvoiceNumber
		 * @example <caption>This example adds leading zeroes if the invoice number extracted from the remittance is not found in the application.</caption>
		 * ModifyInvoiceNumber: function (invoiceNumber, matchingItemsFound, control, isCapturedText)
		 * {
		 *	let modifiedInvoiceNumber;
		 *	if (matchingItemsFound.matches.length === 0 && isCapturedText)
		 *	{
		 *		modifiedInvoiceNumber = invoiceNumber.padStart(10, '0');
		 *	}
		 *	return modifiedInvoiceNumber;
		 * }
		 */
		/*ModifyInvoiceNumber: function (invoiceNumber, matchingItemsFound, control, isCapturedText)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.HTMLScripts.AdditionalChecksOnLineChange
		 * @description
		 * Function called by the Remittance Advice custom script when a line is changed
		 * @param {IControlInTable} control the control of the changed line. You can access datas with control.GetRow().Colxxxxx
		 */
		/*AdditionalChecksOnLineChange: function(control)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.HTMLScripts.CustomHtmlScriptInitialization
		 * @description
		 * Function called during remittance advices custom script initialization
		 * @example <caption>This example updates the invoice table status icon after a custom field is modified</caption>
		 * CustomHtmlScriptInitialization: function()
		 * {
		 * 	var iconHelper = Lib.CA.Remittance.Client.GetInvoiceTableIconHelper();
		 * 	Controls.Table_invoice_lines__.Z_Company_Code__.OnChange = function()
		 * 	{
		 * 		iconHelper.RefreshStatusColumn(true);
		 * 	};
		 * }
		 */
		/*CustomHtmlScriptInitialization: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.HTMLScripts.CustomizeDocumentSearchColumns
		 * @description
		 * Allows for overriding the default columns displayed when browsing documents.
		 * @param {Lib.CA.Customization.Common.BrowseColumn[]} columns An array of default columns that would be displayed.
		 * @param {string} documentType Document type to be searched. Possible values: 'INVOICE_TYPE' or 'DEDUCTION_TYPE'.
		 * @returns {Lib.CA.Customization.Common.BrowseColumn[]} An array of columns that will be actually displayed.
		 *
		 * @example <caption>The following example shows how to insert custom columns when searching for an invoice or a deduction claim.</caption>
		 * CustomizeDocumentSearchColumns: function (columns, documentType)
		 * {
		 * 	var customColumns = [];
		 * 	switch (documentType) {
		 * 		case "INVOICE_TYPE":
		 * 			// Insert custom information provided by Open AR file
		 * 			customColumns.push({
		 * 				"id": "Additional_field_text_1__",
		 * 				"label": "ERP document type",
		 * 				"type": "Text",
		 * 				"width": 50
		 * 			});
		 * 			for (var index = 0; index < columns.length; index++) {
		 * 				var column = columns[index];
		 * 				customColumns.push(column);
		 * 			}
		 * 			break;
		 * 		case "DEDUCTION_TYPE":
		 * 			for (var index = 0; index < columns.length; index++) {
		 * 				var column = columns[index];
		 * 				customColumns.push(column);
		 * 				// Insert "Claim reason" after claim amount
		 * 				if (column.id === "Claim_amount__") {
		 * 					customColumns.push({
		 * 						"id": "Explanation__",
		 * 						"label": "Claim reason",
		 * 						"type": "Text",
		 * 						"width": 100
		 * 					});
		 * 				}
		 * 			}
		 * 			break;
		 * 		default:
		 * 			throw "Unexpected document type";
		 * 	}
		 * 	return customColumns;
		 * }
		 */
		/*CustomizeDocumentSearchColumns: function (columns, documentType)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.HTMLScripts.CustomizeLinkedPaymentsQuery
		 * @description
		 * Allows for overriding the default query searching for payments you can link to the remittance advice.
		 * If used, this will completely replace the default query.
		 * @param {string} startDateSearch - an appropriately-formatted string representing the start of the date search range from the remittance configuration
		 * @param {string} endDateSearch - an appropriately-formatted string representing the end of the date search range from the remittance configuration
		 * @returns {Sys.Helpers.LdapUtil.IFilter} a defined filter to use to query the CA Payment Matching database
		 *
		 * @example <caption>The following example forces all linked payments to have the transaction type "Miscellaneous Security Credit" but allows a tolerance of 10 dollars(or your respective currency) in either direction rather than requiring a matching amount.</caption>
		 * CustomizeLinkedPaymentsQuery: function(startDateSearch, endDateSearch)
		 *{
		 *	let totalAmount = Controls.Total_amount__.GetValue();
		 *	let range = 10;
		 *	let filter = Sys.Helpers.LdapUtil.FilterAnd(
		 *		Sys.Helpers.LdapUtil.FilterEqual("State", "70"),
		 *		Sys.Helpers.LdapUtil.FilterEqual("Deleted", "0"),
		 *		Sys.Helpers.LdapUtil.FilterGreaterOrEqual("Paid_amount__", (totalAmount - range).toString()),
		 *		Sys.Helpers.LdapUtil.FilterLesserOrEqual("Paid_amount__", (totalAmount + range).toString()),
		 *		Sys.Helpers.LdapUtil.FilterRaw(
		 *			Lib.CA.QueryHelper.Common.GetCompanyCodeFilter(Controls.Company_code__.GetValue())
		 *		),
		 *		Sys.Helpers.LdapUtil.FilterGreaterOrEqual("Payment_date__", startDateSearch),
		 *		Sys.Helpers.LdapUtil.FilterLesserOrEqual("Payment_date__", endDateSearch),
		 *		Sys.Helpers.LdapUtil.FilterEqual("Payment_method__", "Miscellaneous Security Credit")
		 *	);
		 *	return filter;
		 *}
		 */
		/*CustomizeLinkedPaymentsQuery: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.HTMLScripts.SynchronizationHtmlScriptInitialization
		 * @description
		 * Function called at the end of CA Synchronization custom script initialization
		 * @example This example defaults in the company code 1000. Note to use Process Variable for the scheduled task.
		 * SynchronizationHtmlScriptInitialization: function()
		 * {
		 * 	Controls.Company_code__.SetValue("1000");
		 * }
		 */
		/*SynchronizationHtmlScriptInitialization: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.HTMLScripts.PaymentInfoFinalize
		 * @description
		 * Function called at the end of Payment Info for Reports custom script initialization
		 */
		/*PaymentInfoFinalize: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.HTMLScripts.AdditionalAvailablePaymentFormFields
		 * @description
		 * Function called within the Custom Template Creation form to allow additional fields to be added to the payment form field whitelist
		 * This is used in case a needed mapped field is accidentally not allowed.
		 * @example <caption>This example adds two non Z_-prefixed fields to the allowed fields in Custom Template Creation.</caption>
		 * AdditionalAvailablePaymentFormFields: function()
		 * {
		 * 	 return ["Custom_Field_1__", "Custom_Field_2__"]
		 * }
		 */
		/*AdditionalAvailablePaymentFormFields: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.HTMLScripts.CustomConfiguratorHtmlScriptInitialization
		 * @description
		 * Function called after initial loading of the Remittance Advice Configuration page.
		 * This is used in case custom configuration fields are added that need some special handlers.
		 */
		/*CustomConfiguratorHtmlScriptInitialization: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.HTMLScripts.CustomRemittanceAdviceMappingReferenceField
		 * @since 340
		 * @description
		 * Function called to pass in an array of custom values into the "Reference Field" combobox.
		 * This is used to add additional options to the "Reference field" combobox to create rules that target fields on the invoice line that are neither the document number or description.
		 * The {@link Lib.CA.Customization.Common.CustomRemittanceAdviceMappingReferenceFieldHandling} user exit is then where one would handle what field to target with said custom entries.
		 * @returns {Array<Object.<string, string>>} An array of objects that contain a definition of a key and value. The key is then used in the {@link Lib.CA.Customization.Common.CustomRemittanceAdviceMappingReferenceFieldHandling}
		 * to see what option has been selected while the value is what appears in the UI.
		 * @example <caption>This example adds an entry to have the rule target field be the reason code and have that corresponding text appear as an option to select.</caption>
		 * CustomRemittanceAdviceMappingReferenceField: function()
		 * {
		 *     return [{key: "REASON_CODE", value: "Reason code"}];
		 * }
		 */
		/*CustomRemittanceAdviceMappingReferenceField: function()
		{
		},*/
	};

	return HTMLScripts;
})();
