/* LIB_DEFINITION{
  "name": "LIB_AR_CUSTOMIZATION_EDI_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "comment": "EDI customization functions",
  "versionable": false,
  "require": [
    "Sys/SYS_AR_EDI"
  ]
}*/

/**
 * This module contains
 *   - the function used to customize the invoice data JSON used by the "AR System EDI Submission" process to generate the all EDI documents
 *   - all EDI documents customization functions called by the process "AR System EDI Submission" (once the EDI document is generated).
 * @namespace Lib.AR.Customization.EDI
 */

///#GLOBALS Lib Sys
var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};

Lib.AR.Customization.EDI = (function ()
{
	var EDICustomization =
	{
		/**
		 * @method Lib.AR.Customization.EDI.CustomizeEDIInvoiceDataJSON
		 * @description
		 * This function will be used to customize the default generated JSON for EDI system submissions.
		 *  You don't need to have a look if your deal doesn't implements EDI submissions.
		 *  There are some default values that you will have to customize regarding the customer's specificities
		 *  so have a good look to each variables and associated comments.
		 *  This function is called by the finalization script of the SUPI
		 * @param {object} invoiceData deserialized JSON containing the data sent from the SUPI form
		 * @param {boolean} invoiceData.includeInvoice If set to true, the PDF invoice is included in the EDI file.
		 * @param {boolean} invoiceData.includeAttachments If set to true, the PDF invoice and other attachments are included in the EDI file.
		 * For Tradeshift, Italian public administration and Italian private businesses, the default value is set to true.
		 * This parameter is also taken into account when generating a Factur-X. Set it to true if you want the attachement to be included in the Factur-X file.
		 *
		 * @example <caption>In this example, which can only apply to invoices sent to SDI in the FatturaPA file
		 * (for Italian public administration and private businesses), a discount of 42 euros and a surcharge of 13% is applied to the first item.</caption>
		 * invoiceData.Table_Line_Items__[0].AllowanceCharges = [
		 * {
		 * 	"Col_Allowance_charge_type__": "discount",
		 * 	"Col_Allowance_charge_amount__": 42,
		 * },
		 * {
		 * 	"Col_Allowance_charge_type__": "supplement",
		 * 	"Col_Allowance_charge_rate__": 13,
		 * }];
		 *
		 * @example In this example, which can only apply to invoices sent to PEPPOL a discount of 42 euros and a surcharge of 13 euros is applied to the first item.
		 * invoiceData.Table_Line_Items__[0].AllowanceCharges = [
		 * {
		 * 	"Col_Allowance_charge_type__": "discount",
		 * 	"Col_Allowance_charge_reason__": "Late delivery",
		 * 	"Col_Allowance_charge_amount__": 42,
		 * },
		 * {
		 * 	"Col_Allowance_charge_type__": "charge",
		 * 	"Col_Allowance_charge_reason__": "Special packaging",
		 * 	"Col_Allowance_charge_amount__": 13,
		 * }];
		 */
		/*CustomizeEDIInvoiceDataJSON: function (invoiceData)
		{
			// Tax type codes to be picked in tax predefined list (see documentation)
			// If not extracted we need a default value
			if (!invoiceData.Invoice_TaxType__)
			{
				invoiceData.Invoice_TaxType__ = "vat";
			}

			if (!invoiceData.Invoice_TaxType_Code__ && invoiceData.Delivery_system__ === "chorus-pro")
			{
				invoiceData.Invoice_TaxType_Code__ = "TVA DEBIT";
			}

			// If this paramter is set to true, the invoice will be included to the transfered
			// EDI file (if the partner allows it).
			// NB : the pdf must be the first attachment of EDI sumbission (it is in standard if you don't touch it).
			invoiceData.includeInvoice = false;

			// Include invoice and other attachments in case of Tradeshift, FatturaPA, FatturaB2B
			if ([Sys.AR.EDI.EDI_PARTNERS.TRADESHIFT, Sys.AR.EDI.EDI_PARTNERS.ITALIAN_PA, Sys.AR.EDI.EDI_PARTNERS.ITALIAN_B2B].indexOf(invoiceData.Delivery_system__) >= 0)
			{
				invoiceData.includeInvoice = true;
				invoiceData.includeAttachments = true;
			}

			// Tenor only: WARNING mandatory field below
			if (Sys.AR.EDI.IsPartenerHandledByTenor(invoiceData.Delivery_system__))
			{
				// MANDATORY variable Supplier_EDI_EndPointID__ aka "supplier_tenor_login".
				// You will have to fill the following variable for Tenor partners.
				// This is important because Tenor is asking that the sent UBL file name is prefixed with this ID.
				// It is supposed to be the supplier's login on Tenor portal, but you will have to discuss with Tenor to
				// now what to put in this variable for each Esker new supplier contract.
				invoiceData["Supplier_Tenor_Login"] = "ERRORSupplierTenorLoginEmpty";
				invoiceData["Supplier_EDI_EndPointID_Type__"] = "";

				// Addresses block for Tenor must NOT contain the receipient name in the first line (it should start by the street for instance).
				// WARNING: In ACME demo documents it contains the custome name on the first line, that's why we're removing it.
				// Whereas it's the most common case, if your address doesn't have the customer name then you'll have to comment the few line belows.
				var SplitAddressFirstLine = function (invoiceData, addressName, receipientName)
				{
					var split = invoiceData[addressName].split("\n");
					var firstLine = split.shift();
					if (typeof firstLine !== "undefined")
					{
						invoiceData[receipientName] = firstLine;
					}
					invoiceData[addressName] = split.join("\n");
				};
				SplitAddressFirstLine(invoiceData, "Customer_address__", "Customer_soldto_name__");
				SplitAddressFirstLine(invoiceData, "Customer_shipping_address__", "Customer_shipping_name__");
				SplitAddressFirstLine(invoiceData, "Customer_billing_address__", "Customer_billing_name__");
			}

			// FACe only: override administrative centers addresses (in customers' Advanced Delivery Options)
			// by document extracted addresses. Let this block empty to use addresses from Advanced Delivery Options.
			if (invoiceData.Delivery_system__ === "spanish-pa")
			{
				invoiceData["face_administrativecenter1_usefulladdress"] = invoiceData.Customer_Address__;
				invoiceData["face_administrativecenter2_usefulladdress"] = invoiceData.Customer_Address__;
				invoiceData["face_administrativecenter3_usefulladdress"] = invoiceData.Customer_Address__;
			}

			// Fattura fiscal archiving only
			invoiceData.ItalianFA_invoice_type = "FATTURA ATTIVA";  // this will go into node "TIPOLOGIA" within attribute "Tipo"
			invoiceData.ItalianFA_identificativo = "";  // not used for now but can be used to fill "IDENTIFICATIVO" node

			if (invoiceData.Delivery_system__ === "ob10")
			{
				// mandatory variable Supplier_EDI_EndPointID__
				invoiceData["Supplier_EDI_EndPointID__"] = invoiceData["Supplier_EDI_EndPointID__"] || "ERRORSupplierOB10EDIId";
			}

			if (invoiceData.Customer_EDIPartner__ === "italian-pa" || invoiceData.Customer_EDIPartner__ === "italian-b2b")
			{
				// FT-026566 - Provide the Purchase order number in the Factura-PA
				// Adding a flag because there are many customers already having the node by user exit customization
				invoiceData.addPurchaseOrderNode = true;
			}

			// Babelway/PEPPOL temporary fixes
			if (invoiceData.Customer_EDIPartner__ === "belgium-pa")
			{
				invoiceData.Customer_EDI_EndPointID_Type__ = invoiceData.Customer_EDI_EndPointID_Type__ || "BE:VAT";
				invoiceData.Customer_EDI_SoldTo_EndPointID_Type__ = invoiceData.Customer_EDI_SoldTo_EndPointID_Type__ || "BE:VAT";
				invoiceData.Customer_EDI_Shipping_EndPointID_Type__ = invoiceData.Customer_EDI_Shipping_EndPointID_Type__ || "BE:VAT";
			}

			// Australia specific fallback: set customer companyID to endpointID when it's an ABN
			if (invoiceData.Delivery_system__ === "peppol-anz")
			{
				if (invoiceData.Customer_EDI_EndPointID_Type__ === "0151" && !invoiceData.Customer_LegalEntity_CompanyID__)
				{
					invoiceData.Customer_LegalEntity_CompanyID__ = invoiceData.Customer_EDI_EndPointID__;
					invoiceData.Customer_LegalEntity_CompanyID_Type__ = invoiceData.Customer_EDI_EndPointID_Type__;
				}
			}

			// German public administration demo credit note

			if (invoiceData.Delivery_system__ === "germany-pa-bbw" && Variable.GetValueAsString("IsDemoAcme") === "1")
			{
				invoiceData.Buyer_reference__ = "BR20200707";
			}
		},*/

		/**
		 * @method Lib.AR.Customization.EDI.CheckChorusBankInfo
		 * @description
		 * This function will be used to customize the control of Bank Info from Chorus.
		 * By default, we do want to do this control, but for old solutions, this is not mandatory.
		 * This function is called by the Validation script of the SUPI
		 */
		CheckChorusBankInfo: function ()
		{
			return true;
		},

		/**
		 * @method Lib.AR.Customization.EDI.FinalizeEdiCopyFileTransport
		 * @description
		 * This function can be used to customize the copy file used to transmit the EDI file to the EDI partner (Indicom
		 * in the standard package implementation).
		 *
		 * For instance, you can use this function to deposit the EDI file to a different SFTP folder. Please look at the example below
		 *
		 * @param {xTransport} copyFileTransport the CopyFile transport used to to deposit the EDI file to an SFTP folder
		 * pickuped by the EDI partner
		 * @param {string} deliveryType "italian-pa" for italian public administration, "italian-b2b" for italian private businesses or "italian-fa" for fiscal archiving purposes
		 * @returns {xTransport} Either return the copyFileTransport parameter or null if you don't want the CopyFile transport
		 * to be processed
		 *
		 * @example This user exit changes the folder in which EDI files are dropped.
		 *	FinalizeEdiCopyFileTransport: function (copyFileTransport, deliveryType)
		 * {
		 *	 var copyFileVars = copyFileTransport.GetUninheritedVars();
		 *
		 *	 / /
		 * 	 Use the current account SFTP instead of the
		 *	 default one("EDI_Indicom") where the files are picked up by Indicom
		 *	 copyFileVars.AddValue_String("CopyPath", "SFTP2", true);
		 *
		 *	 var attachs = copyFileTransport.GetAttachs(true);
		 *
		 *	 if (ediPartner === "italian-fa")
		 *	 {
		 *		 // For "italian-fa", attached files are zipped by the CopyFile transport, so you need to customize the
		 *		 // "ZipAttachmentFilename" variable to change the file folder
		 *		 var originalZipAttachmentFilename = copyFileVars.GetValue_String("ZipAttachmentFilename", 0);
		 *		 // In the line below "EDI" is the SFTP account identifier and "NewPartner" is
		 *		 // the outbound SFTP folder name
		 *		 copyFileVars.AddValue_String("ZipAttachmentFilename", "EDI\\NewPartner\\" + originalZipAttachmentFilename, true);
		 *	 }
		 *	 else
		 *	 {
		 *		 var i;
		 *
		 *		 for (i = 0; i < attachs.GetNbAttachs(); i++)
		 *		 {
		 *			 var attach = attachs.GetAttach(i);
		 *			 var attachVars = attach.GetVars();
		 *			 var originalAttachOutputName = attachVars.GetValue_String("AttachOutputName", 0);
		 *			 // In the line below "EDI" is the SFTP account identifier and "NewPartner" is
		 *			 // the outbound SFTP folder name
		 *			 attachVars.AddValue_String("AttachOutputName", "EDI\\NewPartner\\" + originalAttachOutputName, true);
		 *		 }
		 *	 }
		 *	 return copyFileTransport;
		 * }
		 */
		/*FinalizeEdiCopyFileTransport: function (copyFileTransport, ediPartner)
		{
			return copyFileTransport;
		},*/


		/**
		 * @method Lib.AR.Customization.EDI.FinalizeXML
		 * @description
		 * This function is the function you will have to uncomment and customize if you want to
		 * modify the automatically generated UBL file by AR System EDI Submission form.
		 * The first argument is the IXMLDomElement representing the generate UBL file so far.
		 * The aim of this function is to work on this object to add/update/remove nodes as you wish.
		 * You don't have to return it back, once you work in the object the modifications will be taken into account.
		 * You can get some SUPI data using the "invoiceData" JSON that was generated in the SUPI form, then transmitted here.
		 * For more information see FinalizeXML function documentation
		 *
		 * They are some helper function below like AddNode, AddOrGetNode or TryRemoveNode that you should take a look
		 * in order to customize the file properly.
		 * For more complex operations, please consult the MSXML documentation to work on the object.
		 *
		 * Warning: be careful you'll have to use the "def:" default namespace if you want to make an xPath selecting a node
		 * that hasn't namespace. For instance on the PEPPOL UBL, if you want to change the partner then use:
		 * //ext:UBLExtensions/ext:UBLExtension[1]/ext:ExtensionContent/def:Data/def:ID[@schemeID='Partner']
		 * As Data and ID don't have namespace.
		 *
		 * @param {object} xmlDomElement IXMLDomElement object representing the generate XML file so far.
		 * @param {object} invoiceData deserialized JSON containing the data sent from the SUPI form, you can add some values in SUPI in order to get it back here.
		 * @param {string} ediPartner code of the EDI Partner.
		 *
		 * @example
		 *FinalizeXML: function (xmlDomElement, invoiceData, ediPartner)
		 *{
		 *	if (ediPartner === "intecon")
		 *	{
		 *		var node = this.AddOrGetNode(xmlDomElement, "//cac:AccountingSupplierParty/cac:Party/cac:PartyIdentification", "cbc:ID");
		 *		node.text = "0123456789";
		 *	}
		 *	else if (ediPartner === "chorus-pro")
		 *	{
		 *		var node = this.AddOrGetNode(xmlDomElement, "//cac:AccountingSupplierParty/cac:Party/cac:PartyIdentification", "cbc:ID");
		 *		node.text = "451-0123456789";
		 *	}
		 *	if (ediPartner === "coupa" )
		 *	{
		 *		var node = this.AddNode(xmlDomElement, "//cXML/Request/InvoiceDetailRequest/InvoiceDetailRequestHeader", "Extrinsic");
		 *		node.setAttribute("name","CustomFields");
		 *		var idReference = xmlDomElement.createElement("IdReference");
		 *		var description = xmlDomElement.createElement("Description");
		 *		node.appendChild(idReference);
		 *		idReference.appendChild(description);
		 *		idReference.setAttribute("identifier","custom_field_identifier");
		 *		idReference.setAttribute("domain","CustomField");
		 *		description.setAttribute("xml:lang","FR");
		 *		description.text = "custom_field_value";
		 *	}
		 *}
		 */
		/*FinalizeXML: function (xmlDomElement, invoiceData, ediPartner)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.EDI.FinalizeGeneration
		 * @description
		* Function called by the EDI Submission process at the end of the generation script
		*/
		/*FinalizeGeneration: function ()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.EDI.GetAttachIndexToSendDirectly
		 * @description
		 * Helper function used to define the index of the attachment that should be send directly to EDI partner.
		 * @returns {number} The index of the attach to send directly to COUPA (for now)
		 * In order to send directly the xml attach to COUPA the external variable Send_EDI_Input_Attach__ must be set to "1"
		 * in the extraction of the SUPI with Coupa delivery system
		 * If the index is null, the first xml attach will be taken
		 * To Use only if the customer (a supplier) gives a valid file in input.
		 *
		 * @example For example a supplier sending to Coupa must give a valid cXML as input
		 * var attachIndex = 1; //First attach could be the invoice, and the second the cxml to send
		 * return attachIndex;
		 */
		/*GetAttachIndexToSendDirectly: function ()
		{
			var attachIndex = 0;
			return attachIndex;
		},*/

		/**
		 * @method Lib.AR.Customization.EDI.CustomizeCXMLPartnerURL
		 * @description
		 * This function will be used to customize the URL on which we POST the cXML invoice.
		 * By default, we handle COUPA and ARIBA as cXML partner for invoicing but there may be more.
		 * This function is called by the finalization script of the EDI Submission.
		 * @param {string} ediPartner Partner name, for example "chorus-pro" for Chorus Pro
		 */
		/*CustomizeCXMLPartnerURL: function (ediPartner)
		{
			return "https://myPartnerUrl.com/cxml/invoices";
		},*/

		/**
		 * @method Lib.AR.Customization.EDI.FinalizeCxmlRequest
		 * @description
		 * This function will be used to customize the HTTP request sent for cXML EDI.
		 * This function is called just before the HTTP call in the finalization script of the EDI Submission.
		 * @param {HttpRequestParam} requestParam
		 */
		/*FinalizeCxmlRequest: function (requestParam)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.EDI.HandleCxmlResponse
		 * @description
		 * This function will be used to customize the way we handle the response for cXML EDI.
		 * This function is called just after we've received the HTTP response in the finalization script of the EDI Submission.
		 * @param {HttpResponse} httpResponse
		 */
		/*HandleCxmlResponse: function (httpResponse)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.EDI.CustomSubmission
		 * @description
		 * To be used if a custom submission implementation is needed.
		 * If will bypass the build-in submission code.
		 * The usual steps to implement are:
		 * - Submit the attached EDI file
		 * - Update the current process (AR System EDI Submission) state
		 * - Update the Customer invoice (supplier copy) - SUPI
		 * @param {string} ediPartner Partner name, for example "chorus-pro" for Chorus Pro
		 * @returns {boolean} return true if the submission is handled in this user exit or you want to disable build-in submit code
		 */
		/*CustomSubmission: function (ediPartner)
		{
			return false;
		},*/

		/**
		 * @method Lib.AR.Customization.EDI.SendDemoCDVFrenchB2B
		 * @description
		 * This function will be used to not send fake French B2B notifications on demo mode.
		 * By default, we do want the notifications, but for a test we need our own ones.
		 * This function is called by the Finalization script of the French B2B Notification process
		 */
		/*SendDemoCDVFrenchB2B: function ()
		{
			return false;
		},*/

		/**
		 * @method Lib.AR.Customization.EDI.CustomizeSUPIUpdateFromNotification
		 * @description
		 * This function can be used to update the SUPI process when we receive a notification.
		 * @param {xTransport} supiTransport SUPI transport
		 */
		/*CustomizeSUPIUpdateFromNotification: function (supiTransport)
		{
			let vars = supiTransport.GetUninheritedVars();
		},*/

		/**
		 * @method Lib.AR.Customization.EDI.CustomizeEDISubUpdateFromNotification
		 * @description
		 * This function can be used to update the EDI Submission process when we receive a notification.
		 * @param {xTransport} ediSubTransport EDI Submission transport
		 */
		/*CustomizeEDISubUpdateFromNotification: function (ediSubTransport)
		{
			let vars = ediSubTransport.GetUninheritedVars();
		},*/

		/**
		 * @method Lib.AR.Customization.EDI.ExtractDataFromEDINotificationEES
		 * @description
		 * Allows you to customize the extraction of the incoming EDI notification file
		 * related to Esker EDI Service delivery systems.
		 * 
		 * You can store custom data in external variables and use them it later in the following user exits:
		 * - CustomizeSUPIUpdateFromNotification
		 * - CustomizeEDISubUpdateFromNotification
		 * 
		 * @example <caption>In this example, the aim is to extract a specific node from the notification and store
		 * it in an external variable, to be used later in finalization script.</caption>
		 * ExtractDataFromEDINotificationEES: function (ediPartner, notifXMLDomElement, ackInfos)
		 * {
		 * 	if (ediPartner !== "peppol-pint-my")
		 * 	{
		 * 		// In this sample, I want to impact sendings to PEPPOL PINT only
		 * 		return;
		 * 	};
		 * 	var transmissionUUID = notification.selectSingleNode("//Acknowledgement/AdditionalInformation/TransmissionUUID");
		 * 	if (transmissionUUID)
		 * 	{
		 * 		Variable.SetValueAsString("Z_TransmissionUUID", transmissionUUID.text);
		 * 		Log.Info("[ExtractDataFromEDINotification] Z_TransmissionUUID set to: " + transmissionUUID.text);
		 * 	}
		 * }
		 * 
		 * @param {string} ediPartner The edi partner/delivery system for which the notification is for, example: "peppol-pint-my".
		 * @param {XMLDOMElement} notifXMLDomElement The notification content as an XML DOM element.
		 * @param {object} ackInfos Some ack info already extracted, please refer to the extraction script for more details.
		 */
		/*ExtractDataFromEDINotificationEES: function (ediPartner, notifXMLDomElement, ackInfos)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.EDI.SendInputAttachAsEDI
		 * @description
		 * This function can be used to force the input EDI file to be sent as is to the EDI submission
		 * No EDI file will be generated in this case, we will send the input file sent to Invoice Delivery
		 * Specific FRENCHB2B : 
		 * Even if the input file format is not the one expected in the French B2B configuration it will be sent
		 * It can only work if the input file is a format accepted by the PDP
		 * @returns {boolean} return true if the input file needs to be sent as is to the EDI submission
		 */
		/*SendInputAttachAsEDI: function ()
		{
			var deliveryMethod = Data.GetValue("Customer_delivery_method__");
			var deliverySystem = Data.GetValue("Delivery_system__");
			var conf = Sys.AR.GetParameter("ConfigurationName");
			if (deliveryMethod === "EDI" && deliverySystem === "frb2b" && conf === "NoGeneration")
			{
				return true;
			}
			return false; 
		},*/

		/**
		 * @typedef {Object} Lib.AR.Customization.EDI.EDIValidationParameter
		 * @memberof Lib.AR.Customization.EDI
		 * @property {"UBL"|"CII"|"FACTURX"} format Input EDI file format
		 * @property {"pilot"|"starting"|"target"} complianceLevel - expected compliance level of schematron validation
		 * @property {"BASICWL"|"EXTENDED_FRB2B"} outputProfileFacturX - (optional) profile of the FacturX if the format is set to "FACTURX" only.
		*/
		/**
		 * @method Lib.AR.Customization.EDI.FRB2BValidateInputEDIParameter
		 * @description
		 * Only called when the above function SendInputAttachAsEDI is defined and returns true,
		 * meaning the input file will be the one sent by EDI to the PDP
		 * This function can be used in frenchB2B delivery only, to choose which validation to apply
		 * If it isn't defined the validation will be the same as the output format configured in the company for FRB2B
		 * @returns {Lib.AR.Customization.EDI.EDIValidationParameter} JSON containing the information about the validation needed on the EDI file, which schematron to apply
		 */
		/*FRB2BValidateInputEDIParameter: function ()
		{
			return {format: "UBL", complianceLevel: "starting"};
		},*/

		/**
		 * @method Lib.AR.Customization.EDI.AddNode
		 * @description
		 * Helper function used to add a node inside an XML element.
		 *
		 * /!\ Warning: if a node doesn't exist at the moment, don't assume it will never exist.
		 * It could be added in a next sprint update of 'AR System EDI Submission' process.
		 * The preferred way to add or modify a node is using 'AddOrGetNode' helper function.
		 * Use 'AddNode' only if you want to add a duplicate node.
		 * 
		 * @example the node '&lt;cbc:ID schemeID="mySchemeId"&gt;my node value&lt;/cbc:ID&gt;' will be created inside the 2nd &lt;esk:Data&gt;
		 *	var parentXpath = "//ext:UBLExtensions/ext:UBLExtension[2]/ext:ExtensionContent/esk:Data";
		 *	var nodeName = "cbc:ID";
		 *	var node = this.AddNode(xmlDomElement, parentXpath, nodeName);
		 *	node.text = "my node value";
		 *	node.setAttribute("schemeID", "mySchemeId");
		 */
		AddNode: function (xmlDomElement, parentXpath, nodeName)
		{
			var parentNodes = xmlDomElement.selectNodes(parentXpath);
			if (parentNodes.length === 0)
			{
				throw "AddNode error: parent node not found for XPath '" + parentXpath + "' when trying to add node '" + nodeName + "'";
			}
			else if (parentNodes.length > 1)
			{
				throw "AddNode error: multiple parent nodes found for XPath '" + parentXpath + "' when trying to add node '" + nodeName + "'";
			}

			var node = xmlDomElement.createElement(nodeName);
			parentNodes.item(0).appendChild(node);

			return node;
		},

		/**
		 * @method Lib.AR.Customization.EDI.AddOrGetNode
		 * @description
		 * Helper function used to retrieve or create (if it doesn't already exist) a node inside an XML element.
		 * If the argument 'nodeXpath' is not provided il will be initialised from 'parentXpath' and 'nodeName'.
		 * 
		 * @example the existing node '&lt;cbc:ID schemeID="Subject"&gt;Invoice Number ...&lt;/cbc:ID&gt;' will be changed to '&lt;cbc:ID schemeID="Subject"&gt;my node value&lt;/cbc:ID&gt;'
		 *	var parentXpath = "//ext:UBLExtensions/ext:UBLExtension[2]/ext:ExtensionContent/esk:Data";
		 *	var nodeName = "cbc:ID";
		 *	var node = this.AddOrGetNode(xmlDomElement, parentXpath, "cbc:ID", parentXpath + "/" + nodeName + "[@schemeID='Subject']");
		 *	node.text = "my node value";
		 *	node.setAttribute("schemeID", "Subject"); // just in case the node didn't already existed
		 */
		AddOrGetNode: function (xmlDomElement, parentXpath, nodeName, nodeXpath)
		{
			nodeXpath = nodeXpath || parentXpath + "/" + nodeName;

			var nodes = xmlDomElement.selectNodes(nodeXpath);
			if (nodes.length === 0)
			{
				return this.AddNode(xmlDomElement, parentXpath, nodeName);
			}
			else if (nodes.length === 1)
			{
				return nodes.item(0);
			}
			throw "AddOrGetNode error: multiple nodes found for node XPath '" + nodeXpath + "'";
		},

		/**
		 * @method Lib.AR.Customization.EDI.TryRemoveNode
		 * @description
		 * Helper function used to remove a node from an XML element.
		 * Returns true if the node existed, false if not.
		 *
		 * @example removes the node '&lt;cbc:ID schemeID="Server"&gt;HOST-NAME&lt;/cbc:ID&gt;'
		 *	this.TryRemoveNode(xmlDomElement, "//ext:UBLExtensions/ext:UBLExtension[2]/ext:ExtensionContent/esk:Data/cbc:ID[@schemeID='Server']");
		 */
		TryRemoveNode: function (xmlDomElement, nodeXpath)
		{
			var node = xmlDomElement.selectSingleNode(nodeXpath);
			if (node)
			{
				node.parentNode.removeChild(node);
				return true;
			}

			return false;
		}
	};

	return EDICustomization;

})();
