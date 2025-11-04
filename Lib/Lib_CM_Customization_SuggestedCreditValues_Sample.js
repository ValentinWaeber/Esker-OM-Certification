/* LIB_DEFINITION{
  "name": "Lib_CM_Customization_SuggestedCreditValues_Sample",
  "libraryType": "Lib",
  "scriptType": "COMMON",
  "comment": "CM library",
  "versionable": false,
  "require": [
    "Sys/Sys_Helpers_Promise",
    "Sys/Sys_Helpers_Date",
    "Sys/Sys_Helpers_LdapUtil",
    "[Sys/Sys_GenericApi_Server]",
    "[Sys/Sys_GenericApi_Client]",
    "Sys/Sys_AR",
    "Sys/Sys_Helpers"
  ]
}*/

/**
 * Credit Management module customization functions to suggest
 * @namespace Lib.CM.Customization.SuggestedCreditValues
 */

///#GLOBALS Lib Sys

var Lib = Lib || {};
Lib.CM = Lib.CM || {};
Lib.CM.Customization = Lib.CM.Customization || {};

Lib.CM.Customization.SuggestedCreditValues = (function ()
{
	/*var InternalScoreRuleSources = {
		CreditAgency: "creditAgency",
		CustomerInfos: "customerInfos",
		FinancialStatementInfos: "financialStatementInfos",
		Termsync: "termsync"
	};*/

	/**
	 * @lends Lib.CM.Customization.SuggestedCreditValues
	*/
	var customization = {

		/**
		 * Allows you to calculated an internal credit score for credit review
		 * This user exit is called at the CM - Internal Credit Score process.
		 * @property {string} args.customerLogin - Customer identifier
		 * @property {string} args.scoreId - Credit score identifier
		 * @property {string} args.currency - Customer currency
		 * @returns {number} internal score value
		 * @example
		 * This user exit generate an internal score with the TermSync data.
		 * <pre><code>
		 * 	ComputeInternalScore: function (args)
		 *	{
		 *		var internalScore = null;
		 *		var handleCallback = function (records)
		 *		{
		 *			if (records.length)
		 *			{
		 *				for (var i = 0; i < records.length; i++)
		 *				{
		 *					var keys = Object.keys(records[i]);
		 *					var n = keys.length;
		 *					var newobj = {};
		 *					while (n--)
		 *					{
		 *						var key = keys[n];
		 *						newobj[key.toLowerCase()] = records[i][key];
		 *						newobj[key.toLowerCase()] = key.toLowerCase() === "json__" ?
		 *							JSON.parse(records[i][key] || {}) :
		 *							records[i][key];
		 *					}
		 *					records[i] = newobj;
		 *					var matrixWeightScore = {
		 *						failureScore: {
		 *							value: records[i].json__.failureScore,
		 *							weight: 40,
		 *							point: null
		 *						},
		 *						paydexScore: {
		 *							value: records[i].score__,
		 *							weight: 40,
		 *							point: null
		 *						},
		 *						nbEmployees: {
		 *							value: records[i].json__.numberOfEmployees,
		 *							weight: 5,
		 *							point: null
		 *						},
		 *						yearBusiness: {
		 *							value: records[i].json__.yearsInBusiness,
		 *							weight: 5,
		 *							point: null
		 *						}
		 *					};
		 *
		 *					//Failure Score (Previously Financial Stress Score Percentile) (D&B)
		 *					if (matrixWeightScore.failureScore.value >= 95)
		 *					{
		 *						matrixWeightScore.failureScore.point = 100;
		 *					}
		 *					else if (matrixWeightScore.failureScore.value >= 69)
		 *					{
		 *						matrixWeightScore.failureScore.point = 70;
		 *					}
		 *					else if (matrixWeightScore.failureScore.value >= 34)
		 *					{
		 *						matrixWeightScore.failureScore.point = 50;
		 *					}
		 *					else if (matrixWeightScore.failureScore.value >= 10)
		 *					{
		 *						matrixWeightScore.failureScore.point = 30;
		 *					}
		 *					else if (matrixWeightScore.failureScore.value > 0)
		 *					{
		 *						matrixWeightScore.failureScore.point = 10;
		 *					}
		 *					else
		 *					{
		 *						matrixWeightScore.failureScore.point = 0;
		 *					}
		 *
		 *					//Paydex (D&B) scores[j].score__
		 *					if (matrixWeightScore.paydexScore.value >= 90)
		 *					{
		 *						matrixWeightScore.paydexScore.point = 100;
		 *					}
		 *					else if (matrixWeightScore.paydexScore.value >= 70)
		 *					{
		 *						matrixWeightScore.paydexScore.point = 75;
		 *					}
		 *					else if (matrixWeightScore.paydexScore.value >= 60)
		 *					{
		 *						matrixWeightScore.paydexScore.point = 50;
		 *					}
		 *					else if (matrixWeightScore.paydexScore.value >= 10)
		 *					{
		 *						matrixWeightScore.paydexScore.point = 25;
		 *					}
		 *					else
		 *					{
		 *						matrixWeightScore.paydexScore.point = 0;
		 *					}
		 *
		 *					//Total Employees (D&B)
		 *					if (matrixWeightScore.nbEmployees.value >= 1000)
		 *					{
		 *						matrixWeightScore.nbEmployees.point = 100;
		 *					}
		 *					else if (matrixWeightScore.nbEmployees.value >= 500)
		 *					{
		 *						matrixWeightScore.nbEmployees.point = 75;
		 *					}
		 *					else if (matrixWeightScore.nbEmployees.value >= 100)
		 *					{
		 *						matrixWeightScore.nbEmployees.point = 50;
		 *					}
		 *					else if (matrixWeightScore.nbEmployees.value >= 50)
		 *					{
		 *						matrixWeightScore.nbEmployees.point = 25;
		 *					}
		 *					else
		 *					{
		 *						matrixWeightScore.nbEmployees.point = 0;
		 *					}
		 *
		 *					//Years in Business (D&B)
		 *					if (matrixWeightScore.yearBusiness.value >= 20)
		 *					{
		 *						matrixWeightScore.yearBusiness.point = 100;
		 *					}
		 *					else if (matrixWeightScore.yearBusiness.value >= 10)
		 *					{
		 *						matrixWeightScore.yearBusiness.point = 75;
		 *					}
		 *					else if (matrixWeightScore.yearBusiness.value >= 5)
		 *					{
		 *						matrixWeightScore.yearBusiness.point = 50;
		 *					}
		 *					else if (matrixWeightScore.yearBusiness.value >= 4)
		 *					{
		 *						matrixWeightScore.yearBusiness.point = 25;
		 *					}
		 *					else
		 *					{
		 *						matrixWeightScore.yearBusiness.point = 0;
		 *					}
		 *					internalScore = (matrixWeightScore.yearBusiness.point * matrixWeightScore.yearBusiness.weight) / 100 +
		 *						(matrixWeightScore.nbEmployees.point * matrixWeightScore.nbEmployees.weight) / 100 +
		 *						(matrixWeightScore.paydexScore.point * matrixWeightScore.paydexScore.weight) / 100 +
		 *						(matrixWeightScore.failureScore.point * matrixWeightScore.failureScore.weight) / 100;
		 *				}
		 *			}
		 *		};
		 *		if (args.scoreId)
		 *		{
		 *			var queryFilter = Sys.Helpers.LdapUtil.FilterAnd(
		 *				Sys.Helpers.LdapUtil.FilterEqual("Identifier__", args.scoreId),
		 *				Sys.Helpers.LdapUtil.FilterEqual("Provider__", "duns")
		 *			);
		 *			Sys.GenericAPI.Query("CM - Credit score__",
		 *				queryFilter.toString(),
		 *				["*"],
		 *				handleCallback,
		 *				null,
		 *				"no_limit",
		 *				{ upperAttributes : true, asAdmin: true, useConstantQueryCache: true }
		 *			);
		 *		}
		 *		return internalScore;
		 *	},
		 *	</code></pre>
		 */
		ComputeInternalScore: null,

		/**
		 * @type {"CreditAgency" | "CustomerInfos" | "Termsync" | "financialStatementInfos"}
		 * @desc describes scores rules provider
		 * "CreditAgency" we pick information from table <i>Credit management - credit score</i>
		 * "CustomerInfos" we pick information from extended customer information table
		 * "CreditAppInfos" we pick information from credit application
		 * "Termsync" we pick information from Termsync
		 * @example
		 * This object set the data sources for internal score calculation.
		 * <pre><code>
		 *  InternalScoreRuleSources: {
		 *		CreditAgency: "creditAgency",
		 *		CustomerInfos: "customerInfos",
		 *		CreditAppInfos: "creditAppInfos",
		 *		FinancialStatementInfos: "financialStatementInfos",
		 *		Termsync: "termsync"
		 *	};
		 * </code></pre>
		 */
		InternalScoreRuleSources: null,

		/**
		 * Allows you to create your own rules to calculate internal score.
		 * Internal score condense some customer, credit agency, termsync information or credit app to give a quick view of a company score.
		 * Warning this object can't work if Lib.CM.Customization.SuggestedCreditValues.ComputeInternalScore is defined
		 * this is called in process called by the <i>CM - Internal Credit Score schedule</i> task and table <i>Credit Management - Scoring Rule</i>
		 * @property {object} Assignments.ObjectName - objectName is free. It's your name for the rule
		 * @property {string} Assignments.ObjectName.label - Label displayed in the table <i>Credit Management - Scoring Rule</i> to select this rule
		 * @property {string} Assignments.ObjectName.detailLabel - Label displayed in the table <i>Credit Management - Scoring Rule</i> to qualified the detail field
		 * @property {InternalScoreRuleSources} Assignments.ObjectName.source - Defined which kind of data is used in this rule.
		 * @property {string} Assignments.ObjectName.creditAgency - Defined which kind of data is used in this rule.
		 * Only use with Assignments.ObjectName.source set to source.CreditAgency
		 * @property {string} Assignments.ObjectName.field - Defined in which field data used for this rule must be get.
		 * @property {string} Assignments.ObjectName.valuePath - Only use with Assignments.ObjectName.source set to source.CreditAgency.
		 * If data is in the json__ field, get the path to the data. Use the dot to access to the sub json level
		 * @example
		 * This object set the data sources for internal score calculation.
		 * <pre><code>
		 *	InternalScoreRules: {
		 *		dunsScore: {
		 *			label: "_Dun & Bradstreet - Paydex",
		 *			detailLabel: "_Paydex",
		 *			source: InternalScoreRuleSources.CreditAgency,
		 *			creditAgency: "duns",
		 *			valuePath: "paydex.value"
		 *		},
		 *		crmScore: {
		 *			label: "_Credit Risk Monitor - PAYCE",
		 *			detailLabel: "_Payce",
		 *			source: InternalScoreRuleSources.CreditAgency,
		 *			creditAgency: "creditriskmonitor",
		 *			field: "Score__"
		 *		},
		 *		creditLimit: {
		 *			label: "_Customer Information - Credit limit",
		 *			detailLabel: "_Credit limit",
		 *			source: InternalScoreRuleSources.CustomerInfos,
		 *			field: "CreditLimit__"
		 *		},
		 *		averageDaysToPay: {
		 *			label: "_Termsync - Average days to pay",
		 *			detailLabel: "_Average days to pay",
		 *			source: InternalScoreRuleSources.Termsync,
		 *			field: "AverageDSO"
		 *		},
		 *		payerRating: {
		 *			label: "_Termsync - Payer rating",
		 *			detailLabel: "_Payer rating",
		 *			source: InternalScoreRuleSources.Termsync,
		 *			field: "PayerRating",
		 *			possibleValues: {
		 *				"excellent": {
		 *					label: "_excellent"
		 *				},
		 *				"good": {
		 *					label: "_good"
		 *				},
		 *				"fair": {
		 *					label: "_fair"
		 *				},
		 *				"poor": {
		 *					label: "_poor"
		 *				}
		 *			}
		 *		},
		 *		creditLimitRequested: {
		 *			label: "_CreditApp Information - Credit limit requested",
		 *			detailLabel: "_CreditLimitRequest",
		 *			source: InternalScoreRuleSources.CreditAppInfos,
		 *			field: "CreditLimitRequest__"
		 *		},
		 *		currentRatio: {
		 *			label: "_Financial Statement - Current_ratio__",
		 *			detailLabel: "_Financial Statement - Current_ratio__",
		 *			source: InternalScoreRuleSources.FinancialStatementInfos,
		 *			field: "Current_ratio__"
		 *		}
		 *	},
		 * </code></pre>
		 */
		InternalScoreRules: null,

		/**
		 * Allows you to calculate suggested credit limit,
		 * payment terms and risk category by their associated user exit.
		 * This user exit is called at Layout.ReviewSupplier.Init in credit application as well as in validationscript for both review an credit app
		 * @property {string} internalScore - Internal score calculated for this customer
		 * @property {json} customerInfos - Customer informations
		 * @property {Function} callback - Function use to display suggested values
		 * @example
		 * This user exit generate suggested credit values.
		 * <pre><code>
		 *	GenerateSuggestedCreditValues: function (args)
		 *	{
		 *		//To know if we are being called from processing scripts or custom script we can use this helper: Sys.ScriptInfo.IsClient()
		 *		//To know if the process is a credit application or a review we can use: Data.GetValue("Review__")
		 *		var suggestedValues = { suggestedCreditLimit: null, suggestedPaymentTerms: null, suggestedRiskCategory: null }
		 *		if (args.internalScore >= 80)
		 *		{
		 *			suggestedValues.suggestedRiskCategory = 1;
		 *			suggestedValues.suggestedPaymentTerms = net30;
		 *			suggestedValues.suggestedCreditLimit = 100000;
		 *		}
		 *		else if (args.internalScore >= 50)
		 *		{
		 *			suggestedValues.suggestedRiskCategory += 3;
		 *			suggestedValues.suggestedPaymentTerms = net10;
		 *			suggestedValues.suggestedCreditLimit = 50000;
		 *		}
		 *		else if (args.internalScore >= 20)
		 *		{
		 *			suggestedValues.suggestedRiskCategory += 2;
		 *			suggestedValues.suggestedPaymentTerms = net20;
		 *			suggestedValues.suggestedCreditLimit = 20000;
		 *		}
		 *		else
		 *		{
		 *			suggestedValues.suggestedRiskCategory += 2;
		 *			suggestedValues.suggestedPaymentTerms = net20;
		 *			suggestedValues.suggestedCreditLimit = 20000;
		 *		}
		 *		args.callback(suggestedValues);
		 *	},
		 * </code></pre>
		 */
		GenerateSuggestedCreditValues: null,

		/**
		 * Allows you to customize assignment rules for calculating suggested credit values.
		 * Allows you to create your own rules for :
		 *	- suggested credit limit, payment terms and risk category in credit reviews
		 *	- alerts on polling
		 * 	- alerts on credit risk
		 * Warning: this object can't work if Lib.CM.Customization.SuggestedCreditValues.GenerateSuggestedCreditValues is defined
		 * This is called in credit application customscript, credit scores polling and table cm - assignment rule
		 * @property {object} Assignments.ObjectName - objectName can be CreditReview/Polling/CreditRiskAlerts depending on which process you want to apply rules
		 * @property {string} Assignments.ObjectName.label - label to display the objectName in cm - assignment rule
		 * @property {object} Assignments.ObjectName.FieldObject - object to describe rules on a particular field
		 * @property {string} Assignments.ObjectName.FieldObject.label - label to display the Field__ field  in cm - assignment rule
		 * @property {string} Assignments.ObjectName.FieldObject.field - field on which you want to apply rule
		 * (Field can be CalculatedCreditLimitForCreditApp__/CalculatedRiskCategoryForCreditApp__/CalculatedPaymentTerms__/TriggerAlertCreditScore__)
		 * @property {string} Assignments.ObjectName.FieldObject.type - field type on cm credit application
		 * @property {object} Assignments.ObjectName.FieldObject.rules - rules object
		 * @property {string} Assignments.ObjectName.FieldObject.rules.label - rule label
		 * @property {function} Assignments.ObjectName.FieldObject.rules.compute - function called in cm - credit application customscript
		 * to compute value to be displayed in suggested fields
		 * @example
		 * this user exit defines the assignemnt for credit reviews.
		 * <pre><code>
		 *		currentAssignments.CreditReview = {
		 *			label: "_CreditManagementReview",
		 *			Z_SuggestedCreditLimit: {
		 *				label: "Z_ProposedCreditLimit__",
		 *				field: "Z_CalculatedCreditLimitForCreditApp__",
		 *				rules: {
		 *					fifteenPercent: {
		 *						label: "_LastMonth15%",
		 *						compute: function ()
		 *						{
		 *							var funcArgs = arguments[0];
		 *							var handleCallback = function (records)
		 *							{
		 *								var value = 0;
		 *								if (records.length)
		 *								{
		 *									value = Math.round(records[0].OUTSTANDING__ * 1.15 / 1000) * 1000;
		 *								}
		 *								funcArgs.callback(value);
		 *							};
		 *							var lastDayPreviousMonth = Sys.Helpers.Date.Date2DBDate(new Date(new Date().getFullYear(), new Date().getMonth(), 0));
		 *							var firstDayPreviousMonth = Sys.Helpers.Date.Date2DBDate(new Date(new Date().getFullYear(), new Date().getMonth() - 1));
		 *							doQuery({
		 *								firstDay: firstDayPreviousMonth,
		 *								lastDay: lastDayPreviousMonth,
		 *								customerNumber: funcArgs.customerNumber,
		 *								handleCallback: handleCallback
		 *							});
		 *						}
		 *					},
		 *					serverUpdater: function (value, formattedValue, options)
		 *					{
		 *						if(value != void 0)
		 *						{
		 *							Data.SetValue("Z_ProposedCreditLimit__", value);
		 *						}
		 *					},
		 *					clientUpdater: function (value, formattedValue, options)
		 *					{
		 *						if(formattedValue != void 0)
		 *						{
		 *							Data.SetValue("Z_ProposedCreditLimit__", formattedValue);
		 *						}
		 *					}
		 *				}
		 *			}
		 *		};
		 * 		return currentAssignments;
		 * }
		 * </code></pre>
		 */
		CustomizeAssignments: function (/*currentAssignments*/)
		{ },

		/**
		 * Type definition for CreateCreditAgencyFieldOptions
		 * @typedef {Object} Lib.CM.Customization.SuggestedCreditValues.CreateCreditAgencyFieldOptions
		 * @property {string} label The name of the field, if a key is provided it will be translated in the interface,
		 * @property {string} creditAgency The name of the credit agence (Ex: "creditsafe", "duns", "experian"...),
		 * @property {string} valuePath The path to the value in the score object (Ex: "score.value"),
		 * @property {boolean} isNumber Whether the field is a number
		 */

		/**
		 * Type definition for CreateCreditAgencyField function
		 * @function Lib.CM.Customization.SuggestedCreditValues.TypeCreateCreditAgencyField
		 * @param {CreateCreditAgencyFieldOptions} options - The name of the field to create
		 * @returns {AssignmentField} The created field object
		 */

		/**
		 * Type definition for CreateCreditAgencyFieldOptions
		 * @typedef {Object} Lib.CM.Customization.SuggestedCreditValues.CreateValueFomRuleFieldOptions
		 * @property {Array.<string>} assignment The name of the assignment(s) where the field will be used  ("CreditReview", "CreditApp", etc...)],
		 * @property {string} label The name of the field, if a key is provided it will be translated in the interface,
		 * @property {string} fieldName The name of the field that will be computed by a rule (the rule will be loaded using this field in the filter)
		 */

		/**
		 * Type definition for CreateCreditAgencyField function
		 * @function Lib.CM.Customization.SuggestedCreditValues.TypeCreateValueFomRuleField
		 * @param {CreateValueFomRuleFieldOptions} options - The name of the field to create
		 * @returns {AssignmentField} The created field object
		 */

		/**
		 * @typedef {Object} Lib.CM.Customization.SuggestedCreditValues.SuggestedCreditValuesObjects
		 * @property {"CreditReview"} CreditReview
		 * @property {"CreditApp"} CreditApp
		 * @property {"Polling"} Polling
		 * @property {"CreditRiskAlerts"} CreditRiskAlerts
		 */

		/**
		 * Type definition for FieldCreatorHelper
		 * @typedef {Object} Lib.CM.Customization.SuggestedCreditValues.FieldCreatorHelper
		 * @property {Lib.CM.Customization.SuggestedCreditValues.TypeCreateCreditAgencyField} CreateCreditAgencyField
		 * @property {Lib.CM.Customization.SuggestedCreditValues.TypeCreateValueFomRuleField} CreateValueFomRuleField
		 * @property {Lib.CM.Customization.SuggestedCreditValues.SuggestedCreditValuesObjects}
		 */

		/**
		 * Allows you to create new fields to use for assignments
		 * Warning: this object can't work if Lib.CM.Customization.SuggestedCreditValues.GenerateSuggestedCreditValues is defined
		 * This is called in credit application customscript, credit scores polling and table cm - assignment rule
		 * @param {object} currentAssignmentFields - object containing the current fields available for assignment rules
		 * @param {FieldCreatorHelper} fieldCreatorHelper - helper to create fields
		 * @property {object} AssignmentsFields.ObjectName - name of the object describing the field
		 * @property {string} AssignmentsFields.ObjectName.label - label to display the objectName in cm - assignment rule
		 * @property {string} [AssignmentsFields.ObjectName.assignment] - Assign the field to a specific assignment.
		 * In our exemple, internalScore will only be available for credit reviews
		 * @property {array} [AssignmentsFields.ObjectName.operators] - Give a list of operators to use for the field (if not specified, all are available)
		 * @property {object} [AssignmentsFields.ObjectName.values] - object containing the possible values
		 * @property {string} [AssignmentsFields.ObjectName.values.label] - label of the value
		 * @property {function} AssignmentsFields.ObjectName.GetValue - function called to return the value of the field
		 * @example
		 * In the example here I've added a new field that will be available for polling, in it we get the value for the lastscore update that is found in the score json
		 * <pre><code>
		 * CustomizeAssignmentsFields: function (currentAssignmentFields, fieldCreatorHelper)
		 * {
		 * 	currentAssignmentFields.CreditSafeLastUpdate =
		 *	{
		 *		assignment: "Polling",
		 *		label: "CreditSafe - Last score update",
		 *		GetValue: function (args, callback)
		 *		{
		 *			args.scoreInfo.providerScore === "creditsafe" ? callback(parseFloat(args.scoreInfo.newScore.score.lastUpdate)) : callback(null);
		 *		}
		 *	}
		 *  return currentAssignmentFields;
		 * }
		 * </code></pre>
		 */
		CustomizeAssignmentsFields: function (/*currentAssignmentFields, fieldCreatorHelper*/)
		{ }
	};
	return customization;
})();
