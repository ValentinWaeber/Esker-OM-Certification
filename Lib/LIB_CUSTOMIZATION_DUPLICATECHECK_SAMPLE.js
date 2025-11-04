/* LIB_DEFINITION{
  "name": "LIB_CUSTOMIZATION_DUPLICATECHECK_SAMPLE",
  "scriptType": "COMMON",
  "libraryType": "Lib",
  "comment": "Customization library for duplicate check feature",
  "versionable": false,
  "require": []
}*/
/**
 * @namespace Lib.Customization.DuplicateCheck
 */
var Lib;
(function (Lib) {
    var Customization;
    (function (Customization) {
        var DuplicateCheck;
        (function (DuplicateCheck) {
            /**
             * @method Lib.Customization.DuplicateCheck.CustomizeDuplicateCheckFilter
             * @description Customize duplicate check filter
             * @param {string} filter The default filter of the duplicate check feature
             * @param {DuplicateCheckFilterOptions} options The options object of the duplicate check
             * @return {string} A customized filter for duplicate check
             * @example
             * A simple html footer
             * <pre><code>
             * CustomizeDuplicateCheckFilter: function (filter)
             * {
             * 		// Add company code to duplicate check filter
             * 		var companyCode = Data.GetValue("CompanyCode__");
             * 		filter += `(CompanyCode__=${companyCode})`;
             * 		return filter;
             * }
             * </code></pre>
             */
            DuplicateCheck.CustomizeDuplicateCheckFilter = function (filter, options) {
                return;
            };
            /**
             * @method Lib.Customization.DuplicateCheck.CustomizeDuplicateCheckOptions
             * @description Customize duplicate check options, like the fields that are used to detect a duplicate
             * @param {DuplicateCheckFilterOptions} options The options object of the duplicate check
             * @return {DuplicateCheckFilterOptions} The custom options for the duplicate check
             * @example
             * <pre><code>
             * CustomizeDuplicateCheckOptions: function (options)
             * {
             *		// Check that current process is Vendor invoice
             *		if ((Sys.ScriptInfo.IsClient() && Process.GetName() === "Vendor invoice")
             *			|| (Sys.ScriptInfo.IsServer() && Data.GetValue("ProcessId") === Process.GetProcessID("Vendor invoice")))
             *		{
             *			// Do not use InvoiceAmount as duplicate check criteria
             *			options.ControlsToCheck = ["InvoiceNumber__", "InvoiceDate__"];
             *		}
             *
             *		// Override the CallBack function
             *		var originalCallBack = options.CallBack;
             *		options.CallBack = function (duplicateList)
             *		{
             *			var atLeastOneDuplicatePosted = duplicateList.some(duplicate =>
             *			duplicate.additionalAttributes.InvoiceStatus__ === "To pay" ||
             *			duplicate.additionalAttributes.InvoiceStatus__ === "Paid");
             *
             *			Data.SetValue("Z_DuplicateInvoiceMightBePosted__", atLeastOneDuplicatePosted);
             *			originalCallBack(duplicateList);
             *		}
             *		return options;
             * }
             * </code></pre>
             */
            DuplicateCheck.CustomizeDuplicateCheckOptions = function (options) {
                return;
            };
        })(DuplicateCheck = Customization.DuplicateCheck || (Customization.DuplicateCheck = {}));
    })(Customization = Lib.Customization || (Lib.Customization = {}));
})(Lib || (Lib = {}));
//# sourceMappingURL=LIB_CUSTOMIZATION_DUPLICATECHECK_SAMPLE.js.map