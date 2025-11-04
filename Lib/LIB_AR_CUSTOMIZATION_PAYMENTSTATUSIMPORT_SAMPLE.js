/* LIB_DEFINITION{
  "name": "LIB_AR_CUSTOMIZATION_PAYMENTSTATUSIMPORT_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "comment": "CSV Payment Status Import customization functions",
  "versionable": false,
  "require": []
}*/

/**
* This module contains customization functions for the Payment Status Import process and its configuration
* @namespace Lib.AR.Customization.PaymentStatusImport
*/

///#GLOBALS Lib
var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};

Lib.AR.Customization.PaymentStatusImport = (function ()
{
	/**
	 * @lends Lib.AR.Customization.PaymentStatusImport
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
		 *      // Switch configuration depending of CSV file name
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
		 * Allow the user to filter the supplier invoices that will be matched with the CSV file.
		 * This user exit allows you to either make the existing filter more accurate or replace it completely.
		 * The default filter gets invoices which are currently opened.
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
		 * Allows to customize email notification attributes
		 * @param {Lib.AR.Customization.Common.EmailNotification} emailData Email notification attributes
		 */
		CustomizeEmailNotification: function (emailData)
		{
		},


		/**
		 * Use it to complete additional actions after successfully updating an invoice from the CSV file.
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
		FinalizeUpdatingInvoice: function (invoice, csvLine)
		{
		},


		/**
		 * This function allows you to customize the supi and/or cusi before we process the update request.
		 * @param {xTransport} record the record to be updated
		 * @param {Sys.Helpers.CSVReader.LineObject} csvLine the csv line as used to update the new invoice.
		 * @param {boolean} isCusi true if the record is a cusi, false if it is a supi
		 * @example 
		 * <pre><code>
		 *	CustomizeUpdatingBeforeProcessing: function (record, csvLine, isCusi)
		*	{
		* 		var vars = record.GetUninheritedVars();
		*		vars.AddValue_String("Company_code__", "A50", true);
		* 	}
		* </code></pre>
		*/
		CustomizeUpdatingBeforeProcessing: function (record, csvLine, isCusi)
		{
		},

		/**
		 * This function is called at the end of the Payment Status Import and allows you to add any custom behavior
		 * @param {PaymentStatusImport.Finalization.Configuration} configuration the configuration used during the import
		 * @param {string} csvFileName the name of the attached CSV file
		 * @example 
		 * <pre><code>
		 *	FinalizePaymentStatusImport: function (configuration, csvFileName)
		*	{
		* 	}
		* </code></pre>
		*/
		FinalizePaymentStatusImport: function (configuration, csvFileName)
		{

		},

		/**
		 * Customize the translation of the payment type
		 * @param {string} paymentType the payment type as written in the CSV file
		 * @param {string} currentPaymentTypeTranslationKey the current payment type translation key
		 * @returns the new translation key
		 * @example
		 * <pre><code>
		 *	CustomizePaymentTypeTranslation: function (paymentType, currentPaymentTypeTranslationKey)
		 *	{
		 *		if (paymentType === "CB")
		 *		{
		 *			return "_Bank card";
		 *		}
		 * 	}
		 * </code></pre>
		 */
		CustomizePaymentTypeTranslation: function (paymentType, currentPaymentTypeTranslationKey)
		{
			return currentPaymentTypeTranslationKey;
		}
	};

	return customization;
})();
