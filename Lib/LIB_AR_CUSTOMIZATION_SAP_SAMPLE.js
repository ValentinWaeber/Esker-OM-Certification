/* LIB_DEFINITION{
  "name": "LIB_AR_CUSTOMIZATION_SAP_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "comment": "AR SAP posting customization functions",
  "versionable": false,
  "require": []
}*/

/**
 * This module contains
 * - functions used to customize the portal payment posting to SAP from AR
 * @namespace Lib.AR.Customization.SAP
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};

Lib.AR.Customization.SAP = (function ()
{
	var SAP =
	{
		/**
		 * @method Lib.AR.Customization.SAP.InitializePaymentSAPPosting
		 * @description
		 * Function called at the beginning of the Payment SAP Poster run
		 * @param {xTransport} payment The payment record that will be posted to SAP
		 */
		/*InitializePaymentSAPPosting: function(payment)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.SAP.FinalizePaymentSAPPosting
		 * @description
		 * Function called at the end of the Payment SAP Poster run
		 * @param {xTransport} payment The payment record that was used to try to post to SAP
		 */
		/*FinalizePaymentSAPPosting: function(payment)
		{
		},*/

		/**
		 * Definition of the PaymentAccessor class. This is meant to be an interface to accessing the payment (xVars and Tables) whether functions are run from the processing scripts or from another process.
		 * @interface Sys.AR.SAP.PaymentAccessor
		 * @prop {boolean} IsRunningOnPaymentScripts function IsRunningOnPaymentScripts(): boolean
		 * Determines whether the current posting is happening directly on the payment or if it's being run from another process
		 * @prop {T} GetValue function GetValue(fieldName: string): T
		 * Get the value for the uninherited var field
		 * @prop {string} GetExternalValue function GetExternalValue(fieldName: string): string
		 * Get the value for the external var field
		 * @prop {ITable | xFormDatatable} GetTable function GetTable(tableName: string): ITable | xFormDatatable
		 * Get the specified table
		 * @prop {void} SetValue function SetValue(fieldName: string, newValue: string): void
		 * Set the value for the uninherited var field
		 * @prop {void} SetExternalValue function SetExternalValue(fieldName: string, newValue: string): void
		 * Set the value for the external var field
		 * @prop {string} GetValue_String function GetValue_String(fieldName: string, ...args: any[]): string
		 * Get the string value for the field. First looks for an uninherited var, and if that doesn't exist/isn't set, then it will get the value from the external var field
		 * @prop {Date} GetValue_Date function GetValue_Date(fieldName: string, ...args: any[]): Date
		 * Get the date value for the uninherited var field
		 * @prop {number} GetValue_Double function GetValue_Double(fieldName: string, ...args: any[]): number
		 * Get the number value for the uninherited var field
		 * @prop {number} GetValue_Long function GetValue_Long(fieldName: string, ...args: any[]): number
		 * Get the number value for the uninherited var field
		 * @prop {void} AddValue_String function AddValue_String(fieldName: string, newValue: string, ...args: any[]): void
		 * Set the string value for the field. Will try to set the uninherited var field as well as an external var field
		 * @prop {void} AddValue_Date function AddValue_Date(fieldName: string, newValue: Date, ...args: any[]): void
		 * Set the date value for the uninherited var field
		 * @prop {void} AddValue_Double function AddValue_Double(fieldName: string, newValue: number, ...args: any[]): void
		 * Set the number value for the uninherited var field
		 * @prop {void} AddValue_Long function AddValue_Long(fieldName: string, newValue: number, ...args: any[]): void
		 * Set the number value for the uninherited var field
		 * @prop {string} GetCAParameter function GetCAParameter(fieldName: string): string
		 * Get the value for the specified Cash App configuration parameter.
		 * @prop {string} GetSapParameter function GetSapParameter(fieldName: string): string
		 * Get a SAP payment config Setting.
		 * This can be paired with the user exit {@link Lib.AR.Customization.ERPSettings.CustomizeERPSettingsFields} in order to retrieve custom fields added to the AR - ERP Settings table.
		 */

		/**
		 * Definition of the ItemsForPosting class. This is meant to be an interface to define the items on the payment that should be posted together when splitting into batches.
		 * @interface Sys.AR.SAP.ItemsForPosting
		 * @prop {number[]} invoiceIndexes The list of invoices to include in the same posting.
		 * The indexes are referring to the array of invoices being allocated by the payment.
		 * For External payments, this can be retrieved with Lib.CA.Payment.Allocate.Common.GetSelectedInvoiceItems().
		 * For Portal payments, this can be retrieved with Sys.AR.SAP.GetSelectedInvoiceItems(paymentAccessor.GetTable("InvoiceList__")).
		 * @prop {number[]} glIndexes The list of GL adjustments to include in the same posting.
		 * This field is only applicable for External payments.
		 * The indexes in this list are referring the Item index in the "Account_Allocation_Table__" table.
		 * @prop {number[]} customerIndexes The list of Customer adjustments to include in the same posting.
		 * This field is only applicable for External payments.
		 * The indexes in this list are referring to the Item index in the "Allocate_To_Customer_Table__" table.
		 */

		/**
		 * @method Lib.AR.Customization.SAP.GetItemsForEachPostingBatch
		 * @description
		 * Allows for overriding which allocation items are included in each document when posting the payment to SAP.
		 * This user exit is called near the beginning of the Payment SAP Poster run.
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment
		 * @returns {Sys.AR.SAP.ItemsForPosting[]} Specifies which allocation items should be included in each posted document.
		 * Each entry in the ItemsForPosting array specifies the items to include in a single posted document.
		 */
		/*GetItemsForEachPostingBatch: function(payment)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.SAP.GetItemLimitApplicability
		 * @description
		 * Allows for overriding the way allocation items are counted to determine how to split the payment across posted SAP documents.
		 * This user exit is called near the beginning of the Payment SAP Poster run.
		 * The actual maximum number of items to include in each posting can be set by {@link Lib.AR.Customization.SAP.GetItemLimitForPostedDocument}.
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment
		 * @returns {"SAPITEMS" | "EODITEMS"} Specifies which logic to use to determine how to split the SAP documents.
		 * By default, the logic for "SAPITEMS" is used to split the posting based on the number of line items that will be created in the resulting SAP
		 * document (e.g. this logic assumes which items will be merged and how many offset items will be added in SAP).
		 * If "EODITEMS" is specified, the SAP payment posting documents will be split based on the number of items (invoices/discounts) on the EOD
		 * payment transaction form.
		 *
		 * @example This example will set the item count logic to use based on the company code
		 * GetItemLimitApplicability: function(payment)
		 *{
		 *	var companyCode = payment.GetValue_String("Company_code__", 0) || "";
		 *	if (!companyCode)
		 *	{
		 *		var AR_Parameters = payment.GetValue_String("AR_Parameters", 0);
		 *		var AR_ParamsObj = AR_Parameters ? JSON.parse(AR_Parameters) : {};
		 *		var companyCode = "";
		 *		if (AR_Parameters && AR_ParamsObj.default_company_code__)
		 *		{
		 *			companyCode = AR_ParamsObj.default_company_code__;
		 *		}
		 *	}
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
		/*GetItemLimitApplicability: function(payment)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.SAP.GetItemLimitForPostedDocument
		 * @description
		 * Allows for overriding the maximum number of items to allow in each posted SAP document.
		 * This user exit is called near the beginning of the Payment SAP Poster run.
		 * The way allocation items are counted can be set by {@link Lib.AR.Customization.SAP.GetItemLimitApplicability}.
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment
		 * @returns {number} Specifies the maximum number of items to include in each posted SAP document.
		 * By default, the limit is 989, which is based on the SAP item limit of 999 due to the field length of 3 characters (along with a buffer).
		 * 
		 * @example This example will set the maximum number of items to use based on the company code
		 * GetItemLimitForPostedDocument: function(payment)
		 *{
		 *	var companyCode = payment.GetValue_String("Company_code__", 0) || "";
		 *	if (!companyCode)
		 *	{
		 *		var AR_Parameters = payment.GetValue_String("AR_Parameters", 0);
		 *		var AR_ParamsObj = AR_Parameters ? JSON.parse(AR_Parameters) : {};
		 *		var companyCode = "";
		 *		if (AR_Parameters && AR_ParamsObj.default_company_code__)
		 *		{
		 *			companyCode = AR_ParamsObj.default_company_code__;
		 *		}
		 *	}
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
		/*GetItemLimitForPostedDocument: function(payment)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.SAP.GetCustomBapiNameForPosting
		 * @description
		 * Allows for overriding the BAPI used to post the payment to SAP
		 * This user exit is called before connecting to SAP for posting a payment
		 * This can be paired with the user exit FinalizeBapiInputParameters in order to customize the input structure sent to the BAPI
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment
		 * @returns {string} Value containing the name of the BAPI used to post the current payment
		 * This value will be used as the input into the function {@link https://doc.esker.com/eskerondemand/cv_ly/en/manager/startpage.htm#ProcessingScripts/SapBAPIManager/AddFlex.html SapBAPIManager.Add}
		 * 
		 * @example This example will directly override the BAPI name. Assumes this BAPI has been custom developed and installed by the customer.
		 * GetCustomBapiNameForPosting: function(payment)
		 * {
		 *	return "Z_CUSTOM_PAYMENT_PROCESS";
		 * }
		 */
		/*GetCustomBapiNameForPosting: function(payment)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.SAP.GetConnectionConfiguration
		 * @description
		 * Allows for overriding the SAP configuration name set on the AR payment settings
		 * This user exit is called before connecting to SAP for posting a payment
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment
		 * @returns {string} Value containing the name of the SAP configuration that manages the connection with your SAP environment
		 * This value will be used as the input into the function {@link https://webdoc/eskerondemand/nv/en/manager/startpage.htm#ProcessingScripts/SapControl/CreateBapiManager.html ISAPControl.CreateBapiManager}
		 * 
		 * @example This example will directly override the SAP connection configuration
		 * GetConnectionConfiguration: function(payment)
		 * {
		 *	return "CUSTOMER_EskerINTAROD_QA_01234567";
		 * }
		 */
		/*GetConnectionConfiguration: function(payment)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.SAP.GetBAPIName
		 * @description
		 * Return the BAPI name to call.
		 * Allows for retrieving the customized name of a BAPI from the specified default BAPI name.
		 * This user exit is called for each BAPI used in posting Portal payments to SAP with Web Services.
		 * @param {string} originalBapiName for instance "SO_OBJECT_INSERT"
		 * @returns {string} String value containing the customized BAPI name or, if no mapping has been defined, the default BAPI name.
		 * 
		 * @example This example retrieves the customized name of the auto-commit BAPIs:
		 * GetBAPIName: function (originalBapiName)
		 * {
		 *	var customBapiName;
		 *	switch (originalBapiName)
		 *	{
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
		 * @method Lib.AR.Customization.SAP.OnSapWebServiceTokenParamsSet
		 * @description
		 * Allows modification of the callParams.data in the SAP OAuth 2.0 token API calls to include additional required data.
		 * @see {@link https://webdoc/eskerondemand/cv_ly/en/manager/startpage.htm#ProcessingScripts/HttpRequest/Call.html ProcessingScripts/HttpRequest/Call.html}
		 * @param {string} params "grant_type=client_credentials" is the default data parameter
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment
		 * @returns {string} params
		 * 
		 * @example This example will add a scope parameter defined in a custom external variable.
		 * OnSapWebServiceTokenParamsSet: function (params, payment)
		 * {
		 *	var scope = payment.GetExternalValue("Z_TokenScope__");
		 *	if (!Sys.Helpers.IsEmpty(scope))
		 *	{
		 *		params += "&scope=" + scope;
		 *	}
		 *	return params;
		 * }
		 */
		/*OnSapWebServiceTokenParamsSet: function(params, payment)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.SAP.GetCustomSprintVersion
		 * @description
		 * Allows for overriding the expected SAP function version to determine the JSON structure sent to the BAPI.
		 * This user exit is called before building the BAPI JSON.
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment
		 * @returns {string} Value containing the sprint version to use.
		 * This value will determine the expected BAPI version of the {@link https://webdoc/eskerondemand/nv/en/manager/startpage.htm#Processes/AR/SAP%20Integration/SAP_TransportRequests.html SAP Transport Requests}.
		 * 
		 * @example This example will force the expected SAP transport installed to be the one compatible with sprint 265.
		 * GetCustomSprintVersion: function(payment)
		 * {
		 *	return "265";
		 * }
		 */
		/*GetCustomSprintVersion: function(payment)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.SAP.CalculateItemNumbACC
		 * @description
		 * Allows for overriding the unique item number for the ITEMNO_ACC field of the BAPI parameters
		 * This user exit is called whenever we need to determine the ITEMNO_ACC
		 * @param {number} itemNoCount The current number of items to include
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment
		 * @returns {string} Representing the ITEMNO_ACC for this item
		 * 
		 * @example This example will set the ITEMNO_ACC based on the current item count by padding left with zeros
		 * CalculateItemNumbACC: function(itemNoCount, payment)
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
		/*CalculateItemNumbACC: function(itemNoCount, payment)
		{
		},*/

		/**
		 * Definition of the ZESKER_T_CSH_PAY_H SAP BAPI table
		 * @interface ISAP.Structures.ZESKER_T_CSH_PAY_H
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
		 * @method Lib.AR.Customization.SAP.UpdateBapiDocumentHeader
		 * @description
		 * Allows for overriding the BAPI DOCUMENT_HEADER sent to SAP
		 * This user exit is called after the code has initially set the values in the Document Header object
		 * @param {ISAP.Structures.ZESKER_T_CSH_PAY_H} header Initial document header object set up by the baseline code
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment
		 * @returns {ISAP.Structures.ZESKER_T_CSH_PAY_H} Object containing the document header part of the BAPI JSON posted to SAP
		 * 
		 * @example This example will override the DOC_TYPE field to be "DZ"
		 * UpdateBapiDocumentHeader: function(header, payment)
		 * {
		 *	header.DOC_TYPE = "DZ";
		 *	return header;
		 * }
		 */
		/*UpdateBapiDocumentHeader: function(header, payment)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.SAP.GetGLAccountForPaymentMethod
		 * @description
		 * Allows for setting the payment-level G/L to use when posting the payment to SAP
		 * This user exit is called while setting the values in the item object before it is added into the BAPI ITEM
		 * @param {string} paymentMethod Type of the portal payment
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment
		 * @returns {string} G/L account associated with the payment method
		 *
		 * @example This example will set the G/L based on the company code and payment method
		 * GetGLAccountForPaymentMethod: function(paymentMethod, payment)
		 * {
		 * 	var companyCode = payment.GetValue_String("Company_code__", 0) || "";
		 * 	if (!companyCode)
		 * 	{
		 * 		var AR_Parameters = payment.GetValue_String("AR_Parameters", 0);
		 * 		var AR_ParamsObj = AR_Parameters ? JSON.parse(AR_Parameters) : {};
		 * 		var companyCode = "";
		 * 		if (AR_Parameters && AR_ParamsObj.default_company_code__)
		 * 		{
		 * 			companyCode = AR_ParamsObj.default_company_code__;
		 * 		}
		 * 	}
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
		/*GetGLAccountForPaymentMethod: function(paymentMethod, payment)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.SAP.GetGLAccountForDiscount
		 * @description
		 * Allows for setting the discount G/L to use when posting the payment to SAP
		 * This user exit is called while setting the values in the item object before it is added into the BAPI ITEM
		 * @param {Sys.AR.SAP.Payment.Post.AllocationItem} allocationItem Contains details on the item with a discount applied
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment to post
		 * @returns {string} G/L account on which to apply the discount
		 * 
		 * @example This example will set the G/L based on the company code
		 * GetGLAccountForDiscount: function(allocationItem, payment)
		 * {
		 * 	var companyCode = payment.GetValue_String("Company_code__", 0) || "";
		 * 	if (!companyCode)
		 * 	{
		 * 		var AR_Parameters = payment.GetValue_String("AR_Parameters", 0);
		 * 		var AR_ParamsObj = AR_Parameters ? JSON.parse(AR_Parameters) : {};
		 * 		var companyCode = "";
		 * 		if (AR_Parameters && AR_ParamsObj.default_company_code__)
		 * 		{
		 * 			companyCode = AR_ParamsObj.default_company_code__;
		 * 		}
		 * 	}
		 * 	switch (companyCode)
		 * 	{
		 * 		case "1000":
		 * 			return "11111";
		 * 		default:
		 * 			// unknown company code
		 * 			break;
		 * 	}
		 * 	return null;
		 * }
		 */
		/*GetGLAccountForDiscount: function(allocationItem, payment)
		{
		},*/

		/**
		 * Definition of AllocationItem object
		 * @interface Sys.AR.SAP.Payment.Post.AllocationItem
		 * @prop {string} type "INVOICE", "CUSTOMER", or "GL"
		 * @prop {Item | xFormDataTableItem} item Table item from the payment form
		 * @prop {string} customer Associated customer
		 * @prop {string} itemNumberAcc Unique identifier for the item
		 * @prop {string} GLAccount Associated GL account
		 * @prop {string} costCenter Associated cost center
		 * @prop {string} profitCenter Associated profit center
		 * @prop {string} invoiceNumber Invoice number, if this is an invoice
		 * @prop {string} currencyAmount Amount allocated to this invoice/account
		 * @prop {string} paymentRef The payment reference
		 */

		/**
		 * Definition of the ZESKER_T_CSH_PAY_I SAP BAPI table
		 * @interface ISAP.Structures.ZESKER_T_CSH_PAY_I
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
		 * @method Lib.AR.Customization.SAP.UpdateBapiItem
		 * @description
		 * Allows for overriding parameters in an item for the BAPI ITEM sent to SAP
		 * This user exit is called after the code has initially set the values in this item object before it is added into the BAPI ITEM
		 * @param {ISAP.Structures.ZESKER_T_CSH_PAY_I} item Initial item object set up by the baseline code
		 * @param {Sys.AR.SAP.Payment.Post.AllocationItem} allocationItem Field parameters retrieved from the current allocation table item
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment
		 * @returns {ISAP.Structures.ZESKER_T_CSH_PAY_I} Object containing the updated item for the BAPI JSON posted to SAP
		 * 
		 * @example This example will set the VALUE_DATE field for invoices to the Invoice Date
		 * UpdateBapiItem: function(item, allocationItem, payment)
		 * {
		 *	if (allocationItem.type === "INVOICE")
		 *	{
		 *		item.VALUE_DATE = allocationItem.item.GetValue("Invoice_date__");
		 *	}
		 *	return item;
		 * }
		 */
		/*UpdateBapiItem: function(item, allocationItem, payment)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.SAP.UpdateBapiItemOffset
		 * @description
		 * Allows for overriding parameters in the offset item for the BAPI ITEM sent to SAP
		 * This user exit is called after the code has initially set the values for the offset item object before it is added into the BAPI ITEM
		 * @param {ISAP.Structures.ZESKER_T_CSH_PAY_I} item Initial item object set up by the baseline code
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment
		 * @returns {ISAP.Structures.ZESKER_T_CSH_PAY_I} Object containing the updated offset item for the BAPI JSON posted to SAP
		 * 
		 * @example This example will set the ACCOUNT field for offsets to the hard-coded G/L account
		 * UpdateBapiItemOffset: function(item, payment)
		 * {
		 *	item.ACCOUNT = "0000116509";
		 *	return item;
		 * }
		 */
		/*UpdateBapiItemOffset: function(item, payment)
		{
		},*/

		/**
		 * Definition of the ZESKER_T_CSH_PAY_R SAP BAPI table
		 * @interface ISAP.Structures.ZESKER_T_CSH_PAY_R
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
		 * @method Lib.AR.Customization.SAP.UpdateBapiReference
		 * @description
		 * Allows for overriding parameters in a reference item for the BAPI REFERENCE sent to SAP
		 * This user exit is called after the code has initially set the values in this reference object before it is added into the BAPI REFERENCE
		 * @param {ISAP.Structures.ZESKER_T_CSH_PAY_R} ref Initial reference item object set up by the baseline code
		 * @param {Sys.AR.SAP.Payment.Post.AllocationItem} allocationItem Field parameters retrieved from the current allocation table item
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment
		 * @returns {ISAP.Structures.ZESKER_T_CSH_PAY_R} Object containing the updated reference item for the BAPI JSON posted to SAP
		 * 
		 * @example This example will set the REF_TYPE field for each reference item
		 * UpdateBapiReference: function(ref, allocationItem, payment)
		 * {
		 *	ref.REF_TYPE = "DOCUMENT NUMBER";
		 *	return ref;
		 * }
		 */
		/*UpdateBapiReference: function(ref, allocationItem, payment)
		{
		},*/

		/**
		 * Definition of the ZESKER_T_CSH_PAY_C SAP BAPI table
		 * @interface ISAP.Structures.ZESKER_T_CSH_PAY_C
		 * @prop {number} ITEMNO
		 * @prop {string} ITEMNO_ACC
		 * @prop {number} AMT_DOCCUR Amount in the document currency
		 * @prop {number} AMT_LOCCUR Amount in the local currency
		 * @prop {string} BSCHL_CURRENT (NEWBS) Posting Key for position (SAP will fill a default if empty)
		 * @prop {string} BSCHL_OFFSET (NEWBS) Posting Key for offset position (SAP will fill a default if empty)
		 */

		/**
		 * @method Lib.AR.Customization.SAP.UpdateBapiCurrency
		 * @description
		 * Allows for overriding parameters in a currency item for the BAPI CURRENCY sent to SAP
		 * This user exit is called after the code has initially set the values in this currency object before it is added into the BAPI CURRENCY
		 * @param {ISAP.Structures.ZESKER_T_CSH_PAY_C} currency Initial currency item object set up by the baseline code
		 * @param {Sys.AR.SAP.Payment.Post.AllocationItem} allocationItem Field parameters retrieved from the current allocation table item
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment
		 * @returns {ISAP.Structures.ZESKER_T_CSH_PAY_C} Object containing the updated currency item for the BAPI JSON posted to SAP
		 * 
		 * @example This example will calculate and set the AMT_LOCCUR and EXCH_RATE field if an exchange rate is available
		 * UpdateBapiCurrency: function(currency, allocationItem, payment)
		 * {
		 *	var localExchangeRate = allocationItem.item.GetValue("Exchange_rate_local_currency__");
		 *	if (localExchangeRate && localExchangeRate != 1)
		 *	{
		 *		currency.AMT_LOCCUR = Number(currency.AMT_DOCCUR) * Number(localExchangeRate);
		 *		currency.EXCH_RATE = localExchangeRate;
		 *	}
		 *	return currency;
		 * }
		 * @example This example will set the posting keys based on the item type
		 * UpdateBapiCurrency: function(currency, allocationItem, payment)
		 * {
		 *	if (allocationItem.type === "GL")
		 *	{
		 *		item.BSCHL_CURRENT = Number(currency.AMT_DOCCUR) < 0 ? "40" : "50";
		 *		item.BSCHL_OFFSET = Number(currency.AMT_DOCCUR) < 0 ? "50" : "40";
		 *	}
		 *	else
		 *	{
		 *		// Set for customer items (invoice or customer adjustments)
		 *		item.BSCHL_CURRENT = Number(currency.AMT_DOCCUR) < 0 ? "08" : "18";
		 *		item.BSCHL_OFFSET = Number(currency.AMT_DOCCUR) < 0 ? "50" : "40";
		 *	}
		 *	return item;
		 * }
		 */
		/*UpdateBapiCurrency: function(currency, allocationItem, payment)
		{
		},*/

		/**
		 * Definition of the ZESKER_T_CSH_PAY_E SAP BAPI table.
		 * Using this requires a separate custom extension tranport to be installed in SAP.
		 * @interface ISAP.Structures.ZESKER_T_CSH_PAY_E
		 * @prop {number} ITEMNO
		 * @prop {string} STRUCTURE "BSEG"
		 * @prop {string} COMP_CODE Matching the company code of the associated item(s)
		 * @prop {string} VALUEPART1 "SGTXT" or "XREF3"
		 * @prop {string} VALUEPART2
		 * @prop {string} VALUEPART3
		 * @prop {string} VALUEPART4
		 */

		/**
		 * @method Lib.AR.Customization.SAP.UpdateBapiExtension
		 * @description
		 * Allows for setting the BAPI Extension table parameters for custom actions defined in SAP
		 * This user exit is called after setting other payment items in the BAPI input table
		 * Note 1: This is not compatible with UpdateBapiExtensionByItem when used to set an SGTXT/ZUONR entry for the same customer specified in VALUEPART2.
		 * I.e. There can only be a single entry per SGTXT or ZUONR for a particular customer when that entry has no value in VALUEPART4.
		 * Note 2: When no value is placed in VALUEPART4, this will populate the SGTXT/ZUONR for fully and partially paid invoices.
		 * @param {number} itemNo BAPI header number
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment to post
		 * @param {Sys.AR.SAP.PaymentAccessor} paymentDup Passed twice for backwards compatibility - this parameter can be ignored
		 * @param {ITable | xFormDatatable} invoicesTable Invoice table on the portal payment
		 * @param {Sys.AR.SAP.Logger} logger Used to log any info/errors
		 * @returns {ISAP.Structures.ZESKER_T_CSH_PAY_E[]} Array of objects containing the extensions for the BAPI JSON posted to SAP
		 * 
		 * @example This example will add a text specified per customer to the SGTXT field when the customization is available in SAP.
		 * UpdateBapiExtension: function (itemNo, payment, paymentDup, invoicesTable, logger)
		 * {
		 *	var ext = [];
		 *	var paymentDateToUse = payment.GetValue_Date("Payment_date_no_time__") ? payment.GetValue_Date("Payment_date_no_time__") : payment.GetValue_Date("Payment_date__");
		 *	var paymentDate = Sys.Helpers.Date.Format(paymentDateToUse, "mm/dd/yyyy");
		 *	var paymentMethod = payment.GetValue("Payment_type__");
		 *		var paymentMethodsMapping = {
		 *			"CC": "Card",
		 *			"EC": "eCheck",
		 *			"SEPA": "SEPA direct debit",
		 *			"SOFORT": "SOFORT Banking",
		 *			"ACH": "ACH",
		 *			"COMPENSATION": "Offset",
		 *			"ACSS": "ACSS",
		 *			"CREDIT": "Credit",
		 *			"ACH_CREDIT": "ACH",
		 *			"ACH_SETTLEMENT": "ACH",
		 *			"ACH_DEBIT": "ACH",
		 *			"CHECK_PAID": "Check",
		 *			"CREDIT_APPLIED": "Applied credit"
		 *		};
		 *	paymentMethod = paymentMethodsMapping[paymentMethod] || "External";
		 *	var itemTextContent = [];
		 *	if (paymentDate)
		 *	{
		 *		itemTextContent.push(paymentDate);
		 *	}
		 *	if (paymentMethod)
		 *	{
		 *		itemTextContent.push(paymentMethod);
		 *	}
		 *	var itemTextStringBase = itemTextContent.join(" ");
		 *	var customerTexts = {};
		 *	var selectedInvoices = Sys.AR.SAP.GetSelectedInvoiceItems(invoicesTable);
		 *	for (var invIdx = 0; invIdx < selectedInvoices.length; invIdx++)
		 *	{
		 *		var currentInvoiceItem = selectedInvoices[invIdx];
		 *		var customer = Sys.AR.SAP.GetCustomerForInvoice(currentInvoiceItem, logger);
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
		 * }
		 * @example <caption>This example will add a text specified per customer to the Assignment/ZUONR field when the customization is available in SAP.
		 * The text will include the first and part of the last invoice number found per customer.</caption>
		 * UpdateBapiExtension: function (itemNo, payment, paymentDup, invoicesTable, logger)
		 * {
		 *	var ext = [];
		 *	var customerInvoices = {};
		 *	var selectedInvoices = Sys.AR.SAP.GetSelectedInvoiceItems(invoicesTable);
		 *	for (var invIdx = 0; invIdx < selectedInvoices.length; invIdx++)
		 *	{
		 *		var currentInvoiceItem = selectedInvoices[invIdx];
		 *		var customer = Sys.AR.SAP.GetCustomerForInvoice(currentInvoiceItem, logger);
		 *		if (customer && !customerInvoices[customer])
		 *		{
		 *			customerInvoices[customer] = [];
		 *		}
		 *		customerInvoices[customer].push(currentInvoiceItem.GetValue("Invoice_number__"));
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
		 * }
		 */
		/*UpdateBapiExtension: function(itemNo, payment, paymentDup, invoicesTable, logger)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.SAP.UpdateBapiExtensionByItem
		 * @description
		 * Allows for setting the BAPI Extension table parameters per individual item for custom actions defined in SAP.
		 * This user exit is called after Lib.AR.Customization.SAP.UpdateBapiItem for the provided item of the BAPI input table.
		 * @param {ISAP.Structures.ZESKER_T_CSH_PAY_I} item Current item object for which to add extension parameters
		 * @param {Sys.AR.SAP.Payment.Post.AllocationItem} allocationItem Field parameters retrieved from the current allocation table item
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment to post
		 * @returns {ISAP.Structures.ZESKER_T_CSH_PAY_E[]} Array of objects containing the extensions for the BAPI JSON posted to SAP
		 * 
		 * @example This example will add the partially paid invoice number to the SGTXT field when the customization is available in SAP
		 * UpdateBapiExtensionByItem: function (item, allocationItem, payment)
		 * {
		 *	var ext = [];
		 *	if (allocationItem.type === "INVOICE")
		 *	{
		 *		// Fill SGTXT field with the invoice number when it's partially paid
		 *		var isPartial = false;
		 *		var allocatedAmount = Number(allocationItem.item.GetValue("Invoice_pay_amount__"));
		 *		var remainingAmount = Number(allocationItem.item.GetValue("Invoice_remaining_amount__"));
		 *		if (Math.abs(remainingAmount - allocatedAmount) > 0.001)
		 *		{
		 *			isPartial = true;
		 *		}
		 *		else
		 *		{
		 *			// Remaining amount is 0 - also check that the allocated amount is the full original invoice amount
		 *			var totalAmount = Number(allocationItem.item.GetValue("Invoice_total_amount__"));
		 *			if (Math.abs(totalAmount - allocatedAmount) > 0.001)
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
		 *				VALUEPART4: allocationItem.invoiceNumber // Invoice number/identifier used to find which item to update, based on the REF_TYPE
		 *			};
		 *			ext.push(extSgtxt);
		 *		}
		 *	}
		 *	return ext.length > 0 ? ext : null;
		 * }
		 * @example This example will add the partially paid invoice number to the ZUONR field when the customization is available in SAP
		 * UpdateBapiExtensionByItem: function (item, allocationItem, payment)
		 * {
		 *	var ext = [];
		 *	if (allocationItem.type === "INVOICE")
		 *	{
		 *		// Fill ZUONR field with the invoice number when it's partially paid
		 *		var isPartial = false;
		 *		var allocatedAmount = Number(allocationItem.item.GetValue("Invoice_pay_amount__"));
		 *		var remainingAmount = Number(allocationItem.item.GetValue("Invoice_remaining_amount__"));
		 *		if (Math.abs(remainingAmount - allocatedAmount) > 0.001)
		 *		{
		 *			isPartial = true;
		 *		}
		 *		else
		 *		{
		 *			// Remaining amount is 0 - also check that the allocated amount is the full original invoice amount
		 *			var totalAmount = Number(allocationItem.item.GetValue("Invoice_total_amount__"));
		 *			if (Math.abs(totalAmount - allocatedAmount) > 0.001)
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
		 *				VALUEPART4: allocationItem.invoiceNumber // Invoice number/identifier used to find which item to update, based on the REF_TYPE
		 *			};
		 *			ext.push(extZuonr);
		 *		}
		 *	}
		 *	return ext.length > 0 ? ext : null;
		 * }
		 */
		/*UpdateBapiExtensionByItem: function(item, allocationItem, payment)
		{
		},*/

		/**
		 * Defines the structure for the input/output JSON sent to and/or received from a BAPI.
		 * @interface Sys.AR.SAP.BapiParameters
		 * @prop {Sys.AR.SAP.Exports} EXPORTS
		 * @prop {Sys.AR.SAP.Changings} CHANGINGS
		 */

		/**
		 * This class houses the structure of the Exports table used for input to the BAPI connection and posting to SAP.
		 * @class Sys.AR.SAP.Exports
		 * @prop {"S" | "P" | "R"} E_TYPE_PAYMENT Table item for the payment type. One of "S" for standard (default), "P" for partial, or "R" for residual
		 * @prop {"" | "X"} E_NO_LINES_OFFSET Specifies how to include offset lines. One of "" for multiple offset lines (default) or "X" for a single offset line
		 */

		/**
		 * This class houses the structure of the JSON object used for input/output from the BAPI connection and posting to SAP.
		 * @class Sys.AR.SAP.Changings
		 * @prop {ISAP.Structures.ZESKER_T_CSH_PAY_H[]} DOCUMENT_HEADER Document Header table contains all the header of the documents to be posted.
		 * @prop {ISAP.Structures.ZESKER_T_CSH_PAY_R[]} REFERENCE Reference table contains all the invoices linked to each payment or payments
		 * @prop {ISAP.Structures.ZESKER_T_CSH_PAY_I[]} ITEMS Items table contains all the customer / G/L offset information to be used on the payment or payments
		 * @prop {ISAP.Structures.ZESKER_T_CSH_PAY_E[]} EXTENSION Extension table contains information and data to input into custom extension items added to the SAP code
		 * @prop {ISAP.Structures.ZESKER_T_CSH_PAY_C[]} CURRENCYAMOUNT Currency Amount table contains all the amounts for each line item of each payment or payments
		 * @prop {ISAP.Structures.BAPIRET2[]} RETURN Return table contains the info returned from SAP - e.g. created Document IDs and error/warning/success messages
		 */

		/**
		 * @method Lib.AR.Customization.SAP.UpdateBapiExports
		 * @description
		 * Allows for overriding the BAPI EXPORTS sent to SAP
		 * This user exit is called after the code has finished setting up all other items in the BAPI input table, before it is sent to SAP
		 * @param {Sys.AR.SAP.Exports} exports Initial Exports table set up by the baseline code
		 * @param {boolean} hasPartiallyPaidInvoice True if an invoice was found that is partially paid
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment to post
		 * @returns {Sys.AR.SAP.Exports} Updated Exports table for the BAPI JSON posted to SAP
		 * 
		 * @example This example will set the payment type for Partial payments.
		 * UpdateBapiExports: function(exports, hasPartiallyPaidInvoice, payment)
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
		 * UpdateBapiExports: function(exports, hasPartiallyPaidInvoice, payment)
		 * {
		 *	exports.E_NO_LINES_OFFSET = "X";
		 *	return exports;
		 * }
		 */
		/*UpdateBapiExports: function(exports, hasPartiallyPaidInvoice, payment)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.SAP.FinalizeBapiInputParameters
		 * @description
		 * Allows for finalizing the BAPI parameters that will be sent to SAP for posting the payment
		 * This user exit is called just before the JSON is stringified from the input parameters and sent to SAP
		 * @param {Sys.AR.SAP.BapiParameters} bapiParams Initial populated data structure for posting to SAP
		 * @param {string} bapiName Name of the BAPI that will perform the post - only "Z_CASH_APP_PAYMENT_PROCESS" is supported
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment to post
		 * @returns {Sys.AR.SAP.BapiParameters} Updated data structure for the BAPI JSON posted to SAP
		 */
		/*FinalizeBapiInputParameters: function(bapiParams, bapiName, payment)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.SAP.CustomizeRestJson
		 * @description
		 * Allows for customizing the REST JSON.
		 * This user exit is called prior to converting the REST JSON to a string to use with SAP web services integration.
		 * @param {string} method The SAP method (e.g., "Z_CASH_APP_PAYMENT_PROCESS")
		 * @param {Object} restJson The current REST JSON
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment to post
		 * @returns {string} The customized REST JSON
		 * 
		 * @example This example will insert a custom field in the header of the REST JSON for the Z_CASH_APP_PAYMENT_PROCESS
		 * CustomizeRestJson: function (method, restJson, payment)
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
		/*CustomizeRestJson: function(method, restJson, payment)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.SAP.CustomizeSOAPEnvelope
		 * @description
		 * Allows for customizing the SOAP envelope or replacing it with something else altogether (e.g., JSON to use with REST).
		 * This user exit is called prior to returning the stringified version of the SOAP envelope to use with SAP web services integration.
		 * @param {string} method The SOAP method (e.g., "urn:Z_CASH_APP_PAYMENT_PROCESS")
		 * @param {string} soapString The current SOAP envelope
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment to post
		 * @returns {string} The customized SOAP envelope
		 * 
		 * @example This example will insert a custom node at the end of the SOAP envelope for the Z_CASH_APP_PAYMENT_PROCESS
		 * CustomizeSOAPEnvelope: function (method, soapString, payment)
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
		/*CustomizeSOAPEnvelope: function(method, soapString, payment)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.SAP.OnSapWebServiceCallBegin
		 * @description
		 * Allows for customizing the web service parameters.
		 * This function is called prior to calling an SAP web service.
		 * @see {@link https://webdoc/eskerondemand/cv_ly/en/manager/startpage.htm#ProcessingScripts/HttpRequest/Call.html ProcessingScripts/HttpRequest/Call.html}
		 * @param {HttpRequestParam} params The standard web service parameters
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment to post
		 * 
		 * @example
		 * OnSapWebServiceCallBegin: function (params, payment)
		 * {
		 *		// Customize the timeout
		 *		var timeout = 90000;
		 *		params.sendTimeout = timeout;
		 *		params.receivedTimeout = timeout;
		 * }
		 */
		/*OnSapWebServiceCallBegin: function (params, payment)
		{
			// !Warning: Do not log passwords or any other sensitive info
		},*/

		/**
		 * @method Lib.AR.Customization.SAP.HandleResponseMessagesAsError
		 * @description
		 * Allows for handling messages received from the SAP posting as an error on the payment form
		 * This user exit is called after the RFC post
		 * Note that if a commit is performed within the SAP BAPI code, the returned message will only be reported and cannot prevent the posting
		 * @param {Sys.AR.SAP.Messages} messages object holding error, warning, and success messages from the post
		 * @param {string} messages.success success message
		 * @param {string} messages.warning warning message
		 * @param {string} messages.error error message
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment to post
		 * @returns {string} Failure message to handle as an error
		 * 
		 * @example This example will treat a warning as an error if a specific substring is found in the warning message response
		 * HandleResponseMessagesAsError: function(messages, payment)
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
		/*HandleResponseMessagesAsError: function(messages, payment)
		{
		},*/

		/**
		 * Definition of the BAPIRET2 SAP BAPI table
		 * @interface ISAP.Structures.BAPIRET2
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
		 * @method Lib.AR.Customization.SAP.ExtractDocumentID
		 * @description
		 * Allows for customizing the way the created Document ID is extracted from the posting response
		 * This user exit is called after the RFC post
		 * @param {ISAP.Structures.BAPIRET2[]} bapiReturns Returned object from the posting call
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment to post
		 * @returns {string | string[]} representing the Document ID created
		 * 
		 * @example This example will parse the document ID from a success message in the form of "DOCUMENT xxxx WAS CREATED"
		 * ExtractDocumentID: function(bapiReturns, payment)
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
		 * ExtractDocumentID: function(bapiReturns, payment)
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
		/*ExtractDocumentID: function(bapiReturns, payment)
		{
		},*/

		/**
		 * Definition of the Sys.AR.SAP.Payment.Post.Poster extension.
		 * @interface Lib.AR.Customization.SAP.Poster
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
		 * @method Lib.AR.Customization.SAP.GetCustomPoster
		 * @description
		 * Allows for customizing the poster used to post the SAP document.
		 * This user exit is called near the beginning of the SAP Poster run just before connecting the BAPI and building the input parameters.
		 * @param {Sys.AR.SAP.PaymentAccessor} payment The portal payment to post
		 * @param {Sys.AR.SAP.Logger} logger Used to log any info/errors
		 * @returns {Lib.AR.Customization.SAP.Poster} An object of a class extending/implementing the Sys.AR.SAP.Payment.Post.Poster class.
		 * 
		 * @example This example defines a custom poster representing a skeleton of the Z_CASH_APP_PAYMENT_PROCESS poster.
		 * GetCustomPoster: function (payment, logger)
		 * {
		 *	// This class represents a simplified skeleton of the poster used for Z_CASH_APP_PAYMENT_PROCESS
		 *	CustomPoster = class extends Sys.AR.SAP.Payment.Post.Poster
		 *	{
		 *		constructor(payment, logger)
		 *		{
		 *			super(payment, logger);
		 *			this.CanRollbackWork = false;
		 *			this.HeaderCount = 1;
		 *			this.hasPartiallyPaidInvoice = false;
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
		 *			this.logger.Verbose("bapiParams = " + JSON.stringify(this.BapiParams));
		 *			this.CurrentPosterParameters.BapiProcess.SetJsonParameters(JSON.stringify(this.BapiParams));
		 *		}
		 *		ExtractResults()
		 *		{
		 *			let documentID;
		 *			let paymentResponse = JSON.parse(this.CurrentPosterParameters.BapiProcess.GetJsonParameters(true));
		 *			let bapiReturns = null;
		 *			if (paymentResponse && paymentResponse.CHANGINGS && paymentResponse.CHANGINGS.RETURN)
		 *			{
		 *				this.CurrentPosterParameters.Messages = Sys.AR.SAP.Payment.Post.Poster.ExtractMessagesFromTable(paymentResponse.CHANGINGS.RETURN);
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
		 *					this.logger.Error("No Document ID found");
		 *				}
		 *			}
		 *			super.HandleResults(documentID);
		 *		}
		 *	};
		 *	return new CustomPoster(payment, logger);
		 * }
		 */
		/*GetCustomPoster: function(payment, logger)
		{
		},*/
	};

	return SAP;
})();