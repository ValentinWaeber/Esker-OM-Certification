/* LIB_DEFINITION{
  "name": "LIB_CA_LOCKBOX_CUSTOMIZATION_CONFIGURATION_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "all lockbox configuration customization function",
  "require": []
}*/

/**
 * Package CA Lockbox configuration customization callbacks for all processes
 * @namespace Lib.CA.Lockbox.Customization.Configuration
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.Lockbox = Lib.CA.Lockbox || {};
Lib.CA.Lockbox.Customization = Lib.CA.Lockbox.Customization || {};

Lib.CA.Lockbox.Customization.Configuration = (function ()
{
	/**
	 * @lends Lib.CA.Lockbox.Customization.Configuration
	 */
	var Configuration =
	{
		/**
		 * @method Lib.CA.Lockbox.Customization.Configuration.CustomizeConfiguration
		 * @since 330
		 * @description
		 * This function is called the first time a parameter is queried, in order to know which configuration should be addressed.
		 * This function is called for CA Lockbox file processing.
		 * The configuration to use (stored in the "CA - Lockbox Settings__" table) typically depends on the type of document that is submitted
		 * The loaded configuration then defines the whole submission behavior.
		 * @returns {string} the name of the configuration to use (must match the "ConfigurationName__" field) for the CA lockbox file processing
		 */
		/*CustomizeConfiguration: function ()
		{
			return null;
		},*/

		/**
		 * @method Lib.CA.Lockbox.Customization.Configuration.GetConfigCriteriaString
		 * @since 330
		 * @description
		 * This function is used to retrieve the string to test for applicability criteria when determining which configuration to use.
		 * This function is called for CA Lockbox file processing, and must handle parsing the attached lockbox file in order to get detailed information.
		 * To handle getting the applicability criteria from an already parsed file, use the function {@link Lib.CA.Lockbox.Customization.Configuration.GetConfigCriteriaStringFromParsedFile}.
		 * @param {string} path the name of the field from which to retrieve the applicability criteria value to compare against the configured String
		 * @returns {string} the applicability criteria value to compare against the configured String
		 */
		/*GetConfigCriteriaString: function (path)
		{
			return null;
		},*/

		/**
		 * @method Lib.CA.Lockbox.Customization.Configuration.GetConfigCriteriaStringFromParsedFile
		 * @since 332
		 * @description
		 * This function is used to retrieve the string to test for applicability criteria when determining which configuration to use.
		 * This function is called for CA Lockbox file processing.
		 * To handle getting the applicability criteria before the file is attempted to be parsed, use the function {@link Lib.CA.Lockbox.Customization.Configuration.GetConfigCriteriaString}.
		 * @param {string} path the name of the field from which to retrieve the applicability criteria value to compare against the configured String
		 * @param {Lib.CA.Lockbox.Extraction.LockboxItem[]} transactions List of lockbox transaction items parsed from the lockbox file using the current configuration being evaluated.
		 * @returns {string[]} the applicability criteria values from each parsed transaction to compare against the configured String
		 * @example <caption>This example shows the default behavior for getting applicability criteria, in order to make it easier to adjust</caption>
		 * GetConfigCriteriaStringFromParsedFile: function (path, transactions)
		 * {
		 * 	let configCriteria = [];
		 * 	for (const transaction of transactions)
		 * 	{
		 * 		switch (path.toLowerCase())
		 * 		{
		 * 			case "currency":
		 * 				configCriteria.push(transaction.currency);
		 * 				break;
		 * 			case "accountidentification":
		 * 			case "customeraccountnumber":
		 * 			case "payeenumber":
		 * 			case "accountnumber":
		 * 				configCriteria.push(transaction.payeeNumber);
		 * 				break;
		 * 			default:
		 * 				break;
		 * 		}
		 * 	}
		 * 	return configCriteria.length > 0 && configCriteria.join("").length > 0 ? configCriteria : null;
		 * }
		 */
		/*GetConfigCriteriaStringFromParsedFile: function (path, transactions)
		{
			return null;
		},*/
	};

	return Configuration;

})();
