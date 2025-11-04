/* LIB_DEFINITION{
  "name": "Lib_Deductions_Customization_Workflow_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "COMMON",
  "versionable": false,
  "comment": "Deductions Workflow customizations functions",
  "require": []
}*/

/**
 * This module contains
 * @namespace Lib.Deductions.Customization.Workflow
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.Deductions = Lib.Deductions || {};
Lib.Deductions.Customization = Lib.Deductions.Customization || {};

Lib.Deductions.Customization.Workflow = (function ()
{
	/**
	 * @lends Lib.Deductions.Customization.Workflow
	 */
	var Workflow =
	{
		/**
		 * @method Lib.Deductions.Customization.Workflow.ExtendWorkflowParameters
		 * @description
		* Use this function to modify workflow parameters.
		* For instance, it can be used to map a new information in the workflow table
		* @memberof Lib.Deductions.Customization.Workflow
		* @param {any} WorkflowParameters Workflow parameters.
		* @returns {any} WorkflowParameters: a new workflow parameters object (or part of it) to extend the default parameters.
		* @example
		* 
		* ExtendWorkflowParameters: function(WorkflowParameters)
		* {
		*	WorkflowParameters.mappingTable.columns.Z_Exception__ =
		*	{
		*		data: "exception"
		*	};
		*	return WorkflowParameters;
		* },
		* 
		*/
		ExtendWorkflowParameters: function (wfCtrlParameters, workflowController)
		{
			return wfCtrlParameters;
		},
		/**
		 * @method Lib.Deductions.Customization.Workflow.CustomizeRoleSequence
		 * @description
		 * Use this function to customize role sequences in the workflow
		 * @param {string[]} defaultRoleSequence the default role sequence
		 * @returns {string[]} the customized role sequence
		 * @example
		 * 
		 * CustomizeRoleSequence: function(defaultRoleSequence)
		 * {
		 *  defaultRoleSequence.push("LegalApprover");
		 * 	return defaultRoleSequence;
		 * },
		 * 
		 */
		CustomizeRoleSequence: function (defaultRoleSequence)
		{
			return defaultRoleSequence;
		},
		/**
		 * @method Lib.Deductions.Customization.Workflow.CustomizeWorkflowDeductionStatus
		 * @description
		 * Use this function to customize the deduction status according to your customization of the workflow
		 * @param {any} contributor the current workflow contributor
		 * @example
		 * 
		 * CustomizeWorkflowDeductionStatus: function(contributor)
		 * {
		 * 	if(contributor.action === "toLegalApprove")
		 *  {
		 * 		Data.SetValue("Document_status__", "TO_LEGAL_APPROVE");
		 *  }
		 * }
		 * 
		 */
		CustomizeWorkflowDeductionStatus: function (contributor)
		{

		},
		/**
		* @method Lib.Deductions.Customization.Workflow.CustomizeWorkflowAmount
		* @description
		* Use this function to customize the workflow amount to check against the validation amount limit.
		* For example, you can retrieve another field instead of the default one, which is Claim_amount__
		* If you want to use the default one, you can return null.
		* @param {Sys.WorkflowEngine.Settings} settings the settings of the workflow
		* @returns {number} the workflow amount
		* @example
		* <pre><code>
		* CustomizeWorkflowAmount: function(settings)
		* {
		*	if (Sys.Deductions.GetParameter("Z_ApproversByNetAmount", "0") === "1" && settings.GetField("Net_amount__")) {
		*		return settings.GetField("Net_amount__").value;
		*	}
		*	return null;
		* }
		* </code></pre>
		*/
		CustomizeWorkflowAmount: function (settings)
		{

		}
	};

	return Workflow;

})();
