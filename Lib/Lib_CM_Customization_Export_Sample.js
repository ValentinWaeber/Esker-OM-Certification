/* LIB_DEFINITION{
  "name": "Lib_CM_Customization_Export_Sample",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "",
  "require": [
    "Sys/Sys_Helpers"
  ]
}*/

/**
 * Package CM customization for the export
 * @namespace Lib.CM.Customization.Export
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.CM = Lib.CM || {};
Lib.CM.Customization = Lib.CM.Customization || {};

Lib.CM.Customization.Export = (function ()
{
	/**
	 * @lends Lib.CM.Customization.Export
	 */
	var customization = {
		/**
		 *	@description Allow the addition of data from the record in the generated XML for the export. The values must be accessible via the Data.GetValue function.
		 *  @returns { object } Array of strings containing the name of the fields from the credit review which will be added to the XML.
		 *  @example
		 * This example shows how to add the city and the country to the XML for the export.
		 * <pre><code>
		 * XMLInputElements: ["City__", "Country__"]
		 * </code></pre>
		 */
		XMLInputElements: null,
		/**
		 *	@description Allow the addition of data from the record in the generated XML for the customer changes export.
		 *	The values must be accessible via the Data.GetValue function when on the CIM.
		 *  @returns { object } Array of strings containing the name of the fields from a customer which will be added to the XML.
		 *  @example
		 * This example shows how to add fields from the CIM to the XML for the export.
		 * <pre><code>
		 * XMLInputElementsForCustomerChanges: ["BusinessPartnerId__", "Customer_Currency__"]
		 * </code></pre>
		 */
		XMLInputElementsForCustomerChanges: null,
		/**
		 *  @description Allow the modification of the xml object generated before being export as a file.
		 *  Full documentation for this object is present here: https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms757048(v=vs.85)
		 *  @param { object } xmlDoc IXMLDomElement object representing the generated XML file so far. Modify directly this object.
		 *  @example
		 * This example shows how to add a custom node to the xml and modify the company name.
		 * <pre><code>
		 * XMLFileCustomization: function (xmlDoc)
		 * {
		 *     // Creating of a new custom node
		 *	   var newNode = xmlDoc.createElement("CustomNodeName");
		 *	   newNode.text = "CustomNodeValue";
		 *	   xmlDoc.appendChild(newNode);
		 *
		 *	   // Modifying the company name
		 *	   var companyNode = xmlDoc.selectSingleNode("//OrdersToRelease/Company__");
		 *	   companyNode.text = "New company name";
		 * }
		 * </code></pre>
		 */
		XMLFileCustomization: function (/*xmlDoc*/)
		{
		},
		/**
		 *  @description Allow the modification of the xml object generated before being export as a file.
		 *  Full documentation for this object is present here: https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms757048(v=vs.85)
		 *  @param { object } xmlDoc IXMLDomElement object representing the generated XML file so far. Modify directly this object.
		 *  @example
		 * This example shows how to add a custom node to the xml and modify the company name.
		 * <pre><code>
		 * XMLFileCustomizationForCustomerChanges: function (xmlDoc)
		 * {
		 *     // Creating of a new custom node
		 *	   var newNode = xmlDoc.createElement("CustomNodeName");
		 *	   newNode.text = "CustomNodeValue";
		 *	   xmlDoc.appendChild(newNode);
		 *
		 *	   // Modifying the company name
		 *	   var companyNode = xmlDoc.selectSingleNode("//CustomerModifications/Company");
		 *	   companyNode.text = "New company name";
		 * }
		 * </code></pre>
		 */
		XMLFileCustomizationForCustomerChanges: function (/*xmlDoc*/)
		{
		},
		/**
		 *  @description Allow the modification of the string generated for the idoc export.
		 *  @param { string } idocData String representing the data exported for the IDOC. It contains every segments which will be present in the file exported.
		 *  @returns { string } Modified string of the idoc data.
		 *  @example
		 * This example shows how to remove lines containing a specific value.
		 * <pre><code>
		 * IDOCFileCustomization: function (idocData)
		 * {
		 *     if (!idocData) {
		 *			return null;
		 *     }
		 *     var lineSplit = idocData.split(" \n");
		 *     var i = lineSplit.length;
		 *     while (i--) {
		 *			if (lineSplit[i].indexOf("ESKER") != -1){
		 *				lineSplit.split(i, 1);
		 *			}
		 *     }
		 *	   return lineSplit.join("");
		 * }
		 * </code></pre>
		 */
		IDOCFileCustomization: function (/*idocData*/)
		{
		},

		/**
		 * @description Allow the customization of the default mapping for the IDOC output file.
		 *
		 * @param {object} mapping The default mapping is contained in the variable 'jsonmapping' of Lib_CM_IDOCPublishingMapping.js.
		 * The mapping object maps the EDI segments to fields of the form or custom functions.
		 *
		 * @returns {object} Returns the customized mapping.
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
		 * <pre><code>UpdateIDOCMapping: function (mapping)
		 * {
		 *  mapping["items"]["segments"][0]["fields"]["MENEE"].flxFieldName = "CustomerUnit__";
		 * }</code></pre>
		 */
		UpdateIDOCMapping: function (/*jsonmapping*/)
		{
		},

		/**
		 *  @description Allow the modification of the name of the file exported.
		 *  By default, the value is the "OrdersToRelease_" + msnex.
		 *  For example, you would get "OrdersToRelease_msnexValue.xml" for an xml file or "OrdersToRelease_msnexValue.edi" for the idoc
		 *  @param { string } fileName String representing name of the exported file. It also contains the extension.
		 *  @returns { string } Modified output file name. If null is returned, the old filename is kept.
		 *  @example
		 *  This example show how to modify the name of the file exported depending on the file extension
		 *  <pre><code>
		 * CustomizeExportFileName: function (fileName)
		 * {
		 *     var nameSplit = fileName.split(".");
		 *     // No extension or hidden file
		 *     if( nameSplit.length === 1 || ( nameSplit[0] === "" && nameSplit.length === 2 ) ) {
		 *			return fileName;
		 *	   }
		 *	   if (nameSplit[1] === "xml") {
		 *			return "newXMLname.xml";
		 *	   }
		 *	   if (nameSplit[1] === "edi") {
		 *			return "newIDOCname.edi";
		 *	   };
		 * }
		 * </code></pre>
		 */
		CustomizeExportFileName: function (/*fileName*/)
		{
		},

		/**
		 *  @description Allow the modification of the name of the customer changes file exported.
		 *  By default, the value is the "CustomerUpdates_" + msnex.
		 *  For example, you would get "CustomerUpdates_msnexValue.xml" for an xml file or "CustomerUpdates_msnexValue.edi" for the idoc
		 *  @param { string } fileName String representing name of the exported file. It also contains the extension.
		 *  @param {object} customer default customer object (user retreives with GetUser function)
		 *  @returns { string } Modified output file name. If null is returned, the old filename is kept.
		 *  @example
		 *  This example show how to modify the name of the file exported depending on the file extension and customerId
		 *  <pre><code>
		 * CustomizeExportFileNameForCustomerChanges: function (fileName, customer)
		 * {
		 *     var nameSplit = fileName.split(".");
		 *     // No extension or hidden file
		 *     if( nameSplit.length === 1 || ( nameSplit[0] === "" && nameSplit.length === 2 ) ) {
		 *			return customer.GetValue("BusinessPartnerId__") + "_fileName";
		 *	   }
		 *	   if (nameSplit[1] === "xml") {
		 *			return customer.GetValue("BusinessPartnerId__") + "_newXMLname.xml";
		 *	   }
		 *	   if (nameSplit[1] === "edi") {
		 *			return customer.GetValue("BusinessPartnerId__") + "_newIDOCname.edi";
		 *	   }
		 * }
		 * </code></pre>
		 */
		CustomizeExportFileNameForCustomerChanges: function (/*fileName, customer*/)
		{
		},

		/**
		 *  @description Allow the modification of the name of the customers pending creation in ERP file exported.
		 *  By default, the value is the "CustomerPendingCreationToERP_" + date.
		 *  For example, you would get "CustomerPendingCreationToERP_Tue Jan 09 2024.xml" for an xml file or "CustomerPendingCreationToERP_Tue Jan 09 2024.edi" for the idoc
		 *  @param { string } fileName String representing name of the exported file. It also contains the extension.
		 *  @returns { string } Modified output file name. If null is returned, the old filename is kept.
		 *  @example
		 *  This example show how to modify the name of the file exported depending on the file extension
		 *  <pre><code>
		 * CustomizeExportFileNameForCustomerPendingCreationToERP: function (fileName)
		 * {
		 *     var nameSplit = fileName.split(".");
		 *     // No extension or hidden file
		 *     if( nameSplit.length === 1 || ( nameSplit[0] === "" && nameSplit.length === 2 ) ) {
		 *			return fileName;
		 *	   }
		 *	   if (nameSplit[1] === "xml") {
		 *			return "newXMLname.xml";
		 *	   }
		 *	   if (nameSplit[1] === "edi") {
		 *			return "newIDOCname.edi";
		 *	   };
		 * }
		 * </code></pre>
		 */
		CustomizeExportFileNameForCustomerPendingCreationToERP: function (/*fileName*/)
		{
		},
		/**
		 *  @description Allow the modification of the query used by the process in the scheduled task "Export customers pending ERP Creation"
		 *  @param { Object } query Query which will be used to get the data from the customers. It is possible to change de filter or the column you get from the query
		 *  @example
		 *  This example show how to modify the query to get the credit applications with the status "Pending ERP Creation",
		 *  are not in deleted state and for which the selected country is the US
		 *  <pre><code>
		 * CustomizeQueryForCustomerPendingCreationToERP: function (query)
		 * {
		 *     // Creating of a new custom node
		 *	   var ldapFilter = Sys.Helpers.LdapUtil.FilterAnd(
		 *	   Sys.Helpers.LdapUtil.FilterLesserOrEqual("State", "99"),
		 *	   Sys.Helpers.LdapUtil.FilterEqual("ProcessStatus__", "PendingERPCreation"),
		 *	   Sys.Helpers.LdapUtil.FilterEqual("Deleted", "0"),
		 *	   Sys.Helpers.LdapUtil.FilterEqual("Country__", "US"));
		 *	   query.SetFilter(ldapFilter.toString());
		 * }
		 * </code></pre>
		 */
		CustomizeQueryForCustomerPendingCreationToERP: function (/*query*/)
		{
		},
		/**
		 *  @description Allow the modification of the fields which will be used to create the XML file
		 *  @param { Object } queryTransport xTransport object containing the results of the query
		 *  @param { Object } fieldsDict dictionary of the fields which will be used for the creation of the XML file
		 *  @param { Function } GetTableDataFunction function which can be used to get the data from tables fields.
		 *	The parameters are the formData from the transport, the field name of the table, the name you wish to affect to the XML node, the values you wish to get from the table (name of the columns), a list of the fields which will be translated
		 *  @example
		 *  This example show how to add fields in the data which will be used to create the XML
		 *  <pre><code>
		 * CustomizeFieldsForCustomerPendingCreationToERP: function (queryTransport, fieldsDict, GetTableDataFunction)
		 * {
		 *     // Adding the value from a simple field
		 *     fieldsDict["TypeOfCompany"] = queryTransport.GetUninheritedVars().GetValue("TypeOfCompany__", 0);
		 * 
		 *     // Adding the values from a table field. It will add several node, one per line in the table
		 *     // In this exemple, we'll get data from CompanyReferenceTable__. The name of the node in the XML will be CompanyReference.
		 *     // In this new node, we'll add data for TradeRefBusinessId__, Contact__ and ReferenceStatus__. ReferenceStatus__ value will be translated.
		 *     fieldsDict["CompanyReferences"] = GetTableDataFunction(queryTransport.GetFormData(), "CompanyReferenceTable__", "CompanyReference", {
		 *			TradeRefBusinessId: "TradeRefBusinessId__",
		 *			Contact: "Contact__",
		 *			ReferenceStatus: "ReferenceStatus__"
		 *     }, ["ReferenceStatus__"]);
		 * }
		 * </code></pre>
		 */
		CustomizeFieldsForCustomerPendingCreationToERP: function (/*queryTransport, fieldsDict, GetTableDataFunction*/)
		{
		},
		/**
		 *  @description Allow the modification of the xml object generated before being export as a file.
		 *  Full documentation for this object is present here: https://docs.microsoft.com/en-us/previous-versions/windows/desktop/ms757048(v=vs.85)
		 *  @param { object } xmlDoc IXMLDomElement representing the generated XML file
		 *  @example
		 *  This example shows how to modify the XML generated.
		 *  <pre><code>
		 * CustomizeXMLFileForCustomerPendingCreationToERP: function (xmlDoc)
		 * {
		 *     // Creating of a new custom node
		 *	   var newNode = xmlDoc.createElement("CustomNodeName");
		 *	   newNode.text = "CustomNodeValue";
		 *	   xmlDoc.appendChild(newNode);
		 *
		 *	   // Modifying the name of the first customer company name
		 *	   var firstCustomerCompanyNode = xmlDoc.selectSingleNode("//Customers/Customer/Company__");
		 *	   firstCustomerCompanyNode.text = "New customerCompany name";
		 * }
		 * </code></pre>
		 * @example
		 *  This example shows how to merge the addresses nodes in a single node.
		 *  <pre><code>
		 * CustomizeXMLFileForCustomerPendingCreationToERP: function (xmlDoc)
		 * {
		 *     var customerNodeList = xmlDoc.selectNodes(".//Customer");
		 *     for (var i =0; i < customerNodeList.length; i++)
		 *     {
		 *     		var customerNode = customerNodeList.item(i);
		 *     		var newNode = customerNode.createElement("Addresses");
		 *     		var addressesPerCust = customerNode.selectNodes(".//Address");
		 *     		for (var j =0; j < addressesPerCust.length; j++)
		 *     		{
		 *     			var addressNode = addressesPerCust.item(j);
		 *     			newNode.appendChild(addressNode);
		 *			}
		 *     		var oldNodes = customerNode.selectNodes(".//Addresses");
		 *     		for (var k =0; k < oldNodes.length; k++)
		 *     		{
		 *     			var match = oldNodes.item(k);
		 *     			customerNode.removeChild(match);
		 *     		}
		 *     		customerNode.appendChild(newNode);
		 *     }
		 * }
		 * </code></pre>
		 */
		CustomizeXMLFileForCustomerPendingCreationToERP: function (/*xmlDoc*/)
		{
		},

		/**
		 * @method Lib.CM.Customization.Export.CustomizeCustomerWasUpdated
		 * @description Allows you to add criteria to define whether a customer has been updated and if we can export it
		 * @param {object} customer default customer object (user retreives with GetUser function)
		 * @example if the field NumberOfEmployees__ has uppdated, the customer is considered to have changed. If the option "Customer Changes Enable Export" is enabled, the file will be generated.
		 * CustomizeCustomerWasUpdated: function (customer)
		 * {
		 * 		return Data.GetValue("NumberOfEmployees__") !== this.userCustomerRef.GetValue("NumberOfEmployees__");
		 * }
		*/
		CustomizeCustomerWasUpdated: function (/*customer*/)
		{ },
	};
	return customization;
})();
