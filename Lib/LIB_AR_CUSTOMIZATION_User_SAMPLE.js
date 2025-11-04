/* LIB_DEFINITION{
  "name": "LIB_AR_CUSTOMIZATION_User_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "comment": "all User customization function",
  "versionable": false,
  "require": []
}*/

/**
 * Package AR User customization callbacks
 * @namespace Lib.AR.Customization.User
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};

Lib.AR.Customization.User = (function ()
{
	var User =
	{
		/**
		 * @method Lib.AR.Customization.User.CustomizeAutomaticCustomerCreation
		 * @description
		 * Function called before automatically creating a non-existing customer using data extracted from the invoice.
		 * Used to override default user properties.
		 * @param {object} propertyOverrides Object representing the default customer properties to access. Refer to [User variables]{@link https://doc.esker.com/eskerondemand/cv_ly/en/manager/startpage.htm#common/references/fields/userprintable.html} for a list of available properties. The AllowNoPassword property is specific to the Accounts Receivable application.
		 * @param {boolean} propertyOverrides.AllowNoPassword Overrides the Allow password-free login option in the [Delivery options]{@link https://doc.esker.com/eskerondemand/cv_ly/en/manager/Content/Processes/AR/ApplicationSettingsWizard_delivery.html} step of the configuration tool.
		 * 
		 * @example This user exit forces the language to <B style="color: red">English</B> for all customers automatically created in the application.
		 * CustomizeAutomaticCustomerCreation: function(propertyOverrides)
		   * {
		 * 	propertyOverrides.language = "en";
		 * }
		 *
		 * @example This user exit forces the <B style="color: red">Allow password-free login</B> option for all the customers of the Acme company created automatically in the application.
		 * CustomizeAutomaticCustomerCreation: function (propertyOverrides)
		 * {
		 *	 if (Data.GetValue("Customer_name__") == "Acme") 
		 *	 {
		 *		 propertyOverrides.AllowNoPassword = true;
		 *	 }
		 * }
		 */
		/*
		CustomizeAutomaticCustomerCreation: function(propertyOverrides)
		{
		},
		*/

		/**
		 * @method Lib.AR.Customization.User.CustomizeAutomaticCustomerUpdate
		 * @description
		 * Function called before automatically updating a customer using data extracted from the invoice.
		 * Used to override extracted user properties.
		 * @param {object} propertiesToUpdate the changed user properties (if any) from the following list: "Company", "Title", "Firstname", "Lastname", "PreferredDeliveryMethod", "EmailAddress", "PhoneNumber", "FaxNumber", "Street", "ZipCode", "City", "Country", "DeliveryCopyEmail", "CHORUS_CodeServiceExecutant__", "PEC_Email__"
		 * @param {User} user
		 * 
		 * @example Prevent the update of the Company Name for the members of ACME company
		 * CustomizeAutomaticCustomerUpdate: function(propertiesToUpdate, userToUpdate)
		   * {
		 * 	if(userToUpdate.GetValue("Company") === "ACME")
		 * 	{
		 * 		delete propertiesToUpdate.Company;
		 * 	}
		 *  return propertiesToUpdate;
		 * }
		 * @example Update only one property (the company) from the changed propertie
		 * CustomizeAutomaticCustomerUpdate: function(propertiesToUpdate, userToUpdate)
		   * {
		 *  return {
		 * 		Company: propertiesToUpdate.Company;
		 * }
		 */
		/*
		CustomizeAutomaticCustomerUpdate: function(propertiesToUpdate, user)
		{
		}
		*/
	};

	return User;
})();
