/* LIB_DEFINITION{
  "name": "Lib_CM_Customization_CreditScore_Sample",
  "libraryType": "Lib",
  "scriptType": "COMMON",
  "versionable": false,
  "comment": "",
  "require": [
    "Sys/Sys_Helpers",
    "Sys/Sys_Helpers_LdapUtil"
  ]
}*/

/**
 * Credit Management module customization functions
 * @namespace Lib.CM.Customization.CreditScore
 */


var Lib = Lib || {};
Lib.CM = Lib.CM || {};
Lib.CM.Customization = Lib.CM.Customization || {};

Lib.CM.Customization.CreditScore = (function ()
{
	/**
	 * @lends Lib.CM.Customization.CreditScore
	*/
	var creditScore = {
		/**
		 * Allow you to customize the default providers queries if you want to modify some data retrieve by API
		 * @param {Object} Providers - Object with all the default providers
		 * @example
		 * This user exit rewrite the getProviderData for experian and add a new function retrieveAddressDataForCustomer
		 * <pre><code>
		 * CustomizeProviders: function (Providers)
		 * {
		 *		Providers.experian.getProviderData = function (queryRecord)
		 *		{
		 *			//customization start
		 *			var that = this;
		 *			if ( Process.GetName() == "Customer_Extended_Delivery_Properties__" )
		 *			{
		 *				that.retrieveAddressDataForCustomer();
		 *			}
		 *			//customization end
		 *			Log.Info("Experian.GetProviderData");
		 *			return queryRecord ?
		 *				{
		 *					provider: queryRecord.PROVIDER__,
		 *					credentials: Providers.GetCredentials(queryRecord),
		 *					onViewMoreClick: function ()
		 *					{
		 *						// USPS-GJG custom user exit
		 *						if ( Lib.CM.CustomizationPS.Gauge.experian.useCustom_OnViewMoreClick )
		 *						{
		 *							Lib.CM.CustomizationPS.Gauge.experian.onViewMoreClick( ScoringProviders );
		 *						}
		 *						// USPS-GJG custom user exit
		 *						else
		 *						{
		 *							// standard code
		 *							Log.Info("Experian.GetProviderData.onViewMoreClick");
		 *							Log.Info("ScoringProviders: " + JSON.stringify(ScoringProviders) );
		 *							if (ScoringProviders.company && ScoringProviders.company.thirdPartiesIds && ScoringProviders.company.thirdPartiesIds.experianId
		 *								&& ScoringProviders.scoreProviders.experian && ScoringProviders.scoreProviders.experian.credentials)
		 *							{
		 *								Controls.form_header.Wait(true);
		 *								var provider = new Sys.CM.ExperianClient(ScoringProviders.scoreProviders.experian.credentials);
		 *								provider.GetSessionKey(function (isAuthenticated)
		 *								{
		 *									if (isAuthenticated)
		 *									{
		 *										provider.GetB64PdfReport(ScoringProviders.company, function (data)
		 *										{
		 *											Lib.Gauge.OpenB64Pdf(data.b64report);
		 *											Controls.form_header.Wait(false);
		 *										});
		 *									}
		 *									else
		 *									{ Controls.form_header.Wait(false); }
		 *								});
		 *							}
		 *							else
		 *							{ Controls.form_header.Wait(false); }
		 *						}
		 *					}
		 *				} : null;
		 *		};
		 *		Providers.experian.retrieveAddressDataForCustomer = function()
		 *		{
		 *			var self = Lib.CM.Customization.CreditScore.Experian;
		 *			var mapping =
		 *			{
		 *				ADDITIONALFIELD1: "Additional_Field1__",
		 *				ADDITIONALFIELD2: "Additional_Field2__",
		 *				ADDITIONALFIELD3: "Additional_Field3__",
		 *				ADDITIONALFIELD4: "Additional_Field4__",
		 *				ADDITIONALFIELD5: "Additional_Field5__",
		 *				CITY: "City__",
		 *				COMPANY: "Company__",
		 *				COUNTRY: "Country__",
		 *				//DELIVERYCOPYEMAIL: "Send_Copy_Email__",
		 *				DESCRIPTION: "Additional_Information__",
		 *				DISPLAYNAME: "Display_Name__",
		 *				EMAILADDRESS: "Email_Address__",
		 *				FAXNUMBER: "Fax_Number__",
		 *				FIRSTNAME: "First_Name__",
		 *				LASTNAME: "Last_Name__",
		 *				MAILSTATE: "Mail_State__",
		 *				MAILSUB: "MailSub__",
		 *				MIDDLENAME: "Middle_Name__",
		 *				MOBILENUMBER: "Mobile_Number__",
		 *				PHONENUMBER: "Phone_Number__",
		 *				STREET: "Street__",
		 *				POBOX: "POBox__",
		 *				TITLE: "Title__",
		 *				ZIPCODE: "Zip_Code__",
		 *				DISPLAYWELCOMESCREEN: "Display_Welcome_Page__"
		 *			};
		 *
		 *			Query.DBQuery(function ()
		 *			{
		 *				for (var prop in mapping)
		 *				{
		 *					self.addressData[ prop ] = this.GetQueryValue( prop ) ? this.GetQueryValue( prop ) : "" ;
		 *				}
		 *				Log.Info("Address data retrieved");
		 *			}, "ODUSER", Object.keys(mapping).join("|"), "(msn=" + ProcessInstance.extendedProperties.msn + ")", null, 1, null, "FastSearch=1");
		 *		};
		 *		return Providers;
		 * },
		 * </code></pre>
		 */
		CustomizeProviders: function (/*Providers*/)
		{ },
		/**
		 * @namespace Lib.CM.Customization.CreditScore.CreditRiskMonitor
		 * @description
		 * CreditRiskMonitor object to customize the extraction and the display of CreditRiskMonitor gauge
		 * @property {function} Extraction - Modify the parsed object from credit Risk Monitor provider
		 * @property {function} Interface - Modify the mapping for the object which is displayed in Gauge
		 * @example
		 * This user exit extract and display the zScore for CreditRiskMonitor
		 * <pre><code>
		 *	Extraction: function(jsonObject, data)
		 *	{
		 *		data.ZScore = jsonObject.Data.ZScore;
		 *		return data;
		 *	},
		 *	Interface: function (fullJSON, gaugeObject)
		 *	{
		 *		gaugeObject.footer.tiles.push({
		 *			title: "ZScore",
		 *			value: fullJSON.json__.ZScore
		 *		});
		 *		return gaugeObject;
		 *	}
		 * </code></pre>
		 */
		CreditRiskMonitor: {
			/**
			 * @method Lib.CM.Customization.CreditScore.CreditRiskMonitor.Extraction
			 * @description
			 * Modify the parsed object from credit Risk Monitor provider. This object is stored in Json field of table CM - Credit Score
			 * This user exit is called in the Sys_CM_CreditRiskMonitor and in the Sys_CM_CreditRiskMonitorClient.
			 * @param {any} jsonObject object data retrieve from credit risk monitor.
			 * @param {any} data default parsed object from credit risk monitor.
			 * @returns {any} Object representing the mapping between credit risk monitor xml and which data we store.
			 * @example
			 * This user exit add the zScore in the data we want to store.
			 * <pre><code>
			 *	Extraction: function(jsonObject, data)
			 *	{
			 *		data.zScore = jsonObject.Data.ZScore;
			 *		return data;
			 *	}
			 * </code></pre>
			 */
			Extraction: function (/*jsonObject, data*/)
			{ },
			/**
			 * @method Lib.CM.Customization.CreditScore.CreditRiskMonitor.Interface
			 * @description
			 * Modify the mapping for the object which is displayed in Gauge in Credit Application and CIM
			 * This user exit is called in the Lib_Gauge.
			 * @param {any} fullJSON json you have just customize with Lib.CM.Customization.CreditScore.Extraction.
			 * @param {any} gaugeObject default json displayed in gauge.
			 * @returns {any} Object representing the updated json displayed in gauge.
			 * @example
			 * This user exit add the zScore in a new tile.
			 * <pre><code>
			 * Interface: function (fullJSON, gaugeObject)
			 * {
			 *		gaugeObject.footer.tiles.push({
			 *			title: "zScore",
			 *			value: fullJSON.json__.zScore
			 *		});
			 *		return gaugeObject;
			 * }
			 * </code></pre>
			 */
			Interface: function (/*fullJSON, gaugeObject*/)
			{ },
			/**
			 * @method Lib.CM.Customization.CreditScore.CreditRiskMonitor.ParseCompanies
			 * @description
			 * Allow you to customize the parsing when retrieving multiple companies for credit score
			 * @param {any} ctrlTable the table Controls
			 * @example
			 * This user exit add a new column and reorder columns
			 * <pre><code>
			 * ParseCompanies: function (companyFromProvider, business)
			 * {
			 *		business.hierarchy = companyFromProvider.Hierarchy;
			 *		return business;
			 * }
			 * </code></pre>
			 */
			ParseCompanies: function (/*companyFromProvider, business*/)
			{ },
			/**
			 * @method Lib.CM.Customization.CreditScore.CreditRiskMonitor.AddColumnToPopup
			 * @description
			 * Allow you to customize the table (add, reorder columns...) inside the selection popup when provider returns multiple companies when trying
			 * to retrieve a score.
			 * @param {any} ctrlTable the table Controls
			 * @example
			 * This user exit add a new column and reorder columns
			 * <pre><code>
			 * AddColumnToPopup: function (ctrlTable)
			 * {
			 *		ctrlTable.AddTextColumn("Hierarchy__", "_Hierarchy", 100);
			 *		ctrlTable.SetColumnsOrder(["Name__", "Hierarchy__", "Address__","Zip_Code__","Country__", "CityName__", "BusinessId__"]);
			 * }
			 * </code></pre>
			 */
			AddColumnToPopup: function (/*ctrlTable*/)
			{ },
			/**
			 * @method Lib.CM.Customization.CreditScore.CreditRiskMonitor.DisplayCompanyInformation
			 * @description
			* Allow you to fill the freshly created column with previous user exit in the table inside the selection popup when provider returns multipe
			* companies when trying to retrieve a score.
			* @param {any} row the row Controls
			* @param {any} business JSON object reprensenting information for a company
			* @example
			* This user exit fill the freshly created Hierarchy column
			* <pre><code>
			* DisplayCompanyInformation: function (row, business)
			* {
			*		row.SetValue("Hierarchy__", business.hierarchy);
			* }
			* </code></pre>
			*/
			DisplayCompanyInformation: function (/*row, business*/)
			{ }
		},
		/**
		 * Same functionality as creditriskmonitor but for CreditSafe provider
		 * @namespace Lib.CM.Customization.CreditScore.CreditSafe
		*/
		CreditSafe: {
			/**
			 * Modify the parsed object from CreditSafe provider. This object is stored in Json field of table CM - Credit Score
			 * This user exit is called in the Sys_CM_CreditSafe and in the Sys_CM_CreditSafeClient.
			 * @param {any} jsonObject object data retrieve from CreditSafe.
			 * @param {any} data default parsed object from CreditSafe.
			 * @returns {any} Object representing the mapping between creditSafe json and which data we store.
			 * @example
			 * This user exit add the zScore in the data we want to store.
			 * <pre><code>
			 *	Extraction: function(jsonObject, data)
			 *	{
			 *		data.zScore = jsonObject.Data.ZScore;
			 *		return data;
			 *	}
			 * </code></pre>
			 */
			Extraction: function (/*jsonObject, data*/)
			{ },
			/**
			 * Modify the mapping for the object which is displayed in Gauge in Credit Application and CIM
			 * This user exit is called in the Lib_Gauge.
			 * @param {any} fullJSON json you have just customize with Lib.CM.Customization.CreditScore.Extraction.
			 * @param {any} gaugeObject default json displayed in gauge.
			 * @returns {any} Object representing the updated json displayed in gauge.
			 * @example
			 * This user exit add the zScore in a new tile.
			 * <pre><code>
			 * Interface: function (fullJSON, gaugeObject)
			 * {
			 *		gaugeObject.footer.tiles.push({
			 *			title: "zScore",
			 *			value: fullJSON.json__.zScore
			 *		});
			 *		return gaugeObject;
			 * }
			 * </code></pre>
			 */
			Interface: function (/*fullJSON, gaugeObject*/)
			{ },
			/**
			 * Allow you to customize the parsing when retrieving multiple companies for credit score
			 * @param {any} ctrlTable the table Controls
			 * @example
			 * This user exit add a new column and reorder columns
			 * <pre><code>
			 * ParseCompanies: function (companyFromProvider, business)
			 * {
			 *		business.hierarchy = companyFromProvider.Hierarchy;
			 *		return business;
			 * }
			 * </code></pre>
			 */
			ParseCompanies: function (/*companyFromProvider, business*/)
			{ },
			/**
			 * Allow you to customize the table (add, reorder columns...) inside the selection popup when provider returns multiple companies when trying
			 * to retrieve a score.
			 * @param {any} ctrlTable the table Controls
			 * @example
			 * This user exit add a new column and reorder columns
			 * <pre><code>
			 * AddColumnToPopup: function (ctrlTable)
			 * {
			 *		ctrlTable.AddTextColumn("Hierarchy__", "_Hierarchy", 100);
			 *		ctrlTable.SetColumnsOrder(["Name__", "Hierarchy__", "Address__","Zip_Code__","Country__", "CityName__", "BusinessId__"]);
			 * }
			 * </code></pre>
			 */
			AddColumnToPopup: function (/*ctrlTable*/)
			{ },
			/**
			* Allow you to fill the freshly created column with previous user exit in the table inside the selection popup when provider returns multipe
			* companies when trying to retrieve a score.
			* @param {any} row the row Controls
			* @param {any} business JSON object reprensenting information for a company
			* @example
			* This user exit fill the freshly created Hierarchy column
			* <pre><code>
			* DisplayCompanyInformation: function (row, business)
			* {
			*		row.SetValue("Hierarchy__", business.hierarchy);
			* }
			* </code></pre>
			*/
			DisplayCompanyInformation: function (/*row, business*/)
			{ },
			/**
			 * Allows customization of the parameters used in the URL for CreditSafe API GetCompanies request.
			 * This user exit overrides the third fallback request, which attempts to find the customer.
			 * 
			 * The request sequence is:
			 * 1. Search by registration number (regno) + countries
			 * 2. Search by VAT number (vatno) + countries
			 * 3. Search by countries + city + name (customizable via this user exit)
			 * 
			 * Notes: 
			 * - The url parameters "countries" is required for all requests.
			 * - Be aware that some combinations of parameters are not allowed in the CreditSafe API (refer to API documentation : https://doc.creditsafe.com/tag/Companies/operation/companySearch?previousPage=https://www.creditsafe.com/gb/en/enterprise/integrations/company-data-api.html). 
			 *   For example, the registration number (regNo) cannot be combined with the company name. 
			 * 
			 * @param {string} defaultURLParameters - The default URL parameters, including city, name, and country. Example: "&countries=FR&name=XX&city=Lyon"
			 * @param {object} company - The company object containing information about the company. Can be customized by others User Exits.
			 * @returns {string} The url parameters to use for the API request. For example : "&countries=FR&name=XX&postCode=1234"
			 * @example
			 * This user exit modifies the URL parameters depending on the company countryCode.
			 * <pre><code>
			 * 		CustomizeCompaniesUrlParams: function (defaultURLParameters, company)
			 *		{
			 *			if (company.countryCode === "GB" && company.postalCode)
			 *			{
			 *				return "&countries=GB&name=" + company.companyName + "&postCode=" + company.postalCode
			 *			}
			 *
			 *			if (company.countryCode === "AE" && company.Z_AE_TaxId)
			 *			{
			 *				return "&countries=AE" + "&regNo=" + company.Z_AE_TaxId
			 *			}
			 *
			 *			return defaultURLParameters;
			 *		}
			 * </code></pre>
			 */
			CustomizeCompaniesUrlParams: function (/*defaultURLParameters, company*/)
			{ }
		},
		/**
		 * Same functionality as creditriskmonitor but for Coface provider
		 */
		Coface: {
			/**
			 * Allow you to customize the parsing when retrieving multiple companies for credit score
			 * @param {any} companyFromProvider The company object returned by coface
			 * @param {any} business the company object that we will store on EOD side
			 * @example
			 * This user exit allows you to parse more fields than the standard ones when querying a company
			 * <pre><code>
			 * ParseCompanies: function (companyFromProvider, business)
			 * {
			 *		business.hierarchy = companyFromProvider.Hierarchy;
			 *		return business;
			 * }
			 * </code></pre>
			 */
			ParseCompanies: function (/*companyFromProvider, business*/)
			{ },

			/**
			 * Allow you to customize the table (add, reorder columns...) inside the selection popup when provider returns multiple companies when trying
			 * to retrieve a score.
			 * @param {any} ctrlTable the table Controls
			 * @example
			 * This user exit add a new column and reorder columns
			 * <pre><code>
			 * AddColumnToPopup: function (ctrlTable)
			 * {
			 *		ctrlTable.AddTextColumn("InternationalCompanyName__", "_International Company Name", 100);
			 *		ctrlTable.SetColumnsOrder(["Name__", "InternationalCompanyName__", "Address__","Zip_Code__","Country__", "CityName__", "BusinessId__"]);
			 * }
			 * </code></pre>
			 */
			AddColumnToPopup: function (/*ctrlTable*/)
			{ },
			/**
			* Allow you to fill the freshly created column with previous user exit in the table inside the selection popup when provider returns multipe
			* companies when trying to retrieve a score.
			* @param {any} row the row Controls
			* @param {any} business JSON object reprensenting information for a company
			* @example
			* This user exit fill the freshly created Hierarchy column
			* <pre><code>
			* DisplayCompanyInformation: function (row, company)
			* {
			*		row.SetValue("InternationalCompanyName__", company.internationalCompanyName);
			* }
			* </code></pre>
			*/
			DisplayCompanyInformation: function (/*row, business*/)
			{ }
		},
		/**
		 * Same functionality as creditriskmonitor but for Duns & BradStreet provider
		 * @namespace Lib.CM.Customization.CreditScore.Duns
		 */
		Duns:
		{
			/**
			 * @method Lib.CM.Customization.CreditScore.Duns.UpdateBlockIDs
			 * @description
			 * Allow you to change data blocks to retrieve information from DUNS
			 * @example
			 * This user exit add 4 data blocks to query
			 * <pre><code>
			 *	UpdateBlockIDs: function()
			 *	{
			 *		return ["companyinfo_L1_v1", "financialstrengthinsight_L2_v1", "paymentinsight_L1_v1", "eventfilings_L1_v1"];
			 *	},
			 * </code></pre>
			 */
			UpdateBlockIDs: function ()
			{ },
			/**
			 * @method Lib.CM.Customization.CreditScore.Duns.Extraction
			 * @description see {@link Lib.CM.Customization.CreditScore.CreditRiskMonitor.Extraction}
			 */
			Extraction: function (/*jsonObject, data*/)
			{ },
			/**
			 * @method Lib.CM.Customization.CreditScore.Duns.Interface
			 * @description see {@link Lib.CM.Customization.CreditScore.CreditRiskMonitor.Interface}
			 */
			Interface: function (/*fullJSON, gaugeObject*/)
			{ },
			/**
			 * Allow you to customize the parsing when retrieving multiple companies for credit score
			 * @param {any} ctrlTable the table Controls
			 * @example
			 * This user exit add a new column and reorder columns
			 * <pre><code>
			 * ParseCompanies: function (companyFromProvider, business)
			 * {
			 *		business.hierarchy = companyFromProvider.Hierarchy;
			 *		return business;
			 * }
			 * </code></pre>
			 */
			ParseCompanies: function (/*companyFromProvider, business*/)
			{ },
			/**
			 * Allow you to customize the table (add, reorder columns...) inside the selection popup when provider returns multiple companies when trying
			 * to retrieve a score.
			 * @param {any} ctrlTable the table Controls
			 * @example
			 * This user exit add a new column and reorder columns
			 * <pre><code>
			 * AddColumnToPopup: function (ctrlTable)
			 * {
			 *		ctrlTable.AddTextColumn("Hierarchy__", "_Hierarchy", 100);
			 *		ctrlTable.SetColumnsOrder(["Name__", "Hierarchy__", "Address__","Zip_Code__","Country__", "CityName__", "BusinessId__"]);
			 * }
			 * </code></pre>
			 */
			AddColumnToPopup: function (/*ctrlTable*/)
			{ },
			/**
			* Allow you to fill the freshly created column with previous user exit in the table inside the selection popup when provider returns multipe
			* companies when trying to retrieve a score.
			* @param {any} row the row Controls
			* @param {any} business JSON object reprensenting information for a company
			* @example
			* This user exit fill the freshly created Hierarchy column
			* <pre><code>
			* DisplayCompanyInformation: function (row, business)
			* {
			*		row.SetValue("Hierarchy__", business.hierarchy);
			* }
			* </code></pre>
			*/
			DisplayCompanyInformation: function (/*row, business*/)
			{ }
		},
		/**
		 * Same functionality as creditriskmonitor but for Ellisphere provider
		 * @namespace Lib.CM.Customization.CreditScore.Ellisphere
		 */
		Ellisphere:
		{
			SELECTORS: {
				XPATH: {},
				QUERY: {}
			},
			/**
			 * @method Lib.CM.Customization.CreditScore.Ellisphere.Extraction
			 */
			Extraction: function (/*xmlDoc, data, client*/)
			{ },
			/**
			 * @method Lib.CM.Customization.CreditScore.Ellisphere.Interface
			 */
			Interface: function (/*fullJSON, gaugeObject*/)
			{ }
		},
		/**
		 * Same functionality as creditriskmonitor but for Experian provider
		 * @namespace Lib.CM.Customization.CreditScore.Experian
		 */
		Experian:
		{
			/**
			 * @method Lib.CM.Customization.CreditScore.Experian.Extraction
			 * @description see {@link Lib.CM.Customization.CreditScore.CreditRiskMonitor.Extraction}
			 */
			Extraction: function (/*jsonObject, data*/)
			{ },
			/**
			 * @method Lib.CM.Customization.CreditScore.Experian.Interface
			 * @description see {@link Lib.CM.Customization.CreditScore.CreditRiskMonitor.Interface}
			 */
			Interface: function (/*fullJSON, gaugeObject*/)
			{ },
			/**
			 * @method Lib.CM.Customization.CreditScore.Experian.SelectEndPoint
			 * @description
			 * Allow you to choose between 2 differents endpoint to query company score information
			 * To make fully work on all situation (score polling, retrieve score from credit application and from customer interface) you have to implement some other
			 * user exit:
			 * Lib.O2C.Customization.CIM.CompanyDataForScoring
			 * Lib.CM.Customization.HTMLScripts.CompanyDataForScoring
			 * Lib.CM.Customization.Extraction.CustomizePollingCustomerQueryFilter
			 * Lib.CM.Customization.Extraction.CustomizePollingCustomerObject
			 * @param {any} company json with information regarding the company you want information
			 * @param {Array} availablesEndpoints array with the 2 differents endpoints
			 * @example
			 * <pre><code>
			 * SelectEndPoint: function (company, availablesEndpoints)
			 * {
			 *		if (!company.taxID)
			 *		{
			 *			return availablesEndpoints[0];
			 *		}
			 *		return availableEndpoints[1];
			 * }
			 * </code></pre>
			 */
			SelectEndPoint: function (/*company, availablesEndpoints*/)
			{ },
			/**
			 * @method Lib.CM.Customization.CreditScore.Experian.SelectPDFEndPoint
			 * @description
			 * Allow you to choose between 2 differents endpoint to query company PDF file
			 * @param {any} company json with information regarding the company you want information
			 * @param {Array} availablesEndpoints array with the 2 differents endpoints
			 * @example
			 * <pre><code>
			 * SelectPDFEndPoint: function (company, availablesPDFEndpoints)
			 * {
			 *		if (!company.taxID)
			 *		{
			 *			return availablesPDFEndpoints[0];
			 *		}
			 *		return availablesPDFEndpoints[1];
			 * }
			 * </code></pre>
			 */
			SelectPDFEndPoint: function (/*company, availablesPDFEndpoints*/)
			{ },
			/**
			 * @method Lib.CM.Customization.CreditScore.Experian.ParseCompanies
			 * @description
			 * Allow you to customize the parsing when retrieving multiple companies for credit score
			 * @param {any} ctrlTable the table Controls
			 * @example
			 * This user exit add a new column and reorder columns
			 * <pre><code>
			 * ParseCompanies: function (companyFromProvider, business)
			 * {
			 *		business.hierarchy = companyFromProvider.Hierarchy;
			 *		return business;
			 * }
			 * </code></pre>
			 */
			ParseCompanies: function (/*companyFromProvider, business*/)
			{ },
			/**
			 * @method Lib.CM.Customization.CreditScore.Experian.AddColumnToPopup
			 * @description
			 * Allow you to customize the table (add, reorder columns...) inside the selection popup when provider returns multiple companies when trying
			 * to retrieve a score.
			 * @param {any} ctrlTable the table Controls
			 * @example
			 * This user exit add a new column and reorder columns
			 * <pre><code>
			 * AddColumnToPopup: function (ctrlTable)
			 * {
			 *		ctrlTable.AddTextColumn("Hierarchy__", "_Hierarchy", 100);
			 *		ctrlTable.SetColumnsOrder(["Name__", "Hierarchy__", "Address__","Zip_Code__","Country__", "CityName__", "BusinessId__"]);
			 * }
			 * </code></pre>
			 */
			AddColumnToPopup: function (/*ctrlTable*/)
			{ },
			/**
			 * @method Lib.CM.Customization.CreditScore.Experian.DisplayCompanyInformation
			 * @description
			 * Allow you to fill the freshly created column with previous user exit in the table inside the selection popup when provider returns multipe
			 * companies when trying to retrieve a score.
			 * @param {any} row the row Controls
			 * @param {any} business JSON object reprensenting information for a company
			 * @example
			 * This user exit fill the freshly created Hierarchy column
			 * <pre><code>
			 * DisplayCompanyInformation: function (row, business)
			 * {
			 *		row.SetValue("Hierarchy__", business.hierarchy);
			 * }
			 * </code></pre>
			 */
			DisplayCompanyInformation: function (/*row, business*/)
			{ },
			/**
			 * @method Lib.CM.Customization.CreditScore.Experian.CustomizeCompaniesInfoRequestData
			 * @description
			 * Allows you to customize the arguments given to Experian when querying company score information
			 * By default we have company name / city / state / taxId
			 * To make fully work on all situation (score polling, retrieve score from credit application and from customer interface) you have to implement some other
			 * user exit:
			 * Lib.O2C.Customization.CIM.CompanyDataForScoring (In the CIM this user exit allows you to fill the company object with whatever fields you might need)
			 * Lib.CM.Customization.HTMLScripts.CompanyDataForScoring (In the credit application this user exit allows you to fill the company object with whatever fields you might need)
			 * Lib.CM.Customization.Extraction.CustomizePollingCustomerQueryFilter (In the polling process this allows you to query more attributes)
			 * Lib.CM.Customization.Extraction.CustomizePollingCustomerObject (In the polling process this user exit allows you to fill the company object with whatever fields you might need)
			 * @param {any} company object with information related to the company
			 * @example
			 * This user exit adds the attributes or overrides the already present attributes. Any added attributes should be from the list of authorized attributes given by Experian API docs
			 * <pre><code>
			 * CustomizeCompaniesInfoRequestData: function (company)
			 * {
			 *		return {
			 *			"street": company.street,
			 *			"phone": company.phone
			 *		};
			 * }
			 * </code></pre>
			 */
			CustomizeCompaniesInfoRequestData: function (/* company */)
			{ },
			/**
			 * @method Lib.CM.Customization.CreditScore.Experian.GetCustomizedRisk
			 * @description
			 * Allows you to customize the risk displayed in Experian Gauge.
			 * 
			 * https://developer.experian.com/products/us/businesses/businesses-api-docs#/Business%20Information%20Services/scores
			 * @param {string} riskClass experian risk category, a number stored in a string
			 * @returns {string} The translation of the selected risk category
			 * @example
			 * This user exit returns the translation of experian risk
			 * <pre><code>
			 * GetCustomizedRisk: function (riskClass)
			 * {
			 * 	switch (riskClass)
			 *	{
			 *		case "1": return Language.Translate("_RISKCATEGORY02", false);
			 *		case "2": return Language.Translate("_RISKCATEGORY04", false);
			 *		case "3": return Language.Translate("_RISKCATEGORY05", false);
			 *		case "4": return Language.Translate("_RISKCATEGORY05", false);
			 *		case "5": return Language.Translate("_RISKCATEGORY08", false);
			 *		case "998": return Language.Translate("_RISKCATEGORY07", false);
			 *		case "999": return Language.Translate("_Insufficient data to score", false);
			 *		default: return Language.Translate("_RISKCATEGORY00", false);
			 *	}
			 * }
			 * </code></pre>
			 */
			GetCustomizedRisk: function (/* riskClass */)
			{ }
		},
		/**
		 * Same functionality as creditriskmonitor but for CreditorWatch provider
		 * @namespace Lib.CM.Customization.CreditScore.CreditorWatch
		 */
		CreditorWatch:
		{
			/**
			 * @method Lib.CM.Customization.CreditScore.CreditorWatch.Extraction
			 * @description see {@link Lib.CM.Customization.CreditScore.CreditRiskMonitor.Extraction}
			 */
			Extraction: function (/*jsonObject, data*/)
			{ },
			/**
			 * @method Lib.CM.Customization.CreditScore.CreditorWatch.Interface
			 * @description see {@link Lib.CM.Customization.CreditScore.CreditRiskMonitor.Interface}
			 */
			Interface: function (/*fullJSON, gaugeObject*/)
			{ }
		},
		/**
		 * Same functionality as creditriskmonitor but for Atradius provider
		 * @namespace Lib.CM.Customization.CreditScore.Atradius
		 */
		Atradius:
		{
			/**
			 * @method Lib.CM.Customization.CreditScore.Atradius.Extraction
			 * @description see {@link Lib.CM.Customization.CreditScore.CreditRiskMonitor.Extraction}
			 */
			Extraction: function (/*jsonObject, data*/)
			{ }
		},
		/**
		 * Same functionality as creditriskmonitor but for Infolegal provider
		 * @namespace Lib.CM.Customization.CreditScore.Infolegal
		 */
		Infolegal:
		/**
		 * @lends Lib.CM.Customization.CreditScore.Infolegal
		 */
		{
			/**
			 * @method Lib.CM.Customization.CreditScore.Infolegal.Extraction
			 * @description see {@link Lib.CM.Customization.CreditScore.CreditRiskMonitor.Extraction}
			 */
			Extraction: function (/*jsonObject, data*/)
			{ },
			/**
			 * @method Lib.CM.Customization.CreditScore.Infolegal.Interface
			 * @description see {@link Lib.CM.Customization.CreditScore.CreditRiskMonitor.Interface}
			 */
			Interface: function (/*fullJSON, gaugeObject*/)
			{ }
		},
		/**
		 * Alerting function customize alerts displayed in gauge
		 * @param {object} args - object with all data needed
		 * @param {object} args.storedScore - Previous score from a customer
		 * @param {object} args.updatedScore - New score from a customer
		 * @param {object} args.alerts - Default alerts
		 * @returns {any} Object representing the alerts to display below gauges.
		 * @example
		 * <pre><code>
		 * Alerting: function (args)
		 * {
		 *		args.alerts.list.push([{
		 *				key: "credit limit change"
		 *			},
		 *			{
		 *				key: "_score change from {0} to {1}",
		 *				parameters: [10, 3]
		 *			}]);
		 *		args.alerts.indicator = "favourable";
		 *		return args.alerts;
		 * }
		 * </code></pre>
		 */
		Alerting: function (/*args*/)
		{ },
		/**
		 * SendAlertingEmail function overrides global configuration to send an email if score change
		 * @param {object} args - object with all data needed
		 * @param {object} args.storedScore - Previous score from a customer
		 * @param {object} args.updatedScore - New score from a customer
		 * @returns {boolean} Boolean to send or not the email
		 * @example
		 * <pre><code>
		 * SendAlertingEmail: function (args)
		 * {
		 *		if (parseFloat(args.updatedScore.score.value) >= parseFloat(args.storedScore.score.Score__))
		 *		{
		 *			return false;
		 *		}
		 *		return true;
		 * }
		 * </code></pre>
		 */
		SendAlertingEmail: function (/*args*/)
		{
			return true;
		},
		/**
		 * @method Lib.CM.Customization.CreditScore.OnScoreUpdate
		 * @description
		 * Called just before commiting the update on the score record
		 * @param {object} score the score json object
		 * @param {xRecord} scoreRecord the score record in table CM - Credit score__
		 * @param {xRecord} customerRecord the customer record
		 */
		OnScoreUpdate: function (/*score, scoreRecord, customerRecord*/)
		{ }
	};

	return creditScore;
})();
