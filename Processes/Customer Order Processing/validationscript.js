///#GLOBALS Lib Sys
/**************************************** Beginning of User Exits ****************************************/
var CustomerOrderProcessing;
(function (CustomerOrderProcessing) {
    let Validation;
    (function (Validation) {
        Validation.UserExit = {
            OnValidationScriptBegin: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Validation.OnValidationScriptBegin") || {};
            },
            OnValidationScriptEnd: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Validation.OnValidationScriptEnd");
            },
            CheckTotal: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Validation.CheckTotal") || {};
            },
            CheckDuplicate: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Validation.CheckDuplicate") || {};
            },
            CheckDates: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Validation.CheckDates") || {};
            },
            LineItemCheckQuantity: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Validation.LineItemCheckQuantity") || {};
            },
            LineItemCheckUnit: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Validation.LineItemCheckUnit") || {};
            },
            LineItemCheckUnitPrice: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Validation.LineItemCheckUnitPrice") || {};
            },
            CheckEmail: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Validation.CheckEmail") || {};
            },
            TouchlessCheck: function () {
                let result = Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Validation.TouchlessCheck");
                return typeof result === "boolean" ? result : result || {};
            },
            GetAutomaticProcessingExtraFilter: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Common.GetAutomaticProcessingExtraFilter");
            },
            CustomizeAutomaticProcessingRecordVars: function (recordVars, updateExistingRecord = false) {
                Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Validation.CustomizeAutomaticProcessingRecordVars", recordVars, updateExistingRecord);
            },
            CustomizeDuplicateCheckWarningPopupTable: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Common.CustomizeDuplicateCheckWarningPopupTable");
            },
            DisableOracleDataChecks: function (checkName) {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Common.DisableOracleDataChecks", checkName);
            }
        };
    })(Validation = CustomerOrderProcessing.Validation || (CustomerOrderProcessing.Validation = {}));
})(CustomerOrderProcessing || (CustomerOrderProcessing = {}));
/**************************************** End of User Exits ****************************************/
// ******************************Duplicates check******************************
const CheckDuplicate = function () {
    var _a;
    if (CustomerOrderProcessing.Validation.UserExit.CheckDuplicate().stop) {
        return;
    }
    if (Data.GetValue("SalesDocumentType__") === Lib.SOP.Helpers.SalesDocumentType.ChangeOrder) {
        return;
    }
    let configuration = Sys.OM.Helpers.GetConfiguration();
    if (Variable.GetValueAsString("DoNotCheckDuplicates") !== "1" && (Data.GetValue("DuplicateCheckAlertLevel__") !== "0" || configuration.ManualDuplicateCheck === "1")) {
        let aDuplicateKeyControls = ["CustomerNumber__"];
        let checkEmptyFields = false;
        let aControlsToCheck = [];
        let iGroupSize = 0;
        let isQuote = Data.GetValue("SalesDocumentType__") === Lib.SOP.Helpers.SalesDocumentType.QuoteRequest;
        if (isQuote) {
            aControlsToCheck = [];
            iGroupSize = 0;
        }
        else if (configuration && configuration.ManualDuplicateCheck === "1") {
            let JSONDuplicateFieldsRecognized = Variable.GetValueAsString("DuplicateFieldsRecognized");
            //In case of a process that doesn't run the extraction script
            if (!JSONDuplicateFieldsRecognized) {
                CheckDuplicateFieldsConfigurator();
                JSONDuplicateFieldsRecognized = Variable.GetValueAsString("DuplicateFieldsRecognized");
            }
            if (JSONDuplicateFieldsRecognized) {
                aControlsToCheck = JSON.parse(JSONDuplicateFieldsRecognized);
                iGroupSize = aControlsToCheck.length;
            }
            checkEmptyFields = true;
        }
        else {
            aControlsToCheck = ["Sales_Order_Number__", "Total__", "Sales_Order_Date__"];
            iGroupSize = parseInt(Data.GetValue("DuplicateCheckAlertLevel__"), 10);
        }
        let customAttributes = (_a = CustomerOrderProcessing.Validation.UserExit.CustomizeDuplicateCheckWarningPopupTable()) === null || _a === void 0 ? void 0 : _a.map((e) => e.formId);
        let mQueryOptions = {
            MaxDateRangeInDays: 90,
            DateRangeFieldName: "SubmitDateTime",
            SortOnControlName: "Sales_Order_Date__",
            AdditionalAttributes: customAttributes || ["Sales_Order_Number__", "Total__", "Sales_Order_Date__"]
        };
        let isChangeOrder = Data.GetValue("SalesDocumentType__") === "ChangeOrder";
        Variable.SetValueAsString("DuplicateCheckResult", "");
        if (!isChangeOrder) {
            let mDuplicates = Lib.DuplicateCheck.CheckDuplicate(aDuplicateKeyControls, aControlsToCheck, mQueryOptions, iGroupSize, checkEmptyFields);
            if (mDuplicates && mDuplicates.length > 0) {
                Data.SetError("Sales_Order_Number__", "Duplicates have been detected");
                Variable.SetValueAsString("DuplicateCheckResult", JSON.stringify(mDuplicates));
            }
        }
    }
};
function CheckDuplicateFieldsConfigurator() {
    //Check Duplicate Fields Errors
    let configuration = Sys.OM.Helpers.GetConfiguration();
    if (configuration && configuration.ManualDuplicateCheck === "1") {
        let aControlsToCheck = configuration.DuplicateCheckFields.split(/\s+/);
        //We filter the duplicates among the fields
        let mFilteredControlsToCheck = {};
        for (let i = 0; i < aControlsToCheck.length; ++i) {
            mFilteredControlsToCheck[aControlsToCheck[i]] = 0;
        }
        //We delete if there's an empty string
        delete mFilteredControlsToCheck[""];
        let aFilteredControlsToCheck = Object.keys(mFilteredControlsToCheck);
        let aDuplicateFieldsUnrecognized = [];
        let aDuplicateFieldsRecognized = [];
        for (let i = 0; i < aFilteredControlsToCheck.length; ++i) {
            if (typeof Data.IsField === "function" && !Data.IsField(aFilteredControlsToCheck[i])) {
                Log.Error("The field: '" + aFilteredControlsToCheck[i] + "' doesn't exist");
                aDuplicateFieldsUnrecognized.push(aFilteredControlsToCheck[i]);
            }
            else {
                Log.Info("The field: '" + aFilteredControlsToCheck[i] + "' exists");
                aDuplicateFieldsRecognized.push(aFilteredControlsToCheck[i]);
            }
        }
        Variable.SetValueAsString("DuplicateFieldsUnrecognized", JSON.stringify(aDuplicateFieldsUnrecognized));
        //We set the recognized field only if there's no error
        if (aDuplicateFieldsUnrecognized.length == 0) {
            Variable.SetValueAsString("DuplicateFieldsRecognized", JSON.stringify(aDuplicateFieldsRecognized));
        }
    }
}
// ************************************************************
//********************Check contract data**********************
function ReconcileAndCheckContract() {
    // Load contract and reconcile contract items only on manual approval to prevent unnecessary calls to ERP
    const currentActionType = Data.GetActionType();
    switch (currentActionType) {
        case "approve":
        case "approve_asynchronous":
        case "autocomplete":
            if (Lib.SOP.Contracts.IsContractFeatureActivated()) {
                if (!Lib.SOP.Helpers.GetOrder()) {
                    Lib.SOP.ERP.InitializeERPManager(Sys.OM.Helpers.GetConfiguration().ERP);
                }
                Lib.SOP.Helpers.GetOrder().LoadContract();
            }
            break;
        default:
            break;
    }
}
//********************Check quote data**********************
function ReconcileAndCheckQuote() {
    let loadQuotationPromise;
    // Load quote and reconcile quote items only on manual approval to prevent unnecessary calls to ERP
    const currentActionType = Data.GetActionType();
    switch (currentActionType) {
        case "approve":
        case "approve_asynchronous":
        case "autocomplete":
            if (Lib.SOP.Quotes.IsQuoteFeatureActivated()) {
                if (!Lib.SOP.Helpers.GetOrder()) {
                    Lib.SOP.ERP.InitializeERPManager(Sys.OM.Helpers.GetConfiguration().ERP);
                }
                loadQuotationPromise = Lib.SOP.Helpers.GetOrder().LoadQuotation();
                if (loadQuotationPromise) {
                    loadQuotationPromise.Then((quote) => {
                        if (quote) {
                            Log.Info(`[ReconcileAndCheckQuote] Quote ${quote.documentNumber} has been loaded and reconciled`);
                        }
                    });
                }
            }
            break;
        default:
            break;
    }
}
// ************************************************************
//******************************Check PO data******************************
function CheckDates() {
    if (CustomerOrderProcessing.Validation.UserExit.CheckDates().stop) {
        return;
    }
    //Only if Sales Order Date is set
    let currentPoDate = Data.GetValue("Sales_Order_Date__");
    let inOneYear = new Date();
    inOneYear.setFullYear(inOneYear.getFullYear() + 1);
    if (currentPoDate) {
        //Current PO Date Year is after than in One Year
        let isPoDateInError = inOneYear.getTime() < currentPoDate.getTime();
        if (isPoDateInError) {
            Data.SetError("Sales_Order_Date__", "Inconsistent date");
        }
    }
    let currentDueDate = Data.GetValue("Due_Date__");
    if (currentDueDate) {
        //Current PO Date Year is after than in One Year
        let isDueDateInError = inOneYear.getTime() < currentDueDate.getTime();
        if (isDueDateInError) {
            Data.SetError("Due_Date__", "Inconsistent date");
        }
    }
}
function CheckSource() {
    if (!Data.GetValue("Source__")) {
        Data.SetValue("Source__", "Other");
    }
}
// ************************************************************
function CheckEmail() {
    CustomerOrderProcessing.Validation.UserExit.CheckEmail();
    Lib.SOP.CheckContactEmail();
}
//******************************Line item - Check quantity******************************
// Line item - Quantity should be greater than 0
function LineItemCheckQuantity() {
    if (CustomerOrderProcessing.Validation.UserExit.LineItemCheckQuantity().stop) {
        return;
    }
    const table = Data.GetTable("Product_List__");
    const count = table.GetItemCount();
    for (let i = 0; i < count; i++) {
        let row = table.GetItem(i);
        let qty = row.GetValue("Quantity__");
        if (qty != null) {
            if (qty <= 0) {
                row.SetError("Quantity__", "This field is required and its value must be greater than 0");
            }
            else if (row.GetError("Quantity__") == null) {
                // Handle legacy code
                row.SetError("Quantity__", "");
            }
        }
    }
}
// ************************************************************
//******************************Unit check******************************
function LineItemCheckUnit() {
    if (CustomerOrderProcessing.Validation.UserExit.LineItemCheckUnit().stop
        || (Lib.SOP.Helpers.IsERP("SAP") && Sys.OM.Helpers.GetConfiguration().ConnectedToSAP === "1")
        || Sys.OM.Helpers.GetConfiguration().UseDefaultUOM === "1") {
        return;
    }
    let table = Data.GetTable("Product_List__");
    let count = table.GetItemCount();
    for (let i = 0; i < count; i++) {
        let row = table.GetItem(i);
        let unit = row.GetValue("Unit__");
        if (unit) {
            // check if unit exist in UOM table
            let filter = Sys.Helpers.LdapUtil.FilterEqual("Unit_of_measure__", unit);
            if (Lib.SOP.Helpers.QueryDB("SO - Units of measure__", filter, "").length > 0) {
                // check if unit allowed for material
                let itemNumber = row.GetValue("ItemNumber__");
                filter = Sys.Helpers.LdapUtil.FilterAnd(filter, Sys.Helpers.LdapUtil.FilterEqual("Material_number__", itemNumber));
                if (Lib.SOP.Helpers.QueryDB("SO - Units of measure/Material mapping__", filter, "").length === 0) {
                    row.SetError("Unit__", "Unit '{0}' does not match the material '{1}'", unit, itemNumber);
                }
            }
        }
    }
}
//************************************************************
function LineItemCheckNationalCode() {
    let itemsCollection = Data.GetTable("Product_List__");
    let count = itemsCollection.GetItemCount();
    for (let i = 0; i < count; i++) {
        let item = itemsCollection.GetItem(i);
        SetNationalCode(item);
    }
}
function SetNationalCode(item) {
    if (item.GetValue("ItemNumber__") && !item.GetValue("National_Code__")) {
        let filter = Sys.Helpers.LdapUtil.FilterEqual("Material_ID_in_ERP__", item.GetValue("ItemNumber__"));
        let vars = Lib.SOP.Helpers.QueryDB("SO - Materials__", filter, "National_Code__");
        if (vars.length > 0) {
            let nationalCode = vars[0].GetValue_String("National_Code__", 0);
            item.SetValue("National_Code__", nationalCode);
            Lib.SOP.Helpers.SetValueWithSourceFromTable(item, "National_Code__", nationalCode, "SO - Materials__");
        }
    }
}
//******************************Unit price check******************************
function LineItemCheckUnitPrice() {
    //Check Unit price only if touchless, not when a user approves the form manually
    if (CustomerOrderProcessing.Validation.UserExit.LineItemCheckUnitPrice().stop || Data.GetActionType() !== "") {
        return;
    }
    let table = Data.GetTable("Product_List__");
    let count = table.GetItemCount();
    for (let itemIdx = 0; itemIdx < count; itemIdx++) {
        let item = table.GetItem(itemIdx);
        Lib.SOP.DataChecks.LineItemCheckUnitPrice(item);
    }
}
//************************************************************
//******************************Check total******************************
// Total should equal the sum of line item totals
function CheckTotal() {
    Data.SetWarning("Total__", "");
    if (CustomerOrderProcessing.Validation.UserExit.CheckTotal().stop) {
        return;
    }
    let msg = null;
    let total = Data.GetValue("Total__");
    let itemTotal = Lib.SOP.GetLineItemTotalSum();
    if (total != null && total <= 0) {
        msg = "The value must be greater than 0";
    }
    else if (!Lib.SOP.AreTotalsEquals(total, itemTotal)) {
        Log.Info("Line item total=" + itemTotal + "    Total=" + total);
        //Warning message coherence
        if (Sys.OM.Helpers.GetConfiguration().DisplayRunningTotal === "1") {
            msg = Language.Translate("The running total and total do not match");
        }
        else {
            msg = Language.Translate("The total must equal the sum of the line item totals ({0})", false, itemTotal);
        }
    }
    if (msg !== null) {
        Data.SetWarning("Total__", msg);
        if (msg !== "") {
            Process.PreventApproval();
            Log.Warn("PreventApproval has been called for field Total__: " + msg);
        }
    }
}
//************************************************************
//******************************Clean Dropship******************************
// When Dropship checkbox is unchecked, the fields in Dropship panel are
// to ignore, so to not autolearn clean all Dropship fields
function CleanDropship() {
    if (!Data.GetValue("DropShipToCapturedAddress__")) {
        Data.SetValue("DropShipToAddress_Name__", "");
        Data.SetValue("DropShipToAddress_Name2__", "");
        Data.SetValue("DropShipToAddress_Street__", "");
        Data.SetValue("DropShipToAddress_PostalCode__", "");
        Data.SetValue("DropShipToAddress_City__", "");
        Data.SetValue("DropShipToAddress_Region__", "");
        Data.SetValue("DropShipToAddress_Country__", "");
    }
}
//************************************************************
//******************************Duplicate check settings******************************
function SaveDuplicateCheckAlertLevel() {
    let customerNumber = Data.GetValue("CustomerNumber__");
    if (customerNumber) {
        let alertLevel = Data.GetValue("DuplicateCheckAlertLevel__");
        Log.Info("Alert on duplicates level: " + alertLevel);
        let bCreate = true;
        let rec = null;
        let vars = null;
        let tableName = Lib.SOP.Tables.DuplicateAlert.tableName;
        Query.Reset();
        Query.SetSpecificTable(tableName);
        let filter = Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.DuplicateAlert.customerNumber, customerNumber.toString());
        Query.SetFilter(Lib.SOP.DataFilteringKey.ExtendFilterWithDataFilteringKey(tableName, filter).toString());
        if (Query.MoveFirst()) {
            rec = Query.MoveNextRecord();
            if (rec) {
                bCreate = false;
                vars = rec.GetVars();
                let level = vars.GetValue_String(Lib.SOP.Tables.DuplicateAlert.blockingLevel, 0);
                Log.Info(tableName + " Duplicate check alert level for customer '" + customerNumber + "': " + level);
                if (level !== alertLevel) {
                    // update record
                    Log.Info("Update " + tableName + " for customer '" + customerNumber + "': " + alertLevel);
                    vars.AddValue_String(Lib.SOP.Tables.DuplicateAlert.blockingLevel, alertLevel, true);
                    if (rec.Commit()) {
                        Log.Warn("Error during '" + tableName + "' commit: " + rec.GetLastErrorMessage());
                    }
                }
            }
        }
        if (bCreate && alertLevel !== "1") // Note: default value for alertLevel = 1
         {
            // create record
            Log.Info(tableName + " for customer '" + customerNumber + "' does not exist, create record");
            rec = Process.CreateTableRecord(tableName);
            if (rec) {
                vars = rec.GetVars();
                vars.AddValue_String(Lib.SOP.Tables.DuplicateAlert.customerNumber, customerNumber, true);
                vars.AddValue_String(Lib.SOP.Tables.DuplicateAlert.blockingLevel, alertLevel, true);
                vars.AddValue_String(Lib.SOP.Tables.DuplicateAlert.dataFilteringKey, Sys.OM.Helpers.GetConfiguration().DataFilteringKey, true);
                if (rec.Commit()) {
                    Log.Warn("Error during '" + tableName + "' commit: " + rec.GetLastErrorMessage());
                }
            }
            else {
                Log.Info("Error creating record " + tableName);
                Data.SetError("DuplicateCheckAlertLevel__", "Error creating record " + tableName);
            }
        }
    }
}
//************************************************************
//******************************Complete delivery******************************
function SaveCompleteDeliveryInfo() {
    let customerNumber = Data.GetValue("CustomerNumber__");
    let completeDeliveryKeyword = Data.GetValue("CompleteDeliveryKeyword__");
    let completeDelivery = Data.GetValue("CompleteDelivery__");
    if (!customerNumber || Sys.OM.Helpers.GetConfiguration().DisplayShipComplete === "0" || !completeDeliveryKeyword) {
        Log.Info("No complete delivery information to save");
        return;
    }
    Query.Reset();
    let tableName = Lib.SOP.Tables.CompleteDeliveryMapping.tableName;
    Query.SetSpecificTable(tableName);
    let filter = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.CompleteDeliveryMapping.customerNumber, customerNumber), Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.CompleteDeliveryMapping.completeDeliveryText, completeDeliveryKeyword));
    Query.SetFilter(Lib.SOP.DataFilteringKey.ExtendFilterWithDataFilteringKey(tableName, filter).toString());
    let rec = null;
    let vars = null;
    if (!Query.MoveFirst()) {
        Log.Warn("Invalid query when saving complete delivery informations");
        return;
    }
    rec = Query.MoveNextRecord();
    if (rec) {
        vars = rec.GetVars();
        let savedCompleteDelivery = vars.GetValue_String(Lib.SOP.Tables.CompleteDeliveryMapping.completeDelivery, 0) === "1";
        if (savedCompleteDelivery === completeDelivery) {
            Log.Info("Complete delivery informations already saved for this customer");
        }
        else {
            Log.Info("Update existing complete delivery information : keyword = " + completeDeliveryKeyword + " for customer " + customerNumber);
            vars.AddValue_String(Lib.SOP.Tables.CompleteDeliveryMapping.completeDelivery, completeDelivery, true);
            if (rec.Commit()) {
                Log.Warn("Error during '" + tableName + "' commit: " + rec.GetLastErrorMessage());
            }
        }
        return;
    }
    Log.Info("Save new complete delivery information : keyword = " + completeDeliveryKeyword + " for customer " + customerNumber);
    rec = Process.CreateTableRecord(tableName);
    if (rec) {
        vars = rec.GetVars();
        vars.AddValue_String(Lib.SOP.Tables.CompleteDeliveryMapping.customerNumber, customerNumber, true);
        vars.AddValue_String(Lib.SOP.Tables.CompleteDeliveryMapping.completeDeliveryText, completeDeliveryKeyword, true);
        vars.AddValue_String(Lib.SOP.Tables.CompleteDeliveryMapping.completeDelivery, completeDelivery, true);
        vars.AddValue_String(Lib.SOP.Tables.CompleteDeliveryMapping.dataFilteringKey, Sys.OM.Helpers.GetConfiguration().DataFilteringKey, true);
        if (rec.Commit()) {
            Log.Warn("Error during '" + tableName + "' commit: " + rec.GetLastErrorMessage());
        }
    }
    else {
        Log.Info("Error creating record " + tableName);
    }
}
//************************************************************
//******************************Touchless******************************
function isFreeTextDocument() {
    let extractedUsingTeaching = Data.GetValue("Extracted_Using_Teaching__");
    let extractedUsingAutolearning = Data.GetValue("Extracted_Using_Autolearning__");
    let extractedUsingGpt = Data.GetValue("Extracted_Using_Gpt__");
    return (extractedUsingGpt && !extractedUsingAutolearning && !extractedUsingTeaching);
}
function SaveTouchlessInfo() {
    let customerNumber = Data.GetValue("CustomerNumber__");
    if (customerNumber) {
        let allowTouchless = Data.GetValue("AllowTouchless__") ? "1" : "0";
        Log.Info("Allow touchless: " + allowTouchless);
        let bCreate = true;
        let rec = null;
        let vars = null;
        let tableAutomaticProcessing = Lib.SOP.Tables.AutomaticProcessing.tableName;
        Query.Reset();
        Query.SetSpecificTable(tableAutomaticProcessing);
        let filter = Sys.Helpers.LdapUtil.FilterEqual("Customer_number__", customerNumber.toString());
        filter = Lib.SOP.Helpers.joinFilterWithExtraFilter(filter, CustomerOrderProcessing.Validation.UserExit.GetAutomaticProcessingExtraFilter(), true);
        Query.SetFilter(Lib.SOP.DataFilteringKey.ExtendFilterWithDataFilteringKey(tableAutomaticProcessing, filter).toString());
        if (Query.MoveFirst()) {
            rec = Query.MoveNextRecord();
            if (rec) {
                bCreate = false;
                vars = rec.GetVars();
                let allow = GetTouchlessAllowanceForThisDocumentType(vars);
                Log.Info("DB Allow touchless for customer '" + customerNumber + "': " + allow);
                if (allow !== allowTouchless) {
                    // update record
                    Log.Info("Update TOUCHLESS for customer '" + customerNumber + "'");
                    updateTouchlessValue(vars, allowTouchless, false);
                    CustomerOrderProcessing.Validation.UserExit.CustomizeAutomaticProcessingRecordVars(vars, true);
                    if (rec.Commit()) {
                        Log.Warn("Error during '" + tableAutomaticProcessing + "' commit: " + rec.GetLastErrorMessage());
                    }
                }
            }
        }
        // Note: default value for allowTouchless = 0
        if (bCreate && allowTouchless !== "0") {
            // create record
            Log.Info("DB " + tableAutomaticProcessing + " for customer '" + customerNumber + "' does not exist, create record");
            rec = Process.CreateTableRecord(tableAutomaticProcessing);
            if (rec) {
                vars = rec.GetVars();
                vars.AddValue_String("Customer_number__", customerNumber, true);
                updateTouchlessValue(vars, allowTouchless, true);
                vars.AddValue_String(Lib.SOP.Tables.AutomaticProcessing.dataFilteringKey, Sys.OM.Helpers.GetConfiguration().DataFilteringKey, true);
                CustomerOrderProcessing.Validation.UserExit.CustomizeAutomaticProcessingRecordVars(vars, false);
                if (rec.Commit()) {
                    Log.Warn("Error during '" + tableAutomaticProcessing + "' commit: " + rec.GetLastErrorMessage());
                }
            }
            else {
                Log.Info("Error creating record " + tableAutomaticProcessing);
            }
        }
    }
}
function GetTouchlessAllowanceForThisDocumentType(vars) {
    let source = Data.GetValue("Source__");
    let allowTouchless = "1";
    switch (source) {
        case "EDI":
            allowTouchless = vars.GetValue_String(Lib.SOP.Tables.AutomaticProcessing.touchlessAllowedForEdi, 0);
            break;
        default:
            if (isFreeTextDocument()) {
                allowTouchless = vars.GetValue_String(Lib.SOP.Tables.AutomaticProcessing.touchlessAllowedForFreeText, 0);
            }
            else {
                allowTouchless = vars.GetValue_String(Lib.SOP.Tables.AutomaticProcessing.touchlessAllowed, 0);
            }
            break;
    }
    return allowTouchless;
}
function updateTouchlessValue(vars, updatedValue, create) {
    let source = Data.GetValue("Source__");
    switch (source) {
        case "EDI":
            vars.AddValue_String(Lib.SOP.Tables.AutomaticProcessing.touchlessAllowedForEdi, updatedValue, true);
            if (create) {
                vars.AddValue_String(Lib.SOP.Tables.AutomaticProcessing.touchlessAllowed, "0", true);
                vars.AddValue_String(Lib.SOP.Tables.AutomaticProcessing.touchlessAllowedForFreeText, "0", true);
            }
            break;
        default:
            if (isFreeTextDocument()) {
                vars.AddValue_String(Lib.SOP.Tables.AutomaticProcessing.touchlessAllowedForFreeText, updatedValue, true);
                if (create) {
                    vars.AddValue_String(Lib.SOP.Tables.AutomaticProcessing.touchlessAllowedForEdi, "0", true);
                    vars.AddValue_String(Lib.SOP.Tables.AutomaticProcessing.touchlessAllowed, "0", true);
                }
            }
            else {
                vars.AddValue_String(Lib.SOP.Tables.AutomaticProcessing.touchlessAllowed, updatedValue, true);
                if (create) {
                    vars.AddValue_String(Lib.SOP.Tables.AutomaticProcessing.touchlessAllowedForEdi, "0", true);
                    vars.AddValue_String(Lib.SOP.Tables.AutomaticProcessing.touchlessAllowedForFreeText, "0", true);
                }
            }
            break;
    }
}
function TouchlessCheck() {
    let touchlessCheck = CustomerOrderProcessing.Validation.UserExit.TouchlessCheck();
    if (touchlessCheck.stop) {
        return;
    }
    let configuration = Sys.OM.Helpers.GetConfiguration();
    let touchlessPossible = touchlessCheck === false ? 0 : 1;
    let errSalesOrderNumber = 0;
    let errSalesOrderDate = 0;
    let errDueDate = 0;
    let errTotal = 0;
    let errCustomerNumber = 0;
    let errShipToNumber = 0;
    let errPriceCheck = 0;
    let errRevisedOrder = 0;
    if (Data.GetError("Sales_Order_Number__")) {
        errSalesOrderNumber = 1;
        touchlessPossible = 0;
    }
    if (Data.GetError("Sales_Order_Date__")) {
        errSalesOrderDate = 1;
        touchlessPossible = 0;
    }
    if (Data.GetError("Due_Date__")) {
        errDueDate = 1;
        touchlessPossible = 0;
    }
    if (Data.GetWarning("Total__")) {
        errTotal = 1;
        touchlessPossible = 0;
    }
    if (Data.GetError("CustomerNumber__")) {
        errCustomerNumber = 1;
        touchlessPossible = 0;
    }
    if (Data.GetError("ShipToNumber__")) {
        errShipToNumber = 1;
        touchlessPossible = 0;
    }
    if (Data.GetWarning("ShipToNumber__")) {
        errShipToNumber = 1;
        touchlessPossible = 0;
    }
    if (Lib.SOP.Helpers.IsERP("Oracle EBS") && configuration.OracleDisplayPriceCheckButton === "1" && Data.GetError("Total__")) {
        errPriceCheck = 1;
        touchlessPossible = 0;
    }
    if (Data.GetValue("SalesDocumentType__") === Lib.SOP.Helpers.SalesDocumentType.ChangeOrder) {
        errRevisedOrder = 1;
        touchlessPossible = 0;
    }
    let errMaterial = 0;
    let errQuantity = 0;
    let errUnusualQuantity = 0;
    let errUnit = 0;
    let table = Data.GetTable("Product_List__");
    let count = table.GetItemCount();
    for (let i = 0; i < count; i++) {
        let row = table.GetItem(i);
        if (!errMaterial &&
            (row.GetError("ItemNumber__") || row.GetWarning("ItemNumber__") === "_Material found from the description. Make sure that it is correct")) {
            errMaterial = 1;
            touchlessPossible = 0;
        }
        if (!errQuantity && row.GetError("Quantity__")) {
            errQuantity = 1;
            touchlessPossible = 0;
        }
        if (!errUnit && row.GetError("Unit__")) {
            errUnit = 1;
            touchlessPossible = 0;
        }
        if ((configuration.DisplayQuotationFields === "1" && row.GetValue("ItemReconciliationNumber__")) ||
            (Lib.SOP.Contracts.IsContractFeatureActivated() && row.GetValue("ContractItemNumber__"))) {
            if (row.GetWarning("Quantity__")) {
                errQuantity = 1;
                touchlessPossible = 0;
                Log.Warn("PreventApproval has been called for field Product_List__.Quantity__(#" + i + "): " + row.GetWarning("Quantity__"));
            }
            if (row.GetWarning("Total__")) {
                touchlessPossible = 0;
                Log.Warn("PreventApproval has been called for field Product_List__.Total__(#" + i + "): " + row.GetWarning("Total__"));
            }
        }
        if (!errUnusualQuantity && configuration.DetectUnusualQuantities === "1" && configuration.EnableReportingOnItems === "1" && row.GetWarning("Quantity__") === "Unusual quantity") {
            errUnusualQuantity = 1;
            touchlessPossible = 0;
            Log.Warn("PreventApproval has been called for field Product_List__.Quantity__(#" + i + "): " + row.GetWarning("Quantity__"));
        }
        if (Lib.SOP.Helpers.IsERP("Oracle EBS") && configuration.OracleDisplayPriceCheckButton === "1" && (row.GetError("Total__") || row.GetError("Unit_Price__"))) {
            errPriceCheck = 1;
            touchlessPossible = 0;
        }
    }
    Data.SetValue("TouchlessErrorSales_Order_Date__", errSalesOrderDate);
    Data.SetValue("TouchlessErrorDue_Date__", errDueDate);
    Data.SetValue("TouchlessErrorTotal__", errTotal);
    Data.SetValue("TouchlessErrorCustomerNumber__", errCustomerNumber);
    Data.SetValue("TouchlessErrorShipToNumber__", errShipToNumber);
    Data.SetValue("TouchlessErrorSales_Order_Number__", errSalesOrderNumber);
    Data.SetValue("TouchlessErrorItemNumber__", errMaterial);
    Data.SetValue("TouchlessErrorQuantity__", errQuantity);
    Data.SetValue("TouchlessErrorUnusualQuantity__", errUnusualQuantity);
    Data.SetValue("TouchlessErrorUnit__", errUnit);
    Data.SetValue("TouchlessErrorPricing__", errPriceCheck);
    Data.SetValue("TouchlessErrorRevisedOrder__", errRevisedOrder);
    if (touchlessPossible !== 1) {
        Process.PreventApproval();
    }
    Data.SetValue("TouchlessPossible__", touchlessPossible);
}
//*******************************************************************************************
//************************************************************
//******************************Oracle specific checks******************************
function OracleDataChecks() {
    if (!CustomerOrderProcessing.Validation.UserExit.DisableOracleDataChecks("CheckCustomerAndPartnerOrgID")) {
        CheckCustomerAndPartnerOrgID();
    }
    if (!CustomerOrderProcessing.Validation.UserExit.DisableOracleDataChecks("CheckMaterialsWarehouseID")) {
        CheckMaterialsWarehouseID();
    }
    if (!CustomerOrderProcessing.Validation.UserExit.DisableOracleDataChecks("CheckMandatorySalesOrderDate")) {
        CheckMandatorySalesOrderDate();
    }
    if (!CustomerOrderProcessing.Validation.UserExit.DisableOracleDataChecks("CheckWarehouseOrgID")) {
        CheckWarehouseOrgID();
    }
    if (!CustomerOrderProcessing.Validation.UserExit.DisableOracleDataChecks("CheckOrderTypeOrgID")) {
        CheckOrderTypeOrgID();
    }
    if (!CustomerOrderProcessing.Validation.UserExit.DisableOracleDataChecks("CheckLineItemWarehouse")) {
        LineItemCheckWarehouse();
    }
    if (!CustomerOrderProcessing.Validation.UserExit.DisableOracleDataChecks("CheckPrice")) {
        CheckPrice();
    }
}
function CheckPrice() {
    Lib.SOP.ERP.InitializeERPManager(Sys.OM.Helpers.GetConfiguration().ERP).priceCheck();
}
function CheckMandatorySalesOrderDate() {
    let date = Data.GetValue("Sales_Order_Date__");
    if (date == null || date === "") {
        Data.SetError("Sales_Order_Date__", "The sales order date is required");
    }
    else {
        Data.SetError("Sales_Order_Date__", "");
    }
}
function CheckCustomerAndPartnerOrgID() {
    let customerTable = Lib.SOP.Tables.Customers;
    let partnerTable = Lib.SOP.Tables.Partners;
    let customerNumber = Data.GetValue("CustomerNumber__");
    let partnerNumber = Data.GetValue("ShipToNumber__");
    let orgID = Data.GetValue("OrgId__");
    let tableName = customerTable.tableName;
    let filterCustomers = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual(customerTable.number, customerNumber), Sys.Helpers.LdapUtil.FilterEqual(customerTable.organizationID, orgID));
    if (customerNumber && Lib.SOP.Helpers.QueryDB(tableName, filterCustomers, "").length === 0) {
        Data.SetError("CustomerNumber__", "Customer number doesn't exist in the current organization");
    }
    else {
        Data.SetError("CustomerNumber__", "");
    }
    let tableNamePartners = partnerTable.tableName;
    let filterPartners = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual(partnerTable.number, partnerNumber), Sys.Helpers.LdapUtil.FilterEqual(partnerTable.organizationID, orgID));
    if (partnerNumber && Lib.SOP.Helpers.QueryDB(tableNamePartners, filterPartners, "").length === 0) {
        Data.SetError("ShipToNumber__", "Partner number doesn't exist in the current organization");
    }
    else {
        Data.SetError("ShipToNumber__", "");
    }
}
function CheckMaterialsWarehouseID() {
    let materialTable = Lib.SOP.Tables.Materials;
    let productList = Data.GetTable("Product_List__");
    let tableName = materialTable.tableName;
    for (let idx = 0; idx < productList.GetItemCount(); idx++) {
        let item = productList.GetItem(idx);
        let itemNumber = item.GetValue("ItemNumber__");
        let warehouseCode = item.GetValue("WarehouseCodeItem__");
        if (!warehouseCode) {
            warehouseCode = "*";
        }
        let filterMaterials = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual(materialTable.number, itemNumber), Sys.Helpers.LdapUtil.FilterEqual(materialTable.warehouseCode, warehouseCode));
        if (itemNumber && Lib.SOP.Helpers.QueryDB(tableName, filterMaterials, "").length === 0) {
            item.SetError("ItemNumber__", "Material number doesn't exist in the current warehouse");
        }
        else {
            item.SetError("ItemNumber__", "");
        }
    }
}
function CheckWarehouseOrgID() {
    let warehouseTable = Lib.SOP.Tables.Warehouses;
    let warehouseCode = Data.GetValue("WarehouseCode__");
    let orgID = Data.GetValue("OrgId__");
    if (warehouseCode) {
        let tableName = warehouseTable.tableName;
        let filterWarehouses = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual(warehouseTable.warehouseCode, warehouseCode), Sys.Helpers.LdapUtil.FilterEqual(warehouseTable.organizationID, orgID));
        if (Lib.SOP.Helpers.QueryDB(tableName, filterWarehouses, "").length === 0) {
            Data.SetError("WarehouseCode__", "Warehouse code doesn't exist in the current organization");
        }
        else {
            Data.SetError("WarehouseCode__", "");
        }
    }
}
function CheckOrderTypeOrgID() {
    let orderTypeTable = Lib.SOP.Tables.OrderTypes;
    let orderTypeID = Data.GetValue("OrderTypeID__");
    let orgID = Data.GetValue("OrgId__");
    if (orderTypeID) {
        let tableName = orderTypeTable.tableName;
        let filterOrderType = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual(orderTypeTable.transactionTypeId, orderTypeID), Sys.Helpers.LdapUtil.FilterEqual(orderTypeTable.organizationID, orgID));
        if (Lib.SOP.Helpers.QueryDB(tableName, filterOrderType, "").length === 0) {
            Data.SetError("OrderType__", "Order Type doesn't exist in the current organization");
        }
        else {
            Data.SetError("OrderType__", "");
        }
    }
}
function LineItemCheckWarehouse() {
    let materialTable = Lib.SOP.Tables.Materials;
    let itemsTable = Data.GetTable("Product_List__");
    let nbItems = itemsTable.GetItemCount();
    for (let idx = 0; idx < nbItems; idx++) {
        let item = itemsTable.GetItem(idx);
        let warehouseCode = item.GetValue("WarehouseCodeItem__");
        let materialNumber = item.GetValue("ItemNumber__");
        if (warehouseCode) {
            let tableName = materialTable.tableName;
            let filterMaterials = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual(materialTable.warehouseCode, warehouseCode), Sys.Helpers.LdapUtil.FilterEqual(materialTable.number, materialNumber));
            if (Lib.SOP.Helpers.QueryDB(tableName, filterMaterials, "").length === 0) {
                item.SetError("WarehouseCodeItem__", "Warehouse code doesn't exist for this item");
            }
            else {
                item.SetError("WarehouseCodeItem__", "");
            }
        }
    }
}
//*******************************************************************************************
function SendMail() {
    // Get information about the current user
    let user = Users.GetCurrentUser();
    Log.Info("user : " + user);
    // Create an email transport
    let email = Process.CreateTransport("mail");
    Log.Info("email : " + email);
    // Get the email parameters from the external variables set in the HTML page script
    let vars = email.GetUninheritedVars();
    vars.AddValue_String("subject", Variable.GetValueAsString("subjectValue"), true);
    vars.AddValue_String("emailAddress", Variable.GetValueAsString("recipientValue"), true);
    vars.AddValue_String("Message", Variable.GetValueAsString("bodyValue"), true);
    // Attach to the email the files attached to the process and compute the total size
    let nbAttach = Attach.GetNbAttach();
    for (let i = 0; i < nbAttach; i++) {
        // Add an attachment
        let otherAttach = Attach.GetAttach(i);
        if (otherAttach) {
            email.AddAttachEx(otherAttach);
        }
    }
    Log.Info("Email " + user.GetVars().GetValue_String("mail", 0));
    // Notify in case of failure
    let notif = email.AddNotif(0);
    notif.GetVars().AddValue_String("NotifyAddress", user.GetVars().GetValue_String("mail", 0), true);
    notif.GetVars().AddValue_String("NotifyAddressType", "SM", false);
    notif.GetVars().AddValue_String("NotifyMessage", "F", false);
    // Send the email
    email.Process();
}
function GetCustomerData() {
    if (Lib.SOP.Helpers.IsERP("SAP")) {
        let customerNumber = Data.GetValue("CustomerNumber__");
        let filter = "KUNNR = '" + Lib.SOP.SAP.Helpers.NormalizeID(customerNumber, 10, false, true) + "'";
        Log.Info("[GetCustomerData] filter: " + filter);
        let aFields = [
            "NAME1", // Customer Name
            "KUNNR", // Customer number
            "LAND1", // Country
            "ORT01", // City
            "PSTLZ", // Postal code
            "REGIO", // Region
            "STRAS", // Street
            "PFACH", // PO Box
            "NAME2", // Customer name 2
            "NAME3", // Customer name 3
            "NAME4", // Customer name 4
            "ORT02", // District
            "TELF1", // First telephone number
            "TELFX", // Fax number
            "LZONE", // Transportation zone
            "SPRAS" // Language Key
        ];
        let pFields = aFields.toString().replace(/,/gm, "|");
        let tableName = "KNA1";
        Log.Info("[GetCustomerData] SAPHelpers.sapReadTable " + tableName + " fields: " + pFields);
        let results = Sys.OM.SAP.Query(tableName, pFields, filter, 1);
        if (results.length > 0) {
            results = results[0];
            let customerData = {};
            for (let i = 0; i < aFields.length; i++) {
                customerData[aFields[i]] = results[aFields[i]] ? results[aFields[i]].trim() : "";
            }
            let jsonCustomerData = JSON.stringify(customerData);
            Variable.SetValueAsString("jsonCustomerData", jsonCustomerData);
        }
    }
}
function DataChecks() {
    CheckDuplicate();
    CheckDates();
    ReconcileAndCheckQuote();
    ReconcileAndCheckContract();
    LineItemCheckQuantity();
    LineItemCheckUnit();
    LineItemCheckUnitPrice();
    LineItemCheckNationalCode();
    if (Lib.SOP.Helpers.IsERP("Oracle EBS")) {
        OracleDataChecks();
    }
    if (!Lib.SOP.isFromPortal() && !Lib.SOP.isFromPunchout()) {
        CheckEmail();
    }
    let oConfig = Sys.OM.Helpers.GetConfiguration();
    let bIsNSOPreAgreed = Lib.SOP.Helpers.IsNSOPreAgreed(oConfig);
    if (oConfig.EnableNSO === "1" && bIsNSOPreAgreed) {
        let sHeaderTenderNumber = Data.GetValue("Tender_Number__");
        let oProductList = Data.GetTable("Product_List__");
        let iItemCount = oProductList.GetItemCount();
        let bRequired = sHeaderTenderNumber === null || sHeaderTenderNumber === "";
        for (let i = 0; i < iItemCount; ++i) {
            oProductList.GetItem(i).SetRequired("TenderNumber__", bRequired);
        }
    }
    //Check PreAgreed
    if (oConfig.EnableNSO === "1" && bIsNSOPreAgreed && Data.GetValue("EDI_Format__") === "NSO") {
        Data.SetError(Lib.SOP.Helpers.IsERP("Oracle EBS") ? "OrderType__" : "DocumentType__", "_PreAgreedUnauthorized");
    }
}
function WaitForErpAck() {
    let configuration = Sys.OM.Helpers.GetConfiguration();
    let isParentSplitGenericOrderWithChildren = Data.IsNullOrEmpty("JsonFromSplitOrder__") && (Lib.SOP.Helpers.IsERP("Generic") && configuration.SapLineItemSplitGroupingCriteria && configuration.SplitMethod !== "KeepOneOrder");
    if ((Lib.SOP.Helpers.IsERP("Oracle EBS") || !isParentSplitGenericOrderWithChildren) && configuration.EnableERPIntegrationDelay === "1") {
        let expirationTime = parseInt(configuration.ERPIntegrationDelay, 10);
        let validityDT = new Date();
        validityDT.setMinutes(validityDT.getMinutes() + expirationTime);
        Data.SetValue("ValidityDateTime", validityDT);
        Process.SetAutoValidateOnExpiration(true);
        Log.Info("WaitForErpAck: WaitForUpdate");
        Process.WaitForUpdate();
    }
}
function ResetValidity() {
    let validityDT = new Date();
    validityDT.setDate(validityDT.getDate() + 30);
    Data.SetValue("ValidityDateTime", validityDT);
}
function DisableAutolearningIfSynergyIsPerfect() {
    let config = Sys.OM.Helpers.GetConfiguration();
    let useSynergy = config.EnableSynergy === "1" && config.EnableSynergyHeader === "1";
    let alIsDisableOnTable = Variable.GetValueAsString("AutolearnTableDisabled") === "1";
    let nbManuallyModifiedFields = Process.GetModifiedFieldsCount();
    if (useSynergy && alIsDisableOnTable && nbManuallyModifiedFields === 0) {
        Log.Info("Synergy is perfect: Autolearning is disabled");
        Data.SetValue("Disableautolearning", "true");
    }
}
function FillModifiedFieldsCounters() {
    // Fill the fields that counts the fields modifications
    Data.SetValue("ManuallyModifiedTableFieldsCount__", Process.GetModifiedFieldsCount("manual", "table", "Product_List__"));
    Data.SetValue("AutomaticallyModifiedTableFieldsCount__", Process.GetModifiedFieldsCount("automatic", "table", "Product_List__"));
    Data.SetValue("ManuallyModifiedFieldsCount__", Process.GetModifiedFieldsCount());
    Data.SetValue("AutomaticallyModifiedFieldsCount__", Process.GetModifiedFieldsCount("automatic", "all"));
}
function ShouldRunActionTouchless() {
    if (Data.GetValue("/Process/NeedValidation") || !Data.GetValue("AllowTouchless__")) {
        // disable touchless
        Data.SetValue("EnableTouchless", false);
    }
    else if (!Data.IsFormInError() && Data.GetValue("TouchlessPossible__")) {
        return true;
    }
    return false;
}
function ShouldIgnoreCheckTotal() {
    if (Lib.SOP.Helpers.IsSplitOrder()) {
        return true;
    }
    let ignoreCheckTotal = false;
    let filter = Sys.Helpers.LdapUtil.FilterEqual("Customer_number__", Data.GetValue("CustomerNumber__")).toString();
    let vars = Lib.SOP.Helpers.QueryDB("SO - Automatic processing__", filter, "IgnoreTotalCheck__");
    if (vars.length > 0) {
        ignoreCheckTotal = vars[0].GetValue_String("IgnoreTotalCheck__", 0) === "1";
    }
    return ignoreCheckTotal;
}
//**************************************************************************************************************************
//#region Action methods
//**************************************************************************************************************************
const Actions = {
    sendEmail: function () {
        Process.PreventApproval();
        Process.DisableChecks();
        SendMail();
    },
    archiveOnly: function () {
        CheckSource();
        Process.DisableChecks();
        Process.WaitForUpdate(false);
        Data.SetValue("Order_Creation_Error__", "");
        Data.SetValue("Order_Status__", "OrderArchived");
        if (!Lib.SOP.Helpers.IsERP("SAP")) {
            //In case of archive only, do not generate an output and do not wait for an ACK since the order is already in the ERP
            Variable.SetValueAsString("Publishing", "");
            Variable.SetValueAsString("WaitForERPACK", "0");
        }
        else {
            //In SAP mode, as the command is imported from SAP data, disable autolearning
            Data.SetValue("Disableautolearning", "true");
        }
        if (!Data.GetValue("Document_ERP_ID__")) {
            //Even if checks are disabled, the ERPNumber is still required
            Data.SetError("Document_ERP_ID__", "The ERP Document ID is requiered to archive only");
        }
        FillModifiedFieldsCounters();
    },
    reject: function () {
        Process.DisableChecks();
        Data.SetValue("KeepOpenAfterApproval", "WaitAndReject");
        Lib.SOP.Helpers.NotifySDA();
        if (Lib.SOP.isFromPortal()) {
            Lib.SOP.PORTAL.UpdatePortalOrderStatus(Data.GetValue("SourceRUID"), "OrderCancelled", true);
        }
        Process.PreventApproval();
    },
    approve: async function () {
        let configuration = Sys.OM.Helpers.GetConfiguration();
        CheckSource();
        DataChecks();
        GetCustomerData();
        if (Data.IsFormInError()) {
            // stop if any errors on form
            return;
        }
        CleanDropship();
        if (Variable.GetValueAsString("DuplicatesChanged") === "true" && configuration.ManualDuplicateCheck !== "1") {
            Log.Info("Duplicate alert value has been modified, saving duplicate alert info...");
            SaveDuplicateCheckAlertLevel();
        }
        if (Variable.GetValueAsString("TouchlessChanged") === "true") {
            Log.Info("Touchless value has been modified, saving touchless info...");
            SaveTouchlessInfo();
        }
        SaveCompleteDeliveryInfo();
        //Then the form is approved
        const erpManager = Lib.SOP.ERP.InitializeERPManager(configuration.ERP);
        const postSyncOk = await erpManager.PostSync();
        if (postSyncOk && Data.GetError("Document_ERP_ID__")) {
            // stop if any errors after posting
            return;
        }
        Data.SetValue("Order_status__", "OrderAccepted");
        if (Lib.SOP.Helpers.IsERP("Oracle EBS") || Lib.SOP.Helpers.IsERP("Generic")) {
            //reset creation error in case we are re-validating the form because no ack was received from the erp or the update triggered by receiving the ack put the form in error
            Data.SetValue("Order_Creation_Error__", "");
        }
        DisableAutolearningIfSynergyIsPerfect();
        FillModifiedFieldsCounters();
    },
    postForce: async function () {
        let transacSapId = Transaction.Read("SAP_POST");
        // If Document Id already exists into SAP, we keep it
        // else there is a risk of double post
        if (transacSapId && transacSapId === "begin") {
            Transaction.Delete("SAP_POST");
        }
        await Actions.approve();
    },
    others: function () {
        CheckSource();
        DataChecks();
        GetCustomerData();
        // Error on Total should lock the validation only for touchless
        if (Data.GetActionName() !== "" || Data.GetActionType() !== "" || !ShouldIgnoreCheckTotal()) {
            CheckTotal();
        }
        if (Lib.SOP.Helpers.IsNSOChangeOrderOrCancellationOrConfirmation()) {
            Log.Warn("This document is an NSO change order or cancellation, manual verification is required");
            Process.PreventApproval();
            Data.SetValue("EnableTouchless", false);
        }
        if (Data.GetWarning("ShipToNumber__") && Data.GetValue("ShipToAddress__")) {
            Log.Warn("This ShipTo address is not related to the SoldTo.");
            Process.PreventApproval();
            Data.SetValue("EnableTouchless", false);
        }
        //Touchless specifics
        TouchlessCheck();
        if (ShouldRunActionTouchless()) {
            Actions.touchless();
        }
        // Setting updating fields counters
        FillModifiedFieldsCounters();
    },
    touchless: function () {
        Data.SetValue("Order_status__", "OrderAccepted");
        CleanDropship();
        WaitForErpAck();
    },
    autocomplete: function () {
        // TODO YSL 29/09/2020 Line methods should be refactored so that we do not iterate many times on item lines
        // reset error on total (if the sum of line items match the total)
        CheckTotal();
        LineItemCheckQuantity();
        LineItemCheckUnit();
        LineItemCheckNationalCode();
        if (!CustomerOrderProcessing.Validation.UserExit.DisableOracleDataChecks("CheckPrice")) {
            Lib.SOP.ERP.InitializeERPManager(Sys.OM.Helpers.GetConfiguration().ERP).priceCheck();
        }
    },
    ProcessSplittedOrderError: function () {
        let d = Data.GetValue("Current_Recieved_Document_ERP_ID__");
        Log.Info("ProcessSplittedOrderError for sub_order " + d);
        let table = Data.GetTable("Product_List__");
        let count = table.GetItemCount();
        for (let i = 0; i < count; i++) {
            if ((table.GetItem(i).GetValue("LineItemSplitGroupId__") || "DEFAULT") === d) {
                table.GetItem(i).SetValue("LineItemSplitStatus__", "Error");
            }
        }
        WaitForErpAck();
    },
    ProcessSplittedOrderUpdate: function () {
        let d = Data.GetValue("Current_Recieved_Document_ERP_ID__");
        Log.Info("ProcessSplittedOrderUpdate for sub_order " + d);
        let table = Data.GetTable("Product_List__");
        let count = table.GetItemCount();
        for (let i = 0; i < count; i++) {
            if ((table.GetItem(i).GetValue("LineItemSplitGroupId__") || "DEFAULT") === d) {
                table.GetItem(i).SetValue("LineItemSplitStatus__", "Success");
            }
        }
        WaitForErpAck();
    },
    setBackToValidationState: function () {
        Log.Info("ERP Ack in error, process sent back to state 70");
        let date = new Date();
        date.setDate(date.getDate() + 30);
        Data.SetValue("ValidityDateTime", date);
        Process.PreventApproval();
    },
    setAside: function () {
        Log.Info("The order was set aside");
        Process.PreventApproval();
        Process.LeaveForm();
    },
    ProcessDispatching: function () {
        Log.Info("The order is dispatched");
        let currentProcessNormalizeFilter = Data.GetValue("PdfNormalizeFilter");
        let table = Data.GetTable("Dispatch_table__");
        let dispatchs = [];
        let orders = [];
        for (let i = 0; i < table.GetItemCount(); i++) {
            if (table.GetItem(i).GetValue("Action__") === "DISPATCH") {
                dispatchs.push(i);
            }
            if (table.GetItem(i).GetValue("Action__") === "SEPARATE") {
                orders.push(i);
            }
        }
        for (let i = 0; i < orders.length; i++) {
            let attachIndex = orders[i];
            let proc = Process.CreateProcessInstance("Customer Order Processing", true, true);
            let refDocFile = Attach.GetInputFile(attachIndex);
            let refDocAttach = proc.AddAttachEx(refDocFile);
            let refDocAttachVars = refDocAttach.GetVars();
            refDocAttachVars.AddValue_String("AttachToProcess", "1", true);
            //force conversion if doc is not a pdf
            if (Attach.GetExtension(attachIndex) !== ".pdf") {
                refDocAttachVars.AddValue_String("AttachOutputFormat", ".pdf", true);
            }
            let xAttach = Attach.GetAttach(attachIndex);
            let xVars = xAttach.GetVars();
            let convertOptions = xVars.GetValue_String("AttachConvertOptions", 0);
            if (convertOptions) {
                refDocAttachVars.AddValue_String("AttachConvertOptions", convertOptions, true);
            }
            for (let j = 0; j < dispatchs.length; j++) {
                let att2 = proc.AddAttach();
                let attVars2 = att2.GetVars();
                attachIndex = dispatchs[j];
                attVars2.AddValue_String("AttachOutputName", Attach.GetName(attachIndex), true);
                att2.SetAttachFile(Attach.GetAttach(attachIndex).GetAttachFile());
            }
            let extVars = proc.GetExternalVars();
            extVars.AddValue_String("Dispatched", "1", true);
            let uniVars = proc.GetUninheritedVars();
            uniVars.AddValue_String("Subject", Data.GetValue("Subject"), true);
            uniVars.AddValue_String("FromAddress", Data.GetValue("FromAddress"), true);
            if (currentProcessNormalizeFilter) {
                uniVars.AddValue_String("PdfNormalizeFilter", currentProcessNormalizeFilter.toString(), true);
            }
            proc.Process();
        }
        Data.SetValue("Split", 1);
        Data.SetValue("SplitDone", 1);
        Data.SetValue("ValidationState", 6);
        Data.SetValue("SplitDocumentCount", orders.length);
        Process.DisableChecks();
        Process.LeaveForm();
    },
    executeActionsTypeApprove: async function (actionName) {
        switch (actionName) {
            case "Send_Email":
                Actions.sendEmail();
                break;
            case "Archive_Only":
                Actions.archiveOnly();
                break;
            case "reject":
                Actions.reject();
                break;
            case "Post_Force":
                await Actions.postForce();
                break;
            case "ERPAckError":
                Actions.setBackToValidationState();
                break;
            case "setAside":
                Actions.setAside();
                break;
            case "DispatchAttachments":
                Actions.ProcessDispatching();
                break;
            default:
                WaitForErpAck();
                await Actions.approve();
                break;
        }
    },
    onExpiration: function () {
        ResetValidity();
        Log.Info("ERPAck not received");
        Data.SetValue("Order_Status__", "OrderCreationError");
        let errorMessage = Language.Translate("_Order ERP acknowledgement was not received in the default delay of {0} minutes, please contact your administrator", true, Sys.OM.Helpers.GetConfiguration().ERPIntegrationDelay);
        Data.SetValue("Order_Creation_Error__", errorMessage);
        Process.SetAutoValidateOnExpiration(false);
        Process.WaitForUpdate(false);
        Process.PreventApproval();
    },
    UpdateSplittedOrder: function (status, subOrderId, erpId) {
        Log.Info("ProcessSplittedOrderUpdate with parameters : " + status + ", " + subOrderId + ", " + erpId);
        let table = Data.GetTable("Product_List__");
        let count = table.GetItemCount();
        let nbLinesUpdated = 0;
        let docId = Data.GetValue("Document_ERP_ID__");
        if (docId === "") {
            docId = erpId;
        }
        else {
            docId = docId + ", " + erpId;
        }
        Data.SetValue("Document_ERP_ID__", docId);
        status = status === "S" ? "Success" : "Error";
        for (let i = 0; i < count; i++) {
            if ((table.GetItem(i).GetValue("LineItemSplitGroupId__") || "DEFAULT") === subOrderId) {
                table.GetItem(i).SetValue("LineItemSplitStatus__", status);
                table.GetItem(i).SetValue("SapLineItemSplitDocumentId__", erpId);
            }
            if (table.GetItem(i).GetValue("LineItemSplitStatus__") !== "") {
                nbLinesUpdated++;
            }
        }
        if (nbLinesUpdated == count) {
            //we finished
            Log.Info("ProcessSplittedOrderUpdate : update order state to complete");
            let s = 0;
            let e = 0;
            for (let i = 0; i < count; i++) {
                if (table.GetItem(i).GetValue("LineItemSplitStatus__") === "Success") {
                    s++;
                }
                if (table.GetItem(i).GetValue("LineItemSplitStatus__") === "Error") {
                    e++;
                }
            }
            if (e === 0) {
                Data.SetValue("Order_Status__", "OrderAccepted");
            }
            else if (s === 0) {
                Data.SetValue("Order_Status__", "OrderCreationError");
            }
            else {
                Data.SetValue("Order_Status__", "OrderPartiallyAccepted");
            }
        }
        else {
            Log.Info("ProcessSplittedOrderUpdate : Waiting for next ErpAck (recieved " + nbLinesUpdated + "/" + count + " ack)");
            WaitForErpAck();
        }
    }
};
//#endregion
function TraceForTouchlessDiagnostic() {
    if (!(Data.GetValue("AllowTouchless__") && Data.GetValue("TouchlessPossible__"))) {
        return;
    }
    let touchlessMessage = "";
    if (Data.GetValue("/Process/NeedValidation") !== 0) {
        touchlessMessage += " NeedValidation should be 0, but is " + Data.GetValue("/Process/NeedValidation") + ".";
    }
    if (Data.FormHasError()) {
        touchlessMessage += " Form has error.";
    }
    let fieldsInError = Data.GetFieldsInError();
    if (fieldsInError.nbErrors > 0) {
        let niceNamesFieldsInError = [];
        if (fieldsInError.fields.length > 0) {
            niceNamesFieldsInError = niceNamesFieldsInError.concat(fieldsInError.fields);
        }
        for (let table in fieldsInError.tables) {
            for (let row in fieldsInError.tables[table].rows) {
                for (let rowField in fieldsInError.tables[table].rows[row]) {
                    niceNamesFieldsInError.push(table + "." + rowField + "(#" + row + ")");
                }
            }
        }
        touchlessMessage += " Fields in error: " + niceNamesFieldsInError.join(", ") + ".";
    }
    if (touchlessMessage !== "") {
        Log.Warn("Touchless diagnostic:" + touchlessMessage);
    }
}
function DisableALForEDI() {
    if (Variable.GetValueAsString("EDIPreprocessing") === "1") {
        Variable.SetValueAsString("AutolearnTableDisabled", "1");
    }
}
//**************************************************************************************************************************
//#region Entry Point
//**************************************************************************************************************************
async function ValidationScriptEntryPoint() {
    Sys.OM.Helpers.SetConfiguration(Lib.SOP.Configuration.initializeConfigurationServer());
    Lib.SOP.Helpers.CheckIfConfigurationReachable();
    Lib.SOP.Archiving.SetArchivingParameters();
    Lib.SOP.TablesUpdater.FillItemsCount();
    if (Data.GetValue("SalesDocumentType__") === "QuoteRequest") {
        Data.SetValue("QuotationNumber__", "");
    }
    if (Data.GetValue("EDI_Format__") === "NSO") {
        Data.SetValue("Disableautolearning", "true");
    }
    //If no split order already executed, check
    let baseNameForGroups = "";
    if (Lib.SOP.Helpers.IsERP("Generic")) {
        baseNameForGroups = Data.GetValue("Sales_Order_Number__") + "_";
    }
    Lib.SOP.SAP.Split.InitializeProductLinesGroupIds(Sys.OM.Helpers.GetConfiguration(), baseNameForGroups);
    if (CustomerOrderProcessing.Validation.UserExit.OnValidationScriptBegin().stop) {
        return;
    }
    let currentActionType;
    let currentActionName = Data.GetActionName();
    if (Process.AutoValidatingOnExpiration()) {
        currentActionType = "expire";
    }
    else {
        currentActionType = Data.GetActionType();
    }
    Log.Info("Action type: " + currentActionType + ", name: " + currentActionName);
    switch (currentActionType) {
        case "approve":
        case "approve_asynchronous":
        case "ResumeWithAction":
            {
                let command = currentActionName.split("|", 4);
                if (command.length === 4 && command[0] === "UpdatedSplittedOrder") {
                    Log.Warn("UpdateSplittedOrder");
                    Actions.UpdateSplittedOrder(command[1], command[2], command[3]);
                }
                else {
                    Log.Warn("executeActionsTypeApprove");
                    await Actions.executeActionsTypeApprove(currentActionName);
                }
            }
            break;
        case "autocomplete":
            Actions.autocomplete();
            break;
        case "expire":
            Log.Info("Case Expire");
            Actions.onExpiration();
            break;
        default:
            //case touchless/retry/doc upload
            Actions.others();
            break;
    }
    Data.SetValue("TouchlessDone__", Data.GetValue("TouchlessDone"));
    DisableALForEDI();
    CustomerOrderProcessing.Validation.UserExit.OnValidationScriptEnd();
}
//#endregion
Sys.Helpers.Promise.GlobalExceptionOnReject(ValidationScriptEntryPoint().then(() => {
    TraceForTouchlessDiagnostic();
    // BAPI managers must be finalized all the time. Leave this call at the end of the script
    Lib.SOP.SAP.Helpers.FinalizeAllBapiManagers();
}));
//# sourceMappingURL=validationscript.js.map