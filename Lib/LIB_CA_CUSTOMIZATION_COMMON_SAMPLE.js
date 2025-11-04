/* LIB_DEFINITION{
  "name": "LIB_CA_CUSTOMIZATION_COMMON_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "COMMON",
  "versionable": false,
  "comment": "PS configurations that can be used in all scripts",
  "require": []
}*/

/**
 * This module contains functions allowing to
 * - customize tooltip information on remittances
 * - customize filters on remittances
 * - map custom fields from an invoice to custom fields on the payment allocation form
 * @namespace Lib.CA.Customization.Common
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.Customization = Lib.CA.Customization || {};

Lib.CA.Customization.Common = (function ()
{
	/**
	 * @lends Lib.CA.Customization.Common
	 */
	var Common =
	{
		/**
		 * Definition of Lib.CA.Customization.Common.DefaultAdjustmentSetting
		 * @interface Lib.CA.Customization.Common.DefaultAdjustmentSetting
		 * @prop {string} glAccount
		 * @prop {string} costCenter
		 * @prop {string} profitCenter
		 * @prop {string} taxCode
		 * @prop {string} reasonCode
		 * @prop {string} withholdingAmount
		 */

		/**
		 * Definition of Lib.CA.Customization.Common.LedgerAccountAllocation
		 * @interface Lib.CA.Customization.Common.LedgerAccountAllocation
		 * @prop {string} Number The G/L account number
		 * @prop {number} Amount The amount of the adjustment
		 * @prop {string} Description The description describing the adjustment
		 * @prop {string} DeductionNumber number for an associated deduction
		 * @prop {string} DeductionRuidex ruidex for an associated deduction
		 * @prop {string} CustomerID the associated customer
		 * @prop {string} CostCenter the associated cost center
		 * @prop {string} ProfitCenter the associated profit center
		 * @prop {string} TaxCode the associated tax code
		 * @prop {string} ReasonCode the associated reason code
		 * @prop {string} DestinationCompanyCode For intercompany payments, company code associated with an intercompany invoice
		 * @prop {bool} PreventsAutoAllocation set to true if this adjustment should prevent the payment from being automatically allocated
		*/

		/**
		 * Definition of Lib.CA.Customization.Common.CustomerAccountAllocation
		 * @interface Lib.CA.Customization.Common.CustomerAccountAllocation
		 * @prop {string} Number Customer
		 * @prop {number} Amount The amount of the adjustment
		 * @prop {string} DocumentNumber Document Number
		 * @prop {string} Description The description describing the adjustment
		 * @prop {string} DeductionNumber number for an associated deduction
		 * @prop {string} DeductionRuidex ruidex for an associated deduction
		 * @prop {string} CustomerID the associated customer
		 * @prop {string} DestinationCompanyCode For intercompany payments
		 * @prop {string} TaxCode the associated tax code
		 * @prop {string} ReasonCode the associated reason code
		 * @prop {boolean} PreventsAutoAllocation set to true if this adjustment should prevent the payment from being automatically allocated
		*/

		/**
		 * Definition of BrowseColumn object
		 * @interface Lib.CA.Customization.Common.BrowseColumn
		 * @prop {string} id Database field to query.
		 * @prop {string} label Column header label.
		 * @prop {string} type Column data type. Possible values: "Date", "Decimal", "Text", "CheckBox", "Integer", "MultiLine", "Link", "Description"
		 * @prop {number} width	Column width
		 * @prop {string} [orderBy] Possible values: "ASC" or "DESC"
		 */

		/**
		 * @method Lib.CA.Customization.Common.CustomTooltipInformationOnRemittance
		 * @description
		 * Function called during remittance advices custom script initialization to query the desired information that we want to store in the Tooltip for
		 * each document. The additional attributes listed in this function will be displayed in the tooltip with the following default attributes:
		 *
		 * For Invoices:
		 * - "Customer_ID__", "Customer_name__", "Discount_amount__", "Discount_outstanding_amount__", "Invoice_currency__", "Invoice_date__",
		 * 	"Invoice_due_date__", "Invoice_number__", "Invoice_outstanding_amount__", "Invoice_total_amount__"
		 *
		 * For Deductions:
		 * - "Customer_ID__", "Customer_name__", "Currency__", "Document_date__", "Document_number__"
		 * @param {string} documentType type of document (currently possible values : "INVOICE_TYPE" or "DEDUCTION_TYPE")
		 * @return {object[]} the customized tooltip information that will be stored inside the metadata column
		 * @example
		 * CustomTooltipInformationOnRemittance: function(documentType)
		 * {
		 * 	if (documentType === "INVOICE_TYPE")
		 * 	{
		 * 		return [{Name: "Discount_date__", Label: "Discount date"},
		 * 			{Name: "Invoice_taxes_amount__", Label: "Invoice taxes amount"},
		 * 			{Name: "Customer_email__", Label: "Customer email"},
		 * 			{Name: "Purchase_order_date__", Label: "Purchase order date"},
		 * 			{Name: "Contact_Email__", Label: "Contact Email"}];
		 * 	}
		 * 	else if(documentType === "DEDUCTION_TYPE")
		 * 	{
		 * 		return [{Name: "Deduction_type__", Label: "Deduction type"},
		 * 			{Name: "Refered_to_invoice__", Label: "Refered to invoice"}];
		 * 	}
		 * }
		 */
		/*CustomTooltipInformationOnRemittance: function(documentType)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Common.CustomTooltipInformationRemittanceOnInvoice
		 * @description
		 * Function called during invoice custom script initialization to query the desired information that we want to store in the Tooltip for
		 * remittance computed payment date. The additional attributes listed in this function will be displayed in the tooltip with the following default attributes:
		 * - "Document_number__", "Check_number__", "Customer_name__", "Payment_date__", "Total_amount__", "Currency__", "RuidEx"
		 * @return {object[]} the customized tooltip information that will be stored inside the global variable RemittanceTooltipInformation
		 * @example
		 * CustomTooltipInformationRemittanceOnInvoice: function()
		 * {
		 * 	return [{Name: "Company_code__", Label: "Company code"},
		 * 		{Name: "Lockbox__", Label: "Lockbox ID"}
		 * }
		 */
		/*CustomTooltipInformationRemittanceOnInvoice: function ()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Common.CustomTooltipInformationRemittanceOnDeduction
		 * @description
		 * Function called during deductions custom script initialization to query the desired information that we want to store in the Tooltip for
		 * remittance. The additional attributes listed in this function will be displayed in the tooltip with the following default attributes:
		 * - "Document_number__", "Check_number__", "Customer_name__", "Payment_date__", "Total_amount__", "Currency__", "RuidEx"
		 * @return {object[]} the customized tooltip information that will be stored inside the global variable RemittanceTooltipInformation
		 * @example
		 * CustomTooltipInformationRemittanceOnDeduction: function()
		 * {
		 * 	return [{Name: "Company_code__", Label: "Company code"},
		 * 		{Name: "Lockbox__", Label: "Lockbox ID"}
		 * }
		 */
		/*CustomTooltipInformationRemittanceOnDeduction: function ()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Common.CustomizeSearchedInvoiceFilter
		 * @description
		 * Function called to customize filter for search invoice in the remittance advice scripts (custom script and extraction script).
		 * You can change the provided filter to customize remittance behavior.
		 * Make sure to keep consistent logic between this and {@Link Lib.CA.Customization.Common.CustomizeSearchedInvoiceByBatchFilter}, if implemented.
		 * Note that implementing this function (without implementing CustomizeSearchedInvoiceByBatchFilter) will not allow you to validate invoices in batches, and may impact performance on large remittances.
		 * @param {string} defaultFilter Filter used by default to search invoice.
		 * @param {string} searchTerm value from searchCriteria_documentNumber__ (Only available from CustomScript)
		 * @param {Lib.CA.Customization.Common.BrowseColumn[]} columnSettings display columns (Only available from CustomScript)
		 * @returns {string} Filter to use to search invoice in remittance.
		 */
		/*CustomizeSearchedInvoiceFilter: function (defaultFilter, searchTerm, columnSettings)
		{
			var filter = defaultFilter;

			return filter;
		},*/

		/**
		 * @method Lib.CA.Customization.Common.CustomizeSearchedDeductionFilter
		 * @description
		 * Function called to customize filter for search deduction in the remittance advice scripts (custom script and extraction script).
		 * You can change the provided filter to customize remittance behavior.
		 * Make sure to keep consistent logic between this and {@Link Lib.CA.Customization.Common.CustomizeSearchedDeductionByBatchFilter}, if implemented.
		 * Note that implementing this function (without implementing CustomizeSearchedDeductionByBatchFilter) will not allow you to validate deductions in batches, and may impact performance on large remittances.
		 * @param {string} defaultFilter Filter used by default to search deduction.
		 * @param {string} searchTerm value from searchCriteria_documentNumber__ (Only available from CustomScript)
		 * @param {Lib.CA.Customization.Common.BrowseColumn[]} columnSettings display columns (Only available from CustomScript)
		 * @returns {string} Filter to use to search deduction in remittance.
		 */
		/*CustomizeSearchedDeductionFilter: function (defaultFilter, searchTerm, columnSettings)
		{
			var filter = defaultFilter;

			return filter;
		},*/

		/**
		 * Definition of the RemittanceItem class.
		 * @interface Lib.CA.Remittance.Common.RemittanceItem
		 * @prop {string} DocumentNumber Document ID for this remittance item.
		 * Specified from the 'Col_document_number__' or 'Col_invoice_number__' field on the 'Table_invoice_lines__' table.
		 * @prop {Date} DocumentDate Document date for this remittance item.
		 * Specified from the 'Col_invoice_date__' field on the 'Table_invoice_lines__' table.
		 * May be null if the option to ignore invoice date compliance ('Ignore_invoice_date_compliance__') is selected for this remittance advice.
		 * @prop {Lib.CA.Remittance.Common.RemittanceItemType} Type The type of document represented by this remittance item.
		 * @prop {Item} TableItem Item from the 'Table_invoice_lines__' table that this remittance item is associated with.
		 * @prop {number} Index Index in the 'Table_invoice_lines__' for this remittance item.
		 * @prop {Lib.CA.Remittance.Common.RemittanceMatchingItems} MatchingDocuments Previously-found/cached information from the database matching this remittance item.
		 */

		/**
		 * @method Lib.CA.Customization.Common.CustomizeSearchedInvoiceByBatchFilter
		 * @description
		 * Function called to customize the filter for searching invoices in the remittance advice validation script.
		 * This will be called before each query to find batches of invoices to match to the items populated in the remittance.
		 * Make sure to keep consistent logic between this and {@Link Lib.CA.Customization.Common.CustomizeSearchedInvoiceFilter}.
		 * @param {string} defaultFilter Filter used by default to search for the invoices.
		 * @param {Lib.CA.Remittance.Common.RemittanceItem[]} remittanceItems List of invoice remittance items that will be considered in this batch.
		 * @returns {string} Custom filter to use to search for the invoices.
		 */
		/*CustomizeSearchedInvoiceByBatchFilter: function (defaultFilter, remittanceItems)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Common.CustomizeSearchedDeductionByBatchFilter
		 * @description
		 * Function called to customize the filter for searching deductions in the remittance advice validation script.
		 * This will be called before each query to find batches of deductions to match to the items populated in the remittance.
		 * Make sure to keep consistent logic between this and {@Link Lib.CA.Customization.Common.CustomizeSearchedDeductionFilter}.
		 * @param {string} defaultFilter Filter used by default to search for the deductions.
		 * @param {Lib.CA.Remittance.Common.RemittanceItem[]} remittanceItems List of deduction remittance items that will be considered in this batch.
		 * @returns {string} Custom filter to use to search for the deductions.
		 */
		/*CustomizeSearchedDeductionByBatchFilter: function (defaultFilter, remittanceItems)
		{
		},*/

		/**
		 * Definition of Lib.CA.Payment.MatchingItems.CustomField
		 * @interface Lib.CA.Payment.MatchingItems.CustomField
		 * @prop {string} PaymentFieldName technical name on the payment matching form
		 * @prop {string} InvoiceFieldName technical name on the source record, either the invoice record or the remittance record.
		 * @prop {string} FieldType "number" for fields containing numbers or checkboxes/booleans, "date" for date fields, or "string" for text or other fields
		 * @prop {string | number | Date | boolean} Value
		 */

		/**
		 * @method Lib.CA.Customization.Common.CustomizeStoredInvoiceFields
		 * @description
		 * Function called to customize the invoice fields tracked/saved in payment allocation.
		 * These results are used to query invoices in AR and store this information in the payment allocation form's invoices table.
		 * This can be paired with the user exit {@link Lib.CA.CashApp.Customization.HTMLScripts.GetCustomTooltipColumnIdentifiers} in order to switch between showing the field in a column or the tooltip in the invoices table.
		 * This can also be paired with the user exit {@link Lib.CA.CashApp.Customization.HTMLScripts.CustomizeMultiCriteriaSearchFields} / {@link Lib.CA.CashApp.Customization.HTMLScripts.CustomizeTableSearchFields CustomizeTableSearchFields} in order to search in custom fields when looking for invoices.
		 * <b>IMPORTANT</b>: Any new field listed here requires a new column added to the layout for the invoices table of the payment allocation process.
		 * This does not support overriding existing fields that may be needed for calculations/logic.
		 * @returns {Lib.CA.Payment.MatchingItems.CustomField[]} List of extra custom invoice fields to track in the payment matching form.
		 * @example <caption>This example will track the existing "supplier country" invoice field as well as several possible varieties of custom-added invoice fields.</caption>
		 * CustomizeStoredInvoiceFields: function ()
		 * {
		 * 	var customFieldsToInclude =
		 * 		[
		 * 			{
		 * 				PaymentFieldName: "Col_supplier_country__",
		 * 				InvoiceFieldName: "Supplier_Country__",
		 * 				FieldType: "string"
		 * 			},
		 * 			{
		 * 				PaymentFieldName: "Z_Col_customer_status__",
		 * 				InvoiceFieldName: "Z_Customer_status__",
		 * 				FieldType: "string"
		 * 			},
		 * 			{
		 * 				PaymentFieldName: "Z_Col_is_available_checkbox__",
		 * 				InvoiceFieldName: "Z_Is_available_checkbox__",
		 * 				FieldType: "number"
		 * 			},
		 * 			{
		 * 				PaymentFieldName: "Z_Col_other_currency_amount__",
		 * 				InvoiceFieldName: "Z_Other_currency_amount__",
		 * 				FieldType: "number"
		 * 			},
		 * 			{
		 * 				PaymentFieldName: "Z_Col_custom_date__",
		 * 				InvoiceFieldName: "Z_custom_date__",
		 * 				FieldType: "date"
		 * 			}
		 * 		];
		 * 	return customFieldsToInclude;
		 * }
		 */
		/*CustomizeStoredInvoiceFields: function ()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Common.CustomizeStoredRemittanceFields
		 * @description
		 * Function called to customize fields from a remittance advice in order that they can be tracked/saved in payment allocation.
		 * These results are used to query a remittance advice in Cash Application and store this information in the payment allocation form's invoice and adjustment tables.
		 * Please note that fields from the remittance advice source must be prefixed with "Line_" due to technical aspects of the remittance form.
		 * The InvoiceFieldName field should contain the field name from the Remittance form.
		 * <b>IMPORTANT</b>: Any new field listed here requires a new column added to the layout of the payment allocation process.
		 * This does not support overriding existing fields that may be needed for calculations/logic.
		 * @returns {Lib.CA.Payment.MatchingItems.CustomField[]} List of extra custom remittance fields to track in the payment matching form.
		 * @example <caption>This example uses the custom field "Z_CustomRemitField__" from the remittance form to fill the custom field "Z_CustomInvoiceField__" if it's an invoice line
		 * and fills the appropriate default description field for an adjustment</caption>
		 * CustomizeStoredRemittanceFields: function ()
		 * {
		 * 	var customFieldsToInclude = [
		 *		{
		 *			InvoiceFieldName: "Line_Z_CustomRemitField__",
		 *			PaymentFieldName: "Z_CustomInvoiceField__",
		 *			FieldType: "string"
		 *		},
		 *		{
		 *			InvoiceFieldName: "Line_Z_CustomRemitField__",
		 *			PaymentFieldName: "Col_account_description__",
		 *			FieldType: "string"
		 *		},
		 *		{
		 *			InvoiceFieldName: "Line_Z_CustomRemitField__",
		 *			PaymentFieldName: "Account_description__",
		 *			FieldType: "string"
		 *		}
		 *	];
		 *	return customFieldsToInclude;
		 * }
		 */
		/*CustomizeStoredRemittanceFields: function ()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Common.CustomCompanyCodeFilter
		 * @description
		 * Function called to customize the company code filter for Cash Application processes. This can be used if tables/records from
		 * multiple company codes should all be accessible for a given company code. If this user exit returns null, the default company code filter
		 * will be applied. If this returns an empty string, no filter on company code will be applied.
		 * For invoices / deductions you likely want to configure the "CA - Cross Company Mapping__" table instead and return null here.
		 * @param {string} companyCode Company code of the current process
		 * @param {string} fieldName Specifies the company code field name on the item being queried
		 * @param {"InvoiceOrDeduction" | "OTHER"} context If this is being called for an Invoice/Deduction filter, or some other context
		 * @returns {string} Filter for company codes to include.
		 * @example <caption>This example will allow processes with company code A01 to access tables/records in company code A02, but not B01</caption>
		 * CustomCompanyCodeFilter: function(companyCode, fieldName, context)
		 * {
		 * 	if (context !== "InvoiceOrDeduction" && companyCode === "A01")
		 * 	{
		 * 		return "(|(".concat(fieldName, "=A01)(").concat(fieldName, "=A02)(").concat(fieldName, "=)(!(").concat(fieldName, "=*)))");
		 * 	}
		 * 	return null;
		 * }
		 * @example <caption>This example will allow processes without any company code defined to access tables/records across all company codes</caption>
		 * CustomCompanyCodeFilter: function(companyCode, fieldName, context)
		 * {
		 * 	if (!companyCode)
		 * 	{
		 * 		return "";
		 * 	}
		 * 	return null;
		 * }
		 */
		/*CustomCompanyCodeFilter: function (companyCode, fieldName)
		{
			return null;
		},*/

		/**
		 * @method Lib.CA.Customization.Common.InitializeZeroBalancePaymentForm
		 * @description
		 * Function called at the end of zero balance payment custom script initialization
		 */
		/*InitializeZeroBalancePaymentForm: function ()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Common.ApplyGLAdjustment
		 * @description If you set any custom items when creating a GL adjustment, you need to set them into ledgerItem from ledgerMatch here.
		 * Called when the allocation is applied.
		 * You may need to use this along with {@link Lib.CA.CashApp.Customization.Validation.CreateGLAdjustment}
		 * @param {Item} ledgerItem Set the ledger adjustment item data here for the payment
		 * @param {Lib.CA.Customization.Common.LedgerAccountAllocation} ledgerMatch Ledger adjustment allocation that will contain most of the data
		 * @param {string} defaultCustomerId First customer's id from the invoices table
		 * @example <caption>This example will set a custom item from the custom property when allocation is applied.</caption>
		 * ApplyGLAdjustment: function(ledgerItem, ledgerMatch, defaultCustomerId)
		 * {
		 * 	ledgerItem.SetValue("Z_Custom_Column__", ledgerMatch.Z_Custom_1);
		 * }
		 */
		/*ApplyGLAdjustment: function (ledgerItem, ledgerMatch, defaultCustomerId)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Common.ApplyCustomerAdjustment
		 * @description If you set any custom items when creating a Customer adjustment, you need to set them into customerItem from customerMatch here.
		 * Called when the allocation is applied, or with recycledAdjustment for recycle without a suggestion.
		 * You may need to use this along with {@link Lib.CA.CashApp.Customization.Validation.CreateCustomerAdjustment}
		 * @param {Item} customerItem Set the customer adjustment item data here for the payment
		 * @param {Lib.CA.Customization.Common.CustomerAccountAllocation} customerMatch Customer adjustment allocation that will contain most data to set
		 * @param {string} defaultCustomerId First customer's id from the invoices table
		 * @param {Item} recycledAdjustment Only present for the Recycle Reversal adjustments WITH NO SUGGESTIONS. (CreateCustomerAdjustment is not called)
		 */
		/*ApplyCustomerAdjustment: function (customerItem, customerMatch, defaultCustomerId, recycledAdjustment)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Common.ModifyAdjustmentComment
		 * @description Modify the adjustment comment description. Normally finds the correct over/under key and add the invoice numbers.
		 * @param {string} defaultDescription Current description is the key with the invoice numbers comma delimited
		 * @param {string[]} adjustedInvoiceNumbers adjusted invoice numbers
		 * @param {"underpaid " | "overpaid " | "discounted " | ""} adjustmentType
		 * @param {string} translationKey Different for the type in param above
		 * @returns {string}
		 */
		/*ModifyAdjustmentComment: function (defaultDescription, adjustedInvoiceNumbers, adjustmentType, translationKey)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Common.ModifyCustomerKey
		 * @description
		 * This function is used to modify how the name and zip code for a remittance payer are used to set the Customer Key.
		 * Normally the values are normalized and combined.
		 * @param {string} customerKey this is what we would normally set it to
		 * @param {string} originalName Non-normalized customer name
		 * @param {string} originalZipCode Non-normalized zip code
		 * @returns {string} customerKey to use as the ID
		 * @example <caption>This example normalizes the name, but ignores the zip code.</caption>
		 * ModifyCustomerKey: function (customerKey, originalName, originalZipCode)
		 * {
		 *	return originalName.replace(/[^A-Za-z0-9]/g, "");
		 * }
		 */
		/*ModifyCustomerKey: function (customerKey, originalName, originalZipCode)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Common.ModifyRemittanceTableIDFilter
		 * @description
		 * This function is used to modify the filter used to look up the remittance settings for the payer.
		 * Normal filter is from the ID (Customer_key__) of the remittance to the ID in the "CA - Payer Settings - Remittance Advice" table.
		 * Primary use case here is probably to make it work with bad table data.
		 * @param {string} filter default filter
		 * @returns {string} new filter to override
		 * @example <caption>Searches the ID against the Table ID and Table Name</caption>
		 * ModifyRemittanceTableIDFilter: function (filter)
		 * {
		 *	return "(&(|(CustomerKey__=" + Data.GetValue("Customer_key__") + ")(CustomerKey__=" + Data.GetValue("Customer_name__") + "))" + Lib.CA.QueryHelper.Common.GetCompanyCodeFilter() + ")";
		 * }
		 */
		/*ModifyRemittanceTableIDFilter: function (filter)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Common.ModifyRecomputePaymentsFromRemittanceFilter
		 * @description
		 * This function is used to modify the filter used to recompute payments after a remittance is approved.
		 * Since it is necessary (before next openAr) to match payment to remittance since the payments search for the remittances.
		 * @param {string} filter default filter - we are looking for any payments with an exact amount match. Foreign currency is also considered.
		 * @returns {string} new filter to override
		 * @example <caption>Example adds a tolerance range to the search, since that can be configured on the payment config but is usually ignored.</caption>
		 * ModifyRecomputePaymentsFromRemittanceFilter: function (filter)
		 * {
		 *	var remittanceAmount = Data.GetValue("Total_amount__");
		 *	var tolerance = 50;
		 *	var lowerBound = Sys.Helpers.Round(remittanceAmount - tolerance, 3);
		 *	var myFilter = `(&(State<=70)(Deleted=0)(Paid_amount__<=${remittanceAmount})(Paid_amount__>=${lowerBound}))`;
		 *	return myFilter;
		 * }
		 */
		/*ModifyRecomputePaymentsFromRemittanceFilter: function (filter)
		{
		},*/

		/**
		 * Definition of Lib.CA.Payment.MatchingItems.CustomField
		 * @interface Lib.CA.RemittanceColumn.CustomField
		 * @prop {string} InvoiceFieldName (optional) technical name on the matching invoice form
		 * @prop {string} DeductionFieldName (optional) technical name on the matching deduction form
		 * @prop {string} RemittanceColumnName technical name of the custom column on the remittance form where info will be set in both cases
		 */

		/**
		 * @method Lib.CA.Customization.Common.CustomInvoiceColumnsRemittance
		 * @description
		 * This function is used to populate custom remittance invoice table columns with invoice/deduction information.
		 * It allows mapping invoice/deduction fields to custom remittance invoice columns.
		 * If you only define an Invoice or Deduction field, then lines of the other type will remain blank.
		 * @returns {Lib.CA.RemittanceColumn.CustomField[]} An array of objects containing the invoice field name and the corresponding remittance invoice column name.
		 * @example <caption>Example maps the invoice purchase order number or Deduction credit note number to a custom remittance invoice line column.</caption>
		 * CustomInvoiceColumnsRemittance: function()
		 * {
		 *	return [{InvoiceFieldName: "Purchase_order_number__", DeductionFieldName: "Credit_note_number__", RemittanceColumnName: "Z_custom_order__"}];
		 * }
		 */
		/*CustomInvoiceColumnsRemittance: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Common.AdditionalInvoiceNumberSearchFields
		 * @description
		 * Customizes which fields are searched when the "Fill document number from related document" setting is enabled, or when {@link Lib.CA.Customization.Extraction.ModifyInvoiceNumber ModifyInvoiceNumber} is defined.
		 * Implementing this user exist will override the default list of "Purchase_order_number__" and "Sales_Order_Number__".
		 * An extracted document number will only be replaced with the corresponding invoice number if there is one unique match found across all fields.
		 * If multiple matches are found, an error will be added and a user will need to select the correct document. It is recommended to add
		 * these fields in {@link Lib.CA.Customization.HTMLScripts.CustomizeDocumentSearchColumns CustomizeDocumentSearchColumns} so that the user is presented with all potential matches.
		 * @returns {Array<Object.<string, string>>} A map of the technical invoice field names to a key or a user-friendly display name that will show in Warning Messages
		 * @example <caption>This example maintains the default 2 fields and adds the Customer_Vat_number__</caption>
		 * AdditionalInvoiceNumberSearchFields: function()
		 * {
		 * 	var mapping = {};
		 * 	mapping["Purchase_order_number__"] = "_Invoice Purchase Number";
		 * 	mapping["Sales_Order_Number__"] = "_Invoice sales order number";
		 * 	mapping["Customer_VAT_number__"] = "My Custom Title";
		 * 	return mapping;
		 * }
		 */
		/*AdditionalInvoiceNumberSearchFields: function ()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Common.CustomizeInvoiceObjectForMatching
		 * @since 334
		 * @description
		 * Function called to customize the invoice object used for payment matching.
		 * This can be paired with the user exit {@link Lib.CA.Customization.Common.CustomizeStoredInvoiceFields} in order to use custom fields to customize standard fields on the invoice.
		 * @param {Lib.CA.Payment.MatchingItems.Invoice} invoice An Invoice object to customize
		 * @param {string} inputType The type of object for the invoice source. Will be one of:
		 * - "ESKMap" if the source was retrieved from a query of the supplier invoice
		 * - "Item" if the source was retrieved from the invoices table on the payment form
		 * @example <caption>This example will apply different discount outstanding amounts based on the payment date.</caption>
		 * CustomizeInvoiceObjectForMatching: function (invoice, inputType)
		 * {
		 * 	if (inputType !== "ESKMap")
		 * 	{
		 * 		// This invoice was not built from a SUPI record, so it has already gone through this customization
		 * 		return;
		 * 	}
		 * 	let paymentDate = Data.GetValue("Payment_date__");
		 * 	let getCustomFieldValueFromName = function (fieldName)
		 * 	{
		 * 		for (let i = 0; i < invoice.CustomFields.length; i++)
		 * 		{
		 * 			if (invoice.CustomFields[i].InvoiceFieldName === fieldName)
		 * 			{
		 * 				return invoice.CustomFields[i].Value;
		 * 			}
		 * 		}
		 * 		return undefined;
		 * 	};
		 * 	let discountNotExpired = function (expirationDate)
		 * 	{
		 * 		if (expirationDate)
		 * 		{
		 * 			expirationDate.setHours(0, 0, 0, 0);
		 * 		}
		 * 		if (paymentDate)
		 * 		{
		 * 			paymentDate.setHours(0, 0, 0, 0);
		 * 		}
		 * 		return expirationDate && paymentDate && paymentDate < expirationDate;
		 * 	};
		 * 	// Check if the first discount is valid for this payment date
		 * 	let expirationDate = getCustomFieldValueFromName("Additional_field_date_1__");
		 * 	if (expirationDate && discountNotExpired(expirationDate))
		 * 	{
		 * 		// The first discount is valid
		 * 		let discountAmount = getCustomFieldValueFromName("Additional_field_decimal_1__");
		 * 		if (discountAmount)
		 * 		{
		 * 			invoice.DiscountAmount = discountAmount;
		 * 			invoice.DiscountDate = expirationDate;
		 * 			invoice.DiscountOutstandingAmount = invoice.OutstandingAmount - discountAmount;
		 * 			return;
		 * 		}
		 * 	}
		 * 	// Check if the second discount is valid for this payment date
		 * 	expirationDate = getCustomFieldValueFromName("Additional_field_date_2__");
		 * 	if (expirationDate && discountNotExpired(expirationDate))
		 * 	{
		 * 		// The second discount is valid
		 * 		let discountAmount = getCustomFieldValueFromName("Additional_field_decimal_2__");
		 * 		if (discountAmount)
		 * 		{
		 * 			invoice.DiscountAmount = discountAmount;
		 * 			invoice.DiscountDate = expirationDate;
		 * 			invoice.DiscountOutstandingAmount = invoice.OutstandingAmount - discountAmount;
		 * 			return;
		 * 		}
		 * 	}
		 * }
		 */
		/*CustomizeInvoiceObjectForMatching: function (invoice, inputType)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Common.CustomRemittanceAdviceMappingReferenceFieldHandling
		 * @since 340
		 * @description
		 * Function called to properly handle custom values handled in the "reference field" combobox.
		 * This is paired with the user exit {@link Lib.CA.Customization.HTMLScripts.CustomRemittanceAdviceMappingReferenceField} to allow rules to target anything beyond the standard two fields, including custom fields.
		 * @param {string} referenceFieldValue The key provided in the CustomRemittanceAdviceMappingReferenceField for any custom option
		 * @param {Item} item A remittance line item that the corresponding rule is applying to. Used to get a value from it to check if the rule is valid
		 * @returns {string} The value to check the mapping's rule reference function and reference field value against
		 * @example <caption>This example checks for a custom remittance line value that targets the item's reason code to apply the rule against</caption>
		 * CustomRemittanceAdviceMappingReferenceFieldHandling: function(referenceFieldValue, item)
		 * {
		 *     if (referenceFieldValue === "REASON_CODE")
		 *     {
		 *         return item.GetValue("Col_reason_code__");
		 *     }
		 * }
		 */
		/*CustomRemittanceAdviceMappingReferenceFieldHandling: function(referenceFieldValue, item)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Common.CustomRemittanceAdviceMappingRuleProcessing
		 * @since 340
		 * @description
		 * Function called to perform any custom logic depending on the remittance item and the rule that's being applied to it.
		 * @param {Item} item A remittance line item that has been found to be a valid match by the rule.
		 * @param {Lib.CA.Remittance.Common.RemittanceAdviceMappingRule} rule A line in the remittance advice field mapping table that has been found to match the line item
		 * @example <caption>This example sets the description of the remittance item if the rule contains an entry in the custom field "Z_Alert_Description__"</caption>
		 * CustomRemittanceAdviceMappingRuleProcessing: function(remittanceItem, rule)
		 * {
		 *     if (rule.CustomColumns["Z_Alert_Description__"])
		 *     {
		 *         remittanceItem.SetValue("Col_description__", rule.CustomColumns["Z_Alert_Description__"]);
		 *     }
		 * }
		 */
		/*CustomRemittanceAdviceMappingRuleProcessing: function(remittanceItem, rule)
		{
		},*/
	};
	return Common;
})();