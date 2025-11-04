/* LIB_DEFINITION{
  "name": "LIB_O2C_CUSTOMIZATION_USER_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "COMMON",
  "versionable": false,
  "comment": "all User customization function",
  "require": []
}*/

/**
 * Package O2C User customization callbacks
 * @namespace Lib.O2C.Customization.User
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.O2C = Lib.O2C || {};
Lib.O2C.Customization = Lib.O2C.Customization || {};

Lib.O2C.Customization.User = (function ()
{
	var customization = {
		/**
		 * @method Lib.O2C.Customization.User.CustomizePortailUserLogin
		 * @description
		 * Function called before automatically creating a non-existing customer using data extracted from the invoice, credit application or document
		 * Used to override the login user
		 * @param {Object} userProperty Object representing the default customer properties to access.
		 *
		 * @example Compute login with customer number and company code
		 * CustomizePortailUserLogin: function(userProperty)
		 * {
		 *	return userProperty.companyCode + userProperty.portailId;
		 * }
		 */
		/*CustomizePortailUserLogin: function(userProperty)
		{
		},*/

		/**
		 * @method Lib.O2C.Customization.User.GetCustomerWhenLoginIsCustomized
		 * @description
		 * Function called for retrieve customer login when we are customized login
		 * @param {Function} callback A callback function with login in parameter
		 * @param {string} customerNumber The customerNumber may be passed in in certain workflows e.g. involving a table of invoices. Otherwise it needs to be read from the appropriate field.
		 * @param {string} companyCode The companyCode may be passed in in certain workflows e.g. involving a table of invoices. Otherwise it needs to be read from the appropriate field.
		 *
		 * @example Retrieve customer login when uniqueness is company code and customerNumber
		 * GetCustomerWhenLoginIsCustomized: function(callback, customerNumber, companyCode)
		 * {
		 *	if (!customerNumber)
		 *	{
		 *		customerNumber = "";
		 *		if (Data.GetValue("Customer_ID__"))
		 *		{
		 *			customerNumber = Data.GetValue("Customer_ID__");
		 *		}
		 *		else if (Data.GetValue("Recipient_ID__"))
		 *		{
		 *			customerNumber = Data.GetValue("Recipient_ID__");
		 *		}
		 *	}
		 *	if (!companyCode)
		 *	{
		 *		companyCode = "";
		 *		if (Data.GetValue("Company_code__"))
		 *		{
		 *			companyCode = Data.GetValue("Company_code__");
		 *		}
		 *	}
		 *	var filter = "(&(IsCompany__=1)(BusinessPartnerId__="+customerNumber.toLowerCase()+")(SupplierCompanyCode__="+companyCode+"))";
		 *	Sys.GenericAPI.Query("Customer_Extended_Delivery_Properties__", filter, ["CustomerID__"], function (records, error)
		 *	{
		 *		var login = "";
		 *		if (!error && records.length !== 0)
		 *		{
		 *			login = records[0]["CustomerID__"];
		 *		}
		 *		callback(login);
		 *	});
		 * }
		 */
		/*GetCustomerWhenLoginIsCustomized: function(callback, customerNumber, companyCode)
		{
		}*/
	};
	return customization;
})();

