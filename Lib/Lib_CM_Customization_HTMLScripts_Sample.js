/* LIB_DEFINITION{
  "name": "Lib_CM_Customization_HTMLScripts_Sample",
  "libraryType": "Lib",
  "scriptType": "CLIENT",
  "versionable": false,
  "comment": "",
  "require": []
}*/

/**
 * Package CM HTML page script customization callbacks for all processes
 * @namespace Lib.CM.Customization.HTMLScripts
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.CM = Lib.CM || {};
Lib.CM.Customization = Lib.CM.Customization || {};

Lib.CM.Customization.HTMLScripts = (function ()
{
	/**
	 * @lends Lib.CM.Customization.HTMLScripts
	 */
	var customization = {
		/**
		 * @method Lib.CM.Customization.HTMLScripts.CustomizeCreditApplication
		 * @description
		 * Allows you to customize layout settings for the credit application process.
		 * Use it to disable an option, set a field to read-only mode, etc.
		 * This user exit is called at the end of the HTML page script of the process.
		 */
		CustomizeCreditApplication: function ()
		{
		},

		/**
		 * @method Lib.CM.Customization.HTMLScripts.CustomizeUploadTemplates
		 * @description
		 * Allows you to customize layout settings for the upload templates process.
		 * Use it to disable an option, set a field to read-only mode, etc.
		 * This user exit is called at the end of the HTML page script of the process.
		 */
		CustomizeUploadTemplates: function ()
		{
		},

		/**
		 * @method Lib.CM.Customization.HTMLScripts.CustomizeGlobalSettings
		 * @description
		 * Allows you to customize layout settings for the global settings table
		 * Use it to disable an option, set a field to read-only mode, etc.
		 * This user exit is called at the end of the HTML page script of the table.
		*/
		CustomizeGlobalSettings: function ()
		{
		},

		/**
		 * @method Lib.CM.Customization.HTMLScripts.CustomizeRatingAgencySettings
		 * @description
		 * Allows you to customize layout settings for the rating agency table
		 * Use it to disable an option, set a field to read-only mode, etc.
		 * This user exit is called at the end of the HTML page script of the table.
		*/
		CustomizeRatingAgencySettings: function ()
		{
		},

		/**
		 * @method Lib.CM.Customization.HTMLScripts.CustomizeClientSendButtonAction
		 * @description
		 * Allows you to customize the action when clicking on the "Send" button on the client side
		 * Use it to disable an option, set a field to read-only mode, etc.
		 * This user exit is called when the user press the "Send" button at the end of the credit application client side.
		 * @example
		 * CustomizeClientSendButtonAction: function (args){
		 * 	if (args.wizard.IsLastStep())
		 * 	{
		 * 	    var template = Variable.GetValueAsString("templateName").split("_")[0];
		 * 	    if (template === "Direct" || template === "Direct Bill") {
		 * 	        let cardType = Controls.Z_Card_Type__.GetValue();
		 * 	        let carrierId = Controls.Z_Carrier_ID__.GetValue();
		 * 	        if (cardType && carrierId) {
		 * 	            Data.SetValue("CustomerNumber__", cardType + carrierId);
		 * 	        } else {
		 * 	            Log.Info("card type or carrier id not found : ", cardType, carrierId);
		 * 	        }
		 * 	    }
		 * 	    Data.SetValue("Z_StepSelectCombo__", 0);
		 * 	    Controls.Z_Value_Card_Type__.SetValue(Controls.Z_Card_Type__.GetValue());
		 * 	    Controls.Z_NewGiactQuery__.SetValue(true);
		 * 	}
		 * }
		*/
		CustomizeClientSendButtonAction: function (/*args*/)
		{
		},

		/**
		 * @method Lib.CM.Customization.HTMLScripts.CustomizeCountryOnChange
		 * @description
		 * Allows you to customize the action when changing the value of the country dropdown
		 * Use it to add more actions when changing the value of the country
		 * This user exit is called when the value of the country dropdown list is changed.
		 * @example
		 * CustomizeCountryOnChange: function ()
		 * {
		 *		const postalCode = Data.GetValue("Zip_Code__");
		 *		const isCanada = Data.GetValue("Country__") == "CA";
		 *		if (isCanada && postalCode && (postalCode.length != 7 || !/[a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d/.test(postalCode))) {
		 *			Data.SetError("Zip_Code__", "Please enter a valid Canadian postal code in the format A1A 1A1");
		 *		}
		 *		else {
		 *			Data.SetError("Zip_Code__", "");
		 *		}
		 * }
		*/
		CustomizeCountryOnChange: function ()
		{
		},

		/**
		 * Type definition for FinalPopupFillParams
		 * @typedef {Object} Lib.CM.Customization.HTMLScripts.FinalPopupFillParams
		 * @property {Object} [dialog] - The Dialog object is a container for form elements and buttons. See HTML page script API: Popup.Dialog help page for more information
		 * @property {Object} [Comment] - The object containg datas where the UE is called.
		 */

		/**
		 * @method Lib.CM.Customization.HTMLScripts.CustomizeFinalPopupFill
		 * @description
		 * Allows you to customize the popup dialog shown when approving the credit application
		 * Use it to disable an option, set a field to read-only mode, etc.
		 * This user exit is called when the popup displayed when approving the credit application is shown.
		 * You can add inputs on the popup with the dialog object
		 * @property {Lib.CM.Customization.HTMLScripts.FinalPopupFillParams} finalPopupFillParams
		 * @example
		 * CustomizeFinalPopupFill: function (finalPopupFillParams){
		 * 	if (finalPopupFillParams.Comment._globalAction === 'BackToPrevious' || finalPopupFillParams.Comment._globalAction === 'BackToCustomer') {
		 * 				var cb_control = finalPopupFillParams.dialog.AddComboBox("Z_StepSelectPopup", "Selected Step");
		 * 			if (!Lib.CM.TemplateSettings.GetBoolParameter("template_enablebankreference__") && !Lib.CM.TemplateSettings.GetBoolParameter("template_enabletradereference__")) {
		 * 				cb_control.SetAvailableValues("0=\n1=Business Information\n2=Company Profile\n3=Contacts and Addresses\n4=Documents\n5=Signature");
		 * 			} else {
		 * 				cb_control.SetAvailableValues("0=\n1=Business Information\n2=Company Profile\n3=Contacts and Addresses\n4=References\n5=Documents\n6=Signature");
		 * 			}
		 * 			cb_control.SetValue("0");  
		 * 	} else if (finalPopupFillParams.Comment._globalAction === 'Approve') {
		 * 			var template = Variable.GetValueAsString("templateName").split("_")[0];
		 * 			if (template === "Direct" || template === "Direct Bill") {
		 * 				if (finalPopupFillParams.dialog.GetControl("ctrl_Text_CustomerNumber")){
		 * 					finalPopupFillParams.dialog.GetControl("ctrl_Text_CustomerNumber").SetReadOnly(true);
		 * 				}
		 * 			}
		 * 	}
		 * }
		 * @example
		 * CustomizeFinalPopupFill: function (finalPopupFillParams){
		 * 	const userIsRestricted = User.profileName == "Sales Manager" || User.profileName == "Sales Analyst";
		 * 	const fieldsToRestrict = [
		 * 			"ctrl_Int_CreditLimit",
		 *			"ctrl_periodicReview",
		 *			"ctrl_paymentTerms",
		 *			"ctrl_riskCategory"
		 * 	];
		 * 	fieldsToRestrict.forEach(fieldName => {
		 * 			const fieldControl = finalPopupFillParams.dialog.GetControl(fieldName);
		 *			// If the final approval workflow has already been entered, the field may not be present.
		 *			if (fieldControl) {
		 *				fieldControl.SetReadOnly(userIsRestricted);
		 *			}
		 * 	});
		 * }
		*/
		CustomizeFinalPopupFill: function (/*finalPopupFillParams*/)
		{
		},

		/**
		 * @method Lib.CM.Customization.HTMLScripts.CustomizeFinalPopupFillBeforeComment
		 * @description
		 * Allows you to customize the popup dialog shown when approving the credit application
		 * Use it to disable an option, set a field to read-only mode, etc.
		 * This user exit is called when the popup displayed when approving the credit application is shown.
		 * You can add inputs on the popup with the dialog object
		 * Those inputs will be displayed before the "Comment" field of the popup
		 * @property {finalPopupFillParams} finalPopupFillParams
		 * CustomizeFinalPopupFillBeforeComment: function (finalPopupFillParams)
		 * {
		 *		finalPopupFillParams.dialog.AddText("ctrl_Text_MyCustomDialogField", "_MyCustomDialogField", 150);
		 * }
		*/
		CustomizeFinalPopupFillBeforeComment: function (/*finalPopupFillParams*/)
		{
		},


		/**
		 * @method Lib.CM.Customization.HTMLScripts.CustomizeFinalPopupCommit
		 * @description
		 * Allows you to customize values before confirming the approval in the popup dialog shown when approving the credit application
		 * Use it to disable an option, set a field to read-only mode, etc.
		 * This user exit is called when the popup displayed when approving the credit application has been confirmed.
		*/
		CustomizeFinalPopupCommit: function (/*args*/)
		{
		},
		/**
		 * @method Lib.CM.Customization.HTMLScripts.CustomizeHandleTaxIdentifiers
		 * @description
		 * Allows you to customize taxIdentifiers management
		 * Use it to show/hide set required a field
		 * This user exit is called when the event country.onchange is trigger
		 * List of fields that should be handled from this user exit:
		 * TvaIntra__, FederalTaxId__, TaxID__, SIRET__, DUNS__, SIREN__, NIC__, CodeAPE__, TIN__, ABN__
		 * 
		 * @example
		 * CustomizeHandleTaxIdentifiers: function ()
		 * {
		 *		Controls.DUNS__.Hide(true);
		 * }
		*/
		CustomizeHandleTaxIdentifiers: function ()
		{
		},

		/**
		 * @method Lib.CM.Customization.HTMLScripts.StepIsInError
		 * @description
		 * Allows you to check for each step of customer wizard if there is no error from the customer input
		 * For exemple if you add a custom required field in a customer step you will be able to check that it is fill properly
		 * You can also check that table are filled with good property or specific line (i.e. customer must fill the contact table with at least the President)
		 * This user exit is called each time customer change step
		 * args: {wizard: WizardObject, stepIndex: integer, step: StepObject }
		 * stepIndex is the current step index from the step where customer is currently on.
		 * To access some data for the current step from wizard: wizard.steps[stepIndex].
		 * step is the current step being validated
		 * You can make a switch on step.name in order to handle step one by one with your own customization
		 * @note The name of each step can be accessed via args.step.name. The list of step names is as follows:
		 * companyStep, applicationStep, contactsStep, ReferencesStep, documentsStep, signStep, docusignStep (if enabled)
		 * 
		 * @example
		 * StepIsInError: function (args)
		 * {
		 *		let isInError = false;
		 *		switch (args.step.name) {
		 *			case "companyStep":
		 *				const postalCode = Data.GetValue("Zip_Code__");
		 *				const isCanada = Data.GetValue("Country__") == "CA";
		 *				if (isCanada && postalCode && (postalCode.length != 7 || !/[a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d/.test(postalCode))) {
		 *					Data.SetError("Zip_Code__", "Please enter a valid Canadian postal code in the format A1A 1A1");
		 *					isInError = true;
		 *				}
		 *				else {
		 *					Data.SetError("Zip_Code__", "");
		 *				}
		 *				break;
		 *			case "ReferencesStep":
		 *				const requiredFieldsInBankTable = args.step.requiredFieldsInBankTable;
		 *				if (requiredFieldsInBankTable.indexOf("Z_Transit_number__") == -1) {
		 *					requiredFieldsInBankTable.push("Z_Transit_number__");
		 *				}
		 *				if (requiredFieldsInBankTable.indexOf("AccountNumber__") == -1) {
		 *					requiredFieldsInBankTable.push("AccountNumber__");
		 *				}
		 *				break;
		 *		}
		 *		return isInError;
		 * }
		 * 
		*/
		StepIsInError: function (/*args*/)
		{
		},

		/**
		 * @method Lib.CM.Customization.HTMLScripts.OnShowStep
		 * @description
		 * Allows you to handle onshow for each step of customer wizard
		 * For exemple if you add a custom field in a customer step you will be able to hide/display it or set it required
		 * You can also check that table are filled with good property or specific line (i.e. customer must fill the contact table with at least the President)
		 * This user exit is called each time customer display a new step
		 * args: {wizard: WizardObject, stepIndex: integer, step: StepObject }
		 * stepIndex is the current step index from the step where customer is currently on.
		 * To access some data for the current step from wizard: wizard.steps[stepIndex].
		 * step is the step that will be displayed
		 * You can make a switch on step.name in order to handle step one by one with your own customization
		 * @note The name of each step can be accessed via args.step.name. The list of step names is as follows:
		 * companyStep, applicationStep, contactsStep, ReferencesStep, documentsStep, signStep, docusignStep (if enabled)
		 * 
		 * @example
		 * OnShowStep: function (args)
		 * {
		 * 		// Only show the custom "Business fields of operations" pane on the "Company" step
		 *		Controls.Z_Fields_of_operations_pane__.Hide(args.step.name != "companyStep");
		 *
		 *		switch (args.step.name) {
		 *			case "contactsStep":
		 *			// Make the first two line items in the company officers (i.e. "AP and purchasing contacts") table read-only to enforce the requirement that at least one AP and at least
		 *			// one purchasing contact are required. Ensure these two line items are also added in the CustomizeExtraction user exit.
		 *			const officersTable = Controls.CompanyOfficersTable__;
		 *			const originalOfficersTableOnRefreshRow = officersTable.OnRefreshRow;
		 *			officersTable.OnRefreshRow = function(index)
		 *			{
		 *				originalOfficersTableOnRefreshRow.call(this, index);=
		 *				officersTable.HideTableRowDeleteForItem(-1, true); // Hide header delete button
		 *				let row = officersTable.GetRow(index);
		 *				if (row.GetLineNumber() <= 2)
		 *				{
		 *					row.Role__.SetReadOnly(true);
		 *					officersTable.HideTableRowDeleteForItem(index, true);
		 *				}
		 *			};
		 *			officersTable.RefreshRows();
		 *			break;
		 *		}
		 * }
		*/
		OnShowStep: function (/*args*/)
		{
		},

		/**
		 * @method Lib.CM.Customization.HTMLScripts.OnCollectionCallRequestSucceeded
		 * @description
		 * Allows you to customize the behavior after the collection call request was made
		 * args: { status: 'new_collection_call_created' | 'needed_collection_call_already_present' | string}
		 */
		OnCollectionCallRequestSucceeded: function (/*args*/)
		{
		},

		/**
		 * @method Lib.CM.Customization.HTMLScripts.CustomizationPutOnHoldOnCollectionCallRequest
		 * @description
		 * Allows you to customize the credit review after it has been put on hold following a Collection call request
		 */
		CustomizationPutOnHoldOnCollectionCallRequest: function ()
		{
		},
		/**
		 * @method Lib.CM.Customization.HTMLScripts.CompanyDataForScoring
		 * @description This function will be called to customize the company object used to retrieve some credit score information
		 * for example if you want to change experian endpoint based on a field on the credit application process you just have to add the data to the company object
		 * @example
		 * CompanyDataForScoring: function (company)
		 * {
		 *		company.taxId = Data.GetValue("Z_TaxId__");
		 *		return company;
		 * }
		 **/
		CompanyDataForScoring: function (/*company*/)
		{
		},
		/**
		 * @method Lib.CM.Customization.HTMLScripts.CustomizeBehaviorOnCustomerSave
		 * @description This function will be called to customize the behavior of the credit application when the final approval is done.
		 * @example This example set the value of a variable with the concatenation of the customer number and the company name
		 * CustomizeBehaviorOnCustomerSave: function ()
		 * {
		 *		Variable.SetValueAsString("CustomerNumberAndName", Data.GetValue("CustomerNumber__") + " - " + Data.GetValue("Company__"));
		 * }
		 **/
		CustomizeBehaviorOnCustomerSave: function ()
		{
		},

		/**
		 * Type definition for dialogTitleParams
		 * @typedef {Object} Lib.CM.Customization.HTMLScripts.DialogTitleParams
		 * @property {string} [currentTitle] - The title currently selected
		 * @property {string} [action] - The action triggering the dialog
		 * @property {string} [role] - The role triggering the dialog
		 */
		/**
		 * @method Lib.CM.Customization.HTMLScripts.CustomizeDialogTitle
		 * @description
		 * Allows you to customize the title of the dialog.
		 * @param {Lib.CM.Customization.HTMLScripts.DialogTitleParams} dialogTitleParams - The parameters for the dialog title customization
		 * @returns {string} The title of your popup
		 * @example
		 * CustomizeDialogTitle: function (dialogTitleParams)
		 * {
		 * 		var title = dialogTitleParams.currentTitle;
		 * 		if(Data.GetValue("Review__"))
		 * 		{
		 * 			title = Data.GetValue("ReasonReview__") == "accreditationVerification" ? "_MyCustomTitle" : "_MyCustomTitle2";
		 * 		}
		 *		return title;
		 * }
		*/
		CustomizeDialogTitle: function (/*dialogTitleParams*/)
		{
		},

		/**
		 * @method Lib.CM.Customization.HTMLScripts.CustomizeDialogValidateCallBack
		 * @description
		 * Allows you to customize the checks for errors in the dialog. It also handle the errors you want to siplay on your controls
		 * @param {object} dialog - The Dialog object is a container for form elements and buttons. See HTML page script API: Popup.Dialog help page for more information
		 * @returns {boolean} A boolean value containing if the dialog has error.
		 * @example
		 * CustomizeDialogValidateCallBack: function (dialog)
		 * {
		 * 		var customerNumberControl = dialog.GetControl("ctrl_Text_CustomerNumber");
		 * 		var customerNumber = customerNumberControl.GetValue();
		 * 		var hasError = customerNumber === "12345";
		 * 		if (hasError)
		 * 		{
		 * 			customerNumberControl.SetError("The error of my UE")
		 * 		}
		 * 		return hasError;
		 * }
		*/
		// CustomizeDialogValidateCallBack: function (/*dialog*/)
		// {
		// }

		/**
		 * @method Lib.CM.Customization.HTMLScripts.CustomTemplateAdditionalTags
		 * @description
		 * Allows you to customize template additional tags.
		 * @param {object} additionalCT - The current object with additional tags
		 * @returns {Object} the object modified (or not) in the UE
		 * @example
		 * CustomTemplateAdditionalTags: function (additionalCT)
		 * {
		 * 		additionalCT.extraTag = "extra tag";
		 *		return additionalCT;
		 * }
		*/
		CustomTemplateAdditionalTags: function (/*additionalCT*/)
		{
		},
		/**
		 * @method Lib.CM.Customization.HTMLScripts.GetRiskCategoryCustomColor
		 * @description
		 * Allows you to customize the colors of the risk categories in the "Customer Extended Properties" or "Credit Application" processes.
		 * Colors must be a string in the HEX Format (i.e : "#FA07A1") or "none".
		 * @param {string} riskCategory - The current risk category.
		 * @returns {string} A string representing the color of your risk category.
		 * @example
		 * GetRiskCategoryCustomColor: function (riskCategory)
		 * {
		 * 	switch (riskCategory)
		 *	{
		 *		case "_RISKCATEGORY00":
		 *		case "_RISKCATEGORY01":
		 *		case "_RISKCATEGORY02":
		 *		case "_RISKCATEGORY03":
		 *		case "_RISKCATEGORY04":
		 *			return "#FA07A1";
		 *		default:
		 *			return "none";
		 *	}
		 *		
		 * }
		*/
		GetRiskCategoryCustomColor: function (/*riskCategory*/)
		{
		}
	};

	return customization;
})();
