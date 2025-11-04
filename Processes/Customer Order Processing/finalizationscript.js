///#GLOBALS Lib Sys
//#region CONFIGURATION
/**************************************** Beginning of User Exits ****************************************/
var CustomerOrderProcessing;
(function (CustomerOrderProcessing) {
    let Finalization;
    (function (Finalization) {
        Finalization.UserExit = {
            OnPublishingBegin: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Finalization.OnPublishingBegin") || {};
            },
            SetFieldsToExcludeForPublishing: function (fieldsToExclude) {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Finalization.SetFieldsToExcludeForPublishing", fieldsToExclude) || fieldsToExclude;
            },
            SetTableFieldsToExcludeForPublishing: function (tableOptions) {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Finalization.SetTableFieldsToExcludeForPublishing", tableOptions) || tableOptions;
            },
            KeepEmptyFieldsWhenPublishing: function () {
                return !!Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Finalization.KeepEmptyFieldsWhenPublishing");
            },
            SetPublishingAttachmentVars: function (attachVars) {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Finalization.SetPublishingAttachmentVars", attachVars);
            },
            OnFinalizationScriptBegin: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Finalization.OnFinalizationScriptBegin") || {};
            },
            OnFinalizationScriptEnd: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Finalization.OnFinalizationScriptEnd");
            },
            CustomizeSaveSoldToNumberMappingQueryFilter: function (filter) {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Finalization.CustomizeSaveSoldToNumberMappingQueryFilter", filter) || filter;
            },
            GetEDIOutputEncoding: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Finalization.GetEDIOutputEncoding");
            },
            GetFieldValuesMapping: function (documentErpId) {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Finalization.GetFieldValuesMapping", documentErpId);
            },
            CustomizeXMLOutput: function (tempOrderXml) {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Finalization.CustomizeXMLOutput", tempOrderXml) || tempOrderXml;
            },
            CustomizeEDIOutput: function (tempOrderEdi, ediFormat) {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Finalization.CustomizeEDIOutput", tempOrderEdi, ediFormat) || tempOrderEdi;
            },
            OnSaveShipToNumberMapping: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Finalization.OnSaveShipToNumberMapping") || {};
            },
            OnSaveSoldToNumberMapping: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Finalization.OnSaveSoldToNumberMapping") || {};
            },
            OnSaveMaterialMapping: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Finalization.OnSaveMaterialMapping") || {};
            },
            OnSaveExternalIdentifierMapping: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Finalization.OnSaveExternalIdentifierMapping") || {};
            },
            CreatePublishingProcessInstanceOrTransport: function (asChild) {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Finalization.CreatePublishingProcessInstanceOrTransport", asChild) || null;
            },
            AttachOutputFile: function (transport, tempOrderOutputFile, finalXmlOutputName, lineItemSplitArray, indexSplit) {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Finalization.AttachOutputFile", transport, tempOrderOutputFile, finalXmlOutputName, lineItemSplitArray, indexSplit) || {};
            },
            OnSetAnnotationParams: function (annotationParams) {
                Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Finalization.OnSetAnnotationParams", annotationParams);
            },
            CustomizePublishingNodeMappings: function (nodeMappings) {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Finalization.CustomizePublishingNodeMappings", nodeMappings) || nodeMappings;
            },
            GetLineItemsTableName: function (isServer) {
                let tableName = Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Common.GetLineItemsTableName", isServer);
                return (typeof tableName === "string" ? tableName : "Product_List__");
            }
        };
    })(Finalization = CustomerOrderProcessing.Finalization || (CustomerOrderProcessing.Finalization = {}));
})(CustomerOrderProcessing || (CustomerOrderProcessing = {}));
let g_settings;
const annotationParams = {
    FlattenAnnotations: false, // false: do not flatten annotations, true: flatten annotations
    FlattenNotes: false, // false: do not flatten notes, true: flatten notes
    OnlyKeepFlattenDocument: false, // false: do not discard original document, true: keep just annotated document
    DiscardedAttach: [".eml"] // array of attachment file extensions to discard
};
function computeSettings() {
    let jsonDataFromSplit = null;
    try {
        if (Lib.SOP.Helpers.IsSplitOrder()) {
            jsonDataFromSplit = JSON.parse(Lib.SOP.Helpers.GetJsonSplitData());
        }
    }
    catch (e) {
        Log.Error("JsonFromSplitOrder__ cannot be parsed : " + e.message);
        jsonDataFromSplit = null;
    }
    g_settings =
        {
            SAPMode: Lib.SOP.Helpers.IsERP("SAP"),
            SAPS4CloudMode: Lib.SOP.Helpers.IsERP("SAPS4Cloud"),
            // publish to SFTP/AS2 depending on the variable "Publishing"
            publishing: Sys.OM.Helpers.GetConfiguration().Publishing,
            /******* FLATTEN ANNOTATIONS *******/
            // false: do not flatten annotations, true: flatten annotations (see Annotations.FlattenAnnotations in Lib_SOP_Parameters customization library)
            FlattenAnnotations: GetAnnotationsParam("FlattenAnnotations"),
            // false: do not flatten notes, true: flatten notes (see Annotations.FlattenNotes in Lib_SOP_Parameters customization library)
            FlattenNotes: GetAnnotationsParam("FlattenNotes"),
            // false: do not discard original document, true: keep just annotated document (see Annotations.OnlyKeepFlattenDocument in Lib_SOP_Parameters customization library)
            OnlyKeepFlattenDocument: GetAnnotationsParam("OnlyKeepFlattenDocument"),
            // array of attachment file extensions to discard (see Annotations.DiscardedAttach in Lib_SOP_Parameters customization library)
            DiscardedAttach: GetAnnotationsExtensionsParam("DiscardedAttach", [".eml"]),
            /******* COMMON PUBLISHING SETTINGS *******/
            // XML file endentation: true (indented), false (raw)
            xmlIndent: true,
            /******* FTP PUBLISHING *******/
            ftpPublishing: Sys.OM.Helpers.GetConfiguration().Publishing === "SFTP2",
            // FTP folder name
            ftpFolderName: "CustomerOrders\\Out",
            // reference document file name prefix  (the process id is appended)
            refFilePrefix: "Doc",
            // XML file name prefix (the process id is appended)
            xmlFilePrefix: "Order",
            // annotations: true (annotated), false (raw)
            annotations: true,
            // note annotations: true (keep), false (ignore)
            notes: true,
            /******* EDI AS2 PUBLISHING *******/
            as2Publishing: Sys.OM.Helpers.GetConfiguration().Publishing === "AS2",
            // Partner folder name
            as2FolderName: "CustomerOrderPartner\\Outgoing",
            //Write failure if the Acknowledgment is mandatory
            processStateAfterExpiration: "success",
            /******* SPLIT DATA *******/
            //
            jsonDataFromSplit: jsonDataFromSplit
        };
}
function GetAnnotationsParam(param) {
    if (annotationParams) {
        return annotationParams[param] || false;
    }
    return false;
}
function GetAnnotationsExtensionsParam(param, defaultExtensions) {
    if (annotationParams) {
        return annotationParams[param] || defaultExtensions;
    }
    return defaultExtensions;
}
//#endregion
//#region HELPERS
//**************************************************************************************************************************
// DATA FORMATING
// adds an XML node with the data value
// xmlNodeParent: parent element
// nodeName: name of the XML node
// dataName: name of the data
// data (optional): typically an item data (default: header data)
function AddDataToXml(xmlNodeParent, nodeName, dataName, data) {
    data = data || Data;
    let xmlNode = xmlNodeParent.AddElement(nodeName);
    let text = null;
    let value = data.GetValue(dataName);
    if (value !== null) {
        if (typeof value === "boolean") {
            text = value ? "1" : "0";
        }
        else if (value instanceof Date) {
            text = Sys.Helpers.Date.ToUTCDate(value);
        }
        else {
            text = value.toString();
        }
    }
    xmlNode.AddText(text);
}
function GetProductListSplitCriteriaList() {
    let lineItemSplitArray = [];
    if (g_settings.jsonDataFromSplit) {
        Log.Info("[GetProductListSplitArray] coming from an already split order (split already done)");
    }
    else {
        let itemTable = Data.GetTable(CustomerOrderProcessing.Finalization.UserExit.GetLineItemsTableName(true));
        let itemCount = itemTable.GetItemCount();
        for (let i = 0; i < itemCount; i++) {
            let item = itemTable.GetItem(i);
            let splitId = item.GetValue("LineItemSplitGroupId__") || "DEFAULT";
            if (splitId && lineItemSplitArray.indexOf(splitId) === -1) {
                lineItemSplitArray.push(splitId);
            }
        }
    }
    if (lineItemSplitArray.length < 2) {
        Log.Info("[GetProductListSplitArray] order will not be split");
    }
    else {
        Log.Info(`[GetProductListSplitArray] order will be split in ${lineItemSplitArray.length} children`);
    }
    return lineItemSplitArray;
}
//#endregion
//#region PUBLISHING IMPLEMENTATION
//**************************************************************************************************************************
const Publishing = {
    computeTransport: function (ruid) {
        Query.Reset();
        Query.SetFilter("(RUIDEX=" + ruid + ")");
        Query.AddAttribute("GDRTiffFile");
        Query.AddAttribute("AnnotationsFile");
        let transport = null;
        if (Query.MoveFirst()) {
            transport = Query.MoveNext();
        }
        return transport;
    },
    computePreviewFile: function (attachs) {
        let previewFile = null;
        if (attachs) {
            let attach = attachs.GetAttach(0);
            if (attach) {
                let attachVars = attach.GetVars();
                if (attachVars) {
                    previewFile = attachVars.GetValue_FileRef("GDRTiffFile", 0);
                }
            }
        }
        return previewFile;
    },
    attachTheDocumentToTheCopyTransport: function (transport, previewFile, id, annotationsFile) {
        if (transport && previewFile) {
            let refAttach = transport.AddAttach();
            refAttach.SetAttachFile(previewFile);
            let refAttachVars = refAttach.GetVars();
            refAttachVars.AddValue_String("AttachOutputName", g_settings.ftpFolderName + "\\" + g_settings.refFilePrefix + id, true);
            if (annotationsFile) {
                // convert the document to add anotations
                refAttachVars.AddValue_String("AttachConverterToUse", "AnnotConv", true);
                refAttachVars.AddValue_String("AttachConvertOptions", "?Annotations=1?Comments=" + (g_settings.notes ? "1" : "0") + "?AnnotationsFile=%[Resources(AttachOutputName=AnnotationsFile)]", true);
                refAttachVars.AddValue_String("AttachInputFormat", ".tiff", true);
            }
            refAttachVars.AddValue_String("AttachOutputFormat", ".tif", true);
        }
    },
    createChildOrders: function () {
        Log.Info("[createChildOrders] split order into children processes");
        let productListName = CustomerOrderProcessing.Finalization.UserExit.GetLineItemsTableName(true);
        let tempProductList = Lib.SOP.Helpers.GetDatatableAsJson(productListName);
        let lineItemSplitArray = GetProductListSplitCriteriaList();
        if (lineItemSplitArray.length === 0) {
            lineItemSplitArray[0] = "DEFAULT";
        }
        for (let i = 0; i < lineItemSplitArray.length; i++) {
            let JsonSubOrder = {
                forceTouchless: true,
                disableCopo: true,
                isChild: true,
                splitCriteria: lineItemSplitArray[i],
                originalValidationOwnerId: Data.GetValue("ValidationOwnerID"),
                flexible: {
                    fields: {},
                    tables: {
                        Product_List__: [],
                        SAPTextsTable__: [],
                        Partners__: []
                    }
                }
            };
            if (productListName !== "Product_List__") {
                JsonSubOrder.flexible.tables[productListName] = [];
            }
            JsonSubOrder.flexible.fields = Lib.SOP.Helpers.GetDatafieldsAsJson();
            JsonSubOrder.flexible.fields.Sales_Order_Number__ = Data.GetValue("Sales_Order_Number__") + ` (${i + 1}/${lineItemSplitArray.length})`;
            let total = 0;
            tempProductList.forEach(e => {
                if (e.LineItemSplitGroupId__ === lineItemSplitArray[i]) {
                    JsonSubOrder.flexible.tables[productListName].push(e);
                    let subTotal = parseFloat(e.Total__);
                    total += isNaN(subTotal) ? 0 : subTotal;
                }
            });
            JsonSubOrder.flexible.fields.Total__ = total !== 0 ? total : "";
            JsonSubOrder.flexible.tables.SAPTextsTable__ = Lib.SOP.Helpers.GetDatatableAsJson("SAPTextsTable__");
            JsonSubOrder.flexible.tables.Partners__ = Lib.SOP.Helpers.GetDatatableAsJson("Partners__");
            let transport = Process.CreateProcessInstance("Customer Order Processing", JsonSubOrder.isChild, true);
            let vars = transport.GetUninheritedVars();
            let jsonName = Process.GenerateGuid() + ".json";
            vars.AddValue_String("JsonFromSplitOrder__", jsonName, false);
            let tempFile = TemporaryFile.CreateFile("json", "utf8");
            TemporaryFile.Append(tempFile, JSON.stringify(JsonSubOrder));
            let attach = transport.AddAttachEx(tempFile);
            let attachVars = attach.GetVars();
            attachVars.AddValue_String("AttachOutputName", jsonName, true);
            transport.Process();
            if (transport.GetLastError() !== 0) {
                Log.Error(`[createChildOrders] error creating a child : "${transport.GetLastErrorMessage()}"`);
            }
        }
        Log.Info(`[createChildOrders] created ${lineItemSplitArray.length} children`);
    },
    publish: function () {
        if (Data.GetActionName() === "Archive_Only") {
            return;
        }
        if (CustomerOrderProcessing.Finalization.UserExit.OnPublishingBegin().stop) {
            return;
        }
        let transport = null;
        let vars = null;
        let xmlOutputName = null;
        let previewFile = null;
        let annotationsFile = null;
        let ruid = Data.GetValue("RUIDEX");
        if (!ruid) {
            Log.Error("No RUIDEX found so no publishing");
            return;
        }
        let id = ruid.replace(/.*\./, ""); // last part of the ruidex
        if (g_settings.ftpPublishing) {
            Log.Info("ftpPublishing mode");
            xmlOutputName = g_settings.ftpFolderName + "\\" + g_settings.xmlFilePrefix + id;
            transport = Publishing.computeTransport(ruid);
            if (transport) {
                let attachs = transport.GetAttachs(true);
                previewFile = Publishing.computePreviewFile(attachs);
                vars = transport.GetUninheritedVars();
                annotationsFile = vars.GetValue_FileRef("AnnotationsFile", 0);
            }
        }
        else // as2Publishing
         {
            Log.Info("as2Publishing mode");
            let currentUser = Users.GetUser(Data.GetValue("OwnerId"));
            let userVars = currentUser.GetVars();
            let userEnvironment = userVars.GetValue_String("Environment", 0);
            xmlOutputName = g_settings.as2FolderName + "\\" + userEnvironment + "_" + id;
        }
        let itemTable = Data.GetTable("Product_List__");
        let itemCount = itemTable.GetItemCount();
        let lineItemSplitArray = [];
        for (let i = 0; i < itemCount; i++) {
            let item = itemTable.GetItem(i);
            let splitId = item.GetValue("LineItemSplitGroupId__") || "DEFAULT";
            if (splitId && lineItemSplitArray.indexOf(splitId) === -1) {
                lineItemSplitArray.push(splitId);
            }
        }
        //Assert at least one default entry to access above code
        if (lineItemSplitArray.length === 0) {
            lineItemSplitArray[0] = "DEFAULT";
        }
        for (let indexSplit = 0; indexSplit < lineItemSplitArray.length; indexSplit++) {
            let condition = {
                Product_List__: [
                    {
                        "field": "LineItemSplitGroupId__",
                        "value": lineItemSplitArray[indexSplit]
                    }
                ]
            };
            let documentErpId = "";
            let finalXmlOutputName = xmlOutputName;
            if (lineItemSplitArray[indexSplit] !== "DEFAULT" && lineItemSplitArray.length !== 1) {
                documentErpId = lineItemSplitArray[indexSplit];
            }
            if (lineItemSplitArray.length > 1) {
                finalXmlOutputName += "_" + (indexSplit + 1);
                Data.SetValue("IsLineItemSplitOrder__", true);
            }
            transport = CustomerOrderProcessing.Finalization.UserExit.CreatePublishingProcessInstanceOrTransport(Sys.OM.Helpers.GetConfiguration().EnableERPIntegrationDelay === "0");
            if (!transport) {
                // create a copy transport
                // If COP is configured to wait for the ERP ACK (EnableERPIntegrationDelay is 1), do not make the copy as a child of the COP
                // This way the COP's completion date time will be time time it succeeds and not the time at which its child has succeeded
                transport = Process.CreateTransport("Copy", Sys.OM.Helpers.GetConfiguration().EnableERPIntegrationDelay === "0");
            }
            if (transport) {
                Log.Info("Copy File transport created successfully");
                vars = transport.GetUninheritedVars();
                vars.AddValue_String("CopyPath", g_settings.publishing, true);
                // Attach as resource the annotations file (if any) to the Copy transport
                if (annotationsFile) {
                    Log.Info("Attaching annotations file");
                    let annotationsAttach = transport.AddAttach();
                    annotationsAttach.SetAttachFile(annotationsFile);
                    let annotationsAttachVars = annotationsAttach.GetVars();
                    annotationsAttachVars.AddValue_String("AttachOutputName", "AnnotationsFile", true);
                    annotationsAttachVars.AddValue_Long("AttachIsResource", 1, true);
                }
                //Generate a tif file only in SAP mode
                if (g_settings.SAPMode) {
                    Log.Info("Generating tif file to be attached to the copy transport");
                    Publishing.attachTheDocumentToTheCopyTransport(transport, previewFile, id, annotationsFile);
                }
                let tempOrderOutputFile = Publishing.generateOutputFile(documentErpId, condition);
                let fileName = tempOrderOutputFile.GetFileName();
                if (!CustomerOrderProcessing.Finalization.UserExit.AttachOutputFile(transport, tempOrderOutputFile, finalXmlOutputName, lineItemSplitArray, indexSplit).stop) {
                    // Attach the XML file to the Copy transport
                    let newAttachVars = transport.AddAttachEx(tempOrderOutputFile).GetVars();
                    newAttachVars.AddValue_String("AttachOutputName", finalXmlOutputName, true);
                    newAttachVars.AddValue_String("AttachToDisplay", "converted", true);
                    CustomerOrderProcessing.Finalization.UserExit.SetPublishingAttachmentVars(newAttachVars);
                }
                transport.Process();
                TemporaryFile.Delete(fileName);
            }
            else {
                Process.Exit(70, "An error occured while creating the Copy File Transport");
            }
        }
        let updateOrderStatus = Sys.OM.Helpers.GetConfiguration().EnableERPIntegrationDelay === "1"
            && !Data.GetValue("Order_status__");
        if (updateOrderStatus) {
            Data.SetValue("Order_status__", "OrderEntered");
        }
    },
    generateOutputFile: function (documentErpId, condition) {
        let f;
        switch (Sys.OM.Helpers.GetConfiguration().EDIFileFormat) {
            case "EDIFACT - ORDERS D96A":
                f = Publishing.generateEDIFact(condition);
                f = CustomerOrderProcessing.Finalization.UserExit.CustomizeEDIOutput(f, Sys.OM.Helpers.GetConfiguration().EDIFileFormat);
                break;
            case "ANSI X12 - EDI 850":
                f = Publishing.generateX12(condition);
                f = CustomerOrderProcessing.Finalization.UserExit.CustomizeEDIOutput(f, Sys.OM.Helpers.GetConfiguration().EDIFileFormat);
                break;
            case "IDOC":
                f = Publishing.generateIDOC(condition);
                f = CustomerOrderProcessing.Finalization.UserExit.CustomizeEDIOutput(f, Sys.OM.Helpers.GetConfiguration().EDIFileFormat);
                break;
            case "XML":
            default:
                f = Publishing.generateAndCustomizeXML(documentErpId, condition);
                f = CustomerOrderProcessing.Finalization.UserExit.CustomizeXMLOutput(f);
                break;
        }
        return f;
    },
    generateEDI: function (ediMapper, encoding, condition) {
        //#region XML customization...
        let tempOrderEdi = TemporaryFile.CreateFile("edi", encoding);
        TemporaryFile.Append(tempOrderEdi, ediMapper.getEDI(condition));
        //#endregion XML customization
        return tempOrderEdi;
    },
    generateEDIFact: function (condition) {
        let encoding = CustomerOrderProcessing.Finalization.UserExit.GetEDIOutputEncoding() || "utf8";
        return Publishing.generateEDI(new Sys.EDIPublishingMapper.EDIFACTPublishingMapper(), encoding, condition);
    },
    generateX12: function (condition) {
        let encoding = CustomerOrderProcessing.Finalization.UserExit.GetEDIOutputEncoding() || "utf8";
        return Publishing.generateEDI(new Sys.EDIPublishingMapper.X12PublishingMapper(), encoding, condition);
    },
    generateIDOC: function (condition) {
        let encoding = CustomerOrderProcessing.Finalization.UserExit.GetEDIOutputEncoding() || "utf8-without-bom";
        return Publishing.generateEDI(new Sys.EDIPublishingMapper.IDOCPublishingMapper(), encoding, condition);
    },
    generateAndCustomizeXML: function (documentErpId, condition) {
        let encoding = "utf8";
        let rootElementName = "Order";
        // Generate an XML document containing data extracted from the form
        Log.Info("Generating the XML file to be attached to the copy transport");
        encoding = CustomerOrderProcessing.Finalization.UserExit.GetEDIOutputEncoding() || encoding;
        //#region XML customization...
        let tempOrderXml = TemporaryFile.CreateFile("xml", encoding);
        const erpOrderDocument = Lib.SOP.ERP.InitializeERPManager(Sys.OM.Helpers.GetConfiguration().ERP);
        let headerFieldsToExclude = erpOrderDocument.getPublishingHeaderFieldsToExclude();
        headerFieldsToExclude = addCurrencyInXMLWhenDisplayCurrencyIsActivated(headerFieldsToExclude);
        headerFieldsToExclude = removeShipToNumberIfNeeded(headerFieldsToExclude);
        let tableFieldsToExclude = erpOrderDocument.getPublishingTableFieldsToExclude();
        let modifiedNodeNameMappings = erpOrderDocument.getPublishingRenamedNodeMappings();
        modifiedNodeNameMappings = CustomerOrderProcessing.Finalization.UserExit.CustomizePublishingNodeMappings(modifiedNodeNameMappings);
        if (Data.GetValue("SalesDocumentType__") === Lib.SOP.Helpers.SalesDocumentType.QuoteRequest) {
            rootElementName = "QuoteRequest";
            headerFieldsToExclude = this.getExcludedFieldsForQuotation(headerFieldsToExclude);
            tableFieldsToExclude = this.getExcludedTableFieldsForQuotation(tableFieldsToExclude);
        }
        let fieldValuesMapping = CustomerOrderProcessing.Finalization.UserExit.GetFieldValuesMapping(documentErpId);
        headerFieldsToExclude = CustomerOrderProcessing.Finalization.UserExit.SetFieldsToExcludeForPublishing(headerFieldsToExclude);
        tableFieldsToExclude = CustomerOrderProcessing.Finalization.UserExit.SetTableFieldsToExcludeForPublishing(tableFieldsToExclude);
        const keepEmptyFields = CustomerOrderProcessing.Finalization.UserExit.KeepEmptyFieldsWhenPublishing();
        let xmlEncoding = encoding === "utf16" ? "UTF-16" : "UTF-8";
        Lib.FlexibleFormToXML.setFlexibleFormOptions(xmlEncoding, rootElementName, headerFieldsToExclude, tableFieldsToExclude, Data, {
            keepEmptyFields,
            fieldValuesMapping,
            modifiedNodeNameMappings
        });
        if (documentErpId !== "") {
            documentErpId = "_" + documentErpId;
        }
        Lib.FlexibleFormToXML.GetXMLFile(tempOrderXml, Publishing.addSpecificNodes, null, condition, documentErpId);
        //#endregion XML customization
        return tempOrderXml;
    },
    getExcludedFieldsForQuotation: function (fieldsToExclude) {
        let fieldsToExcludeOut = [];
        if (!fieldsToExclude || fieldsToExclude.length == 0) {
            fieldsToExclude = [];
        }
        fieldsToExcludeOut = fieldsToExclude;
        this.insertIfNotAlreadyExist(fieldsToExcludeOut, "Sales_Order_Number__");
        this.insertIfNotAlreadyExist(fieldsToExcludeOut, "Total__");
        this.insertIfNotAlreadyExist(fieldsToExcludeOut, "RunningTotal__");
        this.insertIfNotAlreadyExist(fieldsToExcludeOut, "Send_confirmation_notification__");
        return fieldsToExcludeOut;
    },
    getExcludedTableFieldsForQuotation: function (tableFieldsToExclude) {
        let tableFieldsToExcludeOut = [];
        let excludedColumnsList = ["Unit_Price__", "Total__", "Pricing_conditions__"];
        if (!tableFieldsToExclude || tableFieldsToExclude.length == 0) {
            tableFieldsToExclude = [];
        }
        let tableUpdated = false;
        tableFieldsToExcludeOut = tableFieldsToExclude;
        tableFieldsToExcludeOut.forEach(table => {
            if (table.name === "Product_List__") {
                excludedColumnsList.forEach(element => {
                    this.insertIfNotAlreadyExist(table.excludedColumns, element);
                });
                tableUpdated = true;
            }
        });
        if (!tableUpdated) {
            tableFieldsToExcludeOut.push({
                name: "Product_List__",
                excludedColumns: excludedColumnsList
            });
        }
        return tableFieldsToExcludeOut;
    },
    insertIfNotAlreadyExist: function (tableToProcess, elementToInclude) {
        if (!tableToProcess.includes(elementToInclude)) {
            tableToProcess.push(elementToInclude);
        }
    },
    addSpecificNodes: function (flexibleFormToXMLConverter, xmlTempFile) {
        let xmlDoc = Helpers.XML.CreateXmlDocument();
        let validationURL = flexibleFormToXMLConverter.dataSrc.GetValue("ValidationUrl");
        flexibleFormToXMLConverter.AddNode(xmlDoc, "OrderDocumentURL", validationURL);
        let documentCulture = Variable.GetValueAsString("DocumentCulture");
        flexibleFormToXMLConverter.AddNode(xmlDoc, "Culture_Code", documentCulture);
        TemporaryFile.Append(xmlTempFile, xmlDoc.toString());
    }
};
function addCurrencyInXMLWhenDisplayCurrencyIsActivated(headerFieldsToExclude) {
    return Sys.OM.Helpers.GetConfiguration().DisplayCurrency === "1" ? headerFieldsToExclude.filter(e => e !== "Currency__") : headerFieldsToExclude;
}
function removeShipToNumberIfNeeded(headerFieldsToExclude) {
    let configuration = Sys.OM.Helpers.GetConfiguration();
    if (Data.GetValue("DropShipToCapturedAddress__") &&
        !Lib.SOP.Helpers.IsERP("SAP") &&
        !Lib.SOP.SAP.Helpers.IsSAP4SCloud() &&
        configuration.Display_ShipToNumber === "0") {
        headerFieldsToExclude.push("ShipToNumber__");
    }
    return headerFieldsToExclude;
}
//#endregion
//#region WAIT FOR ERP ACKNOWLEDGEMENT IMPLEMENTATION
//**************************************************************************************************************************
function waitForAS2ErpAknowledgement() {
    if (g_settings.as2Publishing) {
        Process.WaitForUpdate();
        Process.SetStatusOnExpiration(g_settings.processStateAfterExpiration);
    }
}
//#endregion
//#region FLATTEN ANNOTATIONS IMPLEMENTATION
//**************************************************************************************************************************
function flattenAnnotations() {
    if (g_settings.FlattenAnnotations) {
        Log.Info("Flatten Annotations");
        Data.FlattenAnnotations(g_settings.FlattenNotes ? 1 : 0, g_settings.OnlyKeepFlattenDocument ? 1 : 0);
        let nb = Attach.GetNbAttach();
        for (let idx = 0; idx < nb; ++idx) {
            let extension = Attach.GetExtension(idx);
            for (let ext = 0; ext < g_settings.DiscardedAttach.length; ext++) {
                if (extension === g_settings.DiscardedAttach[ext]) {
                    Attach.SetValue(idx, "AttachToSuppress", (1).toString());
                }
            }
        }
    }
}
//#endregion
//#region ShipTo Mapping
//**************************************************************************************************************************
function SaveShipToNumberMapping() {
    if (CustomerOrderProcessing.Finalization.UserExit.OnSaveShipToNumberMapping().stop) {
        Log.Info("OnSaveShipToNumberMapping user exit disabled ship-To number mapping save. Exiting.");
        return;
    }
    let shipToAddress = Data.GetValue("ShipToAddress__");
    if (shipToAddress) {
        //remove \r\n to compare the multiline on this process with the text on the CT
        shipToAddress = shipToAddress.trim();
        shipToAddress = Sys.Helpers.String.ReplaceEndLinesAndCommaBySpaces(shipToAddress);
        let customerNumber = Data.GetValue("CustomerNumber__");
        let shipToNumber = Data.GetValue("ShipToNumber__");
        const dataFilteringKey = Sys.OM.Helpers.GetConfiguration().DataFilteringKey;
        let salesArea = Data.GetValue("Sales_Area__");
        if (customerNumber && shipToNumber) {
            let bCreate = true;
            let rec;
            let vars;
            let tableName = "SO - Ship to address/number mapping__";
            Query.Reset();
            Query.SetSpecificTable(tableName);
            let filter = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual("CustomerNumber__", customerNumber.toString()), Sys.Helpers.LdapUtil.FilterEqual("ShipToAddress__", shipToAddress));
            filter = Lib.SOP.DataFilteringKey.ExtendFilterWithDataFilteringKey(tableName, filter);
            if ((g_settings.SAPMode || Lib.SOP.Helpers.IsERP("SAPS4Cloud") || Lib.SOP.Helpers.IsERP("Asynchronous SAP Integration")) && salesArea) {
                filter = Sys.Helpers.LdapUtil.FilterAnd(filter, Sys.Helpers.LdapUtil.FilterEqual("Sales_Area__", salesArea));
            }
            Query.SetFilter(filter.toString());
            if (Query.MoveFirst()) {
                rec = Query.MoveNextRecord();
                if (rec) {
                    bCreate = false;
                    vars = rec.GetVars();
                    let recShipToNumber = vars.GetValue_String("ShipToNumber__", 0);
                    if (recShipToNumber !== shipToNumber.toString()) {
                        // update record
                        Log.Info("Old shipTo :" + recShipToNumber);
                        Log.Info("New shipTo :" + shipToNumber);
                        Log.Info("Update ShipTo Number for customer '" + customerNumber + "' and shipToAddress '" + shipToAddress + "' and SalesArea '" + salesArea + "'");
                        vars.AddValue_String("ShipToNumber__", shipToNumber, true);
                        vars.AddValue_String("DataFilteringKey__", dataFilteringKey, true);
                        // eslint-disable-next-line max-depth
                        if ((g_settings.SAPMode || Lib.SOP.Helpers.IsERP("SAPS4Cloud") || Lib.SOP.Helpers.IsERP("Asynchronous SAP Integration")) && salesArea) {
                            vars.AddValue_String("Sales_Area__", salesArea, true);
                        }
                        // eslint-disable-next-line max-depth
                        if (rec.Commit()) {
                            Log.Warn("Error during 'SO - Ship to address/number mapping__' commit: " + rec.GetLastErrorMessage());
                        }
                    }
                }
            }
            if (bCreate) {
                // create record
                Log.Info(`DB SO - Ship to address/number mapping__ for customer '${customerNumber}' and shipToAddress '${shipToAddress}' and SalesArea '${salesArea}' does not exist, create record`);
                rec = Process.CreateTableRecord("SO - Ship to address/number mapping__");
                if (rec) {
                    vars = rec.GetVars();
                    vars.AddValue_String("CustomerNumber__", customerNumber, true);
                    vars.AddValue_String("ShipToNumber__", shipToNumber, true);
                    vars.AddValue_String("ShipToAddress__", shipToAddress, true);
                    vars.AddValue_String("DataFilteringKey__", dataFilteringKey, true);
                    if ((g_settings.SAPMode || Lib.SOP.Helpers.IsERP("SAPS4Cloud") || Lib.SOP.Helpers.IsERP("Asynchronous SAP Integration")) && salesArea) {
                        vars.AddValue_String("Sales_Area__", salesArea, true);
                    }
                    if (rec.Commit()) {
                        Log.Warn("Error during 'SO - Ship to address/number mapping__' commit: " + rec.GetLastErrorMessage());
                    }
                }
                else {
                    Log.Info("Error creating record SO - Ship to address/number mapping__");
                }
            }
        }
    }
}
//#endregion
//#region SoldTo Mapping
//**************************************************************************************************************************
function SaveSoldToNumberMapping() {
    if (CustomerOrderProcessing.Finalization.UserExit.OnSaveSoldToNumberMapping().stop) {
        Log.Info("OnSaveSoldToNumberMapping user exit disabled sold-To number mapping save. Exiting.");
        return;
    }
    let soldToAddress = Data.GetValue("SoldToAddress__");
    if (soldToAddress) {
        //remove \r\n to compare the multiline on this process with the text on the CT
        soldToAddress = soldToAddress.trim();
        soldToAddress = Sys.Helpers.String.ReplaceEndLinesAndCommaBySpaces(soldToAddress);
        let customerNumber = Data.GetValue("CustomerNumber__");
        let salesArea = Data.GetValue("Sales_Area__");
        if (customerNumber) {
            let bCreate = true;
            let rec;
            let vars;
            let table = Lib.SOP.Tables.SoldToAddressNumberMapping;
            Query.Reset();
            Query.SetSpecificTable(table.tableName);
            //only one customer per soldTo adress!
            let filter = Sys.Helpers.LdapUtil.FilterEqual(table.soldToAddress, soldToAddress);
            filter = Lib.SOP.DataFilteringKey.ExtendFilterWithDataFilteringKey(table.tableName, filter);
            if ((g_settings.SAPMode || Lib.SOP.Helpers.IsERP("SAPS4Cloud") || Lib.SOP.Helpers.IsERP("Asynchronous SAP Integration")) && salesArea) {
                filter = Sys.Helpers.LdapUtil.FilterAnd(filter, Sys.Helpers.LdapUtil.FilterEqual("Sales_Area__", salesArea));
            }
            let filterString = CustomerOrderProcessing.Finalization.UserExit.CustomizeSaveSoldToNumberMappingQueryFilter(filter.toString());
            Query.SetFilter(filterString);
            if (Query.MoveFirst()) {
                rec = Query.MoveNextRecord();
                if (rec) {
                    bCreate = false;
                    vars = rec.GetVars();
                    vars.AddValue_String(table.customerNumber, customerNumber, true);
                    vars.AddValue_String(table.dataFilteringKey, Sys.OM.Helpers.GetConfiguration().DataFilteringKey, true);
                    Log.Info(`Update SoldToAddress__ for customer '${customerNumber}'`);
                    if ((g_settings.SAPMode || Lib.SOP.Helpers.IsERP("SAPS4Cloud") || Lib.SOP.Helpers.IsERP("Asynchronous SAP Integration")) && salesArea) {
                        vars.AddValue_String(table.salesArea, salesArea, true);
                    }
                    if (rec.Commit()) {
                        Log.Warn(`Error during '${table.tableName}' commit: ${rec.GetLastErrorMessage()}`);
                    }
                }
            }
            if (bCreate) {
                // create record
                Log.Info(`Record in ${table.tableName} for customer '${customerNumber}' and soldToAddress '${soldToAddress}' and SalesArea '${salesArea}' does not exist, create record`);
                rec = Process.CreateTableRecord(table.tableName);
                if (rec) {
                    vars = rec.GetVars();
                    vars.AddValue_String(table.soldToAddress, soldToAddress, true);
                    vars.AddValue_String(table.customerNumber, customerNumber, true);
                    if ((g_settings.SAPMode || Lib.SOP.Helpers.IsERP("SAPS4Cloud") || Lib.SOP.Helpers.IsERP("Asynchronous SAP Integration")) && salesArea) {
                        vars.AddValue_String(table.salesArea, salesArea, true);
                    }
                    vars.AddValue_String(table.dataFilteringKey, Sys.OM.Helpers.GetConfiguration().DataFilteringKey, true);
                    if (rec.Commit()) {
                        Log.Warn(`Error during '${table.tableName}' commit: ${rec.GetLastErrorMessage()}`);
                    }
                }
                else {
                    Log.Info(`Error creating record in '${table.tableName}'`);
                }
            }
        }
    }
}
//#endregion
//#region Material Mapping
//**************************************************************************************************************************
function CreateMaterialMappingRecord(customerNumber, materialNumber, customerMaterialNumber, customerUnit, validationOrgId) {
    // create record
    Log.Info("DB SO - Customer material mapping autolearn__ for customer '" + customerNumber + "' and customerMaterialNumber '" + customerMaterialNumber + "' does not exist, create record");
    let rec = Process.CreateTableRecord("SO - Customer material mapping autolearn__");
    if (rec) {
        let vars = rec.GetVars();
        vars.AddValue_String("Customer_number__", customerNumber, true);
        vars.AddValue_String("Material_number_on_the_customer_side__", customerMaterialNumber, true);
        vars.AddValue_String("Material_number__", materialNumber, true);
        if (customerUnit) {
            vars.AddValue_String("Unit_on_the_customer_side__", customerUnit, true);
        }
        if (validationOrgId) {
            vars.AddValue_String("ItemValidationOrg__", validationOrgId, true);
        }
        vars.AddValue_String("DataFilteringKey__", Sys.OM.Helpers.GetConfiguration().DataFilteringKey, true);
        if (rec.Commit()) {
            Log.Warn("Error during 'SO - Customer material mapping autolearn__' commit: " + rec.GetLastErrorMessage());
        }
    }
    else {
        Log.Info("Error creating record SO - Customer material mapping autolearn__");
    }
}
// returns the updated (or not) record, null if no record found
function UpdateExistingMaterialMappingRecord(customerNumber, materialNumber, customerMaterialNumber, customerUnit, validationOrgId) {
    let tableName = Lib.SOP.Tables.CorrectedCustomerMaterialMapping.tableName;
    Query.Reset();
    Query.SetSpecificTable(tableName);
    let dataFilteringKey = Sys.OM.Helpers.GetConfiguration().DataFilteringKey;
    let filter = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual("Customer_number__", customerNumber), Sys.Helpers.LdapUtil.FilterEqual("Material_number_on_the_customer_side__", customerMaterialNumber));
    if (validationOrgId) {
        filter = Sys.Helpers.LdapUtil.FilterAnd(filter, Sys.Helpers.LdapUtil.FilterEqual("ItemValidationOrg__", validationOrgId));
    }
    filter = Lib.SOP.DataFilteringKey.ExtendFilterWithDataFilteringKey(tableName, filter);
    Query.SetFilter(filter.toString());
    if (Query.MoveFirst()) {
        let rec = Query.MoveNextRecord();
        if (rec) {
            let vars = rec.GetVars();
            let learnedMaterialNumber = vars.GetValue_String("Material_number__", 0);
            let customerUnitInMru = vars.GetValue_String("Unit_on_the_customer_side__", 0);
            if (materialNumber !== learnedMaterialNumber
                || (customerUnit && customerUnit !== customerUnitInMru)) {
                // update record
                Log.Info("Old material number :" + learnedMaterialNumber + " New material number :" + materialNumber);
                Log.Info("Update material Number for customer '" + customerNumber);
                vars.AddValue_String("Material_number__", materialNumber, true);
                vars.AddValue_String("DataFilteringKey__", dataFilteringKey, true);
                if (customerUnit) {
                    vars.AddValue_String("Unit_on_the_customer_side__", customerUnit, true);
                }
                if (rec.Commit()) {
                    Log.Warn("Error during 'SO - Customer material mapping autolearn__' commit: " + rec.GetLastErrorMessage());
                }
            }
            return true;
        }
    }
    return false;
}
function DoesMaterialMappingRecordExists(customerNumber, materialNumber, customerMaterialNumber, validationOrgId) {
    const tableName = Lib.SOP.Tables.CustomerMaterialMapping.tableName;
    Query.Reset();
    Query.SetSpecificTable(tableName);
    let filter = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterOr(Sys.Helpers.LdapUtil.FilterEqual("Customer_number__", customerNumber), Sys.Helpers.LdapUtil.FilterEqual("Customer_number__", "")), Sys.Helpers.LdapUtil.FilterEqual("Material_number__", materialNumber), Sys.Helpers.LdapUtil.FilterEqual("Material_number_on_the_customer_side__", customerMaterialNumber));
    if (validationOrgId) {
        filter = Sys.Helpers.LdapUtil.FilterAnd(filter, Sys.Helpers.LdapUtil.FilterEqual("ItemValidationOrg__", validationOrgId));
    }
    filter = Lib.SOP.DataFilteringKey.ExtendFilterWithDataFilteringKey(tableName, filter);
    Query.SetFilter(filter.toString());
    if (Query.MoveFirst()) {
        let rec = Query.MoveNextRecord();
        if (rec) {
            return true;
        }
    }
    return false;
}
/**
 * @description This function handles the saving of material mappings during the finalization process of a customer order.
 * - It ensures that the relationship between the customer product code and the vendor ERP product code is remembered.
 * - If no product code is specified by the customer, the function uses the product description extracted from the order.
 * - The function also remembers the most recently used unit of measure (UoM) for the product.
 * Remarks:
 * - Even if the customer extracted material is identical to the ERP material, the mapping is stored to ensure the UoM MRU logic is maintained.
 * - This logic ensures that the material mapping is only saved or updated if the CustomerMaterialId__ field's value is not derived from the Materials and
 *   Corrected Customer Material Mapping tables. This helps in maintaining the integrity and accuracy of the material mapping records.
 */
function SaveMaterialMapping() {
    if (CustomerOrderProcessing.Finalization.UserExit.OnSaveMaterialMapping().stop) {
        Log.Info("OnSaveMaterialMapping user exit disabled customer material mapping save. Exiting.");
        return;
    }
    let customerNumber = Data.GetValue("CustomerNumber__");
    const erpOrderDocument = Lib.SOP.ERP.InitializeERPManager(Sys.OM.Helpers.GetConfiguration().ERP);
    let validationOrgId = null;
    if (Sys.OM.Helpers.GetConfiguration().ERP === "Oracle EBS") {
        customerNumber = erpOrderDocument.getCustomerNumberWithoutLocation(customerNumber);
        validationOrgId = Data.GetValue("ItemValidationOrg__");
    }
    let itemTable = Data.GetTable("Product_List__");
    let itemCount = itemTable.GetItemCount();
    for (let index = 0; index < itemCount; index++) {
        let item = itemTable.GetItem(index);
        let materialNumber = item.GetValue("ItemNumber__");
        let customerMaterialNumber = item.GetValue("CustomerMaterialId__");
        if (item.GetComputedValueSource("CustomerMaterialId__") !== "table {" + Lib.SOP.Tables.Materials.tableName + "}"
            && item.GetComputedValueSource("CustomerMaterialId__") !== "table {" + Lib.SOP.Tables.CorrectedCustomerMaterialMapping.tableName + "}") {
            SaveOrUpdateMaterialMapping(item, materialNumber, customerMaterialNumber, customerNumber, validationOrgId);
        }
        let customerDescription = item.GetValue("ExtractedDescription__");
        SaveOrUpdateMaterialMapping(item, materialNumber, customerDescription, customerNumber, validationOrgId);
    }
}
function SaveOrUpdateMaterialMapping(item, materialNumber, extractedCriteria, customerNumber, validationOrgId) {
    if (!materialNumber || !extractedCriteria) {
        Log.Info(`materialNumber (value:${materialNumber}) or extracted criteria (value:${extractedCriteria}) empty => no material mapping record created or updated`);
        return;
    }
    const existsInMasterData = DoesMaterialMappingRecordExists(customerNumber, materialNumber, extractedCriteria, validationOrgId);
    const unitField = Lib.SOP.QuantityConversion.IsQuantityConversionEnabled() ? "CustomerUnit__" : "Unit__";
    let unitToSave = "";
    if (!item.IsComputed(unitField)) {
        unitToSave = item.GetValue(unitField);
    }
    if (!existsInMasterData || unitToSave) {
        let existsInAutolearnData = UpdateExistingMaterialMappingRecord(customerNumber, materialNumber, extractedCriteria, unitToSave, validationOrgId);
        if (!existsInAutolearnData) {
            CreateMaterialMappingRecord(customerNumber, materialNumber, extractedCriteria, unitToSave, validationOrgId);
        }
    }
}
function EmptyExtractedDescription() {
    Log.Info("Empty Extracted Description");
    let itemTable = Data.GetTable("Product_List__");
    let itemCount = itemTable.GetItemCount();
    for (let index = 0; index < itemCount; index++) {
        let item = itemTable.GetItem(index);
        let extractedDescription = item.GetValue("ExtractedDescription__");
        if (extractedDescription) {
            item.SetValue("ExtractedDescription__", "");
        }
    }
}
//#endregion
//#region Spreadsheet Mapping
function SaveSpreadsheetMapping() {
    if (Sys.OM.Helpers.GetConfiguration().EnableCsvExtraction !== "1") {
        return;
    }
    if (Data.GetValue("CustomerNumber__")) {
        let mappingManager = new Sys.Spreadsheets.MappingManager_Server("Customer Order Processing");
        mappingManager.TrySaveMapping(Data.GetValue("CustomerNumber__"))
            .Catch(() => {
            Log.Error("[SaveSpreadsheetMapping] Failed to save the CSV mapping");
        });
    }
}
//#region GLNMapping
function SaveExternalIdentifierMapping() {
    if (CustomerOrderProcessing.Finalization.UserExit.OnSaveExternalIdentifierMapping().stop) {
        Log.Info("OnSaveExternalIdentifierMapping user exit disabled external partner identifier mapping save. Exiting.");
        return;
    }
    let customerVendorValue = Data.GetValue("CustomerVendor__");
    let shipToVendorValue = Data.GetValue("ShiptoVendor__");
    if (customerVendorValue) {
        Query.Reset();
        let customerNumber = Data.GetValue("CustomerNumber__");
        let filter = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual("ExternalPartnerIdentifier__", customerVendorValue), Sys.Helpers.LdapUtil.FilterEqual("PartnerFunction__", "SoldTo"));
        let results = Lib.SOP.Helpers.QueryDB("SO - External partner identifier mapping__", filter, "PartnerNumber__,ruidex", 2);
        if (results.length === 0) {
            createExternalIdentifierMappingRecord(customerVendorValue, customerNumber, true);
        }
        else if (results.length === 1) {
            if (results[0].GetValue_String("PartnerNumber__", 0) !== customerNumber) {
                updateExternalIdentifierMappingRecord(results[0].GetValue_String("RuidEx", 0), customerNumber);
            }
        }
        else {
            Log.Warn("More than one row returned on SO - External partner identifier mapping__ (" + results.length + ")");
        }
    }
    if (shipToVendorValue) {
        Query.Reset();
        let shipToNumber = Data.GetValue("ShipToNumber__");
        let filter = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual("ExternalPartnerIdentifier__", shipToVendorValue), Sys.Helpers.LdapUtil.FilterEqual("PartnerFunction__", "ShipTo"));
        let results = Lib.SOP.Helpers.QueryDB("SO - External partner identifier mapping__", filter, "PartnerNumber__,ruidex", 2);
        if (results.length === 0) {
            createExternalIdentifierMappingRecord(shipToVendorValue, shipToNumber, false);
        }
        else if (results.length === 1) {
            if (results[0].GetValue_String("PartnerNumber__", 0) !== shipToNumber) {
                updateExternalIdentifierMappingRecord(results[0].GetValue_String("RuidEx", 0), shipToNumber);
            }
        }
        else {
            Log.Warn("More than one row returned on SO - External partner identifier mapping__ (" + results.length + ")");
        }
    }
}
function createExternalIdentifierMappingRecord(externalIdentfier, partnerNumber, isSoldTo) {
    let rec = Process.CreateTableRecord("SO - External partner identifier mapping__");
    if (rec) {
        let vars = rec.GetVars();
        let soldToShipTo = isSoldTo ? "SoldTo" : "ShipTo";
        vars.AddValue_String("PartnerNumber__", partnerNumber, false);
        vars.AddValue_String("ExternalPartnerIdentifier__", externalIdentfier, false);
        vars.AddValue_String("PartnerFunction__", soldToShipTo, false);
        if (rec.Commit()) {
            Log.Warn("Error during 'SO - External partner identifier mapping__' create commit:" + rec.GetLastErrorMessage());
        }
    }
    else {
        Log.Info("Error during 'SO - External partner identifier mapping__' create record");
    }
}
function updateExternalIdentifierMappingRecord(ruidex, partnerNumber) {
    //SOP Helper query can't be used to update existing record
    //We need to request again to update
    Query.Reset();
    Query.SetSpecificTable("SO - External partner identifier mapping__");
    let filter = Sys.Helpers.LdapUtil.FilterEqual("RUIDEX", ruidex);
    Query.SetFilter(filter.toString());
    if (Query.MoveFirst()) {
        let rec = Query.MoveNextRecord();
        if (rec) {
            let vars = rec.GetVars();
            vars.AddValue_String("PartnerNumber__", partnerNumber, true);
            if (rec.Commit()) {
                Log.Warn("Error during 'SO - External partner identifier mapping__' updating commit: " + rec.GetLastErrorMessage());
            }
        }
    }
}
function setMaterialsItemIdentifier() {
    if (Sys.OM.Helpers.GetConfiguration().ERP !== "Oracle EBS") {
        return;
    }
    let customerNumber = Data.GetValue("CustomerNumber__");
    const erpOrderDocument = Lib.SOP.ERP.InitializeERPManager(Sys.OM.Helpers.GetConfiguration().ERP);
    customerNumber = erpOrderDocument.getCustomerNumberWithoutLocation(customerNumber);
    const validationOrgId = Data.GetValue("ItemValidationOrg__");
    const itemTable = Data.GetTable("Product_List__");
    const itemCount = itemTable.GetItemCount();
    for (let index = 0; index < itemCount; index++) {
        let item = itemTable.GetItem(index);
        let materialNumber = item.GetValue("ItemNumber__");
        let customerMaterialNumber = item.GetValue("CustomerMaterialId__");
        if (!materialNumber || !customerMaterialNumber) {
            continue;
        }
        let existsInMasterData = DoesMaterialMappingRecordExists(customerNumber, materialNumber, customerMaterialNumber, validationOrgId);
        let customerDescription = item.GetValue("ExtractedDescription__");
        if (customerDescription) {
            existsInMasterData = existsInMasterData || DoesMaterialMappingRecordExists(customerNumber, materialNumber, customerDescription, validationOrgId);
        }
        if (!existsInMasterData) {
            item.SetValue("ItemIdentifierType__", "INT");
        }
        else {
            item.SetValue("ItemIdentifierType__", "CUST");
        }
        Log.Info(`Item identifier type for ${materialNumber} is ${item.GetValue("ItemIdentifierType__")}`);
    }
}
//#endregion
//#region Retry
//**************************************************************************************************************************
function activateRetries() {
    Process.AllowScriptRetries(true);
    //back to validation state
    Process.StateOnLastScriptFailure(70);
}
//#endregion
function isOrderSerializable() {
    return Sys.OM.Helpers.GetConfiguration().EnableNSO === "1";
}
function SetSerializedCOP() {
    if (isOrderSerializable()) {
        let flexibleSerializer = Lib.SOP.Serializer.GetInstance();
        flexibleSerializer.SetMapping();
        flexibleSerializer.ComputeOrder();
        Variable.SetValueAsString("SerializedCOP", flexibleSerializer.GetJSON());
    }
}
//#region Entry point
//**************************************************************************************************************************
async function EntryPoint() {
    if (Data.GetValue("IsLineItemSplitOrder__") && Variable.GetValueAsString("FinalizationAlreadyProcessed") === "true") {
        Log.Info("This order has been split and finalisation has already been processed. Skipping Finalisation process.");
        return;
    }
    // FinalizationAlreadyCalled is used to call finalization script on SAP SynchronousPost mode.
    // On other modes IsLineItemSplitOrder__ is set during finalization script.
    Variable.SetValueAsString("FinalizationAlreadyProcessed", "true");
    Sys.OM.Helpers.SetConfiguration(Lib.SOP.Configuration.initializeConfigurationServer());
    Lib.SOP.Helpers.CheckIfConfigurationReachable();
    Lib.SOP.Archiving.SetArchivingParameters();
    // If extractedDescription is hidden, we need to empty it so we don't save a mapping on this description
    if (Sys.OM.Helpers.GetConfiguration().AllowToShowExtractedDescription === "1" && !Data.GetValue("ShowExtractedDescriptionColumn__")) {
        EmptyExtractedDescription();
    }
    let currentActionType = Data.GetActionType();
    let currentActionName = Data.GetActionName();
    Log.Info("Action type: " + currentActionType + ", name: " + currentActionName);
    if (currentActionType === "approve" && currentActionName === "DispatchAttachments") {
        Log.Info("Action type is DispatchAttachments, exiting the finalization script.");
        return;
    }
    CustomerOrderProcessing.Finalization.UserExit.OnSetAnnotationParams(annotationParams);
    computeSettings();
    flattenAnnotations();
    setMaterialsItemIdentifier();
    const erpOrderDocument = Lib.SOP.ERP.InitializeERPManager(Sys.OM.Helpers.GetConfiguration().ERP);
    if (CustomerOrderProcessing.Finalization.UserExit.OnFinalizationScriptBegin().stop) {
        return;
    }
    let bOrderWillBeSplit = GetProductListSplitCriteriaList().length > 1;
    let bIsSAPMode = g_settings.SAPMode || g_settings.SAPS4CloudMode;
    let splitIntoChildorders = Sys.OM.Helpers.GetConfiguration().SplitMethod === "CreateChildOrders";
    if (splitIntoChildorders && bOrderWillBeSplit) {
        if (bIsSAPMode && !Data.GetValue("IgnoreSimulationForPost__")) {
            erpOrderDocument.Simulate(true);
        }
        Publishing.createChildOrders();
        Data.SetValue("IsLineItemSplitOrder__", "1");
    }
    else if (bIsSAPMode) {
        activateRetries();
        if (currentActionType === "approve") {
            if (currentActionName === "Approve" || currentActionName === "Post_Force") {
                await erpOrderDocument.PostAsync();
            }
            else if (currentActionName === "Archive_Only") {
                erpOrderDocument.ArchiveOnly();
            }
        }
        else {
            //currentActionType is empty in touchless mode
            await erpOrderDocument.PostAsync();
        }
    }
    else if (g_settings.publishing && (g_settings.ftpPublishing || g_settings.as2Publishing)) {
        Publishing.publish();
        waitForAS2ErpAknowledgement();
    }
    else {
        let configPublishing = Sys.OM.Helpers.GetConfiguration().Publishing;
        Log.Info("Publishing: no output file generated (" + configPublishing + ")");
    }
    //If COP is configured to wait for the ERP ACK (EnableERPIntegrationDelay is 1), do not create a Purchase order unless the form is validated within the ERP
    const enableERPIntegrationDelay = Sys.OM.Helpers.GetConfiguration().EnableERPIntegrationDelay;
    if ((Lib.SOP.Helpers.IsERP("Oracle EBS") || Lib.SOP.Helpers.IsERP("Generic")) && enableERPIntegrationDelay === "1") {
        Log.Info("Portal order acceptation delayed in post processing script, as the order is sent to the ERP");
    }
    else if (currentActionName !== "Archive_Only") {
        let config = Sys.OM.Helpers.GetConfiguration();
        let configurationParametersExist = config && config.ActivateQuotes && config.QuoteTypesList && config.QuoteTypesList.length > 0 && Data.GetValue("DocumentType__") !== "";
        let isQuote = configurationParametersExist && new RegExp(Data.GetValue("DocumentType__")).test(config.QuoteTypesList);
        let isChangeOrder = Data.GetValue("SalesDocumentType__") === "ChangeOrder";
        let bDisableCopoFromSplit = g_settings.jsonDataFromSplit ? g_settings.jsonDataFromSplit.disableCopo : false;
        if (!isQuote && !isChangeOrder && !bDisableCopoFromSplit) {
            let copoRuid = Lib.SOP.PORTAL.AcceptPortalOrder();
            if (copoRuid) {
                // Publish the conversation(s) on portal upon order approval
                Lib.SOP.Conversation.TransformExternalConversations(copoRuid);
            }
        }
    }
    Lib.SOP.Helpers.NotifySDA();
    SetSerializedCOP();
    if (currentActionName !== "Archive_Only") {
        SaveShipToNumberMapping();
        SaveSoldToNumberMapping();
        SaveMaterialMapping();
        SaveExternalIdentifierMapping();
        Lib.SOP.QuantityConversion.SaveUoMConversion();
        SaveSpreadsheetMapping();
    }
    else {
        Variable.SetValueAsString("isArchiveOnly", "1");
    }
    Lib.SOP.Salesforce.CreateOrUpdateCase(Lib.SOP.Salesforce.eStages.AtApproval, null);
    CustomerOrderProcessing.Finalization.UserExit.OnFinalizationScriptEnd();
}
//#endregion
Sys.Helpers.Promise.GlobalExceptionOnReject(EntryPoint().then(() => {
    // BAPI managers must be finalized all the time. Leave this call at the end of the script.
    Lib.SOP.SAP.Helpers.FinalizeAllBapiManagers();
}));
//# sourceMappingURL=finalizationscript.js.map