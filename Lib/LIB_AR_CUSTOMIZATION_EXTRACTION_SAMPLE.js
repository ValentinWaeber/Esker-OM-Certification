/* LIB_DEFINITION{
  "name": "LIB_AR_CUSTOMIZATION_EXTRACTION_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "comment": "all extraction customization function",
  "versionable": false,
  "require": [
    "Sys/SYS_EDIFACTEXTRACTION"
  ]
}*/

/**
 * Package AR extraction customization callbacks for all processes
 * @namespace Lib.AR.Customization.Extraction
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};

Lib.AR.Customization.Extraction = (function ()
{
	/**
	 * @lends Lib.AR.Customization.Extraction
	 */
	var Extraction =
	{
		/**
		 * 	
		 * Allows you to customize the type of extraction for the Customer invoice (supplier copy) process based on the format of the incoming invoice.
		 * This user exit is called at the end of the extraction script of the process.
		 * 
		 * @returns {}This fonction has two kinds of return value:
		 * * A `string` representing the name of extraction format.The default value indicates that no extraction is selected.The following extraction types are available:
		 *
		 *  Document format   | Extraction type
		 * -------------------|--------------------
		 * `PDF`              | pdf
		 * `UBL`              | ubl
		 * `UBL EN16931`      | ubl_en16931
		 * `UBL + PDF`        | ubl_pdf
		 * `UBL EN16931 + PDF`| ubl_en16931_pdf
		 * `CII`              | cii
		 * `CII + PDF`        | cii_pdf
		 * `BProcess 1`       | bprocess1
		 * `BProcess 1 + PDF` | bprocess1_pdf
		 * `Custom XML`       | customxml
		 * `Custom XML + PDF` | customxml_pdf
		 * `IDOC`             | idoc
		 * `IDOC + PDF`       | idoc_pdf
		 * * `null` indicating that the extraction is automatically detected based on process attachments.
		 * @example
		 * The following example disables the automatic detection of the type of extraction:
		 * <pre><code>
		 * GetExtractionType: function ()
		 * {
		 *	 return "default";
		 * }
		 * </code></pre>
		 * The following example sets the extraction type to customxml1 if the InvoiceID node of the XML file contains a value:
		 * <pre><code>
		 * GetExtractionType: function ()
		 * {
		 *	 if (!Lib.AR.XMLExtraction.HasXMLToProcessAttach())
		 *		 {
		 *			 return false;
		 *		 }
		 *	 var invoiceNumber = Lib.AR.XMLExtraction.Extract("/Invoice/InvoiceID");
		 *	 return (invoiceNumber && invoiceNumber.length) > 0 ? "customxml1" : null;
		 * }
		 * </code></pre>
		 */
		GetExtractionType: function ()
		{
			return null;
		},

		/**
		 * This function is used to setup the invoices extraction
		 * It can be used to customize both the PDF or the XML/IDOC extraction
		 *
		 * @param extractionType {string} Allows to run specific extraction depending on the selected extraction type
		 * (returned by the GetExtractionType user exit or specified by the configurator).
		 *
		 * @example 
		 * PDF Extraction
		 * <pre><code>
		 * // For PDF extraction use the Lib.AR.Extraction lib
		 * // You MUST call the following method with the current document culture as a parameter.
		 * // Otherwise the extraction of dates and numbers will not work.
		 * Lib.AR.Extraction.Init('fr-FR');
		 *
		 * // You can now add there your extraction logic.
		 * // There is below some examples to extract data from the document :
		 * Lib.AR.Extraction.Extract(0, 139,  437, 727,   75, "Customer_name__");
		 * Lib.AR.Extraction.Extract(0,  1497,  564,  357,   56, "Invoice_date__", Lib.AR.Extraction.StringToDate);
		 * Lib.AR.Extraction.Extract(nbPages-1, 1879, 2486, 441, 52, "Invoice_total_amount__", Lib.AR.Extraction.StringToDecimal);
		 * </code></pre>
		 * XML extraction
		 * <pre><code>
		 * // Extract invoice total amount
		 * Lib.AR.XMLExtraction.Extract("/Invoice/Summary/GrossAmount", "Invoice_total_amount__", Lib.AR.XMLExtraction.StringToDecimal);
		 *
		 * // Extract the invoice date in french format
		 * function parseFrenchDate(str) { TO BE IMPLEMENTED }
		 * Lib.AR.XMLExtraction.Extract("/Invoice/Head/InvoiceDate", "Invoice_date__", parseFrenchDate);
		 *
		 * // For each invoice line add or overwrite cell values
		 * Lib.AR.XMLExtraction.ExtractTable("/Invoice/Line[LineType='L']", "Table_Line_Items__", function (extractCell, tableItem)
		 * {
		 * 		// extract the date in french format
		 * 		extractCell("PONumDate", "Col_Purchase_order_date__", parseFrenchDate);
		 * 		// set a constant value for the tax
		 * 		tableItem.SetValue("Col_Tax__", 20.0);
		 * });
		 * </code></pre>
		 * IDoc extraction
		 * <pre><code>
		 * // For IDoc extraction use the Lib.AR.IDocExtraction lib
		 * var document = Lib.AR.IDocExtraction.Document();
		 *
		 * // Extract invoice total amount
		 * var summarySegmentGeneral = document.summarySegmentGeneral;
		 *
		 * var invoiceTotalAmountField = Lib.AR.IDocExtraction.GetMatchingFields(summarySegmentGeneral,
		 * 		"qualifierForTotalsSegmentForShippingNotification",
		 * 		"011"); // Billed_value
		 *
		 * if (invoiceTotalAmountField)
		 * {
		 * 		Lib.AR.IDocExtraction.Extract(invoiceTotalAmountField.totalValueOfSumSegment, summarySegmentGeneral, "Invoice_total_amount__", Lib.AR.IDocExtraction.StringToDecimal);
		 * }
		 * </pre></code>
		 */
		ExtractDataFromDocument: function (extractionType)
		{
		},
		/**
		 * This function is used to initialize the SUPI extraction
		 * It could be useful to forward the process to someone else for instance (so supplier and customer request in DB are right)
		 */
		InitializeSUPIExtraction: function ()
		{
		},

		/**
		 * Allows you to customize extraction settings for the Customer invoice (supplier copy) process based on the extracted data.
		 * This user exit is called at the end of the extraction script of the process.
		 * @example
		 * This user exit adds an email copy based on the customer email.
		 * <pre><code>
		 * FinalizeSUPIExtraction: function ()
		 * {
		 *	 var emailAddress = Data.GetValue("EmailAddress");
		 *	 var copyEmailAddress = emailAddress.replace("companyname1.com", "companyname2.com");
		 *	 Data.SetValue("Copy_invoice_email__", copyEmailAddress);
		 * }
		 * </code></pre>
		 * This user exit prevents sending invoices after submission.
		 * <pre><code>
		 * FinalizeSUPIExtraction: function ()
		 * {
		 *	 Data.SetValue("Customer_delivery_method__", "NONE");
		 * }
		 * </code></pre>
		 */
		FinalizeSUPIExtraction: function ()
		{
		},

		/**
		 * Allows you to customize extraction settings for the Customer invoice (customer copy) process based on the extracted data.
		 * This user exit is called at the end of the extraction script of the process.
		 */
		FinalizeCUSIExtraction: function ()
		{
		},

		/**
		 * Allows you to customize extraction settings for the Accounts Receivable Batch Processing process based on the extracted data.
		 * This user exit is called at the end of the extraction script of the process.
		 */
		FinalizeSplittingExtraction: function ()
		{
		},

		/**
		 * Allows you to customize extraction settings for the Resend customer invoice process based on the extracted data.
		 * This user exit is called at the end of the extraction script of the process.
		 */
		FinalizeResendExtraction: function ()
		{
		},

		/**
		 * This function is used to customize the IDoc header extraction.
		 * @param {object} iDoc JSON object representation of IDoc
		 * @param {number} itemCount Number of items in IDoc
		 */
		// FinalizeIDocHeaderExtraction: function(iDoc, itemCount)
		// {
		// },

		/**
		 * This function is used to customize the IDoc item extraction.
		 * @param {object} iDocItem  JSON object representation of IDoc document item (instance of documentItemGeneralData, segment E2EDP01)
		 * @param {object} tableItem Instance of Item object (Processing scripts API)
		 * @param {number} tableItemIdx Index of item in parent table
		 * @param {object} iDoc JSON object representation of IDoc
		 */
		FinalizeIDocItemExtraction: function (iDocItem, tableItem, tableItemIdx, iDoc)
		{
		},

		/**
		 * This function is used to customize the cXML header and totals amount or any fields extraction.
		 * Use the Lib.AR.XMLExtraction helpers to extract from cXML
		 * cXML Extrinsic nodes are customs ones and are not handled in classic cXML extraction
		 */
		// FinalizecXMLExtraction: function()
		// {
		// },

		/**
		 * This function is used to customize the cXML item extraction.
		 * @param {object} extractCell  function that takes a relative XPath and a fieldname as input and returns the value of the Xpath's nodes and affect it to the SUPI field
		 * the root node for the extractCell function is /cXML/Request/InvoiceDetailRequest/InvoiceDetailOrder/InvoiceDetailItem which corresponds to the LineItems Table
		 *  @param {object} tableItem current item from the lineItems table on which we are iterating
		 * @param {number} tableItemIdx Index of item in parent table
		 */
		FinalizecXMLItemExtraction: function (extractCell, tableItem, tableItemIdx)
		{
		},

		/**
		 * This function is used to customize the any fields extraction.
		 * Use the Lib.AR.XMLExtraction helpers to extract from ubl.
		 * @example
		 * This user exit adds a suffix on the invoice number extracted from the ubl document.
		 * <pre><code>
		 * FinalizeFacturXExtraction: function ()
		 *	{
		 *		var reformat = function (str)
		 *		{
		 *			return "INV" + str;
		 *		};
		 *		Lib.AR.XMLExtraction.Extract("/cbc:ID", "Invoice_number__", reformat);
		 *	}
		 * </code></pre>
		 */
		FinalizeUblExtraction: function ()
		{
		},

		/**
		 * This function is used to customize the FacturX header and totals amount or any fields extraction.
		 * Use the Lib.AR.XMLExtraction helpers to extract from FacturX.
		 * @example
		 * This user exit adds a suffix on the invoice number extracted from the FacturX document.
		 * <pre><code>
		 * FinalizeFacturXExtraction: function ()
		 *	{
		 *		var reformat = function (str)
		 *		{
		 *			return "INV" + str;
		 *		};
		 *		Lib.AR.XMLExtraction.Extract("/rsm:CrossIndustryInvoice/rsm:ExchangedDocument/ram:ID", "Invoice_number__", reformat);
		 *	}
		 * </code></pre>
		 */
		FinalizeFacturXExtraction: function ()
		{
		},

		/**
		 * This function is used to customize the Edifact fields mapped, such as bill to and sold to with other identifiers than the ones implemented.
		 * @example
		 * Example if the bill to is mapped to an identifier "BS" instead of "BT" or "IV"
		 * <pre><code>
		 * FinalizeEdifactExtraction: function (jsonParsedDocument)
		 *	{
		 *		var document = JSON.parse(jsonParsedDocument);
		 *		if (document && document.nameAndAddress && document.nameAndAddress.instances)
		 *		{
		 *			document.nameAndAddress.instances.forEach(element => {
		 *				if (element.fields && element.fields.partyQualifier && element.fields.partyQualifier.value == "BS")
		 *				{
		 *					if (element.fields.partyName)
		 *					{
		 * 						Data.SetValue("Customer_bill_to_legal_entity_name__", element.fields.partyName.value);
		 * 					}
		 *				}
		 *			}
		 *		);
		 *		}
		 *	}
		 * </code></pre>
		 * @param {string} jsonParsedDocument String containing the json mapping, findable in the Variables, from the documentation https://www.truugo.com/edifact/d96a/invoic/
		 */
		FinalizeEdifactExtraction: function (jsonParsedDocument)
		{
		},

		/**
		 * @description
		 * Allows you to force the company code extraction
		 * @returns {string} The company code to use for the extraction.
		 * @example
		 * <pre><code>
		 * ForceCompanyCode: function ()
		 * {
		 *		if(Data.GetValue("Invoice_number__").toString().startsWith("123"))
		 *		{
		 *			return "COMPANY_CODE_1";
		 *		}
		 * }
		 * </code></pre>
		 */
		ForceCompanyCode: function ()
		{
		}
	};

	return Extraction;

})();
