/* LIB_DEFINITION{
  "name": "Lib_CM_Customization_Reviews_Sample",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "additional customizations of reviews",
  "require": []
}*/

/**
 * This module contains functions allowing to perform additional actions in finalization of credit management processes
 * @namespace Lib.CM.Customization.Reviews
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.CM = Lib.CM || {};
Lib.CM.Customization = Lib.CM.Customization || {};

Lib.CM.Customization.Reviews = (function ()
{
	/**
	 * @lends Lib.CM.Customization.Reviews
	 */
	var reviews = {
		/**
		 * Allows you to customize the Priority of a credit Application during its validation.
		 * You must return an int between 1 and Infinity
		 * @example
		 * This example shows how to compute the priority based on the Credit Limit and the review reason
		 * <pre><code>
		 * CustomizeReviewPriority: function ()
		 * {
		 *		var reviewReason = Data.GetValue("ReasonReview__");
		 *		var priority = Lib.CM_Server.CreditApplicationReview.GetReviewReasonsOrder().indexOf(reviewReason);
		 *		if(priority > -1)
		 *		{
		 *			return priority + 1;
		 *		}
		 *		return 1;
		 * }
		 * </code></pre>
		 */
		CustomizeReviewPriority: function ()
		{ }
	};

	return reviews;
})();

