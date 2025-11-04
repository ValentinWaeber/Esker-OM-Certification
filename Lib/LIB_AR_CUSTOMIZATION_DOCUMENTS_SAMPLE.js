/* LIB_DEFINITION{
  "name": "LIB_AR_CUSTOMIZATION_DOCUMENTS_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "comment": "Documents customization functions",
  "versionable": false,
  "require": []
}*/

/**
 * Package AR documents customization callbacks
 * @namespace Lib.AR.Customization.Documents
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};

Lib.AR.Customization.Documents = (function ()
{
	/**
	 * @lends Lib.AR.Customization.Documents
	 */
	var Documents =
	{

		/**
		 * Specifies the documents from the Smart Document Automation application that should be [linked to the invoice]{@link https://doc.esker.com/eskerondemand/cv_ly/en/manager/startpage.htm#Processes/AR/Sending_Related_Documents.html}.
		 * When this user exit is implemented, the [Related Documents]{@link https://doc.esker.com/eskerondemand/cv_ly/en/manager/StartPage.htm#Processes/AR/Pane_Related_Documents.html} pane is displayed in the Customer invoices (supplier copy) process.
		 * This user exit is called in the generation script of the Customer invoices (supplier copy) process.
		 *
		 * @returns 
		 * **You can choose between two return value:**
		 * 
		 * - `null` to hide the Related Documents pane and disable this feature.
		 * 
		 * Or
		 * 
		 * - An `object` used to define related documents. 
		 * This object is composed of :
		 * 
		 * Fields                 | Description
		 * -----------------------|-----------------------------------------------------------------------------
		 * `retryIntervalDuration`| A string indicating the interval between tries (in seconds).
		 * `maxRetryCount`        | A number used to define the how many retry will be done maximum
		 * `criteria`             | An array used to declare document definitions. If this function returns null, the "Related documents" panel is hidden.
		 *
		 * The object contained in the `criteria` array has the following fields:
		 * 
		 * Criteria fields                | Description
		 * -------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		 * `filter`                       | An LDAP filter used to retrieve one or more related document(s).
		 * `type`                         | A string displayed into the "Type" column (related document table).
		 * `identifier`                   | A string displayed into the "Identifier" column into the related document table.
		 * `requiredBehavior`             | Use this field to specify the behavior when a required document is not found after the last try. Possibles values: "validate", "error".
		 * `optionalBehavior`             |Use this field to specify the behavior when all missing documents are optional. Possibles values: "skip", "wait".
		 * `attachFilesIfExtensionMatches`| (optional) An array of string specifying document file types that should be attached to generated transports, based on file extension. If not defined, all document files will be attached.
		 * `searchInArchive`              | Set this field to true to query documents older than 2 months.
		 * 
		 * @example
		 * <ul>
		 * This user exit allows you to add a document with the following criteria:
		 * 		<ul>
		 * 			<li>The filter associates the document for which the <B style="color:red">Document</B> number value of the Smart Document Automation application matches the Order number value of the Customer invoices (supplier copy) process.</li>
		 * 			<li>The <B style="color:red">Type</B> column displays Purchase order.</li>
		 * 			<li>The <B style="color:red">Identifier</B> column displays the value contained in the <B style="color:red">Order number</B> field of the Customer invoices (supplier copy) process.</li>
		 * 			<li>The document to link is required. If it is missing in the Smart Document Automation application, retries are performed as follows:</li>
		 * 				<ul>		
		 * 					<li>The first retry is performed after <B>10800 seconds</B> (3 hours), the second retry after another <B>10800 seconds</B>, the third and the following retries after <B>86400 seconds</B> (24 hours).</li>
		 * 					<li>The maximum number of attempts to retrieve the document from the Smart Document Automation application is set to <B>5</B>.</li>
		 * 					<li>If the document is still missing after 5 retries, the customer invoice delivery fails.</li>
		 * 				</ul>
		 * 			<li>The document to link is a PDF file.</li>
		 * 		</ul>
		 * </ul>
		 * <pre><code>
		 * GetRelatedDocumentsCriteria: function ()
		 * {
		 *	 return {
		 *		 criteria: [
		   *		 {
		 *			 filter: "Document_ID__=" + Data.GetValue("Purchase_order_number__"),
		 *			 type: "Purchase order",
		 *			 identifier: Data.GetValue("Purchase_order_number__"),
		 *			 requiredBehavior: "error",
		 *			 attachFilesIfExtensionMatches: [".pdf"]
		 *		 }],
		 *		 retryIntervalDuration: "10800,10800,86400",
		 *		 maxRetryCount: 5,
		 *	 };
		 * }
		 * </code></pre>
		 */
		GetRelatedDocumentsCriteria: function ()
		{
			return null;
		},

		/**
		 * Allows you to update a related document hosted in the Smart Document Automation application with data coming from the invoice.
		 * This user exit is called in the generation script of the Customer invoices (supplier copy) process.
		 * @param {object} documentTransport [xTransport Object]{@link https://doc.esker.com/eskerondemand/cv_ly/en/manager/startpage.htm#ProcessingScripts/xEDDAPI/xTransport/xTransport_Object.html}  representing the related document to update.
		 * @example
		 * This user exit adds a field containing the invoice number to the related document:
		 * <pre><code>
		 * FinalizeRelatedDocumentLinking: function (documentTransport)
		 * {
		 *		var documentVars = documentTransport.GetUninheritedVars();
		 *		documentVars.AddValue_String("Additional_field_text_1", Data.GetValue("Invoice_number"), true);
		 * }
		 * </pre></code>
		 */
		FinalizeRelatedDocumentLinking: function (documentTransport)
		{

		}
	};

	return Documents;
})();
