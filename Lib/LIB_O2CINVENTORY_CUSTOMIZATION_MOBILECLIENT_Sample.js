///#GLOBALS Lib Sys
/* LIB_DEFINITION{
  "name": "LIB_O2CINVENTORY_CUSTOMIZATION_MOBILECLIENT_Sample",
  "libraryType": "Lib",
  "scriptType": "CLIENT",
  "comment": "Customization",
  "versionable": false,
  "require": [
    "Sys/Sys_Helpers"
  ]
}*/

/**
 * @namespace Lib.O2CInventory.Customization.MobileClient
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.O2CInventory = Lib.O2CInventory || {};
Lib.O2CInventory.Customization = Lib.O2CInventory.Customization || {};
Lib.O2CInventory.Customization.MobileClient = Lib.O2CInventory.Customization.MobileClient || {};

Lib.O2CInventory.Customization.MobileClient = (function ()
{
	/**
	 * @lends Lib.O2CInventory.Customization.MobileClient
	 */
	var MobileClient =
	{

		/**
		 * Validates a list of items and returns those that are invalid.
		 * In the example below, an item is considered invalid if it is in stock, has a batch number and does not have a quantity on hand.
		 * The input is an array of items, and the output is an array of invalid items with their reasons.
		 * @param {Array} items - The list of items to validate.
		 * [ {  },]
		 * @returns {Array|null} - Returns an array of invalid items with their reasons, or null if all items are valid.
		 * [ { id: "identifier", reason: 'invalidity reason' },]
		 * @example getInvalidItems: function (items)
			{
				var ItemsInError = [];
				items.forEach(function (item)
				{
					if (item.reconciled__)
					{
						if (item.batchnumber__ != null && item.batchnumber__ != "" && (item.quantity_on_hand__ == null || item.quantity_on_hand__ == ""))
						{
							ItemsInError.push({ id: item.batchnumber__, reason: 'Quantity on hand is required for batch number' });
						}
						else if (item.serialnumber__ != null && item.serialnumber__ != "")
						{
							item.quantity_on_hand__ = 1;
						}
					}
				});
				if (ItemsInError.length > 0)
				{
					return ItemsInError;
				}
				return null;
			}
		 */
		getInvalidItems: function (items)
		{
		},

		/**
		 * @description Returns the attributes to retrieve for the inventory items table.
		 * @param {Array} attributes= ['itemnumber__', 'description__', 'serialnumber__', 'expirationdate__', 'consignedondate__'] The default attributes to retrieve.
		 * @returns {Array} - An edited array of attributes containing the attributes to retrieve.
		 * @example GetInventoryItemsAttributes: function (attributes)
			{
				attributes.push("quantity_on_record__");
				attributes.push("Division__");
				attributes.push("quantity_on_stock__");
				return attributes;
			}
		 */
		GetInventoryItemsAttributes: function (attributes)
		{
		},
		/**
		 * @description the inventory items retrieving query result to the local fields mapping. The keys should be in lower case and the values in upper case.
		 * @param {Object} fieldsMapping ={
				"itemnumber__": "ITEMNUMBER__",
				"description__": "DESCRIPTION__",
				"serialnumber__": "SERIALNUMBER__",
				"expirationdate__": "EXPIRATIONDATE__",
				"consignedondate__": "CONSIGNEDONDATE__"
			} - The mapping of fields.
		 * @returns {Object}
		 * @example GetInventoryItemsResultToListMapping: function (fieldsMapping)
			{
				fieldsMapping.quantity_on_record__ = "QUANTITY_ON_RECORD__";
				fieldsMapping.division__ = "DIVISION__";
				fieldsMapping.quantity_on_stock__ = "QUANTITY_ON_STOCK__";
				return fieldsMapping;
			}
		 */
		GetInventoryItemsResultToListMapping: function (fieldsMapping)
		{
		},

		/**
		 * @description Edits the default filter used to fetch the inventory items based on the form data.
		 * @param {string} filter=`(InventoryLocationNumber__=${inventoryLocation})` - The Ldap filter to apply.
		 * @param {Object} data - The form data
		 * @returns {string}
		 * @example GetInventoryItemsFilter: function (filter, data)
			{
				//Sys.Helpers.Globals.User.additionalField4
				return "(&" + filter + "(Division__=" + data.document.data.Division__ + "))";
			}
		 */
		GetInventoryItemsFilter: function (filter, data)
		{
		}
	};

	return MobileClient;
})();
