/* LIB_DEFINITION{
  "name": "LIB_CA_CUSTOMIZATION_RECYCLE_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "SERVER",
  "versionable": false,
  "comment": "CashApplication Recycle customization functions",
  "require": []
}*/

/**
 * This module contains
 * - the functions used to customize the Recycled payment cleanup in the Cash Application
 * @namespace Lib.CA.Customization.Recycle
 */

///#GLOBALS Lib
// eslint-disable-next-line no-redeclare
var Lib = Lib || {};
Lib.CA = Lib.CA || {};
Lib.CA.Customization = Lib.CA.Customization || {};

Lib.CA.Customization.Recycle = (function ()
{
	/**
	 * @lends Lib.CA.Customization.Recycle
	 */
	var Recycle =
	{
		/**
		 * @method Lib.CA.Customization.Recycle.InitializeRecycledPaymentCleanupValidation
		 * @description
		 * Allows for initializing the recycled payment cleanup validation.
		 * This user exit is called before the recycled payment cleanup validation script.
		 */
		/*InitializeRecycledPaymentCleanupValidation: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Recycle.FinalizeRecycledPaymentCleanupValidation
		 * @description
		 * Allows for finalizing the recycled payment cleanup validation.
		 * This user exit is called before the recycled payment cleanup at the end of the validation script.
		 */
		/*FinalizeRecycledPaymentCleanupValidation: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Recycle.InitializeRecycledPaymentCleanupFinalization
		 * @description
		 * Allows for initializing the recycled payment cleanup finalization.
		 * This user exit is called before the recycled payment cleanup finalization script.
		 */
		/*InitializeRecycledPaymentCleanupFinalization: function()
		{
		},*/

		/**
		 * @method Lib.CA.Customization.Recycle.FinalizeRecycledPaymentCleanupFinalization
		 * @description
		 * Allows for finalizing the recycled payment cleanup finalization.
		 * This user exit is called before the recycled payment cleanup at the end of the finalization script.
		 */
		/*FinalizeRecycledPaymentCleanupFinalization: function()
		{
		}*/
	};

	return Recycle;
})();