/* LIB_DEFINITION{
  "name": "LIB_AR_CUSTOMIZATION_CSVIMPORT_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "comment": "CSV Import customization functions",
  "versionable": false,
  "require": []
}*/

/**
* This module contains Open AR customization functions:
*  - configuration customization, including field Mapping
* 	- invoice type detection customization
*  - ignored lines customization
* @namespace Lib.AR.Customization.CSVImport
*/

///#GLOBALS Lib
var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};

Lib.AR.Customization.CSVImport = (function ()
{
	/**
	 * @lends Lib.AR.Customization.CSVImport
	 */
	var customization = {
		/**
		 * This function will be called before loading the configuration used to import a CSV.
		 * It allows you to customize the configuration to use. You can use the CSV file name if needed.
		 * When returning empty, the default behavior will be applied: the configuration name has to be set
		 * in the Import process.
		 * @return The configuration name to use
		 * @example
		 * <pre><code>
		 *	GetConfigurationName: function (csvFileName)
		 *	{
		 *      // Switch configuration depending of OpenAR CSV file name
		 * 		if(csvFileName.indexOf("textToSearch") > -1)
		 * 		{
		 * 			// Text found
		 * 			return "config1";
		 * 		}
		 * 		else
		 * 		{
		 * 			return "config2";
		 * 		}
		 * 	}
		 * </code></pre>
		 */
		GetConfigurationName: function (csvFileName)
		{
			return "";
		},

		/**
		 * This function will be called after loading the configuration used to import a CSV.
		 * It allows you to customize the configuration by adding a function to compute a field value (sourceComputedValue), or by setting a constant value (sourceConstantValue).
		 * Use it to compute a field depending of others values in the same csv line or to force a constant value.
		 * This user exit is called after the loading of the configuration in the import finalization script.
		 * @return The updated configuration
		 * @example
		 * <pre><code>
		 *	CustomizeConfiguration: function (configuration)
		 *	{
		 *      // Get the current mapping
		 *		const mapping = configuration.GetMapping();
		 *
		 *      // Add a function to compute a value from other values defined in the current CSV line
		 * 		// The mapping references the invoice fields
		 * 		mapping["Invoice_outstanding_amount__"].sourceComputedValue = function(csvLine)
		 * 		{
		 * 			// The csvLine references the csv header fields
		 *	 		return csvLine["Open Invoice Amount"] ? csvLine["Open Invoice Amount"] : "0";
		 *		};
		 *
		 *		// Force a constant value
		 *		mapping["Invoice_currency__"].sourceConstantValue = "EUR";
		 *
		 * 		return configuration;
		 * 	}
		 * </code></pre>
		 */
		CustomizeConfiguration: function (configuration)
		{
			return configuration;
		},

		/**
		 * This function will be called during the import of a CSV file, for each line.
		 * It allows you to override the way invoice type is detected for the current line. The default implementation checks
		 * whether the total amount or outstanding amount is positive or negative to differentiate Invoice and Credit Note
		 * @return {string} Invoice type. Possible values are "INVOICE", "CREDIT_NOTE", "CREDIT" and "DEBIT"
		 * @example
		 * <pre><code>
		 *	CustomizeInvoiceTypeDetection: function (csvLine, config)
		 *	{
		 *      var invoiceType = null;
		 *
		 * 		// Detect invoice type based on beginning of the Invoice Number
		 * 		if(csvLine["Invoice_number__"].substr(0,3) === "400")
		 * 		{
		 * 			invoiceType = "CREDIT_NOTE";
		 * 		}
		 * 		else
		 * 		{
		 * 			invoiceType = "INVOICE";
		 * 		}
		 * 		return invoiceType;
		 * 	}
		 * </code></pre>
		 */
		CustomizeInvoiceTypeDetection: function (csvLine, config)
		{
			return null;
		},

		/**
		 * This function will be called during the import of a CSV file, for each line.
		 * It indicates the conditions when the line should be ignored.
		 * The default behaviour is that no line is ignored
		 * @return {boolean} If true, the line will be ignored
		 * @example
		 * <pre><code>
		 *	LineHasToBeIgnored: function (csvLine, config)
		 *	{
		 *      var ignoreLine = false;
		 *
		 * 		// Ignore line if the Total amount is negative (to exclude Credit Notes)
		 * 		if(csvLine["Invoice_total_amount__"] < 0)
		 * 		{
		 * 			ignoreLine = true;
		 * 		}
		 * 		return ignoreLine;
		 * 	}
		 * </code></pre>
		 */
		LineHasToBeIgnored: function (csvLine, config)
		{
			return false;
		},

		/**
		 * Allow the user to filter the supplier invoices that will be matched with the OpenAR.
		 * This user exit allows you to either make the existing filter more accurate or replace it completely.
		 * The default filter gets invoices which are currently opened.
		 * This user exit is called in the finalization script of the Invoices Mass Update OpenAR Import process.
		 * @returns {string} return the filter to get the opened invoices to confront with the openAR
		 * @example
		 * This user exit allows to filter invoices whose invoice number matches a particular pattern.
		 * <pre><code>
		 * CustomizeInvoiceFilter: function(filter, configuration)
		 * {
		 *      var customFilter = "";
		 *      if (configuration.GetConfigurationName() === "default")
		 *      {
		 *      	// This filter matches invoice numbers which begin with "140"
		 *      	customFilter = "(invoice_number=140*)";
		 *      }
		 *
		 *      if (customFilter !== "")
		 *      {
		 *      	filter = "(&" + filter + customFilter + ")";
		 *      }
		 *      return filter;
		 * }
		 * </code></pre>
		 */
		CustomizeInvoiceFilter: function (filter, configuration)
		{
			return filter;
		},

		/**
		 * Allow the user to specify if the given line of the OpenAR file should be inserted.
		 * This user exit is called in the finalization script of the Invoices Mass Update OpenAR Insert process.
		 * @return {boolean} If true, the line will be inserted
		 * @example
		 * This user exit allows to filter invoices whose invoice number matches a particular pattern.
		 * <pre><code>
		 * LineHasToBeInserted: function(csvLine, configuration)
		 * {
		 * 		if (csvLine["invoice_number__"].substr(0,3) === "140")
		 *      {
		 * 			// Only the invoice numbers which begin with "140" will be inserted
		 * 			return true;
		 *      }
		 *		return false;
		 * }
		 * </code></pre>
		 */
		LineHasToBeInserted: function (csvLine, configuration)
		{
			return true;
		},

		/**
		 * Allow the user to specify the AR configuration to use when OpenAR inserts new invoices.
		 * This user exit is called in the finalization script of the Invoices Mass Update OpenAR Insert process.
		 * This is only needed when inserting invoices via OpenAR requires a non-standard configuration.
		 * When returning empty, the default AR configuration will be used.
		 * @return {string} the name of the AR configuration to use
		 * @example
		 * <pre><code>
		 * GetARConfigurationNameForInsert: function()
		 * {
		 *		return "specificConf";
		 * }
		 * </code></pre>
		 */
		GetARConfigurationNameForInsert: function ()
		{
			return "";
		},

		/**
		 * @method Lib.AR.Customization.CSVImport.RecomputePaymentsWaitingForAllocationAfterImport
		 * @description 
		 * Update the possible allocations suggested within payments waiting for allocation, after successful Open AR import.
		 * @param {object} configuration The configuration object, as returned by CustomizeConfiguration user exit.
		 * @return {boolean} true to recompute payments (default value), else false.
		 * @example
		 * <pre><code>
		 * RecomputePaymentsWaitingForAllocationAfterImport: function(configuration)
		 * {
		 *		if (configuration.GetConfigurationName() === "Lockbox")
		 *      {
		 * 			// Suggestions are suggested by a lockbox remittance, no need to compute combination of invoices
		 * 			return false;
		 * 		}
		 *
		 * 		return true;
		 * }
		 * </code></pre>
		 */
		/*RecomputePaymentsWaitingForAllocationAfterImport: function(configuration)
		{
			return true;
		},*/

		/**
		 * @method Lib.AR.Customization.CSVImport.CustomizeEmailNotification
		 * @description 
		 * Allows to customize email notification attributes
		 * @param {Lib.AR.Customization.Common.EmailNotification} emailData Email notification attributes
		 */
		/*CustomizeEmailNotification: function (emailData)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.CSVImport.FinalizeInsertingInvoice
		 * @description 
		 * Use it to complete additional actions after successfully inserting an invoice from the Open/AR file.
		 * The user exit is called after sending the new invoice for processing.
		 * @param {object} csvLine The csv line object as used to insert the new invoice.
		 * @example
		 * <pre><code>
		 * FinalizeInsertingInvoice: function(csvLine)
		 * {
		 *	  var isDebitNote = csvLine["Invoice_number__"].substr(0,3) === "600";
		 *    if (isDebitNote)
		 *    {
		 *		 var deduction = Process.CreateProcessInstance("Deductions Processing", false);
		 *		 var deductionVars = deduction.GetUninheritedVars();
		 *		 deductionVars.AddValue_String("Configuration__", "default", true);
		 *		 deductionVars.AddValue_String("Deduction_type__", "Missing products", true);
		 *		 deductionVars.AddValue_String("Document_number__", "CL_" + csvLine["Invoice_number__"], true);
		 *		 deductionVars.AddValue_String("Refered_to_invoice__", csvLine["Invoice_number__"], true);
		 *		 deductionVars.AddValue_Double("Claim_amount__", csvLine["Invoice_outstanding_amount__"], true);
		 *		 deductionVars.AddValue_String("Customer_ID__", csvLine["Customer_ID__"], true);
		 *		 deduction.Process();
		 *    }
		 * }
		 * </code></pre>
		 */
		/*FinalizeInsertingInvoice: function(csvLine)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.CSVImport.FinalizeReopeningInvoice
		 * @description 
		 * Use it to complete additional actions after successfully reopening an invoice from the Open/AR file.
		 * The user exit is called after processing the updates on the reoponed invoice.
		 * @param {xTransport} invoice The currently reoponed invoice.
		 * @param {object} csvLine The csv line object as used to reopen the invoice.
		 * @example
		 * <pre><code>
		 * FinalizeReopeningInvoice: function(invoice, csvLine)
		 * {
		 *		var invoiceVars = invoice.GetUninheritedVars();
		 *		var invoiceNumber = invoiceVars.GetValue_String("Invoice_number__", 0);
		 *		var isDebitNote = invoiceNumber.substr(0,3) === "600";
		 *		if (isDebitNote)
		 *		{
		 *			var deductionQuery = Process.CreateQuery();
		 *			deductionQuery.Reset();
		 *			deductionQuery.SetSpecificTable("CDNAME#Deductions Processing");
		 *			deductionQuery.SetSearchInArchive(true);
		 *			deductionQuery.SetFilter("(Refered_to_invoice__=" + invoiceNumber + ")");
		 *
		 *			if (deductionQuery.MoveFirst())
		 *			{
		 *				var deduction = deductionQuery.MoveNext();
		 *				var deductionVars = deduction.GetUninheritedVars();
		 *				if (deduction)
		 *				{
		 *	 				deductionVars.AddValue_String("Document_status__", "TO_VERIFY", true);
		 *					deductionVars.AddValue_Double("Claim_amount__", csvLine["Invoice_outstanding_amount__"], true);
		 *					deduction.Process();
		 *				}
		 *			}
		 *			if (deductionQuery.GetLastError())
		 *			{
		 *				throw new Error(deductionQuery.GetLastErrorMessage());
		 *			}
		 *		}
		 * }
		 * </code></pre>
		*/
		/*FinalizeReopeningInvoice: function(invoice, csvLine)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.CSVImport.FinalizeUpdatingInvoice
		 * @description 
		 * Use it to complete additional actions after successfully updating an invoice from the Open/AR file.
		 * The user exit is called after processing the updates on the invoice.
		 * @param {xTransport} invoice The currently updated invoice.
		 * @param {object} csvLine The csv line object as used to update the invoice.
		 * @example
		 * <pre><code>
		 * FinalizeUpdatingInvoice: function(invoice, csvLine)
		 * {
		 *		var invoiceVars = invoice.GetUninheritedVars();
		 *		var invoiceNumber = invoiceVars.GetValue_String("Invoice_number__", 0);
		 *		var isDebitNote = invoiceNumber.substr(0,3) === "600";
		 *		if (isDebitNote)
		 *		{
		 *			var deductionQuery = Process.CreateQuery();
		 *			deductionQuery.Reset();
		 *			deductionQuery.SetSpecificTable("CDNAME#Deductions Processing");
		 *			deductionQuery.SetSearchInArchive(true);
		 *			deductionQuery.SetFilter("(Refered_to_invoice__=" + invoiceNumber + ")");
		 *
		 *			if (deductionQuery.MoveFirst())
		 *			{
		 *				var deduction = deductionQuery.MoveNext();
		 *				var deductionVars = deduction.GetUninheritedVars();
		 *				if (deduction)
		 *				{
		 *					deductionVars.AddValue_Double("Claim_amount__", csvLine["Invoice_outstanding_amount__"], true);
		 *					deduction.Process();
		 *				}
		 *			}
		 *			if (deductionQuery.GetLastError())
		 *			{
		 *				throw new Error(deductionQuery.GetLastErrorMessage());
		 *			}
		 *		}
		 * }
		 * </code></pre>
		*/
		/*FinalizeUpdatingInvoice: function(invoice, csvLine)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.CSVImport.UpdateClosingQueryAttributes
		 * @description
		 * Use it to add query attributes from customer invoices (supplier copy) CD
		 * The user exit is called after processing the updates to close the invoice.
		 * DO NOT REMOVE ATTRIBUTES FROM DEFAULT
		 * @param {array} attributes the default query attributes.
		 * @example
		 * <pre><code>
		 * UpdateClosingQueryAttributes: function (attributes)
		 * {
		 *		attributes.push([newAttributes1, newAttributes2]);
		 *		return attributes;
		 * }
		 * </code></pre>
		*/
		/*UpdateClosingQueryAttributes: function (attributes)
		{
		},*/

		/**
		 * @method Lib.AR.Customization.CSVImport.FinalizeClosingInvoice
		 * @description
		 * Use it to complete additional actions after successfully closing an invoice from the Open/AR file.
		 * The user exit is called after processing the updates to close the invoice.
		 * @param {object} invoice the currently invoice being closed.
		 * @param {string} msnex The msnex as used to close the invoice.
		 * @example
		 * <pre><code>
		 * FinalizeClosingInvoice: function(invoice, msnex)
		 * {
		 *		var invoiceVars = invoice.GetUninheritedVars();
		 *		var invoiceNumber = invoiceVars.GetValue_String("Invoice_number__", 0);
		 *		var isDebitNote = invoiceNumber.substr(0,3) === "600";
		 *		if (isDebitNote)
		 *		{
		 *			var deductionQuery = Process.CreateQuery();
		 *			deductionQuery.Reset();
		 *			deductionQuery.SetSpecificTable("CDNAME#Deductions Processing");
		 *			deductionQuery.SetSearchInArchive(true);
		 *			deductionQuery.SetFilter("(Refered_to_invoice__=" + invoiceNumber + ")");
		 *
		 *			if (deductionQuery.MoveFirst())
		 *			{
		 *				var deduction = deductionQuery.MoveNext();
		 *				var deductionVars = deduction.GetUninheritedVars();
		 *				if (deduction)
		 *				{
		 *					deductionVars.AddValue_Double("State", 200, true);
		 *                  deductionVars.AddValue_String("Document_status__", "RESOLVED", true);
		 *					deduction.Process();
		 *				}
		 *			}
		 *			if (deductionQuery.GetLastError())
		 *			{
		 *				throw new Error(deductionQuery.GetLastErrorMessage());
		 *			}
		 *		}
		 * }
		 * </code></pre>
		*/
		/*FinalizeClosingInvoice: function (invoice, msnex)
		{
		},*/

		/**
		 * This function allows you to customize the mapping used to generate the CSV file that is sent to Collections module.
		 * @return The updated mapping
		 * @example
		 * <pre><code>
		 *	CustomizeMappingForCollections: function (mapping)
		 *	{
		 * 		// Change an existing mapping
		 *		mapping["Description"] = "CustomComment__";
		 *
		 * 		// Add a custom field
		 *		mapping["customfield 1"] = "CustomField1__";
		 *
		 * 		return mapping;
		 * 	}
		 * </code></pre>
		 */
		CustomizeMappingForCollections: function (mapping)
		{
			return mapping;
		},

		/**
		 * This function allows you to increase the maximum amount of invoices that can be created by OpenAR Imports.
		 * By default, only 100k (51k in QA) invoices can be created over a 24h period to limit the impact on the platform.
		 * If you need to increase this value, please contact SRE / CS1 to plan a suitable time to run this impactful import.
		 * @return The maximum number of invoices that can be created over a 24h 
		 * @example
		 * <pre><code>
		 *	CustomizeInvoiceCreationDailyLimit: function ()
		 *	{
		 * 		// Increase limit for initilization of big Customers
		 * 		return 500000;
		 * 	}
		 * </code></pre>
		 */
		CustomizeInvoiceCreationDailyLimit: function ()
		{
			return 0;
		},

		/**
		 * This function allows you to customize the supi and/or cusi before we process the close request.
		 * @param {xTransport} record the record to be closed
		 * @param {boolean} isCusi true if the record is a cusi, false if it is a supi
		 * @example 
		 * <pre><code>
		 *	CustomizeClosingBeforeProcessing: function (record, isCusi)
		 *	{
		 * 		var vars = record.GetUninheritedVars();
		 *		vars.AddValue_String("Company_code__", "A01", true);
		 * 	}
		 * </code></pre>
		 */
		CustomizeClosingBeforeProcessing: function (record, isCusi)
		{
		},

		/**
		 * This function allows you to customize the supi and/or cusi before we process the insertion request.
		 * @param {xTransport} record the record to be inserted
		 * @param {OpenArLib.OpenArLine} csvLine the csv line as used to insert the new invoice.
		 * @param {OpenArLib.Configuration} config the configuration, as returned by CustomizeConfiguration user exit.
		 * @param {boolean} reopenInvoice true if the record is a reopen invoice, false if it is a new invoice
		 * @param {boolean} isCusi true if the record is a cusi, false if it is a supi
		 * @param {string} arConfigurationName the AR configuration name to use
		 * @param {ESKMap<string>} companiesCurrencies the companies currencies 
		 * @example 
		 * <pre><code>
		 *	CustomizeInsertingBeforeProcessing: function (record, csvLine, config, reopenInvoice, isCusi, arConfigurationName, companiesCurrencies)
		*	{
		* 		var vars = record.GetUninheritedVars();
		*       vars.AddValue_String("Company_code__", "A99", true);
		* 	}
		* </code></pre>
		*/
		CustomizeInsertingBeforeProcessing: function (record, csvLine, config, reopenInvoice, isCusi, arConfigurationName, companiesCurrencies)
		{
		},

		/**
		 * This function allows you to customize the supi and/or cusi before we process the update request.
		 * @param {xTransport} record the record to be updated
		 * @param {OpenArLib.OpenArLine} csvLine the csv line as used to insert the new invoice.
		 * @param {boolean} isCusi true if the record is a cusi, false if it is a supi
		 * @param {ESKMap<string>} companiesCurrencies the companies currencies 
		 * @example 
		 * <pre><code>
		 *	CustomizeUpdatingBeforeProcessing: function (record, csvLine, isCusi, companiesCurrencies)
		*	{
		* 		var vars = record.GetUninheritedVars();
		*		vars.AddValue_String("Company_code__", "A50", true);
		* 	}
		* </code></pre>
		*/
		CustomizeUpdatingBeforeProcessing: function (record, csvLine, isCusi, companiesCurrencies)
		{
			return;
		}

	};

	return customization;
})();
