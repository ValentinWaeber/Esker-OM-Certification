/* LIB_DEFINITION{
  "name": "LIB_AR_CUSTOMIZATION_VALIDATION_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "comment": "additional process validation",
  "versionable": false,
  "require": []
}*/

/**
 * This module contains functions allowing to perform additional process validation
 * @namespace Lib.AR.Customization.Validation
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};

Lib.AR.Customization.Validation = (function ()
{
	/**
	 * @lends Lib.AR.Customization.Validation
	 */
	var validation =
	{
		/**
		 * Allows you to customize the validation settings of the Customer invoice (supplier copy) process.
		 * Use it to complete additional validation actions, such as a forcing invoice validation for given amounts.
		 * This user exit is called at the end of the validation script of the process.
		 */
		FinalizeSUPIValidation: function ()
		{
			/*
			// Sample code showing how to force user validation for total amounts greater than 100
			if(Data.GetActionType() === "approve" || Data.GetActionType() === "approve_asynchronous")
			{
				// the user just pressed the "Approve" button: do nothing to avoid looping validation
				return;
			}

			var totalAmount = Data.GetValue("Invoice_total_amount__");
			if(totalAmount > 100)
			{
				Process.PreventApproval();
			}
			*/
		},

		/**
		 * Allows you to customize the validation settings of the Customer invoice (customer copy) process.
		 * Use it to complete additional validation actions.
		 * This user exit is called at the end of the validation script of the process.
		 */
		FinalizeCUSIValidation: function ()
		{
		},

		/**
		 * Allows you to customize the validation settings of the Accounts Receivable Batch Processing process.
		 * Use it to complete additional validation actions.
		 * This user exit is called at the end of the validation script of the process.
		 */
		FinalizeSplittingValidation: function ()
		{
		},

		/**
		 * Allows you to customize the validation settings of the Resend customer invoice process.
		 * Use it to complete additional validation actions.
		 * This user exit is called at the end of the validation script of the process.
		 */
		FinalizeResendValidation: function ()
		{
		},

		/**
		 * /!\ Implementing this user exit is mandatory if and only if you have enabled the fiscal archiving. /!\
		 * Function called in the SUPI's validation script. This function is called only if the corresponding invoice
		 * is customized to use FatturaFA. It must be modified to check if the invoice number match the required format.
		 * If "result.success" is set to false, the invoice fails with the corresponding "result.errorMessage".
		 * @param {string} invoiceNumber The invoice number to check
		 * @returns {object} result.success to true if the check is correct, false else, and the result.errorMessage is defined in case of error
		 */
		CheckInvoiceForThirdPartyArchiving: function (invoiceNumber)
		{
			// You HAVE TO script this function in order to check the invoice number
			var isThisFunctionImplemented = false;

			// Here you are supposed to check the invoice number: lenght, format, prefixes,...
			var isInvoiceNumberCorrect = false;

			// Result init
			var result =
			{
				success: true,
				errorMessage: ""
			};

			if (!isThisFunctionImplemented)
			{
				result.success = false;
				result.errorMessage = Language.Translate("_The user exit Lib.AR.Customization.Validation.CheckInvoiceForThirdPartyArchiving has to be defined");
			}
			else if (!isInvoiceNumberCorrect)
			{
				result.success = false;
				result.errorMessage = Language.Translate("_The invoice number doesn't match the required format");
			}

			return result;
		},

		/**
		 * Allows you to customize the filter used for detecting duplicate invoices or credit notes.
		 * This function is called only if the Enable duplicate check option in the General step of the configuration tool has been selected.
		 * The duplicate check uses the invoice number or the credit note number as the filter criterion for detecting duplicates when a document is submitted.
		 * Thus, by default, the user exit returns the filter criterion based on the invoice or credit note number.
		 * Implement this user exit to add more criteria or change the default criterion.
		 * @param {string} defaultFilter Filter used by default duplicate check query.
		 * @returns {string} A not null string value representing the filter used for duplicate detection.
		 * @example
		 * This user exit adds purchase order number to the default filter criterion for detecting invoice or credit not duplicates.
		 * <pre><code>
		 * SupplierInvoiceDuplicateCheckFilter: function (defaultFilter)
		 * {
		 *	 var filter = defaultFilter;
		 *	 filter += "(Customer_name__=" + Data.GetValue("Customer_name__") + ")";
		 *
		 *	 return filter;
		 * }
		 * </code></pre>
		 * Consider the following three invoices:
		 * <table>
		 * 	<thead>
		 *	 	<tr>
		 *			<th>Invoice</th>
		 *			<th>Invoice number</th>
		 *		   	<th>Company name</th>
		 *	 	</tr>
		 * 	</thead>
		 * 	<tbody>
		 *		<tr>
		 *			<td>A</td>
		 *			<td>400098</td>
		 *			<td>Green fish</td>
		 *		</tr>
		 *	   	<tr>
		 *			<td>B</td>
		 *			<td>400098</td>
		 *			<td>Green fish</td>
		 *		</tr>
		 *		<tr>
		 *			<td>C</td>
		 *			<td>400098</td>
		 *			<td>DEMOPOS</td>
		 *	 	</tr>
		 *	</tbody>
		 * </table>
		 * By default, all the three invoices are considered as duplicates since they have the same invoice number.
		 * After adding customer company name as the criterion for detecting duplicates, only invoices A and B are considered as duplicates since they have the same invoice number and the same customer company name.
		 */
		SupplierInvoiceDuplicateCheckFilter: function (defaultFilter)
		{
			var filter = defaultFilter;

			/*
			// Sample filter for duplicate invoice query
			filter += "(Customer_name__=" + Data.GetValue("Customer_name__") + ")";
			*/

			return filter;
		},

		/**
		 * Function called in the supplier invoice validation script.
		 * This function is called only if a report template (crystal) is present to make a pdf
		 * @returns {string[]} A list of var names to add to the standard ignored fields for building Report.
		 */
		AddIgnoreVarListInReport: function ()
		{

			/*
			return ["Additional_field_text_1__"];
			*/

			return [];
		},

		/**
		 * Function called in the supplier invoice validation script.
		 * This function is called only if a report template (crystal) is present to make a pdf
		 * @returns {string[]} A list of var names to add to the standard allowed fields for building Report.
		 */
		AddAllowedFieldsInReport: function ()
		{
			return [];
		},


		/**
		 * Function called in the supplier invoice validation script.
		 * This function is called only if customer invoice is sent by email or portal
		 * @returns {regex} A custom regex to validate email
		 */
		GetEmailValidationRegex: function ()
		{
			/* return /^([^@]+)@([^@]+)\.([^@]+)$/i; */
			return null;
		},

		/**
		 * Function called in the supplier invoice validation script.
		 * This function is called only if customer invoice is sent by EDI
		 * @returns {regex} A custom regex to validate email
		 */
		GetEmailValidationRegexEDI: function ()
		{
			/* return /^[^\s@]+@[^\s@]+\.[^\s@]+$/; */
			return null;
		},

		/**
		 * Function called in the supplier invoice validation script.
		 * This function is called only if customer invoice is sent by EDI
		 * @returns {regex} A custom regex to validate email
		 */
		GetEmailValidationRegexPEC: function ()
		{
			/* return /^([^@]+)@([^@]+)\.([^@]+)$/i; */
			return null;
		}
	};

	return validation;
})();
