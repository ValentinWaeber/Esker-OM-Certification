/* LIB_DEFINITION{
  "name": "LIB_DEDUCTIONS_CUSTOMIZATION_COMMON_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "COMMON",
  "versionable": false,
  "comment": "PS configurations that can be used in all scripts",
  "require": []
}*/

/**
 * Package Deductions common user exits
 * @namespace Lib.Deductions.Customization.Common
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.Deductions = Lib.Deductions || {};
Lib.Deductions.Customization = Lib.Deductions.Customization || {};

Lib.Deductions.Customization.Common = (function ()
{
	/**
	 * @lends Lib.Deductions.Customization.Common
	 */
	var Common =
	{
		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeDuplicateSearchFilter
		 * @description
		 * Function called to customize filter for detecting duplicated deductions in the deductions scripts (custom script and validation script)
		 * You can change filter in parameter to customize the detection behavior
		 * @param {string} defaultFilter Filter used by default to search duplicates.
		 * @returns {string} Filter to use to search duplicates in deducton.
		 * @example
			CustomizeDuplicateSearchFilter: function (defaultFilter)
			{
				var poNumber = Data.GetValue("PO_number__") || "";
				var filter = "(&" + defaultFilter + "(PO_number__=" + poNumber + "))";
				return filter;
			}
		 */
		/*CustomizeDuplicateSearchFilter: function (defaultFilter)
		{
			var filter = defaultFilter;

			return filter;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeMaterialsSearchFilter
		 * @description
		 * Function called to customize filter for materials search in the Claims & Deductions scripts (custom script and validation script)
		 * @param {string} defaultFilter Filter used by default to search for materials.
		 * @returns {string} Modified filter that will be actually used during database query
		 * @example
			CustomizeMaterialsSearchFilter: function (defaultFilter)
			{
				var companyCode = Data.GetValue("Company_code__") || "";
				var filter = "(&" + defaultFilter + "(DataFilteringKey__=" + companyCode + "))";
				return filter;
			}
		 */
		/*CustomizeMaterialsSearchFilter: function (defaultFilter)
		{
			var filter = defaultFilter;

			return filter;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeInvoicedUoMSearchFilter
		 * @description
		 * Function called to customize filter for Invoiced Unit of measure search in the Claims & Deductions scripts (custom script and validation script)
		 * @param {string} defaultFilter Filter used by default to search for Invoiced Unit of measure.
		 * @returns {string} Modified filter that will be actually used during database query
		 * @example
			CustomizeInvoicedUoMSearchFilter: function (defaultFilter)
			{
				// Add a filter on a custom field created by PS
				var customField = Data.GetValue("MyCustomField__");
				var filter = "(&" + defaultFilter + "(MyCustomField__=" + customField + "))";
				return filter;
			}
		 */
		/*CustomizeInvoicedUoMSearchFilter: function (defaultFilter)
		{
			var filter = defaultFilter;

			return filter;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeReceivedUoMSearchFilter
		 * @description
		 * Function called to customize filter for Received Unit of measure search in the Claims & Deductions scripts (custom script and validation script)
		 * @param {string} defaultFilter Filter used by default to search for Received Unit of measure.
		 * @returns {string} Modified filter that will be actually used during database query
		 * @example
			CustomizeReceivedUoMSearchFilter: function (defaultFilter)
			{
				// Add a filter on a custom field created by PS
				var customField = Data.GetValue("MyCustomField__");
				var filter = "(&" + defaultFilter + "(MyCustomField__=" + customField + "))";
				return filter;
			}
		 */
		/*CustomizeReceivedUoMSearchFilter: function (defaultFilter)
		{
			var filter = defaultFilter;

			return filter;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeCustomersSearchFilter
		 * @description
		 * Function called to customize filter for customers search in the Claims & Deductions scripts (custom script and validation script)
		 * @param {string} defaultFilter Filter used by default to search for customers.
		 * @returns {string} Modified filter that will be actually used during database query
		 * @example
			CustomizeCustomersSearchFilter: function (defaultFilter)
			{
				var companyCode = Data.GetValue("Company_code__");
				var filter = "(&" + defaultFilter + "(AdditionalField1=" + companyCode + "))";
				return filter;
			}
		 */
		/*CustomizeCustomersSearchFilter: function (defaultFilter)
		{
			var filter = defaultFilter;

			return filter;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizePromotionsSearchFilter
		 * @description
		 * Function called to customize filter for promotions search in the Claims & Deductions scripts (custom script and validation script)
		 * @param {string} defaultFilter Filter used by default to search for promotions.
		 * @param {Item | undefined} item Item on which the script is executed. It can be used to get values from the current line item. Can be undefined when use in UE for checks.
		 * @returns {string} Modified filter that will be actually used during database query
		 * @example <caption>Filter from a date range</caption>
		 * CustomizePromotionsSearchFilter: function (defaultFilter, item)
		 * {
		 * 	var invoiceDate = Data.GetValue("Invoice_date__");
		 * 	var afterBeginDateFilter = "(|(Period_begin_date__<=" + invoiceDate + ")(Period_begin_date__=)(!(Period_begin_date__=*)))";
		 * 	var beforeEndDateFilter = "(|(Period_end_date__>=" + invoiceDate + ")(Period_end_date___=)(!(Period_end_date___=*)))";
		 * 	var filter = "(&" + defaultFilter + afterBeginDateFilter + beforeEndDateFilter + ")";
		 * 	return filter;
		 * }
		 *	@example <caption>Filter from a custom column item</caption>
		 * CustomizePromotionsSearchFilter: function (defaultFilter, item)
		 * {
		 *	if (item)
		 *	{
		 *		var uom = item.GetValue("Z_Expected_UOM__") ?? "";
		 *		var uomFilter = "(Z_UOM__="+uom+")";
		 *		var filter = "(&" + defaultFilter + uomFilter + ")";
		 *		return filter;
		 *	}
		 *	else
		 *	{
		 *		return defaultFilter;
		 *	}
		 * }
		 */
		/*CustomizePromotionsSearchFilter: function (defaultFilter, item)
		{
			var filter = defaultFilter;

			return filter;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeAssociatedDebitsSearchFilter
		 * @description
		 * Function called to customize filter for associated debits search in the Claims & Deductions scripts (custom script and validation script)
		 * @param {string} defaultFilter Filter used by default to search for associated debits.
		 * @returns {string} Modified filter that will be actually used during database query
		 * @example
			CustomizeAssociatedDebitsSearchFilter: function (defaultFilter)
			{
				var customerName = Data.GetValue("Customer_name__");
				var customerNameFilter = "(Customer_name__=" + customerName + ")";
				var filter = "(|" + defaultFilter + customerNameFilter)";
				return filter;
			}
		 */
		/*CustomizeAssociatedDebitsSearchFilter: function (defaultFilter)
		{
			var filter = defaultFilter;

			return filter;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeReferedInvoicesSearchFilter
		 * @description
		 * Function called to customize filter for refered invoices search in the Claims & Deductions scripts (custom script and validation script)
		 * @param {string} defaultFilter Filter used by default to search for refered invoices.
		 * @returns {string} Modified filter that will be actually used during database query
		 * @example
			CustomizeReferedInvoicesSearchFilter: function (defaultFilter)
			{
				var customerName = Data.GetValue("Customer_name__");
				var customerNameFilter = "(Customer_name__=" + customerName + ")";
				var filter = "(|" + defaultFilter + customerNameFilter)";
				return filter;
			}
		 */
		/*CustomizeReferedInvoicesSearchFilter: function (defaultFilter)
		{
			var filter = defaultFilter;

			return filter;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeCreditNotesSearchFilter
		 * @description
		 * Function called to customize filter for credit notes search in the Claims & Deductions scripts (custom script and validation script)
		 * @param {string} defaultFilter Filter used by default to search for credit notes.
		 * @returns {string} Modified filter that will be actually used during database query
		 * @example
			CustomizeCreditNotesSearchFilter: function (defaultFilter)
			{
				var customerName = Data.GetValue("Customer_name__");
				var customerNameFilter = "(Customer_name__=" + customerName + ")";
				var filter = "(|" + defaultFilter + customerNameFilter)";
				return filter;
			}

		 */
		/*CustomizeCreditNotesSearchFilter: function (defaultFilter)
		{
			var filter = defaultFilter;

			return filter;
		},*/
		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeDuplicateMergeQuery
		 * @description
		 * Function called to customize filter for duplicate merging
		 * @param {string} defaultFilter Filter used by default to search for duplicate to merge.
		 * @returns {string} Modified filter that will be actually used during database query
		 * @example
			CustomizeDuplicateMergeQuery: function (defaultFilter)
			{
				var documentNumber = Data.GetValue("Document_number__");
				var filter = "(&" + defaultFilter + "(Document_number__=" + documentNumber + "))";
				return filter;
			}
		*/
		/*CustomizeDuplicateMergeQuery: function (defaultFilter)
		{
			var filter = defaultFilter;

			return filter;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeDuplicateMerge
		 * @description
		 * Function called to customize the merge of two deductions
		 * This function replaces the default merge behavior
		 * @param {Object.<string, any>} defaultMergeResult Default merge result
		 * @param {Object.<string, any>} oldDeduction Old deduction already present
		 * @param {Object.<string, any>} newDeduction New deduction in extraction
		 * @param {string[]} fieldList List of fields to compare
		 * @returns {Object.<string, any>} Merge of the two deductions
		 * @deprecated Use CustomizeAllDuplicateMerge instead returning the entire object
		 * @example
			CustomizeDuplicateMerge: function (defaultMergeResult, oldDeduction, newDeduction, fieldList)
			{
				var result = oldDeduction;

				let nbFields = fieldList.length;
				for (var k = 0; k < nbFields; k++)
				{
					result[fieldList[k]] = newDeduction[fieldList[k]];
				}
				result.Associated_debit__ = "DEB_" + result.Associated_debit__;

				return result;
			}
		*/
		/*CustomizeDuplicateMerge: function (defaultMergeResult, oldDeduction, newDeduction, fieldList)
		{
			var result = defaultMergeResult;

			return result;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeAllDuplicateMerge
		 * @description
		 * Function called to customize the merge of two deductions
		 * This function replaces the default merge behavior
		 * @param {Object.<string, any>} defaultMergeResult Default merge result
		 * @param {Object.<string, any>} oldDeduction Old deduction already present
		 * @param {Object.<string, any>} newDeduction New deduction in extraction
		 * @param {string[]} fieldList List of fields to compare
		 * @returns {Object.<string, any>} Merge of the two deductions
		 * @example
			CustomizeAllDuplicateMerge: function (defaultMergeResult, oldDeduction, newDeduction, fieldList)
			{
				var result = oldDeduction;

				let nbFields = fieldList.length;
				for (var k = 0; k < nbFields; k++)
				{
					result[fieldList[k]] = newDeduction[fieldList[k]];
				}
				result.headerFields.Associated_debit__ = "DEB_" + result.headerFields.Associated_debit__;

				return result;
			}
		*/
		/*CustomizeAllDuplicateMerge: function (defaultMergeResult, oldDeduction, newDeduction, fieldList)
		{
			var result = defaultMergeResult;

			return result;
		},*/



		/**
		 * @method Lib.Deductions.Customization.Common.GetCustomTablesForMerge
		 * @description
		 * Function called to specify which custom tables should be automatically merged and tracked
		 * during the merge process. Custom header fields and line item columns are already handled
		 * automatically by the standard implementation. This function is only needed for custom tables
		 * that should be included in the automatic merging process and merge preview functionality.
		 * This function is not mandatory - only implement if you have custom tables to merge.
		 * 
		 * @returns {Object[]} Array of custom table configurations with tableName and columns
		 * @example
		 * GetCustomTablesForMerge: function ()
		 * {
		 * 	return [
		 * 		{
		 * 			tableName: "Z_Custom_Table__",
		 * 			columns: ["Z_Column1__", "Z_Column2__", "Z_Column3__"]
		 * 		},
		 * 		{
		 * 			tableName: "Z_Another_Table__",
		 * 			columns: ["Z_Field_A__", "Z_Field_B__"]
		 * 		}
		 * 	];
		 * }
		 */
		/*GetCustomTablesForMerge: function ()
		{
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeMerge
		 * @description
		 * Function called to customize the merge of two deduction claims. The parameter is an object containing all the data used to do the merge.
		 * The goal of this user exit is to customize the objects in the parameters in order to obtain the desired result.
		 * It is also possible to completely replace the default behavior of the merge by returning true, thus preventing the standard merge from being executed.
		 * @param {Object} mergeParameters Default merge parameters (mergeParameters: {mergedDeduction: FormFieldsMapping; Deduction1: FormFieldsMapping; Deduction2: FormFieldsMapping; fieldList: FormFields; mergeConflicts: MergeConflict[]; forceSolveConflicts: boolean})
		 * @returns {boolean} Stop the default merge behavior if true
		 * @example
			CustomizeMerge: function (mergeParameters)
			{
				delete mergeParameters.Deduction1.headerFields.Associated_debit__;
				mergeParameters.Deduction2.lineItems["Z_Col_claim_number__"] = Data.GetValue("Z_Claim_number__");
				return false;
			}

		*/
		/*CustomizeMerge: function (mergeParameters)
		{
			return false;
		},*/
		/**
		* @method Lib.Deductions.Customization.Common.OnMaterialChanged
		* @description
		* This function will be called when a ERP material of a line item changes via script.
		* It enables the possibility to set the value of customized columns in the corresponding line item.
		* @param {Item} item - The line item on which the Material was changed.
		* @returns No return value expected
		* @example
		* function OnMaterialChanged(item)
		* {
		*		Data.SetValue("AdditionalField__", "Material changed: " + item.GetValue("Col_item_number__"));
		* }
		**/
		/*OnMaterialChanged: function (item)
		{

		},*/
		/**
		 * @method Lib.Deductions.Customization.Common.OnCustomerChanged
		 * @description
		 * This function will be called when the Customer changes via script
		 * It enables the possibility to set the value of customized fields of the current Deduction
		 * @returns No return value expected
		 * @example
		 *  function OnCustomerChanged()
		 * {
		 * 		Data.SetValue("AdditionalField__", "Customer changed: " + Data.GetValue("Customer_ID__"));
		 * }
		 **/
		/*OnCustomerChanged: function ()
		{

		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeDeductionCreationFromManageDocuments
		 * @description
		 * Function called before creating deduction instances from the Manage Documents feature
		 * This function is called just before .Process(). This way, you can still customize notifications, variables, etc of the transport given in parameter
		 * @param {xTransport} newProcess xTransport object obtained with Process.CreateTransport()
		 * @param {number} isFirstAttachment indicates if the process is created with the same main document (first attachment) as the original claim
		 * @example
		 * CustomizeDeductionCreationFromManageDocuments: function (newProcess, isFirstAttachment)
		 * {
		 * 		// Copy document number from original deduction claim
		 * 		var deductionVars = newProcess.GetUninheritedVars();
		 *      if (!Data.IsNullOrEmpty("Document_number__"))
		 *		{
		 *			deductionVars.AddValue_String("Document_number__", Data.GetValue("Document_number__"), true);
		 *		}
		 * }
		 *
		 */
		/*CustomizeDeductionCreationFromManageDocuments: function (newProcess, isFirstAttachment)
		{
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.DisableCustomerMappingFromEmail
		 * @description
		 * Function called before extract or save customer mapping based on email address.
		 * This way, you can disable mapping for some email adresses during extraction or disable only learning step.
		 * @param {string} step "extraction" or "finalization" if you want disable only one step of mapping
		 * @param {string} senderEmailAddress extracted form source email
		 * @returns True if you want disable mapping. False by default.
		 *
		 * @example <caption>To disable mapping for a domain.</caption>
		 * DisableCustomerMappingFromEmail: function (step, senderEmailAddress)
		 * {
		 * 	if (senderEmailAddress.indexOf("@esker.com") !== -1)
		 * 	{
		 * 		return true;
		 * 	}
		 * 	return false;
		 * }
		 *
		 * @example <caption>To disable learning mapping on a specific email address.</caption>
		 * DisableCustomerMappingFromEmail: function (step, senderEmailAddress)
		 * {
		 * 	if (step === "finalization" && senderEmailAddress === "john.doe@mycustomer.com")
		 * 	{
		 * 		return true;
		 * 	}
		 * 	return false;
		 * }
		 *
		 */
		/*DisableCustomerMappingFromEmail: function (step, senderEmailAddress)
		{
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.ModifyMergeCompareIgnoredFields
		 * @description
		 * Use this function to customize the fields that should be ignored during the merge of claims.
		 * @param {Array<string>} ignoredFields Fields ignored by default during the merge of claims
		 * @returns {Array<string>} Customized fields ignored during the merge of claim.
		 *
		 * @example
		 * ModifyMergeCompareIgnoredFields: function (ignoredFields)
		 * {
		 * 	ignoredFields.push("Z_Technical_field__");
		 * 	return ignoredFields;
		 * }
		 *
		 */
		/*ModifyMergeCompareIgnoredFields: function (ignoredFields)
		{
			return ignoredFields;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.SetPromotionOnLine
		 * @description
		 * Called in on each line item after promotion query to set the promotion on the line.
		 * @since 331
		 * @param {Object} lineItem Line item object
		 * @param {Object[]} promotionInfos Array of promotion objects returned by the query
		 * @returns {Boolean} return true to bypass the default behavior SetPromotionOnLineIfOnlyOnePossible. False by default.
		 * @example <caption>This sample looks for the promotion with the highest amount for the material number set on the line item.</caption>
		 * SetPromotionOnLine: function (item, promotionInfos)
		 * {
		 * 	if (promotionInfos && promotionInfos.length > 0)
		 * 	{
		 * 		var maxPromotionAmount = parseFloat(promotionInfos[0].Promotion_amount__);
		 * 		var selectedPromotion = promotionInfos[0].Promotion_number__;
		 * 		for(var i = 1; i < promotionInfos.length; i++)
		 * 		{
		 * 			if(maxPromotionAmount < parseFloat(promotionInfos[i].Promotion_amount__))
		 * 			{
		 * 				maxPromotionAmount = parseFloat(promotionInfos[i].Promotion_amount__);
		 * 				selectedPromotion = promotionInfos[i].Promotion_number__;
		 * 			}
		 * 		}
		 * 		item.SetValue("Col_item_promotion_number__", selectedPromotion);
		 * 	}
		 * 	return true;
		 * }
		 * @example <caption>This sample set the custom table field value in the custom column</caption>
		 * SetPromotionOnLine: function (item, promotionInfos)
		 * {
		 * 	var uom = promotionInfos[0].Z_UOM__;
		 * 	item.SetValue("Z_UOM__", uom);
		 * 	return false;
		 * }
		 */
		/*SetPromotionOnLine: function (item, promotionInfos)
		{
			return false;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.GetConditionToSetPromotionOnLine
		 * @description
		 * Called in on each line item to know if we should set the promotion on the line.
		 * @since 331
		 * @param {Object} item Line item object
		 * @param {Object} row Row object only for client side script
		 * @returns {Boolean} return true set promotion number even if material number is not set. False by default.
		 * @example <caption>This sample is always setting the promotion on the line.</caption>
		 * GetConditionToSetPromotionOnLine: function (item, row)
		 * {
		 * 	return true;
		 * }
		 */
		/*GetConditionToSetPromotionOnLine: function (item, row)
		{
			return false;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.GetPromotionAttributes
		 * @description
		 * Function called to get the attributes used for the promotion query.
		 * @since 331
		 * @param {string[]} defaultAttributes All standard attributes for table Promotion.
		 * @returns {string[]} return customized attributes to use for the promotion query.
		 * @example <caption>This sample adds a custom attribute to the default attributes.</caption>
		 * GetPromotionAttributes: function (defaultAttributes)
		 * {
		 * 	defaultAttributes.push("Z_UOM__");
		 * 	return defaultAttributes;
		 * }
		 */
		/*GetPromotionAttributes: function (defaultAttributes)
		{
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeClaimTypeFilter
		 * @description
		 * Use this function to customize the claim type filter used in the Claims & Deductions scripts.
		 * @since 333
		 * @param {Sys.Helpers.LdapUtil.IFilter} filter Current filter to search for claim types.
		 * @returns {Sys.Helpers.LdapUtil.IFilter} Filter to use to search for claim types.
		 *
		 * @example
		 * CustomizeClaimTypeFilter: function (filter)
		 * {
		 * 	// Add a filter on a custom field created by PS
		 *
		 * 	var customField = Data.GetValue("MyCustomField__");
		 * 	if (customField)
		 * 	{
		 * 		return Sys.Helpers.LdapUtil.FilterAnd(
		 * 			Sys.Helpers.LdapUtil.FilterEqual("MyCustomField__", customField),
		 * 			filter
		 * 		);
		 *  }
		 * }
		 */
		/*CustomizeClaimTypeFilter: function (filter)
		{
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeMaterialMappingFilter
		 * @description Use this function to customize the filter used when searching for a material mapping.
		 * @since 333
		 * @param {Sys.Helpers.LdapUtil.IFilter} filter Current filter
		 * @returns {Sys.Helpers.LdapUtil.IFilter} Customized filter
		 *
		 * @example <caption>Add a custom field to the filter.</caption>
		 * CustomizeMaterialMappingFilter: function (filter: Sys.Helpers.LdapUtil.IFilter)
		 * {
		 * 	var customFieldValue = Data.GetValue("Z_CustomField__");
		 * 	if (customFieldValue)
		 * 	{
		 * 		filter = Sys.Helpers.LdapUtil.FilterAnd(
		 * 			Sys.Helpers.LdapUtil.FilterEqual("Z_CustomFieldInMapping__", customFieldValue),
		 * 			filter
		 * 		);
		 *	}
		 *	return filter;
		 * }
		 */
		/*CustomizeMaterialMappingFilter: function (filter)
		{
			return filter;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeMaterialCorrectedMappingFilter
		 * @description Use this function to customize the filter used when searching for a corrected material mapping.
		 * @since 333
		 * @param {Sys.Helpers.LdapUtil.IFilter} filter Current filter
		 * @returns {Sys.Helpers.LdapUtil.IFilter} Customized filter
		 *
		 * @example <caption>Add a custom field to the filter.</caption>
		 * CustomizeMaterialCorrectedMappingFilter: function (filter: Sys.Helpers.LdapUtil.IFilter)
		 * {
		 * 	var customFieldValue = Data.GetValue("Z_CustomField__");
		 * 	if (customFieldValue)
		 * 	{
		 * 		filter = Sys.Helpers.LdapUtil.FilterAnd(
		 * 			Sys.Helpers.LdapUtil.FilterEqual("Z_CustomFieldInMapping__", customFieldValue),
		 * 			filter
		 * 		);
		 *	}
		 *	return filter;
		 * }
		*/
		/*CustomizeMaterialCorrectedMappingFilter: function (filter)
		{
			return filter;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeUserInfosFilter
		 * @description Use this function to customize the filter used when searching for a user information.
		 * @since 333
		 * @param {Sys.Helpers.LdapUtil.IFilter} filter Current filter
		 * @returns {Sys.Helpers.LdapUtil.IFilter} Customized filter
		 *
		 * @example <caption>Add a custom field to the filter.</caption>
		 * CustomizeUserInfosFilter: function (filter: Sys.Helpers.LdapUtil.IFilter)
		 * {
		 * 	var customFieldValue = Data.GetValue("Z_EmailAddress__");
		 * 	if (customFieldValue)
		 * 	{
		 * 		filter = Sys.Helpers.LdapUtil.FilterAnd(
		 * 			Sys.Helpers.LdapUtil.FilterEqual("EmailAddress", customFieldValue),
		 * 			filter
		 * 		);
		 *	}
		 *	return filter;
		 * }
		*/
		/*CustomizeUserInfosFilter: function (filter)
		{
			return filter;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeInvoicesFilter
		 * @description Use this function to customize the filter used when searching for an invoice.
		 * @since 333
		 * @param {Sys.Helpers.LdapUtil.IFilter} filter Current filter
		 * @returns {Sys.Helpers.LdapUtil.IFilter} Customized filter
		 *
		 * @example <caption>Add a custom field to the filter.</caption>
		 * CustomizeInvoicesFilter: function (filter: Sys.Helpers.LdapUtil.IFilter)
		 * {
		 * 	var customFieldValue = Data.GetValue("Z_CustomField__");
		 * 	if (customFieldValue)
		 * 	{
		 * 		filter = Sys.Helpers.LdapUtil.FilterAnd(
		 * 			Sys.Helpers.LdapUtil.FilterEqual("Z_CustomFieldInMapping__", customFieldValue),
		 * 			filter
		 * 		);
		 *	}
		 *	return filter;
		 * }
		*/
		/*CustomizeInvoicesFilter: function (filter)
		{
			return filter;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeComputeContestedFields
		 * @description
		 * Customize the computation of contested fields (disputed net amount, contested unit price, invoiced quantity) to change rounding or other logic.
		 * @since 333
		 * @param {string} fieldName the name of the field to compute
		 * @param {number} expectedValue the expected value to set in the field without rounding
		 * @returns {number} the customized value to set in the field, or undefined if no customization is needed
		 * @example <caption>This sample overrides the standard computation of contested fields by rounding the values to two decimal places instead of to the nearest integer.</caption>
		 * CustomizeComputeContestedFields: function (fieldName, expectedValue)
		 * {
		 * 	if (fieldName === "Col_item_invoiced_quantity__")
		 * 	{
		 * 		return Math.round(expectedValue * 100) / 100; // Round to two decimal places
		 * 	}
		 * }
		 */
		/*CustomizeComputeContestedFields: function (fieldName, expectedValue)
		{
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeClaimTypesAttributes
		 * @description
		 * Customize the attributes retrieved from the claim type configurations.
		 * @since 334
		 * @param {string[]} attributes by default
		 * @returns {string[]} customized attributes
		 * @example <caption>Retrieve a custom field from the claim type configuration</caption>
		 * CustomizeClaimTypesAttributes: function (attributes)
		 * {
		 * 	attributes.push("Z_CustomField__");
		 * 	return attributes;
		 */
		/*CustomizeClaimTypesAttributes: function (attributes)
		{
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeInvoicesAttributes
		 * @description
		 * Customize the attributes retrieved when searching for an associated invoice.
		 * In the case of filling claim fields from the invoice, use CustomizeFillInvoiceInfos to fill other fields.
		 * @since 334
		 * @param {string[]} attributes by default
		 * @returns {string[]} customized attributes
		 * @example <caption>Retrieve an additional field from the invoice</caption>
		 * CustomizeInvoicesAttributes: function (attributes)
		 * {
		 * 	attributes.push("Customer_Payer_other_id__");
		 * 	return attributes;
		 */
		/*CustomizeInvoicesAttributes: function (attributes)
		{
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeFillInvoiceInfos
		 * @description
		 * Customize the fields filled after retrieving an associated invoice.
		 * If a field that isn't retrieved in the standard need to be retrieved from the invoice, use CustomizeInvoicesAttributes to retrieve other fields.
		 * @since 334
		 * @param {object} invoiceInfos
		 * @example <caption>Set a custom field from data retrieved from the invoice</caption>
		 * CustomizeFillInvoiceInfos: function (invoiceInfos)
		 * {
		 * 	Data.SetValue("Z_InvoiceNumber__", invoiceInfos.InvoiceNumber);
		 * }
		 */
		/*CustomizeFillInvoiceInfos: function (invoiceInfos)
		{
		},*/

		/**
		 * @method Lib.Deductions.Customization.Common.CustomizeIsLineItemField
		 * @description
		 * Customize the fields which are considered line item fields.
		 * @since 335
		 * @param {string} field name
		 * @example <caption>Check if a field is a line item field</caption>
		 * CustomizeIsLineItemField: function (field)
		 * {
		 * 	return field.startsWith("Z_Col_");
		 * }
		 */
		/*CustomizeIsLineItemField: function (field)
		{
		}*/
	};
	return Common;
})();