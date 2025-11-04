/* LIB_DEFINITION{
  "name": "LIB_CA_CUSTOMIZATION_SAP_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "CashApplication SAP posting customization functions",
  "require": []
}*/

/**
 * This module contains
 * - functions used to customize the payment posting to SAP from the Cash Application
 * @namespace Lib.CA.Customization.SAP
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.Customization = Lib.CA.Customization || {};

Lib.CA.Customization.SAP = (function ()
{
	/**
	 * @lends Lib.CA.Customization.SAP
	 */
	var SAP =
	{
		/**
		 * @method Lib.CA.Customization.SAP.InitializePaymentSAPPosting
		 * @description
		 * Function called at the beginning of the Payment SAP Poster run
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 */
		/*InitializePaymentSAPPosting: function(paymentAccessor)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.SAP.FinalizePaymentSAPPosting
		 * @description
		 * Function called at the end of the Payment SAP Poster run
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 */
		/*FinalizePaymentSAPPosting: function(paymentAccessor)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.SAP.GetItemsForEachPostingBatch
		 * @description
		 * Allows for overriding which allocation items are included in each document when posting the payment to SAP.
		 * This user exit is called near the beginning of the Payment SAP Poster run while allocating a payment. This does not apply for recycled payments.
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * @returns {Sys.AR.SAP.ItemsForPosting[]} Specifies which allocation items should be included in each posted document.
		 * Each entry in the ItemsForPosting array specifies the items to include in a single posted document.
		 * @example <caption>This example make sure items that should be linked together are included in the same document.
		 * This example uses a mapping between the invoice field Col_invoice_number__, the G/L field Col_GL_Document_Number__, and the Customer field Col_Customer_Document_Number__.</caption>
		 * GetItemsForEachPostingBatch: function (paymentAccessor)
		 * {
		 *	let itemsForEachPosting = [];
		 *	let itemsForSinglePosting = {
		 *		invoiceIndexes: [],
		 *		glIndexes: [],
		 *		customerIndexes: []
		 *	};
		 *	let itemCountLimit = 800; // Limit arbitrarily chosen to handle up to ~100 extra items added from the ledger/customer table and linked to an invoice
		 *	let totalItemCount = 0;
		 *	let glAdjustmentTable = paymentAccessor.GetTable("Account_Allocation_Table__");
		 *	let glItems = [];
		 *	for (let i = 0; i < glAdjustmentTable.GetItemCount(); i++)
		 *	{
		 *		glItems.push(glAdjustmentTable.GetItem(i));
		 *	}
		 *	let customerAdjustmentTable = paymentAccessor.GetTable("Allocate_To_Customer_Table__");
		 *	let customerItems = [];
		 *	for (let i = 0; i < customerAdjustmentTable.GetItemCount(); i++)
		 *	{
		 *		customerItems.push(customerAdjustmentTable.GetItem(i));
		 *	}
		 *	let selectedInvoices = Lib.CA.Payment.Allocate.Common.GetSelectedInvoiceItems();
		 *	// Determine the invoice items to include
		 *	for (let i = 0; i < selectedInvoices.length; i++)
		 *	{
		 *		// Only need to track the index in the list of selected invoices
		 *		itemsForSinglePosting.invoiceIndexes.push(i);
		 *		totalItemCount++;
		 *		const invoiceItem = selectedInvoices[i];
		 *		// Consider items added if a discount exists on the invoice
		 *		let discountLedgerAmount = Number(invoiceItem.GetValue("Col_GL_amount__"));
		 *		if (invoiceItem.GetValue("Col_GL_account__") && Sys.Helpers.IsNumeric(discountLedgerAmount) && Math.abs(discountLedgerAmount) > 0.001)
		 *		{
		 *			totalItemCount++;
		 *		}
		 *		let glItemIndexesMatchingThisInvoice = findIndexForSameDocument(invoiceItem.GetValue("Col_invoice_number__"), glItems, "Col_GL_Document_Number__");
		 *		let customerItemIndexesMatchingThisInvoice = findIndexForSameDocument(invoiceItem.GetValue("Col_invoice_number__"), customerItems, "Col_Customer_Document_Number__");
		 *		if (glItemIndexesMatchingThisInvoice.length >= 0)
		 *		{
		 *			itemsForSinglePosting.glIndexes.push(...glItemIndexesMatchingThisInvoice);
		 *			totalItemCount += 2 * glItemIndexesMatchingThisInvoice.length;
		 *			// Remove found GL items from the list, so we don't post them twice
		 *			glItems = glItems.filter((item, index) => !glItemIndexesMatchingThisInvoice.includes(index));
		 *		}
		 *		if (customerItemIndexesMatchingThisInvoice.length >= 0)
		 *		{
		 *			itemsForSinglePosting.customerIndexes.push(...customerItemIndexesMatchingThisInvoice);
		 *			totalItemCount += 2 * customerItemIndexesMatchingThisInvoice.length;
		 *			// Remove found customer items from the list, so we don't post them twice
		 *			customerItems = customerItems.filter((item, index) => !customerItemIndexesMatchingThisInvoice.includes(index));
		 *		}
		 *		if (totalItemCount >= itemCountLimit)
		 *		{
		 *			itemsForEachPosting.push(itemsForSinglePosting);
		 *			itemsForSinglePosting =
		 *			{
		 *				invoiceIndexes: [],
		 *				glIndexes: [],
		 *				customerIndexes: []
		 *			};
		 *			totalItemCount = 0;
		 *		}
		 *	}
		 *	// Determine the GL adjustments to include
		 *	for (let i = 0; i < glItems.length; i++)
		 *	{
		 *		// Only need to track the index in the GL adjustment table
		 *		itemsForSinglePosting.glIndexes.push(i);
		 *		// Two items will be added to the document - one for the adjustment and one for the offset
		 *		totalItemCount += 2;
		 *		if (totalItemCount >= itemCountLimit)
		 *		{
		 *			itemsForEachPosting.push(itemsForSinglePosting);
		 *			itemsForSinglePosting =
		 *			{
		 *				invoiceIndexes: [],
		 *				glIndexes: [],
		 *				customerIndexes: []
		 *			};
		 *			totalItemCount = 0;
		 *		}
		 *	}
		 *	// Determine the Customer adjustments to include
		 *	for (let i = 0; i < customerItems.length; i++)
		 *	{
		 *		// Only need to track the index in the Customer adjustment table
		 *		itemsForSinglePosting.customerIndexes.push(i);
		 *		// Two items will be added to the document - one for the adjustment and one for the offset
		 *		totalItemCount += 2;
		 *		if (totalItemCount >= itemCountLimit)
		 *		{
		 *			itemsForEachPosting.push(itemsForSinglePosting);
		 *			itemsForSinglePosting =
		 *			{
		 *				invoiceIndexes: [],
		 *				glIndexes: [],
		 *				customerIndexes: []
		 *			};
		 *			totalItemCount = 0;
		 *		}
		 *	}
		 *	// Helper function:
		 *	// Find indexes for items in the provided array that have the same document ID as the source item
		 *	// @param {string} documentIdToFind Document ID from the source item
		 *	// @param {Item[] | xFormDataTableItem[]} itemsInWhichToFindDocument Array of items in which to search for the document ID
		 *	// @param {string} documentIdFieldName Name of the field on the item to compare against
		 *	// @returns {number[]} List of indexes in the array that matches on the provided document ID
		 *	function findIndexForSameDocument(documentIdToFind, itemsInWhichToFindDocument, documentIdFieldName)
		 *	{
		 *		let indexes = [];
		 *		for (let i = 0; i < itemsInWhichToFindDocument.length; i++)
		 *		{
		 *			if (itemsInWhichToFindDocument[i].GetValue(documentIdFieldName) === documentIdToFind)
		 *			{
		 *				indexes.push(i);
		 *			}
		 *		}
		 *		return indexes;
		 *	}
		 *	if (itemsForSinglePosting.invoiceIndexes.length > 0
		 *		|| itemsForSinglePosting.glIndexes.length > 0
		 *		|| itemsForSinglePosting.customerIndexes.length > 0)
		 *	{
		 *		itemsForEachPosting.push(itemsForSinglePosting);
		 *	}
		 *	return itemsForEachPosting;
		 * },
		 */
		/*GetItemsForEachPostingBatch: function(paymentAccessor)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.SAP.GetItemLimitApplicability
		 * @description
		 * Allows for overriding the way allocation items are counted to determine how to split the payment across posted SAP documents.
		 * This user exit is called near the beginning of the Payment SAP Poster run while allocating a payment. This does not apply for recycled payments.
		 * The actual maximum number of items to include in each posting can be set by {@link Lib.CA.Customization.SAP.GetItemLimitForPostedDocument}.
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * @returns {"SAPITEMS" | "EODITEMS"} Specifies which logic to use to determine how to split the SAP documents.
		 * By default, the logic for "SAPITEMS" is used to split the posting based on the number of line items that will be created in the resulting SAP
		 * document (e.g. this logic assumes which items will be merged and how many offset items will be added in SAP).
		 * If "EODITEMS" is specified, the SAP payment posting documents will be split based on the number of items on the EOD payment allocation form.
		 * @example This example will set the item count logic to use based on the company code
		 * GetItemLimitApplicability: function(paymentAccessor)
		 *{
		 *	var companyCode = paymentAccessor.GetValue("Company_code__") || "";
		 *	switch (companyCode)
		 *	{
		 *		case "1000":
		 *			return "EODITEMS";
		 *		case "3000":
		 *			return "SAPITEMS";
		 *		default:
		 *			// unknown company code
		 *			break;
		 *	}
		 *	return null;
		 * }
		 */
		/*GetItemLimitApplicability: function(paymentAccessor)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.SAP.GetItemLimitForPostedDocument
		 * @description
		 * Allows for overriding the maximum number of items to allow in each posted SAP document.
		 * This user exit is called near the beginning of the Payment SAP Poster run while allocating a payment. This does not apply for recycled payments.
		 * The way allocation items are counted can be set by {@link Lib.CA.Customization.SAP.GetItemLimitApplicability}.
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * @returns {number} Specifies the maximum number of items to include in each posted SAP document.
		 * By default, the limit is 989, which is based on the SAP item limit of 999 due to the field length of 3 characters (along with a buffer).
		 * @example This example will set the maximum number of items to use based on the company code
		 * GetItemLimitForPostedDocument: function(paymentAccessor)
		 *{
		 *	var companyCode = paymentAccessor.GetValue("Company_code__") || "";
		 *	switch (companyCode)
		 *	{
		 *		case "1000":
		 *			return 250;
		 *		case "3000":
		 *			return 800;
		 *		default:
		 *			// unknown company code
		 *			break;
		 *	}
		 *	return null;
		 * }
		 */
		/*GetItemLimitForPostedDocument: function(paymentAccessor)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.SAP.GetConnectionConfiguration
		 * @description
		 * Allows for overriding the SAP configuration name set on the payment file configuration
		 * This user exit is called before connecting to SAP for posting a payment
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @returns {string} Value containing the name of the SAP configuration that manages the connection with your SAP environment
		 * This value will be used as the input into the function {@link https://webdoc/eskerondemand/nv/en/manager/startpage.htm#ProcessingScripts/SapControl/CreateBapiManager.html ISAPControl.CreateBapiManager}
		 * @example This example will directly override the SAP connection configuration
		 * GetConnectionConfiguration: function(paymentAccessor)
		 * {
		 *	return "CUSTOMER_EskerINTAROD_QA_01234567";
		 * }
		 * @example Example with paymentAccessor
		 * GetConnectionConfiguration: function(paymentAccessor)
		 * {
		 *	if (paymentAccessor.GetValue("Payment_method__"))
		 *	{
		 *	 return "CUSTOMER_EskerINTAROD_QA_99999";
		 *	}
		 *	 return "CUSTOMER_EskerINTAROD_QA_01234567";
		 * }
		 */
		/*GetConnectionConfiguration: function(paymentAccessor)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.SAP.GetBAPIName
		 * @description
		 * Return the BAPI name to call.
		 * Allows for retrieving the customized name of a BAPI from the specified default BAPI name.
		 * This user exit is called for each BAPI used in posting External payments to SAP with Web Services.
		 * @param {string} originalBapiName for instance "BAPI_ACC_DOCUMENT_POST"
		 * @returns {string} String value containing the customized BAPI name or, if no mapping has been defined, the default BAPI name.
		 * @example This example retrieves the customized name of the auto-commit BAPIs:
		 * GetBAPIName: function (originalBapiName)
		 * {
		 *	var customBapiName;
		 *	switch (originalBapiName)
		 *	{
		 *		case "BAPI_ACC_DOCUMENT_POST":
		 *			customBapiName = "Z_BAPI_ACC_DOCUMENT_POST_DOCOM";
		 *			break;
		 *		case "SO_OBJECT_INSERT":
		 *			customBapiName = "Z_SO_OBJECT_INSERT_DOCOM";
		 *			break;
		 *		case "BAPI_REL_CREATERELATION":
		 *			customBapiName = "Z_BAPI_REL_CREATEREL_DOCOM";
		 *			break;
		 *		default:
		 *			customBapiName = originalBapiName;
		 *			break;
		 *	}
		 *	return customBapiName;
		 * }
		 */
		/*GetBAPIName: function(originalBapiName)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.SAP.OnSapWebServiceTokenParamsSet
		 * @description
		 * Allows modification of the callParams.data in the SAP OAuth 2.0 token API calls to include additional required data such as scope.
		 * @see {@link https://webdoc/eskerondemand/cv_ly/en/manager/startpage.htm#ProcessingScripts/HttpRequest/Call.html ProcessingScripts/HttpRequest/Call.html}
		 * @param {string} params "grant_type=client_credentials" is the default data parameter
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @returns {string} params
		 * @example This example will add a scope parameter defined in a custom external variable.
		 * OnSapWebServiceTokenParamsSet: function (params, paymentAccessor)
		 * {
		 *	var scope = paymentAccessor.GetExternalValue("Z_TokenScope__");
		 *	if (!Sys.Helpers.IsEmpty(scope))
		 *	{
		 *		params += "&scope=" + scope;
		 *	}
		 *	Log.Info("[OnSapWebServiceTokenParamsSet] - " + params);
		 *	return params;
		 * }
		 */
		/*OnSapWebServiceTokenParamsSet: function(params, paymentAccessor)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.SAP.CalculateItemNumbACC
		 * @description
		 * Allows for overriding the unique item number for the ITEMNO_ACC field of the BAPI parameters
		 * This user exit is called whenever we need to determine the ITEMNO_ACC
		 * @param {number} itemNoCount The current number of items to include
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @returns {string} Representing the ITEMNO_ACC for this item
		 * @example This example will set the ITEMNO_ACC based on the current item count by padding left with zeros
		 * CalculateItemNumbACC: function(itemNoCount, paymentAccessor)
		 * {
		 *	var itemNumberAcc = itemNoCount.toString();
		 *	var paddedLength = 6;
		 *	while (itemNumberAcc.length < paddedLength)
		 *	{
		 *		itemNumberAcc = "0" + itemNumberAcc;
		 *	}
		 *	return itemNumberAcc;
		 * }
		 */
		/*CalculateItemNumbACC: function(itemNoCount, paymentAccessor)
		{
		},*/

		/**
		 * Definition of the ZESKER_T_CSH_PAY_H SAP BAPI table
		 * @interface Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_H
		 * @prop {number} ITEMNO
		 * @prop {string} HEADER_TXT (BKTXT) Notes for the document as a whole
		 * @prop {string} COMP_CODE (BUKRS) Company code
		 * @prop {string} DOC_DATE (BLDAT) Document Date in Document
		 * @prop {string} PSTNG_DATE (BUDAT) Posting Date in the Document
		 * @prop {string} TRANS_DATE (WWERT) Translation date
		 * @prop {string} DOC_TYPE (BLART) Document type
		 * @prop {string} REF_DOC_NO (XBLNR) Reference Document Number
		 * @prop {string} AC_DOC_NO (BELNR) Accounting Document Number
		 * @prop {string} CLEAR_TXT (AUGTX) Clearing Text (required to set the SGTXT for fully-paid invoices when not using the extension)
		 * @prop {string} FIS_PERIOD (MONAT) Fiscal period
		 * @prop {string} WAERS (WAERS) Currency key
		 * @prop {number} EXCH_RATE (KURSF) Exchange rate
		 * @prop {string} PAYMENT_REF Used for logging in SAP
		 */

		/**
		 * Definition of the BAPIACHE09 SAP BAPI table
		 * @interface Lib.CA.Customization.SAP.BAPIACHE09
		 * @prop {string} OBJ_TYPE
		 * @prop {string} OBJ_KEY
		 * @prop {string} OBJ_SYS
		 * @prop {string} BUS_ACT
		 * @prop {string} USERNAME
		 * @prop {string} HEADER_TXT
		 * @prop {string} COMP_CODE
		 * @prop {string} DOC_DATE
		 * @prop {string} PSTNG_DATE
		 * @prop {string} TRANS_DATE
		 * @prop {string} FISC_YEAR
		 * @prop {string} FIS_PERIOD
		 * @prop {string} DOC_TYPE
		 * @prop {string} REF_DOC_NO
		 * @prop {string} AC_DOC_NO
		 * @prop {string} OBJ_KEY_R
		 * @prop {string} REASON_REV
		 * @prop {string} COMPO_ACC
		 * @prop {string} REF_DOC_NO_LONG
		 * @prop {string} ACC_PRINCIPLE
		 * @prop {SAPBoolean} NEG_POSTNG
		 * @prop {string} OBJ_KEY_INV
		 * @prop {string} BILL_CATEGORY
		 * @prop {string} VATDATE
		 * @prop {string} INVOICE_REC_DATE
		 * @prop {string} ECS_ENV
		 */

		/**
		 * @method Lib.CA.Customization.SAP.UpdateBapiDocumentHeader
		 * @description
		 * Allows for overriding the BAPI DOCUMENT_HEADER sent to SAP
		 * This user exit is called after the code has initially set the values in the Document Header object
		 * @param {Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_H | Lib.CA.Customization.SAP.BAPIACHE09} header Initial document header object set up by the baseline code
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @returns {Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_H | Lib.CA.Customization.SAP.BAPIACHE09} Object containing the document header part of the BAPI JSON posted to SAP
		 * @example This example will override the DOC_TYPE field to be "DZ"
		 * UpdateBapiDocumentHeader: function(header, paymentAccessor)
		 * {
		 *	header.DOC_TYPE = "DZ";
		 *	return header;
		 * }
		 */
		/*UpdateBapiDocumentHeader: function(header, paymentAccessor)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.SAP.GetGLAccountForPaymentMethod
		 * @description
		 * Allows for setting the payment-level G/L to use when posting the payment to SAP
		 * This user exit is called while setting the values in the offset item object before it is added into the BAPI ITEM.
		 * For BAPI_ACC_DOCUMENT_POST, this user exit is called while setting the offset G/L information before it's added to the BAPI table.
		 * @param {string} paymentMethod Type of the payment
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @returns {string} G/L account associated with the payment method
		 * @example This example will set the G/L based on the company code and payment method
		 * GetGLAccountForPaymentMethod: function(paymentMethod, paymentAccessor)
		 * {
		 * 	var companyCode = paymentAccessor.GetValue("Company_code__") || "";
		 * 	switch (companyCode)
		 * 	{
		 * 		case "1000":
		 * 			switch (paymentMethod)
		 * 			{
		 * 				case "CC":
		 * 					return "11111";
		 * 				case "External":
		 * 					return "22222";
		 * 				default:
		 * 					//unknown payment method
		 * 			}
		 * 			break;
		 * 		default:
		 * 			// unknown company code
		 * 			break;
		 * 	}
		 * 	return null;
		 * }
		 */
		/*GetGLAccountForPaymentMethod: function(paymentMethod, paymentAccessor)
		{
		},*/

		/**
		 * Definition of AllocationItem object
		 * @interface Lib.CA.Customization.SAP.AllocationItem
		 * @prop {string} type "INVOICE", "CUSTOMER", or "GL"
		 * @prop {Item} item Table item from the payment form
		 * @prop {string} customer Associated customer
		 * @prop {string} itemNumberAcc Unique identifier for the item
		 * @prop {string} GLAccount Associated GL account
		 * @prop {string} costCenter Associated cost center
		 * @prop {string} profitCenter Associated profit center
		 * @prop {string} taxCode Associated tax code
		 * @prop {string} invoiceNumber Invoice number, if this is an invoice
		 * @prop {string} currencyAmount Amount allocated to this invoice/account
		 * @prop {string} paymentRef The payment reference
		 */

		/**
		 * Definition of the ZESKER_T_CSH_PAY_I SAP BAPI table
		 * @interface Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_I
		 * @prop {number} ITEMNO
		 * @prop {string} ITEMNO_ACC
		 * @prop {string} COMP_CODE (NEWBK) Company Code for intercompany postings or special G/L transactions
		 * @prop {string} ACCOUNT (KONTO) Customer ID or G/L account number
		 * @prop {string} KOART (KOART) "S" = G/L account, "D" = customer account
		 * @prop {string} PAYMT_REF "GL" for G/L account, "ACCOUNT" for customer account, and anything else for invoice
		 * @prop {string} ALLOC_NMBR (ZUONR) Assignment number
		 * @prop {string} ITEM_TEXT (SGTXT) An explanatory text on the line item - only used for G/L and Customer - not for invoices
		 * @prop {string} VALUE_DATE (VALUT)
		 * @prop {string} TAX_CODE (MWSKZ) Tax on sales/purchases code
		 * @prop {string} TAXJURCODE (TXJCD)
		 * @prop {string} COSTCENTER (KOSTL)
		 * @prop {string} PROFIT_CTR (PRCTR)
		 * @prop {string} ORDERID (AUFNR)
		 * @prop {string} ZTERM (ZTERM) Terms of payment key
		 * @prop {string} BUS_AREA (GSBER) Business Area
		 * @prop {string} NO_OFFSET "X" for the item to be used as the offset item
		 * @prop {string} SPECIAL_GL_INDICATOR (NEWUM) Special G/L indicator
		 * @prop {string} DUE_ON (ZFBDT) Baseline date for due date calculation (the date from which payment terms are calculated)
		 * @prop {string} BANK_HOUSE (HBKID) House Bank short key
		 * @prop {string} BANK_ACC_ID (HKTID) House Bank ID for account details
		 */

		/**
		 * @method Lib.CA.Customization.SAP.UpdateBapiItem
		 * @description
		 * Allows for overriding parameters in an item for the BAPI ITEM sent to SAP
		 * This user exit is called after the code has initially set the values in this item object before it is added into the BAPI ITEM
		 * @param {Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_I} item Initial item object set up by the baseline code
		 * @param {Lib.CA.Customization.SAP.AllocationItem} allocationItem Field parameters retrieved from the current allocation table item
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @returns {Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_I} Object containing the updated item for the BAPI JSON posted to SAP
		 * @example This example will set the VALUE_DATE field for invoices to the Invoice Date
		 * UpdateBapiItem: function(item, allocationItem, paymentAccessor)
		 * {
		 *	if (allocationItem.type === "INVOICE")
		 *	{
		 *		item.VALUE_DATE = allocationItem.item.GetValue("Col_invoice_date__");
		 *	}
		 *	return item;
		 * }
		 * @example This example will set the ITEM_TEXT field to the descriptions on G/L or Customer adjustments
		 * UpdateBapiItem: function(item, allocationItem, paymentAccessor)
		 * {
		 *	if (allocationItem.type === "GL")
		 *	{
		 *		var glDescription = allocationItem.item.GetValue("Col_account_description__");
		 *		if (!glDescription || glDescription == "false")
		 *		{
		 *			// If this is a discount on an invoice line, then set the text to specify the invoice
		 *			var invoiceNumber = allocationItem.item.GetValue("Col_invoice_number__");
		 *			glDescription = invoiceNumber && invoiceNumber != "false" ? "Discount on " + invoiceNumber : "";
		 *		}
		 *		item.ITEM_TEXT = glDescription;
		 *	}
		 *	else if (allocationItem.type === "CUSTOMER")
		 *	{
		 *		item.ITEM_TEXT = allocationItem.item.GetValue("Account_description__");
		 *	}
		 *	return item;
		 * }
		 */
		/*UpdateBapiItem: function(item, allocationItem, paymentAccessor)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.SAP.UpdateBapiItemOffset
		 * @description
		 * Allows for overriding parameters in the offset item for the BAPI ITEM sent to SAP
		 * This user exit is called after the code has initially set the values for the offset item object before it is added into the BAPI ITEM
		 * @param {Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_I} item Initial item object set up by the baseline code
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @returns {Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_I} Object containing the updated offset item for the BAPI JSON posted to SAP
		 * @example This example will set the ACCOUNT field for offsets to the hard-coded G/L account
		 * UpdateBapiItemOffset: function(item, paymentAccessor)
		 * {
		 *	item.ACCOUNT = "0000116509";
		 *	return item;
		 * }
		 */
		/*UpdateBapiItemOffset: function(item, paymentAccessor)
		{
		},*/

		/**
		 * Definition of the BAPIACAR09 SAP BAPI table
		 * @interface Lib.CA.Customization.SAP.BAPIACAR09
		 * @prop {string} ITEMNO_ACC
		 * @prop {string} CUSTOMER
		 * @prop {string} GL_ACCOUNT
		 * @prop {string} REF_KEY_1
		 * @prop {string} REF_KEY_2
		 * @prop {string} REF_KEY_3
		 * @prop {string} COMP_CODE
		 * @prop {string} BUS_AREA
		 * @prop {string} PMNTTRMS
		 * @prop {string} BLINE_DATE
		 * @prop {number} DSCT_DAYS1
		 * @prop {number} DSCT_DAYS2
		 * @prop {number} NETTERMS
		 * @prop {number} DSCT_PCT1
		 * @prop {number} DSCT_PCT2
		 * @prop {string} PYMT_METH
		 * @prop {string} PMTMTHSUPL
		 * @prop {string} PAYMT_REF
		 * @prop {string} DUNN_KEY
		 * @prop {string} DUNN_BLOCK
		 * @prop {string} PMNT_BLOCK
		 * @prop {string} VAT_REG_NO
		 * @prop {string} ALLOC_NMBR
		 * @prop {string} ITEM_TEXT
		 * @prop {string} PARTNER_BK
		 * @prop {string} SCBANK_IND
		 * @prop {string} BUSINESSPLACE
		 * @prop {string} SECTIONCODE
		 * @prop {string} BRANCH
		 * @prop {string} PYMT_CUR
		 * @prop {string} PYMT_CUR_ISO
		 * @prop {number} PYMT_AMT
		 * @prop {string} C_CTR_AREA
		 * @prop {string} BANK_ID
		 * @prop {string} SUPCOUNTRY
		 * @prop {number} SUPCOUNTRY_ISO
		 * @prop {string} TAX_CODE
		 * @prop {string} TAXJURCODE
		 * @prop {string} TAX_DATE
		 * @prop {string} SP_GL_IND
		 * @prop {string} PARTNER_GUID
		 * @prop {string} ALT_PAYEE
		 * @prop {string} ALT_PAYEE_BANK
		 * @prop {string} DUNN_AREA
		 * @prop {string} CASE_GUID
		 * @prop {string} PROFIT_CTR
		 * @prop {string} FUND
		 * @prop {string} GRANT_NBR
		 * @prop {string} MEASURE
		 * @prop {string} HOUSEBANKACCTID
		 * @prop {string} RES_DOC
		 * @prop {string} RES_ITEM
		 * @prop {string} FUND_LONG
		 * @prop {string} DISPUTE_IF_TYPE
		 * @prop {string} BUDGET_PERIOD
		 * @prop {string} PAYS_PROV
		 * @prop {string} PAYS_TRAN
		 */

		/**
		 * @method Lib.CA.Customization.SAP.UpdateBapiAccountReceivable
		 * @description
		 * Allows for overriding parameters in an item for the BAPI ACCOUNTRECEIVABLE table sent to SAP
		 * This user exit is called after the code has initially set the values in this item object before it is added into the BAPI ACCOUNTRECEIVABLE
		 * @param {Lib.CA.Customization.SAP.BAPIACAR09} item Initial item object set up by the baseline code
		 * @param {Lib.CA.Customization.SAP.AllocationItem} allocationItem Field parameters retrieved from the current allocation table item
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @returns {Lib.CA.Customization.SAP.BAPIACAR09} Object containing the updated item for the BAPI JSON posted to SAP
		 * @example This example will add ITEM_TEXT to the ACCOUNTRECEIVABLE item from the customer adjustment description
		 * UpdateBapiAccountReceivable: function(item, allocationItem, paymentAccessor)
		 * {
		 *	if (allocationItem.type === "CUSTOMER")
		 *	{
		 *		item.ITEM_TEXT = allocationItem.item.GetValue("Account_description__");
		 *	}
		 *	return item;
		 * }
		 */
		/*UpdateBapiAccountReceivable: function(item, allocationItem, paymentAccessor)
		{
		},*/

		/**
		 * Definition of the BAPIACGL09 SAP BAPI table
		 * @interface Lib.CA.Customization.SAP.BAPIACGL09
		 * @prop {string} ITEMNO_ACC
		 * @prop {string} GL_ACCOUNT
		 * @prop {string} ITEM_TEXT
		 * @prop {string} STAT_CON
		 * @prop {string} LOG_PROC
		 * @prop {string} AC_DOC_NO
		 * @prop {string} REF_KEY_1
		 * @prop {string} REF_KEY_2
		 * @prop {string} REF_KEY_3
		 * @prop {string} ACCT_KEY
		 * @prop {string} ACCT_TYPE
		 * @prop {string} DOC_TYPE
		 * @prop {string} COMP_CODE
		 * @prop {string} BUS_AREA
		 * @prop {string} FUNC_AREA
		 * @prop {string} PLANT
		 * @prop {string} FIS_PERIOD
		 * @prop {string} FISC_YEAR
		 * @prop {string} PSTNG_DATE
		 * @prop {string} VALUE_DATE
		 * @prop {string} FM_AREA
		 * @prop {string} CUSTOMER
		 * @prop {SAPBoolean} CSHDIS_IND
		 * @prop {string} VENDOR_NO
		 * @prop {string} ALLOC_NMBR
		 * @prop {string} TAX_CODE
		 * @prop {string} TAXJURCODE
		 * @prop {string} EXT_OBJECT_ID
		 * @prop {string} BUS_SCENARIO
		 * @prop {string} COSTOBJECT
		 * @prop {string} COSTCENTER
		 * @prop {string} ACTTYPE
		 * @prop {string} PROFIT_CTR
		 * @prop {string} PART_PRCTR
		 * @prop {string} NETWORK
		 * @prop {string} WBS_ELEMENT
		 * @prop {string} ORDERID
		 * @prop {string} ORDER_ITNO
		 * @prop {string} ROUTING_NO
		 * @prop {string} ACTIVITY
		 * @prop {string} COND_TYPE
		 * @prop {string} COND_COUNT
		 * @prop {string} COND_ST_NO
		 * @prop {string} FUND
		 * @prop {string} FUNDS_CTR
		 * @prop {string} CMMT_ITEM
		 * @prop {string} CO_BUSPROC
		 * @prop {string} ASSET_NO
		 * @prop {string} SUB_NUMBER
		 * @prop {string} BILL_TYPE
		 * @prop {string} SALES_ORD
		 * @prop {string} S_ORD_ITEM
		 * @prop {string} DISTR_CHAN
		 * @prop {string} DIVISION
		 * @prop {string} SALESORG
		 * @prop {string} SALES_GRP
		 * @prop {string} SALES_OFF
		 * @prop {string} SOLD_TO
		 * @prop {string} DE_CRE_IND
		 * @prop {string} P_EL_PRCTR
		 * @prop {SAPBoolean} XMFRW
		 * @prop {number} QUANTITY
		 * @prop {string} BASE_UOM
		 * @prop {string} BASE_UOM_ISO
		 * @prop {number} INV_QTY
		 * @prop {number} INV_QTY_SU
		 * @prop {string} SALES_UNIT
		 * @prop {string} SALES_UNIT_ISO
		 * @prop {number} PO_PR_QNT
		 * @prop {string} PO_PR_UOM
		 * @prop {string} PO_PR_UOM_ISO
		 * @prop {number} ENTRY_QNT
		 * @prop {string} ENTRY_UOM
		 * @prop {string} ENTRY_UOM_ISO
		 * @prop {number} VOLUME
		 * @prop {string} VOLUMEUNIT
		 * @prop {string} VOLUMEUNIT_ISO
		 * @prop {number} GROSS_WT
		 * @prop {number} NET_WEIGHT
		 * @prop {string} UNIT_OF_WT
		 * @prop {string} UNIT_OF_WT_ISO
		 * @prop {string} ITEM_CAT
		 * @prop {string} MATERIAL
		 * @prop {string} MATL_TYPE
		 * @prop {string} MVT_IND
		 * @prop {SAPBoolean} REVAL_IND
		 * @prop {string} ORIG_GROUP
		 * @prop {string} ORIG_MAT
		 * @prop {string} SERIAL_NO
		 * @prop {string} PART_ACCT
		 * @prop {string} TR_PART_BA
		 * @prop {string} TRADE_ID
		 * @prop {string} VAL_AREA
		 * @prop {string} VAL_TYPE
		 * @prop {string} ASVAL_DATE
		 * @prop {string} PO_NUMBER
		 * @prop {string} PO_ITEM
		 * @prop {string} ITM_NUMBER
		 * @prop {string} COND_CATEGORY
		 * @prop {string} FUNC_AREA_LONG
		 * @prop {string} CMMT_ITEM_LONG
		 * @prop {string} GRANT_NBR
		 * @prop {string} CS_TRANS_T
		 * @prop {string} MEASURE
		 * @prop {string} SEGMENT
		 * @prop {string} PARTNER_SEGMENT
		 * @prop {string} RES_DOC
		 * @prop {string} RES_ITEM
		 * @prop {string} BILLING_PERIOD_START_DATE
		 * @prop {string} BILLING_PERIOD_END_DATE
		 * @prop {SAPBoolean} PPA_EX_IND
		 * @prop {SAPBoolean} FASTPAY
		 * @prop {string} PARTNER_GRANT_NBR
		 * @prop {string} BUDGET_PERIOD
		 * @prop {string} PARTNER_BUDGET_PERIOD
		 * @prop {string} PARTNER_FUND
		 * @prop {string} ITEMNO_TAX
		 */

		/**
		 * @method Lib.CA.Customization.SAP.UpdateBapiAccountGL
		 * @description
		 * Allows for overriding parameters in an item for the BAPI ACCOUNTGL table sent to SAP
		 * This user exit is called after the code has initially set the values in this item object before it is added into the BAPI ACCOUNTGL
		 * @param {Lib.CA.Customization.SAP.BAPIACGL09} item Initial item object set up by the baseline code
		 * @param {Lib.CA.Customization.SAP.AllocationItem} allocationItem Field parameters retrieved from the current allocation table item
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @param {"payment" | "adjustment"} subType to help determine the context
		 * @returns {Lib.CA.Customization.SAP.BAPIACGL09} Object containing the updated item for the BAPI JSON posted to SAP
		 * @example This example will add ITEM_TEXT to the ACCOUNTGL item from the adjustment description
		 * UpdateBapiAccountGL: function(item, allocationItem, paymentAccessor, subType)
		 * {
		 *	if (allocationItem.type === "CUSTOMER")
		 *	{
		 *		item.ITEM_TEXT = allocationItem.item.GetValue("Account_description__");
		 *	}
		 *	else if (allocationItem.type === "GL")
		 *	{
		 *		item.ITEM_TEXT = allocationItem.item.GetValue("Col_account_description__");
		 *	}
		 *	return item;
		 * }
		 */
		/*UpdateBapiAccountGL: function(item, allocationItem, paymentAccessor, subType)
		{
		},*/

		/**
		 * Definition of the ZESKER_T_CSH_PAY_R SAP BAPI table
		 * @interface Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_R
		 * @prop {number} ITEMNO
		 * @prop {string} ITEMNO_ACC
		 * @prop {string} COMP_CODE (AGBUK) Company Code for intercompany postings
		 * @prop {string} REFERENCE (XBLNR or BELNR) Number for finding the invoice
		 * @prop {string} REF_TYPE Can be set to "REFERENCE" (default) or "DOCUMENT NUMBER"
		 * @prop {string} ACCOUNT (AGKON) Customer account ID
		 * @prop {string} ACCOUNT_TYPE (AGKOA) "D" = Customer, "K" = vendor, "G" = GL
		 * @prop {string} OPEN_ITEM (XNOPS) "X" = ON, "" = OFF: On by default in order to select only open items which are not special G/L
		 * @prop {string} SPECIAL_GL_INDICATOR (AGUMS)
		 * @prop {string} CLEAN_DISCOUNT "X" = ON, "" = OFF: On by default in order to clean up the discount returned by SAP from the invoice, since discount is handled by CA
		 */

		/**
		 * @method Lib.CA.Customization.SAP.UpdateBapiReference
		 * @description
		 * Allows for overriding parameters in a reference item for the BAPI REFERENCE sent to SAP
		 * This user exit is called after the code has initially set the values in this reference object before it is added into the BAPI REFERENCE
		 * @param {Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_R} ref Initial reference item object set up by the baseline code
		 * @param {Lib.CA.Customization.SAP.AllocationItem} allocationItem Field parameters retrieved from the current allocation table item
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @returns {Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_R} Object containing the updated reference item for the BAPI JSON posted to SAP
		 * @example This example will set the REF_TYPE field for each reference item
		 * UpdateBapiReference: function(ref, allocationItem, paymentAccessor)
		 * {
		 *	ref.REF_TYPE = "DOCUMENT NUMBER";
		 *	return ref;
		 * }
		 */
		/*UpdateBapiReference: function(ref, allocationItem, paymentAccessor)
		{
		},*/

		/**
		 * Definition of the ZESKER_T_CSH_PAY_C SAP BAPI table
		 * @interface Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_C
		 * @prop {number} ITEMNO
		 * @prop {string} ITEMNO_ACC
		 * @prop {number} AMT_DOCCUR Amount in the document currency
		 * @prop {number} AMT_LOCCUR Amount in the local currency
		 * @prop {string} BSCHL_CURRENT (NEWBS) Posting Key for position (SAP will fill a default if empty)
		 * @prop {string} BSCHL_OFFSET (NEWBS) Posting Key for offset position (SAP will fill a default if empty)
		 */

		/**
		 * Definition of the BAPIACCR09 SAP BAPI table
		 * @interface Lib.CA.Customization.SAP.BAPIACCR09
		 * @prop {string} ITEMNO_ACC
		 * @prop {string} CURR_TYPE
		 * @prop {string} CURRENCY
		 * @prop {string} CURRENCY_ISO
		 * @prop {number} AMT_DOCCUR
		 * @prop {number} EXCH_RATE
		 * @prop {number} EXCH_RATE_V
		 * @prop {number} AMT_BASE
		 * @prop {number} DISC_BASE
		 * @prop {number} DISC_AMT
		 * @prop {number} TAX_AMT
		 */

		/**
		 * @method Lib.CA.Customization.SAP.UpdateBapiCurrency
		 * @description
		 * Allows for overriding parameters in a currency item for the BAPI CURRENCY sent to SAP
		 * This user exit is called after the code has initially set the values in this currency object before it is added into the BAPI CURRENCY
		 * @param {Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_C | Lib.CA.Customization.SAP.BAPIACCR09} currency Initial currency item object set up by the baseline code
		 * @param {Lib.CA.Customization.SAP.AllocationItem} allocationItem Field parameters retrieved from the current allocation table item
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @returns {Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_C | Lib.CA.Customization.SAP.BAPIACCR09} Object containing the updated currency item for the BAPI JSON posted to SAP
		 * @example This example will calculate and set the AMT_LOCCUR and EXCH_RATE field if an exchange rate is available
		 * UpdateBapiCurrency: function(currency, allocationItem, paymentAccessor)
		 * {
		 *	var localExchangeRate = paymentAccessor.GetValue("Local_Submit_ExchangeRate__");
		 *	if (localExchangeRate && localExchangeRate != 1)
		 *	{
		 *		currency.AMT_LOCCUR = Number(currency.AMT_DOCCUR) * Number(localExchangeRate);
		 *		currency.EXCH_RATE = localExchangeRate;
		 *	}
		 *	return currency;
		 * }
		 * @example This example will set the posting keys based on the item type
		 * UpdateBapiCurrency: function(currency, allocationItem, paymentAccessor)
		 * {
		 *	if (allocationItem.type === "GL")
		 *	{
		 *		currency.BSCHL_CURRENT = Number(currency.AMT_DOCCUR) < 0 ? "40" : "50";
		 *		currency.BSCHL_OFFSET = Number(currency.AMT_DOCCUR) < 0 ? "50" : "40";
		 *	}
		 *	else
		 *	{
		 *		// Set for customer items (invoice or customer adjustments)
		 *		currency.BSCHL_CURRENT = Number(currency.AMT_DOCCUR) < 0 ? "08" : "18";
		 *		currency.BSCHL_OFFSET = Number(currency.AMT_DOCCUR) < 0 ? "50" : "40";
		 *	}
		 *	return currency;
		 * }
		 */
		/*UpdateBapiCurrency: function(currency, allocationItem, paymentAccessor)
		{
		},*/

		/**
		 * Definition of the ZESKER_T_CSH_PAY_E SAP BAPI table.
		 * Using this requires a separate custom extension tranport to be installed in SAP.
		 * @interface Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_E
		 * @prop {number} ITEMNO
		 * @prop {string} STRUCTURE "BSEG"
		 * @prop {string} COMP_CODE Matching the company code of the associated item(s)
		 * @prop {string} VALUEPART1 "SGTXT" or "XREF3"
		 * @prop {string} VALUEPART2
		 * @prop {string} VALUEPART3
		 * @prop {string} VALUEPART4
		 */

		/**
		 * @method Lib.CA.Customization.SAP.UpdateBapiExtension
		 * @description
		 * Allows for setting the BAPI Extension table parameters for custom actions defined in SAP.
		 * This user exit is called after setting other payment items in the BAPI input table.
		 * Note 1: This is not compatible with UpdateBapiExtensionByItem when used to set an SGTXT/ZUONR entry for the same customer specified in VALUEPART2.
		 * I.e. There can only be a single entry per SGTXT or ZUONR for a particular customer when that entry has no value in VALUEPART4.
		 * Note 2: When no value is placed in VALUEPART4, this will populate the SGTXT/ZUONR for fully and partially paid invoices, but it will also override the SGTXT/ZUONR for customer adjustment items of the same customer.
		 * @param {number} itemNo BAPI header number
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @returns {Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_E[]} Array of objects containing the extensions for the BAPI JSON posted to SAP
		 * @example This example will add a text specified per customer to the SGTXT field when the customization is available in SAP.
		 * UpdateBapiExtension: function (itemNo, paymentAccessor)
		 * {
		 *	var ext = [];
		 *	var paymentDate = Sys.Helpers.Date.Format(paymentAccessor.GetValue("Payment_date__"), "mm/dd/yyyy");
		 *	var paymentMethod = paymentAccessor.GetValue("Payment_method__");
		 *	var paymentMethodsMapping = {
		 *		"CREDIT": "Credit",
		 *		"ACH_CREDIT": "ACH",
		 *		"ACH_SETTLEMENT": "ACH",
		 *		"ACH_DEBIT": "ACH",
		 *		"CHECK_PAID": "Check",
		 *		"Credit": "Credit",
		 *		"Miscellaneous ACH Credit": "ACH",
		 *		"ACH Settlement": "ACH",
		 *		"Miscellaneous ACH Debit": "ACH",
		 *		"Paid Check": "Check",
		 *		"Real Time Payment Credit": "ACH"
		 *	};
		 *	paymentMethod = paymentMethodsMapping[paymentMethod] || "External";
		 *	var transactionIDString = "";
		 *	if (paymentMethod && paymentMethod.toUpperCase() == "CHECK")
		 *	{
		 *		transactionIDString = paymentAccessor.GetValue("Check_number__") ? paymentAccessor.GetValue("Check_number__") : "";
		 *	}
		 *	var itemTextContent = [];
		 *	if (paymentDate)
		 *	{
		 *		itemTextContent.push(paymentDate);
		 *	}
		 *	if (paymentMethod)
		 *	{
		 *		itemTextContent.push(paymentMethod);
		 *	}
		 *	if (transactionIDString)
		 *	{
		 *		itemTextContent.push(transactionIDString);
		 *	}
		 *	var itemTextStringBase = itemTextContent.join(" ");
		 *	var customerTexts = {};
		 *	var selectedInvoices = Lib.CA.Payment.Allocate.Common.GetSelectedInvoiceItems(paymentAccessor.GetTable("Invoices_table__"));
		 *	for (var invIdx = 0; invIdx < selectedInvoices.length; invIdx++)
		 *	{
		 *		var currentInvoiceItem = selectedInvoices[invIdx];
		 *		var customer = currentInvoiceItem.GetValue("Col_customer_id__");
		 *		if (customer && !customerTexts[customer])
		 *		{
		 *			var itemTextString = itemTextStringBase + " " + customer;
		 *			customerTexts[customer] = itemTextString;
		 *		}
		 *	}
		 *	var customers = Object.keys(customerTexts);
		 *	if (customers.length > 0)
		 *	{
		 *		for (var i = 0; i < customers.length; i++)
		 *		{
		 *			ext.push(
		 *				{
		 *					ITEMNO: itemNo,
		 *					STRUCTURE: "BSEG",
		 *					VALUEPART1: "SGTXT",
		 *					VALUEPART2: customers[i],
		 *					VALUEPART3: customerTexts[customers[i]],
		 *					VALUEPART4: ""
		 *				});
		 *		}
		 *	}
		 *	return ext.length > 0 ? ext : null;
		 * },
		 * @example This example will add a text specified per customer to the Assignment/ZUONR field when the customization is available in SAP.
		 * The text will include the first and part of the last invoice number found per customer.
		 * UpdateBapiExtension: function (itemNo, paymentAccessor)
		 * {
		 *	var ext = [];
		 *	var customerInvoices = {};
		 *	var selectedInvoices = Lib.CA.Payment.Allocate.Common.GetSelectedInvoiceItems(paymentAccessor.GetTable("Invoices_table__"));
		 *	for (var invIdx = 0; invIdx < selectedInvoices.length; invIdx++)
		 *	{
		 *		var currentInvoiceItem = selectedInvoices[invIdx];
		 *		var customer = currentInvoiceItem.GetValue("Col_customer_id__");
		 *		if (customer && !customerInvoices[customer])
		 *		{
		 *			customerInvoices[customer] = [];
		 *		}
		 *		customerInvoices[customer].push(currentInvoiceItem.GetValue("Col_invoice_number__"));
		 *	}
		 *	var customers = Object.keys(customerInvoices);
		 *	if (customers.length > 0)
		 *	{
		 *		for (var i = 0; i < customers.length; i++)
		 *		{
		 *			var selectedInvoicesNumber = customerInvoices[customers[i]];
		 *			var textSelectedInvoices = "";
		 *			if (selectedInvoicesNumber.length === 1)
		 *			{
		 *				// 10 digits
		 *				textSelectedInvoices = Sys.Helpers.String.SAP.NormalizeID(selectedInvoicesNumber[0], 10);
		 *			}
		 *			else if (selectedInvoicesNumber.length === 2)
		 *			{
		 *				// first invoice + "/" + last 5 digits of second invoice
		 *				textSelectedInvoices = Sys.Helpers.String.SAP.NormalizeID(selectedInvoicesNumber[0], 10) +
		 *					"/" + selectedInvoicesNumber[1].slice(-5);
		 *			}
		 *			else if (selectedInvoicesNumber.length >= 3)
		 *			{
		 *				// first invoice + "/.../" + last 3 digits of last invoice
		 *				textSelectedInvoices = Sys.Helpers.String.SAP.NormalizeID(selectedInvoicesNumber[0], 10) +
		 *					"/.../" + selectedInvoicesNumber[selectedInvoicesNumber.length - 1].slice(-3);
		 *			}
		 *			if (textSelectedInvoices)
		 *			{
		 *				ext.push(
		 *					{
		 *						ITEMNO: itemNo,
		 *						STRUCTURE: "BSEG",
		 *						VALUEPART1: "ZUONR",
		 *						VALUEPART2: customers[i], // Customer ID for the customer items to update
		 *						VALUEPART3: textSelectedInvoices, // Text to write to ZUONR for the invoices of the specified customer
		 *						VALUEPART4: ""
		 *					});
		 *			}
		 *		}
		 *	}
		 *	return ext.length > 0 ? ext : null;
		 * },
		 */
		/*UpdateBapiExtension: function(itemNo, paymentAccessor)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.SAP.UpdateBapiExtensionByItem
		 * @description
		 * Allows for setting the BAPI Extension table parameters per individual item for custom actions defined in SAP.
		 * This user exit is called after Lib.CA.Customization.SAP.UpdateBapiItem for the provided item of the BAPI input table.
		 * @param {Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_I} item Current item object for which to add extension parameters
		 * @param {Lib.CA.Customization.SAP.AllocationItem} allocationItem Field parameters retrieved from the current allocation table item
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @returns {Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_E[]} Array of objects containing the extensions for the BAPI JSON posted to SAP
		 * @example This example will add the customer ID set on G/L adjustments to the XREF3 field when the customization is available in SAP
		 * UpdateBapiExtensionByItem: function(item, allocationItem, paymentAccessor)
		 * {
		 *	var ext = [];
		 *	if (allocationItem.type === "GL")
		 *	{
		 *		// Fill XREF3 field on G/L lines with customer IDs set for G/L adjustments
		 *		// Check first for Customer ID from G/L adjustment table, and then check for Customer ID from invoice table (in the case of a discount)
		 *		var customer = allocationItem.item.GetValue("Col_Customer_Info__"); // G/L adjustment
		 *		if (!customer || customer == "false")
		 *		{
		 *			customer = allocationItem.item.GetValue("Col_customer_id__"); // Invoice/discount
		 *			customer = customer == "false" ? "" : customer;
		 *		}
		 *		if (customer)
		 *		{
		 *			var extXref3 =
		 *			{
		 *				ITEMNO: item.ITEMNO,
		 *				STRUCTURE: "BSEG",
		 *				VALUEPART1: "XREF3",
		 *				VALUEPART2: item.ACCOUNT, // GL account number for the item to update
		 *				VALUEPART3: customer, // Text to write to the XREF3 field for the specified item
		 *				VALUEPART4: item.ITEMNO_ACC // References the position number in the ITEMS table for the item to update
		 *			};
		 *			ext.push(extXref3);
		 *		}
		 *	}
		 *	return ext.length > 0 ? ext : null;
		 * }
		 * @example This example will add the partially paid invoice number to the SGTXT field when the customization is available in SAP
		 * UpdateBapiExtensionByItem: function(item, allocationItem, paymentAccessor)
		 * {
		 *	var ext = [];
		 *	if (allocationItem.type === "INVOICE")
		 *	{
		 *		// Fill SGTXT field with the invoice number when it's partially paid
		 *		var isPartial = false;
		 *		var remainingAmount = Number(allocationItem.item.GetValue("Col_remaining_amount__"));
		 *		if (Math.abs(remainingAmount) > 0.001)
		 *		{
		 *			isPartial = true;
		 *		}
		 *		else
		 *		{
		 *			// Remaining amount is 0 - also check that the allocated amount is the full original invoice amount
		 *			var invoiceTotalAmount = Lib.CA.QueryHelper.Common.GetInvoiceTotalAmount(allocationItem.item.GetValue("Col_ruidex__"));
		 *			var allocatedAmount = Number(allocationItem.item.GetValue("Col_allocated_amount__"));
		 *			if (Math.abs(invoiceTotalAmount - allocatedAmount) > 0.001)
		 *			{
		 *				isPartial = true;
		 *			}
		 *		}
		 *		if (isPartial)
		 *		{
		 *			var extSgtxt =
		 *			{
		 *				ITEMNO: item.ITEMNO,
		 *				STRUCTURE: "BSEG",
		 *				VALUEPART1: "SGTXT",
		 *				VALUEPART2: allocationItem.customer, // Customer ID for the invoice item to update
		 *				VALUEPART3: "Prtly Paid Inv " + allocationItem.invoiceNumber, // Text to write to SGTXT for the specified item
		 *				VALUEPART4: allocationItem.invoiceNumber // Invoice number/identifier used to find which item to update, based on the REF_TYPE (if blank, applies to all the customer positions)
		 *			};
		 *			ext.push(extSgtxt);
		 *		}
		 *	}
		 *	return ext.length > 0 ? ext : null;
		 * }
		 * @example This example will add the partially paid invoice number to the ZUONR field when the customization is available in SAP
		 * UpdateBapiExtensionByItem: function(item, allocationItem, paymentAccessor)
		 * {
		 *	var ext = [];
		 *	if (allocationItem.type === "INVOICE")
		 *	{
		 *		// Fill ZUONR field with the invoice number when it's partially paid
		 *		var isPartial = false;
		 *		var remainingAmount = Number(allocationItem.item.GetValue("Col_remaining_amount__"));
		 *		if (Math.abs(remainingAmount) > 0.001)
		 *		{
		 *			isPartial = true;
		 *		}
		 *		else
		 *		{
		 *			// Remaining amount is 0 - also check that the allocated amount is the full original invoice amount
		 *			var invoiceTotalAmount = Lib.CA.QueryHelper.Common.GetInvoiceTotalAmount(allocationItem.item.GetValue("Col_ruidex__"));
		 *			var allocatedAmount = Number(allocationItem.item.GetValue("Col_allocated_amount__"));
		 *			if (Math.abs(invoiceTotalAmount - allocatedAmount) > 0.001)
		 *			{
		 *				isPartial = true;
		 *			}
		 *		}
		 *		if (isPartial)
		 *		{
		 *			var extZuonr =
		 *			{
		 *				ITEMNO: item.ITEMNO,
		 *				STRUCTURE: "BSEG",
		 *				VALUEPART1: "ZUONR",
		 *				VALUEPART2: allocationItem.customer, // Customer ID for the invoice item to update
		 *				VALUEPART3: "Prtly Paid Inv " + allocationItem.invoiceNumber, // Text to write to ZUONR for the specified item
		 *				VALUEPART4: allocationItem.invoiceNumber // Invoice number/identifier used to find which item to update, based on the REF_TYPE (if blank, applies to all the customer positions)
		 *			};
		 *			ext.push(extZuonr);
		 *		}
		 *	}
		 *	return ext.length > 0 ? ext : null;
		 * }
		 */
		/*UpdateBapiExtensionByItem: function(item, allocationItem, paymentAccessor)
		{
		},*/

		/**
		 * Defines the structure for the input/output JSON sent to and/or received from a BAPI.
		 * @interface Lib.CA.Customization.SAP.BapiParameters
		 * @prop {Lib.CA.Customization.SAP.Exports} EXPORTS
		 * @prop {Lib.CA.Customization.SAP.Imports} IMPORTS
		 * @prop {Lib.CA.Customization.SAP.Tables} TABLES
		 * @prop {Lib.CA.Customization.SAP.Tables} CHANGINGS
		 */

		/**
		 * This class houses the structure of the Exports table used for input to the BAPI connection and posting to SAP.
		 * @interface Lib.CA.Customization.SAP.Exports
		 * @prop {Lib.CA.Customization.SAP.BAPIACHE09} DOCUMENTHEADER
		 * @prop {"S" | "P" | "R"} E_TYPE_PAYMENT Table item for the payment type. One of "S" for standard (default), "P" for partial, or "R" for residual
		 * @prop {"" | "X"} E_NO_LINES_OFFSET Specifies how to include offset lines. One of "" for multiple offset lines (default) or "X" for a single offset line
		 */

		/**
		 * This class houses the structure of the Imports table used for output from the BAPI connection and posting to SAP.
		 * This is used for the BAPI_ACC_DOCUMENT_POST BAPI.
		 * @interface Lib.CA.Customization.SAP.Imports
		 * @prop {Lib.CA.Customization.SAP.BAPIACHE09.OBJ_TYPE} OBJ_TYPE
		 * @prop {Lib.CA.Customization.SAP.BAPIACHE09.OBJ_KEY} OBJ_KEY
		 * @prop {Lib.CA.Customization.SAP.BAPIACHE09.OBJ_SYS} OBJ_SYS
		 */

		/**
		 * This class houses the structure of the Tables table used for input to the BAPI connection and posting to SAP.
		 * This is used for the BAPI_ACC_DOCUMENT_POST BAPI.
		 * @interface Lib.CA.Customization.SAP.Tables
		 * @prop {Lib.CA.Customization.SAP.BAPIACGL09[]} ACCOUNTGL Account G/L table contains information for G/L adjustments
		 * @prop {Lib.CA.Customization.SAP.BAPIACAR09[]} ACCOUNTRECEIVABLE Account Receivable table contains adjustment information for the allocation
		 * @prop {Lib.CA.Customization.SAP.BAPIACCR09[]} CURRENCYAMOUNT Currency Amount table contains all the amounts for each line item of each payment or payments
		 * @prop {Lib.CA.Customization.SAP.BAPIRET2[]} RETURN Return table contains the info returned from SAP - e.g. created Document IDs and error/warning/success messages
		 */

		/**
		 * This class houses the structure of the JSON object used for input/output from the BAPI connection and posting to SAP.
		 * This is used for the Z_CASH_APP_PAYMENT_PROCESS BAPI.
		 * @interface Lib.CA.Customization.SAP.Changings
		 * @prop {Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_H[]} DOCUMENT_HEADER Document Header table contains all the header of the documents to be posted.
		 * @prop {Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_R[]} REFERENCE Reference table contains all the invoices linked to each payment or payments
		 * @prop {Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_I[]} ITEMS Items table contains all the customer / G/L offset information to be used on the payment or payments
		 * @prop {Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_E[]} EXTENSION Extension table contains information and data to input into custom extension items added to the SAP code
		 * @prop {Lib.CA.Customization.SAP.ZESKER_T_CSH_PAY_C[]} CURRENCYAMOUNT Currency Amount table contains all the amounts for each line item of each payment or payments
		 * @prop {Lib.CA.Customization.SAP.BAPIRET2[]} RETURN Return table contains the info returned from SAP - e.g. created Document IDs and error/warning/success messages
		 */

		/**
		 * @method Lib.CA.Customization.SAP.UpdateBapiExports
		 * @description
		 * Allows for overriding the BAPI EXPORTS sent to SAP
		 * This user exit is called after the code has finished setting up all other items in the BAPI input table, before it is finalized and sent to SAP
		 * @param {Lib.CA.Customization.SAP.Exports} exports Initial Exports table set up by the baseline code
		 * @param {boolean} hasPartiallyPaidInvoice True if an invoice was found that is partially paid
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @returns {Lib.CA.Customization.SAP.Exports} Updated Exports table for the BAPI JSON posted to SAP
		 * @example This example will set the payment type for Partial payments.
		 * UpdateBapiExports: function(exports, hasPartiallyPaidInvoice, paymentAccessor)
		 * {
		 *	if (hasPartiallyPaidInvoice)
		 *	{
		 *		exports.E_TYPE_PAYMENT = "P";
		 *	}
		 *	else
		 *	{
		 *		exports.E_TYPE_PAYMENT = "S";
		 *	}
		 *	return exports;
		 * }
		 * @example This example will specify to only have one offset line with the net amount in the SAP document.
		 * UpdateBapiExports: function(exports, hasPartiallyPaidInvoice)
		 * {
		 *	exports.E_NO_LINES_OFFSET = "X";
		 *	return exports;
		 * }
		 */
		/*UpdateBapiExports: function(exports, hasPartiallyPaidInvoice, paymentAccessor)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.SAP.FinalizeBapiInputParameters
		 * @description
		 * Allows for finalizing the BAPI parameters that will be sent to SAP for posting the payment
		 * This user exit is called just before the JSON is stringified from the input parameters and sent to SAP
		 * @param {Lib.CA.Customization.SAP.BapiParameters} bapiParams Initial populated data structure for posting to SAP
		 * @param {string} bapiName Name of the BAPI that will perform the post - one of "Z_CASH_APP_PAYMENT_PROCESS" (when an invoice is included) or "BAPI_ACC_DOCUMENT_POST"
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @returns {Lib.CA.Customization.SAP.BapiParameters} Updated data structure for the BAPI JSON posted to SAP
		 * @example This example will add a custom field name to the extension table for BAPI_ACC_DOCUMENT_POST
		 * FinalizeBapiInputParameters: function(bapiParams, bapiName, paymentAccessor)
		 * {
		 *	if (bapiName == "BAPI_ACC_DOCUMENT_POST")
		 *	{
		 *		bapiParams.TABLES.EXTENSION1 = [];
		 *		bapiParams.TABLES.EXTENSION1.push({
		 *			FIELD1: "Z_OLD_PROCESS_REV_RECO",
		 *			FIELD2: "",
		 *			FIELD3: "",
		 *			FIELD4: ""
		 *		});
		 *	}
		 * }
		 */
		/*FinalizeBapiInputParameters: function(bapiParams, bapiName, paymentAccessor)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.SAP.CustomizeRestJson
		 * @description
		 * Allows for customizing the REST JSON.
		 * This user exit is called prior to converting the REST JSON to a string to use with SAP web services integration.
		 * @param {string} method The SAP method (e.g., "Z_CASH_APP_PAYMENT_PROCESS")
		 * @param {Object} restJson The current REST JSON
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @returns {string} The customized REST JSON
		 * @example This example will insert a custom field in the header of the REST JSON for the Z_CASH_APP_PAYMENT_PROCESS
		 * CustomizeRestJson: function (method, restJson, paymentAccessor)
		 * {
		 *	var customJson = restJson;
		 *	if (method === "Z_CASH_APP_PAYMENT_PROCESS")
		 *	{
		 *		// Insert a new field in the document header
		 *		customJson.CHANGINGS.DOCUMENT_HEADER[0].Z_CustomField = "Custom field data";
		 *	}
		 *	return customJson;
		 * }
		 */
		/*CustomizeRestJson: function(method, restJson, paymentAccessor)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.SAP.CustomizeSOAPEnvelope
		 * @description
		 * Allows for customizing the SOAP envelope or replacing it with something else altogether (e.g., JSON to use with REST).
		 * This user exit is called prior to returning the stringified version of the SOAP envelope to use with SAP web services integration.
		 * @param {string} method The SOAP method (e.g., "urn:Z_CASH_APP_PAYMENT_PROCESS")
		 * @param {string} soapString The current SOAP envelope
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @returns {string} The customized SOAP envelope
		 * @example This example will insert a custom node at the end of the SOAP envelope for the Z_CASH_APP_PAYMENT_PROCESS
		 * CustomizeSOAPEnvelope: function (method, soapString, paymentAccessor)
		 * {
		 *	var soapXml = soapString;
		 *	if (method.indexOf("Z_CASH_APP_PAYMENT_PROCESS") !== -1)
		 *	{
		 *		// Insert a new node at the end of the SOAP envelope
		 *		var index = soapXml.search(/<\/urn:Z_CASH_APP_PAYMENT_PROCESS/i);
		 *		soapXml = soapXml.substring(0, index) + "&lt;Z_CustomField&gt;Custom field data&lt;/Z_CustomField&gt;" + soapXml.substring(index);
		 *	}
		 *	return soapXml;
		 * }
		 */
		/*CustomizeSOAPEnvelope: function(method, soapString, paymentAccessor)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.SAP.OnSapWebServiceCallBegin
		 * @description
		 * Allows for customizing the web service parameters.
		 * This function is called prior to calling an SAP web service.
		 * @see {@link https://webdoc/eskerondemand/cv_ly/en/manager/startpage.htm#ProcessingScripts/HttpRequest/Call.html ProcessingScripts/HttpRequest/Call.html}
		 * @param {HttpRequestParam} params The standard web service parameters
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @example
		 * OnSapWebServiceCallBegin: function (params, paymentAccessor)
		 * {
		 *		// Customize the timeout
		 *		var timeout = 90000;
		 *		params.sendTimeout = timeout;
		 *		params.receivedTimeout = timeout;
		 * }
		 */
		/*OnSapWebServiceCallBegin: function (params, paymentAccessor)
		{
			// !Warning: Do not log passwords or any other sensitive info
		},*/

		/**
		 * @method Lib.CA.Customization.SAP.HandleResponseMessagesAsError
		 * @description
		 * Allows for handling messages received from the SAP posting as an error on the payment form
		 * This user exit is called after the RFC post
		 * Note that if a commit is performed within the SAP BAPI code, the returned message will only be reported and cannot prevent the posting
		 * @param {Lib.CA.SAP.Messages} messages object holding error, warning, and success messages from the post
		 * @param {string} messages.success success message
		 * @param {string} messages.warning warning message
		 * @param {string} messages.error error message
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @returns {string} Failure message to handle as an error
		 * @example This example will treat a warning as an error if a specific substring is found in the warning message response
		 * HandleResponseMessagesAsError: function(messages, paymentAccessor)
		 * {
		 *	if (messages.warning)
		 *	{
		 *		if (messages.warning.toLowerCase().indexOf("No open items were found"))
		 *		{
		 *			// warning message contains "No open items were found", if the items were already used
		 *			return messages.warning;
		 *		}
		 *	}
		 *	return "";
		 * }
		 */
		/*HandleResponseMessagesAsError: function(messages, paymentAccessor)
		{
		},*/

		/**
		 * Definition of the BAPIRET2 SAP BAPI table
		 * @interface Lib.CA.Customization.SAP.BAPIRET2
		 * @prop {"E" | "A" | "I" | "S" | "W"} TYPE
		 * @prop {string} ID
		 * @prop {string} NUMBER
		 * @prop {string} MESSAGE
		 * @prop {string} LOG_NO
		 * @prop {string} LOG_MSG_NO
		 * @prop {string} MESSAGE_V1
		 * @prop {string} MESSAGE_V2
		 * @prop {string} MESSAGE_V3
		 * @prop {string} MESSAGE_V4
		 * @prop {string} PARAMETER
		 * @prop {number} ROW
		 * @prop {string} FIELD
		 * @prop {string} SYSTEM
		 */

		/**
		 * @method Lib.CA.Customization.SAP.ExtractDocumentID
		 * @description
		 * Allows for customizing the way the created Document ID is extracted from the posting response
		 * This user exit is called after the RFC post but before the updates are committed
		 * @param {Lib.CA.Customization.SAP.BAPIRET2[]} bapiReturns Returned object from the posting call
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @returns {string | string[]} representing the Document ID created
		 * @example This example will parse the document ID from a success message in the form of "DOCUMENT xxxx WAS CREATED"
		 * ExtractDocumentID: function(bapiReturns, paymentAccessor)
		 * {
		 *	var documentID = "";
		 *	for (var idx = 0; idx < bapiReturns.length; idx++)
		 *	{
		 *		var returnType = bapiReturns[idx].TYPE;
		 *		if (returnType === "S")
		 *		{
		 *			var msg = bapiReturns[idx].MESSAGE;
		 *			if ((msg.toUpperCase().indexOf("DOCUMENT") > -1) && (msg.toUpperCase().indexOf("WAS CREATED") > -1))
		 *			{
		 *				documentID = bapiReturns[idx].MESSAGE_V1;
		 *			}
		 *		}
		 *	}
		 *	return documentID;
		 * }
		 * @example This example will parse multiple document IDs from a success message in the form of "DOCUMENT xxxx WAS CREATED" or "CROSS-COMPANY DOCUMENT xxxx"
		 * ExtractDocumentID: function(bapiReturns, paymentAccessor)
		 * {
		 *	var documentIDs = [];
		 *	for (var idx = 0; idx < bapiReturns.length; idx++)
		 *	{
		 *		var returnType = bapiReturns[idx].TYPE;
		 *		if (returnType === "S")
		 *		{
		 *			var msg = bapiReturns[idx].MESSAGE;
		 *			if ((msg.toUpperCase().indexOf("DOCUMENT") > -1) && (msg.toUpperCase().indexOf("WAS CREATED") > -1))
		 *			{
		 *				// MESSAGE_V1 contains the document ID and MESSAGE_V2 contains the company code
		 *				documentIDs.push(bapiReturns[idx].MESSAGE_V1 + "-" + bapiReturns[idx].MESSAGE_V2);
		 *			}
		 *			else if (msg.toUpperCase().indexOf("CROSS-COMPANY DOCUMENT") > -1)
		 *			{
		 *				// MESSAGE contains the cross-company document ID
		 *				documentIDs.push(bapiReturns[idx].MESSAGE);
		 *			}
		 *		}
		 *	}
		 *	return documentIDs;
		 * }
		 */
		/*ExtractDocumentID: function(bapiReturns, paymentAccessor)
		{
		},*/

		/**
		 * Definition of the Lib.CA.Customization.SAP.PostMode enum.
		 * @interface Lib.CA.Customization.SAP.PostMode
		 * @prop {number} InvoicesIncluded Specifies invoices are included so the Z_CASH_APP_PAYMENT_PROCESS should be used.
		 * @prop {number} AdjustmentOnly Specifies no invoices are included so the BAPI_ACC_DOCUMENT_POST should be used.
		 * @prop {number} WithholdingOnly Specifies withholding amounts are to be posted after they were validated so the Z_CASH_APP_PAYMENT_PROCESS should be used.
		 * @prop {number} WithholdingNoInvoice Specifies withholding amounts are to be posted after they were validated, but the posted document should use
		 * the customer account rather than the invoice - so the BAPI_ACC_DOCUMENT_POST should be used. This option is only possible via {@link Lib.CA.Customization.SAP.GetPostMode}.
		 */

		/**
		 * @method Lib.CA.Customization.SAP.GetPostMode
		 * @description
		 * Allows for customizing the posting mode used to post the SAP document, whether it's a known poster or a custom one.
		 * This user exit is called near the beginning of the SAP Poster run after clearing previous run's variables on the form.
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @returns {Lib.CA.Customization.SAP.PostMode | string} representing the post mode to use.
		 * Any non Lib.CA.Customization.SAP.PostMode custom values must be handled by a poster returned from {@link Lib.CA.Customization.SAP.GetCustomPoster}.
		 * @example This example will force a custom poster to be used.
		 * GetPostMode: function(paymentAccessor)
		 * {
		 *	return "CustomPosterFromUserExit";
		 * }
		 */
		/*GetPostMode: function(paymentAccessor)
		{
		},*/

		/**
		 * Definition of the Lib.CA.Customization.SAP.Poster extension.
		 * @interface Lib.CA.Customization.SAP.Poster
		 * @prop {boolean} ConnectBapi function ConnectBapi(): boolean
		 * Connects the bapi and initializes the parameters. Returns true on success
		 * @prop {void} BuildParams function BuildParams(): void
		 * Builds the parameters that will be stringified to JSON and sent to the BAPI
		 * @prop {void} ExtractResults function ExtractResults(): void
		 * Extracts the info/warnings/errors returned from SAP as well as the document ID if one was created.
		 * @prop {void} PostRfc function PostRfc(): void
		 * (Optional) Implement to performs the RFC Post by calling BAPI with the built parameters
		 * @prop {void} Finalize function Finalize(): void
		 * (Optional) Implement to finalize the posting to SAP and save created document IDs
		 * @prop {void} SaveDocumentId function SaveDocumentId(docId: string): void
		 * (Optional) Implement to set the field to track the ERP document IDs created in the posting call
		 */

		/**
		 * @method Lib.CA.Customization.SAP.GetCustomPoster
		 * @description
		 * Allows for customizing the poster used to post the SAP document when a custom post mode is returned from {@link Lib.CA.Customization.SAP.GetPostMode}.
		 * This user exit is called near the beginning of the SAP Poster run just before connecting the BAPI and building the input parameters.
		 * @param {Lib.CA.Customization.SAP.PostMode | string} postMode Specifies the post mode to use.
		 * Any non Lib.CA.Customization.SAP.PostMode values specify custom post modes returned from {@link Lib.CA.Customization.SAP.GetPostMode}
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentAccessor Interface to access payment fields whether posting from payment or from external process.
		 * Must be used to access payment fields when posting the withholding tax.
		 * @param {string} invoiceNumber - Invoice number for which withholding tax was applied
		 * @param {number} amount - Amount of the withholding tax entry
		 * @param {string} glAccount - Withholding tax GL
		 * @param {string} costCenter - Withholding tax cost center
		 * @param {string} profitCenter - Withholding tax profit center
		 * @param {string} taxCode - Withholding tax tax code
		 * @param {string} companyCode - Withholding tax company code
		 * @returns {Lib.CA.Customization.SAP.Poster} An object of a class extending/implementing the Lib.CA.Customization.SAP.Poster class.
		 * @example This example defines a custom poster representing a skeleton of the Z_CASH_APP_PAYMENT_PROCESS poster.
		 * GetCustomPoster: function (postMode, paymentAccessor, invoiceNumber, amount, glAccount, costCenter, profitCenter, taxCode, companyCode)
		 * {
		 *	if (postMode == Lib.CA.Customization.SAP.PostMode.InvoicesIncluded ||
		 *		postMode == Lib.CA.Customization.SAP.PostMode.AdjustmentOnly ||
		 *		postMode == Lib.CA.Customization.SAP.PostMode.WithholdingOnly)
		 *	{
		 *		return null;
		 *	}
		 *	// This class represents a simplified skeleton of the poster used for Z_CASH_APP_PAYMENT_PROCESS
		 *	// See Lib_CA_SAP_Allocation_Post library for detailed implementation
		 *	CustomPoster = class extends Lib.CA.Customization.SAP.Poster
		 *	{
		 *		constructor(payment)
		 *		{
		 *			super(payment);
		 *			this.CanRollbackWork = false;
		 *			this.HeaderCount = 1;
		 *		}
		 *		ConnectBapi()
		 *		{
		 *			this.BapiParams = {
		 *				EXPORTS: {
		 *					DOCUMENTHEADER: null,
		 *					E_TYPE_PAYMENT: "S",
		 *					E_NO_LINES_OFFSET: ""
		 *				},
		 *				CHANGINGS: {
		 *					DOCUMENT_HEADER: [],
		 *					REFERENCE: [],
		 *					ITEMS: [],
		 *					EXTENSION: [],
		 *					CURRENCYAMOUNT: [],
		 *					RETURN: []
		 *				}
		 *			};
		 *			return super.ConnectBapiByName("Z_CASH_APP_PAYMENT_PROCESS");
		 *		}
		 *		BuildParams()
		 *		{
		 *			// ...Logic to populate this.BapiParams goes here...
		 *			Log.Verbose("bapiParams = " + JSON.stringify(this.BapiParams));
		 *			Lib.CA.SAP.AttachBapiJsonAsFile(JSON.stringify(this.BapiParams, null, 2), false);
		 *			this.CurrentPosterParameters.BapiProcess.SetJsonParameters(JSON.stringify(this.BapiParams));
		 *		}
		 *		ExtractResults()
		 *		{
		 *			let documentID;
		 *			let paymentResponse = JSON.parse(this.CurrentPosterParameters.BapiProcess.GetJsonParameters(true));
		 *			let bapiReturns = null;
		 *			if (paymentResponse && paymentResponse.CHANGINGS && paymentResponse.CHANGINGS.RETURN)
		 *			{
		 *				this.CurrentPosterParameters.Messages = Lib.CA.Customization.SAP.Poster.ExtractMessagesFromTable(paymentResponse.CHANGINGS.RETURN);
		 *				bapiReturns = paymentResponse.CHANGINGS.RETURN;
		 *				for (let idx = 0; idx < bapiReturns.length; idx++)
		 *				{
		 *					let returnType = bapiReturns[idx].TYPE;
		 *					if (returnType === "S")
		 *					{
		 *						let msg = bapiReturns[idx].MESSAGE;
		 *						if ((msg.toUpperCase().indexOf("DOCUMENT") > -1) && (msg.toUpperCase().indexOf("WAS POSTED") > -1))
		 *						{
		 *							documentID = bapiReturns[idx].MESSAGE_V1;
		 *						}
		 *					}
		 *				}
		 *				if (!documentID)
		 *				{
		 *					Log.Error("No Document ID found");
		 *				}
		 *			}
		 *			super.HandleResults(documentID);
		 *		}
		 *	};
		 *	return new CustomPoster(paymentAccessor);
		 * }
		 */
		/*GetCustomPoster: function(postMode, paymentAccessor, invoiceNumber, amount, glAccount, costCenter, profitCenter, taxCode, companyCode)
		{
		},*/
	};

	return SAP;
})();