///#GLOBALS Lib Sys
var CustomerOrderProcessing;
(function (CustomerOrderProcessing) {
    // Call the function and use its return value to set system flags.
    const processEmail = Lib.SOP.Configuration.ShouldProcessEmailWithChatGPT(Attach);
    if (processEmail) {
        Log.Info("[Preextractionscript] ChatGPT is enabled for processing. Auto-learning is disabled.");
        Data.SetValue("DisableAutoLearning", "true");
    }
    Variable.SetValueAsString("ShouldExtractWithGPT", processEmail ? "1" : "0");
})(CustomerOrderProcessing || (CustomerOrderProcessing = {}));
//# sourceMappingURL=preextractionscript.js.map