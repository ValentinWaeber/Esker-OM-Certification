/* eslint-disable no-mixed-spaces-and-tabs */
/* LIB_DEFINITION{
  "name": "LIB_AR_CUSTOMIZATION_PAYMENT_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "comment": "payment custom functions",
  "versionable": false,
  "require": [
    "Sys/Sys_AR_Payment"
  ]
}*/

/**
 * This module contains functions allowing to override default signature commands
 * @namespace Lib.AR.Customization.Payment
 */

///#GLOBALS Lib Sys
var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};

Lib.AR.Customization.Payment = (function ()
{
	var payment = {
		/**
		 * @method Lib.AR.Customization.Payment.MassUpdateConfigureCSVReader
		 * @description
		 * This function customizes the settings of the CSV file parsing.
		 *
		 * @param {Sys.Helpers.CSVReader.CSVReader} csvReader - an object CSVReader defined in Sys_Helpers_CSVReader lib
		 * 
		 * @example This user exit sets the ; and \n as separators to use to split the data of the CSV file.
		 * MassUpdateConfigureCSVReader: function(csvReader)
		 * {
		 *	csvReader.SplitSeparator = ";";
		 *	csvReader.ReturnSeparator = "\n";
		 * }
		 */
		/*MassUpdateConfigureCSVReader: function(csvReader)
		{
			csvReader.SplitSeparator = ";";
			csvReader.ReturnSeparator = "\n";
		},*/

		/**
		 * @method Lib.AR.Customization.Payment.MassUpdateGetRequiredHeaders
		 * @description
		 * Sets the required header line of the payment information CSV file. The validation script will check this
		 * 
		 * @example This user exit sets the <B style="color: red">Invoice number</B>, <B style="color: red">Payment status</B>, <B style="color: red">Payment date</B> and <B style="color: red">Payment method</B> headers as required for the CSV file.
		 * MassUpdateGetRequiredHeaders: function()
		 * {
		 *	return ["Invoice number", "Payment status", "Payment date", "Payment method"];
		 * }
		 */
		/*MassUpdateGetRequiredHeaders: function()
		{
			return ["Invoice number", "Payment status", "Payment date", "Payment method"];
		},*/


		/**
		 * @method Lib.AR.Customization.Payment.MassUpdateGetCSVMapping
		 * @description
		 * Sets the mapping of the information between the Invoices payment mass update process and the CSV file that contains the invoice payment information.
		 * This user exit expects a code with a specific structure.
		 * Refer to the usage notes included in the example for more information.
		 *
		 * @example <caption>This user exit sets a mapping in which, among others:
		 *  * The destination fields are filled in either with a CSV value, a constant value or a computed value.
		 *  * The field that must be used as an index for search and update is declared.</caption>
		 * //            -------------------------------------------------------------------------------
		 * //            USAGE NOTES ABOUT HOW TO BUILD A VALID AND POWERFUL CSVHeadersMapping VARIABLE
		 * //            -------------------------------------------------------------------------------
		 * //
		 * //            This variable is an array describing how to map your destination
		 * //            transport/flexible record fields with your input CSV columns. Each item of the
		 * //            array is an object representing the mapping between a CSV column and a
		 * //            destination field.
		 * //
		 * //                            1) MAPPING A CSV VALUE
		 * //
		 * //            You can fill in the destination field using the value of a specified CSV column
		 * //            of the CSV file. The position of the column in the CSV does not matter. When
		 * //            the line is read during the import, the destination field is filled in with the
		 * //            corresponding value.
		 * //            In the following example, the process field "Invoice_number__" is linked to
		 * //            the "Invoice number" CSV column:
		 * //                            {
		 * //                                           destinationField: "Invoice_number__",
		 * //                                           sourceCSVColumn: "Invoice number",
		 * //                            }
		 * //
		 * //
		 * //                            2) MAPPING WITH A CONSTANT VALUE
		 * //
		 * //            You can fill in the destination field with a constant value.
		 * //            In the following example, the process field "Payment_through__" is set for
		 * //            each line of the input CSV to the value "ERP" regardless of the content of
		 * //            the CSV file:
		 * //                            {
		 * //                                           destinationField: "Payment_through__",
		 * //                                           sourceConstantValue: "ERP"
		 * //                            }
		 * //
		 * //
		 * //                            3) MAPPING WITH A COMPUTED VALUE
		 * //
		 * //            You can fill in the destination field with a computed value. For example, you can
		 * //            script some advanced assignments such as querying the database or taking into
		 * //            account the previous imported line using a global variable.
		 * //
		 * //            To do so, define a function taking the whole current CSV line as an object
		 * //            parameter.
		 * //            In the following example, the process field "Invoice_number__" is set for
		 * //            each line of the input CSV to the value corresponding to the upper case
		 * //            "Invoice number" CSV column:
		 * //                            {
		 * //                                destinationField: "Invoice_number__",
		 * //                                sourceComputedValue: function( csvLine )
		 * //                                         {
		 * //                                             var thisLineInvoiceNumber = csvLine["Invoice number"];
		 * //                                             return thisLineInvoiceNumber.toUpperCase();
		 * //                                         }
		 * //                            }
		 * //
		 * //
		 * //                            4) CHOOSE THE INDEXED FIELD TO SEARCH AND UPDATE
		 * //
		 * //            One of the mapping objects has to be declared as an index field.
		 * //            Do so by setting the "destinationFieldIsIndex" property to true.
		 * //            This field is then used to perform the query and update the records.
		 * //            If several records are returned by the query, they are all updated by the process.
		 * //                            {
		 * //                                 destinationField: "Invoice_number__",
		 * //                                 sourceCSVColumn: "Invoice number",
		 * //                                 destinationFieldIsIndex: true;
		 * //                            }
		 *
		 * @example
		 * MassUpdateGetCSVMapping: function ()
		 * {
		 *	 function GetCSVLineValue(csvLine, columnName)
		 *	 {
		 *		 var value = "";
		 *		 if (csvLine && columnName && csvLine[columnName])
		 *		 {
		 *			 value = csvLine[columnName];
		 *		 }
		 *		 return value;
		 *	 };
		 *
		 *	 function ComputePaymentData(csvLine)
		 *	 {
		 *		 var infos = {};
		 *		 var total = parseFloat(GetCSVLineValue(csvLine, "Total amount"));
		 *		 var paid = Math.abs(parseFloat(GetCSVLineValue(csvLine, "Paid amount")));
		 *		 var outstanding = parseFloat(GetCSVLineValue(csvLine, "Outstanding amount"));
		 *		 var status = GetCSVLineValue(csvLine, "Payment status").toLowerCase();
		 *
		 *		 if (total >= 0)
		 *		 {
		 *			 var outstandingIsMissing = !isNaN(paid) && isNaN(outstanding);
		 *			 var paidIsMissing = !isNaN(outstanding) && isNaN(paid);
		 *			 if (outstandingIsMissing)
		 *			 {
		 *				 outstanding = total - paid;
		 *			 }
		 *			 else if (paidIsMissing)
		 *			 {
		 *				 paid = total - outstanding;
		 *			 }
		 *		 }
		 *
		 *		 var isCreditNote = (!isNaN(total) && total < 0);
		 *		 if (!isCreditNote)
		 *		 {
		 *			 if (!status && !isNaN(outstanding))
		 *			 {
		 *				 infos["Payment_status__"] = outstanding === 0 ? "PAID" : "PARTIALLYPAID";
		 *			 }
		 *
		 *			 if (status === "paid")
		 *			 {
		 *				 outstanding = 0.0;
		 *				 if (total >= 0)
		 *				 {
		 *					 paid = total;
		 *				 }
		 *			 }
		 *		 }
		 *
		 *		 infos["Invoice_paid_amount__"] = isNaN(paid) ? "" : "" + paid;
		 *		 infos["Invoice_outstanding_amount__"] = isNaN(outstanding) ? "" : "" + outstanding;
		 *
		 *		 return infos;
		 *	 };
		 *
		 *	 function GetPaymentStatus(csvLine)
		 *	 {
		 *		 var status = GetCSVLineValue(csvLine, "Payment status");;
		 *		 if (!status)
		 *		 {
		 *			 var paymentData = ComputePaymentData(csvLine);
		 *			 status = paymentData["Payment_status__"];
		 *		 }
		 *
		 *		 return status || "";
		 *	 };
		 *
		 *	 var CSVHeadersMapping;
		 *
		 *	 CSVHeadersMapping = [
		 *		 // Invoice number
		 *		 {
		 *			 // Must be set only once to define the indexed field to search and update
		 *			 destinationFieldIsIndex: true,
		 *			 destinationField: "Invoice_number__",
		 *			 sourceCSVColumn: "Invoice number"
		 *		 },
		 *
		 *		 // Payment status: "PAID" or "PARTIALLYPAID" according the line, "EMPTY" for other case
		 *		 {
		 *			 destinationField: "Payment_status__",
		 *			 sourceComputedValue: function (csvLine)
		 *			 {
		 *				 var status = GetCSVLineValue(csvLine, "Payment status");
		 *				 switch (status.toLowerCase())
		 *				 {
		 *				 case "paid":
		 *					 return "PAID";
		 *				 case "partiallypaid":
		 *					 return "PARTIALLYPAID";
		 *				 default:
		 *					 return ComputePaymentData(csvLine)["Payment_status__"] || "EMPTY";
		 *				 }
		 *			 }
		 *		 },
		 *
		 *		 // Payment through: payment online, on behalf, by ERP,...
		 *		 {
		 *			 destinationField: "Payment_through__",
		 *			 sourceConstantValue: "ERP"
		 *		 },
		 *
		 *		 // Payment type: credit card, eCheck, check,...
		 *		 {
		 *			 destinationField: "Payment_type__",
		 *			 sourceComputedValue: function (csvLine)
		 *			 {
		 *				 var typeCode = GetCSVLineValue(csvLine, "Payment method").toLowerCase();
		 *				 var translatedType = "EMPTY";
		 *
		 *				 var status = GetPaymentStatus(csvLine);
		 *				 if (status.toLowerCase() === "paid" || status.toLowerCase() === "partiallypaid")
		 *				 {
		 *					 if (["cb", "cc", "creditcard", "credit card"].indexOf(typeCode) !== -1)
		 *					 {
		 *						 translatedType = "CC";
		 *					 }
		 *					 else if (["ec", "echeck"].indexOf(typeCode) !== -1)
		 *					 {
		 *						 translatedType = "EC";
		 *					 }
		 *					 else if (["check"].indexOf(typeCode) !== -1)
		 *					 {
		 *						 translatedType = "CHECK";
		 *					 }
		 *					 else if (["cash"].indexOf(typeCode) !== -1)
		 *					 {
		 *						 translatedType = "CASH";
		 *					 }
		 *					 else if (["ach", "automatedclearinghouse", "automated clearing house"].indexOf(typeCode) !== -1)
		 *					 {
		 *						 translatedType = "ACH";
		 *					 }
		 *					 else if (["eft", "electronicfundstransfer", "electronic funds transfer"].indexOf(typeCode) !== -1)
		 *					 {
		 *						 translatedType = "EFT";
		 *					 }
		 *					 else if (["sepa"].indexOf(typeCode) !== -1)
		 *					 {
		 *						 translatedType = "SEPA";
		 *					 }
		 *				 }
		 *				 return translatedType;
		 *			 }
		 *		 },
		 *
		 *		 // Payment author
		 *		 {
		 *			 destinationField: "Paid_by__",
		 *			 sourceComputedValue: function (csvLine)
		 *			 {
		 *				 var paymentAuthor = "";
		 *
		 *				 var status = GetPaymentStatus(csvLine);
		 *				 if (status.toLowerCase() === "paid" || status.toLowerCase() === "partiallypaid")
		 *				 {
		 *					 // Get current user display name
		 *					 var userVars = Sys.AR.User.GetCurrentVars();
		 *					 paymentAuthor = (userVars) ? userVars.GetValue_String("DisplayName", 0) : "";
		 *				 }
		 *				 return paymentAuthor;
		 *			 }
		 *		 },
		 *
		 *		 // Payment date
		 *		 {
		 *			 destinationField: "Payment_date__",
		 *			 sourceComputedValue: function (csvLine)
		 *			 {
		 *				 var returnedDateString = null;
		 *				 var csvDate = GetCSVLineValue(csvLine, "Payment date");
		 *				 var status = GetPaymentStatus(csvLine);
		 *				 if ((status.toLowerCase() === "paid" || status.toLowerCase() === "partiallypaid") && csvDate)
		 *				 {
		 *					 // Has to be "YYYY-MM-DD HH:MM:SS"
		 *					 var split = csvDate.split(' ');
		 *					 var date = split[0].split('-');
		 *					 var time = split[1].split(':');
		 *
		 *					 // Imported date are in user timezone, convert it to database timezone
		 *					 var dateFinal = new Date(date[0], (date[1] - 1), date[2], time[0], time[1], time[2]);
		 *					 var currentUser = Sys.AR.User.GetCurrent();
		 *					 returnedDateString = currentUser.Date2DBDateTime(dateFinal);
		 *				 }
		 *				 return returnedDateString;
		 *			 }
		 *		 },
		 *
		 *		 // Used provider
		 *		 {
		 *			 destinationField: "Payment_provider_used__",
		 *			 sourceConstantValue: ""
		 *		 },
		 *
		 *		 // Payment history
		 *		 {
		 *			 destinationField: "Payment_historic__",
		 *			 sourceComputedValue: function (csvLine)
		 *			 {
		 *				 var amounts = ComputePaymentData(csvLine);
		 *				 var logEntry = {
		 *					 paymentStatus: Sys.AR.Payment.GetComputedValueByName(CSVHeadersMapping, "Payment_status__", csvLine),
		 *					 paymentThrough: Sys.AR.Payment.GetComputedValueByName(CSVHeadersMapping, "Payment_through__", csvLine),
		 *					 paymentDate: (new Date()).getTime(),
		 *					 author: Sys.AR.Payment.GetComputedValueByName(CSVHeadersMapping, "Paid_by__", csvLine),
		 *					 paymentTypeKey: Sys.AR.Payment.GetPaymentTypeTranslationKey(Sys.AR.Payment.GetComputedValueByName(CSVHeadersMapping, "Payment_type__", csvLine)),
		 *					 transactionId: "",
		 *					 paidAmount: amounts["Invoice_paid_amount__"],
		 *					 outstandingAmount: amounts["Invoice_outstanding_amount__"],
		 *					 comment: (csvLine["Comment"] && csvLine["Comment"] !== "") ? csvLine["Comment"] : null
		 *				 };
		 *
		 *				 // Special feature appendArrayItem for the payment history
		 *				 // used to append data to payment history field
		 *				 return {
		 *					 appendArrayItem: logEntry
		 *				 };
		 *			 }
		 *		 },
		 *
		 *		 //Paid amount
		 *		 {
		 *			 destinationField: "Invoice_paid_amount__",
		 *			 sourceComputedValue: function (csvLine)
		 *			 {
		 *				 var amounts = ComputePaymentData(csvLine);
		 *				 return amounts["Invoice_paid_amount__"];
		 *			 }
		 *		 },
		 *
		 *		 //Outstanding amount
		 *		 {
		 *			 destinationField: "Invoice_outstanding_amount__",
		 *			 sourceComputedValue: function (csvLine)
		 *			 {
		 *				 var amounts = ComputePaymentData(csvLine);
		 *				 return amounts["Invoice_outstanding_amount__"];
		 *			 }
		 *		 }
		 *	 ];
		 *
		 *	 return CSVHeadersMapping;
		 * }
		 * @example This example maps the Invoice number, Invoice Outstanding and the InvoiceDate columns in the CSV file containing details of open invoices to the respective fields.
		 * MassUpdateGetCSVMapping: function()
		 * {
		 *	 var CSVHeadersMapping = [
		 *		 {
		 *			 destinationField: "Invoice_number__",
		 *			 sourceCSVColumn: "InvoiceNumber"
		 *		 },
		 *		 {
		 *			 destinationField: "Invoice_outstanding_amount__",
		 *			 sourceCSVColumn: "InvoiceOutstanding"
		 *		 },
		 *		 {
		 *			 destinationField: "Invoice_date__",
		 *			 sourceCSVColumn: "InvoiceDate"
		 *		 }
		 *	 ];
		 *
		 *	 return CSVHeadersMapping;
		 * }
		 */
		/*MassUpdateGetCSVMapping: function()
		{
			function GetCSVLineValue(csvLine, columnName)
			{
				var value = "";
				if (csvLine && columnName && csvLine[columnName]) {
					value = csvLine[columnName];
				}
				return value;
			};

			function ComputePaymentData(csvLine)
			{
				var infos = {};
				var total = parseFloat(GetCSVLineValue(csvLine, "Total amount"));
				var paid = Math.abs(parseFloat(GetCSVLineValue(csvLine, "Paid amount")));
				var outstanding = parseFloat(GetCSVLineValue(csvLine, "Outstanding amount"));
				var status = GetCSVLineValue(csvLine, "Payment status").toLowerCase();

				if (total >= 0)
				{
					var outstandingIsMissing = !isNaN(paid) && isNaN(outstanding);
					var paidIsMissing = !isNaN(outstanding) && isNaN(paid);
					if (outstandingIsMissing) {
						outstanding = total - paid;
					} else if (paidIsMissing) {
						paid = total - outstanding;
					}
				}

				var isCreditNote = (!isNaN(total) && total < 0);
				if (!isCreditNote)
				{
					if (!status && !isNaN(outstanding))	{
						infos["Payment_status__"] = outstanding === 0 ? "PAID" : "PARTIALLYPAID";
					}

					if (status === "paid")
					{
						outstanding = 0.0;
						if (total >= 0) {
							paid = total;
						}
					}
				}

				infos["Invoice_paid_amount__"] = isNaN(paid) ? "" : "" + paid;
				infos["Invoice_outstanding_amount__"] = isNaN(outstanding) ? "" : "" + outstanding;

				return infos;
			};

			function GetPaymentStatus(csvLine)
			{
				var status = GetCSVLineValue(csvLine, "Payment status");;
				if (!status) {
					var paymentData = ComputePaymentData(csvLine);
					status = paymentData["Payment_status__"];
				}
				return status || "";
			};

			var CSVHeadersMapping;

			CSVHeadersMapping = [
				// Invoice number
				{
					// Must be set to define the indexed field to search and update
					destinationFieldIsIndex: true,
					destinationField: "Invoice_number__",
					sourceCSVColumn: "Invoice number"
				},

				// Payment status: "PAID" or "PARTIALLYPAID" according the line, "EMPTY" for other case
				{
					destinationField: "Payment_status__",
					sourceComputedValue: function (csvLine)
					{
						var status = GetCSVLineValue(csvLine, "Payment status");
						switch (status.toLowerCase())
						{
							case "paid":
								return "PAID";
							case "partiallypaid":
								return "PARTIALLYPAID";
							default:
								return ComputePaymentData(csvLine)["Payment_status__"] || "EMPTY";
						}
					}
				},

				// Payment through: payment online, on behalf, by ERP,...
				{
					destinationField: "Payment_through__",
					sourceConstantValue: "ERP"
				},

				// Payment type: credit card, eCheck, check,...
				{
					destinationField: "Payment_type__",
					sourceComputedValue: function (csvLine)
					{
						var typeCode = GetCSVLineValue(csvLine, "Payment method").toLowerCase();
						var translatedType = "EMPTY";

						var status = GetPaymentStatus(csvLine);
						if (status.toLowerCase() === "paid" || status.toLowerCase() === "partiallypaid")
						{
							if (["cb", "cc", "creditcard", "credit card"].indexOf(typeCode) !== -1) {
								translatedType = "CC";
							}
							else if (["ec", "echeck"].indexOf(typeCode) !== -1) {
								translatedType = "EC";
							}
							else if (["check"].indexOf(typeCode) !== -1) {
								translatedType = "CHECK";
							}
							else if (["cash"].indexOf(typeCode) !== -1) {
								translatedType = "CASH";
							}
							else if (["ach", "automatedclearinghouse", "automated clearing house"].indexOf(typeCode) !== -1) {
								translatedType = "ACH";
							}
							else if (["eft", "electronicfundstransfer", "electronic funds transfer"].indexOf(typeCode) !== -1) {
								translatedType = "EFT";
							}
							else if (["sepa"].indexOf(typeCode) !== -1) {
								translatedType = "SEPA";
							}
							else if (["compensation"].indexOf(typeCode) !== -1) {
								translatedType = "COMPENSATION";
							}
						}
						return translatedType;
					}
				},

				// Payment author
				{
					destinationField: "Paid_by__",
					sourceComputedValue: function (csvLine)
					{
						var paymentAuthor = "";

						var status = GetPaymentStatus(csvLine);
						if (status.toLowerCase() === "paid" || status.toLowerCase() === "partiallypaid")
						{
							// Get current user display name
							var userVars = Sys.AR.User.GetCurrentVars();
							paymentAuthor = (userVars) ? userVars.GetValue_String("DisplayName", 0) : "";
						}
						return paymentAuthor;
					}
				},

				// Payment date
				{
					destinationField: "Payment_date__",
					sourceComputedValue: function (csvLine)
					{
						var returnedDateString = null;
						var csvDate = GetCSVLineValue(csvLine, "Payment date");
						var status = GetPaymentStatus(csvLine);
						if ((status.toLowerCase() === "paid" || status.toLowerCase() === "partiallypaid") && csvDate)
						{
							// Has to be "YYYY-MM-DD HH:MM:SS"
							var split = csvDate.split(' ');
							var date = split[0].split('-');
							var time = split[1].split(':');

							// Imported date are in user timezone, convert it to database timezone
							var dateFinal = new Date(date[0], (date[1] - 1), date[2], time[0], time[1], time[2]);
							var currentUser = Sys.AR.User.GetCurrent();
							returnedDateString = currentUser.Date2DBDateTime(dateFinal);
						}
						return returnedDateString;
					}
				},

				// Used provider
				{
					destinationField: "Payment_provider_used__",
					sourceConstantValue: ""
				},

				// Payment history
				{
					destinationField: "Payment_historic__",
					sourceComputedValue: function (csvLine)
					{
						var amounts = ComputePaymentData(csvLine);
						var logEntry =
						{
							paymentStatus:		Sys.AR.Payment.GetComputedValueByName(CSVHeadersMapping, "Payment_status__", csvLine),
							paymentThrough:		Sys.AR.Payment.GetComputedValueByName(CSVHeadersMapping, "Payment_through__", csvLine),
							paymentDate:		(new Date()).getTime(),
							author:				Sys.AR.Payment.GetComputedValueByName(CSVHeadersMapping, "Paid_by__", csvLine),
							paymentTypeKey:		Sys.AR.Payment.GetPaymentTypeTranslationKey(Sys.AR.Payment.GetComputedValueByName(CSVHeadersMapping, "Payment_type__", csvLine)),
							transactionId:		"",
							paidAmount:			amounts["Invoice_paid_amount__"],
							outstandingAmount:	amounts["Invoice_outstanding_amount__"],
							comment:		(csvLine["Comment"] && csvLine["Comment"] !== "") ? csvLine["Comment"] : null
						};

						// Special feature appendArrayItem for the payment history
						// used to append data to payment history field
						return { appendArrayItem: logEntry };
					}
				},

				//Paid amount
				{
					destinationField: "Invoice_paid_amount__",
					sourceComputedValue: function (csvLine)
					{
						var amounts = ComputePaymentData(csvLine);
						return amounts["Invoice_paid_amount__"];
					}
				},

				//Outstanding amount
				{
					destinationField: "Invoice_outstanding_amount__",
					sourceComputedValue: function (csvLine)
					{
						var amounts = ComputePaymentData(csvLine);
						return amounts["Invoice_outstanding_amount__"];
					}
				}
			];

			return CSVHeadersMapping;
		},*/

		/**
		 * @method Lib.AR.Customization.Payment.DisablePaymentMethodManagement
		 * @description
		 * This function disables the payment method management, as well as payment scheduling and autopay feature
		 * Still the payment method management is used by default and recommended
		 * 
		 * @example
		 * DisablePaymentMethodManagement: function()
		 * {
		 * 	return true;
		 * }
		 */
		/*DisablePaymentMethodManagement: function()
		{
			return true;
		},*/

		/**
		 * @method Lib.AR.Customization.Payment.CustomInvoiceCompanyValidation
		 * @description
		 * This function can be used to force the result of the consistent invoice company code validation check on payments.
		 * If the function returns false, the 'notsamecompany' error will be set on the payment.
		 * If the function returns true, the 'notsamecompany' error will not be set on the payment, and the default logic for this validation will be skipped.
		 * If the function returns anything else, the default logic will be used.
		 * @param {any} existingValues Previously seen/set values for the payment based on the included invoices
		 * @param {xTransport} invRecord The invoice record to check
		 * @returns {boolean} True to skip the default logic, false to force the 'notsamecompany' error, anything else to use the default logic
		 * 
		 * @example <caption>This example will use the invoice's company code field directly to verify they are consistent with other invoices.
		 * If the company code isn't set, then this will fall back to the default logic in the standard code.</caption>
		 * CustomInvoiceCompanyValidation: function(existingValues, invRecord)
		 * {
		 * 	let invRecordVars = invRecord.GetUninheritedVars();
		 * 	let invCompanyCode = invRecordVars.GetValue_String("Company_code__", 0);
		 * 	// initialise invoices common company
		 * 	if (!existingValues.companyCode)
		 * 	{
		 * 		existingValues.companyCode = invCompanyCode;
		 * 	}
		 * 	if (!existingValues.companyCode)
		 * 	{
		 * 		// Fallback to default logic if company code is not set on the invoice
		 * 		return null;
		 * 	}
		 * 	return existingValues.companyCode === invCompanyCode;
		 * },
		 */
		/* CustomInvoiceCompanyValidation: function(existingValues, invRecord)
		{
			return null;
		},*/

		/**
		 * @method Lib.AR.Customization.Payment.CustomizeCustomerNotificationEmailData
		 * @description
		 * This function allows you to modify the data of the payment notification email sent to the customer
		 * @param {Object} emailData emailData contains the following properties:
		 * @param {string} emailData.ID
		 * @param {string} emailData.email
		 * @param {string} emailData.name
		 * @param {string} emailData.language
		 * @param {string} emailData.culture
		 * @param {string} emailData.skin
		 * @param {string} emailData.formUrl
		 * @param {string} emailData.transportIdentifier
		 * @param {string} emailData.fromEmail
		 * @param {string} emailData.fromName
		 * @param {string} emailData.fromCompany
		 * @param {string} emailData.customerCompany
		 * @param {string} emailData.paymentMethod
		 * @param {string} emailData.paymentStatus
		 * @param {string} emailData.ownerId
		 * @param {string} emailData.subject
		 * 
		 * @example
		 * CustomizeCustomerNotificationEmailData: function(emailData)
		 * {
		 * 	emailData.fromEmail = "customizedFromEmail@esker.com"
		 * 	return emailData;
		 * }
		 */
		/* CustomizeCustomerNotificationEmailData: function(emailData)
		{
			return emailData;
		},*/

		/**
		 * @method Lib.AR.Customization.Payment.CustomizeSupplierNotificationEmailData
		 * @description
		 * This function allows you to modify the data of the payment notification email sent to the supplier
		 * @param {Object} emailData emailData contains the following properties:
		 * @param {string} emailData.ID
		 * @param {string} emailData.email
		 * @param {string} emailData.name
		 * @param {string} emailData.language
		 * @param {string} emailData.culture
		 * @param {string} emailData.skin
		 * @param {string} emailData.formUrl
		 * @param {string} emailData.transportIdentifier
		 * @param {string} emailData.fromEmail
		 * @param {string} emailData.fromName
		 * @param {string} emailData.fromCompany
		 * @param {string} emailData.customerCompany
		 * @param {string} emailData.paymentMethod
		 * @param {string} emailData.paymentStatus
		 * @param {string} emailData.ownerId
		 * @param {string} [emailData.subject]
		 * 
		 * @example
		 * CustomizeSupplierNotificationEmailData: function(emailData)
		 * {
		 * 	emailData.fromEmail = "customizedFromEmail@esker.com"
		 * 	return emailData;
		 * }
		 */
		/* CustomizeSupplierNotificationEmailData: function(emailData)
		{
			return emailData;
		},*/

		/**
		 * @method Lib.AR.Customization.Payment.FinalizePaymentNotificationEmail
		 * @description
		 * This function allows you to modify the email transport of the payment notification before it's processed.
		 * The notification can either be the one sent to the Supplier or the one sent to the customer
		 * The transportIdentifier variable is given as second argument and equals to either :
		 * CustomerPaymentNotification or SupplierPaymentNotification
		 * 
		 * @example
		 * FinalizePaymentNotificationEmail: function(email, transportIdentifier)
		 * {
		 * 	if (transportIdentifier === "SupplierPaymentNotification")
		 * 	{
		 * 		var vars = email.GetUninheritedVars();
		 * 		vars.AddValue_String("EmailAddress", "john.doe@example.com", true);
		 * 	}
		 * 	return email;
		 * }
		 */
		/* FinalizePaymentNotificationEmail: function(email, transportIdentifier)
		{
			return email;
		},*/

		/**
		 * @method Lib.AR.Customization.Payment.SkipCreatingPaymentFromCollectionsManagement
		 * @description
		 * This function can be used to skip or force creating payments in EOD that were made in Collections Management.
		 * @param {Sys.AR.TermSync.PaymentTermSyncEvent} paymentEvent Event data from Collections Management
		 * @returns {string} One of 1) Reason for skipping payment, 2) "CREATE" to force creation of the payment, or 3) "" or null to use the default logic
		 * 
		 * @example This example will skip payments with a 'voided' status or use the default logic.
		 * SkipCreatingPaymentFromCollectionsManagement: function(paymentEvent)
		 * {
		 * 	if (paymentEvent.status === "voided")
		 * 	{
		 * 		return "The payment is voided/canceled";
		 * 	}
		 * 	return null;
		 * }
		 */
		/* SkipCreatingPaymentFromCollectionsManagement: function(paymentEvent)
		{
			return null;
		},*/

		/**
		 * @method Lib.AR.Customization.Payment.OnPaymentStatusChanged
		 * @description
		 * This function is called whenever the payment status of a payment is updated
		 * It is called once after the initial paying process, and then on payment status polling when
		 * the payment status changes
		 * @param {string} paymentStatus payment status from the payment module (using EoD values)
		 * @param {string} paymentID id of the payment updated (can be used to query)
		 * 
		 * @example
		 * OnPaymentStatusChanged: function(paymentStatus,paymentId)
		 * {
		 * 	let query = Process.CreateQuery();
			query.SetSpecificTable("CDNAME#AR System Invoices Payment");
			query.SetAttributesList("*");
			query.SetSearchInArchive(true);
			query.SetFilter("Transaction_id__=" + paymentId);
			query.MoveFirst();

			let paymentRecord = query.MoveNext();
			if (!paymentRecord)
			{
				Log.Info("Unable to query payment"+ query.GetLastErrorMessage());
				return null;
			}
			let vars = paymentRecord.GetUninheritedVars();
			Log.Info(vars.GetValue_String("RuidEx", 0));
			Log.Info(paymentStatus);
			return null;
		 * }
		 */
		/* OnPaymentStatusChanged: function(paymentStatus,paymentId)
		{
			return null;
		},*/
	};

	return payment;
})();