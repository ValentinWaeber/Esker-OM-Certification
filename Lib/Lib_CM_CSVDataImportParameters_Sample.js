/* LIB_DEFINITION{
  "name": "Lib_CM_CSVDataImportParameters_Sample",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "comment": "Custom library extending Lib_CSVDataImportParameters",
  "versionable": false,
  "require": [
    "Sys/Sys"
  ]
}*/
///#GLOBALS Lib Sys
var Lib;
Sys.ExtendLib(Lib, "CM.CSVDataImportParameters", function ()
{
	return {
		Parameters: {
			CsvHasHeader: true,
			FileNamePattern: ".*",
			/* possible values:
			 * "full" - if the csv represent the whole content of the table
			 * "incremental" - if the csv represent a subset of the table */
			ReplicationMode: "full",
			ClearTable: false,
			NoDelete: false,
			NoUpdate: false,
			NoInsert: false,
			FinalizationNotifParams: {
				filter: "(State>=0)",
				includeAttachments: "0",
				processName: "",
				callback: null
			}
		},

		GetErpId: function (fileName)
		{
			Log.Info("Use of custom Lib.CM.CSVDataImportParameters.GetErpId(" + fileName + ")");
			//Useless for orders import
			return "";
		},

		GetTableName: function (fileName)
		{
			Log.Info("Use of custom Lib.CM.CSVDataImportParameters.GetTableName(" + fileName + ")");
			if (fileName && fileName.length > 0)
			{
				var erpId = Sys.Helpers.String.ExtractAfterUntil(fileName, "__", "__");
				if (Sys.Helpers.String.ExtractAfterUntil(fileName, erpId + "__", "__") === "CreditScore")
				{
					return "CM - Credit score__";
				}
				if (Sys.Helpers.String.ExtractAfterUntil(fileName, erpId + "__", "__") === "TaxIdentifier")
				{
					return "CreditScore - Identifier__";
				}
				if (Sys.Helpers.String.ExtractAfterUntil(fileName, erpId + "__", "__") === "Templates")
				{
					return "CM - Templates__";
				}
				if (Sys.Helpers.String.ExtractAfterUntil(fileName, erpId + "__", "__") === "PaymentTerms")
				{
					return "CM - Payment Terms__";
				}
				return "CM - Orders Import__";
			}
			return "";
		},

		GetMappingFile: function (tableName)
		{
			Log.Info("Use of custom Lib.CM.CSVDataImportParameters.GetMappingFile(" + tableName + ")");
			if (tableName === "CM - Credit score__")
			{
				return "mapping_CreditScore.xml";
			}
			if (tableName === "CreditScore - Identifier__")
			{
				return "mapping_CreditScoreIdentifier.xml";
			}
			if (tableName === "CM - Templates__")
			{
				return "mapping_Templates.xml";
			}
			if (tableName === "CM - Payment Terms__")
			{
				return "mapping_CM_PaymentTerms.xml";
			}
			this.Parameters.FinalizationNotifParams.processName = "O2C - Import Finalization";
			this.Parameters.FinalizationNotifParams.filter = "(State>=100)";
			this.Parameters.FinalizationNotifParams.callback = function (notifVars)
			{
				var nextProcessInfos =
				{
					ImportedObjects: "Orders",
					ImportStartDateTime: Data.GetValue("SubmitDateTime")
				};
				var extVars = notifVars.CreateSubNode("ExternalVariables");
				extVars.AddValue_String("UpdateRecordsInfos", JSON.stringify(nextProcessInfos), true);
			};
			return "mapping_CM_Orders.xml";
		},

		GetJSON: function ()
		{
			return this.Parameters;
		},

		GetIdentifier: function ()
		{
			return "CM";
		}
	};
});
