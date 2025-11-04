/* LIB_DEFINITION{
  "name": "LIB_CA_LOCKBOX_CUSTOMIZATION_COMMON_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "COMMON",
  "versionable": false,
  "comment": "PS configurations that can be used in all scripts",
  "require": []
}*/

/**
 * This module contains functions allowing to
 * - customize the fields that can be extracted from the lockbox file and saved
 * @namespace Lib.CA.Lockbox.Customization.Common
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.Lockbox = Lib.CA.Lockbox || {};
Lib.CA.Lockbox.Customization = Lib.CA.Lockbox.Customization || {};

Lib.CA.Lockbox.Customization.Common = (function ()
{
	/**
	 * @lends Lib.CA.Lockbox.Customization.Common
	 */
	var Common =
	{
		/**
		 * @interface Lib.CA.Configuration.LockboxConfigurationMappingField
		 * @prop {string} name Technical name of the field to populate
		 * @prop {string} type type of the field to populate. Should be one of "string", "float", or "date"
		 * @prop {string} label Translatable label of the field to populate
		 * @prop {string} tableName (optional) Name of the table in which the field is located
		 * Available values are:
		 * - "Invoices_table__" for fields in the invoice table on the payment allocation
		 * - "Account_Allocation_Table__" for fields in the GL adjustment table on the payment allocation
		 * - "Allocate_To_Customer_Table__" for fields in the customer adjustment table on the payment allocation
		 * @prop {string} tableLabel (optional) Translatable label for the applicable table
		 * Expected values for the available tables are, respectively:
		 * - "_Invoices table report"
		 * - "_Account_Allocation_Table"
		 * - "_Allocate to customer table"
		 */

		/**
		 * @interface Lib.CA.Configuration.LockboxMappingEntry
		 * @prop {string} formField Technical name of the field to populate
		 * @prop {string} sourceCSVColumn (optional) Name of the column in the lockbox file to extract the value from
		 */

		/**
		 * @interface Lib.CA.Configuration.DestinationMappingEntry
		 * @prop {boolean} isKey Determines if this field should be used as a part of a unique identifier for the payment in the lockbox file
		 * @prop {Lib.CA.Configuration.ExtractionType} extractionType Determines the destination type for where the field will be populated
		 * Available values are:
		 * - "ExtractionPaymentHeader" for general fields on the payment allocation form
		 * - "ExtractionPaymentInvoice" for fields in the invoice, G/L adjustment, or Customer adjustment tables on the payment allocation form
		 * - "ExtractionRemittanceHeader" for general fields on the remittance advice form
		 * @prop {string} recordTypeHeader (optional) Column in the lockbox file from which the record type is extracted
		 * @prop {string} recordTypeValue (optional) Record type of the line in the lockbox file where this field can be extracted from
		 * @prop {string} indexFileHeader Name of the column in the lockbox file to extract the value from
		 * @prop {string} destinationField Technical name of the field to populate
		 * @prop {Lib.CA.Configuration.DestinationMappingMergeBehavior} mergeBehavior (optional) When there are multiple entries for the same destinationField, this logic will be applied to determine how to merge/obtain the value
		 * Available values are:
		 * - "Single" to take the first value, where priority is set by the order of the mapping table
		 * - "Combine" to combine several values into a single value, separated by "-", or the value defined in the external variable "FieldCombinationLinker"
		 */

		/**
		 * @method Lib.CA.Lockbox.Customization.Common.AdditionalAvailableLockboxFormFields
		 * @since 330
		 * @description
		 * Allows for customizing the fields that can be extracted from the lockbox file and saved.
		 * This function relates to fields that can be extracted and populated in the lockbox file processing form.
		 * This is called from the lockbox file configuration script to determine which technical fields can be selected.
		 * @return {Lib.CA.Configuration.LockboxConfigurationMappingField[]} the additional fields that can be configured to be extracted from the lockbox file.
		 * @example <caption>This example will add the file name as a mappable field</caption>
		 * AdditionalAvailableLockboxFormFields: function ()
		 * {
		 * 	return [
		 * 		{
		 * 			name: "Filename__",
		 * 			type: "string",
		 * 			label: "_Filename"
		 * 		}
		 * 	];
		 * }
		 */
		/*AdditionalAvailableLockboxFormFields: function ()
		{
		},*/

		/**
		 * @method Lib.CA.Lockbox.Customization.Common.AdditionalAvailablePaymentFormFields
		 * @since 330
		 * @description
		 * Allows for customizing the fields that can be extracted from the lockbox file and saved.
		 * This function relates to fields that can be extracted and populated in the payment allocation form.
		 * This is called from the lockbox file configuration script to determine which technical fields can be selected.
		 * @return {Lib.CA.Configuration.LockboxConfigurationMappingField[]} the additional fields that can be configured to be extracted from the lockbox file.
		 * @example <caption>This example will add the allocation comment as a mappable field</caption>
		 * AdditionalAvailablePaymentFormFields: function ()
		 * {
		 * 	return [
		 * 		{
		 * 			name: "Allocate_Comment__",
		 * 			type: "string",
		 * 			label: "_Allocate comment"
		 * 		}
		 * 	];
		 * }
		 */
		/*AdditionalAvailablePaymentFormFields: function ()
		{
		},*/

		/**
		 * @method Lib.CA.Lockbox.Customization.Common.AdditionalAvailablePaymentTableFields
		 * @since 330
		 * @description
		 * Allows for customizing the fields that can be extracted from the lockbox file and saved.
		 * This function relates to fields that can be extracted and populated in the tables on the payment allocation form.
		 * This is called from the lockbox file configuration script to determine which technical fields can be selected.
		 * @return {Lib.CA.Configuration.LockboxConfigurationMappingField[]} the additional fields that can be configured to be extracted from the lockbox file.
		 * For this function, these must have the tableName field set in the returned objects, otherwise issues may arise.
		 * @example <caption>This example will add the destination/cross company code field for the G/L and Customer adjustment tables</caption>
		 * AdditionalAvailablePaymentFormFields: function ()
		 * {
		 * 	return [
		 * 		{
		 * 			name: "Col_destination_company_code__",
		 * 			type: "string",
		 * 			label: "_Destination company code",
		 * 			tableName: "Account_Allocation_Table__",
		 * 			tableLabel: "_Account_Allocation_Table"
		 * 		},
		 * 		{
		 * 			name: "Col_customer_company_code__",
		 * 			type: "string",
		 * 			label: "_Col customer company code",
		 * 			tableName: "Allocate_To_Customer_Table__",
		 * 			tableLabel: "_Allocate to customer table"
		 * 		}
		 * 	];
		 * }
		 */
		/*AdditionalAvailablePaymentTableFields: function ()
		{
		},*/

		/**
		 * @method Lib.CA.Lockbox.Customization.Common.AdditionalAvailableRemittanceFormFields
		 * @since 330
		 * @description
		 * Allows for customizing the fields that can be extracted from the lockbox file and saved.
		 * This function relates to fields that can be extracted and populated in the remittance advice form.
		 * This is called from the lockbox file configuration script to determine which technical fields can be selected.
		 * @return {Lib.CA.Configuration.LockboxConfigurationMappingField[]} the additional fields that can be configured to be extracted from the lockbox file.
		 * @example <caption>This example will add a custom field to the mappable fields list</caption>
		 * AdditionalAvailablePaymentFormFields: function ()
		 * {
		 * 	return [
		 * 		{
		 * 			name: "Z_Custom_Text__",
		 * 			type: "string",
		 * 			label: "_Custom text label"
		 * 		}
		 * 	];
		 * }
		 */
		/*AdditionalAvailableRemittanceFormFields: function ()
		{
		},*/

		/**
		 * @method Lib.CA.Lockbox.Customization.Common.DefaultLockboxFieldMapping
		 * @since 330
		 * @description
		 * Allows for customizing the lockbox file mapping to lockbox-level fields that defined how the file can be extracted.
		 * This is called whenever filling in the default mapping tables on the lockbox configuration form.
		 * @param {ESKMap<Lib.CA.Configuration.LockboxMappingEntry>} lockboxFieldMapping the hard-coded mapping that is set by default.
		 * @return {ESKMap<Lib.CA.Configuration.LockboxMappingEntry>} the mapping to use when extracting lockbox-level information from the lockbox file.
		 * @example <caption>This example will add the currency as a mapped field for 'PNC' lockbox file formats from the column with a header label "Currency"</caption>
		 * DefaultLockboxFieldMapping: function (lockboxFieldMapping)
		 * {
		 * 	let currentIndex = Object.keys(lockboxFieldMapping).length;
		 * 	if (Data.GetValue("Lockbox_file_type__") === "PNCLockbox")
		 * 	{
		 * 		lockboxFieldMapping[currentIndex++] = {
		 * 			"formField": "Currency__",
		 * 			"sourceCSVColumn": "Currency"
		 * 		};
		 * 	}
		 * 	return lockboxFieldMapping;
		 * }
		 */
		/*DefaultLockboxFieldMapping: function (lockboxFieldMapping)
		{
		},*/

		/**
		 * @method Lib.CA.Lockbox.Customization.Common.DefaultDestinationFieldMapping
		 * @since 330
		 * @description
		 * Allows for customizing the lockbox file mapping to destination/technical-level fields that defined how the file can be extracted.
		 * This is called whenever filling in the default mapping tables on the lockbox configuration form.
		 * @param {ESKMap<Lib.CA.Configuration.DestinationMappingEntry>} destinationFieldMapping the hard-coded mapping that is set by default.
		 * @return {ESKMap<Lib.CA.Configuration.DestinationMappingEntry>} the mapping to use when extracting destination/technical-level information from the lockbox file.
		 * @example <caption>This example will update the fields mapped to the "All Page Images" and "All Page Backs" columns as supporting images by the default for 'PNC' lockbox file formats</caption>
		 * DefaultDestinationFieldMapping: function (destinationFieldMapping)
		 * {
		 * 	if (Data.GetValue("Lockbox_file_type__") === "PNCLockbox")
		 * 	{
		 * 		let mappingKeys = Object.keys(destinationFieldMapping);
		 * 		for (const key of mappingKeys)
		 * 		{
		 * 			if (destinationFieldMapping[key].indexFileHeader === "All Page Images" || destinationFieldMapping[key].indexFileHeader === "All Page Backs")
		 * 			{
		 * 				destinationFieldMapping[key].destinationField = "SupportingImageFileName";
		 * 			}
		 * 		}
		 * 	}
		 * 	return destinationFieldMapping;
		 * }
		 */
		/*DefaultDestinationFieldMapping: function (destinationFieldMapping)
		{
		},*/
	};
	return Common;
})();