/**
 * SOP Package finalization script customization callbacks
 * @namespace Lib.SOP.Customization.Finalization
 */

/* LIB_DEFINITION{
  "name": "Lib_SOP_Customization_Finalization_Sample",
  "scriptType": "SERVER",
  "comment": "Custom library extending Customer Order Processing finalization script on server side",
  "versionable": false,
  "libraryType": "Lib",
  "require": []
}*/

var Lib = Lib || {};
Lib.SOP = Lib.SOP || {};
Lib.SOP.Customization = Lib.SOP.Customization || {};

Lib.SOP.Customization.Finalization = (function ()
{
	/**
	 * @lends Lib.SOP.Customization.Finalization
	 */
	var customization =
	{
		/**
		* @description This function will be called at the begining of SOP Finalization Script.
		* If needed, use it to customize SOP finalization.
		* Allows you to customize the finalization of the order. This user exit is called from the Generation script of the Customer Order Processing process, at the beginning of the Finalization section.
		*
		* @returns To stop the execution of the finalization section of the generation script: return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution()
		*
		* @example
		* This user exit stops the execution of the finalization of the order.
		* 	<pre><code>function OnFinalizationScriptBegin()
		* 	{
		* 		//Do not execute the SOP Finalization Script.
		* 		return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution();
		* 	}</code></pre>
		*/
		OnFinalizationScriptBegin: function ()
		{
		},

		/**
		* @description This function will be called at the end of SOP Finalization Script.
		* If needed, use it to customize SOP generation.
		* Allows you to perform operations after the order finalization. This user exit is called from the Generation script of the Customer Order Processing process, at the end of the Finalization section.
		* - This user exit is not called if the OnFinalizationScriptBegin user exit stops the execution of the finalization section of the Generation script.
		*
		* @returns No return value expected
		*
		* @example
		* This user exit sends an email with the current order as an EDI file.
		* 	<pre><code>function OnFinalizationScriptEnd()
		* 	{
		*		var ediFile = Lib.PS.EDI.GetEDIFile();//PS function which generates an EDI File of the current process.
		*		Lib.PS.Mailing.SendEDIEmail(ediFile);//PS function which sends an email with the EDI File attached.
		* 	}</code></pre>
		*/
		OnFinalizationScriptEnd: function ()
		{
		},

		/**
		* @description This function will be called at the begining of the publishing in the SOP generation script.
		* If needed, use it to customize SOP publishing.
		* Allows you to customize the posting of the order. This user exit is called from the Generation script of the Customer Order Processing process, at the beginning of the Publishing section.
		*
		* @returns To stop the execution of the publishing section of the generation script: return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution()
		*
		* @example
		* This user exit prevents the execution of the publishing section in the generation script.
		* 	<pre><code>function OnPublishingBegin()
		* 	{
		* 		// disable publishing
		* 		return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution();
		* 	}</code></pre>
		**/
		OnPublishingBegin: function ()
		{
		},

		/**
		* @description Allows to add attachVars in the transport before processing it in the xml publishing
		* It is not called if OnPublishingBegin disables the standard behavior
		* Allows you to add attachment variables to the current transport. This user exit is called from the Generation script of the Customer Order Processing process, at the end of the Publishing section.
		* - This user exit is not called if the OnPublishingBegin user exit stops the execution of the Generation script.
		*
		* @returns No return value expected
		*
		* @example
		* This user exit applies an XSL style sheet to the published XML file.
		*	<pre><code>function SetPublishingAttachmentVars(attachVars)
		*	{
		*		// apply an XSL to the publishing XML
		*		var xslOption = "?xsl=%Templates%\\OrderToEdiFact.xsl";
		*		attachVars.AddValue_String("AttachInputFormat", ".xml", true);
		*		attachVars.AddValue_String("AttachOutputFormat", ".txt", true);
		*		attachVars.AddValue_String("AttachConverterToUse", "Xml2All", true);
		*		attachVars.AddValue_String("AttachType", "inline", true);
		*		attachVars.AddValue_String("AttachStyle", xslOption, true);
		*	}</code></pre>
		**/
		SetPublishingAttachmentVars: function (attachVars)
		{
		},

		/**
		* @description Allows to add, modify or remove fields from the list of fields to be excluded.
		* It is called once the basic list of fields has be set, and it can be customized afterwards in this user exit.
		* Allows you to customize the list of the fields to exclude from publishing. This list is called once the basic list of fields has been set.
		* This user exit is called from the Generation script of the Customer Order Processing process, at the end of the Publishing section before the XML file production.
		* - This user exit is not called if the OnPublishingBegin user exit stops the execution of the Generation script.
		* - You can filter on the sales document type to remove some fields
		*
		* @returns The new array of fields to be excluded
		*
		* @example
		* This user exit excludes the TaxCode__ field from publishing.
		*	<pre><code>function SetFieldsToExcludeForPublishing(fieldsToExclude)
		*	{
		*		if (Data.GetValue("SalesDocumentType__") === "Order")
		*		{
		*			fieldsToExclude.push("TaxCode__");
		*		}
		*		else
		*		{
		*			fieldsToExclude.push("SalesOrderNumber__");
		*		}
		*		return fieldsToExclude;
		*	}</code></pre>
		**/
		SetFieldsToExcludeForPublishing: function (fieldsToExclude)
		{
			return fieldsToExclude;
		},

		/**
		 * @description Allows to add, modify or remove tables columns from the list of columns to be excluded.
		 * See documentation of SetFieldsToExcludeForPublishing for more context.
		 *
		 * @param {Lib.FlexibleFormToXML.TablesRule[]} tableOptions Array of table exclusion rules
		 * @returns The new array of table exclusion rules.
		 *
		 * @example
		 * <pre><code>SetTableFieldsToExcludeForPublishing: function (tableOptions)
		 * for (var i = 0; i < tableOptions.length; i++)
		 * {
		 * 	var currTable = tableOptions[i];
		 * 	var currName = currTable.name;
		 * 	if (currName && currName == "Product_List__")
		 * 	{
		 * 		currTable.excludedColumns.push("Z_ShipDate_Line__");
		 * 		currTable.excludedColumns.push("Z_AuthorizedShip_Line__");
		 * 	}
		 * 	return tableOptions;
		 * }
		 * </code></pre>
		 */
		SetTableFieldsToExcludeForPublishing: function (tableOptions)
		{
			return tableOptions;
		},

		/**
		 * @description Allows to change formatting of XML output file, by including empty fields, resulting in empty XML nodes.
		 * By default empty fields are not sent, unless specified in this function.
		 *
		 * @returns {boolean} true to keep empty fields in resulting output file. Default value: false.
		 */
		KeepEmptyFieldsWhenPublishing: function ()
		{
		},

		/**
		* @description Allows modify the filter when querying the "SO - Sold to address/number mapping__" table.
		* It is called in SaveSoldToNumberMapping function, before calling the Query.
		*
		* @returns The new filter to be applied in query.
		*
		* @example
		*	<pre><code>function CustomizeSaveSoldToNumberMappingQueryFilter(filter)
		*	{
					return "&" + filter + "(SoldToAddress__=" + soldToAddress + ")";
		*	}</code></pre>
		**/
		CustomizeSaveSoldToNumberMappingQueryFilter: function (filter)
		{
			return filter;
		},

		/**
		 * @description Allows to customize the default mapping for the EDIFACT output file.
		 *
		 * @param {object} mapping The default mapping is contained in the variable 'jsonmapping' of Lib_SOP_EDIFACTPublishingMapping.js.
		 * The mapping object maps the EDI segments to fields of the form or custom functions.
		 *
		 * @returns {object} Returns the customized mapping.
		 *
		 * @example
		 * 	<pre><code>function UpdateEDIFACTMapping(mapping)
		 * {
		 * 	// Let's say that we want the Item Number, that is currently in the LIN segment, to be in a PIA segment, and remove it from the LIN segment.
		 * 	var segmentPIA = { // Declaring the segment we'll add.
		 * 		"segmentName": "PIA",
		 * 		"fields": {
		 * 			// The segments and subsegments values (like PIA_01_4347) are from the edifact specifier library, which can also be customized
		 * 			// (see Lib.SOP.Customization.EDIPreprocessing.UpdateJsonSpecifications).
		 * 			"PIA_01_4347": {
		 * 				// The "value" keyword means that we include the variable as is. Here a "5" will be put in the PIA_01_4347 segment.
		 * 				"value": "5"
		 * 			},
		 * 			"PIA_02_C212": {
		 * 				"subfields": {
		 * 					"C212_01_7140": {
		 * 						// The "flxFieldName" keyword means that we include the flexible form value.
		 * 						// Here the item number will be put in the PIA_01_4347 segment.
		 * 						"flxFieldName": "ItemNumber__"
		 * 					},
		 * 					"C212_02_7143": {
		 * 						"value": "SA"
		 * 					},
		 * 					"C212_04_3055": {
		 * 						"value": "91"
		 * 					}
		 * 				}
		 * 			}
		 * 		}
		 * 	};
		 * 	// Remove the field we don't want in LIN by redeclaring the LIN field with only the line numbers inside.
		 *  //
		 * 	// This is a "computed" function.
		 * 	// The return value of this function will be the value put in this segment.
		 * 	// The context with which the function is called is the segment list context.
		 * 	// Most notable things in this context :
		 * 	// * this.segments is the current array of segments;
		 * 	// * this.currentSegment is the segment currently being built (not yet in this.segments);
		 * 	// * * this.currentSegment.segmentName is the segment name (here it would be "LIN")
		 * 	// * * this.currentSegment.value is the segment current value (that we are building).
		 * 	// * this.getSegmentsNames : function that returns an array with the segments names and order
		 * 	//   (aka ["UNB", "UNH", "BGM", etc])
		 * 	//
		 * 	// The function in this "computed" declaration allows us to count the number of line items.
		 * 	var getLineNumber = function(){
		 * 		var segmentList = this.getSegmentsNames().join();
		 * 		return segmentList.split("LIN").length;
		 * 	};
		 *
		 * 	mapping.items.segments[0].fields = {
		 * 		"LIN_01_1082": {
		 * 			// The computed keyword allows us to declare a function.
		 * 			"computed": getLineNumber
		 * 		}
		 * 	};
		 * 	// Add our segment
		 * 	mapping.items.segments.splice(1, 0, segmentPIA);
		 *
		 * 	return mapping;
		 * }</code></pre>
		 *
		 * @example
		 * 	<pre><code>function UpdateEDIFACTMapping(mapping)
		 * {
		 * 	// Now let's make an example where we change the way we format the sales order date : we now want it to always be the forst day of the current month.
		 *
		 * 	// This is a "formatting" function.
		 * 	// * The first argument is always the field contained in flxFieldName or value (In our case : "Sales_Order_Date__").
		 * 	// * The second argument contains the table item in case it's being called inside a flexible line item.
		 * 	//   If we're in a header or footer, it's null.
		 * 	// * The context with which the function is called is the segment list context
		 * 	//   (we'll come back to that).
		 * 	// * Returns: the value that will be added to the segment.
		 * 	// You can find other examples in Lib_SOP_EDIFACTPublishingMapping.
		 * 	var formatDateFirstDayOfMonth = function(dateField, source) {
		 * 		var date = new Date();
		 * 		var year = date.getFullYear();
		 *
		 * 		var month = (1 + date.getMonth()).toString();
		 * 		month = month.length > 1 ? month : '0' + month;
		 *
		 * 		var day = '01';
		 *
		 * 		return year + month + day;
		 * 	};
		 *
		 * 	// This is the DTM segment used to store the sales order date.
		 * 	var newDTMForSalesOrderDate = {
		 * 		"segmentName": "DTM",
		 * 		"fields": {
		 * 			"DTM_01_C507": {
		 * 				"subfields": {
		 * 					"C507_01_2005": {
		 * 						"value": "4"
		 * 					},
		 * 					"C507_02_2380": {
		 * 						"flxFieldName": "Sales_Order_Date__",
		 * 						// The "formatting" keyword references a function.
		 * 						"formatting": formatDateFirstDayOfMonth,
		 * 						// If the "doNotPrintSegmentIfFieldIsNotFilled" keyword is set to true, then the segment (in our case, DTM)
		 * 						// will not be added to the edifact if the field we're currently filling (in our case,
		 * 						// Sales_Order_Date__) is undefined.
		 * 						"doNotPrintSegmentIfFieldIsNotFilled": true
		 * 					},
		 * 					"C507_03_2379": {
		 * 						"value": "102"
		 * 					}
		 * 				}
		 * 			}
		 * 		}
		 * 	};
		 *
		 * 	mapping.headers.segments.splice(5, 1, newDTMForSalesOrderDate);
		 *
		 * 	return mapping;
		 * }</code></pre>
		*/
		UpdateEDIFACTMapping: function (mapping)
		{
		},

		/**
		 * @description Allows to customize the default mapping for the X12 output file.
		 *
		 * @param {object} mapping The default mapping is contained in the variable 'jsonmapping' of Lib_SOP_X12PublishingMapping.js.
		 * The mapping object maps the EDI segments to fields of the form or custom functions.
		 *
		 * @returns {object} Returns the customized mapping.
		 *
		 * @example
		 * 	<pre><code>// In this example, we would like add new segment in output edi file.
		 * // It is the SAC segment for Service, Promotion, Allowance, or Charge Information. It contains constant values for example.
		 * function UpdateX12Mapping(mapping)
		 * {
		 *	var sacSegment = {
		 *		"segmentName": "SAC",
		 *		"fields": {
		 *			"SAC01": {
		 *				"value": "S"
		 *			},
		 *			"SAC03": {
		 *				"value": "AS"
		 *			},
		 *			"SAC04": {
		 *				"value": "RUPLUS"
		 *			}
		 *		}
		 *	};
		 *	mapping.footers.segments.unshift(sacSegment);
		 * 	return mapping;
		 * }
		 *
		 * // As SAC segment do not exist in X12 Specifications, we should update the specifier using user exit UpdateJsonSpecifications and UpdateJsonStructure
		 * // in Lib_SOP_Customization_EDIPreprocessing.
		 * UpdateJsonSpecifications: function (jsonSpec, EDIFormat)
		 * {
		 * 	if (EDIFormat === "X12")
		 * 	{
		 * 		jsonSpec["SAC"] = {
		 * 			"keyForTemplate": "sac",
		 * 			"description": "Service, Promotion, Allowance, or Charge Information",
		 * 			"fields": {
		 * 				"SAC01": {
		 * 					"description": "Allowance or Charge Indicator",
		 * 					"keyForTemplate": "sac01"
		 * 				},
		 * 				"SAC02": {
		 * 					"description": "Service, Promotion, Allowance, or Charge Code",
		 * 					"keyForTemplate": "sac02"
		 * 				},
		 * 				"SAC03": {
		 * 					"description": "Agency Qualifier Code",
		 * 					"keyForTemplate": "sac03"
		 * 				},
		 * 				"SAC04": {
		 * 					"description": "Agency Service, Promotion, Allowance, or Charge Code",
		 * 					"keyForTemplate": "sac04"
		 * 				}
		 * 			}
		 * 		};
		 * 		return jsonSpec;
		 * 	}
		 * }
		 *
		 * UpdateJsonStructure: function (jsonStruct, EDIFormat)
		 * {
		 * 	if (EDIFormat === "X12")
		 * 	{
		 * 		jsonStruct["SAC"] = {};
		 * 		return jsonStruct;
		 * 	}
		 * }</code></pre>
		 */
		UpdateX12Mapping: function (mapping)
		{
		},

		/**
		 * @description Allows to customize the default mapping for the IDOC output file.
		 *
		 * @param {object} mapping The default mapping is contained in the variable 'jsonmapping' of Lib_SOP_IDOCPublishingMapping.js.
		 * The mapping object maps the EDI segments to fields of the form or custom functions.
		 *
		 * @returns {object} Returns the customized mapping.
		 *
		 * @example
		 * <pre><code>UpdateIDOCMapping: function (mapping)
		 * {
		 *  //Get the method that computes indexes in the IDOC instead of rebuilding one
		 *  var computeSegmentIndex = mapping.headers.segments[1].fields.segmentIndex.computed;
		 *
		 * //Define a segment to define the plant in charge
		 * var MyCustomSegment = {
		 * "segmentName" : "E2EDK14",
		 * "fields": {
		 * 	 "segmentIndex": {
		 * 		 "computed": computeSegmentIndex
		 * 		},
		 * 	 "segmentLevel": {
		 * 		 "value": "02"
		 * 		},
		 * 	 "QUALF": {
		 * 		 "value": "004"
		 * 		},
		 * 	 "ORGID": {
		 * 		 "value": Data.GetValue("Z_Plant__")
		 * 		}
		 * 	 }
		 * }
		 *  //insert our new segment at the third place of the mapping
		 *  mapping.headers.segments.splice(3,0,MyCustomSegment);
		 *  return mapping;
		 *}</code></pre>
		 *
		 *@example
		 * <pre><code>UpdateIDOCMapping: function (mapping)
		 * {
		 *  mapping["items"]["segments"][0]["fields"]["MENEE"].flxFieldName = "CustomerUnit__";
		 * }</code></pre>
		 */
		UpdateIDOCMapping: function (mapping)
		{
		},

		/**
		 * @description Allows to customize the EDIFACT separators.
		 *
		 * @param {object} separators The default separators.
		 *
		 * @returns {object} The customized separators.
		 *
		 * @example
		 *  <pre><code>
		 *  // the default separators
		 * 	var defaultSeparators = {
		 *		"segmentTerminator": "'",
		 *		"fieldSeparator": "+",
		 *		"subfieldSeparator": ":",
		 *		"releaseCharacter": "?"
		 * }; </code></pre>
		 *
		 * @example
		 * <pre><code>GetEDIFACTPublishingSeparators: function (separators)
		 * {
		 * 	// You can change every one of them or just some.
		 * 	separators.fieldSeparator = "/";
		 * 	separators.releaseCharacter = "@";
		 * 	return separators;
		 * }</code></pre>
		*/
		GetEDIFACTPublishingSeparators: function (separators)
		{
		},

		/**
		 * @description Allows to customize the X12 separators.
		 *
		 * @param {object} separators The default separators.
		 *
		 * @returns {object} The customized separators.
		 *
		 * @example
		 *  <pre><code>// the default separators
		 * var defaultSeparators = {
		 *	"segmentTerminator": "~",
		 *	"fieldSeparator": "*"
		 * }; </code></pre>
		 *
		 * @example
		 * 	<pre><code>GetX12PublishingSeparators: function (separators)
		 * {
		 * 	// You can change every one of them or just some.
		 * 	separators.segmentTerminator = "µ";
		 * 	separators.fieldSeparator = "§";
		 * 	return separators;
		 * }
		 * </code></pre>
		*/
		GetX12PublishingSeparators: function (separators)
		{
		},
		/**
		 * @description Allows to customize the EDI sender of the UNB segment in the EDIFACT output file. It defaults to 'ESKER'.
		 *
		 * @returns {string} The EDI sender.
		 *
		 * @example
		 * 	<pre><code>GetEDIPublishingSender: function ()
		 * {
		 * 		return 'MYSENDER';
		 * }
		 * </code></pre>
		*/
		GetEDIPublishingSender: function ()
		{
		},
		/**
		 * @description Allows to customize the EDI receiver of the UNB segment in the EDIFACT output file. It defaults to ''.
		 *
		 * @returns {string} The EDI receiver.
		 *
		 * @example
		 * 	<pre><code>GetEDIPublishingReceiver: function ()
		 * {
		 * 		return 'MYRECEIVER';
		 * }
		 * </code></pre>
		*/
		GetEDIPublishingReceiver: function ()
		{
		},
		/**
		 * @description Allows to customize the division of the IDOC. It has to be set in order to have a valid IDOC of an order
		 *
		 * @returns {string} The division on two characters
		 *
		 * @example
		 * 	<pre><code>GetIDOCDivision: function ()
		 * {
		 * 		return Data.GetValue("Z_Division__");
		 * }
		 * </code></pre>
		*/
		GetIDOCDivision: function ()
		{
		},
		/**
		 * @description Allows to customize the distribution channel of the IDOC. It has to be set in order to have a valid IDOC of an order
		 *
		 * @returns {string} The distribution channel on two characters
		 *
		 * @example
		 * 	<pre><code>GetIDOCDistributionChannel: function ()
		 * {
		 * 		return Data.GetValue("Z_DistributionChannel__");
		 * }
		 * </code></pre>
		*/
		GetIDOCDistributionChannel: function ()
		{
		},
		/**
		 * @description Allows to customize the sales organization of the IDOC. It has to be set in order to have a valid IDOC of an order
		 *
		 * @returns {string} The sales organization on four characters
		 *
		 * @example
		 * 	<pre><code>GetIDOCSalesOrganization: function ()
		 * {
		 * 		return Data.GetValue("Z_SalesOrganization__");
		 * }
		 * </code></pre>
		*/
		GetIDOCSalesOrganization: function ()
		{
		},

		/**
		 * @description Allows to customize the encoding of the output file
		 * If you modify the encoding of the file for EDIFACT, you also need to change the field UNB.fields.UNB_01_S001.subfields.S001_01_0001 (ex: UNB.fields.UNB_01_S001.subfields.S001_01_0001.value = "UNOW" for UTF-8)
		 *
		 * @returns {string} encoding - Possible values : "utf8" (Default for XML, EDIFACT and X12 Outputs), "utf8-without-bom" (Default for IDOC Output), "utf16", "b64"
		 *
		 * @example
		 * 	<pre><code>GetEDIOutputEncoding: function ()
		 * {
		 * 		return "utf8-without-bom";
		 * }
		 * </code></pre>
		*/
		GetEDIOutputEncoding: function ()
		{

		},

		/**
		* Allows you to override some fields values in the resulting XML.
		* @returns {Lib.FlexibleFormToXML.fieldValuesMapping} The updated fields values
		* @param { string } lineItemSplitGroupID The current lineItemSplitGroupID. In case of split order, useful to identify the line items grouped for this call.
		* @example
		* <pre><code>
		* GetFieldValuesMapping: function (lineItemSplitGroupID)
		* {
		*	var fieldValuesMapping = {};
		*	var customerNumber = Data.GetValue("CustomerNumber__");
		*	var shipToNumber = Data.GetValue("ShipToNumber__");
		*	fieldValuesMapping.CustomerNumber__ = Sys.Helpers.String.SAP.NormalizeID(customerNumber, 10);
		*	fieldValuesMapping.ShipToNumber__ = Sys.Helpers.String.SAP.NormalizeID(shipToNumber, 10);
		*   var deliveryDate = "";
		*   var productTable = Data.GetTable("Product_List__");
		*	for (var i = 0; i < productTable.GetItemCount(); i++)
		*	{
		*		var productItem = productTable.GetItem(i);
		*		if (productItem.GetValue("LineItemSplitGroupID__") === lineItemSplitGroupID)
		*		{
		*			deliveryDate = productItem.GetValue("Requested_Date__");
		*			break;
		*		}
		*	}
		*	if (deliveryDate)
		*   {
		*		fieldValuesMapping.Due_Date__ = Sys.Helpers.Date.Date2DBDate(deliveryDate);
		*   }
		*	return fieldValuesMapping;
		* }
		* </code></pre>
		*/
		GetFieldValuesMapping: function (lineItemSplitGroupID)
		{
		},

		/**
		 * @description Allows you to customize the output XML file itself. This takes place after the user exits,
		 * GetEDIOutputEncoding(), GetFieldValuesMapping(), and SetFieldsToExcludeForPublishing().
		 * @param { File } tempOrderXml The generated XML file just before it is outputted
		 * @returns { File } The updated XML file
		 * @example
		 * Log xml content to diagnose
		 * <pre><code>CustomizeXMLOutput: function(tempOrderXml)
		 * {
		 * 	 var xmlContent = tempOrderXml.GetContent();
		 * 	 Log.Verbose("[CustomizeXMLOutput] Final XML output: " + xmlContent);
		 * 	 return tempOrderXml;
		 * }
		 * </code></pre>
		 * @example
		 * Rename custom columns
		 * <pre><code>CustomizeXMLOutput: function(tempOrderXml)
		 * {
		 * 	 let xmlContent = tempOrderXml.GetContent();
		 * 	 let xmlDoc = Process.CreateXMLDOMElement(xmlContent);
		 * 	 let nodes = xmlDoc.selectNodes("//Product/Z_Quantity");
		 * 	 if (!Sys.Helpers.IsEmpty(nodes) && nodes.length > 0)
		 * 	 {
		 * 	 	for (let i = 0; i < nodes.length; i++)
		 * 	 	{
		 * 	 		let node = nodes.item(i);
		 * 	 		let newNode = xmlDoc.createElement("Quantity");
		 * 	 		newNode.text = node.text;
		 * 	 		node.parentNode.replaceChild(newNode, node);
		 * 	 	}
		 * 	 }
		 * 	 let tempFile = TemporaryFile.CreateFile("xml", "utf8");
		 * 	 TemporaryFile.Append(tempFile, "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n");
		 * 	 TemporaryFile.Append(tempFile, xmlDoc.xml);
		 * 	 return tempFile;
		 * }
		 * </code></pre>
		 */
		CustomizeXMLOutput: function (tempOrderXml)
		{
			return tempOrderXml;
		},

		/**
		 * @description Allows you to customize the output EDI file itself. This takes place after the user exits,
		 * GetEDIOutputEncoding(), GetFieldValuesMapping(), and SetFieldsToExcludeForPublishing().
		 * @param { File } tempOrderEdi The generated EDI file just before it is outputted
		 * @param { string } ediFormat The EDI file format : 'EDIFACT - ORDERS D96A', 'ANSI X12 - EDI 850' or 'IDOC'
		 * @returns { File } The updated EDI file
		 * @example
		 * <pre><code>
		 * CustomizeEDIOutput: function(tempOrderEdi)
		 * {
		 * 	 var ediContent = tempOrderEdi.GetContent();
		 *   Log.Verbose("[CustomizeEDIOutput] Final EDI output: " + ediContent);
		 * 	 return tempOrderEdi;
		 * }
		 * </code></pre>
		 */
		CustomizeEDIOutput: function (tempOrderEdi, ediFormat)
		{
			return tempOrderEdi;
		},

		/**
		* @description This function will be called at the end of SOP Finalization Script.
		* If needed, use it to deactivate saving of mapping into table 'SO - Ship to address/number mapping__'.
		*
		* @returns To skip saving extracted ship-to address/ship-to number mapping: return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution()
		*
		* @example
		* This user exit skips saving extracted ship-to address/ship-to number mapping.
		* 	<pre><code>function OnSaveShipToNumberMapping()
		* 	{
		* 		// Skips saving extracted ship-to address/ship-to number mapping
		* 		return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution();
		* 	}</code></pre>
		*/
		OnSaveShipToNumberMapping: function ()
		{
		},

		/**
		* @description This function will be called at the end of SOP Finalization Script.
		* If needed, use it to deactivate saving of mapping into table 'SO - Sold to address/number mapping__'.
		*
		* @returns To skip saving extracted sold-to address/sold-to number mapping: return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution()
		*
		* @example
		* This user exit skips saving extracted sold-to address/sold-to number mapping.
		* 	<pre><code>function OnSaveSoldToNumberMapping()
		* 	{
		* 		// Skips saving extracted sold-to address/sold-to number mapping
		* 		return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution();
		* 	}</code></pre>
		*/
		OnSaveSoldToNumberMapping: function ()
		{
		},

		/**
		* @description This function will be called at the end of SOP Finalization Script.
		* If needed, use it to deactivate saving of mapping into table 'SO - Customer material mapping autolearn__'.
		*
		* @returns To skip saving extracted customer material/ERP material mapping: return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution()
		*
		* @example
		* This user exit skips saving extracted customer material/ERP material mapping.
		* 	<pre><code>function OnSaveMaterialMapping()
		* 	{
		* 		// Skips saving extracted customer material/ERP material mapping
		* 		return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution();
		* 	}</code></pre>
		*/
		OnSaveMaterialMapping: function ()
		{
		},

		/**
		* @description This function will be called at the end of SOP Finalization Script.
		* If needed, use it to deactivate saving of mapping into table 'SO - External partner identifier mapping__'.
		*
		* @returns To skip saving extracted external partner identifier/ERP partner number mapping: return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution()
		*
		* @example
		* This user exit skips saving extracted external partner identifier/ERP partner number mapping.
		* 	<pre><code>function OnSaveExternalIdentifierMapping()
		* 	{
		* 		// Skips saving extracted external partner identifier/ERP partner number mapping
		* 		return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution();
		* 	}</code></pre>
		*/
		OnSaveExternalIdentifierMapping: function ()
		{
		},

		/**
		 * @description This function will be called during order publishing and allows to replace the default SFTP copy file by a custom process or transport.
		 * Use Process.CreateTransport or Process.CreateProcessInstance API to obtain resulting xTransport object.
		 *
		 * @param {boolean} asChild Boolean value. Indicates whether the process should be created as linked to the current process or not.
		 * @returns {xTransport} A new instance of a process or transport as an xTransport object.
		 *
		 * @example
		 * <pre><code>CreatePublishingProcessInstanceOrTransport: function (asChild)
		 * {
		 * 	return Process.CreateProcessInstance("Z_CustomOrderPublishing__", asChild);
		 * }</code></pre>
		 */
		CreatePublishingProcessInstanceOrTransport: function (asChild)
		{
		},

		/**
		 * @description This function will be called during publishing, before attach the output file to CopyFile transport.
		 * Use it to rename output file or add attachements on output transport. You can replace standard attach method or not.
		 *
		 * @param {xTransport} transport CopyFile created for each output
		 * @param {File} tempOrderOutputFile XML file generated for publishing
		 * @param {string} finalXmlOutputName expected output file name
		 * @param {string[]} lineItemSplitArray grouping criteria values
		 * @param {number} indexSplit current index of splitting group
		 * @returns To stop the execution of the standard output attach section of the generation script: return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution()
		 *
		 * @example Rename XML output file
		 * <pre><code>AttachOutputFile: function (transport, tempOrderOutputFile, finalXmlOutputName, lineItemSplitArray, indexSplit)
		 * {
		 * 	let prefix = "CustomPrefix";
		 * 	let suffix = "Part" + lineItemSplitArray[indexSplit];
		 * 	let id = Data.GetValue("RUIDEX").replace(/.*\./, "");
		 * 	let customXmlOutputName = finalXmlOutputName.replace(/Order\d+_?\d?/, prefix + id + suffix);
		 * 	let newAttachVars = transport.AddAttachEx(tempOrderOutputFile).GetVars();
		 * 	newAttachVars.AddValue_String("AttachOutputName", customXmlOutputName, true);
		 * 	newAttachVars.AddValue_String("AttachToDisplay", "converted", true);
		 * 	return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution();
		 * }</code></pre>
		 *
		 * @example Add attachements to CopyFile for each output
		 * <pre><code>AttachOutputFile: function (transport, tempOrderOutputFile, finalXmlOutputName, lineItemSplitArray, indexSplit)
		 * {
		 * 	let nbAttach = Attach.GetNbAttach();
		 * 	for (let i = 0; i < Attach.GetNbAttach(); i++)
		 * 	{
		 * 		let attachFile = Attach.GetConvertedFile(i) || Attach.GetInputFile(i);
		 * 		if (attachFile.GetExtension().toUpperCase() === ".XML")
		 * 		{
		 * 			continue;
		 * 		}
		 * 		let attachFileVars = transport.AddAttachEx(attachFile).GetVars();
		 * 		attachFileVars.AddValue_String("AttachOutputName", finalXmlOutputName + "_" + i, true);
		 * 	}
		 * }</code></pre>
		 */
		AttachOutputFile: function (transport, tempOrderOutputFile, finalXmlOutputName, lineItemSplitArray, indexSplit)
		{
		},

		/**
		* @description This function will be called at the begining of SOP Portal finalization script.
		* If needed, use it to customize SOP Portal finalization.
		*
		* @returns To stop the execution of the finalization script: return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution()
		*
		* @example
		* This user exit skip standard finalization.
		*<pre><code>function OnPortalFinalizationScriptBegin()
		*{
		*	return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution();
		*}</code></pre>
		**/
		OnPortalFinalizationScriptBegin: function ()
		{
		},

		/**
		* @description This function will be called at the end of SOP Portal finalization script.
		* If needed, use it to customize SOP Portal finalization.
		* This user exit is not called if the OnPortalFinalizationScriptBegin user exit stops the execution of the finalization script.
		*
		* @returns No return value expected
		**/
		OnPortalFinalizationScriptEnd: function ()
		{
		},

		/**
		* @description This function will be called just after updating an order upon receiving an ERP acknowledgement.
		* If needed, use it for custom operations that need to be executed after updating the order.
		*
		* @param {xTransport} orderTransport The transport object of the order that has been updated
		* @param {File} orderVars The variables of the order that has been updated
		* @returns No return value expected
		**/
		OnUpdateOrderEnd: function (orderTransport, orderVars)
		{
		},

		/**
		* @description This function will be called before set annotation parameters.
		* You might want to modify the annotation parameters present in the annotationParams variable.
		*
		* @param {object} annotationParams The annotation parameters
		* @returns No return value expected
		* @example This user exit sets the annotation parameters.
		* <pre><code>function OnSetAnnotationParams(annotationParams)
		*{
		*	annotationParams.FlattenAnnotations = false;		// false: do not flatten annotations, true: flatten annotations, default value: false
		*	annotationParams.FlattenNotes = false;				// false: do not flatten notes, true: flatten notes, default value: false
		*	annotationParams.OnlyKeepFlattenDocument = false;	// false: do not discard original document, true: keep just annotated document, default value: false
		*	annotationParams.DiscardedAttach = [".eml"];		// array of attachment file extensions to discard, default value: [".eml"]
		*}</code></pre>
		**/
		OnSetAnnotationParams: function (annotationParams)
		{
		},

		/**
		* @description This function will be called after node mapping creation for xml output.
		* You can modify and return the node mapping object given in parameter.
		*
		* @param {object} nodeMappings node mapping
		* @returns Return you modified/new node mapping
		* @example This user exit modify the node mapping.
		* <pre><code>function CustomizePublishingNodeMappings(nodeMappings)
		*{
		*	nodeMappings["Due_Date__"] = "Z_Due_Date__";
		*	nodeMappings["DocumentType__"] = "Z_Order_Type";
		*	nodeMappings["Business_area__"] = "Division";
		*}</code></pre>
		**/
		CustomizePublishingNodeMappings: function (nodeMappings)
		{
		},
	};
	return customization;
})();
