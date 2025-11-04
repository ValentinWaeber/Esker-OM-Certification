///#GLOBALS Lib Sys
/*
/* eslint no-empty-function: "off", no-unused-vars: "off" */
/* LIB_DEFINITION{
  "name": "LIB_CUSTOM_INBOUNDCHANNELPREPROCESSING_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "COMMON",
  "comment": "Custom preprocessing Library",
  "require": [],
  "versionable": false
}*/
/*
Preprocessing Customization.
JSON Structure :
{
	"transports": [                                     // List of processes to be created
	{
		"name": "Customer Order Processing",            // Name of the process to be created. By default, name of the process associated with the inbound channel.
		"vars":                                         // Process variables.
		{
			"FromAddress": "esker@esker.fr",            // Sender email address set by the inbound channel.
			"ToName": "Esker",                          // Sender name set by the inbound channel.
			"pdfNormalizeFilter": ""                    // Filter used to normalize the PDF file.
		},
		"externalVars":                                 // External variables for the process.
		{
		},
		"attachments": [                                // List containing the document to process and the process attachments.
		{
			"vars":
			{
				"AttachOutputName": "SO_US_TMC_350",    // File name without the extension. "OriginalMessage" for email body.
				"AttachOutputFormat": ".pdf",           // Attachment output file format.
				"AttachToProcess": "1",                 // Define as document to process.
				"AttachConvertOptions": ""              // Conversion options.
			},
			"attachFile": "D:\\APPS\\EDP\\localStorage\\queue\\attach\\20160204\\11\\efbff440R48c0000.pdf"  // File path
		}]
	}]
}
*/
var Lib = Lib ||
	{};
Lib.Custom = Lib.Custom ||
	{};
Lib.Custom.InboundChannelPreprocessing = (function ()
{
	// List of custom processing functions
	var functions = {
		// This custom processing changes the orientation to landscape for text documents converted to PDF
		"Landscape orientation for text to PDF conversion": function (inputJSON)
		{
			Log.Warn("TxtLandscape - Custom Rule Implementation");
			for (var process in inputJSON.transports)
			{
				for (var attach in inputJSON.transports[process].attachments)
				{
					var attachment = inputJSON.transports[process].attachments[attach];
					var fileAttached = attachment.attachFile;
					var fileExtension = fileAttached.split('.').pop().toLowerCase();
					if (fileExtension === 'txt' && attachment.vars.AttachOutputFormat === ".pdf")
					{
						inputJSON.transports[process].attachments[attach].vars["AttachConvertOptions"] = "?format=a4landscape";
					}
				}
			}
			return inputJSON;
		},
		// This custom processing changes the font size for text documents converted to PDF
		"Use an 8pt font size for text to PDF conversion": function (inputJSON)
		{
			Log.Warn("TxtLandscape - Custom Rule Implementation");
			for (var process in inputJSON.transports)
			{
				for (var attach in inputJSON.transports[process].attachments)
				{
					var attachment = inputJSON.transports[process].attachments[attach];
					var fileAttached = attachment.attachFile;
					var fileExtension = fileAttached.split('.').pop().toLowerCase();
					if (fileExtension === 'txt' && attachment.vars.AttachOutputFormat === ".pdf")
					{
						inputJSON.transports[process].attachments[attach].vars["AttachConvertOptions"] = "?FontSize=8";
					}
				}
			}
			return inputJSON;
		},
		// This custom processing converts the first PDF attachment into the A4 format
		"Change First PDF Format To A4": function (inputJSON)
		{
			for (var process in inputJSON.transports)
			{
				inputJSON.transports[process].vars["PDFCommands"] = "-resize %infile[1]% ALL -stretch -center A4"
			}
			return inputJSON;
		},
		// This custom processing excludes attachments that do not need to be processed 
		"Remove unprocessed documents": function (inputJSON)
		{
			Log.Warn("Remove unprocessed documents");
			for (var process in inputJSON.transports)
			{
				var processedAttachments = [];
				for (var attach in inputJSON.transports[process].attachments)
				{
					var attachment = inputJSON.transports[process].attachments[attach];
					if (attachment.vars.AttachToProcess === "1")
					{
						processedAttachments[processedAttachments.length] = attachment;
					}
				}
				inputJSON.transports[process].attachments = processedAttachments;
			}
			return inputJSON;
		},
		// This custom processing indicates that the file to process is the attachment with name containing order and/or .pdf (case-insensitive)
		"Guess best attachment for order processing": function (inputJSON)
		{
			Log.Warn("Guess best attachment for order processing");
			var scores = new Array();
			var bestScore = 0;
			var attachToBeProcessed = 0;
			for (var process in inputJSON.transports)
			{
				for (var attach in inputJSON.transports[process].attachments)
				{
					var score = 0;
					if (inputJSON.transports[process].attachments[attach].vars["AttachOutputName"].toUpperCase().indexOf("ORDER") > -1)
					{
						score++;
					}
					if (inputJSON.transports[process].attachments[attach].attachFile.toUpperCase().indexOf(".PDF") > -1)
					{
						score++;
					}
					scores[attach] = score;
				}
				for (var i in scores)
				{
					if (scores[i] > bestScore)
					{
						bestScore = scores[i];
						attachToBeProcessed = i;
					}
				}
				for (var attach in inputJSON.transports[process].attachments)
				{
					if (attach == attachToBeProcessed)
					{
						inputJSON.transports[process].attachments[attach].vars["AttachToProcess"] = "1";
						Log.Info("ProcessBestAttachment - Process " + inputJSON.transports[process].attachments[attach].vars["AttachOutputName"]);
					}
					else
					{
						inputJSON.transports[process].attachments[attach].vars["AttachToProcess"] = "0";
					}
				}
			}
			return inputJSON;
		},
		// This custom processing returns null and does not process the email if the sender address is not matching with a registered user identifier.
		"Do not process email if sender is unknown": function (inputJSON)
		{
			Log.Warn("Do not process email if sender is unknown");
			for (var process in inputJSON.transports)
			{
				var transport = inputJSON.transports[process];
				Log.Info("Check if " + transport.vars.FromAddress + " exist");
				var sender = Sys.Helpers.Globals.Users.GetUser(transport.vars.FromAddress);
				if (sender == null)
				{
					Log.Warn("User : " + transport.vars.FromAddress + " does not exist so do not process the email");
					//Puts the process on Failed (optional)
					Data.SetValue("State", 200);
					//Returns null not to process the email
					return null;
				}
				else
				{
					return inputJSON;
				}
			}
			return inputJSON;
		},
		// This custom processing converts an Excel file (XLS or XLSX) into a CSV file.
		"Convert Excel to CSV": function (inputJSON)
		{
			Log.Warn("Convert Excel to CSV - Custom Rule Implementation");
			for (var process in inputJSON.transports)
			{
				for (var attach in inputJSON.transports[process].attachments)
				{
					var attachment = inputJSON.transports[process].attachments[attach];
					var fileAttached = attachment.attachFile;
					var fileExtension = fileAttached.split('.').pop().toLowerCase();
					if (fileExtension === 'xls' || fileExtension === 'xlsx')
					{
						inputJSON.transports[process].attachments[attach].vars["AttachOutputFormat"] = ".csv";
					}
				}
			}
			return inputJSON;
		}
	};

	return {
		functions: functions
	};
})();