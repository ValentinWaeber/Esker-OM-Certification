/* LIB_DEFINITION{
  "name": "LIB_CA_CUSTOMIZATION_AUTOMATICZEROBALANCE_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "CashApplication automatic zero balance payment customization functions",
  "require": []
}*/

/**
 * This module contains
 * - the functions used to customize the Automatic Zero Balance Payment creation in the Cash Application
 * @namespace Lib.CA.Customization.AutomaticZeroBalance
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.Customization = Lib.CA.Customization || {};

Lib.CA.Customization.AutomaticZeroBalance = (function ()
{
	/**
	 * @lends Lib.CA.Customization.AutomaticZeroBalance
	 */
	var AutomaticZeroBalance =
	{
		/**
		 * @method Lib.CA.Customization.AutomaticZeroBalance.GetConfigToUse
		 * @description
		 * Allows for customizing which zero balance config should be used if more than one are found
		 * @param {string[]} matchingConfigurationNames The list of matching configuration names for this company code
		 * @returns {string} The configuration name to use
		 */
		/*GetConfigToUse: function(matchingConfigurationNames)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.AutomaticZeroBalance.GetCustomAttributes
		 * @description
		 * Allows for customizing which attributes are found when querying invoices. This is necessary if you need to later
		 * use a custom field when determining how invoices should be grouped
		 * @returns {string[]} The additional list of attributes to query
		 * @example Adds the payer address to the list of invoice attributes queried
		 * GetCustomAttributes: function()
		 * {
		 * 	return ["Customer_Payer_Address__"]
		 * }
		 */
		/*GetCustomAttributes: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.AutomaticZeroBalance.GetCustomInvoiceFilter
		 * @description
		 * Customizes the filter used to query invoices. This is called for each customer
		 * @param {string} filter The default ldap filter used to query invoices
		 * @param {string} customerId The id of the customer whose invoices are being queried
		 * @param {string} customFieldFromConfig The custom grouping field defined in the payment config
		 * @returns {string} The ldap filter to use
		 * @example This example adds a check for the existence Customer_Payer_Address__
		 * GetCustomInvoiceFilter: function(filter, customerId, customFieldFromConfig)
		 * {
		 * 	let companyCodeFilter = "";
		 *	Lib.CA.QueryHelper.Common.GetInvoiceCompanyCodeFilter().Then(
		 *		function (companyFilter)
		 *		{
		 *			companyCodeFilter = companyFilter;
		 *		}
		 *	);
		 * 	var ldap = Sys.Helpers.LdapUtil;
		 * 	filter = ldap.FilterAnd(
		 * 		ldap.FilterEqual("Deleted", "0"),
		 * 		ldap.FilterOr(
		 * 			ldap.FilterEqual("State", "100"),
		 * 			ldap.FilterEqual("State", "200")
		 * 		),
		 * 		ldap.FilterNotEqual("Invoice_outstanding_amount__", "0"),
		 * 		ldap.FilterRaw(companyCodeFilter),
		 * 		ldap.FilterEqual("Customer_ID__", customerId),
		 * 		ldap.FilterExist(customFieldFromConfig),
		 * 		ldap.FilterExist("Customer_Payer_Address__")
		 * 	).toString();
		 * 	return filter;
		 * }
		 */
		/*GetCustomInvoiceFilter: function(filter, customerId)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.AutomaticZeroBalance.CustomizeInvoiceGrouping
		 * @description
		 * Customizes the grouping of invoices. By default, they are grouped by the key/value stored in the custom field specified in the payment configuration
		 * @param {ESKMap<ESKMap<Array<string>>>} invoiceMapping The current grouping of invoices. e.g.
		 * @returns {ESKMap<ESKMap<Array<string>>>} The new grouping of invoices to use
		 * @example This example further splits the grouping from the one specified in the payment config, to also split by the payer address
		 * CustomizeInvoiceGrouping: function(invoiceMapping)
		 * {
		 * 	let newMap = {};
		 *
		 * 	for (var oldKey in invoiceMapping)
		 * 	{
		 * 		for (var invoice of invoiceMapping[oldKey])
		 * 		{
		 * 			var payerAddress = invoice.Customer_Payer_Address__;
		 * 			var newKey = oldKey + "|" + payerAddress;
		 * 			newMap[newKey] = newMap[newKey] || [];
		 * 			newMap[newKey].push(invoice);
		 * 		}
		 * 	}
		 *
		 * 	return newMap;
		 * }
		 */
		/*CustomizeInvoiceGrouping: function(invoiceMapping)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.AutomaticZeroBalance.CustomizeAllocations
		 * @description
		 * Can be used to customize any allocations found by the system, or to force a certain allocation when the standard matching
		 * algorithm is not able to find a suggestion for the provided invoices.
		 * @param {Lib.CA.Payment.MatchingItems.Invoice[]} invoices The set of invoices that can be matched
		 * @param {Lib.CA.Payment.Matches.Allocation[]} allocations Array containing any allocations that have already been suggested
		 * @returns {Lib.CA.Payment.Matches.Allocation[]} The new grouping of invoices to use
		 * @example This example fully allocates every invoice, and posts the difference to a GL account
		 * CustomizeAllocations: function(invoices, allocations)
		 * {
		 * 	if (allocations.length > 0)
		 * 	{
		 * 		//Don't overwrite suggestions if one was already found
		 * 		return allocations;
		 * 	}
		 *
		 * 	let allocation = new Lib.CA.Payment.Matches.Allocation();
		 * 	allocation.dueDateNotReached = false;
		 * 	allocation.sortScore = 0;
		 * 	allocation.sortScoreSecondary = 0;
		 * 	let paymentDate = new Date();
		 * 	let allocatedAmount = 0;
		 *
		 * 	for (let invoice of invoices)
		 * 	{
		 * 		let outstandingAmount = Lib.CA.Payment.MatchingItems.Invoice.GetOutstandingAmount(invoice, paymentDate);
		 * 		allocatedAmount += outstandingAmount;
		 * 		allocation.invoices.push(invoice);
		 * 		if (!allocation.hasDisputedInvoice && Math.abs(invoice.DisputedAmount) > 0.001)
		 * 		{
		 * 			allocation.hasDisputedInvoice = true;
		 * 		}
		 *
		 * 		const daysBetweenDueDateAndPaymentDate = Lib.CA.Payment.MatchingItems.Invoice.GetDaysBetweenDueDateAndToday(invoice);
		 * 		if (daysBetweenDueDateAndPaymentDate < 0)
		 * 		{
		 * 			allocation.dueDateNotReached = true;
		 * 		}
		 * 	}
		 *
		 * 	allocation.ledger = {
		 * 		Number: "GL for offsetting zbp",
		 * 		Amount: allocatedAmount * -1,
		 * 	};
		 *
		 * 	return [allocation];
		 * }
		 */
		/*CustomizeAllocations: function(invoices, allocations)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.AutomaticZeroBalance.SkipCreatePayment
		 * @description
		 * Allows for skipping the creation of a payment based on the allocations
		 * @param {string} payer The name of the associated payer
		 * @param {Lib.CA.Payment.Matches.Allocation[]} allocations The list of allocation suggestions
		 * @returns {boolean} True if this payment should not be created, false otherwise
		 * @example This example skips creating the payment if there are more than 10 suggestions
		 * SkipCreatePayment: function(payer, allocations)
		 * {
		 * 	if (allocations.length > 10)
		 * 	{
		 * 		return true;
		 * 	}
		 * 	return false;
		 * }
		 */
		/*SkipCreatePayment: function(payer, allocations)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.AutomaticZeroBalance.CustomizePaymentBeforeCreation
		 * @description
		 * Allows for customizing the payment before it is created
		 * @param {Lib.CA.Payment.Allocation.Create.ZeroBalance.PaymentFromZeroBalanceProcess} transaction The parameters being used to create the custom payment
		 */
		/*CustomizePaymentBeforeCreation: function(transaction)
		{
		}*/
	};

	return AutomaticZeroBalance;
})();