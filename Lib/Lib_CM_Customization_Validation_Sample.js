/* LIB_DEFINITION{
  "name": "Lib_CM_Customization_Validation_Sample",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "additional process validation",
  "require": []
}*/

/**
 * This module contains functions allowing to perform additional validation for credit management processes
 * @namespace Lib.CM.Customization.Validation
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.CM = Lib.CM || {};
Lib.CM.Customization = Lib.CM.Customization || {};

Lib.CM.Customization.Validation = (function ()
{
	/**
	 * @lends Lib.CM.Customization.Validation
	 */
	var validation = {
		/**
		 * Allows you to modify data before the submitting of a credit process.
		 * Use it to edit the value of a specific field if needed.
		 * This user exit is called when submitting a credit process.
		 */
		CustomizeSubmit: function ()
		{ },

		/**
		 * Allows you to customize the validation settings for a credit process.
		 * Use it to complete additional validation actions.
		 * This user exit is called at the end of the validation script of the process.
		 */
		CustomizeValidation: function ()
		{ },

		/**
		 * Allows you to customize the validation settings for a credit process.
		 * Use it to complete additional validation actions.
		 * This user exit is called at the beginning of the validation script of the process.
		 */
		CustomizeValidationStart: function ()
		{ },

		/**
		 * Allows you to update the attachment send to references.
		 * This user exit is called in ConversationsHandler.AddItem
		 */
		UpdateAttachmentAddToConversation: function (/*args*/)
		{ },

		/**
		 * Allows you to update the companie object in "Credit Management - Periodic Credit Review" validation.
		 * @param {Object} companie object that has been customize in "Lib.CM.Customization.Extraction.CustomizeCustomerToReview"
		 * @example
		 * this example shows how to modify the company object
		 * <pre><code>
		 * CustomizeCustomerToReview: function (companie)
		 * {
		 *		// this is the default customer object -> Warning do not modify the customerLogin property
		 * 		return {
		 *			emailAddress: companie.emailAddress,
		 *			customerLogin: companie.customerLogin,
		 *			language: companie.language,
		 *			cimruidex: companie.ruidex,
		 *			currentRiskCategory: companie.currentRiskCategory,
		 *			ADP: companie.ADP,
		 *			insuranceAmount: companie.insuranceAmount
		 *		}
		 * }
		 * </code></pre>
		 */
		CustomizeCustomerToReview: function (/*companie*/)
		{ },

		/**
		 * @description
		 * Allows you to customize customer values during template upload
		 * @param {object} CustomizeCreditProcessTemplateObject - The CustomizeCreditProcessTemplateObject integrate the vars of the CT, the datas from the process and variables from the process
		 * @property {string} [ctvars] - Vars of the CT
		 * @example
		 * <pre><code>
		 * CustomizeCreditProcessTemplateSaving: function (CustomizeCreditProcessTemplateObject)
		 * {
		 * 		CustomizeCreditProcessTemplateObject.ctvars.AddValue_String("Z_SalesRepresentativeGroup", Data.GetValue("Z_SalesRepresentativeGroup"), true);
		 * }
		 * </code></pre>
		*/
		CustomizeCreditProcessTemplateSaving: function (/*CustomizeCreditProcessTemplateObject*/)
		{
		},

		/**
		 * @description
		 * Allows you to get customized customer values during template upload
		 * @param {object} CustomizeCreditProcessTemplateObject - The CustomizeCreditProcessTemplateObject integrate the vars of the CT, the datas from the process and variables from the process
		 * @property {string} [ctvars] - Vars of the CT
		 * @example
		 * <pre><code>
		 * CustomizeCreditProcessTemplateLoading: function (CustomizeCreditProcessTemplateObject)
		 * {
		 * 		Data.SetValue("Z_SalesRepresentativeGroup", CustomizeCreditProcessTemplateObject.ctvars.GetValue_String("Z_SalesRepresentativeGroup", 0));
		 * }
		 * </code></pre>
		*/
		CustomizeCreditProcessTemplateLoading: function (/*CustomizeCreditProcessTemplateObject*/)
		{
		},

		/**
		* Allows you to blacklist some email addresses or email domain for credit process references
		* Beware that standard code use a str.includes(substr) to check if the email address is blacklisted or not.
		* So if you blacklist "esker", it will blacklist either esker@gmail.com, test@esker.com or test@esker.fr
		* @example
		* This object add some email and domain that you don't want to send reference check email
		* <pre><code>
		*	ReferenceEmailBlackList: ["demo@esker.com", "@esker.fr", "noreply.link"]
		* </code></pre>
		*/
		ReferenceEmailBlackList: null,

		/**
		 * @description
		 * Allows you to get customized company object send to score providers' APIs
		 * Don't add property to the object as it won't be taken in account by the APIs but you can change some information like
		 * the regNo or VatNo
		 * @param {object} company - The default object sent to score providers' APIs
		 * @example
		 * <pre><code>
		 * UpdateCompanyDataForScoringProviders: function (company)
		 * {
		 * 		if (Data.GetValue("Country__") === "UK")
		 *		{
		 *			company.regNo = Data.GetValue("TvaIntra__");
		 *		}
		 *		else
		 *		{
		 *			company.regNo = Data.GetValue("SIRET__");
		 *		}
		 *		return company;
		 *	}
		 * </code></pre>
		*/
		UpdateCompanyDataForScoringProviders: function (/*company*/)
		{ },

		/**
		 * @typedef {Object} Lib.CM.Customization.Validation.CreditAppJson
		 * @property {integer} ruid Ruid of the credit application
		 * @property {date} pendingCustomerDate Date at which the customer's response was expected
		 * @property {string} customerLogin Login of the customer
		 * @property {boolean} stopCustomerReminders Flag if the customer's reminders should stop according to template settings
		 * @property {string} templateName Name of the template used for the credit application
		 * @property {integer} maxRemindersSent Maximum number of reminder to send to the customer
		 * @property {integer} reminderFrequency Number of days between each reminder
		 * @property {string} reminderTemplate Template used for the email sent to the customer
		 * @property {date} pendingCustomerDate Date at which the customer's response was expected
		 * @property {string} actionEndReminder Action set in the template settings for excalation
		 * @property {string} defaultCreatorLogin Login of the user who created the credit application
		 * @property {string} senderEmailAddress Email of the user who created the credit application
		 */
		/**
		 * @description
		 * Allows you to customize the number of days between each reminder sent to the customer while the application has not been filled
		 * @param {Lib.CM.Customization.Validation.CreditAppJson} creditApp - The credit application object used in the reminder process
		 * @returns {integer} Number of days between each customer reminder
		 * @example
		 * <pre><code>
		 * CustomizeReminderFrequency: function (creditApp)
		 * {
		 * 		if (creditApp.templateName === "UK")
		 *		{
		 *			return 3;
		 *		}
		 *		else
		 *		{
		 *			return 5;
		 *		}
		 *	}
		 * </code></pre>
		*/
		CustomizeReminderFrequency: function (/*creditApp*/)
		{ },
		Creditsafe: {
			/**
			 * Allows credit score polling to not intersect results with those of a portfolio from CreditSafe.
			 * Use it to change the behavior for credit score polling and to ignore the list of companies to find credit score pulled from portfolio.
			 * @param {Boolean} CreditsafePortfolioFeature default parameter in configurator
			 * @example
			 * this example shows how to prevent using the portfolio feature
			 * <pre><code>
			 * UsePortfolioFeature: function (CreditsafePortfolioFeature)
			 * {
			 *		return false;
			 * }
			 * </code></pre>
			*/
			UsePortfolioFeatureForPolling: function (/*CreditsafePortfolioFeature*/)
			{ }
		},

		/**
		 * @description
		 * Function called when retrieving the template content before generate contract of the credit application.
		 * Allows you to customize the credit application contract 
		 * @param {object} templateOptions JavaScript object containing template option like customTag, templateName...
		 *	{
		 *	  "templateName": "templateName",
		 * 	  "replaceTags": true,
		 * 	  "customTags": {
		 *		 creatorCompany: companyWithData ? Variable.GetValueAsString("CompanyName") : adminUser.GetValue("Company"),
		 *		 creatorStreet: companyWithData ? Variable.GetValueAsString("CompanyStreet") : adminUser.GetValue("street"),
		 *       ...
		 *	  }
		 *	}
		 * @param {object} tables JavaScript object containing tables description and method to generate template for table control
		 *	{
		 *	 companyOfficers: {
		 * 		template: "CM_CreditApp_Contract_Sub_CompanyOfficer.htm",
		 * 		name: "CompanyOfficersTable__",
		 *		cols: ["role", "name", "email"],
		 *		additionalCustomTags: additionalCustomTags.companyOfficers
		 *	  },
		 *    GetTableTemplate: function (user, tableDef) // function to generate template for a table control
		 *      ...
		 *	  }
		 *	}
		 * @example Add a new table data in credit application contract and replace customTag value
		 * <pre><code>
		 * CustomizeCreditAppContractTemplateOption: function (templateOptions, tables)
		 * {
		 *	 tables.customTable = {
		 *		template: "customTable_template.htm",
		 *		name: "Z_customTable__",
		 *		cols: ["Z_Department", "Z_Name", "Z_email" ]
		 *	 };
		 *	 templateOptions.customTags.customTable = tables.GetTableTemplate(Users.GetUser(Data.GetValue("OwnerId")), tables.customTable);
		 *	 templateOptions.customTags.creatorCompany = Data.GetValue("Customer_name__");
		 * }
		 * </code></pre>
		*/
		CustomizeCreditAppContractTemplateOption: function (/*templateOptions, tables*/)
		{
		}
	};

	return validation;
})();
