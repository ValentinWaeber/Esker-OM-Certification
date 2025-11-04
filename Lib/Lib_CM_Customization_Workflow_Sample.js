/* LIB_DEFINITION{
  "name": "Lib_CM_Customization_Workflow_Sample",
  "libraryType": "Lib",
  "scriptType": "COMMON",
  "versionable": false,
  "comment": "",
  "require": [
    "Sys/Sys_Helpers_LdapUtil"
  ]
}*/

/**
 * Credit Management module customization functions
 * @namespace Lib.CM.Customization.Workflow
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.CM = Lib.CM || {};
Lib.CM.Customization = Lib.CM.Customization || {};

Lib.CM.Customization.Workflow = (function ()
{
	var customization = {
		/**
		 * @method Lib.CM.Customization.Workflow.HandleCustomfieldsInRules
		 * @description
		* Allows you to add some custom fields to trigger worflow rules.
		* Use it to add a fields in the workflow rules from Credit Management .
		* This user exit is called when workflow from credit application is rebuild.
		* @property {Array} scores - External provider scores for the current customer
		* @property {Object} options - Object to retrieve workflow rules
		*
		* @example <caption>This user exit add a 2 customs fields to compute worflow rule
		* WARNING: if you add a custom field you have to add it also in Lib_Custom_WorkflowDefinition in order to be able to map it!</caption>
		*	var HandleCustomfieldsInRules = function (scores, options)
		*	{
		*		for (var i = 0; i < scores.length; i++)
		*		{
		*			var optionsScore = JSON.parse(scores[i].json__);
		*			options.fields.values["D&B_risk_assessment__"] = optionsScore.overallBusinessRisk.toString();
		*			options.fields.values["D&B_paydex__"] = optionsScore.paydex.value;
		*		}
		*		return options;
		*	},
		*/
		HandleCustomfieldsInRules: function (/* scores, options */)
		{ },

		/**
		 * @method Lib.CM.Customization.Workflow.CustomizeQueryFilter
		 * @description
		* Allows you to add filter to query score from credit application.
		* Use it to add a filter to the query to retrieve score
		* This user exit is called when workflow from credit application is rebuild.
		*
		* @example This user exit add a filter (Provider__="duns") in order to retreive a specific score
		*	var CustomizeQueryFilter = function()
		*	{
		*		return Sys.Helpers.LdapUtil.FilterEqual("Provider__", "duns");
		*	},
		*/
		CustomizeQueryFilter: function ()
		{ },

		/**
		 * @method Lib.CM.Customization.Workflow.GetTemplateEmail
		 * @description
		* Allows you to change the template in email notification.
		* Use it to change the template of the email notifications. Workflow notifications have to be enabled first in AR Configuration.
		* By default, in the case of the contributor is the first approver, the template "CM_CreditApp_Notif_First_Approver.htm" is used, otherwise this one "CM_CreditApp_Notif_Approver.htm". 
		* This user exit is called when workflow is forwarded.
		* @param {object} Contributor - Contributor in the workflow. For more information about contributor object, see the Workflow controller library ('GetContributorAt' function).
		* @returns {string} The name of the template.
		*
		* @example This user exit change the template of the email notification if role && role === Lib.CM.Workflow._globalRole.reviewer"
		*	if (contributor.role && contributor.role === Lib.CM.Workflow._globalRole.reviewer)
		*	{
		*		return "CM_CreditApp_Notif_First_Approver.htm";
		*	}
		*/
		/*GetTemplateEmail: function(contributor)
		{ },*/

		/**
		 * @method Lib.CM.Customization.Workflow.ShouldSendEmailNotifications
		 * @description
		* Allows to pilot email notifications of the workflow.
		* Use it to trigger email notifications depending on elements like the contributor role or the review reason.
		* Make sure that the workflow notifications are enabled in AR Configuration, otherwise the notfication would not be sent.
		* This user exit is called when workflow is forwarded.
		* @param {object} Contributor - Contributor in the workflow. For more information about contributor object, see the Workflow controller library ('GetContributorAt' function).
		* @returns {boolean} A boolean value containing if the notification should be sent.
		* 
		* @example This user exit sends an email notification if the review reason is accreditation verification and contributor role is not customer
		*	return Data.GetValue("ReasonReview__") === "accreditationVerification" && contributor && contributor.role !== Lib.CM.Workflow._globalRole.customer;
		*/
		/*ShouldSendEmailNotifications: function(contributor)
		{ },*/

		/**
		 * @method Lib.CM.Customization.Workflow.ShouldSendEmailCreditAppApprove
		 * @description
		* Allows to disable email notification when customer creation is pending in ERP.
		* This user exit is called when workflow is finalized.
		* @returns {boolean} A boolean value containing if the notification should be sent.
		* 
		* @example This user exit disables the email notification when the credit application is approved and goes to Pending customer creation in ERP state
		*	return false;
		*/
		/*ShouldSendEmailCreditAppApprove: function ()
		{ },*/

		/**
		 * @method Lib.CM.Customization.Workflow.HandleERPCreation
		 * @description
		* Allows to create the customer without a user step
		* This user exit is called when workflow validation of credit application is finalized.
		* @returns {boolean} A boolean value containing if the function was successfull or if we must use the manual creation of the customer.
		* 
		* @example This user exit finalized the status of the credit app and set the minimum values to create the customer and return true
		*	Data.SetValue("CustomerNumber__", "007");
		*	Data.SetValue("CompanyCode__", "A01");
		*	Data.SetValue("ProcessStatus__", "Approved");
		*	return true;
		*/
		/*HandleERPCreation: function ()
		{ },*/
	};

	return customization;
})();
