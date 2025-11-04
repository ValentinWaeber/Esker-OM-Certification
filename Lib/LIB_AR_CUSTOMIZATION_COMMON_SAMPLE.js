/* LIB_DEFINITION{
  "name": "LIB_AR_CUSTOMIZATION_COMMON_SAMPLE",
  "libraryType": "Lib",
  "scriptType": "COMMON",
  "comment": "PS common customization functions",
  "versionable": false,
  "require": []
}*/

/**
 * Package AR common selection callbacks
 * @namespace Lib.AR.Customization.Common
 */

///#GLOBALS Lib
var Lib = Lib || {};
Lib.AR = Lib.AR || {};
Lib.AR.Customization = Lib.AR.Customization || {};

Lib.AR.Customization.Common = (function ()
{
	var Common =
	{
		/**
		 * Definition of EmailNotification
		 * See http://doc.esker.com/eskerondemand/cv_ly/en/manager/startpage.htm#common/references/fields/mailprintable.html for more information
		 * @interface Lib.AR.Customization.Common.EmailNotification
		 * @prop {string} ID ToName
		 * @prop {string} email EmailAddress
		 * @prop {string} cc CcEmailAddress
		 * @prop {string} toCompany ToCompany
		 * @prop {string} language Email template language
		 * @prop {string} culture Email template culture
		 * @prop {string} formUrl Current process URL
		 * @prop {string} transportIdentifier Identifier
		 * @prop {string} fromEmail FromAddress
		 * @prop {string} fromName FromName
		 * @prop {string} fromCompany FromCompany
		 * @prop {string} subject Subject
		 */

		/**
		 * @method Lib.AR.Customization.Common.GetFormattingTemplate
		 * @description
		 * Allows you to specify a Crystal Reports template in complex scenarios that involve certain conditions. The templates are used to generate a PDF file (invoice presentation) from an XML or IDOC file (invoice data).
		 * A template must be specified if:
		 * * The Document format is set to UBL, BProcess 1, Custom XML, IDOC in one of the application configurations. The ERP submits XML or IDOC files (invoice data).
		 * * The Document format is set to UBL + PDF, BProcess 1 + PDFor Custom XML + PDF or IDOC + PDF in one of the application configurations. The ERP submits ZIP files containing only one XML or IDOC file (invoice data).
		 * ** /!\ The GetFormattingTemplate user exit overrides the Invoice template option in the Invoice options step of the configuration tool. /!\ **
		 * The field keepEmptyDate is optional. If set to true, the empty date fields in the template are not filled with the current date.
		 * @returns {string|object}
		 *
		 * String value: `file path` of the Crystal Report template (RPT file) to use.
		 * Or
		 * JavaScript object containing, in addition to the template name, the language and the culture to be used to generate the invoice file.
		 *
		 * The following templates are provided with the application:
		 * InvoiceTemplate_A4.rpt
		 * InvoiceTemplate_Letter.rpt
		 * These templates use the account logo. For best results, add a 300 x 104 pixels logo. Refer to Customizing the interface for more information.
		 *
		 * @example Structure of the object that could be returned by the User Exit:
		 *
			{
				template: "CustomTemplateName.rpt",
				language: "fr",
				culture: "fr-FR",
				keepEmptyDate: true
			}
		 * @example In the following example, the user exit calls a specific Crystal Reports template depending on the supplier's production center.
		 * GetFormattingTemplate: function ()
		 * {
		 * 		var report = null;
		 *		var modProvider = Variable.GetValueAsString("Supplier_ModProvider__");
		 * 		if (modProvider === "US")
		 * 		{
		 *			report = "%Templates%\\PDFTemplate_us.rpt";
		 *		}
		 *		else if (modProvider === "FR")
		 *		{
		 *			report = "%Templates%\\PDFTemplate_fr.rpt";
		 *		}
		 *		return report;
		 * }
		 */
		GetFormattingTemplate: function ()
		{
			return null;
		},
		/**
		 * @method Lib.AR.Customization.Common.GetExtraInvoiceRPTFields
		 * @description
		 * Return an object describing the mapping to override for the Customer Invoice generation
		 * @returns {object} mapping of merge fields used in the rpt template to the values of the Customer Invoice process
		 */
		GetExtraInvoiceRPTFields: function ()
		{
			/*
			var ExtraInvoiceRPTFields =
			{
				"header":
				{
					"Invoice_date__": {
						"Value": function(info)
						{
							return Date.UTC(Date.now());
						},
						"Type": "Date"
					},
					"Currency": "Currency__", // Duplicate with another name
					"UnexistentField": "UnexistentField__", // This field doesn't exits in Data
				},
				"tables":
				{
					"Table_Line_Items":
					{
						"fields":
						{
							"ItemNetAmount__": function(info)
							{
								return 1 + info.item.GetValue("ItemUnitPrice__") * info.item.GetValue("ItemQuantity__");
							},
							"ItemUnexistentField": "ItemUnexistentField__",
							"ItemNumber": "ItemNumber__" // Dulpicate with another name
						}
					},
					"TaxTable":
					{
						"fields":
						{
							"TaxCode": "TaxCode__",
							"TaxTest__": function(info)
							{
								return info.tableName + "." + info.itemIdx;
							}
						}
					}
				}
			}
			return ExtraInvoiceRPTFields;
			*/
			return null;
		},

		/**
		 * @method Lib.AR.Customization.Common.CustomizePDFFileName
		 * @description
		 * Function called in the GetNiceName function.
		 * This function is called to define the name of the attached invoice.
		 * If the returned name include a "{0}" string it will replaced by the invoice number.
		 * @param {string} invoiceType The invoice type.
		 * @returns {string} The customized filename.
		 */
		CustomizePDFFileName: function (invoiceType)
		{
			/* return "customizedname_" + invoiceType + "_{0}"; */
			return null;
		}

		/**
		 * @method Lib.AR.Customization.Common.CustomizeInvoiceTypes
		 * @description
		 * Allows you to customize the list of invoice types which can be used in the SUPI
		 * This user exit is called both in the extraction script and validation script of the SUPI.
		 * @param {string[]} allowedInvoiceTypes Array of the default invoice types, for example: ["INVOICE", "CREDIT_NOTE", "DEBIT_NOTE", "CREDIT", "DEBIT", "DEPOSIT_REQUEST"].
		 * @example
		 * CustomizeInvoiceTypes: function (allowedInvoiceTypes)
		 * {
		 *	 allowedInvoiceTypes.push("NEW_TYPE");
		 * }
		 */
		/*
		,CustomizeInvoiceTypes: function (allowedInvoiceTypes)
		{
		}
		*/

		/**
		 * @method Lib.AR.Customization.Common.CustomizeConversationInfoForSupplier
		 * @description
		 * Allows you to customize the options of conversations in the SUPI
		 * This user exit is called when creating a conversation from the SUPI (client and server side).
		 * @param {any} conversationInfo object with the format as described in the documentation (see {@link https://webdoc/eskerondemand/nv/en/manager/startpage.htm#ProcessingScripts/Conversation/Create.html}).
		 * @returns {any} the customized conversationInfo object
		 *
		 * @example
		 * CustomizeConversationInfoForSupplier: function (conversationInfo)
		 * {
		 *    conversationInfo.Options.replyToEmail = false;
		 *    return conversationInfo;
		 * }
		 */
		/*
		,CustomizeConversationInfoForSupplier: function (conversationInfo)
		{
		}
		*/

		/**
		 * @method Lib.AR.Customization.Common.CustomizeConversationInfoForCustomer
		 * @description
		 * Allows you to customize the options of conversations in the CUSI
		 * This user exit is called when creating a conversation from the CUSI (client and server side).
		 * @param {any} conversationInfo object with the format as described in the documentation (see {@link https://webdoc/eskerondemand/nv/en/manager/startpage.htm#ProcessingScripts/Conversation/Create.html}).
		 * @returns {any} the customized conversationInfo object
		 *
		 * @example
		 * CustomizeConversationInfoForCustomer: function (conversationInfo)
		 * {
		 *    conversationInfo.Options.replyToEmail = false;
		 *    return conversationInfo;
		 * }
		 */
		/*
		,CustomizeConversationInfoForCustomer: function (conversationInfo)
		{
		}
		*/

		/**
		 * @method Lib.AR.Customization.Common.CustomizeRPTMappingTranslations
		 * @description
		 * Allows you to customize the list of fields translated in the table TRANSLATION_MAPPINGS
		 * This user exit is called before sending invoice values to Crystal Report in the SUPI.
		 * @param { [key: string]: string[] } mappings Dictionary of fieldname : mappingType. For example :
		 * 		{"col_unit__": ["unitCode"],
		 *		"col_unit_base_quantity__": ["unitCode"]}.
		 * @returns { [key: string]: string } the customized dictionary of mapping translations
		 *
		 * @example
		 * CustomizeRPTMappingTranslations: function (mappings)
		 * {
		 *    //If you do not want to translate codes in the invoice
		 *    return {};
		 *
		 *    //If you want to customize another field
		 *    var customMappings = { ...mappings };
		 *    customMappings["fieldCustom"] = ["unitCode"]; // to replace
		 *    delete customMappings["fieldCustom2"]; // to remove
		 *    return customMappings;
		 * }
		 */
		/*
		,CustomizeRPTMappingTranslations: function (mappings)
		{
		}
		*/
	};
	return Common;
})();


/*
 * IMPORTANT NOTE
 * User exit "CustomizeInvoiceData" has been moved from "Lib.AR.Customization.Configuration" to "Lib.AR.Customization.Configuration.Common"
 * for story FT-022898. This two lines ensure backward compatibility for old packages: if it's not already defined, then we declare it here.
 * Thanks to that, the Sys.Helpers.TryGetFunction can be called by "Lib.AR.Customization.Configuration.CustomizeInvoiceData" in both
 * old and new packages.
 */
Lib.AR.Customization.Configuration = Lib.AR.Customization.Configuration || {};
Lib.AR.Customization.Configuration.CustomizeInvoiceData = Lib.AR.Customization.Configuration.CustomizeInvoiceData || (function ()
{
	/**
	 * @method Lib.AR.Customization.Configuration.CustomizeInvoiceData
	 * @description Allows you to override the values used to fill in the fields of the Crystal Reports template.
	 *				The CustomizeInvoiceData user exit is called after the localization of the template. The localization is performed according to the culture of the customer contact. If there is no contact, it is performed according to the culture of the supplier.
	 * @param {*} InvoiceData A JavaScript object that contains the fields to use in the Crystal Reports template.
	 *
	 *		The InvoiceRPTMapping object contains the following properties:
	 *
	 *			header:			Header fields on the template. You should add the new fields that are not in the line items in this object.
	 *			logo:			Logo displayed on the template.
	 *			companyInfo:	Formatting for the dates and numbers displayed on the template.
	 *			frenchB2BSpecifics: More fields, specific to the French B2B invoice, but not only.
	 *			language: 		Labels to use in the template.
	 *			tables:
	 *				AllowanceChargeTable__:	Tables of allowances and charges.
	 *				CreditNotesTable__:		Tables of credit notes.
	 *              DocumentsTable__:		Tables of associated documents.
	 *				Table_Line_Items__:		Line item fields on the template. You should add the new fields that are in the line items in this array.
	 *				TaxTable__:				Tables of taxes.
	 *				Invoice_previous_invoices_table__ : Tables of sames invoices previously submitted.
	 *	 			LineItemsAllowanceChargeTable: Tables of allowances and charges, artificially build from each Table_Line_Items__ lines.
	 *
	 *
	 *	 	Here is an example of invoiceData object that is given to the user exit.
	 *
	 *	 	/!\ WARNING IT IS EXTREMELY DEPRECATED !
	 *	 	    HERE YOU CAN JUST A HAVE A QUICK LOOK OF WHAT IT COULD BE ROUGHLY LOOK LIKE /!\
	 *
	 *	 	During your development, it's warmly recommended to dump your JSON to see exactly what's inside
	 *	 	instead of using this sample as a base.
	 *
	 *		 var InvoiceRPTMapping = {
	 *       {
	 *    		"header": {
	 *    		    "Comment__": "Votre numero de client :123456789\nVotre reference :00000000001",
	 *    		    "Customer_billing_address__": "DEMOPOS\nTSA 50810\n.\n69908 LYON CEDEX 20\nFrance",
	 *    		    "Customer_Country__": "FR",
	 *    		    "Customer_ID__": "31051987",
	 *    		    "Customer_address__": "Customer Address\n69000 LYON\nFRANCE",
	 *    		    "Customer_shipping_address__": "Customer Shipping Address\n69000 LYON\nFRANCE",
	 *    		    "Customer_SIRET__": null,
	 *    		    "Customer_VAT_number__": "FR35552049447",
	 *    		    "Delivery_Order_Issue_Date__": {
	 *    		        "Value": "2016-11-01",
	 *    		        "Type": "Date"
	 *    		    },
	 *    		    "Delivery_Order_Number__": "99999999",
	 *    		    "Invoice_currency__": "EUR",
	 *    		    "Invoice_date__": {
	 *    		        "Value": "2016-11-01",
	 *    		        "Type": "Date"
	 *    		    },
	 *    		    "Invoice_due_date__": {
	 *    		        "Value": "2016-12-31",
	 *    		        "Type": "Date"
	 *    		    },
	 *    		    "Invoice_net_amount_before_allowances__": {
	 *    		        "Value": null,
	 *    		        "Type": "Number"
	 *    		    },
	 *    		    "Invoice_net_amount__": {
	 *    		        "Value": 15877.31,
	 *    		        "Type": "Number"
	 *    		    },
	 *    		    "Invoice_number__": "400250840",
	 *    		    "Invoice_outstanding_amount__": {
	 *    		        "Value": 1000.77,
	 *    		        "Type": "Number"
	 *    		    },
	 *    		    "Invoice_paid_amount__": {
	 *    		        "Value": 0,
	 *    		        "Type": "Number"
	 *    		    },
	 *    		    "Invoice_PaymentNotes__": "penalites de retard au taux annuel de 12% - indemnite forfaitaire pour frais de recouvrement de 40 euros",
	 *    		    "Invoice_PaymentTerms__": "sans escompte pour paiement anticipe",
	 *    		    "Invoice_total_amount__": {
	 *    		        "Value": 1000.77,
	 *    		        "Type": "Number"
	 *    		    },
	 *    		    "Invoice_Type__": "INVOICE",
	 *    		    "Purchase_order_date__": {
	 *    		        "Value": "2016-11-01",
	 *    		        "Type": "Date"
	 *    		    },
	 *    		    "Purchase_order_number__": "538200000080355",
	 *    		    "Supplier_address__": "Suplier Address\n1 rue de la paix\n69000 Lyon\nFrance",
	 *    		    "Supplier_contact_email__": null,
	 *    		    "Supplier_contact_faxNumber__": null,
	 *    		    "Supplier_contact_phoneNumber__": null,
	 *    		    "Supplier_LegalEntity_ShareCapital_Currency__": "EUR",
	 *    		    "Supplier_LegalEntity_ShareCapital__": "007008009",
	 *    		    "Supplier_SIRET__": "010203040506070809",
	 *    		    "Supplier_VAT_number__": "FR46348937012"
	 *    		},
	 *    		"logo": {
	 *    		    "template": "",
	 *    		    "default": "%AccountLogo%"
	 *    		},
	 *    		"companyInfo": {
	 *    		    "DecimalCount": 2,
	 *    		    "FormatDate": "dd/MM/yyyy",
	 *    		    "FormatDetailLineId": "000000",
	 *    		    "SeparatorThousand": " ",
	 *    		    "SeparatorDecimal": ".",
	 *    		    "SeparatorInfos": " - ",
	 *    		    "BillingAddressRightWindow": true
	 *    		},
	 *    		"tables": {
	 *    		    "Table_Line_Items__": [{
	 *    		            "AllowanceCharge_TaxPercent": {
	 *    		                "Value": null,
	 *    		                "Type": "Number"
	 *    		            },
	 *    		            "AllowanceCharge_TaxType": null,
	 *    		            "AllowanceCharge_amount": {
	 *    		                "Value": "Col_Allowance_charge_amount",
	 *    		                "Type": "Number"
	 *    		            },
	 *    		            "AllowanceCharge_base_amount": {
	 *    		                "Value": null,
	 *    		                "Type": "Number"
	 *    		            },
	 *    		            "AllowanceCharge_rate": {
	 *    		                "Value": null,
	 *    		                "Type": "Number"
	 *    		            },
	 *    		            "AllowanceCharge_reason_code": null,
	 *    		            "AllowanceCharge_reason": null,
	 *    		            "AllowanceCharge_type": null,
	 *    		            "Buyer_item_id": null,
	 *    		            "Classification_code": null,
	 *    		            "Contract_number": null,
	 *    		            "Currency": null,
	 *    		            "Delivery_address": null,
	 *    		            "Delivery_order_issue_date": {
	 *    		                "Value": null,
	 *    		                "Type": "Date"
	 *    		            },
	 *    		            "Delivery_order_line_id": null,
	 *    		            "Delivery_order_number": null,
	 *    		            "Description": "Chariot élévateur électrique - 4 roues",
	 *    		            "Gross_unit_price": {
	 *    		                "Value": 995,
	 *    		                "Type": "Number"
	 *    		            },
	 *    		            "Line_id": "1",
	 *    		            "Note": "Num interne:0104686922 Equipement:0004771654 Num de serie :_516329E00337 Periode du2016-11-01au2016-11-30",
	 *    		            "Period_duration_unit": null,
	 *    		            "Period_duration_value": null,
	 *    		            "Period_enddate": {
	 *    		                "Value": null,
	 *    		                "Type": "Date"
	 *    		            },
	 *    		            "Period_startdate": {
	 *    		                "Value": null,
	 *    		                "Type": "Date"
	 *    		            },
	 *    		            "Public_contract_number": null,
	 *    		            "Purchase_order_date": {
	 *    		                "Value": null,
	 *    		                "Type": "Date"
	 *    		            },
	 *    		            "Purchase_order_line_id": null,
	 *    		            "Purchase_order_number": null,
	 *    		            "Quantity": {
	 *    		                "Value": 1,
	 *    		                "Type": "Number"
	 *    		            },
	 *    		            "Salesprovision_code": null,
	 *    		            "Seller_item_id": null,
	 *    		            "TaxReference": null,
	 *    		            "TaxType_Code": null,
	 *    		            "TaxType_Description": null,
	 *    		            "TaxType": null,
	 *    		            "Tax": 20,
	 *    		            "Total_amount": {
	 *    		                "Value": 995,
	 *    		                "Type": "Number"
	 *    		            },
	 *    		            "Type": null,
	 *    		            "Unit_price": {
	 *    		                "Value": 995,
	 *    		                "Type": "Number"
	 *    		            },
	 *    		            "Unit": "pieces"
	 *    		        }
	 *    		    ],
	 *    		    "AllowanceChargeTable__": [],
	 *    		    "TaxTable__": [{
	 *    		            "BaseAmount": {
	 *    		                "Value": 15877.31,
	 *    		                "Type": "Number"
	 *    		            },
	 *    		            "ExemptionReason": null,
	 *    		            "Percent": {
	 *    		                "Value": 20,
	 *    		                "Type": "Number"
	 *    		            },
	 *    		            "Reference": null,
	 *    		            "TotalAmount": {
	 *    		                "Value": 3175.46,
	 *    		                "Type": "Number"
	 *    		            },
	 *    		            "Type_Code": null,
	 *    		            "Type_Description": null,
	 *    		            "Type": "TVA_ENCAISSEMENT"
	 *    		        }
	 *    		    ]
	 *    		},
	 *    		"language": {
	 *    		    "AmountDue": "Offener Betrag",
	 *    		    "Balance": "Offener betrag",
	 *    		    "BillToAddress": "Rechnungsadresse",
	 *    		    "Capital": "Grundkapital",
	 *    		    "CustomerAddress": "Kundenadresse",
	 *    		    "CustomerNumber": "Kundenkennung",
	 *    		    "Currency": "Currency:",
	 *    		    "CreditNote": "Gutschrift",
	 *    		    "Date": "Date",
	 *    		    "DeliveryNote": "Lieferscheinnummer",
	 *    		    "DeliveryNoteDate": "Lieferscheindatum",
	 *    		    "DeliveryNoteNumberDate": "Lieferscheinnummer/-datum",
	 *    		    "DueDate": "Fälligkeitsdatum",
	 *    		    "Email": "E-Mail",
	 *    		    "Fax": "Fax",
	 *    		    "InvoiceDate": "Rechnungsdatum",
	 *    		    "Invoice": "Rechnung",
	 *    		    "Item": "Artikel",
	 *    		    "ItemAmount": "Betrag",
	 *    		    "ItemDescription": "Bezeichnung",
	 *    		    "ItemQuantity": "Menge",
	 *    		    "ItemUnitOfMeasure": "Einheit",
	 *    		    "ItemUnitPrice": "Einzelpreis",
	 *    		    "ItemVAT": "USt.",
	 *    		    "Outstanding": "Anzahlung",
	 *    		    "OutstandingCreditNote": "Angewendet",
	 *    		    "Order": "Bestellnummer",
	 *    		    "OrderDate": "Bestelldatum",
	 *    		    "OrderNumberDate": "Bestellnummer/-datum",
	 *    		    "Page": "Seite",
	 *    		    "Penalties": "Strafgebühren / Rabatt",
	 *    		    "PaymentTerms": "Zahlungsbedingungen",
	 *    		    "Phone": "Telefon",
	 *    		    "Siret": "SIRET-Nr.",
	 *    		    "ShipToAddress": "Lieferadresse",
	 *    		    "Subtotal": "Nettobetrag",
	 *    		    "Tax": "USt.",
	 *    		    "Total": "Gesamtbetrag",
	 *    		    "VatId": "USt-Nr."
	 *    		}
	 *		};
	 * @returns {*} The modified InvoiceRPTMapping object.
	 *
	 * @example This user exit allows you to switch the position of the billing address and the ship to address on the template:
	 * 	CustomizeInvoiceData: function (invoiceData)
	 * 	{
	 * 		return Sys.Helpers.Extend(true, {}, invoiceData, {
	 * 			"companyInfo":
	 * 			{
	 *				"BillingAddressRightWindow" : false
	 * 			}
	 * 		});
	 * 	}
	 *
	 * @example This user exit allows you to set the value of the new z_ShippingMethod field in the Crystal Reports template from the new Shipping_Method__ field in the Customer Invoice that is added outside of the line items.
	 * 	CustomizeInvoiceData: function (invoiceData)
	 * 	{
	 * 		return Sys.Helpers.Extend(true, {}, invoiceData, {
	 * 			"header":
	 * 			{
	 * 				"z_ShippingMethod" : Data.GetValue("Shipping_Method__")
	 * 			}
	 * 		});
	 * 	}
	 */
	function CustomizeInvoiceData(invoiceData)
	{
		return null;
	}

	return CustomizeInvoiceData;
})();