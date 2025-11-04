/**
 * Package AR HTML page script customization callbacks for all processes
 * @namespace Lib.AR.Customization.HTMLScripts
 */

/* LIB_DEFINITION{
  "name": "Lib_AR_Customization_HTMLScripts_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "CLIENT",
  "comment": "HTML (custom script) AR customization callbacks",
  "versionable": false,
  "require": []
}*/

///#GLOBALS Lib
var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};

Lib.AR.Customization.HTMLScripts = (function ()
{
	var customization = {
		/**
		 * @method Lib.AR.Customization.HTMLScripts.CustomizeSUPI
		 * @description
		 * Allows you to customize layout settings for the Customer invoice (supplier copy) process.
		 * Use it to disable an option, set a field to read-only mode, etc.
		 * This user exit is called at the end of the HTML page script of the process.
		 */
		CustomizeSUPI: function ()
		{
			// Popup.Alert("In SUPI HTML page script ");
		},

		/**
		 * @method Lib.AR.Customization.HTMLScripts.CustomizeCUSI
		 * @description
		 * Allows you to customize layout settings for the Customer invoice (customer copy) process.
		 * Use it to disable an option, set a field to read-only mode, etc.
		 * This user exit is called at the end of the HTML page script of the process.
		 */
		CustomizeCUSI: function ()
		{
		},

		/**
		 * @method Lib.AR.Customization.HTMLScripts.CustomizeSplitting
		 * @description
		 * Allows you to customize layout settings for the Accounts Receivable Batch Processing process.
		 * Use it to disable an option, set a field to read-only mode, etc.
		 * This user exit is called at the end of the HTML page script of the process.
		 */
		CustomizeSplitting: function ()
		{
		},

		/**
		 * @method Lib.AR.Customization.HTMLScripts.CustomizeResend
		 * @description
		 * This function will be called at the end of Resend HTML page script.
		 * If needed, use it to customize the Resend user interface.
		 *
		 * @example This user exit sets the copy stamp option to read-only and disables the address page option when sending a copy of the invoice.
		 * CustomizeResend: function ()
		 * {
		 *		// Set the duplicate stamp checkbox read only:
		 *		Controls.Add_Duplicata__.SetReadOnly(true);
		 *		// Hide the checkbox that allows to add a cover:
		 *		Controls.Address_page__.Hide(true);
		 * }
		 */
		CustomizeResend: function ()
		{
		},

		/**
		 * @method Lib.AR.Customization.HTMLScripts.AllowedExtensionsForResend
		 * @description
		 * Allows you to define attached files to be resent according to a customized extension list.
		 * This user exit is called during the HTML page script of the Customer invoice (supplier copy) process.
		 * @return {Array} Array of strings representing the extensions to allow. Extensions must be specified without the dot.
		 * If nothing is returned, default values are pdf, doc, docx, rtf, csv, xls, xlsx, ppt, pptx, pps, ppsx, txt, tif, htm, html, gif, jpg, jpeg, png, ps, pcl, rpt, epmf and zip.
		 *
		 * @example This user exit allows resending files in the PDF and XML format.
		 * AllowedExtensionsForResend: function ()
		 * {
		 *	 return ["pdf", "xml"];
		 * }
		 */
		AllowedExtensionsForResend: function ()
		{

		},

		/**
		 * @method Lib.AR.Customization.HTMLScripts.FilterDefaultFilesForResend
		 * @description
		 * Function called in the Resend with popup mode.
		 * You can use this function to customize the default files displayed in the popup
		 * @param {Array} files array of files from the SUPI.
		 * @returns {Array} Array of files to display.
		 *
		 * @example
		 * var newFileList = [];
		 * for (var index = 0; index < files.length; index++)
		 * {
		 * 	var file = files[index];
		 * 	if (file.file.GetAttribute("FILENAME").indexOf("1page") > -1)
		 * 	{
		 * 		file.undeletable = true;
		 * 		newFileList.push(files[index]);
		 * 	}
		 * }
		 * return newFileList;
		 */
		/*FilterDefaultFilesForResend: function (files)
		{
		}, */

		/**
		 * @method Lib.AR.Customization.HTMLScripts.CustomizePayment
		 * @description
		 * This function will be called at the end of Payment HTML page script
		 * It can be used to override default interface construction
		 * For instance, payment can be disable with the following sample
		 *
		 * @example This user exit disables the on-line payment option.
		 * CustomizePayment: function()
		 * {
		 * 		Controls.Mean_of_payment_pane.Hide();
		 * 		Popup.Alert("You are not allowed to pay your invoices on line");
		 * }
		 */
		CustomizePayment: function ()
		{
		},

		/**
		 * @method Lib.AR.Customization.HTMLScripts.CustomizeUpdatePayment
		 * @description
		 * This function will be called at the end of Update payment HTML page script
		 * It can be used to override default interface construction
		 * For instance, it is possible to disable the possibility to update a payment status
		 * with the folowing sample
		 *
		 * @example This user exit disables the options that allow the user to change payment information and to add a comment.
		 * CustomizeUpdatePayment: function()
		 * {
		 * 		Controls.Save.Hide();
		 * 		Controls.Additional_information.Hide();
		 * 		Controls.Mean_of_payment_pane.Hide();
		 * 		Popup.Alert("invalid operation");
		 * }
		 */
		CustomizeUpdatePayment: function ()
		{
		},

		/**
		 * @method Lib.AR.Customization.HTMLScripts.SupplierInvoiceCreditNotesFilter
		 * @description
		 * Function called in the supplier invoice HTML page script.
		 * You can use this function to customize the filter used to query the credit notes
		 * related to the current invoice.
		 * @param {string} defaultFilter Filter used by default to query related credit notes.
		 * @returns {string} A not null filter used to query related credit notes.
		 *
		 * @example
		 * SupplierInvoiceCreditNotesFilter: function (defaultFilter)
		 * {
		 *		var filter = defaultFilter;
		 *		// Sample filter for related credit notes query
		 *		filter += "&((Credit_note_on_invoice__=" + Data.GetValue("Invoice_number__") + ")(Additional_field_text_1__=" + Data.GetValue("Additional_field_text_1__") + "))";
		 *
		 *
		 *		return filter;
		 * }
		 */
		/*SupplierInvoiceCreditNotesFilter: function (defaultFilter)
		{
			var filter = defaultFilter;

			// Sample filter for related credit notes query
			//filter += "&((Credit_note_on_invoice__=" + Data.GetValue("Invoice_number__") + ")(Additional_field_text_1__=" + Data.GetValue("Additional_field_text_1__") + "))";

			return filter;
		},*/

		/**
		 * @method Lib.AR.Customization.HTMLScripts.SupplierInvoiceLinkToInvoiceFilter
		 * @description
		 * Function called in the supplier invoice HTML page script.
		 * You can use this function to customize the filter used to query the invoice, when you are on a related credit note
		 * @param {string} defaultFilter Filter used by default to query the related invoice.
		 * @returns {string} A not null filter used to query the related invoice.
		 *
		 * @example
		 * SupplierInvoiceLinkToInvoiceFilter: function (defaultFilter)
		 * {
		 *		var filter = defaultFilter;
		 *		// Sample filter for related credit notes query
		 *		filter += "(&(Invoice_Type__=\"INVOICE\")(Invoice_number__=" + Data.GetValue("Credit_note_on_invoice__") + ")(Additional_field_text_1__=" + Data.GetValue("Additional_field_text_1__") + "))";
		 *
		 *		return filter;
		 * }
		 */
		/*SupplierInvoiceLinkToInvoiceFilter: function (defaultFilter)
		{
			var filter = defaultFilter;

			return filter;
		},*/

		/**
		 * @method Lib.AR.Customization.HTMLScripts.CustomizeAccountStatement
		 * @description
		 * Allows you to customize layout settings for the account statement process.
		 * This user exit is called at the end of the HTML page script of the process.
		 */
		/*CustomizeAccountStatement: function ()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.HTMLScripts.CustomizeAccountStatementDisablePayment
		 * @description
		 * Function called in the account statement HTML page script.
		 * You can use this function to disable the payment on the account statement even if it's enabled in the AR global configuration
		 * @returns {boolean} A boolean to disable payment
		 *
		 * @example
		 * CustomizeAccountStatementDisablePayment: function ()
		 * {
		 *		return true;
		 * }
		 */
		/*CustomizeAccountStatementDisablePayment: function ()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.HTMLScripts.CustomizeAccountStatementFieldsToQuery
		 * @description
		 * Function called in the account statement HTML page script.
		 * Allows the modification of the fields to query from the Customer Invoices (customer copy) process
		 * @param {Array} fieldsToQuery - Array with the default fields to query
		 * @returns {Array} fields to query
		 *
		 * @example This example add a field to the query
		 * CustomizeAccountStatementFieldsToQuery: function (fieldsToQuery)
		 * {
		 *	fieldsToQuery.push("Z_my_field__");
		 *	return fieldsToQuery;
		 * }
		 */
		/*CustomizeAccountStatementFieldsToQuery: function (fieldsToQuery)
		{
			return fieldsToQuery;
		},*/

		/**
		 * @method Lib.AR.Customization.HTMLScripts.CustomizeAccountStatementLoopOnInvoices
		 * @param {Object} queryObject - Query object
		 * @param {*} i - current index in the loop
		 * @example This example fill a column with a value in the queryObject
		 * CustomizeAccountStatementLoopOnInvoices: function (queryObject, i)
		 * {
		 *	item.SetValue("Z_my_field__", this.GetQueryValue("Z_my_field__", i));
		 * }
		 */
		/*CustomizeAccountStatementLoopOnInvoices: function (queryObject, i)
		{

		},*/

		/**
		 * @method Lib.AR.Customization.HTMLScripts.CustomizeHeaderTitle
		 * @description
		 * Allows you to customize the header title.
		 * This user exit is called right after the computation of header title in nominative cases during the initialization of the main pane.
		 * @param {string} headerTitle Default header title computation in the script
		 * @returns {string} Customized header title.
		 */
		/*CustomizeHeaderTitle: function (headerTitle)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.HTMLScripts.CustomizeConversationCustomTagsForSupplier
		 * @description
		 * Function called in the supplier invoice HTML page script.
		 * Allows the modification of the custom tags for the conversation with the supplier
		 * @property {Object} customTags - Object containing the custom tags
		 *
		 * @example This example adds the custom tags with the company code
		 * CustomizeConversationCustomTagsForSupplier: function (customTags)
		 * {
		 *	customTags.Company_code__ = Data.GetValue("Company_code__");
		 * }
		 */
		/*CustomizeConversationCustomTagsForSupplier: function (customTags)
		{

		},*/

		/**
		 * @method Lib.AR.Customization.HTMLScripts.CustomizeDepositRequest
		 * @since 330
		 * @description
		 * Function called in the AR deposit request HTML page script.
		 * Allows the modification/calculation of fields or controls on the form.
		 *
		 * @example
		 * CustomizeDepositRequest: function()
		 * {
		 * }
		 */
		/*CustomizeDepositRequest: function ()
		{

		}*/
	};

	return customization;
})();
