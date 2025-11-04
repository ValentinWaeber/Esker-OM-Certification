/**
 * SOP Package EDINotification customization callbacks
 * @namespace Lib.SOP.Customization.EDINotification
 */

/* LIB_DEFINITION{
  "name": "Lib_SOP_Customization_EDINotification_Sample",
  "scriptType": "SERVER",
  "comment": "Custom library extending EDI notification process on server side",
  "versionable": false,
  "libraryType": "Lib",
  "require": []
}*/

var Lib = Lib || {};
Lib.SOP = Lib.SOP || {};
Lib.SOP.Customization = Lib.SOP.Customization || {};

Lib.SOP.Customization.EDINotification = (function ()
{
	/**
	 * @lends Lib.SOP.Customization.EDINotification
	 */
	var customization = {
		/**
		 * @description Allows to modify or add fields in the json that need to be updated on the Customer Order Processing process following the reception of an EDI notification
		 *
		 * @param {object} jsonData the json object containing all standard values used to update the Customer Order Processing process.
		 * The JSON structure must follow the example in the documentation for API function UpdateProcessInstanceDataAsync.
		 *
		 * @returns {object} the same json object fully filled
		 *
		 * @example
		 * 	<pre><code>ModifyJsonDataToUpdateCOP: function (jsonData)
		 * {
		 * 		jsonData.fields.EDITransmissionStatus__ = "SUCCESS : Your order has successfully been submitted to the NSO platform";
		 * 		return jsonData;
		 * }
		 * </code></pre>
		 */
		ModifyJsonDataToUpdateCOP: function (jsonData)
		{
		},
		/**
		 * @description Allows to modify or add fields in the json that need to be updated on the Outbound EDI transaction process following the reception of an EDI notification
		 *
		 * @param {object} jsonData the json object containing all standard values used to update the Outbound EDI transaction process.
		 * The JSON structure must follow the example in the documentation for API function UpdateProcessInstanceDataAsync.
		 *
		 * @returns {object} the same json object fully filled
		 *
		 * @example
		 * 	<pre><code>ModifyJsonDataToUpdateEDISubmission: function (jsonData)
		 * {
		 * 		jsonData.fields.DetailledStatus__ = "SUCCESS : Your order has successfully been submitted to the NSO platform";
		 * 		return jsonData;
		 * }
		 * </code></pre>
		 */
		ModifyJsonDataToUpdateEDISubmission: function (jsonData)
		{
		},
		/**
		* @description This function will be called at the end of EDI notification Finalization Script.
		* If needed, use it to customize the EDI notification.
		* Allows you to perform operations after the updates of EDI Submission and Customer Order Processing processes. This user exit is called from the Finalization script of the EDI Notification process.
		*
		* @returns No return value expected
		*
		* @example
		* This user exit sends a notification email to a user.
		* 	<pre><code>function OnFinalizationScriptEnd()
		* 	{
		*		Lib.PS.Mailing.SendEmail();//PS function which sends an email to the user
		* 	}</code></pre>
		*/
		OnFinalizationScriptEnd: function ()
		{
		}
	};
	return customization;
})();