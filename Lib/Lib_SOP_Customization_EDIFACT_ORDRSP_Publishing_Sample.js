/**
 * SOP Package EDIFACT Publishing customization callbacks (for documents other than orders)
 * @namespace Lib.SOP.Customization.EDIFACTPublishing
 */

/* LIB_DEFINITION{
  "name": "Lib_SOP_Customization_EDIFACT_ORDRSP_Publishing_Sample",
  "scriptType": "SERVER",
  "comment": "Custom library extending EDIFACT publishing on server side",
  "versionable": false,
  "libraryType": "Lib",
  "require": []
}*/

var Lib = Lib || {};
Lib.SOP = Lib.SOP || {};
Lib.SOP.Customization = Lib.SOP.Customization || {};
Lib.SOP.Customization.EDIFACTPublishing = Lib.SOP.Customization.EDIFACTPublishing || {};

/**
 * @namespace Lib.SOP.Customization.EDIFACTPublishing.ORDRSP
 */
Lib.SOP.Customization.EDIFACTPublishing.ORDRSP = (function ()
{
	/**
	 * @lends Lib.SOP.Customization.EDIFACTPublishing.ORDRSP
	 */
	var customization = {
		/**
		 * @description Allows to modify or add fields in the json that need to be updated on the Outbound EDI transaction process following the reception of an EDI notification.
		 * This customization is mandatory. If not given, the field will be filled with "ESKER" and with the code qualifier "ZZZ".
		 *
		 * @param {Array.<{name: string, value: string}>} subfields array of subfield descriptors.
		 * 	Each subfield descriptor is an object having members
		 * 		"name" member containing the name of the subfield (free format)
		 * 		"value" member to be filled with the value of the subfield, this value will be put in the EDIFACT line
		 *
		 * 	The array contains all the subfields specified in syntax version 3 of EDIFACT segment UNB (https://www.stylusstudio.com/edifact/30000/UNB_.htm),
		 *  and is defined in the library Lib_SOP_EDIFACT_ORDRSPPublishingMapping.
		 *  If you want to use another version of EDIFACT, you must modify the mapping in this library.
		 *
		 *  The resulting array must be ordered as specified in the used version of EDIFACT specification.
		 * 	The unused conditional fields must not be present.
		 *
		 * Subfields:
		 * "S002_01_0004": Sender identification
		 * "S002_02_0007": Partner identification code qualifier
		 * "S002_03_0008": Address for reverse routing
		 *
		 * @param {object} json the data mapped from the incoming EDI
		 *
		 * @returns subfields the modified subfields
		 *
		 * @example
		 * 	<pre><code>setInterchangeSender: function (subfields, json)
		 * {
		 *		subfields.S002_01_0004.value = "SENDER_EAN_VALUE";
		 *		subfields.S002_02_0007.value = "14"; // is qualifier code for EAN
		 *
		 *		return subfields
		 * }
		 * </code></pre>
		*/
		"setInterchangeSender": function (subfields, json)
		{
			return subfields;
		},
		/**
		 * @description Allows to modify or add fields in the json that need to be updated on the Outbound EDI transaction process following the reception of an EDI notification.
		 * This customization is mandatory. If not given, the recipient field will be filled with "CUSTOMER" and with the code qualifier "ZZZ".
		 *
		 * @param {Array.<{name: string, value: string}>} subfields array of subfield descriptors.
		 * 	Each subfield descriptor is an object having members
		 * 		"name" member containing the name of the subfield (free format)
		 * 		"value" member to be filled with the value of the subfield, this value will be put in the EDIFACT line
		 *
		 * 	The array contains all the subfields specified in syntax version 3 of EDIFACT segment UNB (https://www.stylusstudio.com/edifact/30000/UNB_.htm),
		 *  and is defined in the library Lib_SOP_EDIFACT_ORDRSPPublishingMapping.
		 *  If you want to use another version of EDIFACT, you must modify the mapping in this library.
		 *
		 *  The resulting array must be ordered as specified in the used version of EDIFACT specification.
		 * 	The unused conditional fields must not be present.
		 *
		 * Subfields:
		 * "S003_01_0010": Recipient identification
		 * "S003_02_0007": Partner identification code qualifier
		 * "S003_03_0014": Routing address
		 *
		 * @param {object} json the data mapped from the incoming EDI
		 *
		 * @returns subfields the modified subfields
		 *
		 * @example
		 * 	<pre><code>setInterchangeRecipient: function (subfields)
		 * {
		 *		subfields.S003_01_0010.value = "RECIPIENT_EAN_VALUE";
		 *		subfields.S003_02_0007.value = "14"; // is qualifier code for EAN
		 *
		 *		return subfields;
		 * }
		 * </code></pre>
		*/
		"setInterchangeRecipient": function (subfields, json)
		{
			return subfields;
		},
		/**
		 * @description Allows to modify a partner
		 *
		 * @param {object} fields field object of an NAD segment.
		 * 	each object in the fields object is a NAD segment containing subfields.
		 *  See jsonmapping object in Lib_SOP_EDIFACT_ORDRSPPublishingMapping to view all possible fields.
		 *
		 *
		 * @param {object} json the entire data mapped from the incoming EDI
		 *
		 * @param {object} jsonItem the specific part of data mapped from the incoming EDI for the current processed lineItem
		 * 	As partners are not present at lineItem level, this object should be NULL.
		 *
		 * @returns fields the modified fields
		 *
		 * @example
		 * 	<pre><code>fillPartnerDatafromMappedData: function (fields, json, jsonItem)
		 * {
		 * 		//this example modifies the number of the ShipTo to 1671
		 *		if(fields.NAD_01_3035.value == "ST")	//the segment containd ShipTo information
		 *		{
		 *			fields.NAD_02_C082.subfields.C082_01_3039.value = "1671"	//set shipTo number to 1671
		 *		}
		 *		return fields;
		 * }
		 * </code></pre>
		*/
		"fillPartnerDatafromMappedData": function (fields, json, jsonItem)
		{
			var partnerNumberPath = null;
			try
			{
				partnerNumberPath = fields.NAD_02_C082.subfields.C082_01_3039.jsonMappedPath[0];
			}
			catch (err)
			{
				Log.Warn("[fillPartnerDatafromMappedData] : PartnerNumber not found in DATA (" + err + ")");
				return fields;
			}
			if (partnerNumberPath)
			{
				var partnerNumberValue = Sys.EDIPublishingMapper.GenericPublishingMapper.GetJSONValueFromPath(json, partnerNumberPath);
				if (partnerNumberValue)
				{
					var tableName = "";
					var filter = "";
					//NAD_01_3035 is the partner type.
					// We assume here BY (buyer) and UD (ultimate customer) are in the customer table
					// and IV (invoicee) and DP (delivery party) are partners. That can be different for any implementation.
					switch (fields.NAD_01_3035.value)
					{
						case "BY":
						case "UD":
							tableName = "SO - Customers__";
							filter = Sys.Helpers.LdapUtil.FilterEqual("Customer_ID_in_ERP__", partnerNumberValue);
							break;
						case "PR":
						case "DP":
						case "MR":
						case "MS":
						case "PE":
						case "SU":
						case "IV":
							tableName = "SO - Partners__";
							filter = Sys.Helpers.LdapUtil.FilterEqual("Customer_ID_in_ERP__", partnerNumberValue);
							break;
						default:
							break;
					}
					if (!filter || !tableName)
					{
						return fields;
					}
					Query.Reset();
					Query.SetAttributesList("*");
					Query.SetSpecificTable(tableName);
					Query.SetFilter(filter.toString());
					if (!Query.MoveFirst())
					{
						return fields;
					}
					var queryResult = Query.MoveNextRecord();
					if (queryResult)
					{
						var queryVars = queryResult.GetVars();
						var number = queryVars.GetValue_String("Number__", 0);
						var name = tableName === "SO - Customers__" ? queryVars.GetValue_String("Name__", 0) : queryVars.GetValue_String("Name_1__", 0);
						if (number && name)
						{
							try
							{
								delete fields.NAD_02_C082.subfields.C082_01_3039.jsonMappedPath;
								fields.NAD_02_C082.subfields.C082_01_3039.value = number;
								delete fields.NAD_04_C080.subfields.C080_01_3036.jsonMappedPath;
								fields.NAD_04_C080.subfields.C080_01_3036.value = name;
								delete fields.NAD_05_C059.subfields.C059_01_3042.jsonMappedPath;
								fields.NAD_05_C059.subfields.C059_01_3042.value = queryVars.GetValue_String("Street__", 0);
								delete fields.NAD_08_3251.jsonMappedPath.value;
								fields.NAD_08_3251.value = queryVars.GetValue_String("ZIP_code__", 0);
								delete fields.NAD_06_3164.jsonMappedPath;
								fields.NAD_06_3164.value = queryVars.GetValue_String("City__", 0);
								delete fields.NAD_09_3207.jsonMappedPath;
								fields.NAD_09_3207.value = queryVars.GetValue_String("Country_code__", 0);
								Log.Warn("[fillPartnerDatafromMappedData] : partner " + partnerNumberValue + "successfully mapped to " + number);
								return fields;
							}
							catch (err)
							{
								Log.Warn("[fillPartnerDatafromMappedData] : Error when replacing values : " + err);
								return fields;
							}
						}
					}
				}
				Log.Warn("[fillPartnerDatafromMappedData] : could not map partner " + partnerNumberValue + " with EOD tables. Set values to IDOC data");
				return fields;
			}
			Log.Warn("[fillPartnerDatafromMappedData] : could not map data with EOD tables. Set values to IDOC data");
			return fields;
		},
		/**
		 * @description Allows to modify a lineItem
		 *
		 * @param fields [segments] array of segment descriptors.
		 * 	Each segment is an object describing a part of a line Item (segments LIN, QTY ...)
		 * See jsonmapping object in Lib_SOP_EDIFACT_ORDRSPPublishingMapping to view all possible objects.
		 *
		 *
		 * @param {object} json the entire data mapped from the incoming EDI
		 *
		 * @param {object} jsonItem the specific part of data mapped from the incoming EDI for the current processed lineItem
		 *
		 * @returns fields the modified fields
		 *
		 * @example
		 * 	<pre><code>fillPartnerDatafromMappedData: function (fields, json, jsonItem)
		 * {
		 * 		// this example pad the material number
		 *		var matNb = jsonItem.vendorMaterialNumber.value.materialId.value //get material number from jsonItem
		 *		matNb = Sys.Helpers.String.PadLeft(matNb, "0", 10)
		 *		{
		 *			fields[1] contains the segment "PIA" mapping for the "EN" material number (as described in Lib_SOP_EDIFACT_ORDRSPPublishingMapping.jsonmapping)
		 *			fields[1].fields.LIN_03_C212.subfields.C212_01_7140.value = matNb //set the padedd value in the EDIFACT field data
		 *		}
		 *		return fields;
		 * }
		 * </code></pre>
		*/
		"fillMaterialDatafromMappedData": function (fields, json, jsonItem)
		{
			var partnerNumber = null;
			var matNumber = null;
			try
			{
				partnerNumber = json.soldTo.value.partnerNumber.value;
				matNumber = jsonItem.vendorMaterialNumber.value.materialId.value;
			}
			catch (err)
			{
				Log.Warn("[fillMaterialDatafromMappedData] : Error trying to find partner information : " + err);
				return fields;
			}
			if (partnerNumber && matNumber)
			{
				var tableName = "SO - ERP/Customer material mapping__";
				var filterN = Sys.Helpers.LdapUtil.FilterEqual("Customer_number__", partnerNumber);
				var filterP = Sys.Helpers.LdapUtil.FilterEqual("Material_number_on_the_customer_side__", matNumber);
				var filter = Sys.Helpers.LdapUtil.FilterAnd(filterN, filterP);
				Query.Reset();
				Query.SetAttributesList("*");
				Query.SetSpecificTable(tableName);
				Query.SetFilter(filter.toString());
				if (!Query.MoveFirst())
				{
					return fields;
				}
				var queryResult = Query.MoveNextRecord();
				if (queryResult)
				{
					var queryVars = queryResult.GetVars();
					var number = queryVars.GetValue_String("Material_number__", 0);
					if (number)
					{
						try
						{
							delete fields[1].fields.PIA_02_C212.subfields.C212_01_7140.jsonMappedPath;
							fields[1].fields.PIA_02_C212.subfields.C212_01_7140.value = number;
						}
						catch (err)
						{
							Log.Warn("[fillMaterialDatafromMappedData] : Error when replacing values : " + err);
							return fields;
						}
					}

				}
			}
			return fields;
		},

		/**
		 * @description Allows to customize the default mapping for the EDIFACT output file.
		 *
		 * @param {object} publishingMapping This is the default representation of the mapping from the JSON object containing the data to the EDIFACT document
		 *
		 * @returns {object} Returns the customized mapping.
		 *
		 * @example
		 * 	<pre><code>
		 * // In this example, we would like to add new segment in output edi file.
		 * 	var newDTMForSalesOrderDate = {
		 * 		"segmentName": "DTM",
		 * 		"fields": {
		 * 			"DTM_01_C507": {
		 * 				"subfields": {
		 * 					"C507_01_2005": {
		 * 						"value": "4"
		 * 					},
		 * 					"C507_02_2380": {
		 * 						"jsonMappedPath": "purchaseOrderDate.value",
		 * 						"formatting": yourFormattingFunction,
		 * 					},
		 * 					"C507_03_2379": {
		 * 						"value": "102"
		 * 					}
		 * 				}
		 * 			}
		 * 		}
		 * 	};
		 *
		 * 	mapping.headers.segments.splice(5, 0, newDTMForSalesOrderDate);
		 * </code></pre>
		*/
		"updatePublishingMapping": function (publishingMapping)
		{
			return publishingMapping;
		}
	};
	return customization;
})();