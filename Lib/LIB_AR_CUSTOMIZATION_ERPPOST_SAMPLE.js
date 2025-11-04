/* LIB_DEFINITION{
  "name": "LIB_AR_CUSTOMIZATION_ERPPOST_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "comment": "AR ERP posting customization functions",
  "versionable": false,
  "require": []
}*/

/**
 * This module contains
 * - functions used to customize the AR System ERP Payment Posting process
 * @namespace Lib.AR.Customization.ERPPost
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};

Lib.AR.Customization.ERPPost = (function ()
{
	var ERPPost =
	{
		/**
		 * @method Lib.AR.Customization.ERPPost.InitializeERPPostingValidation
		 * @description
		 * Function called at the beginning of the ERP Payment Posting validation
		 */
		/*InitializeERPPostingValidation: function()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.ERPPost.FinalizeERPPostingValidation
		 * @description
		 * Function called at the end of the ERP Payment Posting validation
		 */
		/*FinalizeERPPostingValidation: function()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.ERPPost.InitializeERPPostingFinalization
		 * @description
		 * Function called at the beginning of the ERP Payment Posting finalization
		 */
		/*InitializeERPPostingFinalization: function()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.ERPPost.FinalizeERPPostingFinalization
		 * @description
		 * Function called at the end of the ERP Payment Posting finalization
		 */
		/*FinalizeERPPostingFinalization: function()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.ERPPost.InitializeERPBatchPostingValidation
		 * @description
		 * Function called at the beginning of the ERP Batch Payment Posting validation
		 */
		/*InitializeERPBatchPostingValidation: function()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.ERPPost.FinalizeERPBatchPostingValidation
		 * @description
		 * Function called at the end of the ERP Batch Payment Posting validation
		 */
		/*FinalizeERPBatchPostingValidation: function()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.ERPPost.InitializeERPBatchPostingFinalization
		 * @description
		 * Function called at the beginning of the ERP Batch Payment Posting finalization
		 */
		/*InitializeERPBatchPostingFinalization: function()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.ERPPost.FinalizeERPBatchPostingFinalization
		 * @description
		 * Function called at the end of the ERP Batch Payment Posting finalization
		 */
		/*FinalizeERPBatchPostingFinalization: function()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.ERPPost.GetLastPostingTime
		 * @description
		 * Allows for setting the last posting time that's used to determine the earliest payment to include.
		 * This user exit is called near the beginning of the ERP payment posting process in the finalization script.
		 * @param {string} defaultLastPostingTime The last posting time retrieved from the database
		 * @returns {string} date after which to retrieve payments to post, formatted per the helper function Sys.Helpers.Date.Date2DBDateTime();
		 * 
		 * @example This example sets the last posting time to one week ago, if no previous postings were found.
		 * GetLastPostingTime: function(defaultLastPostingTime)
		 * {
		 * 	if (!defaultLastPostingTime)
		 * 	{
		 * 		var d = new Date();
		 * 		d.setDate(d.getDate() - 7);
		 * 		return Sys.Helpers.Date.Date2DBDateTime(d);
		 * 	}
		 * 	return defaultLastPostingTime;
		 * }
		 */
		/*GetLastPostingTime: function(defaultLastPostingTime)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.ERPPost.GetCustomPortalPaymentFilter
		 * @description
		 * Allows for customizing the filter used to determine which Portal payments should be posted
		 * @param {string} filter The default filter
		 * @param {string} currentSubmittedDateTime The current time this posting process was submitted
		 * @param {string} lastPostingDateTime The last posting time retrieved from the database, or the return value of other user exit GetLastPostingTime
		 * @returns {string} the customized filter to use instead
		 * 
		 * @example This example provides the default logic used to build the filter for simpler customization
		 * GetCustomPortalPaymentFilter: function(filter, currentSubmittedDateTime, lastPostingDateTime)
		 * {
		 * 	var minDate = new Date(Data.GetValue("SubmitDateTime"));
		 * 	minDate.setDate(minDate.getDate() - 2); // 2 days in the past
		 * 	var earliestDateForScheduledPaymentPosting = Sys.Helpers.Date.Date2DBDate(minDate);
		 * 	var newFilter = Sys.Helpers.LdapUtil.FilterAnd(
		 * 		Sys.Helpers.LdapUtil.FilterAnd(
		 * 			Sys.Helpers.LdapUtil.FilterEqual("State", "100"),
		 * 			Sys.Helpers.LdapUtil.FilterEqual("Deleted", "0"),
		 * 			Sys.Helpers.LdapUtil.FilterEqual("Payment_status__", "PAID"),
		 * 			Sys.Helpers.LdapUtil.FilterOr(
		 * 				Sys.Helpers.LdapUtil.FilterNot(
		 * 					Sys.Helpers.LdapUtil.FilterEqual("Document_ERP_ID__", "*")
		 * 				),
		 * 				Sys.Helpers.LdapUtil.FilterEqual("Document_ERP_ID__", "")
		 * 			),
		 * 			Sys.Helpers.LdapUtil.FilterOr(
		 * 				Sys.Helpers.LdapUtil.FilterNot(
		 * 					Sys.Helpers.LdapUtil.FilterEqual("Exported_ruidex__", "*")
		 * 				),
		 * 				Sys.Helpers.LdapUtil.FilterEqual("Exported_ruidex__", "")
		 * 			)
		 * 			// Use GetShouldExportIncludePortalPaymentWithCompanyCode exit to filter on company code
		 * 		),
		 * 		Sys.Helpers.LdapUtil.FilterOr(
		 * 			Sys.Helpers.LdapUtil.FilterAnd(
		 * 				Sys.Helpers.LdapUtil.FilterEqualOrEmpty("Export_trigger__", Sys.AR.Payment.Configuration.ExportTrigger.FINALIZED),
		 * 				Sys.Helpers.LdapUtil.FilterLesserOrEqual("Payment_finalized_date__", currentSubmittedDateTime),
		 * 				Sys.Helpers.LdapUtil.FilterStrictlyGreater("Payment_finalized_date__", lastPostingDateTime)
		 * 			),
		 * 			Sys.Helpers.LdapUtil.FilterAnd(
		 * 				Sys.Helpers.LdapUtil.FilterEqual("Export_trigger__", Sys.AR.Payment.Configuration.ExportTrigger.BATCHED),
		 * 				Sys.Helpers.LdapUtil.FilterLesserOrEqual("Payment_date__", currentSubmittedDateTime),
		 * 				Sys.Helpers.LdapUtil.FilterStrictlyGreater("Payment_date__", earliestDateForScheduledPaymentPosting)
		 * 			),
		 * 			Sys.Helpers.LdapUtil.FilterAnd(
		 * 				Sys.Helpers.LdapUtil.FilterEqual("Export_trigger__", Sys.AR.Payment.Configuration.ExportTrigger.SETTLED),
		 * 				Sys.Helpers.LdapUtil.FilterLesserOrEqual("Payment_settlement_date__", currentSubmittedDateTime),
		 * 				Sys.Helpers.LdapUtil.FilterStrictlyGreater("Payment_settlement_date__", earliestDateForScheduledPaymentPosting)
		 * 			)
		 * 		)
		 * 	);
		 * 	return newFilter.toString();
		 * }
		 */
		/*GetCustomPortalPaymentFilter: function(filter, currentSubmittedDateTime, lastExportDateTime)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.ERPPost.GetShouldPostingIncludePortalPaymentWithCompanyCode
		 * @description
		 * Allows for customizing which company codes' portal payments should be posted to SAP in this process.
		 * By default, only the company code for this ERP payment posting process is allowed
		 * @param {string} processCompanyCode The company code set for this ERP payment posting process
		 * @param {string} paymentCompanyCode A single payment's company code
		 * @returns {boolean} True if this payment should be included, false otherwise
		 * 
		 * @example This example allows payments that match the ERP payment posting process's company code, or payments in A02 if the process company code is A01
		 * GetShouldPostingIncludePortalPaymentWithCompanyCode: function(processCompanyCode, paymentCompanyCode)
		 * {
		 * 	if (processCompanyCode == paymentCompanyCode)
		 * 	{
		 * 		return true;
		 * 	}
		 * 	if (processCompanyCode == "A01" && paymentCompanyCode == "A02")
		 * 	{
		 * 		return true;
		 * 	}
		 * 	return false;
		 * }
		 */
		/*GetShouldPostingIncludePortalPaymentWithCompanyCode: function(companyCode)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.ERPPost.CustomCompanyCodeFilter
		 * @description
		 * Function called to customize the company code filter for the AR ERP Payment Posting process. This can be used if payments with
		 * multiple company codes should all be accessible for a given company code. If this user exit returns null, the default company code filter
		 * will be applied. If this returns an empty string, no filter on company code will be applied.
		 * @param {string} companyCode Company code of the current process
		 * @param {string} fieldName Specifies the company code field name on the item being queried
		 * @returns {string} Filter for company codes to include.
		 * 
		 * @example This example will allow processes with company code A01 to access items in company code A02, but not B01
		 * CustomCompanyCodeFilter: function(companyCode, fieldName)
		 * {
		 * 	if (companyCode === "A01")
		 * 	{
		 * 		return "(|(".concat(fieldName, "=A01)(").concat(fieldName, "=A02)(").concat(fieldName, "=)(!(").concat(fieldName, "=*)))");
		 * 	}
		 * 	return null;
		 * }
		 * @example This example will allow processes without any company code defined to access items across all company codes
		 * CustomCompanyCodeFilter: function(companyCode, fieldName)
		 * {
		 * 	if (!companyCode)
		 * 	{
		 * 		return "";
		 * 	}
		 * 	return null;
		 * }
		 */
		/*CustomCompanyCodeFilter: function (companyCode, fieldName)
		{
			return null;
		},*/

		/**
		 * @method Lib.AR.Customization.ERPPost.CustomizeEmailNotification
		 * @description
		 * Allows customization of the email notification attributes used when the ERP payment posting or ERP
		 * batch payment posting fails due to an error.
		 * @param {Lib.AR.Customization.Common.EmailNotification} emailData The default email notification attributes
		 * 
		 * @example This example adds the toCompany name to the email's subject
		 * CustomizeEmailNotification: function(emailData)
		 * {
		 * 	emailData.subject += emailData.toCompany;
		 * }
		 */
		/*CustomizeEmailNotification: function (emailData)
		{
		},*/
	};

	return ERPPost;
})();