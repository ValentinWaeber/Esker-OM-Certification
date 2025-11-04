/* LIB_DEFINITION{
  "name": "Lib_Deductions_Customization_Checks_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "COMMON",
  "versionable": false,
  "comment": "Deductions checks customizations functions",
  "require": []
}*/

/**
 * This module contains
 * @namespace Lib.Deductions.Customization.Checks
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.Deductions = Lib.Deductions || {};
Lib.Deductions.Customization = Lib.Deductions.Customization || {};

Lib.Deductions.Customization.Checks = (function ()
{
	/**
	 * @lends Lib.Deductions.Customization.Checks
	 */
	var Checks =
	{
		/**
		 * @method Lib.Deductions.Customization.Checks.GetCustomChecks
		 * @description
		 * This function is used to create custom checks to execute on the deduction processing process
		 * @param id a unique id referencing your check
		 * @param name the name of your check
		 * @param description a quick description of what your check do
		 * @param event what trigger the execution of your check, see Sys.Deductions.Checks.EventTrigger to see all possible trigger
		 * @param fieldsToApply if the trigger is the change of a field or a line item, specify which field should trigger the check
		 * @param requiredLineItem set to true if the check is about line items
		 * @param tags
		 * @param errorFlag a boolean header field, which is true if there is at least one error of associated checks
		 * @param Apply implementation of your check
		 * @example <caption>Custom checks definition</caption>
		 *
		 * GetCustomChecks: function ()
		 * {
		 * 	return [
		 * 		{
		 * 			"id": "Check_cst_001",
		 * 			"name": "Check document number formating",
		 * 			"description": "Check if the document number start with DC000",
		 * 			"event": [Sys.Deductions.Checks.EventTrigger.ON_FIELD_CHANGE],
		 * 			"fieldsToApply": ["Document_number__"],
		 * 			"requireLineItem": false,
		 * 			"tags": ["header", "custom"],
		 * 			Apply: function (lineNumber, ctx)
		 * 			{
		 * 				ctx.GetMessageDispatcher().RemoveAllMessagesForGivenCheck(this.id, this.fieldsToApply);
		 *
		 * 				const docNumber = ctx.GetDataStorage().GetHeaderValue("Document_number__");
		 * 				if (docNumber && docNumber.startsWith("DC000"))
		 * 				{
		 * 					return Sys.Deductions.Checks.ValidationStatus.NO_ERROR;
		 * 				}
		 * 				else
		 * 				{
		 * 					ctx.GetMessageDispatcher().AddHeaderMessage("Document_number__", this.id, "The document number should always begin with DC000");
		 * 					return Sys.Deductions.Checks.ValidationStatus.ERROR;
		 * 				}
		 * 			}
		 * 		},
		 * 		{
		 * 			"id": "Check_cst_002",
		 * 			"name": "Check if col item number has existing mapping",
		 * 			"description": "Check if col item number, for the current customer, has existing mapping",
		 * 			"event": [Sys.Deductions.Checks.EventTrigger.ON_LINE_CHANGE, Sys.Deductions.Checks.EventTrigger.VALIDATION],
		 * 			"fieldsToApply": ["Col_item_number__", "Customer_ID__"],
		 * 			"requireLineItem": true,
		 * 			"tags": ["line", "custom"],
		 * 			"errorFlag": "Z_Error_on_col_item_number__",
		 * 			Apply: async function (lineNumber, ctx)
		 * 			{
		 * 				ctx.GetMessageDispatcher().RemoveAllMessagesForGivenCheck(this.id, this.fieldsToApply, lineNumber);
		 * 				ctx.GetErrorFlagManager().RemoveFromErrorFlag(this.errorFlag, this.id);
		 *
		 * 				const materialNumber = ctx.GetDataStorage().GetLineItemValue("Col_item_number__", lineNumber);
		 * 				const customerID = ctx.GetDataStorage().GetHeaderValue("Customer_ID__");
		 *
		 * 				const filterCustomer = Sys.Helpers.LdapUtil.FilterEqual("Customer_number__", customerID);
		 * 				const filterMaterial = Sys.Helpers.LdapUtil.FilterEqual("Material_number_on_the_customer_side__", materialNumber);
		 * 				const filter = Sys.Helpers.LdapUtil.FilterAnd(filterCustomer, filterMaterial);
		 *
		 * 				try
		 * 				{
		 * 					const result = await Sys.GenericAPI.PromisedQuery({
		 * 						table: "SO - ERP/Customer material mapping__",
		 * 						filter: filter,
		 * 						attributes: ["Material_number__"]
		 * 					});
		 *
		 * 					if (result.length > 0)
		 * 					{
		 * 						return Sys.Deductions.Checks.ValidationStatus.NO_ERROR;
		 * 					}
		 * 				}
		 * 				catch (e)
		 * 				{
		 * 					Log.Err("Query mapping failed: " + e);
		 * 				}
		 * 				ctx.GetMessageDispatcher().AddLineMessage("Col_item_number__", lineNumber, this.id, "No mapping found for this item number");
		 * 				return Sys.Deductions.Checks.ValidationStatus.ERROR;
		 * 			}
		 * 		}
		 * 	];
		 * }
		 * */
		/*GetCustomChecks: function ()
		{
			return [
			];
		},*/
		/**
		 * @method Lib.Deductions.Customization.Checks.CustomizeTagList
		 * @description
		 * This function is used to create or edit the tags used to filter the checks on the "DC - Claim Type" table
		 * @param taglist Existing tag list
		 * @returns Modified tag list
		 * @example <caption>Custom tag list definition</caption>
		 * CustomizeTagList: function(taglist)
		 * {
		 * 	// Add a new custom tag "G/L Account" to the existing tag list
		 * 	return taglist.concat([{id: "glAccount", label:"G/L Account"}]);
		 * }
		 */
		/*CustomizeTagList: function (taglist)
		{
			return taglist;
		},*/


		/**
		 * @method Lib.Deductions.Customization.Checks.GetAmountTolerance
		 * @description
		 * This user exit allows you to override the tolerance in checks.
		 * By default, it is set to 0.01, but you can specify a custom value for each check.
		 * @param {string} checkId The ID of the current check. This allows you to change the tolerance for specific checks.
		 * @returns {number} The tolerance to use. Defaults to 0.01.
		 * @example <caption>Customize tolerance for Tax amount - Consistency check</caption>
		 * GetAmountTolerance: function (checkId)
		 * {
		 * 	if (checkId === "_Ck_LineHeaderTaxAmount")
		 * 	{
		 * 		return 0.10;
		 * 	}
		 * 	return 0.01;
		 * }
		 */
		/*GetAmountTolerance: function (checkId)
		{
			return 0.01;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Checks.RunChecksOnEmptyColumns
		 * @description
		 * This user exit forces the check even if the total amount in item lines is null.
		 * In standard mode, we only check data coherence if at least one line is filled.
		 * Only 6 checks are available for this user exit : net, total and tax Consistency checks.
		 * @param {string} checkId The ID of the current check. This allows you to change behavior between checks and permit the amount to be empty in table lines instead of others.
		 * @returns {boolean} True to perform the check even if the related column is not set in lines; otherwise, false. Defaults to false, meaning checks are ignored.
		 * @example <caption>Display warning even if lines are empty by performing Net amount - Consistency check</caption>
		 * RunChecksOnEmptyColumns: function (checkId)
		 * {
		 * 	if (checkId === "_Ck_LineHeaderNetAmountWarning")
		 * 	{
		 * 		return true;
		 * 	}
		 * 	return false;
		 * }
		 */
		/*RunChecksOnEmptyColumns: function (checkId)
		{
			 return false;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Checks.RunPromotionAccrualRemainingAmountClientSide
		 * @description
		 * This user exit allows you to run the Promotion Accrual Remaining Amount check on the client side.
		 * By default, this check is only run on the server side.
		 * @returns {boolean} True to run the check on the client side; otherwise, false. Defaults to false.
		 * @example <caption>Activate the check on client side if the claim is not a big deduction</caption>
		 * RunPromotionAccrualRemainingAmountClientSide: function ()
		 * {
		 * 	return !Sys.Deductions.Checks.IsBigDeduction();
		 * }
		 */
		/*RunPromotionAccrualRemainingAmountClientSide: function ()
		{
			return false;
		}*/
	};

	return Checks;

})();
