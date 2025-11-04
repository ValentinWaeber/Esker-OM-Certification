/* LIB_DEFINITION{
  "name": "Lib_CM_Customization_Contacts_Sample",
  "libraryType": "Lib",
  "scriptType": "COMMON",
  "versionable": false,
  "comment": "Handling contacts in credit applications",
  "require": []
}*/

/**
 * This module contains functions allowing to perform additional actions on contacts of credit management processes
 * @namespace Lib.CM.Customization.Contacts
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.CM = Lib.CM || {};
Lib.CM.Customization = Lib.CM.Customization || {};

Lib.CM.Customization.Contacts = (function ()
{
	/**
	 * @lends Lib.CM.Customization.Contacts
	 */
	var contacts = {
		/**
		 * Allows you to design the roles availables for contacts
		 * This user exit is called when a customer fill a credit app
		 * @example Prevent the update of the Company Name for the credit review
		 * <pre><code>GetRoles: function()
		 * {
		 *		return [
		 *			{
		 *				key: "president",
		 *				label: "_President"
		 *			},
		 *			{
		 *				key: "vicePresident",
		 *				label: "_VicePresident"
		 *			},
		 *			{
		 *				key: "accountPayable",
		 *				label: "_AccountPayable"
		 *			}
		 *		];
		 * }
		 * </code></pre>
		 */
		GetRoles: function ()
		{}
	};

	return contacts;
})();

