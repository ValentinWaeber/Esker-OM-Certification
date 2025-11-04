/**
 * SOP Package HTML script customization callbacks
 * @namespace Lib.SOP.Customization.HTMLScripts
 */

/* LIB_DEFINITION{
  "name": "Lib_SOP_Customization_HTMLScripts_Sample",
  "scriptType": "CLIENT",
  "comment": "Custom library extending Customer Order Processing HTML script on client side",
  "versionable": false,
  "libraryType": "Lib",
  "require": []
}*/

var Lib = Lib || {};
Lib.SOP = Lib.SOP || {};
Lib.SOP.Customization = Lib.SOP.Customization || {};

Lib.SOP.Customization.HTMLScripts = (function ()
{
	/**
	 * @lends Lib.SOP.Customization.HTMLScripts
	 */
	var customization =
	{
		/**
		* @description This function will be called at the beginning of SOP HTML script.
		 * If needed, use it to memorize information extracted that will be overriden by the default HTML script.
		 * Allows you to customize the Customer Order Processing form. This user exit is called at the beginning of the HTML page script of the Customer Order Processing process.
		 * In the LIB_SOP_ERP_ORDER library, the following functions are available and can be overridden through this user exit to customize the Customer Order Processing form.
		 * - The functions available in the LIB_SOP_ERP_ORDER library should not be modified. Instead you can override them through the OnHTMLScriptBegin user exit.
		*
		* @returns To disable the execution of the standard code: return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution()
		*
		* @example
		* This user exit saves the sales area value when the sales area is extracted from the document.
		* <pre><code>function OnHTMLScriptBegin()
		* {
		* 	if(Variable.GetValueAsString("Z_SalesAreaExtracted"))
		* 	{
		* 		this.mySalesArea = Data.GetValue("Sales_Area__");
		* 	}
		* }</code></pre>
		* @example
		* This user exit retrieves the currency associated with the selected customer and sets the Customer currency field. To use this user exit, add a ZCustomer_Number__ text field in the SOP - Currencies table definition.
		* <pre><code>OnHTMLScriptBegin: function ()
		* {
		*     var order = Lib.SOP.Helpers.GetOrder();
		*
		*     order.RetrieveAndSetHeaderCurrency = function ()
		*     {
		*         var table = {
		*         tableName: "SO - Currencies__",
		*         currency: "Currency__",
		*         customerNumber: "ZCustomer_Number__"
		*         };
		*
		*         var callback = function ()
		*         {
		*             if (!this.GetQueryError())
		*             {
		*                 var queryValue = this.GetQueryValue();
		*                 Data.SetValue("Currency__", queryValue.GetQueryValue("Currency__", 0));
		*             }
		*         };
		*
		*         var customerNumber = Controls.CustomerNumber__.GetValue();
		*         if (customerNumber != null)
		*         {
		*             var filter = table.customerNumber + "=" + customerNumber;
		*             Query.DBQuery(callback, table.tableName, table.currency, filter);
		*         }
		*     }
		* }</code></pre>
		**/
		OnHTMLScriptBegin: function ()
		{
		},
		/**
		* @description This function will be called at the end of SOP HTML script.
		 * If needed, use it to customize the SOP user interface.
		 * Allows you to customize the Customer Order Processing form. This user exit is called at the end of the HTML page script of the Customer Order Processing process.
		 * This user exit can also be used to customize the onChange events that are called when a field value is changed.
		 * - If you need to customize callback functions associated with control events, refer to HTML page script API: Control events.
		*
		* @returns No return value expected
		*
		* @example
		* This user exit shows or hides fields and renames fields. If the sales area was extracted from the document, the Sales area field is set to the value previously saved in the example 1 of the OnHTMLScriptBegin user exit.
		* <pre><code>function OnHTMLScriptEnd()
		* {
		* 	// customize fields
		* 	Controls.Business_Priority__.Hide(true);
		* 	Controls.Due_Date__.SetLabel("Requested Delivery Date");
		* 	Controls.Product_List__.Requested_Date__.SetLabel("Requested Delivery Date");
		* 	Controls.Product_List__.Unit_Price__.Hide(false);
		* 	Controls.Currency__.Hide(false);
		* 	if(Variable.GetValueAsString("Z_SalesAreaExtracted"))
		* 	{
		* 		Data.SetValue("Sales_Area__", this.mySalesArea);
		* 	}
		* }</code></pre>
		*
		* @example
		* This user exit sets the Sales area when the customer Number field value changes. In this user exit, the GetSalesAreaFromCustomerNumber function should be defined to suit your needs.
		* <pre><code>function OnHTMLScriptEnd()
		* {
		*	function extendedOnChange_CustomerNumber()
		*	{
		*		if (this.GetValue())
		*		{
		*			var number = this.GetValue();
		*			Data.SetValue("Sales_Area__", GetSalesAreaFromCustomerNumber(number));
		*		}
		*	}
		*	Lib.SOP.Helpers.InsertHandler(Controls.CustomerNumber__, "OnChange", extendedOnChange_CustomerNumber);
		* }</code></pre>
		*
		* @example
		* In this example, the Items table of the Customer Order Processing form has been customized with 2 new fields:
		* - Z_Suplier__ is a Select from a table field.
		* - Z_Warehouse__ is a Select from a combo box field.
		* This user exit adds the value of the Z_Warehouse__ field as an extra filter for the Z_Suplier__ field. An event is triggered when browsing the Z_Suplier__ field, in order to update the associated filter.
		* <pre><code>OnHTMLScriptEnd: function ()
		* {
		*     function SetSupplierExtraFilter()
		*     {
		*         var control = this;
		*         var item = control.GetItem();
		*         var warehouse = item.GetValue("Z_Warehouse__");
		*         var filter = "WAREHOUSE=" + warehouse;
		*         control.SetFilter(filter);
		*     }
		*     Lib.SOP.Helpers.InsertHandler(Controls.Product_List__.Z_Supplier__, "OnBrowse", SetSupplierExtraFilter);
		* }	</code></pre>
		**/
		OnHTMLScriptEnd: function ()
		{
		},
		/**
		 * @description This function is called when the shipping address number or the shipping address name browse popup is opened and before the query filter is built.
		 * The function is also called to apply the customization of the filter on all the related partner queries involved in the browsing process.
		 * If needed use it to customize the standard filter.
		 * Make sure the specified filter is valid (SQL syntax for connected SAP, LDAP syntax for generic ERP and non connected mode).
		 * Allows you to customize the filter used when browsing for partners in the Customer Order Processing process. This user exit is called from the HTML Page script of the Customer Order Processing process, while browsing for shipping addresses, when the dialog opens and before the filter is built.
		 *
		 * @returns {string} String value containing the filter. The filter syntax depends on the integrated ERP:
		 * - Use an LDAP filter syntax when the application is integrated with an ERP other than SAP. Refer to LDAP filters for more information about LDAP filters.
		 * - Use an SAP SQL filter syntax when the application is integrated with SAP.
		 *
		 * @example
		 * The following user exits add a filter when browsing for shipping addresses.
		 * <pre><code>function GetShipToExtraFilter()
		 * {
		 *	return "(&(Country_code__=FR)(Region__=69))"; // LDAP syntax sample.
		 * }
		 * </code></pre>
		 * <pre><code>function GetShipToExtraFilter()
		 * {
		 *	return "LOEVM <> 'X' AND KTOKD = '0001'"; // SAP SQL filter sample.
		 * }
		 * </code></pre>
		 * - To ensure compatibility with older versions of SAP, when using parenthesis blocks it is highly recommended to insert spaces between the parenthesis and the content.
		 * - For example, ( LOEVM <> 'X' AND KTOKD = '0001' ) instead of (LOEVM <> 'X' AND KTOKD = '0001').
		 */
		GetShipToExtraFilter: function ()
		{
		},
		/**
		 * @description This function is called when the customer number or the customer name browse popup is opened and before the query filter is built.
		 * The function is also called to apply the customization of the filter on all the related customer queries involved in the browsing process.
		 * If needed use it to customize the standard filter.
		 * Make sure the specified filter is valid (SQL syntax for connected SAP, LDAP syntax for generic ERP and non connected mode).
		 * Allows you to customize the filter used when browsing for customers in the Customer Order Processing process. This user exit is called from the HTML Page script of the Customer Order Processing process while browsing for customers, when the browse dialog opens and before the filter is built.
		 *
		 * @returns {string} String value containing the additional filter. The filter syntax depends on the integrated ERP:
		 * - Use an LDAP filter syntax when the application is integrated with an ERP other than SAP. Refer to LDAP filters for more information about LDAP filters.
		 * - Use an SAP SQL filter syntax when the application is integrated with SAP.
		 *
		 * @example
		 * The following user exits customize the filter applied when browsing for customers.
		 * <pre><code>function GetSoldToExtraFilter()
		 *{
		 *	return "(&(Country_code__=FR)(Region__=69))"; // LDAP syntax sample.
		 *}
		 * </code></pre>
		 * <pre><code>function GetSoldToExtraFilter()
		 *{
		 *	return "LOEVM <> 'X' AND KTOKD = '0001'"; // SAP SQL filter sample.
		 *}
		 * </code></pre>
		 * - To ensure compatibility with older versions of SAP, when using parenthesis blocks it is highly recommended to insert spaces between the parenthesis and the content.
		 * - For example, ( LOEVM <> 'X' AND KTOKD = '0001' ) instead of (LOEVM <> 'X' AND KTOKD = '0001').
		 */
		GetSoldToExtraFilter: function ()
		{
		},
		/**
		 * @description This function is called when browsing or checking the material in the customscript, except in connected SAP mode.
		 * If needed use it to customize the standard filter.
		 * Make sure the specified filter is valid (LDAP syntax for generic ERP and non connected mode).
		 * Allows you to customize the filter used when entering or browsing for materials in the Customer Order Processing process. This user exit is called from the HTML Page script of the Customer Order Processing process, while:
		 * - Checking materials entered manually.
		 * - Browsing for materials, when the dialog opens and before the filter is built.
		 * - When the application is integrated with SAP, this user exit is only applicable when the SAP master data are replicated locally.
		 *
		 * @returns {string} Return a string containing the extra filter if customization is needed.
		 *
		 * @example
		 * The following user exit customizes the filter applied when browsing for materials.
		 * <pre><code>function GetMaterialExtraFilter()
		 *{
		 *	var materialFilter = Controls.Sales_organization__.GetText();
		 *	if ( materialFilter != "")
		 *	{
		 *		materialFilter = "Sales_organization__=" + materialFilter ;
		 *		return materialFilter ;
		 *	}
		 *}
		 * </code></pre>
		 *
		 */
		GetMaterialExtraFilter: function ()
		{
		},
		/**
		 * @description This function will be called at the end of SOP Configurator HTML script.
		 * If needed, use it to customize the SOP configuration page.
		 * Allows you to customize the configuration tool of the Sales Order Processing application. This user exit is called at the end of the HTML Page script of the configuration tool.
		 *
		 * @returns No return value expected
		 *
		 * @example
		 * The following user exit sets the ERP and SAP configuration fields, and hides the ERP information pane.
		 * <pre><code>function OnConfiguratorHTMLScriptEnd()
		 * {
		 *	Data.SetValue("ERP__", "SAP");
		 *	Data.SetValue("SapConfiguration__", "CUSTOMER_ESKERDEMO");
		 *	Controls.ERP_pane.Hide(true);
		 * }</code></pre>
		 **/
		OnConfiguratorHTMLScriptEnd: function ()
		{
		},
		/**
		 * @description This function will be called when the 'Next' button is clicked in the SOP Configuration.
		 * Allows you to customize the configuration tool of the Sales Order Processing application. This user exit is called from the HTML Page script of the configuration tool, when the Next button is clicked.
		 * @param {string} stepTitle - String value indicating the untranslated name of the next step.
		 * To find the untranslated name of a step, proceed as follows:
		 * - Open the configuration tool in design mode.
		 * - Click Parameters > HTML page script.
		 * - Locate the variable defining the required step. The untranslated name is located in the title: element.
		 * @returns No return value expected
		 *
		 * @example
		 * The following user exit displays the My_New_Pane pane only at the Validation step of the configuration tool.
		 * <pre><code>function OnConfiguratorHTMLScriptNextButton(stepTitle)
		 * {
		 *		// We want to display our custom "My_New_Panel" when we are at 'Validation' step
		 *		//
		 *		var isPanelVisible = (stepTitle === "Validation");
		 *		Controls.My_New_Panel.Hide(!isPanelVisible);
		 * }</code></pre>
		 **/
		OnConfiguratorHTMLScriptNextButton: function (stepTitle)
		{
		},
		/**
		 * @description This function is called right after the header SAP texts have been loaded.
		 * If needed, implement it to add, modify or remove items within the retrieved SAP Texts.
		 * Allows you to customize the retrieved SAP texts before they are displayed in the Customer Order Processing form. This user exit is called from the HTML page script of the Customer Order Processing process.
		 * @param {Control} table - Deprecated parameter. Use Data.GetTable("SAPTextsTable__") instead to retrieve the SAP texts as a data table, rather than as a control that displays these data.
		 * @return No return value expected.
		 *
		 * @example
		 * This user exit adds a Ship ASAP SAP text if this one is not already part of the retrieved SAP texts.
		 * <pre><code>function OnSAPTextsTableFilled()
		 * {
		 *		// Adds a "Ship ASAP" SAP text if this one is not already part of the retrieved SAP texts.
		 * 		var label = "0002";
		 * 		var language = "E";
		 * 		var text = "Ship ASAP";
		 * 		var found = false;
		 * 		var table = Data.GetTable("SAPTextsTable__");
		 * 		var itemCount = table.GetItemCount();
		 * 		for (var index = 0; index < itemCount; index++)
		 * 		{
		 * 			var item = table.GetItem(index);
		 * 			if (item.GetValue("Label__") === label && item.GetValue("Language__") === language && item.GetValue("Text__") === text)
		 * 			{
		 * 				found = true;
		 * 				break;
		 * 			}
		 * 		}
		 * 		if (!found)
		 * 		{
		 * 			var newItem = table.AddItem();
		 * 			newItem.SetValue("Label__", label);
		 * 			newItem.SetValue("Language__", language);
		 * 			newItem.SetValue("Text__", text);
		 * 		}
		 * }
		 * </code></pre>
		*/
		OnSAPTextsTableFilled: function ()
		{
		},

		/**
		* @description This function will be called when the 'Previous' button is clicked in the SOP Configuration.
		* Allows you to customize the configuration tool of the Sales Order Processing application. This user exit is called from the HTML Page script of the configuration tool, when the Previous button is clicked.
		* @param {string} stepTitle - String value indicating the untranslated name of the next step.
		* To find the untranslated name of a step, proceed as follows:
		* - Open the configuration tool in design mode.
		* - Click Parameters > HTML page script.
		* - Locate the variable defining the required step. The untranslated name is located in the title: element.
		* @returns No return value expected
		*
		* @example
		* The following user exit displays the My_New_Pane pane only at the Validation step of the configuration tool.
		* <pre><code>function OnConfiguratorHTMLScriptPreviousButton(stepTitle)
		* {
		*		// We want to display our custom "My_New_Panel" when we are at 'Validation' step
		*		var isPanelVisible = (stepTitle === "Validation");
		*		Controls.My_New_Panel.Hide(!isPanelVisible);
		* }</code></pre>
		**/
		OnConfiguratorHTMLScriptPreviousButton: function (stepTitle)
		{
		},
		/**
		* @description This function will be called when the initializing the wizard in the SOP Configuration.
		* Allows you to customize steps of the configurator.
		* @param step The step to custom
		* @example
		* The following user exit will display the customization step.
		* <pre><code>function OnConfiguratorCustomizeStep(step)
		* {
		*		step.isVisible = function() { return true;};
		* }</code></pre>
		**/
		OnConfiguratorCustomizeStep: function (step)
		{
		},

		/**
		* @method Lib.SOP.Customization.HTMLScripts.OnConfiguratorCustomizeFields
		* @since 340
		* @description
		* User exit to allow dynamic customization of ConfigFields.fields configuration.
		* This enables consultants to modify field settings (hidden, required, default values, readonly)
		* for different ERP systems before the UI is initialized.
		* This user exit is called at the beginning of the Main function in the SOP Configuration.
		* @param {object} configFields - Reference to the ConfigFields object containing field configurations
		* @returns No return value expected
		*
		* @example <caption>This example shows how to display specific fields for Oracle EBS configuration.</caption>
		* OnConfiguratorCustomizeFields: function (configFields)
		* {
		*     // Example: Display EnableDropShipping__ and DisplayQuotationFields__ for Oracle EBS only
		*     // Array format: [hidden, required, defaultValue, readonly] — false for hidden means the field is visible
		*     configFields.fields.EnableDropShipping__["Oracle EBS"] = [false, false, null, false];  // Make visible for Oracle EBS (hidden = false)
		*     configFields.fields.DisplayQuotationFields__["Oracle EBS"] = [false, false, null, false];  // Make visible for Oracle EBS (hidden = false)
		* }
		**/
		OnConfiguratorCustomizeFields: function (configFields)
		{
			// Add your customizations here
		},

		/**
		* @description This function will be called at the end of the execution of the function 'UpdatePartnerNameAndAddressInformation'. This function is called when Partner_ID__.OnChange event is fired.
		* Allows you to customize the additional partners table in the Customer Order Processing process.
		* This user exit is called from the HTML Page script of the Customer Order Processing process, when the additional partner Number field value is changed.
		* When this userexit is called, only partner id and partner function has been retrieved.
		* @param {Control} controlChanged - The control being updated.
		* @returns No return value expected
		*
		* @example
		* The following user exit raises an error when the additional partner Number field is empty.
		* <pre><code>function OnAdditionalPartnerItemChange(controlChanged)
		* {
		*		// We want to display an error message when the Partner ID is set to empty
		*		if( controlChanged.GetItem().GetValue("Partner_ID__") === "" )
		*		{
		*			controlChanged.SetError("You must choose a partner");
		*
		*		}
		* }</code></pre>
		**/
		OnAdditionalPartnerItemChange: function (controlChanged)
		{
		},
		/**
		* @description This function will be called at the end of partner data retrieval.
		* Allows you to use or customize the additional partners table in the Customer Order Processing process.
		* This user exit is called from the HTML Page script of the Customer Order Processing process, when all the additional partner data are retrieved.
		* @param {Control} controlChanged - The control of the line of the retrieved partner.
		* @returns No return value expected
		*
		* @example
		* The following user exit set value on a custom field if the additional partner is of type CP.
		* <pre><code>function OnAdditionalPartnerItemRetrieved(controlChanged)
		* {
		*		if (controlChanged.GetItem().GetValue("Partner_Function__") === "CP")
		*		{
		*			Data.SetValue("Z_ContactPerson__", controlChanged.GetItem().GetValue("Partner_Name__"));
		*		}
		*		else
		*		{
		*			Data.SetValue("Z_ContactPerson__", "");
		*		}
		* }</code></pre>
		**/
		OnAdditionalPartnerItemRetrieved: function (controlChanged)
		{
		},
		/**
		* @description This function will be called when initializing the ConversationList control. It can be used to customize the columns displayed in conversations.
		* @param tableColumnsToDisplay - the default columns that will be displayed.
		* @returns Return the modified tableColumnsToDisplay.
		*
		* @example
		* <pre><code>function GetTableColumnsToDisplay(tableColumnsToDisplay)
		* {
		*		// We want to add an extra column (Recipient Company)
		*		tableColumnsToDisplay.push({
		*			label : "_Company",
		*			data : "recipientCompany",
		*			width : "20%"
		*		});
		* }</code></pre>
		**/
		GetTableColumnsToDisplay: function (tableColumnsToDisplay)
		{
			return tableColumnsToDisplay;
		},
		/**
		* @description This function will be called when the Pane Processing Options is either displayed or hidden.
		* It enables the possibility to manage the visibility of any added custom fields.
		* Allows you to display and hide customized fields that were added to the Show Processing Options / Hide Processing Options pane of the Customer Order Processing process. This user exit is called from the HTML Page script of the Customer Order Processing process, when the pane of the processing options is displayed (Hide Processing Options) or hidden (Show Processing Options).
		* @param {boolean} hide - Boolean value specifying whether the Show Processing Options / Hide Processing Options pane is currently displayed or hidden:
		* - true: The Show Processing Options / Hide Processing Options pane is currently hidden.
		* - false: The Show Processing Options / Hide Processing Options pane is currently displayed.
		* Use this parameter to display or hide customized fields in accordance with the Show Processing Options / Hide Processing Options pane.
		* @returns No return value expected
		*
		* @example
		* The following user exits displays or hides the Z_EmailTouchlessErrorQuantity__ customized field when the pane of the processing options is displayed or hidden.
		* <pre><code>function ProcessingOptionsHide(hide)
		* {
		*		Controls.Z_EmailTouchlessErrorQuantity__.Hide(hide);
		* }</code></pre>
		**/
		ProcessingOptionsHide: function (hide)
		{
		},
		/**
		* @description This function will be called when a ERP material changes (example: changing the extracted material number).
		* It enables the possibility to set the value of customized columns in the corresponding line-item of the product list.
		* @param {Item} item - The line item on which the ItemNumber__ was changed.
		* @returns No return value expected
		* @example
		* <pre><code>function OnMaterialChanged(item)
		* {
		*		var itemNumber = item.GetValue("ItemNumber__");
		*		if (!itemNumber)
		*		{
		*			item.SetError("ItemNumber__", "Invalid material");
		*		}
		* }</code></pre>
		**/
		OnMaterialChanged: function (item)
		{
		},
		/**
		 * @description This function will be called when the sold-to changes.  It enables the possibility to bypass the query for the new Customer's Material mapping
		 * Allows the Items table to retain its data on a sold-to change
		 *
		 * @returns To disable the execution of the standard code: return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution()
		 *
		 * @example
		 * The following user exit will keep all table data the same whenver the sold-to partner is changed
		 * <pre><code> function UpdateMaterialMappingOnCustomerChange()
		 * {
		 * 		return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution();
		 * }</code></pre>
		 *
		 **/
		UpdateMaterialMappingOnCustomerChange: function ()
		{
		},
		/**
		 * @description This function will be called when the customer number changes.
		 *
		 * @returns No return value expected
		 *
		 * @example
		 * The following user exit will  update item quantity conversions for the new customer
		 * <pre><code>function OnCustomerChange()
		 *{
		 *	var ProductListTable = Data.GetTable("Product_List__");
		 *	for (var i = 0; i < ProductListTable.GetItemCount(); i++)
		 *	{
		 *		var item = ProductListTable.GetItem(i);
		 *		Lib.SOP.Customization.Common.Materials.SetItemConvertedQuantityAndUOM(item);
		 *	}
		 *}</code></pre>
		 **/
		OnCustomerChange: function ()
		{
		},
		/**
		 * @description This function will be called when the shipTo number changes.
		 *
		 * @returns No return value expected
		 *
		 * @example
		 * The following user exit will  force priority to urgent for shipTo number 1000
		 * <pre><code>function OnShipToChange()
		 *{
		 *		if (Data.GetValue("ShipToNumber__") === "1000")
		 *		{
		 *			Data.SetValue("Business_Priority__", "1");
		 *		}
		 *}</code></pre>
		 **/
		OnShipToChange: function ()
		{
		},
		/**
		 * @description This function will be called when a portal user opens a COP portal record.
		 * It enables the possibility to override the "Configuration" process variable.
		 * @param {string} customerConfiguration - The configuration name associated to the customer (by the "OMConfiguration__" field of the "Customer_Extended_Delivery_Properties__" table).
		 * @returns No return value expected
		 * @example
		 * <pre><code>function GetCustomerConfiguration(customerConfiguration)
		 * {
		 *		if (!customerConfiguration)
		 *		{
		 *			return "GermanConfiguration";
		 *		}
		 * }</code></pre>
		 **/
		GetCustomerConfiguration: function (customerConfiguration)
		{
		},
		/**
		 * @description This function will be called when submitting a teaching request.  It enables the possibility to modify the teaching request "Subject" visible by the users.
		 * The subject can also be used in a policy to restrict the access to teaching requests.
		 *
		 * @param {string} subject  The default teaching request subject
		 * @returns The updated teaching request subject
		 * @example
		 * The following user exit will explicit the teaching segregation criteria in the subject, so that the theaching specialist knows the scope of the teaching.
		 * <pre><code>function GetTeachingRequestSubject(subject)
		 * {
		 * 	var teachingFolder = Sys.OM.Helpers.GetConfiguration().Supplementary_Rule_Folder;
		 *	if (teachingFolder.length > 0)
		 *	{
		 *		subject = teachingFolder + " " + subject;
		 *	}
		 *	return subject;
		 * }</code></pre>
		 */
		GetTeachingRequestSubject: function (subject)
		{
			return subject;
		},
		/**
		 * @description This function will be called once the 'Additional Partners' table has finished loading.
		 * Allows you to write code that relies on all the data in the Additional Partners table to be complete.
		 * This user exit is called from the custom script of the Customer Order Processing process, when all promised queries to fill the Additional Partners table have been resolved.
		 * @returns No return value expected
		 *
		 * @example
		 * The following user exit logs the Partner ID and Partner name of each "Payer"
		 * <pre><code>function OnPartnersTableLoadEnd()
		 * {
		 *	const table = Data.GetTable("Partners__");
		 *	for (var i = 0; i < table.GetItemCount(); i++) {
		 *		var functionID = table.GetItem(i).GetValue("Partner_Function__");
		 *		if(functionID.toUpperCase() === 'PY') {
		 *			Log.Info("Partner ID: "+ table.GetItem(i).GetValue("Partner_ID__"));
		 *			Log.Info("Partner name: "+ table.GetItem(i).GetValue("Partner_name__"));
		 *		}
		 *	}
		 * }</code></pre>
		 **/
		OnPartnersTableLoadEnd: function ()
		{
		},
		/**
		 * @description This function will be called when the authentication response token doesn't have the information "expires_in".
		 * It enables the possibility to set a customized expiration date.
		 * @param {string} tokenResponseObject - The full JavaScript object returned by the authentication server.
		 * The token format might not be the standard one, but the expiration information might still be transmitted and so it could be used.
		 * @returns the customized expiration date for the retrieved token
		 * @example
		 * <pre><code>function OnSapWebServiceTokenExpirationSet(tokenResponseObject)
		 * {
		 *		var tokenExpirationDate = new Date();
		 *		// this token will expire after 1 hour
		 *		tokenExpirationDate.setSeconds(tokenExpirationDate.getSeconds() + 3600);
		 *		return tokenExpirationDate;
		 * }</code></pre>
		 **/
		OnSapWebServiceTokenExpirationSet: function (tokenResponseObject)
		{
		},

		/**
		 * @description Userexit to utilize custom code at the end of quotation load client side
		 * @param {Object} quotationData - The quote data returned from SAP when a quote is loaded
		 * @returns No return value expected
		 * @example Set Delivery Block from Quote Payment Terms.
		 * <pre><code>function OnLoadQuotationEndClient()
		 * {
		 *	var paymentTerms = Data.GetValue("Payment_Terms__");
		 *	if(paymentTerms === "Z1") {
		 *		Data.SetValue("Delivery_block__", "Z1");
		 *	}
		 * }</code></pre>
		 **/
		OnLoadQuotationEndClient: function (quotationData)
		{
		},

		/**
		 * @description Userexit to utilize custom code at the end of quotation unload client side
		 * @returns No return value expected
		 */
		OnUnloadQuotationEndClient: function ()
		{
		},

		/**
		 * @description Callback function for a successful sold-to browse query.
		 *
		 * @param {Object} queryValue - The query result object.
		 * @param {Object} resultTable - The result table in dialog window related to the query.
		 * @param {Object} dialog - The dialog associated with the query.
		 * @returns {void}
		 * @example See OnShipToBrowseQuerySuccess function for a similar example.
		 */
		OnSoldToBrowseQuerySuccess: function (queryValue, resultTable, dialog)
		{
		},

		/**
		 * @description Callback function for a successful ship-to browse query.
		 *
		 * @param {Object} queryValue - The query result object.
		 * @param {Object} resultTable - The result table in dialog window related to the query.
		 * @param {Object} dialog - The dialog associated with the query.
		 * @returns {void}
		 * @example Updates the query result records with the unique set of records.
		 * <pre><code>OnShipToBrowseQuerySuccess: function (queryValue, resultTable, dialog)
		 * {
		 * 	if (Sys.OM.Helpers.GetConfiguration().ERP === "Generic") {
		 *		let uniqueShipToNumbers = [];
		 *		let uniqueRecords = [];
		 *		let numberIndex = queryValue.RecordsDefinition.NUMBER__;
		 *		queryValue.Records.forEach(record =>
		 *		{
		 *			let shipToNumber = record[numberIndex];
		 *			if (uniqueShipToNumbers.indexOf(shipToNumber) < 0)
		 *			{
		 *				uniqueShipToNumbers.push(shipToNumber);
		 *				uniqueRecords.push(record);
		 *			}
		 *		});
		 *		queryValue.Records = uniqueRecords;
		 *	}
		 * }</code></pre>
		 */
		OnShipToBrowseQuerySuccess: function (queryValue, resultTable, dialog)
		{
		},

		/**
		 * @description Customizes the behavior of the default 'Archive Only' dialog by extending its functionality.
		 *
		 * @param {Function} [fillDialogBoxDefaultFn] - The default fillDialogBox handler function.
		 * @param {Function} [commitDialogBoxDefaultFn] - The default commitDialogBox handler function.
		 * @param {Function} [validateDialogBoxDefaultFn] - The default validateDialogBox handler function.
		 * @returns {Object} An object containing customized dialog handlers (optionals). See below example for details
		 *
		 * @example This example adds a list of reasons for archiving an order, with a comment.
		 * <pre><code>CustomizeArchiveOnlyDialog: function (fillDialogBoxDefaultFn, commitDialogBoxDefaultFn, validateDialogBoxDefaultFn)
		 * {
		 * 	return {
		 * 		fillDialogBox: function (dialog, tabId, event, control)
		 * 		{
		 * 			// Call default fillDialogBox handler
		 * 			fillDialogBoxDefaultFn(dialog, tabId, event, control);
		 *
		 * 			// Add custom fields to the dialog
		 * 			var archiveReasons = ["Manually processed in ERP", "Duplicate order"].join("\n");
		 * 			var cb_control = dialog.AddComboBox("Z_ArchiveReasons", "Archive reason", 200);
		 * 			cb_control.SetAvailableValues(archiveReasons);
		 * 			dialog.AddMultilineText("Z_ArchiveComments", "Comments", 200);
		 * 		},
		 * 		commitDialogBox: function (dialog, tabId, event, control)
		 * 		{
		 * 			// Get custom fields values
		 * 			var reason = dialog.GetControl("Z_ArchiveReasons").GetValue();
		 * 			var comment = dialog.GetControl("Z_ArchiveComments").GetValue();
		 * 			Data.SetValue("Z_Archive_reason__", reason);
		 * 			Data.SetValue("Z_Archive_comment__", comment);
		 *
		 * 			// Call default commitDialogBox handler
		 * 			return commitDialogBoxDefaultFn(dialog, tabId, event, control);
		 * 		},
		 * 		validateDialogBox: function (dialog, tabId, event, control)
		 * 		{
		 * 			// Call default validateDialogBox handler and add custom logic, or replace whole logic
		 * 			return validateDialogBoxDefaultFn(dialog, tabId, event, control);
		 * 		}
		 * 	};
		 * }</code></pre>
		 */
		CustomizeArchiveOnlyDialog: function (fillDialogBoxDefaultFn, commitDialogBoxDefaultFn, validateDialogBoxDefaultFn)
		{
		},

		/**
		 * @description This user exit gives ability to reuse existing Controls.CustomerName__.OnChange handler to specialized sold-to partner search.
		 *
		 * @param {object} searchTableDefinition Object containing definition of sold-to table fields (Lib.SOP.SAP.Tables.ZESK_CUSTOMERS in SAP connected mode or Lib.SOP.SAP.Tables.customerTable in generic integration).
		 * @param {object} controlChanged The control object on which the OnChange event has been triggered.
		 *
		 * @example This example handles sold-to search based on a custom Z_CustomerVATNumber__ field.
		 * We suppose the following code has been called in OnHTMLScriptEnd:
		 * Controls.Z_CustomerVATNumber__.OnChange = Controls.CustomerName__.OnChange;
		 * <pre><code>OnSoldToSearchAfterControlChanged: function (searchTableDefinition, controlChanged) {
		 * 	var customFilterField;
		 * 	var customFilterValue = controlChanged.GetValue();
		 * 	if (controlChanged.GetName() === "Z_CustomerVATNumber__") {
		 * 		Controls.CustomerNumber__.SetValue("");
		 * 		customFilterField = searchTableDefinition.vat;
		 * 		customFilterValue += "*";
		 * 	}
		 * 	return { customFilterField, customFilterValue };
		 * };</code></pre>
		 */
		OnSoldToSearchAfterControlChanged: function (searchTableDefinition, controlChanged)
		{
		},

		/**
		 * @description Disables the required fields checks for line items when validating an order.
		 * @returns {boolean} Returns true to indicate that the required fields checks for line items should be disabled.
		 *
		 * @example
		 * In the provided example, the required fields checks for line items are conditionally disabled based on the
		 * configuration setting 'Z_ALLOWQUOTEWITHNOITEMS__' and the absence of a quotation number ('Z_QuotationNumber__').
		 * If the configuration allows quotes with no items and there is no quotation number, this function returns true,
		 * indicating that the required fields checks for line items should be disabled.
		 * Otherwise, it returns false, indicating that the standard required fields checks should be performed.
		 *
		 * <pre><code>DisableLineItemRequiredFieldsChecks: function ()
		 * {
		 *    // Implementation logic to conditionally disable required fields checks for line items
		 *    if (Sys.OM.Helpers.GetConfiguration().Z_ALLOWQUOTEWITHNOITEMS__ === "1" && !Data.GetValue("Z_QuotationNumber__"))
		 *    {
		 *        return true; // Disables required fields checks
		 *    }
		 *    return false; // Performs standard required fields checks
		 * }</code></pre>
		 */
		DisableLineItemRequiredFieldsChecks: function ()
		{
		},

		/**
		* @description This user exit is triggered when a contract is selected from the search results.
		* It allows for performing additional actions or custom logic after the contract selection.
		* @param {IControl} parentControl The table control that contains the selected contract
		* @param {ITableRow} tableItem The selected table row item containing contract information
		* @example
		* <pre><code>
		* OnSelectContract: function (parentControl, tableItem)
		* {
		*		const contractEndDate = tableItem.GUEEN.GetValue();
		*		Data.SetValue("ContractEndDate__", contractEndDate);
		* };
		* </code></pre>
		*/
		OnSelectContract: function (parentControl, tableItem)
		{
		},

		/**
		* @description This user exit is triggered when a quote is selected from the search results.
		* It allows for performing additional actions or custom logic after the quote selection.
		* @param {IControl} parentControl The table control that contains the selected quote
		* @param {ITableRow} tableItem The selected table row item containing quote information
		* @example
		* <pre><code>
		* OnSelectQuote: function (parentControl, tableItem)
		* {
		*		const quoteEndDate = tableItem.GUEEN.GetValue();
		*		Data.SetValue("Z_QuoteEndDate__", quoteEndDate);
		* };
		* </code></pre>
		*/
		OnSelectQuote: function (parentControl, tableItem)
		{
		},

		/**
		 * @description This user exit is triggered when a contract item is selected.
		 * It allows for performing additional actions or custom logic after the contract item selection.
		 * @param {Item} productListRowItem The product list row table item
		 * @param {Lib.SOP.Contracts.QuantityContractItem} selectedContractItem The selected contract item object
		 * @example
		 * <pre><code>
		 * OnSelectContractItem: function (productListRowItem, selectedContractItem)
		 * {
		 *     const productCode = selectedContractItem.productCode;
		 *     productListRowItem.SetValue("ItemProductCode__", productCode);
		 *     // Perform additional actions or custom logic using the item and/or the itemNumber
		 * };
		 * </code></pre>
		 */
		OnSelectContractItem: function (productListRowItem, selectedContractItem)
		{
		},

		/**
		 * @description This user exit is triggered when a quote item is selected.
		 * It allows for performing additional actions or custom logic after the quote item selection.
		 * @param {Item} productListRowItem The product list row table item
		 * @param {Lib.SOP.Quotes.QuoteItem} selectedQuoteItem The selected quote item object
		 * @example
		 * <pre><code>
		 * OnSelectQuoteItem: function (productListRowItem, selectedQuoteItem)
		 * {
		 *     const productCode = selectedQuoteItem.productCode;
		 *     productListRowItem.SetValue("ItemProductCode__", productCode);
		 *     // Perform additional actions or custom logic using the item and/or the itemNumber
		 * };
		 * </code></pre>
		 */
		OnSelectQuoteItem: function (productListRowItem, selectedQuoteItem)
		{
		},

		//#region Portal customization

		/**
		 * @description This user exit allows us to keep table fields values between COPo and catalog using mapping.
		 * It also retrieves custom fields when querying items from the catalog.
		 * @returns { object } - Object using portal column name for key and catalog column name for value.
		 *
		 * @example Mapping between portal column Z_Collective_number_portal__ and catalog items columns Z_Collective_number_catalog__.
		 * <pre><code>GetPortalCatalogExtraFieldsMapping: function ()
		 * {
		 *	return {
		 *		"Z_Collective_number_portal__" : "Z_Collective_number_catalog__"
		 *	};
		 * }</code></pre>
		 */
		GetPortalCatalogExtraFieldsMapping: function ()
		{
		},

		/**
		 * @description This user exit is triggered on shipTo browse opening.
		 * It allows you to add or remove columns to display on shipTo browse.
		 * @param columns List of column to display. Each column contains id, label, type and width.
		 * @example Add new column NAME_4__ from table
		 * <pre><code>CustomizePortalShipToColumnsToDisplay: function (columns)
		 * {
		 *     columns.push({ id: "NAME_4__", label: "Name ext", type: "STR", width: 50 });
		 * };
		 * </code></pre>
		 */
		CustomizePortalShipToColumnsToDisplay: function (columns)
		{
		},
		/**
		* @description This function will be called at the beginning of Customer order portal HTML script.
		 * If needed, use it to memorize information extracted that will be overriden by the default HTML script.
		 * Allows you to customize the Customer order portal form.
		 * @example Disable the execution of the standard code
		 * <pre><code>OnPortalHTMLScriptBegin: function ()
		 * {
		 *     return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution();
		 * };
		 * </code></pre>
		*/
		OnPortalHTMLScriptBegin: function ()
		{
		},
		/**
		* @description This function will be called at the end of Customer Order portal HTML script.
		 * If needed, use it to customize the Customer Order portal form.
		 * This user exit can also be used to customize the onChange events that are called when a field value is changed.
		 * - If you need to customize callback functions associated with control events, refer to HTML page script API: Control events.
		*
		* @returns No return value expected
		*
		* @example
		* This user exit hides Currency field depending on the value of the EnableCatalogPrices configuration field.
		* <pre><code>function OnPortalHTMLScriptEnd()
		* {
		* 	// customize fields
		*	var hidePrices = !(Sys.OM.Helpers.GetConfiguration().EnableCatalogPrices === "1" || Lib.SOP.Helpers.IsERP("SAP"));
		* 	Controls.Currency__.Hide(hidePrices || true);
		* }</code></pre>
		**/
		OnPortalHTMLScriptEnd: function ()
		{
		},
		/**
		 * @description This function will be called when the shipTo number changes in the Customer order portal form.
		 *
		 * @returns No return value expected
		 *
		 * @example
		 * The following user exit will compute prices automatically when the shipTo number is changed
		 * <pre><code>function OnPortalShipToChange()
		 *{
		 *		Controls.ComputePrices_Button__.OnClick();
		 *}</code></pre>
		 **/
		OnPortalShipToChange: function ()
		{
		},
		/**
		 * @description This user exit is triggered on reloading previous order.
		 * It allows you to clone some fields from previous portal order.
		 * @param fields List of fields to keep on new order.
		 * @returns No return value expected
		 * @example Recopy field Z_User_portal__ to new order
		 * <pre><code>CustomizeClonePortalOrderFields: function (fields)
		 * {
		 *     fields.push("Z_User_portal__");
		 * };
		 * </code></pre>
		 */
		CustomizeClonePortalOrderFields: function (fields)
		{
		},
		/**
		* @description This function will be called at the beginning of the SO - Portal catalog HTML script.
		* If needed, use it to memorize information extracted that will be overriden by the default HTML script.
		*
		* @example Disable the execution of the standard code
		* <pre><code>OnCatalogItemHTMLScriptBegin: function ()
		* {
		*     return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution();
		* };
		* </code></pre>
		*/
		OnCatalogItemHTMLScriptBegin: function ()
		{
		},
		/**
		* @description This function will be called at the end of the SO - Portal catalog HTML script.
		 * If needed, use it to customize the SO - Portal catalog user interface.
		 * This user exit can also be used to customize the onChange events that are called when a field value is changed.
		 * - If you need to customize callback functions associated with control events, refer to HTML page script API: Control events.
		*
		* @returns No return value expected
		*
		* @example
		* This user exit customizes the CategoryId__ style to highlight the field.
		* <pre><code>function OnCatalogItemHTMLScriptEnd()
		* {
		* 	// customize fields
		*	Controls.CategoryId__.AddStyle("highlight");
		* }</code></pre>
		**/
		OnCatalogItemHTMLScriptEnd: function ()
		{
		},

		/**
		* @description This function is used in portal catalog to add data to item unique id, in addition to RUIDEX.
		* You can add several items in catalog with same item ID.
		* You need to implement GetPortalCatalogExtraFieldsMapping if you want to use portal custom column as part of the unique key.
		* You can implement CustomizeCatalogItemDescription to change the description of the item in summary.
		*
		* @param item Current item catalog. You can get field value on it.
		* @returns { string } The supplementary unique key for the item.
		*
		* @example
		* This user exit uses custom field to differentiate items. Several items can have same item ID for different end user.
		* <pre><code>function GetSupplementaryCatalogItemUniqueKey(item)
		* {
		* 	return item["Z_Enduser_company__"];
		* }</code></pre>
		**/
		GetSupplementaryCatalogItemUniqueKey: function (item)
		{
		},

		/**
		* @description This function allows you to change item description displaying in the catalog summary.
		*
		* @param item Current item catalog. You can get field value on it.
		* @returns { string } The item description in summary.
		*
		* @example
		* This user exit add the value of custom field between parenthesis after standard description.
		* <pre><code>function CustomizeCatalogItemDescription(item)
		* {
		* 	return item["DESCRIPTION__"] + (item["Z_Enduser_company__"] ? " (" + item["Z_Enduser_company__"] + ")" : "");
		* }</code></pre>
		**/
		CustomizeCatalogItemDescription: function (item)
		{
		},

		/**
		* @description This function allows you to customize the catalog card data before it is displayed.
		* It is called for each card retrieved from the catalog.
		*
		* @param {object} card The catalog card data (CardData object). Properties include:
		* 						ruidex, productName, currency, imgUrl, rawData, quantity,
		* 						unitOfMeasure, itemType, itemNumber, unitPrice, rawData,
		* 						hideImageInLinesMode, numberOfOrders, lastOrderDate, vendorNumber.
		* 						rawData contains the raw data from the catalog item, which can be used to access additional fields.
		* @returns {object} The modified catalog card data.
		*
		* @example
		* This user exit modifies the product name.
		* <pre><code>function CustomizeCatalogCard(card)
		* {
		*	// Example: only use the description as product name
		*	card.productName = card.rawData.DESCRIPTION__;
		* 	return card;
		* }</code></pre>
		**/
		CustomizeCatalogCard: function (card)
		{

		},

		/**
		 * @description This user exit is triggered at the start of HTML script of the portal catalog.
		 * It allows you to customize the portal cart.
		 * @returns No return value expected
		 * @example
		 * <pre><code>function OnPortalCartHTMLScriptBegin()
		 * {
		 * 		// Add custom logic here
		 * }</code></pre>
		 */
		OnPortalCartHTMLScriptBegin: function ()
		{
		},

		/**
		* @description This user exit is triggered at the end of HTML script of the portal catalog.
		* It allows you to customize the portal cart.
		* @returns No return value expected
		* @example
		* <pre><code>function OnPortalCartHTMLScriptEnd()
		* {
		* 		// Add custom logic here
		* }</code></pre>
		* @example
		* The following user exit populates a treeview control with categories and subcategories from the SO - Portal catalog__ table.
		* It should be used with GetCustomCatalogItemsCartFilter user exit to filter items based on the selected category/subcategory.
		* <pre><code>function OnPortalCartHTMLScriptEnd()
		* {
		* 	let items = [
		* 		{
		* 			id: "*",
		* 			name: "All Categories"
		* 		}
		* 	];
		*
		* 	let callbackCategories = function (queryResults, err) {
		* 		if (err)
		* 		{
		* 			Popup.Alert(Language.Translate("_Unexpected error message"));
		* 			Log.Verbose("GetCategoriesList query error: " + err);
		* 			Log.Error("GetCategoriesList query error: " + err);
		* 			return;
		* 		}
		* 		let categoryIdList = {
		* 			"*": "*"
		* 		};
		*
		* 		if (queryResults)
		* 		{
		* 			queryResults.forEach(res =>
		* 			{
		* 				if (!res)
		* 				{
		* 					return;
		* 				}
		*
		* 				const {CATEGORYID__, Z_SUBCATEGORY1__, Z_SUBCATEGORY2__} = res;
		*
		* 				if (!categoryIdList[CATEGORYID__])
		* 				{
		* 					categoryIdList[CATEGORYID__] = CATEGORYID__;
		* 				}
		*
		* 				const categoryItem = {
		* 					id: CATEGORYID__,
		* 					name: CATEGORYID__
		* 				};
		*
		* 				const subcategory1Item = Z_SUBCATEGORY1__
		* 					?
		* 					{
		* 						id: Z_SUBCATEGORY1__,
		* 						name: Z_SUBCATEGORY1__,
		* 						parent: CATEGORYID__,
		* 					}
		* 					:
		* 					null;
		*
		* 				const subcategory2Item = Z_SUBCATEGORY2__
		* 					?
		* 					{
		* 						id: Z_SUBCATEGORY2__,
		* 						name: Z_SUBCATEGORY2__,
		* 						parent: Z_SUBCATEGORY1__,
		* 					}
		* 					:
		* 					null;
		*
		* 				items.push(categoryItem);
		*
		* 				if (subcategory1Item)
		* 				{
		* 					items.push(subcategory1Item);
		* 				}
		*
		* 				if (subcategory2Item)
		* 				{
		* 					items.push(subcategory2Item);
		* 				}
		* 			});
		*
		* 			let treeview_options = {
		* 				GetChildren: function (parentID) {
		* 					const rootItems = (item) => !item.parent;
		* 					const childItems = (item) => item.parent === parentID;
		*
		* 					const children = items.filter(parentID ? childItems : rootItems);
		* 					return children.map(child => (
		* 						{
		* 							id: child.id,
		* 							value: child.name
		* 						}));
		* 				},
		* 				DisplayParent: "all",
		* 				// AllLabel: "All",
		* 				ChildrenFilter: null
		* 			};
		*
		* 			Controls.VerticalTreeview__.Init(treeview_options, false);
		*
		* 			const oldOSI = Controls.VerticalTreeview__.OnSelectItem;
		*
		* 			Controls.VerticalTreeview__.OnSelectItem = function (id) {
		* 				oldOSI(id);
		* 				if (id)
		* 				{
		* 					const clickedItem = items.find(item => item.id === id);
		* 					// Logs the details of the selected item.
		* 					Log.Info(`Item ${clickedItem.name} has been selected: id=${clickedItem.id}, parentID=${clickedItem.parent}`);
		* 					Controls.VerticalTreeview__.UpdateOptions(treeview_options, false, id === "*" ? null : id);
		* 				}
		* 			};
		* 		}
		* 	};
		* 	Sys.GenericAPI.Query("SO - Portal catalog__", "", ["CATEGORYID__", "Z_SUBCATEGORY1__", "Z_SUBCATEGORY2__"], callbackCategories, "CATEGORYID__ ASC", "no_limit", null, ["CATEGORYID__", "Z_SUBCATEGORY1__", "Z_SUBCATEGORY2__"]);
		* }</code></pre>
		*/
		OnPortalCartHTMLScriptEnd: function ()
		{
		},

		/**
		 * @description
		 * This function will be called to override filter when querying items from the catalog in the portal cart.
		 * It is called instead of buildItemsFilter function.
		 * @param {string} categorySelected - The selected category from the VerticalTreeview.
		 * @param {string} searchValue - The search value entered by the user at the top of the catalog page.
		 * @param {Array<Sys.Helpers.LdapUtil.IFilter>} extraFilters - The extra filters applied to the catalog query.
		 * @returns {Sys.Helpers.LdapUtil.IFilter | null} The new filter to apply to the catalog query, or null to use the default filter.
		 *
		 * @example <caption>The following user exit implements sub-categories based on fields on item</caption>
		 * function GetCustomCatalogItemsCartFilter(categorySelected, searchValue, extraFilters)
		 * {
		 * 	let ldapUtil = Sys.Helpers.LdapUtil;
		 * 	let searchFilterDescription = searchValue || "*";
		 * 	let allFilters = [];
		 * 
		 * 	// Category
		 * 	let categoryFilter;
		 * 	let searchFilterItemCategories = [];
		 * searchFilterItemCategories.push(categorySelected);
		 * 
		 * if (searchFilterItemCategories.length >= 1 && searchFilterItemCategories[0] !== "*")
		 * {
		 * 	categoryFilter = ldapUtil.FilterOr(
		 * 		ldapUtil.FilterContains("CATEGORYID__", searchFilterItemCategories[0]),
		 * 		ldapUtil.FilterContains("Z_SUBCATEGORY1__", searchFilterItemCategories[0]),
		 * 		ldapUtil.FilterContains("Z_SUBCATEGORY2__", searchFilterItemCategories[0])
		 * 	);
		 * 	allFilters.push(categoryFilter);
		 * }
		 * 
		 * // Search value
		 * if (searchFilterDescription !== "*")
		 * {
		 * 	allFilters.push(
		 * 		ldapUtil.FilterOr(
		 * 			ldapUtil.FilterContains("Description__", searchFilterDescription),
		 * 			ldapUtil.FilterContains("ITEMNUMBER__", searchFilterDescription)
		 * 		)
		 * 	);
		 * }
		 * 
		 * if (extraFilters)
		 * {
		 * 	extraFilters.forEach((f) =>
		 * 	{
		 * 		allFilters.push(f);
		 * 	});
		 * }
		 * if (this._enableCatalogPrices)
		 * {
		 * 	allFilters.push(this.buildItemsPricesFilter());
		 * }
		 * if (this._filterCatalogWithCustomerSalesArea)
		 * {
		 * 	allFilters.push(this.buildSalesAreaFilter());
		 * }
		 * 
		 * return ldapUtil.FilterAnd(...allFilters);
		 * }
		 * 
		 **/
		GetCustomCatalogItemsCartFilter: function (categorySelected, searchValue, extraFilters)
		{
			return null;
		},

		//#endregion

		/**
		 * @description
		 * This function is called when clicking on a conversation button (examples: "Reply All", "New Message"...)
		 * It allows to modify the options used in the conversation popup.
		 * @param {object} conversationOptions Object containing the options of the conversation popup.
		 * @param {string} conversationAction String indicating the conversation action (examples: "ReplyAll", "NewConversation", "ForwardConversation", "ForwardMessage"...)
		 * @returns {object} The updated conversation popup options
		 * @example Add default recipients to a new conversation:
		 * <pre><code>ModifyConversationPopupOptions: function (conversationPopupOptions, conversationAction)
		 * {
		 * 	switch (conversationAction)
		 * {
		 * 		case "NewConversation":
		 * 			conversationPopupOptions.AddDefaultEmailAddressAsRecipient = true;
		 * 			break;
		 * }
		 * 	return conversationPopupOptions;
		 * }</code></pre>
		 **/
		ModifyConversationPopupOptions: function (conversationPopupOptions, conversationAction)
		{
			return conversationPopupOptions;
		},
		/**
		 * @description This user exit allows you to completely override the filter applied to the Sold-To partner browse.
		 * If you instead want to extend the existing filter, use the GetSoldToExtraFilter user exit.
		 * If your configurations involve multiple ERPs, make sure to add conditions in your code to ensure that customizations 
		 * only affect the intended ERP and do not interfere with others.
		 * @param {string} filter The current filter applied to the Sold-To partner browse.
		 * @returns {string} The new filter to apply to the Sold-To partner browse.
		 */
		OverrideSoldToFilter: function (filter)
		{
			return filter;
		},
		/**
		 * @description This user exit allows you to completely override the filter applied to the Ship-To partner browse.
		 * If you instead want to extend the existing filter, use the GetShipToExtraFilter user exit.
		 * If your configurations involve multiple ERPs, make sure to add conditions in your code to ensure that customizations 
		 * only affect the intended ERP and do not interfere with others.
		 * @param {string} filter The current filter applied to the Ship-To partner browse.
		 * @returns {string} The new filter to apply to the Ship-To partner browse.
		 */
		OverrideShipToFilter: function (filter)
		{
			return filter;
		},
		/**
		 * @description This user exit allows you to change the target table (or view) used for the Sold-To partner browse.
		 * If your configurations involve multiple ERPs, make sure to add conditions in your code to ensure that customizations 
		 * only affect the intended ERP and do not interfere with others.
		 * @param {string} tableName The name of the current table queried for the Sold-To partner browse.
		 * @param {object} tableStructure A copy of the structure of the table being queried
		 * @returns {string} The new table name to use for the Sold-To partner browse.
		 */
		OverrideSoldToQueryTable: function (tableName, tableStructure)
		{
			return tableName;
		},
		/**
		 * @description This user exit allows you to change the target table (or view) used for the Sold-To partner browse.
		 * If your configurations involve multiple ERPs, make sure to add conditions in your code to ensure that customizations 
		 * only affect the intended ERP and do not interfere with others.
		 * @param {string} tableName The name of the current table queried for the Ship-To partner browse.
		 * @param {object} tableStructure A copy of the structure of the table being queried
		 * @returns {string} The new table name to use for the Ship-To partner browse.
		 */
		OverrideShipToQueryTable: function (tableName, tableStructure)
		{
			return tableName;
		},

		/**
		 * @description This function will be called to know if an additional partner sync must be done even if there is no Allowed shipTo partner function
		 * @returns {boolean} True if additional partners sync must be done, false otherwise.
		 * @example Force additional partners sync when shipTo number is 1000:
		 * <pre><code>ForceAdditionalPartnersSync: function ()
		 * {
		 * 	if (Data.GetValue("ShipToNumber__") === "1000")
		 * 	{
		 * 		return true;
		 * 	}
		 * 	return false;
		 * }</code></pre>
		 **/
		ForceAdditionalPartnersSync: function ()
		{
			return false;
		},

		/**
		 * @method Lib.SOP.Customization.HTMLScripts.GetShipMethodFilter
		 * @since 339
		 * @description This function will be implemented to customize the filter applied to the SO - ShipMethod__ table.
		 * This function is called only in Oracle ERP mode, for Shipping method field browse, and for Shipping method checks.
		 * @param {Sys.Helpers.LdapUtil.IFilter} currentFilter The current filter used by the query.
		 * @returns {Sys.Helpers.LdapUtil.IFilter} The new filter to apply to the SO - ShipMethod__ table. It will replace the current filter.
		 * @example <caption>The following user exit allows to get all shipping methods by returns a filter that matches all records.</caption>
		 * GetShipMethodFilter: function (currentFilter)
		 * {
		 * 	var alwaysValid = Sys.Helpers.LdapUtil.FilterExist("Ship_Method_Code__");
		 * 	return alwaysValid;
		 * }
		 */
		GetShipMethodFilter: function (currentFilter)
		{
		},


		/**
		 * @description This user exit allows you to add URL parameters when opening the catalog from the portal cart.
		 * These parameters can be used for filtering the catalog items.
		 * IMPORTANT: for security reasons this user exit only apply if User.isCustomer is false
		 * @returns { object } - Object using URL parameter name for key and value to set for this parameter.
		 *
		 * @example Add shipTo number as URL parameter when opening the catalog.
		 * <pre><code>GetUrlParametersForCatalog: function ()
		 * {
		 *	return {
		 *		"shipTo" : Data.GetValue("ShipToNumber__")
		 *	};
		 * }</code></pre>
		 */
		GetUrlParametersForCatalog: function ()
		{
		},

		/**
		 * @description This user exit allows you to build a custom filter for the favorite items list in the portal cart.
		 * @param {string} soldToNumber - The sold-to number of the current customer.
		 * @returns { object } - The custom filter for the favorite items list. This filter will be used to query the favorite items table.
		 *
		 * @example
		 * <pre><code>GetFavoriteListFilter: function (soldToNumber)
		 * {
		 * 	const shipTo = Process.GetURLParameter("shipTo");
		 * 	const filter = Sys.Helpers.LdapUtil.FilterAnd(
		 * 		Sys.Helpers.LdapUtil.FilterEqual("SoldTo__", soldToNumber),
		 * 		Sys.Helpers.LdapUtil.FilterEqual("Z_ShipTo__", shipTo)
		 * 	);
		 * 	return filter;
		 * }</code></pre>
		 */
		GetFavoriteListFilter: function (soldToNumber)
		{
		},

		/**
		 * @description This user exit allows you to customize the AdditionalPartner browse dialog configuration.
		 * You can modify the table, columns, and search criteria used in the browse dialog.
		 * @param {string} partnerType - The partner type (KU=Customer, LI=Vendor, AP=Contact, PE=Personnel)
		 * @param {object} table - The SAP table configuration object containing table name and field mappings
		 * @param {object} columns - The columns configuration for the browse dialog (id, label, type, width, etc.)
		 * @param {boolean} isCP - Whether the partner function is "CP" (Contact Person)
		 * @param {Array} searchCriteria - The search criteria configuration for the dialog (id, label, required, etc.)
		 * @returns {object} Configuration object with table, columns, and searchCriteria properties. The columns have to be consistent with the table fields.
		 
		 *
		 * @example
		 * <pre><code>CustomizeAdditionalPartnerBrowseConfiguration: function(partnerType, table, columns, searchCriteria, isCP)
		 * {
		 *     // Example: Use a custom table for KU (customer) partners
		 *     if (partnerType === "KU") {
		 *         table = {
		 *             tableName: "CUSTOM_CUSTOMER_TABLE",
		 *             name: "CUSTOM_NAME",
		 *             number: "CUSTOM_NUMBER",
		 *             city: "CUSTOM_CITY",
		 *             street: "CUSTOM_STREET",
		 *             region: "CUSTOM_REGION",
		 *             zipCode: "CUSTOM_ZIP"
		 *         };
		 *  	   //The columns have to be consistent with the table fields. so if you change the table, you probably have to change the columns too.
		 *     }
		 *
		 *     // Example: Add custom column for all partner types
		 *     columns["customField"] = {
		 *         id: "customField",
		 *         label: "Custom Field",
		 *         type: "STR",
		 *         width: 150
		 *     };
		 *
		 *     // Example: Add street search criteria
		 *     searchCriteria.push({
		 *       id: table.street,
		 *       label: "Street",
		 *       required: false,
		 *       toUpper: false,
		 *       visible: true,
		 *       defaultValue: ""
		 *     });
		 *
		 *
		 *     return { table: table, columns: columns, searchCriteria: searchCriteria };
		 * }</code></pre>
		 */
		CustomizeAdditionalPartnerBrowseConfiguration: function (partnerType, table, columns, searchCriteria, isCP)
		{

		}
	};
	return customization;
})();
