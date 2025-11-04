/* LIB_DEFINITION{
  "name": "LIB_CA_CUSTOMIZATION_CONFIGURATION_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "all configuration customization function",
  "require": []
}*/

/**
 * Package CA configuration customization callbacks for all processes
 * @namespace Lib.CA.Customization.Configuration
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.Customization = Lib.CA.Customization || {};

Lib.CA.Customization.Configuration = (function ()
{
	/**
	 * @lends Lib.CA.Customization.Configuration
	 */
	var Configuration =
	{
		/**
		 * @method Lib.CA.Customization.Configuration.CustomizeConfiguration
		 * @description
		 * This function is called the first time a parameter is queried, in order to know which configuration should be addressed.
		 * This function is called for both CA Payment file processing and CA Lockbox file processing.
		 * The configuration to use (stored in the "CA - Application Settings__" or "CA - Lockbox Settings__" table) typically depends on the type of document that is submitted
		 * The loaded configuration then defines the whole submission behavior.
		 * @returns {string} the name of the configuration to use (must match the "ConfigurationName__" field) for the CA payment file processing
		 * @example The following example determines the configuration based on the file type being JSON and the account number found within.
		 * CustomizeConfiguration: function ()
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
		 * 			switch (accountNumber)
		 * 			{
		 * 				case "123456789":
		 * 					return "Json 123456789 Config";
		 * 				case "987654321":
		 * 					return "Json 987654321 Config";
		 * 			}
		 * 		}
		 * 	}
		 * 	return null;
		 * }
		 */
		/*CustomizeConfiguration: function ()
		{
			return null;
		},*/

		/**
		 * @method Lib.CA.Customization.Configuration.GetConfigCriteriaString
		 * @description
		 * This function is used to retrieve the string to test for applicability criteria when determining which configuration to use.
		 * This function is called for both CA Payment file processing and CA Lockbox file processing.
		 * @param {string} path the name of the field from which to retrieve the applicability criteria value to compare against the configured String
		 * @returns {string} the applicability criteria value to compare against the configured String
		 * @example The following example retrieves the configuration string for a file type of JSON and also supports resubmitting a payment.
		 * GetConfigCriteriaString: function (path)
		 * {
		 * 	var configCriteriaString = "";
		 * 	var paymentDate;
		 * 	if (Attach.GetNbAttach() > 0)
		 * 	{
		 * 		// Allow reprocessing of the file from the beginning
		 * 		Attach.ResetGetContentByBlock(0);
		 * 		var parsedJson = JSON.parse(Attach.GetContent(0));
		 * 		for (var i = 0; i < parsedJson.length; i++)
		 * 		{
		 * 			var currentPayment = parsedJson[i];
		 * 			if (currentPayment)
		 * 			{
		 * 				switch (path.toLowerCase())
		 * 				{
		 * 					case "currency":
		 * 						configCriteriaString = currentPayment.Currency || "USD";
		 * 						break;
		 * 					case "paymentmethod":
		 * 						configCriteriaString = "CHECK_PAID";
		 * 						break;
		 * 					case "paymentdate":
		 * 						paymentDate = new Date(currentPayment.CaptureTime);
		 * 						configCriteriaString = isFinite(paymentDate.getTime()) ? Sys.Helpers.Date.Date2DBDateTime(paymentDate) : "";
		 * 						break;
		 * 					case "paidamount":
		 * 						configCriteriaString = currentPayment.CheckAmount;
		 * 						break;
		 * 					case "payer":
		 * 						configCriteriaString = (currentPayment.CRouting || "") + (currentPayment.CAccount || "");
		 * 						break;
		 * 					case "transactionid":
		 * 						configCriteriaString = currentPayment.TransactionID || "";
		 * 						break;
		 * 					case "typecode":
		 * 						configCriteriaString = currentPayment.ItemType;
		 * 						break;
		 * 					case "banknumber":
		 * 						configCriteriaString = currentPayment.CRouting || "";
		 * 						break;
		 * 					case "accountnumber":
		 * 						configCriteriaString = currentPayment.CAccount || "987654321";
		 * 						break;
		 * 					case "checknumber":
		 * 						configCriteriaString = currentPayment.CNumber || "";
		 * 						break;
		 * 					default:
		 * 					// Do nothing
		 * 				}
		 * 			}
		 * 			if (configCriteriaString)
		 * 			{
		 * 				return configCriteriaString;
		 * 			}
		 * 		}
		 * 	}
		 * 	if (!configCriteriaString)
		 * 	{
		 * 		// Allow resubmitting the payment allocation form
		 * 		switch (path.toLowerCase())
		 * 		{
		 * 			case "currency":
		 * 				configCriteriaString = Data.GetValue("Currency__") || "";
		 * 				break;
		 * 			case "paymentmethod":
		 * 				configCriteriaString = Data.GetValue("Payment_method__") || "";
		 * 				break;
		 * 			case "paymentdate":
		 * 				paymentDate = new Date(Data.GetValue("Payment_date__"));
		 * 				configCriteriaString = isFinite(paymentDate.getTime()) ? Sys.Helpers.Date.Date2DBDateTime(paymentDate) : "";
		 * 				break;
		 * 			case "paidamount":
		 * 				configCriteriaString = Data.GetValue("Paid_amount__");
		 * 				break;
		 * 			case "payer":
		 * 				configCriteriaString = Data.GetValue("Payer__") || "";
		 * 				break;
		 * 			case "transactionid":
		 * 				configCriteriaString = Data.GetValue("TransactionID__") || "";
		 * 				break;
		 * 			case "banknumber":
		 * 				configCriteriaString = Data.GetValue("Bank_number__") || "";
		 * 				break;
		 * 			case "accountnumber":
		 * 				configCriteriaString = Data.GetValue("Account_number__") || "";
		 * 				break;
		 * 			case "checknumber":
		 * 				configCriteriaString = Data.GetValue("Check_number__") || "";
		 * 				break;
		 * 			default:
		 * 			// Do nothing
		 * 		}
		 * 	}
		 * 	return configCriteriaString;
		 * }
		 */
		/*GetConfigCriteriaString: function (path)
		{
			return null;
		}*/
	};

	return Configuration;

})();
