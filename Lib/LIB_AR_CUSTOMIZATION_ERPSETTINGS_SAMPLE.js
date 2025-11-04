/* LIB_DEFINITION{
  "name": "LIB_AR_CUSTOMIZATION_ERPSETTINGS_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "COMMON",
  "comment": "AR ERP Settings customization functions",
  "versionable": false,
  "require": []
}*/

/**
 * This module contains
 * - functions used to customize the AR ERP Settings table
 * @namespace Lib.AR.Customization.ERPSettings
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};

Lib.AR.Customization.ERPSettings = (function ()
{
	var ERPSettings =
	{
		/**
		 * @method Lib.AR.Customization.ERPSettings.CustomHtmlScriptInitialization
		 * @description
		 * This function is called at the end of the ERP Settings custom script initialization
		 */
		/*CustomHtmlScriptInitialization: function()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.ERPSettings.CustomHtmlScriptPreventSave
		 * @description
		 * This function is called before saving and exiting the ERP Settings form.
		 * Allows custom validation logic to be performed before saving the settings.
		 * @return {boolean} True if saving the form should be prevented.
		 */
		/*CustomHtmlScriptPreventSave: function()
		{
		},*/

		/**
		 * @method Lib.AR.Customization.ERPSettings.CustomizeERPSettingsFields
		 * @description
		 * This function is called to customize the configuration parameters retrieved/available when posting to the ERP.
		 * It is called once before retrieving the current settings from the AR - ERP Settings table.
		 * This can be paired with the function {@link Sys.AR.SAP.PaymentAccessor}.GetSapParameter in order to use custom fields when posting to SAP.
		 * @returns {string[]} List of extra custom configuration fields to retrieve for posting to the ERP.
		 *
		 * @example This example will additionally retrieve a custom API key field and another generic custom field.
		 * CustomizeERPSettingsFields: function ()
		 * {
		 * 	var customFieldsToInclude =
		 * 		[
		 * 			"z_X_API_Key__",
		 * 			"z_other_generic_custom_field__"
		 * 		];
		 * 	return customFieldsToInclude;
		 */
		/* CustomizeERPSettingsFields: function()
		{
			return null;
		},*/
	};

	return ERPSettings;
})();