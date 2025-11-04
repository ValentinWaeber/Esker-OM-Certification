/* LIB_DEFINITION{
  "name": "Lib_CM_Customization_Gauge_Sample",
  "libraryType": "Lib",
  "scriptType": "CLIENT",
  "versionable": false,
  "comment": "",
  "require": []
}*/

/**
 * Package CM gauge customization to allow you to display custom gauge
 * @namespace Lib.CM.Customization.Gauge
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.CM = Lib.CM || {};
Lib.CM.Customization = Lib.CM.Customization || {};

Lib.CM.Customization.Gauge = (function ()
{
	/**
	 * @lends Lib.CM.Customization.Gauge
	 */
	var customization = {
		/**
		 * Allows you to add a custom credit score gauge for a customer.
		 * You will have to retrieve your own specific data to display.
		 * This user exit is called in LIB_CM_SCORINGPROVIDERS
		 * @param {Object} ScoringProviders global object from LIB_CM_SCORINGPROVIDERS
		 * @example
		 * This example shows how to add new gauge with score retrieve from CM - Credit Score__ table
		 * <pre><code>
		 * // Gauge structure to display data
		 *	var gaugeObject = {
		 *		logoPath: Process.GetImageURL(PATH_TO_PROVIDER_LOGO);
		 *		gauge: {
		 *			value: integer,
		 *			scoreName: string,
		 *			displayedValue: string||integer,
		 *			variation: string,
		 *			scale: { min: { val: integer }, max: { val: integer } },
		 *			thresholds: [
		 *				{ maxVal: integer, color: string },
		 *				{ maxVal: integer, color: string },
		 *				{ maxVal: integer, color: string },
		 *				{ maxVal: integer, color: string },
		 *				{ maxVal: integer, color: string }
		 *			]
		 *		},
		 *		footer: {
		 *			editLink: {
		 *				hidden: boolean, //display button or not
		 *				label: string
		 *			},
		 *			viewMoreLink: {
		 *				hidden: boolean,
		 *				label: string,
		 *				url: string,
		 *				onClick: Controls.form_header.Wait(false)
		 *			},
		 *			alerts: { list: [string], indicator: string -> warning/danger },
		 *			tiles: [
		 *				{
		 *					title: string
		 *					value: string
		 *				}
		 *			],
		 *		},
		 *		name: string
		 *	};
		 *
		 *	// Gauge structure if error when querying score or nothing retreive from webservice
		 *	var gaugeObject = {
		 *		logoPath: Process.GetImageURL(PATH_TO_PROVIDER_LOGO);

		 *	};
		 *	AddCustomGauge: function (ScoringProviders)
		 *	{
		 *		Query.DBQuery(
		 *			function ()
		 *			{
		 *				if (!this.GetRecordsCount())
		 *				{
		 *					gaugeObject = {
		 *						logoPath: Process.GetImageURL("public\\creditScoreProvider_nacm_logo.svg"),
		 *						footer: {
		 *							editLink: {
		 *								label: Language.Translate("_Edit", false)
		 *							}
		 *						},
		 *						name: "nacm_delayed"
		 *					};
		 *					Lib.Gauge.AddDelayedGauge(gaugeObject);
		 *					return true;
		 *				}
		 *				var attributes = this.GetQueryValue().RecordsDefinition;
		 *				var scoreData = {};
		 *				for (var attr in attributes)
		 *				{
		 *					scoreData[attr.toLowerCase()] = attr.toLowerCase() === "json__" && !Sys.Helpers.IsEmpty(this.GetQueryValue(attr, 0)) ?
		 *						JSON.parse(this.GetQueryValue(attr, 0)) :
		 *						this.GetQueryValue(attr, 0);
		 *				}
		 *				var scoreScale = scoreData.scorescale__.split("-");
		 *				var gaugeObject = {
		 *					logoPath: Process.GetImageURL("public\\creditScoreProvider_nacm_logo.svg"),
		 *					gauge: {
		 *						value: isNaN(scoreData.score__) ? 0 : parseInt(scoreData.score__, 10),
		 *						scoreName: scoreData.json__.scoreName,
		 *						displayedValue: scoreData.score__,
		 *						variation: scoreData.trend__ === "up" || scoreData.trend__ === "down" ? scoreData.trend__ : "none",
		 *						scale: { min: { val: parseInt(scoreScale[0], 10) }, max: { val: parseInt(scoreScale[1], 10) } },
		 *						thresholds: [
		 *							{ maxVal: 400, color: "black" },
		 *							{ maxVal: 450, color: "red" },
		 *							{ maxVal: 575, color: "orange" },
		 *							{ maxVal: 710, color: "yellow" },
		 *							{ maxVal: 850, color: "green" }
		 *						]
		 *					},
		 *					footer: {
		 *						editLink: {
		 *							hidden: false,
		 *							label: Language.Translate("_Edit", false)
		 *						},
		 *						viewMoreLink: {
		 *							hidden: false,
		 *							label: Language.Translate("_More", false),
		 *							url: "https://nacm.org/",
		 *							onClick: Controls.form_header.Wait(false)
		 *						},
		 *						alerts: { list: [], indicator: "" },
		 *						tiles: [
		 *							{
		 *								title: Language.Translate("_Overall business risk", false), // 1,2,3,4A,413,5
		 *								value: scoreData.json__.riskclass ? scoreData.json__.riskclass : "&nbsp;"
		 *							},
		 *							{
		 *								title: Language.Translate("_dbt", false),
		 *								value: scoreData.json__.DBT ? scoreData.json__.DBT : "&nbsp;"
		 *							},
		 *							{
		 *								title: Language.Translate("_CreditLimit", false),
		 *								value: (scoreData.json__.highcredit && scoreData.json__.highcredit.value) ?
		 *									Lib.CM.CustomerHelper.CurrencyFormat(scoreData.json__.highcredit.value, scoreData.json__.highcredit.currency) : "&nbsp;"
		 *							},
		 *							{
		 *								title: Language.Translate("_Last update", false),
		 *								value: scoreData.lastupdatedate__ ? Language.FormatDate(new Date(scoreData.lastupdatedate__)) : "&nbsp;"
		 *							}
		 *						],
		 *					},
		 *					name: "nacm_" + scoreData.msn
		 *				};
		 *				Lib.Gauge.AddGauge(gaugeObject);
		 *			},
		 *			"CM - Credit score__",
		 *			"",
		 *			"(&(Identifier__=" + ScoringProviders.company.scoreId + ")(Provider__=Nacm))",
		 *			"",
		 *			"no_limit"
		 *		);
		 *		return true;
         *	},
		 * </code></pre>
		 */
		AddCustomGauge: function (/*ScoringProviders*/)
		{
		},
		/**
		 * Allows you to handle refresh event on custom gauge
		 * (click on edit)
		 * This user exit is called in LIB_CM_SCORINGPROVIDERS
		 * @param {Object} ScoringProviders global object from LIB_CM_SCORINGPROVIDERS
		 * @param {Object} gaugeData object representing the gauge object at the refresh
		 * @param {function} callback callback new gauge object with refreshed data or an error object.
		 * @example
		 * This example shows how to handle refresh event and returning an error
		 * If you want to query an external webservice you will have to develop your own queries.
		 * <pre><code>
		 * // error object example
		 * var errorObject = { error: true, msg: "No Score Retrieve" };
		 *
		 * OnRefreshCustomGauge: function (ScoringProviders, data, resolveCB)
		 * {
		 *		//query to retrieve data from webservice
		 *		//build a gauge object like in AddCustomGauge function or an errorObject like above
		 *		//resolveCB(gaugeObject||errorObject);
		 * }
		 * </code></pre>
		 */

		OnRefreshCustomGauge: function (/*ScoringProviders, gaugeData, callback*/)
		{
		}
	};
	return customization;
})();
