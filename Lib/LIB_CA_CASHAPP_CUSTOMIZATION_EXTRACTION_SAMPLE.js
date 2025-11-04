/* LIB_DEFINITION{
  "name": "LIB_CA_CASHAPP_CUSTOMIZATION_EXTRACTION_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "CashApplication Extraction customization functions",
  "require": []
}*/

/**
 * This module contains functions to customize data extracted from payment files
 * @namespace Lib.CA.CashApp.Customization.Extraction
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.CashApp = Lib.CA.CashApp || {};
Lib.CA.CashApp.Customization = Lib.CA.CashApp.Customization || {};

Lib.CA.CashApp.Customization.Extraction = (function ()
{
	/**
	 * @lends Lib.CA.CashApp.Customization.Extraction
	 */
	var Extraction =
	{
		/**
		 * Definition of CheckDepositItem. extends {@link Lib.CA.Extraction.Transaction}
		 * @interface Lib.CA.Extraction.Transaction.CheckDepositItem
		 * @prop {string} paymentMethod the payment type as described in the application setting
		 * @prop {string} paymentDate date of the payment
		 * @prop {number} paidAmount amount of the payment
		 * @prop {string} payer either bank account number or payer identifier code
		 * @prop {string} payerName the payer name
		 * @prop {string} transactionID Unique id either computed by the bank or computed from check information
		 * @prop {string} bankNumber bank number of the payer
		 * @prop {string} accountNumber account number of the payer
		 * @prop {string} checkNumber check number of the payment
		 */

		/**
		 * Definition of BAI2 statement item. extends {@link Lib.CA.Extraction.Transaction}
		 * @interface Lib.CA.Extraction.Transaction.Bai2Item
		 * @prop {string} paymentMethod Transaction Type (translated)
		 * @prop {string} paymentDate Payment date. Refers to the posting or accounting date at the originator financial institution.
		 * @prop {number} paidAmount Paid amount.
		 * @prop {number} paidAmountInForeignCurrency Paid amount in foreign currency, if found.
		 * @prop {string} payer Payer reference, if found
		 * @prop {string} payerName Payer name, if found
		 * @prop {string} transactionID Bank Reference Number. Alphanumeric field defined by the originator.
		 * @prop {string} currency Account currency code
		 * @prop {string} foreignCurrency Currency code of foreign payment, if found.
		 * @prop {number} itemCount Item count (record Type: 03 - Account Identifier & Summary Status)
		 * @prop {string} valueTime For funds type V (value dated), value time in military format (2400)
		 * @prop {string} fundsType Funds type. Types are:
		 *   0 = immediate availability (zero)
		 *   1 = one-day availability
		 *   2 = two-or-more days availability
		 *   S = distributed availability
		 *   V = value dated
		 *   D = distributed availability
		 *   Z = unknown (default)
		 * @prop {number} typeCode Optional. Identifies the type of summary or status data
		 * @prop {Date} valueDate If funds type = V, value date
		 * @prop {string} additionalInformation Optional alphanumeric field defined by the originator
		 * @prop {string} referenceNumber Customer Reference Number. Alphanumeric field defined by the originator. The Customer Reference Number will be the check number for the Transaction Detail type codes 474, 475 and 395.
		 * @prop {string} payeeNumber Customer account number at originator financial institution. The field is alphanumeric and includes significant leading zeroes.
		 */

		/**
		 * Definition of MT940 statement item. extends {@link Lib.CA.Extraction.Transaction}
		 * @interface Lib.CA.Extraction.Transaction.MT940Item
		 * @prop {string} paymentMethod Transaction Type (translated)
		 * @prop {string} paymentDate Entry date
		 * @prop {number} paidAmount Transaction amount (with sign)
		 * @prop {number} paidAmountInForeignCurrency Paid amount in foreign currency, if found.
		 * @prop {string} payer Payer reference, if found
		 * @prop {string} payerName Payer name, if found
		 * @prop {string} transactionID Payment reference
		 * @prop {string} currency Transaction currency (copy of statement currency)
		 * @prop {string} foreignCurrency Currency code of foreign payment, if found.
		 * @prop {string} fundsType Funds code. C = credit, RC = Reversal of credit D = debit, RD = Reversal of debit
		 * @prop {number} typeCode Transaction Type Identification Code
		 * @prop {string} valueDate Value date in UTC (yyyy-MM-dd format)
		 * @prop {string} details Content of relevant 86 tag(s), may be multiline ('\n' separated)
		 * @prop {string} extraDetails Optional, extra details (supplementary details)
		 * @prop {Object.<string, string>} structuredDetails Optional, if detected, parsed details in form of { subtag: value }
		 * @prop {string} referenceNumber Bank reference
		 * @prop {string} payeeNumber Payee account identification
		 */

		/**
		 * Definition of MT942 statement item. extends {@link Lib.CA.Extraction.Transaction}
		 * @interface Lib.CA.Extraction.Transaction.MT942Item
		 * @prop {string} paymentMethod Transaction Type (translated)
		 * @prop {string} paymentDate Entry date
		 * @prop {number} paidAmount Transaction amount (with sign)
		 * @prop {number} paidAmountInForeignCurrency Paid amount in foreign currency, if found.
		 * @prop {string} payer Payer reference, if found
		 * @prop {string} payerName Payer name, if found
		 * @prop {string} transactionID Payment reference
		 * @prop {string} currency Transaction currency (copy of statement currency)
		 * @prop {string} foreignCurrency Currency code of foreign payment, if found.
		 * @prop {string} fundsType Funds code. C = credit, RC = Reversal of credit D = debit, RD = Reversal of debit
		 * @prop {number} typeCode Transaction Type Identification Code
		 * @prop {string} valueDate Value date in UTC (yyyy-MM-dd format)
		 * @prop {string} details Content of relevant 86 tag(s), may be multiline ('\n' separated)
		 * @prop {string} extraDetails Optional, extra details (supplementary details)
		 * @prop {Object.<string, string>} structuredDetails Optional, if detected, parsed details in form of { subtag: value }
		 * @prop {string} referenceNumber Bank reference
		 * @prop {string} payeeNumber Payee account identification
		 */

		/**
		 * Definition of CFONB statement item. This item also defines the statement item for CFONB240. extends {@link Lib.CA.Extraction.Transaction}
		 * @interface Lib.CA.Extraction.Transaction.CFONBItem
		 * @prop {string} paymentMethod Transaction Type (translated)
		 * @prop {string} paymentDate Entry date
		 * @prop {number} paidAmount Transaction amount (with sign)
		 * @prop {number} paidAmountInForeignCurrency Paid amount in foreign currency, if found.
		 * @prop {string} payer Payer reference, if found
		 * @prop {string} payerName Payer name, if found
		 * @prop {string} transactionID Payment reference
		 * @prop {string} currency Transaction currency (copy of statement currency)
		 * @prop {string} foreignCurrency Currency code of foreign payment, if found.
		 * @prop {number} typeCode Transaction Type Identification Code
		 * @prop {string} valueDate Value date in UTC (yyyy-MM-dd format)
		 * @prop {string} details Content of relevant 05 tag(s), may be multiline ('\n' separated)
		 * @prop {Object.<string, string>} structuredDetails Optional, if detected, parsed details in form of { subtag: value }
		 * @prop {string} referenceNumber Bank reference
		 * @prop {string} payeeNumber Payee account identification
		 */

		/**
		 * Definition of NORMA43 statement item. extends {@link Lib.CA.Extraction.Transaction}
		 * @interface Lib.CA.Extraction.Transaction.Norma43Item
		 * @prop {string} paymentMethod Transaction Type (translated)
		 * @prop {string} paymentDate Entry date
		 * @prop {number} paidAmount Transaction amount (with sign)
		 * @prop {number} paidAmountInForeignCurrency Paid amount in foreign currency, if found.
		 * @prop {string} payer Payer reference, if found
		 * @prop {string} payerName Payer name, if found
		 * @prop {string} transactionID Payment reference
		 * @prop {string} currency Transaction currency (copy of statement currency)
		 * @prop {string} foreignCurrency Currency code of foreign payment, if found.
		 * @prop {number} typeCode Transaction Type Identification Code
		 * @prop {string} valueDate Value date in UTC (yyyy-MM-dd format)
		 * @prop {string} details Content of lines
		 * @prop {string} payeeNumber Payee account identification
		 * @prop {string} referenceNumber1 Reference 1
		 * @prop {string} referenceNumber2 Reference 2
		 */

		/**
		 * Definition of EDI820Item statement item. extends {@link Lib.CA.Extraction.Transaction}
		 * @interface Lib.CA.Extraction.Transaction.EDI820Item
		 * @prop {string} paymentMethod Transaction Type (translated)
		 * @prop {string} paymentDate Entry date
		 * @prop {number} paidAmount Transaction amount (with sign)
		 * @prop {string} payer Payer reference, if found
		 * @prop {string} payerName Payer name will match the payer reference
		 * @prop {string} transactionID Payment reference
		 * @prop {string} currency Transaction currency
		 * @prop {number} typeCode Transaction Type Identification Code
		 * @prop {string} payeeNumber Payee account identification
		 * @prop {string} bankDetailsRaw string with the following pieces - invoiceNumber,netPayment,discountTaken,invoiceAmount,adjustmentReasonCode,penaltyAmount,billOfLading,documentType
		 * @prop {string} bankDetails string with the following pieces - Invoice Number,Invoice Amount,Net Payment,Discount Taken,Penalty Amount,Adjustment Reason or NTE
		 */

		/**
		 * Definition of EDI820Line. extends {@link Lib.CA.Extraction.Transaction}
		 * @interface Lib.CA.Extraction.Transaction.EDI820Line
		 * @prop {number} amount The amount of the transaction
		 * @prop {string} paymentMethod The method of payment
		 * @prop {string} paymentDate The date of the payment
		 * @prop {string} reference The reference for the payment
		 * @prop {string} currency The currency of the payment
		 * @prop {string} payerName The name of the payer
		 * @prop {string} payeeAccountNumber The account number of the payee
		 * @prop {string} bankDetails The bank details associated with the payment
		 * @prop {remittanceDetail[]} invoiceDetails The details of the invoices associated with the payment
		 * @prop {noteDetail[]} notes The notes associated with the payment
		 * @prop {string} foreignCurrency The foreign currency of the payment
		 * @prop {number} foreignAmount The amount of the payment in the foreign currency
		 * @prop {string[]} custom Custom storage for additional information
		 */

		/**
		 * Definition of CAMT053 statement item. extends {@link Lib.CA.Extraction.Transaction}
		 * @interface Lib.CA.Extraction.Transaction.CAMT053Item
		 * @prop {string} paymentMethod most specific Transaction Type Code
		 * @prop {string} paymentDate Booking Date or Value Date
		 * @prop {number} paidAmount Transaction amount (with sign)
		 * @prop {number} paidAmountInForeignCurrency
		 * @prop {string} payer
		 * @prop {string} payerName
		 * @prop {string} transactionID Transaction reference
		 * @prop {string} currency Transaction currency defaults to account
		 * @prop {string} foreignCurrency
		 * @prop {string} details from EndToEndId
		 * @prop {string} extraDetails from AddtlNtryInf
		 * @prop {string} referenceNumber account service reference
		 * @prop {string} payeeNumber Account number from account level
		 * @prop {string} userExitInfo Available to pass info between user exits
		 */

		/**
		 * Definition of Lib.CA.Lockbox.Extraction.LockboxItem. extends {@link Lib.CA.Extraction.Transaction}
		 * @interface Lib.CA.Lockbox.Extraction.LockboxItem
		 * @prop {string} typeCode Transaction Type Identification Code
		 * @prop {string} payeeNumber Payee account identification
		 * @prop {string} bankDetailsRaw JSON stringified array of {@link LineItemDetail} objects
		 * @prop {string} bankDetails Bank details retrieved from the lockbox
		 * @prop {string} payerAccountNumber Payer account identification
		 * @prop {number} invoicesOnlyAmount Paid amount considering only invoices
		 * @prop {string} bankNumber Payer bank number
		 * @prop {string} documentNumber Document number
		 * @prop {string} customerZipcode Customer zip code
		 * @prop {string} lockboxNumber Lockbox number
		 * @prop {string} checkNumber Check number
		 * @prop {string} lockboxBatchNumber Batch number of the lockbox
		 * @prop {string} lockboxTransactionNumber Transaction number of the lockbox
		 * @prop {string} companyCode Company code
		 * @prop {string} paymentConfigurationName Name of the payment configuration to apply
		 * @prop {string} remittanceConfigurationName Name of the remittance configuration to apply
		 * @prop {string[]} remittanceImageFileNames List of remittance image file names in the lockbox
		 * @prop {string[]} supportingImageFileNames List of supporting image file names in the lockbox
		 * @prop {string} remittanceAdviceRUIDEx RuidEx of the associated remittance advice, if one was created from the lockbox
		 */

		/**
		 * Definition of Lib.CA.Extraction.Transaction
		 * @interface Lib.CA.Extraction.Transaction
		 * @prop {string} paymentMethod The method of payment
		 * @prop {string} paymentDate The date of the payment
		 * @prop {number} paidAmount Transaction amount (with sign)
		 * @prop {number} paidAmountInForeignCurrency Paid amount in foreign currency, if found.
		 * @prop {string} payer Payer reference, if found
		 * @prop {string} payerName Payer name, if found
		 * @prop {string} transactionID Transaction reference
		 * @prop {string} checkNumber
		 * @prop {string} currency Transaction currency
		 * @prop {string} foreignCurrency Currency code of foreign payment, if found.
		 * @prop {string} bankName
		 * @prop {string} fileType
		 * @prop {string} fileName
		 * @prop {Date} submissionDate
		 * @prop {Lib.CA.Payment.Allocate.Common.SkipReason} skipReason
		 * @prop {string} combinedInfo
		 * @prop {ESKMap<string>} customMappingInfo
		 * @prop {Lib.CA.Payment.MatchingItems.AdjustmentAccountAllocation[]} customAdjustmentInfo
		 */

		/**
		 * Definition of Lib.CA.Payment.Allocate.Common.SkipReason
		 * @interface Lib.CA.Payment.Allocate.Common.SkipReason
		 * @prop {string} DUPLICATE "DUPLICATE"
		 * @prop {string} DEBIT "DEBIT"
		 * @prop {string} TRANSACTION_SKIPPED "TRANSACTION_SKIPPED"
		 * @prop {string} TRANSACTION_FILTERED "TRANSACTION_FILTERED"
		 * @prop {string} PAYER_SKIPPED "PAYER_SKIPPED"
		 * @prop {string} CUSTOM "CUSTOM"
		 * @prop {string} BANK_FILE "BANK_FILE"
		 * @prop {string} NONE ""
		 */

		/**
		 * Definition of Lib.CA.Payment.MatchingItems.AdjustmentAccountAllocation
		 * @interface Lib.CA.Payment.MatchingItems.AdjustmentAccountAllocation
		 * @prop {string} Number
		 * @prop {number} Amount
		 * @prop {string} DocumentNumber
		 * @prop {string} Description
		 * @prop {number} LineIdxInRemittance
		 * @prop {number} DiscountAmount
		 * @prop {string} DeductionNumber
		 * @prop {string} DeductionRuidex
		 * @prop {string} CustomerID
		 * @prop {string} ReasonCode
		 * @prop {string} TaxCode
		 * @prop {string} DestinationCompanyCode
		 * @prop {boolean} PreventsAutoAllocation
		 * @prop {Lib.CA.Payment.MatchingItems.CustomField[]} CustomFields
		 * @prop {string} CustomPaymentFileTableType
		 * @prop {Lib.CA.Payment.Allocate.Common.AdjustmentType} AdjustmentType Only available for Customer adjustments
		 * @prop {string} CostCenter Only available for G/L adjustments
		 * @prop {string} ProfitCenter Only available for G/L adjustments
		 * @prop {boolean} ToVerify Only available for G/L adjustments
		 */

		/**
		 * Definition of Lib.CA.Payment.Allocate.Common.AdjustmentType
		 * @interface Lib.CA.Payment.Allocate.Common.AdjustmentType
		 * @prop {string} NORMAL "NORMAL"
		 * @prop {string} RECYCLED_ADJUSTMENT "RECYCLED_ADJUSTMENT"
		 * @prop {string} RECYCLE_REVERSAL "RECYCLE_REVERSAL"
		 */

		/**
		 * Definition of TransactionType object
		 * @interface Lib.CA.CashApp.Customization.Extraction.TransactionType
		 * @prop {string} applicableFileType File type as defined in GetExtractionType
		 * @prop {string} id Transaction type as string
		 * @prop {string|number} code Transaction type as string or number
		 * @prop {string} name Transaction type name
		 */

		/**
		 * Definition of Transaction object
		 * @interface Lib.CA.CashApp.Customization.Extraction.Transaction
		 * @prop {string} BankReference
		 * @prop {string} CustomerReference
		 * @prop {string} Text
		 * @prop {Lib.CA.CashApp.Customization.Extraction.Fund} Fund
		 */

		/**
		 * Definition of Fund object
		 * @interface Lib.CA.CashApp.Customization.Extraction.Fund
		 * @prop {number} Amount
		 * @prop {string} FundsType
		 * @prop {number} ItemCount
		 * @prop {number} TypeCode
		 * @prop {Date} ValueDate
		 * @prop {string} ValueTime
		 */

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.GetExtractionType
		 * @since 185
		 * @description
		 * Allows you to customize the type of extraction for the Cash Application process based on the format of the incoming payment file.
		 * This user exit is called at the end of the extraction script of the process.
		 *
		 * @returns {string|null} This function has two kinds of return value:
		 * * A `string` representing the name of extraction format. The default value indicates that no extraction is selected. The following extraction types are available:
		 *
		 *  Document format   | Extraction type
		 * -------------------|--------------------
		 * `BAI2`             | bai2
		 * `Custom CSV`       | customcsv
		 * `null` indicating that the extraction is automatically detected based on process attachments.
		 *
		 * @example The following example disables the automatic detection of the type of extraction
		 * GetExtractionType: function ()
		 * {
		 * 	return "default";
		 * }
		 * @example The following example sets the extraction type to customjson1 if the Account Number node of the JSON file contains a value
		 * GetExtractionType: function ()
		 * {
		 * 	var parsedJson = JSON.parse(Attach.GetContent(0));
		 *
		 * 	// If an account number is found in any entry, then checks can be extracted from this JSON
		 * 	for (var i = 0; i < parsedJson.length; i++)
		 * 	{
		 * 		var currentPayment = parsedJson[i];
		 * 		if (currentPayment)
		 * 		{
		 * 			var accountNumber = currentPayment.CAccount;
		 * 			if (accountNumber)
		 * 			{
		 * 				return "customjson1";
		 * 			}
		 * 		}
		 * 	}
		 * 	return null;
		 * }
		 */
		/*GetExtractionType: function ()
		{
			return null;
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.PaymentFileProcessingExtractDataFromDocument
		 * @since 185
		 * @description
		 * This function is used to setup payment file extraction. It can be used to customize the extraction of new file types
		 *
		 * @param {string} extractionType Allows to run specific extraction depending on the selected extraction type
		 * (returned by the GetExtractionType user exit or specified by the configurator).
		 *
		 * @example <caption>Checks extraction from custom JSON format</caption>
		 * PaymentFileProcessingExtractDataFromDocument: function (extractionType)
		 * {
		 * 	Data.SetValue("File_type__", Sys.CA.Common.BankStatementType.Other);
		 * 	var paymentItem = [];
		 * 	var numberOfPayments = 0;
		 * 	var totalAmount = 0;
		 * 	var numberOfSkippedPayments = 0;
		 *
		 * 	var parsedJson = JSON.parse(Attach.GetContent(0));
		 *
		 * 	var currency = "";
		 * 	for (var i = 0; i < parsedJson.length; i++)
		 * 	{
		 * 		var currentPayment = parsedJson[i];
		 * 		if (currentPayment)
		 * 		{
		 * 			numberOfPayments++;
		 * 			var paymentDate = new Date(currentPayment.CaptureTime);
		 * 			var transactionType = Lib.CA.Transactions.GetTransactionTypeByCode(currentPayment.ItemType, Sys.CA.Common.BankStatementType.Other);
		 * 			currency = currentPayment.Currency;
		 * 			var item = {
		 * 				paymentMethod: transactionType ? transactionType.id : Language.Translate(""_Unknown transaction type : {0}"", true, currentPayment.ItemType),
		 * 				paymentDate: isFinite(paymentDate.getTime()) ? Sys.Helpers.Date.Date2DBDateTime(paymentDate) : "",
		 * 				paidAmount: Number(currentPayment.CheckAmount),
		 * 				payer: (currentPayment.CRouting || "") + (currentPayment.CAccount || ""),
		 * 				payerName: "",
		 * 				transactionID: currentPayment.TransactionID || "",
		 * 				bankNumber: currentPayment.CRouting || "",
		 * 				accountNumber: currentPayment.CAccount || "",
		 * 				checkNumber: currentPayment.CNumber || "",
		 * 				typeCode: currentPayment.ItemType || "",
		 * 				currency: currentPayment.Currency || ""
		 * 			};
		 *
		 *			// Keep credit transactions only
		 *			if (item.paidAmount < 0)
		 *			{
		 *				// Ignore debits
		 *				item.skipReason = Lib.CA.Payment.Allocate.Common.SkipReason.DEBIT;
		 *				numberOfSkippedPayments++;
		 *			}
		 *			else // Only search for duplicates for non-debits, because we always skip debits
		 *			{
		 *				let dupeFound = Lib.CA.Extraction.DuplicateSearch(Sys.CA.Common.BankStatementType.Other, item);
		 *				if (dupeFound)
		 *				{
		 *					item.skipReason = Lib.CA.Payment.Allocate.Common.SkipReason.DUPLICATE;
		 *					numberOfSkippedPayments++;
		 *				}
		 *			}
		 *
		 * 			paymentItem.push(item);
		 * 			totalAmount += Number(item.paidAmount);
		 *
		 * 			currency = item.currency || "";
		 * 		}
		 * 	}
		 *
		 * 	Variable.SetValueAsString("Number_of_skipped_payments__", numberOfSkippedPayments);
		 * 	Data.SetValue("Number_of_payments__", numberOfPayments);
		 * 	Data.SetValue("Total_amount__", totalAmount);
		 * 	Data.SetValue("Currency__", currency);
		 *
		 * 	Variable.SetValueAsString("ruid", Data.GetValue("RuidEx"));
		 * 	Variable.SetValueAsString("check_json", JSON.stringify(paymentItem));
		 * }
		 * @example <caption>Payments extraction from custom CSV format</caption>
		 * PaymentFileProcessingExtractDataFromDocument: function (extractionType)
		 * {
		 * 	if (extractionType === "CUSTOM_CSV")
		 * 	{
		 * 		var paymentItem = [];
		 * 		var numberOfPayments = 0;
		 * 		var totalAmount = 0;
		 * 		var numberOfSkippedPayments = 0;
		 *
		 * 		var accountNumber = Attach.GetName(0).replace(".csv", "");
		 * 		var csvHelper = Sys.Helpers.CSVReader.CreateInstance(0, "V2");
		 * 		csvHelper.ReturnSeparator = "\n";
		 * 		csvHelper.GuessSeparator();
		 * 		var line = csvHelper.GetNextLine();
		 * 		while (line !== null)
		 * 		{
		 * 			var lineArray = csvHelper.GetCurrentLineArray();
		 * 			if (lineArray)
		 * 			{
		 * 				var paymentAmount = Number(lineArray[csvHelper.GetHeaderIndex("Amount")]);
		 *
		 * 				numberOfPayments++;
		 * 				var paymentDateStr = lineArray[csvHelper.GetHeaderIndex("Date")].split('/');
		 * 				var paymentDate = new Date(parseInt(paymentDateStr[2], 10), parseInt(paymentDateStr[0], 10) - 1, parseInt(paymentDateStr[1], 10), 0, 0, 0, 0);
		 * 				var paymentDescription = lineArray[csvHelper.GetHeaderIndex("Label")] || "";
		 * 				var fileTransactionID = lineArray[csvHelper.GetHeaderIndex("TransactionID")] || "";
		 *
		 * 				var item = {
		 * 					paymentDate: Sys.Helpers.Date.Date2DBDateTime(paymentDate),
		 * 					paidAmount: Number(paymentAmount),
		 * 					additionalInformation: paymentDescription,
		 * 					payeeNumber: accountNumber,
		 * 					currency: "USD",
		 * 					referenceNumber: "",
		 * 					paymentMethod: "",
		 * 					transactionID: fileTransactionID
		 * 				};
		 *
		 * 				item.paymentMethod = paymentDescription.indexOf("CHECK ") === 0 ? "CHECK_PAID" :
		 * 					(paymentDescription.indexOf("BANK TRANSFER ") === 0 ? "INCOMING_MONEY_TRANSFERT" : "CREDIT");
		 *
		 *				// Keep credit transactions only
		 *				if (item.paidAmount < 0)
		 *				{
		 *					// Ignore debits
		 *					item.skipReason = Lib.CA.Payment.Allocate.Common.SkipReason.DEBIT;
		 *					numberOfSkippedPayments++;
		 *				}
		 *				else // Only search for duplicates for non-debits, because we always skip debits
		 *				{
		 *					let dupeFound = Lib.CA.Extraction.DuplicateSearch(Sys.CA.Common.BankStatementType.Other, item);
		 *					if (dupeFound)
		 *					{
		 *						item.skipReason = Lib.CA.Payment.Allocate.Common.SkipReason.DUPLICATE;
		 *						numberOfSkippedPayments++;
		 *					}
		 *				}
		 *
		 * 				totalAmount += Number(item.paidAmount);
		 * 				paymentItem.push(item);
		 * 			}
		 * 			line = csvHelper.GetNextLine();
		 * 		}
		 *
		 * 		Variable.SetValueAsString("Number_of_skipped_payments__", numberOfSkippedPayments);
		 * 		Data.SetValue("Number_of_payments__", numberOfPayments);
		 * 		Data.SetValue("Total_amount__", totalAmount);
		 * 		Data.SetValue("File_type__", "BAI2");	// Required value
		 * 		Data.SetValue("Payee_bank_number__", accountNumber);
		 * 		Data.SetValue("Currency__", "USD");
		 *
		 * 		// Required variables
		 * 		Variable.SetValueAsString("ruid", Data.GetValue("RuidEx"));
		 * 		Variable.SetValueAsString("bai2_json", JSON.stringify(paymentItem));
		 * 	}
		 * }
		 */
		/*PaymentFileProcessingExtractDataFromDocument: function (extractionType)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.InitializePaymentFileProcessingExtraction
		 * @since 185
		 * @description
		 * This function is used to customize the Payment File data extraction, at the beginning of the extraction process
		 *
		 */
		/*InitializePaymentFileProcessingExtraction: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.FinalizePaymentFileProcessingExtraction
		 * @since 185
		 * @description
		 * This function is used to customize the Payment File data extraction, at the end of the extraction process
		 *
		 */
		/*FinalizePaymentFileProcessingExtraction: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.InitializePaymentMatchingExtraction
		 * @since 185
		 * @description
		 * This function is used to customize the Payment Matching data extraction, at the beginning of the extraction process
		 *
		 */
		/*InitializePaymentMatchingExtraction: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.FinalizePaymentMatchingExtraction
		 * @since 185
		 * @description
		 * This function is used to customize the Payment Matching data extraction, at the end of the extraction process
		 *
		 */
		/*FinalizePaymentMatchingExtraction: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.GetPayerName
		 * @since 191
		 * @description
		 * Allows to extract/override a payer name for current bank statement item.
		 * @param {string} statementType Bank statement type. Depends on the input file format. Currently supported files:
		 *  statementType value   | Interface type
		 * -------------------|--------------------
		 * `BAI2`             | {@link Lib.CA.Extraction.Transaction.Bai2Item}
		 * `MT940`            | {@link Lib.CA.Extraction.Transaction.MT940Item}
		 * `MT942`            | {@link Lib.CA.Extraction.Transaction.MT942Item}
		 * `CFONB`            | {@link Lib.CA.Extraction.Transaction.CFONBItem}
		 * `CFONB240`         | {@link Lib.CA.Extraction.Transaction.CFONBItem}
		 * `NORMA43`          | {@link Lib.CA.Extraction.Transaction.Norma43Item}
		 * `CAMT053`          | {@link Lib.CA.Extraction.Transaction.CAMT053Item}
		 * `RemittanceAdvice` | {@link Lib.CA.Lockbox.Extraction.LockboxItem}
		 * @param {
		 * Lib.CA.Extraction.Transaction.Bai2Item|
		 * Lib.CA.Extraction.Transaction.MT940Item|
		 * Lib.CA.Extraction.Transaction.MT942Item|
		 * Lib.CA.Extraction.Transaction.CFONBItem|
		 * Lib.CA.Extraction.Transaction.Norma43Item|
		 * Lib.CA.Extraction.Transaction.CAMT053Item|
		 * Lib.CA.Lockbox.Extraction.LockboxItem
		 * } item Bank statement item. Structure depends on statement type
		 * @returns {string} A custom payer name for the current transaction.
		 * @example <caption>Extracts payer name from MT940 :86: field</caption>
		 * GetPayerName: function (statementType, item)
		 * {
		 * 	// For this example, item.details contains:
		 * 	// "BAI=165;ORIG CO NAME=ASAP;ORIG ID=9051036803;DESC DATE=120325;ENT\n
		 * 	// RY DESCR=GRANT PAY;ENTRY CLASS=CTX;TRACE NO=021000027405071;ENTRY\n
		 * 	//  DATE=12090326;IND ID NO=03251209C0000018;IND NAME=0008UNIV JPMCROCHISA"
		 * 	if (statementType === "MT940" && item.details)
		 * 	{
		 * 		var details = item.details.split(";");
		 * 		var parsedDetails = {};
		 * 		for (var index = 0; index < details.length; index++)
		 * 		{
		 * 			var detailKeyValue = details[index].split("=");
		 * 			parsedDetails[detailKeyValue[0]] = detailKeyValue[1];
		 * 		}
		 * 		return parsedDetails["IND NAME"];
		 * 	}
		 * }
		 */
		/*GetPayerName: function (statementType, item)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.GetPayerReference
		 * @since 191
		 * @description
		 * Allows to extract/override a payer reference for current bank statement item.
		 * @param {string} statementType Bank statement type. Depends on the input file format. Currently supported files:
		 *  statementType value   | Interface type
		 * -------------------|--------------------
		 * `BAI2`             | {@link Lib.CA.Extraction.Transaction.Bai2Item}
		 * `MT940`            | {@link Lib.CA.Extraction.Transaction.MT940Item}
		 * `MT942`            | {@link Lib.CA.Extraction.Transaction.MT942Item}
		 * `CFONB`            | {@link Lib.CA.Extraction.Transaction.CFONBItem}
		 * `CFONB240`         | {@link Lib.CA.Extraction.Transaction.CFONBItem}
		 * `NORMA43`          | {@link Lib.CA.Extraction.Transaction.Norma43Item}
		 * `CAMT053`          | {@link Lib.CA.Extraction.Transaction.CAMT053Item}
		 * `RemittanceAdvice` | {@link Lib.CA.Lockbox.Extraction.LockboxItem}
		 * @param {
		 * Lib.CA.Extraction.Transaction.Bai2Item|
		 * Lib.CA.Extraction.Transaction.MT940Item|
		 * Lib.CA.Extraction.Transaction.MT942Item|
		 * Lib.CA.Extraction.Transaction.CFONBItem|
		 * Lib.CA.Extraction.Transaction.Norma43Item|
		 * Lib.CA.Extraction.Transaction.CAMT053Item|
		 * Lib.CA.Lockbox.Extraction.LockboxItem
		 * } item Bank statement item. Structure depends on statement type
		 * @returns {string} A custom payer reference for the current transaction.
		 * @example <caption>Extracts payer reference from MT940 :86: field</caption>
		 * GetPayerReference: function (statementType, item)
		 * {
		 * 	// For this example, item.details contains:
		 * 	// "BAI=165;ORIG CO NAME=ASAP;ORIG ID=9051036803;DESC DATE=120325;ENT\n
		 * 	// RY DESCR=GRANT PAY;ENTRY CLASS=CTX;TRACE NO=021000027405071;ENTRY\n
		 * 	//  DATE=12090326;IND ID NO=03251209C0000018;IND NAME=0008UNIV JPMCROCHISA"
		 * 	if (statementType === "MT940" && item.details)
		 * 	{
		 * 		var details = item.details.split(";");
		 * 		var parsedDetails = {};
		 * 		for (var index = 0; index < details.length; index++)
		 * 		{
		 * 			var detailKeyValue = details[index].split("=");
		 * 			parsedDetails[detailKeyValue[0]] = detailKeyValue[1];
		 * 		}
		 * 		return parsedDetails["IND ID NO"];
		 * 	}
		 * }
		 */
		/*GetPayerReference: function (statementType, item)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.CustomizeBlankTransactionID
		 * @since 265
		 * @description
		 * Function to customize the transaction ID for a payment if one is not extracted.
		 * @param {string} statementType Bank statement type. Depends on the input file format. Currently supported files:
		 *  statementType value   | Interface type
		 * -------------------|--------------------
		 * `BAI2`             | {@link Lib.CA.Extraction.Transaction.Bai2Item}
		 * `MT940`            | {@link Lib.CA.Extraction.Transaction.MT940Item}
		 * `MT942`            | {@link Lib.CA.Extraction.Transaction.MT942Item}
		 * `CFONB`            | {@link Lib.CA.Extraction.Transaction.CFONBItem}
		 * `CFONB240`         | {@link Lib.CA.Extraction.Transaction.CFONBItem}
		 * `NORMA43`          | {@link Lib.CA.Extraction.Transaction.Norma43Item}
		 * `CAMT053`          | {@link Lib.CA.Extraction.Transaction.CAMT053Item}
		 * `RemittanceAdvice` | {@link Lib.CA.Lockbox.Extraction.LockboxItem}
		 * @param {
		 * Lib.CA.Extraction.Transaction.Bai2Item|
		 * Lib.CA.Extraction.Transaction.MT940Item|
		 * Lib.CA.Extraction.Transaction.MT942Item|
		 * Lib.CA.Extraction.Transaction.CFONBItem|
		 * Lib.CA.Extraction.Transaction.Norma43Item|
		 * Lib.CA.Extraction.Transaction.CAMT053Item|
		 * Lib.CA.Lockbox.Extraction.LockboxItem
		 * } item Bank statement item. Structure depends on statement type
		 * @returns {string} The Transaction ID to set on the payment
		 * @example <caption>This example will set the transaction ID to the concatenated value of the payment date(only the date portion, excluding the time) and the payment method.</caption>
		 * CustomizeBlankTransactionID: function (statementType, item)
		 * {
		 *	return item.paymentDate.split(" ")[0] + item.paymentMethod;
		 * }
		 */
		/*CustomizeBlankTransactionID: function (statementType, item)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.CustomizeChecksCSVColumns
		 * @since 179
		 * @description
		 * Modifies column names of the Check CSV file.
		 * This user exit is called in the extraction script of the Payment File Processing process
		 * @returns {Map.<string,string>} A map of Check field/column name
		 * @example
		 * CustomizeChecksCSVColumns: function()
		 * {
		 * 	var mapping = {};
		 *
		 * 	mapping["transactionID"] = "TransactionID";
		 * 	mapping["bankNumber"] = "CRouting";
		 * 	mapping["accountNumber"] = "CAccount";
		 * 	mapping["checkNumber"] = "CNumber";
		 * 	mapping["paidAmount"] = "CheckAmount";
		 * 	mapping["paymentDate"] = "CaptureTime";
		 *
		 * 	return mapping;
		 * }
		 */
		/*CustomizeChecksCSVColumns: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.CustomizeChecksCSVEntry
		 * @since 179
		 * @description
		 * Modifies the data read from the CSV file.
		 * This user exit is called in the extraction script of the Payment File Processing process
		 *
		 * @param {CheckDepositItem} item the item read from the csv to modify
		 * @example
		 * CustomizeChecksCSVEntry: function(item)
		 * {
		 * 	// The check numbers in the csv have 2 characters at the beginning that we don't want to retrieve so we substring it
		 * 	item.checkNumber = item.checkNumber.substring(2);
		 * }
		 */
		/*CustomizeChecksCSVEntry: function(item)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.GetTransactionTypeByCode
		 * @since 191
		 * @description
		 * This function returns detailed information about given transaction code
		 * @param {string|number} code Transaction type as string or number
		 * @param {string} fileType File type as defined in GetExtractionType
		 * @returns {Lib.CA.CashApp.Customization.Extraction.TransactionType} A structure corresponding to a given transaction code
		 * @example
		 * GetTransactionTypeByCode: function(code, fileType)
		 * {
		 * 	if (fileType === "customcsv")
		 * 	{
		 * 		switch (code)
		 * 		{
		 * 			case 123:
		 * 				return {
		 * 					applicableFileType: fileType,
		 * 					id: "CUSTOM_TRANSACTION_1",
		 * 					code: code,
		 * 					name: "Custom transaction type 1"
		 * 				};
		 * 			case 456:
		 * 				return {
		 * 					applicableFileType: fileType,
		 * 					id: "CUSTOM_TRANSACTION_2",
		 * 					code: code,
		 * 					name: "Custom transaction type 2"
		 * 				};
		 * 			default:
		 * 				return null;
		 * 		}
		 * 	}
		 * 	return null;
		 * }
		 */
		/*GetTransactionTypeByCode: function(code, fileType)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.GetTransactionTypeByID
		 * @since 191
		 * @description
		 * This function returns detailed information about given transaction id
		 * @param {string} id Transaction type as string
		 * @param {string} fileType File type as defined in GetExtractionType
		 * @returns {Lib.CA.CashApp.Customization.Extraction.TransactionType} A structure corresponding to a given transaction id
		 * @example
		 * GetTransactionTypeByID: function(id, fileType)
		 * {
		 * 	if (fileType === "customcsv")
		 * 	{
		 * 		switch (id)
		 * 		{
		 * 			case "CUSTOM_TRANSACTION_1":
		 * 				return {
		 * 					applicableFileType: fileType,
		 * 					id: id,
		 * 					code: 123,
		 * 					name: "Custom transaction type 1"
		 * 				};
		 * 			case "CUSTOM_TRANSACTION_2":
		 * 				return {
		 * 					applicableFileType: fileType,
		 * 					id: id,
		 * 					code: 456,
		 * 					name: "Custom transaction type 2"
		 * 				};
		 * 			default:
		 * 				return null;
		 * 		}
		 * 	}
		 * 	return null;
		 * }
		 */
		/*GetTransactionTypeByID: function(id, fileType)
		{
		},*/

		/**
		 * Definition of TransactionConfig
		 * @interface Lib.CA.CashApp.Customization.Extraction.TransactionConfig
		 * @prop {string} filter (optional) LDAP filter to include or exclude a transaction type depending on its content
		 * @prop {boolean} activated If true, payments of current transaction type will be processed for allocation
		 */

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.GetSupportedTransactions
		 * @since 191
		 * @param {string} fileType File type as defined in GetExtractionType
		 * @returns { Map.<string, Lib.CA.CashApp.Customization.Extraction.TransactionConfig> } Dictionary of transaction types
		 * @example
		 * GetSupportedTransactions: function(fileType)
		 * {
		 * 	if (fileType === "customcsv")
		 * 	{
		 * 		return {
		 * 			"CUSTOM_TRANSACTION_1": {
		 * 				filter: "",
		 * 				activated: true
		 * 			},
		 * 			"CUSTOM_TRANSACTION_2": {
		 * 				filter: "",
		 * 				activated: true
		 * 			}
		 * 		}
		 * 	}
		 * 	return null;
		 * }
		 */
		/*GetSupportedTransactions: function(fileType)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.GetInvoiceNumbersFromDescription
		 * @since 194
		 * @description
		 * This function is called prior to running the matching engine on a payment.
		 * This will extract a list of invoice numbers from the provided description string
		 * @param {string} description Payment description
		 * @param {string} fileType File type as defined in GetExtractionType
		 * @returns {string[]} the list of invoice numbers parsed from the provided description
		 * @example <caption>The following example parses the invoice numbers in a specific complex format.
		 * Example of this format: "invoices:4870:012;013;014" is parsed into the invoice numbers "4870012", "4870013", and "4870014"</caption>
		 * GetInvoiceNumbersFromDescription: function (description, fileType)
		 * {
		 * 	var invoiceNumbersFound = [];
		 * 	var startDelimiter = "invoices:";
		 * 	var startIndex = description.indexOf(startDelimiter );
		 * 	var endIndex = description.indexOf(" ", startIndex);
		 * 	var interestingPartOfDescription = description.slice(startIndex + startDelimiter .length, endIndex);
		 * 	var endOfStartingInvoiceDefinition = interestingPartOfDescription.indexOf(":");
		 * 	var startingInvoiceDefinition = interestingPartOfDescription.slice(0, endOfStartingInvoiceDefinition );
		 * 	interestingPartOfDescription = interestingPartOfDescription.slice(endOfStartingInvoiceDefinition +1).trim();
		 * 	var invoiceEndings = interestingPartOfDescription.split(";");
		 * 	for (var key in invoiceEndings) {
		 * 		if (invoiceEndings.hasOwnProperty(key)) {
		 * 			invoiceNumbersFound.push(startingInvoiceDefinition + invoiceEndings[key]);
		 * 		}
		 * 	}
		 * 	return invoiceNumbersFound;
		 * }
		 */
		/*GetInvoiceNumbersFromDescription: function (description, fileType)
		{
			return null;
		},*/

		/**
		 * Definition of remittanceDetail item
		 * @interface Lib.CA.TXTExtraction.EDI820.remittanceDetail
		 * @prop {string} invoiceNumber Document number for the item (can be invoice number or deduction/claim number)
		 * @prop {string} netPayment Net payment amount
		 * @prop {string} discountTaken Discount applied to the item
		 * @prop {string} invoiceAmount Invoice amount
		 * @prop {string} adjustmentReasonCode Adjustment reason code
		 * @prop {string} penaltyAmount Penalty amount
		 * @prop {string} billOfLading Bill of Lading can be used to find the invoice number, if one is not provided
		 * @prop {Lib.CA.Remittance.Common.RemittanceItemType} documentType One of "INVOICE_TYPE", "DEDUCTION_TYPE", "OTHER_TYPE", or "" for unknown
		 */

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.ParseRemittanceLineFromPaymentDescription
		 * @since 261
		 * @description
		 * This function is called after parsing each remittance line from an EDI820 payment file.
		 * This can be used set the remittance line's document type and/or customize the items parsed from the line.
		 * @param {string[]} segmentAry The raw line from Payment description, split on the separator
		 * @param {Lib.CA.TXTExtraction.EDI820.remittanceDetail} remittanceLine The parsed remittance line from the baseline
		 * @returns {Lib.CA.TXTExtraction.EDI820.remittanceDetail} Object with the details for the remittance line item
		 * @example <caption>The following example will set the remittance line's document type based on the invoice/document number format.</caption>
		 * ParseRemittanceLineFromPaymentDescription: function (segmentAry, remittanceLine)
		 * {
		 * 	// https://www.stedi.com/edi/x12-003050/segment/RMT
		 * 	if (segmentAry[0] == "RMT")
		 * 	{
		 * 		var identifier = remittanceLine.invoiceNumber.slice(0, 3);
		 * 		switch (identifier)
		 * 		{
		 * 			case "800":
		 * 				remittanceLine.documentType = Lib.CA.Remittance.Common.RemittanceItemType.Invoice;
		 * 				break;
		 * 			case "DED":
		 * 				remittanceLine.documentType = Lib.CA.Remittance.Common.RemittanceItemType.Deduction;
		 * 				break;
		 * 			default:
		 * 				remittanceLine.documentType = Lib.CA.Remittance.Common.RemittanceItemType.Other;
		 * 		}
		 * 		return remittanceLine;
		 * 	}
		 * 	return null;
		 * }
		 */
		/*ParseRemittanceLineFromPaymentDescription: function (segmentAry, remittanceLine)
		{
			return null;
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.ParseAdjustmentLineFromEDI820
		 * @since 328
		 * @description
		 * This function is called after parsing each adjustment line from an EDI820 payment file as delineated by the "ADX" segment.
		 * This can be used to set the adjustment line's document type and/or customize the items parsed from the line.
		 * @param {string[]} segmentAry The raw line from Payment description, split on the separator
		 * @param {Lib.CA.TXTExtraction.EDI820.remittanceDetail} adjustmentLine The parsed adjustment line from the baseline
		 * @returns {Lib.CA.TXTExtraction.EDI820.remittanceDetail} Object with the details for the adjustment line item
		 * @example <caption>The following example will override the adjustment line's reason code with a value that matches one in the supplier's default
		 * list. It will also override the adjustment line's document type according to its reference qualifier.</caption>
		 * ParseAdjustmentLineFromEDI820: function (segmentAry, adjustmentLine)
		 * {
		 * 	// https://www.stedi.com/edi/x12-003050/segment/ADX
		 *	let adjustmentReason = segmentAry[2];
		 *	switch (adjustmentReason)
		 *	{
		 *		case "01":
		 *			adjustmentLine.adjustmentReasonCode = "PRICE DISCREPANCY";
		 *			break;
		 *		default:
		 *			break;
		 *	}
		 *	let referenceQualifier = segmentAry[3];
		 *	switch (referenceQualifier)
		 *	{
		 *		case "CM":
		 *		case "CD":
		 *		case "CL":
		 *			adjustmentLine.documentType = Lib.CA.Remittance.Common.RemittanceItemType.Invoice;
		 *			break;
		 *		default:
		 *			adjustmentLine.documentType = Lib.CA.Remittance.Common.RemittanceItemType.Other;
		 *			break;
		 *	}
		 *	return adjustmentLine;
		 * }
		 */
		/*ParseAdjustmentLineFromEDI820: function (segmentAry, adjustmentLine)
		{
			return null;
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.GetInvoiceBillOfLadingFieldName
		 * @since 261
		 * @description
		 * This function is called prior to trying to find invoice numbers from Bill of Lading numbers for the remittance in the EDI 820 payment description.
		 * The default field name used is "Bill_of_lading__".
		 * @returns {string} Custom invoice field name holding the Bill of Lading.
		 * @example <caption>The following example specifies the Bill of Lading field name as "Additional_field_text_2__".</caption>
		 * GetInvoiceBillOfLadingFieldName: function ()
		 * {
		 * 	return "Additional_field_text_2__";
		 * }
		 */
		/*GetInvoiceBillOfLadingFieldName: function ()
		{
			return null;
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.FinalizeRemittanceFromPaymentDescription
		 * @since 261
		 * @description
		 * This function is called after parsing the remittance from the EDI 820 payment description.
		 * This can be used to customize/finalize the items present in the remittance from the payment's bank details.
		 * @param {Lib.CA.TXTExtraction.EDI820.remittanceDetail[]} remittanceDetails Structured remittance lines parsed from the payment description
		 * @returns {Lib.CA.TXTExtraction.EDI820.remittanceDetail[]} Updated remittance lines.
		 */
		/*FinalizeRemittanceFromPaymentDescription: function (remittanceDetails)
		{
			return null;
		},*/

		/**
		 * Definition of the noteDetail item
		 * @interface Lib.CA.TXTExtraction.EDI820.noteDetail
		 * @prop {string} noteRefCode Code of the note line
		 * @prop {string} noteDescription Content of the note line
		 */

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.FinalizeNotesFromPaymentDescription
		 * @since 275
		 * @description
		 * This function is called after parsing the notes from the EDI 820 payment description.
		 * This can be used to customize/finalize the items present in the list of notes from the payment's NTE lines.
		 * @param {Lib.CA.TXTExtraction.EDI820.noteDetail[]} noteDetails Structured note lines parsed from the payment's NTE lines.
		 * @returns {Lib.CA.TXTExtraction.EDI820.noteDetail[]} Updated note lines.
		 * @example <caption>The following example will combine note lines that were split across multiple lines.</caption>
		 * FinalizeNotesFromPaymentDescription: function (noteDetails)
		 * {
		 *	var newNotes = [];
		 *	newNotes.push(noteDetails[0]);
		 *	for (var i = 1; i < noteDetails.length; i++)
		 *	{
		 *		var sameRefCode = noteDetails[i - 1].noteRefCode === noteDetails[i].noteRefCode;
		 *		// Case where lines that continue from the previous note do not start with the character "/"
		 *		var continuationOfPreviousLine = noteDetails[i].noteDescription.indexOf("/") != 0;
		 *		if (sameRefCode && continuationOfPreviousLine)
		 *		{
		 *			newNotes[newNotes.length - 1].noteDescription += noteDetails[i].noteDescription;
		 *		}
		 *		else
		 *		{
		 *			newNotes.push(noteDetails[i]);
		 *		}
		 *	}
		 *	return newNotes;
		 * }
		 */
		/*FinalizeNotesFromPaymentDescription: function (noteDetails)
		{
			return null;
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.GetValidCurrencyEntityIdentifiersForEDI820
		 * @since 275
		 * @description
		 * This function is called before parsing the CUR line from an EDI820 file.
		 * This can be used to customize which entity identifier codes are expected to preceed the currency code on this line.
		 * By default, the identifier code "PR" (Payer) will be included. See {@link https://www.stedi.com/edi/x12-004010/segment/CUR} for a list of 1000+ possible entity identifier codes.
		 * @param {string[]} currencyEntityIdentifierCodes List of valid entity identifier codes that could preceed the currency code.
		 * @returns {string[]} Updated list of valid entity identifier codes.
		 */
		/*GetValidCurrencyEntityIdentifiersForEDI820: function (currencyEntityIdentifierCodes)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.PaymentDuplicateCheckFilter
		 * @since 306
		 * @description
		 * This function is used to customize the duplicate check LDAP filter for submitted payments
		 * @param {string} defaultFilter The default duplicate check filter which can be customized here
		 * @param {
		 * Lib.CA.Extraction.Transaction.Bai2Item|
		 * Lib.CA.Extraction.Transaction.MT940Item|
		 * Lib.CA.Extraction.Transaction.MT942Item|
		 * Lib.CA.Extraction.Transaction.CFONBItem|
		 * Lib.CA.Extraction.Transaction.EDI820Item|
		 * Lib.CA.Extraction.Transaction.Norma43Item|
		 * Lib.CA.Extraction.Transaction.CheckDepositItem|
		 * Lib.CA.Extraction.Transaction.CAMT053Item|
		 * Lib.CA.Lockbox.Extraction.LockboxItem
		 * } item additional item data to filter on
		 * @returns {string} The customized LDAP filter, used to search the payments table
		 * @example <caption>The following example adds a filter to allow duplicate payments to be processed on different company codes.</caption>
		 * PaymentDuplicateCheckFilter: function(defaultFilter, item)
		 * {
		 * 	return defaultFilter += "(Company_code__=" + (Sys.CA.GetParameter("Company_Name") || "") + ")";
		 * }
		 */
		/*PaymentDuplicateCheckFilter: function(defaultFilter, item)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.CombinePaymentMatchstring
		 * @since 263
		 * @description
		 * This function is used to customize the criteria for combining multiple payments into 1 payment.
		 * The setting needs to be enable to use this feature, and it is currently available for BAI2 format only.
		 * @param {Bai2Item} bai2Item One payment transaction
		 * @returns {string} The string to use to match payments that should be combined.
		 * An empty or null string means that the payment will not combine with anything.
		 * @example <caption>This first example is the standard logic.</caption>
		 * CombinePaymentMatchstring: function(bai2Item)
		 * {
		 * 	if (!bai2Item.payer || !bai2Item.paymentDate)
		 * 	{
		 * 		return "";
		 * 	}
		 * 	return bai2Item.payer + "|" + bai2Item.paymentDate + "|" + bai2Item.paymentMethod + "|" + bai2Item.currency;
		 * }
		 * @example <caption>This example groups payments on account number</caption>
		 * CombinePaymentMatchstring: function(bai2Item)
		 * {
		 * 	if (!bai2Item.payer)
		 * 	{
		 * 		return "";
		 * 	}
		 * 	return bai2Item.payer + "|" + bai2Item.accountNumber;
		 * }
		 */
		/*CombinePaymentMatchstring: function(bai2Item)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.CombinePaymentDisplay
		 * @since 263
		 * @description
		 * This function is used to customize the information shown in the Combined_info__ text box on the payment allocation
		 * screen when payments are combined into 1 payment. Customize this if you want to show some other additional information
		 * from the combined payment.
		 * @param {Bai2Item} bai2Item One payment transaction
		 * @returns {string} 1 line of the string that will be shown
		 * @example <caption>This example shows the payment amount, currency and type code.</caption>
		 * CombinePaymentDisplay: function(bai2Item)
		 * {
		 * 	return bai2Item.paidAmount +  "|" + bai2Item.currency +  "|" + bai2Item.typeCode;
		 * }
		 */
		/*CombinePaymentDisplay: function(bai2Item)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.FinalizePaymentItemData
		 * @since 290
		 * @description
		 * Identical to {@link Lib.CA.CashApp.Customization.Extraction.ModifyPaymentItemData ModifyPaymentItemData},
		 * except, this function is used to customize a payment transaction's info after the duplicate check and immediately before it is finalized into the array of payment items.
		 * Customize this if you want to change any of the info extracted from the payment file. For example, if a payment amount needs to add
		 * a decimal place to the extracted foreign currency amount.
		 * @param {string} statementType Bank statement type. Depends on the input file format. Currently supported types:
		 *  statementType value   | Interface type
		 * -------------------|--------------------
		 * `BAI2`             | {@link Lib.CA.Extraction.Transaction.Bai2Item}
		 * `MT940`            | {@link Lib.CA.Extraction.Transaction.MT940Item}
		 * `MT942`            | {@link Lib.CA.Extraction.Transaction.MT942Item}
		 * `CFONB`            | {@link Lib.CA.Extraction.Transaction.CFONBItem}
		 * `CFONB240`         | {@link Lib.CA.Extraction.Transaction.CFONBItem}
		 * `NORMA43`          | {@link Lib.CA.Extraction.Transaction.Norma43Item}
		 * `EDI820`           | {@link Lib.CA.Extraction.Transaction.EDI820Item}
		 * `CHECKS`           | {@link Lib.CA.Extraction.Transaction.CheckDepositItem}
		 * `CAMT053`          | {@link Lib.CA.Extraction.Transaction.CAMT053Item}
		 * `RemittanceAdvice` | {@link Lib.CA.Lockbox.Extraction.LockboxItem}
		 * @param {
		 * Lib.CA.Extraction.Transaction.Bai2Item|
		 * Lib.CA.Extraction.Transaction.MT940Item|
		 * Lib.CA.Extraction.Transaction.MT942Item|
		 * Lib.CA.Extraction.Transaction.CFONBItem|
		 * Lib.CA.Extraction.Transaction.EDI820Item|
		 * Lib.CA.Extraction.Transaction.Norma43Item|
		 * Lib.CA.Extraction.Transaction.CheckDepositItem|
		 * Lib.CA.Extraction.Transaction.CAMT053Item|
		 * Lib.CA.Lockbox.Extraction.LockboxItem
		 * } item Bank statement item. Structure depends on statement type.
		 * @param {Lib.CA.CashApp.Customization.Extraction.Transaction} transaction Since 311 - Available for all but checks. Extracted transaction data may be needed to set the Item.
		 * @returns {
		 * Lib.CA.Extraction.Transaction.Bai2Item|
		 * Lib.CA.Extraction.Transaction.MT940Item|
		 * Lib.CA.Extraction.Transaction.MT942Item|
		 * Lib.CA.Extraction.Transaction.CFONBItem|
		 * Lib.CA.Extraction.Transaction.EDI820Item|
		 * Lib.CA.Extraction.Transaction.Norma43Item|
		 * Lib.CA.Extraction.Transaction.CheckDepositItem|
		 * Lib.CA.Extraction.Transaction.CAMT053Item|
		 * Lib.CA.Lockbox.Extraction.LockboxItem
		 * } the customized bank statement item
		 * @example <caption>This example will add two decimal places to an extracted foreign currency amount for a BAI2 file</caption>
		 * FinalizePaymentItemData: function(statementType, item, transaction)
		 * {
		 * 	if(statementType === "BAI2")
		 * 	{
		 * 		item.paidAmountInForeignCurrency = item.paidAmountInForeignCurrency/100;
		 * 	}
		 * 	return item;
		 * }
		 */
		/*FinalizePaymentItemData: function(statementType, item, transaction)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.ModifyPaymentItemData
		 * @since 290
		 * @description
		 * Identical to {@link Lib.CA.CashApp.Customization.Extraction.FinalizePaymentItemData FinalizePaymentItemData},
		 * except this will modify the item before the duplicate check.
		 * Place modifications in each exit based on whether you want them done before or after the duplicate check.
		 * @param {string} statementType Bank statement type. Depends on the input file format. Currently supported types: BAI2, MT940, MT942, NORMA43, EDI820, CFONB, CFONB240, Check, CAMT053, RemittanceAdvice
		 *  statementType value   | Interface type
		 * -------------------|--------------------
		 * `BAI2`             | {@link Lib.CA.Extraction.Transaction.Bai2Item}
		 * `MT940`            | {@link Lib.CA.Extraction.Transaction.MT940Item}
		 * `MT942`            | {@link Lib.CA.Extraction.Transaction.MT942Item}
		 * `CFONB`            | {@link Lib.CA.Extraction.Transaction.CFONBItem}
		 * `CFONB240`         | {@link Lib.CA.Extraction.Transaction.CFONBItem}
		 * `NORMA43`          | {@link Lib.CA.Extraction.Transaction.Norma43Item}
		 * `EDI820`           | {@link Lib.CA.Extraction.Transaction.EDI820Item}
		 * `CHECKS`           | {@link Lib.CA.Extraction.Transaction.CheckDepositItem}
		 * `CAMT053`          | {@link Lib.CA.Extraction.Transaction.CAMT053Item}
		 * `RemittanceAdvice` | {@link Lib.CA.Lockbox.Extraction.LockboxItem}
		 * @param {
		 * Lib.CA.Extraction.Transaction.Bai2Item|
		 * Lib.CA.Extraction.Transaction.MT940Item|
		 * Lib.CA.Extraction.Transaction.MT942Item|
		 * Lib.CA.Extraction.Transaction.CFONBItem|
		 * Lib.CA.Extraction.Transaction.EDI820Item|
		 * Lib.CA.Extraction.Transaction.Norma43Item|
		 * Lib.CA.Extraction.Transaction.CheckDepositItem|
		 * Lib.CA.Extraction.Transaction.CAMT053Item|
		 * Lib.CA.Lockbox.Extraction.LockboxItem
		 * } item Bank statement item. Structure depends on statement type.
		 * @param {Lib.CA.CashApp.Customization.Extraction.Transaction} transaction Since 311 - Available for all but checks. Extracted transaction data may be needed to set the Item.
		 * @returns {
		 * Lib.CA.Extraction.Transaction.Bai2Item|
		 * Lib.CA.Extraction.Transaction.MT940Item|
		 * Lib.CA.Extraction.Transaction.MT942Item|
		 * Lib.CA.Extraction.Transaction.CFONBItem|
		 * Lib.CA.Extraction.Transaction.EDI820Item|
		 * Lib.CA.Extraction.Transaction.Norma43Item|
		 * Lib.CA.Extraction.Transaction.CheckDepositItem|
		 * Lib.CA.Extraction.Transaction.CAMT053Item|
		 * Lib.CA.Lockbox.Extraction.LockboxItem
		 * } the customized bank statement item
		 * @example <caption>This example will add two decimal places to an extracted foreign currency amount for a BAI2 file</caption>
		 * ModifyPaymentItemData: function(statementType, item, transaction)
		 * {
		 * 	if(statementType === "BAI2")
		 * 	{
		 * 		item.paidAmountInForeignCurrency = item.paidAmountInForeignCurrency/100;
		 * 	}
		 * 	return item;
		 * }
		 */
		/*ModifyPaymentItemData: function(statementType, item, transaction)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.IgnoreSkippedTransaction
		 * @since 335
		 * @description
		 * This can be used to customize whether a skipped payment allocation should be created or not.
		 * This is called after other skipped reasons have been determined, but before the transaction has a payment allocation created.
		 * @param {Lib.CA.Extraction.Transaction} transaction Bank statement item. Structure depends on statement type.
		 * @returns {boolean} True if the transaction should be ignored, false if a skipped payment allocation should be created, and null to use the default configuration logic.
		 * @example <caption>This example will use the default configuration logic for non-debit payment allocations and ignore debit transactions.</caption>
		 * IgnoreSkippedTransaction: function(transaction)
		 * {
		 * 	if (transaction.paidAmount < 0)
		 * 	{
		 * 		return true;
		 * 	}
		 * 	return null;
		 * }
		 */
		/*IgnoreSkippedTransaction: function(transaction)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.FinalizeParse16RecordIntoTransaction
		 * @since 295
		 * @description
		 * This function overrides the default extraction logic for the payment 16 and 88 line for a BAI2 file.
		 * FinalizePaymentItemData can change the item, but this is needed to extract something new from the file line.
		 * For example, the payment level date comes from another element.
		 * @param {string[]} elementOfLine Array of elements from this payment file line.
		 * @param {Lib.CA.CashApp.Customization.Extraction.Transaction} tr Bank statement item. Structure depends on statement type.
		 * @returns {Lib.CA.CashApp.Customization.Extraction.Transaction} the customized bank statement item
		 * @example <caption>This example will get the payment level date from the 17th element (doesn't include the first 16 element in the count)</caption>
		 * FinalizeParse16RecordIntoTransaction: function(elementOfLine, tr)
		 * {
		 * 	//Element 17 (not counting the first 16) is the payment level date
		 * 	if (elementOfLine[17])
		 * 	{
		 * 		tr.Fund.ValueDate = Sys.Helpers.Date.BankDateToJsDate(elementOfLine[17]); //YYMMDD
		 * 		tr.Fund.FundsType = "V";
		 * 	}
		 * 	return tr;
		 * }
		 */
		/*FinalizeParse16RecordIntoTransaction: function(elementOfLine, tr)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.ForeignAmountDescription
		 * @since 298
		 * @description
		 * This function is used to customize the foreign amount found in description further than just the regEx setting.
		 * Here you can either act on the entire description, or just apply additional formatting to what the regEx found.
		 * @param {string} description This is the whole description before the regex is applied.
		 * @param {string} foreignAmount String value from the regex match, this has not been modified by parseFloat as by default.
		 * @returns {string} Represents the new foreign amount to use.
		 * @example <caption>Add a decimal point 2 digits from the end if not already present.</caption>
		 * ForeignAmountDescription: function (description, foreignAmount)
		 * {
		 * 	if (foreignAmount && foreignAmount.indexOf('.') === -1) //If it doesn't have a decimal point
		 * 	{
		 * 		// add a period two digits from the right
		 * 		foreignAmount = foreignAmount.replace(/(\d+)(\d{2})$/, '$1.$2');
		 * 	}
		 * 	return parseFloat(foreignAmount);
		 * }
		 */
		/*ForeignAmountDescription: function(description, foreignAmount)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.CAMT053AdditionalNtryPieces
		 * @since 311
		 * @description
		 * For the CAMT 053 file type only, this can be used to extract additional elements from the Ntry portion of the file.
		 * The returned array will be in the order of the given paths.
		 * You likely need to also use FinalizePaymentItemData above to use the extracted values.
		 * @returns {string[]} An array of strings representing additional extracted values.
		 * @example <caption>These are the existing pieces that are already extracted, but it gives you an idea of what the path looks like.</caption>
		 * CAMT053AdditionalNtryPieces: function ()
		 * {
		 * 	return [
		 * 		"in:NtryRef",
		 * 		"in:Amt",
		 * 		"in:CdtDbtInd",
		 * 		"in:Sts",
		 * 		"in:BookgDt/in:Dt",
		 * 		"in:ValDt/in:Dt",
		 * 		"in:AcctSvcrRef",
		 * 		"in:BkTxCd/in:Domn/in:Cd",
		 * 		"in:BkTxCd/in:Domn/in:Fmly/in:Cd",
		 * 		"in:BkTxCd/in:Domn/in:Fmly/in:SubFmlyCd",
		 * 		"in:BkTxCd/in:Prtry/in:Cd",
		 * 		"in:BkTxCd/in:Prtry/in:Issr",
		 * 		"in:NtryDtls/in:TxDtls/in:Refs/in:EndToEndId",
		 * 		"in:AddtlNtryInf"
		 * 	];
		 * }
		 */
		/*CAMT053AdditionalNtryPieces: function ()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.FinalizeEDI820Transaction
		 * @since 317
		 * @description
		 * This function allows you to customize the transaction from the file data.
		 * You can also then customize the item further from the transaction if necessary.
		 * @param {EDI820Line} transaction data extracted for one payment from the EDI 820 file
		 * @param {ESKMap<string, any[]>} segmentMap Map of segments extracted from the EDI 820 file. The map is based on the segment name and then elements[1] is the next value on that line.
		 * @returns {EDI820Line} The customized object
		 * @example <caption>This example overrides the payer name with the value from the N2 segment.</caption>
		 * FinalizeEDI820Transaction: function (transaction, segmentMap)
		 * {
		 * 	let segments = segmentMap['N2'];
		 * 	if (segments)
		 * 	{
		 * 		for (let segment of segments)
		 * 		{
		 * 			transaction.payerName = segment.elements[1];
		 * 		}
		 * 	}
		 * 	return transaction;
		 * }
		 * @example <caption>This example overrides the reason code for the invoice detail built from a RMR segment if the segment following the RMR is a REF segment.</caption>
		 * FinalizeEDI820Transaction: function (transaction, segmentMap)
		 * {
		 * 	let segments = segmentMap['RMR'];
		 * 	if (!segments)
		 * 	{
		 *		return transaction;
		 * 	}
		 *
		 * 	const refSegmentType = "REF";
		 * 	const validPossibleReasonCodes = ["G7", "MR", "ZZ"]; //update to match the reason codes that are being looked for in REF-01
		 *
		 *	for (let segment of segments)
		 * 	{
		 *		if (segment.nextSegmentType === refSegmentType)
		 *		{
		 *			const refSegments = segmentMap[refSegmentType];
		 *			let currentSegment = segment;
		 *			let reasonCode = "";
		 *
		 *			while (currentSegment.nextSegmentType === refSegmentType && !validPossibleReasonCodes.includes(reasonCode)) //we loop through the REFs because multiple REFs can follow a RMR
		 *			{
		 *				currentSegment = refSegments.find(x => x.transactionLineNumber === currentSegment.transactionLineNumber + 1);
		 *				if (currentSegment)
		 *				{
		 *					reasonCode = currentSegment.elements[1];
		 *				}
		 *			}
		 *
		 *			if (!validPossibleReasonCodes.includes(reasonCode))
		 *			{
		 *				continue;
		 *			}
 		 *
		 *			const rmrInvoiceNumber = segment.elements[2];
		 *			const targetInvoiceDetail = transaction.invoiceDetails.find(x => x.invoiceNumber === rmrInvoiceNumber);
		 *
		 *			if (targetInvoiceDetail)
		 *			{
		 *				targetInvoiceDetail.adjustmentReasonCode = reasonCode;
		 *			}
		 *		}
		 *	}
 		 *
		 *	return transaction;
		 * }
		 */
		/*FinalizeEDI820Transaction: function (transaction, segmentMap)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Extraction.ModifyEDI820LineEndCharacter
		 * @since 330
		 * @description
		 * This function allows you to customize the inferred line end character for an EDI 820 file, in case it was erroneously inferred or could not be calculated. This is being called in CanExtract, where
		 * we have passed enough checks to be fairly confident we are parsing an EDI 820 but it is not fully confirmed yet.
		 * @param {string} bankStatementType Constant value of "EDI820".
		 * @param {string} fileContent String containing the full raw file content
		 * @param {string} lineEndCharacter Single character representing the inferred line end separator
		 * @returns {string} Single character representing the inferred line end separator
		 * @example <caption>This example defaults the line end separator to "~" if it could not be found</caption>
		 * ModifyEDI820LineEndCharacter: function (bankStatementType, fileContent, lineEndCharacter)
		 * {
		 * 	if (!lineEndCharacter)
		 * 	{
		 * 		return "~";
		 * 	}
		 * }
		 */
		/*ModifyEDI820LineEndCharacter: function (bankStatementType, fileContent, lineEndCharacter)
		{
		},*/
	};

	return Extraction;

})();
