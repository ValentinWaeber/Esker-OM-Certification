/* LIB_DEFINITION{
  "name": "Lib_CM_Customization_ReviewReasons_Sample",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "Handling review reasons in credit applications",
  "require": []
}*/

/**
 * This module contains functions allowing to perform additional actions on reviews reasons of credit management processes
 * @namespace Lib.CM.Customization.ReviewReasons
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.CM = Lib.CM || {};
Lib.CM.Customization = Lib.CM.Customization || {};

Lib.CM.Customization.ReviewReasons = (function ()
{
	/**
	 * @lends Lib.CM.Customization.ReviewReasons
	*/
	const customization = {
		/**
		 * Allows you to change priority order of review reasons
		 * @returns {Array} array of reasons with the same keys as in the combobox ReasonReview__ ordered as you want it
		 */
		CustomizeReviewReasonsOrder: function ()
		{
			/*return ['blockedOrders',
				'creditLimitExceeded',
				'scoreAlerts',
				'overdueAmount',
				'predictionExceedsCreditLimit',
				'creditCheckRequest',
				'newCustomer',
				'manual',
				'periodic',
				'insuranceDecision'];*/
		}
	};

	return customization;
})();
