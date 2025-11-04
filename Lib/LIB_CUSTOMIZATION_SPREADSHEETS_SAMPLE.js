/* LIB_DEFINITION{
  "name": "LIB_CUSTOMIZATION_SPREADSHEETS_SAMPLE",
  "scriptType": "COMMON",
  "libraryType": "Lib",
  "comment": "Customization library for spreadsheet",
  "versionable": false,
  "require": []
}*/
/**
 * @namespace Lib.Customization.Spreadsheet
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var Lib;
(function (Lib) {
    let Customization;
    (function (Customization) {
        let Spreadsheets;
        (function (Spreadsheets) {
            /**
             * @method Lib.Customization.Spreadsheet.GetCsvCulture
             * @description
             * Function called when we fill form from CSV using "Load from clipboard" or "Extract from CSV file" feature (custom script and extraction script)
             * For example, it is useful if your user culture is set to French and you are working with CSV formatted as en-US.
             * @returns {string} Culture to be used for data formatting
             * @example <pre><code>
                GetCsvCulture: function ()
                {
                    return "en-US";
                }
                </pre></code>
             */
            function GetCsvCulture() {
            }
            Spreadsheets.GetCsvCulture = GetCsvCulture;
        })(Spreadsheets = Customization.Spreadsheets || (Customization.Spreadsheets = {}));
    })(Customization = Lib.Customization || (Lib.Customization = {}));
})(Lib || (Lib = {}));
//# sourceMappingURL=Lib_Customization_Spreadsheets_Sample.js.map