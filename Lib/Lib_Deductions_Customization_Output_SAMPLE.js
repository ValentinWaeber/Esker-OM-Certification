/* LIB_DEFINITION{
  "name": "Lib_Deductions_Customization_Output_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "Deductions xml output customizations functions",
  "require": []
}*/

/**
 * This module contains
 *	- CustomizeOutputAdditionalField
 *	- CustomizeOutputXml
 *	- CustomizeOutputSettings
 * @namespace Lib.Deductions.Customization.Output
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.Deductions = Lib.Deductions || {};
Lib.Deductions.Customization = Lib.Deductions.Customization || {};

Lib.Deductions.Customization.Output = (function ()
{
	/**
	 * @lends Lib.Deductions.Customization.Output
	 */
	var Output =
	{

		/**
		* @method Lib.Deductions.Customization.Output.CustomizeOutputAdditionalField
		* @description
		* Customize additional field format in output xml
		* @param {string} fieldName the name also used for the Tag in the output XML
		* @param {string} fieldValue the value inside the output Tag
		* @param {string} fieldProperty All properties of the field (i.e.label, type, format, etc)
		* @return {json} required format : { nodeName: name, nodeValue: value }
		* @example 
	   CustomizeOutputAdditionalField: function (fieldName, fieldValue, fieldProperty)
		{
			if(fieldName.toLowerCase().startsWith("customer"))
			{
				return {nodeName: fieldName, nodeValue: "000"+fieldValue};
			}
			return { nodeName: fieldName, nodeValue: fieldValue };
		}

		*/
		/*CustomizeOutputAdditionalField: function (fieldName, fieldValue, fieldProperty)
		{
			return { nodeName: fieldName, nodeValue: fieldValue };
		},*/
		/**
		 * @method Lib.Deductions.Customization.Output.CustomizeOutputXml
		 * @description
		 * Customize xml output, you can edit tags order, tags value, tags name.
		 * you can remove tags, you can add tags.
		 * @param {string} xmlString string containing the current xml output
		 * @return {string} Customized xml string
		 * @example 
			  CustomizeOutputXml: function (xmlString)
			{
			var indexOfMyOccurence = xmlString.toLowerCase().indexOf("<customer");
				xmlString = [xmlString.slice(0,indexOfMyOccurence), "<newTag>addingTag</newTag>", xmlString.slice(indexOfMyOccurence)].join('');
				return xmlString;
			}
			
		 */
		/*CustomizeOutputXml: function (xmlString)
		{
			return xmlString;
		},*/
	
		/**
		@interface Lib.Deductions.Customization.Output.Settings
		@prop {string} publishing publish to SFTP/AS2 depending on the variable "Publishing"
		@prop {boolean} FlattenAnnotations false: do not flatten annotations, true: flatten annotations
		@prop {boolean} FlattenNotes only if flattenAnnotations is true. false: do not flatten notes, true: flatten notes
		@prop {boolean} DiscardDocument only if flattenAnnotations is true. false: do not discard original document, true: keep just annotated document
		@prop {string} DiscardedAttach array with file extension which you don't want to have in your XML
		@prop {string} xmlEncoding XML file encoding: "utf8" (8 bit UTF-8), "utf16" (16 bit Unicode)
		@prop {boolean} ftpPublishing false: do not publish on the FTP, true : publish on the FTP
		@prop {string} ftpFolderName FTP folder name
		@prop {boolean} useZip use or not a zip file to send the XML file
		*/
		/**
		 * @method Lib.Deductions.Customization.Output.CustomizeOutputSettings
		 * @description
		 * Customize xml output settings
		 * @param {Lib.Deductions.Customization.Output.Settings} settings Default settings
		 * @return {Lib.Deductions.Customization.Output.Settings} Customized settings
		 * @example 
		  CustomizeOutputSettings: function (settings)
		{
			settings.ftpFolderName = "Deduction\\Xml";
			return settings;
		}
		 */
		/*CustomizeOutputSettings: function (settings)
		{
			return settings;
		},*/

		/**
		 * @method Lib.Deductions.Customization.Output.CustomizeCopyFileGeneration
		 * @description
		 * Allows for customizing the way the output file should be handled, either by a copy file to SFTP or any other transport mechanism.
		 * @param {File} outputFile File object to be attached to a transport (Copy file or any transport)
		 * @param {object} settings Object containing parameters like ftpFolderName (default value: "Deductions\Outbound") and publishing (default value: "SFTP2")
		 * @returns true to discard default copy file logic, else false.
		 *
		 * @example 
		 * CustomizeCopyFileGeneration: function (outputFile, settings)
		 * {
		 *    // This example deactivate default file zipping to keep XML format
		 *    var xmlOutputName = settings.ftpFolderName + "\\" + "deductions" + Data.GetValue("MsnEx") + ".xml";
		 *    var copyFileTransport = Process.CreateTransport("Copy", true);
		 *    var vars = copyFileTransport.GetUninheritedVars();
		 *    vars.AddValue_String("CopyPath", settings.publishing, true);
		 *    // Attach the XML file to the Copy transport
		 *    var newAttachVars = copyFileTransport.AddAttachEx(outputFile).GetVars();
		 *    newAttachVars.AddValue_String("AttachOutputName", xmlOutputName, true);
		 *    newAttachVars.AddValue_String("AttachOutputFormat", "xml", true);
		 *    newAttachVars.AddValue_String("AttachToDisplay", "converted", true);
		 *    copyFileTransport.Process();
		 *    return true;
		 * }
		 */
		/*CustomizeCopyFileGeneration: function (outputFile, settings)
		{
		},*/
	};

	return Output;

})();
