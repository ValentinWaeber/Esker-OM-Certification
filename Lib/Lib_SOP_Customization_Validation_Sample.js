/**
 * SOP Package Validation script customization callbacks
 * @namespace Lib.SOP.Customization.Validation
 */

/* LIB_DEFINITION{
  "name": "Lib_SOP_Customization_Validation_Sample",
  "scriptType": "SERVER",
  "comment": "Custom library extending Customer Order Processing Validation script on server side",
  "versionable": false,
  "libraryType": "Lib",
  "require": []
}*/

var Lib = Lib || {};
Lib.SOP = Lib.SOP || {};
Lib.SOP.Customization = Lib.SOP.Customization || {};

Lib.SOP.Customization.Validation = (function ()
{
	/**
	 * @lends Lib.SOP.Customization.Validation
	 */
	var customization =
	{
		/**
		* @description This function will be called at the begining of SOP validation script.
		* If needed, use it to customize SOP validation.
		* Allows you to customize the order validation. This user exit is called at the beginning of the Validation script of the Customer Order Processing process.
		*
		* @returns To completely override the default validation script, return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution().
		* - Calling Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution() does not stop the script. The order validation proceeds. To prevent the order from being approved, call the Processing scripts API: Process.PreventApproval function.
		* @example
		* This user exit sets a warning message on the Total Quantity field when the sum of all the items quantities exceeds 30.
		* To run the example below, create a text field and name it z_Total_Quantity__.
		* 	<pre><code>function OnValidationScriptBegin()
		* 	{
		* 		if (Lib.SOP.Helpers.GetCustomContext().IsCurrentAction("autocomplete"))
		* 		{
		* 			var totalQuantity = 0;
		* 			var table = Data.GetTable("Product_List__");
		* 			for(var i=0; i<table.GetItemCount();i++)
		* 			{
		* 				var row = table.GetItem(i);
		* 				totalQuantity+= parseFloat(row.GetValue("Quantity__"));
		* 			}
		* 			Data.SetValue("Total_Quantity__", totalQuantity);
		* 			if(totalQuantity > 30)
		* 			{
		* 				Data.SetWarning("Total_Quantity__", "The quantity is too high for one shipment");
		* 			}
		* 		}
		* 	}</code></pre>

		* @example <caption>Example of a customisation hijacking the ERP ACKs in error to update the order.</caption>
		* <pre><code>// This is the XML format expected in the ERP ACK. Note that the ERPImportError tag now contains a JSON with a bool stating whether this erp ack has been generated because of a real error and
		* // the matching error message if it does, as well as a structure containing the new line items status and a bool to indicate whether it is the last update (which means the command can be validated
		* // without further input from the user or receiving of an ERP ACK).
		* //
		* // &lt;ERPAck&gt;
		* //     &lt;ERPID/&gt;
		* //     &lt;EskerOrderID&gt;CD#OS6IG0000FSX.540431959579458685&lt;/EskerOrderID&gt;
		* //     &lt;ERPImportError>{"isError": false, "errorMessage": "", "updatedLines": {"10": "Shipped", "20": "Shipped", "30": "Shipped", "40": "Shipped", "50": "Shipped", "60": "Waiting"}, "lastUpdate": false}&lt;/ERPImportError*gt;
		* //     &lt;Status/&gt;
		* //     &lt;RequestId&gt;&lt;/RequestId&gt;
		* // &lt;/ERPAck&gt;
		*
		* function OnValidationScriptBegin()
		*     {
		*         // Testing that the validation script has been triggered by the receiving of an ERP ACK
		*         if (Data.GetActionName() == "ERPAckError" && Data.GetActionType() == "ResumeWithAction") {
		*                 // Removing the '- ' added to every string inside an ERPImportError tag
		*                 var errorData = JSON.parse(Data.GetValue("Order_Creation_Error__").slice(2));
		*                 if (errorData.isError) {
		*                     // If this really is an ERP error, the data is filled accordingly and do nothing else is done
		*                     Data.SetValue("Order_Creation_Error__", errorData.errorMessage);
		*                 }
		*                 else {
		*                     // Custom case. Here the attribute "Z_Item_Status" of each line item is updated.
		*                     var item;
		*                     for (var line in errorData.updatedLines) {
		*                         for (var i = 0; i < Data.GetTable("Product_List__").GetItemCount(); ++i) {
		*                             item = Data.GetTable("Product_List__").GetItem(i);
		*                             if (item.GetValue("LineNumber__") === line) {
		*                                 item.SetValue("Z_Item_status__", errorData.updatedLines[line]);
		*                                 break;
		*                             }
		*                         }
		*                     }
		*                     // If this is the last update, the order is put in validated state and Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution() is returned to stop
		*                     // the rest of the validation script to run.
		*                     if (errorData.lastUpdate) {
		*                         Log.Info("Order will be updated and closed");
		*                         Data.SetValue("EnableTouchless", true);
		*                         Data.SetValue("Order_status__", "OrderAccepted");
		*                         Data.SetValue("IsClosed", 1);
		*                         Data.SetValue("ValidationState", 1);
		*                         Data.SetValue("Order_Creation_Error__", "");
		*                         return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution();
		*                     }
		*                     // If this isn't an error, setting the variable Order_Creation_Error__ to an empty string stops the custom script to display it
		*                     Data.SetValue("Order_Creation_Error__", "");
		*                 }
		*             }
		*     }</code></pre>
		**/
		OnValidationScriptBegin: function ()
		{
		},

		/**
		* @description This function will be called at the end of SOP validation script.
		* If needed, use it to customize SOP validation.
		* Allows you to perform operations after the order validation. This user exit is called at the end of the Validation script of the Customer Order Processing process.
		* - This user exit is not called if the OnValidationScriptBegin user exit stops the execution of the Validation script.
		*
		* @returns No return value expected
		*
		* @example
		* This user exit sets an error message on the Delivery date field when the delivery date is prior to the current date.
		* 	<pre><code>function OnValidationScriptEnd()
		* 	{
		* 		// additional validation on due date
		* 		var now = new Date();
		* 		var dueDate = Data.GetValue("Due_Date__");
		* 		if (dueDate.getTime() < now.getTime())
		* 		{
		* 			Data.SetError("Due_Date__", "Due date is unachievable");
		* 		}
		* 	}</code></pre>
		**/
		OnValidationScriptEnd: function ()
		{
		},

		/**
		* @description This function is called each time the function CheckTotal is called in the validation script
		* If needed, use it to bypass this check, override it or complete it.
		* Allows you to customize the Total field value check. This user exit is called from the Validation script of the Customer Order Processing process, each time the Total field value is checked.
		*
		* @returns To completely disable the standard Total field value check, return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution(). Otherwise, the standard check is also performed after the execution of this user exit.
		*
		* @example
		* This user exit prevents the Total field value to be checked when the script was triggered in touchless mode.
		* 	<pre><code>function CheckTotal()
		* 	{
		*		var context = Lib.SOP.Helpers.GetCustomContext();
		* 		if (context.IsCurrentAction("touchless"))
		* 		{
		* 			return context.DisableStandardExecution();
		* 		}
		* 	}</code></pre>
		*/
		CheckTotal: function ()
		{
		},

		/**
		* @description This function is called each time the function CheckDuplicate is called in the validation script
		* If needed, use it to bypass this check, override it or complete it.
		* Allows you to customize the duplicate check. This user exit is called from the Validation script of the Customer Order Processing process, each time the duplicates are checked.
		*
		* @returns To completely disable the standard duplicate check, return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution(). Otherwise, the standard duplicate check is also performed after the execution of this user exit.
		*
		* @example
		* This user exit prevents the duplicates to be checked when the script was triggered in touchless mode.
		* 	<pre><code>function CheckDuplicate()
		* 	{
		*		var context = Lib.SOP.Helpers.GetCustomContext();
		* 		if (context.IsCurrentAction("touchless"))
		* 		{
		* 			return context.DisableStandardExecution();
		* 		}
		* 	}</code></pre>
		*/
		CheckDuplicate: function ()
		{
		},

		/**
		* @description This function is called each time the function CheckDates is called in the validation script
		* If needed, use it to bypass this check, override it or complete it.
		* Allows you to customize the date fields check. This user exit is called from the Validation script of the Customer Order Processing process, each time the dates are checked.
		*
		* @returns To completely disable the standard date fields check, return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution(). Otherwise, the standard check is also performed after the execution of this user exit.
		*
		* @example
		* This user exit prevents the date fields to be checked when the script was triggered in touchless mode.
		* 	<pre><code>function CheckDates()
		* 	{
		*		var context = Lib.SOP.Helpers.GetCustomContext();
		* 		if (context.IsCurrentAction("touchless"))
		* 		{
		* 			return context.DisableStandardExecution();
		* 		}
		* 	}</code></pre>
		*/
		CheckDates: function ()
		{
		},

		/**
		* @description This function is called each time the function LineItemCheckQuantity is called in the validation script
		* If needed, use it to bypass this check, override it or complete it.
		* Allows you to customize the line items Quantity fields value check. This user exit is called from the Validation script of the Customer Order Processing process, each time the line items Quantity fields values are checked.
		*
		* @returns To completely disable the standard line items Quantity fields value check, return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution(). Otherwise, the standard check is also performed after the execution of this user exit.
		*
		* @example
		* This user exit prevents the line items Quantity fields value to be checked when the script was triggered in touchless mode.
		* 	<pre><code>function LineItemCheckQuantity()
		* 	{
		*		var context = Lib.SOP.Helpers.GetCustomContext();
		* 		if (context.IsCurrentAction("touchless"))
		* 		{
		* 			return context.DisableStandardExecution();
		* 		}
		* 	}</code></pre>
		*/
		LineItemCheckQuantity: function ()
		{
		},

		/**
		* @description This function is called each time the function LineItemCheckUnit is called in the validation script
		* If needed, use it to bypass this check, override it or complete it
		* Allows you to customize the line items Unit fields value check. This user exit is called from the Validation script of the Customer Order Processing process, each time the line items Unit fields values are checked.
		*
		* @returns To completely disable the standard line items Unit fields value check, return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution(). Otherwise, the standard check is also performed after the execution of this user exit.
		*
		* @example
		* This user exit prevents the line items Unit fields value to be checked when the script was triggered in touchless mode.
		* 	<pre><code>function LineItemCheckUnit()
		* 	{
		*		var context = Lib.SOP.Helpers.GetCustomContext();
		* 		if (context.IsCurrentAction("touchless"))
		* 		{
		* 			return context.DisableStandardExecution();
		* 		}
		* 	}</code></pre>
		*/
		LineItemCheckUnit: function ()
		{
		},

		/**
		* @deprecated Use LineItemCheckUnitPrice from Lib_SOP_Customization_Common instead
		* @description This function is called each time the function LineItemCheckUnitPrice is called in the validation script
		* If needed, use it to bypass this check, override it or complete it.
		* Allows you to customize the line items Unit price, Quantity and Total fields value check. This user exit is called from the Validation script of the Customer Order Processing process, each time the line items Unit price, Quantity and Total fields values are checked.
		*
		* @returns To completely disable the standard line items Unit price, Quantity and Total fields value check, return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution(). Otherwise, the standard check is also performed after the execution of this user exit.
		*
		* @example
		* This user exit prevents the line items Unit price, Quantity and Total fields value to be checked when the script was triggered in touchless mode.
		* 	<pre><code>function LineItemCheckUnitPrice()
		* 	{
		*		var context = Lib.SOP.Helpers.GetCustomContext();
		* 		if (context.IsCurrentAction("touchless"))
		* 		{
		* 			return context.DisableStandardExecution();
		* 		}
		* 	}</code></pre>
		*/
		LineItemCheckUnitPrice: function ()
		{
		},

		/**
		* @description This function is called each time the function CheckEmail is called in the validation script
		* The standard check is always enabled to prevent invalid e-mail address structure or special characters.
		* Allows you to customize the Contact field value check. This user exit is called from the Validation script of the Customer Order Processing process, each time the Contact field value is checked.
		* The standard check is also performed after the execution of this user exit.
		*
		* @example
		* This user exit prevents the Contact field value to use another domain than esker.com.
		* 	<pre><code>function CheckEmail()
		* 	{
		*		if (Data.GetValue("Contact_login__").indexOf("@esker.com") === -1)
		*		{
		*			Data.SetError("Contact_login__", "Only Esker e-mail address are allowed");
		*		}
		* 	}</code></pre>
		*/
		CheckEmail: function ()
		{
		},

		/**
		* @description This function is called each time the function TouchlessCheck is called in the validation script
		* If needed, use it to bypass this check, override it or complete it.
		* Allows you to customize the automatic processing of the order. This user exit is called from the Validation script of the Customer Order Processing process.
		*
		* @returns Boolean value indicating whether the custom checks are successful or not. Possible values are:
		* - true: All the custom checks for automatic processing are successful. The automatic processing of the order is considered possible only if the standard checks are also successful. If so, the Automatic processing is possible check box in the Automatic Processing pane of the Customer Order process is selected and the order is included in the SOP - Automatically processable orders by customer report.
		* - false: Not all the custom checks for automatic processing are successful and thus the automatic processing of the order is not considered possible. The Automatic processing is possible check box in the Automatic Processing pane of the Customer Order process is therefore unselected and the order is excluded from the SOP - Automatically processable orders by customer report. It does not stop the script. The order validation proceeds. To prevent the order from being approved, call the Processing scripts API: Process.PreventApproval function or put a field in error.
		*  You may also return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution() to completely disable the automatic processing checks performed as standard in the Customer Order process.
		*  Calling Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution() does not stop the script. The order validation proceeds. To prevent the order from being approved, call the Processing scripts API: Process.PreventApproval function or put a field in error.
		*
		* @example
		* This user exit verifies that the automatic processing is called from the right context.
		* 	<pre><code>function TouchlessCheck()
		* 	{
		*		Log.Info("Double check touchless action...");
		*		var context = Lib.SOP.Helpers.GetCustomContext();
		* 		if (context.IsCurrentAction("touchless") === false)
		* 		{
		*			Log.Info("TouchlessCheck called out of scope, canceling function call...");
		* 			return context.DisableStandardExecution();
		* 		}
		* 	}</code></pre>
		*
		* 	@example
		* This user exit retrieves the bill-to information from SAP. If the query retrieves more than one bill-to partner, the order automatic processing is not considered possible. In this case the order does not show in the SOP - Automatically processable orders by customer report.
		* 	<pre><code>TouchlessCheck: function ()
		* {
		*     var customerNumber = Data.GetValue("CustomerNumber__");
		*     var filter = "KUNNR = '" + Lib.SOP.SAP.Helpers.NormalizeID(customerNumber, 10) + "' AND PARVW = 'RE'";
		*     var results = Sys.OM.SAP.Query("KNVP", "KUNN2", filter, 1);
		*     if (results.length > 1)
		*     {
		*         Data.SetError("Z_Bill_to_Number__", "Multiple bill-to found. Please select manually");
		*         Data.SetValue("Z_TouchlessErrorMultipleBillTo__", "1");
		*         return false;
		*     }
		*     return true;
		* }</code></pre>
		*/
		TouchlessCheck: function ()
		{
		},

		/**
		 * @description This function is called when creating a new record, or updating an existing one, in table 'SO - Automatic processing__'.
		 * Use this function to add custom field values to this table.
		 * @param {xVars} recordVars : the record variables
		 * @param {bool} updateExistingRecord : false when the variables are from a newly created record, true when working on variables of an existing record.
		 *
		 * @example This example adds ship-to number as key for automatic processing in addition to the standard sold-to number.
		 * <pre><code>CustomizeAutomaticProcessingRecordVars: function (recordVars, updateExistingRecord)
		 * {
		 * 	recordVars.AddValue_String("Z_ShipToNumber__", Data.GetValue("ShipToNumber__"), 1);
		 * }</code></pre>
		 */
		CustomizeAutomaticProcessingRecordVars: function (recordVars, updateExistingRecord)
		{
		},

		/**
		* @description This function will be called at the begining of SOP Portal validation script.
		* If needed, use it to customize SOP Portal validation.
		*
		* @returns To stop the execution of the validation script: return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution()
		*
		* @example
		* This user exit skip standard validation.
		*<pre><code>function OnPortalValidationScriptBegin()
		*{
		*	return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution();
		*}</code></pre>
		**/
		OnPortalValidationScriptBegin: function ()
		{
		},

		/**
		* @description This function will be called at the end of SOP Portal validation script.
		* If needed, use it to customize SOP Portal validation.
		* This user exit is not called if the OnPortalValidationScriptBegin user exit stops the execution of the Validation script.
		*
		* @returns No return value expected
		**/
		OnPortalValidationScriptEnd: function ()
		{
		}
	};
	return customization;
})();