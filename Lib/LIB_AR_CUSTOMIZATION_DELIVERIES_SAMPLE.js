/* LIB_DEFINITION{
  "name": "LIB_AR_CUSTOMIZATION_DELIVERIES_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "comment": "all deliveries customization function",
  "versionable": false,
  "require": []
}*/

/**
 * Package AR deliveries customization callbacks for all processes
 * @namespace Lib.AR.Customization.Deliveries
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};

Lib.AR.Customization.Deliveries = (function ()
{
	var Deliveries =
	{
		/**
		 * @typedef {Object} Lib.AR.Customization.Deliveries.Context
		 * @property {Function} GetSupplierUser returns a User object obtained with Users.GetUserAsProcessAdmin(supplierId) (query is done only if needed and cached)
		 * @property {Function} GetCustomerUser returns a User object obtained with Users.GetUserAsProcessAdmin(customerId) (query is done only if needed and cached)
		 */

		/**
		 * @typedef {Object} Lib.AR.Customization.Deliveries.CustomizeEmailsContext
		 * @property {string} fromCall Identifies the process from which the email is sent. Possible values are:
		 * * `SUPPLIERINVOICE`: The email is sent from the Customer invoices (supplier copy) process.
		 * * `CUSTOMERINVOICE`: The email is sent from the Customer invoices (customer copy) process.
		 * * `RESENDINVOICE`: The email is sent from the Resend invoice process.
		 * * `EMAILGROUPING`: The email is sent from the Email Grouping process.
		 * @property {string} configName Name of the configuration being used.
		 * @property {string} customerId Identifier of the customer contact that receives the email.
		 */

		/**
		 * @typedef {Object} Lib.AR.Customization.Deliveries.CustomizeEmailsResult
		 * @property {string} fromName Name of the message author that appears in the email From field.
		 * @property {string} fromEmailAddress Email address of the message author that appears in the email From field.
		 */

		/**
		 * @typedef {Object} Lib.AR.Customization.Deliveries.FacturXLogoParams
		 * @property {object} position Defines the position of the logo image.
		 * @property {string} position.origin The position of origin of the stamp. The parameter can take one of the following values: `topleft`, `topright`, `bottomleft`, `bottomright`
		 * @property {string} position.x X coordinate of the logo image.
		 * @property {string} position.y Y coordinate of the logo image.
		 * @property {string|number} percentage Defines the size of the logo image, expressed as a percentage of the size of the original image.
		 */

		/**
		 * @typedef {Object} Lib.AR.Customization.Deliveries.FileGroupingData
		 * @property {string} fileName - The name of the file.
		 * @property {string} outputName - The output file name.
		 * @property {string} outputFormat - The format of the output file.
		 * @property {number} size - The size of the file in bytes.
		 */
		/**
		 * @typedef {Object} Lib.AR.Customization.Deliveries.InvoiceGroupingData
		 * @property {string} supiMsnex - Supplier invoice copy MSNEX identifier.
		 * @property {string} supiRUIDEX - Supplier invoice copy RUIDEX identifier.
		 * @property {string} cusiMsnex - Customer invoice copy MSNEX identifier.
		 * @property {string} cusiRUIDEX - Customer invoice copy RUIDEX identifier.
		 * @property {string} customerOwnerID - The owner ID of the customer.
		 * @property {string} customerID - The ID of the customer.
		 * @property {string} customerDeliveryMethod - The delivery method of the customer.
		 * @property {string} cusiArchiveDuration - The archive duration for the customer invoice copy.
		 * @property {string} supiArchiveDuration - The archive duration for the supplier invoice copy.
		 * @property {string} number - The invoice number.
		 * @property {Date|string} date - The date of the invoice.
		 * @property {Date|string} dueDate - The due date of the invoice.
		 * @property {number} totalAmount - The total amount of the invoice.
		 * @property {string} currency - The currency of the invoice.
		 * @property {number} isSigned - Indicates if the invoice is signed (1 for signed, 0 for unsigned).
		 * @property {string} sendWelcomeEMail - Indicates whether a welcome email is sent.
		 * @property {string} passwordUrl - The URL for the password.
		 * @property {string} portalUrl - The portal URL.
		 * @property {string} customerPortalIsTermsync - Indicates if the customer portal uses Termsync.
		 * @property {string} accountStatementUrl - The URL for the account statement.
		 * @property {string} invoiceUrl - The URL for the invoice.
		 * @property {string} passwordFreeLogin - Indicates whether password-free login is enabled.
		 * @property {string} customerEmailAddress - The email address of the customer.
		 * @property {string} realCustomerEmail - The real email address of the customer.
		 * @property {string} supplierEmailAddress - The email address of the supplier.
		 * @property {string} supplierOwnerID - The owner ID of the supplier.
		 * @property {string} ownerPB - The owner PB.
		 * @property {string} groupOwnerID - The group owner ID.
		 * @property {string} supplierAccountID - The supplier account ID.
		 * @property {string} fromCompany - The company sending the invoice.
		 * @property {string} toCompany - The company receiving the invoice.
		 * @property {string[]} groupedFields - The fields used for grouping invoices.
		 * @property {Lib.AR.Customization.Deliveries.FileGroupingData[]} files - The list of associated file grouping data.
		 */

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizeNonExistingCustomerEmailTransport
		 * @description
		 * Customizes the email settings of the Customer invoices (customer copy) process.
		 * Function called before sending an invoice by email to customer which does not exist in database
		 * This function is called just before .Process(). This way, you can still customize notifications, variables, etc of the transport given in parameter
		 * @param {xTransport} email xTransport object obtained with Process.CreateTransport()
		 * @param {Lib.AR.Customization.Deliveries.Context} context object with the following 2 getters GetSupplierUser() and GetCustomerUser()
		 * @returns {boolean} If set to false the email won't be sent.
		 * 
		 * @example This user exit sets the john.doe@example.com email address with the EmailAddress variable of the email transport.
		 * var vars = email.GetUninheritedVars();
		 * vars.AddValue_String("EmailAddress", "john.doe@example.com", true);
		 */
		FinalizeNonExistingCustomerEmailTransport: function (email, context)
		{
			// return true;
		},

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizeExistingCustomerEmailTransport
		 * @description
		 * Function called before sending an invoice by email to customer exist in database
		 * This function is called just before .Process(). This way, you can still customize notifications, variables, etc of the transport given in parameter
		 * Same signature as {@link Lib.AR.Customization.Deliveries.FinalizeNonExistingCustomerEmailTransport}
		 * @param {xTransport} email xTransport object obtained with Process.CreateTransport()
		 * @param {Lib.AR.Customization.Deliveries.Context} context object with the following 2 getters GetSupplierUser() and GetCustomerUser()
		 * @returns {boolean} If set to false the email won't be sent.
		*/
		FinalizeExistingCustomerEmailTransport: function (email, context)
		{
			//SampleEditEmailTemplate(email, context);
			// return true;
		},

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizeNonExistingCustomerCopyEmailTransport
		 * @description
		 * Function called before sending a copy email of the invoice to a customer which is not in database
		 * This function is called just before .Process(). This way, you can still customize notifications, variables, etc of the transport given in parameter
		 * Same signature as {@link Lib.AR.Customization.Deliveries.FinalizeNonExistingCustomerEmailTransport}
		 * @param {xTransport} email xTransport object obtained with Process.CreateTransport()
		 * @param {Lib.AR.Customization.Deliveries.Context} context object with the following 2 getters GetSupplierUser() and GetCustomerUser()
		 * @returns {boolean} If set to false the email won't be sent.
		*/
		FinalizeNonExistingCustomerCopyEmailTransport: function (email, context)
		{
			// return true;
		},

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizeExistingCustomerCopyEmailTransport
		 * @description
		 * Function called before sending a copy email of the invoice to a customer which is in database
		 * This function is called just before .Process(). This way, you can still customize notifications, variables, etc of the transport given in parameter
		 * Same signature as {@link Lib.AR.Customization.Deliveries.FinalizeNonExistingCustomerEmailTransport}
		 * @param {xTransport} email xTransport object obtained with Process.CreateTransport()
		 * @param {Lib.AR.Customization.Deliveries.Context} context object with the following 2 getters GetSupplierUser() and GetCustomerUser()
		 * @returns {boolean} If set to false the email won't be sent.
		*/
		FinalizeExistingCustomerCopyEmailTransport: function (email, context)
		{
			//SampleEditCusiNotification(email, context);
			// return true;
		},

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizePecEmailTransport
		 * @description
		 * Customizes the certified email settings of the Customer invoices (supplier copy) process. This function is called before the email is sent.
		 * Function called before sending an email
		 * NB: the created transport is a command line
		 * This function is called just before .Process(). This way, you can still customize notifications, variables, etc of the transport given in parameter
		 * @param {xTransport} pecEmail xTransport object obtained with Process.CreateTransport()
		 * @param {Lib.AR.Customization.Deliveries.Context} context object with the following 2 getters GetSupplierUser() and GetCustomerUser()
		 * @returns {boolean} If set to false the email won't be sent.
		 * 
		 * @example This user exit sets the Payment_Notification.htm notification file as the new template for the email that is generated by the PEC command line.
		 * var firstAttachment = pecEmail.GetAttachs(true).GetAttach(0);
		 * var firstAttachmentVars = firstAttachment.GetVars();
		 * var customTemplateContent = context.GetSupplierUser().GetTemplateContent("Payments_Notification.htm", true);
		 * firstAttachmentVars.AddValue_String("AttachContent", customTemplateContent, true);
		 */
		FinalizePecEmailTransport: function (pecEmail, context)
		{
			//SampleEditTemplate(pecEmail, context);
			// return true;
		},

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizeWelcomeEmailTransport
		 * @description
		 * Function called before sending the welcome email only (not called if welcome email is included in another transport)
		 * This function is called just before .Process(). This way, you can still customize notifications, variables, etc of the transport given in parameter
		 * Same signature as {@link Lib.AR.Customization.Deliveries.FinalizeNonExistingCustomerEmailTransport}
		 * @param {xTransport} email xTransport object obtained with Process.CreateTransport()
		 * @param {Lib.AR.Customization.Deliveries.Context} context object with the following 2 getters GetSupplierUser() and GetCustomerUser()
		 * @returns {boolean} If set to false the welcome email won't be sent.
		*/
		FinalizeWelcomeEmailTransport: function (email, context)
		{
			// return true;
		},

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizeMODTransport
		 * @description
		 * Function called before sending an invoice by mod
		 * This function is called just before .Process(). This way, you can still customize notifications, variables, etc of the transport given in parameter
		 * @param {xTransport} mod xTransport object obtained with Process.CreateTransport()
		 * @param {Lib.AR.Customization.Deliveries.Context} context object with the following 2 getters GetSupplierUser() and GetCustomerUser()
		 * 		The object also includes the IsResendInvoice property that is set to true when a copy of the invoice is sent by mail using the Resend invoice process.
		 * @returns {boolean} If set to false the MOD won't be processed
		 * 
		 * @example
		 * // Sets the mail color to black and white
		 * var modVars = mod.GetUninheritedVars();
		 * modVars.AddValue_String("Color", "N", 0);
		 *
		 * // Adds a NPAI/PND notification
		 * var notif = mod.AddNotif(9);
		 * var supplierVars = context.GetSupplierUser().GetVars();
		 * var notifVars = notif.GetVars();
		 * var notifOptions = {
		 * 	NotifyTemplateFile: "npai_template.txt",
		 * 	NotifyTemplateSkin: "EskerOnDemand",
		 * 	NotifyTemplateOwnerID: supplierVars.GetValue_String("OwnerID", 0),
		 * 	NotifyFilter: "(state=200)(statuscode=10000)", // status code 10000 is NPAI
		 * 	NotifyAddressType: "SM",
		 * 	NotifyAddress: supplierVars.GetValue_String("EmailAddress", 0),
		 * 	NotifyIncludeAttachments: "0",
		 * 	NotifySubjectTemplate: "NPAI",
		 * 	OwnerID: Data.GetValue("OwnerId"),
		 * 	FromLanguage: supplierVars.GetValue_String("Language", 0),
		 * 	FromCulture: supplierVars.GetValue_String("Culture", 0),
		 * 	FromTimeZone: supplierVars.GetValue_String("TimeZoneIndex", 0)
		 * };
		 * for (var opt in notifOptions)
		 * {
		 * 	notifVars.AddValue_String(opt, notifOptions[opt], true);
		 * }
		 */
		FinalizeMODTransport: function (mod, context)
		{
			//SampleSetBlackAndWhiteMod(mod, context);
			//SampleAddNotification(mod, context);
			//return true;
		},

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizeFaxTransport
		 * @description
		 * Customizes the fax settings of the application.
		 * Function called before sending an invoice by fax
		 * This function is called just before .Process(). This way, you can still customize notifications, variables, etc of the transport given in parameter
		 * @param {xTransport} fax xTransport object obtained with Process.CreateTransport()
		 * @param {Lib.AR.Customization.Deliveries.Context} context object with the following 2 getters GetSupplierUser() and GetCustomerUser()
		 * @returns {boolean} If set to false the fax won't be sent.
		 * 
		 * @example his user exit sets the FaxNumber variable of the fax transport to 0555555555.
		 * var faxVars = fax.GetUninheritedVars();
		 * faxVars.AddValue_String("FaxNumber", "0555555555", true);
		 * return true;
		 */
		FinalizeFaxTransport: function (fax, context)
		{
			// return true;
		},

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizePortalPublicationProcess
		 * @description
		 * Customizes the Customer portal settings.
		 * Function called before submitting the portal publication process
		 * This function is called just before .Process(). This way, you can still customize notifications, variables, etc of the transport given in parameter
		 * @param {xTransport} cusi xTransport object obtained with Process.CreateTransport()
		 * @param {Lib.AR.Customization.Deliveries.Context} context object with the following 2 getters GetSupplierUser() and GetCustomerUser()
		 * 
		 * @example This user exit sets the Payments_Notification.htm as template for the Customer invoice (customer copy) process.
		 * var notifList = cusi.GetNotifs(true);
		 * if (notifList.GetNbNotifs() > 0)
		 * {
		 *     var notif = notifList.GetNotif(0);
		 *     var notifsVars = notif.GetVars();
		 *     notifsVars.AddValue_String("NotifyTemplateFile", "Payments_Notification.htm", true);
		 * }
		 */
		FinalizePortalPublicationProcess: function (cusi, context)
		{
		},

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizeEDISubmissionProcess
		 * @description
		 * Customizes the EDI submission settings of the application.
		 * Function called before submitting the "EDI Submission" process
		 * This function is called just before .Process(). This way, you can still customize notifications, variables, etc of the transport given in parameter
		 * @param {xTransports} ediSubmission xTransport object obtained with Process.CreateProcessInstance()
		 * @param {Lib.AR.Customization.Deliveries.Context} context object with the following 2 getters GetSupplierUser() and GetCustomerUser()
		 * 
		 * @example This user exit sets the Invoices subject with the Subject variable of the EDI delivery method.
		 * var ediSubmissionVars = ediSubmission.GetUninheritedVars();
		 * ediSubmissionVars.AddValue_String("Subject", "Invoices", true);
		 */
		FinalizeEDISubmissionProcess: function (ediSubmission, context)
		{
		},

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizeThirdPartyArchivingProcess
		 * @description
		 * Function called before submitting the "Third Party Archiving" process
		 * This function is called just before .Process(). This way, you can still customize notifications, variables, etc of the transport given in parameter
		 * @param {xTransport} processSubmission xTransport object obtained with Process.CreateProcessInstance()
		 * @param {Lib.AR.Customization.Deliveries.Context} context object with the following 2 getters GetSupplierUser() and GetCustomerUser()
		 */
		FinalizeThirdPartyArchivingProcess: function (processSubmission, context)
		{
		},

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizeSUPIGeneration
		 * @description
		 * Called at the end of SUPI generation script.
		 * Can be used to add custom deliveries
		 */
		FinalizeSUPIGeneration: function ()
		{
		},

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizeCUSIGeneration
		 * @description
		 * Called at the end of CUSI generation script.
		 * Can be used to add custom deliveries
		 */
		FinalizeCUSIGeneration: function ()
		{
		},

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizeSplittingGeneration
		 * @description
		 * Called at the end of Splitting generation script.
		 */
		FinalizeSplittingGeneration: function ()
		{
		},

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizeResendGeneration
		 * @description
		 * Called at the end of Resend generation script.
		 * Can be used to add custom deliveries
		 */
		FinalizeResendGeneration: function ()
		{
		},

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizeResendMODTransport
		 * @description
		 * Customizes the mail settings of the Resend invoice process. This user exit is called before the mail is sent.
		 * Function called before resending an invoice by mod
		 * This function is called just before .Process(). This way, you can still customize notifications, variables, etc of the transport given in parameter
		 * @param {xTransport} mod xTransport object obtained with Process.CreateTransport()
		 * @param {Lib.AR.Customization.Deliveries.Context} context object with the following 2 getters GetSupplierUser() and GetCustomerUser()
		 * @returns {boolean} If set to false the MOD won't be processed.
		 * 
		 * @example This user exit sets the French First-Class Mail mailing service to send a copy of the invoice by mail.
		 *	FinalizeResendMODTransport: function(mod, context)
		 *	{
		 * 		var vars = mod.GetUninheritedVars();
		 *		vars.AddValue_String("StampType", "E", true);
		 *		return true;
		 *	}
		 */
		FinalizeResendMODTransport: function (mod, context)
		{
			// return true;
		},

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizeResendEmailTransport
		 * @description
		 * Customizes the email settings of the Resend invoice process. This user exit is called before the email is sent.
		 * Function called before resending an invoice by e-mail
		 * This function is called just before .Process(). This way, you can still customize notifications, variables, etc of the transport given in parameter
		 * @param {xTransport} email xTransport object obtained with Process.CreateTransport()
		 * @param {Lib.AR.Customization.Deliveries.Context} context object with the following 2 getters GetSupplierUser() and GetCustomerUser()
		 * @example This user exit changes the default body of the email used to send a copy of the invoice. It retrieves the content of the EInvoice_CustomResendInvoice.txt template file.
		 * @returns {boolean} If set to false the email won't be resent.
		 * 
		 * @example
		 *	FinalizeResendEmailTransport: function(email, context)
		 *	{
		 * 		var user = Users.GetUserAsProcessAdmin(Data.GetValue("OwnerID"))
		 * 		var vars = email.GetUninheritedVars();
		 *		vars.AddValue_String("Message", user.GetTemplateContent("EInvoice_CustomResendInvoice.txt", true), true);
		 *	}
		 *
		 * @example Add a custom attach
		   *	FinalizeResendEmailTransport: function(email, context)
		 *	{
		 *		var attach = email.AddAttach();
		 *		var attachVars = attach.GetVars();
		 *		attachVars.AddValue_String("AttachOutputName", "Custom attach.html", true);
		 *		attachVars.AddValue_String("AttachType", "inline", true);
		 *		attachVars.AddValue_String("AttachContent", "&lt;html&gt;&lt;body&gt;&lt;b&gt;Custom attach content&lt;b&gt;&lt;/b&gt;&lt;/body&gt;&lt;/html&gt;", true);
		 *		attachVars.AddValue_String("AttachEncoding", "utf-8", true);
		 *		return true;
		 *	}
		 */
		FinalizeResendEmailTransport: function (email, context)
		{
			// return true;
		},

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizeResendFaxTransport
		 * @description
		 * Customizes the fax settings of the Resend invoice process. This user exit is called before the fax is sent.
		 * Function called before resending an invoice by fax
		 * This function is called just before .Process(). This way, you can still customize notifications, variables, etc of the transport given in parameter
		 * @param {xTransport} fax xTransport object obtained with Process.CreateTransport()
		 * @param {Lib.AR.Customization.Deliveries.Context} context object with the following 2 getters GetSupplierUser() and GetCustomerUser()
		 * @returns {boolean} If set to false the fax won't be resent.
		 * 
		 * @example This user exit sets the fax quality to Low when sending the copy of the invoice by fax.
		 *	FinalizeResendFaxTransport: function(fax, context)
		 *	{
		 * 		var vars = fax.GetUninheritedVars();
		 * 		vars.AddValue_String("FaxQuality", "0", true);
		 *		return true;
		 * 	}
		 */
		FinalizeResendFaxTransport: function (fax, context)
		{
			// return true;
		},

		/**
		 * @method Lib.AR.Customization.Deliveries.ValidateGroupedEmails
		 * @description
		 * Validates an grouped email. Function called before processing the grouped invoices.
		 * Can be used to skip sending the grouped email be returning false.
		 * @param {Lib.AR.Customization.Deliveries.InvoiceGroupingData[]} invoices array of grouped invoices
		 * @returns {boolean} if <code>false</code> is returned the grouped email won't be sent.
		 * 
		 * @example This user exit skips sending the grouped email when there is only one grouped invoice.
		 * return invoices.length > 1;
		 */
		/*
		ValidateGroupedEmails: function (invoices)
		{
			return true;
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizeGroupedNotificationsTransport
		 * @description
		 * Customizes the grouped email notification of the application.
		 * Function called before sending the grouped invoices notification email
		 * This function is called just before .Process(). This way, you can still customize notifications, variables, etc of the transport given in parameter
		 * @param {xTransport} email xTransport object obtained with Process.CreateTransport()
		 * @param {Lib.AR.Customization.Deliveries.Context} context object with the following 2 getters GetSupplierUser() and GetCustomerUser()
		 * @param {Lib.AR.Customization.Deliveries.InvoiceGroupingData[]} invoices array of invoice objects to be grouped. Modifying this parameter won't impact the email transport as this user exit it's called just before transport Process(). The invoice objects have the following properties: supiMsnex, cusiMsnex, cusiRUIDEX, cusiArchiveDuration, customerID, customerDeliveryMethod, number, date, dueDate, totalAmount, currency, isSigned, sendWelcomeEMail, passwordUrl, customerEmailAddress, supplierOwnerID, files
		 * 
		 * @example This user exit implements a validation step before sending grouped notifications email to the customer number 31051987.
		 * var customerObj = context.GetCustomerUser();
		 * var customerVars = customerObj.GetVars();
		 * var customerLogin = customerVars.GetValue_String("Login");
		 * var customerID = customerLogin.split("$")[1];
		 *
		 * if (customerID === "31051987")
		 * {
		 * 	var emailVars = email.GetUninheritedVars();
		 * 	emailVars.GetValue_String("NeedValidation", "1", true);
		 * }
		 */
		/*
		FinalizeGroupedNotificationsTransport: function (email, context, invoices)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizeGroupedEmailsTransport
		 * @description
		 * Customizes the grouped email notification of the application.
		 * Function called before sending the grouped invoices email with attachments
		 * This function is called just before .Process(). This way, you can still customize notifications, variables, etc of the transport given in parameter
		 * @param {xTransport} email xTransport object obtained with Process.CreateTransport()
		 * @param {Lib.AR.Customization.Deliveries.Context} context object with the following 2 getters GetSupplierUser() and GetCustomerUser()
		 * @param {Lib.AR.Customization.Deliveries.InvoiceGroupingData[]} invoices array of invoice objects to be grouped. Modifying this parameter won't impact the email transport as this user exit it's called just before transport Process(). The invoice objects have the following properties: supiMsnex, cusiMsnex, cusiRUIDEX, cusiArchiveDuration, customerID, customerDeliveryMethod, number, date, dueDate, totalAmount, currency, isSigned, sendWelcomeEMail, passwordUrl, customerEmailAddress, supplierOwnerID, files
		 * 
		 * @example This user exit sets the email subject to Grouped invoices.
		 * var subject = supplierVars.GetValue_String("Grouped invoices", 0);
		 * var vars = email.GetUninheritedVars();
		 * vars.AddValue_String("Subject", subject, true);
		 */
		/*
		FinalizeGroupedEmailsTransport: function (email, context, invoices)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.CustomizeInvoiceGroupingData
		 * @description
		 * Customize the invoice data in the stack of invoices to group
		 * @param {object} data json containing all informations needed about the invoice to group
		 * @param {xTransport} cusiTransport the transport object of the customer copy invoice
		 * 
		 * @example This user exit add the purchase order number in the data
		 * data.psCorner = {
		 *     poNumber: cusiTransport.GetUninheritedVars().GetValue_String("Purchase_order_number__", 0)
		 * }
		 */
		/*CustomizeInvoiceGroupingData: function (data, cusiTransport)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.CustomizeGroupedEmailTableLines
		 * @description
		 * Customize the table lines of invoices grouped in the email
		 * It allows to update the variable %[CustomTag:invoiceLines] used in the template htm
		 * @param {Lib.AR.Customization.Deliveries.Context} context object with the following 2 getters GetSupplierUser() and GetCustomerUser()
		 * @param {object[]} invoices array of invoice objects to be grouped.
		 * @param {string[][]} tableLines array containing lines that are computed by default. You must modify this object to do your customization
		 * Sample of this object before customization:
		 * <pre><code>
		 * [
		 *     [
		 *         "&lt;td>8/25/2020&lt;/td>",
		 *         "&lt;td>4850014&lt;/td>",
		 *         "&lt;td>9/25/2020&lt;/td>",
		 *         "&lt;td align=\"right\">9,319.05&lt;/td>",
		 *         "&lt;td>EUR&lt;/td>",
		 *         "&lt;td>&lt;a href=\"http://invoiceUrl\">View&lt;/a>&lt;/td>"
		 *     ],
		 *     [
		 *         "&lt;td>8/25/2020&lt;/td>",
		 *         "&lt;td>4850015&lt;/td>",
		 *         "&lt;td>9/25/2020&lt;/td>",
		 *         "&lt;td align=\"right\">9,245.05&lt;/td>",
		 *         "&lt;td>EUR&lt;/td>",
		 *         "&lt;td>&lt;a href=\"invoiceUrl\">View&lt;/a>&lt;/td>"
		 *     ]
		 * ]
		 * </code></pre>
		 * @example <caption>This user exit insert a new table cell in third position
		 * You also need to modify the template EInvoices_Grouped_Notification_xx.htm and add
		 * <th>PO number</th>
		 * in the header
		 * See CustomizeInvoiceGroupingData to undertstand how the data was added</caption>
		 * for (var i = 0; i < tableLines.length; i++)
		 * {
		 *     tableLines[i].splice(2, 0, "<td>" + invoiceStack[i].psCorner.poNumber + "</td>");
		 * }
		 */
		/*CustomizeGroupedEmailTableLines: function (context, invoiceStack, tableLines)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizeDeductionClaimGeneration
		 * @description
		 * Customizes the deduction claim generated from the SUPI
		 * Called at the end of Deduction claim generation just before the .Process() in the SUPI script.
		 * This way, you can still customize notifications, variables, etc of the transport given in parameter
		 * @param {xTransport} deduction xTransport object obtained with Process.CreateTransport()
		 * 
		 * @example This user exit sets the claim type of the deduction claim.
		 * var claimType = "Price issue";
		 * var vars = deduction.GetUninheritedVars();
		 * vars.AddValue_String("Deduction_type__", claimType, true);
		 */
		FinalizeDeductionClaimGeneration: function (deduction)
		{
		},

		/**
		 * @method Lib.AR.Customization.Deliveries.AllowDeductionClaimGeneration
		 * @description
		 * Customizes the condition to allow the creation of a deduction claim from the SUPI
		 * Called before generating a Deduction claim from the SUPI script
		 * @returns {boolean} True to allow the creation of a deduction claim from the SUPI
		 * 
		 * @example This user exit allows the generation of deduction claim if the invoice type is a debit.
		 * var isDebit = Data.GetValue("Invoice_Type__") === "DEBIT";
		 * return isDebit;
		 */
		/*
		AllowDeductionClaimGeneration: function ()
		{
			var isDebit = Data.GetValue("Invoice_Type__") === "DEBIT";
			return isDebit;
		},
		*/

		/**
		 * @method Lib.AR.Customization.Deliveries.CustomizeEmails
		 * @description
		* Function called before sending any emails.
		* This way, you can customize some some emails properties
		* @param {Lib.AR.Customization.Deliveries.CustomizeEmailsContext} context
		* context.fromCall can take the following (self explaining values): <em>"CUSTOMERINVOICE", "SUPPLIERINVOICE", "RESENDINVOICE", "EMAILGROUPING"</em>.
		* For <em>"EMAILGROUPING"</em> the user exit will be called once for each grouped email batch the <em>context.configName</em> and <em>context.clientId</em> values aren't provided. In this case you may want to return null in order to use the customized values from the grouped CUSI processes.
		* @return {Lib.AR.Customization.Deliveries.CustomizeEmailsResult}

		* @example <caption>This user exit sets:
		* * The from name to MySubsidiary and the from email address to info@mysubsidiary.com for emails sent to the customer identified by the number 23776820.
		* * The from name to MyCompany and the from email address to info@mycompany.com for emails sent to all other customers.</caption>
		*
		* var fromName = "";
		* var fromEmailAddress = "";
		* if (context.customerId === "23776820")
		* {
		* 	fromName = "MySubsidiary";
		* 	fromEmailAddress = "info@mysubsidiary.com";
		* }
		* else
		* {
		* 	fromName = "MyCompany";
		* 	fromEmailAddress = "info@mycompany.com";
		* }
		*
		* return {
		* 	"fromName": fromName,
		* 	"fromEmailAddress": fromEmailAddress
		* }
		*/
		/*CustomizeEmails: function (context)
		{
			var fromName = "";
			var fromEmailAddress = "";
			switch(context.fromCall)
			{
				case "SUPPLIERINVOICE":
					fromName = "ACME SUPI";
					fromEmailAddress = "acme_supi@esker.com";
					break;
				case "CUSTOMERINVOICE":
					fromName = "ACME CUSI";
					fromEmailAddress = "acme_cusi@esker.com";
					break;
				case "RESENDINVOICE":
					fromName = "ACME RESEND";
					fromEmailAddress = "acme_resend@esker.com";
					break;
				default: // "EMAILGROUPING"
					// If null is returned the values from the (customized) grouped CUSI processes are used
					return null;
				break;
			}

			return {
				"fromName": fromName,
				"fromEmailAddress": fromEmailAddress
			};
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.CustomizeItalianFiscalMentionPDFCommand
		 * @description
		 * Allows you to add a legal mention to PDF invoices submitted by Italian suppliers.
		 * Function called in the SUPI's extraction script. This function is called only if the corresponding invoice
		 * is signed and if the supplier country is Italy. It must be modified to customize the PDF command returned by this function,
		 * otherwise The invoice will be set in error. If this function return an empty string, no PDF command will be added and
		 * the invoice will not be set in error.
		 * @return {string} A PDF command used to add the legal mention to the PDF invoice
		 * 
		 * @example This user exit adds the following mention to the PDF invoice in Italian using the Arial font size 10 in italics:
		 * Fattura emessa da TrustWeaver per conto di XXX - DPR 633/72 art. 21 c. 2, lettera n where XXX is replaced by the name of the supplier.
		 * <pre><code>
		 * return '-instxt %infile[1]% -blt "Arial" 10 -italic -XY 30 120 "' + Language.TranslateInto("_Invoice signed on behalf of {0}", "IT", false, Data.GetValue("Supplier_name__")) + '" 1';
		 * </code></pre>
		 */
		/*CustomizeItalianFiscalMentionPDFCommand: function ()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.CustomizeEmailGroupingKey
		 * @description
		 * If defined, it overrides the default grouping key for email grouping.
		 *
		 * All fields that can be used into the list are fields from the "Customer Invoice (customer copy)" form.
		 * Note that you can't use external variables values to group, only form fields can be set.
		 *
		 * If the user exit is not defined, the default grouping key will be ["Customer_ID__", "Customer_email__"].
		 * The value "Customer_delivery_method__" is implicit: it will be automatically added by the processing into
		 * the list because we won't group email portal notification with emails with attachments.
		 * Technically, the field list is used in the query first, then used to determinate when a new mail has to been sent.
		 *
		 * A common case of custom grouping is using a custom field like "Additional_field_text_1__" (see first example below).
		 *
		 * Be aware of problems that can happen if you remove the "Customer_ID__" from the list, for instance if you
		 * want to group with ["Customer_email__"] only (see second example). It will result into a single email at destination
		 * of several customers with different portals. The first customer read during grouping will be used to determinate top
		 * and bottom links, customer company name, the email language and culture for numbers.
		 * Note that every table links will point the correct portal BUT if the customer is already logged in a portal, clicking
		 * and an other link will be really confusing because the customer will stay on the already connected portal.
		 *
		 * The parameter deliveryMethod will be set with SM for emails with attachments or PORTAL for portal notification.
		 * It allows you to condition in order to have different grouping key foreach delivery method.
		 *
		 * @example
		 *	CustomizeEmailGroupingKey: function(deliveryMethod)
		 *	{
		 *		// We added "Additional_field_text_1__" in the grouping key so that a same customer receive one
		 *		// email grouped by value of this additional field. We can imagine that this field contains a
		 *		// value different for each company or business unit of the same customer.
		 *		// We keep the "Customer_email__" into the key because it might be extracted from the invoice,
		 *		// so a same customer ID could receive several emails.
		 *		return ["Customer_ID__", "Customer_email__", "Additional_field_text_1__"];
		 *	}
		 * @example
		 *	CustomizeEmailGroupingKey: function(deliveryMethod)
		 *	{
		 *		// In this scenario, several customer contacts have the same email address so we want to group
		 *		// all notification into one single email. Be really careful, it brings some problems that are
		 *		// explained above in the user exit description.
		 *		return ["Customer_email__"];
		 *	}
		 * @example
		 *	CustomizeEmailGroupingKey: function(deliveryMethod)
		 *	{
		 *		// In this example we want to define different grouping key for portal notification and email
		 *		// with attachment. For portal notification we want to group like usually, but for the email
		 *		// we want to split by a business field.
		 *		if( deliveryMethod == "SM" )
		 *		{
		 *			// Group emails with attachments by customer and business field
		 *			return ["Customer_ID__", "Customer_email__", "Additional_field_text_1__"];
		 *		}
		 *		else
		 *		{
		 *			// Group portal notifications by customer
		 *			return ["Customer_ID__", "Customer_email__"];
		 *		}
		 *	}

		 * @param {string} deliveryMethod The delivery method, can be "SM" or "PORTAL", both in uppercase.
		 * @return {object} An array of "Customer Invoice (customer copy)" form fields list to group email by
		 */
		/*CustomizeEmailGroupingKey: function (deliveryMethod)
		{
			// default grouping key
			return ["Customer_ID__", "Customer_email__"];
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.GetCopyStampParams
		 * @description
		 * This function allows you to customize the stamp settings for copies of all types of deliveries of the Accounts Receivable application.
		 * The function is called when an invoice is resent to a customer and when a copy of the invoice is sent to a different contact.
		 * It returns either the PDF command string that is used as the infile document or a JavaScript object.
		 * It is call all the time we need to add a copy stamp: copy email, resend invoice, MOD additional copies...
		 * The infile param shouldn't be modified because it results from the process logic.
		 *
		 * This function can return either one of the two types types:
		 * - a string (see pdfCommand below)
		 * - a JavaScript object (see stampParameters below)
		 *
		 * The return value determines the availability of one of the following options in the process.
		 * - Add 'Copy' stamp on invoice: If the function returns a string representing a PDF command.
		 * - Stamp: If the function is not called or is called and returns a JavaScript object.
		 *
		 * @param {string} infile the document to access. This parameter should not be changed.
		 * @param {string} language the language of the copy stamp. The language is used to select the translated version of the stamp text when a copy of the invoice is sent.
		 * @param {string} text the stamp text to use. This text is used when the invoice is resent to the customer.
		 * @returns {string} pdfCommand String representing the new PDF command to use. In this case, the default PDF command is overridden.
		 * @returns {object} stampParameters JavaScript object representing the stamp parameters to use. In this case, the default PDF command is configured.
		 * The object must be specified in the following format:
		 * ```
		 * {
		 * 	position:
		 * 	{
		 * 		origin: <origin>,
		 * 		x: <x_coordinate>,
		 * 		y: <y_coordinate>
		 * 	},
		 * 	boxSize:
		 * 	{
		 * 		height: <height>,
		 * 		width: <width>
		 * 	},
		 * 	font:
		 * 	{
		 * 		name: <font_name>,
		 * 		size: <font_size>,
		 * 		bold: <font_weight>,
		 * 		color: <font_color>,
		 * 		interline: <line_spacing>
		 * 	},
		 * 	pages: <pages>
		 * };
		 * ```
		 * where the fields are defined below:
		 *
		 * @returns {object} stampParameters.position Contains information about the position of the stamp. The object has the following parameters:
		 * | Parameter | Type | Description | Default value |
		 * | --- | --- | --- | --- |
		 * | origin | String | The position of origin of the stamp. The parameter can take one of the following values:<br><br>* topleft<br>* topright<br>* bottomleft<br>* bottomright | topright |
		 * | x   | String | X coordinate of the stamp. | 50  |
		 * | y   | String | Y coordinate of the stamp. | 50  |
		 * @returns {object} stampParameters.boxSize Contains information about the dimensions of the stamp. The object has the following parameters:
		 * | Parameter | Type | Description | Default value |
		 * | --- | --- | --- | --- |
		 * | height | String | The height of the stamp. | 60  |
		 * | width | String | The width of the stamp. | 150 |
		 * It is recommended to not specify this parameter.
		 * If this parameter is specified, the font size of the stamp text is disregarded and the text is stretched to fill the box. The resulting text may appear distorted.
		 * @returns {object} stampParameters.font Contains information about the font of the stamp. The object has the following parameters:
		 * | Parameter | Type | Description | Default value |
		 * | --- | --- | --- | --- |
		 * | name | String | Name of the font. | Arial Black |
		 * | size | String | Font size. | 12  |
		 * | bold | Boolean | Font weight. The parameter can take one of the following values:<br><br>* true: Font changes to bold.<br>* false: Font remains normal. | true |
		 * | color | String | Font color. | red |
		 * | interline | Integer | Spacing between the lines of a custom multiline stamp. | 1 |
		 * @returns {object} stampParameters.pages Represents pages on which the stamp is to be affixed. By default, the value of this parameter is set to ALL.
		 *
		 * @example <caption>The user exit sets the copy stamp in English on the top right hand corner of the invoice copies.</caption>
		 * GetCopyStampParams: function (infile, language)
		 * {
		 * 	return "-annot " + infile + " -stamp -lang " + "en" + " EskCopy ALL -topright 50 50 100 -opacity 60 -rotate 45";
		 * }
		 *
		 * @example <caption>The user exit changes the copy stamp on the top right corner of the invoices resent by vendors:</caption>
		 * GetCopyStampParams: function (infile, language, text)
		 * {
		 * 	return "-annot " + infile + " -text\"" + text + "\" ALL -topright 50 50 100 -opacity 60 -rotate 45";
		 * }
		 *
		 * @example <caption>The user exit changes the default size and position of the stamp.</caption>
		 * GetCopyStampParams: function (infile, language)
		 * {
		 * 	var params =
		 * 	{
		 * 		position:
		 * 		{
		 * 			origin: "topright",
		 * 			x: "100",
		 * 			y: "70"
		 * 		},
		 * 		font:
		 * 		{
		 * 			name: "Calibri",
		 * 			size: "14",
		 * 			bold: false,
		 * 			color: "red",
		 * 			interline: 1
		 * 		},
		 * 		pages: "ALL"
		 * 	};
		 * 	return params;
		 * }
		 */
		/*GetCopyStampParams: function (infile, language, text)
		{
			return {
				position: { origin: "trt", x: "30", y: "30" },
				font: { name: "Arial Black", size: "20", bold: false, color: "red", interline: "1" },
				pages: "ALL"
			};
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.GetFacturXLogoParams
		 * @description
		 * This function allows you to customize the size and position of the Factur-X logo image affixed on the invoices delivered in the Factur-X format.
		 * The function is called when converting the invoice in the Factur-X format, before the logo image is affixed on the invoice. It returns the customized position and size properties of the Factur-X logo image.
		 * This function returns a json containing parameters to customize the FacturX conformance logo added to the invoice.
		 * Is is possible to adjust the logo position by specifying the position property which must contains "origin", "x" and "y" attributes
		 * The size of the logo is also updatable with the property "percentage"
		 * If you want to remove the logo, you can simply do "return;"
		 * @return {Lib.AR.Customization.Deliveries.FacturXLogoParams}
		 * 
		 * @example This user exit overrides the default position and size of the Factur-X logo image.
		 * var params = {
		 *     position: {
		 *         origin: "topright",
		 *         x: "200",
		 *         y: "200"
		 *     },
		 *     percentage: 150
		 * };
		 * return params;
		 */
		/*GetFacturXLogoParams: function ()
		{
			return {
				position: {
					origin: "topright",
					x: 25,
					y: 25
				},
				percentage: 150
			};
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.GetModAdditionalCopies
		 * @description
		 * Allows you to set the number of invoice copies to be sent by mail.
		 * This function is used to get the number of additional MOD copies generated by the supplier invoice process
		 * If returned value is a valid positive number, the setting used for current customer is overriden
		 * @param {object} context object with the following 2 getters  GetSupplierUser() and GetCustomerUser()
		 * @return {number}
		 * 
		 * @example Disable any additional copy for all customers
		 * return 0;
		 */
		/*GetModAdditionalCopies: function (context)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.GetFileConversionParams
		 * @description
		 * Allows you to convert an invoice or a credit note by passing conversion options to the File.ConvertFile function.
		 * This user exit is called in the Customer invoices (supplier copy) process, before the invoice or credit note is sent.
		 * For more information, see File.ConvertFile function documentation
		 * @return {string|object} If returned type is "string", returned value will be used as conversion type.
		 * If returned type is "object", returned value will be passed as conversion parameters to File.ConvertFile function.
		 * If returned value is null or undefined, no conversion will be done.
		 * 
		 * @example This user exit sets the invoice conversion type to the PDF/A-3
		 *	GetFileConversionParams: function()
		 *	{
		 * 		return "PDFA-3";
		 * 	}
		 * @example This user exit sets the invoice conversion type to the PDF/A-3 format and changes the version of the Ghostscript converter to 9.23.
		 *	GetFileConversionParams: function()
		 *	{
		 * 		return {
		 * 			"conversionType": "PDFA-3",
		 * 			"conversionOptions": "?ps2pdfgsver=9.23"
		 * 		};
		 * 	}
		 */
		/*GetFileConversionParams: function()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.ActivateEmailGrouping
		 * @description
		 * Disables or enables email notification grouping for the current invoice by overriding the Group invoices in a daily digest option if defined in the delivery settings of the configuration tool. Also overrides the Disable daily invoice digests option of the customer form.
		 * This user exit is called in the Customer invoices (supplier copy) process before any notification email is sent to the customer.
		 * @param {string} deliveryMethod Customer delivery method. Possible values:
		 * * `NONE`: No delivery
		 * * `PORTAL`: Customer portal
		 * * `SM`: Email with attachment
		 * * `EXTERNALPORTAL`: Customer's AP portal
		 * * `MOD`: Mail
		 * * `FGFAXOUT`: Fax
		 * @param {boolean} isInvoiceToGroup Boolean value indicating whether email notification grouping is defined for the current invoice. This value is computed from the `Group invoices in a daily digest option` of the configuration tool and the `Disable daily invoice digests` option of the customer form.
		 * @param {Lib.AR.Customization.Deliveries.Context} context object with the following 2 getters GetSupplierUser() and GetCustomerUser()
		 * @returns {boolean} true to group emails in a daily digest, else false to send emails immediately.
		 * 
		 * @example This user exit disables email grouping for Spanish customers and enables email grouping for all other customers.
		 * var country = Data.GetValue("Customer_bill_to_country__");
		 * if (country === "ES")
		 * {
		 *     Log.Info("User exit ActivateEmailGrouping: disabling grouping for Spanish customers");
		 *     return false;
		 * }
		 * Log.Info("User exit ActivateEmailGrouping: keep computed grouping");
		 * return isInvoiceToGroup;
		 */
		/*ActivateEmailGrouping: function(deliveryMethod, isInvoiceToGroup, context)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.ActivateTermSyncNotification
		 * @description
		 * Enable the TermSync Notification when invoice delivery status is updated.
		 * If TermSync notification is activated function AddTermSyncNotificationOnInvoiceDelivery is called to fill the variables:
		 * * `TermSyncNotificationType` in the Customer invoices (supplier copy) process. Possible values are :
		 * * * `INV_DELIVERY_EMAIL_UPDATED` : For email delivery
		 * * * `INV_DELIVERY_MOD_UPDATED` : For mail delivery
		 * * * `INV_DELIVERY_FAX_UPDATED` : For Fax delivery
		 * * * `INV_DELIVERY_EDI_UPDATED` : For edi delivery
		 * * * `INV_DELIVERY_RPA_UPDATED` : For rpa delivery
		 * * * `INVOICE_UPDATED` : For Customer invoices (supplier copy) process status updated
		 * * `TermSyncNotificationData` in the Customer invoices (supplier copy) process. Data values depends on `TermSyncNotificationType`
		 * Then a record is inserted in the System table 'TERMSYNCNOTIFICATION'.
		 * @returns {boolean} true to activate TermSync notification on invoice deliveries
		 */
		/*ActivateTermSyncNotification: function()
		{
			return true;
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizeTermSyncNotificationData
		 * @description
		 * Customize the TermSyncNotificationData Object
		 * This function is called when TermSync notifications are activated
		 * @param {object} termsyncData JSON that describes data to be exposed in TermSync notification. Data differs depending on delivery type
		 * @param {string} type type to observe. Values can be :
		 * * `email` : For email with attachment
		 * * `mod` : For mail
		 * * `fax` : For Fax
		 * * `edi` : For edi
		 * * `rpa` : For robot process automation
		 * * `supi` : Customer invoices (supplier copy) process
		 * 
		 * @example This user exit adds, if the delivery type is email, the invoice date and the invoice total amount in the termsyncData object to be exposed in `TERMSYNCNOTIFICATION` table
		 * if(type === "email")
		 * {
		 * 	termsyncData["invoiceDate"] = "%[Invoice_date__]";
		 * 	termsyncData["invoiceTotalAmount"] = "%[Invoice_total_amount__]";
		 * }
		 */
		/*FinalizeTermSyncNotificationData: function(termsyncData, type)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.FinalizeInvoiceNotDeliveredBySDIEmailTransport
		 * @description
		 * Customizes the notification email of invoice availability on the SDI platform.
		 * Function called before sending a notification to the italian customer
		 * to inform him that its invoice could not be sent by the SDI platform
		 * This function is called just before .Process(). This way, you can still customize notifications, variables, etc of the transport given in parameter
		 * @param {object} email xTransport object obtained with Process.CreateTransport()
		 * @param {object} context object with the following 2 getters GetSupplierUser() and GetCustomerUser()
		 * 
		 * @example This user exit uses an alternative template to send the notification email.
		 * if (context.GetCustomerUser().GetVars().GetValue_String("AdditionalField1", 0) === "UseAlternateTemplate")
		 * {
		 * 	var firstAttachment = email.GetAttachs(true).GetAttach(0);
		 * 	var firstAttachmentVars = firstAttachment.GetVars();
		 * 	var customTemplateContent = context.GetCustomerUser().GetTemplateContent("AlternateTemplate.htm", true);
		 * 	firstAttachmentVars.AddValue_String("AttachContent", customTemplateContent, true);
		 * }
		 */
		/*FinalizeInvoiceNotDeliveredBySDIEmailTransport: function(email, context)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.PrepareDeliveriesGeneration
		 * @description
		 * Function called before finalization of the supplier invoice process
		 *  @param {object} supplierOwnerID with an "ownerID" attribut
		 *  @param {object} customerOwnerID with an "ownerID" attribut
		 */
		/*PrepareDeliveriesGeneration: function(supplierOwnerID, customerOwnerID)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.PrepareDeliveriesGenerationWithRelatedDocuments
		 * @description
		 * Function called before finalization of the supplier invoice process
		 *  @returns {object} Optional, return property 'stopProcessing' to stop the processing (no deliveries will be created this script try).
		 * Can be used to stop processing after calling Process.WaitForUpdate(). Another process could then set State=50 on the SUPI in order to resume processing.
		 * If you create a process in this user exit, you should not condition its creation, as there is a mecanism on retries that ignore the .process already done.
		 * 
		 * @example This user exit stops the processing if a specific condition is met.
		 * PrepareDeliveriesGenerationWithRelatedDocuments: function()
		 * {
		 *    if (ShouldStopProcessing)
		 *    {
		 * 	    return { stopProcessing: true };
		 *    }
		 * }
		 */
		/*PrepareDeliveriesGenerationWithRelatedDocuments: function()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.CustomizeTemplateForPortalNotification
		 * @description
		 * Function called when retrieving the name of the template used for the notification on the portal.
		 * Default value used if nothing is returned in this customization function is "EInvoice_EmailWithLink".
		 * This name will also be suffixed by :
		 *   - "SignedValidated" if the value of the field Sign_invoice__ is equal to true
		 *   - "_welcome" if the parameter "ConcatWelcomeInvoiceEmail" has been selected in the AR parameters
		 *  @param {string} invoiceType Invoice type used in the process
		 *  @returns {string} Name of the template to use
		 * 
		 *  @example This user exit returns a custom template to use when the invoice type is credit note or debit.
		 *  var templateName = "EInvoice_EmailWithLink";
		 *  if (invoiceType === "CREDIT_NOTE") {
		 *		templateName = "EInvoiceForCreditNote";
		 *  } else if (invoiceType === "DEBIT") {
		 *		templateName = "EInvoiceForDebit";
		 *  }
		 *  return templateName;
		 */
		/*CustomizeTemplateForPortalNotification: function(invoiceType)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.CustomizeEmailTemplateOption
		 * @description
		 * Function called when retrieving the template content before sending invoice by email.
		 * @param {object} templateOptions JavaScript object containing template option like customTag, templateName...
		 *	{
		 *	 "templateName": "templateName",
		 * 	 "replaceTags": true,
		 * 	 "customTags": {
		 *		displayLinks: false,
		 *      realCustomerEmail: Data.GetValue("Customer_email__")
		 *      ...
		 *	 }
		 *	}
		 *  @example This user exit custom the template option to add customtag and configure the language options with addidition field value.
		 *	CustomizeEmailTemplateOption: function (templateOptions)
		 *	{
		 *	 templateOptions.customTags.customerName = Data.GetValue("Customer_name__");
		 *	 templateOptions.language = Data.GetValue("Additional_field_text_2__").toLowerCase();
		 *	}
		 */
		/*CustomizeEmailTemplateOption: function(templateOptions)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.GetCustomizeTransportSubject
		 * @description
		 * Function to customize the transportSubject.
		 *  @param {string} translationKey The key of the language file of the process
		 *  @param {string} destinationLanguage Invoice type used in the process. Values can be :
		 * * `EN` : English
		 * * `FR` : French
		 * * `DE` : German
		 * * `IT` : Italian
		 * * `ES` : Spanish
		 *	@param {boolean} useBrackets Value controlling the return value in case of an error
		 *	@param {object} invoice Invoice object
		 *  @param {object} supplier Supplier object
		 *  @param {object} customer Customer object
		 *  @returns {string} Subject of the transport
		 * 
		 *  @example This user exit returns the subject of the transport customized.
		 * GetCustomizeTransportSubject: function (translationKey, destinationLanguage, useBrackets, invoice, supplier, customer)
		 * {
		 * 	return Language.TranslateInto(translationKey, destinationLanguage, true, invoice.number, supplier.name, customer.ID, customer.Name);
		 * }
		*/
		/*
		GetCustomizeTransportSubject: function (translationKey, destinationLanguage, useBrackets, invoice, supplier, customer)
		{
			//return Language.TranslateInto(translationKey, destinationLanguage, true, invoice.number, supplier.name, customer.ID, customer.Name);
			return null;
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.InitializeCustomizationAllTransport
		 * @description
		 * This function is called at the early beginning of GenerateAllTransports function in the
		 * Customer invoices (supplier copy) process, at finalization.
		 * It allows you to initialize some variables and external variables,
		 * before the generation of the transports.
		 *  @returns {void} Nothing, as it's an initialization function
		 * 
		 *  @example This user exit will force the profile to EN16931 for the Factur-X generation.
		 *	InitializeCustomizationAllTransport: function ()
		 *	{
		 *	 Variable.SetValueAsString("CustomFacturXProfile", "EN16931"); // other possible value is "BASIC_WL" (default)
		 *	}
		*/
		/*InitializeCustomizationAllTransport: function ()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Deliveries.BypassCheckRelatedDocuments
		 * @description
		 * Function called at the end of the finalization of the supplier invoice process
		 *  @returns {boolean} If set to true the related document is not check before to finish process.
		 * @example This user bypass function to check related documents at the end of the finalizationscript.
		 * BypassCheckRelatedDocuments: function()
		 * {
		 *    return true;
		 * }
		 */
		/*BypassCheckRelatedDocuments: function()
		{
		}*/
	};

	// Samples functions
	/*function SampleEditEmailTemplate(email, context)
	{
		var firstAttachment = email.GetAttachs(true).GetAttach(0);
		var firstAttachmentVars = firstAttachment.GetVars();
		var customTemplateContent = context.GetSupplierUser().GetTemplateContent("Payments_Notification.htm", true);
		firstAttachmentVars.AddValue_String("AttachContent", customTemplateContent, true);
	}*/


	/*function SampleEditCusiNotification(email, context)
	{
		var notifList = email.GetNotifs(true);
		if (notifList.GetNbNotifs() > 0) {
			var notif = notifList.GetNotif(0);
			var notifsVars = notif.GetVars();
			notifsVars.AddValue_String("NotifyTemplateFile", "Payments_Notification.htm", true);
		}
	}*/

	/*function SampleSetBlackAndWhiteMod(mod, context)
	{
		var modVars = mod.GetUninheritedVars();
		modVars.AddValue_String("Color", "N", 0);
	}*/

	/*function SampleAddNotification(mod, context)
	{
		var customerVars = context.GetCustomerUser().GetVars();
		var notif = mod.AddNotif(9);
		var notifVars = notif.GetVars();

		var notifOptions = {
			NotifyTemplateFile:			"EInvoice_ResendInvoicePopup.txt",
			NotifyTemplateSkin: 		"EskerOnDemand",
			NotifyTemplateOwnerID: 		customerVars.GetValue_String("OwnerID", 0),
			NotifyFilter: 				"(state=100)",
			NotifyAddressType: 			"SM",
			NotifyAddress: 				customerVars.GetValue_String("EmailAddress", 0),
			NotifyIncludeAttachments: 	"0",
			NotifySubjectTemplate: 		"NPAI",
			OwnerID: 					Data.GetValue("OwnerId"),
			FromLanguage: 				customerVars.GetValue_String("Language", 0),
			FromCulture: 				customerVars.GetValue_String("Culture", 0),
			FromTimeZone: 				customerVars.GetValue_String("TimeZoneIndex", 0),
			ToName: 					Data.GetValue("Customer_ID__"),
			ToCompany: 					Data.GetValue("Customer_name__"),
			Identifier: 				Data.GetValue("Invoice_number__")
		};

		for (var opt in notifOptions) {
			notifVars.AddValue_String(opt, notifOptions[opt], true);
		}
	}*/

	return Deliveries;

})();
