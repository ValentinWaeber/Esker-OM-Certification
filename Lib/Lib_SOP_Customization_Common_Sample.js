/**
 * SOP Package common scripts customization callbacks
 * @namespace Lib.SOP.Customization.Common
 */

/* LIB_DEFINITION{
  "name": "Lib_SOP_Customization_Common_Sample",
  "scriptType": "COMMON",
  "comment": "Custom library extending Customer Order Processing common scripts on both client and server side",
  "versionable": false,
  "libraryType": "Lib",
  "require": []
}*/

var Lib = Lib || {};
Lib.SOP = Lib.SOP || {};
Lib.SOP.Customization = Lib.SOP.Customization || {};

Lib.SOP.Customization.Common = (function ()
{
	/**
	 * @lends Lib.SOP.Customization.Common
	 */
	var customization = {
		/**
		* @description This function will be called before SAP simulation.
		* If needed, use it to customize the SAP simulation sales order parameters.
		* Allows you to customize the SAP order fields sent to simulation. This user exit is called at the beginning of the SAP order simulation.
		* When the Line item grouping criteria option is set in the configuration tool, the order is split into separate orders when applicable. In this case, these resulting orders are simulated separately in SAP and this user exit is called at the beginning of the posting simulation of each one of these orders.
		*
		* @param {SapBAPI} bapiParams - This object contains the SAP BAPI parameters: <pre><code>{ EXPORTS: { ORDER_HEADER_IN: {} }, TABLES: { ORDER_ITEMS_IN: [], ORDER_PARTNERS: [] } }</code></pre>
		*
		* @param {function} GetFormLineItem - This function may be called to retrieve a line item of the product list of the form.
		*   It returns an Item object.
		*   It takes as argument the index of the bapiParams.TABLES.ORDER_ITEM_IN array.
		*   Caution: in case of SAP splitting (see "Line item grouping criteria" of Configurator), the index in the bapiParams.TABLES.ORDER_ITEM_IN array does not correspond to the line item index in the form.
		*   <pre><code>Item GetFormLineItem(bapiItemIndex)</code></pre>
		*   Where bapiItemIndex is the index of the item in the ORDER_ITEMS_IN array of the bapiParams object.
		*
		* @returns To stop the execution of the simulation script: return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution()
		*
		* @example
		* This user exit pads the material number of the line items to 18 digits with zeros.
		* <pre><code>OnSAPSimulateBegin: function (bapiParams, GetFormLineItem)
		* {
		* 	// pad item material numbers with zeros upto 18 digits
		* 	var items = bapiParams.TABLES.ORDER_ITEMS_IN;
		* 	for (var index = 0; index < items.length; index++)
		* 	{
		* 		var item = items[index];
		* 		item["MATERIAL"] = ("000000000000000000" + item["MATERIAL"]).substr(-18);
		* 	}
		* }</code></pre>
		* @example
		* In this example, the Items table of the Customer Order Processing form has been customized with a new field: Z_TAX__.
		* This user exit adds the tax value set in the Items table for each item in the ORDER_ITEMS_IN["TAX"] array of the bapiParams object.
		* <pre><code>OnSAPSimulateBegin: function (bapiParams, GetFormLineItem)
		* {
		* 	// Z_TAX__ is a custom column
		* 	// The "Z_TAX__" value is copied for each line into the "TAX" of the BAPI Simulation line parameter
		* 	var items = bapiParams.TABLES.ORDER_ITEMS_IN;
		* 	for (var bapiItemIndex = 0; bapiItemIndex < items.length; bapiItemIndex++)
		* 	{
		* 		var tax = GetFormLineItem(bapiItemIndex).GetValue("Z_TAX__");
		* 		bapiParams.TABLES.ORDER_ITEMS_IN[bapiItemIndex]["TAX"] = tax;
		* 	}
		* }</code></pre>
		* @example
		* In this example, the orders are split based on a parameter that is part of the header in SAP orders:
		* The Items table of the Customer Order Processing form has been customized with a new field: Z_DISTRIB_CHANNEL__. This field corresponds to the ORDER_HEADER_IN["DISTR_CHAN"] parameter in the simulation BAPI.
		* In the configuration tool, the Line item grouping criteria option has been set with the Z_DISTRIB_CHANNEL__ field. Therefore, all resulting orders will contain items that have an identical distribution channel.
		* For each order generated based on the Line item grouping criteria option, this user exit adds the corresponding distribution channel to the ORDER_HEADER_IN["DISTR_CHAN"] array of the bapiParams object.
		* <pre><code>OnSAPSimulateBegin: function (bapiParams, GetFormLineItem)
		* {
		* 	// Z_DISTRIB_CHANNEL__ is a custom column that is also set in the "Line item grouping criteria" of Configurator
		* 	// for each split order, the "Z_DISTRIB_CHANNEL__" value is copied at the header level into the "DISTR_CHAN" of the BAPI Simulation parameter
		* 	var distrChannel = GetFormLineItem(0).GetValue("Z_DISTRIB_CHANNEL__");
		* 	bapiParams.EXPORTS.ORDER_HEADER_IN["DISTR_CHAN"] = distrChannel;
		* }</code></pre>
		* @example
		* <pre><code>OnSAPSimulateBegin: function (bapiParams, GetFormLineItem)
		* {
		* 	// Add the properties to receive the ORDER_CONDITION_EX for SAP WS
		* 	bapiParams.TABLES.ORDER_CONDITION_EX = [];
		* }</code></pre>
		*/
		OnSAPSimulateBegin: function (bapiParams, GetFormLineItem)
		{
		},

		/**
		* @description This function will be called after SAP simulation.
		* If needed, use it to handle the SAP simulation result.
		* Allows you to perform operations after the SAP order simulation. This user exit is called at the end of the SAP order simulation.
		* - This user exit is not called if the OnSAPSimulateBegin user exit stops the execution of the simulation script.
		*
		* @param {SapBAPI} simulationResult - This object contains the SAP BAPI parameters: <pre><code>{ EXPORTS: { ORDER_HEADER_IN: {} }, TABLES: { ORDER_ITEMS_IN: [], ORDER_PARTNERS: [], ORDER_ITEMS_OUT: [}} }</code></pre>
		* @param {ReportData} reportData - This object contains the calculated report : <pre><code>{ CounterByType: { errors: 0, informations: 0, warnings: 0 }, Header: { Title: "Simulation result" }, MessageSet: { warnings: { labels: "Warning", text: [] }, errors: { labels: "Warning", text: [] }, informations: { labels:"Warning", text:[] } }, Items: { values: [], columns: {} } }</code></pre>
		* @returns No return value expected
		*
		* @example
		* This user exit checks the materials that have been changed during the SAP simulation.
		* <pre><code>OnSAPSimulateEnd: function(simulationResult, reportData)
		* {
		*	Log.Info("OnSAPSimulateEnd");
		*	if(simulationResult.TABLES && simulationResult.TABLES.ORDER_ITEMS_IN && simulationResult.TABLES.ORDER_ITEMS_IN && simulationResult.TABLES.ORDER_ITEMS_OUT)
		*	{
		*		var itemsIN = simulationResult.TABLES.ORDER_ITEMS_IN;
		*		var itemsOUT = simulationResult.TABLES.ORDER_ITEMS_OUT;
		*		var originalMaterialIds = {};
		*		var outputMaterialId = {};
		*		var linesOfMaterial = {};
		*		itemsIN.map(function(value)
		*		{
		*			originalMaterialIds[value.MATERIAL] = true;
		*			linesOfMaterial[value.MATERIAL] = value.ITM_NUMBER;
		*		});
		*		itemsOUT.map(function(value)
		*		{
		*			outputMaterialId[value.MATERIAL] = true;
		*		});
		*		var keys = Object.keys(originalMaterialIds);
		*		keys.map(function(key)
		*		{
		*			if(!outputMaterialId[key])
		*			{
		*				//An input material ID was replaced
		*				Log.Warn("The material Id : " + key +"  will be automatically replaced by SAP");
		*				//To make AddToReport work in SOP, the boolean "true" on the last argument is mandatory
		*				Sys.Helpers.SAP.AddToReport(reportData, linesOfMaterial[key], "ESKSOP", "W", "1", "The material Id : " + key +"  will be automatically replaced by SAP", null, null, null, null, true);
		*			}
		*		});
		*	}
		*}</code></pre>
		*/
		OnSAPSimulateEnd: function (simulationResult, reportData)
		{
		},


		/**
		* @description This function will be called after SAP simulation.
		* Allows you to choose to resubmit the form (instead of setting it in "toValidate" state) depending of the error.
		* - The "errorList" parameter is set by default to [{ id:"V1", number:"042"}, { id:"V1", number:"043"}] which are the errors codes when SAP cannot process the request repectively
		*	because the order is alredy opened (042) and locked (043).
		*	As it is a temporary error we tell the system to retry instead of asking for manual action.
		*
		* @param {Lib.SOP.SAP.Simulate.errorMessage[]} errorList - An array of error id and number, as defined in SAP (see transaction SE91) : <pre><code>[{ id:"message class", number:"message number"}]</code></pre>
		* @returns the array, that might be modified with new or removed error values
		*
		* @example
		* This user exit allows retries on an arbitrary SAP error V2 666 in addition to default resubmit errors.
		* <pre><code>
		* ResubmitOnSpecificErrors: function(errorList)
		* {
		*	Log.Info("ResubmitOnSpecificErrors");
		*	var newErrorToProcessAsResubmit = { id:"V2", number:"666"}
		*	errorList.push(newErrorToProcessAsResubmit);
		*	return errorList;
		*}</code></pre>
		* @example
		* If you want to disable the feature, you must return an empty array
		* <pre><code>
		* ResubmitOnSpecificErrors: function(errorList)
		* {
		*     return [];
		* };
		* </code></pre>
		*/
		ResubmitOnSpecificErrors: function (errorList)
		{
			return errorList;
		},

		/**
		 * @description Return the BAPI name to call
		 * Allows you to retrieve the customized name of a BAPI from the specified default BAPI name. This user exit is called in the Customer Order process, when simulating the posting of the order in SAP:
		 * - From the HTML Page script in the LIB_SOP_SAP_Simulation and Lib_SOP_SAP_Simulation_Executor_Client script libraries.
		 * - From the generation script in the LIB_SOP_SAP_Simulation and Lib_SOP_SAP_Simulation_Executor_Server script libraries.
		 * When the BAPI_SALESORDER_SIMULATE BAPI is customized, the report generated by the simulation must also be customized using the OnSAPSimulateEnd user exit.
		 *
(??)		 * @param {string} originalBapiName for instance "BAPI_SALESORDER_SIMULATE"
		 * @returns {string} String value containing the customized BAPI name or, if no mapping has been defined, the default BAPI name.
		 * @example
		 * This user exit retrieves the customized name of the BAPI_SALESORDER_SIMULATE default BAPI name:
		 * <pre><code>
		 * GetBAPIName: function (originalBapiName)
		 * {
		 * 	var customBapiName;
		 * 	switch (originalBapiName)
		 * 	{
		 * 		case "BAPI_SALESORDER_SIMULATE":
		 * 			customBapiName = "Z_CUSTOM_BAPI_SALESORDER_SIMULATE";
		 * 			break;
		 * 		default:
		 * 			customBapiName = originalBapiName;
		 * 			break;
		 * 	}
		 * 	return customBapiName;
		 * }
		 * </code></pre>
		 */
		GetBAPIName: function (originalBapiName)
		{
		},

		/**
		 * @description Return the BAPI params to pass to SAP call
		 *
		 * @param {string} originalBapiName for instance "BAPI_SALESORDER_SIMULATE"
		 * @param {object} originalBapiParams the original BAPI params to modify
		 * @returns {object} the modified BAPI params (no retrun value or null to use the original BAPI params)
		 * @example
		 * <pre><code>
		 * OverrideBAPIParams: function (originalBapiName, originalBapiParams)
		 * {
		 * 	originalBapiParams.EXPORTS.HEADER = { RECEIVER: "XYZ" };
		 * }
		 * </code></pre>
		 */
		OverrideBAPIParams: function (originalBapiName, originalBapiParams)
		{
		},

		/**
		* @deprecated Use OverrideSAPSplitGroupId instead returning the same group id string for each line item
		*/
		DisableSapLineItemSimulationSplit: function ()
		{
		},

		/**
		* @deprecated Use OverrideSAPSplitGroupId instead returning the same group id string for each line item
		*/
		DisableSapLineItemPostSplit: function ()
		{
		},

		/**
		* @description This function is called upon SAP simulation and approval (POST) when SAP split is enabled in order to override the default grouping id.
		* When the Line item grouping criteria option is set in the configuration tool, the order is split into separate orders. Items with identical values for all fields specified in this option are grouped in the same order in SAP. The items that belong to a same group are associated with the same group identifier.
		* This user exit allows you to override the group identifier associated with an item. It is called when posting an order or when simulating the posting of an order.
		*
		* @param {Item} groupItem: Item object from the Items table of the Customer Order Processing process.
		*
		* @returns String value representing the identifier of the group with which the item is associated.
		* null or undefined to automatically compute the identifier of the group based on the fields defined in the Line item grouping criteria option.
		*
		* @example
		* In this example, the orders are split based on a unique custom field:
		* - The Items table of the Customer Order Processing form has been customized with a new field of type combo box: Z_Item_Sales_Area__.
		* - In the configuration tool, the Line item grouping criteria option has been set with the Z_Item_Sales_Area__ field only.
		* This user exit checks whether the Z_Item_Sales_Area__ field is empty for each item. If empty, it is set with the value of the default sales area. Therefore, items with no associated sales area are automatically grouped together with the items associated with the default sales area. These items are grouped in the same SAP order when posting the order or simulating the posting of the order.
		* <pre><code>OverrideSAPSplitGroupId: function (groupItem)
		* {
		* 	// if the custom column "Z_Item_Sales_Area__" is empty, then override the groupId with the default "Sales_Area__" value
		* 	var groupId = groupItem.GetValue("Z_Item_Sales_Area__");
		* 	if (!groupId)
		* 	{
		* 		// default value: header field
		* 		groupId = Data.GetValue("Sales_Area__");
		* 	}
		* 	return groupId;
		* }</code></pre>
		*/
		OverrideSAPSplitGroupId: function (groupItem)
		{
		},

		/**
		* @description This function is called upon validation when split is enabled, just before the line items are gathered in groups,
		* in order to customize the grouping criteria.
		*/
		BeforeGroupingLineItems: function ()
		{
		},

		/**
		* @description This function is called upon extraction when split is enabled in order to override the default grouping id.
		* When the Line item grouping criteria option is set in the configuration tool, the order is split into separate orders. Items with identical values for all fields specified in this option are grouped in the same order in SAP. The items that belong to a same group are associated with the same group identifier.
		* This user exit allows you to override the group identifier associated with an item. It is called when posting an order or when simulating the posting of an order.
		*
		* @param {Item} groupItem: Item object from the Items table of the Customer Order Processing process.
		*
		* @returns String value representing the identifier of the group with which the item is associated.
		* null or undefined to automatically compute the identifier of the group based on the fields defined in the Line item grouping criteria option.
		*
		* @example
		* In this example, the orders are split based on a unique custom field:
		* - The Items table of the Customer Order Processing form has been customized with a new field of type combo box: Z_Item_Sales_Area__.
		* - In the configuration tool, the Line item grouping criteria option has been set with the Z_Item_Sales_Area__ field only.
		* This user exit checks whether the Z_Item_Sales_Area__ field is empty for each item. If empty, it is set with the value of the default sales area. Therefore, items with no associated sales area are automatically grouped together with the items associated with the default sales area. These items are grouped in the same SAP order when posting the order or simulating the posting of the order.
		* <pre><code>OverrideSplitGroupId: function (groupItem)
		* {
		* 	// if the custom column "Z_Item_Sales_Area__" is empty, then override the groupId with the default "Sales_Area__" value
		* 	var groupId = groupItem.GetValue("Z_Item_Sales_Area__");
		* 	if (!groupId)
		* 	{
		* 		// default value: header field
		* 		groupId = Data.GetValue("Sales_Area__");
		* 	}
		* 	return groupId;
		* }</code></pre>
		*/
		OverrideSplitGroupId: function (groupItem)
		{
		},

		/**
		* @description This function is called before each query on custom tables to know if we add filter on DataFilteringKey or not.
		* Some of the application tables include a DataFilteringKey__ field that can be used to filter the application data. Data filtering is based on the DataFilteringKey__ field value, which can be a customer number, an organizational unit, etc.
		* The GetTablesWithDataFilteringKey user exit allows you to:
		* - Disable the DataFilterinKey__ filter in one or several tables.
		* - Enable the DataFilteringKey__ filter in one or several tables you have created or a default table in which you have previously added the DataFilteringKey__ field.
		* This user exit is called when querying the application tables.
		*
		* @param {object} defaultList: JavaScript object containing table name(s). The DefaultList object value should be set to true or false, depending on whether the data of the specified table(s) should be filtered or not.
		* If the table is used for the data filtering, its value is 'true'.
		*
		* @returns The defaultList updated
		*
		* @example
		* This user exit enables the data filtering for the My_customer_table__ , which is not delivered by default with the application. It disables the data filtering for the SO - Partners__ default table.
		* <pre><code>GetTablesWithDataFilteringKey: function (defaultList)
		* {
		*	// Add a new table to filter
		*	defaultList["My_custom_table__"] = true;
		*
		*	// Deactivate data filtering for the partner's table
		*	defaultList["SO - Partners__"] = false;
		*
		*	return defaultList;
		* }</code></pre>
		*/
		GetTablesWithDataFilteringKey: function (defaultList)
		{
		},
		/**
		 * @description This function is called before each conversion on the product list table when the QuantityConversion feature is enabled.
		 * @param {object} item The row currently converted (from the Data.GetTable(...).GetItem() API)
		 * @param {number} convertedQuantity the value that is going to be setted on the Quantity field
		 * @returns The convertedQuantity value
		 * @example
		 * <pre><code>
		 * {
		 *  //Set the quantity field in error if the calculated quantity has a decimal
		 * 	if (convertedQuantity % 1 !== 0)
		 *  {
		 * 		item.SetError("Quantity__", "The quantity need to be a rounded number");
		 *  }
		 *  return convertedQuantity;
		 * }
		 * </code></pre>
		 */
		OnConvertQuantity: function (item, convertedQuantity)
		{
		},
		/**
		* @description This function is called inside all the calls to the GetConversationInfo function, and gives the possibility to change its return value.
		*
		* @param {object} conversationInfo: Object containing the information required to create a conversation.
		* @param {string} currentOrderType: string containing the name of the process from where the function is being called (COP or COPo).
		*
		* @returns The updated conversationInfo
		*
		* @example
		* <pre><code>GetConversationInfo: function (conversationInfo, currentOrderType)
		* {
		*	if(currentOrderType == "Customer Order Processing")
		*	{
		*		conversationInfo.Options.fromEmailAddress = "new-email-cop@email.com";
		*		conversationInfo.Options.fromName = "new-name-cop";
		*	}
		*
		*	return conversationInfo
		* }</code></pre>
		*/
		GetConversationInfo: function (conversationInfo, currentOrderType)
		{
		},
		/**
		 * @description This function is called when browsing Unit of Measure Conversion in the customscript and before each conversion in the extraction script.
		 * This function is also called when automatically updating the Unit of Measure Conversion with the product user input, after the order approval.
		 * If needed use it to customize the standard filter.
		 * Make sure the specified filter is valid (LDAP syntax).
		 *
		 * @returns {string} Return a string containing the extra filter if customization is needed.
		 *
		 * @example
		 * <pre><code>function GetQuantityConversionExtraFilter: function ()
		 * {
		 * 	var customFilter = "";
		 * 	var materialType = Data.GetValue("Z_Material_Type__");
		 * 	if ( materialType != "")
		 * 	{
		 * 		customFilter = "Z_Material_Type__=" + materialType ;
		 * 	}
		 * 	return customFilter;
		 * }
		 * </code></pre>
		 *
		 */
		GetQuantityConversionExtraFilter: function ()
		{
		},
		/**
		 * @description This function is called when browsing Unit of Measure Conversion in the customscript and before each conversion in the extraction script.
		 * This function is also called when automatically updating the Unit of Measure Conversion with the product user input, after the order approval.
		 * If you are using non-standard columns and want to make additional adjustment to the results returned by the query on the Unit of Measure Conversion table,
		 * add your additonal column's description in the return array. Combine this function with GetQuantityConversionExtraFilter to be able to programmatically filter the records in
		 * FilterQuantityConversionQueryResult user exit.
		 * Thoses columns will also be displayed in the browse dialog box used to select Customer Unit of Measure conversion.
		 *
		 * @returns {Array} Return an array containing the extra columns description if customization is needed.
		 *
		 * @example
		 * <pre><code>function GetQuantityConversionAdditionalColumns: function ()
		 * {
		 * 	return [{
		 *		"id": "Z_CustomerNumber__",
		 *		"label": "Z_CustomerNumber",
		 *		"type": "STR",
		 *		"width": 30,
		 *		"orderBy": "ASC"
		 *	}];
		 * }
		 * </code></pre>
		 *
		 */
		GetQuantityConversionAdditionalColumns: function ()
		{
		},
		/**
		 * @description This function is called when browsing Unit of Measure Conversion in the customscript and before each conversion in the extraction script.
		 * Use it if you want to proceed to additional programmatical fitlering on the results returned by the query on the Unit of Measure Conversion table,
		 *
		 * @param {object} result: Array containing the records retrieved by the query.
		 * Two possibilities:
		 * 1. When the user click the browse three points:  Each item of the array contains an array of values.
		 * 		The first three values concern respectively "TargetUOM__", "Numerator__", "Denominator__".
		 * 		The other are the ones for columns added by GetQuantityConversionAdditionalColumns.
		 * 		Example result = [
		 *			[
		 * 				"PALETTE",
		 * 				"BOX",
		 *				"1.00",
		 *				"1000.00",
		 *				"1671"
		 *			]
		 *		]

		 * 2. When the user change the quantity value, Each item of the array contains an array of values.
		 * 		The values are then given by key.
		 * 		Example result = [
		 *			{
		 *				"TargetUOM__": "BOX",
		 *				"Numerator__": "1.00",
		 *				"Denominator__": "1000.00",
		 *				"Z_CustomerNumber__": "1671"
		 *			}
		 *		]
		 * @returns {Array} Returns an array containing the records you want to keep.
		 *
		 * @example
		 * <pre><code>function FilterQuantityConversionQueryResult: function (result)
		 * {
		 *  const customerNumber = Data.GetValue("CustomerNumber__");
		 *	const keepValues = [];
		 *	result.forEach(element => {
		 *		if ("TargetUOM__" in element)
		 *		{
		 *			if (element["Z_CustomerNumber__"] == customerNumber) {
		 *				keepValues.push(element);
		 *			}
		 *		}
		 *		else if (typeof element.GetVars === "function")
		 *		{
		 *			const vars = element.GetVars();
		 *			if (vars.GetValue_String("Z_CustomerNumber__", 0) == customerNumber)
		 *			{
		 *				keepValues.push(element);
		 *			}
		 *		}
		 *		else if (element[4] == customerNumber) {
		 *			keepValues.push(element);
		 *		}
		 *	});
		 *	if (keepValues.length)
		 *	{
		 *		return keepValues;
		 *	}
		 *	return result;
		 * }
		 * </code></pre>
		 *
		 */
		FilterQuantityConversionQueryResult: function (result)
		{

		},
		/**
		 * @description This function is called when a new UoM conversion is saved in the UoM conversion table, after the order approval.
		 * It should be used jointly with GetQuantityConversionExtraFilter user exit.
		 *
		 * @param {object} vars: Record variables which will be inserted in table. Retrieve by xRecord.GetVars API.
		 *
		 * @returns {void}.
		 *
		 * @example
		 * <pre><code>function CustomizeQuantityConversionCreation: function (vars)
		 * {
		 * 	var materialType = Data.GetValue("Z_Material_Type__");
		 *	if ( materialType != "")
		 *	{
		 *		vars.AddValue_String("Z_Material_Type__", materialType, true);
		 *	}
		 * }
		 * </code></pre>
		 *
		 */
		CustomizeQuantityConversionCreation: function (vars)
		{
		},
		/**
		 * @description This function is called when searching for CustomerUnit__ MRU in the corrected material mapping table for quantity conversion
		 * If needed use it to customize the standard filter.
		 * Make sure the specified filter is valid (LDAP syntax).
		 *
		 * @returns {string} Return a string containing the extra filter if customization is needed.
		 *
		 * @example
		 * <pre><code>function GetCustomerUnitMRUExtraFilter: function ()
		 * {
		 * 	var customFilter = "";
		 * 	var materialType = Data.GetValue("Z_Material_Type__");
		 * 	if ( materialType != "")
		 *	{
		 * 		customFilter = "Z_Material_Type__=" + materialType ;
		 * 	}
		 * 	return customFilter;
		 * }
		 * </code></pre>
		*/
		GetCustomerUnitMRUExtraFilter: function ()
		{
		},

		/**
		* @description When field data needs to be seen on an order notification email, a custom tag needs to be
		* created to tell the HTML where to pull the data in the customer order process - portal process.
		* This userexit allows modification of the list of tags used in an order notification template.
		*
		* ***** See 'Resources\Templates\Notify_Customer_Order_Confirmed_en.htm' for examples of custom tag usage *****
		*
		* @param {object} customTags an array that has the tags to be referenced in an order notification
		*
		* @returns An updated list of custom tags
		*
		* @example
		* 	This user exit adds Order Number, Attention, Freight Terms, and Payment Terms tags to use in the
		*	customer order confirmation template. (These are all fields in the 'Customer order processing - portal
		* 	form.)
		*
		*	<pre><code>function CustomizeOrderNotificationFields(customTags)
		*	{
		*   	customTags["Order_Number__"] = Data.GetValue("Order_Number__");
		*		customTags["Z_Attention__"] = Data.GetValue("Z_Attention__");
		*		customTags["Z_Freight_terms__"] = Data.GetValue("Z_Freight_terms__");
		*		customTags["Z_Payment_terms__"] = Data.GetValue("Z_Payment_terms__");
		*		return customTags;
		*	}</code></pre>
		*
		* @example
		*	This user exit creates a custom order summary tag that displays up to 'count' items
		* 	purchased in the order.
		*
		*	<pre><code>function CustomizeOrderNotificationFields(customTags)
		*	{
		*   	var itemTable = Data.GetTable("Items__");
		*		var count = itemTable.GetItemCount(); 		// Count === # items to display
		*		for(var i = 0; i <= count; i++)
		*		{
		*			var item = itemTable.GetItem(i);
		*			if(item)
		*			{
		*				// Materials
		*				var ref = item.GetValue("Reference__");
		*				var desc = item.GetValue("Description__");
		*				var quantity = item.GetValue("Quantity__");
		*				var custCode = item.GetValue("Z_Customer_Code__");
		*
		*				var customItemTag = "Order_Summary_" + i + "__";
		*				customTags[customItemTag] = (i + 1) + ") " + "Material #: " + ref
		*									+ "<br />&nbsp&nbsp&nbsp&nbspCustomer Code: " + custCode
		*									+ "<br />&nbsp&nbsp&nbsp&nbspDescription: " + desc
		*									+ "<br />&nbsp&nbsp&nbsp&nbspQuantity: " + quantity;
		*			}
		*			else
		*			{
		*				var customItemTag = "Order_Summary_" + i + "__";
		*			}
		*		}
		*		return customTags;
		*	}</code></pre>
		**/
		CustomizeOrderNotificationFields: function (customTags)
		{
			return customTags;
		},

		/**
		 * @description This function is called prior to returning the stringified version of the SOAP envelope to use with SAP web services integration.  It can be used to customize the SOAP envelope or replace it with something else altogether (e.g., JSON to use with REST).
		 * @param {string} method The SOAP method (e.g., "urn:BAPI_MATERIAL_GETLIST")
		 * @param {string} soapString The current SOAP envelope
		 * @returns {string} The customized SOAP envelope
		 * @example
		 * <pre><code>CustomizeSOAPEnvelope: function (method, soapString)
		 * {
		 *	var soapXml = soapString;
		 *
		 *	if (method.indexOf("BAPI_MATERIAL_GETLIST") !== -1)
		 *	{
		 *		// Insert a new node at the end of the SOAP envelope
		 *		var index = soapXml.search(/<\/urn:BAPI_MATERIAL_GETLIST/i);
		 *		soapXml = soapXml.substring(0, index) + "<Z_CustomField>Custom field data</Z_CustomField>" +  soapXml.substring(index);
		 *	}
		 *
		 *	return soapXml;
		 * }
		 * </code></pre>
		 */
		CustomizeSOAPEnvelope: function (method, soapString)
		{
		},

		/**
		 * @description This function is called each time Lib.SOP.SAP.Helper.NormalizeID is called. It is here to handle different kind of normalization from the standard if needed
		 * @param {string} id The string to normalize
		 * @param {string} length The length expected for the id by the standard package
		 * @param {object} context Object containing two properties : field and table. Possible values for field if provided : "MATNR" or "MATERIAL". Possible values for Table "MAKT", "MVKE", "BAPI_SALESORDER_CREATEFROMDAT2", "BAPI_SALESORDER_SIMULATE", "Z_ESK_READ_SAPTEXTS", "BAPI_MATERIAL_GETLIST".
		 * @returns {string} Return the id formatted the way you want, or nothing if you want the default behaviour to be kept
		 * @example Return an ID of length 12 if it's a material number during the SAP Post
		 * <pre><code>SAPNormalizeID: function (id, length, context)
		 * {
		 * 		if(context.table === "BAPI_SALESORDER_CREATEFROMDAT2" && context.field === "MATERIAL")
		 * 		{
		* 			return Sys.Helpers.String.SAP.NormalizeID(materialNumber, 12);
		 * 		}
		 * }</code></pre>
		 */
		SAPNormalizeID: function (id, length, context)
		{
		},

		/**
		 * @description This function is called each time Lib.SOP.SAP.Helpers.GetSplitSalesArea is called. This function allows to customize sales area according to whether it's called in a simulation or post context.
		 * @param {object} salesArea : Object containing three properties : salesOrg, distChan and businessArea. And two functions : IsValid (returns true if all properties are set) and ToString (returns concatenated string with the three properties).
		 * @param {boolean} isSimulationOrPost : true if the context is a simulation or a post.
		 * If the properties are modified, the functions also must be modified.
		 * @returns {} No return value expected
		 * @example
		 * <pre><code>CustomizeSalesArea: function (salesArea, isSimulationOrPost)
		 * {
		 * 		if(!isSimulationOrPost)
		 * 		{
		 * 			if(!Sys.Helpers.IsEmpty(Sys.OM.Helpers.GetConfiguration().Z_DISTRIBUTIONCHANNEL__))
		 * 			{
		 * 				salesArea.distChan = Sys.OM.Helpers.GetConfiguration().Z_DISTRIBUTIONCHANNEL__;
		 * 			}
		 * 			if (!Sys.Helpers.IsEmpty(Sys.OM.Helpers.GetConfiguration().Z_BUSINESSAREA__))
		 * 			{
		 * 				salesArea.businessArea = Sys.OM.Helpers.GetConfiguration().Z_BUSINESSAREA__;
		 * 			}
		 * 			salesArea.IsValid = function()
		 * 			{
		 * 				return !!(salesArea.salesOrg && salesArea.distChan && salesArea.businessArea);
		 * 			};
		 * 			salesArea.ToString = function()
		 * 			{
		 * 				return salesArea.salesOrg + "/" + salesArea.distChan + "/" + salesArea.businessArea;
		 * 			};
		 * 		}
		 * }</code></pre>
		 */
		CustomizeSalesArea: function (salesArea, isSimulationOrPost)
		{
		},

		/**
		 * @description This function allows WS call result to be used for customization client-side if needed.
		 * @param {object} response : WS call response.
		 * @param {object} initialParams : WS call initial parameters.
		 * @returns {} No return value expected
		 * @example
		 * <pre><code>OnSapWebServiceCallEndClient: function (response, initialParams)
		 * {
		 * 		if (initialParams && response && Sys.OM.Helpers.GetConfiguration().Z_ENABLE_SAP_SIMULATION_TIMEOUT_FLAG__ === "1")
		 * 		{
		 * 			Data.SetValue("Z_ActivateSAPSimulationTimeoutLayout__", response.statusText == "timeout" || response.statusText === "Gateway Timeout");
		 * 		}
		 * }</code></pre>
		 */
		OnSapWebServiceCallEndClient: function (response, initialParams)
		{
		},

		/**
		 * @description This function allows WS call result to be used for customization server-side if needed.
		 * @param {object} response : WS call response.
		 * @param {object} initialParams : WS call initial parameters.
		 * @returns {} No return value expected
		 * @example
		 * <pre><code>OnSapWebServiceCallEndServer: function (response, initialParams)
		 * {
		 * 		if (initialParams && response")
		 * 		{
		 * 			const simulationOrPost = (initialParams.urlName).indexOf("_-SIE_-SWE_SD_ESKER_SO_CREATE_Root_Request") > -1;
		 * 			if (simulationOrPost)
		 * 			{
		 * 				if (response.status && (response.status === 504))
		 * 				{
		 * 					Log.Error("Simulation time out");
		 * 					Variable.SetValueAsString("Z_SimulationOrPostTimeOut", "yes");
		 * 				}
		 * 				else
		 * 				{
		 * 					Variable.SetValueAsString("Z_SimulationOrPostTimeOut", "no");
		 * 				}
		 * 			}
		 * 		}
		 * }</code></pre>
		 */
		OnSapWebServiceCallEndServer: function (response, initialParams)
		{
		},

		/**
		 * @description This function allows SAP posting error message customization.
		 * @param {string} error : standard error message.
		 * @returns {string} customized error message.
		 *
		 * @example
		 * <pre><code>CustomizeSAPPostingErrorMessage: function (error)
		 * {
		 * 		var customError = error;
		 * 		if(Variable.GetValueAsString("Z_PostingTimeOut") === "yes")
		 * 		{
		 * 			customError = "Time out when posting document. Please approve again.";
		 * 		}
		 * 		return customError;
		 * }</code></pre>
		 */
		CustomizeSAPPostingErrorMessage: function (error)
		{
		},

		/**
		 * @description This function allow to customize the data that is going to be updated on the SDA senderform when the COP is approved.
		 * @param {object} dataToUpdate : The parameter look like this : {"CF_1715a24459c_Customer_Number__":"3950","CF_1715a273405_Customer_Name__":"TMC Truck Leasing"}
		 * @returns {object} The mapping object containing the names of the SDA senderform field to update and the corresponding updated values
		 * when undefined the dataToUpdate object (possibly modified) is used for the mapping
		 * @example Update the PO number in the SDA senderform
		 * <pre><code>SetSDADataToUpdate: function(dataToUpdate)
		 * {
		 * .	dataToUpdate["CF_172982cd500_PO_number__"] = Data.GetValue("Sales_Order_Number__");
		 * }</code></pre>
		 */
		SetSDADataToUpdate: function (dataToUpdate)
		{
		},

		/**
		* @description This function is called prior to calling an SAP web service server-side and client-side. It can be used to customize the web service parameters. You should check into your customization if the user-exit is called server-side or client-side in order to customize the correct parameters.
		* @param {object} params The standard web service parameters
		* @returns No return value expected
		* @example
		* <pre><code>OnSapWebServiceCallBegin: function (params)
		* {
		*		// Customize the timeout
		*		var timeout = 90000;
		*
		*		params.sendTimeout = timeout;
		*		params.receivedTimeout = timeout;
		* }</code></pre>
		**/
		OnSapWebServiceCallBegin: function (params)
		{
			// !Warning: Do not log passwords or any other sensitive info
		},

		/**
		 * @description This function is called to determine whether or not sold-to and ship-to need to be linked for the order
		 * @returns True if sold-to and ship-to should be unlinked, false by default for linked sold-to and ship-to
		 */
		UnlinkSoldToShipTo: function ()
		{
			return false;
		},

		/**
		 * @description UserExit to add or replace extraction rules for the Lib.SOP.PostalAddress.ExtractPostalAddress() function.
		 * @param {Object} CountrySpecificExtraction
		 * @returns {Object}
		 * @example Example below illustrates how to overwrite an existing Lib.SOP.PostalAddress extraction rule
		 *
		 * <pre><code>
			CustomizeCountrySpecificExtraction: function (CountrySpecificExtraction)
			{
				function New_US_ExtractionFunction(address, countryCode)
				{
					// Do postal address extraction
					return addressObj;
				}
				CountrySpecificExtraction["US"] = New_US_ExtractionFunction;
				return CountrySpecificExtraction;
			},
		 * </code></pre>
		 */
		CustomizeCountrySpecificExtraction: function (CountrySpecificExtraction)
		{
		},

		/**
		 * @description UserExit to modify the default Dropship address fields when using the Lib.SOP.PostalAddress.SetDropShipAddressWithPostalAddress() function.
		 * @param {Object} dropShipFields
		 * @returns {Object}
		 * @example
		 * Note: The key in the object must match one of the pre defined addressObj fields returned by Lib.SOP.PostalAddress.ExtractPostalAddress()
		 * <pre><code>
			FieldsForDropshipAddressExtraction: function (dropShipFields)
			{
				dropShipFields["street2"] = "Z_DropShipToAddress_Street2__";
				return dropShipFields;
			}
		 * </code></pre>
		 */
		FieldsForDropshipAddressExtraction: function (dropShipFields)
		{
		},
		/**
		* @description Retrieves the fields displayed in the Result list table of the Customer Information browse dialog.
		* The fields returned by this function are retrieved from the SOP - Customers table or directly from the tables of the SAP environment.
		* This method implementation calls the user exit Lib.SOP.Customization.Common.GetSoldToSearchColumns which can be used to modify the columns to retrieve.
		* @param {Object} columns
		* {
		*	'columnName': {
		*	id: 'fieldName',
		*	label: 'columnLabel',
		*	type: 'TEXT'|'DATE'|'CheckBox'|'Integer'|'Decimal'|'MultiLine'|'Link'|'Description'|undefined,
		*	width: 'columnWidth',
		*	toFormat: true|undefined
		*	}, ...
		*  }
		* @returns {Object}
		* {
		*	'columnName': {
		*	id: 'fieldName',
		*	label: 'columnLabel',
		*	type: 'TEXT'|'DATE'|'CheckBox'|'Integer'|'Decimal'|'MultiLine'|'Link'|'Description'|undefined,
		*	width: 'columnWidth',
		*	toFormat: true|undefined
		*	}, ...
		*  }
		* @example
		* <pre><code>
		* // add city and country code to customer search columns
		* GetSoldToSearchColumns: function (columns)
		* {
		* 	columns.CITY__ = { id: "CITY__", label: "City", type: "STR", width: 200 };
		* 	columns.COUNTRY_CODE__ = { id: "COUNTRY_CODE__", label: "Country code", type: "STR", width: 200 };
		* 	return columns;
		* };
		* </code></pre>
		*/
		GetSoldToSearchColumns: function (columns)
		{
			return columns;
		},
		/**
		* @description Retrieves the fields displayed in the search panel of the Customer Information browse dialog.
		* The fields returned by this function are retrieved from the SOP - Customers table or directly from the tables of the SAP environment.
		* @param {Array} searchCriteria
		* [{
		* 	id: 'fieldName',
		* 	type: 'Date'|'ComboBox'|undefined,
		* 	label: 'columnLabel',
		* 	required: true|false|undefined,
		* 	toUpper: true|false|undefined,
		* 	readOnly: true|false|undefined,
		* 	visible: true|false|undefined,
		* 	defaultValue: 'defaultValue'|'function(){return 'defaultValue';}|undefined,
		* 	init: 'function(control){...}|undefined,
		* 	filter: 'filter'|'function(control){return 'filter';}|undefined
		* }]
		* @returns {Array}
		* [{
		* 	id: 'fieldName',
		* 	type: 'Date'|'ComboBox'|undefined,
		* 	label: 'columnLabel',
		* 	required: true|false|undefined,
		* 	toUpper: true|false|undefined,
		* 	readOnly: true|false|undefined,
		* 	visible: true|false|undefined,
		* 	defaultValue: 'defaultValue'|'function(){return 'defaultValue';}|undefined,
		* 	init: 'function(control){...}|undefined,
		* 	filter: 'filter'|'function(control){return 'filter';}|undefined
		* }]
		* @example
		* <pre><code>
		* // add city and country code to customer search criteria
		* GetSoldToSearchCriteria: function (searchCriteria)
		* {
		* 	searchCriteria.push({ id: "CITY__", label: "City" });
		* 	searchCriteria.push({ id: "COUNTRY_CODE__", label: "Country code" });
		* 	return searchCriteria;
		* };
		* </code></pre>
		*/
		GetSoldToSearchCriteria: function (searchCriteria)
		{
			return searchCriteria;
		},
		/**
		* @description Retrieves the fields displayed in the Result list table of the Shipping Address browse dialog.
		* The fields returned by this function are retrieved from the SOP - Partners table or directly in the tables of the SAP environment.
		* @param {Object} columns
		* {
		*  'columnName': {
		*	id: 'fieldName',
		*	label: 'columnLabel',
		*	type: 'TEXT'|'DATE'|'CheckBox'|'Integer'|'Decimal'|'MultiLine'|'Link'|'Description'|undefined,
		*	width: columnWidth,
		*	toFormat: true|undefined
		*	}, ...
		*  }
		* @returns {Object}
		* {
		*  'columnName': {
		*	id: 'fieldName',
		*	label: 'columnLabel',
		*	type: 'TEXT'|'DATE'|'CheckBox'|'Integer'|'Decimal'|'MultiLine'|'Link'|'Description'|undefined,
		*	width: columnWidth,
		*	toFormat: true|undefined
		*	}, ...
		*  }
		* @example
		* <pre><code>
		* // add city and country code to shipping partner search columns
		* GetShipToSearchColumns: function (columns)
		* {
		* 	columns.CITY__ = { id: "CITY__", label: "City", type: "STR", width: 200 };
		* 	columns.COUNTRY_CODE__ = { id: "COUNTRY_CODE__", label: "Country code", type: "STR", width: 200 };
		* 	return columns;
		* };
		* </code></pre>
		*/
		GetShipToSearchColumns: function (columns)
		{
			return columns;
		},
		/**
		* @description Retrieves the fields displayed in the search panel of the Shipping Address browse dialog.
		* The fields returned by this function are retrieved from the SOP - Partners table or directly in the tables of the SAP environment.
		* @param {Array} searchCriteria
		* [{
		* 	id: 'fieldName',
		* 	type: 'Date'|'ComboBox'|undefined,
		* 	label: 'columnLabel',
		* 	required: true|false|undefined,
		* 	toUpper: true|false|undefined,
		* 	readOnly: true|false|undefined,
		* 	visible: true|false|undefined,
		* 	defaultValue: 'defaultValue'|'function(){return 'defaultValue';}|undefined,
		* 	init: 'function(control){...}|undefined,
		* 	filter: 'filter'|'function(control){return 'filter';}|undefined
		* }]
		* @returns {Array}
		* [{
		* 	id: 'fieldName',
		* 	type: 'Date'|'ComboBox'|undefined,
		* 	label: 'columnLabel',
		* 	required: true|false|undefined,
		* 	toUpper: true|false|undefined,
		* 	readOnly: true|false|undefined,
		* 	visible: true|false|undefined,
		* 	defaultValue: 'defaultValue'|'function(){return 'defaultValue';}|undefined,
		* 	init: 'function(control){...}|undefined,
		* 	filter: 'filter'|'function(control){return 'filter';}|undefined
		* }]
		* @example
		* <pre><code>
		* // add city and country code to shipping partner search criteria
		* GetShipToSearchCriteria: function (searchCriteria)
		* {
		* 	searchCriteria.push({ id: "CITY__", label: "City" });
		* 	searchCriteria.push({ id: "COUNTRY_CODE__", label: "Country code" });
		* 	return searchCriteria;
		* };
		* </code></pre>
		*/
		GetShipToSearchCriteria: function (searchCriteria)
		{
			return searchCriteria;
		},
		/**
		* @description Retrieves the values of the extra fields related to the sold-to partner.
		* The parameter used for this function is the table from which the values of the extra fields are retrieved. If the application is integrated with SAP, the information can be retrieved either from SAP or from local master data tables. Else the information is retrieved from the local master data tables (for example, SO - Customers__).
		* @param {string} tableName Name of the database table on which the query is performed
		* @returns {Object}
		* {
		*  'formFieldName': 'databaseFieldName', ...
		*  }
		* @example
		* <pre><code>
		* GetSoldToExtraFields: function (tableName)
		* {
		* 	return {
		* 		Customer_Name3__: "NAME3",
		* 		Customer_Name4__: "NAME4"
		* 	};
		* 	// Customer_NameX__ represents a field in the Customer Order process.
		*	// NAMEX represents the corresponding table field in SAP or in the local master data table.
		* };
		* </code></pre>
		*/
		GetSoldToExtraFields: function (tableName)
		{
			return null;
		},
		/**
		* @description Retrieves the values of the extra fields related to the ship-to partner.
		* The parameter used for this function is the table from which the values of the extra fields are retrieved. If the application is integrated with SAP, the information can be retrieved either from SAP or from local master data tables. Else the information is retrieved from the local master data tables (for example, SO - Partners__).
		* @param {string} tableName Name of the database table on which the query is performed
		* @returns {Object}
		* {
		*  'formFieldName': 'databaseFieldName', ...
		*  }
		* @example
		* <pre><code>
		* // add name3 and name4 fields
		* GetShipToExtraFields: function (tableName)
		* {
		* 	return {
		* 		ShipTo_Name3__: "NAME3",
		* 		ShipTo_Name4__: "NAME4"
		* 	};
		* 	// ShipTo_NameX__ represents a field in the Customer Order process.
		* 	// NAMEX represents the corresponding table field in SAP or in the local master data table.
		* };
		* </code></pre>
		*/
		GetShipToExtraFields: function (tableName)
		{
			return null;
		},
		/**
		* @description Retrieves the values of the extra fields related to the customer sales data SAP table.
		* The parameter used for this function is the table from which the values of the extra fields are retrieved.
		* The information can be retrieved only from SAP master data tables.
		* @returns {Object}
		* {
		*  'formFieldName': 'databaseFieldName', ...
		*  }
		* @example
		* <pre><code>
		* // add incoterms1 and incoterms2 fields
		* GetCustomerSalesDataExtraFields: function ()
		* {
		* 	return {
		* 		Incoterms1__: "INCO1",
		* 		Incoterms2__: "INCO2"
		* 	};
		* 	// IncotermsX__ represents a field in the Customer Order process.
		* 	// INCOX represents the corresponding table field in SAP master data table.
		* };
		* </code></pre>
		*/
		GetCustomerSalesDataExtraFields: function ()
		{
			return null;
		},
		/**
		* @description Retrieves the fields displayed in the Result list table of the Material Information browse dialog.
		* The fields returned by this function are retrieved from the SOP - Material table or directly from the SAP environment, through the BAPI_MATERIAL_GETLIST BAPI.
		* @param {Array} columns
		* [
		* 	{
		* 		table: 'tableName',
		* 		id: 'fieldName',
		* 		label: 'columnLabel',
		* 		type: 'TEXT'|'DATE'|'CheckBox'|'Integer'|'Decimal'|'MultiLine'|'Link'|'Description'|undefined,
		* 		width: columnWidth,
		* 		toFormat: true|undefined
		* 	}, ...
		* ]
		* @returns {Array}
		* [
		* 	{
		* 		table: 'tableName',
		* 		id: 'fieldName',
		* 		label: 'columnLabel',
		* 		type: 'TEXT'|'DATE'|'CheckBox'|'Integer'|'Decimal'|'MultiLine'|'Link'|'Description'|undefined,
		* 		width: columnWidth,
		* 		toFormat: true|undefined
		* 	}, ...
		* ]
		* @example
		* <pre><code>
		* // add description to material search columns
		* GetMaterialSearchColumns: function (columns)
		* {
		* 	var materialTable = Lib.SOP.Tables.Materials;
		* 	columns.push({ table: materialTable.tableName, id: materialTable.description_key, label: "Description", type: "STR", width: 400 });
		* 	return columns;
		* };
		* </code></pre>
		*/
		GetMaterialSearchColumns: function (columns)
		{
			return columns;
		},
		/**
		* @description Retrieves the fields displayed in the search panel of the Material Information browse dialog.
		* The fields returned by this function are retrieved from the SOP - Material table or directly from the SAP environment, through the BAPI_MATERIAL_GETLIST BAPI.
		* @param {Array} searchCriteria
		* [{
		* 	id: 'fieldName',
		* 	parameter: 'PARAMETER',
		* 	length: 'length',
		* 	type: 'Date'|'ComboBox'|undefined,
		* 	label: 'columnLabel',
		* 	normalizeID: true|false|undefined
		* 	required: true|false|undefined,
		* 	toUpper: true|false|undefined,
		* 	readOnly: true|false|undefined,
		* 	visible: true|false|undefined,
		* 	defaultValue: 'defaultValue'|'function(){return 'defaultValue';}|undefined,
		* 	init: 'function(control){...}|undefined,
		* 	filter: 'filter'|'function(control){return 'filter';}|undefined
		* }, ...]
		* @returns {Array}
		* [{
		* 	id: 'fieldName',
		* 	parameter: 'PARAMETER',
		* 	length: 'length',
		* 	type: 'Date'|'ComboBox'|undefined,
		* 	label: 'columnLabel',
		* 	normalizeID: true|false|undefined
		* 	required: true|false|undefined,
		* 	toUpper: true|false|undefined,
		* 	readOnly: true|false|undefined,
		* 	visible: true|false|undefined,
		* 	defaultValue: 'defaultValue'|'function(){return 'defaultValue';}|undefined,
		* 	init: 'function(control){...}|undefined,
		* 	filter: 'filter'|'function(control){return 'filter';}|undefined
		* }, ...]
		* @example
		* <pre><code>
		* GetMaterialSearchCriteria: function (searchCriteria)
		* {
		* 	var materialTable = Lib.SOP.Tables.Materials;
		* 	searchCriteria.push({ id: materialTable.description, parameter: "MATERIALSHORTDESCSEL", label: "Description", defaultValue: description, length: "40", visible: true });
		* 	return searchCriteria;
		* };
		* </code></pre>
		*/
		GetMaterialSearchCriteria: function (searchCriteria)
		{
			return searchCriteria;
		},
		/**
		* @description Allows modification of the callParams.data in the SAP OAuth 2.0 token API calls (client and server) to include additional required data such as scope.
		* @param {string} params "grant_type=client_credentials"
		* @returns {string} params
		* @example
		* <pre><code>
		* OnSapWebServiceTokenParamsSet: function (params)
		* {
		*	var scope = Variable.GetValueAsString("Z_TokenScope__");
		*	if (!Sys.Helpers.IsEmpty(scope))
		*	{
		*		params += "&scope=" + scope;
		*	}
		*	Log.Info("[OnSapWebServiceTokenParamsSet] - " + params);
		*	return params;
		* }
		* </code></pre>
		*/
		OnSapWebServiceTokenParamsSet: function (params)
		{
			return params;
		},

		/**
		 * @description This function is called when querying 'SO - Automatic processing__'.
		 * Use this function to specialize automatic processing logic.
		 *
		 * @returns {string} Additional LDAP filter.
		 *
		 * @example In this example, automatic processing is driven by sold-to/ship-to number, using custom field Z_ShipToNumber__.
		 * <pre><code>
		 * GetAutomaticProcessingExtraFilter: function ()
		 * {
		 * 	var shipTo = Data.GetValue("ShipToNumber__");
		 * 	var extraFilter = shipTo ? "(Z_ShipToNumber__=" + shipTo + ")" : "";
		 * 	return extraFilter;
		 * }
		 * </code></pre>
		 */
		GetAutomaticProcessingExtraFilter: function ()
		{
		},

		/**
		 * @description This function is called when attaching document URL link to a business document in SAP.
		 * Use this function to change the default attachment link name.
		 *
		 * @param {string} defaultName the default attachment link name.
		 * @returns {string} Name of the new URL attachment in SAP.
		 *
		 * @example Use PO number as URL attachment name for order object in SAP
		 * <pre><code>GetSapAttachURLName: function (defaultName)
		 * {
		 * 	var attachURLName = defaultName;
		 * 	var poNumber = Data.GetValue("Sales_Order_Number__");
		 * 	poNumber = poNumber.trim().replace(/[^a-zA-Z0-9.\- ]/g, "_");
		 * 	if (poNumber && poNumber.length > 1)
		 * 	{
		 * 		attachURLName = poNumber;
		 * 	}
		 * 	return attachURLName;
		 * }
		 * </code></pre>
		 */
		GetSapAttachURLName: function (defaultName)
		{
		},

		/**
		 * @description This function is called when attaching document URL link to a business document in SAP.
		 * Use this function to specify the single sign-on URL of the current account.
		 * This URL will be used to generate the URL link to the business document in SAP.
		 *
		 * @returns {string} Single sign-on URL of the current account.
		 *
		 * @example Use the single sign-on URL of the current account as the URL link to the business document in SAP
		 * <pre><code>GetSSOUrl: function ()
		 * {
		 * 		switch (Sys.OM.Helpers.GetConfiguration().Configuration_Type)
		 * 		{
		 * 			case "DEV":
		 * 				return "";
		 * 			case "QA":
		 * 				return "https://cc6.ondemand.esker.com/ondemand/webaccessSSO?name=my_company_test&uniqueId=my_company_test";
		 * 			case "PROD":
		 * 				return "https://cc6.ondemand.esker.com/ondemand/webaccessSSO?name=my_company_prod&uniqueId=my_company_prod";
		 * 		}
		 * }
		 * </code></pre>
		 */
		GetSSOUrl: function ()
		{
		},

		/**
		 * @description Allows for defining a different object type to attach the URL in SAP.
		 *
		 * @param {string} objectType Current object type.
		 * @returns {string} Updated Object type.
		 * @example
		 * <pre><code>GetSapAttachObjectType: function (objectType)
		 * {
		 *	if (Variable.GetValueAsString("Z_OrderObjectType"))
		 * 	{
		 *		objectType = Variable.GetValueAsString("Z_OrderObjectType");
		 *	}
		 * 	return objectType;
		 * }
		 * </code></pre>
		 */
		GetSapAttachObjectType: function (objectType)
		{
			return objectType;
		},

		/**
		 * @description This function gives ability to change any parameter to the Lib.SOP.Helpers.QueryDB() function call, before the query is executed.
		 *
		 * @param {*} queryObject The Query object
		 * @param {string} tableName The name of the table on which will be made the query.
		 * @param {string} filter The filter used by the query.
		 * @param {string} attributes The list of attributes to retrieve.
		 * @param {number} maxItems The number of results expected.
		 *
		 * @example This example sorts ascending partner numbers.
		 * <pre><code>CustomizeDBQuery: function (queryObject, tableName, filter, attributes, maxItems)
		 * {
		 * 	if (tableName === "SO - Partners__")
		 * 	{
		 * 		queryObject.SetSortOrder( "Number__ ASC" );
		 * 	}
		 * }</code></pre>
		 */
		CustomizeDBQuery: function (queryObject, tableName, filter, attributes, maxItems)
		{
		},

		/**
		 * @description Allows to redefine the master data filtering logic, to all or a specific table.
		 *
		 * @param {string} tableToQuery Name of the table against which the LDAP query will be executed.
		 * @param {Sys.Helpers.LdapUtil.IFilter} defaultFilter The current filter object the will be used for the current query.
		 * @returns {Sys.Helpers.LdapUtil.IFilter} Resulting LDAP filter object. If returned object is null or undefined, default filter will be applied.
		 *
		 * @example Use a custom filtering key on materials table (materials may have not been replicated for all sales areas, use a generic one)
		 * <pre><code>GetCustomDataFilteringKeyFilter = function (tableToQuery, defaultFilter)
		 * {
		 * 	var dataFilteringKeyFilter = defaultFilter;
		 * 	var configuration = Sys.OM.Helpers.GetConfiguration();
		 * 	if (tableToQuery === Lib.SOP.Tables.Materials.tableName && configuration.Z_MATERIALSDATAFILTERINGKEY__)
		 * 	{
		 * 		// A different key is defined for materials
		 * 		dataFilteringKeyFilter = Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.AutomaticProcessing.dataFilteringKey, configuration.Z_MATERIALSDATAFILTERINGKEY__);
		 * 	}
		 *
		 * 	return dataFilteringKeyFilter;
		 * }</code></pre>
		 */
		GetCustomDataFilteringKeyFilter: function (tableToQuery, defaultFilter)
		{
		},

		/**
		 * @description Allows to customize the portal order settings before generating the order.
		 * The portal order is defined as COPo and the order is defined as COP.
		 * @param {Object} orderSettings - Object containing properties used to generate COPo or COP.
		 * @param {string} orderType - Type of the order. The two possible values are "COPo" and "COP".
		 *
		 * @example Set NeedValidation to 0 to allow order touchless validation for portal orders
		 * <pre><code>CustomizeOrderSettings: function (orderSettings, orderType)
		 * {
		 * 		if(orderType === "COP")
		 * 		{
		 * 			orderSettings.NeedValidation = "0";
		 * 		}
		 * 		return orderSettings;
		 * }</code></pre>
		 */
		CustomizeOrderSettings: function (orderSettings, orderType)
		{
		},

		/**
		 * @description Allows customization of key parameters for updating the portal order status.
		 * This function provides a way within the Lib_SOP_PORTAL library to customize parameters such as ruid, status, sendNotification, orderNumber, shippingDate, and deliveryDate.
		 * @param {Object} parameters - Object containing key parameters for updating the portal order status.
		 *
		 * @example Customize key parameters before updating the portal order status:
		 * <pre><code>CustomizeOrderParameters: function (parameters)
		 * {
		 * 		parameters.status = Data.GetValue("Order_Status__");
		 * 		parameters.sendNotification = true;
		 * 		parameters.shippingDate = new Date();
		 * 		parameters.deliveryDate = new Date();
		 * }</code></pre>
		 */
		CustomizeOrderParameters: function (parameters)
		{
		},

		/**
		 * @description Allows to customize the order notification email sender information.
		 * @param {string} defaultSenderName - The default sender name for order confirmation emails.
		 * @param {string} defaultSenderAddress - The default sender address for order confirmation emails.
		 * @param {Object} senderUser - The user who is sending the email.
		 * @returns {object} Returns an object with customized sender information. Expected syntax of returned object: { customSenderAddress: string; customSenderName: string; }.
		 * @property {string} customSenderAddress - The customized sender address for order notification emails.
		 * @property {string} customSenderName - The customized sender name for order notification emails.
		 *
		 * @example Given a custom email sender address in configuration, change default order confirmation email notification sender name and address.
		 * <pre><code>CustomizeOrderNotificationSender: function (defaultSenderName, defaultSenderAddress, senderUser)
		 * {
		 * 	var fromAddress = Sys.OM.Helpers.GetConfiguration().Z_SENDEMAILSENDERADDRESS__;
		 * 	var noReplyAddress = defaultSenderAddress;
		 * 	var noReplyName = defaultSenderName;
		 * 	if (fromAddress && noReplyAddress.indexOf("@"))
		 * 	{
		 * 		var atSymbolIndex = fromAddress.indexOf("@");
		 * 		var domain = fromAddress.substring(atSymbolIndex);
		 * 		if (domain.indexOf("mycompany.fr") >= 0)
		 * 		{
		 * 			noReplyAddress = "ne-pas-repondre" + domain;
		 * 			noReplyName = "Message automatique";
		 * 		}
		 * 		else
		 * 		{
		 * 			noReplyAddress = "no-reply" + domain;
		 * 			noReplyName = "Automated message";
		 * 		}
		 * 	}
		 * 	return {
		 * 		customSenderAddress: noReplyAddress,
		 * 		customSenderName: noReplyName
		 * 	};
		 * }</code></pre>
		 *
		 * @example If sender user is a group, use a custom sender name.
		 * <pre><code>CustomizeOrderNotificationSender: function (defaultSenderName, defaultSenderAddress, senderUser)
		 * {
		 * 	var customSenderName = defaultSenderName;
		 * 	if (senderUser && senderUser.GetValue("IsGroup"))
		 * 	{
		 * 		customSenderName = "My Company Group";
		 * 	}
		 * 	return {
		 * 		customSenderAddress: defaultSenderAddress,
		 * 		customSenderName: customSenderName
		 * 	};
		 * }</code></pre>
		 */
		CustomizeOrderNotificationSender: function (defaultSenderName, defaultSenderAddress, senderUser)
		{
		},

		/**
		 * @description Allows to add additional recipients to the order notification email.
		 * @returns {string[]} Returns an array of strings representing the additional recipient email addresses.
		 * @example Add additional recipients to the order notification email.
		 * <pre><code>OrderNotificationAdditionalRecipients: function ()
		 * {
		 * 	const recipients = ["additional@example.com", "toto@toto.com"];
			return recipients;
		 * }</code></pre>
		 */
		OrderNotificationAdditionalRecipients: function ()
		{
		},

		/**
		 * @description Allows to customize the order notification email subject.
		 * @param {object} subject - The order notification default subject information with the following syntax: { key: string; parameters: [string]; }.
		 * @property {string} key - the subject string.
		 * @property {string} parameters - an array of parameters to replace the {0}, {1}, {2}... in the key property.
		 * @param {string} status - The status of the order notification ("OrderCancelled", "OrderPlaced", "OrderAccepted", "OrderShipped", "OrderDelivered", "OrderPayed").
		 * @param {object} customTags an array that has the tags to be referenced in an order notification
		 * @returns {object} Returns null or undefined to use (possibly customized) subject parameter or a customized subject information object with the following syntax: { key: string; parameters: [string]; }.
		 * @property {string} key - the subject string.
		 * @property {string} parameters - an array of parameters to replace the {0}, {1}, {2}... in the key property.
		 *
		 * @example Customize order notification subject depending on the order status.
		 * <pre><code>CustomizeOrderNotificationSubject: function (subject, status, customtags)
		 * {
		 * 	if (status === "OrderCancelled" || status === "OrderAccepted")
		 * 	{
		 * 		subject.key = "We received and are processing your PO {0}";
		 * 	}
		 * }</code></pre>
		 *
		 * @example Change the purchase order reference using order number instead of the order summary.
		 * <pre><code>CustomizeOrderNotificationSubject: function (subject, status, customtags)
		 * {
		 * 	subject.parameters = [customtags["Order_Number__"]];
		 * }</code></pre>
		 */
		CustomizeOrderNotificationSubject: function (subject, status, customtags)
		{
		},

		/**
		 * @description This user exit is called after a call to SAP BAPI BAPISDORDER_GETDETAILEDLIST and allows performing
		 * custom tasks according to the SAP contract properties. No return value is expected from this function.
		 *
		 * @param {object} contractData - The output data obtained from the BAPI BAPISDORDER_GETDETAILEDLIST.
		 * @param {object} contractData.TABLES - Object containing various tables related to the SAP contract.
		 * @param {Array} contractData.TABLES.ORDER_FLOWS_OUT - Array representing the order flows associated with the contract.
		 * @param {Array} contractData.TABLES.ORDER_HEADERS_OUT - Array representing the order headers associated with the contract.
		 * @param {Array} contractData.TABLES.ORDER_ITEMS_OUT - Array representing the order items associated with the contract.
		 *
		 * @example Fill custom header field with contract PO number.
		 * <pre><code>OnSapContractLoadedCallback: function (contractData)
		 * {
		 * 	Data.SetValue("Z_Contract_PO_Number__", contractData.TABLES.ORDER_HEADERS_OUT[0].PURCH_NO);
		 * }
		 * </code></pre>
		 */
		OnSapContractLoadedCallback: function (contractData)
		{
		},

		/**
		 * @description This user exit is called after a call to SAP BAPI BAPISDORDER_GETDETAILEDLIST and allows performing
		 * custom tasks according to the SAP contract properties. No return value is expected from this function.
		 *
		 * @param {object} quoteData - The output data obtained from the BAPI BAPISDORDER_GETDETAILEDLIST.
		 * @param {object} quoteData.TABLES - Object containing various tables related to the SAP contract.
		 * @param {Array} quoteData.TABLES.ORDER_FLOWS_OUT - Array representing the order flows associated with the contract.
		 * @param {Array} quoteData.TABLES.ORDER_HEADERS_OUT - Array representing the order headers associated with the contract.
		 * @param {Array} quoteData.TABLES.ORDER_ITEMS_OUT - Array representing the order items associated with the contract.
		 *
		 * @example Fill custom header field with contract PO number.
		 * <pre><code>OnSapQuoteLoadedCallback: function (quoteData)
		 * {
		 * 	Data.SetValue("Z_Quote_PO_Number__", quoteData.TABLES.ORDER_HEADERS_OUT[0].PURCH_NO);
		 * }
		 * </code></pre>
		 */
		OnSapQuoteLoadedCallback: function (quoteData)
		{
		},

		/**
		 * @description This user exit is called before the standard reconciliation of the contract data
		 * with the current order begins. It is triggered after the retrieval of detailed contract information from
		 * BAPISDORDER_GETDETAILEDLIST BAPI call and the before reconciliation process.
		 * This user exit allows performing custom tasks or validations before the reconciliation process starts.
		 *
		 * @returns {Object | undefined} - If this user exit returns 'Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution()',
		 * the standard reconciliation process will be deactivated. Otherwise, no return value is expected.
		 *
		 * @example Deactivate standard reconciliation process
		 * <pre><code>OnReconcileContractWithCurrentDocumentBegin: function ()
		 * {
		 * 		return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution();
		 * }</code></pre>
		 */
		OnReconcileContractWithCurrentDocumentBegin: function ()
		{
		},

		/**
		 * @description This user exit is called before the standard reconciliation of the quote data
		 * with the current order begins. It is triggered after the retrieval of detailed quote information from
		 * BAPISDORDER_GETDETAILEDLIST BAPI call and the before reconciliation process.
		 * This user exit allows performing custom tasks or validations before the reconciliation process starts.
		 *
		 * @returns {Object | undefined} - If this user exit returns 'Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution()',
		 * the standard reconciliation process will be deactivated. Otherwise, no return value is expected.
		 *
		 * @example Deactivate standard reconciliation process
		 * <pre><code>OnReconcileQuoteWithCurrentDocumentBegin: function ()
		 * {
		 * 		return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution();
		 * }</code></pre>
		 */
		OnReconcileQuoteWithCurrentDocumentBegin: function ()
		{
		},

		/**
		 * @description This user exit is called after the reconciliation of a contract item with the current document item
		 * and allows performing custom tasks or validations. No return value is expected from this function.
		 *
		 * @param {object} contractItemProperties Key-value pairs dictionary representing the properties of the contract item.
		 * @param {object} item Current document item (as returned by the Data.GetTable().GetItem() API).
		 *
		 * @example Fill custom column PO Number with item PO number.
		 * <pre><code>OnReconcileContractItemWithCurrentDocumentItem: function (contractItemProperties, item)
		 * {
		 * 	item.SetValue("Z_PO_Number__", contractItemProperties.customColumnContractItemPONumber || "");
		 * }</code></pre>
		 */
		OnReconcileContractItemWithCurrentDocumentItem: function (contractItemProperties, item)
		{
		},

		/**
		 * @description This user exit is called after the reconciliation of a quote item with the current document item
		 * and allows performing custom tasks or validations. No return value is expected from this function.
		 *
		 * @param {object} quoteItemProperties Key-value pairs dictionary representing the properties of the quote item.
		 * @param {object} item Current document item (as returned by the Data.GetTable().GetItem() API).
		 *
		 * @example Fill custom column PO Number with item PO number.
		 * <pre><code>OnReconcileQuoteItemWithCurrentDocumentItem: function (quoteItemProperties, item)
		 * {
		 * 	item.SetValue("Z_PO_Number__", quoteItemProperties.customColumnQuoteItemPONumber || "");
		 * }</code></pre>
		 */
		OnReconcileQuoteItemWithCurrentDocumentItem: function (quoteItemProperties, item)
		{
		},

		/**
		 * @description This user exit allows performing custom tasks or cleanup actions after the reconciliation process completes.
		 * No return value is expected from this function.
		 *
		 * @example Fill Contract Item PO Number using header one.
		 * <pre><code>OnReconcileContractWithCurrentDocumentEnd: function ()
		 * {
		 * 		var contractPoNumber = Data.GetValue("Z_Contract_PO_Number__");
		 * 		var table = Data.GetTable("Product_List__");
		 * 		var nbLines = table.GetItemCount();
		 * 		for (let i = 0; i < nbLines; i++)
		 * 		{
		 * 			var item = table.GetItem(i);
		 * 			item.SetValue("Z_Contract_PO_Number__", contractPoNumber);
		 * 		}
		 * }</code></pre>
		 *
		 * @example Remove contract item remaining quantity if we chose not to load the item flows
		 * <pre><code>OnReconcileContractWithCurrentDocumentEnd: function ()
		 * {
		 * 		if (Variable.GetValueAsString("Z_RemoveContractAvailableQuantity") === "1")
		 * 		{
		 * 			let table = Data.GetTable("Product_List__");
		 * 			for (let index = 0; index < table.GetItemCount(); index++)
		 * 			{
		 * 				let item = table.GetItem(index);
		 * 				if (item.GetValue("ContractItemNumber__"))
		 * 				{
		 * 					// Remove contract item remaining quantity as we chose not to load the item flows
		 * 					item.SetValue("ContractAvailableQuantity__", "");
		 * 				}
		 * 			}
		 * 		}
		 * }</code></pre>
		 */
		OnReconcileContractWithCurrentDocumentEnd: function ()
		{
		},

		/**
		 * @description This user exit allows performing custom tasks or cleanup actions after the reconciliation process completes.
		 * No return value is expected from this function.
		 *
		 * @example Fill Quote Item PO Number using header one.
		 * <pre><code>OnReconcileQuoteWithCurrentDocumentEnd: function ()
		 * {
		 * 		var quotePoNumber = Data.GetValue("Z_Quote_PO_Number__");
		 * 		var table = Data.GetTable("Product_List__");
		 * 		var nbLines = table.GetItemCount();
		 * 		for (let i = 0; i < nbLines; i++)
		 * 		{
		 * 			var item = table.GetItem(i);
		 * 			item.SetValue("Z_Quote_PO_Number__", quotePoNumber);
		 * 		}
		 * }</code></pre>
		 */
		OnReconcileQuoteWithCurrentDocumentEnd: function ()
		{
		},

		/**
		 * @description This user exit allows customization of the BAPISDORDER_GETDETAILEDLIST options before retrieving detailed contract information.
		 * Modify the 'options' object as needed to activate or deactivate specific components of the BAPI call.
		 * Each option must contain an empty string or "X" to be deactivated or activated.
		 * Default options are provided as a parameter and can be modified as needed.
		 *
		 * @param {string} contractNumber - The SAP contract number to be used in the BAPI call.
		 * @param {object} options - The options object for customizing the BAPI call.
		 * @param {object | null} contractHeaderData - The contract header data, from ORDER_HEADERS_OUT structure as returned by the BAPISDORDER_GETDETAILEDLIST BAPI call, or null if contract has not been found.
		 *
		 * @example Do not load item flow history if remaining quantity information is not needed
		 * <pre><code>OnSapContractLoad: function (contractNumber, options, contractHeaderData)
		 * {
		 *	if (contractHeaderData.DOC_TYPE !== "KM" && options.FLOW)
		 *	{
		 *		// If not a quantity contract, do not load the item flows
		 *		delete options.FLOW;
		 *
		 *		// Important: make sure to remove content of ContractAvailableQuantity__ column in OnReconcileContractWithCurrentDocumentEnd user exit!
		 *		Variable.SetValueAsString("Z_RemoveContractAvailableQuantity", "1");
		 *	}
		 * }</code></pre>
		 *
		 * @example Load business part to get PO Number line items.
		 * <pre><code>OnSapContractLoad: function (contractNumber, options, contractHeaderData)
		 * {
		 *	options["BUSINESS"] = "X";
		 * }</code></pre>
		 */
		OnSapContractLoad: function (contractNumber, options, contractHeaderData)
		{
		},

		/**
		 * @description This user exit allows customization of the BAPISDORDER_GETDETAILEDLIST options before retrieving detailed quote information.
		 * Modify the 'options' object as needed to activate or deactivate specific components of the BAPI call.
		 * Each option must contain an empty string or "X" to be deactivated or activated.
		 * Default options are provided as a parameter and can be modified as needed.
		 *
		 * @param {string} quoteNumber - The SAP contract number to be used in the BAPI call.
		 * @param {object} options - The options object for customizing the BAPI call.
		 *
		 * @example Do not load item flow history if remaining quantity information is not needed
		 * <pre><code>OnSapQuoteLoad: function (quoteNumber, options)
		 * {
		 *	options.FLOW = "";
		 * }</code></pre>
		 *
		 * @example Load business part to get PO Number line items.
		 * <pre><code>OnSapQuoteLoad: function (quoteNumber, options)
		 * {
		 *	options["BUSINESS"] = "X";
		 * }</code></pre>
		 */
		OnSapQuoteLoad: function (quoteNumber, options)
		{
		},

		/**
		 * @description This user exit allows customization of the SAP contracts types to be retrieved.
		 *
		 * @returns {Array<string>} List of SAP internal types for contracts retrieval. Allowed values from VBAK-AUART SAP table. Default value: "KM" (Quantity contract).
		 *
		 * @example
		 * <pre><code>GetSupportedSapContractsTypes: function ()
		 * {
		 * 	// Support 'Quantity contract' and 'Service and maintenance' contracts
		 * 	return ["KM", "WV"];
		 * }</code></pre>
		 */
		GetSupportedSapContractsTypes: function ()
		{
		},

		/**
		 * @description This user exit allows customization of error level during reconciliation of current order items against contract items.
		 *
		 * @returns {string} Possible values: "none", "info", "warning", "error". Default value: "warning".
		 */
		GetContractReconciliationErrorLevel: function ()
		{
		},

		/**
		 * @description This user exit allows customization of error level during reconciliation of current order items against quote items.
		 *
		 * @returns {string} Possible values: "none", "info", "warning", "error". Default value: "warning".
		 */
		GetQuoteReconciliationErrorLevel: function ()
		{
		},

		/**
		* @description Retrieves the fields displayed in the Result list table of the Contract number browse dialog.
		* The fields returned by this function are retrieved from the tables of the SAP environment.
		* This method implementation calls the user exit Lib.SOP.Customization.Common.GetContractNumberColumns which can be used to modify the columns to retrieve.
		* @param {Array} columns
		* [
		*	{
		*		id: 'fieldName',
		*		label: 'columnLabel',
		*		type: 'STR'|'DATE',
		*		width: 'columnWidth',
		*		formater: function|undefined
		*	}, ...
		* ]
		* @returns {Array}
		* [
		*	{
		*		id: 'fieldName',
		*		label: 'columnLabel',
		*		type: 'STR'|'DATE',
		*		width: 'columnWidth',
		*		formater: function|undefined
		*	}, ...
		* ]
		* @example
		* <pre><code>
		* // add description of contract
		* GetContractNumberColumns: function (columns)
		* {
		* 	columns.push({id: "KTEXT", label: "Contract Description Column", length: "40", type: "STR", width: 100});
		* 	return columns;
		* };
		* </code></pre>
		*/
		GetContractNumberColumns: function (columns)
		{
		},

		/**
		* @description Retrieves the fields displayed in the Result list table of the Quote number browse dialog.
		* The fields returned by this function are retrieved from the tables of the SAP environment.
		* This method implementation calls the user exit Lib.SOP.Customization.Common.GetQuoteNumberColumns which can be used to modify the columns to retrieve.
		* @param {Array} columns
		* [
		*	{
		*		id: 'fieldName',
		*		label: 'columnLabel',
		*		type: 'STR'|'DATE',
		*		width: 'columnWidth',
		*		formater: function|undefined
		*	}, ...
		* ]
		* @returns {Array}
		* [
		*	{
		*		id: 'fieldName',
		*		label: 'columnLabel',
		*		type: 'STR'|'DATE',
		*		width: 'columnWidth',
		*		formater: function|undefined
		*	}, ...
		* ]
		* @example
		* <pre><code>Add quote PO number to the result list
		* GetQuoteNumberColumns: function (columns)
		* {
		* 	columns.push({id: "BSTNK", label: "Quote PO Number", length: "20", type: "STR", width: 100});
		* 	return columns;
		* };
		* </code></pre>
		*/
		GetQuoteNumberColumns: function (columns)
		{
		},

		/**
		* @description Retrieves the fields displayed in the search panel of the Contract Number browse dialog.
		* The fields returned by this function are retrieved from the tables of the SAP environment.
		* @param {Array} searchCriteria
		* [{
		* 	id: 'fieldName',
		* 	type: 'Date'|'ComboBox'|undefined,
		* 	label: 'columnLabel',
		* 	required: true|false|undefined,
		* 	readOnly: true|false|undefined,
		* 	visible: true|false|undefined,
		* 	defaultValue: 'defaultValue'|'function(){return 'defaultValue';}|undefined,
		* 	init: 'function(control){...}|undefined,
		* 	filter: 'filter'|'function(control){return 'filter';}|undefined
		* }]
		* @returns {Array}
		* [{
		* 	id: 'fieldName',
		* 	type: 'Date'|'ComboBox'|undefined,
		* 	label: 'columnLabel',
		* 	required: true|false|undefined,
		* 	readOnly: true|false|undefined,
		* 	visible: true|false|undefined,
		* 	defaultValue: 'defaultValue'|'function(){return 'defaultValue';}|undefined,
		*	defaultValueFormat: function(value){return Sys.Helpers.Browse.AutoAddAsterisk(value);}|undefined,
		* 	init: 'function(control){...}|undefined,
		* 	filter: 'filter'|'function(control){return 'filter';}|undefined
		* }]
		* @example
		* <pre><code>
		* // add Contract Begin Date to search criteria
		* GetContractNumberSearchCriterias: function (searchCriteria)
		* {
		* 	searchCriteria.push({
		*			id: "GUEBG",
		*			filterId: "GUEBG",
		*			label: "GUEBG",
		*			length: "10",
		*			width: 146,
		*			defaultValue: function ()
		*			{
		*				return "*";
		*			},
		*			defaultValueFormat: Sys.Helpers.Browse.AutoAddAsterisk,
		*			visible: true
		*	});
		* 	return searchCriteria;
		* };
		* </code></pre>
		*/
		GetContractNumberSearchCriterias: function (searchCriteria)
		{
		},

		/**
		* @description Retrieves the fields displayed in the search panel of the Quote Number browse dialog.
		* The fields returned by this function are retrieved from the tables of the SAP environment.
		* @param {Array} searchCriteria
		* [{
		* 	id: 'fieldName',
		* 	type: 'Date'|'ComboBox'|undefined,
		* 	label: 'columnLabel',
		* 	required: true|false|undefined,
		* 	readOnly: true|false|undefined,
		* 	visible: true|false|undefined,
		* 	defaultValue: 'defaultValue'|'function(){return 'defaultValue';}|undefined,
		* 	init: 'function(control){...}|undefined,
		* 	filter: 'filter'|'function(control){return 'filter';}|undefined
		* }]
		* @returns {Array}
		* [{
		* 	id: 'fieldName',
		* 	type: 'Date'|'ComboBox'|undefined,
		* 	label: 'columnLabel',
		* 	required: true|false|undefined,
		* 	readOnly: true|false|undefined,
		* 	visible: true|false|undefined,
		* 	defaultValue: 'defaultValue'|'function(){return 'defaultValue';}|undefined,
		*	defaultValueFormat: function(value){return Sys.Helpers.Browse.AutoAddAsterisk(value);}|undefined,
		* 	init: 'function(control){...}|undefined,
		* 	filter: 'filter'|'function(control){return 'filter';}|undefined
		* }]
		* @example
		* <pre><code>
		* // add Quote Start Date to search criteria
		* GetQuoteNumberSearchCriterias: function (searchCriteria)
		* {
		* 	searchCriteria.push({
		*			id: "GUEBG",
		*			filterId: "GUEBG",
		*			label: "GUEBG",
		*			length: "10",
		*			width: 146,
		*			defaultValue: function ()
		*			{
		*				return "*";
		*			},
		*			defaultValueFormat: Sys.Helpers.Browse.AutoAddAsterisk,
		*			visible: true
		*	});
		* 	return searchCriteria;
		* };
		* </code></pre>
		*/
		GetQuoteNumberSearchCriterias: function (searchCriteria)
		{
		},

		/**
		* @description Retrieves the fields displayed in the Result list table of the Contract number browse dialog.
		* The fields returned by this function are retrieved from the tables of the SAP environment.
		* This method implementation calls the user exit Lib.SOP.Customization.Common.GetContractItemNumberColumns which can be used to modify the columns to retrieve.
		* To be used in conjunction with the Lib.SOP.Customization.Common.GetCustomSAPContractItemValues user exit.

		* @param {Array} columns
		* [
		*	{
		*		id: 'fieldName',
		*		label: 'columnLabel',
		*		type: 'STR'|'DATE',
		*		width: 'columnWidth',
		*		formater: function|undefined
		*	}, ...
		* ]
		* @returns {Array}
		* [
		*	{
		*		id: 'fieldName',
		*		label: 'columnLabel',
		*		type: 'STR'|'DATE',
		*		width: 'columnWidth',
		*		formater: function|undefined
		*	}, ...
		* ]
		* @example
		* <pre><code>
		* // add description of contract
		* GetContractItemNumberColumns: function (columns)
		* {
		* 	columns.push({id: "customColumnContractItemPONumber", label: "Contract Item PO #", length: "40", type: "STR", width: 100});
		* 	return columns;
		* };
		* </code></pre>
		*/
		GetContractItemNumberColumns: function (columns)
		{
		},

		/**
		 * @description Retrieves the fields displayed in the Result list table of the Quote number browse dialog.
		 * The fields returned by this function are retrieved from the tables of the SAP environment.
		 * This method implementation calls the user exit Lib.SOP.Customization.Common.GetQuoteItemNumberColumns which can be used to modify the columns to retrieve.
		 * To be used in conjunction with the Lib.SOP.Customization.Common.GetCustomSAPQuoteItemValues user exit.
		 * @param {Array} columns
		 * @example Add Profit Center to search criteria
		 * <pre><code>
		 * GetQuoteItemNumberColumns: function (columns)
		 * {
		 * 	columns.push({id: "customColumnQuoteItemPONumber", label: "Quote Item PO #", length: "40", type: "STR", width: 100});
		 * 	return columns;
		 * };
		 * </code></pre>
		 */
		GetQuoteItemNumberColumns: function (columns)
		{
		},

		/**
		* @description Retrieves the fields displayed in the search panel of the Contract Number browse dialog.
		* The fields returned by this function are retrieved from the tables of the SAP environment.
		* @param {Array} searchCriteria
		* [{
		* 	id: 'fieldName',
		* 	type: 'Date'|'ComboBox'|undefined,
		* 	label: 'columnLabel',
		* 	required: true|false|undefined,
		* 	readOnly: true|false|undefined,
		* 	visible: true|false|undefined,
		* 	defaultValue: 'defaultValue'|'function(){return 'defaultValue';}|undefined,
		* 	init: 'function(control){...}|undefined,
		* 	filter: 'function(criteriaFieldValue, recordFieldValue){return recordFieldValue.includes(criteriaFieldValue);}|undefined
		* }]
		* @returns {Array}
		* [{
		* 	id: 'fieldName',
		* 	type: 'Date'|'ComboBox'|undefined,
		* 	label: 'columnLabel',
		* 	required: true|false|undefined,
		* 	readOnly: true|false|undefined,
		* 	visible: true|false|undefined,
		* 	defaultValue: 'defaultValue'|'function(){return 'defaultValue';}|undefined,
		*	defaultValueFormat: function(value){return Sys.Helpers.Browse.AutoAddAsterisk(value);}|undefined,
		* 	init: 'function(control){...}|undefined,
		* 	filter: 'function(criteriaFieldValue, recordFieldValue){return recordFieldValue.includes(criteriaFieldValue);}|undefined
		* }]
		* @example Add Profit Center to search criteria
		* <pre><code>
		* GetContractItemNumberSearchCriterias: function(searchCriteria)
		* {
		* 	searchCriteria.push({
		* 		id: "PROFIT_CTR",
		* 		filterId: "PROFIT_CTR",
		* 		label: "Profit Center",
		* 		length: "40",
		* 		width: 146,
		* 		defaultValue: function ()
		* 		{
		* 			return "*";
		* 		},
		* 		defaultValueFormat: Sys.Helpers.Browse.AutoAddAsterisk,
		* 		visible: true
		* 	});
		* 	return searchCriteria;
		* }
		* </code></pre>
		*/
		GetContractItemNumberSearchCriterias: function (searchCriteria)
		{
		},

		/**
		* @description Retrieves the fields displayed in the search panel of the Quote Number browse dialog.
		* The fields returned by this function are retrieved from the tables of the SAP environment.
		* @param {Array} searchCriteria
		* [{
		* 	id: 'fieldName',
		* 	type: 'Date'|'ComboBox'|undefined,
		* 	label: 'columnLabel',
		* 	required: true|false|undefined,
		* 	readOnly: true|false|undefined,
		* 	visible: true|false|undefined,
		* 	defaultValue: 'defaultValue'|'function(){return 'defaultValue';}|undefined,
		* 	init: 'function(control){...}|undefined,
		* 	filter: 'function(criteriaFieldValue, recordFieldValue){return recordFieldValue.includes(criteriaFieldValue);}|undefined
		* }]
		* @returns {Array}
		* [{
		* 	id: 'fieldName',
		* 	type: 'Date'|'ComboBox'|undefined,
		* 	label: 'columnLabel',
		* 	required: true|false|undefined,
		* 	readOnly: true|false|undefined,
		* 	visible: true|false|undefined,
		* 	defaultValue: 'defaultValue'|'function(){return 'defaultValue';}|undefined,
		*	defaultValueFormat: function(value){return Sys.Helpers.Browse.AutoAddAsterisk(value);}|undefined,
		* 	init: 'function(control){...}|undefined,
		* 	filter: 'function(criteriaFieldValue, recordFieldValue){return recordFieldValue.includes(criteriaFieldValue);}|undefined
		* }]
		* @example Add Profit Center to search criteria
		* <pre><code>
		* GetQuoteItemNumberSearchCriterias: function(searchCriteria)
		* {
		* 	searchCriteria.push({
		* 		id: "PROFIT_CTR",
		* 		filterId: "PROFIT_CTR",
		* 		label: "Profit Center",
		* 		length: "40",
		* 		width: 146,
		* 		defaultValue: function ()
		* 		{
		* 			return "*";
		* 		},
		* 		defaultValueFormat: Sys.Helpers.Browse.AutoAddAsterisk,
		* 		visible: true
		* 	});
		* 	return searchCriteria;
		* }
		* </code></pre>
		*/
		GetQuoteItemNumberSearchCriterias: function (searchCriteria)
		{
		},

		/**
		 * @description This user exit allows for further customization of the filter used for searching contracts in the SAP system.
		 * It should take the sold-to party number and the initial filter as input and return the modified filter.
		 * @param {String} soldToNumber The soldToNumber associated with the order
		 * @param {String} filter The initial filter used for searching contracts
		 * @returns {String} The modified filter used for searching contracts
		 * @example
		 * <pre><code>
		 * CustomizeFindValidContractsFilter: function (soldToNumber, filter)
		 * {
		 *     const customFilter = filter + "\nAND custom_condition";
		 *     return customFilter;
		 * };
		 * </code></pre>
		 *
		 * @example
		 *  To force a default Contract.
		 * <pre><code>
		 * CustomizeFindValidContractsFilter: function (soldToNumber, filter)
		 * {
		 *     return filter + "\nAND VBELN = '0040000209'";
		 * };
		 * </code></pre>
		 */
		CustomizeFindValidContractsFilter: function (soldToNumber, filter)
		{
		},

		/**
		 * @description This user exit allows for customization of the fields to be retrieved from the SAP system during the contract search.
		 * It should take an array of field names as input and return the modified array.
		 * @param {Array<String>} fieldsToRetrieve The initial array of field names to be retrieved
		 * @returns {Array<String>} The modified array of field names to be retrieved
		 * @example
		 * <pre><code>
		 * CustomizeFindValidContractsFieldsToRetrieve: function (fieldsToRetrieve)
		 * {
		 *     fieldsToRetrieve.push("GUEBG");
		 *     return fieldsToRetrieve;
		 * };
		 * </code></pre>
		 */
		CustomizeFindValidContractsFieldsToRetrieve: function (fieldsToRetrieve)
		{
		},

		/**
		 * @description This user exit is called after a call to SAP BAPI BAPISDORDER_GETDETAILEDLIST and allows
		 * for retrival of a contract item properties and their corresponding values.
		 * To be used in conjunction with the Lib.SOP.Customization.Common.GetContractItemNumberColumns user exit.
		 *
		 * @param {object} contractData - The output data obtained from the BAPI BAPISDORDER_GETDETAILEDLIST.
		 * @param {object} contractData.TABLES - Object containing various tables related to the SAP contract.
		 * @returns { object } - Custom contract item properties and their corresponding values.
		 *
		 * @example Fill item PO number. Use second OnSapContractLoad sample to retrieve Business part.
		 * <pre><code>GetCustomSAPContractItemValues: function (contractData, itemNumber)
		 * {
		 * 	let customProperties = {};
		 * 	for (const entry of contractData.TABLES.ORDER_BUSINESS_OUT)
		 * 	{
		 * 		if (entry.ITM_NUMBER === itemNumber)
		 * 		{
		 * 			customProperties["customColumnContractItemPONumber"] = entry.PURCH_NO_C;
		 * 			break;
		 * 		}
		 * 	}
		 *
		 * 	return customProperties;
		 * }</code></pre>
		 */
		GetCustomSAPContractItemValues: function (contractData, itemNumber)
		{
		},

		/**
		 * @description This user exit is called after a call to SAP BAPI BAPISDORDER_GETDETAILEDLIST and allows
		 * for retrival of a quote item properties and their corresponding values.
		 * To be used in conjunction with the Lib.SOP.Customization.Common.GetQuoteItemNumberColumns user exit.
		 *
		 * @param {object} quoteData - The output data obtained from the BAPI BAPISDORDER_GETDETAILEDLIST.
		 * @param {object} quoteData.TABLES - Object containing various tables related to the SAP quote.
		 * @returns { object } - Custom quote item properties and their corresponding values.
		 *
		 * @example Fill item PO number.
		 * <pre><code>GetCustomSAPQuoteItemValues: function (quoteData, itemNumber)
		 * {
		 * 	let customProperties = {};
		 * 	for (const entry of quoteData.TABLES.ORDER_BUSINESS_OUT)
		 * 	{
		 * 		if (entry.ITM_NUMBER === itemNumber)
		 * 		{
		 * 			customProperties["customColumnQuoteItemPONumber"] = entry.PURCH_NO_C;
		 * 			break;
		 * 		}
		 * 	}
		 *
		 * 	return customProperties;
		 * }</code></pre>
		 */
		GetCustomSAPQuoteItemValues: function (quoteData, itemNumber)
		{
		},

		/**
		 * @description This user exit is triggered after the contract search query is executed in the SAP system.
		 * It allows for performing additional actions or manipulations on the query result before returning the contracts.
		 * @param {Array<Object>} contractsQueryResult The contracts query result as an array of objects
		 * @returns {Array<Object>} The modified array of query results
		 * @example Choose always the oldest contract as selected contract.
		 * <pre><code>
		 * FindValidContracts: function (contractsQueryResult)
		 * {
		 *  if(contractsQueryResult.length <= 0)
		 * 	{
		 * 		return [];
		 * 	}
		 * 	var minGuebg = contractsQueryResult[0].GUEBG;
		 * 	var minVbeln = contractsQueryResult[0].VBELN;
		 *
		 * 	contractsQueryResult.map((x) =>
		 * 	{
		 * 		if(x.GUEBG < minGuebg)
		 * 		{
		 * 			minGuebg = x.GUEBG;
		 * 			minVbeln = x.VBELN;
		 * 		}
		 * 		return x;
		 * 	});
		 * 	var result = contractsQueryResult.filter((x) =>
		 * 	{
		 * 		return x.VBELN == minVbeln;
		 * 	});
		 * 	return result;
		 * };
		 * </code></pre>
		 */
		OnFindValidContracts: function (contractsQueryResult)
		{
		},

		/**
		 * @description This user exit is called during the reconciliation of a contract item with the current document item and allows for custom logic to find a matching contract item.
		 *
		 * @param { Item } item  Current line item
		 * @param { Array<Lib.SOP.Contracts.QuantityContractItem> } contractItems The contract items
		 * @param { String } defaultUOM Default unit of measure as defined in the OM configuration
		 * @returns { QuantityContractItem | "SKIP_STANDARD_MATCHING" } The matching contract item or null if no match is found, to skip the standard matching logic return string "SKIP_STANDARD_MATCHING".
		 *
		 * @example Bypass contract items matching logic and return the first contract item matching the item number, unit of measure and ship to party.
		 * <pre><code>CustomFindMatchingContractItem: function (item, contractItems, defaultUOM)
		 * {
		 * 	if (Lib.SOP.CustomizationPS.FeatureToggle.ftAddShipToInContractItemDialog())
		 * 	{
		 * 		var itemNumber = item.GetValue("ItemNumber__");
		 * 		var unitOfMeasure = item.GetValue("Unit__") || defaultUOM;
		 * 		var shipToParty = Sys.Helpers.String.SAP.NormalizeID(Data.GetValue("ShipToNumber__"), 10);
		 * 		for (const contractItem of contractItems)
		 * 		{
		 * 			if (contractItem.productCode === itemNumber &&
		 * 				contractItem.targetUoM === unitOfMeasure &&
		 * 				contractItem.customFields.customColumnContractShipToNumber === shipToParty)
		 * 			{
		 * 				return contractItem;
		 * 			}
		 * 		}
		 * 		return null;
		 * 	}
		 * 	return null;
		 * }</code></pre>
		 */
		CustomFindMatchingContractItem: function (item, contractItems, defaultUOM)
		{
		},

		CustomizeSalesforceObjectInfo: function (info)
		{
			return info;
		},

		/**
		 * @description This user exit is called after a call to CallBapi and allows
		 * to customize the bapi returned object.
		 *
		 * @param {object} bapiResult - The result of callBapi.
		 * @param {string} bapiName - The name of the called bapi.
		 * @returns { object } - Custom result, needs to be the same type as bapiResult to preserve further code.
		 *
		 * @example ReconcileChangeOrders.
		 * <pre><code>CustomizeSalesforceObjectInfo: function (bapiResult, bapiName)
		 * {
		 * let partners = bapiResult.TABLES.ORDER_PARTNERS_OUT
		* 	for (var i = 0; i < partners; i++)
		* 	{
		* 		partners[i].CUSTOMER = partners[i].VENDOR_NO;
		* 	}
		 *	bapiResult.TABLES.ORDER_PARTNERS_OUT = partners;
		 * 	return bapiResult;
		 * }</code></pre>
		 */
		CustomizeCallBAPIReturnedObjectClient: function (bapiResult, bapiName)
		{
		},

		/**
		 * @description This user exit is called after a call to CallBapi and allows
		 * to customize the bapi returned object.
		 *
		 * @param {string} bapiResult - The result of callBapi, type stringified json.
		 * @param {string} bapiName - The name of the called bapi.
		 * @returns { string } - Custom result, needs to be the same type as bapiResult to preserve further code.
		 *
		 * @example ReconcileChangeOrders.
		 * <pre><code>CustomizeSalesforceObjectInfo: function (bapiResult, bapiName)
		 * {
		 * var parsedResult
		 * try
		 * {
		 * 		parsedResult = JSON.parse(bapiResult);
		 * }
		 * catch (e)
		 * {
		 * 		throw e.message
		 * }
		 *
		 * let partners = parsedResult.TABLES.ORDER_PARTNERS_OUT
		* 	for (var i = 0; i < partners; i++)
		* 	{
		* 		partners[i].CUSTOMER = partners[i].VENDOR_NO;
		* 	}
		 *	parsedResult.TABLES.ORDER_PARTNERS_OUT = partners;
		 * 	return JSON.stringify(parsedResult);
		 * }</code></pre>
		 */
		CustomizeCallBAPIReturnedObjectServer: function (bapiResult, bapiName)
		{
		},

		/**
		 * @description This user exit allow you to prevent the standard ComputeTotalValue function and to implement your own logic.
		 * In addition to the user exit, you may need to modify the warning label of the line item total in the CustomLg, as its translation explains that the total is wrong because the quantity x unit price do not match the total. But if the total computation was customized, this explanation may be wrong. The translation key is "Total does not match unit price and quantity values".
		 * @param {Item} item - item of the line updated
		 * @returns {number} Computed total to return
		 * @example Use a custom packaging factor to compute the line total correctly, and do not use standard conversion quantity feature
		 * <pre><code>ComputeTotalValue: function (item)
		 * {
		 * 	let quantity = item.GetValue("Quantity__");
		 * 	let unitPrice = item.GetValue("Unit_Price__");
		 * 	let total = item.GetValue("Total__");
		 * 	let packagingQuantity = item.GetValue("Z_PackagingQuantity__");
		 *
		 * 	if (!total && unitPrice && quantity && packagingQuantity)
		 * 	{
		 * 		total = (quantity / packagingQuantity) * unitPrice;
		 * 		item.SetValue("Total__", total);
		 * 	}
		 *
		 * 	return total;
		 * }</code></pre>
		 */
		ComputeTotalValue: function (item)
		{
		},

		/**
		* @description This function is called each time the function LineItemCheckUnitPrice is called.
		* If needed, use it to bypass this check, override it or complete it.
		* Allows you to customize the line items Unit price, Quantity and Total fields value check. This user exit is called from the Validation script of the Customer Order Processing process, each time the line items Unit price, Quantity and Total fields values are checked.
		*
		* @returns To completely disable the standard line items Unit price, Quantity and Total fields value check, return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution(). Otherwise, the standard check is also performed after the execution of this user exit.
		*
		* @example
		* 	<pre><code>function LineItemCheckUnitPrice(item)
		* 	{
		*		var quantity = item.GetValue("Z_Quantity__");
		*		var unitPrice = item.GetValue("Z_UnitPrice__");
		*		var total = item.GetValue("Z_Total__");
		*		if (quantity * unitPrice !== total)
		*		{
		*			item.SetWarning("Z_Total__", "Total does not match unit price and quantity values");
		*		}
		*		return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution();
		* 	}</code></pre>
		*/
		LineItemCheckUnitPrice: function (item)
		{
		},

		//#region Portal customization

		/**
		 * @description This user exit allows us to keep header fields values between COP and COPo using mapping.
		 * Fields with matching names, same name for COP field and COPo field, are automatically mapped. There's no need to add them to the return object.
		 *
		 * @returns { object } - Object using COP field name for key and COPo field name for value { "COP_Field_1": "COPo_Field_1", "COP_Field_2": "COPo_Field_2" }.
		 *
		 * @example Mapping between the COP field Z_User__ and portal field Z_User_portal__.
		 * <pre><code>GetPortalHeaderExtraFieldsMapping: function ()
		 * {
		 *	return {
		 *		"Z_User__": "Z_User_portal__"
		 *	};
		 * }</code></pre>
		 */
		GetPortalHeaderExtraFieldsMapping: function ()
		{
		},

		/**
		 * @description This user exit allows us to keep table fields values between COP and COPo using mapping.
		 * @returns { object } - Object using COP column name for key and COPo column name for value { "COP_Column_1": "COPo_Column_1", "COP_Column_2": "COPo_Column_2" }.
		 *
		 * @example Mapping between COP column Z_Collective_number__ and portal items column Z_Collective_number_portal__.
		 * <pre><code>GetPortalItemsExtraFieldsMapping: function ()
		 * {
		 *	return {
		 *		"Z_Collective_number__": "Z_Collective_number_portal__"
		 *	};
		 * }</code></pre>
		 */
		GetPortalItemsExtraFieldsMapping: function ()
		{
		},

		/**
		 * @description This user exit allows us to disable email notification during portal order updates.
		 * @param { string } status - New status of portal order (OrderAccepted, OrderCancelled).
		 * @returns { boolean } - If return true, then no notification will be sent. Default is false.
		 *
		 * @example Disable notification only for accepted orders.
		 * <pre><code>IsPortalNotificationDisabled: function (status)
		 * {
		 *	if(status === "OrderAccepted")
		 *	{
		 *		return true;
		 *	}
		 *	return false;
		 * }</code></pre>
		 */
		IsPortalNotificationDisabled: function (status)
		{
		},
		/**
		* @description Allows customization of the duplicate check warning popUp by defining columns to show in the table.
		* If this userExit is not used or returns falsy, the system uses as default columns [OrderNumber, OrderDate, CustomerNumber, Total]
		* @returns {Array<PopUpColumnProperties>} params
		* @example
		* In this example we add Shipto number and status, omit Total and order date, also we transform the displayed value for status column
		* <pre><code>
		* CustomizeDuplicateCheckWarningPopupTable: function ()
		* {
		*	return [
		*		{
		*			internalIdentifier: 'OrderNumber',
		*			formId: 'Sales_Order_Number__',
		*			label: 'PO number',
		*			width: 150,
		*			type: 'text',
		*			align: 'Center'
		*		},
		*		{
		*			internalIdentifier: 'CustomerNumber',
		*			formId: 'CustomerNumber__',
		*			label: 'Customer Number',
		*			width: 80,
		*			type: 'text'
		*		},
		*		{
		*			internalIdentifier: 'ShipToNumber',
		*			formId: "ShipToNumber__",
		*			label: 'Shipping Address Number',
		*			width: 150,
		*			type: 'text'
		*		},
		*		{
		*			internalIdentifier: 'Status',
		*			formId: "Status",
		*			label: 'Status',
		*			width: 150,
		*			type: 'text',
		*			transformation: function (value) {
		*				return "Status: " + value;
		*			}
		*		}
		*	];
		* }
		* </code></pre>
		*/
		CustomizeDuplicateCheckWarningPopupTable: function ()
		{
		},
		/**
		 * @description This user exit allows us to edit a tableItem
		 * @param oItem
		 * @param {any} originalOrderItem
		 *
		 * @example Edit the oItem data if needed.
		 * <pre><code>CustomizeChangeOrderRemainingItemBeforeInsertion: function (oItem, originalOrderItem)
		 * {
		 *		oItem.SetValue("LineNumber__", Sys.Helpers.String.SAP.TrimLeadingZeroFromID(originalOrderItem.ITM_NUMBER));
		 * }</code></pre>
		 */
		CustomizeChangeOrderRemainingItemBeforeInsertion: function (oItem, originalOrderItem)
		{

		},
		/**
		 * @description This user exit allows us customize the ChangeOrder items simple Match condition return
		 * @param orderItem
		 * @param tableItem
		 * @returns boolean
		 * @example
		 * <pre><code>GetChangeOrderSimpleMatchCondition: function (orderItem, tableItem)
		 * {
		 *   return false;
		 * }</code></pre>
		 */
		GetChangeOrderSimpleMatchCondition: function (orderItem, tableItem)
		{

		},
		/**
		 * @description This user exit allows us customize the ChangeOrder items Full Match condition return
		 * @param orderItem
		 * @param tableItem
		 * @returns boolean
		 * @example
		 * <pre><code>GetChangeOrderFullMatchCondition: function (orderItem, tableItem)
		 * {
		 *   return false;
		 * }</code></pre>
		 */
		GetChangeOrderFullMatchCondition: function (orderItem, tableItem)
		{

		},
		/**
		 * @description This user exit is used to allow order posting/simulation using data in an Esker table other than Product_List__ for SAP integrations.
		 * It is to be used on the assumption that all fields needed for standard posting/simulating are replicated in the alternate table.
		 * @param {Boolean} isServer Boolean signaling whether this function is being called server side or client side
		 * @return {String} String value containing table to be used for order simulation/posting
		 * @example Use alternative table, only when posting and if secondary table is being used
		 * <pre><code>
		 * GetLineItemsTableName: function (isServer)
		 * {
		 *	   if (isServer && Data.GetValue("Z_SecondaryTableInUse__"))
		 *	   {
		 *		   return "Z_PostSimulationTable__";
		 *	   }
		 * 	   return "Product_List__";
		 * }
		 * </code></pre>
		 */
		GetLineItemsTableName: function (isServer)
		{
			return "Product_List__";
		},

		/**
		 * @description This user exit allows us to disable the validation of the SAP unit of measure.
		 * @returns {Boolean} true/false depending if the UoM validation is active or not.
		 */
		DisableUoMValidation: function ()
		{
			return false;
		},
		/**
		 * @description This user exit gives the list of custom fields to get from SO - Global settings__ table.
		 * @returns {string[]} - list of custom columns to get from SO - Global settings__ table.
		 * <pre><code>
		 * GetCustomGlobalSettingsColumns: function ()
		 * {
		 * 	return ["Z_CustomGlobalConfigField1__", "Z_CustomGlobalConfigField2__"];
		 * }
		 * </code></pre>
		 */
		GetCustomGlobalSettingsColumns: function ()
		{
			return [];
		},

		/**
		 * @description This function allows users to override the default configuration settings for ERP material mapping priority.
		 * By calling this function, you can specify whether the ERP material mapping should take precedence over other mappings,
		 * such as those in the 'OM - Corrected material mapping' table.
		 * @param {boolean} defaultValue ERP mapping has priority, default value coming from the OM configuration (Sys.OM.Helpers.GetConfiguration().ERPMaterialMappingHasPriority)
		 * @returns {boolean} ERP mapping has priority. If not specified, the default value from the OM configuration will be used.
		 *
		 * @example
		 * The following user exit will force the ERP mapping to have priority over other mappings, based on the current customer.
		 * <pre><code>function ERPMappingHasPriority(defaultValue)
		 * {
		 *    // Get the current customer number
		 *    const customerNumber = Data.GetValue("CustomerNumber__");
		 *
		 *    // Logic to retrieve the ERP mapping priority based on the customer number, based on a custom table (not implemented in this example)
		 * 	  const customERPMappingPriority = GetCustomERPMappingPriority(customerNumber);
		 *
		 *    if (typeof customERPMappingPriority === "boolean")
		 *    {
		 *        // Return the custom ERP mapping priority
		 *        return customERPMappingPriority;
		 *    }
		 *    return defaultValue;
		 * }</code></pre>
		 */
		ERPMappingHasPriority: function (defaultValue)
		{
		},
		/**
		 * @description This function overrides the default formatting that removes the leading zeroes.
		 * @param {string} materialID - The material ID to be formatted.
		 * @returns {string} The formatted material ID.
		 *
		 * @example
		 * This example returns the initial materialID without formatting
		 * <pre><code>
		 * FormatMaterialIDForQuery: function (materialID)
		 * {
		 *    return materialID;
		 * }
		 * </code></pre>
		 */
		FormatMaterialIDForQuery: function (materialID)
		{
		},

		/**
		 * @description Configures the Full-Text Search (FTS) enhanced by ChatGPT research for the material browse of the COP.
		 * Query expansion can be activated to allow ChatGPT to enhance the query by normalizing keywords and improving the FTS results.
		 * Examples of word normalization and business context can be provided to help ChatGPT understand the domain better.
		 * @returns {Object} The FTS configuration object
		 *
		 * @example
		 * This example shows how to configure the FTS enhanced by ChatGPT research.
		 * <pre><code>
		 * GetGptEnhancedMaterialSearchConfiguration: function ()
		 * {
		 *    return {
		 *      enhanceQuestionWithChatGPT: true,
		 *      enhanceQuestionExamples: "Separate dimensions if any (for instance '1x2x3m' would become '1 x 2 x 3m'). Normalize unit of measures (for instance '2mm2' would become '2mm²'). Use short unit of measures, for instance '1 meter' would become '1m'.",
		 *      businessContext: "Your company provides electrical equipment and services to professionals engaged in the construction, renovation and maintenance of buildings and infrastructures."
		 *   };
		 * }
		 * </code></pre>
		 */
		GetGptEnhancedMaterialSearchConfiguration: function ()
		{
		},

		/**
		 * @description This user exit allows us to customize the filter for the catalog in order to only show items depending on sales area value.
		 * @param {Object} userSalesArea - The user's sales area information. In this object you have salesOrg, distChan and businessArea of the user. You also have function IsValid() to check if the user has a sales area.
		 * @returns {Sys.Helpers.LdapUtil.IFilter} The LDAP filter to apply to the catalog items.
		 *
		 * @example
		 * This example demonstrates how to filter items to display those that either share the same sales area as the customer or have no sales area assigned.
		 * ITEMNUMBER__ is the accessor used to filter attributes in the catalog price table.
		 * <pre><code>
		 * GetCatalogSalesAreaFilter: function (userSalesArea)
		 * {
		 * 		const allFilters = [];
		 * 		const emptySalesAreaFilter = [];
		 *		emptySalesAreaFilter.push(Sys.Helpers.LdapUtil.FilterEqualOrEmpty("Sales_organization__"));
		 *		emptySalesAreaFilter.push(Sys.Helpers.LdapUtil.FilterEqualOrEmpty("Distribution_channel__"));
		 *		emptySalesAreaFilter.push(Sys.Helpers.LdapUtil.FilterEqualOrEmpty("Business_area__"));
		 *
		 *		if (Sys.OM.Helpers.GetConfiguration().EnableCatalogPrices === "1")
		 *		{
		 *			emptySalesAreaFilter.push(Sys.Helpers.LdapUtil.FilterEqualOrEmpty("ITEMNUMBER__.Sales_organization__"));
		 *			emptySalesAreaFilter.push(Sys.Helpers.LdapUtil.FilterEqualOrEmpty("ITEMNUMBER__.Distribution_channel__"));
		 *			emptySalesAreaFilter.push(Sys.Helpers.LdapUtil.FilterEqualOrEmpty("ITEMNUMBER__.Business_area__"));
		 *		}
		 *		allFilters.push(Sys.Helpers.LdapUtil.FilterAnd(...emptySalesAreaFilter));
		 *		if (userSalesArea.IsValid())
		 *		{
		 *			const salesAreaFilter = [];
		 *			salesAreaFilter.push(Sys.Helpers.LdapUtil.FilterEqual("Sales_organization__", userSalesArea.salesOrg));
		 *			salesAreaFilter.push(Sys.Helpers.LdapUtil.FilterEqual("Distribution_channel__", userSalesArea.distChan));
		 *			salesAreaFilter.push(Sys.Helpers.LdapUtil.FilterEqual("Business_area__", userSalesArea.businessArea));
		 *
		 *			if (Sys.OM.Helpers.GetConfiguration().EnableCatalogPrices === "1")
		 *			{
		 *				salesAreaFilter.push(Sys.Helpers.LdapUtil.FilterEqual("ITEMNUMBER__.Sales_organization__", userSalesArea.salesOrg));
		 *				salesAreaFilter.push(Sys.Helpers.LdapUtil.FilterEqual("ITEMNUMBER__.Distribution_channel__", userSalesArea.distChan));
		 *				salesAreaFilter.push(Sys.Helpers.LdapUtil.FilterEqual("ITEMNUMBER__.Business_area__", userSalesArea.businessArea));
		 *			}
		 *			allFilters.push(Sys.Helpers.LdapUtil.FilterAnd(...salesAreaFilter));
		 *		}
		 * 		return Sys.Helpers.LdapUtil.FilterOr(...allFilters);
		 * }
		 * </code></pre>
		 */
		GetCatalogSalesAreaFilter: function (userSalesArea)
		{
		},

		/**
		 * @description
		 * This function will be called to override sort order when querying items from the catalog in the portal cart.
		 * @returns {string} The new sort order (field name and optional "ASC" or "DESC" order), or null to use the default sort order.
		 *
		 * @example <caption>The following user exit uses the description field to sort in descending order</caption>
		 * function GetCatalogCustomSortField()
		 * {
		 *      return "DESCRIPTION__ DESC";
		 * }
		 **/
		GetCatalogCustomSortField: function ()
		{
		},

		/**
		 * @description This function is called to disable the setting of the drop ship address when EnableAutolearnOnShiptoAddress is enabled.
		 * By default, the application determines the elements of the drop ship address (such as street, postal code, etc.) from the extracted shipping address of the order.
		 * This user exit allows you to disable this logic to use a customized logic instead.
		 * If not implemented, the default return value is false.
		 * @returns {boolean} True if the drop ship address should not be set with the postal address, false otherwise.
		 */
		DisableDropShipAddressFromExtractedShipToAddress: function ()
		{
		},
		/**
		 * @description This function should return a boolean, true if the drop ship address should not be replaced with the postal address.
		 * @param {string} field - One of the drop ship address field name,.
		 * @returns {boolean} True if the drop ship address should not be replaced with the postal address, false otherwise.
		 *
		 */
		DoNotReplaceDropShipAddressWithPostalAddress: function (field)
		{
		},
		/**
		 * @description This function is called to customize the SAP partners table before being displayed.
		 * @param {Partner[]} partnersTable - The table with all the partners.
		 * @returns {Partner[]} the modified table.
		 *
		 */
		OnPartnersRetrieved: function (partnersTable)
		{
		},

		/**
		 * @description This user exit allows us to customize the default currency list for SAP Pricing conditions.
		 * 
		 * @example
		 * This example shows how to add a new currency to the default currency list.
		 * <pre><code>
		 * CustomizeCurrencyList: function (defaultCurrencies)
		 * {
		 *    defaultCurrencies.INR = "INR=INR";
		 *    return defaultCurrencies;
		 * }
		 * </code></pre>
		 */
		CustomizeCurrencyList: function (currencyList)
		{
		},

		/**
		 * @description This function is called to customize the ownerId used to retrieve the ERP user used in the 'Created By' field of SAP Orders.
		 * @param
		 * @returns {string} owner id to use.
		 *
		 */
		CustomizeCreatedBy: function ()
		{
		},
		/**
		 * @param {string} service - name of the service being retried
		 * @returns {number} - the maximum number of tries for the service (1: one try no retries) or undefined to use the default value
		 * @example
		 * getGptRetriesNumber: function (service)
		 *{
			const services = {
				Extract: 3
			};
			return services[service];
		 *}
		 */
		getGptRetriesNumber: function (service)
		{ },
		/**
		 * @param {object} notifVars - vars containing notification types as keys and their properties as values
		 * @example
		 * CustomizeNotificationHandler: function (notifVars)
		 *{
		 *
			// Update the OrderAccepted notification template and subject
			notifVars["OrderAccepted"] = {
				template: "Notify_Customer_Order_Confirmed_CUSTOM_TEMPLATE.htm",
				subject: "Confirmation of order number {0}",
				allowNotifField: "Send_confirmation_notification__"
			};

			// Create a new notification type for OrderDelayed
			// This notification will use a custom template and subject
			notifVars["OrderDelayed"] = {
				template: "Notify_Customer_Order_Delayed.htm",
				subject: "Delay notification for order number {0}",
				allowNotifField: "Send_delay_notification__"
			};
		}
		*/
		CustomizeNotificationHandler: function (notifVars)
		{
		},
		//#endregion

		/**
		 * @method Lib.SOP.Customization.Common.CustomizeFindSAPOrderNumberQuery
		 * @since 340
		 * @description This function allows customization of the SAP query used to find order numbers in the GetOrderStatus function.
		 * By default, the system searches for orders in the VBAK table using BSTNK (Purchase Order Number),
		 * VBELN (Sales Order Number), and IHREZ (Web Order Number) fields.
		 * The queryParams object is passed by reference and can be modified directly.
		 *
		 * @param {Object} queryParams - Object containing the query parameters that can be modified
		 * @param {string} queryParams.table - The table name to query (default: "VBAK")
		 * @param {string} queryParams.fields - The fields to retrieve, separated by "|" (default: "VBELN|BSTNK|IHREZ")
		 * @param {string} queryParams.filter - The filter string for the query
		 * @param {Object} queryContext - Context information about the order search
		 * @param {string} queryContext.orderIdentifier - The order identifier being searched (not processed by SAP.NormalizeID)
		 * @param {string} queryContext.soldToNumber - The sold-to customer number (may be null/undefined if not provided)
		 * @returns {void} No return value - modify the queryParams object directly
		 *
		 * @example <caption>Add custom field Z_CUST_ORDER_NUM to the search criteria using context</caption>
		 * CustomizeFindSAPOrderNumberQuery: function (queryParams, queryContext)
		 * {
		 * 	// Add custom field to the fields list
		 * 	queryParams.fields += "|Z_CUST_ORDER_NUM";
		 *
		 * 	queryParams.filter = "Z_CUST_ORDER_NUM = '" + queryContext.orderIdentifier + "'";
		 * 	// If soldToNumber is provided, add custom validation
		 * 	if (queryContext.soldToNumber)
		 * 	{
		 * 		// Add additional custom field check for sold-to customer
		 * 		queryParams.filter += " AND Z_CUSTOM_CUSTOMER_FIELD = '" + queryContext.soldToNumber + "'";
		 * 	}
		 * }
		 */
		CustomizeFindSAPOrderNumberQuery: function (queryParams, queryContext)
		{
		},

		/**
		 * @method Lib.SOP.Customization.Common.DisableOracleDataChecks
		 * @since 339
		 * @description This function will be implemented to disable specific Oracle data checks.
		 * This function is called only in Oracle ERP mode, on client and server sides.
		 * @param {string} checkName The name of the check to disable. Possible values are:
		 * CheckCustomerAndPartnerOrgID
		 * CheckMaterialsWarehouseID
		 * CheckMandatorySalesOrderDate
		 * CheckWarehouseOrgID
		 * CheckOrderTypeOrgID
		 * CheckLineItemWarehouse
		 * CheckPrice (server side only)
		 * @returns {boolean} True to disable the specified check, false to keep it enabled.
		 * @example <caption>The following user exit disables the CheckMaterialsWarehouseID and CheckLineItemWarehouse checks.</caption>
		 * DisableOracleDataChecks: function (checkName)
		 * {
		 * 	if (checkName === "CheckMaterialsWarehouseID" || checkName === "CheckLineItemWarehouse")
		 * 	{
		 * 		return true;
		 * 	}
		 * 	return false;
		 * }
		 */
		DisableOracleDataChecks: function (checkName)
		{
		}
	};
	return customization;
})();
