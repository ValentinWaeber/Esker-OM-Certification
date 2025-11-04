/* LIB_DEFINITION{
  "name": "Lib_CM_Customization_Reminders_Sample",
  "libraryType": "Lib",
  "scriptType": "COMMON",
  "versionable": false,
  "comment": "",
  "require": [
    "Sys/Sys_Helpers",
    "Sys/Sys_Helpers_LdapUtil"
  ]
}*/

/**
 * Credit Management reminders customization functions
 * @namespace Lib.CM.Customization.Reminders
 */


var Lib = Lib || {};
Lib.CM = Lib.CM || {};
Lib.CM.Customization = Lib.CM.Customization || {};

Lib.CM.Customization.Reminders = (function ()
{
	/**
	 * @lends Lib.CM.Customization.Reminders
	*/
	var reminders = {
		/**
		 * References object allow the customization of the custom tags for the reminders sent by the system process.
		 * @property {function} ModifyCustomTags - Allows the modification of the custom tags for the bank and trade references
		 * WARNING: it is not used for the custom tags of the message sent upon credit application submission.
		 * @example
		 * This example adds the custom tags for the address in the USA (Street, POBox, City, MailState, ZipCode, Country)
		 * <pre><code>
		 *	ModifyCustomTags: function (customTags, creditAppTransport)
		 *	{
		 *		customTags.Street = creditAppTransport.GetUninheritedVars().GetValue_String("Street__", 0);
		 *		customTags.POBox = creditAppTransport.GetUninheritedVars().GetValue_String("POBox__", 0);
		 *		customTags.City = creditAppTransport.GetUninheritedVars().GetValue_String("City__", 0);
		 *		customTags.MailState = creditAppTransport.GetUninheritedVars().GetValue_String("Mail_State__", 0);
		 *		customTags.ZipCode = creditAppTransport.GetUninheritedVars().GetValue_String("Zip_Code__", 0);
		 *		customTags.Country = creditAppTransport.GetUninheritedVars().GetValue_String("Country__", 0);
		 *	}
		 * </code></pre>
		 */
		References: {
			/**
			 * Allows the modification of the custom tags for the bank and trade references.
			 * @property {Object} customTags - Object containing the custom tags
			 * @property {Transport} creditAppTransport - Transport of the credit application for which the reminder is being sent
			 */
			ModifyCustomTags: function (/*customTags, creditAppTransport*/) { }
		}
	};

	return reminders;
})();
