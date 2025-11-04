/* LIB_DEFINITION{
  "name": "LIB_AR_CUSTOMIZATION_SPLITTING_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "comment": "all splitting customization functions",
  "versionable": false,
  "require": []
}*/

/**
 * SUPI splitting customization functions
 * @namespace Lib.AR.Customization.Splitting
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};

Lib.AR.Customization.Splitting = (function ()
{
	/**
	 * @lends Lib.AR.Customization.Splitting
	 */
	var Splitting =
	{
		/**
		 * @method Lib.AR.Customization.Splitting.ComputeSplittingRanges
		 * @description
		 * Uncomment this function to replace the splitting workflow by your own that you write below
		 * @example
		 * <caption>This user exit sets the splitting ranges to pages 1, 2 and 3 then to pages 5 and 6 of the batch.</caption>
		 * ComputeSplittingRanges: function () {
		 *		// Add a document on the pages 1, 2 and 3 of the batch
		 *		Lib.AR.Splitting.AddSplitParameter(1, 3);
		 *		// Add another document on the pages 5 and 6 of the batch
		 *		Lib.AR.Splitting.AddSplitParameter(5, 6);
		 * }
		 */
		/*ComputeSplittingRanges: function () {
			// Add a document on the pages 1, 2 and 3 of the batch
			Lib.AR.Splitting.AddSplitParameter(1, 3);
			// Add another document on the pages 5 and 6 of the batch
			Lib.AR.Splitting.AddSplitParameter(5, 6);
		},*/

		/**
		 * Allows you to customize the Customer invoices (supplier copy) process.
		 * This user exit is called in the generation script before the creation of each process.
		 * @param {string} supiProcess The SUPI xTransport object
		 * @param {object} context The context that contains 2 properties:
		 * - splits: array of splits objects, each one contains 2 properties: startPage and endPage.
		 * - currentSplitIndex: the index of the current split in the spliuts array.
		 * @example
		 * <caption>This example applies only when implementing Esker EDI services EDI UBL files.
		 * This user exit retrieves purchase order documents attached to the Customer invoices (supplier copy) process.
		 * These PDF documents are attached to the submitted invoice and additional nodes are added to the invoice in the UBL format.
		 * As a result, the DocumentType and DocumentTypeCode nodes are added to the output Esker EDI services UBL file:
		 * <cac:AdditionalDocumentReference>
		 * 		<cbc:ID>PO.pdf</cbc:ID>
		 * 		<cbc:DocumentTypeCode listID="UNCL1001">105</cbc:DocumentTypeCode>
		 * 		<cbc:DocumentType>Purchase order</cbc:DocumentType>
		 * 		<cac:Attachment>
		 *			<cbc:EmbeddedDocumentBinaryObject mimeCode="application/zip">[...]</cbc:EmbeddedDocumentBinaryObject>
		 * 		</cac:Attachment>
		 * </cac:AdditionalDocumentReference>
		 * Refer to the Unece.org website to get the list of values available for the DocumentType and DocumentTypeCodenodes.</caption>
		 * FinalizeSUPIProcess: function (supiProcess, context)
		 * {
		 *     var resourceFile = Process.GetResourceFile("%Misc%\\PO.pdf");
		 *     var attach = supiProcess.AddAttachEx(resourceFile);
		 *     var attachVars = attach.GetVars();
		 *     attachVars.AddValue_String("DocumentType", "Purchase order", true);
		 *     attachVars.AddValue_String("DocumentTypeCode", "105", true);
		 * }
		 */
		FinalizeSUPIProcess: function (supiProcess, context)
		{
		},

		/**
		 * Type definition for the options of a notification
		 * @typedef {Object} Lib.AR.Customization.Splitting.NotificationOptions
		 * @property {string} NotifyTemplateFile
		 * @property {string} NotifyTemplateSkin
		 * @property {string} NotifyTemplateOwnerID
		 * @property {string} NotifyFilter
		 * @property {string} NotifyAddressType
		 * @property {string} NotifyAddress
		 * @property {("0"|"1")} NotifyIncludeAttachments
		 * @property {("0"|"1")} NotifyEachTime
		 * @property {string} NotifyTriggerName
		 * @property {string} OwnerID
		 * @property {string} FromLanguage
		 * @property {string} FromCulture
		 * @property {string} FromTimeZone
		 * @property {string} FromAddress
		 * @property {string} FromName
		 * @property {string} Identifier
		*/

		/**
		 * @method Lib.AR.Customization.Splitting.CustomizeNotificationOptions
		 * @description
		 * Allow you to customize the error notification options that will be used for each SUPI notification created
		 * @param {Lib.AR.Customization.Splitting.NotificationOptions} defaultOptions The default options that are used if this UE returns a falsy value
		 * @param {xVars} supplierVars The supplier's variables
		 * @example
		 * 		CustomizeNotificationOptions: function (defaultOptions, supplierVars)
		 * 		{
		 * 			defaultOptions.NotifyFilter = "(state=100)";
		 * 		}
		 */
		CustomizeNotificationOptions: function (/*defaultOptions, supplierVars*/)
		{
		},

		/**
		 * @method Lib.AR.Customization.Splitting.OnErrorNotification
		 * @description
		 * Called right after the error notification has been created for the transport, you may use this user exit to create additional notifications
		 * @param {xTransport} transport The transport that was created from the invoice
		 * @param {Lib.AR.Customization.Splitting.NotificationOptions} notificationOptions the options that are used for notifications
		 * @example
		 * 		OnErrorNotification: function (transport, notificationOptions)
		 * 		{
		 * 			const notif = transport.AddNotif(9);
		 * 			const notifVars = notif.GetVars();
		 * 			const customNotificationOptions = {};
		 * 			Object.assign(customNotificationOptions, notificationOptions);
		 * 			customNotificationOptions.NotifyFilter = "(state=100)";
		 * 			customNotificationOptions.NotifyTemplateFile = "Second_Notification_Template.htm";
		 * 			customNotificationOptions.NotifyAddress = "admin@acme.com";
		 *			Sys.Helpers.Object.ForEach(customNotificationOptions, function (optValue, opt)
		 *			{
		 *				notifVars.AddValue_String(opt, optValue, true);
		 *			}, this);
		 * 		}
		 */
		OnErrorNotification: function (/*transport, notificationOptions*/)
		{
		},

		/**
		 * @method Lib.AR.Customization.Splitting.InitializeSplitting
		 * @description
		 * Called instead of default splitting initialization function or package native behaviour (according to file type).
		 * @returns true to avoid default behaviour or false to run default splitting.
		 * @example
		 * InitializeSplitting: function ()
		 * {
		 *	const compressedFile = Attach.GetNbAttach() === 1 && (Attach.GetExtension(0) || "").match(/zip/i) ? Attach.GetCompressedFile(0) : null;
		 *
		 *	if (compressedFile)
		 *	{
		 *		const entries = compressedFile.GetEntries();
		 *
		 *		for (let i = 0; i < entries.length; i++)
		 *		{
		 *			switch ((Attach.GetExtension(0) || "").toLowerCase())
		 *			{
		 *				case ".pdf":
		 *					// do specific stuff with PDF file
		 *					return true;
		 *
		 *				case ".csv":
		 *					{
		 *						const csvContent = (csvFile.GetContent() || "").split(/[\r\n]+/);
		 *
		 *						for (let i = 0; i < (csvContent.length - 1); i++)
		 *						{
		 *							// do specific stuff for each row of csv file
		 *						}
		 *						return true;
		 *					}
		 *
		 *				default:
		 *					// ignore or trace unmanaged file types
		 *					return true;
		 *			}
		 *		}
		 *	 }
		 *
		 *   // do specific stuff with any file type (for uncompressed files)
		 *	 return true;
		 *	}
		 */
		InitializeSplitting: function ()
		{
		}
	};

	return Splitting;

})();
