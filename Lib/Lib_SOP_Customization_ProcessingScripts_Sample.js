/**
 * SOP Package processing scripts customization callbacks
 * @namespace Lib.SOP.Customization.ProcessingScripts
 */

/* LIB_DEFINITION{
  "name": "Lib_SOP_Customization_ProcessingScripts_Sample",
  "scriptType": "SERVER",
  "comment": "Custom library extending Customer Order Processing processing scripts on server side",
  "versionable": false,
  "libraryType": "Lib",
  "require": []
}*/

var Lib = Lib || {};
Lib.SOP = Lib.SOP || {};
Lib.SOP.Customization = Lib.SOP.Customization || {};

Lib.SOP.Customization.ProcessingScripts = (function ()
{
	/**
	 * @lends Lib.SOP.Customization.ProcessingScripts
	 */
	var customization = {
		/**
		* @description This function will be called before posting to SAP.
		* If needed, use it to customize the SAP sales order parameters.
		*
		* @param {SalesOrderParameters} salesOrderParameters - This object contains the SAP sales order parameters: { ORDER_HEADER_IN: {}, ORDER_ITEMS_IN: [], ORDER_PARTNERS: [] }
		* In case of communication with SAP through a webservice, salesOrderParameters will be constructed with the same tree that is used in the call : { EXPORTS: { ORDER_HEADER_IN: {}, ...}, TABLES : { ORDER_ITEMS_IN: [], ORDER_PARTNERS: [], ...} }
		*
		* @param {function} GetFormLineItem - This function may be called to retrieve a line item of the product list of the form.
		*   It returns an Item object.
		*   It takes as argument the index in the bapiParams.ORDER_ITEMS_IN array.
		*   Caution: in case of SAP splitting (see "Line item grouping criteria" of Configurator), the index in the bapiParams.ORDER_ITEMS_IN array does not correspond to the line item index in the form.
		*   In case of communication with SAP through a webservice, this method does and returns nothing.
		*
		* @returns To disable the execution of the standard code: return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution()
		*
		* @example <caption>Change PO Method in the post</caption>
		* <pre><code>OnSAPPostBegin: function (salesOrderParameters, GetFormLineItem)
		* {
		*	// This test allows you to have an upgradable customization where you can switch between a "SAPProxy mode" and a "Web service mode"
		*	var bapiParams = Sys.OM.SAP.Helpers.UsesWebServices() ? salesOrderParameters : JSON.parse(salesOrderParameters.bapi.GetJsonParameters(false));
		*	bapiParams.EXPORTS.ORDER_HEADER_IN.PO_METHOD = "OCR";
		*	if(!Sys.OM.SAP.Helpers.UsesWebServices())
		*	{
		*		salesOrderParameters.bapi.SetJsonParameters(JSON.stringify(bapiParams));
		*	}
		*
		* }</code></pre>
		* @example <caption>Change the Tax value with the value of the custom column Z_TAX before posting</caption>
		* <pre><code>OnSAPPostBegin: function (salesOrderParameters, GetFormLineItem)
		* {
		*	var bapiParams = Sys.OM.SAP.Helpers.UsesWebServices() ? salesOrderParameters : JSON.parse(salesOrderParameters.bapi.GetJsonParameters(false));
		*
		* 	// Z_TAX__ is a custom column
		* 	// The "Z_TAX__" value is copied for each line into the "TAX" of the BAPI Post line parameter
		* 	var items = bapiParams.TABLES.ORDER_ITEMS_IN;
		* 	for (var bapiItemIndex = 0; bapiItemIndex < items.length; bapiItemIndex++)
		* 	{
		* 		var tax = GetFormLineItem(bapiItemIndex).GetValue("Z_TAX__");
		*		if(tax)
		*		{
		* 			items[bapiItemIndex]["TAX"] = tax;
		*		}
		*	}
		*	if(!Sys.OM.SAP.Helpers.UsesWebServices())
		*	{
		*		salesOrderParameters.bapi.SetJsonParameters(JSON.stringify(bapiParams));
		*	}
		* }</code></pre>
		* @example <caption>In case of a split, change a header value for each separate post to SAP.</caption>
		* <pre><code>OnSAPPostBegin: function (salesOrderParameters, GetFormLineItem)
		* {
		* 	// Z_DISTRIB_CHANNEL__ is a custom column that is also set in the "Line item grouping criteria" of Configurator
		* 	// for each split order, the "Z_DISTRIB_CHANNEL__" value is copied at the header level into the "DISTR_CHAN" of the BAPI Simulation parameter
		* 	var distrChannel = GetFormLineItem(0).GetValue("Z_DISTRIB_CHANNEL__");
		* 	salesOrderParameters.ORDER_HEADER_IN.SetValue("DISTR_CHAN", distrChannel);
		* }</code></pre>
		*
		* @example <caption>Change PO method in the post, while using a webservice to post to SAP</caption>
		* <pre><code>OnSAPPostBegin: function (salesOrderParameters, GetFormLineItem)
		* {
		* 	salesOrderParameters.EXPORTS.ORDER_HEADER_IN.PO_METHOD = "OCR";
		* }</code></pre>
		*
		* @example <caption>This user exit updates the BAPI parameters based on the content of the form.</caption>
		* <pre><code>OnSAPPostBegin: function (salesOrderParameters, GetFormLineItem)
		* {
		*    // This test allows you to have an upgradable customization where you can switch between a "SAPProxy mode" and a "Web service mode".
		*    var bapiParams = Sys.OM.SAP.Helpers.UsesWebServices() ? salesOrderParameters : JSON.parse(salesOrderParameters.bapi.GetJsonParameters(false));
		*
		*    // Header-level fields.
		*    var header = bapiParams.EXPORTS.ORDER_HEADER_IN;
		*    header.PO_METHOD = "OCR";
		*
		*    var salesArea = Data.GetValue("Sales_Area__").split("/");
		*    header.SALES_ORG = salesArea[0];
		*    header.DISTR_CHAN = salesArea[1];
		*    header.DIVISION = salesArea[2];
		*
		*    // Line items.
		*    var lineItems = bapiParams.TABLES.ORDER_ITEMS_IN;
		*
		*    for (var i = 0; i < lineItems.length; i++)
		*    {
		*        var item = lineItems[i];
		*        item["PURCH_NO_C"] = Data.GetValue("Sales_Order_Number__");
		*        item["PURCH_DATE"] = Lib.SOP.SAP.Helpers.FormatToSAPDateTimeFormatUTC(Data.GetValue("Sales_Order_Date__"));
		*    }
		*
		*    // Adds item payment terms.
		*    for (var i = 0; i < lineItems.length; i++)
		*    {
		*        var item = lineItems[i];
		*        var conditions = bapiParams.TABLES.ORDER_CONDITIONS_IN;
		*        conditions.push(
		*        {
		*            "ITM_NUMBER": item["ITM_NUMBER"]
		*        });
		*        conditions.push(
		*        {
		*            "CURRENCY": Data.GetValue("Currency__")
		*        });
		*        conditions.push(
		*        {
		*            "COND_VALUE": parseFloat(item["TOTAL"]) / parseInt(item["REQ_QTY"], 10)
		*        });
		*    }
		*
		*    // Sets the INPUT_METHOD field at the root level of the exported JSON.
		*    bapiParams.EXPORTS.INPUT_METHOD = "N";
		*
		*    if (!Sys.OM.SAP.Helpers.UsesWebServices())
		*    {
		*        salesOrderParameters.bapi.SetJsonParameters(JSON.stringify(bapiParams));
		*    }
		* }</code></pre>
		*  @example <caption>Web Services ONLY: order split based on header fields</caption>
		*  With the version 1.0.0.2 of the BAPI Z_BAPI_SALESORDER_POSTCOMMIT2, a new structure is available for the post. This new structure allows to split
		*  the order based on header fields (which need to be copied at the line level into technical split fields like for example, Z_SPLIT_PURCH_NO_C__ and Z_SPLIT_ORD_REASON__).
		*  This way, the header split data (Z_SPLIT_PURCH_NO_C__ and Z_SPLIT_ORD_REASON__) is copied into the header of each split order. The common header data is also copied for each split order.
		*  This is available for versions > 194, if your version is prior to this, you need to reimplement this code a the end of the function
		*  BapiParamsToJsonForWS in Lib_SOP_SAP_POST :
		*  <pre><code>
		*   if (bapiParams.TABLES.ESK_SPLIT_HEADER_INFO)
		*   {
		*   	json.TABLES.ESK_SPLIT_HEADER_INFO = bapiParams.TABLES.ESK_SPLIT_HEADER_INFO;
		*   }
		*   </code></pre>
		*  if the value is empty, the corresponding value in the order header is set if present.
		*  Note : Even if the split is made with header criterion, the columns used for it should be set in the corresponding field in the configurator.
		*  <pre><code>
		*  OnSAPPostBegin: function (salesOrderParameters, GetFormLineItem)
		*  {
		*	var splitInfo = salesOrderParameters.TABLES.ESK_SPLIT_INFO ;
		*	var productList = Data.GetTable("Product_List__");
		*	//If spliting info provided
		*	if (splitInfo.length > 0)
		*	{
		*		//Header spliting info structure
		*		var headerSplitInfo  = {};
		*		for(var i in splitInfo)
		*		{
		*			if (!headerSplitInfo.hasOwnProperty(splitInfo[i].ORDER_INDEX))
		*			{
		*				headerSplitInfo[splitInfo[i].ORDER_INDEX] = [];
		*				var row = productList.GetItem(splitInfo[i].LINEITEM_INDEX) ;
		*				//Here we set the puchase number based on the field Z_SPLIT_PURCH_NO_C__ and the order reason with the field Z_SPLIT_ORD_REASON__
		*				headerSplitInfo[splitInfo[i].ORDER_INDEX].push({headerKey: "PURCH_NO_C", headerValue: row.GetValue("Z_SPLIT_PURCH_NO_C__")});
		*				headerSplitInfo[splitInfo[i].ORDER_INDEX].push({headerKey: "ORD_REASON", headerValue: row.GetValue("Z_SPLIT_ORD_REASON__")});
		*			}
		*		}
		*		// Copy the header split data into the ESK_SPLIT_HEADER_INFO table that is sent to the SAP BAPI that will generate a new header for each newly split order
		*		salesOrderParameters.TABLES.ESK_SPLIT_HEADER_INFO = [];
		*		for(var orderIndex in headerSplitInfo)
		*		{
		*			for(var headerIndex in headerSplitInfo[orderIndex])
		*			{
		*				salesOrderParameters.TABLES.ESK_SPLIT_HEADER_INFO.push({
		*					"ORDER_INDEX" : orderIndex,
		*					"HEADER_KEY": headerSplitInfo[orderIndex][headerIndex].headerKey,
		*					"HEADER_VALUE": headerSplitInfo[orderIndex][headerIndex].headerValue
		*				});
		*			}
		*		}
		*	}
		*}
		*  </code></pre>
		*/
		OnSAPPostBegin: function (salesOrderParameters, GetFormLineItem)
		{
		},

		/**
		* @description This function will be called after posting to SAP.
		* If needed, use it to handle the posting result.
		*
		* @param {SalesOrderParameters} salesOrderParameters - This object contains the SAP sales order parameters: { ORDER_HEADER_IN: {}, ORDER_ITEMS_IN: [], ORDER_PARTNERS: [] }
		*
		* @returns No return value expected
		*
		* @example <caption> Send the result of the SAP posting by email</caption>
		* <pre><code>OnSAPPostEnd: function (salesOrderParameters)
		* {
		* 	// send the result of the SAP posting by email
		*	var bapiParams = );
		* 	var out = Sys.OM.SAP.Helpers.UsesWebServices() ? JSON.stringify(salesOrderParameters) : salesOrderParameters.bapi.GetJsonParameters(false);
		* 	var email = Process.CreateTransport("mail", false);
		* 	var vars = email.GetUninheritedVars();
		* 	vars.AddValue_String("Subject", "POST DUMP PARAMS:" + salesOrderParameters.SALESDOCUMENT, true);
		* 	vars.AddValue_String("EmailAddress", "admin@our_company.com", true);
		* 	vars.AddValue_String("Message", out, true);
		* 	email.Process();
		* }</code></pre>

		* @example <caption>Send the result of the SAP posting by email, using a webservice</caption>
		* <pre><code>OnSAPPostEnd: function (salesOrderParameters)
		* {
		* 	var out = JSON.stringify(salesOrderParameters);
		* 	var email = Process.CreateTransport("mail", false);
		* 	var vars = email.GetUninheritedVars();
		* 	vars.AddValue_String("Subject", "POST DUMP PARAMS:" + salesOrderParameters.IMPORTS.SALESDOCUMENT, true);
		* 	vars.AddValue_String("EmailAddress", "admin@our_company.com", true);
		* 	vars.AddValue_String("Message", out, true);
		* 	email.Process();
		* }</code></pre>
		*/
		OnSAPPostEnd: function (salesOrderParameters)
		{
		},
		/**
		* @description This function will be called before adding a partner in the object ORDER_PARTNERS of the post bapi parameters
		* If needed, use it to change or discard some partners.
		*
		* @param {Object} partnerAttributes - Object that will be pushed in the new partner. Structure does not change whether or not using a webservice.
		* @returns The partner attributes to push in the bapi
		*
		* @example
		* <pre><code>OnSAPPostPartnerAdd: function (partnerAttributes)
		* {
		* 	if(partnerAttributes["PARTN_ROLE"] === "WE" || partnerAttributes["PARTN_ROLE"] === "AG")
		* 	{
		* 		partnerAttributes = {};
		* 	}
		* 	return partnerAttributes ;
		* }</code></pre>
		*/
		OnSAPPostPartnerAdd: function (partnerAttributes)
		{
		},
		/**
		* @description This function will be called before adding a pricing condition in the object ORDER_CONDITION_IN of the post bapi parameters
		* If needed, use it to change or discard pricing conditions.
		*
		* @param {Object} pricingCondition - Object that will be pushed in the new ORDER_CONDITION_IN. Structure does not change whether or not using a webservice.
		* @returns The pricing condition objet is expected
		*
		* @example
		* <pre><code>OnSAPPostPricingConditionAdd: function (pricingCondition)
		* {
		* 	if(pricingCondition["ITM_NUMBER"] === "0" && pricingCondtion["COND_TYPE"] === "EDI1")
		* 	{
		* 		pricingCondition["COND_TYPE"] = "PR00";
		* 	}
		* }</code></pre>
		*/
		OnSAPPostPricingConditionAdd: function (pricingCondition)
		{
		},
		/**
		 * @description This function will be called after creating the header payload before posting to SAPS4Cloud.
		 * Use this user exit to adjust the header data of the payload to be sent before posting.
		 * @param {Object} data data object containing the payload to be sent to SAP S4.
		 */
		OnSAPS4CloudAddHeader: function (data)
		{
		},
		/**
		 * This custom user exit allows you to modify the line items to be added to the payload (during the loop through all lines).
		 * @param {Object} itemToPost JSON item, which will be added to the data.to_Item.results of the payload.
		 * @param {Data.Item} formItem current form item retrieved from the Table.GetItem() function at current index.
		 * @param {Integer} itemIdx current index.
		 */
		OnSAPS4CloudAddItem: function (itemToPost, formItem, itemIdx)
		{
		},
		/**
		 * @description This function will be called before posting to SAPS4Cloud.
		 * If needed, use it to adjust the payload to be sent before posting.
		 * @param {Object} data data object containing the payload to be sent to SAP S4.
		 */
		OnSAPS4BuildPostParametersEnd: function (data)
		{
		},
		/**
		 * This custom user exit allows you to modify the web service parameters used to send the payload to SAP.
		 * @param {Object} param web service parameters used for the call to SAP.
		 */
		OnSAPS4BuildWSParameters: function (param)
		{
		},
		/**
		 * This custom user exit allows you to define/overwrite/update the sales order number retrieved by SAP.
		 * @param {Object} resdata response payload on order creation.
		 * @returns {String} SalesOrderNumber return the sales order number.
		 */
		OnRetrieveSalesOrderNumber: function (resdata)
		{
		},
		/**
		 * This function will be called before running SAP Post and also allows you to disable standard run execution.
		 *
		 * @returns To disable the execution of the standard code: return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution()
		 *
		 * @example Disable the execution of the standard code
		 * <pre><code>OnSAPPostRunBegin: function ()
		 * {
		 *     return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution();
		 * };
		 * </code></pre>
		 */
		OnSAPPostRunBegin: function ()
		{
		}
	};
	return customization;
})();