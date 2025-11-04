/* LIB_DEFINITION{
  "name": "Lib_CM_Customization_Extraction_Sample",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "additional process extraction",
  "require": []
}*/

/**
 * This module contains functions allowing to perform additional actions in extraction of credit management processes
 * @namespace Lib.CM.Customization.Extraction
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.CM = Lib.CM || {};
Lib.CM.Customization = Lib.CM.Customization || {};

Lib.CM.Customization.Extraction = (function ()
{
	/**
	 * @lends Lib.CM.Customization.Extraction
	 */
	var extraction = {
		/**
		 * Allows the modification of the invitation mail for the credit app.
		 * This user exit is called just before sending the email
		 * @param {Transport} email of the invitation email
		 * @example
		 * This example shows how to add new files from the "Files" resources to the mail.
		 * <pre><code>
		 * CustomizeInvitationEmail: function (email)
		 * {
		 *	   var attachFile = Process.GetRessourceFile("%Misc%\\newAttachment.pdf");
		 *	   if (attachFile)
		 *	   {
		 *	   	  var attach = email.AddAttachEx(attachFile);
		 *	      // if you want to rename file in sent email
		 *	      attach.GetVars().AddValue_String("AttachOutputName", "DisplayName.pdf", true);
		 *	   }
		 *
		 * }
		 * </code></pre>
		 */
		CustomizeInvitationEmail: function (/*email*/)
		{ },

		/**
		 * Allows the customization of the extraction settings for the credit application.
		 * Use it to complete additional extraction actions for the process "Credit Management - Credit Application".
		 * This user exit is called at the end of the extraction script of the process.
		 */
		CustomizeExtraction: function ()
		{ },

		/**
		 * Allows the customization of the customer query for periodic credit review.
		 * Use it to change whatever you want from the query perfoms in"Credit Management - Periodic Credit Review" extraction.
		 * Warning you must keep the customerId__ in the attributesList
		 * @param {Query} customerQuery default customers query 
		 * @example
		 * this example shows how to modify the query 
		 * <pre><code>
		 * CustomizeCreditReviewCustomerQuery: function (customerQuery)
		 * {
		 *		customerQuery.Reset();
		 *		customerQuery.SetSpecificTable("Customer_Extended_Delivery_Properties__");
		 *		var dateNow = new Date();
		 *		var ldapFilter = Sys.Helpers.LdapUtil.FilterAnd(
		 *			Sys.Helpers.LdapUtil.FilterLesserOrEqual("NextReviewCM__", Sys.Helpers.Date.Date2DBDateTime(dateNow)),
		 *			Sys.Helpers.LdapUtil.FilterExist("NextReviewCM__")
		 *		);
		 *		customerQuery.SetFilter(ldapFilter.toString());
		 *		customerQuery.SetAttributesList("CustomerId__,NextReviewCM__,RUIDEX,RiskCategory__,ADP__");
		 *		customerQuery.SetOptions(DBFastAccess | DBDirtyRead);
		 *		customerQuery.SetOptionEx("Limit=-1");
		 *		return customerQuery;
		 * }
		 * </code></pre>
		 */
		CustomizeCreditReviewCustomerQuery: function (/*customerQuery*/)
		{ },

		/**
		 * Allows the customization of the customer object for periodic credit review.
		 * Use it to change or add whatever you want from the customer object in "Credit Management - Periodic Credit Review" extraction.
		 * @param {Object} object object with 2 properties in it : 
		 * - customer: user retreives with GetUser function 
		 * - recordVars: data retrieve with customer query that  you can edit with CustomizeCreditReviewCustomerQuery function
		 * @example
		 * this example shows how to modify the customer object 
		 * <pre><code>
		 * CustomizeCustomerToReview: function (object)
		 * {
		 *		// this is the default customer object -> Warning do not modify the customerLogin property
		 * 		return {
		 *			customerLogin: object.customer.GetValue("CustomerID__"),
		 *			language: object.customer.GetValue("Language"),
		 *			nextReview: object.customer.GetValue("NextReviewCM__"),
		 *			emailAddress: object.customer.GetValue("EmailAddress"),
		 *			ruidex: object.recordVars.GetValue_String("RUIDEX", 0),
		 *			currentRiskCategory: object.customer.GetValue("RiskCategory__"),
		 *			ADP: object.customer.GetValue("ADP__"),
		 *			insuranceAmount: object.customer.GetValue("InsuranceAmount__")
		 *		};
		 * }
		 * </code></pre>
		 */
		CustomizeCustomerToReview: function (/*object*/)
		{ },
		/**
		 * Allows the customization of the customer attributes query for credit score polling.
		 * Use it to add some attributes to query form customer for credit score polling.
		 * @param {String} attributes default attributes
		 * @example
		 * this example shows how to add some attributes to the query 
		 * <pre><code>
		 * CustomizePollingCustomerAttributes: function (attributes)
		 * {
		 *		attributes.concat(",", "Z_TaxId__");
		 *		return attributes;
		 * }
		 * </code></pre>
		 */
		CustomizePollingCustomerAttributes: function (/*attributes*/)
		{ },
		/**
		 * Allows the customization of the customer object for credit score polling.
		 * Use it to add some attributes to customer object for credit score polling.
		 * @param {object} customer default customer object
		 * @param {recordVars} recordVars record daa retrieve from query customer
		 * @example
		 * this example shows how to add some information to the customer object
		 * <pre><code>
		 * CustomizePollingCustomerObject: function (customer, recordVars)
		 * {
		 *		customer.taxId = recordVars.GetValue_String("Z_TaxId__", 0);
		 *		return customer;
		 * }
		 * </code></pre>
		 */
		CustomizePollingCustomerObject: function (/*customer, recordVars*/)
		{ },
		/**
		 * Allows the customization of a credit review with customer data.
		 * Use it to set some values of the credit review with data present in the customer object.
		 * @param {object} customerUser default customer object
		 * @example
		 * This example shows how to add some customer information to your credit review
		 * It sets the value of a custom field "Z_NewReviewField__" on the credit review process
		 * thanks to a new custom field "Z_NewCustomerField__" on the customer process
		 * <pre><code>
		 * CustomizeFillFromUser: function (customerUser)
		 * {
		 *		Data.SetValue("Z_NewReviewField__", customerUser.GetValue("Z_NewCustomerField__"));
		 * }
		 * </code></pre>
		 */
		CustomizeFillFromUser: function (/*customerUser*/)
		{ },
		/**
		 * When creating a new credit review, data from previous app is used to fill the new review.
		 * This user exit can be used to filter some of those data
		 * If the data is also present in the customer page data, please also check the CustomizeFillFromUser user exit.
		 * @returns {Array} Array of string with the name of the fields which need to be filtered
		 * @example
		 * This example shows how to remove the new custom field "Z_NewReviewField__" from being copied in the new review
		 * <pre><code>
		 * ExcludeFieldsFromPreviousCreditApp: function ()
		 * {
		 *		var fieldsToExclude = [];
		 *		fieldsToExclude.push("Z_NewReviewField__");
		 *		return fieldsToExclude;
		 * }
		 * </code></pre>
		 */
		ExcludeFieldsFromPreviousCreditApp: function ()
		{ },
		/**
		 * Allows the customization of the customer query filter for credit score polling.
		 * Use it to change the filter to query from customer for credit score polling.
		 * @param {String} filter default filter
		 * @example
		 * this example shows how to add some attributes to the query 
		 * <pre><code>
		 * CustomizePollingCustomerQueryFilter: function (filter)
		 * {
		 *		filter = "(CreditScore_Enabled__=1)";
		 *		return filter;
		 * }
		 * </code></pre>
		 */
		CustomizePollingCustomerQueryFilter: function (filter)
		{ },
	};

	return extraction;
})();
