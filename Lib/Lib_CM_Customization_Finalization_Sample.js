/* LIB_DEFINITION{
  "name": "Lib_CM_Customization_Finalization_Sample",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "additional process finalization",
  "require": []
}*/

/**
 * This module contains functions allowing to perform additional actions in finalization of credit management processes
 * @namespace Lib.CM.Customization.Finalization
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.CM = Lib.CM || {};
Lib.CM.Customization = Lib.CM.Customization || {};

Lib.CM.Customization.Finalization = (function ()
{
	/**
	 * @lends Lib.CM.Customization.Finalization
	 */
	var finalization = {
		/**
		 * @method Lib.CM.Customization.Finalization.CustomizeCustomer
		 * @description
		 * Allows you to modify customer data before creating or updating a customer.
		 * This user exit is called before the creation of update of a customer
		 * @param {object} propertiesCustomer Object representing the default customer properties to access:
		 * "Company", "Title", "Firstname", "Lastname", "PreferredDeliveryMethod", "EmailAddress", "PhoneNumber", "FaxNumber", "Street", "ZipCode",
		 * "City", "Country", "CreditLimit__", "PaymentTerms__", "NextReviewCM__", ...
		 *
		 * @example Prevent the update of the Company Name for the credit review
		 * CustomizeCustomer: function(propertiesCustomer)
		 * {
		 *		if (Data.GetValue("Review__"))
		 *		{
		 *			delete propertiesCustomer.Company;
		 *		}
		 * }
		 * @example Set EnableCreditSuggestion__ to 1 if we create the customer
		 * CustomizeCustomer: function(propertiesCustomer)
		 * {
		 * 		if(!Data.GetValue("Review__"))
		 * 		{
		 * 			propertiesCustomer.EnableCreditSuggestion__ = "1";
		 * 		}
		 * }
		 */
		CustomizeCustomer: function (/*propertiesCustomer*/)
		{ },

		/**
		 * @method Lib.CM.Customization.Finalization.CustomizeCreditReviewCreation
		 * @description
		 * Allows you to update the companie object in "Credit Management - Periodic Credit Review" finalization.
		 * @param {Object} object object with 3 properties in it:
		 * - companie: object potentially customize with "Lib.CM.Customization.Validation.CustomizeCustomerToReview"
		 * - capVars: credit application variables
		 * - capExtVars: credit application external variables
		 * @example this example shows how to add variables and external variables to credit review process freshly created
		 * CustomizeCreditReviewCreation: function (object)
		 * {
		 *		// these are the default variables and external variables -> Warning do not modify the CustomerLogin__ variable
		 *		object.capExtVars.AddValue_String("email", object.companie.emailAddress, true);
		 *		object.capExtVars.AddValue_String("termsAndConditionsFile", "Default_" + object.companie.language + ".htm", true);
		 *		object.capExtVars.AddValue_String("cimruidex", object.companie.cimruidex, true);
		 *		object.capExtVars.AddValue_String("CurrentRiskCategory", object.companie.currentRiskCategory, true);
		 *		object.capExtVars.AddValue_String("ADP", object.companie.ADP, true);
		 *		object.capExtVars.AddValue_String("InsuranceAmount", object.companie.insuranceAmount || 0, true);
		 *		object.capExtVars.AddValue_String("ResetReviewDate", "true", true);
		 *		object.capExtVars.AddValue_String("reasonReview", "periodic", true);
		 *		object.capVars.AddValue_String("CustomerLogin__", object.companie.customerLogin, true);
		 * }
		 */
		CustomizeCreditReviewCreation: function (/*object*/)
		{ },

		/**
		 * @method Lib.CM.Customization.Finalization.CustomizeEscalationEmailSender
		 * @description
		 * Allows you to customize the user to which the escalation email will be sent when a credit application has gone unanswered past a certain timeline
		 * @param {Lib.CM.Customization.Validation.CreditAppJson} creditApp - The credit application object used in the reminder process
		 * @returns {string} Email of the user which will be used for the escalation email (it must be a user present on the account)
		 * @example
		 * CustomizeEscalationEmailSender: function (creditApp)
		 * {
		 * 		if (creditApp.templateName === "UK")
		 *		{
		 *			return "uk.salesadmin@eskerUser.com";
		 *		}
		 *		else
		 *		{
		 *			return creditApp.defaultCreatorLogin;
		 *		}
		 *	}
		*/
		CustomizeEscalationEmailSender: function (/*creditApp*/)
		{ },

		/**
		 * @method Lib.CM.Customization.Finalization.CustomBlockedOrdersTable
		 * @description
		 * Allows you to customize the BlockedOrdersTable__ so that the display of blocked orders is correct when the credit review has been approved
		 * @param blockedOrderItem - BlockedOrdersTable__ item
		 * @param blockedOrderVars - CM - Orders Import__ records 
		 * @example
		 * CustomBlockedOrdersTable: function (blockedOrderItem, blockedOrderVars)
		 * {
		 * 		blockedOrderItem.SetValue("AdditionalColumn__", blockedOrderVars.GetValue_String("AdditionalColumn__", 0));
		 *	}
		*/
		CustomBlockedOrdersTable: function (/*blockedOrderItem, blockedOrderVars*/)
		{ },
	};

	return finalization;
})();

