/* LIB_DEFINITION{
  "name": "Lib_AR_CSVDataImportParameters_Sample",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "comment": "Custom library extending Lib_CSVDataImportParameters",
  "versionable": false,
  "require": [
    "Sys/Sys",
    "Sys/Sys_AR"
  ]
}*/
///#GLOBALS Lib Sys
var Lib;
Sys.ExtendLib(Lib, "AR.CSVDataImportParameters", function ()
{
	Sys.AR.NeedConfiguration = false;

	var needCreateImportFinalization = Sys.AR.GetParameter("EnableCreditApplication", false) || Sys.AR.GetParameter("SendWelcomeEmailOnImport", false);
	return {
		Parameters: {
			CsvHasHeader: true,
			FileNamePattern: ".*",
			/* possible values:
			 * "full" - if the csv represent the whole content of the table
			 * "incremental" - if the csv represent a subset of the table */
			ReplicationMode: "full",
			ClearTable: false,
			NoDelete: true,
			NoUpdate: false,
			NoInsert: false,
			FinalizationNotifParams: needCreateImportFinalization ? {
				filter: "(State>=100)",
				includeAttachments: "0",
				processName: "O2C - Import Finalization",
				callback: function (notifVars)
				{
					var nextProcessInfos =
					{
						ImportedObjects: "Customers",
						ImportStartDateTime: Data.GetValue("SubmitDateTime")
					};
					var extVars = notifVars.CreateSubNode("ExternalVariables");
					extVars.AddValue_String("UpdateRecordsInfos", JSON.stringify(nextProcessInfos), true);
				}
			} : {}
		},

		GetErpId: function (fileName)
		{
			Log.Info("Use of custom Lib.AR.CSVDataImportParameters.GetErpId(" + fileName + ")");
			//Useless for customers import
			return "";
		},

		GetTableName: function (fileName)
		{
			Log.Info("Use of custom Lib.AR.CSVDataImportParameters.GetTableName(" + fileName + ")");
			return "ODUSER";
		},

		GetMappingFile: function (tableName)
		{
			Log.Info("Use of custom Lib.AR.CSVDataImportParameters.GetMappingFile(" + tableName + ")");
			return "mapping_customers.xml";
		},

		GetJSON: function ()
		{
			return this.Parameters;
		},

		GetIdentifier: function ()
		{
			return "AR";
		}
	};
});