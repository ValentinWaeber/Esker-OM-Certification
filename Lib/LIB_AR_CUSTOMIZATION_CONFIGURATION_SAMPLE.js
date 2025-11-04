/* LIB_DEFINITION{
  "name": "LIB_AR_CUSTOMIZATION_CONFIGURATION_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "comment": "PS configurations made with wizard customization functions",
  "versionable": false,
  "require": []
}*/

/**
 * Package AR configuration selection callbacks
 * @namespace Lib.AR.Customization.Configuration
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};

Lib.AR.Customization.Configuration = (function ()
{
	var Configuration =
	{
		/**
		 * @method Lib.AR.Customization.Configuration.CustomizeConfiguration
		 * @description
		 * This function is called the first time a parameter is queried, in order to know which configuration should be addressed
		 * The configuration to use (stored in the "AR - Application Settings__" table) typically depends on the type of document that is submitted
		 * The loaded configuration then defines the whole submission behavior (batch splitting, data extraction, archive duration, submission methods, ...)
		 * @return {string} the name of the configuration to use (must match the "ConfigurationName__" field) for the invoices batch submission
		 * 
		 * @example
		 *	CustomizeConfiguration: function () {
		 *		//Get the content of a relevant area defining the type of invoice that is sent
		 *		areaText = Document.GetArea(0, 180, 151, 451, 71).toString();
		 *
		 *		//We can tell the AR application to use the appropriate configuration settings for this type of invoice
		 *		switch(areaText)
		 *		{
		 *			case "US":
		 *				return "American Invoice";
		 *			case "IT":
		 *				return "Italian Invoice";
		 *			case "FR":
		 *				return "French Invoice":
		 *			default:
		 *				//Use the "default" configuration
		 *				return null;
		 *		}
		 * }
		 */
		CustomizeConfiguration: function ()
		{
			return null;
		},

		/**
		 * @method Lib.AR.Customization.Configuration.OverrideGetParameter
		 * @description
		 * Allows you to override every parameter value that should be returned by Sys.AR.GetParameter().
		 * WARNING: beware of implementing processing with high cost in that user exit because it's called
		 * a lot of time. For instance, DO NOT perform a query in that user exit without caching the result.
		 * @param {string} configurationName The detected configuration name
		 * @param {object} configurationParameters Set of all configuration parameters and values
		 * @param {string} parameterName The parameter asked in GetParameter call IN LOWER CASE
		 * @param {any} currentValue The current value that should be returned if the user exit was commented
		 * @returns The value to keep for the asked parameter
		 *
		 * @example
		 * <caption>In the following example, if the configuration name is "nosynchro" then we will disable the
		 * termsync synchronisation. In the other case, we will force it to true, but we could as well
		 * make an other choice of keeping the currentValue.</caption>
		 * OverrideGetParameter: function (configurationName, configurationParameters, parameterName, currentValue)
		 * {
		 * 		if (parameterName === "enable_termsync_synchronization__")
		 * 		{
		 * 			Log.Info("User exit \"OverrideGetParameter\": Overriding parameter " + parameterName);
		 * 			return configurationName != "nosynchro";
		 * 		}
		 *
		 * 		// Always return the currentValue if not modified
		 *		return currentValue;
		 * }
		 */
		/*OverrideGetParameter: function (configurationName, configurationParameters, parameterName, currentValue)
		{
			// Always return the currentValue if not modified
			return currentValue;
		},*/

		/**
		 * @method Lib.AR.Customization.Configuration.GetBackgrounds
		 * @description
		 * This function will be called when extraction script of the supplier copy is finished.
		 * It's expected to return files used to format document and according PDFCommand options to resize or change position of backgrounds images choose in wizard.
		 * @param {object} background for more informations on this parameter, Click [Here]{@link https://doc.esker.com/eskerondemand/cv_ly/en/manager/startpage.htm#Processes/Library/CustomizationAR/GetBackgrounds.html%3FTocPath%3DOrder%2520to%2520Cash%7CAccounts%2520Receivable%7CAccounts%2520Receivable%2520-%2520Invoice%2520delivery%7CConfiguring%2520and%2520customizing%2520the%2520application%7CCustomizing%2520the%2520application%7CCustomizing%2520the%2520application%2520using%2520user%2520exits%7CLib_AR_Customization_Configuration%2520library%2520overview%7C_____3}
		 * 
		 * @example
		 * <caption>Depending on the current year and whether the document is an invoice or a credit note, the user exit adds a background image to the invoice pages.
		 * The background image is stretched to 60% of its original size and is shifted horizontally and vertically.</caption>
		 * 	GetBackgrounds: function (backgrounds)
		 * 	{
		 * 		// set the background template depending on the current date and document type
		 * 		var currentYear = new Date().getFullYear().toString();
		 * 		if (Data.GetValue("Invoice_type__") === "CREDIT_NOTE")
		 * 			backgrounds.first.file = "%Images%\\CreditBackground_" + currentYear + ".jpg";
		 * 		else
		 * 			backgrounds.first.file = "%Images%\\InvoiceBackground_" + currentYear + ".jpg";
		 * 		// example of options, refer to PDFTool documentation: [-negative][-front][-jpegres|-prc prcSize][-XY deltaX deltaY]
		 * 		// this sample stretch the image to 60% and shift the position.
		 * 		backgrounds.first.options = "-prc 60 -XY 10 10";
		 * 	}
		 */
		GetBackgrounds: function (backgrounds)
		{
			return null;
		},

		/**
		 * @method Lib.AR.Customization.Configuration.GetTermsAndConditions
		 * @description
		 * This function will be called when extraction script of the supplier copy is finished.
		 * It's expected to return customer terms and conditions document and/or change position of terms and conditions file choose in wizard.
		 * @param {object} terms Terms and conditions file information formatted as a JavaScript object that must be provided with those fields:
		 * Parameter | Type       | Description
		 * ----------|------------|---------------------------------------------------------------------------------
		 * `enabled` |Boolean     |Determines if a terms and conditions page can be added to the invoice.The parameter can take one of the following values:
		 *           |            |`true`: A terms and conditions page can be added to the invoice.
		 *           |            |`false`: A terms and conditions page cannot be added to the invoice.
		 * `file`    |String      |The virtual path of the file to be inserted as terms and conditions. Only PDF are supported.
		 * `position`|String      |Indicates the position at which the terms and conditions page should be inserted in the invoice. This parameter can take one of the following values:
		 *           |            |`FIRST`: The terms and conditions page is inserted after the first page of the invoice.
		 *           |            |`LAST`: The terms and conditions page is inserted after the last page of the invoice.
		 *           |            |`EACH`: The terms and conditions page is inserted after each page of the invoice.
		 *
		 * @example Depending on the current year, this user exit adds a terms and conditions page after the first page of the invoice.
		 * 	GetTermsAndConditions: function (terms)
		 * 	{
		 * 		// set the terms and condition template depending on the current date
		 * 		var currentYear = new Date().getFullYear().toString();
		 * 		terms.file = "%Misc%\\terms_" + currentYear + ".pdf";
		 * 		terms.position = "FIRST";
		 * 	}
		 */
		GetTermsAndConditions: function (terms)
		{
			return null;
		}
	};
	return Configuration;
})();
