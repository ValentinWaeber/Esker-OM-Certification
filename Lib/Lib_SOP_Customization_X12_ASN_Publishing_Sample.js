/* LIB_DEFINITION{
  "name": "Lib_SOP_Customization_X12_ASN_Publishing_Sample",
  "scriptType": "SERVER",
  "comment": "Custom library extending X12 publishing on server side",
  "versionable": false,
  "libraryType": "Lib",
  "require": []
}*/

var Lib = Lib || {};
Lib.SOP = Lib.SOP || {};
Lib.SOP.Customization = Lib.SOP.Customization || {};
Lib.SOP.Customization.X12Publishing = Lib.SOP.Customization.X12Publishing || {};

/**
 * @namespace Lib.SOP.Customization.X12Publishing.ASN
 */
Lib.SOP.Customization.X12Publishing.ASN = (function ()
{
	/**
	 * @lends Lib.SOP.Customization.X12Publishing.ASN
	 */
	var customization = {
		/**
		 * @namespace
		 */
		/**
		 * @description Allows to modify the sender identifier.
		 * This customization is mandatory. If not given, the field will be filled with "ESKER".
		 *
		 * @returns {string} senderId: the wanted sender identifier
		 *
		 * @example
		 * 	<pre><code>setInterchangeSender: function ()
		 * {
		 *		return "SENDER_ID";
		 * }
		 * </code></pre>
		*/
		"setInterchangeSender": function ()
		{
			return "";
		},
		/**
		 * @description Allows to modify the recipient identifier.
		 * This customization is mandatory. If not given, the field will be filled with "".
		 *
		 * @returns {string} senderId: the wanted recipient identifier
		 *
		 * @example
		 * 	<pre><code>setInterchangeRecipient: function ()
		 * {
		 *		return "RECIPIENT_ID";
		 * }
		 * </code></pre>
		*/
		"setInterchangeRecipient": function ()
		{
			return "";
		},
		/**
		 * @description Allows to customize the default mapping for the X12 output file.
		 *
		 * @param {object} publishingMapping This is the default representation of the mapping from the JSON object containing the data to the X12 document
		 *
		 * @returns {object} Returns the customized mapping.
		 *
		 * @example
		 * 	<pre><code>
		 * // In this example, we would like add new segment in output edi file.
		 * function updatePublishingMapping(publishingMapping)
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
		 *	publishingMapping.footers.segments.unshift(sacSegment);
		 * 	return publishingMapping;
		 * }
		 * </code></pre>
		*/
		"updatePublishingMapping": function (publishingMapping)
		{
			return publishingMapping;
		}
	};
	return customization;
})();