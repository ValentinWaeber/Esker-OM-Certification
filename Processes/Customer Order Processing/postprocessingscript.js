///#GLOBALS Lib Sys
//post processing script
var CustomerOrderProcessing;
(function (CustomerOrderProcessing) {
    let PostProcessing;
    (function (PostProcessing) {
        PostProcessing.UserExit = {
            OnPostProcessingScriptBegin: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.PostProcessing.OnPostProcessingScriptBegin") || {};
            },
            OnPostProcessingScriptEnd: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.PostProcessing.OnPostProcessingScriptEnd");
            },
            ComputeSLA: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.PostProcessing.ComputeSLA") || null;
            },
            UpdateNSOPublishingMappedData: function (orderMappedData) {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.PostProcessing.UpdateNSOPublishingMappedData", orderMappedData) || orderMappedData;
            }
        };
    })(PostProcessing = CustomerOrderProcessing.PostProcessing || (CustomerOrderProcessing.PostProcessing = {}));
})(CustomerOrderProcessing || (CustomerOrderProcessing = {}));
function CreateDelayedPortalOrder() {
    let configuration = Sys.OM.Helpers.GetConfiguration();
    //If waiting for an ACK to create a portal order (EnableERPIntegrationDelay is 1), do not create a Purchase order unless the form is validated from the ERP
    if ((configuration.ERP === "Oracle EBS" || configuration.ERP === "Generic") && configuration.EnableERPIntegrationDelay === "1") {
        if (Data.GetValue("Order_Creation_Error__") === "" && Data.GetValue("Document_ERP_ID__") !== "") {
            let copoRuid = Lib.SOP.PORTAL.AcceptPortalOrder();
            if (copoRuid) {
                // Publish the conversation(s) on portal upon order approval
                Lib.SOP.Conversation.TransformExternalConversations(copoRuid);
            }
        }
    }
}
function getConfigurationDataForSLA(configuration, dataType) {
    try {
        if (["WorkingHoursData", "BankHolidaysData"].indexOf(dataType) === -1) {
            return null;
        }
        let json = JSON.parse(configuration[dataType]);
        // neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking
        if (typeof json !== "object") {
            return null;
        }
        return json;
    }
    catch (e) {
        return null;
    }
}
function isSLAComputable(workingHoursData, startDate, endDate) {
    if (workingHoursData) {
        if (startDate == null || endDate == null) {
            Log.Warn("Could not compute SLA because OrderReceptionDateTime__ or CompletionDateTime is null");
            return false;
        }
        if (startDate.constructor !== Date || endDate.constructor !== Date) {
            Log.Error("Could not compute SLA because OrderReceptionDateTime__ or CompletionDateTime is not a Date object.");
            return false;
        }
        return true;
    }
    Log.Warn("SLA could not be computed because of missing (or unset) Working Hours in configuration");
    return false;
}
function computeElapsedTimeMinutes(elapsedTime) {
    if (elapsedTime.elapsedWorkingTime.totalMilliseconds !== -1) {
        let elapsedTimeMinutes = Math.round(elapsedTime.elapsedWorkingTime.totalMilliseconds / (60 * 1000));
        Log.Info("Updating OrderProcessingDurationInMinutes__ with SLA = " + elapsedTimeMinutes.toString() + " minute(s) = " + elapsedTime.elapsedWorkingTime.asString);
        return elapsedTimeMinutes;
    }
    Log.Warn("Could not compute SLA (therefore OrderProcessingDurationInMinutes__ is -1).");
    return -1;
}
function computeDelayInDays(elapsedTime) {
    if (elapsedTime.delayInDays.totalDays !== -1) {
        let delayInDays = elapsedTime.delayInDays.totalDays;
        Log.Info("Updating OrderProcessingDelayInDays__ with delayInDays = " + delayInDays.toString());
        return parseInt(delayInDays, 10);
    }
    Log.Warn("Could not compute delay in days (therefore OrderProcessingDelayInDays__ is -1).");
    return -1;
}
function getExpectedSLAFromConfiguration() {
    let configuration = Sys.OM.Helpers.GetConfiguration();
    if (configuration.ExpectedSLA && !isNaN(parseInt(configuration.ExpectedSLA, 10))) {
        return parseInt(configuration.ExpectedSLA, 10);
    }
    return -1;
}
function updateOrderSLA(elapsedTimeMinutes, delayInDays) {
    let ruidex = Data.GetValue("RUIDEX");
    let expectedSLA = getExpectedSLAFromConfiguration();
    let updateData = {
        fields: {}
    };
    if (typeof elapsedTimeMinutes === "number") {
        updateData.fields.OrderProcessingDurationInMinutes__ = elapsedTimeMinutes;
    }
    if (typeof delayInDays === "number") {
        updateData.fields.OrderProcessingDelayInDays__ = delayInDays;
    }
    if (Object.keys(updateData.fields).length !== 0) {
        if (typeof expectedSLA === "number" && typeof delayInDays === "number") {
            updateData.fields.SLAMet__ = delayInDays <= expectedSLA;
        }
        Process.UpdateProcessInstanceDataAsync(ruidex, JSON.stringify(updateData));
    }
    else {
        Log.Warn("SLA could not be computed : no valid data available !");
    }
}
function ComputeSLA() {
    let SLAData = CustomerOrderProcessing.PostProcessing.UserExit.ComputeSLA();
    let elapsedTimeMinutes = null;
    let delayInDays = null;
    if (typeof SLAData === "number") {
        elapsedTimeMinutes = SLAData;
    }
    else if (typeof SLAData === "object" && SLAData !== null) {
        if (SLAData.elapsedTimeMinutes && typeof SLAData.elapsedTimeMinutes === "number") {
            elapsedTimeMinutes = parseInt(SLAData.elapsedTimeMinutes, 10);
        }
        if (SLAData.delayInDays && typeof SLAData.delayInDays === "number") {
            delayInDays = parseInt(SLAData.delayInDays, 10);
        }
    }
    let configuration = Sys.OM.Helpers.GetConfiguration();
    let data = {
        WorkingHoursData: getConfigurationDataForSLA(configuration, "WorkingHoursData"),
        BankHolidaysData: getConfigurationDataForSLA(configuration, "BankHolidaysData") || []
    };
    let timezone = configuration.WorkingTimeZone;
    let startDate = Data.GetValue("OrderReceptionDateTime__");
    let endDate = Data.GetValue("CompletionDateTime");
    if (!isSLAComputable(data.WorkingHoursData, startDate, endDate)) {
        return;
    }
    Log.Info("Computing SLA between OrderReceptionDateTime__=" + startDate.toISOString() + " and CompletionDateTime=" + endDate.toISOString());
    let elapsedTime = Lib.SOP.WorkingHours.ComputeElapsedTime(JSON.stringify(data), timezone, startDate, endDate);
    if (elapsedTimeMinutes === null) {
        elapsedTimeMinutes = computeElapsedTimeMinutes(elapsedTime);
    }
    if (delayInDays === null) {
        delayInDays = computeDelayInDays(elapsedTime);
    }
    updateOrderSLA(elapsedTimeMinutes, delayInDays);
}
function NSOPublishing(documentType) {
    try {
        let nextProcess = Process.CreateProcessInstance("SOP System EDI Submission", true);
        let nextProcessVars = nextProcess.GetExternalVars();
        let mapper = new Sys.EDIPublishingMapper.NSO.PublishingMapper(documentType);
        let orderMappedData = Lib.SOP.NSO.getMappedData(mapper);
        orderMappedData = CustomerOrderProcessing.PostProcessing.UserExit.UpdateNSOPublishingMappedData(orderMappedData);
        nextProcessVars.AddValue_String("EDIJsonData", JSON.stringify(orderMappedData), true);
        nextProcessVars.AddValue_String("EDIType", documentType, true);
        nextProcessVars.AddValue_String("RuidEx", Data.GetValue("RuidEx"), true);
        nextProcess.Process();
    }
    catch (e) {
        Log.Error(e.message);
    }
}
function UpdateParentOrder() {
    let jsonDataFromSplit = null;
    if (Lib.SOP.Helpers.IsSplitOrder()) {
        try {
            jsonDataFromSplit = JSON.parse(Lib.SOP.Helpers.GetJsonSplitData());
        }
        catch (e) {
            Log.Error("JsonFromSplitOrder__ cannot be parsed : " + e.message);
            jsonDataFromSplit = null;
        }
    }
    if (jsonDataFromSplit) {
        let parentProcessRUID = Data.GetValue("SourceRUID");
        let orderTransport = Lib.SOP.Helpers.QueryOrderToUpdate(parentProcessRUID);
        let erpId = Data.GetValue("Document_ERP_ID__");
        let subOrderId = jsonDataFromSplit.splitCriteria;
        Lib.SOP.Helpers.UpdateSplittedOrderWithNoErpIntegrationDelay(Process, orderTransport, parentProcessRUID, erpId, subOrderId);
    }
}
let SAP = {
    RetryAttachUrlVariableName: "AttachURLToRetry",
    PostProcessingAlreadyProcessed: "PostProcessingAlreadyProcessed",
    GetDocIdsToRetryAndMoveInTransaction: function (strVariableDocIds) {
        let docIdsToRetry = [];
        let strTransacDocIds = Transaction.Read(SAP.RetryAttachUrlVariableName);
        if (strTransacDocIds) {
            docIdsToRetry = strTransacDocIds.split(",");
        }
        else {
            Transaction.Write(SAP.RetryAttachUrlVariableName, strVariableDocIds);
            docIdsToRetry = strVariableDocIds.split(",");
        }
        return docIdsToRetry;
    },
    RemoveDocToRetryInTransaction: function (newListDocToRetry, docId) {
        let indexDocIdsToRetry = newListDocToRetry.indexOf(docId);
        if (indexDocIdsToRetry !== -1) {
            newListDocToRetry.splice(indexDocIdsToRetry, 1);
        }
        if (newListDocToRetry.length > 0) {
            Transaction.Write(SAP.RetryAttachUrlVariableName, newListDocToRetry.join(","));
        }
        else {
            Transaction.Delete(SAP.RetryAttachUrlVariableName);
        }
    },
    IsRetryNeeded: function () {
        let listDocToRetryNextTime = Transaction.Read(SAP.RetryAttachUrlVariableName);
        if (listDocToRetryNextTime) {
            if ((Process.GetScriptRetryCount() + 1) < Process.GetScriptMaxRetryCount()) {
                return true;
            }
            Log.Error("Maximum number of retries reached. URL still missing on documents : " + listDocToRetryNextTime);
        }
        return false;
    },
    HasPostProcessingNeverBeenProcessed: function () {
        return Transaction.Read(SAP.PostProcessingAlreadyProcessed) !== "true";
    },
    RetryAttachUrl: function () {
        const erpIsSAP = Sys.OM.Helpers.GetConfiguration().ERP === "SAP";
        const erpIsSAPS4Cloud = Sys.OM.Helpers.GetConfiguration().ERP === "SAPS4Cloud";
        if (erpIsSAP || erpIsSAPS4Cloud) {
            let strVariableDocIds = Variable.GetValueAsString(SAP.RetryAttachUrlVariableName);
            if (strVariableDocIds) {
                let docIdsToRetry = SAP.GetDocIdsToRetryAndMoveInTransaction(strVariableDocIds);
                let newListDocToRetry = docIdsToRetry.slice();
                for (let indexDocIdsToRetry = 0; indexDocIdsToRetry < docIdsToRetry.length; indexDocIdsToRetry++) {
                    let docId = docIdsToRetry[indexDocIdsToRetry];
                    if (docId) {
                        Log.Info("Retry AttachUrl " + docId);
                        if (erpIsSAP) {
                            let attachResult = Lib.SOP.SAP.Helpers.AttachUrl(docId, Lib.SOP.SAP.Helpers.GetPostingMode());
                            if (attachResult) {
                                let message = "Retry Attach URL Error for order with id '" + docId + "'";
                                Log.Error(message);
                                Log.Verbose(message + " : " + attachResult);
                            }
                            else {
                                SAP.RemoveDocToRetryInTransaction(newListDocToRetry, docId);
                            }
                        }
                        else if (erpIsSAPS4Cloud) {
                            // Handle S4Cloud async call - the method returns Promise<string> where the string is an error message
                            // We'll handle it by calling the method and letting it manage the retry logic internally
                            Lib.SOP.SAPS4Cloud.AttachUrl(docId).then((errorMessage) => {
                                if (!errorMessage) {
                                    // Success - no error message returned
                                    SAP.RemoveDocToRetryInTransaction(newListDocToRetry, docId);
                                }
                                // Error handling is done inside the AttachUrl method by setting AttachURLToRetry variable
                            }).catch((error) => {
                                // Error handling is done inside the AttachUrl method by setting AttachURLToRetry variable
                                Log.Verbose("AttachUrl promise rejected: " + (typeof error === "string" ? error : JSON.stringify(error)));
                            });
                            // For S4Cloud, we assume the operation might have errors and will be retried
                            // The actual success/failure determination will happen on the next retry cycle
                            // based on the AttachURLToRetry variable that gets set by the AttachUrl method
                        }
                    }
                }
                if (SAP.IsRetryNeeded()) {
                    Transaction.Write(SAP.PostProcessingAlreadyProcessed, "true");
                    if (erpIsSAP) {
                        Lib.SOP.SAP.Helpers.FinalizeAllBapiManagers();
                    }
                    throw "Retry AttachURL";
                }
                else {
                    Transaction.Delete(SAP.PostProcessingAlreadyProcessed);
                    Transaction.Delete(SAP.RetryAttachUrlVariableName);
                }
            }
        }
    }
};
//#region Entry point
//**************************************************************************************************************************
function PostProcessingScriptEntryPoint() {
    // PostProcessing errors are ignored: the order is forced into a validated state
    Process.StateOnLastScriptFailure(100);
    Sys.OM.Helpers.SetConfiguration(Lib.SOP.Configuration.initializeConfigurationServer());
    Lib.SOP.Helpers.CheckIfConfigurationReachable();
    UpdateParentOrder();
    if (SAP.HasPostProcessingNeverBeenProcessed()) {
        ComputeSLA();
        if (CustomerOrderProcessing.PostProcessing.UserExit.OnPostProcessingScriptBegin().stop) {
            return;
        }
        CreateDelayedPortalOrder();
        if (Variable.GetValueAsString("isArchiveOnly") !== "1" && Lib.SOP.Helpers.isOrderNSO() && Sys.OM.Helpers.GetConfiguration().EnableNSO === "1") {
            let isOrderResponseAllowed = Sys.OM.Helpers.GetConfiguration().EnableOrderResponse === "1";
            let isOrderComplete = Data.GetValue("NSOProcessType__") === "Complete";
            if (isOrderResponseAllowed && isOrderComplete) {
                NSOPublishing(Sys.EDIPublishingMapper.NSO.PublishingMapper.DOCUMENT_TYPE_ORDER_RESPONSE);
            }
        }
        if (Data.GetValue("State") === 100 && Variable.GetValueAsString("isArchiveOnly") !== "1" && Sys.OM.Helpers.GetConfiguration().EnableNSO === "1" && Lib.SOP.Helpers.IsNSOPreAgreed(Sys.OM.Helpers.GetConfiguration())) {
            Log.Info("Generate PreAgreed Form");
            let preAgreedProcess = Process.CreateProcessInstance("Pre-agreed order", false, true);
            preAgreedProcess.Process();
        }
        // Handle the case where the order has been rejected from the list of orders to be validated,
        // and the order has been routed from customer inquiries module (SDA). In this case, the validation and finalization scripts are not executed.
        // Therefore, the SDA module must be notified to update the inquiry status.
        if (Data.GetValue("State") === 400) {
            Log.Info("Notify SDA to update the inquiry status");
            Lib.SOP.Helpers.NotifySDA();
        }
        CustomerOrderProcessing.PostProcessing.UserExit.OnPostProcessingScriptEnd();
    }
    SAP.RetryAttachUrl();
}
//#endregion
PostProcessingScriptEntryPoint();
// BAPI managers must be finalized all the time. Leave this call at the end of the script.
Lib.SOP.SAP.Helpers.FinalizeAllBapiManagers();
//# sourceMappingURL=postprocessingscript.js.map