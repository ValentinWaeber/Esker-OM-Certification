/* LIB_DEFINITION{
  "name": "LIB_CA_CUSTOMIZATION_DELIVERIES_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "all deliveries customization function",
  "require": []
}*/

/**
 * Package CA deliveries customization callbacks for all processes
 * @namespace Lib.CA.Customization.Deliveries
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.Customization = Lib.CA.Customization || {};

Lib.CA.Customization.Deliveries = (function ()
{
	/**
	 * @lends Lib.CA.Customization.Deliveries
	 */
	var Deliveries =
	{
		/**
		 * Definition of PaymentFromRemittanceAdviceItem object
		 * @interface Lib.CA.Customization.Deliveries.PaymentFromRemittanceAdviceItem
		 * @prop {string} paymentMethod
		 * @prop {string} paymentDate
		 * @prop {number} paidAmount
		 * @prop {string} payer
		 * @prop {string} payerName
		 * @prop {string} payeeAccountNumber
		 * @prop {string} checkNumber
		 * @prop {string} transactionId
		 * @prop {boolean} lockboxType
		 * @prop {string} lockboxNumber
		 * @prop {string} lockboxBatchID
		 * @prop {string} lockboxTransactionID
		 * @prop {string} currency
		 * @prop {string} remittanceAdviceRUIDEx
		 * @prop {string} companyCode
		 * @prop {Date} submissionDate
		 * @prop {string} fileName
		 * @prop {string} fileType
		 * @prop {string} bankNumber
		 */

		/**
		 * @method Lib.CA.Customization.Deliveries.InitializeRemittanceAdviceProcessingGeneration
		 * @description
		 * Function called at the beginning of the Remittance Advice processing generation script
		 */
		/*InitializeRemittanceAdviceProcessingGeneration: function ()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Deliveries.FinalizeRemittanceAdviceProcessingGeneration
		 * @description
		 * Function called at the end of the Remittance Advice processing generation script
		 */
		/*FinalizeRemittanceAdviceProcessingGeneration: function ()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Deliveries.CustomizeRemittanceAdviceOutputAdditionalField
		 * @description
		 * The purpose of this user exit is to allow PS to customize the way fields that they added are reported in the
		 * remittance output XML file.
		 * @param {string} fieldName The field name that can be customized
		 * @param {object} value The value of the field
		 * @param {object} properties The properties object returned by Data.GetProperties() or Item.GetProperties()
		 * @param {number} lineIndex The 0-based line index of the table if the field is a column of the
		 * invoices table, undefined otherwise
		 * @returns {object} an object with 2 properties:
		 * - nodeName: The name of the node added in the XML file
		 * - nodeValue: The content of the node
		 * If this user exit returns null, the current field is not added to the XML file
		 */
		CustomizeRemittanceAdviceOutputAdditionalField: function (fieldName, value, properties, lineIndex)
		{
			return {
				nodeName: fieldName.replace(/_/g, ''),
				nodeValue: value
			};
		},

		/**
		 * @method Lib.CA.Customization.Deliveries.CustomizeRemittanceAdviceOutputFileParameters
		 * @description
		 * The purpose of this user exit is to allow PS to customize the conversion option of the output file
		 * depending of the input file's extension
		 * @param {string} inputExtension The input file's extension including the dot and in lowercase
		 * @returns {object} an object with 2 properties:
		 * - res_x: the horizontal dpi, minimum is 20 and maximum is 300
		 * - res_y: the vertical dpi, minimum is 20 and maximum is 300
		 * @example
		 * CustomizeRemittanceAdviceOutputFileParameters: function (inputExtension)
		 * {
		 * 	switch(inputExtension)
		 * 	{
		 * 		case '.pdf' :
		 * 			return {
		 * 				res_x: 204,
		 * 				res_y: 196
		 * 		};
		 * 		case '.tif' :
		 * 			return {
		 * 				res_x: 204,
		 * 				res_y: 196
		 * 		};
		 * 		default :
		 * 			return {
		 * 				res_x: 204,
		 * 				res_y: 196
		 * 		};
		 * }
		 */
		/*CustomizeRemittanceAdviceOutputFileParameters: function (inputExtension)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Deliveries.AllocatePaymentFromRemittanceAdvice
		 * @description
		 * This function is used to trigger the payment allocation as soon as the remittance advice has been processed.
		 * Use {@link Lib.CA.Customization.Deliveries.AllocatePaymentFromRemittanceAdviceUsingConfiguration AllocatePaymentFromRemittanceAdviceUsingConfiguration} user exit to specify payment configuration to apply.
		 * @returns {boolean} True if the payment allocation should be created, else false.
		 */
		/*AllocatePaymentFromRemittanceAdvice: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Deliveries.AllocatePaymentFromRemittanceAdviceUsingConfiguration
		 * @description
		 * This function is used to specify the payment allocation configuration to use when creating an allocation from the remittance.
		 * Note: this configuration MUST be of type 'Lockbox check/remittance advice' or 'Zero-balance payment'.
		 * @returns {string} Name of the 'Lockbox check/remittance advice' or 'Zero-balance payment' configuration to apply.
		 */
		/*AllocatePaymentFromRemittanceAdviceUsingConfiguration: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Deliveries.CustomizeDeductionCreationFromRemittanceAdvice
		 * @description
		 * Function called before create deduction instance
		 * This function is called just before .Process(). This way, you can still customize notifications, variables, etc of the transport given in parameter
		 * @param {xTransport} deduction xTransport object obtained with Process.CreateTransport()
		 * @param {Lib.CA.Remittance.Common.MissingDeductionClaim} deductionInfo deduction information
		 * @example
		 * CustomizeDeductionCreationFromRemittanceAdvice: function (deduction, deductionInfo)
		 * {
		 * 	// Change OwnerId of deduction to set deduction analyst
		 * 	var deductionVars = deduction.GetUninheritedVars();
		 * 	var deductionAnalystLogin = "deductionanalyst@esker.com";
		 * 	var deductionAnalystUser = Users.GetUser(deductionAnalystLogin);
		 * 	var deductionAnalystOwnerId = deductionAnalystUser.GetValue("OwnerId");
		 * 	deductionVars.AddValue_String("OwnerID", deductionAnalystOwnerId, true);
		 * }
		 */
		/*CustomizeDeductionCreationFromRemittanceAdvice: function (deduction, deductionInfo)
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Deliveries.CustomizeCreatePaymentAllocationFromRemittanceAdvice
		 * @description
		 * Function called to customize transaction before payment is created from lockbox.
		 * See PaymentFromRemittanceAdviceItem, you can override how most payment values are set here.
		 * @param {Lib.CA.Customization.Deliveries.PaymentFromRemittanceAdviceItem} transaction Current transaction
		 * @returns {Lib.CA.Customization.Deliveries.PaymentFromRemittanceAdviceItem} Modified transaction
		 */
		/*CustomizeCreatePaymentAllocationFromRemittanceAdvice: function (transaction)
		{
			return transaction;
		}*/
	};

	return Deliveries;

})();
