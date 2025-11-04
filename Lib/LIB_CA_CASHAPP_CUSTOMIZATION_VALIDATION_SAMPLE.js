/* LIB_DEFINITION{
  "name": "LIB_CA_CASHAPP_CUSTOMIZATION_VALIDATION_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "CashApplication Validation customization functions",
  "require": []
}*/

/**
 * @namespace Lib.CA.CashApp.Customization.Validation
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.CashApp = Lib.CA.CashApp || {};
Lib.CA.CashApp.Customization = Lib.CA.CashApp.Customization || {};

Lib.CA.CashApp.Customization.Validation = (function ()
{
	/**
	 * @namespace Lib.CA.CashApp.Customization.Validation
	 * @description
	 * This module contains functions allowing to
	 * - perform additional processing before/after payment validation
	 * - customize the filters used to search for invoices during validation
	 */
	var Validation =
	{
		/**
		 * @method Lib.CA.CashApp.Customization.Validation.InitializePaymentFileProcessingValidation
		 * @description
		 * Function called at the beginning of the Payment File Processing validation script
		 */
		/*InitializePaymentFileProcessingValidation: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.FinalizePaymentFileProcessingValidation
		 * @description
		 * Function called at the end of the Payment File Processing validation script
		 */
		/*FinalizePaymentFileProcessingValidation: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.InitializePaymentMatchingValidation
		 * @description
		 * Function called at the beginning of the Payment Matching validation script
		 * @example <caption>Customize options for 1 Payer</caption>
		 * InitializePaymentMatchingValidation: function()
		 * {
		 * 	if (Data.GetValue("Payer_name__") === "My Payer Test Name")
		 *	{
		 *		Variable.SetValueAsString("SkipAdditionalExactAmountSearch", "1"); //Skip Exact Match
		 *		Variable.SetValueAsString("SkipAllSearchWithoutRemit", "1"); //No suggestions for any payments without a remittance
		 *		Variable.SetValueAsString("SkipMostOverdueSearch", "1"); //Skip Most Overdue Search
		 *		Variable.SetValueAsString("SkipSearchWithRemit", "1"); //Skip additional suggestions after a remittance is matched
		 *		Variable.SetValueAsString("SkipOtherPayerRemits", "1"); //Don't also look for other payer remittances when a remittance isn't found
		 *		Variable.SetValueAsString("SkipOtherPayerExactSearch", "1"); //Don't do additional other payer exact searches
		 *		// The following will set the number of invoices to update per script execution.
		 *		// The default is 500, but if needed, this can be used to lower this limit so all updates per execution can happen within the 10 minute timeout.
		 *		Variable.SetValueAsString("CustomInvoicesUpdatedPerScriptExecution", "333");
		 *		// By default when there is no suggested allocation, only 100 related invoices will be added to the invoices table. This can be used to modify that limit.
		 *		Variable.SetValueAsString("MaxInvoicesNotPartOfSuggestion", "250");
		 *		// The following will set the number of attempts to find a linked remittance advice when the payment was created from a lockbox file.
		 *		// The default is 10. When retrying, there will be a wait between each try of (10 * 'current number of tries') seconds.
		 *		// For example, with 10 tries, we'll wait up to ~550 seconds, and with 15 tries, we'll wait up to 1200 seconds before giving up on finding the
		 *		// remittance upon initially creating the payment (the remittance can still be added to the payment by other means, for example when the remittance is approved).
		 *		Variable.SetValueAsString("MaxTryCountToFindLinkedRemittance", "15");
		 *	}
		 * }
		 * @example <caption>Customize for all Payers</caption>
		 * InitializePaymentMatchingValidation: function()
		 * {
		 *	Variable.SetValueAsString("SkipAdditionalExactAmountSearch", "1");
		 *	Variable.SetValueAsString("SkipAllSearchWithoutRemit", "1");
		 *	Variable.SetValueAsString("SkipMostOverdueSearch", "1");
		 *	Variable.SetValueAsString("SkipSearchWithRemit", "1");
		 *	Variable.SetValueAsString("SkipOtherPayerRemits", "1");
		 *	Variable.SetValueAsString("SkipOtherPayerExactSearch", "1");
		 *	Variable.SetValueAsString("CustomInvoicesUpdatedPerScriptExecution", "333");
		 *	Variable.SetValueAsString("MaxTryCountToFindLinkedRemittance", "15");
		 * }
		 */
		/*InitializePaymentMatchingValidation: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.FinalizePaymentMatchingValidation
		 * @description
		 * Function called at the end of the Payment Matching validation script
		 * To skip the logic in this function for payments with a specific status (e.g. skipped or rejected),
		 * check against the field Data.GetValue("Status_Alloc__")
		 */
		/*FinalizePaymentMatchingValidation: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.GetInvoiceSearchFilter
		 * @description
		 * Provides a way to customize invoice search during execution of the invoice matching engine. This is an additional filter added to all the default filters.
		 * @returns {string} LDAP filter.
		 * @example <caption>Search for invoice by purchase order number, extracted from the 'Bank_details__' field.</caption>
		 * GetInvoiceSearchFilter: function()
		 * {
		 * 	// Sample bank details value:
		 * 	// PO/REMIT  654673
		 * 	var bankDetails = Data.GetValue("Bank_details__");
		 * 	var orderRe = /PO\/REMIT[\s]+(\d+)/;
		 * 	var orderMatch = orderRe.exec(bankDetails);
		 * 	var orderNumber = orderMatch && orderMatch.length >= 2 ? orderMatch[1].trim() : null;
		 * 	return orderNumber ? "Purchase_order_number__=" + orderNumber : null;
		 * }
		 */
		/*GetInvoiceSearchFilter: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.GetRecycledPaymentInvoiceSearchFilter
		 * @description
		 * Provides a way to customize invoice search during execution of the invoice matching engine, only for recycled payments.
		 * Matches found with the defined filter allows recycled payments to be updated to the status "To Allocate" or automatically allocated without a matched remittance advice.
		 * @returns {Sys.Helpers.LdapUtil.IFilter} LDAP filter.
		 * @example <caption> Search for invoices by the custom field matching one of the recycled adjustment descriptions.</caption>
		 * GetRecycledPaymentInvoiceSearchFilter: function()
		 * {
		 * 	var recycledItems = Lib.CA.Payment.Allocate.Common.GetRecycledCustomerItems();
		 * 	var itemFilters = [];
		 * 	recycledItems.forEach(function (recycledItem)
		 * 	{
		 * 		var recycledItemDescription = recycledItem.GetValue("Account_description__");
		 * 		if (recycledItemDescription)
		 * 		{
		 * 			recycledItemDescription = Sys.Helpers.String.EscapeValueForLdapFilter(recycledItemDescription);
		 * 			itemFilters.push(
		 * 				Sys.Helpers.LdapUtil.FilterEqual("Z_Recycle_lookup__", recycledItemDescription)
		 * 			);
		 * 		}
		 * 	});
		 * 	return itemFilters.length > 0 ? Sys.Helpers.LdapUtil.FilterOr(...itemFilters) : null;
		 * }
		 */
		/*GetRecycledPaymentInvoiceSearchFilter: function ()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.GetRecycleReversalCreditNoteFilter
		 * @description
		 * Provides a way to customize the search for credit notes to use as the offset from the recycling customer adjustment(s).
		 * This is called after the matching engine has finished finding suggestions.
		 * This can be used to add to or override the default search filter.
		 * @param {Sys.Helpers.LdapUtil.IFilter} defaultFilter The default LDAP filter based on recycled adjustment amount and customer ID.
		 * @returns {Sys.Helpers.LdapUtil.IFilter} LDAP filter.
		 * @example <caption>Search for credit notes also by the invoice date compared to the recycle date.</caption>
		 * GetRecycleReversalCreditNoteFilter: function(defaultFilter)
		 * {
		 * 	var recycleDate = Data.GetValue("Recycled_datetime__");
		 * 	var earliestDate = Sys.Helpers.Date.Date2DBDateTime(
		 * 		new Date(recycleDate.getFullYear(), recycleDate.getMonth(), recycleDate.getDate() - 2)
		 * 	);
		 * 	var latestDate = Sys.Helpers.Date.Date2DBDateTime(
		 * 		new Date(recycleDate.getFullYear(), recycleDate.getMonth(), recycleDate.getDate() + 2)
		 * 	);
		 * 	var queryFilter = Sys.Helpers.LdapUtil.FilterAnd(
		 * 		defaultFilter,
		 * 		Sys.Helpers.LdapUtil.FilterGreaterOrEqual("Invoice_date__", earliestDate),
		 * 		Sys.Helpers.LdapUtil.FilterLesserOrEqual("Invoice_date__", latestDate)
		 * 	);
		 * 	return queryFilter;
		 * }
		 */
		/*GetRecycleReversalCreditNoteFilter: function(defaultFilter)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.GetPayerCustomerLinkFilter
		 * @description
		 * Provides a way to customize searching for the Customer linked to the Payer.
		 * The customers found by this filter are used to find invoices in the matching engine.
		 * The function {@link Lib.CA.CashApp.Customization.Validation.GetCustomerIDFromPayerCustomerLinkResults GetCustomerIDFromPayerCustomerLinkResults} can be used to customize selecting the Customer ID(s) found with this filter
		 * @returns {string} LDAP filter. If this is not populated, the default filter will be used.
		 * @example <caption>Search for customer IDs in the Payer/Customer link table by payer reference, ignoring spaces.</caption>
		 * GetPayerCustomerLinkFilter: function()
		 * {
		 * 	// Remove whitespace from the Payer Reference on the payment
		 * 	var payerReference = Data.GetValue("Payer__");
		 * 	payerReference = (payerReference || "").replace(/\s+/g, "");
		 * 	return "Payer_reference__=" + Sys.Helpers.String.EscapeValueForLdapFilter(payerReference);
		 * }
		 * @example <caption>When the payer isn't specified on the payment, find all available customer IDs in the Payer/Customer link table. Then, later filter results using customizations in GetCustomerIDFromPayerCustomerLinkResults.</caption>
		 * GetPayerCustomerLinkFilter: function()
		 * {
		 * 	var payerReference = Data.GetValue("Payer__");
		 * 	// Use a wildcard to retrieve all results
		 * 	payerReference = payerReference || "*";
		 * 	return "Payer_reference__=" + Sys.Helpers.String.EscapeValueForLdapFilter(payerReference);
		 * }
		 */
		/*GetPayerCustomerLinkFilter: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.GetCustomerIDFromPayerCustomerLinkResults
		 * @description
		 * Provides a way to customize finding the Customer linked to the Payer.
		 * The customer IDs returned are used to find invoices in the matching engine.
		 * @param {object[]} results Payer/Customer link table results with fields "Payer_Reference__" and "CustomerID__"
		 * @returns {string[]} List of customer IDs. If this is not populated, all customers in the input results will be used.
		 * @example <caption>Use the IBAN country identifier from the payment description to select the correct customer ID when the payer reference isn't specific enough.</caption>
		 * GetCustomerIDFromPayerCustomerLinkResults: function(results)
		 * {
		 * 	// Sample bank details value:
		 * 	// BI:FR7630006000011234567890189
		 * 	var bankDetails = Data.GetValue("Bank_details__");
		 * 	var IBANRe = /BI:([A-z]{2}[0-9]{2}[0-9 A-z]{1,30})/;
		 * 	var IBANMatch = IBANRe.exec(bankDetails);
		 * 	var IBANNumber = IBANMatch && IBANMatch.length >= 2 ? IBANMatch[1].trim() : null;
		 * 	var IBANCountry = IBANNumber && IBANNumber.length > 2 ? IBANNumber.slice(0, 1) : null;
		 * 	var customerID = [];
		 * 	if (results && results.length > 0)
		 * 	{
		 * 		for (var i = 0; i < results.length; i++)
		 * 		{
		 * 			var payerCustomerLink = results[i];
		 * 			if (payerCustomerLink.Payer_Reference__ === "DEMOPOS")
		 * 			{
		 * 				switch (IBANCountry)
		 * 				{
		 * 					case "US":
		 * 						// Use Customer ID for DEMOPOS US
		 * 						customerID.push("13121980");
		 * 						break;
		 * 					case "FR":
		 * 						// Use Customer ID for DEMOPOS France
		 * 						customerID.push("31051987");
		 * 						break;
		 * 					default:
		 * 						// Don't add customer ID
		 * 				}
		 * 			}
		 * 			else
		 * 			{
		 * 				customerID.push(payerCustomerLink.CustomerID__);
		 * 			}
		 * 		}
		 * 	}
		 * 	return customerID;
		 * }
		 */
		/*GetCustomerIDFromPayerCustomerLinkResults: function(results)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.UseCustomGLGrouping
		 * @description This function is used to override the default grouping of G/L adjustments when creating adjustments from the invoices table. By default, a separate G/L adjustment is made
		 * for each customer with a selected invoice that needs an adjustment. This functionality applies to adjustments that are automatically created for short payments.
		 * Use in conjunction with the {@link Lib.CA.CashApp.Customization.Validation.GetCustomGLGroupingValue GetCustomGLGroupingValue} function, and the equivalent functions in {@link Lib.CA.CashApp.Customization.HTMLScripts.UseCustomGLGrouping} to handle manually-created adjustments
		 * @returns True if custom grouping should be used instead of the default
		 */
		/*UseCustomGLGrouping: function ()
		{
			return true;
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.GetCustomGLGroupingValue
		 * @description This function is used to override the default grouping of G/L adjustments when creating adjustments from the invoices table. By default, a separate G/L adjustment is made
		 * for each customer with a selected invoice that needs an adjustment. This functionality applies to adjustments that are automatically created for short payments.
		 * Use in conjunction with {@link Lib.CA.CashApp.Customization.Validation.UseCustomGLGrouping UseCustomGLGrouping} and optionally {@link Lib.CA.CashApp.Customization.Validation.CustomizeGroupedGLAdjustment CustomizeGroupedGLAdjustment}, and the equivalent functions in {@link Lib.CA.CashApp.Customization.HTMLScripts.GetCustomGLGroupingValue} to handle manually-created adjustments
		 * @param {Lib.CA.Payment.MatchingItems.Invoice} invoice Object representing an invoice that needs an adjustment. Available fields are:
		 * - Ruidex, Customer, CompanyCode, Number, Date, DueDate, OutstandingAmount, CustomerId, Match, Currency, Selected, RemainingAmount,
		 * 	AllocatedAmount, State, Skipped, DiscountAmount, DiscountOutstandingAmount, DiscountDate, OriginalDiscountDate, MaxDiscountAmount, LineIdxInRemittance,
		 * 	PurchaseOrderReference, AssociatedDeductionRuidex, AssociatedDeductionNumber, AssociatedDeductionDate
		 * - CustomFields, which contains the fields configured in {@link Lib.CA.Customization.Common.CustomizeStoredInvoiceFields}
		 * @returns {string} The value that should be used to group this adjustment with adjustments from other invoices
		 * @example <caption>This example returns a delimited key containing the standard field for Customer and a custom field for Cost center</caption>
		 * GetCustomGLGroupingValue: function (invoice)
		 * {
		 * 	var customer = invoice.CustomerId;
		 * 	var costCenter = "";
		 * 	if (invoice.CustomFields)
		 * 	{
		 * 		for (var i = 0; i < invoice.CustomFields.length; i++)
		 * 		{
		 * 			var customField = invoice.CustomFields[i];
		 * 			if (customField.PaymentFieldName === "Custom_Col_Cost_Center__")
		 * 			{
		 * 				costCenter = customField.Value;
		 * 				break;
		 * 			}
		 * 		}
		 * 	}
		 * 	return customer + "|" + costCenter;
		 * }
		 */
		/*GetCustomGLGroupingValue: function (invoice)
		{
			return "";
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.GetCustomCustomerGroupingValue
		 * @description This function is used to override the default grouping of Customer adjustments when creating adjustments from the invoices table. By default, a separate Customer adjustment is made
		 * for each customer with a selected invoice that needs an adjustment. This functionality applies to adjustments that are automatically created for under and over payments.
		 * Optionally, use in conjunction with the equivalent functions in {@link Lib.CA.CashApp.Customization.HTMLScripts.GetCustomCustomerGroupingValue} to handle manually-created adjustments
		 * @param {Lib.CA.Payment.MatchingItems.Invoice} invoice Object representing an invoice that needs an adjustment. Available fields are:
		 * - Ruidex, Customer, CompanyCode, Number, Date, DueDate, OutstandingAmount, CustomerId, Match, Currency, Selected, RemainingAmount,
		 * 	AllocatedAmount, State, Skipped, DiscountAmount, DiscountOutstandingAmount, DiscountDate, OriginalDiscountDate, MaxDiscountAmount, LineIdxInRemittance,
		 * 	PurchaseOrderReference, AssociatedDeductionRuidex, AssociatedDeductionNumber, AssociatedDeductionDate
		 * - CustomFields, which contains the fields configured in {@link Lib.CA.Customization.Common.CustomizeStoredInvoiceFields}
		 * @returns {string} The value that should be used to group this adjustment with adjustments from other invoices
		 * @example <caption>This example returns a delimited key containing the standard field for Customer and a custom field for Tax code</caption>
		 * GetCustomCustomerGroupingValue: function (invoice)
		 * {
		 * 	var customer = invoice.CustomerId;
		 * 	var taxCode = "";
		 * 	if (invoice.CustomFields)
		 * 	{
		 * 		for (var i = 0; i < invoice.CustomFields.length; i++)
		 * 		{
		 * 			var customField = invoice.CustomFields[i];
		 * 			if (customField.PaymentFieldName === "Z_Custom_Col_Tax_Code__")
		 * 			{
		 * 				taxCode = customField.Value;
		 * 				break;
		 * 			}
		 * 		}
		 * 	}
		 * 	return customer + "|" + taxCode;
		 * }
		 */
		/*GetCustomCustomerGroupingValue: function (invoice)
		{
			return "";
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.CustomizeGroupedGLAdjustment
		 * @description This function is used to modify the G/L adjustment created when creating adjustments from the invoices table. The key returned by {@link Lib.CA.CashApp.Customization.Validation.GetCustomGLGroupingValue GetCustomGLGroupingValue} can
		 * be parsed for the information needed to customize the adjustment. The equivalent function for manually-created adjustments is {@link Lib.CA.CashApp.Customization.HTMLScripts.CustomizeGroupedGLAdjustment}
		 * Consider using {@link Lib.CA.CashApp.Customization.Validation.CreateGLAdjustment} rather than this for more flexibility.
		 * @param {Lib.CA.Customization.Common.LedgerAccountAllocation} adjustment The adjustment to be modified
		 * @param {string} key The associated key returned by GetCustomGLGroupingValue to parse
		 * @example <caption>This example parsed a key containing customer & cost center, and sets both fields accordingly</caption>
		 * CustomizeGroupedGLAdjustment: function (item, key)
		 * {
		 * 	var keyArray = key.split("|");
		 * 	var customer = keyArray[0];
		 * 	var costCenter = keyArray[1];
		 * 	adjustment.CustomerID = customer;
		 * 	adjustment.CostCenter = costCenter;
		 * }
		 */
		/*CustomizeGroupedGLAdjustment: function (item, key)
		{
		},*/

		/**
		 * Definition of Lib.CA.MatchingEngine.ContextStringGL
		 * @interface Lib.CA.MatchingEngine.ContextStringGL
		 * @prop {string} Invoice - Invoice level Over/Under payment tolerance
		 * @prop {string} Withholding - Withholding tax adjustments
		 * @prop {string} RemitExact - Remittance tolerance or Exact Match search
		 * @prop {string} Payment - Payment level tolerance
		 * @prop {string} Other - Other lines from the remittance
		 * @prop {string} Combo - Combination Matching
		 * @prop {string} Payer - Rules defined in Payer table
		 * @prop {string} CrossCompanyFromDescription - A cross company invoice that was found in a payment's expected invoice numbers
		*/

		/**
		 * Definition of RemittanceCDLRecord
		 * @interface Lib.CA.CashApp.Customization.Validation.RemittanceCDLRecord
		 * @prop {number} LineNum
		 * @prop {number} Line_Col_invoice_disputed_amount__
		 * @prop {string} Line_Col_invoice_ruidex__
		 * @prop {string} Line_Col_invoice_number__
		 * @prop {string} Line_Col_document_number__
		 * @prop {string} Line_Col_description__
		 * @prop {number} Line_Col_invoice_total_amount__
		 * @prop {string} Line_Col_document_type__
		 * @prop {string} Line_Col_invoice_customer_id__
		*/

		/**
		 * Definition of LineItemDetail
		 * @interface Lib.CA.CashApp.Customization.Validation.LineItemDetail
		 * @prop {Lib.CA.Configuration.ExtractionType} Extraction_type__
		 * @prop {string} Col_invoice_number__ For the payment and remittance invoice tables
		 * @prop {string} Col_reason_code__ For the payment and remittance invoice tables
		 * @prop {string} Col_allocated_paid_amount__ For the payment invoice table
		 * @prop {string} Col_discount_amount__ For the payment invoice table
		 * @prop {string} Col_account_number__ For the payment GL adjustment table
		 * @prop {string} Col_Customer_Info__ For the payment GL adjustment table
		 * @prop {string} Col_cost_center__ For the payment GL adjustment table
		 * @prop {string} Col_profit_center__ For the payment GL adjustment table
		 * @prop {string} Col_tax_code__ For the payment GL adjustment table
		 * @prop {string} Col_Reason_Code__ For the payment GL adjustment table
		 * @prop {string} Col_GL_Document_Number__ For the payment GL adjustment table
		 * @prop {string} Col_account_description__ For the payment GL adjustment table
		 * @prop {string} Col_account_amount__ For the payment GL adjustment table
		 * @prop {string} Customer_Info__ For the payment Customer adjustment table
		 * @prop {string} Tax_Code__ For the payment Customer adjustment table
		 * @prop {string} Reason_Code__ For the payment Customer adjustment table
		 * @prop {string} Col_Customer_Document_Number__ For the payment Customer adjustment table
		 * @prop {string} Account_description__ For the payment Customer adjustment table
		 * @prop {string} Account_amount__ For the payment Customer adjustment table
		 * @prop {string} Col_document_type__ For the remittance invoice table
		 * @prop {string} Col_invoice_date__ For the remittance invoice table
		 * @prop {string} Col_description__ For the remittance invoice table
		 * @prop {string} Col_invoice_amount__ For the remittance invoice table
		 * @prop {string} Col_invoice_disputed_amount__ For the remittance invoice table
		 * @prop {string} Col_invoice_debit_amount__ For the remittance invoice table
		 * @prop {string} Col_invoice_credit_amount__ For the remittance invoice table
		 * @prop {string} Col_invoice_total_amount__ For the remittance invoice table
		 * @prop {string} Col_adjustment_type__ For the remittance invoice table
		 * @prop {string} Col_GL_account__ For the remittance invoice table
		 * @prop {string} Col_customer__ For the remittance invoice table
		 */

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.CreateGLAdjustment
		 * @description This function is used to modify a GL adjustment created. Custom items need to also be applied in {@link Lib.CA.Customization.Common.ApplyGLAdjustment}
		 * Called for Invoice level tolerance, payment level tolerance, remittance tolerance, withholding tax (ToVerify), and exact amount matching.
		 * @param {Lib.CA.Customization.Common.LedgerAccountAllocation} ledgerEntry The ledger allocation to set data into
		 * @param {string} key - Just to reference if needed, the associated groupByValue returned by GetCustomGLGroupingValue to parse
		 * @param {Lib.CA.Customization.Common.DefaultAdjustmentSetting} adjustmentSettings Over/Under payment settings if needed
		 * @param {Lib.CA.Payment.MatchingItems.Invoice[]} adjustedInvoiceList - if adjusting an invoice (Payment level, invoice level, withholding), this is an array of invoice items
		 * @param {Lib.CA.MatchingEngine.ContextStringGL} context - Use this parameter if you need to limit the change to specific workflows
		 * When called from the lockbox file process, the remittanceLine will be of type LineItemDetail. When called from the payment allocation process, it will be of type RemittanceCDLRecord.
		 * @param {Lib.CA.CashApp.Customization.Validation.RemittanceCDLRecord | Lib.CA.CashApp.Customization.Validation.LineItemDetail} remittanceLine - Present when creating an adjustment while using a payment description as the remittance. Context = "Other".
		 * @example <caption>This example will set a custom property.</caption>
		 * CreateGLAdjustment: function(ledgerEntry, key, adjustmentSettings, adjustedInvoiceList, context, remittanceLine)
		 * {
		 * 	ledgerEntry.Z_Custom_1 = "My Value";
		 * }
		 */
		/*CreateGLAdjustment: function (ledgerEntry, key, adjustmentSettings, adjustedInvoiceList, context, remittanceLine)
		{
		},*/

		/**
		 * Definition of Lib.CA.MatchingEngine.ContextStringCustomer
		 * @interface Lib.CA.MatchingEngine.ContextStringCustomer
		 * @prop {string} Invoice - Invoice level Over/Under payment tolerance
		 * @prop {string} RemitExact - Remittance tolerance or Exact Match search
		 * @prop {string} Payment - Payment level tolerance
		 * @prop {string} Recycle - Recycle reversal with suggestions (without is Apply user exit only)
		 * @prop {string} Other - Other lines from the remittance
		 * @prop {string} Combo - Combination Matching
		 * @prop {string} Payer - Rules defined in Payer table
		 * @prop {string} CrossCompanyFromDescription - A cross company invoice that was found in a payment's expected invoice numbers
		*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.CreateCustomerAdjustment
		 * @description This function is used to modify a Customer adjustment created. Custom items need to also be applied in {@link Lib.CA.Customization.Common.ApplyCustomerAdjustment}
		 * Called for Invoice level tolerance, payment level tolerance, remittance tolerance, exact amount matching, and recycle with suggestions
		 * @param {Lib.CA.Customization.Common.CustomerAccountAllocation} customerEntry The created adjustment to be modified
		 * @param {string} key This will be the customerId that adjustments are grouped by.
		 * @param {Lib.CA.Customization.Common.DefaultAdjustmentSetting} adjustmentSettings Over/Under payment settings if needed
		 * @param {Lib.CA.Payment.MatchingItems.Invoice[]} adjustedInvoiceList - if adjusting an invoice, this is that invoice item
		 * @param {Item} recycledAdjustment Only present for the Recycle Reversal adjustments with suggestions. (ApplyCustomerAdjustment is not called)
		 * @param {Lib.CA.MatchingEngine.ContextStringCustomer} context - Use this parameter if you need to limit the change to specific workflows
		 * @param {Lib.CA.CashApp.Customization.Validation.RemittanceCDLRecord | Lib.CA.CashApp.Customization.Validation.LineItemDetail} remittanceLine - Present when creating an adjustment while using a payment description as the remittance.  Context = "Other".
		 * When called from the lockbox file process, the remittanceLine will be of type LineItemDetail. When called from the payment allocation process, it will be of type RemittanceCDLRecord.
		 * @example <caption>If it's from a remittance line, set the reason code</caption>
		 * CreateCustomerAdjustment: function (customerEntry, key, adjustmentSettings, adjustedInvoiceList, recycledAdjustment, context, remittanceLine)
		 * {
		 * 	if (context == "Other") //Usually you should restrict to certain types of adjustments
		 * 	{
		 * 		customerEntry.ReasonCode = "12";
		 * 	}
		 * }
		 */
		/*CreateCustomerAdjustment: function (customerEntry, key, adjustmentSettings, adjustedInvoiceList, recycledAdjustment, context, remittanceLine)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.CustomDiscrepancyDestination
		 * @since 336
		 * @description Allows customizing which account a payment discrepancy (i.e. under or overpayment) will allocated to. If it's an overpayment, the value found in allocationEntry.Amount will be positive; if
		 * it's an underpayment, this value will be negative.
		 * @param {Lib.CA.Customization.Common.LedgerAccountAllocation | Lib.CA.Customization.Common.CustomerAccountAllocation} allocationEntry The created adjustment to be modified
		 * @param {string} key This will be the customerId that adjustments are grouped by.
		 * @param {Lib.CA.Customization.Common.DefaultAdjustmentSetting} adjustmentSettings Over/Under payment settings if needed
		 * @param {Lib.CA.Payment.MatchingItems.Invoice[]} adjustedInvoiceList List of invoices being adjusted with this discrepancy
		 * @param {Lib.CA.Payment.Allocate.Common.DiscrepancyAdjustmentType} discrepancyDestination The current account type ("INVOICE", "GLACCOUNT", or "CUSTOMERACCOUNT") to which an adjustment will be applied
		 * @returns {Lib.CA.Payment.Allocate.Common.DiscrepancyAdjustmentType} Return the new account type to which the adjustment will be applied, if different than the current one
		 * Possible return options:
		 *  "INVOICE"
		 *  "GLACCOUNT"
		 *  "CUSTOMERACCOUNT"
		 * Any other non-empty return value will be treated as "GLACCOUNT" by default
		 * @example <caption>Change the discrepancy adjustment destination based on the amount of the allocation entry</caption>
		 * CustomDiscrepancyDestination: function (allocationEntry, key, adjustmentSettings, adjustedInvoiceList, discrepancyDestination)
		 * {
		 *  // Post all under and overpayments that are within 50 of the expected invoice amount to the customer adjustment table. If the configuration options are set to otherwise post under and overpayments
		 *  // to the GL table, then those with a difference greater than 50 to the expected amount will still be posted to the GL table.
		 *  let customDiscrepancyDestination = discrepancyDestination;
		 *  if (Math.abs(allocationEntry.Amount) <= 50)
		 *  {
		 *  	customDiscrepancyDestination = "CUSTOMERACCOUNT";
		 *  }
		 *  return customDiscrepancyDestination;
		 * }
		 */
		/*CustomDiscrepancyDestination: function (allocationEntry, key, adjustmentSettings, adjustedInvoiceList, discrepancyDestination)
		{
		},*/

		/**
		 * Definition of RemittanceItemType
		 * @interface Lib.CA.CashApp.Customization.Validation.RemittanceItemType
		 * @prop {string} Invoice - Invoice level Over/Under payment tolerance
		 * @prop {string} RemitExact - Remittance tolerance or Exact Match search
		 * @prop {string} Payment - Payment level tolerance
		 * @prop {string} Recycle - Recycle reversal with suggestions (without is Apply user exit only)
		 * @prop {string} Other - Other lines from the remittance
		 * @prop {string} Combo - Combination Matching
		 * @prop {string} Payer - Rules defined in Payer table
		*/

		/**
		 * Definition of remittanceDetail
		 * @interface Lib.CA.CashApp.Customization.Validation.RemittanceDetail
		 * @prop {string} invoiceNumber - Invoice number
		 * @prop {string} netPayment - Net payment
		 * @prop {string} discountTaken - Discount amount
		 * @prop {string} invoiceAmount - Line Amount
		 * @prop {string} adjustmentReasonCode - Adjustment reason code
		 * @prop {string} penaltyAmount - penalty amount
		 * @prop {string} billOfLading - BOL
		 * @prop {Lib.CA.CashApp.Customization.Validation.RemittanceItemType} documentType Invoice or Deduction or Other
		*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.CustomSuggestionFromDescription
		 * @description EDI 820 File Format ONLY
		 * This function allows custom suggestion building from a payment that uses a description as a remittance.
		 * Adjustments can be added from the description to the suggestion.
		 * @param {Lib.CA.CashApp.Customization.Validation.RemittanceDetail} remittanceDetailLine information about this line extracted from the file
		 * @param {number} lineNum - the line number in the remittance
		 * @returns {Lib.CA.CashApp.Customization.Validation.RemittanceCDLRecord} custom adjustmentLine to add to the remittance, or null to not customize this line
		 * @example <caption>This example is a starting place to show how you could make a custom adjustment for some lines.</caption>
		 * CustomSuggestionFromDescription: function (remittanceDetailLine, lineNum)
		 * {
		 * 	if (remittanceDetailLine.invoiceNumber == "FEE")
		 * 	{
		 * 		let adjustmentLine = {
		 * 			LineNum: lineNum,
		 * 			Line_Col_invoice_disputed_amount__: Number(remittanceDetailLine.discountTaken),
		 * 			Line_Col_invoice_ruidex__: "",
		 * 			Line_Col_invoice_number__: remittanceDetailLine.invoiceNumber,
		 * 			Line_Col_invoice_total_amount__: remittanceDetailLine.netPayment,
		 * 			Line_Col_document_type__: "",
		 * 			Line_Col_invoice_customer_id__: "",
		 * 			Line_Col_description__: "Claim adjustment for " + remittanceDetailLine.invoiceNumber
		 * 		};
		 * 		return adjustmentLine;
		 * 	}
		 * }
		 */
		/*CustomSuggestionFromDescription: function (remittanceDetailLine, lineNum)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.ValidateAdditionalFields
		 * @description This function can add or remove additional field validation.
		 * Current standard logic checks GL - Customer Identifier if configured and account, Customer - Customer Identifier
		 * You may want to also implement similar Customscript logic {@link Lib.CA.CashApp.Customization.HTMLScripts.ValidateAdditionalFields}.
		 * @param {function} ValidateAccountAllocationTable call this to continue validating the GL Table
		 * @param {function} ValidateAllocateToCustomerTable call this to continue validating the Customer table
		 * @param {ITable} AccountTable If you need to look at the table to validate.
		 * @param {ITable} CustomerTable If you need to look at the table to validate.
		 * @param {ITable} InvoiceTable If you need to look at the table to validate.
		 * @returns {boolean} True means good to approve, false means no generally showing an error
		 * @example <caption>This example is the existing behavior, don't remove these pieces unless you want to skip them.</caption>
		 * ValidateAdditionalFields: function (ValidateAccountAllocationTable, ValidateAllocateToCustomerTable, AccountTable, CustomerTable, InvoiceTable)
		 * {
		 * 	let glValid = ValidateAccountAllocationTable();
		 * 	let customerValid = ValidateAllocateToCustomerTable();
		 * 	return glValid && customerValid;
		 * }
		 * @example <caption>This example adds a requirement for negative GL adjustments to require document number as well as the default logic.</caption>
		 * ValidateAdditionalFields: function (ValidateAccountAllocationTable, ValidateAllocateToCustomerTable, AccountTable, CustomerTable, InvoiceTable)
		 * {
		 * 	for (var i = 0; i < AccountTable.GetItemCount(); i++)
		 * 	{
		 * 		var item = AccountTable.GetItem(i);
		 * 		if (item.GetValue("Col_account_amount__") < 0 && item.IsNullOrEmpty("Col_GL_Document_Number__"))
		 * 		{
		 * 			item.SetError("Col_GL_Document_Number__", "This field is required!");
		 * 		}
		 * 	}
		 * 	let glValid = ValidateAccountAllocationTable();
		 * 	let customerValid = ValidateAllocateToCustomerTable();
		 * 	return glValid && customerValid;
		 * }
		 */
		/*ValidateAdditionalFields: function (ValidateAccountAllocationTable, ValidateAllocateToCustomerTable, AccountTable, CustomerTable, InvoiceTable)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.CustomizeAdjustmentType
		 * @description This function can be used to make Other and Deduction lines on the remittance as Gl or Customer adjustments.
		 * Only affects those remittance Other/Deduction lines, not any other adjustments.
		 * This can be used in cases where it should sometimes go to Customer lines, and sometimes GL.
		 * Returning a value will override any Payer Table or Global Setting.
		 * @param {Lib.CA.CashApp.Customization.Validation.RemittanceCDLRecord} remittanceLine provided to determine which lines should go to Customer Adjustments
		 * @returns {"GL" | "Customer" | ""} GL creates a GL adjustment, Customer creates a Customer Adjustment, and "" will use default system logic
		 * @example <caption>This example will move lines with "FEE" as an invoice number to Customer Adjustments and use other system settings for the rest.</caption>
		 * CustomizeAdjustmentType: function(remittanceLine)
		 * {
		 * 	if (remittanceLine.Line_Col_adjustment_type__)
		 * 	{
		 * 		return "";  //don't overwrite what was specified on the remittance
		 * 	}
		 * 	if (remittanceLine.Line_Col_invoice_number__ = "FEE")
		 * 	{
		 * 		return "Customer";
		 * 	}
		 * 	return ""; //Use system default
		 * }
		 */
		/*CustomizeAdjustmentType: function (remittanceLine)
		{
		},*/

		/**
		 * Definition of Lib.CA.Payment.Allocate.TriggerRecomputeSource
		 * @interface Lib.CA.Payment.Allocate.TriggerRecomputeSource
		 * @prop {string} unknown - ""
		 * @prop {string} OpenArImport - "AR OpenAR Import"
		 * @prop {string} RemittanceAdviceProcessing - "Remittance Advice Processing"
		 * @prop {string} RemittanceAdviceProcessingLinkedPayment - "Remittance Advice Processing Linked Payment"
		 * @prop {string} PaymentMatchingInvoiceUpdated - "Payment Matching Invoice Updated"
		 * @prop {string} PaymentMatchingNewPayerCustomerLink - "Payment Matching New Payer Customer Link"
		 * @prop {string} PaymentMatchingNewPayerCustomerLinkRecycle - "Payment Matching New Payer Customer Recycle"
		 * @prop {string} PaymentMatchingNewPayerRule - "Payment Matching New Payer Rule"
		 * @prop {string} PaymentMatchingPayerTouchlessEnabled - "Payment Matching Payer Touchless Enabled"
		*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.GetRecomputePaymentsFilter
		 * @description This function can be used to customize the filter for finding payments to recompute.
		 * @param {Sys.Helpers.LdapUtil.IFilter} filter original filter that would be used to find payments to recompute for the particular scenario.
		 * @param {Lib.CA.Payment.Allocate.TriggerRecomputeSource} triggerSource source process/scenario that is triggering payments to be recomputed.
		 * @returns {Sys.Helpers.LdapUtil.IFilter} Updated filter to find payments to recompute.
		 * @example <caption>This example will handle making sure a company code is used on the payment recompute filter from Open AR import, for the scenario where multiple company codes would apply to a single configuration.</caption>
		 * GetRecomputePaymentsFilter: function (filter, triggerSource)
		 * {
		 * 	if (triggerSource === "AR OpenAR Import")
		 * 	{
		 * 		const filters = [
		 * 			Sys.Helpers.LdapUtil.FilterLesserOrEqual("State", "70"),
		 * 			Sys.Helpers.LdapUtil.FilterEqual("Deleted", "0")
		 * 		];
		 * 		const configName = Data.GetValue("Configuration_name__");
		 * 		switch (configName)
		 * 		{
		 * 			case "COMPANY1":
		 * 				filters.push(Sys.Helpers.LdapUtil.FilterEqual("Company_code__", "COMP1"));
		 * 				break;
		 * 			case "COMPANY2":
		 * 				filters.push(Sys.Helpers.LdapUtil.FilterEqual("Company_code__", "COMP2"));
		 * 				break;
		 * 			case "COMPANY3And4":
		 * 				filters.push(Sys.Helpers.LdapUtil.FilterOr(
		 * 					Sys.Helpers.LdapUtil.FilterEqual("Company_code__", "COMP3"),
		 * 					Sys.Helpers.LdapUtil.FilterEqual("Company_code__", "COMP4")
		 * 				));
		 * 				break;
		 * 			default:
		 * 			// do not filter by company code
		 * 		}
		 * 		return Sys.Helpers.LdapUtil.FilterAnd(...filters);
		 * 	}
		 * 	return null; // Use system default
		 * }
		 */
		/*GetRecomputePaymentsFilter: function (filter, triggerSource)
		{
		},*/

		/**
		 * Definition of remittanceSearchCriteria
		 * @interface Lib.CA.CashApp.Customization.Validation.RemittanceSearchCriteria
		 * @prop {number} paymentAmount - payment amount
		 * @prop {string} knownCustomerIDsForPayer - Map of customers already known for this payer. E.g. knownCustomerIDsForPayer["31051987"]="1"
		 * @prop {string} payer - payer name. Typically a remittance rule is checked twice, first with the payer, and then without including payer in the filter
		 * @prop {Date} paymentDate - payment date
		 * @prop {number} tolerance - number indicating the maximum amount higher the remittance can be than the payment, e.g. tolerance of $5 allows for a $995 payment to match a $1000 remittance
		 * @prop {string} companyCode - payment company code
		 * @prop {string[]} skipRemittancesRuidEx - array of any ruidexes that should not be matched
		 * @prop {string} ruleName - type of remittance search being performed. Values can be "ExactAmountMatchingRule", "CheckNumberMatchingRule", or "ExactRuidExMatchingRule"
		 * @prop {string[]} remittancesRuidEx - If ruleName is "ExactRuidExMatchingRule", list of ruidexes to match
		 * @prop {string} checkNumber - If ruleName is "CheckNumberMatchingRule", check number to match
		 * @prop {string} checkNumberNormalized - If ruleName is "CheckNumberMatchingRule", normalized check number to match
		*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.ModifyQueryRemittanceFilter
		 * @description This function can be used to customize the filter for finding remittances that can be matched to this payment.
		 * @param {Sys.Helpers.LdapUtil.IFilter[]} filters original filters that would be used to find matchable remittances.
		 * @param {Lib.CA.CashApp.Customization.Validation.RemittanceSearchCriteria} searchCriteria the criteria that were used when building the default filter
		 * @returns {Sys.Helpers.LdapUtil.IFilter[]} Updated filters to find remittances. Values will be ANDed together. Return null to use default filters
		 * @example <caption>This example prevents matching against remittances that have a check number when doing an exact amount search</caption>
		 * ModifyQueryRemittanceFilter: function (filters, searchCriteria)
		 * {
		 * 	if (searchCriteria.ruleName !== "ExactAmountMatchingRule")
		 * 	{
		 * 		return null;
		 * 	}
		 * 	filters.push(
		 * 		Sys.Helpers.LdapUtil.FilterOr(
		 * 			Sys.Helpers.LdapUtil.FilterNotEqual("Check_Number__", "*"),
		 * 			Sys.Helpers.LdapUtil.FilterEqual("Check_Number__", "")
		 * 		)
		 * 	);
		 * 	return filters;
		 * }
		 */
		/*ModifyQueryRemittanceFilter: function (filters, searchCriteria)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.GetNumberOfInvoicesPerChildBatch
		 * @since 334
		 * @description This function can be used to customize how many invoices each child batch process should update. It is strongly recommended not to go below 250 or above 1500 invoices per process.
		 * @param {number} invoiceCount total number of invoices that need to be updated
		 * @returns {number} The number of invoices to include per child batch
		 * @example <caption> This example enforces 500 invoices per child batch regardless of the total number of invoices</caption>
		 * GetNumberOfInvoicesPerChildBatch: function (invoiceCount)
		 * {
		 * 	return 500;
		 * }
		 */
		/*GetNumberOfInvoicesPerChildBatch: function (invoiceCount)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Validation.CustomizeValidationActions
		 * @since 334
		 * @description
		 * Function called by the Payment Matching process at the start of validation script.
		 * This allows the script action parameters to be customized, namely the action name, action type, and requested action.
		 * This function may be used in tandem with the "CA Bulk Payment Action" process to pass a custom requested action to multiple
		 * payment allocations, then override the action name and type based on that requested action for a specific purpose.
		 * @param {string} actionName The action name the validation script has been run with
		 * @param {string} actionType The action type the validation script has been run with
		 * @param {string} requestedAction The requested action the validation script has been run with
		 * @returns {object} Object containing the customized action parameters
		 *
		 * @example <caption>Override the action name and type based on a custom requested action passed in from an external process</caption>
		 * CustomizeValidationActions: function (actionName, actionType, requestedAction)
		 * {
		 * 	if (requestedAction === "Z_MassRejectPayments")
		 * 	{
		 * 		actionType = "approve";
		 * 		actionName = "reject";
		 * 	}
		 * 	return {
		 *		actionName: actionName,
		 *		actionType: actionType,
		 *		requestedAction: requestedAction
		 * 	};
		 * }
		 */
		/*CustomizeValidationActions: function (actionName, actionType, requestedAction)
		{
		},*/

		/**
		 * Definition of Lib.CA.Payment.Allocate.Common.SuggestionReasons
		 * @interface Lib.CA.Payment.Allocate.Common.SuggestionReasons
		 * @prop {string} ExactAmountInvoice "_SuggestionReasonExactAmountInvoice"
		 * @prop {string} InvoiceCombination "_SuggestionReasonInvoiceCombination"
		 * @prop {string} InvoiceCombinationPlural "_SuggestionReasonInvoiceCombinationPlural"
		 * @prop {string} InvoiceNumberFromDescription "_SuggestionReasonInvoiceNumberFromDescription"
		 * @prop {string} InvoiceNumberFromDescriptionPlural "_SuggestionReasonInvoiceNumberFromDescriptionPlural"
		 * @prop {string} MostOverdueInvoice "_SuggestionReasonMostOverdueInvoice"
		 * @prop {string} OverpaymentExactAmountInvoice "_SuggestionReasonOverpaymentExactAmountInvoice"
		 * @prop {string} OverpaymentInvoiceCombination "_SuggestionReasonOverpaymentInvoiceCombination"
		 * @prop {string} OverpaymentInvoiceCombinationPlural "_SuggestionReasonOverpaymentInvoiceCombinationPlural"
		 * @prop {string} OverpaymentInvoiceNumberFromDescription "_SuggestionReasonOverpaymentInvoiceNumberFromDescription"
		 * @prop {string} OverpaymentInvoiceNumberFromDescriptionPlural "_SuggestionReasonOverpaymentInvoiceNumberFromDescriptionPlural"
		 * @prop {string} RemittanceAmount "_SuggestionReasonRemittanceAmount"
		 * @prop {string} RemittanceAmountPlural "_SuggestionReasonRemittanceAmountPlural"
		 * @prop {string} RemittanceAmountPayer "_SuggestionReasonRemittanceAmountPayer"
		 * @prop {string} RemittanceAmountPayerPlural "_SuggestionReasonRemittanceAmountPayerPlural"
		 * @prop {string} RemittanceCheckNumber "_SuggestionReasonRemittanceCheckNumber"
		 * @prop {string} RemittanceCheckNumberPayer "_SuggestionReasonRemittanceCheckNumberPayer"
		 * @prop {string} RemittanceFromDescription "_SuggestionReasonRemittanceFromDescription"
		 * @prop {string} RemittanceFromDescriptionPlural "_SuggestionReasonRemittanceFromDescriptionPlural"
		 * @prop {string} ShortPaymentExactAmountInvoice "_SuggestionReasonShortPaymentExactAmountInvoice"
		 * @prop {string} ShortPaymentInvoiceCombination "_SuggestionReasonShortPaymentInvoiceCombination"
		 * @prop {string} ShortPaymentInvoiceCombinationPlural "_SuggestionReasonShortPaymentInvoiceCombinationPlural"
		 * @prop {string} ShortPaymentInvoiceNumberFromDescription "_SuggestionReasonShortPaymentInvoiceNumberFromDescription"
		 * @prop {string} ShortPaymentInvoiceNumberFromDescriptionPlural "_SuggestionReasonShortPaymentInvoiceNumberFromDescriptionPlural"
		 * @prop {string} AllocationCreatedFromRemittance "_SuggestionReasonAllocationCreatedFromRemittance"
		 * @prop {string} AllOpenInvoices "_SuggestionReasonAllOpenInvoices"
		 * @prop {string} AllOverdueInvoices "_SuggestionReasonAllOverdueInvoices"
		 * @prop {string} OldestInvoicesFirst "_SuggestionReasonOldestInvoicesFirst"
		 * @prop {string} CustomRecycleMatch "_SuggestionReasonCustomRecycleMatch"
		 * @prop {string} CustomRecycleMatchPlural "_SuggestionReasonCustomRecycleMatchPlural"
		 * @prop {string} SavedAllocation "_SuggestionReasonSavedAllocation"
		 * @prop {string} Rule "_SuggestionReasonRule"
		*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.CustomizeAllocations
		 * @since 334
		 * @description
		 * Allows customizing the suggested allocations for a given payment. Can be used to add, modify, or remove suggestions.
		 * See {@link Lib.CA.Payment.Allocate.Common.SuggestionReasons Lib.CA.Payment.Allocate.Common.SuggestionReasons} for full list of suggestion reasons
		 * @param {Lib.CA.Payment.Matches.Allocation[]} allocations the list of allocation suggestions found
		 * @param {Lib.CA.Payment.MatchingItems.Invoice[]} invoices the list of invoices found that should be added to the invoices table
		 * @example <caption>The following example removes any additional suggestions if the first suggestion is a remittance match on more than just paid amount</caption>
		 * CustomizeAllocations: function (allocations, invoices)
		 * {
		 * 	let remittanceSuggestionReasons = [
		 * 		"_SuggestionReasonRemittanceAmountPayer",
		 * 		"_SuggestionReasonRemittanceAmountPayerPlural",
		 * 		"_SuggestionReasonRemittanceCheckNumber",
		 * 		"_SuggestionReasonRemittanceCheckNumberPayer",
		 * 		"_SuggestionReasonRemittanceFromDescription",
		 * 		"_SuggestionReasonRemittanceFromDescriptionPlural"
		 * 	];
		 * 	if (allocations.length > 1 && remittanceSuggestionReasons.includes(allocations[0].suggestionReason))
		 * 	{
		 * 		allocations.length = 1;
		 * 	}
		 * }
		 */
		/*CustomizeAllocations: function (allocations, invoices)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.BeforeAllocationChecks
		 * @since 334
		 * @description
		 * Called after allocation suggestions have been added but before touchless checks have been evaluated
		 * @param {boolean} isInTouchless true if currently in touchless
		 * @param {boolean} isTouchlessEnabled true if touchless is enabled for the payer
		 */
		/*BeforeAllocationChecks: function (isInTouchless, isTouchlessEnabled)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.RemittanceLineRequiresCustomHandling
		 * @since 338
		 * @description
		 * Returns true if a line from a remittance advice needs custom handling to insert onto a payment.
		 * The function {@link Lib.CA.CashApp.Customization.Validation.RemittanceLineCustomHandling RemittanceLineCustomHandling} must be implemented to do the custom handling.
		 * @param {Lib.CA.CashApp.Customization.Validation.RemittanceCDLRecord} invoiceLine remittance line to check if needs custom handling
		 * @returns {boolean} true if the line will be handled with custom handling, false if standard handling should be used
		 */
		/*RemittanceLineRequiresCustomHandling: function (invoiceLine)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Validation.RemittanceLineCustomHandling
		 * @since 338
		 * @description
		 * Allows custom handling for inserting a line from a remittance into a payment allocation
		 * @param {Lib.CA.Payment.Matches.Remittance} remittanceAllocation the remittance allocation object
		 * @param {Lib.CA.CashApp.Customization.Validation.RemittanceCDLRecord[]} invoiceLines array of invoice lines requiring custom handling
		 * @param {Lib.CA.QueryHelper.Server.CrossCompanyCodeSettings} crossCompanyCodeSettings company code settings for querying invoices
		 * @example <caption>This example allows expanding a single remittance line into multiple invoice lines, using a consolidate invoice number</caption>
		 * RemittanceLineCustomHandling: function (remittanceAllocation, invoiceLines, crossCompanyCodeSettings)
		 * {
		 * 		let consolidatedInvoiceLines = [];
		 * 		let consolidatedInvoiceRegex = /^99[0-9]{8}$/; //10 digit Invoice References starting with 99 are consolidated Invoices
		 * 		let filters = [];
		 * 		for (let invoiceLine of invoiceLines)
		 * 		{
		 * 			const currentLineType = invoiceLine.Line_Col_document_type__;
		 * 			if ((currentLineType === Lib.CA.Remittance.Common.RemittanceItemType.Other) && consolidatedInvoiceRegex.exec(invoiceLine.Line_Col_invoice_number__))
		 * 			{
		 * 				let index = consolidatedInvoiceLines.findIndex(consolidatedLine => consolidatedLine.Line_Col_invoice_number__ === invoiceLine.Line_Col_invoice_number__);
		 * 				if (index > -1)
		 * 				{
		 * 					// adds the discount and total amount if a consolidated invoice is repeated on the remittance
		 * 					consolidatedInvoiceLines[index].Line_Col_invoice_total_amount__ += invoiceLine.Line_Col_invoice_total_amount__;
		 * 					consolidatedInvoiceLines[index].Line_Col_invoice_disputed_amount__ += invoiceLine.Line_Col_invoice_disputed_amount__;
		 * 				}
		 * 				else
		 * 				{
		 * 					consolidatedInvoiceLines.push(invoiceLine);
		 * 					filters.push(`(Invoice_sequence_number__ =${invoiceLine.Line_Col_invoice_number__})`);
		 * 				}
		 * 			}
		 * 		}
		 * 		let filter = Sys.Helpers.LdapUtil.FilterAnd(
		 * 			Sys.Helpers.LdapUtil.FilterEqual("Deleted", "0"),
		 * 			Sys.Helpers.LdapUtil.FilterIn("State", ["100", "200"]),
		 * 			Sys.Helpers.LdapUtil.FilterRaw(crossCompanyCodeSettings.companyCodeFilter),
		 * 			Sys.Helpers.LdapUtil.FilterOr(...filters)
		 * 		);
		 * 		let filterString = filter.toString();
		 * 		let invoices = Lib.CA.QueryHelper.Server.QueryInvoices(filterString);
		 * 		let invoiceMap = {};
		 * 		invoices.forEach((invoice) =>
		 * 		{
		 * 			let consolidatedInvoiceNumber = invoice.PurchaseOrderReference || "";
		 * 			invoiceMap[consolidatedInvoiceNumber] = invoiceMap[consolidatedInvoiceNumber] || [];
		 * 			invoiceMap[consolidatedInvoiceNumber].push(invoice);
		 * 		});
		 * 		consolidatedInvoiceLines.forEach(function (invoiceLine)
		 * 		{
		 * 			let consolidatedInvoiceNumber = invoiceLine.Line_Col_invoice_number__;
		 * 			let invoices = invoiceMap[consolidatedInvoiceNumber];
		 * 			if (!invoices || invoices.length === 0)
		 * 			{
		 * 				remittanceAllocation.AllInvoiceFound = false;
		 * 			}
		 * 			else
		 * 			{
		 * 				let consolidatedLineTotalAmount = invoiceLine.Line_Col_invoice_total_amount__;
		 * 				let consolidatedLineTotalDiscount = invoiceLine.Line_Col_invoice_disputed_amount__;
		 * 				let invoiceTotalOutstandingAmount = invoices.reduce((n, { OutstandingAmount, DiscountOutstandingAmount }) => n + (DiscountOutstandingAmount || OutstandingAmount), 0);
		 * 				if (invoiceTotalOutstandingAmount !== 0)
		 * 				{
		 * 					remittanceAllocation.AllInvoicePaid = false;
		 * 				}
		 * 				let invoiceTotalDiscountAmount = invoices.reduce((n, { DiscountAmount }) => n + DiscountAmount, 0);
		 * 				let discountVariance = Math.abs(consolidatedLineTotalDiscount) - Math.abs(invoiceTotalDiscountAmount);
		 * 				let totalDiscrepancy = consolidatedLineTotalAmount - invoiceTotalOutstandingAmount + discountVariance;
		 * 				invoices.forEach(function (invoice, index)
		 * 				{
		 * 					if (invoice)
		 * 					{
		 * 						Lib.CA.MatchingEngine.RemittanceMatchingRuleBase.AddInvoiceToRemittanceAllocation(remittanceAllocation, invoice, invoiceLine);
		 * 						//Any discrepancy is added to the first invoice found using the consolidated invoice reference
		 * 						invoice.DiscountAmount = invoice.MaxDiscountAmount;
		 * 						invoice.AllocatedAmount = invoice.OutstandingAmount;
		 * 						if (index === 0 && totalDiscrepancy !== 0)
		 * 						{
		 * 							invoice.AllocatedAmount += totalDiscrepancy;
		 * 						}
		 * 						//Any discount variance is added to the first invoice found using the consolidated invoice reference
		 * 						if (index === 0 && discountVariance !== 0)
		 * 						{
		 * 							invoice.DiscountAmount += discountVariance;
		 * 						}
		 * 					}
		 * 				});
		 * 			}
		 * 		});
		 * }
		 */
		/*RemittanceLineCustomHandling: function (remittanceAllocation, invoiceLines, crossCompanyCodeSettings)
		{
		},*/


	};
	return Validation;
})();
