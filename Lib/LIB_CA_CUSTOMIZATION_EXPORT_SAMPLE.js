/* LIB_DEFINITION{
  "name": "LIB_CA_CUSTOMIZATION_EXPORT_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "CashApplication Export customization functions",
  "require": []
}*/

/**
 * This module contains functions used to customize the allocation export files from the Cash Application
 * @namespace Lib.CA.Customization.Export
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.Customization = Lib.CA.Customization || {};

Lib.CA.Customization.Export = (function ()
{
	/**
	 * Global variable for sample codes below.
	 */
	/*var xml;*/

	/**
	 * @lends Lib.CA.Customization.Export
	 */
	var Export =
	{
		/**
		 * Output CSV file: default columns type and label
		 * @typedef Lib.CA.Customization.Export.ExportAllocationsFields
		 * @property {string} FILE_DATE File Date
		 * @property {string} ALLOCATION_TYPE Allocation Type
		 * @property {string} CUSTOMER_ID Customer ID
		 * @property {string} CUSTOMER_NAME Customer Name
		 * @property {string} INVOICE_NUMBER Invoice Number
		 * @property {string} INVOICE_DATE Invoice Date
		 * @property {string} TOTAL_AMOUNT_PAID Total Amount Paid
		 * @property {string} TOTAL_AMOUNT_PAID_CURRENCY Total Amount Paid Currency
		 * @property {string} INVOICE_DUE_DATE Invoice Due Date
		 * @property {string} PURCHASE_ORDER_NUMBER Purchase Order Number
		 * @property {string} LEDGER_ACCOUNT_NUMBER Ledger Account Number
		 * @property {string} COST_CENTER Cost Center
		 * @property {string} ADJUSTMENT_DESCRIPTION Adjustment Description
		 * @property {string} RUIDEX Unique ID
		 * @property {string} PAYER Payer Reference
		 * @property {string} PAYER_NAME Payer Name
		 * @property {string} INVOICE_PAYMENT_DATE Invoice Pay Date
		 * @property {string} PAYMENT_DATE Pay Date
		 * @property {string} PAYMENT_REFERENCE Payment Reference Number
		 * @property {string} PAYMENT_METHOD Payment Method
		 * @property {string} PAID_AMOUNT Total Paid on Payment
		 * @property {string} PAYMENT_CURRENCY Currency
		 * @property {string} COMPANY_CODE Company Code
		 * @property {string} ALLOCATION_COMMENTS Allocation Comments
		 * @property {string} DISCOUNT_AMOUNT Discount
		 * @property {string} ADJUSTMENT_DOCUMENT_NUMBER Adjustment Number
		 * @property {string} PROFIT_CENTER Profit Center
		 * @property {string} CHECK_NUMBER Check Number
		 * @property {string} REASON_CODE Reason Code
		 */

		/**
		 * @method Lib.CA.Customization.Export.AddOrRenameNewColumns
		 * @description
		 * Allows for addition of new columns within the allocation export file. New columns need to be populated in the CustomAttribute user exit or they will be blank.
		 * Existing columns will have the displayed column name updated to match the column name in the returned array.
		 * This is called during the allocation export process in the finalization script.
		 * @returns {Map.<string|Lib.CA.Customization.Export.ExportAllocationsFields,string>} A map of strings that represent column names which will be added or renamed in the allocation export file.
		 * @example <caption>This example will add a new column with the internal name "DESCRIPTION" named "Description" in the CSV and will rename the "FILE_DATE" column to "Submitted Date" in the CSV</caption>
		 * AddOrRenameNewColumns: function()
		 * {
		 * 	var mapping = {};
		 * 	// Add 'DESCRIPTION' field
		 * 	mapping["DESCRIPTION"] = "Description";
		 * 	mapping["FILE_DATE"] = "Submitted Date"
		 * 	return mapping;
		 * }
		 */
		/*AddOrRenameNewColumns: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.IgnoreColumns
		 * @description
		 * Allows for ignoring certain columns within the allocation export file. You must provide the internal column name and not the column name that would be displayed in the CSV.
		 * This user exit is called during the allocation export process in the finalization script.
		 * @returns {string[]|Lib.CA.Customization.Export.ExportAllocationsFields[]} An array of strings that represent column names which will be ignored in the allocation export file if they would otherwise exist.
		 * @example <caption>This example will ignore the FILE_DATE column. This is usually displayed as "File Date" in the CSV, but FILE_DATE is the internal column name and must be provided in the return value.</caption>
		 * IgnoreColumns: function()
		 * {
		 * 	var columnNames = [];
		 * 	columnNames.push("FILE_DATE");
		 * 	return columnNames;
		 * }
		 */
		/*IgnoreColumns: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.CustomAttribute
		 * @description
		 * Allows for populating custom attributes with a value. You should use a switch statement to return the right value based on attribute name.
		 * This user exit is called for each row of the allocation export process in the finalization script.
		 * @param {string|Lib.CA.Customization.Export.ExportAllocationsFields} attributeName The name of the attribute which we are getting the value of.
		 * @param {xTransport} transport The payment xTransport item. Use this to change values based on the values of the certain item.
		 * @param {xVars} [supiVars] if defined, supplier invoice record variables
		 * @param {Map.<string|Lib.CA.Customization.Export.ExportAllocationsFields,string>} allocationItem Current map of { attributeName: attributeValue }
		 * @param {Map.<string,string>} [item] if defined, item to customize invoice, G/L, and customer account adjustments. Keys of this object always start with 'Line_', for instance Col_account_number__ value will be accessible with 'item.Line_Col_account_number__'.
		 * @param {xVars} [deductionVars] if defined, record variables for a deduction associated with an adjustment
		 * @returns {string} The value for the attribute parameter
		 * @example <caption>This example will fill "The is a custom description" in all lines of the allocation CSV</caption>
		 * CustomAttribute: function(attributeName, transport, supiVars, allocationItem, item, deductionVars)
		 * {
		 * 	var result;
		 * 	switch (attributeName)
		 * 	{
		 * 		case "DESCRIPTION":
		 * 			result = "This is a custom description";
		 * 			break;
		 * 		default:
		 * 			break;
		 * 	}
		 * 	return result;
		 * }
		 * @example <caption>This example uses the transport item to fill in a custom column named "Custom Paid Amount" with the Paid_amount__ value from the object. Note that this column already exists by default. If it did not, this is how it would be used.</caption>
		 * CustomAttribute: function(attributeName, transport, supiVars, allocationItem, item, deductionVars)
		 * {
		 * 	var result;
		 * 	switch(attributeName)
		 * 	{
		 * 		case "Custom Paid Amount":
		 * 			var paymentVars = transport.GetUninheritedVars();
		 * 			result = paymentVars.GetValue_String("Paid_amount__", 0);
		 * 			break;
		 * 		default:
		 * 			break;
		 * 	}
		 * 	return result;
		 * }
		 * @example <caption>This example sets a G/L account for payments allocated to invoices, depending on payment method</caption>
		 * CustomAttribute: function(attributeName, transport, supiVars, allocationItem, item, deductionVars)
		 * {
		 * 	if (attributeName === "LEDGER_ACCOUNT_NUMBER" && allocationItem["ALLOCATION_TYPE"] === "document")
		 * 	{
		 * 		switch(allocationItem["PAYMENT_METHOD"])
		 * 		{
		 * 			case "ACH_CREDIT":
		 * 				return "123456";
		 * 			case "CHECK_PAID":
		 * 				return "9876543";
		 * 			default:
		 * 				break;
		 * 		}
		 * 	}
		 * }
		 * @example <caption>This example uses the deductionVars item to fill in custom columns for an associated deduction</caption>
		 * CustomAttribute: function(attributeName, transport, supiVars, allocationItem, item, deductionVars)
		 * {
		 * 	var result;
		 * 	if (deductionVars != null)
		 * 	{
		 * 		switch(attributeName)
		 * 		{
		 * 			case "DEDUCTION_NUMBER":
		 * 				result = deductionVars.GetValue_String("Document_number__", 0);
		 * 				break;
		 * 			case "DEDUCTION_TYPE":
		 * 				result = deductionVars.GetValue_String("Deduction_type__", 0);
		 * 				break;
		 * 			case "DEDUCTION_REASON":
		 * 				result = deductionVars.GetValue_String("Explanation__", 0);
		 * 				break;
		 * 			case "DEDUCTION_REFERED_TO_INVOICE":
		 * 				result = deductionVars.GetValue_String("Refered_to_invoice__", 0);
		 * 				break;
		 * 			default:
		 * 				break;
		 * 		}
		 * 	}
		 * 	return result;
		 * }
		 */
		/*CustomAttribute: function(attributeName, transport, supiVars, allocationItem, item, deductionVars)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.GetInvoiceRecordFields
		 * @description
		 * This user exit is called for the allocation export process in the finalization script. If a value is used in any CustomAttribute* user exit, it should be specified here.
		 * This user exit is not technically necessary, but if not implemented and any CustomAttribute* user exit is implemented, the query will grab all fields with "*", which takes roughly twice as long per invoice
		 * Even if no custom fields are necessary, returning an empty array will improve performance.
		 * @returns {string[]} Array of invoice field names
		 * @example <caption>This would add 2 new invoice fields so they could be referenced in CustomAttribute</caption>
		 * GetInvoiceRecordFields: function ()
		 * {
		 * 	var arrayAdditionalFields = ["Sales_Order_Number__", "Delivery_Order_Number__"];
		 * 	return arrayAdditionalFields;
		 * }
		 * @example <caption>This returns an attempt array to include no custom fields and improve performance</caption>
		 * GetInvoiceRecordFields: function ()
		 * {
		 * 	return [];
		 * }
		 */
		/*GetInvoiceRecordFields: function ()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.GetInvoiceTableFields
		 * @description
		 * This user exit is called for the allocation export process in the finalization script. If a column is added to the Invoices table, it needs to be added
		 * here so that it can be used in CustomAttribute. It still needs to be set in CustomAttribute. The value will have "Line_" as a prefix, followed by the field name. They can then be referenced
		 * like this "Line_z_NewInvTableCol1__".
		 * @returns {string[]} Array of column names
		 * @example <caption>This would add 2 new Invoice Table column names so they could be referenced in CustomAttribute</caption>
		 * GetInvoiceTableFields: function ()
		 * {
		 * 	var arrayAdditionalFields = ["Line_z_NewInvTableCol1__", "Line_z_NewInvTableCol2__"];
		 * 	return arrayAdditionalFields;
		 * }
		 */
		/*GetInvoiceTableFields: function ()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.GetGlTableFields
		 * @description
		 * This user exit is called for the allocation export process in the finalization script. If a column is added to the GL table, it needs to be added
		 * here so that it can be used in CustomAttribute. It still needs to be set in CustomAttribute. The value will have "Line_" as a prefix, followed by the field name. They can then be referenced
		 * like this "Line_z_NewGLTableCol1__".
		 * @returns {string[]} Array of column names
		 * @example <caption>This would add 2 new GL Table column names so they could be referenced in CustomAttribute</caption>
		 * GetGlTableFields: function ()
		 * {
		 * 	var arrayAdditionalFields = ["Line_z_NewGLTableCol1__", "Line_z_NewGLTableCol2__"];
		 * 	return arrayAdditionalFields;
		 * }
		 */
		/*GetGlTableFields: function ()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.GetCustomerTableFields
		 * @description
		 * This user exit is called for the allocation export process in the finalization script. If a column is added to the Allocate to customer table, it needs to be added
		 * here so that it can be used in CustomAttribute. It still needs to be set in CustomAttribute. The value will have "Line_" as a prefix, followed by the field name. They can then be referenced
		 * like this "Line_z_NewCustTableCol1__".
		 * @returns {string[]} Array of column names
		 * @example <caption>This would add 2 new Customer Table column names so they could be referenced in CustomAttribute</caption>
		 * GetCustomerTableFields: function ()
		 * {
		 * 	var arrayAdditionalFields = ["Line_z_NewCustTableCol1__", "Line_z_NewCustTableCol2__"];
		 * 	return arrayAdditionalFields;
		 * }
		 */
		/*GetCustomerTableFields: function ()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.CustomAttributePortalPayment
		 * @description
		 * Allows for populating custom attributes of portal payments with a value. You should use a switch statement to return the right value based on attribute name.
		 * This user exit is called for each invoice row of each portal payment of the allocation export process in the finalization script.
		 * @param {string|Lib.CA.Customization.Export.ExportAllocationsFields} attributeName The name of the attribute which we are getting the value of.
		 * @param {xTransport} transport The payment xTransport item. Use this to change values based on the values of the certain item.
		 * @param {xFormData} formData object containing fields available on the payment form
		 * @param {xVars} supiVars supplier invoice record variables
		 * @param {Map.<string|Lib.CA.Customization.Export.ExportAllocationsFields,string>} allocationItem Current map of { attributeName: attributeValue }
		 * @param {item} item Corresponding invoice item within the InvoiceList__ table
		 * @returns {string} The value for the attribute parameter
		 * @example <caption>This example will add the Paid By name from the form, an underpayment comment from the invoice line, and the purchase order date from the invoice supiVars</caption>
		 * CustomAttributePortalPayment: function(attributeName, transport, formData, supiVars, allocationItem, item)
		 * {
		 * 	var result;
		 * 	switch (attributeName)
		 * 	{
		 * 		case "PAID_BY":
		 * 			result = formData.GetValue("Paid_by__");
		 * 			break;
		 * 		case "SHORT_PAY_REASON":
		 * 			result = item.GetValue("Invoice_payment_comment__");
		 * 			break;
		 * 		case "PURCHASE_ORDER_DATE":
		 * 			result = Sys.Helpers.Date.Format(supiVars.GetValue_Date("Purchase_order_date__", 0), "mm/dd/yyyy");
		 * 			break;
		 * 		default:
		 * 			break;
		 * 	}
		 * 	return result;
		 * }
		 */
		/*CustomAttributePortalPayment: function(attributeName, transport, formData, supiVars, allocationItem, item)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.GetCsvSeparator
		 * @description
		 * Allows specifying a custom delimiter when exporting to CSV. The default delimiter is a comma
		 * @returns {string} The delimiter to use when exporting to CSV
		 * @example <caption>This example delimits data with a pipe</caption>
		 * GetCsvSeparator: function()
		 * {
		 * 	return "|";
		 * }
		 */
		/*GetCsvSeparator: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.ExportAllocationsToCustomFile
		 * @description
		 * Allows for exporting the payments allocations to a custom file format.
		 * This user exit is called at the beginning of the allocations export process in the finalization script.
		 * @returns {boolean} True to bypass the default CSV format, else false.
		 */
		/*ExportAllocationsToCustomFile: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.GetExtension
		 * @description
		 * Allows for setting the output file extension.
		 * This user exit is called during the allocations export process in the finalization script.
		 * @returns {string} Output file extension
		 * @example <caption>This example exports allocations to an xml file</caption>
		 * GetExtension: function()
		 * {
		 * 	return "xml";
		 * }
		 */
		/*GetExtension: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.GetEncoding
		 * @description
		 * Allows for setting the output file encoding. See TemporaryFile.CreateFile processing scripts API documentation for available values.
		 * This user exit is called during the allocations export process in the finalization script.
		 * @returns {string} String value containing the encoding to use for the file to create.
		 * @example <caption>This examples customizes the encoding to utf8-without-bom</caption>
		 * GetEncoding: function()
		 * {
		 * 	return "utf8-without-bom";
		 * }
		 */
		/*GetEncoding: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.GetFileName
		 * @description
		 * Allows for setting the output file name (without extension).
		 * This user exit is called during the allocations export process in the finalization script.
		 * @param {string} defaultFileName The Default Export File name "payments" + timestamp of when it was created.
		 * @returns {string} The output file name to use
		 * @example <caption>This example adds the current EOD account name to the default file name.</caption>
		 * GetFileName: function(defaultFileName)
		 * {
		 * 	return defaultFileName + "-" + Data.GetValue("FromCompany");
		 * }
		 */
		/*GetFileName: function(defaultFileName)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.GetCustomPaymentFilter
		 * @description
		 * Allows for customizing the filter used to determine which Cash App payments should be exported
		 * @param {string} filter The default filter
		 * @param {string} currentSubmittedDateTime The current time this export process was submitted at
		 * @param {string} lastExportDateTime The last export time retrieved from the database, or the return value of other user exit GetLastExportTime
		 * @param {string} companyCode The company code set for this export
		 * @returns {string} the customized filter to use instead
		 * @example <caption>This example provides the default logic used to build the filter for simpler customization</caption>
		 * GetCustomPaymentFilter: function(filter, currentSubmittedDateTime, lastExportDateTime, companyCode)
		 * {
		 * 	var ldap = Sys.Helpers.LdapUtil;
		 * 	var filterAttributes = [
		 * 		ldap.FilterEqual("State", "100"),
		 * 		ldap.FilterEqual("Status_Alloc__", "FULLY_ALLOCATED"),
		 * 		ldap.FilterEqual("Deleted", "0"),
		 * 		ldap.FilterRaw(Lib.CA.QueryHelper.Common.GetCompanyCodeFilter(companyCode, undefined, true)),
		 * 		ldap.FilterLesserOrEqual("CompletionDateTime", currentSubmittedDateTime),
		 * 		ldap.FilterNotEqual("Post_Allocation_to_SAP__", "1")
		 * 	];
		 * 	var recycleFilterAttributes = [
		 * 		ldap.FilterOr(
		 * 			ldap.FilterEqual("State", "70"),
		 * 			ldap.FilterEqual("State", "50")
		 * 		),
		 * 		ldap.FilterNotEqual("Status_Alloc__", "IN_ERROR"),
		 * 		ldap.FilterNotEqual("Status_Alloc__", "REJECTED"),
		 * 		ldap.FilterEqual("Deleted", "0"),
		 * 		ldap.FilterRaw(Lib.CA.QueryHelper.Common.GetCompanyCodeFilter(companyCode, undefined, true)),
		 * 		ldap.FilterExist("Recycled_datetime__"),
		 * 		ldap.FilterLesserOrEqual("Recycled_datetime__", currentSubmittedDateTime),
		 * 		ldap.FilterNotEqual("Post_Allocation_to_SAP__", "1")
		 * 	];
		 * 	if (lastExportDateTime)
		 * 	{
		 * 		// Differential export: get only allocations modified since last export
		 * 		filterAttributes.push(ldap.FilterStrictlyGreater("CompletionDateTime", lastExportDateTime));
		 * 		recycleFilterAttributes.push(ldap.FilterStrictlyGreater("Recycled_datetime__", lastExportDateTime));
		 * 	}
		 * 	filter = ldap.FilterOr(ldap.FilterAnd.apply(ldap, filterAttributes), ldap.FilterAnd.apply(ldap, recycleFilterAttributes)).toString();
		 * 	return filter;
		 * }
		 */
		/*GetCustomPaymentFilter: function(filter, currentSubmittedDateTime, lastExportDateTime, companyCode)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.GetCustomPortalPaymentFilter
		 * @description
		 * Allows for customizing the filter used to determine which Portal payments should be exported
		 * @param {string} filter The default filter
		 * @param {string} currentSubmittedDateTime The current time this export process was submitted at
		 * @param {string} lastExportDateTime The last export time retrieved from the database, or the return value of other user exit GetLastExportTime
		 * @returns {string} the customized filter to use instead
		 * @example <caption>This example provides the default logic used to build the filter for simpler customization</caption>
		 * GetCustomPortalPaymentFilter: function(filter, currentSubmittedDateTime, lastExportDateTime)
		 * {
		 * 	// The finalized date is set based on EOD processing times, but the
		 * 	// batched or settlement date could be set to earlier than the last
		 * 	// process time. Therefore, we set the earliest date based on a buffer.
		 * 	var minDate = new Date(Data.GetValue("SubmitDateTime"));
		 * 	minDate.setDate(minDate.getDate() - 2); // 2 days in the past
		 * 	var earliestDateForExport = Sys.Helpers.Date.Date2DBDate(minDate);
		 * 	// Include a filter on whether the payment was exported when searching by
		 * 	// batched or settled date, because the date limits can overlap for the same export type.
		 * 	var alreadyExportedFilter = Sys.Helpers.LdapUtil.FilterOr(
		 * 		Sys.Helpers.LdapUtil.FilterNot(
		 * 			Sys.Helpers.LdapUtil.FilterEqual("Exported_ruidex__", "*")
		 * 		),
		 * 		Sys.Helpers.LdapUtil.FilterEqual("Exported_ruidex__", "")
		 * 	);
		 * 	var newFilter = Sys.Helpers.LdapUtil.FilterAnd(
		 * 		Sys.Helpers.LdapUtil.FilterAnd(
		 * 			Sys.Helpers.LdapUtil.FilterEqual("State", "100"),
		 * 			Sys.Helpers.LdapUtil.FilterEqual("Deleted", "0"),
		 * 			Sys.Helpers.LdapUtil.FilterEqual("Payment_status__", "PAID"),
		 * 			Sys.Helpers.LdapUtil.FilterOr(
		 * 				Sys.Helpers.LdapUtil.FilterNot(
		 * 					Sys.Helpers.LdapUtil.FilterEqual("Document_ERP_ID__", "*")
		 * 				),
		 * 				Sys.Helpers.LdapUtil.FilterEqual("Document_ERP_ID__", "")
		 * 			)
		 * 			// Use GetShouldExportIncludePortalPaymentWithCompanyCode exit to filter on company code
		 * 		),
		 * 		Sys.Helpers.LdapUtil.FilterOr(
		 * 			Sys.Helpers.LdapUtil.FilterAnd(
		 * 				Sys.Helpers.LdapUtil.FilterEqualOrEmpty("Export_trigger__", Sys.AR.Payment.Configuration.ExportTrigger.FINALIZED),
		 * 				Sys.Helpers.LdapUtil.FilterLesserOrEqual("Payment_finalized_date__", currentSubmittedDateTime),
		 * 				Sys.Helpers.LdapUtil.FilterStrictlyGreater("Payment_finalized_date__", lastExportDateTime)
		 * 			),
		 * 			Sys.Helpers.LdapUtil.FilterAnd(
		 * 				Sys.Helpers.LdapUtil.FilterEqual("Export_trigger__", Sys.AR.Payment.Configuration.ExportTrigger.BATCHED),
		 * 				Sys.Helpers.LdapUtil.FilterLesserOrEqual("Payment_date__", currentSubmittedDateTime),
		 * 				Sys.Helpers.LdapUtil.FilterStrictlyGreater("Payment_date__", earliestDateForExport),
		 * 				alreadyExportedFilter
		 * 			),
		 * 			Sys.Helpers.LdapUtil.FilterAnd(
		 * 				Sys.Helpers.LdapUtil.FilterEqual("Export_trigger__", Sys.AR.Payment.Configuration.ExportTrigger.SETTLED),
		 * 				Sys.Helpers.LdapUtil.FilterLesserOrEqual("Payment_settlement_date__", currentSubmittedDateTime),
		 * 				Sys.Helpers.LdapUtil.FilterStrictlyGreater("Payment_settlement_date__", earliestDateForExport),
		 * 				alreadyExportedFilter
		 * 			)
		 * 		)
		 * 	);
		 * 	return newFilter.toString();
		 * }
		 */
		/*GetCustomPortalPaymentFilter: function(filter, currentSubmittedDateTime, lastExportDateTime)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.GetShouldExportIncludePortalPaymentWithCompanyCode
		 * @description
		 * Allows for customizing which company codes' portal payments should be included in this export. By default, only the company code for this export process is allowed
		 * @param {string} processCompanyCode The company code set for this export
		 * @param {string} paymentCompanyCode A single payment's company code
		 * @returns {boolean} True if this payment should be included, false otherwise
		 * @example <caption>This example allows payments that match the export process's company code, or payments in A02 if the process company code is A01</caption>
		 * GetShouldExportIncludePortalPaymentWithCompanyCode: function(processCompanyCode, paymentCompanyCode)
		 * {
		 * 	if (processCompanyCode == paymentCompanyCode)
		 * 	{
		 * 		return true;
		 * 	}
		 * 	if (processCompanyCode == "A01" && paymentCompanyCode == "A02")
		 * 	{
		 * 		return true;
		 * 	}
		 * 	return false;
		 * }
		 */
		/*GetShouldExportIncludePortalPaymentWithCompanyCode: function(companyCode)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.GetLastExportTime
		 * @description
		 * Allows for setting the last export time that's used to determine the earliest payment to export.
		 * This user exit is called near the beginning of the allocation export process in the finalization script.
		 * @param {string} defaultLastExportTime The last export time retrieved from the database
		 * @returns {string} date after which to retrieve payments to export, formatted per the helper function Sys.Helpers.Date.Date2DBDateTime();
		 * @example <caption>This example sets the last export time to one week ago, if no previous exports were found.</caption>
		 * GetLastExportTime: function(defaultLastExportTime)
		 * {
		 * 	if (!defaultLastExportTime)
		 * 	{
		 * 		var d = new Date();
		 * 		d.setDate(d.getDate() - 7);
		 * 		return Sys.Helpers.Date.Date2DBDateTime(d);
		 * 	}
		 * 	return defaultLastExportTime;
		 * }
		 */
		/*GetLastExportTime: function(defaultLastExportTime)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.InitializeAllocationsExportToFile
		 * @description
		 * Allows for initializing the output file generation.
		 * This user exit is called at the beginning the allocations export process in the finalization script.
		 * @param {File} [tempFile] Temporary file to be attached
		 * @example <caption>This example builds the XML file header</caption>
		 * // Remark: an 'xml' variable must be declared outside of this function.
		 * InitializeAllocationsExportToFile: function(tempFile)
		 * {
		 * 	xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n";
		 * 	xml += "<allocations>";
		 * }
		 */
		/*InitializeAllocationsExportToFile: function(tempFile)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.ExportAllocationToFile
		 * @description
		 * Allows for appending an allocation to the output file.
		 * This user exit is called during the allocations export process in the finalization script.
		 * @param {Map.<Lib.CA.Customization.Export.ExportAllocationsFields,string>} data Allocations to be exported.
		 * @param {File} [tempFile] Temporary file to be attached
		 * @example <caption>This example builds appends a new XML node to current XML using allocation data.</caption>
		 * // Remark: an 'xml' variable must be declared outside of this function.
		 * ExportAllocationToFile: function(data, tempFile)
		 * {
		 * 	xml += "<allocation>";
		 * 	for (var key in data)
		 * 	{
		 * 		if (data.hasOwnProperty(key))
		 * 		{
		 * 			var element = data[key] || "";
		 * 			xml += "<" + key + ">" + element + "</" + key + ">";
		 * 		}
		 * 	}
		 * 	xml += "</allocation>";
		 * }
		 */
		/*ExportAllocationToFile: function(data, tempFile)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.FinalizeAllocationsExportToFile
		 * @description
		 * Allows for finalizing the output file generation.
		 * This user exit is called at the end of the allocations export process in the finalization script.
		 * @param {File} [tempFile] Temporary file to be attached
		 * @returns {File} (Optional) If you return a file it acts as an override
		 * @example <caption>This example closes the XML and attaches the XML content to the provided temporary file.</caption>
		 * // Remark: an 'xml' variable must be declared outside of this function.
		 * FinalizeAllocationsExportToFile: function(tempFile)
		 * {
		 * 	xml += "</allocations>";
		 * 	TemporaryFile.Append(tempFile, xml);
		 * }
		 */
		/*FinalizeAllocationsExportToFile: function(tempFile)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.InitializeAllocationsExportValidation
		 * @description
		 * Allows for initializing the allocations export process validation.
		 * This user exit is called before the allocations export process validation script.
		 */
		/*InitializeAllocationsExportValidation: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.FinalizeAllocationsExportValidation
		 * @description
		 * Allows for finalizing the allocations export process validation.
		 * This user exit is called before the allocations export process at the end of the validation script.
		 * @example <caption>This example changes the number of attempted tries and the time to wait between failures.</caption>
		 * FinalizeAllocationsExportValidation: function()
		 * {
		 * 	// Allow 5 attempts to export allocations if an error is thrown and wait 5 minutes between each attempt
		 * 	Data.SetValue("MaxRetry", 5); // 5 tries total
		 * 	Data.SetValue("RetryIntervalDuration", "300"); // 5 minutes between each attempt
		 * }
		 */
		/*FinalizeAllocationsExportValidation: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.InitializeAllocationsExportProcess
		 * @description
		 * Allows for initializing the allocations export process.
		 * This user exit is called at the beginning of the allocations export process finalization script.
		 * @example <caption>This example forwards the process to an admin owner when there is no company code set. Remark: If a company code is set, the process will later be forwarded to the company's configured group.</caption>
		 * InitializeAllocationsExportProcess: function()
		 * {
		 * 	var reportParameterString = Variable.GetValueAsString("reportParameter") || Data.GetValue("PushedDataType__");
		 * 	var reportParameter = Lib.CA.Export.ReportParameter.FromJSON(reportParameterString);
		 * 	if (!reportParameter.companyCode && !Data.GetValue("Company_code__"))
		 * 	{
		 * 		// No company code is available to define an owner of the process, so forward the process to an admin owner
		 * 		var adminEmail = "adminownername@esker.corp";
		 * 		Log.Info("Forwarding process to '" + adminEmail + "'...");
		 * 		if (!Process.Forward(adminEmail))
		 * 		{
		 * 			Log.Error("Failed to forward process to '" + adminEmail + "'");
		 * 		}
		 * 	}
		 * }
		 * @example <caption>This example Shows how to use Variables to control whether headers and lines get quotes added.</caption>
		 * InitializeAllocationsExportProcess: function()
		 * {
		 * 	Variable.SetValueAsString("quoteHeaderLine", "1"); //This makes The headers get quotes since the default is No
		 * 	Variable.SetValueAsString("quoteDataLines", "0"); //This makes the line values not get quotes, where they do by default
		 * }
		 */
		/*InitializeAllocationsExportProcess: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.FinalizeAllocationsExportProcess
		 * @description
		 * Allows for finalizing the allocations export process.
		 * This user exit is called after the allocations export process at the end of the finalization script.
		 * @example <caption>This example starts a simple process called "Custom Export to ERP". Remark: the example process "Custom Export to ERP" would have been created previously, and the Variable "XMLContentVar" would have been set in the FinalizeAllocationsExportToFile user exit.</caption>
		 * FinalizeAllocationsExportProcess: function()
		 * {
		 * 	var transport = Process.CreateProcessInstance("Custom Export to ERP", true);
		 * 	var vars = transport.GetExternalVars();
		 * 	vars.AddValue_String("XMLContent", Variable.GetValueAsString("XMLContentVar"), true);
		 * 	transport.Process();
		 * }
		 */
		/*FinalizeAllocationsExportProcess: function()
		{
		},*/

		/**
		 * Definition of NotificationEmail
		 * See {@link http://doc.esker.com/eskerondemand/cv_ly/en/manager/startpage.htm#common/references/fields/mailprintable.html Email variables} for more information
		 * @interface Lib.CA.Customization.Export.NotificationEmail
		 * @prop {string} ID ToName
		 * @prop {string} email EmailAddress
		 * @prop {string} cc CcEmailAddress
		 * @prop {string} toCompany ToCompany
		 * @prop {string} language Email template language
		 * @prop {string} culture Email template culture
		 * @prop {string} formUrl Current process URL
		 * @prop {string} transportIdentifier Identifier
		 * @prop {string} fromEmail FromAddress
		 * @prop {string} fromName FromName
		 * @prop {string} fromCompany FromCompany
		 * @prop {string} subject Subject
		 */

		/**
		 * @method Lib.CA.Customization.Export.CustomizeEmailNotification
		 * @description
		 * Allows customization of the email notification attributes used when an allocation export file cannot be generated due to an error
		 * @param {Lib.CA.Customization.Export.NotificationEmail} emailData The default email notification attributes
		 * @example <caption>This example adds the toCompany name to the email's subject</caption>
		 * CustomizeEmailNotification: function(emailData)
		 * {
		 * 	emailData.subject += emailData.toCompany;
		 * }
		 */
		/*CustomizeEmailNotification: function (emailData)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.CustomizeExportFolder
		 * @description
		 * Allows for customization of the SFTP folder for Cash Application Exports.
		 * @param {string} folderNameFromConfig The folder name retrieved from querying the configuration
		 * @example <caption>This example sets different export folders for each different company code in the case where each company code goes to a different ERP, adding the company code as a suffix</caption>
		 * CustomizeExportFolder: function(folderNameFromConfig)
		 * {
		 * 	var folderName = folderNameFromConfig;
		 * 	var companyCode = Data.GetValue("Company_code__") ? Data.GetValue("Company_code__") : null;
		 * 	if (companyCode)
		 * 	{
		 * 		folderName = folderName + companyCode;
		 * 	}
		 *	return folderName;
		 * }
		 */
		/* CustomizeExportFolder: function (folderNameFromConfig)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.FinalizeAllocationsFound
		 * @description
		 * Allows for finalizing the allocations found by the export process for each cash app payment.
		 * This user exit is called after the allocations are found for each payment, but before the CSV file is created.
		 * You should consider all other settings and reportParameters before trying to manually manipulate the allocations.
		 * A possible use case may be to use a discount to change the invoice lines.
		 * @param {xTransport} paymentTransport The payment transport
		 * @param {xVars} paymentVars Vars of the payment transport
		 * @param {Array<Map.<string|Lib.CA.Customization.Export.ExportAllocationsFields,string>>} invoiceAllocations Invoice allocations found
		 * @param {Array<Map.<string|Lib.CA.Customization.Export.ExportAllocationsFields,string>>} ledgerAllocations Ledger allocations found
		 * @param {Array<Map.<string|Lib.CA.Customization.Export.ExportAllocationsFields,string>>} customerAllocations Customer allocations found
		 */
		/*FinalizeAllocationsFound: function(paymentTransport, paymentVars, invoiceAllocations, ledgerAllocations, customerAllocations)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.FinalizeVerifiedAdjustmentAllocations
		 * @since 331
		 * @description
		 * Allows for finalizing the allocations found by the export process of verified withholding adjustments for each payment.
		 * This user exit is called after the allocations are found for each payment, but before the CSV file is created.
		 * You should consider all other settings and reportParameters before trying to manually manipulate the allocations.
		 * A possible use case may be to use a discount to change the invoice lines.
		 * @param {xTransport} paymentTransport The payment transport
		 * @param {xVars} paymentVars Vars of the payment transport
		 * @param {Array<Map.<string|Lib.CA.Customization.Export.ExportAllocationsFields,string>>} invoiceAllocations Invoice allocations found
		 * @param {Array<Map.<string|Lib.CA.Customization.Export.ExportAllocationsFields,string>>} ledgerAllocations Ledger allocations found
		 */
		/*FinalizeVerifiedAdjustmentAllocations: function(paymentTransport, paymentVars, invoiceAllocations, ledgerAllocations)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.FinalizePortalPaymentAllocations
		 * @since 331
		 * @description
		 * Allows for finalizing the allocations found by the export process for each portal payment.
		 * This user exit is called after the allocations are found for each payment, but before the CSV file is created.
		 * You should consider all other settings and reportParameters before trying to manually manipulate the allocations.
		 * A possible use case may be to use a discount to change the invoice lines.
		 * @param {xTransport} paymentTransport The payment transport
		 * @param {xVars} paymentVars Vars of the payment transport
		 * @param {Array<Map.<string|Lib.CA.Customization.Export.ExportAllocationsFields,string>>} invoiceAllocations Invoice allocations found
		 */
		/*FinalizePortalPaymentAllocations: function(paymentTransport, paymentVars, invoiceAllocations)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Export.CustomizeAdditionalExportSettings
		 * @description
		 * See example below for some additional export settings that can be configured here.
		 * The properties should generally be done with fields and Process Variable, but could be additionally helpful.
		 * @param {Object} settings See below for the list and default values
		 * @param {Object} properties Generally you should use report parameter Process Variable and such instead of the core export logic here.
		 * @returns {Object} the modified settings
		 * @example <caption>This example are the defaults, so just modify the ones you need to the desired values.</caption>
		 * CustomizeAdditionalExportSettings: function (settings, properties)
		 * {
		 * 	settings.timeoutBase = 600; //10 minutes base time for export process
		 * 	settings.timeoutPer250 = 15; //additional 15 seconds per increment of 250 invoices
		 * 	settings.includeReversals = true; //include reversal customer adjustment line for reversals
		 * 	settings.includeCustomerIdDiscounts = false; //Don't add customer identifier to discount lines from invoices
		 * 	return settings;
		 * }
		 */
		/*CustomizeAdditionalExportSettings: function(settings, properties)
		{
		},*/
	};

	return Export;
})();