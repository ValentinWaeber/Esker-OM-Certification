/* LIB_DEFINITION{
  "name": "LIB_AR_CUSTOMIZATION_EXTERNALPORTAL_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "COMMON",
  "comment": "External portal customization functions",
  "versionable": false,
  "require": [
    "[Sys/Sys_RPA]"
  ]
}*/

/**
 * This module contains functions allowing to perform Robotic Process Automation (RPA)
 * for automating customer invoice posting in extrernal web portals.
 * @namespace Lib.AR.Customization.ExternalPortal
 */

///#GLOBALS Lib Sys
var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};

Lib.AR.Customization.ExternalPortal = (function ()
{
	/**
	 * @lends Lib.AR.Customization.ExternalPortal
	 *
	 */
	var ExternalPortalCustomization =
	{
		/**
		 * Allows you to customize the list of the external AP portals owned by the customer for delivering invoices.
		 * This user exit is called in the HTML page script of the Customer invoices (supplier copy) process.
		 * @example
		 * <pre><code>
		 * GetAPPortals: function ()
		 * {
		 * 	return ["Ariba"];
		 * }
		 * </code></pre>
		 */
		GetAPPortals: function ()
		{
		},

		/**
		 * Allows you to implement for each AP portal a script of the browser actions to be performed when submitting an invoice.
		 * This implementation is based on RPA (Robotic Process Automation) technology.
		 * This user exit is called at the beginning of the Publication on customer AP Portal process generation script.
		 * @param {string} portalName name of the web portal, use it to call the proper processing script. The name must be defined in the GetAPPortals user exit.
		 * @param {object} browser Object used to execute actions on the Web browse
		 * @param {object} invoiceData deserialized JSON containing the data sent from the SUPI form, you can add some values in SUPI in order to get it back here.
		 * @return {object} A javascript object with this fields:
		 * Parameter                | Required | Type    | Description
		 * -------------------------|----------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------
		 * `success`                |   Yes    | Boolean | Indicates whether the robot has successfully performed the required actions. This status is displayed in the Publication on customer AP Portal process.
		 * `comment`                |   No     | String  | Comment to display in the Publication on customer AP Portal process.
		 * `details`                |   No     | String  | Details to display in the Publication on customer AP Portal process.
		 * `invoicePortalIdentifier`|   No     | String  | Identifier of the invoice on the AP portal. This identifier is displayed in the Publication on customer AP Portal process.
		 *  @example
		 * In this example, the robot clicks on a button on the portal after the invoice has been entered. The ID of the button depends on the value of the saveAsDraft property.
		 * <pre><code>
		 * function Submit(portalName, browser, invoiceData)
		 * {
		 *	 browser.Open("http://myapportal.com");
		 *	 browser.Type("id=invoicenumber", invoiceData.Invoice_number__);
		 *	 ...
		 *	 if (invoiceData.externalPortal.saveAsDraft)
		 *	 {
		 *		 browser.Click("id=buttonSave");
		 *	 }
		 *	 else
		 *	 {
		 *		 browser.Click("id=buttonPost");
		 *	 }
		 *	 ...
		 * }
		 * </code></pre>
		 */
		Submit: function (portalName, browser, invoiceData)
		{
		},

		/**
		 * Function called by the RPA Submission process at the begining of the generation script.
		 * Allows you to customize generation settings for the Publication on Customer AP Portal process.
		 * This user exit is called at the end of the Publication on Customer AP Portal process generation script.
		 * @param invoiceData: deserialized JSON containing the data sent from the SUPI form, you can add some values in SUPI in order to get it back here.
		 * @param portalName: name of the web portal, use it to call the proper processing script.
		 */
		FinalizeGeneration: function (invoiceData, portalName)
		{
		}
	};

	return ExternalPortalCustomization;

})();
