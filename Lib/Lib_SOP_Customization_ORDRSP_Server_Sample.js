/* LIB_DEFINITION{
  "name": "Lib_SOP_Customization_ORDRSP_Server_Sample",
  "scriptType": "SERVER",
  "comment": "Custom library for Order Confirmation server scripts",
  "versionable": false,
  "libraryType": "Lib",
  "require": []
}*/

var Lib = Lib || {};
Lib.SOP = Lib.SOP || {};
Lib.SOP.Customization = Lib.SOP.Customization || {};
Lib.SOP.Customization.ORDRSP = Lib.SOP.Customization.ORDRSP || {};

/**
 * @namespace Lib.SOP.Customization.ORDRSP.Server
 */
Lib.SOP.Customization.ORDRSP.Server = (function ()
{
	/**
	 * @lends Lib.SOP.Customization.ORDRSP.Server
	 */
	var customization = {
		/**
		 * @description Allows to set an email address to use in order to retrieve its related customer contact. This customer contact is important to get the delivery method preferences and is the email to whom we want to send the ORDRSP (if 'Send email' is checked in his preferences).
		 *
		 * If the given email address is empty or doesn't match with a customer contact, we try to find a customer contact with an identifier equals to the customer number of the sold to.
		 *
		 * @returns {string} emailAddress: the wanted email address
		 *
		 * @example
		 * 	<pre><code>getEmailAddress: function ()
		 * {
		 *		return Controls.GetValue("Z_Email_Address");
		 * }
		 * </code></pre>
		*/
		"getEmailAddress": function ()
		{
			return "";
		},

		/**
		 * @description This function allows to customize order confirmation publishing options.
		 *
		 * @returns No return value expected
		 * @param {object} publishingOptions { sendEDI; sendEmail; user; } structure. See Lib_SOP_EDIOutput for details.
		 * @example
		 * This user exit deactivates EDI & email confirmations
		 * <pre><code>function CustomizePublishingOptions(publishingOptions)
		 * {
		 * 	if (publishingOptions)
		 * 	{
		 * 		// Deactivate EDI & email confirmations
		 * 		delete publishingOptions.sendEDI;
		 * 		delete publishingOptions.sendEmail;
		 * 	}
		 * }</code></pre>
		*/
		CustomizePublishingOptions: function (publishingOptions)
		{
		},

		/**
		* @description This function will be called at the end of 'Order confirmation' Finalization Script.
		* Allows you to perform operations after the order confirmation finalization. This user exit is called from the Generation script of the "Order confirmation" process, at the end of the Finalization section.
		*
		* @returns No return value expected
		*
		* @example
		* This user exit simulates ERP Ack from ORDRSP message.
		* 	<pre><code>function OnFinalizationScriptEnd()
		* 	{
		*		Lib.SOP.Customization.ORDRSP.Server.PS.UpdateOrderDocumentERPId(); // PS function which simulates ERP Ack by creating a "Update order with ERP ID" process instance
		* 	}</code></pre>
		*/
		OnFinalizationScriptEnd: function ()
		{
		},
		/**
		* @description Allows to filter the users to notify when a Order Confirmation is received. It is called only if the option "SendShipNoticeAndOrderConfToAllCustomers__" is enbaled in the OM global settings. By default, we notify every customers related to the SoldTo or ShipTo and with the option "SendOrderConfirmation_Email__" enabled in its customer extended properties.
		* @param {IUser} user User data
		* @returns {boolean} Return a boolean indicating if the user should be notify
		*
		* @example
		* 	<pre><code>function ShouldNotifyCustomerContact(user)
		* 	{
		* 		if (user.GetValue("Login") === "0001$contact@email.com")
		* 		{
		* 			return false;
		* 		}
		* 		return true;
		* 	}</code></pre>
		*/
		ShouldNotifyCustomerContact: function (user)
		{
			return true;
		}
	};

	return customization;
})();