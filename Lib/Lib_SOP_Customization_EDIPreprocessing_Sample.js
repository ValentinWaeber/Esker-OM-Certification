/**
 * SOP Package EDIPreprocessing customization callbacks
 * @namespace Lib.SOP.Customization.EDIPreprocessing
 */

/* LIB_DEFINITION{
  "name": "Lib_SOP_Customization_EDIPreprocessing_Sample",
  "scriptType": "SERVER",
  "comment": "Custom library extending EDI Order preprocessing process on server side",
  "versionable": false,
  "libraryType": "Lib",
  "require": []
}*/

var Lib = Lib || {};
Lib.SOP = Lib.SOP || {};
Lib.SOP.Customization = Lib.SOP.Customization || {};

Lib.SOP.Customization.EDIPreprocessing = (function ()
{
	/**
	 * @lends Lib.SOP.Customization.EDIPreprocessing
	 */
	var customization = {
		/**
		* @description This function is called in the Sys_{EDIFormat}Specifier syslib (e.g. Sys_EDIFACTSpecifier).
		* Each EDI Format type (e.g. X12, EDIFACT, IDOC) has EDI types ("ORDER", "ORDER CONFIRMATION", "ADVANCE SHIP NOTICE"...) which each have a specific syslib.
		* These syslibs contains 2 objects: the specifications and the structure of that EDI type in that EDI format.
		* These 2 objects are used to parse the EDI into JSON that can be given as input to the mapper of that EDI type in that EDI format.
		* This function allows to overwrite the specification object for each combination of EDI format and type.
		* Allows you to customize the EDI specifications used in the EDI Order Preprocessing process.
		* This user exit is called from the EDI Order Preprocessing process, when querying the EDI specifications.
		*
		* @param {object} jsonSpec - The default specifications object (generated using the official documentation for the format)
		* @param {string} EDIFormat - Indicates which specifications needs to be overwritten (e.g. "EDIFACT", "X12", "IDOC"...)
		* @param {string} EDIType - Indicates which structure needs to be overwritten (e.g. "ORDER", "ORDER CONFIRMATION", "ADVANCE SHIP NOTICE"...). If this parameter is not given, it means that the document is an order ("ORDER").
		*
		* @returns {object} An object with the same structure as the input jsonSpec object, but updated to suit your own specific needs.
		* You can update it as you would update any JSON.
		* You don't have to use the input argument.
		* You can build your own object from scratch, as long as you respect the structure.
		*
		* @example
		* 	<pre><code>	// Here is a sample of the specifications object for the EDIFACT Format, for you to see the structure:
		*	var jsonSpec =
		*	{
		*		"BGM": {
		*			"keyForTemplate": "beginningOfMessage",
		*			"description": "Beginning of message",
		*			"fields": {
		*				"BGM_01_C002": {
		*					"description": "Document/Message name",
		*					"keyForTemplate": "documentMessageName",
		*					"subFields": {
		*						"C002_01_1001": {
		*							"description": "Document/Message name, coded",
		*							"keyForTemplate": "documentMessageNameCoded"
		*						},
		*						"C002_02_1131": {
		*							"description": "Code list qualifier",
		*							"keyForTemplate":"codeListQualifier"
		*						},
		*						"C002_03_3055": {
		*							"description": "Code list responsible agency, coded",
		*							"keyForTemplate":"codeListResponsibleAgencyCoded"
		*						},
		*						"C002_04_1000": {
		*							"description": "Document/Message name",
		*							"keyForTemplate":"documentMessageNameSubfield"
		*						}
		*					}
		*				},
		*				"BGM_02_1004": {
		*					"description": "Document/Message number",
		*					"keyForTemplate":"documentNumber"
		*				},
		*				"BGM_03_1225": {
		*					"description": "Message function, coded",
		*					"keyForTemplate": "messageFunctionCoded"
		*				},
		*				"BGM_04_4343": {
		*					"description": "Response type, coded",
		*					"keyForTemplate": "responseTypeCoded"
		*				}
		*			}
		*		}
		*		// and so on...
		*	};
		*
		*	// And this is how you redefine the specifications based on the EDIFormat and EDIType given in input
		*	function UpdateJsonSpecifications(jsonSpec, EDIFormat, EDIType)
		* 	{
		*		if (EDIFormat === "EDIFACT")
		*		{
		*			if (EDIType === "ORDER")
		*			{
		*				// various updates on jsonSpec...
		*			}
		*			else if (EDIType === "ORDER CONFIRMATION")
		*			{
		*				// various updates on jsonSpec...
		*			}
		*			return jsonSpec;
		*		}
		*		else if (EDIFormat === "X12")
		*		{
		*			// and so on...
		*		}
		* 	}</code></pre>
		* 	@example
		* 	This user exit adds an E2REF02 segment to the EDI specifications for IDOC.
		* 	<pre><code>UpdateJsonSpecifications: function (jsonSpec, EDIFormat, EDIType)
		* 	{
		* 	    if (EDIFormat === "IDOC")
		* 	    {
		* 	        jsonSpec["E2REF02"] = {
		* 	            "keyForTemplate": "documentHeaderReferencedDocument",
		* 	            "description": "Document header referenced document",
		* 	            "fields":
		* 	            {
		* 	                "QUALF":
		* 	                {
		* 	                    "description": "Qualifier reference document",
		* 	                    "keyForTemplate": "qualifierReferenceDocument",
		* 	                    "offset": 63,
		* 	                    "length": 3
		* 	                },
		* 	                "BELNR":
		* 	                {
		* 	                    "description": "Document number",
		* 	                    "keyForTemplate": "documentNumber",
		* 	                    "offset": 66,
		* 	                    "length": 35
		* 	                }
		* 	            }
		* 	        };
		* 	        return jsonSpec;
		* 	    }
		* 	}
		* 	</code></pre>
		*/
		UpdateJsonSpecifications: function (jsonSpec, EDIFormat, EDIType)
		{
		},
		/**
		* @description This function is called in the Sys_{EDIFormat}Specifier syslib (e.g. Sys_EDIFACTSpecifier).
		* Each EDI Format type (e.g. X12, EDIFACT, IDOC) has EDI types ("ORDER", "ORDER CONFIRMATION", "ADVANCE SHIP NOTICE"...) which each have a specific syslib.
		* These syslibs contains 2 objects: the specifications and the structure of that EDI type in that EDI format.
		* These 2 objects are used to parse the EDI into JSON that can be given as input to the mapper of that EDI type in that EDI format.
		* This function allows to overwrite the structure object for each combination of EDI format and type.
		* Allows you to customize the EDI structure used in the EDI Order Preprocessing process.
		* This user exit is called from the EDI Order Preprocessing process, when querying the EDI specifications.
		*
		* @param {object} jsonStruct - The default structure object (generated using the official documentation for the format)
		* @param {string} EDIFormat - Indicates which structure needs to be overwritten (e.g. "EDIFACT", "X12", "IDOC"...)
		* @param {string} EDIType - Indicates which structure needs to be overwritten (e.g. "ORDER", "ORDER CONFIRMATION", "ADVANCE SHIP NOTICE"...). If this parameter is not given, it means that the document is an order ("ORDER").
		*
		* @returns {object} An object with the same structure as the input jsonStruct object, but updated to suit your own specific needs.
		* You can update it as you would update any JSON.
		* You don't have to use the input argument.
		* You can build your own object from scratch, as long as you respect the structure.
		*
		* @example
		* 	<pre><code>	// Here is a sample of the structure object for the EDIFACT Format, for you to see the structure:
		*	var jsonstruct =
		*	{
		*			"BGM": {},
		*			"NAD": {},
		*			"DTM": {},
		*			"LIN": {
		*				"PIA": {},
		*				"IMD": {},
		*				"MEA": {},
		*				"QTY": {},
		*				"DTM": {},
		*				"PRI": {},
		*				"ALC": {},
		*				"PCD": {},
		*				"MOA": {}
		*			},
		*			"MOA": {},
		*			"UNB": {},
		*			"UNH": {},
		*			"UNS": {},
		*			"CNT": {},
		*			"UNT": {},
		*			"UNZ": {},
		*			"RFF": {}
		*	};
		*
		*	// And this is how you redefine the specifications based on the EDIFormat and EDIType given in input
		*	function UpdateJsonStructure(jsonStruct, EDIFormat, EDIType)
		* 	{
		*		if (EDIFormat === "EDIFACT")
		*		{
		*			if (EDIType === "ORDER")
		*			{
		*				// various updates on jsonSpec...
		*			}
		*			else if (EDIType === "ORDER CONFIRMATION")
		*			{
		*				// various updates on jsonSpec...
		*			}
		*			return jsonStruct;
		*		}
		*		else if (EDIFormat === "X12")
		*		{
		*			// and so on...
		*		}
		* 	}</code></pre>
		* 	@example
		* 	This user exit adds an E2REF02 segment to the EDI structure for IDOC.
		* 	<pre><code>UpdateJsonStructure: function (jsonStruct, EDIFormat, EDIType)
		* 	{
		* 	    if (EDIFormat === "IDOC")
		* 	    {
		* 	        jsonStruct["E2EDK02"] = {
		* 	            "E2REF02":
		* 	            {}
		* 	        };
		* 	        return jsonStruct;
		* 	    }
		* 	}
		* 	</code></pre>
		*/
		UpdateJsonStructure: function (jsonStruct, EDIFormat, EDIType)
		{
		},
		/**
		* @description This function is called in each EDI Format's Mapper syslib (e.g. Sys_EDIFACTMapper), excepting NSO.
		* This syslib contains a jsonMapping property, that is overwritten by the function's return.
		* This jsonMapping property maps the EDI's parsed content into an object that is given as input to the handlebar's compiled template, to generate a HTML.
		* Allows you to customize the mapper used in the EDI Order Preprocessing process.
		* This user exit is called from the EDI Order Preprocessing process, when mapping the order.
		*
		* @param {object} jsonMapping - The default mapper object
		* @param {string} EDIFormat - Indicates which mapping needs to be overwritten (e.g. "EDIFACT", "X12", "IDOC"...)
		* @param {string} EDItype - Indicates which type of EDI we're dealing with (e.g. "ORDER", "ORDER CONFIRMATION", "ADVANCE SHIP NOTICE"...). If it's not given, it is an order ("ORDER").
		*
		* @returns {object} An object with the same structure as the input jsonMapping object, but updated to suit your own specific needs.
		* You can update it as you would update any JSON.
		* You don't have to use the input argument.
		* You can build your own object from scratch, as long as you respect the structure.
		*
		* @example
		* 	<pre><code>	//Here is a sample of the jsonMapping object in the IDOC mapper, for you to see the structure:
		*	var jsonMappingIDOC = {
		*		soldTo: {
		*			segment: this.partner.segment,
		*			conditions: [{
		*				tag: this.partner.qualifier,
		*				values: ["AG"]
		*			}]
		*		},
		*		shipTo: {
		*			segment: this.partner.segment,
		*			conditions: [{
		*				tag: this.partner.qualifier,
		*				values: ["WE"]
		*			}]
		*		},
		*		buyer: {
		*			segment: this.partner.segment,
		*			conditions: [{
		*				tag: this.partner.qualifier,
		*				values: ["EK"]
		*			}]
		*		},
		*		billTo: {
		*			segment: this.partner.segment,
		*			conditions: [{
		*				tag: this.partner.qualifier,
		*				values: ["RG"]
		*			}]
		*		},
		*		customerPurchaseOrder: {
		*			segment: "documentHeaderReferenceData",
		*			conditions: [{
		*				tag: "qualifierReferenceDocument",
		*				values: ["001", "018", "030", "066"]
		*			}],
		*			formating: function (instance)
		*			{
		*				instance.date.value = EDIMapper.formatDateUs(instance.date.value);
		*				return instance;
		*			}
		*		}
		*		// and so on...
		*	}
		*
		*	// And this is how you redefine the mappings based on the EDIFormat and EDIType given in input
		*	function UpdateJsonMapping(jsonMapping, EDIFormat, EDIType)
		*	{
		*		if (EDIFormat === "EDIFACT")
		*		{
		*			if (EDIType === "ORDER")
		*			{
		*				// various updates on jsonSpec...
		*			}
		*			else if (EDIType === "ORDER CONFIRMATION")
		*			{
		*				// various updates on jsonSpec...
		*			}
		*			return jsonMapping;
		*		}
		*		else if (EDIFormat === "X12")
		*		{
		*			// and so on...
		*		}
		*	}
		*
		*	// How to map address with partner code
		*	function UpdateJsonMapping:(jsonMapping, EDIFormat)
		*	{
		*		jsonMapping.soldTo.formating = function (instance)
		*		{
		*			if (instance.identificationCode.value === '1001')
		*			{
		*				instance['name1'] = {
		*					value: 'Becker Berlin'
		*				};
		*				instance['streetAndHouseNumber1'] = {
		*					value: 'Calvinstrasse 36'
		*				};
		*				instance['postalCode'] = {
		*					value: '13467'
		*				};
		*				instance['city'] = {
		*					value: 'Berlin'
		*				};
		*				instance['region'] = {
		*					value: '11'
		*				};
		*				instance['countryKey'] = {
		*					value: 'DE'
		*				};
		*			}
		*			return instance;
		*		};
		*		return jsonMapping;
		*	}</code></pre>
		*
		*	@example
		*	This user exit updates the shipTo an soldTo segments of the IDOC mapper.
		* 	<pre><code>UpdateJsonMapping: function (jsonMapping, EDIFormat, EDIType)
		* 	{
		* 	    if (EDIFormat === "IDOC")
		* 	    {
		* 	        jsonMapping.soldTo.segment = this.partner.segment;
		* 	        jsonMapping.soldTo.conditions = [
		* 	        {
		* 	            tag: this.partner.qualifier,
		* 	            values: ["AG"]
		* 	        }];
		* 	        jsonMapping.shipTo.segment = this.partner.segment;
		* 	        jsonMapping.shipTo.conditions = [
		* 	        {
		* 	            tag: this.partner.qualifier,
		* 	            values: ["WE"]
		* 	        }];
		*
		* 	        return jsonMapping;
		* 	    }
		* 	}
		* 	</code></pre>
		*/
		UpdateJsonMapping: function (jsonMapping, EDIFormat, EDIType)
		{
		},
		/**
		* @description This function is called in EDI Mapper syslib.
		* This syslib builds a JSON object used to feed the EDI HandleBars template to generate the HTML preview of the EDI order.
		* This function allows to modify this object which is overwritten by the function's return.
		* This user exit is called from the EDI Order Preprocessing process, when mapping the order.
		*
		* @param {object} jsonParsedData - The JSON representation of the EDI order XML
		* @param {object} jsonMappedData - The mapped data built from parsed data to feed the HandleBars template
		* @param {string} EDIFormat - Indicates which mapping needs to be overwritten (e.g. "EDIFACT", "X12", "IDOC"...)
		* @param {string} EDItype - Indicates which type of EDI we're dealing with (e.g. "ORDER", "ORDER CONFIRMATION", "ADVANCE SHIP NOTICE"...). If it's not given, it is an order ("ORDER").
		*
		* @returns {object} The modified mapped data with the same structure as the input jsonMappedData object, but updated to suit your own specific needs.
		* You can update it as you would update any JSON.
		* You can build your own object from scratch, as long as you respect the structure.
		*
		* @example
		* 	<pre><code>	//Here is a sample extracted from a jsonMappedData object built by the NSO mapper, for you to see the structure:
		*
		*	// And this is how you redefine the mappings based on the EDIFormat and EDIType given in input
		*	function UpdateJsonMappedData(jsonparsedData, jsonMappedData, EDIFormat)
		*	{
		*		if (EDIFormat === "NSO")
		*		{
		*			// various updates on jsonMappedData...
		*			return jsonMappedData;
		*		}
		*		else if (EDIFormat === "EDIFACT")
		*		{
		*			if (EDIType === "ORDER")
		*			{
		*				// various updates on jsonSpec...
		*			}
		*			else if (EDIType === "ORDER CONFIRMATION")
		*			{
		*				// various updates on jsonSpec...
		*			}
		*		}
		*	}
		*
		*
		*	@example
		*	This user exit updates adds the end date of the validity period to the mapped data.
		*	The HandleBars template must be customized to use this added field.
		* 	<pre><code>UpdateJsonMappedData: function (jsonParsedData, jsonMappedData, EDIFormat)
		* 	{
		* 	    if (EDIFormat === "NSO")
		* 	    {
		* 			jsonMappedData.validityPeriod.value = {
		* 				"endDate": parsedData["Order.Validity__Period.Period"].instances[0].fields["Period.End_Date.Date"].value
		* 	        };
		* 	        return jsonMappedData;
		* 	    }
		* 	}
		* 	</code></pre>
		*
		* @example This example demonstrates how to add a custom base64 attachment to the process in order to overwrite default human readable preview
		* <pre><code>
		*	function UpdateJsonMappedData(jsonparsedData, jsonMappedData, EDIFormat, EDIType)
		*	{
		*		if (EDIType === "ORDER CONFIRMATION")
		*		{
		*			var base64PDFAttachment = "xxxx"; // you have to explore jsonparsedData to find the place where the custom data has been parsed to.
		*			// fileName is the name of the attached file on the final process, content is a base64 encoded string, extension can be specified with or without a dot (for example, csv or .csv) and is not case-sensitive.
		*			var attachmentList = [
		*				{fileName: "test.pdf", content: base64PDFAttachment, extension: "pdf"}
		*			];
		*			jsonMappedData.customAttachments = attachmentList; // CAUTION: it has to be customAttachments if you want the attachment to replace the default preview document
		*			return jsonMappedData;
		*		}
		*	}
		* </code></pre>
		*/
		UpdateJsonMappedData: function (jsonParsedData, jsonMappedData, EDIFormat, EDIType)
		{
		},
		/**
		* @description This function will be called near the end of the EDIFormat compiled handlebars (e.g. EDIFACT.js).
		* Right before the HTML generation, this function overwrites the compiled handlebars template that generates the final HTML.
		* To avoid having the library completely filled by complex objects, we recommend to put them in your own custom scripts and load them as dependencies.
		* Allows you to customize the Handlebars template used in the EDI Order Preprocessing process to generate HTML files.
		* This user exit is called from the EDI Order Preprocessing process, when generating the HTML file.
		*
		* @param {string} EDIFormat - Indicates which template needs to be overwritten (e.g. "EDIFACT", "X12", "IDOC", "NSO", ...)
		*
		* @returns {object} The templateSpec{EDIFormat} (e.g. templateSpecEDIFACT) object generated by the handlebars compiler
		* JavaScript object containing the Handlebars customization.
		* To get the Handlebars customization code, proceed as follows:
		* 1. Download the Handlebars source code corresponding to the EDI format to customize:
		*  - {@link https://doc.esker.com/Download.asp?file=Solutions/SOP/Downloads/RDSourceFiles/EDI_Templates/IDOC.handlebars|IDOC.handlebars}
		*  - {@link https://doc.esker.com/Download.asp?file=Solutions/SOP/Downloads/RDSourceFiles/EDI_Templates/X12.handlebars|X12.handlebars}
		*  - {@link https://doc.esker.com/Download.asp?file=Solutions/SOP/Downloads/RDSourceFiles/EDI_Templates/EDIFACT.handlebars|EDIFACT.handlebars}
		*  - {@link https://doc.esker.com/Download.asp?file=Solutions/SOP/Downloads/RDSourceFiles/EDI_Templates/NSO.handlebars|NSO.handlebars}
		*  - {@link https://doc.esker.com/Download.asp?file=Solutions/SOP/Downloads/RDSourceFiles/EDI_Templates/IDOC_ORDER_CONFIRMATION.handlebars|IDOC_ORDER_CONFIRMATION.handlebars}
		*  - {@link https://doc.esker.com/Download.asp?file=Solutions/SOP/Downloads/RDSourceFiles/EDI_Templates/IDOC_ADVANCE_SHIP_NOTICE.handlebars|IDOC_ADVANCE_SHIP_NOTICE.handlebars}
		*  - {@link https://doc.esker.com/Download.asp?file=Solutions/SOP/Downloads/RDSourceFiles/EDI_Templates/IDOC_ORDER_CONFIRMATION_EMAIL.handlebars|IDOC_ORDER_CONFIRMATION_EMAIL.handlebars}
		*  - {@link https://doc.esker.com/Download.asp?file=Solutions/SOP/Downloads/RDSourceFiles/EDI_Templates/IDOC_ADVANCE_SHIP_NOTICE_EMAIL.handlebars|IDOC_ADVANCE_SHIP_NOTICE_EMAIL.handlebars}
		* 2. Open the Handlebars file with a text editor.
		* 3. Edit the content to suit your needs. A Handlebars file consists of regular HTML content with embedded Handlebars expressions. A Handlebars expression is surrounded by a pair of {{ }} characters. For more information about the Handlebars language, refer to the Handlebarsjs official website.
		* 4. Download and unzip {@link https://doc.esker.com/Download.asp?file=Solutions/SOP/Downloads/EDIcustomization/SOP_EDI_Handlebars_Compiler.zip|SOP_EDI_Handlebars_Compiler.zip}.
		* 5. Move the modified Handlebars file to the same folder as the compile_handlebars_template.bat compiler.
		* 6. Compile the Handlebars file using the following command:
		* <pre><code>compile_handlebars_template.bat YourEDIformat</code></pre>
		* 7. The compiled Handlebars, named YourEDIformat.js, is created in the generated folder.
		* 8. Open this compiled Handlebars with a text editor to view the customizations. The Handlebars customization code is located in the templateSpecYourEDIformat variable.
		* - The Handlebars customization code can be dense and extensive: store this code in separated variables.
		* To view the HTML output of an Handelbars file, you can download and use IDOC_Handlebars_HTML_output.zip.
		*
		* @example
		* This user exit updates the Handlebars used to generate HTML files for X12 and IDOC documents.
		* 	<pre><code>function GetTemplateSpecEDI(EDIFormat)
		* 	{
		*		if (EDIFormat === "EDIFACT")
		*		{
		*			return
		*			{
		*				// the templateSpec object generated by the handlebars compiler
		*			}
		*		}
		*		else if (EDIFormat === "X12")
		*		{
		*			// and so on...
		*		}
		* 	}</code></pre>
		*/
		GetTemplateSpecEDI: function (EDIFormat)
		{
		},
		/**
		* @description This function allows to overwrite the object containing the data required to create Sales Order Processing process.
		* Notably, you can specify the configuration as well as the OCR options.
		* Allows you to override the process variables submitted to the next process, like the transport variables or the name of the next process.
		* This user exit is called from the EDI Order Preprocessing process, before submitting the order to the Customer Order process.
		*
		* @param {object} jsonNextProcess - The object containing the data required to create the next process
		* @param {object} ediData - The object containing the data extracted from EDI
		*
		* @returns {object} An object with the same structure as the jsonNextProcess argument, but updated to suit your own specific needs.
		* You can update it as you would update any JSON object.
		* You can build your own object from scratch, as long as you return an object with the same structure.
		* You can modify the first argument without returning anything (or null).
		*
		* @example
		* 	<pre><code>	// Here is the way the jsonNextProcess object is defined in the finalization script
		*	var jsonNextProcess = {
		*		name: "Customer Order Processing",
		*		vars: {
		*			EDI_Format__: ediProcessor.getEDITypeString(),
		*			OCROptionOverrideJSON: JSON.stringify({
		*				"pdf-processing": "ocr-pdf",
		*				"pdf-trade-off": "fast",
		*				"ocr-tolerant-word-separation": "50"
		*			})
		*		},
		*		externalVars: {
		*			Configuration: Variable.GetValueAsString("Configuration"),
		*			EDIPreprocessing: "1"
		*		},
		*		attachments: []
		*	};</code></pre>
		*	@example
		*	This user exit modifies the configuration associated with the next process.
		* 	<pre><code>GetNextProcessParameters: function (jsonNextProcess, ediData)
		* 	{
		* 	    jsonNextProcess.externalVars.Configuration = "SOP – EDI"; // configuration name
		* 	}</code></pre>
		*/
		GetNextProcessParameters: function (jsonNextProcess, ediData)
		{
		},
		/**
		* @description This function allows you to change the IDOCString before going through the EDIParsing. To do so, you have to change the bapiJson to add or change the TABLES.INT_EDIDD elements.
		* Allows you to change information received from an IDOC file loaded from SAP or to add information before the EDI file is parsed.
		* This user exit is called from the EDI Order Preprocessing process, before submitting the order to the Customer Order process.
		*
		* @param {object} bapiJson - JavaScript object containing the response of the call to the Z_ESK_IDOC_READ_COMPLETELY BAPI and the values of the SAP TABLES.INT_EDIDD table elements to change or to add.
		*
		* @returns No return value. Change directly the needed value in subkeys of bapiJson.
		*
		* @example
		* This user exit changes the value of the E1EDKA1 segment and adds a new segment for sold-to data.
		*<pre><code>ChangeIDOCSegmentsBeforeEDIStringGeneration: function (bapiJson)
		*{
		*	var segments = bapiJson.TABLES.INT_EDIDD;
		*
		*	//Changing segment value
		*	segments.map(function(segment, index)
		*	{
		*		if(segment.SEGNAM === "E1EDKA1" && segment.SDATA.substring(0,3) === "WE ")
		*		{
		*			// To change value, see https://www.se80.co.uk/saptables/e/e1ed/e1edka1.htm
		*			segment.SDATA = "WE " + Sys.Helpers.String.PadRight(bapiJson.IMPORTS.IDOC_CONTROL.SNDPRN, " ", 17) + segment.SDATA.substring(20);
		*		}
		*	});
		*
		*	//Adding new segment : In this case the sold To
		*	var newSegment = {
		*		"MANDT": segments[0].MANDT,
		*		"DOCNUM": segments[0].DOCNUM,
		*		"SEGNUM": Sys.Helpers.String.PadLeft(segments.length + 1, "0", 6),
		*		"SEGNAM" : "E1EDKA1",
		*		"PSGNUM" : "000000",
		*		"HLEVEL" : "02",
		*		"DTINT" : segments[0].DTINT,
		*		"SDATA" : "AG " //PARVW
		*			 + Sys.Helpers.String.PadRight(bapiJson.IMPORTS.IDOC_CONTROL.SNDPRN, " ", 17) //PARTN
		*			 + Sys.Helpers.String.PadRight(bapiJson.IMPORTS.IDOC_CONTROL.SNDPRN, " ", 17) //LIFNR
		*			 + Sys.Helpers.String.PadRight(" "," ", 646) //unfilled values
		*			 + Sys.Helpers.String.PadRight(bapiJson.IMPORTS.IDOC_CONTROL.SNDPRN, " ", 17)  //IHREZ
		*	};
		*	segments.push(newSegment);
		*}</code></pre>
		*/
		ChangeIDOCSegmentsBeforeEDIStringGeneration: function (bapiJson)
		{
		},

		/**
		* @description This function allows you to change options sent to the mapper in order to format data parsed from the EDI file. Dates and number can be set in the culture passed through and Extra item fields can be shown on the human readable preview generated.
		* Possible values of the options object are: 
		* EDICulture a languagecode-COUNTRYCODE string
		* displayUnmappedItemsFields a boolean toggling the visibility of unmapped line items fields
		* unmappedItemsFieldsList an array of specific unmapped line items fields xpath that we want to display (starting from the node cac:OrderLine). An empty array with displayUnmappedItemsFields set to true display all the fields.
		*
		* @param {object} options - JavaScript object containing options sent to the mapper
		*
		* @returns {object}. An object with the same structure as the options argument, but updated to suit your own specific needs.
		*
		* @example
		* This user exit changes the value of the E1EDKA1 segment and adds a new segment for sold-to data.
		*<pre><code>ChangeMappingOptions: function (options) {
		*	options.EDICulture = "en-US";
		*	options.displayUnmappedItemsFields = true;
		*	options.unmappedItemsFieldsList = ["/cbc:Note[0]", "/cac:LineItem/cbc:PartialDeliveryIndicator", "/cac:LineItem/cbc:AccountingCost"];
		* }</code></pre>
		*/
		ChangeMappingOptions: function (options)
		{
		}
	};
	return customization;
})();