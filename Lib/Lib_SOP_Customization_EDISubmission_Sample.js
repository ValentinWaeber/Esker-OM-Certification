/**
 * SOP Package EDISubmission customization callbacks
 * @namespace Lib.SOP.Customization.EDISubmission
 */

/* LIB_DEFINITION{
  "name": "Lib_SOP_Customization_EDISubmission_Sample",
  "scriptType": "SERVER",
  "comment": "Custom library extending EDI submission process on server side",
  "versionable": false,
  "libraryType": "Lib",
  "require": []
}*/

var Lib = Lib || {};
Lib.SOP = Lib.SOP || {};
Lib.SOP.Customization = Lib.SOP.Customization || {};

Lib.SOP.Customization.EDISubmission = (function ()
{
	/**
	 * @lends Lib.SOP.Customization.EDISubmission
	 */
	var customization = {
		/**
		 * @description Allows to customize the xml string containing all values required to generate a NSO UBL pre agreed orders
		 * You can refer to http://docs.peppol.eu/poacc/upgrade-3/syntax/OrderAgreement/tree/ for structure specification
		 *
		 * @param {object} xmlTemplate the xml string containing all values required to generate a NSO UBL pre agreed orders, partially filled from the order
		 *
		 * @returns {object} the same xmlTemplate fully filled
		 *
		 * @example
		 * 	<pre><code>UpdateNSOPublishingXml: function (xmlTemplate)
		 * {
		 * 		var xmlDoc = Process.CreateXMLDOMElement(xmlTemplate);
		 * 		var customizedNode = xmlDoc.createElement("cbc:Note");
		 * 		customizedNode.text = "A customized note";
		 * 		xmlDoc.appendChild(customizedNode);
		 * 		return xmlDoc.xml;
		 * }
		 * </code></pre>
		 */
		UpdateNSOPublishingXml: function (xmlTemplate)
		{
			return xmlTemplate;
		},
		/**
		 * @description Allows to customize the xml string containing all values required to generate a Generic message to EDI Services - its structure is as follows
		 * <EDIMessage>
		 * 		<ExtensionContent>
		 * 				<ID schemeID="EDIMsgRuidEx">CD#ED15UBM155I0N.493425638468789509</ID>
		 * 				<ID schemeID="Partner">Partner__</ID>
		 * 				<ID schemeID="OrderRuidEx">Ruidex od the order</ID>
		 * 				<ID schemeID="MSN">493425638468789509</ID>
		 * 		</ExtensionContent>
		 * 		<Type>EDIType__</Type>
		 * 		<Message>
		 * 				<FileSyntax>Format__</FileSyntax>
		 * 				<SyntaxVersion>FormatVersion__</SyntaxVersion>
		 * 				<Filename>ORDRSP_54526643.edi</Filename>
		 * 				<Content>base64 value of the file</Content>
		 * 		</Message>
		 * 		<Attachments>
		 * 				<Attachment>
		 * 						<Filename>some-optional-attachment.txt</Filename>
		 * 						<Content>base64 value of the file</Content>
		 * 				</Attachment>
		 * 		</Attachments>
		 * </EDIMessage>
		 *
		 * @param {object} xmlTemplate the xml string containing all values required to generate an EDI Services message, partially filled from the order
		 *
		 * @returns {object} the same xmlTemplate fully filled
		 *
		 * @example
		 * 	<pre><code>UpdateGenericPublishingXml: function (xmlTemplate)
		 * {
		 * 		var xmlDomElement = Process.CreateXMLDOMElement(xmlTemplate);
		 * 		var xmlFile =  xmlDomElement.ownerDocument;
		 * 		var selectedNode = xmlFile.selectSingleNode("//EDIMessage/Type");
		 * 		selectedNode.text = selectedNode.text + "_CUSTOM_TYPE";
		 * 		return xmlDomElement.xml;
		 * }
		 * </code></pre>
		 */
		UpdateGenericPublishingXml: function (xmlTemplate)
		{
			return xmlTemplate;
		}
	};
	return customization;
})();