/* LIB_DEFINITION{
  "name": "LIB_AR_CUSTOMIZATION_EDIFACT_INVOIC_PUBLISHING_SAMPLE",
  "scriptType": "SERVER",
  "comment": "Custom library extending EDIFACT publishing on server side",
  "versionable": false,
  "libraryType": "Lib",
  "require": []
}*/

/**
 * AR Package EDIFACT Publishing customization callbacks (for documents other than orders)
 * @namespace Lib.AR.Customization.EDIFACTPublishing
 */

var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};
Lib.AR.Customization.EDIFACTPublishing = Lib.AR.Customization.EDIFACTPublishing || {};

/**
 * @namespace Lib.AR.Customization.EDIFACTPublishing.INVOIC
 */
Lib.AR.Customization.EDIFACTPublishing.INVOIC = (function ()
{
	/**
	 * @lends Lib.AR.Customization.EDIFACTPublishing.INVOIC
	 */
	var customization = {
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
		 * publishingMapping.headers.segments.splice(5, 0, newDTMForSalesOrderDate);
		 * return publishingMapping;
		 * </code></pre>
		*/
		"updatePublishingMapping": function (publishingMapping)
		{
			return publishingMapping;
		}
	};
	return customization;
})();