///#GLOBALS Lib
//#region Global variables
// **************************************************************************************************************************
let g_erpackmode;
let g_sapLanguage = "E";
let BrowseHelper = Sys.Helpers.Browse;
let SendEmail = Sys.Helpers.SendEmail;
let ShipToInstance;
let SoldToInstance;
let g_panes = [];
let g_buttons = [];
let g_erpOrderDocument;
let ParameterDetails;
//#endregion
//#region UserExit definition
// **************************************************************************************************************************
let UserExit = {
    OnHTMLScriptBegin: function () {
        return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.OnHTMLScriptBegin") || {};
    },
    OnHTMLScriptEnd: function () {
        Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.OnHTMLScriptEnd");
    },
    OnSAPTextsTableFilled: function () {
        Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.OnSAPTextsTableFilled");
    },
    GetSoldToExtraFilter: function () {
        return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.GetSoldToExtraFilter");
    },
    GetShipToExtraFilter: function () {
        return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.GetShipToExtraFilter");
    },
    GetTableColumnsToDisplay: function (tableColumnsToDisplay) {
        let returnedTableColumnsToDisplay = Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.GetTableColumnsToDisplay", tableColumnsToDisplay);
        return returnedTableColumnsToDisplay ? returnedTableColumnsToDisplay : tableColumnsToDisplay;
    },
    ProcessingOptionsHide: function (hide) {
        return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.ProcessingOptionsHide", hide);
    },
    GetConversationInfo: function (conversationInfo, currentOrderType) {
        return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Common.GetConversationInfo", conversationInfo, currentOrderType) || conversationInfo;
    },
    OnCustomerChange: function () {
        // OnCustomerChange user exit removed from Lib.SOP.Customization.Common. Kept for retro-compatibility here.
        const onCustomerChangeCommonFunc = Sys.Helpers.TryGetFunction("Lib.SOP.Customization.Common.OnCustomerChange");
        if (onCustomerChangeCommonFunc) {
            onCustomerChangeCommonFunc();
        }
        return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.OnCustomerChange");
    },
    OnShipToChange: function () {
        // OnShipToChange user exit removed from Lib.SOP.Customization.Common. Kept for retro-compatibility here.
        const onShipToChangeCommonFunc = Sys.Helpers.TryGetFunction("Lib.SOP.Customization.Common.OnShipToChange");
        if (onShipToChangeCommonFunc) {
            onShipToChangeCommonFunc();
        }
        return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.OnShipToChange");
    },
    OnPartnersTableLoadEnd: function () {
        return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.OnPartnersTableLoadEnd");
    },
    UnlinkSoldToShipTo: function () {
        return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Common.UnlinkSoldToShipTo");
    },
    OnSoldToBrowseQuerySuccess: function (queryValue, table, dialog) {
        Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.OnSoldToBrowseQuerySuccess", queryValue, table, dialog);
    },
    OnShipToBrowseQuerySuccess: function (queryValue, table, dialog) {
        Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.OnShipToBrowseQuerySuccess", queryValue, table, dialog);
    },
    CustomizeArchiveOnlyDialog: function (fillDialogBox, commitDialogBox, validateDialogBox) {
        return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.CustomizeArchiveOnlyDialog", fillDialogBox, commitDialogBox, validateDialogBox) || {};
    },
    GetAutomaticProcessingExtraFilter: function () {
        return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Common.GetAutomaticProcessingExtraFilter");
    },
    OnSoldToSearchAfterControlChanged: function (searchTableDefinition, controlChanged) {
        return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.OnSoldToSearchAfterControlChanged", searchTableDefinition, controlChanged) || { customFilterField: null, customFilterValue: null };
    },
    CustomizeDuplicateCheckWarningPopupTable: function () {
        return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Common.CustomizeDuplicateCheckWarningPopupTable");
    },
    CustomizeSalesArea: function (salesArea, isSimulationOrPost) {
        Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Common.CustomizeSalesArea", salesArea, isSimulationOrPost);
    },
    ModifyConversationPopupOptions: function (conversationPopup, conversationAction) {
        return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.ModifyConversationPopupOptions", conversationPopup, conversationAction) || conversationPopup;
    },
    DisableDropShipAddressFromExtractedShipToAddress: function () {
        return !!Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Common.DisableDropShipAddressFromExtractedShipToAddress");
    },
    OnAdditionalPartnerItemRetrieved: function (controlChanged) {
        Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.OnAdditionalPartnerItemRetrieved", controlChanged);
    },
    OverrideSoldToFilter: function (filter) {
        var _a;
        return (_a = Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.OverrideSoldToFilter", filter)) !== null && _a !== void 0 ? _a : filter;
    },
    OverrideShipToFilter: function (filter) {
        var _a;
        return (_a = Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.OverrideShipToFilter", filter)) !== null && _a !== void 0 ? _a : filter;
    },
    OverrideSoldToQueryTable: function (tableName, tableStructure) {
        var _a;
        return (_a = Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.OverrideSoldToQueryTable", tableName, tableStructure)) !== null && _a !== void 0 ? _a : tableName;
    },
    OverrideShipToQueryTable: function (tableName, tableStructure) {
        var _a;
        return (_a = Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.OverrideShipToQueryTable", tableName, tableStructure)) !== null && _a !== void 0 ? _a : tableName;
    },
    GetShipMethodFilter: function (currentFilter) {
        return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.GetShipMethodFilter", currentFilter) || null;
    },
    DisableOracleDataChecks: function (checkName) {
        return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Common.DisableOracleDataChecks", checkName);
    },
    CustomizeAdditionalPartnerBrowseConfiguration: function (partnerType, table, columns, searchCriteria, isCP) {
        return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.CustomizeAdditionalPartnerBrowseConfiguration", partnerType, table, columns, searchCriteria, isCP) || null;
    },
    ForceAdditionalPartnersSync: function () {
        return !!Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.ForceAdditionalPartnersSync");
    }
};
//#endregion
//#region Manage fusion of dropship with the shipto fields.
// **************************************************************************************************************************
const Shipping = {
    Init: function () {
        Shipping.Refresh();
        if (Shipping.IsDropShipModeOn()) {
            Controls.DropShipToCapturedAddress__.OnChange = Shipping.Refresh;
        }
        else {
            Controls.DropShipToCapturedAddress__.Hide();
        }
    },
    HideDropShip: function (hidden) {
        Controls.DropShipToAddress_Name__.Hide(hidden);
        if (Lib.SOP.Helpers.IsSAP()) {
            Controls.DropShipToAddress_Name2__.Hide(hidden);
        }
        Controls.DropShipToAddress_Street__.Hide(hidden);
        Controls.DropShipToAddress_PostalCode__.Hide(hidden);
        Controls.DropShipToAddress_City__.Hide(hidden);
        Controls.DropShipToAddress_Region__.Hide(hidden);
        Controls.DropShipToAddress_Country__.Hide(hidden);
    },
    HideShipTo: function (hidden) {
        Controls.ShipToName__.Hide(hidden);
        if (Lib.SOP.Helpers.IsSAP() || Lib.SOP.SAP.Helpers.IsSAP4SCloud()) {
            Controls.ShipToName2__.Hide(hidden);
        }
        else if (Sys.OM.Helpers.GetConfiguration().Display_ShipToNumber === "0") {
            Controls.ShipToNumber__.Hide(hidden);
            Controls.ShipToNumber__.SetRequired(!hidden);
        }
        Controls.ShipToAddress_CompanyStreet__.Hide(hidden);
        Controls.ShipToAddress_CompanyPostalCode__.Hide(hidden);
        Controls.ShipToAddress_CompanyCity__.Hide(hidden);
        Controls.ShipToAddress_CompanyRegion__.Hide(hidden);
        Controls.ShipToAddress_CompanyCountry__.Hide(hidden);
    },
    IsDropShipModeOn: function () {
        return Sys.OM.Helpers.GetConfiguration().EnableDropShipping === "1";
    },
    Refresh: function () {
        if (Controls.DropShipToCapturedAddress__.IsChecked()) {
            Shipping.HideDropShip(false);
            Shipping.HideShipTo(true);
        }
        else {
            Shipping.HideDropShip(true);
            Shipping.HideShipTo(false);
            Controls.ToggleShipToAddress__.Hide(Sys.OM.Helpers.GetConfiguration().EnableAutolearnOnShiptoAddress === "0" || !Variable.GetValueAsString("DocAttached"));
        }
        if (!Lib.SOP.Helpers.IsSAP()) {
            Controls.DropShipToAddress_Name2__.Hide(true);
            Controls.ShipToName2__.Hide(true);
        }
    }
};
//#endregion
//#region Header fields checks and related methods (Mostly SAPText related)
// **************************************************************************************************************************
const SalesOrderHeader = {
    Init: function () {
        let isInValidationState = !ProcessInstance.isReadOnly && ProcessInstance.state < 100;
        if (isInValidationState) {
            if (Lib.SOP.isFromPortal()) {
                let requestedDeliveryDate = Data.GetValue("Due_Date__");
                if (requestedDeliveryDate) {
                    Controls.Due_Date__.SetWarning("This order is coming from portal so please check this date");
                }
            }
            if (Lib.SOP.Helpers.IsNewRecord()) {
                let config = Sys.OM.Helpers.GetConfiguration();
                const now = new Date();
                Data.SetValue("OrderReceptionDateTime__", now);
                let overrideWithReceptionDate = config.PODateBehavior === "capture-podate-receptiondate";
                if (overrideWithReceptionDate) {
                    const today = Sys.Helpers.Date.Date2DBDate(Sys.Helpers.Date.GetDateInUserTimezone(now, User.utcOffset || "0"));
                    Lib.SOP.Helpers.SetValueWithSourceFromConfig(Data, "Sales_Order_Date__", today);
                }
                if (!Lib.SOP.Helpers.IsSAP()) {
                    if (config.DisplayCurrency === "1" && Controls.Currency__.GetValue() === null && config.DefaultCurrency) {
                        Lib.SOP.Helpers.SetValueWithSourceFromConfig(Data, "Currency__", config.DefaultCurrency);
                    }
                }
            }
        }
        if (Data.GetValue("OrderReceptionDateTime__") == null) {
            Controls.OrderReceptionDateTime__.Hide(true);
        }
        SetContactEmailFromContactLogin(Data.GetValue("Contact_login__"));
    },
    CheckDate: function (fieldName) {
        if (fieldName) {
            // Only if date is set
            let currentDate = Data.GetValue(fieldName);
            if (currentDate) {
                let inOneYear = new Date();
                inOneYear.setFullYear(inOneYear.getFullYear() + 1);
                let isDateInError = inOneYear.getTime() < currentDate.getTime();
                if (isDateInError) {
                    Data.SetError(fieldName, "Inconsistent date");
                }
            }
        }
    },
    CheckDueDate: function () {
        // remove previous warning (if any) due for example to portal orders
        Controls.Due_Date__.SetWarning("");
        SalesOrderHeader.CheckDate("Due_Date__");
    },
    CheckPODate: function () {
        SalesOrderHeader.CheckDate("Sales_Order_Date__");
    },
    HideSAPTextPanel: function (hide) {
        if (hide == null) {
            // toggle
            hide = Controls.SAP_texts.IsVisible();
        }
        Controls.SAP_texts.Hide(hide);
        let html = Controls.ToggleSAPTextPanel__.GetHTML();
        html = html.replace(/\<\/i\>.+\<\/span\>/, "</i>" + Language.Translate(hide ? "Show SAP texts" : "Hide SAP texts") + "</span>");
        html = html.replace(/\<i class\=".+"\>\<\/i\>/, "<i class=\"" + (hide ? "fa fa-plus-square advi" : "fa fa-minus-square advi") + "\"></i>");
        Controls.ToggleSAPTextPanel__.SetHTML(html);
    },
    HideSoldToAddress: function (hide) {
        if (ProcessInstance.state > 70 && Sys.Helpers.IsEmpty(Data.GetValue("SoldToAddress__"))) {
            Controls.ToggleSoldToAddress__.Hide();
            Controls.SoldToAddress__.Hide();
            return;
        }
        if (hide == null) {
            // toggle
            hide = Controls.SoldToAddress__.IsVisible();
        }
        Controls.SoldToAddress__.Hide(hide);
        Controls.SoldToAddress__.SetReadOnly(hide);
        let html = Controls.ToggleSoldToAddress__.GetHTML();
        html = html.replace(/\<\/i\>.+\<\/span\>/, "</i>" + Language.Translate("Teach customer address") + "</span>");
        html = html.replace(/\<i class\=".+"\>\<\/i\>/, "<i class=\"" + (hide ? "fa fa-plus-square advi" : "fa fa-minus-square advi") + "\"></i>");
        Controls.ToggleSoldToAddress__.SetHTML(html);
    },
    HideShipToAddress: function (hide) {
        if (ProcessInstance.state > 70 && Sys.Helpers.IsEmpty(Data.GetValue("ShipToAddress__"))) {
            Controls.ToggleShipToAddress__.Hide();
            Controls.ShipToAddress__.Hide();
            return;
        }
        if (hide == null) {
            // toggle
            hide = Controls.ShipToAddress__.IsVisible();
        }
        Controls.ShipToAddress__.Hide(hide);
        Controls.ShipToAddress__.SetReadOnly(hide);
        let html = Controls.ToggleShipToAddress__.GetHTML();
        html = html.replace(/\<\/i\>.+\<\/span\>/, "</i>" + Language.Translate("Teach shipping address") + "</span>");
        html = html.replace(/\<i class\=".+"\>\<\/i\>/, "<i class=\"" + (hide ? "fa fa-plus-square advi" : "fa fa-minus-square advi") + "\"></i>");
        Controls.ToggleShipToAddress__.SetHTML(html);
    },
    SetSoldToShipToPlaceholders: function () {
        Controls.SoldToAddress__.SetPlaceholder(Language.Translate("SoldToAddressPlaceHolder"));
        Controls.ShipToAddress__.SetPlaceholder(Language.Translate("ShipToAddressPlaceHolder"));
    },
    OnChangeShipToAddress: function () {
        if (Sys.OM.Helpers.GetConfiguration().EnableAutolearnOnShiptoAddress === "1"
            && !UserExit.DisableDropShipAddressFromExtractedShipToAddress()) {
            let shippingAddress = Data.GetValue("ShipToAddress__");
            let docCulture = Sys.OM.Helpers.GetConfiguration().DocumentCulture;
            let docCultures = docCulture.split("-");
            if (docCultures && docCultures.length >= 2) {
                docCulture = Lib.SOP.PostalAddress.TryDetermineCountryCodeFromAddress(shippingAddress) || docCultures[1];
                if (!Sys.Helpers.IsEmpty(shippingAddress)) {
                    let addressObj = Lib.SOP.PostalAddress.ExtractPostalAddress(shippingAddress, docCulture);
                    if (addressObj && Object.keys(addressObj).length > 0) {
                        Lib.SOP.PostalAddress.SetDropShipAddressWithPostalAddress(addressObj, true);
                    }
                }
            }
        }
    },
    OnToggleSAPTextPanel: function () {
        SalesOrderHeader.HideSAPTextPanel();
    },
    OnToggleSoldToAddress: function () {
        SalesOrderHeader.HideSoldToAddress();
    },
    OnToggleShipToAddress: function () {
        SalesOrderHeader.HideShipToAddress();
    },
    OnAddSAPText: function (item, index) {
        let nbLines = Controls.SAPTextsTable__.GetLineCount();
        if (index >= nbLines - 1) {
            Controls.SAPTextsTable__.HideBottomNavigation(true);
        }
        SalesOrderHeader.InitSAPTextRow(Controls.SAPTextsTable__.GetRow(index), item, index, null, Lib.SOP.SAP.Texts._defaultLanguage, true);
        Controls.SAPTextsTable__.HideTableRowDeleteForItem(index, false);
    },
    OnDeleteSAPText: function (item, index) {
        let nbLines = Controls.SAPTextsTable__.GetLineCount();
        if (index < nbLines) {
            Controls.SAPTextsTable__.HideBottomNavigation(false);
        }
        let row = Controls.SAPTextsTable__.GetRow(index);
        if (row) {
            row.Label__.SetReadOnly(false);
            row.Language__.SetReadOnly(false);
            row.Text__.SetReadOnly(false);
            Controls.SAPTextsTable__.HideTableRowDeleteForItem(index, false);
        }
    },
    UpdateSAPTextsAndLoadNotesData: function (texts, defaultLanguage, languages, bapiParams) {
        SalesOrderHeader.UpdateSAPTexts(texts, defaultLanguage, languages, bapiParams);
        SalesOrderHeader.SAPTextsToNotesData();
    },
    StandardSAPTextsCount: 0,
    UpdateSAPTexts: function (texts, defaultLanguage, languages, bapiParams) {
        Data.SetValue("ExtractedSAPTexts__", JSON.stringify(bapiParams));
        SalesOrderHeader.StandardSAPTextsCount = Lib.SOP.SAP.Texts.UpdateSAPTextCore(texts, defaultLanguage, languages, function (item, textCurrentCopy) {
            let bapi = "Z_ESK_READ_SAPTEXTS";
            Lib.SOP.Helpers.SetValueWithSourceFromTable(item, "Label__", textCurrentCopy.LABELID, bapi);
            Lib.SOP.Helpers.SetValueWithSourceFromTable(item, "Language__", textCurrentCopy.LANG, bapi);
            Lib.SOP.Helpers.SetValueWithSourceFromTable(item, "Text__", textCurrentCopy.TEXT_LINES, bapi);
        }, function (table, itemCount) {
            Controls.SAPTextsTable__.Label__.SetAvailableValues(Lib.SOP.SAP.Texts.TextListforCombo.split("\n"));
            Controls.SAPTextsTable__.Language__.SetAvailableValues(Lib.SOP.SAP.Texts.LanguageListForCombo.split("\n"));
            table.SetItemCount(itemCount);
            UserExit.OnSAPTextsTableFilled();
            itemCount = table.GetItemCount();
            Controls.SAPTextsTable__.Hide(itemCount === 0 && Sys.OM.Helpers.GetConfiguration().Allow_SAP_texts_modifications === "0");
            SalesOrderHeader.HideSAPTextPanel(itemCount === 0);
        });
        let isLoadedFromOrder = Data.GetValue("SalesDocumentType__") === Lib.SOP.Helpers.SalesDocumentType.ChangeOrder && Lib.SOP.SAP.Helpers.SapChangeOrder.IsLoadedFromOrder();
        Controls.SAPTextsTable__.DisableMenuAddLine(isLoadedFromOrder);
        Controls.SAPTextsTable__.DisableMenuInsertLine(isLoadedFromOrder);
        Controls.SAPTextsTable__.HideTableRowDelete(isLoadedFromOrder);
        Controls.SAPTextsTable__.RefreshRows();
    },
    SAPTextOnRefreshRow: function (index) {
        let row = this.GetRow(index);
        if (row != null) {
            let itemNumber = row.GetLineNumber(true);
            let standard = itemNumber <= SalesOrderHeader.StandardSAPTextsCount;
            Controls.SAPTextsTable__.HideTableRowDeleteForItem(index, standard);
            let isReadOnly = Sys.OM.Helpers.GetConfiguration().Allow_SAP_texts_modifications === "0";
            let isLoadedFromOrder = Data.GetValue("SalesDocumentType__") === Lib.SOP.Helpers.SalesDocumentType.ChangeOrder && Lib.SOP.SAP.Helpers.SapChangeOrder.IsLoadedFromOrder();
            row.Label__.SetReadOnly(standard || isReadOnly);
            row.Language__.SetReadOnly(standard || isReadOnly);
            row.Text__.SetReadOnly(isLoadedFromOrder || isReadOnly);
        }
    },
    InitSAPTextRow: function (row, item, index, text, defaultLanguage, isNewLine) {
        if (row && item) {
            let isReadOnly = Sys.OM.Helpers.GetConfiguration().Allow_SAP_texts_modifications === "0";
            if (text && text.TEXT_LINES) {
                row.Label__.SetReadOnly(true);
                row.Language__.SetReadOnly(true);
                Controls.SAPTextsTable__.HideTableRowDeleteForItem(index, isReadOnly);
                row.Text__.SetReadOnly(isReadOnly);
            }
            else if (!text) {
                row.Label__.SetReadOnly(isReadOnly);
                row.Language__.SetReadOnly(isReadOnly);
                row.Text__.SetReadOnly(isReadOnly);
            }
            if (isNewLine) {
                item.SetValue("Language__", defaultLanguage);
            }
        }
    },
    SAPTextsToNotesData: function () {
        Data.SetValue("NotesData__", null);
        let texts = [];
        for (let i = 0; i < Controls.SAPTextsTable__.GetItemCount(); i++) {
            let item = Controls.SAPTextsTable__.GetItem(i);
            if (item) {
                let text = item.GetValue("Text__");
                let label = item.GetValue("Label__");
                let row = Controls.SAPTextsTable__.GetRow(i);
                if (text && row) {
                    let state = 0;
                    state = state | (row.Label__.IsReadOnly() ? 1 : 0);
                    state = state | (row.Language__.IsReadOnly() ? 2 : 0);
                    state = state | (row.Text__.IsReadOnly() ? 4 : 0);
                    let language = item.GetValue("Language__");
                    if (!language) {
                        language = Lib.SOP.SAP.Texts._defaultLanguage;
                    }
                    texts.push({
                        Lang: language,
                        LangLabel: Lib.SOP.SAP.Texts.GetLabelFromComboList(language, Lib.SOP.SAP.Texts.LanguageListForCombo),
                        Type: label,
                        TypeLabel: Lib.SOP.SAP.Texts.GetLabelFromComboList(label, Lib.SOP.SAP.Texts.TextListforCombo),
                        Text: text,
                        State: state
                    });
                }
            }
        }
        if (texts.length > 0) {
            Data.SetValue("NotesData__", JSON.stringify(texts));
        }
    },
    GetLanguagesListForComboFromNotesData: function () {
        let languages = [];
        let data = Data.GetValue("NotesData__");
        if (data) {
            let texts = Lib.SOP.Helpers.StringToArray(data);
            for (let i = 0; i < texts.length; i++) {
                let text = texts[i];
                languages.push(text.Lang + "=" + text.LangLabel);
            }
        }
        return languages.join("\n");
    },
    GetTypesListForComboFromNotesData: function () {
        let languages = [];
        let data = Data.GetValue("NotesData__");
        if (data) {
            let texts = Lib.SOP.Helpers.StringToArray(data);
            for (let i = 0; i < texts.length; i++) {
                let text = texts[i];
                languages.push(text.Type + "=" + text.TypeLabel);
            }
        }
        return languages.join("\n");
    },
    UpdateSAPTextsCombo: function (texts, defaultLanguage, languages) {
        if (Controls.SAPTextsTable__.GetItemCount() > 0
            || Sys.OM.Helpers.GetConfiguration().Allow_SAP_texts_modifications === "1"
            || Sys.OM.Helpers.GetConfiguration().Display_default_SAP_texts === "1") {
            Controls.SAP_texts.Hide(false);
            Controls.SAPTextsTable__.Hide(false);
        }
        if (!texts) {
            Lib.SOP.SAP.Texts.TextListforCombo = SalesOrderHeader.GetTypesListForComboFromNotesData();
            Controls.SAPTextsTable__.Label__.SetAvailableValues(Lib.SOP.SAP.Texts.TextListforCombo.split("\n"));
        }
        if (!languages) {
            Lib.SOP.SAP.Texts.LanguageListForCombo = SalesOrderHeader.GetLanguagesListForComboFromNotesData();
            Controls.SAPTextsTable__.Language__.SetAvailableValues(Lib.SOP.SAP.Texts.LanguageListForCombo.split("\n"));
        }
        SalesOrderHeader.StandardSAPTextsCount = Lib.SOP.SAP.Texts.UpdateSAPTextCore(texts, defaultLanguage, languages, function (item, textCurrentCopy, rowIndex) {
            SalesOrderHeader.InitSAPTextRow(Controls.SAPTextsTable__.GetRow(rowIndex), item, rowIndex, textCurrentCopy, defaultLanguage, false);
            Controls.SAPTextsTable__.HideTableRowDeleteForItem(rowIndex, true);
            rowIndex += 1;
        }, function () {
            Controls.SAPTextsTable__.Label__.SetAvailableValues(Lib.SOP.SAP.Texts.TextListforCombo.split("\n"));
            Controls.SAPTextsTable__.Language__.SetAvailableValues(Lib.SOP.SAP.Texts.LanguageListForCombo.split("\n"));
        });
        let isLoadedFromOrder = Data.GetValue("SalesDocumentType__") === Lib.SOP.Helpers.SalesDocumentType.ChangeOrder && Lib.SOP.SAP.Helpers.SapChangeOrder.IsLoadedFromOrder();
        Controls.SAPTextsTable__.DisableMenuAddLine(isLoadedFromOrder);
        Controls.SAPTextsTable__.DisableMenuInsertLine(isLoadedFromOrder);
        Controls.SAPTextsTable__.HideTableRowDelete(isLoadedFromOrder);
        let rowCount = Controls.SAPTextsTable__.GetLineCount();
        rowCount = Controls.SAPTextsTable__.GetItemCount() > rowCount ? rowCount : Controls.SAPTextsTable__.GetItemCount();
        for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            Controls.SAPTextsTable__.OnRefreshRow.call(Controls.SAPTextsTable__, rowIndex);
        }
    },
    RefreshChangeOrdersView: function () {
        const ChangeOrdersViewConfig = {
            tabName: "_Change Orders",
            viewName: "_Change_Orders_View_Embedded",
            processOrTableName: "Customer Order Processing",
            listControl: Controls.ChangeOrdersView__,
            panelControl: Controls.Change_Orders_Panel,
            viewFilteredColumn: "Sales_Order_Number__,CustomerNumber__",
            formFieldName: "Sales_Order_Number__,CustomerNumber__"
        };
        let oConfig = Sys.OM.Helpers.GetConfiguration();
        Lib.SOP.Helpers.EDIPanelEmbeddedView.Init(ChangeOrdersViewConfig, oConfig.ActivateChangeOrders === "1");
    },
    UpdateChangeOrdersViewVisibility: function () {
        let salesDocumentType = Data.GetValue("SalesDocumentType__");
        if (globalSettingsData.Enable_Change_Orders_management__ !== "1") {
            Controls.Change_Orders_Panel.Hide(true);
            Controls.LinkToOrderURL__.Hide(true);
        }
        else if (salesDocumentType === "ChangeOrder") {
            Controls.Change_Orders_Panel.Hide(true);
            Controls.LinkToOrderURL__.Hide(false);
            SalesOrderHeader.RefreshLinkToOrder();
        }
        else {
            Controls.Change_Orders_Panel.Hide(false);
            Controls.LinkToOrderURL__.Hide(true);
            SalesOrderHeader.RefreshChangeOrdersView();
        }
    },
    RefreshLinkToOrder: function () {
        let salesDocumentType = Data.GetValue("SalesDocumentType__");
        if (salesDocumentType == "ChangeOrder") {
            let filterPONumber = Sys.Helpers.LdapUtil.FilterEqual("Sales_Order_Number__", Data.GetValue("Sales_Order_Number__"));
            let filterDocType = Sys.Helpers.LdapUtil.FilterEqual("SalesDocumentType__", "Order");
            let filterCustomerNumber = Sys.Helpers.LdapUtil.FilterEqual("CustomerNumber__", Data.GetValue("CustomerNumber__"));
            let filter = Sys.Helpers.LdapUtil.FilterAnd(filterPONumber, filterDocType, filterCustomerNumber);
            Query.DBQuery(function () {
                let url = "";
                if (this.GetRecordsCount() > 0) {
                    url = this.GetQueryResult().GetQueryValue("ValidationUrl", 0) || "";
                }
                Controls.LinkToOrderURL__.SetURL(url);
                Controls.LinkToOrderURL__.Hide(!url);
            }, "CDNAME#Customer Order Processing", // table name
            "ruidex|ValidationUrl", // fields to retrieve
            filter.toString(), // filter
            null, // sort order
            1, // max records
            null, // callback
            "FastSearch=-1" // options: deactivate FastSearch to force ValidationUrl to be filled
            );
        }
    },
    UpdateContractVisibility: function () {
        const showCondition = Lib.SOP.Helpers.IsSAP()
            && Lib.SOP.Contracts.IsContractFeatureActivated()
            && Data.GetValue("SalesDocumentType__") === Lib.SOP.Helpers.SalesDocumentType.Order
            && !Data.GetValue("QuotationNumber__");
        const isMandatoryContract = Lib.SOP.Contracts.IsContractMandatory();
        Controls.ContractNumber__.Hide(!showCondition);
        Controls.Product_List__.ContractItemNumber__.Hide(!showCondition || !Controls.ContractNumber__.GetValue());
        Controls.Product_List__.ContractAvailableQuantity__.Hide(!showCondition || !Controls.ContractNumber__.GetValue());
        Controls.Product_List__.ContractItemNumber__.SetRequired(showCondition && (!!Controls.ContractNumber__.GetValue() || isMandatoryContract));
        Controls.ContractNumber__.SetRequired(showCondition && isMandatoryContract);
        if (!Data.GetValue("QuotationNumber__")) // Contracts and quotes are exclusive. If a quote is present, the contract is not.
         {
            Lib.SOP.Contracts.Client.SetProductsTableStyle();
        }
    },
    UpdateQuotationVisibility: function () {
        const config = Sys.OM.Helpers.GetConfiguration();
        const isReturnOrder = Lib.SOP.SAP.Helpers.GetPostingMode() === Lib.SOP.SAP.Helpers.PostingBapiType.ORDER_RETURN; //it is a return order, do the magic
        const isChangeOrder = Data.GetValue("SalesDocumentType__") === Lib.SOP.Helpers.SalesDocumentType.ChangeOrder;
        const isQuote = Data.GetValue("SalesDocumentType__") === Lib.SOP.Helpers.SalesDocumentType.QuoteRequest;
        const showQuotationFields = Lib.SOP.Helpers.IsSAP()
            && config.DisplayQuotationFields !== "0"
            && !isReturnOrder
            && !isQuote
            && !isChangeOrder
            && !Data.GetValue("ContractNumber__")
            && !Lib.SOP.Contracts.IsContractMandatory();
        Controls.QuotationNumber__.Hide(!showQuotationFields);
        Controls.QuotationTotal__.Hide(!showQuotationFields);
        Controls.LoadQuotationItems__.Hide(!showQuotationFields);
        const quotationNumberEmpty = !Controls.QuotationNumber__.GetValue();
        Controls.Product_List__.ItemReconciliationNumber__.Hide(!showQuotationFields || quotationNumberEmpty);
        Controls.Product_List__.ItemReconciliationNumber__.SetBrowsable(showQuotationFields && !quotationNumberEmpty);
        Controls.Product_List__.QuoteAvailableQuantity__.Hide(!showQuotationFields || quotationNumberEmpty);
        Lib.SOP.Quotes.Client.SetProductsTableStyle();
    }
};
// #endregion
// #region SAP Additional Partners
// **************************************************************************************************************************
const SAPAdditionalPartners = {
    defaultPartners: {},
    queryIdentifier: "",
    GetQueryIdentifier: () => {
        return SAPAdditionalPartners.queryIdentifier;
    },
    Init: function () {
        if (!Lib.SOP.Helpers.IsBrowsePartnersInSAP()) {
            return;
        }
        for (let partnerIdx = 0; partnerIdx < Controls.Partners__.GetLineCount(); partnerIdx++) {
            SAPAdditionalPartners.OnRefreshRow(partnerIdx);
        }
    },
    OnRefreshRow: function (index) {
        let row = Controls.Partners__.GetRow(index);
        if (row != null) {
            row.Partner_Function__.SetBrowsable(true);
            if (row.Partner_Function__.GetValue()) {
                row.Partner_ID__.SetReadOnly(false);
                row.Partner_ID__.SetBrowsable(true);
            }
        }
    },
    SyncPartnersWithCustNumberAndSalesArea: function () {
        SAPAdditionalPartners.defaultPartners = {};
        Lib.SOP.SAP.Partners.EmptyPartnersTable();
        if (!Data.GetValue("CustomerNumber__")) {
            Log.Warn("Not possible to retrieve additional partners, since the Customer Number is missing.");
            return;
        }
        let salesArea = {
            salesOrg: Controls.Sales_organization__.GetValue(),
            distChan: Controls.Distribution_channel__.GetValue(),
            businessArea: Controls.Business_area__.GetValue()
        };
        if (!(salesArea.salesOrg && salesArea.distChan && salesArea.businessArea)) {
            Log.Warn("Not possible to retrieve additional partners, since element(s) of Sales Area missing.");
            return;
        }
        if (Sys.OM.Helpers.GetConfiguration().Allowed_partner_functions === "" && Sys.OM.Helpers.GetConfiguration().Allowed_shipTo_partner_functions === "") {
            Log.Warn("No partner function allowed in SAP configuration wizard.");
            return;
        }
        SAPAdditionalPartners.queryIdentifier = Lib.SOP.SAP.Helpers.CreateGuid();
        let partnerTable = Lib.SOP.SAP.Tables.partnerTable;
        let fieldsToQuery = Lib.SOP.SAP.Helpers.FormatFieldsForSAPQuery(partnerTable.partnerFunction, partnerTable.customerPartnerNumber, partnerTable.vendorPartnerNumber, partnerTable.defaultPartner, partnerTable.partnerCounter, partnerTable.personnelPartnerNumber, partnerTable.contactPersonPartnerNumber, partnerTable.customerNumber);
        function OnFilterCreated(filter) {
            if (filter && filter.length > 0) {
                let rowCount = 200;
                let getNextCallbackWithQueryIdentifierCheck = function () {
                    return function () {
                        let queryResult = this;
                        if (queryResult.queryIdentifier != SAPAdditionalPartners.GetQueryIdentifier()) {
                            Log.Info("Partner research requests canceled.");
                            return false;
                        }
                        SAPAdditionalPartners.SetPartnersTableDataFromSAPResultCallback.apply(queryResult);
                    };
                };
                Sys.OM.SAP.Helpers.Query(getNextCallbackWithQueryIdentifierCheck(), partnerTable.tableName, fieldsToQuery, filter, rowCount, null, SAPAdditionalPartners.GetQueryIdentifier());
            }
        }
        let getOnFilterCreatedCallbackWithQueryIdentifierCheck = function () {
            let currentQueryIdentifier = SAPAdditionalPartners.GetQueryIdentifier();
            return function (filter) {
                if (currentQueryIdentifier != SAPAdditionalPartners.GetQueryIdentifier()) {
                    return false;
                }
                OnFilterCreated(filter);
            };
        };
        Lib.SOP.SAP.PartnersMapping.CreateFilterForPartnersQuery(getOnFilterCreatedCallbackWithQueryIdentifierCheck(), Data.GetValue("CustomerNumber__"), Data.GetValue("ShipToNumber__"), salesArea.salesOrg, salesArea.distChan, salesArea.businessArea, "1", Sys.OM.Helpers.GetConfiguration().Allowed_partner_functions, Sys.OM.Helpers.GetConfiguration().Allowed_shipTo_partner_functions, g_sapLanguage, SAPAdditionalPartners.GetQueryIdentifier);
    },
    // BEGIN SyncPartnersWithCustNumberAndSalesArea() helper functions----------------------------------------
    SetPartnersTableDataFromSAPResultCallback: function () {
        if (Lib.SOP.SAP.Helpers.DisplayErrorMessage(this)) {
            return;
        }
        let partnerRecords = Lib.SOP.SAP.Helpers.GetQueryRecords(this);
        if (partnerRecords.length === 0) {
            Log.Info("No SAP additional partners found for this CustomerNumber__, Sales_Area__ and configuration settings.");
            return;
        }
        if (Controls.Partners__.GetItem(0)) {
            Controls.Partners__.GetItem(0).Remove();
        }
        let partnersBasicData = partnerRecords.map(partner => {
            let partnerID = Lib.SOP.SAP.Helpers.RemoveSpacesFromString(partner.KUNN2) || Lib.SOP.SAP.Helpers.RemoveSpacesFromString(partner.LIFNR);
            if (!partnerID && !Sys.Helpers.IsEmpty(partner.PERNR)) {
                partnerID = Lib.SOP.SAP.Helpers.RemoveSpacesFromString(partner.PERNR);
            }
            if ((!partnerID || partnerID === "00000000") && !Sys.Helpers.IsEmpty(partner.PARNR)) {
                partnerID = Lib.SOP.SAP.Helpers.RemoveSpacesFromString(partner.PARNR);
            }
            return {
                affiliate: partner.KUNNR ? Sys.Helpers.String.SAP.TrimLeadingZeroFromID(partner.KUNNR) : "",
                partnerID: partnerID,
                partnerFunctionGeneric: partner.PARVW
            };
        });
        SAPAdditionalPartners.defaultPartners = Lib.SOP.SAP.Partners.GetDefaultPartners(partnerRecords);
        Lib.SOP.SAP.PartnersTable.GetSapPartnersData(OnPartnersDataRetrieved, partnersBasicData, g_sapLanguage, this.queryIdentifier);
        function OnPartnersDataRetrieved(partnersTableData, queryIdentifier) {
            if (queryIdentifier === SAPAdditionalPartners.queryIdentifier) {
                let soldto = Controls.CustomerNumber__.GetValue();
                Lib.SOP.SAP.Partners.FillAdditionalPartnersTable(soldto, partnersTableData, SAPAdditionalPartners.defaultPartners);
                UserExit.OnPartnersTableLoadEnd();
            }
        }
    },
    // END SyncPartnersWithCustNumberAndSalesArea() helper functions----------------------------------------
    // BEGIN Functions to react on events linked to Partners------------------------------------------------
    SelectPartner: function () {
        let controlChanged = this;
        let rowChanged = controlChanged.GetRow();
        let partnerFunction = rowChanged.Partner_Function__.GetValue();
        SAPAdditionalPartners.CheckPartnerFunctionDuplicates(partnerFunction);
    },
    UpdatePartnerFunctionDescription: function (callback) {
        let rowChanged = this.GetRow();
        let partnerFunction = rowChanged.Partner_Function__;
        let fieldsToClear = ["Partner_Function_Description__", "Partner_Name__", "Partner_ID__", "Partner_Street__",
            "Partner_Postal_Code__", "Partner_City__", "Partner_Region__", "Partner_Country__", "Partner_District__",
            "Partner_PO_Box__", "Partner_Email__"];
        SAPAdditionalPartners.ClearAdditionalPartnersFields(partnerFunction, fieldsToClear);
        let allowedPartnerFunctions = Sys.OM.Helpers.GetConfiguration().Allowed_partner_functions.split(",");
        let partnerFunctionToAssign = partnerFunction.GetValue();
        if (partnerFunctionToAssign) {
            partnerFunctionToAssign = partnerFunctionToAssign.toUpperCase();
        }
        for (let allowedPartnerFunctionIndex = 0; allowedPartnerFunctionIndex < allowedPartnerFunctions.length; allowedPartnerFunctionIndex++) {
            SAPAdditionalPartners.CheckPartnerFunctionDuplicates(allowedPartnerFunctions[allowedPartnerFunctionIndex]);
        }
        if (!SAPAdditionalPartners.IsPartnerFunctionAllowed(allowedPartnerFunctions, partnerFunctionToAssign)) {
            partnerFunction.SetError(Language.Translate("Partner function {0} is not allowed. You can use one of the following : ", true, partnerFunctionToAssign) + allowedPartnerFunctions);
            if (rowChanged) {
                SAPAdditionalPartners.TogglePartnerIDReadOnlyAndBrowsable(rowChanged, true);
            }
            if (callback) {
                callback();
            }
            return;
        }
        if (partnerFunctionToAssign) {
            function setPartnerFunctionFromPartnersMapping(result) {
                // Partner Function can be empty at this point if the user switched Sales Area while partners were loading
                if (result && rowChanged && rowChanged.Partner_Function__) {
                    Lib.SOP.Helpers.SetValueWithSourceFromTable(rowChanged.GetItem(), "Partner_Function_Description__", result.partnerFuntionName, result.partnerQueryTable);
                    SAPAdditionalPartners.TogglePartnerIDReadOnlyAndBrowsable(rowChanged, false);
                }
                if (callback) {
                    callback();
                }
            }
            Lib.SOP.SAP.PartnersMapping.GetPartnerFunctionCodeFromTranslated(null, partnerFunctionToAssign, setPartnerFunctionFromPartnersMapping, g_sapLanguage);
        }
        else {
            SAPAdditionalPartners.TogglePartnerIDReadOnlyAndBrowsable(rowChanged, true);
            if (callback) {
                callback();
            }
        }
    },
    IsPartnerFunctionAllowed: function (allowedPartnerFunctions, partnerFunctionToAssign) {
        return allowedPartnerFunctions.indexOf(partnerFunctionToAssign) > -1;
    },
    CheckPartnerFunctionDuplicates: function (partnerFunction) {
        let duplicates = 0;
        let firstPartner = null;
        let errorMessage = null;
        let selectAdditionalPartners = Sys.OM.Helpers.GetConfiguration().SelectAdditionalPartners === "1";
        let partnersTable = Data.GetTable("Partners__");
        let partnerCount = partnersTable.GetItemCount();
        partnerFunction = partnerFunction && partnerFunction.toUpperCase ? partnerFunction.toUpperCase() : partnerFunction;
        for (let partnerIndex = 0; partnerIndex < partnerCount; partnerIndex++) {
            let partnerIterated = partnersTable.GetItem(partnerIndex);
            let partnerFunctionIterated = partnerIterated.GetValue("Partner_Function__");
            partnerFunctionIterated = partnerFunctionIterated ? partnerFunctionIterated.toUpperCase() : partnerFunctionIterated;
            if (partnerFunctionIterated && (partnerFunction === partnerFunctionIterated)) {
                if (!selectAdditionalPartners || partnerIterated.GetValue("Selected_partner__")) {
                    duplicates++;
                    if (duplicates === 1) {
                        firstPartner = partnerIterated;
                        partnerIterated.SetError("Partner_Function__", "");
                    }
                    else {
                        if (errorMessage === null) {
                            errorMessage = Language.Translate("Partner function {0} has already been used for another partner", true, partnerFunction);
                        }
                        if (duplicates === 2) {
                            firstPartner.SetError("Partner_Function__", errorMessage);
                        }
                        partnerIterated.SetError("Partner_Function__", errorMessage);
                    }
                }
                else {
                    partnerIterated.SetError("Partner_Function__", "");
                }
            }
        }
    },
    TogglePartnerIDReadOnlyAndBrowsable: function (row, isInError) {
        if (row && row.Partner_ID__) {
            row.Partner_ID__.SetReadOnly(isInError);
            row.Partner_ID__.SetBrowsable(!isInError);
        }
    },
    UpdatePartnerNameAndAddressInformation: function () {
        let controlChanged = this;
        let fieldsToClear = ["Partner_Name__", "Partner_Street__", "Partner_Postal_Code__", "Partner_City__", "Partner_Region__", "Partner_Country__", "Partner_District__", "Partner_PO_Box__", "Partner_Email__"];
        SAPAdditionalPartners.ClearAdditionalPartnersFields(controlChanged, fieldsToClear);
        function OnResults(result) {
            if (result) {
                let queryTable = result.partnerQueryTable;
                let item = controlChanged.GetItem();
                Lib.SOP.Helpers.SetValueWithSourceFromTable(item, "Partner_Name__", result.partnerName, queryTable);
                Lib.SOP.Helpers.SetValueWithSourceFromTable(item, "Partner_Street__", result.partnerStreet, queryTable);
                Lib.SOP.Helpers.SetValueWithSourceFromTable(item, "Partner_Postal_Code__", result.partnerPostal_Code, queryTable);
                Lib.SOP.Helpers.SetValueWithSourceFromTable(item, "Partner_City__", result.partnerCity, queryTable);
                Lib.SOP.Helpers.SetValueWithSourceFromTable(item, "Partner_Region__", result.partnerRegion, queryTable);
                Lib.SOP.Helpers.SetValueWithSourceFromTable(item, "Partner_Country__", result.partnerCountry, queryTable);
                Lib.SOP.Helpers.SetValueWithSourceFromTable(item, "Partner_District__", result.partnerDistrict, queryTable);
                Lib.SOP.Helpers.SetValueWithSourceFromTable(item, "Partner_PO_Box__", result.partnerPO_Box, queryTable);
                Lib.SOP.Helpers.SetValueWithSourceFromTable(item, "Partner_Email__", result.partnerEmail, result.partnerEmailQueryTable);
                UserExit.OnAdditionalPartnerItemRetrieved(controlChanged);
            }
        }
        if (controlChanged.GetValue()) {
            let partnerId = Sys.Helpers.String.SAP.NormalizeID(controlChanged.GetValue().replace(/ /g, ""), 10, false, true);
            Lib.SOP.SAP.PartnersMapping.GetPartnerFunctionCodeFromTranslated(partnerId, controlChanged.GetItem().GetValue("Partner_Function__"), OnResults, g_sapLanguage);
        }
        else {
            controlChanged.GetItem().SetValue("Partner_Name__", "");
        }
        Sys.Helpers.TryCallFunction("Lib.SOP.Customization.HTMLScripts.OnAdditionalPartnerItemChange", controlChanged);
    },
    ClearAdditionalPartnersFields: function (controlChanged, fieldsToClear) {
        for (let partnerIndex = 0; partnerIndex < fieldsToClear.length; partnerIndex++) {
            controlChanged.GetItem().SetValue(fieldsToClear[partnerIndex], "");
        }
    },
    RemoveErrorMsgIfPartnerFunctionNowUnique: function (item) {
        let partnerFunctionDeleted = item.GetValue("Partner_Function__");
        SAPAdditionalPartners.CheckPartnerFunctionDuplicates(partnerFunctionDeleted);
    }
    // END Functions to react on events linked to Partners------------------------------------------------
};
// #endregion-----------------------------------------------------------------------------------------------------------------------------------------------
//#endregion
//#region Other sap browses: Pricing conditions, notes, sales office, sales group, delivery block, billing block, ...
// **************************************************************************************************************************
//#endregion
//debug
let Material = Lib.SOP.MaterialItems.Material;
const Items = Lib.SOP.MaterialItems.Items;
//#region Parameters details
// **************************************************************************************************************************
ParameterDetails = (function () {
    const paramDetails = {
        originalValues: {},
        hide: function () {
            Controls.ParametersWarning__.Hide(true);
            Controls.ShowParameters__.SetText("_Show Parameters");
            Controls.ComputingParametersWaiting__.Hide(true);
            Controls.Duplicates__.Hide(true);
            Controls.DuplicateCheckAlertLevel__.Hide(true);
            Controls.AutomaticProcessing__.Hide(true);
            Controls.AllowTouchless__.Hide(true);
            Controls.TouchlessPossible__.Hide(true);
            Controls.TouchlessDone__.Hide(true);
            Controls.TouchlessErrorList__.Hide(true);
            Controls.TouchlessErrorSales_Order_Number__.Hide(true);
            Controls.TouchlessErrorSales_Order_Date__.Hide(true);
            Controls.TouchlessErrorDue_Date__.Hide(true);
            Controls.TouchlessErrorTotal__.Hide(true);
            Controls.TouchlessErrorCustomerNumber__.Hide(true);
            Controls.TouchlessErrorShipToNumber__.Hide(true);
            Controls.TouchlessErrorItemNumber__.Hide(true);
            Controls.TouchlessErrorUnit__.Hide(true);
            Controls.TouchlessErrorQuantity__.Hide(true);
            Controls.TouchlessErrorUnusualQuantity__.Hide(true);
            Controls.TouchlessErrorPricing__.Hide(true);
            Controls.TouchlessErrorRevisedOrder__.Hide(true);
            Controls.SAP_Simulation_Warning__.Hide(true);
            Controls.SAP_Simulation_Error__.Hide(true);
            UserExit.ProcessingOptionsHide(true);
        },
        show: function (warningDuplicateCheck, warningTouchlessCheck) {
            Controls.ShowParameters__.SetText("_Hide Parameters");
            ParameterDetails.setParametersWarningText(warningDuplicateCheck, warningTouchlessCheck);
            Controls.Duplicates__.Hide(Sys.OM.Helpers.GetConfiguration().ManualDuplicateCheck === "1");
            Controls.DuplicateCheckAlertLevel__.Hide(Sys.OM.Helpers.GetConfiguration().ManualDuplicateCheck === "1");
            Controls.AutomaticProcessing__.Hide(false);
            Controls.AllowTouchless__.Hide(false);
            Controls.TouchlessDone__.Hide(false);
            Controls.TouchlessPossible__.Hide(false);
            Controls.TouchlessErrorList__.Hide(false);
            Controls.TouchlessErrorSales_Order_Number__.Hide(false);
            Controls.TouchlessErrorSales_Order_Date__.Hide(false);
            Controls.TouchlessErrorDue_Date__.Hide(false);
            Controls.TouchlessErrorTotal__.Hide(false);
            Controls.TouchlessErrorCustomerNumber__.Hide(false);
            Controls.TouchlessErrorShipToNumber__.Hide(false);
            Controls.TouchlessErrorItemNumber__.Hide(false);
            Controls.TouchlessErrorUnit__.Hide(false);
            Controls.TouchlessErrorQuantity__.Hide(false);
            Controls.TouchlessErrorUnusualQuantity__.Hide(false);
            Controls.TouchlessErrorPricing__.Hide(Sys.OM.Helpers.GetConfiguration().ERP !== "Oracle EBS" || Sys.OM.Helpers.GetConfiguration().OracleDisplayPriceCheckButton === "0");
            Controls.TouchlessErrorRevisedOrder__.Hide(false);
            Controls.SAP_Simulation_Warning__.Hide(!Lib.SOP.Helpers.IsSAP());
            Controls.SAP_Simulation_Error__.Hide(!Lib.SOP.Helpers.IsSAP());
            UserExit.ProcessingOptionsHide(false);
        },
        setParametersWarningText: function (warningDuplicateCheck, warningTouchlessCheck) {
            if (warningDuplicateCheck || warningTouchlessCheck) {
                Controls.ParametersWarning__.Hide(false);
                let warningMessage = "";
                let originalDuplicate = parseInt(paramDetails.originalValues.DuplicateCheckAlertLevel__, 8);
                let originalTouchless = paramDetails.originalValues.AllowTouchless__;
                let duplicateLabels = [
                    "Do not alert on duplicates",
                    "If at least 1 value is identical",
                    "If at least 2 values are identical",
                    "If at least 3 values are identical"
                ];
                if (warningDuplicateCheck && warningTouchlessCheck) {
                    warningMessage = Language.Translate(warningDuplicateCheck + warningTouchlessCheck.replace("{0}", "{1}"), true, Language.Translate(duplicateLabels[originalDuplicate]), Language.Translate(originalTouchless ? "_enabled" : "_disabled"));
                }
                else if (warningDuplicateCheck) {
                    warningMessage = Language.Translate(warningDuplicateCheck, true, Language.Translate(duplicateLabels[originalDuplicate]));
                }
                else {
                    warningMessage = Language.Translate(warningTouchlessCheck, true, Language.Translate(originalTouchless ? "_enabled" : "_disabled"));
                }
                Controls.ParametersWarning__.SetText(warningMessage);
            }
            else {
                Controls.ParametersWarning__.Hide(true);
            }
        },
        onClick: function () {
            Controls.DuplicateCheckAlertLevel__.OnChange = null;
            Controls.AllowTouchless__.OnChange = null;
            if (Controls.AutomaticProcessing__.IsVisible()) {
                paramDetails.hide();
            }
            else {
                Controls.ComputingParametersWaiting__.Hide(false);
                Controls.ComputingParametersWaiting__.Focus();
                if (Sys.Helpers.IsEmpty(paramDetails.originalValues.DuplicateCheckAlertLevel__)) {
                    paramDetails.originalValues.DuplicateCheckAlertLevel__ = Data.GetValue("DuplicateCheckAlertLevel__");
                }
                if (Sys.Helpers.IsEmpty(paramDetails.originalValues.AllowTouchless__)) {
                    paramDetails.originalValues.AllowTouchless__ = Data.GetValue("AllowTouchless__");
                    if (!paramDetails.originalValues.AllowTouchless__ || paramDetails.originalValues.AllowTouchless__ === "0") {
                        paramDetails.originalValues.AllowTouchless__ = false;
                    }
                    else {
                        paramDetails.originalValues.AllowTouchless__ = true;
                    }
                }
                ParameterDetails.queryParameters();
                let callbackCheckForParametersChanges = function () {
                    Controls.ComputingParametersWaiting__.Hide(true);
                    let warningDuplicateCheckContent = "";
                    let warningTouchlessCheckContent = "";
                    if (paramDetails.originalValues.DuplicateCheckAlertLevel__ !== Data.GetValue("DuplicateCheckAlertLevel__")) {
                        warningDuplicateCheckContent = "_Alert on duplicates changed {0}";
                    }
                    if (!Sys.Helpers.IsEmpty(Data.GetValue("AllowTouchless__")) && paramDetails.originalValues.AllowTouchless__ !== Data.GetValue("AllowTouchless__")) {
                        warningTouchlessCheckContent = "_Touchless changed {0}";
                    }
                    paramDetails.show(warningDuplicateCheckContent, warningTouchlessCheckContent);
                    Controls.DuplicateCheckAlertLevel__.OnChange = ParameterDetails.onDuplicatesChange;
                    Controls.AllowTouchless__.OnChange = ParameterDetails.onTouchlessChange;
                    Controls.DuplicateCheckAlertLevel__.Focus();
                    Controls.AllowTouchless__.Focus();
                };
                Query.NotifyOnCurrentRequestsDone(callbackCheckForParametersChanges);
            }
        },
        onDuplicatesChange: function () {
            Variable.SetValueAsString("DuplicatesChanged", "true");
        },
        onTouchlessChange: function () {
            Variable.SetValueAsString("TouchlessChanged", "true");
        },
        queryParameters: function () {
            const customerNumber = Data.GetValue("CustomerNumber__");
            if (customerNumber) {
                let filter = Sys.Helpers.LdapUtil.FilterEqual("Customer_number__", customerNumber);
                filter = Lib.SOP.Helpers.joinFilterWithExtraFilter(filter, UserExit.GetAutomaticProcessingExtraFilter(), true);
                Lib.SOP.Helpers.CallDBQuery(paramDetails.queryDuplicatesCallback, Lib.SOP.Tables.DuplicateAlert.tableName, { filter: filter, maxItems: 1 });
                Lib.SOP.Helpers.CallDBQuery(paramDetails.queryTouchlessCallback, Lib.SOP.Tables.AutomaticProcessing.tableName, { filter: filter, maxItems: 1 });
            }
        },
        queryDuplicatesCallback: function () {
            let result = this.GetQueryValue();
            if (result && result.Records.length > 0) {
                let duplicateCheckAlertLevel = this.GetQueryValue(Lib.SOP.Tables.DuplicateAlert.blockingLevel, 0);
                let lastAlertLevel = duplicateCheckAlertLevel ? duplicateCheckAlertLevel : "1";
                Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "DuplicateCheckAlertLevel__", lastAlertLevel, this.GetQueryTable());
            }
        },
        queryTouchlessCallback: function () {
            let result = this.GetQueryValue();
            if (result && result.Records.length > 0) {
                let touchlessEnabled = result.GetQueryValue(Lib.SOP.Helpers.GetTouchlessQueryDbAttributes(), 0);
                let lastTouchlessEnabled = false;
                if (touchlessEnabled === "0") {
                    lastTouchlessEnabled = false;
                }
                else {
                    lastTouchlessEnabled = true;
                }
                Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "AllowTouchless__", lastTouchlessEnabled, this.GetQueryTable());
            }
        }
    };
    return paramDetails;
})();
//#endregion
//#region Duplicates check
// **************************************************************************************************************************
const DuplicatesCheck = {
    Result: null,
    approveCallback: null,
    CreateResultTable: function (dialog, tableName) {
        let table = dialog.AddTable(tableName, null, 250);
        // if CustomizeDuplicateCheckWarningPopupTable is implemented, create table dynamically
        let listOfColumns = UserExit.CustomizeDuplicateCheckWarningPopupTable();
        if (listOfColumns) {
            for (const column of listOfColumns) {
                switch (column.type) {
                    case "date":
                        table.AddDateColumn(column.internalIdentifier, column.label, column.width);
                        break;
                    case "number":
                        table.AddDecimalColumn(column.internalIdentifier, column.label, column.width);
                        break;
                    case "text":
                        table.AddTextColumn(column.internalIdentifier, column.label, column.width, column.align);
                        break;
                }
            }
        }
        else {
            // if CustomizeDuplicateCheckWarningPopupTable is NOT implemented, keep old standard behaviour
            table.AddTextColumn("OrderNumber", "PO number", 150);
            table.AddDateColumn("OrderDate", "PO date", 80);
            table.AddTextColumn("CustomerNumber", "Customer Number", 150);
            table.AddDecimalColumn("Total", "Total", 80);
        }
        let link = table.AddLinkColumn("View", " ", 50);
        link.SetText("_action_view");
        link.SetURL("");
        table.SetReadOnly(true);
        table.SetRowToolsHidden(true);
        return table;
    },
    FillResultItem: function (item, duplicate) {
        // if CustomizeDuplicateCheckWarningPopupTable is implemented, create table dynamically
        let listOfColumns = UserExit.CustomizeDuplicateCheckWarningPopupTable();
        if (listOfColumns) {
            for (const column of listOfColumns) {
                let value = duplicate.duplicateKeys[column.formId] || duplicate.controlsToCheck[column.formId] || duplicate.additionalAttributes[column.formId];
                if (column.transformation) {
                    value = column.transformation(value);
                }
                item.SetValue(column.internalIdentifier, value);
            }
        }
        else {
            // if CustomizeDuplicateCheckWarningPopupTable is NOT implemented, keep old standard behaviour
            item.SetValue("OrderNumber", duplicate.controlsToCheck.Sales_Order_Number__ ? duplicate.controlsToCheck.Sales_Order_Number__ : duplicate.additionalAttributes.Sales_Order_Number__);
            item.SetValue("OrderDate", duplicate.controlsToCheck.Sales_Order_Date__ ? duplicate.controlsToCheck.Sales_Order_Date__ : duplicate.additionalAttributes.Sales_Order_Date__);
            item.SetValue("CustomerNumber", duplicate.duplicateKeys.CustomerNumber__);
            item.SetValue("Total", duplicate.controlsToCheck.Total__ ? duplicate.controlsToCheck.Total__ : duplicate.additionalAttributes.Total__);
        }
    },
    fillAlertDuplicateDialog: function (dialog) {
        dialog.Hold(true);
        let duplicateWarning = dialog.AddTitle("duplicateLabel1", "");
        duplicateWarning.SetText(Language.Translate("There is a risk of duplicates for the following document(s):"));
        let tableCurrentOrder = DuplicatesCheck.CreateResultTable(dialog, "duplicateTable");
        if (DuplicatesCheck.Result) {
            tableCurrentOrder.SetItemCount(DuplicatesCheck.Result.length);
            for (let i = 0; i < DuplicatesCheck.Result.length; i++) {
                let duplicate = DuplicatesCheck.Result[i];
                DuplicatesCheck.FillResultItem(tableCurrentOrder.GetItem(i), duplicate);
            }
        }
        let ctrlDisableCheck = dialog.AddCheckBox("ctrl_DisableCheck");
        ctrlDisableCheck.SetText("Do not check duplicates for this document anymore");
        dialog.HideDefaultButtons(true);
        dialog.AddButton("ok_button", "OK");
        dialog.Hold(false);
    },
    handleAlertDuplicateDialog: function (dialog, tabId, event, control) {
        if (control.GetType() === "Button" && event === "OnClick") {
            dialog.Cancel();
            if (dialog.GetControl("ctrl_DisableCheck").IsChecked()) {
                Variable.SetValueAsString("DuplicateCheckResult", "");
                Variable.SetValueAsString("DoNotCheckDuplicates", "1");
                Data.SetError("Sales_Order_Number__", "");
                DuplicatesCheck.callApproveCallback();
            }
        }
        else if (control.GetType() === "Link" && event === "OnClick") {
            let lineNumber = control.GetRow().GetLineNumber() - 1;
            if (lineNumber < DuplicatesCheck.Result.length) {
                control.SetURL("FlexibleForm.aspx?action=run&layout=_flexibleform&ReadOnly=1&Id=" +
                    DuplicatesCheck.Result[lineNumber].RUIDEX.replace(/#/g, "%23") +
                    "&OnQuit=Close");
            }
        }
    },
    shouldPopup: function () {
        return Variable.GetValueAsString("DoNotCheckDuplicates") !== "1"
            && (Data.GetValue("DuplicateCheckAlertLevel__") !== "0" || Sys.OM.Helpers.GetConfiguration().ManualDuplicateCheck === "1")
            && !(Lib.SOP.Helpers.IsSAP() && Data.GetValue("SalesDocumentType__") === Lib.SOP.Helpers.SalesDocumentType.ChangeOrder);
    },
    callApproveCallback: function () {
        let callback = DuplicatesCheck.approveCallback;
        if (typeof callback === "function") {
            callback();
        }
    },
    doCheck: function () {
        if (this.shouldPopup()) {
            let duplicateResult;
            let extDupResults = Variable.GetValueAsString("DuplicateCheckResult");
            if (extDupResults) {
                duplicateResult = JSON.parse(extDupResults);
            }
            if (duplicateResult) {
                this.Result = duplicateResult;
                if (this.Result && this.Result.length > 0) {
                    Popup.Dialog("Duplicate document detected", null, this.fillAlertDuplicateDialog, null, null, this.handleAlertDuplicateDialog, null);
                    return false;
                }
            }
        }
        return true;
    },
    duplicateCheck: function (cCallBackDuplicate) {
        var _a;
        let aDuplicateKeyControls = ["CustomerNumber__"];
        let aControlsToCheck = [];
        let iGroupSize = 0;
        let checkEmptyFields = false;
        let config = Sys.OM.Helpers.GetConfiguration();
        let configurationParametersExist = config && config.ActivateQuotes && config.QuoteTypesList && config.QuoteTypesList.length > 0 && Data.GetValue("DocumentType__") !== "";
        if (configurationParametersExist && new RegExp(Data.GetValue("DocumentType__")).test(config.QuoteTypesList)) {
            aControlsToCheck = [];
            iGroupSize = 0;
        }
        else if (config && config.ManualDuplicateCheck === "1") {
            let JSONDuplicateFieldsRecognized = Variable.GetValueAsString("DuplicateFieldsRecognized");
            //In case we are in a process that doesn't use extraction nor validation script
            if (!JSONDuplicateFieldsRecognized) {
                aControlsToCheck = config.DuplicateCheckFields.split(/\s+/);
                //We filter the duplicates among the fields
                let mFilteredControlsToCheck = {};
                for (let i = 0; i < aControlsToCheck.length; ++i) {
                    mFilteredControlsToCheck[aControlsToCheck[i]] = 0;
                }
                // We delete if there's an empty string
                delete mFilteredControlsToCheck[""];
                //We can only partially check the error, since we are client side, we cannot check if there's a field that doesn't exist
                aControlsToCheck = Object.keys(mFilteredControlsToCheck);
                iGroupSize = aControlsToCheck.length;
            }
            else {
                aControlsToCheck = JSON.parse(JSONDuplicateFieldsRecognized);
                iGroupSize = aControlsToCheck.length;
            }
            checkEmptyFields = true;
        }
        else {
            aControlsToCheck = ["Sales_Order_Number__", "Total__", "Sales_Order_Date__"];
            iGroupSize = parseInt(Data.GetValue("DuplicateCheckAlertLevel__"), 10);
        }
        let customAttributes = (_a = UserExit.CustomizeDuplicateCheckWarningPopupTable()) === null || _a === void 0 ? void 0 : _a.map((e) => e.formId);
        let mQueryOptions = {
            MaxDateRangeInDays: 90,
            DateRangeFieldName: "SubmitDateTime",
            SortOnControlName: "Sales_Order_Date__",
            AdditionalAttributes: customAttributes || ["Sales_Order_Number__", "Total__", "Sales_Order_Date__"]
        };
        Lib.DuplicateCheck.CheckDuplicate(aDuplicateKeyControls, aControlsToCheck, mQueryOptions, iGroupSize, cCallBackDuplicate, checkEmptyFields);
    },
    doDuplicateCheckCallBack: function (aDuplicates) {
        if (aDuplicates && aDuplicates.length > 0) {
            Variable.SetValueAsString("DuplicateCheckResult", JSON.stringify(aDuplicates));
            Data.SetError("Sales_Order_Number__", "Duplicates have been detected");
        }
        else {
            Variable.SetValueAsString("DuplicateCheckResult", "");
        }
        if (DuplicatesCheck.doCheck()) {
            DuplicatesCheck.callApproveCallback();
        }
    },
    doDuplicateCheck: function (approveCallBack) {
        DuplicatesCheck.approveCallback = approveCallBack;
        if (DuplicatesCheck.shouldPopup()) {
            DuplicatesCheck.duplicateCheck(DuplicatesCheck.doDuplicateCheckCallBack);
        }
        else {
            DuplicatesCheck.callApproveCallback();
        }
    }
};
//#endregion
//#region Archive Only Dialog
// **************************************************************************************************************************
const ArchiveOnly = {
    archivingError: "",
    splitOrderErpIds: [], // This remains uninitialized if we are not in a split order situation
    OnArchiveLoaded: function (bIsOk) {
        Controls.Document_ERP_ID__.Wait(false);
        if (bIsOk) {
            let diagFunctions = {
                fill: function (dialog) {
                    let ctrlDescription = dialog.AddDescription("ctrl_description");
                    ctrlDescription.SetText(Language.Translate("ConfirmArchiving {0}", true, Data.GetValue("Document_ERP_ID__")));
                    dialog.AddButton("Cancel__", "Cancel");
                },
                validate: function (dialog) {
                    ProcessInstance.Approve("Archive_Only");
                },
                handle: function (dialog, tabId, event, control) {
                    if (event === "OnClick" && control.GetName() === "Cancel__") {
                        dialog.Cancel();
                    }
                },
                cancel: function (dialog) {
                    dialog.Cancel();
                }
            };
            Lib.SOP.SAP.Helpers.CompleteSalesAreaFromConfig(Sys.OM.Helpers.GetConfiguration());
            // Instantiate the dialog
            Popup.Dialog("Validate archiving", null, diagFunctions.fill, null, diagFunctions.validate, diagFunctions.handle, diagFunctions.cancel);
        }
        else {
            let docErpId = "";
            if (ArchiveOnly.splitOrderErpIds[0] == null) {
                docErpId = Data.GetValue("Document_ERP_ID__");
            }
            else {
                docErpId = ArchiveOnly.splitOrderErpIds[0];
            }
            ArchiveOnly.archivingError = Language.Translate("There is no SAP order matching this number: {0}", true, docErpId);
            ArchiveOnly.DialogDisplay();
        }
    },
    onSplitArchiveLoaded: function (bIsOk) {
        if (!bIsOk) {
            ArchiveOnly.OnArchiveLoaded(false);
        }
        else if (ArchiveOnly.splitOrderErpIds.length > 1) {
            // Checking that next order exists in SAP
            ArchiveOnly.splitOrderErpIds = ArchiveOnly.splitOrderErpIds.slice(1, ArchiveOnly.splitOrderErpIds.length);
            Lib.SOP.SAP.Archive.LoadOrder(ArchiveOnly.splitOrderErpIds[0], ArchiveOnly.onSplitArchiveLoaded);
        }
        else {
            // Every order exists in SAP
            ArchiveOnly.OnArchiveLoaded(true);
        }
    },
    commitDialogBox: function (dialog) {
        let erpId = dialog.GetControl("ctrl_Txt_DocERPID");
        Data.SetValue("Document_ERP_ID__", erpId.GetValue());
        if (Lib.SOP.Helpers.IsSAP()) {
            Controls.Document_ERP_ID__.Wait(true);
            let groupCount = Lib.SOP.SAP.Split.GetSimulationGroupIds(Sys.OM.Helpers.GetConfiguration()).length;
            if (groupCount > 1) {
                // split order situation
                ArchiveOnly.splitOrderErpIds = Data.GetValue("Document_ERP_ID__").split(" ");
                if (ArchiveOnly.splitOrderErpIds.length !== groupCount) {
                    ArchiveOnly.archivingError = Language.Translate("{0} ERP IDs have been entered. {1} ERP IDs were expected, separated by spaces.", true, ArchiveOnly.splitOrderErpIds.length.toString(), groupCount.toString());
                    ArchiveOnly.DialogDisplay();
                }
                else {
                    Lib.SOP.SAP.Archive.LoadOrder(ArchiveOnly.splitOrderErpIds[0], ArchiveOnly.onSplitArchiveLoaded);
                }
            }
            else {
                Lib.SOP.SAP.Archive.LoadOrder(Data.GetValue("Document_ERP_ID__"), ArchiveOnly.OnArchiveLoaded);
            }
        }
        else {
            ProcessInstance.Approve("Archive_Only");
        }
    },
    // Validate dialog callback: Check that the Doc ERP ID  is not empty
    validateDialogBox: function (dialog, tabId) {
        let isValid = true;
        let ctrlError = dialog.GetControl("ctrl_error_wrong");
        dialog.HideControl(ctrlError, true);
        // Callback from base dialog
        if (tabId == null) {
            let reqControlId = dialog.GetControl("ctrl_Txt_DocERPID");
            // Show the error message if the ERP ID is empty
            if (!reqControlId.GetValue()) {
                dialog.FocusControl(reqControlId);
                dialog.HideControl(dialog.GetControl("ctrl_error_empty"), false);
                isValid = false;
            }
        }
        return isValid;
    },
    fillDialogBox: function (dialog) {
        dialog.AddSeparator();
        if (Lib.SOP.Helpers.IsNSOChangeOrderOrCancellationOrConfirmation()) {
            let ctrlDescriptionNSO = dialog.AddDescription("ChangeOrderCancellationText");
            ctrlDescriptionNSO.SetText("_ArchiveOnlyChangeOrderCancellationText");
            dialog.AddSeparator();
            dialog.AddSeparator();
        }
        let ctrlDescription = dialog.AddDescription("ctrl_description");
        let groupIds = Lib.SOP.SAP.Split.GetSimulationGroupIds(Sys.OM.Helpers.GetConfiguration());
        if (groupIds.length > 1) // split order situation
         {
            ctrlDescription.SetText("Please enter below the ERP Document IDs you want to associate for the file being processed");
        }
        else {
            ctrlDescription.SetText("Please enter below the ERP Document ID you want to associate for the file being processed");
        }
        dialog.AddSeparator();
        dialog.AddSeparator();
        // Note : You can customize the code to allow the user to select the files that he wants to attach to the email (the processed document and the files attached to the process).
        let ctrlTxtDocErpid = dialog.AddText("ctrl_Txt_DocERPID", "ERP ID", 200);
        let documentErpId = Data.GetValue("SAPOrderNumber__");
        if (documentErpId) {
            ctrlTxtDocErpid.SetValue(documentErpId);
        }
        // Add a field hidden by default. This field contains an error message that will be displayed if the recipient field is empty
        let ctrlError = dialog.AddDescription("ctrl_error_empty", "");
        ctrlError.SetText("The ERP Document ID is requiered to archive only");
        dialog.HideControl(ctrlError, true);
        ctrlError.SetErrorStyle(true);
        if (ArchiveOnly.archivingError) {
            let ctrlErrorEmpty = dialog.AddDescription("ctrl_error_wrong", "");
            dialog.GetControl("ctrl_Txt_DocERPID").SetValue(Data.GetValue("Document_ERP_ID__"));
            ctrlErrorEmpty.SetText(ArchiveOnly.archivingError);
            dialog.FocusControl(ctrlErrorEmpty);
            dialog.HideControl(ctrlErrorEmpty, false);
            ctrlErrorEmpty.SetErrorStyle(true);
            ArchiveOnly.archivingError = "";
        }
        dialog.RequireControl(ctrlTxtDocErpid);
    },
    DialogDisplay: function () {
        // Instantiate the dialog
        const popupName = Lib.SOP.Helpers.IsNSOChangeOrderOrCancellationOrConfirmation() ? "NSORelatedOrderExistsTitle" : "Archive";
        let dialogParams = UserExit.CustomizeArchiveOnlyDialog(ArchiveOnly.fillDialogBox, ArchiveOnly.commitDialogBox, ArchiveOnly.validateDialogBox);
        if (typeof dialogParams !== "object") {
            dialogParams = {};
        }
        if (typeof dialogParams.fillDialogBox !== "function") {
            dialogParams.fillDialogBox = ArchiveOnly.fillDialogBox;
        }
        if (typeof dialogParams.commitDialogBox !== "function") {
            dialogParams.commitDialogBox = ArchiveOnly.commitDialogBox;
        }
        if (typeof dialogParams.validateDialogBox !== "function") {
            dialogParams.validateDialogBox = ArchiveOnly.validateDialogBox;
        }
        Popup.Dialog(popupName, null, dialogParams.fillDialogBox, dialogParams.commitDialogBox, dialogParams.validateDialogBox, null);
    },
    InReadOnlyState: function () {
        if (Data.GetValue("Document_ERP_ID__")) {
            Controls.ERP_Information_Pane.Hide(false);
        }
    }
};
//#endregion
//#region Process state
// **************************************************************************************************************************
const ProcessState = {
    ReadOnly: function () {
        if (ProcessInstance.isReadOnly || ProcessInstance.state >= 100) {
            // hide custom approve buttons
            Controls.Archive_only.Hide(true);
            Controls.Reject.Hide(true);
            Controls.SetAside.Hide(true);
            Controls.Simulate.Hide(true);
            Controls.Dispatch_attachments.Hide(true);
            Controls.LoadQuotationItems__.Hide(true);
            Controls.QuotationNumber__.SetBrowsable(false);
            Controls.ContractNumber__.SetBrowsable(false);
            Controls.LoadSAPOrderItems__.Hide(true);
            Controls.SAPOrderNumber__.SetBrowsable(false);
            Controls.OrderReason__.SetBrowsable(false);
            Controls.Product_List__.LineRejectionReason__.SetBrowsable(false);
            Controls.PriceCheck.Hide(true);
            ArchiveOnly.InReadOnlyState();
        }
    },
    hideSAPSpecificControls: function (hide) {
        // Hides obsolete controls for we cannot delete them
        Controls.Notes__.Hide(true); // Header texts dialog
        // Always hide SAP TEXTS panel (they will be made visible when SAP texts are retrieved)
        Controls.SAP_texts.Hide(true);
        Controls.SAPTextsTable__.Hide(true);
        let config = Sys.OM.Helpers.GetConfiguration();
        let hideSAPTextComponents = hide || config.Display_default_SAP_texts === "0" && config.Allow_SAP_texts_modifications === "0";
        Controls.ToggleSAPTextPanel__.Hide(hideSAPTextComponents);
        if (!hideSAPTextComponents) {
            SalesOrderHeader.HideSAPTextPanel();
        }
        Controls.Sales_Information.Hide(hide);
        Controls.More_Sales_Information.Hide(hide);
        Controls.Options.Hide(hide);
        Controls.Product_List__.Notes__.Hide(hide);
        Controls.Product_List__.Pricing_conditions__.Hide(hide);
        Controls.Product_List__.LineRejectionReason__.Hide(hide);
        Controls.Product_List__.PricingConditionData__.Hide(hide);
        Controls.Product_List__.Payment_Terms__.Hide(config.DisplayItemPaymentTerms === "0");
        Controls.Simulate.Hide(hide);
        Controls.Additional_partners.Hide(config.Display_additional_partners === "0");
        Controls.Payment_Terms__.Hide(config.DisplayPaymentTerms === "0");
        SalesOrderHeader.UpdateQuotationVisibility();
        Controls.OrderReason__.Hide(hide || config.SAPReturnOrdersOrderReason === "0");
        Controls.Product_List__.LineRejectionReason__.Hide(hide || config.SAPReturnOrdersLineRejectionReason === "0");
        if (!hide && config.SelectAdditionalPartners === "1") {
            Controls.Partners__.Selected_partner__.Hide(false);
            Controls.Partners__.HideTableRowMenu(true);
            Controls.Partners__.SetAtLeastOneLine(false);
        }
        let splitIntoChildorders = Sys.OM.Helpers.GetConfiguration().SplitMethod === "CreateChildOrders";
        if (splitIntoChildorders) {
            Controls.Post_and_wait_for_SAP_document_number__.Hide(true);
        }
        // In case of archiving, hide items panel because items have been manually changed in SAP, we don't need to display them
        Controls.Items.Hide(Controls.Order_status__.GetValue() === "OrderArchived");
        Controls.Product_List__.SapLineItemSplitDocumentId__.Hide(!Data.GetValue("IsLineItemSplitOrder__"));
    },
    RowSplitRefresh: function (index) {
        let row = Controls.Product_List__.GetRow(index);
        if (row != null) {
            let item = row.GetItem();
            if (item) {
                if (item.GetValue("LineItemSplitStatus__") === "Success") {
                    row.AddStyle("highlight-success");
                }
                else if (item.GetValue("LineItemSplitStatus__") === "Error") {
                    row.AddStyle("highlight-danger");
                }
                else {
                    row.RemoveStyle("highlight-success");
                    row.RemoveStyle("highlight-danger");
                }
            }
        }
    },
    HideDeprecatedFields: function () {
        Controls.Revised_Order__.Hide(true);
    },
    HideControls: function () {
        let config = Sys.OM.Helpers.GetConfiguration();
        ProcessState.hideSAPSpecificControls(!(Lib.SOP.Helpers.IsSAP() || Lib.SOP.Helpers.IsS4HANA()));
        // Show simulate button only for SAP S4/Hana Public Cloud
        if (Lib.SOP.Helpers.IsERP("SAPS4Cloud")) {
            Controls.Simulate.Hide(false);
        }
        SetArchiveAndApproveVisibility();
        if (!ProcessInstance.isDebugActive) {
            // Hide Items count and shipping address fields
            Controls.ItemsCount__.Hide();
            Controls.ShipToAddress__.Hide();
            Controls.SoldToAddress__.Hide();
            // Hide EDI technical fields
            Controls.SoldToEDIAddress__.Hide();
            Controls.ShipToEDIAddress__.Hide();
            Controls.Product_List__.EDI_item__.Hide();
            Controls.Portal_Information.Hide();
            // Hide Layout identifier
            Controls.LayoutIdentifier__.Hide();
            const source = Data.GetValue("Source__");
            if (!source) {
                Controls.Source__.Hide();
            }
            else {
                Controls.Source__.Hide(false);
                const readonly = Lib.SOP.isFromPortal() || Lib.SOP.isFromPunchout();
                Controls.Contact_login__.SetReadOnly(readonly);
                Controls.Send_confirmation_notification__.SetReadOnly(readonly);
                if (Data.GetValue("InboundChannelName__")) {
                    Controls.InboundChannelName__.Hide(false);
                }
                if (Data.GetValue("SourceSubject__")) {
                    Controls.SourceSubject__.Hide(false);
                }
            }
            if (config.HandleOrderConfirmations !== "1") {
                // Hide portal informations
                Controls.Send_confirmation_notification__.Hide();
                if (Lib.SOP.Helpers.IsOracleEbs()) {
                    Controls.Contact_login__.Hide();
                }
            }
            let bHideReqDate = config.DisplayRequestedDate === "0";
            Controls.Product_List__.Requested_Date__.Hide(bHideReqDate);
            Controls.Product_List__.ItemReconciliationNumber__.Hide();
            let hideExtractedDescriptionField = !IsExtractedDesciptionFilled();
            Controls.Product_List__.ExtractedDescription__.Hide(hideExtractedDescriptionField);
            if (Data.GetValue("Order_status__") === "0") {
                Controls.Order_status__.Hide();
            }
            if (!Data.GetValue("Shipping_date__")) {
                Controls.Shipping_date__.Hide();
            }
            if (!Data.GetValue("Delivery_Date__")) {
                Controls.Delivery_Date__.Hide();
            }
            if (!Data.GetValue("Document_ERP_ID__")) {
                Controls.Document_ERP_ID__.Hide();
            }
            if (!Data.GetValue("Order_Creation_Error__")) {
                Controls.Order_Creation_Error__.Hide();
            }
            if (!Data.GetValue("IsLineItemSplitOrder__")) {
                Controls.IsLineItemSplitOrder__.Hide();
            }
            if (Variable.GetValueAsString("EDIPreprocessing") !== "1" || !Data.GetValue("CustomerVendor__")) {
                // This covers the case where synergy found a template which filled the field
                // -> we hide it still so that it's emptied in CleanHiddenHeaderFieldsForSynergy
                Controls.CustomerVendor__.Hide();
            }
            if (Variable.GetValueAsString("EDIPreprocessing") !== "1" || !Data.GetValue("ShiptoVendor__")) {
                // This covers the case where synergy found a template which filled the field
                // -> we hide it still so that it's emptied in CleanHiddenHeaderFieldsForSynergy
                Controls.ShiptoVendor__.Hide();
            }
            if (config.DisplayUnitPrice === "0") {
                Controls.Product_List__.Unit_Price__.Hide();
            }
            if (config.DisplayCurrency === "0") {
                Controls.Currency__.Hide();
            }
            if (config.EnableAutolearnOnSoldtoAddress === "0" || !Variable.GetValueAsString("DocAttached")) {
                Controls.ToggleSoldToAddress__.Hide();
            }
            if (config.EnableAutolearnOnShiptoAddress === "0" || !Variable.GetValueAsString("DocAttached")) {
                Controls.ToggleShipToAddress__.Hide();
            }
            if (config.QuantityConversion === "0") {
                Controls.Product_List__.ExtractedQuantity__.Hide();
                Controls.Product_List__.CustomerUnit__.Hide();
            }
            if (config.DisplayRequestedDeliveryDate === "0") {
                Controls.Due_Date__.Hide();
            }
            // Hide complete delivery fields
            Controls.CompleteDelivery__.Hide(config.DisplayShipComplete === "0");
            Controls.CompleteDeliveryKeyword__.Hide(config.DisplayShipComplete === "0");
            if ((config.ERP === "Generic" || config.ERP === "SAPS4Cloud" || Lib.SOP.Helpers.IsERP("Asynchronous SAP Integration")) && config.DisplayShipComplete === "1") {
                Controls.Sales_organization__.Hide();
                Controls.Distribution_channel__.Hide();
                Controls.Business_area__.Hide();
                Controls.Sales_office__.Hide();
                Controls.Sales_group__.Hide();
                Controls.Delivery_block__.Hide();
                Controls.Billing_block__.Hide();
                Controls.Shipping_condition__.Hide();
                Controls.Sales_Information.Hide(false);
            }
            // SAP fields
            Controls.NotesData__.Hide();
            Controls.PricingConditionData__.Hide();
            Controls.Product_List__.PricingConditionData__.Hide();
            Controls.Product_List__.NotesData__.Hide();
            if (!Lib.SOP.Helpers.IsSAP() || config.DisplayIncoterms === "0") {
                Controls.Incoterms1__.Hide(true);
                Controls.Incoterms2__.Hide(true);
            }
            if (!Lib.SOP.Helpers.IsSAP() || config.DisplayItemIncoterms === "0") {
                Controls.Product_List__.Incoterms1__.Hide(true);
                Controls.Product_List__.Incoterms2__.Hide(true);
            }
            Controls.Plant__.Hide(!Lib.SOP.Helpers.IsSAP() || config.DisplayPlants === "0");
            Controls.Product_List__.ItemPlant__.Hide(!Lib.SOP.Helpers.IsSAP() || config.DisplayItemPlants === "0");
            Controls.Product_List__.ItmCat__.Hide(!Lib.SOP.Helpers.IsSAP() || config.DisplayItemCategory === "0");
            // Oracle fields
            Controls.BookInOracle__.Hide(!Lib.SOP.Helpers.IsERP("Oracle EBS"));
            Controls.OrderTypeID__.Hide();
            Controls.OracleRequestId__.Hide(!Lib.SOP.Helpers.IsERP("Oracle EBS"));
            // Check if Complete Delivery option should be read only
            if (Controls.CompleteDelivery__.GetValue() === true && !Controls.CompleteDeliveryKeyword__.GetValue()) {
                Controls.CompleteDelivery__.SetReadOnly(true);
                Controls.CompleteDeliveryKeyword__.SetReadOnly(true);
            }
            //Hide delete button
            if (ProcessInstance.state > 70 || User.profileName === "Order Management View Only Profile") {
                Controls.DeleteAllLinesButton__.Hide();
            }
            // Reject reason fields
            if (ProcessInstance.state === 400) {
                Controls.Reject.Hide();
                //We show it if we come from SDA and the form is rejected
                Controls.SDACorrectedDocType__.Hide(!Lib.SOP.Helpers.IsFromSDA());
            }
            else {
                Controls.RejectReason__.Hide();
                Controls.RejectCommentView__.Hide();
            }
            if (config.SetAside !== "1") {
                Controls.SetAsideReason__.Hide();
                Controls.SetAsideComment__.Hide();
                Controls.SetAside.Hide();
            }
            else {
                Controls.SetAsideReason__.Hide(!Data.GetValue("SetAsideReason__"));
                Controls.SetAsideComment__.Hide(!Data.GetValue("SetAsideComment__"));
            }
            // Hide Fields modifications Counter
            Controls.ManuallyModifiedFieldsCount__.Hide();
            Controls.AutomaticallyModifiedFieldsCount__.Hide();
            Controls.ManuallyModifiedTableFieldsCount__.Hide();
            Controls.AutomaticallyModifiedTableFieldsCount__.Hide();
            // Hide Parameters panel
            ParameterDetails.hide();
            //Warning Message Panel behavior
            this.ShowWarningPanelsIfNecessary();
            const table = Data.GetTable("Product_List__");
            const nbItems = table.GetItemCount();
            // Line split
            let bHide = true;
            if (Data.GetValue("IsLineItemSplitOrder__")) {
                bHide = false;
            }
            else if (nbItems > 0) {
                let v = table.GetItem(0).GetValue("LineItemSplitGroupId__") || "DEFAULT";
                for (let i = 1; i < nbItems; i++) {
                    if ((table.GetItem(i).GetValue("LineItemSplitGroupId__") || "DEFAULT") != v) {
                        bHide = false;
                        break;
                    }
                }
            }
            Controls.Product_List__.LineItemSplitGroupId__.Hide(ProcessInstance.isDebugActive ? bHide : true);
            Controls.Product_List__.SapLineItemSplitDocumentId__.Hide(bHide);
            Controls.Product_List__.LineItemSplitStatus__.Hide(bHide);
            Controls.IsLineItemSplitOrder__.Hide(bHide);
            if (!bHide) {
                Lib.SOP.Helpers.AppendHandler(Controls.Product_List__, "OnRefreshRow", ProcessState.RowSplitRefresh);
                for (let i = 0; i < Controls.Product_List__.GetLineCount(); i++) {
                    ProcessState.RowSplitRefresh(i);
                }
            }
            if (Sys.OM.Helpers.GetConfiguration().DisplayConcatenedUOMToggles !== "1") {
                UoMToggle.HideUoMConcatenationFeature();
            }
            else {
                UoMToggle.HideQuantityUoMWhenNeeded();
                UoMToggle.HideUnitPriceUoMWhenNeeeded();
            }
            // Hide NSO fields if non-NSO Order
            //
            let isNsoOrder = Data.GetValue("EDI_Format__") === "NSO";
            Controls.NSOProcessType__.Hide(!isNsoOrder);
            Controls.EDIWorkflowID__.Hide(!isNsoOrder);
            SalesOrderHeader.UpdateContractVisibility();
            SalesOrderHeader.UpdateQuotationVisibility();
        }
        else {
            // Show Items count and shipping address fields in Debug
            Controls.ItemsCount__.Hide(false);
            Controls.ShipToAddress__.Hide(false);
            Controls.SoldToAddress__.Hide(false);
            Controls.Portal_Information.Hide(false);
            // Show layout identifier in debug mode
            Controls.LayoutIdentifier__.Hide(false);
            // Also show Fields modifications Counter in Debug
            Controls.ManuallyModifiedFieldsCount__.Hide(false);
            Controls.AutomaticallyModifiedFieldsCount__.Hide(false);
            Controls.ManuallyModifiedTableFieldsCount__.Hide(false);
            Controls.AutomaticallyModifiedTableFieldsCount__.Hide(false);
        }
        if (Controls.AutomaticProcessing__) {
            Controls.AutomaticProcessing__.Hide(true);
        }
        let isRunningTotalHide = config.DisplayRunningTotal !== "1";
        Controls.RunningTotal__.Hide(isRunningTotalHide);
        let hideSpreadsheetActions = ProcessInstance.isReadOnly || ProcessInstance.state >= 100 || Sys.OM.Helpers.GetConfiguration().EnableCsvExtraction !== "1";
        Controls.Actions_pane__.Hide(hideSpreadsheetActions);
        Controls.Extract_from_spreadsheet__.Hide(hideSpreadsheetActions || Variable.GetValueAsString("SpreadsheetInAttachments") !== "1");
        Controls.Import_from_clipboard__.Hide(hideSpreadsheetActions || (Variable.GetValueAsString("SpreadsheetInAttachments") !== "1" && Attach.GetNbAttach() !== 0));
        // Existing spreadsheet mapping for this document
        if (!hideSpreadsheetActions && Variable.GetValueAsString("SpreadsheetInAttachments") === "1" && Variable.GetValueAsString("AskForCsvMapping") !== "1") {
            Controls.Extract_from_spreadsheet__.SetText(Language.Translate("_Edit spreadsheet mapping"));
        }
        this.HideFieldsFromConfig();
        this.HideDeprecatedFields();
    },
    HideFieldsFromConfig: function () {
        let config = Sys.OM.Helpers.GetConfiguration();
        let AllFields = config.FieldsToHideOnForm;
        if (AllFields) {
            let fieldsList = AllFields.split("\n");
            for (let i = 0; i < fieldsList.length; i++) {
                let fieldName = fieldsList[i];
                if (fieldName.indexOf(".") > 0) {
                    let fieldSegments = fieldName.split(".");
                    // field Control = table.field
                    if (fieldSegments.length === 2) {
                        let fieldTable = fieldSegments[0];
                        let ColumnName = fieldSegments[1];
                        if (Controls[fieldTable]) {
                            if (Controls[fieldTable][ColumnName]) {
                                Controls[fieldTable][ColumnName].Hide();
                            }
                        }
                    }
                }
                else {
                    //form field
                    if (Controls[fieldName]) {
                        Controls[fieldName].Hide();
                    }
                }
            }
        }
    },
    ShowWarningPanelsIfNecessary: function () {
        let hideWarningMessagePane = true;
        let hideWarningConversationPane = true;
        let hideWarningDetailsPane = true;
        if (Data.GetValue("NewConversationMessage") === "1") {
            hideWarningConversationPane = false;
        }
        if (Data.GetValue("EDI_Format__") === "IDOC") {
            let ediVersion = Data.GetValue("EDI_Version__");
            let ediType = Data.GetValue("EDI_Type__");
            if (ediVersion !== "DC40") {
                Controls.Warning_Message__.SetText(Language.Translate("Non-supported IDOC version") + " (EDI_" + ediVersion + ")");
                hideWarningDetailsPane = false;
            }
            else if (!ediType || ediType.indexOf("ORDERS") !== 0) {
                Controls.Warning_Message__.SetText(Language.Translate("Only Orders IDOC are supported") + " (" + ediType + ")");
                hideWarningDetailsPane = false;
            }
            else {
                hideWarningDetailsPane = EDI.CheckStatusCode(hideWarningDetailsPane);
            }
        }
        //Generic controls
        Controls.Warning_Message_Pane.Hide(hideWarningMessagePane);
        Controls.Warning_Details_Pane.Hide(hideWarningDetailsPane);
        Controls.MainWarningMessage__.Hide();
        //Conversation controls
        Controls.NewConversationMessageWarning__.Hide(hideWarningConversationPane);
        //EDI controls
        Controls.Warning_Message__.Hide(hideWarningDetailsPane);
    },
    SetupSalesDocumentTypeField: function () {
        let currentSalesDocType = Data.GetValue("SalesDocumentType__");
        let oConfig = Sys.OM.Helpers.GetConfiguration();
        let values = ["Order=TypeOrder"];
        if (oConfig.ActivateChangeOrders === "1") {
            values.push("ChangeOrder=TypeChangeOrder");
        }
        if (oConfig.ActivateSAPReturnOrders === "1" && oConfig.SAPReturnOrdersTypesList.length > 0) {
            values.push("ReturnOrder=TypeReturnOrder");
        }
        if (oConfig.ActivateQuotes === "1" && oConfig.QuoteTypesList.length > 0) {
            values.push("QuoteRequest=TypeQuoteRequest");
        }
        Controls.SalesDocumentType__.SetAvailableValues(values);
        let valuesString = values.join(",");
        if (valuesString.indexOf(currentSalesDocType + "=") === -1) {
            currentSalesDocType = valuesString.substring(0, valuesString.indexOf("="));
        }
        Data.SetValue("SalesDocumentType__", currentSalesDocType);
        // Synchronize SalesDocumentType
        //
        Controls.SalesDocumentType__.OnChange = function () {
            // backward compatibility: the Revised_Order__ field has been removed but we still keep it in sync  (change order views in auto-update and upgrade mode)
            let isChangeOrder = Controls.SalesDocumentType__.GetSelectedOption() == Lib.SOP.Helpers.SalesDocumentType.ChangeOrder;
            Data.SetValue("Revised_Order__", isChangeOrder ? "1" : "0");
            SetArchiveAndApproveVisibility();
            this.SetupDocumentTypeField();
            CheckTypeOfDocumentType();
            SalesOrderHeader.UpdateChangeOrdersViewVisibility();
            SalesOrderHeader.UpdateContractVisibility();
            SalesOrderHeader.UpdateQuotationVisibility();
        }.bind(this);
    },
    SetupDocumentTypeField: function () {
        let oConfig = Sys.OM.Helpers.GetConfiguration();
        let bHideDocumentTypeField = true;
        let sDefaultDocumentType = oConfig.DocumentType;
        let currentSalesDocumentType = Data.GetValue("SalesDocumentType__");
        //if we are on NSO Order, we clear the DefaultOrderType if the value is type of PreAgreed
        let bNSOIsPreAgreed = Lib.SOP.Helpers.IsNSOPreAgreed(oConfig);
        if (Data.GetValue("EDI_Format__") === "NSO" && bNSOIsPreAgreed) {
            sDefaultDocumentType = "";
        }
        if (!Lib.SOP.Helpers.IsOracleEbs()) {
            let sDocumentTypeList = Lib.SOP.Helpers.RetrieveDocumentTypeComboBoxList(oConfig);
            //If we are on NSO order, we remove the "PreAgreed" option for the DocumentType
            if (Data.GetValue("EDI_Format__") === "NSO" && currentSalesDocumentType === Lib.SOP.Helpers.SalesDocumentType.Order) {
                let sNSOPreAgreedType = Lib.SOP.Helpers.GetNSOPreAgreedType(oConfig);
                let aDocumentTypeArray = sDocumentTypeList.split("\n");
                sDocumentTypeList = "";
                for (let i = 0; i < aDocumentTypeArray.length; ++i) {
                    let iSeparator = aDocumentTypeArray[i].indexOf("=");
                    let sDocumentType = aDocumentTypeArray[i];
                    if (iSeparator > 0 && sDocumentType.substr(0, iSeparator) !== sNSOPreAgreedType) {
                        sDocumentTypeList += sDocumentType + "\n";
                    }
                }
            }
            if (!Data.IsComputed("DocumentType__") && !Data.GetChangeType("DocumentType__") && !Data.GetConfidenceType("DocumentType__") && currentSalesDocumentType === Lib.SOP.Helpers.SalesDocumentType.Order) {
                sDefaultDocumentType = oConfig.DocumentType;
                Lib.SOP.Helpers.SetValueWithSourceFromConfig(Data, "DocumentType__", sDefaultDocumentType);
            }
            // change option list of combobox control
            const documentTypesFromConfigAsKeyValuesArray = sDocumentTypeList ? sDocumentTypeList.split("\n") : [];
            const documentTypesFromConfigAsDict = Lib.SOP.Helpers.ConvertKeyValueStringToDict(sDocumentTypeList);
            const currentOrderDocumentTypes = Controls.DocumentType__.GetAvailableValues() || [];
            const currentOrderDocumentTypesAsDict = Lib.SOP.Helpers.ConvertKeyValueStringToDict(currentOrderDocumentTypes.join("\n"));
            if (documentTypesFromConfigAsKeyValuesArray.length > 0 &&
                !Lib.SOP.Helpers.CompareDictionaries(currentOrderDocumentTypesAsDict, documentTypesFromConfigAsDict)) {
                if (!Data.GetValue("DocumentType__")) {
                    // No order type, force first value from allowed order types to prevent false manual change event triggered by SetAvailableValues()
                    Lib.SOP.Helpers.SetValueWithSourceFromConfig(Data, "DocumentType__", sDocumentTypeList.substring(0, sDocumentTypeList.indexOf("=")));
                }
                Controls.DocumentType__.SetAvailableValues(documentTypesFromConfigAsKeyValuesArray);
            }
            let documentType = Data.GetValue("DocumentType__");
            if (sDocumentTypeList && sDocumentTypeList.length > 0) {
                if (!documentType || sDocumentTypeList.indexOf(documentType + "=") === -1) // if the document type is not in the list, we use the first one
                 {
                    if (!documentType) {
                        if (sDefaultDocumentType) {
                            Data.SetValue("DocumentType__", sDefaultDocumentType);
                        }
                    }
                    else {
                        Data.SetValue("DocumentType__", sDocumentTypeList.substring(0, sDocumentTypeList.indexOf("=")));
                    }
                }
            }
            else {
                if (sDefaultDocumentType) {
                    Data.SetValue("DocumentType__", "");
                }
            }
            // hide combobox if list has a single item
            bHideDocumentTypeField = documentTypesFromConfigAsKeyValuesArray.length <= 1;
        }
        else if (!Data.IsComputed("OrderType__") && !Data.GetChangeType("OrderType__") && !Data.GetConfidenceType("OrderType__")) {
            let filter = Sys.Helpers.LdapUtil.FilterEqual("Name__", sDefaultDocumentType);
            Lib.SOP.Helpers.CallDBQuery(function (queryResult) {
                let queryValue = queryResult ? queryResult : this.GetQueryValue();
                if (queryValue && queryValue.Records && queryValue.Records.length > 0) {
                    let id = this.GetQueryValue("TransactionTypeId__", 0);
                    Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "OrderTypeID__", id, this.GetQueryTable());
                }
                else {
                    Data.SetValue("OrderTypeID__", "");
                }
            }, "SO - OrderTypes__", { filter: filter });
        }
        Controls.DocumentType__.Hide(bHideDocumentTypeField);
    }
};
//#endregion
//#region Conversations management
// **************************************************************************************************************************
var ConversationListHelper;
(function (ConversationListHelper) {
    ConversationListHelper.ConversationPopup = null;
    function Init() {
        if (!Data.GetValue("RUIDEX")) {
            HideConversationControls();
            return null;
        }
        let initOptions = BuildConversationListOptions();
        ShowOrHideNewMessageButtonIfNecessary();
        UpdateLabel();
        UpdateLabelWarning();
        Controls.Conversation__.Init(initOptions);
        Controls.ConversationPopupButton__.OnClick = OnClickNewMessage;
        ConversationListHelper.ConversationPopup = Sys.Conversations.Client.GetConversationPopup(Controls.Conversation__, "SO - Email response templates__", null, Lib.SOP.Helpers.GetCustomerNumber, Lib.SOP.Helpers.GetCustomerName, GetEmailAddress, ShouldDisplayInitConversationWarningMessage(), false, null);
        // Allows displaying preview of included original email in the popup
        ConversationListHelper.ConversationPopup.GetAttachmentPreviewURL = function (attachment) {
            return Controls.Conversation__.GetAttachmentPreviewURL(attachment);
        };
        // Allows displaying preview of the conversation in the popup
        ConversationListHelper.ConversationPopup.GetMessagePreviewURL = function (path) {
            return Controls.Conversation__.GetMessagePreviewURL(path);
        };
        return initOptions;
    }
    ConversationListHelper.Init = Init;
    function GetEmailAddress() {
        return Data.GetValue("ContactEmail__");
    }
    function ShouldDisplayInitConversationWarningMessage() {
        return Sys.OM.Helpers.GetConfiguration().PortalIntegrationEnabled !== "0"
            && !Lib.SOP.isFromPortal()
            && !Lib.SOP.isFromConversation(Data)
            && !FindAdditionalProcessRuidIfExist();
    }
    function SetConversationPopupCommonSettings() {
        ConversationListHelper.ConversationPopup.UsersFilterOptions.includeNoCustomers = true;
        ConversationListHelper.ConversationPopup.UsersFilterOptions.includeGroups = false;
        ConversationListHelper.ConversationPopup.DisplayCheckboxToAddOriginalEmail = true;
        ConversationListHelper.ConversationPopup.EnableEmailCCRecipients = true;
        ConversationListHelper.ConversationPopup.ConversationIdToForward = "";
        ConversationListHelper.ConversationPopup.LastConversation = null;
        ConversationListHelper.ConversationPopup.DisplaySubjectField = true;
        ConversationListHelper.ConversationPopup.SubjectToForward = "";
        ConversationListHelper.ConversationPopup.fillNewMessageSubject = false;
        ConversationListHelper.ConversationPopup.allowEditingNewCustomersInfo = true;
        ConversationListHelper.ConversationPopup.AdditionalAttachments = [];
        ConversationListHelper.ConversationPopup.DefaultSubject = null;
        ConversationListHelper.ConversationPopup.AlreadyAddedEmailsCanBeRemoved = true;
        ConversationListHelper.ConversationPopup.CanCreateNewThreadOnReply = true;
        // If the portal is disabled, we consider every contact as external
        if (Sys.OM.Helpers.GetConfiguration().PortalIntegrationEnabled === "0") {
            ConversationListHelper.ConversationPopup.IsPortalDisabled = true;
        }
    }
    ConversationListHelper.SetConversationPopupCommonSettings = SetConversationPopupCommonSettings;
    function OnClickNewMessage() {
        SetConversationPopupCommonSettings();
        ConversationListHelper.ConversationPopup.fillNewMessageSubject = true;
        let originalEmailData = Sys.Helpers.Email.GetEmailDataFromIsm(Data.GetValue("WorkflowID"));
        if (originalEmailData && originalEmailData.Subject) {
            ConversationListHelper.ConversationPopup.DefaultSubject = originalEmailData.Subject;
        }
        else {
            let poNumber = Data.GetValue("Sales_Order_Number__") ? Data.GetValue("Sales_Order_Number__") : "";
            ConversationListHelper.ConversationPopup.DefaultSubject = Language.Translate("NewMessageDefaultSubject", true, poNumber);
        }
        ConversationListHelper.ConversationPopup = UserExit.ModifyConversationPopupOptions(ConversationListHelper.ConversationPopup, "NewConversation");
        ConversationListHelper.ConversationPopup.OpenConversation();
    }
    ConversationListHelper.OnClickNewMessage = OnClickNewMessage;
    function UpdateLabel() {
        if (Data.GetValue("CustomerName__") != null && Data.GetValue("CustomerName__") !== "") {
            let label = Language.Translate("Conversation with {0}", false, Data.GetValue("CustomerName__"));
            Controls.Conversation.SetLabel(label);
        }
        else {
            Controls.Conversation.SetLabel("Conversation");
        }
    }
    ConversationListHelper.UpdateLabel = UpdateLabel;
    function UpdateLabelWarning() {
        let warningMessage = Language.Translate("This order contains a new message from your customer");
        Controls.NewConversationMessageWarning__.FireEvent("setMessage", { warningConversationMessage: warningMessage });
    }
    function ShowOrHideNewMessageButtonIfNecessary() {
        // standard conversation button hidden -> new button: ConversationPopupButton__
        Controls.Conversation__.HideNewMessageButton(true);
        if (User.profileName === "Order Management View Only Profile") {
            Controls.ConversationPopupButton__.Hide(true);
        }
    }
    function HideConversationControls() {
        Controls.Conversation__.Hide();
        Controls.Conversation.Hide();
    }
    function BuildConversationItemOptions() {
        let options = BuildConversationListOptions();
        if (options) {
            return options.Options;
        }
        return null;
    }
    function BuildConversationListOptions() {
        let conversationInfo = {
            DocumentId: Controls.Sales_Order_Number__.GetValue(),
            BusinessIdFieldName: "account_id",
            AdditionalProcesses: [],
            LogMonitorOptions: {
                defaultMessage: "ConversationList Usage",
                tags: "SOP|ConversationList"
            },
            DisplayAllItemsNoScroll: true,
            openLastNewConversation: Data.GetValue("NewConversationMessage") === "1",
            Options: {},
            EventHandlers: {
                onBeforeSendMessage: function (conversationItemOptions, oldConversation) {
                    if (oldConversation) {
                        conversationItemOptions.itemOptions = BuildConversationItemOptions();
                    }
                    else {
                        conversationItemOptions.itemOptions.emailCustomTags.OrderNumber__ = Data.GetValue("Sales_Order_Number__");
                        conversationItemOptions.itemOptions.emailCustomTags.OrderSummary__ = Lib.SOP.GetSummary("COP");
                    }
                    conversationItemOptions.itemOptions.oldConversation = oldConversation;
                },
                onAfterSendMessage: function (sendMessageResults) {
                    if (sendMessageResults) {
                        if (sendMessageResults.newPortalOrderCreated) {
                            ProcessInstance.SetSilentChange(true);
                            Bindings.SetSoldtoShiptoReadOnlyIfNeededFromConversation(true);
                            let jsonData = { copoRuidCreatedFromConversation: sendMessageResults.ruidEx };
                            Data.SetValue("JsonFromPortal__", JSON.stringify(jsonData));
                            //force conversation option rebuild (new ruidEx)
                            Controls.Conversation__.Init(BuildConversationListOptions());
                            ProcessInstance.SetSilentChange(false);
                        }
                        ConversationListHelper.ConversationPopup.LastConversation =
                            {
                                id: sendMessageResults.conversationId
                            };
                    }
                },
                onConversationsLoaded: function (numberOfItems, updateLastRowCallback) {
                    let i = setInterval(function () {
                        if (Data.GetValue("NewConversationMessage") === "1") {
                            Controls.Conversation.ScrollIntoView();
                        }
                        clearInterval(i);
                    }, 1200);
                    ConversationListHelper.ConversationPopup.NumberOfConversations = numberOfItems;
                    ConversationListHelper.ConversationPopup.OnConversationsLoadedFinished(updateLastRowCallback, "Conversation__");
                },
                onForwardConversationClick: function (item) {
                    SetConversationPopupCommonSettings();
                    ConversationListHelper.ConversationPopup.ConversationIdToForward = item.id;
                    ConversationListHelper.ConversationPopup.DisplayCheckboxToAddOriginalEmail = false;
                    ConversationListHelper.ConversationPopup.SubjectToForward = item.subject ? item.subject : item.lastMessage.Subject;
                    ConversationListHelper.ConversationPopup.fillNewMessageSubject = true;
                    ConversationListHelper.ConversationPopup.LastConversation = item;
                    if (item.messages && item.messages.length > 0) {
                        let attachmentList = [];
                        item.messages.forEach((message) => {
                            if (message.attachments && message.attachments.length > 0) {
                                attachmentList.push(...message.attachments);
                            }
                        });
                        ConversationListHelper.ConversationPopup.AdditionalAttachments = attachmentList;
                    }
                    ConversationListHelper.ConversationPopup = UserExit.ModifyConversationPopupOptions(ConversationListHelper.ConversationPopup, "ForwardConversation");
                    ConversationListHelper.ConversationPopup.OpenConversation("_ForwardConversationDialogTitle");
                },
                onReplyAllConversationClick: function (item) {
                    SetConversationPopupCommonSettings();
                    ConversationListHelper.ConversationPopup.LastConversation = item;
                    ConversationListHelper.ConversationPopup.DisplayCheckboxToAddOriginalEmail = false;
                    ConversationListHelper.ConversationPopup.DisplaySubjectField = false;
                    ConversationListHelper.ConversationPopup.AlreadyAddedEmailsCanBeRemoved = true;
                    ConversationListHelper.ConversationPopup.ConversationIdToForward = item.id;
                    ConversationListHelper.ConversationPopup = UserExit.ModifyConversationPopupOptions(ConversationListHelper.ConversationPopup, "ReplyAll");
                    ConversationListHelper.ConversationPopup.OpenConversationReply();
                },
                onForwardMessageClick: function (message) {
                    SetConversationPopupCommonSettings();
                    ConversationListHelper.ConversationPopup.ConversationIdToForward = message.ID;
                    ConversationListHelper.ConversationPopup.ConversationMessageIdToForward = message.Msn;
                    ConversationListHelper.ConversationPopup.SubjectToForward = message.Subject;
                    ConversationListHelper.ConversationPopup.DisplayCheckboxToAddOriginalEmail = false;
                    ConversationListHelper.ConversationPopup.fillNewMessageSubject = true;
                    ConversationListHelper.ConversationPopup.AdditionalAttachments = message.attachments;
                    ConversationListHelper.ConversationPopup = UserExit.ModifyConversationPopupOptions(ConversationListHelper.ConversationPopup, "ForwardMessage");
                    ConversationListHelper.ConversationPopup.OpenConversation("_ForwardConversationDialogTitle");
                }
            }
        };
        let conversationOptions = {
            sendSingleEmailToAllRecipients: globalSettingsData.SendSingleEmailToAllRecipients__ === "1",
            orderNumber: Controls.Sales_Order_Number__.GetValue(),
            orderSummary: Lib.SOP.GetSummary("COP")
        };
        const options = Lib.SOP.Conversation.GetConversationOptions(conversationOptions);
        let autoCompleteOptions = {
            recipientsFilter: Sys.Helpers.LdapUtil.FilterEqual("BusinessPartnerId", Data.GetValue("CustomerNumber__")).toString(),
            keywordSearchAttributes: ["EmailAddress", "DisplayName"],
            attributes: [
                {
                    name: "Login",
                    isVisible: false
                },
                {
                    name: "Company",
                    isVisible: false
                },
                {
                    name: "BusinessPartnerID",
                    isVisible: false
                },
                {
                    name: "DisplayName",
                    isVisible: true,
                    translationKey: "DisplayName"
                },
                {
                    name: "EmailAddress",
                    isVisible: true,
                    translationKey: "EmailAddress"
                }
            ],
            sortOrder: "DisplayName ASC, EmailAddress ASC",
            keepAllResults: true,
            checkCustomerCreation: true,
            defaultEmailAddress: Data.GetValue("Contact_login__"),
            showOnlyWhenResultsFound: true
        };
        let tableColumnsToDisplay = [
            {
                label: "EmailAddress",
                data: "emailAddress",
                width: "20%"
            },
            {
                label: "_LastMessage",
                data: "lastMessage.Message",
                width: "45%"
            }
        ];
        tableColumnsToDisplay = UserExit.GetTableColumnsToDisplay(tableColumnsToDisplay);
        let additionalProcess = {
            RuidEx: FindAdditionalProcessRuidIfExist(),
            BusinessIdFieldName: "BusinessPartnerID",
            DocumentId: Controls.Sales_Order_Number__.GetValue(),
            BusinessPartnerID: Data.GetValue("CustomerNumber__"),
            RecipientType: "CUSTOMER",
            AutoCompleteOptions: autoCompleteOptions,
            TableColumnsToDisplay: tableColumnsToDisplay,
            Options: options.portalOptions
        };
        conversationInfo.Options = options.orderOptions;
        conversationInfo.AdditionalProcesses.push(additionalProcess);
        conversationInfo = UserExit.GetConversationInfo(conversationInfo, "Customer Order Processing");
        return conversationInfo;
    }
    ConversationListHelper.BuildConversationListOptions = BuildConversationListOptions;
    function FindAdditionalProcessRuidIfExist() {
        let additionalProcessRuid = "";
        if (Variable.GetValueAsString("AdditionalProcessRuid")) {
            additionalProcessRuid = Variable.GetValueAsString("AdditionalProcessRuid");
        }
        else if (Lib.SOP.isFromPortal()) {
            additionalProcessRuid = Data.GetValue("SourceRUID");
        }
        else {
            let json = Data.GetValue("JsonFromPortal__");
            if (json) {
                try {
                    let jsonData = JSON.parse(json);
                    if (jsonData.copoRuidCreatedFromConversation) {
                        additionalProcessRuid = jsonData.copoRuidCreatedFromConversation;
                    }
                }
                catch (_a) {
                    Log.Error("there was an error with Json from Portal data");
                }
            }
        }
        Log.Info("Ruid from other process : " + additionalProcessRuid);
        return additionalProcessRuid;
    }
})(ConversationListHelper || (ConversationListHelper = {}));
//#endregion
//#region Custom actions
// **************************************************************************************************************************
let Actions = {
    simulate: function () {
        let simulateWhenRequestsDone = function () {
            Lib.SOP.DataChecks.CheckAll();
            Controls.Simulate.Focus();
            if (Process.ShowFirstError() === null) {
                g_erpOrderDocument.Simulate(true);
            }
            else {
                Controls.Simulate.Wait(false);
            }
        };
        //remove previous error
        Lib.SOP.SAP.Helpers.ClearLastError();
        Controls.Simulate.Wait(true);
        Lib.SOP.DataChecks.CheckAllWithQuery();
        Query.NotifyOnCurrentRequestsDone(simulateWhenRequestsDone);
        return false;
    },
    priceCheck: function () {
        g_erpOrderDocument.priceCheck();
    },
    save: function (action, afterSave) {
        let shouldCreateCase = Lib.SOP.Salesforce.CreateOrUpdateCase(Lib.SOP.Salesforce.eStages.WhenSaving, function () {
            Items.FillItemsCount();
            SalesOrderHeader.SAPTextsToNotesData();
            if (afterSave != null) {
                afterSave(action);
            }
        });
        return !shouldCreateCase;
    },
    reject: function () {
        let fillDialog = function (dialog) {
            let rejectReasonCombo = dialog.AddComboBox("rejectReasonCombo", "_Select reject reason", 400);
            let possibleRejectReasons = Controls.RejectReason__.GetAvailableValues();
            let rejectReason = Controls.RejectReason__.GetValue();
            let newDocType = null;
            rejectReasonCombo.SetAvailableValues(possibleRejectReasons);
            rejectReasonCombo.SetValue(rejectReason);
            if (Lib.SOP.Helpers.IsFromSDA()) {
                newDocType = dialog.AddComboBox("sdaDocumentTypeCombo", "_Select SDA Document type", 400);
                dialog.HideControl("sdaDocumentTypeCombo", true);
            }
            for (let i = 0; i < possibleRejectReasons.length; i++) {
                if (possibleRejectReasons[i].split("=")[0] === "Document is not an order") {
                    rejectReasonCombo.SetValue("Document is not an order");
                    dialog.HideControl("sdaDocumentTypeCombo", false);
                    sdaDocumentTypeComboSetup(dialog);
                    break;
                }
            }
            dialog.AddMultilineText("rejectReasonDetail", "_Comment", 400);
        };
        let autoSelectDocumentType = function (dialog) {
            let sdaDocumentTypeComboControl = dialog.GetControl("sdaDocumentTypeCombo");
            let reason = dialog.GetControl("rejectReasonCombo").GetValue();
            let types = sdaDocumentTypeComboControl.GetAvailableValues();
            let autoSelect = reason == "Document is not an order";
            if (autoSelect && types.length === 2) {
                sdaDocumentTypeComboControl.SetValue(types[1].split("=")[0]);
            }
        };
        let sdaDocumentTypeComboSetup = function (dialog) {
            let sdaDocumentTypeComboControl = dialog.GetControl("sdaDocumentTypeCombo");
            if (sdaDocumentTypeComboControl) {
                let currentDocType = Variable.GetValueAsString("SDADocTypeSource");
                if (!dialog.GetControl("sdaDocumentTypeCombo").GetText()) {
                    sdaDocumentTypeComboControl.Wait(true);
                    Lib.SOP.DocumentTypeManager.Init(sdaDocumentTypeComboControl, currentDocType);
                    Lib.SOP.DocumentTypeManager.FillDocumentTypeControl(function () {
                        autoSelectDocumentType(dialog);
                        sdaDocumentTypeComboControl.Wait(false);
                    });
                }
                else {
                    autoSelectDocumentType(dialog);
                }
            }
        };
        let handleEvents = function (dialog, tabId, event, control) {
            if (event === "OnChange" && control.GetName() === "rejectReasonCombo" && Lib.SOP.Helpers.IsFromSDA()) {
                let showField = control.GetValue() === "Document is not an order";
                dialog.HideControl("sdaDocumentTypeCombo", !showField);
                if (showField) {
                    sdaDocumentTypeComboSetup(dialog);
                }
            }
        };
        let commitDialog = function (dialog, tabId, event, control) {
            let rejectReason = dialog.GetControl("rejectReasonCombo").GetValue();
            let rejectComment = dialog.GetControl("rejectReasonDetail").GetValue();
            Data.SetValue("RejectReason__", rejectReason);
            Data.SetValue("RejectCommentView__", rejectComment || "");
            Data.SetValue("Order_status__", "OrderCancelled");
            if (Lib.SOP.Helpers.IsFromSDA() && rejectReason === "Document is not an order") {
                let SDADocType = dialog.GetControl("sdaDocumentTypeCombo").GetValue();
                Data.SetValue("SDACorrectedDocType__", SDADocType);
                Variable.SetValueAsString("SDARelatedAutoLearningConfiguration", Lib.SOP.DocumentTypeManager.GetConfiguration(SDADocType));
            }
            ProcessInstance.Approve("reject");
        };
        Popup.Dialog("_Reject", null, fillDialog, commitDialog, null, handleEvents);
    },
    approve: function () {
        let approveWhenRequestsDone = function () {
            DuplicatesCheck.doDuplicateCheck(function () {
                Lib.SOP.DataChecks.CheckAll();
                SalesOrderHeader.SAPTextsToNotesData();
                Lib.SOP.Contracts.SetErrorOnRequiredFields();
                Controls.Approve.Focus();
                if (Process.ShowFirstError() === null) {
                    g_erpOrderDocument.BeforePost();
                    return;
                }
                Controls.Approve.Wait(false);
            });
        };
        Controls.Approve.Wait(true);
        let skipPriceCheck = Data.GetValue("Skip_price_check__");
        if (skipPriceCheck) // Clear existing price check errors
         {
            Data.SetError("Total__", "");
            let table = Data.GetTable("Product_List__");
            let nbItems = table.GetItemCount();
            for (let i = 0; i < nbItems; i++) {
                let row = table.GetItem(i);
                row.SetError("Total__", "");
                row.SetError("Unit_Price__", "");
            }
        }
        Lib.SOP.DataChecks.CheckAllWithQuery();
        Query.NotifyOnCurrentRequestsDone(approveWhenRequestsDone);
        return false;
    },
    loadQuotation: function (replaceOrderItems) {
        function LaunchQuotationActions() {
            if (!Lib.SOP.Quotes.IsQuoteFeatureActivated()) {
                return;
            }
            Controls.LoadQuotationItems__.SetDisabled(true);
            // If the order items have been loaded from a quotation and not from current order, we need to unload them before loading/reconciling the quotation
            if (Lib.SOP.Quotes.Client.OrderItemsLoadedFromQuote()) {
                Lib.SOP.Quotes.Client.UnloadQuote();
                Lib.SOP.Quotes.Client.CheckQuoteItemsRemainOnOrder();
            }
            // Lauch the load quotation action, that will try to reconcile the current order with the quotation
            g_erpOrderDocument.LoadQuotation(replaceOrderItems);
        }
        Query.NotifyOnCurrentRequestsDone(LaunchQuotationActions);
    },
    loadQuotationAndReplaceOrRestoreOrderItems: function () {
        // We'll replace the order items with the quotation items if the order items have not been loaded from a quotation but from current order
        const replaceOrderItems = !Lib.SOP.Quotes.Client.OrderItemsLoadedFromQuote();
        Actions.loadQuotation(replaceOrderItems);
    },
    clearContract: function () {
        if (!Lib.SOP.Contracts.IsContractFeatureActivated()) {
            return;
        }
        // If the contract number is not empty, not computed (set by script) and not set from teaching,
        // we clear it before suggesting a new one.
        if (Data.GetValue("ContractNumber__") &&
            Data.IsComputed("ContractNumber__") &&
            Data.GetComputedValueSource("ContractNumber__") !== "teaching") {
            Data.SetValue("ContractNumber__", "");
            Lib.SOP.Contracts.ClearContractFormData();
        }
    },
    loadContract: function (suggestContract) {
        function LaunchContractActions() {
            if (!Lib.SOP.Contracts.IsContractFeatureActivated()) {
                return;
            }
            if (suggestContract) {
                Actions.clearContract();
                // Suggest a contract number for current customer and sales area, if applicable
                g_erpOrderDocument.FillContractNumber()
                    .Then(() => {
                    g_erpOrderDocument.LoadContract();
                    SalesOrderHeader.UpdateContractVisibility();
                });
            }
            else {
                g_erpOrderDocument.LoadContract();
                SalesOrderHeader.UpdateContractVisibility();
            }
        }
        Query.NotifyOnCurrentRequestsDone(LaunchContractActions);
    },
    loadOrder: function () {
        function LaunchOrderActions() {
            Controls.LoadSAPOrderItems__.SetDisabled(true);
            if (Lib.SOP.SAP.Helpers.SapChangeOrder.IsLoadedFromOrder()) {
                Lib.SOP.SAP.Helpers.SapChangeOrder.UnloadOrder();
            }
            else if (!Controls.SAPOrderNumber__.GetError()) {
                if (Sys.OM.Helpers.GetConfiguration().Display_default_SAP_texts === "1") {
                    Lib.SOP.SAP.Helpers.SapChangeOrder.SetCallbackSapTexts(SalesOrderHeader.UpdateSAPTexts);
                }
                g_erpOrderDocument.LoadOrder();
            }
        }
        Controls.LoadSAPOrderItems__.SetDisabled(true);
        Query.NotifyOnCurrentRequestsDone(LaunchOrderActions);
    },
    setAside: function () {
        let possibleValues = Controls.SetAsideReason__.GetAvailableValues();
        let currentReason = Controls.SetAsideReason__.GetValue();
        if (!currentReason) {
            let firstValue = possibleValues[0];
            if (firstValue && firstValue.indexOf("=") !== -1) {
                currentReason = firstValue.substring(0, firstValue.indexOf("="));
            }
        }
        Lib.CommonDialog.PopupReason({
            title: "_SetAsideTitle",
            reasonListLabel: "_Select set aside reason",
            possibleValues: possibleValues.join("\n"),
            currentReason: currentReason,
            currentComment: Controls.SetAsideComment__.GetValue(),
            ignoreNone: true,
            onClickOk: function (result) {
                Data.SetValue("SetAsideReason__", result.reason);
                Data.SetValue("SetAsideComment__", result.comment ? result.comment : "");
                ProcessInstance.Approve("setAside");
            }
        });
    },
    DispatchAttachments: function () {
        if (Attach.GetNbAttach() > 1) {
            g_panes = [];
            g_buttons = [];
            SetupDispatching();
            for (let key in Controls) {
                if (Controls.hasOwnProperty(key)) {
                    let control = Controls[key];
                    if (typeof control.GetType === "function" && control.GetType() === "PanelData" && control.IsVisible()) {
                        g_panes.push(control);
                        control.Hide(true);
                    }
                    else if (typeof control.GetType === "function" && control.GetType() === "SubmitButton" && control.IsVisible()) {
                        g_buttons.push(control);
                        control.Hide(true);
                    }
                }
            }
            Controls.Dispatch_OK.Hide(false);
            Controls.Dispatch_Cancel.Hide(false);
            Controls.Dispatch_pane.SetHelpId("3012");
            Controls.Dispatch_pane.Hide(false);
        }
        else {
            Popup.Alert("You must have a least one document to dispatch.", true, null, "Error");
        }
    },
    DispatchCancel: function () {
        for (let i = 0; i < g_panes.length; i++) {
            g_panes[i].Hide(false);
        }
        for (let i = 0; i < g_buttons.length; i++) {
            g_buttons[i].Hide(false);
        }
        Controls.Dispatch_pane.Hide(true);
        Controls.Dispatch_OK.Hide(true);
        Controls.Dispatch_Cancel.Hide(true);
    },
    CheckDispatching: function () {
        let table = Data.GetTable("Dispatch_table__");
        let count = table.GetItemCount();
        let bHasAtLeastOnOrder = false;
        let iFirstOrderIndex = -1;
        let iNbDispatchedDocs = 0;
        let iNbIgnoredDocs = 0;
        for (let i = 0; i < count; i++) {
            let item = table.GetItem(i);
            if (item.GetValue("Action__") === "SEPARATE") {
                bHasAtLeastOnOrder = true;
                if (iFirstOrderIndex === -1) {
                    iFirstOrderIndex = i;
                }
            }
            else if (item.GetValue("Action__") === "DISPATCH") {
                iNbDispatchedDocs++;
            }
            else if (item.GetValue("Action__") === "IGNORE") {
                iNbIgnoredDocs++;
            }
        }
        let bCanApprove = true;
        bCanApprove = bCanApprove && bHasAtLeastOnOrder;
        bCanApprove = bCanApprove && !(iFirstOrderIndex === 0 && iNbDispatchedDocs === (count - 1));
        Controls.Dispatch_OK.SetDisabled(!bCanApprove);
    }
};
//#endregion
//#region EDI
// **************************************************************************************************************************
const EDI = {
    Init: function () {
        if (Variable.GetValueAsString("EDIPreprocessing") === "1") {
            Controls.CustomerVendor__.Hide(false);
            Controls.ShiptoVendor__.Hide(false);
            Controls.CustomerVendor__.OnChange = this.HandlerChangeCustomerVendor;
            Controls.ShiptoVendor__.OnChange = this.HandlerChangeShiptoVendor;
        }
        if (ProcessInstance.state >= 100) {
            const ASNViewConfig = {
                tabName: "_Advance Ship Notice Tab",
                viewName: "_Advance Ship Notice View Embedded",
                processOrTableName: "OM - Advance Ship Notice",
                listControl: Controls.ASNView__,
                panelControl: Controls.Advanced_Shipping_Notices_Panel_,
                viewFilteredColumn: "Purchase_order_number_in_ERP__",
                formFieldName: "Document_ERP_ID__"
            };
            const ORDRSPViewConfig = {
                tabName: "_Orders_Confirmations_Tab",
                viewName: "_Orders_Confirmations_View_Embedded",
                processOrTableName: "Order confirmation",
                listControl: Controls.OrderConfirmationsView__,
                panelControl: Controls.Order_Confirmations_Panel,
                viewFilteredColumn: "VendorOrderNumber__",
                formFieldName: "Document_ERP_ID__"
            };
            Lib.SOP.Helpers.EDIPanelEmbeddedView.Init(ASNViewConfig, globalSettingsData.DisplayERPAdvancedShippingNoticeTab__ === "1");
            Lib.SOP.Helpers.EDIPanelEmbeddedView.Init(ORDRSPViewConfig, globalSettingsData.DisplayERPOrderConfirmationsTab__ === "1");
        }
    },
    CheckStatusCode: function (hideWarningDetailsPane) {
        let ediStatusCode = Data.GetValue("EDI_Status_Code__");
        let hideWarningMessages = true;
        if (ediStatusCode) {
            let ediNumber = Data.GetValue("EDI_Number__");
            let ediStatusText = Data.GetValue("EDI_Status_Text__");
            let ediStatusMessage = Variable.GetValueAsString("EDIStatusMessage");
            if (ediStatusMessage) {
                ediStatusMessage = ediStatusMessage.replace(/\f/g, "\r\n");
                Data.SetValue("EDI_Status_Message__", ediStatusMessage);
                Controls.Warning_Messages__.SetText(ediStatusMessage);
                hideWarningMessages = false;
            }
            Controls.Warning_Message__.SetText(Language.Translate("IDOC {0} retrieved from SAP with status", true, ediNumber) + " : " + ediStatusText + " (" + ediStatusCode + ")");
            hideWarningDetailsPane = false;
        }
        Controls.Warning_Messages__.Hide(hideWarningMessages);
        return hideWarningDetailsPane;
    },
    HandlerChangeCustomerVendor: function () {
        let value = this.GetValue();
        if (value) {
            let filter = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual("ExternalPartnerIdentifier__", value), Sys.Helpers.LdapUtil.FilterEqual("PartnerFunction__", "SoldTo"));
            Lib.SOP.Helpers.CallDBQuery(EDI.CallbackChangeCustomerVendor, "SO - External partner identifier mapping__", { attributes: "PartnerNumber__", filter: filter, maxItems: 2 });
        }
    },
    CallbackChangeCustomerVendor: function () {
        let err = this.GetQueryError();
        if (err) {
            Log.Error("Error on CustomerVendor__.OnChange DBQuery", err);
            SoldToInstance.EmptyFields();
        }
        else if (this.GetRecordsCount() !== 1) {
            Log.Warn("Zero or more than one row returned on CustomerVendor__.OnChange DBQuery");
            SoldToInstance.EmptyFields();
        }
        else {
            Controls.CustomerNumber__.SetValue(this.GetQueryValue("PartnerNumber__", 0));
        }
        SoldToInstance.Changed(Controls.CustomerNumber__);
    },
    HandlerChangeShiptoVendor: function () {
        let value = this.GetValue();
        if (value) {
            let filter = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual("ExternalPartnerIdentifier__", value), Sys.Helpers.LdapUtil.FilterEqual("PartnerFunction__", "ShipTo"));
            Lib.SOP.Helpers.CallDBQuery(EDI.CallbackChangeShiptoVendor, "SO - External partner identifier mapping__", { attributes: "PartnerNumber__", filter: filter, maxItems: 2 });
        }
    },
    CallbackChangeShiptoVendor: function () {
        let err = this.GetQueryError();
        if (err) {
            Log.Error("Error on ShiptoVendor__.OnChange DBQuery", err);
            ShipToInstance.EmptyFields();
        }
        else if (this.GetRecordsCount() !== 1) {
            Log.Warn("Zero or more than one row returned on ShiptoVendor__.OnChange DBQuery");
            ShipToInstance.EmptyFields();
        }
        else {
            Controls.ShipToNumber__.SetValue(this.GetQueryValue("PartnerNumber__", 0));
        }
        ShipToInstance.Changed(Controls.ShipToNumber__);
    },
    IsPreAgreedContext: function () {
        let oConfig = Sys.OM.Helpers.GetConfiguration();
        let bIsNSOEnabled = oConfig.EnableNSO === "1";
        let bNSOIsPreAgreed = Lib.SOP.Helpers.IsNSOPreAgreed(oConfig);
        return bIsNSOEnabled && bNSOIsPreAgreed;
    }
};
//#region OracleEBS
// **************************************************************************************************************************
const OracleEBS = {
    PrepareOracleFields: function () {
        function CheckWarehouseShipMethodCombination(data, controlWarehouse, controlShipMethod) {
            let warehouseCode = controlWarehouse.GetValue();
            warehouseCode = warehouseCode ? warehouseCode.trim() : "";
            const warehouseFilter = Sys.Helpers.LdapUtil.FilterEqual("Warehouse_Code__", warehouseCode);
            const shipMethodFilter = UserExit.GetShipMethodFilter(warehouseFilter) || warehouseFilter;
            controlShipMethod.SetFilter(shipMethodFilter.toString());
            Lib.SOP.DataChecks.CheckShipMethod(data, controlWarehouse.GetName(), controlShipMethod.GetName());
        }
        function GetOrgIdSimpleFilter() {
            let orgId = Controls.OrgId__.GetValue();
            return Sys.Helpers.LdapUtil.FilterEqual("OrgId__", orgId);
        }
        let config = Sys.OM.Helpers.GetConfiguration();
        if (Lib.SOP.Helpers.IsOracleEbs()) {
            OracleEBS.SetupOrgIDFieldFromConfig();
            // Line Type ID field setup
            Controls.Product_List__.Line_Type_Id__.Hide(true);
            if (config.DisplayLineType === "1") {
                Controls.Product_List__.LineTypeName__.Hide(false);
            }
            else {
                Controls.Product_List__.LineTypeName__.Hide(true);
            }
            if (g_erpOrderDocument.SetLineTypeFilter) {
                Controls.Product_List__.LineTypeName__.OnBrowse = g_erpOrderDocument.SetLineTypeFilter;
            }
            Controls.Product_List__.LineTypeName__.OnSelectItem = function (item) {
                let id = item.GetValue("Line_type_id__");
                this.GetRow().Line_Type_Id__.SetValue(id);
            };
            Controls.Product_List__.LineTypeName__.OnChange = function () {
                if (this.GetValue() === "") {
                    this.GetRow().Line_Type_Id__.SetValue("");
                }
            };
            // Operating unit field setup
            OracleEBS.SetupOrgIDFieldFromConfig();
            Controls.OrgId__.OnChange = function () {
                OracleEBS.ComputeItemValidationOrganization();
                Controls.OrderType__.SetFilter(GetOrgIdSimpleFilter().toString());
                Controls.SalesPerson__.SetFilter(GetOrgIdSimpleFilter().toString());
                Controls.WarehouseCode__.SetFilter(GetOrgIdSimpleFilter().toString());
                let priceListOrgIdFilter = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual("OrgId__", Controls.OrgId__.GetValue()), Sys.Helpers.LdapUtil.FilterNot(Sys.Helpers.LdapUtil.FilterEqual("OrgId__", "")));
                let priceListFilter = Sys.Helpers.LdapUtil.FilterOr(Sys.Helpers.LdapUtil.FilterEqual("Global_flag__", "Y"), Sys.Helpers.LdapUtil.FilterEqual("Global_flag__", "y"), priceListOrgIdFilter).toString();
                Controls.Product_List__.PriceListLine__.SetFilter(priceListFilter);
                Controls.Price_list__.SetFilter(priceListFilter);
                Controls.SalesPerson__.OnChange();
                Controls.OrderType__.OnChange();
                Controls.WarehouseCode__.OnChange();
                OracleEBS.EmptyLineTypes();
                Bindings.ReactOnOrganizationIDChange();
            };
            // Order Type field setup
            Controls.OrderType__.OnChange = function () {
                if (Controls.OrderType__.GetValue() === "") {
                    Data.SetValue("OrderTypeID__", "");
                }
                OracleEBS.EmptyLineTypes();
            };
            Controls.OrderType__.OnSelectItem = function (item) {
                let id = item.GetValue("TransactionTypeId__");
                Data.SetValue("OrderTypeID__", id);
            };
            if (config.IsOrderTypeMandatory === "1") {
                Controls.OrderType__.SetRequired(true);
            }
            Controls.OrderType__.SetFilter(GetOrgIdSimpleFilter().toString());
            // Warehouse header field setup
            Controls.WarehouseCode__.OnChange = function () {
                if (config.DisplayShippingMethodHeader === "1") {
                    CheckWarehouseShipMethodCombination(Data, Controls.WarehouseCode__, Controls.ShippingMethodCodeHeader__);
                }
                if (!UserExit.DisableOracleDataChecks("CheckWarehouseOrgID")) {
                    Lib.SOP.DataChecks.CheckWarehouseOrgID();
                }
            };
            if (Lib.SOP.Helpers.IsOracleEbs() && config.DisplayShippingMethodHeader === "1") {
                Controls.ShippingMethodCodeHeader__.OnChange = function () {
                    Lib.SOP.DataChecks.CheckShipMethod(Data, "WarehouseCode__", "ShippingMethodCodeHeader__");
                };
            }
            Controls.WarehouseCode__.SetFilter(GetOrgIdSimpleFilter().toString());
            // Warehouse items field setup
            Controls.Product_List__.WarehouseCodeItem__.OnChange = function () {
                if (config.DisplayShippingMethodLines === "1") {
                    let control = this;
                    let row = control.GetRow();
                    let item = control.GetItem();
                    if (row && item) {
                        CheckWarehouseShipMethodCombination(item, control, row.ShippingMethodCodeLine__);
                    }
                }
                if (!UserExit.DisableOracleDataChecks("CheckLineItemWarehouse")) {
                    Lib.SOP.DataChecks.LineItemCheckWarehouse();
                }
            };
            if (g_erpOrderDocument.SetWarehouseCodeItemFilter) {
                Controls.Product_List__.WarehouseCodeItem__.OnBrowse = function () {
                    if (Controls.Product_List__.WarehouseCodeItem__.GetFilter()) {
                        return null;
                    }
                    g_erpOrderDocument.SetWarehouseCodeItemFilter.apply(this);
                    return false;
                };
            }
            // Sales person
            Controls.SalesRep_Id__.Hide(true);
            if (config.ShowSalesPerson === "1") {
                Controls.SalesPerson__.Hide(false);
                Controls.Ligne_d_espacement__.Hide(false);
                Controls.SalesPerson__.SetFilter(GetOrgIdSimpleFilter().toString());
            }
            else {
                Controls.SalesPerson__.Hide(true);
                Controls.Ligne_d_espacement__.Hide(true);
            }
            Controls.SalesPerson__.OnChange = function () {
                let filter = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual("Name__", Controls.SalesPerson__.GetValue()), Sys.Helpers.LdapUtil.FilterEqual("OrgId__", Controls.OrgId__.GetValue()));
                Lib.SOP.Helpers.CallDBQuery(function (queryResult) {
                    let queryValue = queryResult ? queryResult : this.GetQueryValue();
                    if (queryValue.Records.length > 0) {
                        let s = this.GetQueryValue("SalesrepId__", 0);
                        Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "SalesRep_Id__", s, this.GetQueryTable());
                    }
                    else {
                        Data.SetValue("SalesPerson__", "");
                        Data.SetValue("SalesRep_Id__", "");
                    }
                }, "SO - SalesPerson__", { filter: filter });
            };
            // Price list setup
            Controls.PriceList_Id__.Hide(true);
            let priceListFilter = Sys.Helpers.LdapUtil.FilterOr(Sys.Helpers.LdapUtil.FilterEqual("Global_flag__", "Y"), Sys.Helpers.LdapUtil.FilterEqual("Global_flag__", "y"), Sys.Helpers.LdapUtil.FilterEqual("OrgId__", Controls.OrgId__.GetValue())).toString();
            if (config.ShowPriceList === "1") {
                Controls.Price_list__.Hide(false);
                Controls.Price_list__.SetFilter(priceListFilter);
            }
            else {
                Controls.Price_list__.Hide(true);
            }
            Controls.Price_list__.OnSelectItem = function (item) {
                let id = item.GetValue("List_header_id__");
                Data.SetValue("PriceList_Id__", id);
            };
            Controls.Price_list__.OnChange = function () {
                if (Controls.Price_list__.GetValue() === "") {
                    Data.SetValue("PriceList_Id__", "");
                }
            };
            // Price list line setup
            Controls.Product_List__.PriceListLine_Id__.Hide(true);
            if (config.ShowPriceListForLines === "1") {
                Controls.Product_List__.PriceListLine__.Hide(false);
                Controls.Product_List__.PriceListLine__.SetFilter(priceListFilter);
            }
            else {
                Controls.Product_List__.PriceListLine__.Hide(true);
            }
            Controls.Product_List__.PriceListLine__.OnSelectItem = function (item) {
                let id = item.GetValue("List_header_id__");
                this.GetRow().PriceListLine_Id__.SetValue(id);
            };
            Controls.Product_List__.PriceListLine__.OnChange = function () {
                if (this.GetValue() === "") {
                    this.GetRow().PriceListLine_Id__.SetValue("");
                }
            };
            // Currency field setup
            if (config.DisplayCurrency === "1" && Controls.Currency__.GetValue() === null) {
                Lib.SOP.Helpers.SetValueWithSourceFromConfig(Data, "Currency__", config.DefaultCurrency);
            }
            Controls.WarehouseCode__.SetFilter(GetOrgIdSimpleFilter().toString());
            Controls.WarehouseCode__.OnChange();
            // Other fields setup
            Controls.Product_List__.ItemNumber__.OnSelectItem = Material.OnSelectItem;
            Controls.Product_List__.PriceList__.Hide(true);
            Controls.Sales_Order_Date__.SetRequired(true);
            Controls.Product_List__.ItemNumber__.SetDisplayedColumns(Controls.Product_List__.ItemNumber__.GetDisplayedColumns() + "|Warehouse_Code__");
        }
        else {
            Controls.Product_List__.Line_Type_Id__.Hide(true);
            Controls.Product_List__.LineTypeName__.Hide(true);
            Controls.Product_List__.WarehouseCodeItem__.Hide(true);
            Controls.WarehouseCode__.Hide(true);
            Controls.Product_List__.PriceList__.Hide(true);
            Controls.Product_List__.PriceListLine__.Hide(true);
            Controls.Product_List__.PriceListLine_Id__.Hide(true);
            Controls.PriceList_Id__.Hide(true);
            Controls.Price_list__.Hide(true);
            Controls.Product_List__.Requested_Date__.Hide(true);
            Controls.OrgId__.Hide(true);
            Controls.OrderType__.Hide(true);
            Controls.SalesRep_Id__.Hide(true);
            Controls.SalesPerson__.Hide(true);
            Controls.Ligne_d_espacement__.Hide(true);
        }
        Controls.ShippingMethodCodeHeader__.Hide(config.ERP === "SAP" || config.DisplayShippingMethodHeader !== "1");
        Controls.Product_List__.ShippingMethodCodeLine__.Hide(config.ERP === "SAP" || config.DisplayShippingMethodLines !== "1");
        Controls.PriceCheck.Hide(config.ERP !== "Oracle EBS" || config.OracleDisplayPriceCheckButton === "0");
        Controls.TouchlessErrorPricing__.Hide(config.ERP !== "Oracle EBS" || config.OracleDisplayPriceCheckButton === "0");
        Controls.OraclePostingOptions.Hide(config.ERP !== "Oracle EBS" || config.OracleDisplayPriceCheckButton === "0");
        Controls.Product_List__.TaxCode__.Hide(config.ERP !== "Oracle EBS" || config.DisplayTaxCodeForLines === "0");
    },
    SetupOrgIDFieldFromConfig: function () {
        let config = Sys.OM.Helpers.GetConfiguration();
        if (config.OrgIDList) {
            let lines = config.OrgIDList.trim().split("\n");
            Controls.OrgId__.SetText(config.OrgIDList);
            if (!Data.IsComputed("OrgId__") && !Data.GetChangeType("OrgId__") && !Data.GetConfidenceType("OrgId__")) {
                let defaultOrgID = lines[0].split("=")[0];
                Lib.SOP.Helpers.SetValueWithSourceFromConfig(Data, "OrgId__", defaultOrgID);
            }
            let isReadOnly = lines.length <= 1;
            Controls.OrgId__.SetReadOnly(isReadOnly);
            this.ComputeItemValidationOrganization();
        }
        else {
            Controls.OrgId__.Hide(true);
        }
    },
    EmptyLineTypes: function () {
        let table = Data.GetTable("Product_List__");
        let nbItems = table.GetItemCount();
        for (let i = 0; i < nbItems; i++) {
            let item = table.GetItem(i);
            item.SetValue("Line_Type_Id__", "");
            item.SetValue("LineTypeName__", "");
        }
    },
    ComputeItemValidationOrganization: function () {
        let tableName = "SO - Organizations__";
        let attributes = "ItemValidationOrg__";
        let filter = Sys.Helpers.LdapUtil.FilterEqual("OrgId__", Controls.OrgId__.GetValue());
        Lib.SOP.Helpers.CallDBQuery(this.ComputeItemValidationOrganizationComplete, tableName, { filter: filter, attributes: attributes, maxItems: 100 });
    },
    ComputeItemValidationOrganizationComplete: function () {
        let queryValue = this.GetQueryValue();
        let recordsCount = queryValue.Records ? queryValue.Records.length : 0;
        if (recordsCount > 0) {
            let itm = queryValue.GetQueryValue("ItemValidationOrg__", 0);
            Controls.ItemValidationOrg__.SetValue(itm);
        }
        else {
            Controls.ItemValidationOrg__.SetValue("");
        }
    },
    UpdatePriceList: function () {
        let filterCustomer = Sys.Helpers.LdapUtil.FilterEqual("Number__", Data.GetValue("CustomerNumber__"));
        Lib.SOP.Helpers.CallDBQuery(function (resultCustomer) {
            let priceListId = resultCustomer.GetQueryValue("PriceListId__", 0);
            if (priceListId != null && priceListId !== "") {
                let filterPriceList = Sys.Helpers.LdapUtil.FilterEqual("List_header_id__", priceListId);
                Lib.SOP.Helpers.CallDBQuery(function (resultPriceList) {
                    let priceListId = resultPriceList.GetQueryValue("List_header_id__", 0);
                    let priceListName = resultPriceList.GetQueryValue("Name__", 0);
                    let priceListOrgId = resultPriceList.GetQueryValue("OrgId__", 0);
                    let priceListGlobalFlag = resultPriceList.GetQueryValue("Global_flag__", 0);
                    let isGlobal = priceListGlobalFlag != null ? priceListGlobalFlag.toLowerCase() === "y" : false;
                    let selectedOrgId = Data.GetValue("OrgId__");
                    if (selectedOrgId === priceListOrgId || isGlobal) {
                        let currentlySelectedPriceListName = Data.GetValue("Price_list__");
                        if (currentlySelectedPriceListName !== priceListName) {
                            Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "Price_list__", priceListName, resultPriceList.GetQueryTable());
                            Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "PriceList_Id__", priceListId, resultPriceList.GetQueryTable());
                        }
                    }
                    else {
                        Data.SetValue("Price_list__", "");
                        Data.SetValue("PriceList_Id__", "");
                    }
                }, "SO - PriceLists__", { attributes: "List_header_id__|Name__|OrgId__|Global_flag__", filter: filterPriceList, callbackInstance: this });
            }
            else {
                Data.SetValue("Price_list__", "");
                Data.SetValue("PriceList_Id__", "");
            }
        }, "SO - Customers__", { attributes: "PriceListId__", filter: filterCustomer, callbackInstance: this });
    }
}; //#endregion
const AdditionalPartner = {
    browseTitle: "Additional Partner Selection",
    columns: null,
    control: null,
    dialog: null,
    maxRowCount: 100,
    requestCallback: null,
    rowCountPerPage: 10,
    searchControlFocused: false,
    searchCriteria: null,
    table: null,
    OpenBrowseDialog: function () {
        let control = this;
        let searchAtOpening = true;
        let columns = AdditionalPartner.columns;
        let table = AdditionalPartner.table;
        let searchCriteria = AdditionalPartner.searchCriteria;
        Lib.SOP.SAP.PartnersMapping.GetPartnerFunctionCodeFromTranslated(null, control.GetItem().GetValue("Partner_Function__"), OnPartnerTypeRetrieved, g_sapLanguage);
        function OnPartnerTypeRetrieved(result) {
            let partnerType = result.partnerType;
            switch (partnerType) {
                case "KU":
                    table = Lib.SOP.SAP.Tables.customerTable;
                    break;
                case "LI":
                    table = Lib.SOP.SAP.Tables.vendorTable;
                    break;
                case "AP":
                    table = Lib.SOP.SAP.Tables.contactTable;
                    break;
                case "PE":
                    table = Lib.SOP.SAP.Tables.personnelTable;
                    break;
                default:
                    return null;
            }
            let isCP = control.GetItem().GetValue("Partner_Function__") === "CP";
            let labelName = isCP ? "_First Name" : "Name";
            let labelName2 = isCP ? "_Last Name" : "Name 2";
            /* Column configuration */
            columns = {};
            switch (partnerType) {
                case "AP":
                    columns[table.name] = { id: table.name, label: labelName, type: "STR", width: 200 };
                    columns[table.name2] = { id: table.name2, label: labelName2, type: "STR", width: 200 };
                    columns[table.number] = { id: table.number, label: "Number", type: "STR", width: 100, toFormat: true };
                    if (!isCP) {
                        columns[table.city] = { id: table.city, label: "City", type: "STR", width: 150 };
                        columns[table.phone] = { id: table.phone, label: "Phone", type: "STR", width: 200 };
                    }
                    break;
                case "KU":
                case "LI":
                    columns[table.name] = { id: table.name, label: "Name", type: "STR", width: 200 };
                    columns[table.number] = { id: table.number, label: "Number", type: "STR", width: 100, toFormat: true };
                    columns[table.city] = { id: table.city, label: "City", type: "STR", width: 150 };
                    columns[table.street] = { id: table.street, label: "Street", type: "STR", width: 200 };
                    columns[table.region] = { id: table.region, label: "Region", type: "STR", width: 50 };
                    columns[table.zipCode] = { id: table.zipCode, label: "Postal Code", type: "STR", width: 100 };
                    break;
                case "PE":
                    columns[table.name] = { id: table.name, label: "_First Name", type: "STR", width: 200 };
                    columns[table.lastName] = { id: table.lastName, label: "_Last Name", type: "STR", width: 200 };
                    columns[table.number] = { id: table.number, label: "Number", type: "STR", width: 100, toFormat: true };
                    break;
            }
            /* Search criteria configuration */
            searchCriteria = [];
            switch (partnerType) {
                case "AP":
                    searchCriteria.push({
                        id: table.name,
                        label: labelName,
                        required: false,
                        toUpper: false,
                        visible: true,
                        defaultValue: ""
                    });
                    searchCriteria.push({
                        id: table.name2,
                        label: labelName2,
                        required: false,
                        toUpper: false,
                        visible: true,
                        defaultValue: ""
                    });
                    if (!isCP) {
                        searchCriteria.push({
                            id: table.city,
                            label: "City",
                            required: false,
                            toUpper: false,
                            visible: true,
                            defaultValue: ""
                        });
                    }
                    break;
                case "KU":
                case "LI":
                    searchCriteria.push({
                        id: table.nameUpper,
                        label: "Name",
                        required: false,
                        toUpper: true,
                        visible: true,
                        defaultValue: ""
                    });
                    searchCriteria.push({
                        id: table.city,
                        label: "City",
                        required: false,
                        toUpper: false,
                        visible: true,
                        defaultValue: ""
                    });
                    searchCriteria.push({
                        id: table.region,
                        label: "Region",
                        required: false,
                        toUpper: false,
                        visible: true,
                        defaultValue: ""
                    });
                    searchCriteria.push({
                        id: table.zipCode,
                        label: "Postal Code",
                        required: false,
                        toUpper: false,
                        visible: true,
                        defaultValue: ""
                    });
                    break;
                case "PE":
                    searchCriteria.push({
                        id: table.name,
                        label: "_First Name",
                        required: false,
                        toUpper: false,
                        visible: true,
                        defaultValue: ""
                    });
                    searchCriteria.push({
                        id: table.lastName,
                        label: "_Last Name",
                        required: false,
                        toUpper: false,
                        visible: true,
                        defaultValue: ""
                    });
                    break;
            }
            // Apply user exit customization
            const customConfig = UserExit.CustomizeAdditionalPartnerBrowseConfiguration(partnerType, table, columns, searchCriteria, isCP);
            if (customConfig) {
                table = customConfig.table || table;
                columns = customConfig.columns || columns;
                searchCriteria = customConfig.searchCriteria || searchCriteria;
            }
            Popup.Dialog(AdditionalPartner.browseTitle, control, FillSearchDialog, null, null, HandleSearchDialog);
            return false;
        }
        // Draw and display the partner browse page
        function FillSearchDialog(newDialog) {
            AdditionalPartner.dialog = newDialog;
            BrowseHelper.FillSearchDialog(newDialog, columns, searchCriteria, AdditionalPartner.maxRowCount, AdditionalPartner.rowCountPerPage, "", false);
            if (searchAtOpening) {
                Request();
            }
        }
        // Perform request
        function Request() {
            let extraFilter = null;
            if (control.GetItem().GetValue("Partner_Function__") === "CP") {
                extraFilter = "KUNNR = '" + Sys.Helpers.String.SAP.NormalizeID(Data.GetValue("CustomerNumber__"), 10) + "'";
            }
            Lib.SOP.SAP.Helpers.BrowseSAPRequest(QuerySuccessCallBack, AdditionalPartner.dialog, columns, searchCriteria, table.tableName, AdditionalPartner.maxRowCount, 0, extraFilter);
        }
        // Called when the query is completed
        function QuerySuccessCallBack() {
            ProcessInstance.SetSilentChange(true);
            let callbackResult = this;
            BrowseHelper.CompletedCallBack(AdditionalPartner.dialog, callbackResult);
            let queryValue = callbackResult.GetQueryValue();
            if (!queryValue.Records || queryValue.Records.length === 0 || !AdditionalPartner.dialog) {
                return;
            }
            let table = AdditionalPartner.dialog.GetControl("resultTable");
            if (!table) {
                return;
            }
            table.SetItemCount(queryValue.Records.length);
            for (let iRecord = 0; iRecord < queryValue.Records.length; iRecord++) {
                let item = table.GetItem(iRecord);
                for (let iDef in queryValue.RecordsDefinition) {
                    if (queryValue.RecordsDefinition.hasOwnProperty(iDef)) {
                        let fieldValue = queryValue.GetQueryValue(iDef, iRecord);
                        if (columns[iDef].toFormat) {
                            fieldValue = Lib.SOP.SAP.Helpers.FormatID(fieldValue);
                        }
                        item.SetValue(iDef, fieldValue);
                    }
                }
            }
            BrowseHelper.HideResults(AdditionalPartner.dialog, false);
            ProcessInstance.SetSilentChange(false);
        }
        function HandleSearchDialog(handleDialog, action, event, control, tableItem) {
            AdditionalPartner.searchControlFocused = BrowseHelper
                .HandleSearchDialog(handleDialog, action, event, control, tableItem, AdditionalPartner.searchControlFocused, Request, ReturnSelection);
        }
        // Fill table with results
        function ReturnSelection(parentControl, tableItem) {
            control.SetValue(tableItem[table.number].GetValue());
            Controls.Partners__.Partner_ID__.OnChange.call(control);
            if (AdditionalPartner.dialog) {
                AdditionalPartner.dialog.Cancel();
            }
            control.alreadyCentered = false;
        }
    }
};
//#endregion
//#region Control bindings
// **************************************************************************************************************************
function SetupDispatching() {
    let table = Data.GetTable("Dispatch_table__");
    table.SetItemCount(0);
    let nbAttach = Attach.GetNbAttach();
    for (let i = 0; i < nbAttach; i++) {
        let item = table.AddItem();
        let att = Attach.GetAttach(i);
        let name = att.GetNiceName(i);
        item.SetValue("Number__", i + 1);
        item.SetValue("Name__", name);
        if (i == 0) {
            item.SetValue("Action__", "SEPARATE");
        }
        else {
            item.SetValue("Action__", "DISPATCH");
        }
    }
}
function OnDocumentTypeChange() {
    CheckTenderNumber();
}
function updateFormLabelBasedOnSalesDocumentType() {
    let salesDocumentType = Data.GetValue("SalesDocumentType__");
    let formLabel;
    switch (salesDocumentType) {
        case Lib.SOP.Helpers.SalesDocumentType.QuoteRequest:
            formLabel = "_Quote Request";
            break;
        case Lib.SOP.Helpers.SalesDocumentType.ChangeOrder:
            formLabel = "_Change Order";
            break;
        case Lib.SOP.Helpers.SalesDocumentType.ReturnOrder:
            formLabel = "_Return Order";
            break;
        default: formLabel = "Customer Order Processing";
    }
    Controls.form_header.SetProcessDisplayName(formLabel);
}
function CheckTypeOfDocumentType() {
    updateFormLabelBasedOnSalesDocumentType();
    let config = Sys.OM.Helpers.GetConfiguration();
    let isQuote = false;
    let isChangeOrder = false;
    if (config.ActivateQuotes === "1") {
        isQuote = Data.GetValue("SalesDocumentType__") === Lib.SOP.Helpers.SalesDocumentType.QuoteRequest;
        if (isQuote) {
            Controls.Sales_Order_Details.SetLabel("_Quote Details");
            Controls.Sales_Order_Number__.SetRequired(false);
            Variable.SetValueAsString("DoNotCheckDuplicates", "1");
            if (Data.GetValue("Sales_Order_Number__")) {
                Variable.SetValueAsString("QuotePreviousOrderNumber", Data.GetValue("Sales_Order_Number__"));
                Data.SetValue("Sales_Order_Number__", "");
            }
        }
        else if (!Controls.Sales_Order_Number__.IsRequired()) {
            Controls.Sales_Order_Details.SetLabel("Sales Order Details");
            Controls.Sales_Order_Number__.SetRequired(true);
            Variable.SetValueAsString("DoNotCheckDuplicates", "0");
            if (Variable.GetValueAsString("QuotePreviousOrderNumber")) {
                Data.SetValue("Sales_Order_Number__", Variable.GetValueAsString("QuotePreviousOrderNumber"));
                Variable.SetValueAsString("QuotePreviousOrderNumber", "");
            }
        }
        Controls.Quote_Start_Date__.Hide(!isQuote);
        Controls.Quote_End_Date__.Hide(!isQuote);
        Controls.Quote_End_Date__.SetRequired(isQuote);
        Controls.Sales_Order_Number__.Hide(isQuote);
        Controls.Total__.Hide(isQuote);
        Controls.RunningTotal__.Hide(isQuote);
        Controls.Product_List__.Unit_Price__.Hide(isQuote || config.DisplayUnitPrice === "0");
        Controls.Product_List__.Total__.Hide(isQuote);
        Controls.Product_List__.Pricing_conditions__.Hide(isQuote);
        Controls.Send_confirmation_notification__.Hide(isQuote || config.HandleOrderConfirmations !== "1");
    }
    isChangeOrder = Lib.SOP.Helpers.IsSAP() && Data.GetValue("SalesDocumentType__") === Lib.SOP.Helpers.SalesDocumentType.ChangeOrder;
    let processIsReadOnly = ProcessInstance.isReadOnly || ProcessInstance.state >= 100;
    SalesOrderHeader.UpdateQuotationVisibility();
    Controls.SAPOrderNumber__.Hide(!isChangeOrder);
    Controls.LoadSAPOrderItems__.Hide(!isChangeOrder || processIsReadOnly);
    if (Controls.LoadSAPOrderItems__.IsVisible()) {
        Lib.SOP.SAP.Helpers.SapChangeOrder.ToggleChangeOrderFieldsUI();
    }
    Controls.Product_List__.ChangeOrderLineItemAction__.Hide(!isChangeOrder);
    Controls.Cancel_SAP_Order__.Hide(!isChangeOrder || processIsReadOnly);
    if (!isChangeOrder && Lib.SOP.SAP.Helpers.SapChangeOrder.IsLoadedFromOrder()) {
        Lib.SOP.SAP.Helpers.SapChangeOrder.UnloadOrder();
    }
    // If we switch from change order to an other type, we need to reset the lines
    if (!isChangeOrder && Controls.Product_List__.LineRejectionReason__.IsVisible()) {
        Lib.SOP.SAP.Helpers.SapChangeOrder.CleanLineItems();
    }
    Controls.Product_List__.LineRejectionReason__.Hide(!isChangeOrder);
}
function CheckTenderNumber() {
    let oConfig = Sys.OM.Helpers.GetConfiguration();
    let bIsNSOEnabled = oConfig.EnableNSO === "1";
    let bIsOrderNSO = Lib.SOP.Helpers.isOrderNSO();
    let sHeaderTenderNumber = Data.GetValue("Tender_Number__");
    let bIsNSOPreAgreed = Lib.SOP.Helpers.IsNSOPreAgreed(oConfig);
    let bIsHidden = !bIsNSOEnabled || (!bIsNSOPreAgreed && !bIsOrderNSO);
    Controls.Tender_Number__.Hide(bIsHidden);
    Controls.Product_List__.TenderNumber__.Hide(bIsHidden);
    let bIsRequired = bIsNSOEnabled && bIsNSOPreAgreed && (sHeaderTenderNumber === null || sHeaderTenderNumber === "");
    Controls.Product_List__.TenderNumber__.SetRequired(bIsRequired);
}
function SetContactEmailFromContactLogin(contactLogin, callback = () => { }) {
    Data.SetValue("ContactEmail__", "");
    if (contactLogin) {
        let currentEmail = contactLogin.trim();
        // If invalid email address, we try to find one with the corresponding login
        if (!Lib.SOP.IsValidEmailAddress(currentEmail)) {
            let url = "/Conversation.ashx?Action=GetRecipient&extendSearch=1&login=" + encodeURIComponent(currentEmail);
            let queryCallback = function (request) {
                if (request.status === 200
                    && request.responseJSON
                    && request.responseJSON.errorMessage === "success"
                    && request.responseJSON.recipients
                    && request.responseJSON.recipients.length > 0) {
                    ProcessInstance.SetSilentChange(true);
                    currentEmail = request.responseJSON.recipients[0].emailAddress;
                    Data.SetValue("ContactEmail__", currentEmail);
                    ProcessInstance.SetSilentChange(false);
                }
                callback();
            };
            Query.HTTPQuery({
                type: "internalHttpQuery",
                method: "GET",
                targetURL: url,
                callback: queryCallback
            });
            // Call the callback after the query is done
            return;
        }
        Data.SetValue("ContactEmail__", currentEmail);
    }
    callback();
}
const Bindings = {
    SetSoldtoShiptoReadOnlyIfNeededFromConversation: function (bForce) {
        let bHide = false;
        if (bForce) {
            bHide = true;
        }
        else {
            try {
                let json = Data.GetValue("JsonFromPortal__");
                if (json) {
                    let jsonData = JSON.parse(json);
                    if (jsonData.copoRuidCreatedFromConversation) {
                        bHide = true;
                    }
                }
            }
            catch (_a) {
                Log.Error("there was an error with Json from Portal data");
            }
        }
        if (bHide) {
            Controls.CustomerNumber__.SetReadOnly(true);
            Controls.CustomerName__.SetReadOnly(true);
            Controls.Contact_login__.SetReadOnly(true);
            //Controls.ShipToNumber__.SetReadOnly(true);
            //Controls.ShipToName__.SetReadOnly(true);
        }
    },
    setBusinessEntities: function () {
        Lib.SOP.SoldTo.Initialize(UserExit, SalesOrderHeader, ConversationListHelper, SAPAdditionalPartners, g_erpOrderDocument, OracleEBS, Actions);
        Lib.SOP.ShipTo.Initialize(UserExit, SalesOrderHeader, ConversationListHelper, SAPAdditionalPartners, g_erpOrderDocument);
        if (Lib.SOP.Helpers.IsBrowsePartnersInSAP()) {
            SoldToInstance = Lib.SOP.SoldTo.SpecializeSoldToSAP();
            ShipToInstance = Lib.SOP.ShipTo.SpecializeShipToSAP();
            Material.SetMaterialTable(Lib.SOP.SAP.Tables.materialListTable);
            Material.SetQueryMaterialFunction(Material.QueryMaterialSAP);
        }
        else if (Lib.SOP.Helpers.IsBrowsePartnersInS4HANA()) {
            SoldToInstance = Lib.SOP.SoldTo.SpecializeSoldS4HANA();
            ShipToInstance = Lib.SOP.ShipTo.SpecializeShipToS4HANA();
            Material.SetQueryMaterialFunction(Material.QueryMaterialS4HANA);
        }
        else {
            if (Lib.SOP.Helpers.IsOracleEbs()) {
                SoldToInstance = Lib.SOP.SoldTo.SpecializeSoldToOracle();
                ShipToInstance = Lib.SOP.ShipTo.SpecializedShipToOracle();
                Material.SetQueryMaterialFunction(Material.QueryMaterialOracle);
            }
            else {
                SoldToInstance = Lib.SOP.SoldTo.SpecializeSoldToNotConnected();
                ShipToInstance = Lib.SOP.ShipTo.SpecializeShipToNotConnected();
                Material.SetQueryMaterialFunction(Material.QueryMaterial);
            }
            Material.SetMaterialTable(Lib.SOP.Tables.Materials);
        }
        Lib.SOP.SoldTo.RegisterShipToInstance(ShipToInstance);
        Lib.SOP.ShipTo.RegisterSoldToInstance(SoldToInstance);
    },
    init: function () {
        let config = Sys.OM.Helpers.GetConfiguration();
        // Declare here all events handlers
        Bindings.SetSoldtoShiptoReadOnlyIfNeededFromConversation(false);
        Bindings.setBusinessEntities();
        Controls.Dispatch_attachments.Hide(true);
        Controls.Dispatch_pane.Hide(true);
        Controls.Dispatch_OK.Hide(true);
        Controls.Dispatch_Cancel.Hide(true);
        Data.SetValue("Dispatch_help_text__", Language.Translate("Dispatch_help_tooltip"));
        if (Attach.GetNbAttach() > 1 && config.ManageDocuments === "1") {
            Controls.Dispatch_attachments.Hide(false);
        }
        if (Lib.SOP.Helpers.IsSAP()) {
            // SAP notes
            Controls.Product_List__.Notes__.OnBrowse = Lib.SOP.SAP.Browses.OpenSAPNotesDialog;
            // Pricing conditions
            Controls.Pricing_conditions__.OnBrowse = Lib.SOP.SAP.Browses.PricingConditions.OpenDialog;
            Controls.Product_List__.Pricing_conditions__.OnBrowse = Lib.SOP.SAP.Browses.PricingConditions.OpenDialog;
            Controls.Plant__.OnBrowse = Lib.SOP.SAP.Browses.SAPPlantsDialog.OnBrowse;
            Controls.Product_List__.ItemPlant__.OnBrowse = Lib.SOP.SAP.Browses.SAPPlantsDialog.OnBrowse;
            Controls.Sales_office__.OnBrowse = Lib.SOP.SAP.Browses.SAPSalesOfficeDialog.OnBrowse;
            Controls.Sales_group__.OnBrowse = Lib.SOP.SAP.Browses.SAPSalesGroupDialog.OnBrowse;
            Controls.Delivery_block__.OnBrowse = Lib.SOP.SAP.Browses.SAPDeliveryBlockDialog.OnBrowse;
            Controls.Billing_block__.OnBrowse = Lib.SOP.SAP.Browses.SAPBillingBlockDialog.OnBrowse;
            Controls.Shipping_condition__.OnBrowse = Lib.SOP.SAP.Browses.SAPShippingConditionsDialog.OnBrowse;
            Controls.QuotationNumber__.OnBrowse = Lib.SOP.SAP.Browses.SAPQuotationDialog.OnBrowse;
            Controls.OrderReason__.OnBrowse = Lib.SOP.SAP.Browses.SAPOrderReason.OnBrowse;
            Controls.Product_List__.LineRejectionReason__.OnBrowse = Lib.SOP.SAP.Browses.SAPOrderLineRejection.OnBrowse;
            if (config.DisplayQuotationFields === "1") {
                // OnDeleteItem handler is set below with the UpdateRunningTotal handler
                Lib.SOP.Helpers.AppendHandler(Controls.Product_List__, "OnRefreshRow", Lib.SOP.Quotes.Client.SetProductsTableRowStyle);
            }
            // always show notes browse button
            Controls.Product_List__.Notes__.SetBrowsable(true);
            // always show pricing conditions browse button
            Controls.Pricing_conditions__.SetBrowsable(true);
            Controls.Product_List__.Pricing_conditions__.SetBrowsable(true);
            // units are not required in SAP mode
            Controls.Product_List__.Unit__.SetRequired(false);
            // Change allow values from table
            Controls.CustomerName__.SetAllowTableValuesOnly(false);
            Controls.CustomerNumber__.SetAllowTableValuesOnly(false);
            Controls.ShipToName__.SetAllowTableValuesOnly(false);
            Controls.ShipToNumber__.SetAllowTableValuesOnly(false);
            Controls.Product_List__.ItemNumber__.SetAllowTableValuesOnly(false);
            Controls.Sales_Area__.OnChange = Bindings.ReactOnSalesAreaChange;
            Bindings.SetAutocompleteChoiceListSalesAreaFilterOnSoldToFields();
            //Change Order
            Controls.SAPOrderNumber__.OnBrowse = Lib.SOP.SAP.Browses.ChangeOrder.OpenBrowsePage;
            Controls.LoadSAPOrderItems__.OnClick = Actions.loadOrder;
            Controls.SAPOrderNumber__.OnChange = Lib.SOP.DataChecks.CheckSAPOrderValidity;
            Controls.Cancel_SAP_Order__.OnChange = Lib.SOP.SAP.Helpers.SapChangeOrder.CancelAllLineItems;
            Controls.Product_List__.ChangeOrderLineItemAction__.OnChange = Lib.SOP.SAP.Helpers.SapChangeOrder.OnSelectAction;
            Controls.Product_List__.ContractItemNumber__.OnSetValue = Lib.SOP.Contracts.Client.OnSetContractItemValue;
            Lib.SOP.Helpers.AppendHandler(Controls.Product_List__, "OnAddItem", Lib.SOP.SAP.Helpers.SapChangeOrder.OnNewProductLine);
            Lib.SOP.Helpers.AppendHandler(Controls.Product_List__, "OnRefreshRow", Lib.SOP.SAP.Helpers.SapChangeOrder.OnRefreshProductLine);
            Lib.SOP.Helpers.AppendHandler(Controls.Product_List__, "OnRefreshRow", Lib.SOP.Contracts.Client.OnRefreshProductLine);
            // Additional partners
            if (config.Display_additional_partners === "1") {
                Controls.Partners__.Partner_Function__.OnChange = SAPAdditionalPartners.UpdatePartnerFunctionDescription;
                Controls.Partners__.Partner_Function__.OnBrowse = Lib.SOP.SAP.Browses.AdditionalPartnerFunctionDialog;
                Controls.Partners__.Partner_ID__.OnBrowse = AdditionalPartner.OpenBrowseDialog;
                Controls.Partners__.Partner_ID__.OnChange = SAPAdditionalPartners.UpdatePartnerNameAndAddressInformation;
                Lib.SOP.Helpers.AppendHandler(Controls.Partners__, "OnDeleteItem", SAPAdditionalPartners.RemoveErrorMsgIfPartnerFunctionNowUnique);
                Lib.SOP.Helpers.AppendHandler(Controls.Partners__, "OnRefreshRow", SAPAdditionalPartners.OnRefreshRow);
                if (config.SelectAdditionalPartners === "1") {
                    Controls.Partners__.Selected_partner__.OnChange = SAPAdditionalPartners.SelectPartner;
                }
            }
            Controls.Business_area__.Hide(true);
            Controls.Sales_organization__.Hide(true);
            Controls.Distribution_channel__.Hide(true);
            if (config.DisplayCurrency === "1") {
                Controls.Currency__.SetReadOnly(true);
            }
            if (config.DisplayQuotationFields === "1") {
                Controls.LoadQuotationItems__.OnClick = Actions.loadQuotationAndReplaceOrRestoreOrderItems;
                // OnDeleteItem handler is set below with the UpdateRunningTotal handler
                Lib.SOP.Helpers.AppendHandler(Controls.Product_List__, "OnRefreshRow", Lib.SOP.Quotes.Client.SetProductsTableRowStyle);
                // Quotations
                Controls.QuotationNumber__.OnChange = function () {
                    Lib.SOP.DataChecks.CheckQuotationValidity();
                    SalesOrderHeader.UpdateContractVisibility();
                    SalesOrderHeader.UpdateQuotationVisibility();
                    Actions.loadQuotation();
                };
                Controls.Product_List__.ItemReconciliationNumber__.OnBrowse = Lib.SOP.SAP.Browses.SAPQuotationItemDialog.OnBrowse;
            }
            if (Lib.SOP.Contracts.IsContractFeatureActivated()) {
                Controls.ContractNumber__.OnBrowse = Lib.SOP.SAP.Browses.SAPContractDialog.OnBrowse;
                Controls.ContractNumber__.OnChange = function () {
                    // If the contract number is changed, we need to reload the contract, without suggesting the contract number
                    Actions.loadContract();
                    SalesOrderHeader.UpdateQuotationVisibility();
                };
                Controls.Product_List__.ContractItemNumber__.OnBrowse = Lib.SOP.SAP.Browses.SAPContractItemDialog.OnBrowse;
            }
        }
        else if (Lib.SOP.Helpers.IsERP("SAPS4Cloud") || Lib.SOP.Helpers.IsERP("Asynchronous SAP Integration")) {
            Controls.Sales_Area__.Hide(false);
            Controls.Sales_Area__.OnChange = Bindings.ReactOnSalesAreaChange;
        }
        else {
            Controls.Sales_Area__.Hide(true);
        }
        Controls.Product_List__.OnDeleteItem = function () {
            if (Lib.SOP.Helpers.IsSAP() && config.DisplayQuotationFields === "1") {
                Lib.SOP.Quotes.Client.CheckQuoteItemsRemainOnOrder();
            }
            if (config.DisplayRunningTotal === "1") {
                Lib.SOP.RunningTotal.UpdateRunningTotal();
            }
        };
        Controls.Incoterms1__.OnBrowse = Lib.SOP.SAP.Browses.SAPIncotermsDialog.OnBrowse;
        Controls.Payment_Terms__.OnBrowse = Lib.SOP.SAP.Browses.SAPPaymentTermsDialog.OnBrowse;
        Controls.Product_List__.Payment_Terms__.OnBrowse = Lib.SOP.SAP.Browses.SAPPaymentTermsDialog.OnBrowse;
        Controls.Product_List__.Incoterms1__.OnBrowse = Lib.SOP.SAP.Browses.SAPIncotermsDialog.OnBrowse;
        Controls.Product_List__.ItmCat__.OnBrowse = Lib.SOP.SAP.Browses.SAPItemCategoryDialog.OnBrowse;
        Controls.Sales_Order_Date__.OnChange = SalesOrderHeader.CheckPODate;
        Controls.Due_Date__.OnChange = SalesOrderHeader.CheckDueDate;
        Controls.Total__.OnChange = function () {
            if (config.DisplayQuotationFields === "1") {
                Data.SetWarning("Total__", "");
                Data.SetInfo("Total__", "");
                Controls.Total__.SetImageURL("");
            }
            Lib.SOP.RunningTotal.CompareTotalAndRunningTotalAndSetWarningIfNotMatching();
        };
        let OnDeleteAllLines = function (sButton) {
            if (sButton !== "Yes" || ProcessInstance.state > 70) {
                return;
            }
            Controls.Product_List__.SetItemCount(0);
            Lib.SOP.DataChecks.UpdateRunningTotal();
        };
        Controls.DeleteAllLinesButton__.OnClick = function () {
            Lib.CommonDialog.PopupYesCancel(OnDeleteAllLines, "_DeleteAllLinesTitle", "_DeleteAllLinesMessage", "_Yes", "Cancel");
        };
        Controls.Product_List__.CustomerMaterialId__.OnChange = Items.CustomerMaterial.OnChange;
        if (Controls.Product_List__.ExtractedDescription__) {
            Controls.Product_List__.ExtractedDescription__.OnChange = Items.CustomerDescription.OnChange;
        }
        Controls.Product_List__.ItemNumber__.OnChange = Material.OnChange;
        //
        if (Lib.SOP.Helpers.IsBrowsePartnersInS4HANA()) {
            Lib.SOP.SAPS4Cloud.BindBrowse(Controls.Product_List__.ItemNumber__, "ItemNumber__");
        }
        else {
            Controls.Product_List__.ItemNumber__.OnBrowse = Material.OpenBrowsePage;
        }
        Controls.Product_List__.Unit__.OnChange = Items.Unit.OnChange;
        Controls.Product_List__.Unit__.OnFocus = Items.Unit.OnFocus;
        Controls.Product_List__.Quantity__.OnChange = Items.Quantity.OnChange;
        Controls.Product_List__.ExtractedQuantity__.OnChange = Items.Quantity.OnChange;
        Controls.Product_List__.CustomerUnit__.OnChange = Items.CustomerUOM.OnChange;
        Controls.Product_List__.CustomerUnit__.OnBrowse = Items.CustomerUOM.OnBrowse;
        Controls.Product_List__.CustomerUnit__.OnFocus = Items.CustomerUOM.OnFocus;
        Controls.Product_List__.CustomerUnit__.OnSelectItem = Items.CustomerUOM.OnSelectItem;
        Controls.Tender_Number__.OnChange = function () {
            let sHeaderTenderNumber = this.GetValue();
            Controls.Product_List__.TenderNumber__.SetRequired(sHeaderTenderNumber === null || sHeaderTenderNumber === "");
        };
        if (config.DisplayUnitPrice === "1") {
            Controls.Product_List__.Unit_Price__.OnChange = Items.UnitPrice.OnChange;
        }
        Controls.Product_List__.Total__.OnChange = Items.Total.OnChange;
        Controls.Send_to_teaching.OnClick = Lib.SOP.Teaching.DialogDisplay;
        Controls.Archived_Send_to_teaching.OnClick = Lib.SOP.Teaching.DialogDisplay;
        Controls.Archive_only.OnClick = ArchiveOnly.DialogDisplay;
        Controls.Archive.OnClick = ArchiveOnly.DialogDisplay;
        Controls.Save.OnClick = Actions.save;
        Controls.Reject.OnClick = Actions.reject;
        Controls.SetAside.OnClick = Actions.setAside;
        Controls.Approve.OnClick = Actions.approve;
        Controls.Dispatch_attachments.OnClick = Actions.DispatchAttachments;
        Controls.Simulate.OnClick = Actions.simulate;
        Controls.Dispatch_OK.OnClick = function () {
            if (Attach.GetNbAttach() > 1) {
                Actions.DispatchCancel();
                ProcessInstance.Approve("DispatchAttachments");
            }
            else {
                Popup.Alert("You must have a least one document to dispatch.", true, null, "Error");
            }
        };
        Controls.Extract_from_spreadsheet__.OnClick = ShowAskForMappingDialog;
        Controls.Import_from_clipboard__.OnClick = ShowWarningCsvReprocess;
        function OnClickOnRefreshRowHandler(row) {
            Actions.CheckDispatching();
        }
        Controls.Dispatch_table__.OnClick = OnClickOnRefreshRowHandler;
        Controls.Dispatch_table__.OnRefreshRow = OnClickOnRefreshRowHandler;
        Controls.Dispatch_Cancel.OnClick = function () {
            Actions.DispatchCancel();
        };
        Controls.PriceCheck.OnClick = Actions.priceCheck;
        Controls.ShowParameters__.OnClick = ParameterDetails.onClick;
        Controls.NewConversationMessageWarning__.BindEvent("onClick", Bindings.SetNewMessageConversationAlertToRead);
        Controls.DocumentType__.OnChange = OnDocumentTypeChange;
        Controls.QuantityUoMVisible__.OnChange = UoMToggle.OnShowQuantityUomClick;
        Controls.UnitPriceUoMVisible__.OnChange = UoMToggle.OnShowUnitPriceUomClick;
        Controls.Product_List__.QuantityUoM__.OnChange = function () {
            if (Lib.SOP.QuantityConversion.IsQuantityConversionEnabled()) {
                if (Lib.SOP.UOMConcatenation.OnNumericValueClean(this.GetValue(), this.GetItem(), "ExtractedQuantity__")) {
                    this.GetRow().Quantity__.SetError("");
                    Lib.SOP.QuantityConversion.ConvertQuantity(this.GetItem(), "ExtractedQuantity__");
                }
            }
            else if (Lib.SOP.UOMConcatenation.OnNumericValueClean(this.GetValue(), this.GetItem(), "Quantity__")) {
                this.GetRow().Quantity__.SetError("");
                Controls.Product_List__.Quantity__.OnChange.call(this.GetRow().Quantity__);
            }
        };
        Controls.Product_List__.UnitPriceUoM__.OnChange = function () {
            if (Lib.SOP.UOMConcatenation.OnNumericValueClean(this.GetValue(), this.GetItem(), "Unit_Price__")) {
                this.GetRow().Unit_Price__.SetError("");
                Controls.Product_List__.Unit_Price__.OnChange.call(this.GetRow().Unit_Price__);
            }
        };
        Controls.Contact_login__.OnChange = function () {
            let contactLogin = this.GetValue();
            SetContactEmailFromContactLogin(contactLogin, Lib.SOP.Helpers.SearchForCustomerAndSetOrderConfirmationOption);
        };
        Controls.Sales_Order_Number__.OnChange = function () {
            let salesDocumentType = Data.GetValue("SalesDocumentType__");
            if (salesDocumentType == "ChangeOrder") {
                SalesOrderHeader.RefreshLinkToOrder();
            }
            else if (salesDocumentType == "Order") {
                SalesOrderHeader.RefreshChangeOrdersView();
            }
        };
        Controls.ShowExtractedDescriptionColumn__.OnChange = function () {
            Controls.Product_List__.ExtractedDescription__.Hide(!this.IsChecked());
        };
    },
    ReactOnSalesAreaChange: function () {
        let config = Sys.OM.Helpers.GetConfiguration();
        Lib.SOP.SAP.Helpers.SapOnSalesAreaChanged();
        if (Lib.SOP.Helpers.IsSAP()) {
            if (config.Display_additional_partners === "1") {
                SAPAdditionalPartners.SyncPartnersWithCustNumberAndSalesArea();
            }
            g_erpOrderDocument.RetrieveAndSetCurrencyAndHeaderPaymentTermsAndCompleteDeliveryFlag();
            if (config.Display_default_SAP_texts === "1") {
                Lib.SOP.SAP.Texts.GetSAPTexts(config.DocumentType, SalesOrderHeader.UpdateSAPTextsAndLoadNotesData, null, true);
            }
        }
        Bindings.SetAutocompleteChoiceListSalesAreaFilterOnSoldToFields();
        // Suggest and load the contract if the sales area is changed
        Actions.loadContract(true);
        // Reconcile line items with the quotation if the sales area is changed
        Actions.loadQuotation(false);
    },
    SetAutocompleteChoiceListSalesAreaFilterOnSoldToFields: function () {
        if (Lib.SOP.Helpers.IsSapLocalSalesAreaSearch() || Lib.SOP.Helpers.IsSapBrowseInSap()) {
            let salesArea = Lib.SOP.SAP.Helpers.GetSplitSalesArea();
            UserExit.CustomizeSalesArea(salesArea, false);
            let filterObject = [];
            filterObject[Lib.SOP.Tables.Customers.salesOrganization] = salesArea.salesOrg;
            filterObject[Lib.SOP.Tables.Customers.distributionChannel] = salesArea.distChan;
            filterObject[Lib.SOP.Tables.Customers.businessArea] = salesArea.businessArea;
            let filter = Lib.SOP.Helpers.BuildQueryFilter(filterObject);
            Controls.CustomerName__.SetFilter(filter.toString());
            Controls.CustomerNumber__.SetFilter(filter.toString());
        }
    },
    ReactOnOrganizationIDChange: function () {
        Lib.SOP.DataChecks.OracleDataChecks();
    },
    SetNewMessageConversationAlertToRead: function () {
        Controls.Conversation__.SetNewConversationMessage("0");
        Controls.NewConversationMessageWarning__.Hide();
    }
};
//#endregion
//#region UoM Concatenation (to handle UoM toggles)
const UoMToggle = {
    /**
     * Hides whole feature
     */
    HideUoMConcatenationFeature: function () {
        Controls.QuantityUoMVisible__.Hide(true);
        Controls.Product_List__.QuantityUoM__.Hide(true);
        Controls.UnitPriceUoMVisible__.Hide(true);
        Controls.Product_List__.UnitPriceUoM__.Hide(true);
    },
    /**
     * Hides QuantityUom fields when empty
     */
    HideQuantityUoMWhenNeeded: function () {
        const quantityUOMValue = Controls.Product_List__.GetItem(0).GetValue("QuantityUoM__");
        Controls.QuantityUoMVisible__.SetHelpData(Language.Translate("Displays the Quantity/UoM column. You can capture an area containing a quantity and UoM to automatically fill the Quantity field."), "", "HTML Format");
        if (quantityUOMValue !== "" && quantityUOMValue !== null && quantityUOMValue !== undefined) {
            Controls.QuantityUoMVisible__.Check(true);
        }
        const quantityUomHidden = !Controls.QuantityUoMVisible__.IsChecked();
        Controls.Product_List__.QuantityUoM__.Hide(quantityUomHidden);
    },
    /**
     * Hides UnitPriceUom fields when empty / Hides checkbox when config disabled
     */
    HideUnitPriceUoMWhenNeeeded: function () {
        const unitPriceUOMValue = Controls.Product_List__.GetItem(0).GetValue("UnitPriceUoM__");
        Controls.UnitPriceUoMVisible__.SetHelpData(Language.Translate("Displays the Unit Price/UoM column. You can capture an area containing a unit price and UoM to automatically fill the Unit Price field."), "", "HTML Format");
        if (Sys.OM.Helpers.GetConfiguration().DisplayUnitPrice === "0") {
            Controls.UnitPriceUoMVisible__.Hide(true);
        }
        else if (unitPriceUOMValue !== "" && unitPriceUOMValue !== null && unitPriceUOMValue !== undefined) {
            Controls.UnitPriceUoMVisible__.Check(true);
        }
        const unitPriceUomHidden = !Controls.UnitPriceUoMVisible__.IsChecked();
        Controls.Product_List__.UnitPriceUoM__.Hide(unitPriceUomHidden);
    },
    /**
     * Toggles visibility of Quantity UoM field
     */
    OnShowQuantityUomClick: function () {
        Controls.Product_List__.QuantityUoM__.Hide(!Controls.QuantityUoMVisible__.IsChecked());
    },
    /**
     * Toggles visibility of Unit Price UoM field
     */
    OnShowUnitPriceUomClick: function () {
        Controls.Product_List__.UnitPriceUoM__.Hide(!Controls.UnitPriceUoMVisible__.IsChecked());
    }
};
//#endregion
//#region ERP Ack Management
// **************************************************************************************************************************
let ERPAckMgt = {
    CheckERPAckError: function () {
        Controls.ERPOrderErrors__.Hide(true);
        Controls.Oracle_Order_Errors__.Hide(true);
        if (g_erpackmode) {
            let errorControl = null;
            let errorText = null;
            if (Lib.SOP.Helpers.IsOracleEbs()) {
                errorControl = Controls.Oracle_Order_Errors__;
                errorText = "_Oracle submission returned one or more error reported in the ERP Information panel";
            }
            else {
                errorControl = Controls.ERPOrderErrors__;
                errorText = "_Generic ERP submission returned one or more error reported in the ERP Information panel";
            }
            let hideWarningPane = true;
            let hideWarningDetailsPane = true;
            if (Data.GetValue("Order_Creation_Error__")) {
                Controls.MainWarningMessage__.SetText(Language.Translate(errorText, true));
                Controls.Spacer_line2__.Hide(false);
                Controls.Spacer_line__.Hide(false);
                hideWarningPane = false;
                // force ERP panel to show, explaining the error and the ERP integration
                Controls.ERP_Information_Pane.Hide(false);
                errorControl.Hide(false);
                let htmlErrorMsg = Data.GetValue("Order_Creation_Error__");
                htmlErrorMsg = htmlErrorMsg.replace(/\n/g, "<br>");
                errorControl.SetHTML(htmlErrorMsg);
                Controls.Order_Creation_Error__.Hide(true);
            }
            Controls.MainWarningMessage__.Hide(hideWarningPane);
            Controls.Warning_Message_Pane.Hide(hideWarningPane);
            Controls.Warning_Details_Pane.Hide(hideWarningDetailsPane);
        }
    }
};
//#endregion
//#region NSO
// **************************************************************************************************************************
let OpenPOFHandler = {
    DoOpenPOF: function () {
        function QueryExistingPOF() {
            let options = {
                table: "CDNAME#Pre-agreed order",
                filter: Sys.Helpers.LdapUtil.FilterEqual("SourceRUID", Data.GetValue("RUIDEx")).toString(),
                attributes: ["RuidEx"],
                maxRecords: 1
            };
            return Sys.GenericAPI.PromisedQuery(options);
        }
        function ChooseAction(results) {
            if (results.length > 0 && results[0].RuidEx) {
                Process.OpenMessage(results[0].RuidEx, true);
            }
            else {
                Log.Error("Cannot find PreAgreed form");
            }
        }
        QueryExistingPOF()
            .Then(ChooseAction)
            .Catch(function (err) {
            Log.Error("[OpenPOFHandler/ChooseAction] Unable to retrieve original POF: " + err);
        });
    }
};
Controls.Pre_Agreed_Form.OnClick = OpenPOFHandler.DoOpenPOF;
//#endregion
//#region Synergy
// **************************************************************************************************************************
function CleanHiddenHeaderFieldsForSynergy() {
    let controlsKeys = Object.keys(Controls);
    for (let iKey = 0; iKey < controlsKeys.length; iKey++) {
        let key = controlsKeys[iKey];
        if (Controls[key] && Controls[key].IsVisible && !Controls[key].IsVisible()) {
            let value = Data.GetValue(key);
            if (value && Data.GetComputedValueSource(key) === "Synergy") {
                Data.SetValue(key, "");
                Log.Info("Synergy: Field " + key + " has been cleaned (" + value + ")");
            }
        }
    }
}
function CleanHiddenTableFieldsForSynergy() {
    if (Controls.Product_List__.GetItemCount() === 0) {
        return;
    }
    let firstRow = Controls.Product_List__.GetRow(0);
    let firstRowKeys = Object.keys(firstRow);
    for (let iKey = 0; iKey < firstRowKeys.length; iKey++) {
        let key = firstRowKeys[iKey];
        if (firstRow[key] && firstRow[key].IsVisible && !firstRow[key].IsVisible()) {
            let table = Data.GetTable("Product_List__");
            let count = table.GetItemCount();
            for (let i = 0; i < count; i++) {
                let item = table.GetItem(i);
                let value = item.GetValue(key);
                if (value && item.GetComputedValueSource(key) === "Synergy") {
                    item.SetValue(key, "");
                    Log.Info("Synergy: Field " + key + " has been cleaned (" + value + ")");
                }
            }
        }
    }
}
//#endregion
function CheckPOFVisibility() {
    if (EDI.IsPreAgreedContext() && ProcessInstance.state >= 100 && Data.GetValue("ContainerFlag") > 0) {
        Controls.Pre_Agreed_Form.Hide(false);
    }
    else {
        Controls.Pre_Agreed_Form.Hide(true);
    }
}
function DisableAutolearningTableForSynergy() {
    let JSONIsSynergy = Variable.GetValueAsString("IsSynergy");
    if (JSONIsSynergy && JSON.parse(JSONIsSynergy)) {
        let JSONSynergyFields = Variable.GetValueAsString("SynergyFields");
        if (JSONSynergyFields) {
            let aSynergyFields = JSON.parse(JSONSynergyFields);
            if (aSynergyFields.length > 0) {
                //we disable the AL data generation for ALL Product_List__ cells
                Variable.SetValueAsString("AutolearnTableDisabled", "1");
            }
            let table = Controls.Product_List__;
            let nbItems = table.GetItemCount();
            if (nbItems >= 1) {
                for (let iColumn = 1; iColumn < table.GetColumnCount() + 1; iColumn++) {
                    let columnName = table.GetColumnControl(iColumn).GetName();
                    let fOnChange = function () {
                        Log.Info("OnChange on " + columnName + ": AutolearnTableDisabled=0");
                        Variable.SetValueAsString("AutolearnTableDisabled", "0");
                    };
                    Lib.SOP.Helpers.AppendHandler(Controls.Product_List__[columnName], "OnChange", fOnChange);
                }
            }
        }
    }
}
function SetArchiveAndApproveVisibility() {
    let changeOrder = Data.GetValue("SalesDocumentType__") === Lib.SOP.Helpers.SalesDocumentType.ChangeOrder;
    let readOnly = ProcessInstance.isReadOnly || ProcessInstance.state >= 100;
    let viewOnly = User.profileName === "Order Management View Only Profile";
    let hideApprove = readOnly || viewOnly;
    let hideArchive = !changeOrder || readOnly || viewOnly;
    if (Lib.SOP.Helpers.IsSAP()) {
        let displayApproveInChangeOrder = Sys.OM.Helpers.GetConfiguration().EnableSendingChangeOrdersToSAP === "1";
        hideApprove || (hideApprove = changeOrder && !displayApproveInChangeOrder);
        hideArchive || (hideArchive = changeOrder && displayApproveInChangeOrder);
        Controls.Simulate.Hide(hideApprove);
    }
    Controls.Approve.Hide(hideApprove);
    Controls.Archive.Hide(hideArchive);
    if (changeOrder) {
        Data.SetError("Sales_Order_Number__", "");
    }
}
function InitSetAsideReasonsFromConfig(config) {
    let possibleValues = [];
    if (config.SetAsideReasons) {
        possibleValues = config.SetAsideReasons.split("\n");
    }
    else {
        possibleValues = Controls.SetAsideReason__.GetAvailableValues();
    }
    possibleValues = possibleValues.filter(value => value.indexOf("=") > -1);
    let currentChoice = Data.GetValue("SetAsideReason__");
    Controls.SetAsideReason__.SetAvailableValues(possibleValues);
    //HACK: Reset to the previous value because SetAvailableValues set the value
    Data.SetValue("SetAsideReason__", currentChoice);
}
function InitRejectReasonsFromConfig(config) {
    let possibleValues = [];
    if (config.RejectReasons) {
        possibleValues = config.RejectReasons.split("\n");
    }
    else {
        possibleValues = Controls.RejectReason__.GetText().split("\n");
    }
    possibleValues = possibleValues.filter(value => value.indexOf("=") > -1);
    let currentChoice = Data.GetValue("RejectReason__");
    Controls.RejectReason__.SetAvailableValues(possibleValues);
    //HACK: Reset to the previous value because SetAvailableValues set the value
    Data.SetValue("RejectReason__", currentChoice);
}
function InitExtractionsInformationsPane() {
    Controls.Extraction_Informations.Hide(!(Variable.GetValueAsString("DisplayExtractionInformationsPane") === "1"));
}
function InitSnackbar() {
    let changeOrder = Data.GetValue("SalesDocumentType__") === Lib.SOP.Helpers.SalesDocumentType.ChangeOrder;
    if (changeOrder && ProcessInstance.state <= 70) {
        {
            Popup.Snackbar({
                message: Language.Translate("_SnackbarWarningChangeOrder"),
                timeout: 3000,
                status: "warning",
                icon: "fa fa-exclamation-circle",
                closable: true
            });
        }
    }
}
function ShowAskForMappingDialog() {
    Sys.Spreadsheets.AskForMappingPopup.ShowDialog(Data.GetValue("CustomerNumber__"), Controls.Product_List__, "Customer Order Processing");
}
function ShowWarningCsvReprocess() {
    Popup.Confirm("_Csv_Non_Extracted_data_loss", "warn", ShowImportFromClipboardDialog, null, "_Csv_Non_Extracted_data_loss_title");
}
function ShowImportFromClipboardDialog() {
    function fill(mappings) {
        return;
    }
    Sys.Spreadsheets.PastePopup.ShowDialog(Data.GetValue("CustomerNumber__"), Controls.Product_List__, "Customer Order Processing", fill, true);
}
//#region Entry point
// **************************************************************************************************************************
function EntryPoint() {
    let config = Sys.OM.Helpers.GetConfiguration();
    Process.SetHelpId(3018);
    SetKeywordInfo();
    g_erpackmode = (Lib.SOP.Helpers.IsOracleEbs() || config.ERP === "Generic") && config.EnableERPIntegrationDelay === "1";
    // set to SAP to when using the Generic package with SAP
    g_erpOrderDocument = Lib.SOP.ERP.InitializeERPManager(config.ERP);
    if (UserExit.OnHTMLScriptBegin().stop) {
        return;
    }
    InitSetAsideReasonsFromConfig(config);
    InitRejectReasonsFromConfig(config);
    Data.SetValue("ERP__", config.ERP);
    Bindings.init();
    OracleEBS.PrepareOracleFields();
    Lib.SOP.Teaching.Init();
    SalesOrderHeader.Init();
    ConversationListHelper.Init();
    Shipping.Init();
    SAPAdditionalPartners.Init();
    if (Sys.OM.Helpers.GetConfiguration().EnableCsvExtraction === "1") {
        // Init Spreadsheets
        Sys.Spreadsheets.showHiddenFields = true;
        Sys.Spreadsheets.helpId = "3067";
        // Show mapping popup if needed
        Sys.Spreadsheets.AskForMappingPopup.TryShowDialog(Data.GetValue("CustomerNumber__"), Controls.Product_List__, "Customer Order Processing");
    }
    DuplicatesCheck.doCheck();
    // Hide or not some fields depending of debug and/or SAP mode
    ProcessState.HideControls();
    // Execute some actions when the process is readonly
    ProcessState.ReadOnly();
    if (Lib.SOP.Helpers.IsNSOChangeOrderOrCancellationOrConfirmation()) {
        Controls.Archive_only.Hide(true);
        Controls.SetAside.Hide(true);
        Controls.Split.Hide(true);
        Controls.Send_to_teaching.Hide(true);
        Controls.Archived_Send_to_teaching.Hide(true);
        Controls.Dispatch_attachments.Hide(true);
        Controls.Approve.SetAction("none");
        Controls.Approve.SetLabel("Archive only...");
        Controls.Approve.OnClick = ArchiveOnly.DialogDisplay;
    }
    if (Controls.hasOwnProperty("Send_email")) // Hide button in older versions of the layout.
     {
        Controls["Send_email"].Hide(true);
    }
    // Setup the document type combobox
    ProcessState.SetupSalesDocumentTypeField();
    ProcessState.SetupDocumentTypeField();
    if (Lib.SOP.Helpers.IsERP("SAPS4Cloud") || Lib.SOP.Helpers.IsERP("Asynchronous SAP Integration")) {
        Lib.SOP.SAP.Helpers.CompleteSalesAreaFromConfig(config);
    }
    CheckTenderNumber();
    CheckPOFVisibility();
    CheckTypeOfDocumentType();
    //autolearn on soldto / shipto address
    SalesOrderHeader.SetSoldToShipToPlaceholders();
    Controls.ToggleSoldToAddress__.OnClick = SalesOrderHeader.OnToggleSoldToAddress;
    SalesOrderHeader.HideSoldToAddress(!Controls.SoldToAddress__.GetValue());
    Controls.ToggleShipToAddress__.OnClick = SalesOrderHeader.OnToggleShipToAddress;
    SalesOrderHeader.HideShipToAddress(!Controls.ShipToAddress__.GetValue());
    Controls.ShipToAddress__.OnChange = SalesOrderHeader.OnChangeShipToAddress;
    // Display SAP Post Popup; at the moment it works only with sap and SAPS4Cloud
    Lib.SOP.Helpers.GetOrder().ShowInformation();
    if (Lib.SOP.Helpers.IsSAP()) {
        let isChangeOrder = Controls.SalesDocumentType__.GetSelectedOption() == "ChangeOrder";
        Controls.ERP_Information_Pane.SetLabel(Language.Translate("SAP Information", false));
        let documentErpIdLabelKey = Data.GetValue("IsLineItemSplitOrder__")
            ? "This document is associated with SAP Document IDs"
            : "This document is associated with SAP Document ID";
        Controls.Document_ERP_ID__.SetLabel(Language.Translate(documentErpIdLabelKey, false));
        // Fill sales area
        Lib.SOP.SAP.Helpers.CompleteSalesAreaFromConfig(config);
        if (config.DisplayQuotationFields === "1") {
            if (ProcessInstance.state < 100) {
                Lib.SOP.DataChecks.CheckQuotationValidity();
                Lib.SOP.Quotes.Client.ToggleQuoteFieldsUI();
            }
            Lib.SOP.Quotes.Client.SetProductsTableStyle();
            Lib.SOP.Quotes.Client.ShowQuoteTotalAndCheckValue();
        }
        if (isChangeOrder) {
            Lib.SOP.SAP.Helpers.SapChangeOrder.SetChangeOrderLineItemsUI();
        }
        else if (!Data.GetValue("QuotationNumber__")) // Contracts and quotes are exclusive. If a quote is present, the contract is not.
         {
            Lib.SOP.Contracts.Client.SetProductsTableStyle();
        }
        Lib.SOP.DataChecks.CheckSAPOrderValidity();
        Controls.SAPTextsTable__.SetReadOnly(config.Allow_SAP_texts_modifications === "0");
        Controls.SAPTextsTable__.OnAddItem = SalesOrderHeader.OnAddSAPText;
        Controls.SAPTextsTable__.OnDeleteItem = SalesOrderHeader.OnDeleteSAPText;
        Controls.SAPTextsTable__.OnRefreshRow = SalesOrderHeader.SAPTextOnRefreshRow;
        Controls.ToggleSAPTextPanel__.OnClick = SalesOrderHeader.OnToggleSAPTextPanel;
        if (config.Display_default_SAP_texts === "1" || config.Allow_SAP_texts_modifications === "1") {
            if (ProcessInstance.state < 100) {
                if (!Data.GetValue("NotesData__")) {
                    Lib.SOP.SAP.Texts.GetSAPTexts(config.DocumentType, SalesOrderHeader.UpdateSAPTextsAndLoadNotesData, null, true);
                }
                else {
                    Lib.SOP.SAP.Texts.GetSAPTexts(config.DocumentType, SalesOrderHeader.UpdateSAPTextsCombo, null, true);
                }
            }
            else {
                SalesOrderHeader.UpdateSAPTextsCombo();
            }
        }
    }
    Items.Unit.InitFieldForDefaultUOM();
    DisableAutolearningTableForSynergy();
    if (Lib.SOP.Helpers.IsSAP()) {
        Lib.SOP.SAP.Helpers.GetCurrentSAPConnectionLanguage(FinalizeLoad);
    }
    else {
        FinalizeLoad(null);
    }
    if (Data.GetValue("EDI_Format__") === "NSO") {
        let err = Data.GetWarning("EDIWorkflowID__");
        if (err) {
            Popup.Alert(err, false, null, "NSORelatedOrderExistsTitle");
        }
    }
    InitSnackbar();
    InitExtractionsInformationsPane();
    SalesOrderHeader.UpdateChangeOrdersViewVisibility();
    UpdateFieldsFromSalesForceCase();
    UpdatePaymentFieldsVisibility();
    UpdateCheckboxToShowExtractedDescriptionInitialState();
    Sys.OM.GptPlugins.DigitalAssistant.GetDigitalAssistantParams().then((digitalAssistantParams) => {
        Process.SetDigitalAssistant(true, digitalAssistantParams);
    });
}
function UpdateCheckboxToShowExtractedDescriptionInitialState() {
    let config = Sys.OM.Helpers.GetConfiguration();
    if (config.AllowToShowExtractedDescription === "1") {
        Controls.ShowExtractedDescriptionColumn__.Hide(false);
        const extractedDescriptionExists = IsExtractedDesciptionFilled();
        Controls.ShowExtractedDescriptionColumn__.Check(extractedDescriptionExists);
    }
    else {
        Controls.ShowExtractedDescriptionColumn__.Hide(true);
    }
}
function IsExtractedDesciptionFilled() {
    // Verify if the extracted description field is actually filled and show it if it is
    const table = Data.GetTable("Product_List__");
    const nbItems = table.GetItemCount();
    for (let index = 0; index < nbItems; index++) {
        const item = table.GetItem(index);
        if (item.GetValue("ExtractedDescription__")) {
            return true;
        }
    }
    return false;
}
function UpdatePaymentFieldsVisibility() {
    if (!isPaymentEnabled() || !Controls.Transaction_id__.GetValue()) {
        return;
    }
    Controls.Payment_pane.Hide(false);
    Controls.Payment_status__.Hide(false);
    Controls.Payment_date__.Hide(false);
    Controls.Card_number__.Hide(false);
    Controls.Card_type__.Hide(false);
    Controls.Card_brand__.Hide(false);
    Controls.Card_holder__.Hide(false);
    Controls.Card_expiration__.Hide(false);
    Controls.Transaction_id__.Hide(false);
    if (Data.GetValue("Paid_amount__")) {
        Data.SetValue("Payment_status__", Lib.SOP.Payment.PaymentStatus.PARTIALLYPAID);
        Controls.Down_payment_percentage__.Hide(false);
        Controls.Down_payment_percentage__.AddSurroundingText("%");
        Controls.Paid_amount__.Hide(false);
    }
}
function isPaymentEnabled() {
    const formConfig = Sys.OM.Helpers.GetConfiguration();
    return formConfig.EnableCatalogPrices === "1" && formConfig.PortalIntegrationEnabled === "1" && formConfig.Enable_Portal_Payment === "1";
}
function CleanSynergyFields() {
    // Avoid to learn hidden fields for Synergy
    if (Variable.GetValueAsString("SynergyTemplateID")) {
        CleanHiddenHeaderFieldsForSynergy();
        CleanHiddenTableFieldsForSynergy();
    }
}
function UpdateFieldsFromSalesForceCase() {
    if (Data.GetValue("Case_URL_Saved__") != null) {
        Controls.SalesForce.Hide(false);
        Controls.Case_URL__.SetURL(Data.GetValue("Case_URL_Saved__"));
        if (Data.GetValue("Case_Number__") != null) {
            Controls.Case_Number__.Hide(false);
        }
        else {
            Controls.Case_Number__.Hide(true);
        }
    }
    else {
        Controls.SalesForce.Hide(true);
    }
}
function FinalizeLoad(sapConnexionLanguage) {
    if (Lib.SOP.Helpers.IsSAP()) {
        g_sapLanguage = sapConnexionLanguage;
        Log.Info("SAP language is " + g_sapLanguage);
    }
    EDI.Init();
    ERPAckMgt.CheckERPAckError();
    UserExit.OnHTMLScriptEnd();
    CleanSynergyFields();
}
function Start() {
    Lib.SOP.Configuration.initializeConfigurationClient(OnConfigLoaded);
}
function OnConfigLoaded(config) {
    Log.Info("Configuration type loaded : " + config.Configuration_Type);
    Log.Info("archiving duration : " + config.ArchivingDuration);
    Log.Info("portal archiving duration : " + config.PortalArchivingDuration);
    Sys.Helpers.EnableSmartSilentChange();
    ProcessInstance.SetSilentChange(true);
    Lib.SOP.Configuration.saveConfigAsExternalVars(config);
    Sys.OM.Helpers.SetConfiguration(config);
    Lib.SOP.MaterialItems.Material.SetFilter();
    let JSONDuplicateFieldsUnrecognized = Variable.GetValueAsString("DuplicateFieldsUnrecognized");
    if (JSONDuplicateFieldsUnrecognized) {
        let aDuplicateFieldsUnrecognized = JSON.parse(JSONDuplicateFieldsUnrecognized);
        if (aDuplicateFieldsUnrecognized.length != 0) {
            let sDuplicateFieldsUnrecognized = Language.Translate("_ErrorDuplicateFieldsUnrecognized") + ":\n";
            for (let i in aDuplicateFieldsUnrecognized) {
                sDuplicateFieldsUnrecognized += aDuplicateFieldsUnrecognized[i] + "\n";
            }
            Popup.Alert(sDuplicateFieldsUnrecognized, false, null, "Warning message title");
        }
    }
    EntryPoint();
    // When put in hideSAPSpecificControls these commands do not work properly
    if (Lib.SOP.Helpers.IsERP("SAP")) {
        Controls.SAPTextsTable__.DisableMenuAddLine(Sys.OM.Helpers.GetConfiguration().Allow_SAP_texts_modifications === "0");
        Controls.SAPTextsTable__.DisableMenuInsertLine(Sys.OM.Helpers.GetConfiguration().Allow_SAP_texts_modifications === "0");
    }
    ProcessInstance.SetSilentChange(false);
}
function SetKeywordInfo() {
    if (Variable.GetValueAsString("EmailSubjectKeyword")) {
        Data.SetInfo("Business_Priority__", "Found Keyword: {0} in e-mail subject", Variable.GetValueAsString("EmailSubjectKeyword"));
    }
    else if (Variable.GetValueAsString("EmailBodyKeyword")) {
        Data.SetInfo("Business_Priority__", "Found Keyword: {0} in e-mail body", Variable.GetValueAsString("EmailBodyKeyword"));
    }
    else if (Variable.GetValueAsString("EmailFlaggedImportant")) {
        Data.SetInfo("Business_Priority__", "Email was flagged with high importance");
    }
    else if (Variable.GetValueAsString("AttachmentKeyword")) {
        Data.SetInfo("Business_Priority__", "Found Keyword: {0} in attachment", Variable.GetValueAsString("AttachmentKeyword"));
    }
}
//#endregion
let globalSettingsData = {};
Sys.OM.GlobalSettings.GetGlobalSettings(function (globalSettings) {
    globalSettingsData = globalSettings;
    Start();
});
//# sourceMappingURL=customscript.js.map