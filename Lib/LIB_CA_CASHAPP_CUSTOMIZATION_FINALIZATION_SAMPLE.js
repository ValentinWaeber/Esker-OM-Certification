/* LIB_DEFINITION{
  "name": "LIB_CA_CASHAPP_CUSTOMIZATION_FINALIZATION_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "CashApplication Finalization customization functions",
  "require": []
}*/

/**
 * This module contains
 * - the function used to customize the filters to apply to incoming transactions
 * - functions to modify the processing of payments during finalization
 * @namespace Lib.CA.CashApp.Customization.Finalization
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.CashApp = Lib.CA.CashApp || {};
Lib.CA.CashApp.Customization = Lib.CA.CashApp.Customization || {};

Lib.CA.CashApp.Customization.Finalization = (function ()
{
	/**
	 * @namespace Lib.CA.CashApp.Customization.Finalization
	 */
	var Finalization =
	{
		/**
		 * @method Lib.CA.CashApp.Customization.Finalization.FilterTransaction
		 * @description
		 * Function called for each transaction to determine if we should process it or not
		 * @param {string} statementType Bank statement type. Depends on the input file format. Currently supported files: BAI2, MT940, MT942, CFONB, NORMA43, CHECKS, EDI820, CAMT053.
		 * @param {Lib.CA.Extraction.Transaction.Bai2Item|Lib.CA.Extraction.Transaction.MT940Item|Lib.CA.Extraction.Transaction.MT942Item|Lib.CA.Extraction.Transaction.CFONBItem|Lib.CA.Extraction.Transaction.Norma43Item|Lib.CA.Extraction.Transaction.CheckDepositItem|Lib.CA.Extraction.Transaction.EDI820Item|Lib.CA.Extraction.Transaction.CAMT053Item|Lib.CA.Lockbox.Extraction.LockboxItem} item Bank statement item. Structure depends on statement type
		 * - See {@link Lib.CA.CashApp.Customization.Extraction} for documentation of Bai2Item, MT940Item, MT942Item, CFONBItem, Norma43Item, CheckDepositItem, and EDI820Item structures
		 * @return {string} "PROCESS" to process the payment, a string specifying the reason for skipping the payment, or "DO_NOT_PROCESS" to not report any extra information with the skipped status.
		 * Returning null or undefined will use the application settings to process this transaction or not.
		 * @example <caption> This example skips BAI2 payments that have a payer name starting with TEST</caption>
		 * FilterTransaction: function (statementType, item)
		 * {
		 * 	var payerName = (item.payerName || "").toUpperCase();
		 * 	if (payerName.startsWith("TEST"))
		 * 	{
		 * 		return "DO_NOT_PROCESS";
		 * 	}
		 * }
		 */
		/*FilterTransaction: function (statementType, item)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Finalization.InitializePaymentFileProcessingGeneration
		 * @description
		 * Function called at the beginning of the Payment File Processing finalization script
		 */
		/*InitializePaymentFileProcessingGeneration: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Finalization.FinalizePaymentFileProcessingGeneration
		 * @description
		 * Function called at the end of the Payment File Processing finalization script
		 */
		/*FinalizePaymentFileProcessingGeneration: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Finalization.InitializePaymentMatchingGeneration
		 * @description
		 * Function called at the beginning of the Payment Matching finalization script
		 */
		/*InitializePaymentMatchingGeneration: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Finalization.FinalizePaymentMatchingGeneration
		 * @description
		 * Function called at the end of the Payment Matching finalization script
		 */
		/*FinalizePaymentMatchingGeneration: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Finalization.FinalizeManuallyAllocatePaymentInERP
		 * @description
		 * Function called when payments are selected to be allocated in ERP
		 * @param {xTransport} transport The xTransport item. Use this to change values based on the values of the certain item.
		 * @example <caption> This example will send the payment details via email to emailAddress@example.com, notifyAddress@example.com, and ccEmailAddress@example.com (these must be replaced with real email addresses)</caption>
		 * FinalizeManuallyAllocatePaymentInERP: function(transport)
		 * {
		 * 	if (transport)
		 * 	{
		 * 		var paymentVars = transport.GetUninheritedVars();
		 * 		var allocateComment = paymentVars.GetValue_String("Allocate_Comment__", 0);
		 * 		var bankDetails = paymentVars.GetValue_String("Bank_details__", 0);
		 * 		var companyCode = paymentVars.GetValue_String("Company_code__", 0);
		 * 		var currency = paymentVars.GetValue_String("Currency__", 0);
		 * 		var paidAmount = paymentVars.GetValue_String("Paid_amount__", 0);
		 * 		var payerName = paymentVars.GetValue_String("Payer_name__", 0);
		 * 		var paymentDate = paymentVars.GetValue_String("Payment_date__", 0);
		 * 		var paymentMethod = paymentVars.GetValue_String("Payment_method__", 0);
		 * 		var transactionId = paymentVars.GetValue_String("TransactionID__", 0);
		 * 		var subject = "Cash Application - Payment to be manually allocated in ERP";
		 * 		var message = "Comment: " + allocateComment + "\r\n";
		 * 		message += "Payment Date: " + paymentDate + "\r\n";
		 * 		message += "Payment Method: " + paymentMethod + "\r\n";
		 * 		message += "Payer Name: " + payerName + "\r\n";
		 * 		message += "Paid Amount: " + paidAmount + "\r\n";
		 * 		message += "Currency: " + currency + "\r\n";
		 * 		message += "Transaction ID: " + transactionId + "\r\n";
		 * 		message += "Bank Details: " + bankDetails + "\r\n";
		 * 		message += "Company Code: " + companyCode + "\r\n";
		 * 		var emailAddress = "emailAddress@example.com"; // Replace with real email
		 * 		var notifyAddress = "notifyAddress@example.com"; // Replace with real email
		 * 		var ccEmailAddress = "ccEmailAddress@example.com;" + notifyAddress; // Replace with real email
		 * 		var email = Process.CreateTransport("mail", true);
		 * 		var emailVars = email.GetUninheritedVars();
		 * 		emailVars.AddValue_String("EmailAddress", emailAddress, true);
		 * 		emailVars.AddValue_String("CcEmailAddress", ccEmailAddress, true);
		 * 		emailVars.AddValue_String("Subject", subject, true);
		 * 		emailVars.AddValue_String("Message", message, true);
		 * 		// Notify in case of failure
		 * 		var notif = email.AddNotif(0);
		 * 		notif.GetVars().AddValue_String("NotifyAddress", notifyAddress, true);
		 * 		notif.GetVars().AddValue_String("NotifyAddressType", "SM", false);
		 * 		notif.GetVars().AddValue_String("NotifyMessage", "F", false);
		 * 		// Send the email
		 * 		email.Process();
		 * 		Log.Info("Email sent to:" + emailAddress);
		 * 	}
		 * }
		 */
		/*FinalizeManuallyAllocatePaymentInERP: function (transport)
		{
		},*/

		/**
		 * Definition of Attribute
		 * @interface Lib.CA.CashApp.Customization.Finalization.Attribute
		 * @prop {string} name technical name of the field
		 * @prop {string | number | bool | Date} value value to set for the field
		 */

		/**
		 * @method Lib.CA.CashApp.Customization.Finalization.GetCustomPaymentTableFields
		 * @description
		 * Function called before creating entries in the CA - allocated payment details table for Allocation Types within a table on the Payment Allocation form. This allows the set-up custom fields to have their values set and then saved to the table. Note that you must manually add any new custom fields to the table in order to populate them.
		 * @param {Attribute[]} attributes An array of name/value pairs to represent an entry in the CA - allocated payment details table.
		 * @param {string} attributes.name technical name of the field
		 * @param {string | number | bool | Date} attributes.value value to set for the field
		 * @param {Item} tableLine The Item for the table line we are creating a table entry for.
		 * @param {string} source Either the string "INVOICE", "GL", or "CUSTOMER" to represent the allocation source, in case a field is only filled for certain sources.
		 * @return {Lib.CA.CashApp.Customization.Finalization.Attribute[]} The attributes list with any new custom fields added.
		 * @example <caption> This example will fill the Transaction_ID__ field in the table with the transaction ID of the payment</caption>
		 * GetCustomPaymentTableFields: function (attributes, tableLine, source)
		 * {
		 * 	attributes.push({ name: "Transaction_ID__", value: Data.GetValue("TransactionID__") });
		 * 	return attributes;
		 * }
		 */
		/*GetCustomPaymentTableFields: function (attributes, tableLine, source)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Finalization.GetCustomPaymentNonTableFields
		 * @description
		 * Function called before creating entries in the CA - allocated payment details table for Allocation Types at a payment level(not within a table) on the Payment Allocation form. This allows the set-up custom fields to have their values set and then saved to the table. Note that you must manually add any new custom fields to the table in order to populate them.
		 * @param {Lib.CA.CashApp.Customization.Finalization.Attribute[]} attributes An array of name/value pairs to represent an entry in the CA - allocated payment details table.
		 * @param {string} attributes.name technical name of the field
		 * @param {string | number | bool | Date} attributes.value value to set for the field
		 * @param {string} source The string "ERP" to represent the allocation source, in case a field is only filled for certain sources. This is a parameter for future-proofing in case we add more non-table sources.
		 * @return {Lib.CA.CashApp.Customization.Finalization.Attribute[]} The attributes list with any new custom fields added.
		 * @example <caption> This example will fill the Transaction_ID__ field in the table with the transaction ID of the payment</caption>
		 * GetCustomPaymentNonTableFields: function (attributes, source)
		 * {
		 * 	attributes.push({ name: "Transaction_ID__", value: Data.GetValue("TransactionID__") });
		 * 	return attributes;
		 * }
		 */
		/*GetCustomPaymentNonTableFields: function (attributes, source)
		{
		},*/

		/**
		 * @interface Lib.CA.CashApp.Customization.Finalization.Transaction
		 * @prop {string} paymentMethod Transaction Type (translated)
		 * @prop {string} paymentDate Entry date
		 * @prop {number} paidAmount Transaction amount (with sign)
		 * @prop {number} paidAmountInForeignCurrency (optional) Paid amount in foreign currency
		 * @prop {string} payerName Payer name
		 * @prop {string} transactionID Payment reference
		 * @prop {string} currency Transaction currency (copy of statement currency)
		 * @prop {string} foreignCurrency (optional) Currency code of foreign payment
		 * @prop {number} bankName (optional) bank name
		 * @prop {string} fileType (optional) file type
		 * @prop {string} fileName (optional) file name
		 * @prop {string} submissionDate (optional) submission date
		 * @prop {string} skipReason (optional) skip reason
		 * @prop {string} combinedInfo (optional) used to combine payments
		 * @prop {ESKMap<string>} customMappingInfo (optional) this maps a payment field for a payment transaction to its value
		 * @prop {Lib.CA.Payment.MatchingItems.AdjustmentAccountAllocation[]} customAdjustmentInfo (optional) an array of info about any custom adjustment lines for the transaction
		 */

		/**
		 * @method Lib.CA.CashApp.Customization.Finalization.CustomizeCommonInfos
		 * @description
		 * Customize any CommonInfos vars for the created payments. This is run for all file types, so see parameter to restrict to certain types.
		 * @param {xVars} vars The vars for commonInfos to modify
		 * @param {string} fileType BAI2,CFONB,CHECKS,MT940,MT942,NORMA43,RemittanceAdvice,EDI820,CAMT053,ZeroBalance,Other
		 * @param {Lib.CA.CashApp.Customization.Finalization.Transaction} transaction The file transaction item
		*/
		/*CustomizeCommonInfos: function(vars, fileType, transaction)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Finalization.CustomizeExtVars
		 * @description
		 * Customize any extVars for the created payments. This is run for all file types, so see parameter to restrict to certain types.
		 * @param {xVars} extVars The extVars to modify
		 * @param {string} fileType BAI2,CFONB,CHECKS,MT940,MT942,NORMA43,RemittanceAdvice,EDI820,CAMT053,ZeroBalance,Other
		 * @param {Lib.CA.CashApp.Customization.Finalization.Transaction} transaction The file transaction item
		 * @example <caption> This example will set a variable "MyConfig" equal to the configuration for BAI2 only</caption>
		 * CustomizeExtVars: function (extVars, fileType, transaction)
		 * {
		 * 	if (fileType === "BAI2")
		 * 	{
		 * 		extVars.AddValue_String("MyConfig", Data.GetValue("Configuration__"), true);
		 * 	}
		 * }
		*/
		/*CustomizeExtVars: function(extVars, fileType, transaction)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Finalization.MT940BankDetails
		 * @description
		 * Customize the bankDetails or structuredDetails for the MT940 payment.
		 * @param {ESKMap<string>} structuredDetails special key value pairs format
		 * @param {string} details string value from the description
		 * @return {string} How you want to save bankDetails
		 * @example <caption> This example will not sort and skip blanks for the structured details.</caption>
		 * MT940BankDetails: function (structuredDetails, details)
		 * {
		 * 	if(structuredDetails)
		 * 	{
		 * 		var customStructuredDetails = [];
		 * 		var keys = Object.keys(structuredDetails);
		 * 		keys.forEach(function (key)
		 * 		{
		 * 			if (key !== "gvc" && structuredDetails[key] !== "")
		 * 			{
		 * 				customStructuredDetails.push(structuredDetails[key]);
		 * 			}
		 * 		});
		 * 		return customStructuredDetails.join("\n");
		 * 	}
		 * }
		*/
		/*MT940BankDetails: function(structuredDetails, details)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Finalization.MT942BankDetails
		 * @description
		 * Customize the bankDetails or structuredDetails for the MT942 payment.
		 * @param {ESKMap<string>} structuredDetails special key value pairs format
		 * @param {string} details string value from the description
		 * @return {string} How you want to save bankDetails
		 * @example <caption> This example redirects to have the same handling as MT940</caption>
		 * MT942BankDetails: function (structuredDetails, details)
		 * {
		 * 	return Lib.CA.CashApp.Customization.Finalization.MT940BankDetails(structuredDetails, details);
		 * }
		*/
		/*MT942BankDetails: function(structuredDetails, details)
		{
		},*/

		/**
		 * Definition of IntercompanyZeroBalancePayment
		 * @interface Lib.CA.Payment.Allocation.Create.ZeroBalance.IntercompanyZeroBalancePayment
		 * @prop {string} companyCode destination company code for the intercompany payment
		 * @prop {string[]} documentNumbers invoice numbers to find on the intercompany payment's allocation
		 * @prop {string} remittanceRuidex remittance ruidex to associate with this payment
		 * @prop {string} accountNumber
		 * @prop {string} checkNumber
		 * @prop {string} details bank details
		 * @prop {string} bankNumber
		 * @prop {string} payeeBankNumber
		 * @prop {Lib.CA.Customization.Common.LedgerAccountAllocation[]} glAdjustments gl adjustment(s) to include on the intercompany payment
		 * @prop {string} configurationToUse the zero balance payment config the intercompany payment should use
		 * @prop {string} paymentDate
		 * @prop {number} paidAmount
		 * @prop {number} paidAmountInForeignCurrency
		 * @prop {string} payer
		 * @prop {string} payerName
		 * @prop {string} transactionID
		 * @prop {string} currency
		 * @prop {string} foreignCurrency
		 * @prop {string} bankName
		 * @prop {string} fileName
		 * @prop {Date} submissionDate
		 */

		/**
		 * @method Lib.CA.CashApp.Customization.Finalization.CustomizeIntercompanyPaymentBeforeCreation
		 * @description
		 * Allows for customizing the intercompany payment before it is created
		 * @param {Lib.CA.Payment.Allocation.Create.ZeroBalance.IntercompanyZeroBalancePayment} transaction The parameters being used to create the intercompany payment
		 * @example <caption> This example combines all GL adjustments into a single line, and sets the configurationToUse to "zeroBalance"</caption>
		 * CustomizeIntercompanyPaymentBeforeCreation: function (transaction)
		 * {
		 * 	transaction.configurationToUse = "zeroBalance";
		 * 	let glAccount = transaction.glAdjustments[0].Number;
		 * 	let combinedAdjustmentsAmount = 0;
		 * 	for (let i = 0; i < transaction.glAdjustments.length; i++)
		 * 	{
		 * 		combinedAdjustmentsAmount += transaction.glAdjustments[i].Amount;
		 * 	}
		 * 	transaction.glAdjustments = [{
		 *		Number: glAccount,
		 *		Amount: combinedAdjustmentsAmount,
		 *		Description: "Intercompany payment from company code " + Data.GetValue("Company_code__")
		 *	}];
		 * }
		*/
		/*CustomizeIntercompanyPaymentBeforeCreation: function(transaction)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Finalization.ModifyCustomPaymentTransaction
		 * @description
		 * Allows for customization of an payment transaction created from a custom payment file template
		 * Note that if you are referencing a column header, you should convert it to all lowercase first
		 * @param {string} templateName The custom payment template name being used to make this payment
		 * @param {Transaction} transaction The transaction being edited, based on the unique identifier of the table mapping line
		 * @param {string[]} line an array of all data for this payment from the payment file. If you know the column index for a value, you can add it to the customMappingInfo of the transaction.
		 * @param {string[]} headerLine an array of all column header names for the payment file
		 * @param {string} decimalSeparator the character selected as the decimal separator for formatting amounts for this custom template
		 * @return {Transaction} The updated transaction
		 * @example <caption> This example, if the template name is CCFiles, subtracts the amount in the "total fees" column from the payment's paid amount and sets that as the expected Invoices_Only_Amount__ for the payment to match invoices on, while appropriately formatting the amount.</caption>
		 * ModifyCustomPaymentTransaction: function (templateName, transaction, line, headerLine, decimalSeparator)
		 * {
		 * 	if (templateName === "CCFiles")
		 * 	{
		 * 		let paidAmount = transaction.paidAmount;
		 * 		let feeIndex = headerLine.indexOf("total fees");
		 * 		let formattedPaidAmount = line[feeIndex];
		 * 		if (decimalSeparator === ",")
		 * 		{
		 * 			formattedPaidAmount = formattedPaidAmount.replace(/\./g, '');
		 * 			formattedPaidAmount = formattedPaidAmount.replace(/,/g, '.');
		 * 		}
		 * 		formattedPaidAmount = formattedPaidAmount.replace(/,/g, '');
		 * 		transaction.customMappingInfo.Invoices_Only_Amount__ = paidAmount - Number(line[feeIndex]);
		 * 	}
		 * 	return transaction;
		 * },
		*/
		/*ModifyCustomPaymentTransaction: function (templateName, transaction, line, headerLine, decimalSeparator)
		{
			return transaction;
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Finalization.ModifyCustomPaymentTransactionComplex
		 * @description
		 * Allows for customization of an transaction created from a custom payment file template
		 * Note that if you are referencing a column header, you should convert it to all lowercase first
		 * @param {string} templateName The custom payment template name being used to make this payment
		 * @param {Transaction} transaction The adjustment being edited, based on the unique identifier of the table mapping line
		 * @param {string[][]} lines an array of arrays which includes all data for all lines for this payment from the payment file. If you know the column index for a value, you can add it to the customMappingInfo of the transaction.
		 * @param {string[]} headerLine an array of all column header names for the payment file
		 * @param {string} decimalSeparator the character selected as the decimal separator for formatting amounts for this custom template
		 * @return {Transaction} The updated transaction
		 * @example <caption> This example, if the template name is MultiLineFees, subtracts the amount in the first line of each payment in the "ref doc amount due" column from that payment's total amount
		 * in order to set the Invoices_Only_Amount__, while making sure it uses appropriate decimal formatting to match the database.</caption>
		 * ModifyCustomPaymentTransactionComplex: function (templateName, transaction, lines, headerLine, decimalSeparator)
		 * {
		 * 	if(templateName === "MultiLineFees")
		 * 	{
		 * 		let paidAmount = transaction.paidAmount;
		 * 		let invoiceAmountColumnIndex = headerLine.indexOf("ref doc amount due");
		 * 		let formattedPaidAmount = lines[0][invoiceAmountColumnIndex];
		 * 		if (decimalSeparator === ",")
		 * 		{
		 * 			formattedPaidAmount = formattedPaidAmount.replace(/\./g, '');
		 * 			formattedPaidAmount = formattedPaidAmount.replace(/,/g, '.');
		 * 		}
		 * 		formattedPaidAmount = formattedPaidAmount.replace(/,/g, '');
		 * 		transaction.customMappingInfo.Invoices_Only_Amount__ = paidAmount - Number(formattedPaidAmount);
		 * 	}
		 * 	return transaction;
		 * }
		*/
		/*ModifyCustomPaymentTransactionComplex: function (templateName, transaction, lines, headerLine, decimalSeparator)
		{
			return transaction;
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Finalization.CustomPaymentFileAdjustmentsBeforeCreation
		 * @description
		 * Allows for customization of an adjustment created from a custom payment file template
		 * @param {Lib.CA.Payment.MatchingItems.AdjustmentAccountAllocation} adjustment The adjustment being edited, based on the unique identifier of the table mapping line
		 * @param {ESKMap<number>} headerIndexes A map with the value being the line index and the value being one of three different things: Either a payment field technical name, a payment field technical name suffixed by a unique identifier, or a csv header
		 * @param {string[]} line The current line of the payment file that is being turned into a payment
		 * @param {Script.CA.PaymentFileProcessing.Finalization.TableMappingEntry} mapping The table-level mapping line from the table
		 * @param {string[]} header The parsed header from the payment file
		 * @return {Lib.CA.Payment.MatchingItems.AdjustmentAccountAllocation} The updated adjustment
		 * @example <caption> This example will fill the Description field of a GL adjustment with the concatenated value of the "invoice_reference" column with the "payment_reference" column for the payment's line of the payment file</caption>
		 * CustomPaymentFileAdjustmentsBeforeCreation: function (adjustment, headerIndexes, line, mapping, header)
		 * {
		 * 	if (mapping.tableFormField === "Col_account_description__")
		 * 	{
		 * 		adjustment.Description = line[header.indexOf("invoice_reference")] + line[header.indexOf("payment_reference")];
		 * 	}
		 * 	return adjustment;
		 * }
		*/
		/*CustomPaymentFileAdjustmentsBeforeCreation: function (adjustment, headerIndexes, line, mapping, header)
		{
		},*/

		/**
		 * Definition of PendingBankFilePayment
		 * @interface Lib.CA.CashApp.Customization.Finalization.PendingBankFilePayment
		 * @prop {string} ruidex ruidex of the payment
		 * @prop {string} payer payer reference
		 * @prop {number} amount payment amount
		 * @prop {Date} paymentDate date of the payment
		 * @prop {number} paymentDateThreshold maximum number of days allowed between this payment's date and the associated bank payment
		 */

		/**
		 * @method Lib.CA.CashApp.Customization.Finalization.GetPendingBankFilePayments
		 * @description
		 * Allows for customizing the query and attributes to find pending payments that may match this bank file's payments
		 * @param {ESKMap<number>} configurationsToMatch The pending payment configurations to match. The keys are the configuration names, and the values are the matching date thresholds for that configuration
		 * @return {Lib.CA.CashApp.Customization.Finalization.PendingBankFilePayment} The pending payments that could be matched by bank payments in this file. Return null to use the default logic.
		 * @example <caption> This example closely matches the existing logic, but adds transactionID as an attribute</caption>
		 * GetPendingBankFilePayments: function (configurationsToMatch)
		 * {
		 * 	let paymentsPendingBankFiles = [];
		 * 	let configurationNames = Object.keys(configurationsToMatch);
		 * 	const ldap = Sys.Helpers.LdapUtil;
		 * 	let filter = ldap.FilterAnd(
		 * 		ldap.FilterEqual("Deleted", "0"),
		 * 		ldap.FilterLesserOrEqual("State", "70"),
		 * 		ldap.FilterEqual("Status_alloc__", "PENDING_BANK_FILE"),
		 * 		ldap.FilterIn("ConfigurationName__", configurationNames)
		 * 	);
		 * 	let attributes = ["Ruidex", "Paid_amount__", "Payer__", "Payment_date__", "ConfigurationName__", "TransactionID__"];
		 * 	Sys.GenericAPI.PromisedQuery({
		 * 		table: "CDNAME#CA Payment Matching",
		 * 		filter: filter.toString(),
		 * 		attributes: attributes,
		 * 		sortOrder: "Payment_date__ ASC",  //oldest payments first
		 * 		additionalOptions: {
		 * 			bigQuery: true,
		 * 			queryOptions: "FastSearch=1"
		 * 		}
		 * 	}).Then(function (results)
		 * 	{
		 * 		for (let result of results)
		 * 		{
		 * 			let paymentPendingBankFile = {
		 * 				ruidex: result.Ruidex,
						payer: result.Payer__ ? result.Payer__.toUpperCase() : "",
		 * 				amount: Number(result.Paid_amount__),
		 * 				paymentDate: result.Payment_date__ ? Sys.Helpers.Date.SafeISOStringToDate(result.Payment_date__) : null,
		 * 				paymentDateThreshold: configurationsToMatch[result.ConfigurationName__],
		 * 				transactionID: result.TransactionID__
		 * 			};
		 * 			paymentsPendingBankFiles.push(paymentPendingBankFile);
		 * 		}
		 * 	});
		 * 	return paymentsPendingBankFiles;
		 * }
		*/
		/*GetPendingBankFilePayments: function (configurationsToMatch)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Finalization.GetPendingPaymentsMatchingBankPayment
		 * @description
		 * Allows for customizing the logic to match a bank payment to pending payments
		 * @param {Transaction} transaction The bank payment transaction object
		 * @param {PendingBankFilePayment[]} pendingPayments The pending payments available to match against
		 * @return {ruidex[]} The ruidexes of any matching pending payments. Return null to use the default logic.
		 * @example <caption> This example tries linking payments based on their transactionIDs, else falls back to the default logic.</caption>
		 * GetPendingPaymentsMatchingBankPayment: function (transaction, pendingPayments)
		 * {
		 * 	let ruidexes = [];
		 * 	for (let pendingPayment of pendingPayments)
		 * 	{
		 * 		if (pendingPayment.transactionID && transaction.transactionID && transaction.transactionID.startsWith(pendingPayment.transactionID))
		 * 		{
		 * 			ruidexes.push(pendingPayment.ruidex);
		 * 		}
		 * 	}
		 * 	if (ruidexes.length > 0)
		 * 	{
		 * 		return ruidexes;
		 * 	}
		 * 	return null;
		 * }
		*/
		/*GetPendingPaymentsMatchingBankPayment: function (transaction, pendingPayments)
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Finalization.InitializeBulkInvoiceProcessing
		 * @since 334
		 * @description
		 * Function called at the beginning of the CA Bulk Invoice Updating finalization script
		 */
		/*InitializeBulkInvoiceProcessing: function()
		{
		},*/

		/**
		 * @method Lib.CA.CashApp.Customization.Finalization.FinalizeBulkInvoiceProcessing
		 * @since 334
		 * @description
		 * Function called at the end of the CA Bulk Invoice Updating finalization script
		 */
		/*FinalizeBulkInvoiceProcessing: function()
		{
		},*/
	};

	return Finalization;

})();
