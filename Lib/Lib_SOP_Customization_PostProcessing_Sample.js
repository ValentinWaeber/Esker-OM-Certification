/**
 * SOP Package PostProcessing script customization callbacks
 * @namespace Lib.SOP.Customization.PostProcessing
 */

/* LIB_DEFINITION{
  "name": "Lib_SOP_Customization_PostProcessing_Sample",
  "scriptType": "SERVER",
  "comment": "Custom library extending Customer Order Processing PostProcessing script on server side",
  "versionable": false,
  "libraryType": "Lib",
  "require": []
}*/

var Lib = Lib || {};
Lib.SOP = Lib.SOP || {};
Lib.SOP.Customization = Lib.SOP.Customization || {};

Lib.SOP.Customization.PostProcessing = (function ()
{
	/**
	 * @lends Lib.SOP.Customization.PostProcessing
	 */
	var customization =
	{
		/**
		* @description This function will be called at the begining of SOP PostProcessing Script.
		* If needed, use it to customize SOP finalization.
		* Allows you to customize the Customer Order Processing process once it has reached its final status. This user exit is called from the post-processing script of the Customer Order Processing process, at the beginning of the script.
		* - The post-processing script is used to perform operations that require the process to have a final status and to be archived, and the files to have their final format. At this step, data or files should not be modified anymore. For this reason, we recommend that you customize the post-processing script as little as possible.
		*
		* @returns To disable the execution of the standard code: return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution()
		*
		* @example
		* This user exit stops the execution of the post-processing script of the order.
		* 	<pre><code>function OnPostProcessingScriptBegin()
		* 	{
		* 		//Do not execute the SOP PostProcessing Script.
		* 		return Lib.SOP.Helpers.GetCustomContext().DisableStandardExecution();
		* 	}</code></pre>
		*/
		OnPostProcessingScriptBegin: function ()
		{
		},

		/**
		* @description This function will be called at the end of SOP PostProcessing Script.
		* If needed, use it to customize SOP generation.
		* Allows you to customize the Customer Order Processing process once it has reached its final status. This user exit is called from the post-processing script of the Customer Order Processing process, at the end of the script.
		* - The post-processing script is used to perform operations that require the process to have a final status and to be archived, and the files to have their final format. At this step, data or files should not be modified anymore. For this reason, we recommend that you customize the post-processing script as little as possible.
		*
		* @returns No return value expected
		*
		* @example
		* This user exit uses customization libraries to generate an EDI file from the current order and send an email with the EDI file attached.
		* 	<pre><code>function OnPostProcessingScriptEnd()
		* 	{
		*		var ediFile = Lib.PS.EDI.GetEDIFile();//PS function which generates an EDI File of the current process.
		*		Lib.PS.Mailing.SendEDIEmail(ediFile);//PS function which sends an email with the EDI File attached.
		* 	}</code></pre>
		*/
		OnPostProcessingScriptEnd: function ()
		{
		},

		/**
		* @description This function is called each time the function ComputeSLA is called in the SOP PostProcessing Script
		* If needed, use it to customize the way we compute the Service Level Agreement metric.
		* Allows you to customize the SLA OrderProcessingDurationInMinutes__ and OrderProcessingDelayInDays__ values. This user exit is called from the PostProcessing script of the Customer Order Processing process, at the beginning of the script.
		*
		* @returns {(number|object)} (deprecated for number) the ellapsed time in minutes between OrderReceptionDateTime__ and CompletionDateTime minus days off and working hours
		* OR
		* An object with the following structure :
		* {
		*	elapsedTimeMinutes : a number containing the ellapsed time in minutes between OrderReceptionDateTime__ and CompletionDateTime minus days off and working hours,
		*	delayInDays : a number containing the delay in days of processed orders, taking into account working hours and cutoff time
		* }
		*
		* @example
		* This user exit prevents the default OrderProcessingDurationInMinutes__ SLA value to be computed and allows to set a different behaviour.
		*	<pre><code>ComputeSLA: function()
		*	{
		*		var configuration = Sys.OM.Helpers.GetConfiguration();
		*		var startDate = Data.GetValue("OrderReceptionDateTime__");
		*		var endDate = Data.GetValue("CompvarionDateTime");
		*		var whData = configuration.WorkingHoursData; // e.g [{"name":"Sunday","isActive":true,"workingHours":[["9:00","12:30"],["14:00","17:00"]]}, ...]
		*		var bhData = configuration.BankHolidaysData; // e.g [{"date":"2019-01-01T12:00:00.000Z","name":"New Year's Day"}, ...]
		*		var timezone = configuration.WorkingTimeZone;
		*		var SLAData = {
		*			elapsedTimeMinutes:	0,
		*			delayInDays: 0
		*		}
		*		// variables above are used to process SLAData
		*		return SLAData;
		*	}</code></pre>
		*/
		ComputeSLA: function ()
		{
		},
		/**
		 * @description Allows to customize the json object containing all values required to generate a NSO UBL pre agreed orders
		 * Please refer to http://docs.peppol.eu/poacc/upgrade-3/syntax/OrderAgreement/tree/ for mandatory fields
		 *
		 * @param {object} orderMappedData the json object containing all values required to generate a NSO UBL pre agreed orders or order response, PARTIALLY filled from the order
		 *
		 * @returns {object} the same orderMappedData FULLY filled
		 *
		 * @example
		 * <pre><code>// the default json structure for pre agreed orders without values with 1 item example
			 * var orderMappedData ={
			 *	"buyerCustomerParty": {
			 *		"endpointId": null,
			 *		"endpointSchemeId": "9921", // IPA code
			 *		"postalAddress": {
			 *			"additionalStreetName": null,
			 *			"addressLine": null,
			 *			"cityName": null,
			 *			"countryCode": null,
			 *			"countrySubentity": null,
			 *			"postalZone": null,
			 *			"streetName": null
			 *		},
			 *		"registrationName": null
			 *	},
			 *	"currencyCode": null,
			 *	"deliveryTerms": {
			 *		"deliveryLocation": {
			 *			"address": {
			 *				"additionalStreetName": null,
			 *				"addressLine": null,
			 *				"cityName": null,
			 *				"countryCode": null,
			 *				"countrySubentity": null,
			 *				"postalZone": null,
			 *				"streetName": null
			 *			},
			 *			"id": null
			 *		},
			 *		"specialTerms": 220
			 *	},
			 *	"issueDate": null,
		 *	"orderId": null,
			 *	"tenderNumber": null,
			 *	"orderLines": [
			 *		{
			 *			"delivery": {
			 *				"promisedDelivery": {
			 *					"endDate": null,
			 *					"startDate": null
			 *				}
			 *			},
			 *			"item": {
		 *				"description": null,
			 *				"id": null,
			 *				"nationalCode": null,
		 *				"name": null,
		 *				"tenderNumber": null,
			 *			},
			 *			"lineExtensionAmount": null,
			 *			"lineExtensionAmountCurrencyId": null,
			 *			"orderLineId": null,
			 *			"price": {
			 *				"currencyId": null,
			 *				"netAmount": null
			 *			},
			 *			"quantity": null,
			 *			"quantityUnitCode": null
			 *		}
			 *	],
			 *	"orderReferenceId": 0,
			 *	"sellerSupplierParty": {
			 *		"endpointId": null,
			 *		"endpointSchemeId": "9906", // VAT code
			 *		"postalAddress": {
			 *			"additionalStreetName": null,
			 *			"addressLine": null,
			 *			"cityName": null,
			 *			"countryCode": null,
			 *			"countrySubentity": null,
			 *			"postalZone": null,
			 *			"streetName": null
			 *		},
			 *		"registrationName": null
			 *	}
			 *}; </code></pre>
		 *
		 * @example
		 * <pre><code> // the default json structure for pre order responses without values with 1 item example
		 *  var orderMappedData = {
		 * 		"orderId": null,
		 *		"salesOrderId": null,
		 *		"issueDate": null,
		 *		"orderResponseCode": null,
		 *		"note": null,
		 *		"currencyCode": "EUR",
		 *		"customerReferenceName": null,
		 *		"orderReference": null,
		 *		"sellerSupplierParty": {
			 *			"endpointId": null,
			 *			"endpointSchemeId": "9906",
			 *			"postalAddress": {
			 *				"additionalStreetName": null,
			 *				"addressLine": null,
			 *				"cityName": null,
			 *				"countryCode": null,
			 *				"countrySubentity": null,
			 *				"postalZone": null,
			 *				"streetName": null
			 *			},
			 *			"registrationName": null
			 *		},
		 *		"buyerCustomerParty": {
			 *			"endpointId": null,
			 *			"endpointSchemeId": "9921",
			 *			"postalAddress": {
			 *				"additionalStreetName": null,
			 *				"addressLine": null,
			 *				"cityName": null,
			 *				"countryCode": null,
			 *				"countrySubentity": null,
			 *				"postalZone": null,
			 *				"streetName": null
			 *			},
			 *			"registrationName": null
			 *		},
		 *		"delivery": {
		 *			"startDate": null,
		 *			"endDate": null
		 *		}
		 * };
		 * </code></pre>
		 *
		 * @example
		 * <pre><code>UpdateNSOPublishingMappedData: function (orderMappedData)
		 * {
		 *		if(!orderMappedData.currencyCode) {
		 *			orderMappedData.currencyCode = "EUR";
		 *		}
		 *		orderMappedData.sellerSupplierParty.endpointId = "SUPPLIER ID";
		 *		orderMappedData.sellerSupplierParty.endpointSchemeId = "9906";
		 *		orderMappedData.sellerSupplierParty.postalAddress.streetName = "Connecticut street";
		 *		orderMappedData.sellerSupplierParty.postalAddress.cityName = "Boston";
		 *		orderMappedData.sellerSupplierParty.postalAddress.postalZone = "92761";
		 *		orderMappedData.sellerSupplierParty.postalAddress.countrySubentity = "BO";
		 *		orderMappedData.sellerSupplierParty.postalAddress.countryCode = "US";
		 *		orderMappedData.sellerSupplierParty.registrationName = "The supplier";
		 *
		 *		orderMappedData.buyerCustomerParty.endpointId = "BUYER ID";
		 *		orderMappedData.buyerCustomerParty.endpointSchemeId = "9921";
		 *
		 * 		// only necessary for pre agreed orders - no line items for order responses
		 *		for(var i = 0; i < orderMappedData.orderLines.length; i++) {
		 *			orderMappedData.orderLines[i].quantityUnitCode = "C62";
		 *			orderMappedData.orderLines[i].lineExtensionAmountCurrencyID = orderMappedData.currencyCode;
		 *			orderMappedData.orderLines[i].price.currencyId = orderMappedData.currencyCode;
		 *
		 * 			orderMappedData.orderLines[i].item.nationalCode = "XXXX";
		 *			orderMappedData.orderLines[i].item.tenderNumber = "ES09";
		 *			if(!orderMappedData.orderLines[i].price.netAmount) {
		 *				orderMappedData.orderLines[i].price.netAmount = parseInt(orderMappedData.orderLines[i].lineExtensionAmount / orderMappedData.orderLines[i].quantity, 10);
		 *			}
		 *		}
		 * 		return orderMappedData;
		 * }
		 * </code></pre>
		 */
		UpdateNSOPublishingMappedData: function (orderMappedData)
		{
		}
	};
	return customization;
})();
