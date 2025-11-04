/* LIB_DEFINITION{
  "name": "LIB_CA_Lockbox_CUSTOMIZATION_EXTRACTION_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "Lockbox file processing Extraction customization functions",
  "require": []
}*/

/**
 * This module contains functions to customize data extracted from lockbox files
 * @namespace Lib.CA.Lockbox.Customization.Extraction
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.Lockbox = Lib.CA.Lockbox || {};
Lib.CA.Lockbox.Customization = Lib.CA.Lockbox.Customization || {};

Lib.CA.Lockbox.Customization.Extraction = (function ()
{
	/**
	 * @lends Lib.CA.Lockbox.Customization.Extraction
	 */
	var Extraction =
	{
		/**
		 * @method Lib.CA.Lockbox.Customization.Extraction.InitializeLockboxFileProcessingExtraction
		 * @since 330
		 * @description
		 * This function is used to customize the Lockbox File data extraction, at the beginning of the extraction process
		 * @example <caption>Customize options</caption>
		 * InitializeLockboxFileProcessingExtraction: function()
		 * {
		 *	Variable.SetValueAsString("FieldCombinationLinker", "."); // When multiple fields from the file are combined, this character is used as a separator. The default value is "-".
		 *	Variable.SetValueAsString("ImageFileNameSeparator", ":"); // When multiple image file names are reported in a single field, separator is used to split the file names when parsing the file. The default value is ";".
		 *	// Specifies to merge images as a TIF rather than converting to PDF, as long as all images are already in TIF format.
		 *	// By default, all images are converted and merged as PDF.
		 *	// Note that there can be problems merging TIF images without converting if the TIF isn't exactly in the format expected by the framework - this could cause payments/remittances to go to a Failed state without indication as to why.
		 *	Variable.SetValueAsString("LockboxMergeAsTif", "1");
		 * }
		 *
		 */
		/*InitializeLockboxFileProcessingExtraction: function()
		{
		},*/

		/**
		 * @method Lib.CA.Lockbox.Customization.Extraction.FinalizeLockboxFileProcessingExtraction
		 * @since 330
		 * @description
		 * This function is used to customize the Lockbox File data extraction, at the end of the extraction process
		 *
		 */
		/*FinalizeLockboxFileProcessingExtraction: function()
		{
		},*/

		/**
		 * @method Lib.CA.Lockbox.Customization.Extraction.GetExtractionType
		 * @since 330
		 * @description
		 * Allows you to customize the type of extraction for the Cash Application Lockbox file processing based on the format of the incoming payment file.
		 * This user exit is called before trying to extract the attached lockbox file.
		 *
		 * @returns {string|null} This function has two kinds of return value:
		 * * A `string` representing the name of extraction format. The default value indicates that no extraction is selected. The following extraction types are available:
		 *
		 *  Extraction type       | Document format
		 * -----------------------|--------------------
		 * `JPMorganChaseLockbox` | JP Morgan Chase Lockbox
		 * `PNCLockbox`           | PNC Lockbox
		 * `BOALockbox`           | BOA Lockbox
		 * `null` indicating that the extraction is automatically detected based on process attachments.
		 *
		 * @example <caption>The following example disables the automatic detection of the type of extraction</caption>
		 * GetExtractionType: function ()
		 * {
		 * 	return "default";
		 * }
		 * @example <caption>The following example will determine whether the compressed file appears to be a JP Morgan Chase lockbox based on the existence of a file with an expected name</caption>
		 * GetExtractionType: function ()
		 * {
		 * 	const zipFile = Attach.GetCompressedFile(0);
		 * 	if (!zipFile)
		 * 	{
		 * 		return null;
		 * 	}
		 * 	const filesInZip = zipFile.GetEntries(true, true);
		 * 	let expectedFileNameForJPMorganChase = "index";
		 * 	for (const fileEntry of filesInZip)
		 * 	{
		 * 		let filename = fileEntry.GetFileName();
		 * 		if (filename === expectedFileNameForJPMorganChase)
		 * 		{
		 * 			return "JPMorganChaseLockbox";
		 * 		}
		 * 	}
		 * }
		 */
		/*GetExtractionType: function ()
		{
			return null;
		},*/

		/**
		 * @method Lib.CA.Lockbox.Customization.Extraction.GetIndexFile
		 * @since 330
		 * @description
		 * Allows customizing how the index file is retrieved from the attached lockbox file.
		 * This user exit is called whenever the index file content must be retrieved from the lockbox file.
		 *
		 * @returns {File|null} The index file object. Returning null will result in the default logic being used to find the file.
		 * @example <caption>The following example will find the index file based on the name. This is basically the default logic, but streamlined.</caption>
		 * GetIndexFile: function ()
		 * {
		 * 	const zipFile = Attach.GetCompressedFile(0);
		 * 	if (!zipFile)
		 * 	{
		 * 		return null;
		 * 	}
		 * 	const filesInZip = zipFile.GetEntries(true, true);
		 * 	let expectedFileNameForJPMorganChase = "index";
		 * 	for (const fileEntry of filesInZip)
		 * 	{
		 * 		let filename = fileEntry.GetFileName();
		 * 		if (filename === expectedFileNameForJPMorganChase)
		 * 		{
		 * 			return fileEntry.GetFile();
		 * 		}
		 * 	}
		 * }
		 */
		/*GetIndexFile: function ()
		{
			return null;
		},*/

		/**
		 * @method Lib.CA.Lockbox.Customization.Extraction.GetKeyForLine
		 * @since 330
		 * @description
		 * Allows customizing how the key is determined for a line in the lockbox index file.
		 * The key is used to group lines in the index file into transactions for creating payment allocation processes.
		 * This user exit is called for every line in the index file when extracting the lockbox.
		 *
		 * @param {string[]} lineArray The array of strings representing the current line in the index file.
		 * @param {string} currentKey The current key from the previous line.
		 *
		 * @returns {string|null} The unique key associated with this line.
		 * Returning null will result in the default logic being used to find the key.
		 * @example <caption>The following example will handle when there are lines with "M" record types not following a "C" record type for JP Morgan Chase type lockbox files</caption>
		 * GetKeyForLine: function (lineArray, currentKey)
		 * {
		 * 	if (Data.GetValue("File_type__") !== "JPMorganChaseLockbox")
		 * 	{
		 * 		// Use the standard logic for other file types
		 * 		return null;
		 * 	}
		 * 	const recordTypeIsM = lineArray[6] === "M";
		 * 	if (!recordTypeIsM)
		 * 	{
		 * 		// Use the standard logic to get the key for other record types
		 * 		return null;
		 * 	}
		 * 	const keyField1 = lineArray[4];
		 * 	const keyField2 = lineArray[5];
		 * 	if (!keyField1 || !keyField2)
		 * 	{
		 * 		// Only handle cases where both key fields are present
		 * 		return null;
		 * 	}
		 * 	let currentKeyStartsWithKey1 = currentKey.indexOf(keyField1) === 0;
		 * 	let Key2StartsWithRemainingPartOfCurrentKey = keyField2.indexOf(currentKey.substring(keyField1.length)) === 0;
		 * 	if (!currentKeyStartsWithKey1 || !Key2StartsWithRemainingPartOfCurrentKey)
		 * 	{
		 * 		// In this scenario, the current M record type line's key inputs doesn't match the expected key for the related C record type.
		 * 		// So define a new key and track this record as a new transaction
		 * 		return keyField1 + keyField2;
		 * 	}
		 * 	// Otherwise, use the standard logic or current key
		 * 	return null;
		 * }
		 */
		/*GetKeyForLine: function (lineArray, currentKey)
		{
			return null;
		},*/

		/**
		 * @method Lib.CA.Lockbox.Customization.Extraction.ParseAmountFromString
		 * @since 330
		 * @description
		 * Allows customizing how amounts in the lockbox index file are parsed from string to number.
		 * This user exit is called for every amount field extracted from the lockbox index file.
		 *
		 * @param {string} amountString The raw amount field extracted from the index file represented as a string.
		 *
		 * @returns {number|null} The converted amount.
		 * Returning null will result in the default logic being used to convert the amount.
		 * @example <caption>The following example will handle cases where the amounts are represented with "." as the thousands separator and "," as the decimal separator.</caption>
		 * ParseAmountFromString: function (amountString)
		 * {
		 * 	amountString = amountString.replace(".", "");
		 * 	amountString = amountString.replace(",", ".");
		 * 	return amountString;
		 * }
		 */
		/*ParseAmountFromString: function (amountString)
		{
			return null;
		},*/
	};

	return Extraction;

})();
