/* LIB_DEFINITION{
  "name": "Lib_Deductions_Customization_HTMLScript_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "CLIENT",
  "versionable": false,
  "comment": "Deductions HTMLScript customizations functions",
  "require": []
}*/

/**
 * This module contains
 *	- CustomizeHTMLScriptBegin
 *	- CustomizeHTMLScriptEnd
 * @namespace Lib.Deductions.Customization.HTMLScript
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.Deductions = Lib.Deductions || {};
Lib.Deductions.Customization = Lib.Deductions.Customization || {};

Lib.Deductions.Customization.HTMLScript = (function ()
{
	/**
	 * @lends Lib.Deductions.Customization.HTMLScript
	 */
	var HTMLScript =
	{
		/**
		* @method Lib.Deductions.Customization.HTMLScript.CustomizeHTMLScriptBegin
		* @description
		* Called at the begining of deduction processing HTMLScript script
		*/
		/*CustomizeHTMLScriptBegin: function ()
		{
		},*/

		/**
		 * @method Lib.Deductions.Customization.HTMLScript.CustomizeHTMLScriptEnd
		 * @description
		 * Called at the end of deduction processing HTMLScript script*/
		/*CustomizeHTMLScriptEnd: function ()
		{
		},*/

		/**
		 * @method Lib.Deductions.Customization.HTMLScript.CustomizeInvoiceTooltip
		 * @description
		 * Customize the information present in the invoice tooltip
		 * @param {string} html the current html of the tooltip
		 * @returns {string} the customized html
		 */
		/*CustomizeInvoiceTooltip: function (html)
		{
			return html;
		},*/

		/**
		 * @method Lib.Deductions.Customization.HTMLScript.CustomizeOrderTooltip
		 * @description
		 * Customize the information present in the order tooltip
		 * @param {string} html the current html of the tooltip
		 * @returns {string} the customized html
		 */
		/*CustomizeOrderTooltip: function (html)
		{
			return html;
		},*/

		/**
		 * @method Lib.Deductions.Customization.HTMLScript.OnFieldChange
		 * @description
		 * Hook triggered by a change on any field not in a table
		 * @param {IControl} ctrl the control that fired the event
		 */
		/*OnFieldChange: function (ctrl)
		{

		},*/

		/**
		 * @method Lib.Deductions.Customization.HTMLScript.OnLineChange
		 * @description
		 * Hook triggered by a change on any field in a table
		 * If the event is a field update the field is given in parameter
		 * If the event is the deletion of a row the table control is given in parameter
		 * @param {IControlInTable<Deductions_ProcessingLineitemTableRow>} ctrl the control that fired the event
		 */
		/*OnLineChange: function (ctrl)
		{
		},*/

		/**
		 * @method Lib.Deductions.Customization.HTMLScript.GetTeachingRequestSubject
		 * @description This function will be called when submitting a teaching request.  It enables the possibility to modify the teaching request "Subject" visible by the users.
		 * The subject can also be used in a policy to restrict the access to teaching requests.
		 *
		 * @param {string} subject  The default teaching request subject
		 * @returns The updated teaching request subject
		 */
		/*GetTeachingRequestSubject: function (subject)
		{
			return subject;
		},*/

		/**
		 * @method Lib.Deductions.Customization.HTMLScript.SetColumnOrder
		 * @description This function will be called at the start of the customscript. It will reorder the column order of the line items.
		 * All column not set is at the end and in order from the layout.
		 * @param {string[]} defaultColumnOrder default colomn ordrering
		 *
		 * @returns a string table with column technical name
		 */
		/*SetColumnOrder: function (defaultColumnOrder)
		{
			var columnsToOrder =
			[
				"Col_item_status_icon__", "Col_item_invoice_position__", "Col_item_customer_material_number__", "Col_item_number__",
				"Col_item_description__", "Col_item_po_number__", "Col_item_pod_number__", "Col_item_invoice_number__", "Col_item_GL_account_number__",
				"Col_item_invoiced_quantity__", "Col_item_received_quantity__", "Col_item_difference_quantity__", "Col_item_invoiced_unit__", "Col_item_received_unit__",
				"Col_item_invoiced_price__", "Col_item_expected_price__", "Col_item_difference_price__",
				"Col_item_invoiced_discount__", "Col_item_expected_discount__", "Col_item_difference_discount__",
				"Col_item_invoiced_amount__", "Col_item_expected_amount__", "Col_item_promotion_number__",
				"Col_item_net_amount__", "Col_item_tax_code__", "Col_item_tax_rate__", "Col_item_tax_amount__", "Col_item_total_amount__", "Col_item_disputed_net_amount__"
			];
			return columnsToOrder;
		},*/

		/**
		 * @method Lib.Deductions.Customization.HTMLScript.GetTableColumnsToDisplay
		 * @description
		 * This function will be called when initializing the ConversationList control. It can be used to customize the columns displayed in conversations.
		 * @param tableColumnsToDisplay - the default columns that will be displayed.
		 * @returns Return the modified tableColumnsToDisplay.
		 * @example <caption>Adds an extra column to the conversation control to display the email of the recipient</caption>
		 * function GetTableColumnsToDisplay(tableColumnsToDisplay)
		 * {
		 *		// We want to add an extra column (Recipient Email)
		 *		tableColumnsToDisplay.push({
		 *			label : "Email address",
		 *			data : "emailAddress",
		 *			width : "20%"
		 *		});
		 *       return tableColumnsToDisplay;
		 * }
		 **/
		/*GetTableColumnsToDisplay: function (tableColumnsToDisplay)
		{
			return tableColumnsToDisplay;
		},*/

		/**
		 * @method Lib.Deductions.Customization.HTMLScript.GetConversationInfo
		 * @description
		 * This function is called inside all the calls to the GetConversationInfo function, and gives the possibility to change its return value.
		 * @param {object} conversationInfo: Object containing the information required to create a conversation.
		 *                 see http://webdoc/eskerondemand/cv_ly/en/manager/startpage.htm#htmlpagescript/control/conversationlistcreateconversationwithitem.html?Highlight=options%20(optional) for more information about the available parameters
		 * @returns The updated conversationInfo
		 * @example <caption>Modifies the from name and from email address that will appear to the email's recipient</caption>
		 * GetConversationInfo: function (conversationInfo)
		 * {
		 *	conversationInfo.Options.fromEmailAddress = "new-email@email.com";
		 *	conversationInfo.Options.fromName = "new-name";
		 *
		 * 	return conversationInfo;
		 * }
		 **/
		/*GetConversationInfo: function (conversationInfo)
		{
			return conversationInfo;
		},*/

		/**
		 * @method Lib.Deductions.Customization.HTMLScript.ModifyConversationPopupOptions
		 * @description
		 * This function is called when clicking on a conversation button (examples: "Reply All", "New Message"...)
		 * It allows to modify the options used in the conversation popup.
		 * @param {object} conversationOptions Object containing the options of the conversation popup.
		 * @param {string} conversationAction String indicating the conversation action (examples: "ReplyAll", "NewConversation", "ForwardConversation", "ForwardMessage"...)
		 * @returns {object} The updated conversation popup options
		 * @example Add default recipients to a new conversation:
		 * ModifyConversationPopupOptions: function (conversationPopupOptions, conversationAction)
		 * {
		 * 	switch (conversationAction)
		 * {
		 * 		case "NewConversation":
		 * 			conversationPopupOptions.AddDefaultEmailAddressAsRecipient = true;
		 * 			break;
		 * }
		 * 	return conversationPopupOptions;
		 * }
		 **/
		/*ModifyConversationPopupOptions: function (conversationPopupOptions, conversationAction)
		{
			return conversationPopupOptions;
		},*/

		/**
		 * @method Lib.Deductions.Customization.HTMLScript.CustomizePromotionTooltip
		 * @description
		 * Customize the information present in the promotion tooltip
		 * @since 331
		 * @param {string} html the current html of the tooltip
		 * @param {Lib.Deductions.Processing.Common.PromotionInfos} promotion the retrieved promotion information
		 * @param {string} documentCulture the culture of the document
		 * @param {Typing.Deductions_Processing.Controls.Line_item__.Row} row the current row (line item)
		 * @returns {string} the customized html
		 * @example <caption>This sample overrides the standard promotion tooltip to display the promotion number only.</caption>
		 * CustomizePromotionTooltip: function (html, promotion, documentCulture, row)
		 * {
		 *	html.replace(/<tbody>.*<\/tbody>/, `<tbody><tr><td>Promotion Number</td><td>${promotion.Promotion_number__}</td></tr></tbody>`);
		 *	return html;
		 * }
		 */
		CustomizePromotionTooltip: function (html, promotion, documentCulture, row)
		{
			return html;
		},

		/**
		 * @method Lib.Deductions.Customization.HTMLScript.ModifyOnHoldReasons
		 * @description
		 * This function is called when clicking on the on hold button.
		 * It allows to modify the list of reasons available in the on hold popup.
		 * @param {object} reasonList Array containing the reasons available in the on hold popup.
		 * @returns {object} The updated reason list
		 * @example Add a reason to the on hold popup:
		 * ModifyOnHoldReasons: function (reasonList)
		 * {
		 * 	reasonList.push("_Waiting_for_additional_information");
		 *	return reasonList;
		 * }
		 **/
		/*ModifyOnHoldReasons: function (reasonList)
		{
			return reasonList;
		}*/
	};

	return HTMLScript;

})();
