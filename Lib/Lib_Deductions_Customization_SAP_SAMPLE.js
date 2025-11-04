/* LIB_DEFINITION{
  "name": "Lib_Deductions_Customization_SAP_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "COMMON",
  "versionable": false,
  "comment": "Deductions SAP posting customization functions",
  "require": []
}*/

/**
 * This module contains
 * @namespace Lib.Deductions.Customization.SAP
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.Deductions = Lib.Deductions || {};
Lib.Deductions.Customization = Lib.Deductions.Customization || {};

Lib.Deductions.Customization.SAP = (function ()
{
	/**
	 * @lends Lib.Deductions.Customization.SAP
	 */
	var SAP =
	{
		/**
		 * @method Lib.Deductions.Customization.SAP.GetBAPIName
		 * @description Return the BAPI name to call.
		 * Allows for retrieving the customized name of a BAPI from the specified default BAPI name.
		 * This user exit is called for each BAPI used in Deductions processing.
		 * @param {string} originalBapiName for instance "SD_SALESDOCUMENT_CREATE"
		 * @returns {string} String value containing the customized BAPI name or, if no mapping has been defined, the default BAPI name.
		 * @example <caption>This example retrieves the customized name of the auto-commit BAPIs:</caption>
		 * GetBAPIName: function (originalBapiName)
		 * {
		 *	var customBapiName;
		 *	switch (originalBapiName)
		 *	{
		 *		case "SD_SALESDOCUMENT_CREATE":
		 *			customBapiName = "Z_MY_BAPI";
		 *			break;
		 *	}
		 *	return customBapiName;
		 * }
		 */
		/*GetBAPIName: function(originalBapiName)
		{
		},*/

		/**
		 * @method Lib.Deductions.Customization.SAP.OverrideBAPIParams
		 * @description 
		 * 	Return the BAPI params to pass to SAP call
		 *  originalBapiParams["EXPORTS"]["SALES_HEADER_IN"]["DOC_TYPE"] === "G2" for Credit Note
		 *  originalBapiParams["EXPORTS"]["SALES_HEADER_IN"]["DOC_TYPE"] === "L2" for Debit Note
		 *
		 * @param {string} originalBapiName for instance "SD_SALESDOCUMENT_CREATE"
		 * @param {object} originalBapiParams the original BAPI params to modify
		 * @returns {object} the modified BAPI params (no retrun value or null to use the original BAPI params)
		 * @example
		 * OverrideBAPIParams: function (originalBapiName, originalBapiParams)
		 * {
		 * 	originalBapiParams.EXPORTS.HEADER = { RECEIVER: "XYZ" };
		 * }
		 * 
		*/
		/*OverrideBAPIParams: function (originalBapiName, originalBapiParams)
		{
		},*/

		/**
		 * @method Lib.Deductions.Customization.SAP.WrapCreateCreditMemoCallback
		 * @description 
		 * Return the callback function which will be called right after the CallBAPI
		 *
		 * @param {Function} originalCallback the standard callback
		 * @returns {Function} the new callback which must take a json object in parameter
		 * @example
		 * WrapCreateCreditMemoCallback: function (originalCallback)
		 * {
		 * 	var newCallback = function(jsonResult)
		 * 	{
		 * 		//SAP JSON result usage
		 *
		 * 		originalCallback(jsonResult);
		 * 	}
		 *
		 * 	return newCallback;
		 * }
		 * 
		*/
		/*WrapCreateCreditMemoCallback: function (originalCallback)
		{
		},*/

		/**
		 * @method Lib.Deductions.Customization.SAP.WrapCreateDebitMemoCallback
		 * @description 
		 * Return the callback function which will be called right after the CallBAPI
		 *
		 * @param {Function} originalCallback the standard callback
		 * @returns {Function} the new callback which must take a json object in parameter
		 * @example
		 * WrapCreateDebitMemoCallback: function (originalCallback)
		 * {
		 * 	var newCallback = function(jsonResult)
		 * 	{
		 * 		//SAP JSON result usage
		 *
		 * 		originalCallback(jsonResult);
		 * 	}
		 *
		 * 	return newCallback;
		 * }
		 * 
		 */
		/*WrapCreateDebitMemoCallback: function (originalCallback)
		{
		},*/

		/**
		 * @method Lib.Deductions.Customization.SAP.GetDummyMaterial
		 * @description 
		 * Return material id used to complete SAP credit or debit memo request.
		 * 
		 * @returns {string} Dummy material sent to SAP
		 * @example
		 * GetDummyMaterial: function()
		 * {
		 * 	return "CP-1000";
		 * }
		 * 
		 */
		/*GetDummyMaterial: function ()
		{
			return "";
		},*/
	};
	return SAP;
})();