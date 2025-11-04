/**
 * SOP Package extraction script customization callbacks
 * @namespace Lib.SOP.Customization.Extraction
 */

/* LIB_DEFINITION{
  "name": "Lib_SOP_Customization_Extraction_Sample",
  "scriptType": "SERVER",
  "comment": "Custom library extending Customer Order Processing extraction script on server side",
  "versionable": false,
  "libraryType": "Lib",
  "require": []
}*/

var Lib = Lib || {};
Lib.SOP = Lib.SOP || {};
Lib.SOP.Customization = Lib.SOP.Customization || {};

Lib.SOP.Customization.Extraction = (function ()
{
	/**
	 * @lends Lib.SOP.Customization.Extraction
	 */
	var customization =
	{
		/**
		* @description Allows you to exclude an address from the list of addresses used for the first-time recognition mechanism.
		* This user exit is called each time an address block is extracted in the Customer Order Processing process.
		* - If you implement this user exit, the Address exclusions defined at the Data Capture step of the configuration tool do not apply.
		*
		* @param {string} addressString - This string contains the exact words of the address.
		* @param {Area} addressArea - The area in the document from where the address has been extracted (see documentation for more details).
		*
		* @returns Boolean value specifying the address exclusion:
		* - true: This address is excluded. The first-time recognition mechanism ignores this address.
		* - false: This address is not excluded. The first-time recognition mechanism uses this address.
		*
		* @example
		* <caption>This user exit excludes all the addresses containing Computer Club Market using an insensitive case regular expression.
		* - An address containing COMPUTER CLUB MARKET is excluded,
		* - An address containing COmpuTEr clUB mArKEt is excluded,
		* - An address containing Computer-Club-Market is not excluded.</caption>
		*function DiscardAddress(addressString, addressArea)
		*{
		*	// discard address matching the specified regurar expression
		*	var regExp = /Computer Club Market/gmi;
		*	if (regExp.exec(addressString) !== null)
		*	{
		*		return true;
		*	}
		*	return false;
		*}
		**/
		DiscardAddress: function (addressString, addressArea)
		{
		},

		/**
		* @description This function will be called at the begining of SOP extraction script.
		* If needed, use it to customize SOP extraction.
		*
		* @returns To stop the execution of the extraction script: return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution()
		*
		* @example
		* <caption>This user exit clears the data set by auto-learning when the Auto-complete next lines button  is clicked.</caption>
		*function OnExtractionScriptBegin()
		*{
		*	if (Data.GetActionType() === "autocomplete")
		*	{
		*		// reset Autolearn data
		*		Data.GetTable("Product_List__").SetItemCount(0);
		*		Data.SetValue("CustomerName__", "");
		*		Data.SetValue("ShipToName__", "");
		*	}
		*}
		**/
		OnExtractionScriptBegin: function ()
		{
		},

		/**
		* @description This function will be called at the end of SOP extraction script.
		* If needed, use it to modify fields value after extraction.
		*
		* @returns No return value expected
		*
		* @example
		* <caption>This user exit clears the Ignore simulation warnings check box after the order extraction.</caption>
		*function OnExtractionScriptEnd()
		*{
		*	// customize simulation warnings
		*	Data.SetValue("Ignore_simulation_warnings__", "0");
		*}
		**/
		OnExtractionScriptEnd: function ()
		{
		},

		/**
		* @description This function will be called when the extraction of the customer and the partner is finished.
		* If needed, use it to modify fields value after extraction.
		* It was added to change the Sales Area for specific customers, before extracting SAP specific fields (paymentTerms,...)
		* - This user exit is not called if the OnExtractionScriptBegin user exit stops the execution of the Extraction script.
		*
		* @returns No return value expected
		*
		* @example
		*function OnPartnerExtractionEnd()
		*{
		*	if(Data.GetValue("CustomerNumber__") == 1671){
		*		Data.SetValue("Sales_Area__", "1000/12/00");
		*	}
		*}
		**/
		OnPartnerExtractionEnd: function ()
		{
		},

		/**
		* @description This function will be called upon the extraction of the customer.
		* If needed, use it to modify the filter of the extraction query.
		* The filter is used for customer extration queries upon the "SO - Customers__" table, and KNA1 SAP queries.
		*
		* @param {boolean} isSAP - true is it is the SAP query extra filter, false for DB query extra filters
		*
		* @returns string value containing the additional filter. The filter syntax depends on the integrated ERP:
		* - Use an LDAP filter syntax for local queries : When the application is integrated with an ERP other than SAP, or when customer data is replicated. Refer to LDAP filters for more information about LDAP filters.
		* - Use an SAP SQL filter syntax when the application is integrated with SAP, and customer master data isn't replicated.
		*  If no extra filter needs to be defined, don't return anything or return null.
		*
		* @example
		*function GetSoldToExtraFilter(isSAP)
		*{
		*	if(!isSAP)
		*	{
		*		// filter on selected Sales_Area__ value
		*		var salesArea = Lib.SOP.SAP.Helpers.GetSplitSalesArea();
		*		var extraFilter;
		*		if(salesArea.IsValid())
		*		{
		*			extraFilter = "(&(Sales_organization__=" + salesArea.salesOrg + ")(Distribution_channel__=" + salesArea.distChan + ")(Business_area__=" + salesArea.businessArea + "))";
		*			return extraFilter;
		*		}
		*	}
		*}
		* function GetSoldToExtraFilter(isSAP)
		*{
		*	if(isSAP)
		*	{
		*		return "LOEVM <> 'X' AND KTOKD = '0001'"; // SAP SQL filter sample.
		*	}
		*}
		*
		**/
		GetSoldToExtraFilter: function (isSAP)
		{
		},

		/**
		* @description This function will be called upon the extraction of the partner.
		* If needed, use it to modify the filter of the extraction query.
		* The filter is used for partner extration queries upon the "SO - Partners__" table, and KNA1 SAP queries.
		*
		* @param {boolean} isSAP - true is it is the SAP query extra filter, false for DB query extra filters
		*
		* @returns string value containing the additional filter. The filter syntax depends on the integrated ERP:
		* - Use an LDAP filter syntax for local queries : When the application is integrated with an ERP other than SAP, or when partner data is replicated. Refer to LDAP filters for more information about LDAP filters.
		* - Use an SAP SQL filter syntax when the application is integrated with SAP, and partner master data isn't replicated.
		*  If no extra filter needs to be defined, don't return anything or return null.
		*
		* @example
		*function GetShipToExtraFilter(isSAP)
		*{
		*	if(!isSAP)
		*	{
		*		// filter on selected Sales_Area__ value
		*		var salesArea = Lib.SOP.SAP.Helpers.GetSplitSalesArea();
		*		var extraFilter;
		*		if(salesArea.IsValid())
		*		{
		*			extraFilter = "(&(Sales_organization__=" + salesArea.salesOrg + ")(Distribution_channel__=" + salesArea.distChan + ")(Business_area__=" + salesArea.businessArea + "))";
		*			return extraFilter;
		*		}
		*	}
		*}
		* function GetShipToExtraFilter(isSAP)
		*{
		*	if(isSAP)
		*	{
		*		return "LOEVM <> 'X' AND KTOKD = '0002'"; // SAP SQL filter sample.
		*	}
		*}
		*
		**/
		GetShipToExtraFilter: function (isSAP)
		{
		},
		/**
		* @description This function will be called when the extraction of the business priority keywords begins
		* If needed, use it to modify priority keyword options.
		* - This user exit is not called if the OnExtractionScriptBegin user exit stops the execution of the Extraction script.
		*
		* @returns To disable the execution of the standard code: return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution()
		*
		* @example
		* <caption>This user exit sets the Priority field of any order to Urgent if the Tomorrow, Urgent or Hurry keyword is found in 10% of the upper area of the first page. The Priory field gets the focus in the order form and the searched area is highlighted in the order document preview.</caption>
		* function OverridePriorityKeywordSearch()
		*{
		*	var keywords = ["Tomorrow", "Urgent", "Hurry"];
		*	var urgent = false;
		*	for (var i=0; i < keywords.length; i++)
		*	{
		*		var area = Document.GetArea(0,10,10,Document.GetPageWidth(0),(Document.GetPageHeight(0)/10));// top 10% of first page
		*		area.Highlight(true);//Highlight the area searched.
		*		Log.Info("searching keyword: "  + keywords[i]);
		*		var keywordsFound = Document.SearchString(keywords[i], area, false, false);
		*		Log.Info(keywordsFound);
		*		if (keywordsFound.length > 0)
		*		{
		*			Log.Info("found keyword: " + keywords[i]);
		*			keywordsFound[0].Highlight(true, 0x000088, 0xffffff,"Business_Priority__");
		*			urgent = true;
		*			break;
		*		}
		*	}
		*
		*	if(urgent)
		*	{
		*		Data.SetValue("Business_Priority__","1");
		*	}
		*
		*	return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution();
		*}
		**/
		OverridePriorityKeywordSearch: function ()
		{
		},

		/**
		* @description Allows to modify the Pre-Agreed Order Form/Customer Order mapping object
		* Helps to determine, for a given Pre Agreed Order Form header field, which header field to consider from the Customer order.
		*
		* @param {object} mapping
		*
		* @returns the mapping object
		*
		* @example
		*
		*	{
		*		CustomerVendor__: "CustomerVendor__",
		*		CustomerNumber__: "CustomerNumber__",
		*		CustomerName__: "CustomerName__",
		*		CustomerAddress_Street__: "CustomerAddress_Street__",
		*		CustomerAddress_PostalCode__: "CustomerAddress_PostalCode__",
		*		CustomerAddress_City__: "CustomerAddress_City__",
		*		CustomerAddress_Region__: "CustomerAddress_Region__",
		*		CustomerAddress_Country__: "CustomerAddress_Country__",
		*		ShiptoVendor__: "ShiptoVendor__",
		*		ShipToNumber__: "ShipToNumber__",
		*		ShipToName__: "ShipToName__",
		*		ShipToAddress_CompanyStreet__: "ShipToAddress_CompanyStreet__",
		*		ShipToAddress_CompanyPostalCode__: "ShipToAddress_CompanyPostalCode__",
		*		ShipToAddress_CompanyCity__: "ShipToAddress_CompanyCity__",
		*		ShipToAddress_CompanyRegion__: "ShipToAddress_CompanyRegion__",
		*		ShipToAddress_CompanyCountry__: "ShipToAddress_CompanyCountry__",
		*		Sales_Order_Number__: "Sales_Order_Number__",
		*		Tender_Number__: "Tender_Number__",
		*		Currency__: "Currency__"
		*	}
		*
		*
		* @example
		*ChangePOFHeaderMapping: function (headerMapping)
		* {
		* 		headerMapping.Tender_Number__ = "Z_Tender_Number__";
		*		return headerMapping;
		* }
		**/
		ChangePOFHeaderMapping: function (headerMapping)
		{
		},

		/**
		* @description Allows to modify the Pre Agreed Order Form/Customer Order mapping object.
		* Helps to determine, for a given Pre Agreed Order Form item column, which source column to consider from the Customer order.
		*
		* @param {object} mapping
		*
		* @returns the mapping object
		*
		* @example
		* {
		* 	LineNumber__: "LineNumber__",
		* 	ItemNumber__: "ItemNumber__",
		* 	National_Code__: "National_Code__",
		* 	Description__: "Description__",
		* 	Quantity__: "Quantity__",
		* 	Unit__: "Unit__",
		* 	Unit_Price__: "Unit_Price__",
		* 	TenderNumber__: "TenderNumber__",
		* 	Total__: "Total__"
		* 	}
		*
		* @example
		*ChangePOFItemsMapping: function (mapping)
		* {
		* 		mapping.TenderNumber__ = "Z_ItemCIG__";
		*			return mapping;
		* }
		**/
		ChangePOFItemsMapping: function (mapping)
		{
		},

		/**
		* @description This function will be called when the extraction of the revised order keywords begins
		* If needed, use it to modify revised order keyword options.
		* - This user exit is not called if the OnExtractionScriptBegin user exit stops the execution of the Extraction script.
		*
		* @returns To disable the execution of the standard code: return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution()
		*
		* @example
		* <caption>This user exit sets the Revised order field of any order to True if the Revised, Change or Version keyword is found in 10% of the upper area of the first page. The Revised order field gets the focus in the order form and the searched area is highlighted in the order document preview.</caption>
		* function OverrideRevisedOrderKeywordSearch()
		*{
		*	var keywords = ["Revised", "Change", "Version"];
		*	var revisedOrder = false;
		*	for (var i=0; i < keywords.length; i++)
		*	{
		*		var area = Document.GetArea(0,10,10,Document.GetPageWidth(0),(Document.GetPageHeight(0)/10));// top 10% of first page
		*		area.Highlight(true);//Highlight the area searched.
		*		Log.Info("searching keyword: "  + keywords[i]);
		*		var keywordsFound = Document.SearchString(keywords[i], area, false, false);
		*		Log.Info(keywordsFound);
		*		if (keywordsFound.length > 0)
		*		{
		*			Log.Info("found keyword: " + keywords[i]);
		*			keywordsFound[0].Highlight(true, 0x000088, 0xffffff,"Z_Revised_Order__");
		*			revisedOrder = true;
		*			break;
		*		}
		*	}
		*
		*	if(revisedOrder)
		*	{
		*		Data.SetValue("Z_Revised_Order__","1");
		*	}
		*
		*	return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution();
		*}
		**/
		OverrideRevisedOrderKeywordSearch: function ()
		{
		},
		/**
		* @description This function will be called to customize the SAP language when quering SAP material descriptions.
		*
		* @returns SAP one caracter code, non ISO
		*
		* @example <caption>Setting the language code for Spanish</caption>
		*function OnSapGetMaterialDescriptionLanguage()
		*{
		*	return "S";
		*}
		**/
		OnSapGetMaterialDescriptionLanguage: function ()
		{
		},

		/**
		* @description This function will be called after material lookup has been performed for a line item.
		* Use this to perform additional custom material lookup logic or override standard material lookup results.
		* This user exit is called after ItemNumber__ is determined but before Description__ and extra fields are filled.
		*
		* @param {Object} lineItem - The line item object being processed
		* @param {Object} table - The table object containing the line items
		*
		* @returns {Promise<void>|void} - Return a promise for asynchronous processing, or void for synchronous processing
		*
		* @example <caption>Perform async custom material lookup with database query and modify line item data</caption>
		* function OnMaterialIDMapped(lineItem, table)
		* {
		*     return new Promise(function(resolve, reject) {
		*         var itemNumber = lineItem.GetValue("ItemNumber__");
		*         if (itemNumber && itemNumber.startsWith("CUSTOM_")) {
		*             // Perform async material lookup query
		*             var filter = Sys.Helpers.LdapUtil.FilterEqual("CustomItemNumber__", itemNumber);
		*             Sys.GenericAPI.PromisedQuery({
		*                 table: "CustomMaterialsTable__",
		*                 filter: filter.toString(),
		*                 attributes: ["Description__", "Unit__", "UnitPrice__", "Category__"]
		*             }).Then(function(result) {
		*                 if (result && result.length > 0) {
		*                     var materialData = result[0];
		*                     lineItem.SetValue("Description__", materialData.Description__);
		*                     lineItem.SetValue("Unit__", materialData.Unit__);
		*                     lineItem.SetValue("Unit_Price__", materialData.UnitPrice__);
		*                     lineItem.SetValue("Z_Category__", materialData.Category__);
		*                 }
		*                 resolve();
		*             }).Catch(function(error) {
		*                 Log.Error("CustomMaterialLookupAfterItemNumber error: " + error);
		*                 resolve(); // Continue processing even if lookup fails
		*             });
		*         } else {
		*             // No custom processing needed
		*             resolve();
		*         }
		*     });
		* }
		**/
		OnMaterialIDMapped: function (lineItem, table)
		{
		},

		/**
		* @description This function is called in GetSoldToAddressByFtsWithAddressWordsAndZipCodes with the purpose of
		* applying an additional filter to the FTS query results.
		*
		* @returns {string} extraFilter
		*
		* @example <caption>Using a search key as an additional filter for a ship-to FTS query</caption>
		* function GetSoldToFTSExtraFilter()
		* {
		* 	var configuredSearchKey = Variable.GetValueAsString("Z_ConfiguredSearchKey__");
		*   if (!Sys.Helpers.IsEmpty(configuredSearchKey))
		*   {
		*  		return Sys.Helpers.LdapUtil.FilterEqual("Search_key__", configuredSearchKey).toString();
		*   }
		* }
		*/
		GetSoldToFTSExtraFilter: function ()
		{
		},

		/**
		* @description This function is called in GetShipToAddressByFtsWithAddressWordsAndZipCodes with the purpose of
		* applying an additional filter to the FTS query results.
		*
		* @returns {string} extraFilter
		*
		* @example <caption>Using a search key as an additional filter for a ship-to FTS query</caption>
		* function GetShipToFTSExtraFilter()
		* {
		* 	var configuredSearchKey = Variable.GetValueAsString("Z_ConfiguredSearchKey__");
		*   if (!Sys.Helpers.IsEmpty(configuredSearchKey))
		*   {
		*  		return Sys.Helpers.LdapUtil.FilterEqual("Search_key__", configuredSearchKey).toString();
		*   }
		* }
		*/
		GetShipToFTSExtraFilter: function ()
		{
		},

		/**
		* @description This function is called in ClassicExtraction with the purpose of
		* applying a mapping on Document Type coming from SDA.
		*
		* @returns {void}
		*
		* @example <caption>Calling a function to map the SDA document type with a supported sales document type</caption>
		* function OnSetSalesDocumentTypeFromSDA()
		* {
		*	var SDASalesDocumentType = Variable.GetValueAsString("SDADocTypeSource");
		*	if (Lib.SOP.Helpers.mappingSalesDocumentType[SDASalesDocumentType])
		*	{
		*		let salesDocumentType = GetAvailableSalesDocumentTypeValues(Sys.OM.Helpers.GetConfiguration());
		*		if (salesDocumentType.indexOf(Lib.SOP.Helpers.mappingSalesDocumentType[SDASalesDocumentType]) !== -1)
		*		{
		*			Data.SetValue("SalesDocumentType__", Lib.SOP.Helpers.mappingSalesDocumentType[SDASalesDocumentType]);
		*		}
		*	}
		* }
		*/
		OnSetSalesDocumentTypeFromSDA: function ()
		{
		},

		/**
		* @description Userexit for custom code at the end of quotation load server side
		* @param {Object} quotationData - The quote data returned from SAP when a quote is loaded
		* @returns No return value expected
		* @example <caption>Set Delivery Block from Quote Payment Terms.</caption>
		* function OnLoadQuotationEndServer()
		* {
		*	var paymentTerms = Data.GetValue("Payment_Terms__");
		*	if(paymentTerms === "Z1") {
		*		Data.SetValue("Delivery_block__", "Z1");
		*	}
		* }
		*/
		OnLoadQuotationEndServer: function (quotationData)
		{
		},

		/**
		 * @description User exit for custom code at the beginning of configuration initialization.
		 * @returns No return value expected.
		 * @since 339
		 * @example <caption>Set DocumentCulture.</caption>
		 * OnInitConfigurationBegin: function ()
		 * {
		 *      Variable.SetValueAsString("DocumentCulture", "fr-FR");
		 * }
		 */
		OnInitConfigurationBegin: function ()
		{
		},

		/**
		 * @description User-exit called to customize fields extracted using ChatGPT
		 * Used to add or modify description properties for fields which label is not understood by ChatGPT
		 * Also used to add custom fields to be extracted by ChatGPT
		 * Note: most fields do not need a description
		 * @returns No return value expected
		 * @param {Object} gptSettings - an object with the following model:
		 *  {
		 *   fields: {
		 *    <field_name>: {
		 *     label: <field_label>,
		 *     description: <field_description>,
		 *     type: "string" | "number" | "boolean",
		 *     replaceData: boolean,
		 *    },
		 *   },
		 *   lineItems: {
		 *    <field_name>: {
		 *     label: <field_label>,
		 *     description: <field_description>,
		 *     type: "string" | "number" | "boolean",
		 *     replaceData: boolean,
		 *    },
		 *   },
		 *  }
		 */
		AddFieldsDescriptions: function (gptSettings)
		{
		},
		/**
		* @description Userexit that return an array of fields to be excluded from the synergy results in Header Extraction
		* @returns Array<string>, Available values : "SalesOrderNumber", "TotalPrice", "SalesOrderDate", "DueDate"
		* @example
		* function GetHeaderFieldsToExcludeFromSynergyResult()
		* {
		*	return ["field0__","field1__"];
		* }
		*/
		GetHeaderFieldsToExcludeFromSynergyResult()
		{
		},
		/**
		* @description Userexit that return an array of fields to be excluded from the synergy results in ProductList Extraction
		* @returns Array<string>, Available values : "LineNumber", "Quantity", "IDNumber", "UnitPrice", "TotalPrice", "RequestedDate"
		* @example
		* function GetLineItemFieldsToExcludeFromSynergyResult()
		* {
		*	return ["field0__","field1__"];
		* }
		*/
		GetLineItemFieldsToExcludeFromSynergyResult()
		{
		},

		/**
		* @description This function will be called at the begining of SOP Portal extraction script.
		* If needed, use it to customize SOP Portal extraction.
		*
		* @returns To stop the execution of the extraction script: return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution()
		*
		* @example <caption>This user exit skip standard extraction.</caption>
		*function OnPortalExtractionScriptBegin()
		*{
		*	return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution();
		*}
		**/
		OnPortalExtractionScriptBegin: function ()
		{
		},

		/**
		* @description This function will be called at the end of SOP Portal extraction script.
		* If needed, use it to customize SOP Portal extraction.
		* This user exit is not called if the OnPortalExtractionScriptBegin user exit stops the execution of the extraction script.
		*
		* @returns No return value expected
		**/
		OnPortalExtractionScriptEnd: function ()
		{
		}
	};
	return customization;
})();
