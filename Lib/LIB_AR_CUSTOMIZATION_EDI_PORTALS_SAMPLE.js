/* LIB_DEFINITION{
  "name": "LIB_AR_CUSTOMIZATION_EDI_PORTALS_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "COMMON",
  "comment": "EDI portals implementation functions",
  "versionable": false,
  "require": []
}*/

/**
 * This module contains
 *   - functions used to implement custom delivery systems for "AR System EDI Submission" process
 * @namespace Lib.AR.Customization.EDI.Portals
 */

///#GLOBALS Lib Sys
var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};
Lib.AR.Customization.EDI = Lib.AR.Customization.EDI || {};

Lib.AR.Customization.EDI.Portals = (function ()
{
	var Customization =
	{
		/**
		 * @typedef {Object} Lib.AR.Customization.EDI.Portals.supportedPartners
		 * @property {string} name - delivery system name MUST BE LOWER CASED
		 * @property {number} [processingLabel] - the processing label for billing (default already set to "CUSTO")
		 * @property {"singlePolling" | "multiplePolling"} [notificationType] - type of the notifications : singlePolling is used for polling one invoice at a time, multiplePolling for polling multiple invoices
		 * @property {string} [fileExtension] - extension of the generated document (xml, json, txt...) - If not specified, the generated document is an xml
		 * @property {string} [fileEncoding] - encoding of the generated document (UTF8, ANSI) - If not specified, the generated document is an utf8
		 * @property {string} [partner] - the partner used to send the invoice, one of the following:  tenor, babelway, e-integration
		 * @property {string} [generator] - when using e-integration, the generator should be specified: Peppol or JsonXml
		 * @property {string} [format] - the format displayed in EDI Submission (ui only)
		 * @property {boolean} [isGeneric] - applicable to the Esker EDI Services in JsonXml format only: the file wil be sent in a common/generic folder, not dependent on MAID
		*/

		/**
		 * @typedef {Object} Lib.AR.Customization.EDI.Portals.deliveryResponse
		 * @property {string} [edi_status_code__] - status code
		 * @property {string} detailed_status__ - detailed status text
		 * @property {string} [description__] - description
		 * @property {"SUCCESS"|"PENDING"|"FAILURE"} status__ - status of the edi submission
		 * @property {string} [edi_identifier__] - invoice ID on partner side
		 * @property {0|1} edi_status_is_final__ - is this status final (1) or polling is necessary (0)
		 * @property {Date} completion_date__ - date of the portal submission
		 */

		/**
		 * @typedef {Object} Lib.AR.Customization.EDI.Portals.deliveryUpdate
		 * @property {string} invoice_number__ - invoice number
		 * @property {Date} invoice_date__ - invoice date
		 * @property {string} [edi_status_code__] - status code
		 * @property {string} [edi_sub_ruidex__] - edi sub ruidex
		 * @property {string} [edi_identifier__] - invoice ID on partner side
		 * @property {string} detailed_status__ - detailed status text
		 * @property {string} [description__] - description
		 * @property {"SUCCESS"|"PENDING"|"FAILURE"} status__ - status of the edi submission
		 * @property {0|1} edi_status_is_final__ - is this status final (1) or polling is necessary (0)
		 * @property {Date} completion_date__ - date of the portal update
		 */

		/**
		 * @typedef {Object} Lib.AR.Customization.EDI.Portals.deliveryInfos
		 * @property {string} ediPartner - name of the delivery system
		 * @property {Object} ediSubRecord - the edi submission record (can be used to have more fields and variables informations)
		 * @property {string} state - state of the edi submission
		 * @property {string} ownerId - ownerID of the edi submission
		 * @property {"DEV"|"QA"|"PROD"} edi_target_environment__ - edi target environment as defined in the AR conf
		 * @property {string} invoice_number__ - invoice number
		 * @property {string} edi_identifier__ - edi identifier
		 * @property {string} edi_status_code__ - edi status code
		 * @property {Date} invoice_date__ - date of the portal submission
		 * @property {Date} completion_date__ - date of the last portal update
		 * @property {string} language - supplier language
		 * @property {string} supplier_edi_endpointid__ - supplier edi endpoint ID
		 */

		/**
		 * @method Lib.AR.Customization.EDI.Portals.GetSupportedPartners
		 * @description
		 * This function will be used to list EDI delivery system supported by PS.
		 *  Use it to implement unsupported portals
		 *  This function is called by various process (edi submission, CIM, supi/cusi)
		 * @return {Lib.AR.Customization.EDI.Portals.supportedPartners[]} list of custom deliveries
		 * 
		 * @example
		 * GetSupportedPartners: function ()
		{
			return [
				{name:"fattura-fa-bis", notificationType: "singlePolling"},
				{name: "portal multiple", notificationType: "multiplePolling"},
				{name: "custom-babelway", partner: "babelway" },
				{name: "ees-ubl-peppol", partner: "e-integration", generator: "Peppol", format: "UBL" },
				{name: "ees-jsonxml", partner: "e-integration", generator: "JsonXml", format: "JsonXml" }
				]
		},*/
		/*GetSupportedPartners: function ()
		{},*/

		/**
		 * @method Lib.AR.Customization.EDI.Portals.GetEdiFilename
		 * @description
		  * This function will be used to generate the file name of the EDI file
		  *  Use it to implement unsupported portals
		  *  This function is called by process the edi submission extraction script
		  * @param {object} invoiceData deserialized JSON containing the data sent from the SUPI form
		  * @param {string} ediPartner edi partner name lower cased
		  * @return {string} name of the edi file
		 * 
		 * @example
		 * GetEdiFilename: function (invoiceData, ediPartner)
		{
				var msnEx = Data.GetValue("MsnEx");
				var currentUser = Users.GetUserAsProcessAdmin(Data.GetValue("OwnerId"));
				var currentUserVars = currentUser.GetVars();
				var userAccount = currentUserVars.GetValue_String("MainAccountId2", 0);
				var userEnvironment = currentUserVars.GetValue_String("Environment", 0);
				if (ediPartner == "fattura-fa-bis") {
					var ediFilename = "";
					ediFilename = userEnvironment + "_" + msnEx + "_" + userAccount + "_FA.xml";
					return ediFilename;
				}
				if (ediPartner == "portal multiple") {
					var ediFilename = "";
					ediFilename = userEnvironment + "_" + msnEx + "_" + userAccount + "_file.xml";
					return ediFilename;
				}
		},*/
		/*GetEdiFilename: function (invoiceData, ediPartner)
		{},*/

		/**
		 * @method Lib.AR.Customization.EDI.Portals.GeneratedEdiDocument
		 * @description
		 * This function will be used to generate invoice data EDI system custom submissions.
		 *  Use it to implement unsupported portals
		 *  This function is called by the EDI submission process extraction script
		 * @param {object} invoiceData deserialized JSON containing the data sent from the SUPI form
		 * @param {string} ediPartner edi partner name lower cased
		 * @returns {string} content of the edi file
		 * 
		 * @example
		 * GeneratedEdiDocument: function (invoiceData, ediPartner)
		{
			if (ediPartner == "fattura-fa-bis") {
				Sys.Handlebars.RegisterCommonHelpers();
				let data = Sys.Templates.AR.EDI.FatturaFA(invoiceData);
				return data;
			}
			if (ediPartner == "portal multiple") {
				return '<?xml version="1.0" encoding="UTF-8"?>\
<Invoice>\
  <to>Customer</to>\
  <from>Supplier</from>\
  <amount>100</amount>\
  <currency>EUR</currency>\
</Invoice>'
			}
		},*/
		/*GeneratedEdiDocument: function (invoiceData, ediPartner)
		{},*/

		/**
		 * @method Lib.AR.Customization.EDI.Portals.SendEdiDocument
		 * @description
		 * This function will be used to send invoice data EDI system custom submissions.
		 *  Use it to implement unsupported portals
		 *  This function is called by the EDI submission process finalization script
		 * @param {object} invoiceData deserialized JSON containing the data sent from the SUPI form
		 * @param {string} ediPartner the edi partner name as defined in CIM
		 * @return {Lib.AR.Customization.EDI.Portals.deliveryResponse} response data from the custom delivery
		 * 
		 * @example
		 * SendEdiDocument: function (invoiceData, ediPartner)
		{
			if (ediPartner == "fattura-fa-bis") {
				let ediAttachIndex = Attach.GetNbAttach() - 1;
				let ediAttach = Attach.GetAttach(ediAttachIndex);
				let data = { // example
					edi_status_code__: "200",
					detailed_status__: "Successfully sent.",
					description__: "the file has been sent to the fattura bis portal",
					completion_date__: new Date(),
					edi_status_is_final__: 0,
					edi_identifier__: "ID#21323141",
					status__: "SUCCESS"
				};
				return data;
			}
			if (ediPartner == "portal multiple") {
				return { // example
					edi_status_code__: "200",
					detailed_status__: "Successfully sent.",
					description__: "the file has been sent to the portal multiple",
					completion_date__: new Date(),
					edi_status_is_final__: 0,
					edi_identifier__: "ID#21323141",
					status__: "SUCCESS"
				};
			}
		},*/
		/*SendEdiDocument: function (invoiceData, ediPartner)
		{},*/

		/**
		 * @method Lib.AR.Customization.EDI.Portals.FetchInvoiceStatus
		 * @description
		 * This function will be used to retrieve invoice status from EDI system custom portals.
		 *  Use it to implement unsupported portals
		 *  This function is called by the Generic EDI polling
		 *  it is used when the portal give informations for a single invoice
		 * @param {Lib.AR.Customization.EDI.Portals.deliveryInfos} submissionInfos informations about the initial submission process
		 * @return {Lib.AR.Customization.EDI.Portals.deliveryUpdate|null} updated informations from the portal (or null if no update available/necessary)
		 * 
		 * @example
		 * FetchInvoiceStatus: function (submissionInfos)
		{
			if(submissionInfos.ediPartner == "fattura-fa-bis") {
				let data = { //example
					invoice_number__: submissionInfos.invoice_number__,
					invoice_date__: submissionInfos.invoice_date__,
					edi_status_code__: "300",
					detailed_status__: "Seen by the customer",
					description__: "The customer has seen the invoice",
					completion_date__: new Date(),
					edi_status_is_final__: 1,
					status__: "SUCCESS"
				};
				return data;
			}
			return null;
		},*/
		/*FetchInvoiceStatus: function (submissionInfos)
		{},*/

		/**
		 * @method Lib.AR.Customization.EDI.Portals.FetchMultipleInvoicesStatus
		 * @description
		 * This function will be used to retrieve invoice status from EDI system custom portals.
		 *  Use it to implement unsupported portals
		 *  This function is called by the Generic EDI polling
		 *  it is used when the portal give informations for a multiple invoices at once
		 * @param {string} ediPartner the edi partner name as defined in CIM
		 * @return {Lib.AR.Customization.EDI.Portals.deliveryUpdate[]} list of updated informations from the portal for each invoice
		 * 
		 * @example
		 * FetchMultipleInvoicesStatus: function (ediPartner)
		{
			if(ediPartner == "portal multiple") {
				let datas = FetchInvoicesFromCustomPortal() // TO BE IMPLEMENTED
				let data1 = { //example1
					invoice_number__: "4850011",
					edi_status_code__: "300",
					detailed_status__: "Seen by the customer",
					description__: "The customer has approved the invoice",
					completion_date__: new Date(),
					edi_status_is_final__: 1,
					status__: "SUCCESS"
				};
				let data2 = { //example2
					invoice_number__: "4850010",
					edi_status_code__: "400",
					detailed_status__: "Refused",
					description__: "The customer has refused the invoice",
					completion_date__: new Date(),
					edi_status_is_final__: 1,
					status__: "FAILURE"
				};
				return [data1,data2]
			}
			return []
		},*/
		/*FetchMultipleInvoicesStatus: function (ediPartner)
		{},*/
	};

	return Customization;

})();
