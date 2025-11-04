/* LIB_DEFINITION{
  "name": "LIB_CA_CUSTOMIZATION_ERPPOST_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "comment": "CA ERP posting customization functions",
  "versionable": false,
  "require": []
}*/

/**
 * This module contains
 * - functions used to customize the CA System ERP Payment Posting process
 * @namespace Lib.CA.Customization.ERPPost
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.Customization = Lib.CA.Customization || {};

Lib.CA.Customization.ERPPost = (function ()
{
	/**
	 * @lends Lib.CA.Customization.ERPPost
	 */
	var ERPPost =
	{
		//#region CA ERP Payment Posting
		// The following user exits are related to the withholding posting process which is
		// used when withholding tax items are posted after they are validated

		/**
		 * @method Lib.CA.Customization.ERPPost.InitializeERPPostingValidation
		 * @description
		 * Function called at the beginning of the ERP Payment Posting validation
		 */
		/*InitializeERPPostingValidation: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.ERPPost.FinalizeERPPostingValidation
		 * @description
		 * Function called at the end of the ERP Payment Posting validation
		 */
		/*FinalizeERPPostingValidation: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.ERPPost.InitializeERPPostingFinalization
		 * @description
		 * Function called at the beginning of the ERP Payment Posting finalization
		 */
		/*InitializeERPPostingFinalization: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.ERPPost.FinalizeERPPostingFinalization
		 * @description
		 * Function called at the end of the ERP Payment Posting finalization
		 */
		/*FinalizeERPPostingFinalization: function()
		{
		},*/

		//#endregion

		//#region CA ERP Batch Payment Posting
		// The following user exits are related to the Batch posting process which is
		// used when payments need to be posted across multiple documents

		/**
		 * @method Lib.CA.Customization.ERPPost.InitializeERPBatchPostingValidation
		 * @description
		 * Function called at the beginning of the ERP Batch Payment Posting validation
		 */
		/*InitializeERPBatchPostingValidation: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.ERPPost.FinalizeERPBatchPostingValidation
		 * @description
		 * Function called at the end of the ERP Batch Payment Posting validation
		 */
		/*FinalizeERPBatchPostingValidation: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.ERPPost.InitializeERPBatchPostingFinalization
		 * @description
		 * Function called at the beginning of the ERP Batch Payment Posting finalization
		 */
		/*InitializeERPBatchPostingFinalization: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.ERPPost.FinalizeERPBatchPostingFinalization
		 * @description
		 * Function called at the end of the ERP Batch Payment Posting finalization
		 */
		/*FinalizeERPBatchPostingFinalization: function()
		{
		},*/

		//#endregion

		/**
		 * Definition of NotificationEmail
		 * See {@link http://doc.esker.com/eskerondemand/cv_ly/en/manager/startpage.htm#common/references/fields/mailprintable.html Email variables} for more information
		 * @interface Lib.CA.Customization.ERPPost.NotificationEmail
		 * @prop {string} ID ToName
		 * @prop {string} email EmailAddress
		 * @prop {string} cc CcEmailAddress
		 * @prop {string} toCompany ToCompany
		 * @prop {string} language Email template language
		 * @prop {string} culture Email template culture
		 * @prop {string} formUrl Current process URL
		 * @prop {string} transportIdentifier Identifier
		 * @prop {string} fromEmail FromAddress
		 * @prop {string} fromName FromName
		 * @prop {string} fromCompany FromCompany
		 * @prop {string} subject Subject
		 */

		/**
		 * @method Lib.CA.Customization.ERPPost.CustomizeEmailNotification
		 * @description
		 * Allows customization of the email notification attributes used when a batch of payment allocation items cannot be posted to SAP due to an error.
		 * @param {Lib.CA.Customization.ERPPost.NotificationEmail} emailData The default email notification attributes
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