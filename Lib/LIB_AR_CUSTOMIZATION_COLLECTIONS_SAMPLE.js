/* LIB_DEFINITION{
  "name": "LIB_AR_CUSTOMIZATION_COLLECTIONS_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "comment": "Collections Management module (aka TermSync) customization functions",
  "versionable": false,
  "require": []
}*/

/**
 * Collections Management module (aka TermSync) customization functions
 * @namespace Lib.AR.Customization.Collections
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};

Lib.AR.Customization.Collections = (function ()
{
	var Collections =
	{
		/**
		 * Definition of type contact
		 *
		 * @interface Lib.AR.Customization.Collections.Contact
		 */

		/**
		 * @function Lib.AR.Customization.Collections.Contact.GetValue
		 * @description
		 * Allow to retrieve the value of the specified field of a contact object. fieldName is case-insensitive
		 * @param {string} fieldName Name of the field you want to retrieve. You can refer to the [Viewing customer contact properties]{@link https://doc.esker.com/eskerondemand/cv_ly/en/manager/startpage.htm#processes/AR/Customer_Contacts_Editing.html} and to the [Setting customer preferences]{@link https://doc.esker.com/eskerondemand/cv_ly/en/manager/Content/processes/Portal/advanced_delivery_options_AR.html} to see the field you can define.
		 * @return {any} The value of the field you put in parameter. the return type depend of the field.
		 */

		/**
		 * @function Lib.AR.Customization.Collections.Contact.SetValue
		 * @description
		 *  Allow to set the value of the specified field of a contact object. fieldName is case-insensitive. value can be any type you want
		 * @param {any} value The value you want to assign to the field.
		 * @param {string} fieldName Name of the field you want to retrieve. You can refer to the [Viewing customer contact properties]{@link https://doc.esker.com/eskerondemand/cv_ly/en/manager/startpage.htm#processes/AR/Customer_Contacts_Editing.html} and to the [Setting customer preferences]{@link https://doc.esker.com/eskerondemand/cv_ly/en/manager/Content/processes/Portal/advanced_delivery_options_AR.html} to see the field you can define.
		 */

		/**
		 * @method Lib.AR.Customization.Collections.CustomizeContactCSVEntry
		 * @description
		 * Modifies the contact data in the CSV file to be exported to the Collections Management module.
		 * This user exit is called in the extraction script of the Synchronization with Collections Management module process.
		 *
		 * @param {Lib.AR.Customization.Collections.Contact} contact Company data to be written to CSV.
		 *
		 * @example <caption>This user exit uses the Description field of the Collections Management module to store the mobile phone number of the customer contact. It also adds the name of the company if the customer contact corresponds to a company.</caption>
		 * CustomizeContactCSVEntry: function(contact)
		 * {
		 * 	// Use 'Description' field to set contact cellphone
		 * 	contact.SetValue("Description", "Cellphone: " + contact.GetValue("MobileNumber"));
		 *
		 * 	if (contact.IsCompany())
		 * 	{
		 * 		// Add company name to contact description
		 * 		contact.SetValue("Description", contact.GetValue("Description") +  " (" + contact.GetValue("company") + ")");
		 * 	}
		 * }
		 */
		/*CustomizeContactCSVEntry: function(contact)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Collections.FinalizeUploadAttachToTermSync
		 * @description
		 * Function called before uploading invoices attachment to Collection Management (TS)
		 * This function is called just before uploading the document in AR System Termsync Invoice Upload
		 * By default, all the attachments of the process are sent to Collection Management
		 * The process has all the attachments of the SUPI and the related documents in SDA
		 * This function allows you to select the indexes of the attachments you want to upload to TS
		 * Warning !! Do not change the index of the invoice (always first position)
		 * @returns {number[]} array of attachments' indexes to upload to TS
		 *
		 * @example <caption> This user exit allows you to chose which attachment to send to Collection management</caption>
		 * FinalizeUploadAttachToTermSync: function ()
		 * {
		 * 	var nbAttach = Attach.GetNbAttach();
		 * 	var attachmentsToUploadIndexes = [];
		 * 	for (let i = 0; i< nbAttach.length; i++)
		 * 	{
		 * 		if (Attach.GetExtension(i) === ".pdf" && Attach.GetSize(i) < 3000) // if the attachment is a pdf lighter than 3MO upload it to TS
		 * 		{
		 * 			attachmentsToUploadIndexes.push(i);
		 * 		}
		 * 	}
		 * 	return attachmentsToUploadIndexes;
		 * }
		 */
		/*FinalizeUploadAttachToTermSync: function ()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Collections.CustomizeUploadProcess
		 * @description
		 * Function called before calling .Process() function on the upload process creation
		 * @param {xTransport} processTSInvoiceUpload xTransport object obtained with Process.CreateProcessInstance() of upload to Termsync process
		 * @returns {void} you can modify the process directly
		 *
		 * @example <caption> This user exit allows you to set vars on the upload process before its creation</caption>
		 * CustomizeUploadProcess: function (processTSInvoiceUpload)
		 * {
		 * 	var processTSInvoiceUploadVars = processTSInvoiceUpload.GetUninheritedVars();
		 * 	// To merge all attachments into one and send only the results of the merge to TS
		 * 	processTSInvoiceUploadVars.AddValue_String("PDFMergeAll", "ignoreInputsMode", true);
		 * }
		 */
		/*CustomizeUploadProcess: function (processTSInvoiceUpload)
		{
		},*/
		/**
		 * @method Lib.AR.Customization.Collections.CustomizeCompanyCSVEntry
		 * @description
		 * Modifies the company data in the CSV file to be exported to the Collections Management module.
		 * This user exit is called in the extraction script of the Synchronization with Collections Management module process.
		 * @param {Lib.AR.Customization.Collections.Contact} company Company data to be written to CSV.
		 *
		 * @example <caption> This user exit adds the country code of the company to the collection group.</caption>
		 * CustomizeCompanyCSVEntry: function(company)
		 * {
		 * 	// Customize collection group by adding company country code
		 * 	company.SetValue("CashCollectionGroup__", company.GetValue("Country") + "/" + company.GetValue("CashCollectionGroup__"));
		 * }
		 */
		/*CustomizeCompanyCSVEntry: function(company)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Collections.CustomizeCSVFilter
		 * @description
		 * Allow the user to filter the customer data that will be exported in the CSV.
		 * This user exit only allows you to make the existing filter more accurate.
		 * the existing filter gets customers who has been updated since the last time they where synchronized.
		 * This user exit is called in the extraction script of the Synchronization with Collections Management module process.
		 * **To be valid, the LDAP filter must be enclosed within parenthesis and cannot have spaces. For example, "filter": "(country=FR)"**
		 * **WARNING: if you already used once this user exit and you want to change the filter or just remove it follow this step :**
		 * - Change the filter in the user exit
		 * - Start a new synchronization process manually
		 * - In the combo box, select Customer Contacts
		 * - /!\ Select the checkbox /!\
		 * - Click on the submit button
		 * @returns {boolean} return true if the customers match the requirements and should be exported in the CSV. Otherwise, return false.
		 *
		 * @example <caption> This user exit allow to export only customer who have country field set as France.</caption>
		 * CustomizeCSVFilter: function()
		 * {
		 *	var filter = "(country=FR)";
		 *	return filter;
		 * }
		 */
		/*CustomizeCSVFilter: function()
		{
		},*/


		/**
		 * @method Lib.AR.Customization.Collections.CustomizeContactAndCompanyQueryFields
		 * @description
		 * Specifies contact and company database fields to query in order to export additional CSV columns to the Collections Management module.
		 * This user exit is called in the validation script of the Synchronization with Collections Management module process.
		 * @returns {array} An array of fields to query. You can refer to the [Viewing customer contact properties]{@link https://doc.esker.com/eskerondemand/cv_ly/en/manager/startpage.htm#processes/AR/Customer_Contacts_Editing.html} and to the [Setting customer preferences]{@link https://doc.esker.com/eskerondemand/cv_ly/en/manager/Content/processes/Portal/advanced_delivery_options_AR.html} to see the field you can define.
		 *
		 * @example <caption> This user exit adds the mobile phone number and the values contained in two additional fields to the CSV files.</caption>
		 * CustomizeContactAndCompanyQueryFields: function()
		 * {
		 * 	// Request 'MobileNumber' for contacts CSV and 'AdditionalField1/AdditionalField2' for companies CSV.
		 * 	return ["MobileNumber", "AdditionalField1", "AdditionalField2"];
		 * }
		 */
		/*CustomizeContactAndCompanyQueryFields: function()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Collections.CustomizeContactCSVColumns
		 * @description
		 * Modifies column names of the contact CSV file.
		 * This user exit is called in the validation script of the Synchronization with Collections Management module process.
		 * @returns {array} Object representing the mapping between company fields and column names. You can refer to the [Viewing customer contact properties]{@link https://doc.esker.com/eskerondemand/cv_ly/en/manager/startpage.htm#processes/AR/Customer_Contacts_Editing.html} and to the [Setting customer preferences]{@link https://doc.esker.com/eskerondemand/cv_ly/en/manager/Content/processes/Portal/advanced_delivery_options_AR.html} to see the field you can define.
		 *
		 * @example <caption> This user exit adds a Description column to the CSV file.</caption>
		 * CustomizeContactCSVColumns: function()
		 * {
		 * 	var mapping = {};
		 * 	// Add 'Description' as computed field
		 * 	mapping["Description"] = "Description";
		 * 	return mapping;
		 * }
		 */
		/*CustomizeContactCSVColumns: function()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Collections.CustomizeCompanyCSVColumns
		 * @description
		 * Modifies column names of the company CSV file. This user exit is called in the validation script of the Synchronization with Collections Management module process.
		 * @returns {array} A map of company field/column name.  You can refer to the [Viewing customer contact properties]{@link https://doc.esker.com/eskerondemand/cv_ly/en/manager/startpage.htm#processes/AR/Customer_Contacts_Editing.html} and to the [Setting customer preferences]{@link https://doc.esker.com/eskerondemand/cv_ly/en/manager/Content/processes/Portal/advanced_delivery_options_AR.html} to see the field you can define.
		 * @example <caption>This user exit adds two custom columns to the csv</caption>
		 * CustomizeCompanyCSVColumns: function()
		 * {
		 * 	var mapping = {};
		 * 	// Use additional fields to map TermSync fields
		 * 	mapping["AdditionalField1"] = "Credit Limit";
		 * 	mapping["AdditionalField2"] = "Credit Limit Currency";
		 * 	return mapping;
		 * }
		 */
		/*CustomizeCompanyCSVColumns: function()
		{
		},*/


		/**
		 * @method Lib.AR.Customization.Collections.InitializeProcessEventsFromCollectionsManagement
		 * @since 332
		 * @description
		 * This function is used to customize the Payment synchronization with Collections Management module, before synchronizing any events
		 * @example <caption>This examples shows some external variables available for customizing the execution</caption>
		 * InitializeProcessEventsFromCollectionsManagement: function()
		 * {
		 * 	Variable.SetValueAsString("MaxEventsToRequest", "250");  //Customize how many events are queried from collections management in a single process
		 * 	Variable.SetValueAsString("AllowImmediatelyProcessingMoreEvents", "1");  //Allow immediately processing more events instead of waiting for the next scheduled task execution
		 * 	Variable.SetValueAsString("MaxExecutionTimeAllowedMinusBuffer", "580000");  //Not recommended, but if you increase the Process timeout, this number should be increased as well
		 * }
		 */
		/*InitializeProcessEventsFromCollectionsManagement: function()
		{
		},*/


		/**
		 * @method Lib.AR.Customization.Collections.FinalizeProcessEventsFromCollectionsManagement
		 * @since 332
		 * @description
		 * This function is used to customize the Payment synchronization with Collections Management module, after synchronizing events
		 *
		 */
		/*FinalizeProcessEventsFromCollectionsManagement: function()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Collections.GetMaxRetryForEventsFromCollectionsManagement
		 * @description
		 * This function can be used to set the maximum number of retries for failed events from Collections Management.
		 * By default, the maximum number of retries is 5 (or 0 if running from a QA system).
		 * @returns {number} Maximum number of retries on failed events from Collections Management.
		 * @example <caption> This example will set the maximum number of retries to 3 - i.e. up to 4 attempts to process an event from Collections Management.</caption>
		 * GetMaxRetryForEventsFromCollectionsManagement: function()
		 * {
		 * 	return 3;
		 * }
		 * @example <caption> This example will only attempt to handle an event from Collections Management once - i.e. if it fails, it will not be retried.</caption>
		 * GetMaxRetryForEventsFromCollectionsManagement: function()
		 * {
		 * 	return 0;
		 * }
		 */
		/* GetMaxRetryForEventsFromCollectionsManagement: function()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Collections.CustomizeTermsyncPortalLinksRetrieval
		 * @description
		 * This function can be used to customize the behaviour of invoice link retrieval from Collections Management in the Invoice Customer copy.
		 * @example <caption>This example customizes the retries of invoice link retrieval</caption>
		 * CustomizeTermsyncPortalLinksRetrieval: function()
		 * {
		 * 	// all returned attributes are optional
		 * 	return {
		 * 		MaxRetry: 10, // 10 retries
		 * 		RetryIntervalDuration: "60,60,60,3600", // 3 retries of one minute, and 1 hour for the remaining retries
		 * 		StopExecutionOnLastRetry: false // Do not stop the execution of the process on the last retry and send the email to the customer
		 * 	};
		 * }
		 */
		/* CustomizeTermsyncPortalLinksRetrieval: function()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.Collections.CustomizeSftpPath
		 * @description
		 * Function called before creating the process to copy files to the SFTP from the AR System TermSync Synchronization process.
		 * @param {string} defaultPath Path to which the file will be copied on the SFTP
		 * @param {string} dataTypeSync Type of data being synchronized
		 * Potential values are: "CustomerContact", "OpenTransaction", and "CustomerCompany".
		 * @param {number} attachIndex Index of the attachment that is to be copied
		 * @returns {string} Custom path on the SFTP where the file will be copied
		 * @example <caption> This example will set the path/file name, and use a custom user name.</caption>
		 * CustomizeSftpPath: function (defaultPath, dataTypeSync, attachIndex)
		 * {
		 * 	switch (dataTypeSync)
		 * 	{
		 * 		case "CustomerContact":
		 * 			return "CUSTOMUserName\\Contacts\\customer_contacts.csv";
		 * 		case "CustomerCompany":
		 * 			return "CUSTOMUserName\\Companies\\customer_companies.csv";
		 * 		case "OpenTransaction":
		 * 			return "CUSTOMUserName\\Invoices\\open_invoices.csv";
		 * 		default:
		 * 			return;
		 * 	}
		 * }
		 */
		/*CustomizeSftpPath: function (defaultPath, dataTypeSync, attachIndex)
		{
		},*/
	};

	return Collections;

})();
