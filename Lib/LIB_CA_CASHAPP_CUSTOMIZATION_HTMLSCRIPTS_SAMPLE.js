/* LIB_DEFINITION{
  "name": "LIB_CA_CASHAPP_CUSTOMIZATION_HTMLSCRIPTS_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "CLIENT",
  "versionable": false,
  "comment": "Cash application additional processing in payment allocation form",
  "require": []
}*/

/**
 * This module contains functions allowing to
 * - perform additional processing in payment allocation form
 * - customize the display/functionality of various fields in the payment allocation form
 * @namespace Lib.CA.CashApp.Customization.HTMLScripts
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.CashApp = Lib.CA.CashApp || {};
Lib.CA.CashApp.Customization = Lib.CA.CashApp.Customization || {};

Lib.CA.CashApp.Customization.HTMLScripts = (function ()
{
	/**
	 * @lends Lib.CA.CashApp.Customization.HTMLScripts
	 */
	var HTMLScripts =
	{
		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.CustomHtmlScriptInitialization
		 * @description
		 * Function called at the end of payment allocation custom script initialization
		 * @example <caption>This example updates the customer adjustment table status icon after a custom field is modified</caption>
		 * CustomHtmlScriptInitialization: function()
		 * {
		 * 	var iconHelper = Lib.CA.PaymentMatching.Client.GetCustomerTableIconHelper();
		 * 	Controls.Allocate_To_Customer_Table__.Z_Company_Code__.OnChange = function()
		 * 	{
		 * 		iconHelper.RefreshStatusColumn(true);
		 * 	};
		 * }
		 */
		/*CustomHtmlScriptInitialization: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.GetCustomTooltipColumnIdentifiers
		 * @description
		 * Customizes which fields appear in the tooltip next to the invoice number on the payment
		 * allocation form. This function should return an array of strings. Each string should be
		 * the technical name of a column in the payment allocation's invoices table, or the technical
		 * name of a field on the invoice. The strings may also specify an override label to display
		 * for the field in the tooltip, as explained below.
		 *
		 * For each invoice field name returned, we will query the invoice record on the row and
		 * populate the tooltip with the data from those fields.
		 *
		 * For each column name returned, the column's data for each row in the invoices table will
		 * be displayed in the row's tooltip instead, and the column itself will be hidden. Only
		 * columns with data that cannot change within the payment allocation form are allowed; other
		 * column names in the array are ignored.
		 *
		 * The unallowed/ignored column names include:
		 * - "Col_selected__", "Col_match__", "Col_discount_amount__", "Col_net_amount__", "Col_allocated_paid_amount__", "Col_allocated_amount__", "Col_remaining_amount__", "Col_GL_account__", "Col_GL_amount__"
		 *
		 * Two of the allowed columns have special handling:
		 * - "Col_invoice_link__" will put the invoice number in the tooltip as a link to the invoice, but the column will not be hidden.
		 * - "Col_customer_id__" will be displayed in the tooltip as a link to the customer.
		 *
		 * Additional column names can be used by adding a custom column to the invoices table on the
		 * payment matching form and implementing the user exit {@link Lib.CA.Customization.Common.CustomizeStoredInvoiceFields}.
		 * Custom columns that can change within the payment allocation form should NOT be displayed in
		 * the tooltip, as they will not be updated properly.
		 *
		 * Each string in the array returned by this user exit may optionally include a label for the value
		 * that will appear in the tooltip. To do this, provide both the technical column/field name
		 * and the override label delimited by "|". Labels for column name fields will default to the
		 * column heading, however labels for invoice fields will default to the field's technical name.
		 * This isn't very user friendly, so it's recommended that override labels are provided for
		 * all invoice fields.
		 *
		 * If an empty array is returned, then no columns will be hidden, and the tooltip will not
		 * appear. If null is returned, or this user exit is not implemented at all, then a default
		 * set of columns will be moved to the tooltip.
		 *
		 * The default column names include:
		 * - "Col_invoice_link__", "Col_customer_id__", "Col_invoice_date__", "Col_invoice_discount_amount__", "Col_discount_expiration_date__", "Col_purchase_order_number__"
		 *
		 * In the example below, we will display the invoice link, customer ID, and purchase order
		 * number in the tooltip. The invoice link and PO number will be labeled by default as "Invoice
		 * number" and "Order number", and the customer ID will be labeled as "Link to customer". The
		 * tooltip will also display the customer email and phone number from the invoice, labeled as
		 * "Customer email address" and "Customer phone number".
		 * @param {string[]} defaultTooltipColumns The default list of columns included in the tooltip
		 * @returns {string[]} names of the columns to display in the tooltip instead of in the table directly
		 * @example <caption>This example overrides the default tooltip columns</caption>
		 * GetCustomTooltipColumnIdentifiers: function(defaultTooltipColumns)
		 * {
		 * 	return ["Col_invoice_link__",
		 * 		"Col_customer_id__|Link to customer",
		 * 		"Col_purchase_order_number__",
		 * 		"Customer_email__|Customer email address",
		 * 		"Customer_phone__|Customer phone number"];
		 * }
		 * @example <caption>This example adds currency to the default list of tooltip columns</caption>
		 * GetCustomTooltipColumnIdentifiers: function(defaultTooltipColumns)
		 * {
		 * 	return defaultTooltipColumns.concat("Col_currency__");
		 * }
		 */
		/*GetCustomTooltipColumnIdentifiers: function(defaultTooltipColumns)
		{
			return null;
		},*/

		/**
		 * Type definition for TooltipInfo
		 * @memberof Lib.CA.CashApp.Customization.HTMLScripts
		 * @typedef {Object} TooltipInfo
		 * @property {string} Name technical name of the field the data is coming from
		 * @property {string} Label label to display alongside the data in the tooltip
		 */

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.GetCustomDeductionTooltipInformation
		 * @description
		 * Customizes which additional attributes should be displayed in the tooltip of deduction documents. This is only used if the deductions application is enabled.
		 * These default attributes are already displayed in the tooltip:
		 * - "Document_number__", "Customer_ID__", "Customer_name__", "Deduction_type__", "Document_date__", "Claim_amount__", "Refered_to_invoice__", "Document_status__", "Credit_note_number__"
		 *
		 * The additional attributes listed in this function will be displayed following the default attributes in the tooltip
		 * @returns {Lib.CA.CashApp.Customization.HTMLScripts.TooltipInfo[]} name and labels of additional fields to display in the tooltip
		 * @example <caption>This example adds dispute reason and disputed amount to the tooltip</caption>
		 * GetCustomDeductionTooltipInformation: function()
		 * {
		 * 	return [{Name: "Dispute_reason__", Label: "Dispute Reason"},
		 * 		{Name: "Disputed_net_amount__", Label: "Disputed Net Amount"}];
		 * }
		 */
		/*GetCustomDeductionTooltipInformation: function()
		{
			return null;
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.AddCustomInvoiceTableOptions
		 * @description
		 * Builds new custom table options for the invoice table.
		 * These must be handled in the {@link Lib.CA.CashApp.Customization.HTMLScripts.HandleCustomInvoiceTableOption HandleCustomInvoiceTableOption} user exit.
		 * @returns {Array<string[]>} This is an array of string arrays. Each item should be formatted as such: [Label, Name]
		 * Label will be the the displayed label of the item in the context menu
		 * Name is what will be passed back once the item is clicked on in the context menu and must be handled in HandleCustomInvoiceTableOption
		 * @example <caption>Create one custom option with label "Select All Non-Credit Notes" and name "SelectNonCredits". See example in HandleCustomInvoiceTableOption for handling</caption>
		 * AddCustomInvoiceTableOptions: function()
		 * {
		 * 	var customMenu = [];
		 * 	customMenu.push(["Select All Non-Credit Notes", "SelectNonCredits"]);
		 * 	return customMenu;
		 * }
		 */
		/*AddCustomInvoiceTableOptions: function ()
		{
			return null;
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.HandleCustomInvoiceTableOption
		 * @description
		 * This handles custom table options created in {@link Lib.CA.CashApp.Customization.HTMLScripts.AddCustomInvoiceTableOptions AddCustomInvoiceTableOptions}
		 * @param {string} name The name of the table option being passed in.
		 * @returns {boolean | string} Return falsy if we didn't handle the custom option - in this case, the user will be notified with a popup dialog, otherwise return truthy.
		 * Return "DoNotResetAmounts" if the custom option will update invoice amounts and/or we don't want to reset the invoice amounts after the custom option is handled.
		 * @example <caption>Select each line in the invoices table that is not a credit note. The handling of newly selected/unselected lines is done after 'true' is returned.</caption>
		 * HandleCustomInvoiceTableOption: function(name)
		 * {
		 * 	switch (name)
		 * 	{
		 * 		case "SelectNonCredits":
		 * 			var invoicesTable = Data.GetTable("Invoices_table__");
		 * 			invoicesTable.ForEachItem(function (item)
		 *			{
		 *				if (item.GetValue("Col_outstanding_amount__") > 0)
		 * 				{
		 * 					item.SetValue("Col_selected__", true);
		 * 				}
		 *			});
		 * 			return true;
		 * 		default:
		 * 			return false;
		 * 	}
		 * }
		 */
		/*HandleCustomInvoiceTableOption: function (name)
		{
			return false;
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.AddCustomInvoiceTableLineOptions
		 * @description
		 * Builds new custom table options at the line level for the invoice table.
		 * These must be handled in the {@link Lib.CA.CashApp.Customization.HTMLScripts.HandleCustomInvoiceTableLineOption HandleCustomInvoiceTableLineOption} user exit.
		 * @returns {Array<string[]>} This is an array of string arrays. Each item should be formatted as such: [Label, Name]
		 * Label will be the the displayed label of the item in the context menu
		 * Name is what will be passed back once the item is clicked on in the context menu and must be handled in HandleCustomInvoiceTableOption
		 * @example <caption>Create one custom option with label "Allocate payment remaining amount" and name "PayRemainAmount". See example in HandleCustomInvoiceTableLineOption for handling</caption>
		 * AddCustomInvoiceTableLineOptions: function()
		 * {
		 * 	var customMenu = [];
		 * 	customMenu.push(["Allocate payment remaining amount", "PayRemainAmount"]);
		 * 	return customMenu;
		 * }
		 */
		/*AddCustomInvoiceTableLineOptions: function ()
		{
			return null;
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.HandleCustomInvoiceTableLineOption
		 * @description
		 * This handles custom table options created in {@link Lib.CA.CashApp.Customization.HTMLScripts.AddCustomInvoiceTableLineOptions AddCustomInvoiceTableLineOptions}
		 * @param {string} name The name of the table option being passed in.
		 * @param {number} unused Row in whole table after filtering. Use item instead.
		 * @param {Item} item The invoice table item of the line that was clicked on.
		 * @returns {bool} Return true if we handled a custom option in this function, otherwise return false.
		 * @example <caption>Selects the associated line and allocate remaining payment amount towards the invoice outstanding amount.</caption>
		 * HandleCustomInvoiceTableLineOption: function(name, unused, item)
		 * {
		 * 	switch (name)
		 * 	{
		 *		case "PayRemainAmount":
		 *			var outstandingAmount = item.GetValue("Col_outstanding_amount__");
		 *			var remainingAmount = Data.GetValue("Remaining_amount__");
		 *			item.SetValue("Col_allocated_paid_amount__", Math.min(outstandingAmount, remainingAmount));
		 *			item.SetValue("Col_selected__", true);
		 *			return true;
		 * 		default:
		 * 			return false;
		 * 	}
		 * }
		 */
		/*HandleCustomInvoiceTableLineOption: function (name, unused, item)
		{
			return false;
		},*/

		/**
		 * Definition of Lib.CA.PaymentMatching.SearchHelper.MultiCriteriaSearchField
		 * @interface Lib.CA.PaymentMatching.SearchHelper.MultiCriteriaSearchField
		 * @prop {string} fieldName technical name of the field to search on
		 * @prop {string} searchMode operator to use. Options are "Equals", "Not equal to", "Less than", "Less than or equal to", "Greater than", "Greater than or equal to", "Starts with", "Contains", "Does not contain"
		 * @prop {string | null} [fieldType] "Decimal" for numbers, "Date" for dates, or 'null' for other general text fields
		 * @prop {boolean} [splitOnSpacesOrCommas] true if a search term such as "4870001 4870002" should be split as "4870001" OR "4870002" for this field
		 */

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.CustomizeMultiCriteriaSearchFields
		 * @description
		 * This allows specification of custom/non-standard invoice fields to query when manually searching for invoices on the payment allocation form.
		 * The following is the standard list of invoice fields used in the search (these will always be included):
		 * - "Customer_name__", "Customer_ID__", "Invoice_number__", "Invoice_outstanding_amount__", "Discount_outstanding_amount__", "Invoice_total_amount__", "Delivery_Order_Number__", "Purchase_order_number__", "Sales_Order_Number__"
		 *
		 * This can be paired with the user exit {@link Lib.CA.Customization.Common.CustomizeStoredInvoiceFields} in order to also populate custom columns in the invoices table.
		 * @param {Lib.CA.PaymentMatching.SearchHelper.MultiCriteriaSearchField[]} defaultMultiCriteriaInvoiceSearchFields Default list of invoice fields used in the search.
		 * @returns {Lib.CA.PaymentMatching.SearchHelper.MultiCriteriaSearchField[]} List of invoice fields to include in search.
		 * @example <caption>Adds one standard field and four custom fields to search in when looking for invoices.</caption>
		 * CustomizeMultiCriteriaSearchFields: function(defaultMultiCriteriaInvoiceSearchFields)
		 * {
		 * 	var customMultiCriteriaSearchFields =
		 * 	[
		 * 		{
		 * 			fieldName: "Invoice_local_outstanding_amount__",
		 * 			searchMode: "Equals",
		 * 			fieldType: "Decimal"
		 * 		},
		 * 		{
		 * 			fieldName: "Z_Customer_status__",
		 * 			searchMode: "Contains"
		 * 		},
		 * 		{
		 * 			fieldName: "Z_custom_date__",
		 * 			searchMode: "Equals",
		 * 			fieldType: "Date"
		 * 		},
		 * 		{
		 * 			fieldName: "Z_Other_currency_amount__",
		 * 			searchMode: "Equals",
		 * 			fieldType: "Decimal"
		 * 		},
		 * 		{
		 * 			fieldName: "Z_Is_available_checkbox__",
		 * 			searchMode: "Equals"
		 * 		}
		 * 	];
		 * 	return defaultMultiCriteriaInvoiceSearchFields.concat(customMultiCriteriaInvoiceSearchFields);
		 * }
		 * @example <caption>Removes the default Purchase order number field from search when looking for invoices.</caption>
		 * CustomizeMultiCriteriaSearchFields: function(defaultMultiCriteriaInvoiceSearchFields)
		 * {
		 * 	for (var i = 0; i < defaultMultiCriteriaInvoiceSearchFields.length; i++)
		 * 	{
		 * 		if (defaultMultiCriteriaInvoiceSearchFields[i].fieldName === "Purchase_order_number__")
		 * 		{
		 * 			defaultMultiCriteriaInvoiceSearchFields.splice(i, 1);
		 * 			i--;
		 * 		}
		 * 	}
		 * 	return defaultMultiCriteriaInvoiceSearchFields;
		 * }
		 */
		/*CustomizeMultiCriteriaSearchFields: function(defaultMultiCriteriaInvoiceSearchFields)
		{
			return null;
		},*/

		/**
		 * Definition of Lib.CA.PaymentMatching.SearchHelper.TableFilterRow
		 * @interface Lib.CA.PaymentMatching.SearchHelper.TableFilterRow
		 * @prop {string} fieldDisplayName display name of the filter
		 * @prop {string} fieldName technical name of the field to filter on
		 * @prop {string} searchMode default operator to use. Options are "Equals", "Not equal to", "Less than", "Less than or equal to", "Greater than", "Greater than or equal to", "Starts with", "Contains", "Does not contain"
		 * @prop {string | null} [fieldType] "Decimal" for numbers, "Date" for dates, or 'null' for other general text fields
		 * @prop {boolean} [splitOnSpacesOrCommas] true if a search term such as "4870001 4870002" should be split as "4870001" OR "4870002" for this field
		 */

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.CustomizeFilterQueryString
		 * @since 331
		 * @description
		 * This function can be used to modify the query search term entered by the user. For example, if the user entered a search term such as "555221,555222,555223" for Purchase order number, this could be used
		 * to replace the commas with spaces so that the search is able to split correctly into "purchase order equal to 555221 OR 555222 OR 555223".
		 * Invoice numbers can match against the configuration's invoice number regex, while otherwise search terms are simply split on spaces
		 * @param {string} queryString The query string entered by the user.
		 * @param {Lib.CA.PaymentMatching.SearchHelper.MultiCriteriaSearchField | Lib.CA.PaymentMatching.SearchHelper.TableFilterRow} filterField The current filter the query string applies to
		 * @param {"Equals" | "Not equal to" | "Less than" | "Less than or equal to" | "Greater than" | "Greater than or equal to" | "Starts with" | "Contains" | "Does not contain"} operator The selected operator for this filter
		 * @returns {string} the modified query string to use
		 * @example <caption>The following example modifies the search term so that a PO# search where the term is comma-delimited can be split correctly</caption>
		 * CustomizeFilterQueryString: function (queryString, filterField, operator)
		 * {
		 * 	if (filterField.fieldName === "Purchase_order_number__")
		 * 	{
		 * 		queryString = queryString.replace(/,/g, " ");
		 * 	}
		 * 	return queryString;
		 * }
		 */
		/*CustomizeFilterQueryString: function (queryString, filterField, operator)
		{
			return null;
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.CustomizeTableSearchFields
		 * @description
		 * This allows specification of custom/non-standard invoice fields that should be available to the user in the Advanced Table filters when searching for invoices on the payment allocation form.
		 * The following is the standard list of invoice fields used in the search (these will always be included):
		 * - "Customer_name__", "Customer_ID__", "Invoice_number__", "Invoice_outstanding_amount__", "Discount_outstanding_amount__", "Invoice_total_amount__", "Delivery_Order_Number__", "Purchase_order_number__", "Sales_Order_Number__"
		 *
		 * This can be paired with the user exit {@link Lib.CA.Customization.Common.CustomizeStoredInvoiceFields} in order to also populate custom columns in the invoices table.
		 * @param {Lib.CA.PaymentMatching.SearchHelper.TableFilterRow[]} defaultFieldsToInclude Default list of invoice fields available in the filter table.
		 * @returns {Lib.CA.PaymentMatching.SearchHelper.TableFilterRow[]} List of invoice fields to include in filter table.
		 * @example <caption>Adds one standard field and four custom fields to search in when looking for invoices.</caption>
		 * CustomizeTableSearchFields: function(defaultFieldsToInclude)
		 * {
		 * 	var customTableSearchFields =
		 * 	[
		 * 		{
		 * 			fieldDisplayName: "Outstanding amount (local)",
		 * 			fieldName: "Invoice_local_outstanding_amount__",
		 * 			defaultSearchMode: "Equals",
		 * 			fieldType: "Decimal"
		 * 		},
		 * 		{
		 * 			fieldDisplayName: "Customer status",
		 * 			fieldName: "Z_Customer_status__",
		 * 			defaultSearchMode: "Contains"
		 * 		},
		 * 		{
		 * 			fieldDisplayName: "Custom date",
		 * 			fieldName: "Z_custom_date__",
		 * 			defaultSearchMode: "Equals",
		 * 			fieldType: "Date"
		 * 		},
		 * 		{
		 * 			fieldDisplayName: "Other currency amount",
		 * 			fieldName: "Z_Other_currency_amount__",
		 * 			defaultSearchMode: "Equals",
		 * 			fieldType: "Decimal"
		 * 		},
		 * 		{
		 * 			fieldDisplayName: "Is available",
		 * 			fieldName: "Z_Is_available_checkbox__",
		 * 			defaultSearchMode: "Equals"
		 * 		}
		 * 	];
		 * 	return defaultFieldsToInclude.concat(customTableSearchFields);
		 * }
		 * @example <caption>Removes the default Purchase order number field from the available fields in the filter table.</caption>
		 * CustomizeTableSearchFields: function(defaultFieldsToInclude)
		 * {
		 * 	for (var i = 0; i < defaultFieldsToInclude.length; i++)
		 * 	{
		 * 		if (defaultFieldsToInclude[i].fieldName === "Purchase_order_number__")
		 * 		{
		 * 			defaultFieldsToInclude.splice(i, 1);
		 * 			i--;
		 * 		}
		 * 	}
		 * 	return defaultFieldsToInclude;
		 * }
		 */
		/*CustomizeTableSearchFields: function(defaultFieldsToInclude)
		{
			return null;
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.GetTableColumnsToDisplay
		 * @description This function will be called when initializing the ConversationList control. It can be used to customize the columns displayed in conversations.
		 * @param {Object[]} tableColumnsToDisplay - the default columns that will be displayed.
		 * @returns {Object[]} tableColumnsToDisplay the modified array of columns to display
		 * @returns {string} tableColumnsToDisplay.label the label to display for this column
		 * @returns {string} tableColumnsToDisplay.data technical field name for the data
		 * @returns {string} tableColumnsToDisplay.width width as a percentage for this column
		 * @example <caption>Adds an extra column to the conversation control to display the email address of the recipient</caption>
		 * function GetTableColumnsToDisplay(tableColumnsToDisplay)
		 * {
		 * 	tableColumnsToDisplay.push({
		 * 		label : "Email address",
		 * 		data : "emailAddress",
		 * 		width : "20%"
		 * 	});
		 * 	return tableColumnsToDisplay;
		 * }
		 */
		/*GetTableColumnsToDisplay: function (tableColumnsToDisplay)
		{
			return tableColumnsToDisplay;
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.GetConversationInfo
		 * @description This function is called inside all the calls to the GetConversationInfo function, and gives the possibility to change its return value.
		 * @param {object} conversationInfo Object containing the information required to create a conversation.
		 * 	see {@link http://webdoc/eskerondemand/cv_ly/en/manager/startpage.htm#htmlpagescript/control/conversationlistcreateconversationwithitem.html?Highlight=options%20(optional) Control.CreateConversationWithItem} for more information about the available parameters
		 * @returns {object} The updated conversationInfo
		 * @example <caption>Modifies the from name and from email address that will appear to the email's recipient</caption>
		 * GetConversationInfo: function (conversationInfo)
		 * {
		 * 	conversationInfo.Options.fromEmailAddress = "new-email@email.com";
		 * 	conversationInfo.Options.fromName = "new-name";
		 *
		 * 	return conversationInfo;
		 * }
		 * @example <caption>Uses a different conversation HTML template depending on company code</caption>
		 * GetConversationInfo: function (conversationInfo)
		 * {
		 * 	var companyCode = Data.GetValue("Company_code__");
		 * 	if (companyCode === "A01")
		 * 	{
		 * 		conversationInfo.Options.emailTemplate = "CA_Conversation_Payment_A01.htm";
		 * 	}
		 * 	return conversationInfo;
		 * }
		 */
		/*GetConversationInfo: function (conversationInfo)
		{
			return conversationInfo;
		},*/

		/**
		 * @since 338
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.UseQuickCustomerDisplayForConversations
		 * @description
		 * Determine whether to use the "quick customer display" in conversation popups (New Conversation, Reply All, Forward) on the payment matching form. This display will show
		 * all contacts associated with the entered customer number in table format. As of 338, this display is still the default (i.e. as if "true" were returned for this function).
		 * If the quick display is not used, "To" and "CC" fields will be shown instead.
		 * @returns {boolean} true to use the quick customer display, false to instead use the To and CC fields
		 */
		/*UseQuickCustomerDisplayForConversations: function()
		{
		},*/

		/**
		 * @since 338
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.ModifyConversationPopupDefaultOptions
		 * @description
		 * Modify the default options used in the conversation popup on the payment matching form. The conversation object is reset to these options at the start of several events (listed below),
		 * so this user exit may be used for broad changes to conversation behavior. For a more fine-tuned approach, instead use the user exit ModifyConversationPopupOptions, which may be conditionalized
		 * on each event individually.
		 *
		 * Conversation events this user exit is called for:
		 *
		 *   New Conversation,
		 *   Reply All,
		 *   Forward Conversation,
		 *   Forward Message
		 *
		 * @param {object} ConversationPopup the conversation popup object containing its restored default options
		 * @returns {object} The modified conversation popup object
		 * @example <caption>Provide a default email subject when "New conversation" is selected</caption>
		 * ModifyConversationPopupDefaultOptions: function (ConversationPopup)
		 * {
		 *  ConversationPopup.fillNewMessageSubject = true;
		 *  ConversationPopup.DefaultSubject = `Remittance request for payment ${Data.GetValue("Currency__")} ${Data.GetValue("Paid_amount__")} from ${Language.FormatDate(Data.GetValue("Payment_date__"), false)}`;
		 *  return ConversationPopup;
		 * }
		*/
		/*ModifyConversationPopupDefaultOptions: function(ConversationPopup)
		{
		},*/

		/**
		 * @since 338
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.ModifyConversationPopupOptions
		 * @description Modify the options used in the conversation popup on the payment matching form for the different possible conversation events (indicated below under conversationAction). In comparison to
		 * {@link Lib.CA.CashApp.Customization.HTMLScripts.ModifyConversationPopupDefaultOptions ModifyConversationPopupDefaultOptions}, this user exit may be conditionalized on each conversation event individually,
		 * and is also called as the last step before the popup is launched for each event, meaning more options may be overridden.
		 * @param {object} ConversationPopup The conversation popup object
		 * @param {string} conversationAction String indicating the conversation action. Possible values are as follows:
		 *
		 *   "NewConversation",
		 *   "ReplyAll",
		 *   "ForwardConversation",
		 *   "ForwardMessage"
		 *
		 * @returns {object} The modified conversation popup object
		 * @example <caption>Prefill the new conversation popup with a default message</caption>
		 * ModifyConversationPopupOptions: function (ConversationPopup, conversationAction)
		 * {
		 *	const defaultConversationMessage = `Hi,<br><br>Could you please provide remittance information for the payment of ${Data.GetValue("Currency__")} ${Data.GetValue("Paid_amount__")} made on `
		 *  + `${Language.FormatDate(Data.GetValue("Payment_date__"), false)}?<br><br>Thanks,<br>${User.fullName}`;
		 *	switch (conversationAction)
		 *	{
		 *		case "NewConversation":
		 *			ConversationPopup.filledMessageBodyWithPreferredReplyTemplate = true;
		 *			ConversationPopup.PrefilledMessage = defaultConversationMessage;
		 *			break;
		 *		default:
		 *			break;
		 *	}
		 *	return ConversationPopup;
		 * }
		 **/
		/*ModifyConversationPopupOptions: function (ConversationPopup, conversationAction)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.AllowNonMatchingCustomerAdjustments
		 * @description This function is used to override the default behavior of requiring customers in the adjustment tables to exist in the database.
		 * If this function returns true, a warning will be added for customer IDs that don't exist instead of error.
		 * @returns {bool} True if warnings should be added for customers that don't exist in the database rather than an error
		 */
		/*AllowNonMatchingCustomerAdjustments: function ()
		{
			return true;
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.UseCustomGLGrouping
		 * @description This function is used to override the default grouping of G/L adjustments when creating adjustments from the invoices table. By default, a separate G/L adjustment is made
		 * for each customer with a selected invoice that needs an adjustment. This functionality applies to the "move selected discounts to G/L adjustment entries" action as well as any G/L adjustments that
		 * are created when using the "close selected invoices" feature.
		 * Use in conjunction with the {@link Lib.CA.CashApp.Customization.HTMLScripts.GetCustomGLGroupingValue GetCustomGLGroupingValue} function, and the equivalent functions in {@link Lib.CA.CashApp.Customization.Validation.UseCustomGLGrouping} to handle system-created adjustments
		 * @returns {bool} True if custom grouping should be used instead of the default
		 */
		/*UseCustomGLGrouping: function ()
		{
			return true;
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.GetCustomGLGroupingValue
		 * @description This function is used to override the default grouping of G/L adjustments when creating adjustments from the invoices table. By default, a separate G/L adjustment is made
		 * for each customer with a selected invoice that needs an adjustment. This functionality applies to the "move selected discounts to G/L adjustment entries" action as well as any G/L adjustments that
		 * are created when using the "close selected invoices" feature.
		 * Use in conjunction with {@link Lib.CA.CashApp.Customization.HTMLScripts.UseCustomGLGrouping UseCustomGLGrouping} and optionally {@link Lib.CA.CashApp.Customization.HTMLScripts.CustomizeGroupedGLAdjustment CustomizeGroupedGLAdjustment}, and the equivalent functions in {@link Lib.CA.CashApp.Customization.Validation.GetCustomGLGroupingValue} to handle system-created adjustments
		 * @param {Item} item Object representing an invoice that needs an adjustment.
		 * @returns {string} The value that should be used to group this adjustment with adjustments from other invoices
		 * @example <caption>This example returns a delimited key containing the standard field for Customer and a custom field for Cost center</caption>
		 * GetCustomGLGroupingValue: function (item)
		 * {
		 * 	var customer = item.GetValue("Col_customer_id__");
		 * 	var costCenter = item.GetValue("Custom_Col_Cost_Center");
		 *
		 * 	return customer + "|" + costCenter;
		 * }
		 */
		/*GetCustomGLGroupingValue: function (item)
		{
			return "";
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.CustomizeGroupedGLAdjustment
		 * @description This function is used to modify the G/L adjustment created when creating adjustments from the invoices table. The key returned by {@link Lib.CA.CashApp.Customization.HTMLScripts.GetCustomGLGroupingValue GetCustomGLGroupingValue} can
		 * be parsed for the information needed to customize the adjustment. The equivalent function for system-created adjustments is {@link Lib.CA.CashApp.Customization.Validation.CustomizeGroupedGLAdjustment}
		 * @param {Item} item The created adjustment to be modified
		 * @param {string} key The associated key returned by GetCustomGLGroupingValue to parse
		 * @example <caption>This example parsed a key containing customer & cost center, and sets both fields accordingly</caption>
		 * CustomizeGroupedGLAdjustment: function (item, key)
		 * {
		 * 	var keyArray = key.split("|");
		 * 	var customer = keyArray[0];
		 * 	var costCenter = keyArray[1];
		 *
		 * 	item.SetValue("Col_Customer_Info__", customer);
		 * 	item.SetValue("Col_cost_center__", costCenter);
		 * }
		 */
		/*CustomizeGroupedGLAdjustment: function (item, key)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.DisableSkipFuturePaymentByPayer
		 * @description This function is used to disable the checkbox for skipping future payments by payer name when rejecting a payment or allocating manually in the ERP.
		 * If this function returns true, then the checkbox for skipping future payments by payer name will not be shown in the popup.
		 * @returns {bool} True to disable the checkbox for skipping payments by payer name
		 */
		/*DisableSkipFuturePaymentByPayer: function ()
		{
			return true;
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.GetRemittanceProcessingConfiguration
		 * @description This function is used to specify the remittance advice processing configuration name that will be applied when processing remittance attached to a conversation reply with the payer.
		 * If no configuration name is provided, the default configuration will be applied.
		 * @returns {string} Configuration name to process the attached remittance advice
		 */
		/*GetRemittanceProcessingConfiguration: function ()
		{
			return null;
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.UseCustomCustomerGrouping
		 * @description This function is used to override the default grouping of Customer adjustments when creating adjustments from the invoices table. By default, a separate Customer adjustment is made
		 * for each customer with a selected invoice that needs an adjustment. This functionality applies to the adjustments that are created when using the "close selected invoices" feature.
		 * Use in conjunction with the {@link Lib.CA.CashApp.Customization.HTMLScripts.GetCustomCustomerGroupingValue GetCustomCustomerGroupingValue}
		 * @returns {bool} True if custom grouping should be used instead of the default
		 */
		/*UseCustomCustomerGrouping: function ()
		{
			return true;
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.GetCustomCustomerGroupingValue
		 * @description This function is used to override the default grouping of Customer adjustments when creating adjustments from the invoices table. By default, a separate Customer adjustment is made
		 * for each customer with a selected invoice that needs an adjustment.
		 * Use in conjunction with {@link Lib.CA.CashApp.Customization.HTMLScripts.UseCustomCustomerGrouping UseCustomCustomerGrouping} and optionally {@link Lib.CA.CashApp.Customization.HTMLScripts.CreateCustomerAdjustment}
		 * @param {Item} item Object representing an invoice that needs an adjustment.
		 * @returns {string} The value that should be used to group this adjustment with adjustments from other invoices
		* @example <caption>This example shows an equivalent implementation of the default behavior</caption>
		* GetCustomCustomerGroupingValue: function (item)
		* {
		*	return item.GetValue("Col_customer_id__");
		* }
		*/
		/*GetCustomCustomerGroupingValue: function (item)
		{
			return "";
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.CreateCustomerAdjustment
		 * @description This function is used to modify any Customer adjustment created.
		 * Includes Post buttons, adjustments, move discounts, Move from GL, Recycle, plus button, ...
		 * Col_Verify_export__ can filter out withholding adjustments
		 * @param {Item} item The created adjustment to be modified
		 * @param {string} key The associated key returned by GetCustomCustomerGroupingValue to parse
		 * @param {Lib.CA.Customization.Common.DefaultAdjustmentSetting} adjustmentSettings Over/Under payment settings if needed
		 * @param {Item} selectedItem - if moving from GL, this is that original GL item
		 * @param {Item[]} invoiceItemList - if adjusting an invoice or moving the discount
		 * @example <caption>This example moves some data from a GL row to a Customer row, and sets the reason code field always</caption>
		 * CreateCustomerAdjustment: function (item, key, adjustmentSettings, selectedItem, invoiceItemList)
		 * {
		 * 	//Moving GL to Customer
		 * 	if (selectedItem && item)
		 * 	{
		 * 		//Move between custom columns
		 * 		item.SetValue("Z_Customer_Adj__", selectedItem.GetValue("Z_GL_Column__"));
		 * 	}
		 * 	//This will be set on ANY created customer adjustment
		 * 	item.SetValue("Reason_Code__", "101");
		 * }
		 */
		/*CreateCustomerAdjustment: function (item, key, adjustmentSettings, selectedItem, invoiceItemList)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.CreateGLAdjustment
		 * @description This function is used to modify any GL adjustment created.
		 * Includes Post buttons, adjustments, move discounts, Move from Customer, Withholding Tax, ...
		 * @param {Item} item The created adjustment to be modified
		 * @param {string} key The associated key returned by GetCustomGLGroupingValue to parse
		 * @param {Lib.CA.Customization.Common.DefaultAdjustmentSetting} adjustmentSettings Over/Under payment settings if needed
		 * @param {Item} selectedItem - if moving from Customer adjustment, this is that original adjustment
		 * @param {Item[]} invoiceItemList - if adjusting an invoice or moving the discount
		 * @example <caption>This example shows how to set data when adjusting invoices, moving from a customer adjustment, and on all GL rows</caption>
		 * CreateGLAdjustment: function (item, key, adjustmentSettings, selectedItem, invoiceItemList)
		 * {
		 * 	//Adjusting Invoices
		 * 	if (invoiceItemList && invoiceItemList[0])
		 * 	{
		 * 		//Values just set but only when adjusted
		 * 		item.SetValue("Col_account_number__", "12345");
		 * 		//Need information like Invoice Number from the invoice
		 * 		var invoiceNumber;
		 * 		invoiceNumber = invoiceItemList[0].GetValue("Col_invoice_number__");
		 * 		item.SetValue("Col_GL_Document_Number__", invoiceNumber); //Set to first invoice number in group
		 * 	}
		 * 	//Moving Customer adjustment to GL
		 * 	if (selectedItem)
		 * 	{
		 * 		//Move between custom columns
		 * 		item.SetValue("Z_GL_Column__", selectedItem.GetValue("Z_Customer_Adj__"));
		 * 	}
		 * 	//Value set on all new lines
		 * 	item.SetValue("Col_cost_center__", "90090");
		 * }
		 */
		/*CreateGLAdjustment: function (item, key, adjustmentSettings, selectedItem, invoiceItemList)
		{
		},*/

		/**
		 * Definition of RefreshFormOptions
		 * @interface Lib.CA.CashApp.Customization.HTMLScripts.RefreshFormOptions
		 * @prop {boolean} refreshAssociatedCustomerPane
		 * @prop {boolean} updateAllocationSums
		 * @prop {boolean} refreshAccountAllocateItems
		 * @prop {boolean} updateAmountsPreview
		 * @prop {boolean} refreshAllocateButton
		 * @prop {boolean} showError
		 * @prop {boolean} refreshRuleBoxes
		*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.RefreshForm
		 * @description This function is called at the end of RefreshForm.
		 * This could be used to do any custom operations when the form is refreshed.
		 * Beware of doing performance intensive operations or considering using options to limit the impact.
		 * @param {Lib.CA.CashApp.Customization.HTMLScripts.RefreshFormOptions} options specifies what thing we are trying to refresh, may be helpful to limit performance impact
		 */
		/*RefreshForm: function (options)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.CustomizeWarningMessages
		 * @description This function is called after creating the buffer of warning message content,
		 * but before it is shown. You can add or take away from what is in there.
		 * @param {string} buffer the current messages text
		 * @param {string[]} warningMsg Variable "WarningLabelReason"
		 * @param {string[]} infoMsg Variable "InfoLabelReason"
		 * @param {string[]} newCustomerWarning Variable "NewCustomerForPayer"
		 * @param {string[]} unavailableInvoicesWarnings Variable "UnavailableInvoiceWarnings"
		 * @param {boolean} anyInvoiceWithoutArchiving Variable "AnyInvoiceWithoutArchiving"
		 * @param {string[]} associatedCustomerList current customer list on payment
		 * @returns {string} new buffer of warning message content, or null to keep existing
		 * @example
		 * CustomizeWarningMessages: function (buffer, warningMsg, infoMsg, newCustomerWarning, unavailableInvoicesWarnings, anyInvoiceWithoutArchiving, associatedCustomerList)
		 * {
		 * 	var defaultMsg = '&lt;div class="warningContainer" id="error"&gt;__LABEL__&lt;/div&gt;';
		 * 	if (newCustomerWarning && newCustomerWarning[0] && !Data.GetValue("New_payer__") && !Data.GetValue("Enable_touchless__"))
		 * 	{
		 * 		var newCustomerName = "";
		 * 		for (var i = 0; i < associatedCustomerList.length; i++)
		 * 		{
		 * 			if (newCustomerWarning[0].indexOf(associatedCustomerList[i].Col_customer_id__) >= 0)
		 * 			{
		 * 				newCustomerName = newCustomerWarning[0].replace(associatedCustomerList[i].Col_customer_id__, associatedCustomerList[i].Col_customer_name__);
		 * 				buffer += defaultMsg.replace("__LABEL__", "Warning Text for New Customer for Existing Payer when Touchless is NOT enabled. New Customer name: " + newCustomerName);
		 * 			}
		 * 		}
		 * 	}
		 * 	return buffer;
		 * }
		 */
		/*CustomizeWarningMessages: function (buffer, warningMsg, infoMsg, newCustomerWarning, unavailableInvoicesWarnings, anyInvoiceWithoutArchiving, associatedCustomerList)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.ValidateAdditionalFields
		 * @description This function can add additional field validation before Approving.
		 * You could also remove requirements. You most likely DO NOT want to remove the Process.ShowFirstError
		 * You may want to also implement similar Validation logic {@link Lib.CA.CashApp.Customization.Validation.ValidateAdditionalFields}.
		 * @param {function} ValidateAccountAllocationTable You need to call this in this user exit to continue GL table validation.
		 * @param {function} ValidateAllocateToCustomerTable You need to call this in this user exit to continue Customer table validation.
		 * @returns {boolean} True means good to approve, false means no generally showing an error
		 * @example <caption>This example is the existing behavior, don't remove these pieces unless you really want to skip them.</caption>
		 * ValidateAdditionalFields: function (ValidateAccountAllocationTable, ValidateAllocateToCustomerTable)
		 * {
		 * 	let glValid = ValidateAccountAllocationTable();
		 * 	let customerValid = ValidateAllocateToCustomerTable();
		 * 	return !Process.ShowFirstError() && glValid && customerValid;
		 * }
		 * @example <caption>This example adds a requirement for negative GL adjustments to require document number as well as the default logic.</caption>
		 * ValidateAdditionalFields: function (ValidateAccountAllocationTable, ValidateAllocateToCustomerTable)
		 * {
		 * 	for (var i = 0; i < Controls.Account_Allocation_Table__.GetItemCount(); i++)
		 * 	{
		 * 		var item = Controls.Account_Allocation_Table__.GetItem(i);
		 * 		if (item.GetValue("Col_account_amount__") < 0 && item.IsNullOrEmpty("Col_GL_Document_Number__"))
		 * 		{
		 * 			item.SetError("Col_GL_Document_Number__", "This field is required!");
		 * 		}
		 * 	}
		 * 	let glValid = ValidateAccountAllocationTable();
		 * 	let customerValid = ValidateAllocateToCustomerTable();
		 * 	return !Process.ShowFirstError() && glValid && customerValid;
		 * }
		 */
		/*ValidateAdditionalFields: function (ValidateAccountAllocationTable, ValidateAllocateToCustomerTable)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.PaymentFileProcessingInitialization
		 * @description
		 * Function called at the beginning of CA Payment File Processing custom script
		 */
		/*PaymentFileProcessingInitialization: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.HTMLScripts.PaymentFileProcessingFinalization
		 * @description
		 * Function called at the end of CA Payment File Processing custom script
		 */
		/*PaymentFileProcessingFinalization: function()
		{
		},*/
	};

	return HTMLScripts;
})();
