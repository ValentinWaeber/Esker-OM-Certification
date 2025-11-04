/* eslint-disable max-depth */
///#GLOBALS Lib Sys
let g_logDebugFtsQueryFilter;
let g_MaxReadRecord;
let g_ClearMaterialWhenConfidenceBelow;
let g_addressExclusionKeywords;
let g_sDocumentCulture;
let g_sCountryCode;
let g_KeyWordsShipToAddress = [""];
let g_SODateKeywordsFirstTry = [""];
let g_SODateKeywordsSecondTry = [""];
let g_DueDateKeywords = [""];
let g_TotalKeywordsFirstTry = [""];
let g_TotalKeywordsSecondTry = [""];
let g_PONumberKeywordsFirstTry = [""];
let g_PONumberKeywordsSecondTry = [""];
let g_QuotationNumberKeywordsFirstTry = [""];
let g_QuotationNumberKeywordsSecondTry = [""];
let g_PONumberRegex;
let g_QuotationNumberRegex;
let g_DefaultBusinessPriority;
let g_erpOrderDocument;
let g_bDocumentTypeRecognizedByKeywords = false;
/**************************************** Beginning of User Exits ****************************************/
var CustomerOrderProcessing;
(function (CustomerOrderProcessing) {
    let Extraction;
    (function (Extraction) {
        Extraction.UserExit = {
            DiscardAddress: function (addressString, addressArea) {
                let isAddressDiscarded = Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Extraction.DiscardAddress", addressString, addressArea);
                if (typeof isAddressDiscarded !== "boolean") {
                    return null;
                }
                return isAddressDiscarded;
            },
            OnExtractionScriptBegin: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Extraction.OnExtractionScriptBegin") || {};
            },
            OnExtractionScriptEnd: function () {
                Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Extraction.OnExtractionScriptEnd");
            },
            OnPartnerExtractionEnd: function () {
                Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Extraction.OnPartnerExtractionEnd");
            },
            GetSoldToExtraFilter: function (isSAP) {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Extraction.GetSoldToExtraFilter", isSAP);
            },
            GetShipToExtraFilter: function (isSAP) {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Extraction.GetShipToExtraFilter", isSAP);
            },
            OverridePriorityKeywordSearch: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Extraction.OverridePriorityKeywordSearch") || {};
            },
            OverrideRevisedOrderKeywordSearch: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Extraction.OverrideRevisedOrderKeywordSearch") || {};
            },
            UnlinkSoldToShipTo: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Common.UnlinkSoldToShipTo");
            },
            GetSoldToFTSExtraFilter: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Extraction.GetSoldToFTSExtraFilter");
            },
            GetShipToFTSExtraFilter: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Extraction.GetShipToFTSExtraFilter");
            },
            OnLoadQuotationEndServer: function (quotationData) {
                Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Extraction.OnLoadQuotationEndServer", quotationData);
            },
            OnInitConfigurationBegin: function () {
                Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Extraction.OnInitConfigurationBegin");
            },
            GetAutomaticProcessingExtraFilter: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Common.GetAutomaticProcessingExtraFilter");
            },
            GetCustomerSalesDataExtraFields: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Common.GetCustomerSalesDataExtraFields", "");
            },
            CustomizeSalesArea: function (salesArea, isSimulationOrPost) {
                Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Common.CustomizeSalesArea", salesArea, isSimulationOrPost);
            },
            OnCustomerChange: function () {
                // OnCustomerChange user exit removed from Lib.SOP.Customization.Common. Kept for retro-compatibility here.
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Common.OnCustomerChange");
            },
            OnShipToChange: function () {
                // OnShipToChange user exit removed from Lib.SOP.Customization.Common. Kept for retro-compatibility here.
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Common.OnShipToChange");
            },
            GetGptEnhancedMaterialSearchConfiguration: function () {
                return Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Common.GetGptEnhancedMaterialSearchConfiguration");
            },
            DisableDropShipAddressFromExtractedShipToAddress: function () {
                return !!Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Common.DisableDropShipAddressFromExtractedShipToAddress");
            }
        };
    })(Extraction = CustomerOrderProcessing.Extraction || (CustomerOrderProcessing.Extraction = {}));
})(CustomerOrderProcessing || (CustomerOrderProcessing = {}));
/********************************************************************
INTERNATIONALIZATION
 ********************************************************************/
function InitInternationalization() {
    g_sDocumentCulture = Sys.OM.Helpers.GetConfiguration().DocumentCulture;
    Log.Info("g_sDocumentCulture : " + g_sDocumentCulture);
    if (g_sDocumentCulture == null || g_sDocumentCulture === "") {
        g_sDocumentCulture = "en-US";
    }
    g_sCountryCode = g_sDocumentCulture.substr(g_sDocumentCulture.indexOf("-") + 1);
    if (g_sCountryCode == null || g_sCountryCode === "") {
        g_sCountryCode = "US";
    }
    Log.Verbose("Running with document culture '" + g_sDocumentCulture + "' and country code '" + g_sCountryCode + "'");
    // alphanumerical string which allows for separators ('/', '.', '-' and '—').
    // It starts and ends with an alphanumerical, and contains at least one figure
    g_PONumberRegex = /([A-Z0-9]+[/.\-—_]*)*[0-9]([/.\-—_]*[A-Z0-9]+)*/;
    g_QuotationNumberRegex = g_PONumberRegex;
    g_DefaultBusinessPriority = "2";
    switch (g_sDocumentCulture) {
        case "en-GB":
        case "en-US":
        case "en-CA":
            g_KeyWordsShipToAddress = ["right:Delivery address", "below:Delivery address", "right:Ship to", "right:SHIP TO", "right:Ship To", "right:DELIVER TO", "right:Deliver to", "right:Deliver To", "below:Ship to", "below:SHIP TO", "below:Ship To", "below:DELIVER TO", "below:Deliver to", "below:Deliver To"];
            g_SODateKeywordsFirstTry = ["Order Date", "Ordered", "P.O. Date", "PO Date", "Original Order"];
            g_SODateKeywordsSecondTry = ["Date"];
            g_DueDateKeywords = ["Date Required", "Required Date", "Delivery Date", "Date Req", "Deliver", "Due Date", "Date Due", "Ship date", "Due"];
            g_TotalKeywordsFirstTry = ["Extended Cost", "Total amount", "Total PO amount", "Total Due", "Total[:]"];
            g_TotalKeywordsSecondTry = ["Total", "Amount"];
            g_PONumberKeywordsFirstTry = ["Purchase Order Number", "Purchase Order [No.]", "Purchase Order #[:]", "Order Number", "P.O. Number[:]", "PO Number[:]", "P.O. Number", "PO Number", "Order#", "Order [N]o", "PO [#]", "P.O. [#]", "P.O. [N]o", "PO number/date"];
            g_PONumberKeywordsSecondTry = ["P.O. 4", "Purchase Order", "Order[:]", "Number[:]", "No.[:]", "Number", "No", "Order"];
            g_QuotationNumberKeywordsFirstTry = ["Quotation Number", "Quotation [No.]", "Quotation #[:]", "Quotation"];
            g_QuotationNumberKeywordsSecondTry = ["Quote Number", "Quote [No.]", "Quote #[:]", "Quote"];
            break;
        case "fr-FR":
            g_KeyWordsShipToAddress = ["below:Livré à ", "below:Adresse de livraison", "below:Livrer à ", "below:Veuillez livrer à "];
            g_SODateKeywordsFirstTry = ["Date de la commande", "Date commande"];
            g_SODateKeywordsSecondTry = ["Date"];
            g_DueDateKeywords = ["Pour le", "Date de mise à disposition", "Livraison", "Livr."];
            g_TotalKeywordsFirstTry = ["Net à payer TTC", "Net à payer", "NET A PAYER", "Total à régler", "Valeur nette totale", "Valeur nette", "Total facture", "Total T.T.C", "Montant T.T.C", "Total brut", "Total Dû"];
            g_TotalKeywordsSecondTry = ["T.T.C", "TTC", "Total", "Montant"];
            g_PONumberKeywordsFirstTry = ["Bon de commande N°", "Bon de commande No", "No de cde [:]", "N° de cde [:]", "Notre N° commande", "Commande client [n°]", "de cde [:]", "de cde [:]", "Commande client [no]", "No et date Commande", "Commande [n°]", "Commande [no]", "[N°] Commande", "[No] Commande", "Numéro de commande"];
            g_PONumberKeywordsSecondTry = ["Bon de commande", "Numéro", "N°", "No", "commande"];
            g_QuotationNumberKeywordsFirstTry = ["Devis N°", "Devis [No]", "Devis [No.]", "Devis [:]", "Devis"];
            break;
        case "en-AU":
        case "en-NZ":
            // Allow white spaces
            g_PONumberRegex = /([A-Z0-9]+[/.\-—_ ]*)*[0-9]([/.\-—_ ]*[A-Z0-9]+)*/;
            g_KeyWordsShipToAddress = ["below:SHIP TO", "below:DELIVER TO", "below:DLVR TO", "below:SHIPPING ADDRESS", "below:DELIVERY ADDRESS", "below:DELIVERED TO", "below:SHIP-TO", "below:DELIVERY",
                "right:SHIP TO", "right:DELIVER TO", "right:SHIPPING ADDRESS", "right:DELIVERY ADDRESS", "right:DELIVERED TO", "right:SHIP-TO", "right:DELIVERY",
                "below:Ship To", "below:Deliver To", "below:Shipping Address", "below:Delivery Address", "below:Delivered To", "below:Ship-To", "below:Delivery",
                "right:Ship To", "right:Deliver To", "right:Shipping Address", "right:Delivery Address", "right:Delivered To", "right:Ship-To", "right:Delivery",
                "below:Ship to", "below:Deliver to", "below:Shipping address", "below:Delivery address", "below:Delivered to", "below:Ship-to",
                "right:Ship to", "right:Deliver to", "right:Shipping address", "right:Delivery address", "right:Delivered to", "right:Ship-to"];
            g_SODateKeywordsFirstTry = ["Order Date", "Date Ordered", "P.O. Date", "PO Date", "Date of Order", "Document Date", "Ordered"];
            g_SODateKeywordsSecondTry = ["Issued on", "Date"];
            g_DueDateKeywords = ["Required Delivery Date", "Date Required", "Required Date", "Delivery Date", "Date Req", "Due Date", "Date Due", "Ship date", "Required By", "Deliver on", "Req By", "Need by", "Expected", "Required", "Arrival Date", "Despatch Date", "Deliver by", "Deliver", "Due"];
            g_TotalKeywordsFirstTry = ["Total amount", "Balance Due", "Total Including GST", "Total Inc[l][.] GST", "Grand Total", "Sales Balance", "Total PO amount", "Total Due", "Total Price", "Total Cost", "Grand Total", "Purchase Order Total", "Total Order Value", "Order Total", "Total Value"];
            g_TotalKeywordsSecondTry = ["Total", "Amount"];
            g_PONumberKeywordsFirstTry = ["Purchase Order Number", "Purchase Order No", "Order Number", "Order No", "P/Order", "P.O. Number", "PO Number", "P.O. No", "Order Reference", "PO Reference", "Purchase [#]", "P/O:", "Customer Order No"];
            g_PONumberKeywordsSecondTry = ["Purchase Order[:]", "Purchase order #", "Document Number", "Document No", "Number[:]", "P.O.", "No.[:]", "Requisition", "Number"];
            g_QuotationNumberKeywordsFirstTry = ["Quotation Number", "Quotation [No.]", "Quotation #[:]", "Quotation"];
            g_QuotationNumberKeywordsSecondTry = ["Quote Number", "Quote [No.]", "Quote #[:]", "Quote"];
            break;
        case "de-DE":
            g_PONumberKeywordsFirstTry = ["Bestellnummer", "Bestellnr", "Bestellungnummer", "Bestellungnr", "Beleg-nummer", "Belegnummer", "Beleg-nr", "Belegnr", "auftragsnummer", "auftragsnr", "rechnungsbetrag", "Best-Nr.", "Bes-Nr", "Best-Nr", "Bes-Nr.", "Bestellung", "Bestel", "Unsere Bestel", "Best[.]", "Unsere Best[.]"];
            g_PONumberKeywordsSecondTry = ["nummer[:]", "right:Nr", "below:Bestellung"];
            g_SODateKeywordsFirstTry = ["Bestelldatum", "Bestellnummer/Datum"];
            g_SODateKeywordsSecondTry = ["Datum"];
            g_TotalKeywordsFirstTry = ["Gesamtnettowert", "Gesamtsumme", "Gesamtbetrag inkl. MWSt", "Gesamtbetrag", "Nettowarenwert", "Nettobetrag", "Nettopreis", "Gesamtbestellwert", "Gesamtwert", "En[d]betrag", "En[ds]umme", "Gesamtnettobetrag", "Warenwert", "Bestellwert", "Gesamt", "Nett[o]", "[S]umme", "Wer[t]", "Gesamtbetrag", "Warenwert", "[S]umme Brutto", "Auftragssumme"];
            g_TotalKeywordsSecondTry = ["Total", "Tot."];
            g_DueDateKeywords = ["Abgabefrist", "Liefer-termin", "Liefertermin", "Lieferdatum", "eintrefftermin", "fixtermin", "Eintreffdatum", "Anlieferungstermin"];
            g_KeyWordsShipToAddress = ["below:Lieferadresse", "right:Lieferadresse", "below:Bitte liefern Sie an", "right:Bitte liefern Sie an", "below:lieferung an", "right:liefern Sie an", "below:Lieferanschrift", "right:Lieferanschrift", "below:Versandanschrift", "right:Versandanschrift"];
            break;
        case "it-IT":
            g_PONumberKeywordsFirstTry = ["Ordine di acquisto", "Ordine d'acquisto", "N. Ordine"];
            g_PONumberKeywordsSecondTry = ["Ordine", "Numero"];
            g_SODateKeywordsFirstTry = ["data"];
            g_SODateKeywordsSecondTry = [""];
            g_TotalKeywordsFirstTry = ["totale acquisti", "totale imponibile", "totale iva esclusa", "totale", "tot."];
            g_TotalKeywordsSecondTry = ["Totale", "Tot."];
            g_DueDateKeywords = ["data di consegna", "data consegna richiesta", "data consegna", "consegna", "consegne", "data scandenza"];
            g_KeyWordsShipToAddress = ["right:destinatario", "below:destinatario", "right:spett.le", "below:spett.le"];
            break;
        case "es-ES":
        case "es-MX":
            g_PONumberKeywordsFirstTry = ["Número de pedido", "Número pedido", "Numero de pedido", "Numero pedido", "PEDIDO COMPRA  N°", "Núm pedido", "Num. pedido", "Num pedido", "n. pedido", "n° pedido", "no. pedido", "Numero comanda", "Num comanda", "Número comanda", "Núm comanda", "n. comanda", "n° comanda", "No. Pdo.", "Pedido N°", "Pedido No", "Num Propuesta"];
            g_PONumberKeywordsSecondTry = ["pedido", "comanda:", "comanda", "compra", "numero", "NNERO"];
            g_SODateKeywordsFirstTry = ["fecha"];
            g_SODateKeywordsSecondTry = ["fecha"];
            g_TotalKeywordsFirstTry = ["total precio", "total", "tot."];
            g_TotalKeywordsSecondTry = ["Total", "Tot."];
            g_DueDateKeywords = ["fecha[ de] entrega", "fecha entrega", "recepcion"];
            g_KeyWordsShipToAddress = ["right:Dirección de entrega", "below:Dirección de entrega", "right:Lugar de entrega", "below:Lugar de entrega", "below:entregar en"];
            break;
        default:
            Log.Error("Unknown culture :" + g_sDocumentCulture);
            break;
    }
}
function GetExclusionKeywords() {
    let keywords = [];
    if (Sys.OM.Helpers.GetConfiguration().Exclusion_Keywords) {
        let keywordList = Sys.OM.Helpers.GetConfiguration().Exclusion_Keywords.split("\n");
        keywordList.map(function (value) {
            let keyword = value.trim();
            if (keyword.length > 0) {
                keywords.push(keyword);
            }
        });
    }
    return keywords;
}
const AreaCalculator = {
    GetSegmentX: function (area) {
        return {
            begin: area.x,
            ending: area.x + area.width
        };
    },
    GetSegmentY: function (area) {
        return {
            begin: area.y,
            ending: area.y + area.height
        };
    },
    GetProjectedSegmentIntersection: function (segment1, segment2) {
        let intersectionSegment = {
            isIntersection: false,
            begin: Math.max(segment1.begin, segment2.begin),
            ending: Math.min(segment1.ending, segment2.ending)
        };
        if (intersectionSegment.begin < intersectionSegment.ending) {
            intersectionSegment.isIntersection = true;
        }
        return intersectionSegment;
    },
    GetIntersectionBoxBetweenAreas: function (area1, area2) {
        let intersectionArea = {
            isIntersection: false
        };
        if (area1.page !== area2.page) {
            return intersectionArea;
        }
        let intersectionX = AreaCalculator.GetProjectedSegmentIntersection(AreaCalculator.GetSegmentX(area1), AreaCalculator.GetSegmentX(area2));
        if (!intersectionX.isIntersection) {
            return intersectionArea;
        }
        let intersectionY = AreaCalculator.GetProjectedSegmentIntersection(AreaCalculator.GetSegmentY(area1), AreaCalculator.GetSegmentY(area2));
        if (!intersectionY.isIntersection) {
            return intersectionArea;
        }
        intersectionArea.isIntersection = true;
        intersectionArea.x = intersectionX.begin;
        intersectionArea.width = intersectionX.ending - intersectionX.begin;
        intersectionArea.y = intersectionY.begin;
        intersectionArea.height = intersectionY.ending - intersectionY.begin;
        intersectionArea.surface = intersectionArea.width * intersectionArea.height;
        return intersectionArea;
    }
};
const FormattingTools = {
    ValidateSirenOrSiret: function (sirenOrSiret) {
        sirenOrSiret = sirenOrSiret.replace(" ", "");
        if (sirenOrSiret.length === 9) {
            // we only validate full SIRET number. SIREN may not be valid alone
            return true;
        }
        if (sirenOrSiret.length !== 14) {
            return false;
        }
        let sum = 0;
        for (let i = 0; i < sirenOrSiret.length; i++) {
            let n = parseInt(sirenOrSiret[i], 10);
            if (n === 0 && sirenOrSiret[i] !== "0") {
                // invalid character encountered
                return false;
            }
            if (i % 2 === 0) {
                n *= 2;
                if (n >= 10) {
                    n = 1 + (n % 10);
                }
            }
            sum += n;
        }
        return sum % 10 === 0;
    },
    FilterIncluding: function (input, including) {
        let output = "";
        for (let i = 0; i < input.length; i++) {
            if (including.indexOf(input[i]) !== -1) {
                output += input[i];
            }
        }
        return output;
    },
    FilterExcluding: function (input, excluding) {
        let output = "";
        for (let i = 0; i < input.length; i++) {
            if (excluding.indexOf(input[i]) === -1) {
                output += input[i];
            }
        }
        return output;
    },
    NormalizeTelephoneNumber: function (sTel, cultureCode) {
        switch (cultureCode) {
            case "en-US":
            case "en-CA":
                {
                    if (sTel.indexOf("+") === 0) {
                        sTel = sTel.substr(2);
                    }
                }
                break;
            case "fr-FR":
            case "en-GB":
            case "en-AU":
            case "en-NZ":
            case "de-DE":
            case "it-IT":
            case "es-ES":
            case "es-MX":
                {
                    if (sTel.indexOf("+") === 0) {
                        sTel = sTel.substr(3);
                    }
                    if (sTel.indexOf("0") === 0) {
                        sTel = sTel.substr(1);
                    }
                }
                break;
            default:
                Log.Error("Unknown DocumentCulture:" + cultureCode);
                break;
        }
        return sTel;
    },
    BuildZipCodeFtsFilter: function (zipcode, cultureCode) {
        if (cultureCode === "en-US") {
            return Sys.Helpers.LdapUtil.FilterEqual("Zip_code__", FormattingTools.NormalizeUSZipCode(zipcode) + "*");
        }
        return Sys.Helpers.LdapUtil.FilterEqual("Zip_code__", zipcode);
    },
    ZipCodesAreEqual: function (zipcode1, zipcode2, cultureCode) {
        if (cultureCode === "en-US") {
            return FormattingTools.NormalizeUSZipCodeForComparison(zipcode1) === FormattingTools.NormalizeUSZipCodeForComparison(zipcode2);
        }
        if (cultureCode === "en-AU") {
            return FormattingTools.NormalizeAuZipCodeForComparison(zipcode1) === FormattingTools.NormalizeAuZipCodeForComparison(zipcode2);
        }
        return zipcode1 === zipcode2;
    },
    ZipCodesAfterSplittingAreEqual: function (zipcode1, zipcode2, cultureCode) {
        if (zipcode1.indexOf(",") === -1 && zipcode2.indexOf(",") === -1) {
            return FormattingTools.ZipCodesAreEqual(zipcode1, zipcode2, cultureCode);
        }
        let zipCodeSplitted1 = zipcode1.split(",");
        let zipCodeSplitted2 = zipcode2.split(",");
        for (let i = 0; i < zipCodeSplitted1.length; i++) {
            for (let j = 0; j < zipCodeSplitted2.length; j++) {
                if (FormattingTools.ZipCodesAreEqual(zipCodeSplitted1[i], zipCodeSplitted2[j], cultureCode)) {
                    return true;
                }
            }
        }
        return false;
    },
    NormalizeUSZipCode: function (zipcode) {
        if (zipcode.length > 5) {
            return zipcode.substring(0, 5);
        }
        return zipcode;
    },
    NormalizeUSZipCodeForComparison: function (zipcode) {
        let zip = FormattingTools.NormalizeUSZipCode(zipcode);
        if (zip.length < 5) {
            //Fill the left part with zeros
            let filledZipcode = "00000" + zip;
            zip = filledZipcode.substring(filledZipcode.length - 5, filledZipcode.length);
        }
        return zip;
    },
    NormalizeAuZipCodeForComparison: function (zipcode) {
        if (zipcode.indexOf(" ") !== -1) {
            return zipcode.split(" ")[1];
        }
        return zipcode;
    },
    EscapeWordForFTS: function (word) {
        return word
            .replace("(", "\\(")
            .replace(")", "\\)")
            .replace("*", "\\*");
    },
    SplitWords: function (text) {
        if (!text) {
            return [];
        }
        let wordsAndBlanks = Sys.Helpers.String.ReplaceEndLinesAndCommaBySpaces(text).split(" ");
        let words = [];
        for (let index = 0; index < wordsAndBlanks.length; index++) {
            let wordOrBlank = wordsAndBlanks[index];
            if (wordOrBlank.length !== 0) {
                words.push(wordOrBlank);
            }
        }
        return words;
    },
    BuildFtsFilterWithAddressWordsAndZipcodes: function (addressWords, extractedZipCodes, cultureCode) {
        if (extractedZipCodes.length > 0) {
            return FormattingTools.BuildAddressWordsAndZipCodesFtsFilter(addressWords, extractedZipCodes, cultureCode);
        }
        return FormattingTools.BuildAddressWordsFtsFilter(addressWords);
    },
    BuildAddressWordsAndZipCodesFtsFilter: function (addressWords, extractedZipCodes, cultureCode) {
        let addressWordsFilter = FormattingTools.BuildAddressWordsFtsFilter(addressWords);
        let zipCodesFilter = FormattingTools.BuildZipCodesFtsFilter(extractedZipCodes, cultureCode);
        return Sys.Helpers.LdapUtil.FilterAnd(addressWordsFilter, zipCodesFilter);
    },
    BuildAddressWordsFtsFilter: function (addressWords) {
        return Sys.Helpers.LdapUtil.FilterFuzzy(addressWords, {
            strictEscape: true,
            splitWords: true,
            removeOneLetterWord: true
        });
    },
    BuildZipCodesFtsFilter: function (extractedZipCodes, cultureCode) {
        let filterList = [];
        for (let index = 0; index < extractedZipCodes.length; index++) {
            let zipCode = extractedZipCodes[index];
            filterList.push(FormattingTools.BuildZipCodeFtsFilter(zipCode, cultureCode));
        }
        return Sys.Helpers.LdapUtil.FilterOr(...filterList);
    },
    Distinct: function (objects, objectKeyFunc) {
        let unique = {};
        let distinct = [];
        objects.forEach(function (object) {
            let key = objectKeyFunc(object);
            if (!unique[key]) {
                distinct.push(object);
                unique[key] = true;
            }
        });
        return distinct;
    },
    EscapeRegExp: function (str) {
        // manage special characters for RegExp
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },
    ReplaceCaseInsensitive: function (stringTarget, searchValue, newvalue) {
        let regex = new RegExp("(" + FormattingTools.EscapeRegExp(searchValue) + ")", "gi");
        return stringTarget.replace(regex, newvalue);
    }
};
function SuggestAndReconcileContract() {
    if (g_erpOrderDocument && Lib.SOP.Contracts.IsContractFeatureActivated()) {
        // Fill order contract number if possible
        g_erpOrderDocument.FillContractNumber()
            .Then(() => {
            // Load contract and reconcile contract items
            g_erpOrderDocument.LoadContract();
        });
    }
}
function CheckMaterialConfidenceLevel(row) {
    let confidence = row.GetConfidence("ItemNumber__");
    if (row.GetConfidenceType("ItemNumber__") === "inferred"
        && confidence < g_ClearMaterialWhenConfidenceBelow) {
        Log.Warn("Autolearn confidence (" + confidence + ") below the limit (" + g_ClearMaterialWhenConfidenceBelow + "), cleaning item number: " + row.GetValue("ItemNumber__"));
        row.SetValue("ItemNumber__", "");
    }
}
function GetUnusualQuantityDataset(table, customerNumber, materialNumber, uom) {
    let cdlId = "CDL#" + table.GetLocalUniqueId();
    // 'Line_ItemNumber__' is a column of the CDL generated by the CD
    // every Item column is prefixed by 'Line_' in the CDL
    let filter = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual("CustomerNumber__", customerNumber), Sys.Helpers.LdapUtil.FilterEqual("Line_ItemNumber__", materialNumber), Sys.Helpers.LdapUtil.FilterEqual("Line_Unit__", uom), Sys.Helpers.LdapUtil.FilterEqual("State", "100"), Sys.Helpers.LdapUtil.FilterEqual("Splitdone", "0"), Sys.Helpers.LdapUtil.FilterNotEqual("Order_status__", "OrderArchived"));
    return Process.BuildTrainingDataset(cdlId, filter.toString(), ["Line_Quantity__"] /*, outlierValueOptions */);
}
function DetectUnusualQuantity(table, row, customerNumber) {
    let config = Sys.OM.Helpers.GetConfiguration();
    if (config.DetectUnusualQuantities !== "1" || config.EnableReportingOnItems !== "1") {
        return;
    }
    let quantity = row.GetValue("Quantity__");
    let materialNumber = row.GetValue("ItemNumber__");
    let uom = row.GetValue("Unit__");
    if (!quantity || quantity <= 0) {
        Log.Warn(`Invalid extracted Quantity__ of '${quantity}' for ItemNumber__=${materialNumber} -> no detection of unusual quantity`);
        return;
    }
    if (!uom) {
        Log.Warn("Unit__ not extracted correctly -> no detection of unusual quantity possible");
        return;
    }
    let dataset = GetUnusualQuantityDataset(table, customerNumber, materialNumber, uom);
    if (dataset.length === 0) {
        Log.Verbose("No dataset returned by 'Process.BuildTrainingDataset' -> no detection of unusual quantity");
        return;
    }
    let result = Sys.OutlierDetection.IsOutlierValue(dataset, quantity);
    if (result.error) {
        Log.Error(result.error);
    }
    else if (result.status) {
        row.SetWarning("Quantity__", "Unusual quantity");
    }
    else if (result.warning) {
        Log.Warn(result.warning);
    }
}
function CheckMaterialExistenceInTable(row) {
    if (!Lib.SOP.Helpers.IsERP("Generic")) {
        return;
    }
    let itemnumber = row.GetValue("ItemNumber__");
    if (itemnumber) {
        let filter = Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.Materials.number, itemnumber);
        let vars = Lib.SOP.Helpers.QueryDB(Lib.SOP.Tables.Materials.tableName, filter, Lib.SOP.Tables.Materials.number, 2);
        if (vars) {
            if (vars.length === 0) {
                row.SetError("ItemNumber__", "The value does not exist");
            }
            if (vars.length > 1) {
                Log.Error("Inconsistent data set: more than 1 result for material query");
            }
        }
    }
}
function ComputeTotalPrice(row) {
    let total = row.GetValue("Total__");
    const computedTotal = Lib.SOP.Helpers.ComputeTotalValue(row);
    if (!isNaN(computedTotal)) {
        //If the total is set, it means that it's extracted, and need to be checked if equals to quantity * unitprice
        if (total) {
            if (parseFloat((computedTotal).toFixed(2)) !== total) {
                row.SetWarning("Total__", "Total does not match unit price and quantity values");
            }
            else {
                row.SetWarning("Total__", "");
            }
        }
        else {
            row.SetValue("Total__", computedTotal);
        }
    }
}
async function CompleteLineItem(table, lineItem) {
    let customerNumber = Data.GetValue("CustomerNumber__");
    CheckMaterialConfidenceLevel(lineItem);
    const emptyDescriptionIfMappingFound = true;
    Lib.SOP.SAP.Helpers.Material.MapMaterialId(lineItem, g_erpOrderDocument, emptyDescriptionIfMappingFound);
    const extractedDescription = lineItem.GetValue("ExtractedDescription__");
    if (Data.GetValue("Extracted_Using_Gpt__")) {
        const description = lineItem.GetValue("ExtractedDescription__") || lineItem.GetValue("Description__");
        const materialId = lineItem.GetValue("CustomerMaterialId__");
        const criteria = description ? description : materialId;
        await FindMaterialFromDescriptionGptEnhanced(lineItem, criteria);
    }
    else if (Sys.OM.Helpers.GetConfiguration().AutofillMaterialIDBasedOnSemanticSearch === "1" && extractedDescription) {
        Log.Warn("[CompleteLineItem] Calling FindMaterialFromDescriptionGptEnhanced");
        await FindMaterialFromDescriptionGptEnhanced(lineItem, extractedDescription);
    }
    // User exit: Custom material lookup after ItemNumber__ is determined but before Description__ and extra fields are filled
    const customMaterialLookupPromise = Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Extraction.OnMaterialIDMapped", lineItem, table);
    if (customMaterialLookupPromise && typeof customMaterialLookupPromise.then === "function") {
        await customMaterialLookupPromise;
    }
    Lib.SOP.SAP.Helpers.Material.MapUnit(lineItem);
    if (Sys.OM.Helpers.GetConfiguration().DisplayConcatenedUOMToggles === "1") {
        Lib.SOP.UOMConcatenation.FillFromConcatenatedUOM(lineItem);
    }
    Lib.SOP.QuantityConversion.ConvertQuantity(lineItem, "ExtractedQuantity__");
    ComputeTotalPrice(lineItem);
    CheckMaterialExistenceInTable(lineItem);
    DetectUnusualQuantity(table, lineItem, customerNumber);
}
async function FindMaterialFromDescriptionGptEnhanced(lineItem, extractedDescription) {
    if (lineItem.GetValue("ItemNumber__") && !lineItem.GetError("ItemNumber__")) {
        Log.Info("[FindMaterialFromDescriptionGptEnhanced] ItemNumber__ already set");
        return;
    }
    if (!extractedDescription) {
        Log.Info("[FindMaterialFromDescriptionGptEnhanced] No description extracted");
        return;
    }
    const configuration = CustomerOrderProcessing.Extraction.UserExit.GetGptEnhancedMaterialSearchConfiguration() || {};
    const disableGPT = Variable.GetValueAsString("DisableGPTForMaterialSearch") === "1";
    const ftsQueryFilter = Lib.SOP.DataFilteringKey.ExtendFilterWithDataFilteringKey(Lib.SOP.Tables.Materials.tableName, "").toString();
    const parameters = [
        extractedDescription, /*inputString*/
        ftsQueryFilter, /*defaultFilter*/
        ["Number__", "Description__"], /*attributes*/
        10, /*maxRecords*/
        configuration.enhanceQuestionWithChatGPT,
        configuration.enhanceQuestionExamples,
        configuration.businessContext,
        10, /*maxRecordsToRerank*/
        disableGPT
    ];
    let matchingProducts;
    try {
        matchingProducts = await Sys.Helpers.CacheForRetries.Try(cacheForRetries, "FindMaterialFromDescriptionGptEnhanced Sys.OM.Material.QueryMaterialInformationFTS " + extractedDescription, Sys.OM.Material.QueryMaterialInformationFTS, parameters, {
            maxTry: 1,
            dynamic: true
        });
    }
    catch (error) {
        Log.Error("Error while calling Sys.OM.Material.QueryMaterialInformationFTS: " + error);
        return;
    }
    const bestMatch = matchingProducts[0];
    if (bestMatch && bestMatch.Number__) {
        Log.Verbose("[FindMaterialFromDescriptionGptEnhanced] Material found from the description: " + bestMatch.Number__);
        Lib.SOP.Helpers.SetValueWithSourceFromTable(lineItem, "ItemNumber__", bestMatch.Number__, Lib.SOP.Tables.Materials.tableName);
        lineItem.SetWarning("ItemNumber__", "_Material found from the description. Make sure that it is correct");
        if (!lineItem.GetValue("CustomerMaterialId__")) {
            Lib.SOP.Helpers.SetValueWithSourceFromTable(lineItem, "CustomerMaterialId__", bestMatch.Number__, Lib.SOP.Tables.Materials.tableName);
        }
    }
    else {
        Log.Verbose("[FindMaterialFromDescriptionGptEnhanced] No material found from the description");
    }
    if (bestMatch && bestMatch.Description__) {
        Lib.SOP.Helpers.SetValueWithSourceFromTable(lineItem, "Description__", bestMatch.Description__, Lib.SOP.Tables.Materials.tableName);
    }
}
async function FillProductListTable(forgetSynergyResult = false) {
    if (Lib.SOP.Helpers.IsSplitOrder()) {
        Log.Info("This is a splitted order, skipping product list extraction");
        return;
    }
    Log.Info("Filling Product_List__ table");
    let oTable = Data.GetTable("Product_List__");
    let iLineItemsCount = oTable.GetItemCount();
    let oLineItems = [];
    let bIsSynergy = false;
    if (iLineItemsCount > 0) {
        for (let i = 0; i < iLineItemsCount; i++) {
            let lineItem = oTable.GetItem(i);
            oLineItems.push(lineItem);
        }
    }
    else if (iLineItemsCount === 0 && !forgetSynergyResult && Sys.OM.Helpers.GetConfiguration().EnableSynergy === "1") {
        bIsSynergy = true;
        oLineItems = Lib.SOP.SynergyNeuralNetwork.ProductListExtraction(oTable, false, false);
    }
    Variable.SetValueAsString("IsSynergy", JSON.stringify(bIsSynergy));
    if (!bIsSynergy && Data.GetValue("RecognitionMethod") === "" && Data.GetActionType() !== "autocomplete") {
        Data.SetValue("RecognitionMethod", "FTR");
    }
    if (oLineItems.length === 0) {
        // no item extracted, we add one empty item to force required datacheck error
        oTable.AddItem();
    }
    else {
        for (let idx in oLineItems) {
            await CompleteLineItem(oTable, oLineItems[idx]);
        }
        Lib.SOP.SAP.Helpers.Material.GetAndFillDescriptions(oLineItems);
    }
}
function SetRunningTotal() {
    let runningTotal = Lib.SOP.GetLineItemTotalSum();
    Data.SetValue("RunningTotal__", runningTotal);
}
const BlockAddressesInDocument = {
    m_BlockAddressArray: undefined,
    m_PotentialPostalCodes: undefined,
    GetTextAroundWord: function (blockAddress) {
        // Max Block address lines
        let maxLines = 7;
        let box = BlockAddressesInDocument.GetBoundingBoxFromArea(blockAddress);
        box.nbLines = 0;
        box.stopLooking = false;
        // Tolerances when enlarging block address between two words
        // ~0.75cm
        box.maxX = Document.GetPageResolutionX(blockAddress.page) * 0.75 / 2.54;
        // ~0.5cm
        box.maxY = Document.GetPageResolutionY(blockAddress.page) * 0.5 / 2.54;
        while (box.nbLines < maxLines) {
            box = this.EnlargeRight(box);
            box = this.EnlargeLeft(box);
            box = this.ExtendToTop(box);
            if (box.stopLooking) {
                break;
            }
        }
        let zoneBlockAdress = Document.GetArea(box.page, box.x, box.y, box.width, box.height);
        return zoneBlockAdress;
    },
    EnlargeLeft: function (box) {
        // find the most top-left word inside our current rect
        let __areaCurrentWord = Document.GetWord(box.page, box.x, box.y);
        let __iBreak = 0;
        while (__areaCurrentWord.x > box.x && __iBreak < 3) {
            let __areaNextWord = Document.GetWord(box.page, __areaCurrentWord.x, box.y).GetNextWord();
            if (__areaNextWord.x === 0 ||
                (__areaNextWord.x < __areaCurrentWord.x ||
                    __areaNextWord.y > (__areaCurrentWord.y + __areaCurrentWord.height))) {
                // next line
                break;
            }
            __areaCurrentWord = __areaNextWord;
            __iBreak++;
        }
        if (__areaCurrentWord.x !== 0) {
            while (1) {
                let __areaPrevWord = __areaCurrentWord.GetPreviousWord();
                let __iNewX = __areaPrevWord.x + __areaPrevWord.width;
                if (__iNewX !== 0 && (__iNewX < box.x) && (box.x - __iNewX) < box.maxX) {
                    box.width += box.x - __areaPrevWord.x;
                    box.x = __areaPrevWord.x;
                    __areaCurrentWord = __areaPrevWord;
                }
                else {
                    break;
                }
            }
        }
        return box;
    },
    EnlargeRight: function (box) {
        // Enlarge to right
        let __areaCurrentWord = Document.GetWord(box.page, box.x + box.width, box.y);
        let __iBreak = 0;
        while (__areaCurrentWord.x > (box.x + box.width) && __iBreak < 3) {
            let __iCurX = __areaCurrentWord.x + __areaCurrentWord.width;
            let __areaPrevWord = Document.GetWord(box.page, __iCurX, box.y).GetPreviousWord();
            if (__areaPrevWord.x === 0 ||
                (__areaPrevWord.x + __areaPrevWord.w) < __iCurX) {
                // next line
                break;
            }
            __areaCurrentWord = __areaPrevWord;
            __iBreak++;
        }
        if (__areaCurrentWord.x !== 0) {
            let stopWatch = false;
            while (!stopWatch) {
                let __iOldX = __areaCurrentWord.x + __areaCurrentWord.width;
                let __areaNextWord = Document.GetWord(box.page, __iOldX, box.y).GetNextWord();
                let __iNewX = __areaNextWord.x;
                if (__iNewX !== 0 && (__iNewX > __iOldX) && ((__iNewX - __iOldX) < box.maxX)) {
                    box.width = __iNewX + __areaNextWord.width - box.x;
                    let __areaNewCurrentWord = Document.GetWord(box.page, box.x + box.width, box.y);
                    if (__areaNewCurrentWord.x === __areaCurrentWord.x) {
                        stopWatch = true;
                    }
                    else {
                        __areaCurrentWord = __areaNewCurrentWord;
                    }
                }
                else {
                    // ensure the whole word lies within our rectangle
                    if ((box.x + box.width) < __iOldX) {
                        box.width = __iOldX - box.x;
                    }
                    stopWatch = true;
                }
            }
        }
        return box;
    },
    ExtendToTop: function (box) {
        if (box == null) {
            return null;
        }
        // Rename variables for better reading
        box.leading = box.x;
        box.middle = box.x + (box.width / 2);
        box.trailing = box.x + box.width;
        box.top = box.y;
        // Enlarge to top: look for the nearest word on the left, middle and right of the top of the block address (this will solve text alignement problem)
        let wordAboveLeft = Document.GetWord(box.page, box.leading, box.top).GetWordAbove();
        let wordAboveMiddle = Document.GetWord(box.page, box.middle, box.top).GetWordAbove();
        let wordAboveRight = Document.GetWord(box.page, box.trailing, box.top).GetWordAbove();
        let wordsAbove = [wordAboveLeft, wordAboveMiddle, wordAboveRight];
        // Check that the words are actually above the area
        wordsAbove = wordsAbove.filter(function (word) {
            return word.y < box.top;
        });
        // Sort the words found to get the closest to the top of the area
        wordsAbove = wordsAbove.sort(this.SortDescendingY);
        let prevLine = wordsAbove[0];
        let prevLineBottom = prevLine ? prevLine.y + prevLine.height : 0;
        if (prevLine && prevLineBottom < box.y && (box.y - prevLineBottom) < box.maxY) {
            box.height += box.y - prevLine.y;
            box.y = prevLine.y;
            box.nbLines++;
        }
        else {
            box.stopLooking = true;
        }
        return box;
    },
    SortDescendingY: function (a, b) {
        if (a.y > b.y) {
            return -1;
        }
        if (a.y < b.y) {
            return 1;
        }
        return 0;
    },
    GetDocumentLastSearchPage: function () {
        return Document.GetPageCount() === 1 ? 1 : 2;
    },
    LookupBlockAddressInDocument: function (sCultureCode, numPage) {
        Log.Verbose("LookupBlockAddressInDocument with sCultureCode : " + sCultureCode + " \t numPage : " + numPage);
        let postalCodeRegExp = GetPostalCodeRegExp(sCultureCode);
        let blockAddressArray = [];
        let potentialPostalCodes = [];
        if (!postalCodeRegExp) {
            BlockAddressesInDocument.m_BlockAddressArray = blockAddressArray;
            BlockAddressesInDocument.m_PotentialPostalCodes = potentialPostalCodes;
            return blockAddressArray;
        }
        let firstSearchPage = 0;
        let lastSearchPage = BlockAddressesInDocument.GetDocumentLastSearchPage();
        /*If we want to watch a specific page*/
        if (typeof numPage != "undefined") {
            firstSearchPage = numPage;
            lastSearchPage = numPage + 1;
        }
        /* We go through each page */
        for (let iPage = firstSearchPage; iPage < lastSearchPage; iPage++) {
            let sPageText = Document.GetArea(iPage).toString();
            let sPostalCodeArray;
            let checkedPostalCode = {};
            /* We look for possible Postal Code */
            while ((sPostalCodeArray = postalCodeRegExp.exec(sPageText)) != null) {
                let potentialPostalCode = sPostalCodeArray[0].trim();
                if (postalCodeRegExp.lastIndex) {
                    postalCodeRegExp.lastIndex--;
                }
                if (checkedPostalCode[potentialPostalCode]) {
                    continue;
                }
                checkedPostalCode[potentialPostalCode] = true;
                let areaPostalCode = Document.SearchString(potentialPostalCode, iPage, true, false);
                for (let areaIndex = 0; areaIndex < areaPostalCode.length; areaIndex++) {
                    let blockAddress = this.ExtractBlockAddressFromPotentialPostalCodeArea(areaPostalCode[areaIndex]);
                    if (blockAddress) {
                        let objMatchingInfo = this.BuildMatchingInfo(areaPostalCode[0], blockAddress);
                        blockAddressArray.push(objMatchingInfo);
                        potentialPostalCodes.push(potentialPostalCode);
                    }
                }
            }
        }
        BlockAddressesInDocument.m_BlockAddressArray = blockAddressArray;
        BlockAddressesInDocument.m_PotentialPostalCodes = potentialPostalCodes;
        return blockAddressArray;
    },
    ExtractBlockAddressFromPotentialPostalCodeArea: function (area) {
        if (area == null) {
            return false;
        }
        let blockAddress;
        blockAddress = area;
        blockAddress = BlockAddressesInDocument.GetTextAroundWord(blockAddress);
        let sBlockAddress = blockAddress.toString();
        //Check if there is a single line
        let isBlockComputed = false;
        if (sBlockAddress.search(/\r|\n/g) === -1) {
            if (sBlockAddress === BlockAddressesInDocument.GetAreaFromBlockAddress(blockAddress).toString()) {
                blockAddress = BlockAddressesInDocument.ForceEnlargeLeft(blockAddress);
                if (sBlockAddress !== blockAddress.toString()) {
                    sBlockAddress = blockAddress.toString();
                    isBlockComputed = sBlockAddress.split("\n").length > 1;
                }
            }
            if (!isBlockComputed) {
                blockAddress = BlockAddressesInDocument.ForceExtendTop(blockAddress);
            }
        }
        return blockAddress;
    },
    ForceEnlargeLeft: function (blockAddress) {
        let __areaPrevWord = Document.GetWord(blockAddress.page, blockAddress.x, blockAddress.y).GetPreviousWord();
        let __iNewX = __areaPrevWord.x + __areaPrevWord.w;
        if (__iNewX !== 0 && (__iNewX < blockAddress.x)) {
            let box = BlockAddressesInDocument.GetBoundingBoxFromArea(blockAddress);
            box.width += blockAddress.x - __areaPrevWord.x;
            box.x = __areaPrevWord.x;
            blockAddress = BlockAddressesInDocument.GetTextAroundWord(box);
        }
        return blockAddress;
    },
    ForceExtendTop: function (blockAddress) {
        // Enlarge to the top, until the first word
        let prevLineToLeft = Document.GetWord(blockAddress.page, blockAddress.x, blockAddress.y);
        let areaPrevLine = prevLineToLeft.GetWordAbove();
        let __iNewY = areaPrevLine.y + areaPrevLine.height;
        if (__iNewY !== 0 && __iNewY < blockAddress.y) {
            let box = BlockAddressesInDocument.GetBoundingBoxFromArea(blockAddress);
            box.height += blockAddress.y - areaPrevLine.y;
            box.y = areaPrevLine.y;
            blockAddress = BlockAddressesInDocument.GetTextAroundWord(box);
        }
        return blockAddress;
    },
    GetBoundingBoxFromArea: function (blockAddress) {
        return {
            page: blockAddress.page,
            x: blockAddress.x,
            y: blockAddress.y,
            height: blockAddress.height,
            width: blockAddress.width
        };
    },
    /* Simplify the writing and avoid small variable assignations */
    GetAreaFromBlockAddress: function (blockAddress) {
        return Document.GetArea(blockAddress.page, blockAddress.x, blockAddress.y, blockAddress.width, blockAddress.height);
    },
    BuildMatchingInfo: function (postalCode, blockAddress) {
        return {
            zone: blockAddress,
            columns: ["Zip_code__", "Street__", "Region__", "City__", "Name__"],
            lookupText: [
                postalCode.toString(),
                blockAddress.toString(),
                blockAddress.toString(),
                blockAddress.toString(),
                blockAddress.toString()
            ]
        };
    },
    DiscardAddressFilter: function (blockAddress, keywords) {
        let addressString = blockAddress.lookupText[1];
        let addressArea = blockAddress.zone;
        let isAddressDiscarded = CustomerOrderProcessing.Extraction.UserExit.DiscardAddress(addressString, addressArea);
        if (isAddressDiscarded === null) {
            isAddressDiscarded = false;
            addressString = blockAddress.lookupText[1].toLowerCase();
            for (let i = 0; i < keywords.length; i++) {
                if (addressString.lastIndexOf(keywords[i].toLowerCase()) >= 0) {
                    isAddressDiscarded = true;
                    break;
                }
            }
        }
        return isAddressDiscarded;
    },
    BlockAddressFilter: function (address) {
        return !BlockAddressesInDocument.DiscardAddressFilter(address, g_addressExclusionKeywords);
    }
};
function GetPostalCodeRegExp(cultureCode) {
    switch (cultureCode) {
        case "en-US":
            return /([ ,]|$|^)[0-9]{5}(([ ]?\-[ ]?[0-9]{4})|\-)?([ ,]|$)/mg;
        case "en-CA":
            return /[A-Z][0-9][A-Z] [0-9][A-Z][0-9]/gm;
        case "es-MX":
            return /[0-9]{5}/gm;
        case "fr-FR":
        case "es-ES":
        case "de-DE":
        case "it-IT":
            return /([ ,]|$|^)([a-zA-Z]{1,2}[- ]?)?\d{2} ?\d{3}([ ,]|$)/gm;
        case "en-GB":
            return /([ ,]|$|^)[a-zA-Z]{1,2}[0-9]{1,2}[a-zA-Z]?[ ]?[0-9][a-zA-Z]{2}([ ,]|$)/mg;
        case "en-AU":
        case "en-NZ":
            return /([ ,]|$|^)[0-9]{4}([ ,]|$)/mg;
        case "zh-CN":
            return /([ ,]|$|^)[0-9]{4}[ ]?[0-9]{2}([ ,]|$)/mg;
        default:
            Log.Error("Unknown CultureCode: " + cultureCode);
            return null;
    }
}
function KeywordSearch(keywordsArray, culture, searchType, fieldName, headerOffsetY) {
    function GetAreaOnTheRight(area, newXTolerance, newYTolerance) {
        let offsetX = 10;
        if (newXTolerance != null) {
            offsetX = newXTolerance;
        }
        let offsetY = 0.1;
        if (newYTolerance != null) {
            offsetY = newYTolerance;
        }
        // ~10cm
        let XTolerance = Document.GetPageResolutionX(area.page) * offsetX / 2.54;
        // ~0.5cm
        let YTolerance = Document.GetPageResolutionY(area.page) * offsetY / 2.54;
        return Document.GetArea(area.page, area.x + area.width + 1, area.y - YTolerance, area.width + 1 + XTolerance, area.height + YTolerance * 2);
    }
    function GetAreaBelow(area, newXTolerance, newYTolerance) {
        let offsetX = 0.5;
        if (newXTolerance != null) {
            offsetX = newXTolerance;
        }
        let offsetY = 3;
        if (newYTolerance != null) {
            offsetY = newYTolerance;
        }
        // ~0.5cm
        let XTolerance = Document.GetPageResolutionX(area.page) * offsetX / 2.54;
        // ~3cm
        let YTolerance = Document.GetPageResolutionY(area.page) * offsetY / 2.54;
        return Document.GetArea(area.page, area.x - XTolerance, area.y + area.height + 1, area.width + (XTolerance * 2), area.height + YTolerance);
    }
    function IsInPageHeader(area, newYTolerance) {
        let offsetY = headerOffsetY ? headerOffsetY : 10;
        if (newYTolerance != null) {
            offsetY = newYTolerance;
        }
        // ~10cm
        let YTolerance = Document.GetPageResolutionY(area.page) * offsetY / 2.54;
        if (area.y < YTolerance) {
            return true;
        }
        return false;
    }
    let regExp, bReverseSearch = false;
    if (searchType === "number") {
        bReverseSearch = true;
    }
    else if (searchType !== "date") {
        regExp = RegExp(searchType);
    }
    else if (searchType === "date") {
        bReverseSearch = false;
    }
    else {
        Log.Error("Unknown searchType:" + searchType);
    }
    let fieldsFound;
    let fieldsFormattedFound;
    let fieldFound = false;
    for (let iWord = 0; iWord < keywordsArray.length && !fieldFound; iWord++) {
        let nbPages = Document.GetPageCount();
        /**
         * When bReverseSearch is true we must start search from last page
         */
        let startPage;
        let endPage;
        let increment;
        if (bReverseSearch) {
            startPage = nbPages - 1;
            endPage = -1;
            increment = -1;
        }
        else {
            endPage = nbPages;
            startPage = 0;
            increment = 1;
        }
        let numPage = startPage;
        while (numPage !== endPage && !fieldFound) {
            let zoneArray = Document.SearchString(keywordsArray[iWord], numPage, false, true);
            for (let numArea = 0; numArea < zoneArray.length && !fieldFound; numArea++) {
                let usefullKeyword = true;
                let z = zoneArray[bReverseSearch ? zoneArray.length - numArea - 1 : numArea];
                // look on the right of the keyword
                if (searchType === "date") {
                    let nextReference = GetAreaOnTheRight(z);
                    let dataAfter = Document.ExtractDate(culture.replace(/[-](AU|NZ)$/, "-GB"), numPage, nextReference.x, nextReference.y, nextReference.width, nextReference.height);
                    if (dataAfter && dataAfter.length > 0) {
                        Log.Verbose("Found:" + fieldName + " on the right of keyword: " + keywordsArray[iWord] + " /value:" + dataAfter[0]);
                        fieldsFormattedFound = dataAfter[0].toDate();
                        fieldsFound = dataAfter[0];
                        fieldFound = true;
                    }
                }
                else if (searchType === "number") {
                    let nextReference = GetAreaOnTheRight(z, 20, 1);
                    let dataAfter = Document.ExtractNumber(culture, numPage, nextReference.x, nextReference.y, nextReference.width, nextReference.height);
                    if (dataAfter && dataAfter.length > 0) {
                        let candidate = dataAfter[0].toNumber();
                        let iMax = 0;
                        for (let index = 1; index < dataAfter.length; index++) {
                            if (dataAfter[index].toNumber() > candidate) {
                                iMax = index;
                                candidate = dataAfter[index].toNumber();
                            }
                        }
                        Log.Verbose("Found:" + fieldName + " on the right of keyword: " + keywordsArray[iWord] + " /value:" + candidate);
                        fieldsFormattedFound = candidate;
                        fieldsFound = dataAfter[iMax];
                        fieldFound = true;
                    }
                }
                else if (IsInPageHeader(z) && z.ocrConfidenceLevel > 10) {
                    let nextReference = GetAreaOnTheRight(z, 3, 0.1);
                    let dataAfter = regExp.exec(nextReference.toString());
                    if (dataAfter) {
                        Log.Verbose("Found:" + fieldName + " on the right of keyword: " + keywordsArray[iWord] + " /value:" + nextReference.toString());
                        let highlights = Document.SearchString(dataAfter[0], numPage, nextReference.x, nextReference.y, nextReference.width, nextReference.height, true, false);
                        if (highlights && highlights.length > 0) {
                            Data.SetValue(fieldName, highlights[0], dataAfter[0]);
                        }
                        else {
                            Data.SetValue(fieldName, nextReference, dataAfter[0]);
                        }
                        return dataAfter[0];
                    }
                }
                else {
                    usefullKeyword = false;
                }
                if (!fieldFound) {
                    // look under the keyword
                    if (usefullKeyword && searchType === "date") {
                        let belowReference = GetAreaBelow(z);
                        let dataBelow = Document.ExtractDate(culture.replace(/[-](AU|NZ)$/, "-GB"), numPage, belowReference.x, belowReference.y, belowReference.width, belowReference.height);
                        if (dataBelow && dataBelow.length > 0) {
                            Log.Verbose("Found:" + fieldName + " below keyword: " + keywordsArray[iWord] + " /value:" + dataBelow[0]);
                            fieldsFormattedFound = dataBelow[0].toDate();
                            fieldsFound = dataBelow[0];
                            fieldFound = true;
                        }
                    }
                    else if (usefullKeyword && searchType === "number") {
                        //Un peu de refactor à faire pour éviter cela
                        let belowReference = GetAreaBelow(z, 20);
                        let dataBelowForTest = Document.ExtractNumber(culture, numPage, belowReference.x, belowReference.y, belowReference.width * 2, belowReference.height);
                        let oldX = belowReference.x;
                        let newY = belowReference.y;
                        let oldWidth = belowReference.width;
                        let oldHeight = belowReference.height;
                        let candidate = 0;
                        let iMax;
                        /**
                         * If data are found under a keyword, we might search on lines below.
                         * This is done in case of a keyword found in a table header
                         */
                        let dataBelow = null;
                        while (dataBelowForTest && dataBelowForTest.length > 0) {
                            dataBelow = dataBelowForTest;
                            newY += oldHeight;
                            dataBelowForTest = Document.ExtractNumber(culture, numPage, oldX, newY, oldWidth * 2, oldHeight);
                        }
                        if (dataBelow && dataBelow.length > 0) {
                            iMax = 0;
                            for (let index = 0; index < dataBelow.length; index++) {
                                if (dataBelow[index].toNumber() > candidate) {
                                    iMax = index;
                                    candidate = dataBelow[index].toNumber();
                                }
                            }
                            Log.Verbose("Found:" + fieldName + " below keyword: " + keywordsArray[iWord] + " /value:" + candidate);
                            fieldsFormattedFound = candidate;
                            fieldsFound = dataBelow[iMax];
                            fieldFound = true;
                        }
                    }
                    else if (usefullKeyword) {
                        let belowReference = GetAreaBelow(z, 0.5, 0.8);
                        let dataBelow = regExp.exec(belowReference.toString());
                        if (dataBelow) {
                            Log.Verbose("Found:" + fieldName + " below keyword: " + keywordsArray[iWord] + " /value:" + dataBelow[0]);
                            let highlights = Document.SearchString(dataBelow[0], numPage, belowReference.x, belowReference.y, belowReference.width, belowReference.height, true, false);
                            if (highlights && highlights.length > 0) {
                                Data.SetValue(fieldName, highlights[0], dataBelow[0]);
                            }
                            else {
                                Data.SetValue(fieldName, belowReference, dataBelow[0]);
                            }
                            return dataBelow[0];
                        }
                    }
                    else {
                        Log.Info("Skipping keyword " + keywordsArray[iWord] + " (not in page header or confidence level too low).");
                    }
                }
            }
            numPage += increment;
        }
    }
    if (fieldFound) {
        Data.SetValue(fieldName, fieldsFound);
        return fieldsFormattedFound;
    }
    return null;
}
function SearchHeaderFieldsByKeywords() {
    let SODate = Data.GetValue("Sales_Order_Date__");
    if (SODate == null && !Data.IsComputed("Sales_Order_Date__")) {
        // First try with complex keywords
        SODate = KeywordSearch(g_SODateKeywordsFirstTry, g_sDocumentCulture, "date", "Sales_Order_Date__");
        if (SODate == null) {
            // Second try with generic keywords
            Log.Info("SODate 2nd try");
            SODate = KeywordSearch(g_SODateKeywordsSecondTry, g_sDocumentCulture, "date", "Sales_Order_Date__");
        }
        if (SODate == null) {
            // Fetch any date
            Log.Info("SODate last try");
            let zones = Document.ExtractDate(g_sDocumentCulture.replace(/[-](AU|NZ)$/, "-GB"));
            if (zones && zones.length > 0) {
                Data.SetValue("Sales_Order_Date__", zones[0]);
            }
        }
    }
    let DueDate = Data.GetValue("Due_Date__");
    if (DueDate == null && !Data.IsComputed("Due_Date__") && Sys.OM.Helpers.GetConfiguration().DisplayRequestedDeliveryDate !== "0") {
        // First try with complex keywords
        KeywordSearch(g_DueDateKeywords, g_sDocumentCulture, "date", "Due_Date__");
    }
    let SOTotal = Data.GetValue("Total__");
    if (!SOTotal && !Data.IsComputed("Total__") && !KeywordSearch(g_TotalKeywordsFirstTry, g_sDocumentCulture, "number", "Total__")) {
        // First try with complex keywords
        // Second try with generic keywords
        KeywordSearch(g_TotalKeywordsSecondTry, g_sDocumentCulture, "number", "Total__");
    }
    let PONumber = Data.GetValue("Sales_Order_Number__");
    if (!PONumber && !Data.IsComputed("Sales_Order_Number__") && !KeywordSearch(g_PONumberKeywordsFirstTry, g_sDocumentCulture, g_PONumberRegex, "Sales_Order_Number__")) {
        // First try with complex keywords
        // Second try with generic keywords
        Log.Info("PONumber 2nd try");
        KeywordSearch(g_PONumberKeywordsSecondTry, g_sDocumentCulture, g_PONumberRegex, "Sales_Order_Number__");
    }
    let isQuoteFeatureActivated = Lib.SOP.Quotes.IsQuoteFeatureActivated();
    Log.Info("Extraction of quotation number " + (isQuoteFeatureActivated ? "enabled" : "disabled"));
    if (isQuoteFeatureActivated) {
        let QuotationNumber = Data.GetValue("QuotationNumber__");
        if (!QuotationNumber && !KeywordSearch(g_QuotationNumberKeywordsFirstTry, g_sDocumentCulture, g_QuotationNumberRegex, "QuotationNumber__")) {
            // First try with complex keywords
            // Second try with generic keywords
            Log.Info("Quotation Number 2nd try");
            KeywordSearch(g_QuotationNumberKeywordsSecondTry, g_sDocumentCulture, g_QuotationNumberRegex, "QuotationNumber__");
        }
    }
}
function QueryDuplicateCheckAlertLevel() {
    Log.Info("QueryDuplicateCheckAlertLevel");
    let level = "1";
    let customerNumber = Data.GetValue("CustomerNumber__");
    let tableName = null;
    if (customerNumber) {
        let filter = Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.DuplicateAlert.customerNumber, customerNumber.toString());
        let vars = Lib.SOP.Helpers.QueryDB(Lib.SOP.Tables.DuplicateAlert.tableName, filter, Lib.SOP.Tables.DuplicateAlert.blockingLevel);
        if (vars.length > 0) {
            level = vars[0].GetValue_String(Lib.SOP.Tables.DuplicateAlert.blockingLevel, 0);
            Log.Info("Duplicate check level for customer '" + customerNumber + "'=" + level);
            tableName = Lib.SOP.Tables.DuplicateAlert.tableName;
        }
        else if (Lib.SOP.isFromPortal()) {
            level = "2";
            Log.Info("Duplicate check alert level not found for customer '" + customerNumber + "', but order is coming from portal so define it at: " + level);
        }
        else {
            Log.Warn("Duplicate check alert level not found for customer '" + customerNumber + "', use default: " + level);
        }
    }
    Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "DuplicateCheckAlertLevel__", level, tableName);
}
function QueryAllowTouchless() {
    Log.Info("QueryAllowTouchless");
    let allow = "0";
    let ignoreSimulationWarning = "0";
    let customerNumber = Data.GetValue("CustomerNumber__");
    let tableName = Lib.SOP.Tables.AutomaticProcessing.tableName;
    if (Lib.SOP.Helpers.IsSplitOrder()) {
        try {
            let portalData = JSON.parse(Lib.SOP.Helpers.GetJsonSplitData());
            if (portalData && portalData.forceTouchless) {
                Data.SetValue("AllowTouchless__", "1");
                Data.SetValue("Ignore_simulation_warnings__", "1");
                Data.SetValue("IgnoreSimulationforPost__", "1");
                Data.SetValue("DuplicateCheckAlertLevel__", "0");
                Log.Info("QueryAllowTouchless : touchless forced from JsonFromSplitOrder__");
                return;
            }
        }
        catch (e) {
            Log.Error("JsonFromSplitOrder__ cannot be parsed : " + e.message);
            return;
        }
    }
    if (customerNumber) {
        let filter = Sys.Helpers.LdapUtil.FilterEqual("Customer_number__", customerNumber.toString());
        filter = Lib.SOP.Helpers.joinFilterWithExtraFilter(filter, CustomerOrderProcessing.Extraction.UserExit.GetAutomaticProcessingExtraFilter(), true);
        let vars = Lib.SOP.Helpers.QueryDB(tableName, filter, Lib.SOP.Tables.AutomaticProcessing.touchlessAllowed + "," + Lib.SOP.Tables.AutomaticProcessing.ignoreSimulationWarning + "," + Lib.SOP.Tables.AutomaticProcessing.touchlessAllowedForEdi + "," + Lib.SOP.Tables.AutomaticProcessing.touchlessAllowedForFreeText);
        Log.Info("QueryAllowTouchless : " + vars.length + " results found for customer '" + customerNumber + "'");
        if (vars.length > 0) {
            let bAllow = (isTouchlessAllowedForThisDocumentType(vars[0]) == "1");
            allow = bAllow ? "1" : "0";
            ignoreSimulationWarning = vars[0].GetValue_String(Lib.SOP.Tables.AutomaticProcessing.ignoreSimulationWarning, 0);
            Log.Info("Touchless for customer '" + customerNumber + "'=" + allow);
            Log.Info("Ignore SAP simulation warnings for customer '" + customerNumber + "'=" + ignoreSimulationWarning);
        }
        else {
            Log.Warn("Touchless info not found for customer '" + customerNumber + "', use default: " + allow);
        }
    }
    Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "AllowTouchless__", allow, tableName);
    Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "Ignore_simulation_warnings__", ignoreSimulationWarning, tableName);
}
function isTouchlessAllowedForThisDocumentType(dbResult) {
    //Can be modify to specify Mobile,Fax,...
    const source = Data.GetValue("Source__");
    let allowTouchless = "0";
    switch (source) {
        case "EDI":
            allowTouchless = dbResult.GetValue_String(Lib.SOP.Tables.AutomaticProcessing.touchlessAllowedForEdi, 0);
            allowTouchless = allowTouchless === "" ? "0" : allowTouchless;
            break;
        default:
            const extractedUsingTeaching = Data.GetValue("Extracted_Using_Teaching__");
            const extractedUsingAutolearning = Data.GetValue("Extracted_Using_Autolearning__");
            const isFreeTextOrder = getShouldProcessEmailWithChatGPT();
            if (isFreeTextOrder) {
                // Try to get touchlessAllowedForFreeText value
                let freeTextAllowTouchless = dbResult.GetValue_String(Lib.SOP.Tables.AutomaticProcessing.touchlessAllowedForFreeText, 0);
                // If field doesn't exist (returns empty string), fall back to regular touchlessAllowed value
                if (freeTextAllowTouchless === "") {
                    allowTouchless = dbResult.GetValue_String(Lib.SOP.Tables.AutomaticProcessing.touchlessAllowed, 0);
                    allowTouchless = allowTouchless === "" ? "0" : allowTouchless;
                    Log.Info("[isTouchlessAllowedForThisDocumentType] freeTextAllowTouchless field not found, using touchlessAllowed value: " + allowTouchless);
                }
                else {
                    allowTouchless = freeTextAllowTouchless;
                    if (extractedUsingAutolearning || extractedUsingTeaching) {
                        Log.Info("[isTouchlessAllowedForThisDocumentType] there was teaching or autolearning, freeTextAllowTouchless field found: " + allowTouchless);
                    }
                    else {
                        Log.Info("[isTouchlessAllowedForThisDocumentType] freeTextAllowTouchless field found: " + allowTouchless);
                    }
                }
            }
            else {
                allowTouchless = dbResult.GetValue_String(Lib.SOP.Tables.AutomaticProcessing.touchlessAllowed, 0);
                allowTouchless = allowTouchless === "" ? "0" : allowTouchless;
                Log.Info("[isTouchlessAllowedForThisDocumentType] touchlessAllowed field found: " + allowTouchless);
            }
            break;
    }
    return allowTouchless;
}
function SetOwnerToParentProcessOwnerIfSplitOrderChild() {
    let splitDocumentNumber = Data.GetValue("SplitDocumentNumber");
    if (!splitDocumentNumber) { // If this is not a split order child
        return;
    }
    let sourceRUID = Data.GetValue("SourceRUID");
    if (!sourceRUID) {
        return;
    }
    // Run query to retrieve the owner of the source job
    let tableName = sourceRUID.split(".")[0];
    let attributes = "OwnerID";
    let filter = Sys.Helpers.LdapUtil.FilterEqual("MsnEx", sourceRUID.split(".")[1]);
    let queryResult = Lib.SOP.Helpers.QueryDB(tableName, filter, attributes, 1);
    if (!(queryResult && queryResult.length > 0)) {
        Log.Warn("Query to retrieve parent process vars failed");
        return;
    }
    let sourceOwnerID = queryResult[0].GetValue_String("OwnerID", 0);
    if (!sourceOwnerID) {
        Log.Warn("Parent process OwnerID not found");
        return;
    }
    Log.Info("Current order is the result of a split from order '" + sourceRUID + "'");
    Log.Info("Setting current OwnerID to match OwnerID value of source order: '" + sourceOwnerID + "'");
    Process.ChangeOwner(sourceOwnerID);
    //RD00013111
    let conf = Sys.OM.Helpers.GetConfiguration();
    if (conf.ERP === "SAP" &&
        (conf.Display_default_SAP_texts === "1" || conf.Allow_SAP_texts_modifications === "1")) {
        Data.SetValue("NotesData__", "");
    }
}
/********************************************************************
BUSINESS PRIORITY IMPLEMENTATION
 ********************************************************************/
function InitPriority() {
    if (CustomerOrderProcessing.Extraction.UserExit.OverridePriorityKeywordSearch().stop) {
        return;
    }
    let priority = g_DefaultBusinessPriority;
    let priorityKeywordsFromDbConfig = Sys.OM.Helpers.GetConfiguration().BusinessPriorityKeywords;
    let businessPriorityKeyWords = priorityKeywordsFromDbConfig
        ? MultilineToCleanList(priorityKeywordsFromDbConfig)
        : null;
    let prioritySetFromConfig = true;
    const ismBussinessPriorityData = Sys.Helpers.Email.GetEmailDataFromIsm(Data.GetValue("WorkflowID"));
    if (ismBussinessPriorityData.Priority === "H") {
        ismBussinessPriorityData.Priority = "1";
    }
    else {
        ismBussinessPriorityData.Priority = g_DefaultBusinessPriority;
    }
    const emailSubject = ismBussinessPriorityData.Subject;
    const emailBody = ismBussinessPriorityData.Body;
    const emailPriority = ismBussinessPriorityData.Priority;
    if (emailPriority === "1" && Sys.OM.Helpers.GetConfiguration().BusinessPriorityRespectEmailPriority === "1") {
        Log.Info("Business priority set (urgent email)");
        Variable.SetValueAsString("EmailFlaggedImportant", true);
        Lib.SOP.Helpers.SetValueWithSourceFromConfig(Data, "Business_Priority__", "1");
        return;
    }
    Log.Info("Find business priority keywords in document");
    if (!businessPriorityKeyWords) {
        return;
    }
    // eslint-disable-next-line guard-for-in
    for (let priorityKeywordIndex in businessPriorityKeyWords) {
        let priorityKeyword = businessPriorityKeyWords[priorityKeywordIndex];
        if (emailSubject
            && Sys.OM.Helpers.GetConfiguration().BusinessPrioritySearchEmailSubject === "1"
            && emailSubject.toUpperCase().indexOf(priorityKeyword.toUpperCase()) > -1) {
            Log.Info(`Found Keyword: ${priorityKeyword} in subject of e-mail`);
            Variable.SetValueAsString("EmailSubjectKeyword", priorityKeyword);
            priority = "1";
        }
        if (emailBody
            && Sys.OM.Helpers.GetConfiguration().BusinessPrioritySearchEmailBody === "1"
            && emailBody.toUpperCase().indexOf(priorityKeyword.toUpperCase()) > -1) {
            Log.Info(`Found Keyword: ${priorityKeyword} in body of e-mail`);
            Variable.SetValueAsString("EmailBodyKeyword", priorityKeyword);
            priority = "1";
        }
        //We search in the document only if the priority has not changed
        if (priority === g_DefaultBusinessPriority) {
            let area = Document.GetArea();
            if (Sys.OM.Helpers.GetConfiguration().BusinessPrioritySearchDocumentOptions === "2") {
                area = Document.GetArea(0);
            }
            if (Sys.OM.Helpers.GetConfiguration().BusinessPrioritySearchDocumentOptions === "1") {
                area = Document.GetArea(0, 10, 10, Document.GetPageWidth(0), Document.GetPageHeight(0) / 2);
            }
            let keywordsFound = Document.SearchString(priorityKeyword, area, false, false);
            if (keywordsFound.length > 0) {
                Log.Info(`Found at least one keyword in the document : "${keywordsFound[0]}"`);
                Variable.SetValueAsString("AttachmentKeyword", priorityKeyword);
                keywordsFound[0].Highlight(true, 0xff0000, 0xffffff);
                //If the keyword does not come from the configuration, it's from the script default value
                prioritySetFromConfig = priorityKeywordsFromDbConfig !== "";
                priority = "1";
            }
        }
    }
    if (priority === g_DefaultBusinessPriority || !prioritySetFromConfig) {
        Data.SetValue("Business_Priority__", priority);
    }
    else {
        Lib.SOP.Helpers.SetValueWithSourceFromConfig(Data, "Business_Priority__", priority);
    }
}
function MultilineToCleanList(multilineData) {
    const elements = multilineData.trim().split("\n");
    for (let i = 0; i < elements.length; i++) {
        elements[i] = elements[i].trim();
    }
    return elements.filter(function (x) {
        return x !== "";
    });
}
function InitDocAttached() {
    // Teaching set a flag to disable Send to teaching button when a document is attached
    //Attaches the current document
    let refAttach = Attach.GetProcessedDocument();
    if (refAttach) {
        Variable.SetValueAsString("DocAttached", "1");
    }
    else {
        Variable.SetValueAsString("DocAttached", "0");
    }
}
/********************************************************************
REVISED ORDER IMPLEMENTATION
 ********************************************************************/
function GetRevisedOrderSearchArea() {
    let RevisedOrderSearchDocumentOptions = Sys.OM.Helpers.GetConfiguration().RevisedOrderSearchDocumentOptions;
    if (RevisedOrderSearchDocumentOptions === "0") // all the documents
     {
        return Document.GetArea();
    }
    if (RevisedOrderSearchDocumentOptions === "1") // top part of first page
     {
        return Document.GetArea(0, 10, 10, Document.GetPageWidth(0), Document.GetPageHeight(0) / 2);
    }
    if (RevisedOrderSearchDocumentOptions === "2") // first page
     {
        return Document.GetArea(0);
    }
}
function InitRevisedOrder() {
    let configuration = Sys.OM.Helpers.GetConfiguration();
    if (Variable.GetValueAsString("EDIPreprocessing") === "1" || configuration.ActivateChangeOrders !== "1") {
        return;
    }
    if (CustomerOrderProcessing.Extraction.UserExit.OverrideRevisedOrderKeywordSearch().stop) {
        return;
    }
    let revisedOrderKeywords = configuration.RevisedOrderKeywords.split("\n");
    let checkEmailSubject = configuration.RevisedOrderSearchEmailSubject === "1";
    let checkEmailBody = configuration.RevisedOrderSearchEmailBody === "1";
    let emailData = null;
    if (checkEmailSubject || checkEmailBody) {
        emailData = Sys.Helpers.Email.GetEmailDataFromIsm(Data.GetValue("WorkflowID"));
    }
    const checkRevisedInEmailSubject = checkEmailSubject && emailData.Subject !== null;
    const checkRevisedInEmailBody = checkEmailBody && emailData.Body !== null;
    let searchArea = GetRevisedOrderSearchArea();
    let searchAreaString = "";
    if (searchArea) {
        searchAreaString = searchArea.toString();
    }
    else if (!checkRevisedInEmailSubject && !checkRevisedInEmailBody) {
        Log.Error("Cannot check revised order, no document available");
    }
    Log.Info("Find order type keywords in document");
    // eslint-disable-next-line guard-for-in
    for (let RevisedOrderKeywordIndex in revisedOrderKeywords) {
        let RevisedOrderKeyword = revisedOrderKeywords[RevisedOrderKeywordIndex].trim();
        if (RevisedOrderKeyword.length === 0) {
            continue;
        }
        let RevisedOrderRegExp = new RegExp(RevisedOrderKeyword, "i");
        if (checkRevisedInEmailSubject) {
            let matchFound = RevisedOrderRegExp.exec(emailData.Subject);
            if (matchFound && matchFound.length > 0) {
                Log.Info(`Found Keyword: ${matchFound[0]} in e-mail's subject`);
                Data.SetValue("Revised_Order__", true); // backward compatibility: the Revised_Order__ field has been removed but we still keep it in sync  (change order views in auto-update and upgrade mode)
                Data.SetValue("SalesDocumentType__", Lib.SOP.Helpers.SalesDocumentType.ChangeOrder);
                g_bDocumentTypeRecognizedByKeywords = true;
                return;
            }
        }
        if (checkRevisedInEmailBody) {
            let matchFound = RevisedOrderRegExp.exec(emailData.Body);
            if (matchFound && matchFound.length > 0) {
                Log.Info(`Found Keyword: ${matchFound[0]} in e-mail's body`);
                Data.SetValue("Revised_Order__", true); // backward compatibility: the Revised_Order__ field has been removed but we still keep it in sync  (change order views in auto-update and upgrade mode)
                Data.SetValue("SalesDocumentType__", Lib.SOP.Helpers.SalesDocumentType.ChangeOrder);
                g_bDocumentTypeRecognizedByKeywords = true;
                return;
            }
        }
        if (searchArea) {
            let matchFound = RevisedOrderRegExp.exec(searchAreaString);
            if (matchFound && matchFound.length > 0) {
                Log.Info(`Found at least one keyword in the document : "${matchFound[0]}"`);
                let areas = Document.SearchString(matchFound[0].toString(), searchArea, true, false);
                if (areas && areas.length > 0) {
                    areas[0].Highlight(true, 0xff0000, 0xffffff);
                }
                Data.SetValue("Revised_Order__", true); // backward compatibility: the Revised_Order__ field has been removed but we still keep it in sync  (change order views in auto-update and upgrade mode)
                Data.SetValue("SalesDocumentType__", Lib.SOP.Helpers.SalesDocumentType.ChangeOrder);
                g_bDocumentTypeRecognizedByKeywords = true;
                return;
            }
        }
    }
}
/*******************************************************************
Source determination
 *******************************************************************/
function SearchForClassicSource() {
    if (Variable.GetValueAsString("EDIPreprocessing") === "1") {
        return "EDI";
    }
    let source = "Other";
    let OriginalJobID = Data.GetValue("OriginalJobID");
    if (OriginalJobID) {
        let filter = Sys.Helpers.LdapUtil.FilterEqual("JobID", OriginalJobID);
        let tableName = "ISM,FGFAXIN";
        let attributes = "SendType,SrcRuid,FromAddress,Subject";
        let processQuery = Process.CreateQueryAsProcessAdmin();
        processQuery.Reset();
        processQuery.SetSpecificTable(tableName);
        processQuery.SetFilter(filter.toString());
        processQuery.SetAttributesList(attributes);
        if (processQuery.MoveFirst()) {
            let rec = processQuery.MoveNext();
            let sourceFound = false;
            while (rec && !sourceFound) {
                let vars = rec.GetUninheritedVars();
                if (vars) {
                    let sendType = vars.GetValue_String("SendType", 0);
                    let srcRuid = vars.GetValue_String("SrcRuid", 0);
                    if (sendType && !srcRuid) {
                        //srcRuid null implies that it is an origin of the workflow
                        sourceFound = true;
                        Log.Info("SendType: " + sendType);
                        if (sendType.indexOf("ISM") !== -1) {
                            if (Variable.GetValueAsString("SDADocTypeSource") === "Order") {
                                source = "SDA";
                            }
                            else {
                                source = "Email";
                            }
                            const subject = vars.GetValue_String("Subject", 0);
                            Data.SetValue("SourceSubject__", subject);
                            let emailContact = Data.GetValue("Contact_login__");
                            if (!emailContact) {
                                let FromAddress = vars.GetValue_String("FromAddress", 0);
                                Log.Info("FromAddress= " + FromAddress);
                                if (FromAddress) {
                                    Data.SetValue("Contact_login__", FromAddress);
                                    Data.SetValue("ContactEmail__", FromAddress);
                                }
                            }
                        }
                        else {
                            source = "Fax";
                        }
                    }
                }
                if (!sourceFound) {
                    rec = processQuery.MoveNext();
                }
            }
        }
    }
    return source;
}
function SetCustomerNumberFromContactEmail() {
    let contactFound = false;
    let contactEmail = Data.GetValue("Contact_login__");
    Log.Info("[DetermineCustomerFromContact] contactEmail used as filter: " + contactEmail);
    if (contactEmail) {
        let filter = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual("EmailAddress", contactEmail), Sys.Helpers.LdapUtil.FilterEqual("customer", "1")).toString();
        let table = "ODUSER";
        let query = Process.CreateQuery();
        query.Reset();
        query.SetSpecificTable(table);
        query.SetAttributesList("BusinessPartnerID");
        query.SetFilter(filter);
        query.SetOptionEx("FastSearch=1");
        if (query.MoveFirst()) {
            let results = [];
            let userRecord = query.MoveNextRecord();
            //collect distinct customer numbers associated to the email
            while (userRecord) {
                let userVars = userRecord.GetVars();
                if (userVars) {
                    let businessPartnerId = userVars.GetValue_String("BusinessPartnerID", 0);
                    if (businessPartnerId != "" && results.indexOf(businessPartnerId) < 0) {
                        results.push(businessPartnerId);
                    }
                    userRecord = query.MoveNextRecord();
                }
            }
            if (results.length > 0) {
                if (results.length == 1) {
                    let customerNumber = results[0];
                    Log.Info("[DetermineCustomerFromContact] Found businessPartnerId: " + customerNumber);
                    Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "CustomerNumber__", customerNumber, "ODUSER");
                    CustomerOrderProcessing.Extraction.UserExit.OnCustomerChange();
                    contactFound = true;
                }
                else {
                    Log.Warn("[DetermineCustomerFromContact] there are multiple customers associated with this contact email");
                }
            }
            else {
                Log.Warn("[DetermineCustomerFromContact] there are no customers associated with this contact email");
            }
        }
    }
    return contactFound;
}
function FuzzySearchCustomerNumberFromNameAndAddress() {
    let attributes = [Lib.SOP.Tables.Customers.number];
    let fuzzySearchWordList = [];
    let enoughData = false;
    const customerName = Data.GetValue("CustomerName__");
    // To have an accurate search, we need at least the customer name, plus another specific address field
    if (!customerName) {
        Log.Info("[FuzzySearchCustomerNumberFromNameAndAddress]: We need a customer name to try to find the customer number");
        return false;
    }
    attributes.push(Lib.SOP.Tables.Customers.name);
    fuzzySearchWordList.push(...customerName.split(" "));
    const customerCountry = Data.GetValue("CustomerAddress_Country__");
    if (customerCountry) {
        attributes.push(Lib.SOP.Tables.Customers.countryCode);
        fuzzySearchWordList.push(customerCountry);
    }
    const customerStreet = Data.GetValue("CustomerAddress_Street__");
    if (customerStreet) {
        attributes.push(Lib.SOP.Tables.Customers.street);
        fuzzySearchWordList.push(...customerStreet.split(" "));
        enoughData = true;
    }
    const customerPostalCode = Data.GetValue("CustomerAddress_PostalCode__");
    if (customerPostalCode) {
        attributes.push(Lib.SOP.Tables.Customers.zipCode);
        fuzzySearchWordList.push(customerPostalCode);
        enoughData = true;
    }
    const customerCity = Data.GetValue("CustomerAddress_City__");
    if (customerCity) {
        attributes.push(Lib.SOP.Tables.Customers.city);
        fuzzySearchWordList.push(customerCity);
        enoughData = true;
    }
    const customerRegion = Data.GetValue("CustomerAddress_Region__");
    if (customerRegion) {
        attributes.push(Lib.SOP.Tables.Customers.region);
        fuzzySearchWordList.push(customerRegion);
    }
    // To have an accurate search, we need at least the customer name, plus another specific address field
    if (!enoughData) {
        Log.Info("[FuzzySearchCustomerNumberFromNameAndAddress]: We don't have enough customer data to try to find the sold-to using fuzzy search");
        return false;
    }
    let queryTable = Lib.SOP.Tables.Customers.tableName;
    let filter = Sys.Helpers.LdapUtil.FilterFuzzy(fuzzySearchWordList, { removeOneLetterWord: true, splitWords: true });
    Log.Verbose("[FuzzySearchCustomerNumberFromNameAndAddress] Fuzzy search filter: " + filter);
    //TODO: if SAP, then we need to consider sales org and dist channel? It will give us multiple results.
    let results = Lib.SOP.Helpers.QueryDB(queryTable, filter, attributes.join(","), 10);
    if (!results || results.length === 0) {
        Log.Info("[FuzzySearchCustomerNumberFromNameAndAddress] No items found matching the filter");
        return false;
    }
    if (results.length > 1) {
        Log.Info("[FuzzySearchCustomerNumberFromNameAndAddress] Multiple items found matching the filter keep only first");
    }
    Log.Verbose("[FuzzySearchCustomerNumberFromNameAndAddress] Found customer number = " + results[0].GetValue_String(Lib.SOP.Tables.Customers.number, 0));
    Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "CustomerNumber__", results[0].GetValue_String(Lib.SOP.Tables.Customers.number, 0), Lib.SOP.Tables.Customers.tableName);
    CustomerOrderProcessing.Extraction.UserExit.OnCustomerChange();
    return true;
}
function SetOrderReceptionDateTime() {
    if (Data.GetValue("OrderReceptionDateTime__") == null) {
        if (Variable.GetValueAsString("EDIPreprocessing") === "1" && Variable.GetValueAsString("EDIType") === "IDOC") {
            Data.SetValue("OrderReceptionDateTime__", Data.GetValue("SubmitDateTime"));
        }
        else {
            Data.SetValue("OrderReceptionDateTime__", Sys.Helpers.Date.SafeISOStringToDate(Data.GetValue("OriginalSubmitDateTime")));
        }
        let overrideWithReceptionDate = Sys.OM.Helpers.GetConfiguration().PODateBehavior === "capture-podate-receptiondate";
        if (overrideWithReceptionDate) {
            let receptionDate = Data.GetValue("OrderReceptionDateTime__");
            let poDate = Sys.Helpers.Date.Date2DBDate(Helpers.Date.InDocumentTimezone(receptionDate));
            Log.Info("Override PODate with the reception date: " + Data.GetValue("Sales_Order_Date__") + " => " + poDate);
            Lib.SOP.Helpers.SetValueWithSourceFromConfig(Data, "Sales_Order_Date__", poDate);
        }
    }
}
/********************************************************************
EDI Specific Functions
 ********************************************************************/
function removeExtraSpace(str) {
    return str.replace(/ +/g, " ");
}
function GetObjectKeyIndex(obj, keyToFind) {
    let i = 0, key;
    for (key in obj) {
        if (key === keyToFind) {
            return i;
        }
        i++;
    }
    return null;
}
function CheckEDIAddress(whichAddress) {
    let EDIFieldName = null;
    let fieldsList = [];
    switch (whichAddress) {
        case "SoldTo":
            fieldsList = ["CustomerName__", "CustomerAddress_Street__", "CustomerAddress_PostalCode__", "CustomerAddress_City__", "CustomerAddress_Region__", "CustomerAddress_Country__"];
            EDIFieldName = "SoldToEDIAddress__";
            break;
        case "ShipTo":
            fieldsList = ["ShipToName__", "ShipToAddress_CompanyStreet__", "ShipToAddress_CompanyPostalCode__", "ShipToAddress_CompanyCity__", "ShipToAddress_CompanyRegion__", "ShipToAddress_CompanyCountry__"];
            EDIFieldName = "ShipToEDIAddress__";
            break;
        default:
            Log.Error("Unknown address name to check");
    }
    if (EDIFieldName && fieldsList.length > 1) {
        let fieldsFromEDIAddress = Data.GetValue(EDIFieldName);
        if (typeof fieldsFromEDIAddress === "string") {
            if (fieldsFromEDIAddress === "") {
                fieldsFromEDIAddress = "{}";
            }
            try {
                fieldsFromEDIAddress = JSON.parse(fieldsFromEDIAddress);
            }
            catch (e) {
                Log.Info("Error parsing address from EDI file");
            }
        }
        if (!fieldsFromEDIAddress) {
            fieldsFromEDIAddress = "{}";
        }
        let fieldsFromOriginalAddress = {
            name: Data.GetValue(fieldsList[0]),
            street: Data.GetValue(fieldsList[1]),
            zipcode: Data.GetValue(fieldsList[2]),
            city: Data.GetValue(fieldsList[3]),
            region: Data.GetValue(fieldsList[4]),
            country: Data.GetValue(fieldsList[5])
        };
        for (let key in fieldsFromOriginalAddress) {
            if (!fieldsFromOriginalAddress.hasOwnProperty(key)) {
                continue;
            }
            let propertyIsDefinedInDatabase = fieldsFromOriginalAddress[key];
            let propertyIsDefinedInEDIFile = fieldsFromEDIAddress.hasOwnProperty(key) && fieldsFromEDIAddress[key];
            let index = GetObjectKeyIndex(fieldsFromOriginalAddress, key);
            if (propertyIsDefinedInDatabase &&
                propertyIsDefinedInEDIFile &&
                removeExtraSpace(fieldsFromOriginalAddress[key].trim().toLowerCase()) !== removeExtraSpace(fieldsFromEDIAddress[key].trim().toLowerCase())) {
                Data.SetWarning(fieldsList[index], "Value from database ({0}) differs from the one in order ({1})", fieldsFromOriginalAddress[key], fieldsFromEDIAddress[key]);
            }
            if (!propertyIsDefinedInEDIFile) {
                Data.SetWarning(fieldsList[index], "Property not defined in EDI file");
            }
            if (!propertyIsDefinedInDatabase) {
                Data.SetWarning(fieldsList[index], "Property not defined in database");
            }
        }
    }
}
function checkEDIRow(row) {
    let tableUnit = row.GetValue("Unit__");
    let tableDescription = row.GetValue("Description__");
    let ediItemStr = row.GetValue("EDI_item__");
    let ediItem;
    if (typeof ediItemStr === "string") {
        if (ediItemStr === "") {
            ediItemStr = "{}";
        }
        try {
            ediItem = JSON.parse(ediItemStr);
        }
        catch (e) {
            Log.Info("Error parsing item info from EDI file");
        }
    }
    if (!ediItem) {
        ediItem = {};
    }
    if (ediItem.unit &&
        tableUnit &&
        ediItem.unit.trim() !== tableUnit.trim()) {
        row.SetWarning("Unit__", "Value from database ({0}) differs from the one in order ({1})", tableUnit, ediItem.unit);
    }
    if (!ediItem.unit) {
        row.SetWarning("Unit__", "Property not defined in EDI file");
    }
    if (!tableUnit) {
        row.SetWarning("Unit__", "Property not defined in database");
    }
    if (!ediItem.unit && !tableUnit) {
        row.SetWarning("Unit__", "");
    }
    if (ediItem.description &&
        tableDescription &&
        ediItem.description.trim().toLowerCase() !== tableDescription.trim().toLowerCase()) {
        row.SetWarning("Description__", "Value from database ({0}) differs from the one in order ({1})", tableDescription, ediItem.description);
    }
}
/********************************************************************
SAP Specific functions
 ********************************************************************/
function SetSAPCheckValues() {
    Data.SetAllowTableValuesOnly("CustomerName__", false);
    Data.SetAllowTableValuesOnly("CustomerNumber__", false);
    Data.SetAllowTableValuesOnly("ShipToName__", false);
    Data.SetAllowTableValuesOnly("ShipToNumber__", false);
    let table = Data.GetTable("Product_List__");
    if (table) {
        let nbLines = table.GetItemCount();
        for (let i = 0; i < nbLines; i++) {
            let item = table.GetItem(i);
            if (item) {
                item.SetRequired("Unit__", false);
                item.SetAllowTableValuesOnly("ItemNumber__", false);
            }
        }
    }
}
const EDIExtraction = {
    _arrayOrderInformations: null,
    _baseAreaItems: null,
    _baseAreaSoldTo: null,
    _baseAreaShipTo: null,
    _totalAreas: null,
    _totalGrossAreas: null,
    currencySetFromEDI: false,
    RunEDIExtraction: async function () {
        this._arrayOrderInformations = Document.SearchString("ORDER INFORMATION:", 0, true, false);
        this._baseAreaItems = Document.SearchString("ITEMS:", 0, true, false);
        this._baseAreaSoldTo = EDIExtraction.GetPartnerBoxArea("SOLD TO:");
        this._baseAreaShipTo = EDIExtraction.GetPartnerBoxArea("SHIP TO:");
        this._baseAreaAdditionalPartners = Document.SearchString("ADDITIONAL PARTNERS:", 0, true, false);
        this._totalAreas = Document.SearchString("TOTAL NET AMOUNT:", true, false);
        this._totalGrossAreas = Document.SearchString("TOTAL INCL.TAX:", true, false);
        if (EDIExtraction.ExtractOderInformationsFromEDIData()) {
            EDIExtraction.ExtractPartnersFromEDIData();
            if (Data.GetValue("CustomerVendor__")) {
                EDIExtraction.FillSoldtoFromCustomerVendor(Data.GetValue("CustomerVendor__"));
            }
            if (Data.GetValue("ShiptoVendor__")) {
                EDIExtraction.FillShiptoFromShiptoVendor(Data.GetValue("ShiptoVendor__"));
            }
            let isSAP = Lib.SOP.Helpers.IsERP("SAP");
            let isSAPS4Cloud = Lib.SOP.Helpers.IsERP("SAPS4Cloud");
            let isSAPAsync = Lib.SOP.Helpers.IsERP("Asynchronous SAP Integration");
            if (isSAP || isSAPS4Cloud || isSAPAsync) {
                EDIExtraction.ExtractSalesAreaFromEDIData();
                if (isSAP && !Data.GetValue("Sales_Area__")) {
                    EDIExtraction.FillSalesAreaFromEDSDCTable();
                }
            }
            let customerNumber = Data.GetValue("CustomerNumber__");
            if (Data.GetValue("CustomerVendor__") && (!customerNumber || !Data.IsComputed("CustomerNumber__"))) {
                Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "CustomerNumber__", Data.GetValue("CustomerVendor__"), "");
                CustomerOrderProcessing.Extraction.UserExit.OnCustomerChange();
            }
            let partnerNumber = Data.GetValue("ShipToNumber__");
            if (Data.GetValue("ShiptoVendor__") && (!partnerNumber || !Data.IsComputed("ShipToNumber__"))) {
                Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "ShipToNumber__", Data.GetValue("ShiptoVendor__"), "");
                CustomerOrderProcessing.Extraction.UserExit.OnShipToChange();
            }
            customerNumber = Data.GetValue("CustomerNumber__");
            partnerNumber = Data.GetValue("ShipToNumber__");
            if (customerNumber) {
                ShipToAndSoldToSearchService.QuerySoldToAddressByCustomerNumber(customerNumber);
            }
            if (partnerNumber) {
                let partnerInfo = { Number: partnerNumber };
                if (customerNumber) {
                    partnerInfo.CustomerNumber = customerNumber;
                }
                ShipToAndSoldToSearchService.FindShipToAddressInPartners(partnerInfo);
            }
            ShipToAndSoldToSearchService.FillDataForShipToAddress();
            ShipToAndSoldToSearchService.FillDataForSoldToAddress();
            await EDIExtraction.ExtractLineItemsFromEDIData();
            EDIExtraction.CheckShiptoAndSoldtoExistenceInTables();
            return "edi_extraction";
        }
        return null;
    },
    TryEDIExtraction: async function () {
        let returnStatus = null;
        if (Variable.GetValueAsString("EDIPreprocessing") === "1") {
            await this.RunEDIExtraction();
            return "edi_extraction";
        }
        let extensionsArray = [];
        if (Sys.OM.Helpers.GetConfiguration().PossibleEDIExtensions) {
            let extensions = Sys.OM.Helpers.GetConfiguration().PossibleEDIExtensions.toLowerCase();
            extensions = extensions.replace(/ /g, "");
            extensionsArray = extensions.split(";");
        }
        let nbAttach = Attach.GetNbAttach();
        let index;
        for (index = 0; index < nbAttach; index++) {
            let ext = Attach.GetExtension(index).toLowerCase();
            if (extensionsArray.indexOf(ext) >= 0) {
                let doc = Attach.GetInputFile(index);
                let docContent = Attach.GetContent(index);
                let processor = Sys.EDIProcessing.getEDIProcessor(docContent, null, true, doc);
                if (processor) {
                    let ediDoc = processor.getNextDocument();
                    let jsonParsedDocument = processor.parseDocument(ediDoc, doc);
                    let mappingOptions = {
                        EDIculture: Sys.OM.Helpers.GetConfiguration().EdiCulture
                    };
                    let jsonMappedDocument = processor.mapDocument(jsonParsedDocument, mappingOptions);
                    Variable.SetValueAsString("EDIJsonMappedDocument", JSON.stringify(jsonMappedDocument));
                    this.RunEDIExtraction();
                    returnStatus = "edi_extraction";
                }
            }
        }
        return returnStatus;
    },
    ExtractOderInformationsFromEDIData: function () {
        Log.Info("[ExtractOderInformationsFromEDIData] Start order data extraction from EDI Data");
        let jsonMappedDocument = JSON.parse(Variable.GetValueAsString("EDIJsonMappedDocument"));
        if (jsonMappedDocument) {
            const configuration = Sys.OM.Helpers.GetConfiguration();
            let shouldSetCurrency = configuration.DisplayCurrency === "1" || configuration.EnableCatalogPrices === "1";
            let x, y, w, h, page = 0;
            if (this._arrayOrderInformations && this._arrayOrderInformations.length > 0) {
                x = this._arrayOrderInformations[0].x;
                y = this._arrayOrderInformations[0].y;
                w = Document.GetPageWidth(this._arrayOrderInformations[0].page);
                h = Document.GetPageHeight(this._arrayOrderInformations[0].page);
                page = this._arrayOrderInformations[0].page;
            }
            if (jsonMappedDocument.customerPurchaseOrder && jsonMappedDocument.customerPurchaseOrder.value) {
                let json = jsonMappedDocument.customerPurchaseOrder.value;
                let orderNumber = json.documentNumber ? json.documentNumber.value : "";
                let poDate = json.date ? json.date.value : "";
                let tenderNumber = json.tenderNumber ? json.tenderNumber.value : "";
                if (orderNumber) {
                    this.SetStringFieldFromEDI("Sales_Order_Number__", orderNumber, x, y, w, h, page, "Purchase Order Number:");
                }
                if (poDate) {
                    this.SetDateFieldFromEDI("Sales_Order_Date__", poDate, x, y, w, h, page, "Purchase Order Date:");
                }
                if (tenderNumber) {
                    this.SetStringFieldFromEDI("Tender_Number__", tenderNumber, x, y, w, h, page, "Tender Number:");
                }
            }
            if (Sys.OM.Helpers.GetConfiguration().DisplayRequestedDeliveryDate !== "0" && jsonMappedDocument.dueDate && jsonMappedDocument.dueDate.value) {
                let json = jsonMappedDocument.dueDate.value;
                let dueDate = json.date ? json.date.value : "";
                if (dueDate) {
                    this.SetDateFieldFromEDI("Due_Date__", dueDate, x, y, w, h, page, "Due date:");
                }
            }
            if (jsonMappedDocument.poDate && jsonMappedDocument.poDate.value) {
                let json = jsonMappedDocument.poDate.value;
                let poDate = json.date ? json.date.value : "";
                if (poDate) {
                    this.SetDateFieldFromEDI("Sales_Order_Date__", poDate, x, y, w, h, page, "Purchase Order Date:");
                }
            }
            if (jsonMappedDocument.total && jsonMappedDocument.total.value) {
                let json = jsonMappedDocument.total.value;
                let total = json.totalValueOfSumSegment ? json.totalValueOfSumSegment.value : "";
                let currency = json.currency ? json.currency.value : "";
                if (total || currency) {
                    x = 0;
                    y = 0;
                    w = 0;
                    h = 0;
                    page = 0;
                    if (this._totalAreas && this._totalAreas.length > 0) {
                        x = this._totalAreas[0].x;
                        y = this._totalAreas[0].y;
                        page = this._totalAreas[0].page;
                        w = Document.GetPageWidth(page);
                        h = Document.GetPageHeight(page);
                    }
                    if (total) {
                        this.SetStringFieldFromEDI("Total__", total, x, y, w, h, page);
                    }
                    if (currency && shouldSetCurrency) {
                        Data.SetValue("Currency__", "");
                        this.SetStringFieldFromEDI("Currency__", currency, x, y, w, h, page);
                        this.currencySetFromEDI = true;
                    }
                }
            }
            else if (jsonMappedDocument.totalGross && jsonMappedDocument.totalGross.value) {
                let json = jsonMappedDocument.totalGross.value;
                let total = json.totalValueOfSumSegment ? json.totalValueOfSumSegment.value : "";
                let currency = json.currency ? json.currency.value : "";
                if (total || currency) {
                    x = 0;
                    y = 0;
                    w = 0;
                    h = 0;
                    page = 0;
                    if (this._totalGrossAreas && this._totalGrossAreas.length > 0) {
                        x = this._totalGrossAreas[0].x;
                        y = this._totalGrossAreas[0].y;
                        page = this._totalGrossAreas[0].page;
                        w = Document.GetPageWidth(page);
                        h = Document.GetPageHeight(page);
                    }
                    if (total) {
                        this.SetStringFieldFromEDI("Total__", total, x, y, w, h, page);
                    }
                    if (currency && shouldSetCurrency) {
                        Data.SetValue("Currency__", "");
                        this.SetStringFieldFromEDI("Currency__", currency, x, y, w, h, page);
                        this.currencySetFromEDI = true;
                    }
                }
            }
            return true;
        }
        return false;
    },
    MergeData: function (data) {
        let str = "";
        if (data) {
            let bAddSpace = false;
            for (let i = 0; i < data.length; i++) {
                if (data[i] && data[i].value) {
                    if (bAddSpace) {
                        str += " ";
                    }
                    str += data[i].value;
                    bAddSpace = true;
                }
            }
        }
        return str;
    },
    ExtractPartnersFromEDIData: function () {
        Log.Info("[ExtractPartnersFromEDIData] Start partners extraction from EDI Data");
        let jsonMappedDocumentStr = Variable.GetValueAsString("EDIJsonMappedDocument");
        if (jsonMappedDocumentStr) {
            let jsonMappedDocument = JSON.parse(jsonMappedDocumentStr);
            if (jsonMappedDocument.soldTo) {
                let json = jsonMappedDocument.soldTo.value;
                if (!json) {
                    Log.Info("No soldTo supplied from EDIJsonMappedDocument. No soldTo extraction");
                    if (jsonMappedDocument.billTo.value) {
                        Log.Info("BillTo found in EDIJsonMappedDocument. Setting billTo as soldTo");
                        json = jsonMappedDocument.billTo.value;
                    }
                }
                if (json) {
                    let x, y, w, h, page = 0;
                    if (this._baseAreaSoldTo) {
                        x = this._baseAreaSoldTo.x;
                        y = this._baseAreaSoldTo.y;
                        w = Document.GetPageWidth(this._baseAreaSoldTo.page);
                        h = (this._baseAreaShipTo ? this._baseAreaShipTo.y : w) - this._baseAreaSoldTo.y;
                        page = this._baseAreaSoldTo.page;
                    }
                    let partnerNumber = json.partnerNumber ? json.partnerNumber.value : "";
                    if (!partnerNumber) {
                        partnerNumber = json.vendorNumberAtCustomerLocation ? json.vendorNumberAtCustomerLocation.value : "";
                    }
                    this.SetStringFieldFromEDI("CustomerVendor__", partnerNumber, x, y, w, h, page);
                }
            }
            if (jsonMappedDocument.shipTo) {
                let json = jsonMappedDocument.shipTo.value;
                if (!json) {
                    Log.Info("No shipTo supplied from EDIJsonMappedDocument. No shipTo extraction");
                }
                if (json) {
                    let x, y, w, h, page = 0;
                    if (this._baseAreaShipTo) {
                        x = this._baseAreaShipTo.x;
                        y = this._baseAreaShipTo.y;
                        w = Document.GetPageWidth(this._baseAreaShipTo.page);
                        if (this._baseAreaAdditionalPartners.length > 0) {
                            h = this._baseAreaAdditionalPartners[0].y - y;
                        }
                        else if (this._baseAreaItems.length > 0) {
                            h = this._baseAreaItems[0].y - y;
                        }
                        else {
                            h = Document.GetPageHeight(this._baseAreaShipTo.page);
                        }
                        page = this._baseAreaShipTo.page;
                    }
                    let partnerNumber = json.partnerNumber ? json.partnerNumber.value : "";
                    if (!partnerNumber) {
                        partnerNumber = json.vendorNumberAtCustomerLocation ? json.vendorNumberAtCustomerLocation.value : "";
                    }
                    this.SetStringFieldFromEDI("ShiptoVendor__", partnerNumber, x, y, w, h, page);
                }
            }
        }
    },
    ExtractSalesAreaFromEDIData: function () {
        Log.Info("[ExtractSalesAreaFromEDIData] Start sales area extraction from EDI data");
        let jsonMappedDocument = JSON.parse(Variable.GetValueAsString("EDIJsonMappedDocument"));
        let salesArea = "";
        let salesOrganization = "";
        let distributionChannel = "";
        let businessArea = "";
        if (jsonMappedDocument && jsonMappedDocument.distChannel && jsonMappedDocument.distChannel.value && jsonMappedDocument.distChannel.value.organization) {
            distributionChannel = jsonMappedDocument.distChannel.value.organization.value;
        }
        if (jsonMappedDocument && jsonMappedDocument.division && jsonMappedDocument.division.value && jsonMappedDocument.division.value.organization) {
            businessArea = jsonMappedDocument.division.value.organization.value;
        }
        if (jsonMappedDocument && jsonMappedDocument.salesOrg && jsonMappedDocument.salesOrg.value && jsonMappedDocument.salesOrg.value.organization) {
            salesOrganization = jsonMappedDocument.salesOrg.value.organization.value;
        }
        salesArea = salesOrganization + "/" + distributionChannel + "/" + businessArea;
        if (salesOrganization && distributionChannel && businessArea) {
            let x, y, w, h, page = 0;
            if (this._arrayOrderInformations && this._arrayOrderInformations.length > 0 && this._baseAreaItems && this._baseAreaItems[0]) {
                x = this._arrayOrderInformations[0].x;
                y = this._arrayOrderInformations[0].y;
                w = Document.GetPageWidth(this._arrayOrderInformations[0].page);
                h = this._baseAreaItems[0].y - y;
                page = this._arrayOrderInformations[0].page;
            }
            Data.SetValue("Sales_organization__", "");
            Data.SetValue("Distribution_channel__", "");
            Data.SetValue("Business_area__", "");
            Data.SetValue("Sales_Area__", "");
            this.SetStringFieldFromEDI("Sales_organization__", salesOrganization, x, y, w, h, page, "Sales organization:");
            this.SetStringFieldFromEDI("Distribution_channel__", distributionChannel, x, y, w, h, page, "Distribution channel:");
            this.SetStringFieldFromEDI("Business_area__", businessArea, x, y, w, h, page, "Division:");
            this.SetStringFieldFromEDI("Sales_Area__", salesArea, x, y, w, h, page);
        }
    },
    ExtractLineItemsFromEDIData: async function () {
        Log.Info("[ExtractLineItemsFromEDIData] Start lines extraction from EDI data");
        let oJSONMappedDocument = JSON.parse(Variable.GetValueAsString("EDIJsonMappedDocument"));
        if (oJSONMappedDocument && oJSONMappedDocument.lineItems && oJSONMappedDocument.lineItems.value) {
            let oTable = Data.GetTable("Product_List__");
            let nPageWidth = 0;
            let nPageHeight = 0;
            let nItemLineNumberX, nItemPartNumberX, nItemQuantityX, nItemUnitX, nItemUnitPriceX, nItemTotalX = 0;
            let nItemLineNumberW, nItemPartNumberW, nItemQuantityW, nItemUnitW, nItemUnitPriceW, nItemTotalW = 0;
            if (this._baseAreaItems && this._baseAreaItems.length) {
                nPageWidth = Document.GetPageWidth(this._baseAreaItems[0].page);
                nPageHeight = Document.GetPageHeight(this._baseAreaItems[0].page);
                let oItemLineNumberArea = Document.SearchString("Line number", this._baseAreaItems[0].page, this._baseAreaItems[0].x, this._baseAreaItems[0].y, nPageWidth, nPageHeight, true, false);
                let oItemPartNumberArea = Document.SearchString("Part number", this._baseAreaItems[0].page, this._baseAreaItems[0].x, this._baseAreaItems[0].y, nPageWidth, nPageHeight, true, false);
                let oItemQuantityArea = Document.SearchString("Quantity", this._baseAreaItems[0].page, this._baseAreaItems[0].x, this._baseAreaItems[0].y, nPageWidth, nPageHeight, true, false);
                let oItemUnitArea = Document.SearchString("Unit", this._baseAreaItems[0].page, this._baseAreaItems[0].x, this._baseAreaItems[0].y, nPageWidth, nPageHeight, true, false);
                let oItemUnitPriceArea = Document.SearchString("Unit price", this._baseAreaItems[0].page, this._baseAreaItems[0].x, this._baseAreaItems[0].y, nPageWidth, nPageHeight, true, false);
                let oItemTotalArea = Document.SearchString("Total", this._baseAreaItems[0].page, this._baseAreaItems[0].x, this._baseAreaItems[0].y, nPageWidth, nPageHeight, true, false);
                if (oItemLineNumberArea && oItemLineNumberArea.length &&
                    oItemPartNumberArea && oItemPartNumberArea.length &&
                    oItemQuantityArea && oItemQuantityArea.length &&
                    oItemUnitArea && oItemUnitArea.length &&
                    oItemUnitPriceArea && oItemUnitPriceArea.length &&
                    oItemTotalArea && oItemTotalArea.length) {
                    nItemLineNumberX = oItemLineNumberArea[0].x;
                    nItemPartNumberX = oItemPartNumberArea[0].x;
                    nItemQuantityX = oItemQuantityArea[0].x;
                    nItemUnitX = oItemUnitArea[0].x;
                    nItemUnitPriceX = oItemUnitPriceArea[0].x;
                    nItemTotalX = oItemTotalArea[0].x;
                    nItemLineNumberW = nItemPartNumberX - nItemLineNumberX;
                    nItemPartNumberW = nItemQuantityX - nItemPartNumberX;
                    nItemQuantityW = nItemUnitX - nItemQuantityX;
                    nItemUnitW = nItemUnitPriceX - nItemUnitX;
                    nItemUnitPriceW = nItemTotalX - nItemUnitPriceX;
                    nItemTotalW = nPageWidth - nItemTotalX;
                }
            }
            let updatedLineItems = [];
            for (let i = 0; i < oJSONMappedDocument.lineItems.value.length; i++) {
                let oLineItem = oJSONMappedDocument.lineItems.value[i];
                if (oLineItem) {
                    let sMaterialID = null;
                    let sExtractedMaterial = null;
                    if (oLineItem.itemNumberSegment && oLineItem.itemNumberSegment.value && oLineItem.itemNumberSegment.value.materialId) {
                        sMaterialID = oLineItem.itemNumberSegment.value.materialId.value;
                        sExtractedMaterial = sMaterialID;
                    }
                    else if (oLineItem.customerMaterialId && oLineItem.customerMaterialId.value && oLineItem.customerMaterialId.value.materialId) {
                        sMaterialID = oLineItem.customerMaterialId.value.materialId.value;
                        sExtractedMaterial = sMaterialID;
                    }
                    //For NSO
                    if (oLineItem.itemNumberSegment && oLineItem.itemNumberSegment.value && oLineItem.itemNumberSegment.value.nationalCode) {
                        let sNationalCode = oLineItem.itemNumberSegment.value.nationalCode.value;
                        if (sNationalCode && sNationalCode.trim().length > 0) {
                            sMaterialID = sNationalCode;
                            sExtractedMaterial = sMaterialID;
                            Query.Reset();
                            Query.SetSpecificTable("SO - Materials__");
                            Query.SetAttributesList("Material_ID_in_ERP__");
                            Query.SetFilter(Sys.Helpers.LdapUtil.FilterEqual("National_Code__", sNationalCode).toString());
                            if (Query.MoveFirst()) {
                                let oEntry = Query.MoveNextRecord();
                                if (oEntry != null) {
                                    let oRecord = oEntry.GetVars();
                                    let sMaterialIDFromNationalCode = oRecord.GetValue_String("Material_ID_in_ERP__", 0);
                                    sMaterialID = sMaterialIDFromNationalCode;
                                }
                            }
                        }
                    }
                    // for NSO material number is sometimes not provided but we still want to extract the data we have to the product list
                    if (sMaterialID || (Data.GetValue("EDI_Format__") === "NSO" && oLineItem.itemDescription)) {
                        let oItem = null;
                        if (oTable.GetItem(i)) {
                            oItem = oTable.GetItem(i);
                        }
                        else {
                            oItem = oTable.AddItem();
                        }
                        let nX, nY, nW, nH, nPage = 0;
                        let oArea = Document.SearchString(sMaterialID, true, false);
                        if (oArea && oArea.length > 0 && typeof oItem.SetArea === "function") {
                            let oLineArea = Document.GetArea(oArea[0].page, 0, oArea[0].y, Document.GetPageWidth(oArea[0].page), oArea[0].height);
                            oItem.SetArea(oLineArea);
                            nX = oLineArea.x;
                            nY = oLineArea.y;
                            nW = oLineArea.width;
                            nH = oLineArea.height;
                            nPage = oLineArea.page;
                        }
                        this.SetLineitemFieldFromEDI(oItem, "LineNumber__", oLineItem.itemNumber ? oLineItem.itemNumber.value : "", nItemLineNumberX, nY, nItemLineNumberW, nH, nPage);
                        this.SetLineitemFieldFromEDI(oItem, "CustomerMaterialId__", sExtractedMaterial, nItemPartNumberX, nY, nItemPartNumberW, nH, nPage);
                        if (Lib.SOP.QuantityConversion.IsQuantityConversionEnabled()) {
                            this.SetLineitemFieldFromEDI(oItem, "ExtractedQuantity__", oLineItem.quantity ? oLineItem.quantity.value : "", nItemQuantityX, nY, nItemQuantityW, nH, nPage);
                            this.SetLineitemFieldFromEDI(oItem, "CustomerUnit__", oLineItem.unitOfMeasure ? oLineItem.unitOfMeasure.value : "", nItemUnitX, nY, nItemUnitW, nH, nPage);
                        }
                        else {
                            this.SetLineitemFieldFromEDI(oItem, "Quantity__", oLineItem.quantity ? oLineItem.quantity.value : "", nItemQuantityX, nY, nItemQuantityW, nH, nPage);
                            this.SetLineitemFieldFromEDI(oItem, "Unit__", oLineItem.unitOfMeasure ? oLineItem.unitOfMeasure.value : "", nItemUnitX, nY, nItemUnitW, nH, nPage);
                        }
                        this.SetLineitemFieldFromEDI(oItem, "Total__", oLineItem.itemValue ? oLineItem.itemValue.value : "", nItemTotalX, nY, nItemTotalW, nH, nPage);
                        if (Sys.OM.Helpers.GetConfiguration().DisplayUnitPrice === "1") {
                            this.SetLineitemFieldFromEDI(oItem, "Unit_Price__", oLineItem.price ? oLineItem.price.value : "", nItemUnitPriceX, nY, nItemUnitPriceW, nH, nPage);
                        }
                        this.SetLineitemDateFieldFromEDI(oItem, "Requested_Date__", oLineItem.date ? oLineItem.date.value : "", nX, nY, nW, nH, nPage);
                        this.SetLineitemFieldFromEDI(oItem, "TenderNumber__", oLineItem.tenderNumber ? oLineItem.tenderNumber.value : "", nX, nY, nW, nH, nPage);
                        await CompleteLineItem(oTable, oItem);
                        updatedLineItems.push(oItem);
                    }
                }
            }
            Lib.SOP.SAP.Helpers.Material.GetAndFillDescriptions(updatedLineItems);
            SetRunningTotal();
        }
    },
    FillSalesAreaFromEDSDCTable: function () {
        let vendorNumber = Data.GetValue("CustomerVendor__");
        Log.Info("[FillSalesAreaFromEDSDCTable] with vendorNumber = '" + vendorNumber + "'");
        if (vendorNumber !== "") {
            let filter = "LIFNR = '" + vendorNumber + "'";
            let tableName = "EDSDC";
            let results = Sys.OM.SAP.Query(tableName, "VKORG|VTWEG|SPART|AUART", filter, 1);
            if (results.length > 0) {
                let vkorg = results[0].VKORG;
                let vtweg = results[0].VTWEG;
                let spart = results[0].SPART;
                let docType = results[0].AUART;
                Log.Info("Sales area " + vkorg + " " + vtweg + " " + spart + " and doctype '" + docType + "' found by EDPAR table");
                if (vkorg && vtweg && spart) {
                    this.TrySetValue("Sales_Area__", vkorg + "/" + vtweg + "/" + spart, tableName);
                    this.TrySetValue("Sales_organization__", vkorg, tableName);
                    this.TrySetValue("Distribution_channel__", vtweg, tableName);
                    this.TrySetValue("Business_area__", spart, tableName);
                }
                if (docType) {
                    this.TrySetValue("DocumentType__", docType, tableName);
                }
            }
            else {
                Log.Info("Query in SAP returned no result");
            }
        }
        else {
            Log.Info("[FillSalesAreaFromEDSDCTable] no vendor number, abort Sales Area determination");
        }
    },
    FillSoldtoFromCustomerVendor: function (customerVendorValue) {
        Log.Info("[FillSoldtoFromCustomerVendor]");
        EDIExtraction.FillSoldtoFromMappingTable(customerVendorValue);
        if (Lib.SOP.Helpers.IsERP("SAP") && !Data.GetValue("CustomerNumber__")) {
            EDIExtraction.FillSoldtoFromEDPARTable();
        }
    },
    FillSoldtoFromMappingTable: function (customerVendorValue) {
        Log.Info("[FillSoldtoFromMappingTable]");
        let filter = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual("ExternalPartnerIdentifier__", customerVendorValue), Sys.Helpers.LdapUtil.FilterEqual("PartnerFunction__", "SoldTo"));
        let tableName = "SO - External partner identifier mapping__";
        let results = Lib.SOP.Helpers.QueryDB(tableName, filter, "PartnerNumber__", 2);
        if (results.length === 1) {
            let customerNumber = results[0].GetValue_String("PartnerNumber__", 0);
            Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "CustomerNumber__", customerNumber, tableName, true);
            CustomerOrderProcessing.Extraction.UserExit.OnCustomerChange();
        }
    },
    FillSoldtoFromEDPARTable: function () {
        Log.Info("[FillSoldtoFromEDPARTable]");
        let vendorNumber = Data.GetValue("CustomerVendor__");
        let filter = "EXPNR = '" + vendorNumber + "' AND PARVW = 'AG'";
        let tableName = "EDPAR";
        let results = Sys.OM.SAP.Query(tableName, "INPNR", filter, 1);
        if (results.length > 0) {
            let num = Lib.SOP.SAP.Helpers.FormatID(results[0].INPNR);
            this.TrySetValue("CustomerNumber__", num, tableName);
            Log.Info("CustomerNumber found by EDPAR table");
            CustomerOrderProcessing.Extraction.UserExit.OnCustomerChange();
        }
        else {
            Log.Info("Query in SAP returned no result");
        }
    },
    FillShiptoFromShiptoVendor: function (shipToVendorValue) {
        Log.Info("[FillShiptoFromShiptoVendor]");
        EDIExtraction.FillShiptoFromMappingTable(shipToVendorValue);
        if (Lib.SOP.Helpers.IsERP("SAP") && !Data.GetValue("ShipToNumber__")) {
            EDIExtraction.FillShiptoFromEDPARTable();
        }
    },
    FillShiptoFromMappingTable: function (shipToVendorValue) {
        Log.Info("[FillShiptoFromMappingTable]");
        let filter = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual("ExternalPartnerIdentifier__", shipToVendorValue), Sys.Helpers.LdapUtil.FilterEqual("PartnerFunction__", "ShipTo"));
        let tableName = "SO - External partner identifier mapping__";
        let results = Lib.SOP.Helpers.QueryDB(tableName, filter, "PartnerNumber__", 2);
        if (results.length === 1) {
            let customerNumber = results[0].GetValue_String("PartnerNumber__", 0);
            Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "ShipToNumber__", customerNumber, tableName, true);
            CustomerOrderProcessing.Extraction.UserExit.OnShipToChange();
        }
    },
    FillShiptoFromEDPARTable: function () {
        Log.Info("[FillShiptoFromEDPARTable]");
        let vendorNumber = Data.GetValue("ShiptoVendor__");
        let filter = "EXPNR = '" + vendorNumber + "' AND PARVW = 'WE'";
        let rowCount = 1;
        let customerNumber = Data.GetValue("CustomerNumber__");
        if (!customerNumber) {
            rowCount = 2;
        }
        else {
            filter += " AND KUNNR = '" + customerNumber + "'";
        }
        let tableName = "EDPAR";
        let results = Sys.OM.SAP.Query(tableName, "INPNR", filter, rowCount);
        if (results.length === 1) {
            let num = Lib.SOP.SAP.Helpers.FormatID(results[0].INPNR);
            if (this.TrySetValue("ShipToNumber__", num, tableName)) {
                Log.Info("ShiptoNumber found by EDPAR table");
                CustomerOrderProcessing.Extraction.UserExit.OnShipToChange();
            }
        }
        else if (rowCount === 2) {
            Log.Info("Query in SAP returned more than one row");
        }
        else {
            Log.Info("Query in SAP returned no result");
        }
    },
    GetPartnerBoxArea: function (keywordPartnerBox) {
        let arrayPartnerBox = Document.SearchString(keywordPartnerBox, 0, true, false);
        let areaPartnerBox = null;
        if (arrayPartnerBox && arrayPartnerBox.length !== 0) {
            for (let i = 0; i < arrayPartnerBox.length; i++) {
                if (!areaPartnerBox || arrayPartnerBox[i].y < areaPartnerBox.y) {
                    areaPartnerBox = arrayPartnerBox[i];
                }
            }
        }
        if (!areaPartnerBox) {
            Log.Info("GetPartnerBoxArea: No " + keywordPartnerBox + " Area found");
        }
        return areaPartnerBox;
    },
    GetNumberArea: function (keywordNumber, areaPartnerBox, yTolerance) {
        function IsNumberBelowPartnerBox(aeraNumber, areaPartnerBox, yTolerance) {
            return aeraNumber.y > areaPartnerBox.y && (aeraNumber.y - areaPartnerBox.y) < yTolerance;
        }
        function IsFirstAreaCloserThanSecondToPartnerBox(areaFirst, areaSecond, areaPartnerBox) {
            let distFirst = (areaFirst.x - areaPartnerBox.x) * (areaFirst.x - areaPartnerBox.x) + (areaFirst.y - areaPartnerBox.y) * (areaFirst.y - areaPartnerBox.y);
            let distSecond = (areaSecond.x - areaPartnerBox.x) * (areaSecond.x - areaPartnerBox.x) + (areaSecond.y - areaPartnerBox.y) * (areaSecond.y - areaPartnerBox.y);
            return distFirst < distSecond;
        }
        let arrayNumber = Document.SearchString(keywordNumber, 0, true, false);
        let areaNumber;
        if (arrayNumber && arrayNumber.length !== 0) {
            for (let i = 0; i < arrayNumber.length; i++) {
                if (IsNumberBelowPartnerBox(arrayNumber[i], areaPartnerBox, yTolerance)
                    && (!areaNumber || IsFirstAreaCloserThanSecondToPartnerBox(arrayNumber[i], areaNumber, areaPartnerBox))) {
                    areaNumber = arrayNumber[i];
                }
            }
        }
        if (!areaNumber) {
            Log.Info("GetNumberArea: No Number Area found");
        }
        return areaNumber;
    },
    GetPartnerNumberArea: function (keywordPartnerBox) {
        let page = 0;
        let result = null;
        let keywordNumber = "Number:";
        // Search 4cm to the right of "Number:"
        let XMaxDist = 4 / 2.54 * Document.GetPageResolutionX(page);
        let VertTol = 2;
        let areaPartnerBox = EDIExtraction.GetPartnerBoxArea(keywordPartnerBox);
        if (areaPartnerBox) {
            let areaNumber = EDIExtraction.GetNumberArea(keywordNumber, areaPartnerBox, 200);
            if (areaNumber) {
                result = Document.GetArea(page, areaNumber.x + areaNumber.width, areaNumber.y - VertTol, XMaxDist, areaNumber.height + 2 * VertTol);
            }
        }
        return result;
    },
    GetVendorNumberArea: function (keywordPartnerBox) {
        let page = 0;
        let result = null;
        let keywordNumber = "Vendor number:";
        // Search 4cm to the right of "Number:"
        let XMaxDist = 4 / 2.54 * Document.GetPageResolutionX(page);
        let VertTol = 2;
        let areaPartnerBox = EDIExtraction.GetPartnerBoxArea(keywordPartnerBox);
        if (areaPartnerBox) {
            let areaNumber = EDIExtraction.GetNumberArea(keywordNumber, areaPartnerBox, 200);
            if (areaNumber) {
                result = Document.GetArea(page, areaNumber.x + areaNumber.width, areaNumber.y - VertTol, XMaxDist, areaNumber.height + 2 * VertTol);
            }
        }
        return result;
    },
    CheckShiptoAndSoldtoExistenceInTables: function () {
        if (Lib.SOP.Helpers.IsERP("SAP")) {
            if (Data.GetValue("CustomerNumber__")) {
                let cn = Sys.Helpers.String.SAP.NormalizeID(Data.GetValue("CustomerNumber__"), 10, false, true);
                let filter = "KUNNR = '" + cn + "'";
                let results = Sys.OM.SAP.Query("KNA1", "KUNNR", filter, 1);
                if (!results || results.length === 0) {
                    Data.SetError("CustomerNumber__", "The value does not exist");
                }
                if (Data.GetValue("ShipToNumber__")) {
                    let sn = Sys.Helpers.String.SAP.NormalizeID(Data.GetValue("ShipToNumber__"), 10, false, true);
                    filter = "KUNNR = '" + cn + "' AND KUNN2 = '" + sn + "'";
                    results = Sys.OM.SAP.Query("KNVP", "KUNN2", filter, 1);
                    if (!results || results.length === 0) {
                        Data.SetError("ShipToNumber__", "The value does not exist");
                    }
                }
            }
        }
        else {
            let customerNumber = Data.GetValue("CustomerNumber__");
            let filterSoldTo = Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.Customers.number, customerNumber).toString();
            checkExistence(Lib.SOP.Tables.Customers.tableName, filterSoldTo, "*", "CustomerNumber__", customerNumber);
            if (Lib.SOP.Helpers.IsERP("Oracle EBS")) {
                customerNumber = g_erpOrderDocument.getCustomerNumberWithoutLocation(customerNumber);
            }
            let shipToNumber = Data.GetValue("ShipToNumber__");
            let filterShipTo = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.Partners.customerNumber, customerNumber), Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.Partners.number, shipToNumber)).toString();
            Log.Info("Check shipTo existence filter: " + filterShipTo);
            checkExistence(Lib.SOP.Tables.Partners.tableName, filterShipTo, "*", "ShipToNumber__", shipToNumber);
        }
        function checkExistence(tableName, filter, attributeList, fieldName, fieldValue) {
            if (fieldValue) {
                Query.Reset();
                Query.SetSpecificTable(tableName);
                Query.SetFilter(Lib.SOP.DataFilteringKey.ExtendFilterWithDataFilteringKey(tableName, filter).toString());
                Query.SetAttributesList(attributeList);
                if (!Query.MoveFirst() || !Query.MoveNext()) {
                    Data.SetError(fieldName, "The value does not exist");
                }
            }
        }
    },
    SetDateFieldFromEDI: function (dateField, dateStr, x, y, w, h, page, nearStr) {
        if (dateStr && dateStr.length > 0) {
            let dateSearchStr = this.formatDateSearchStringFromCulture(dateStr);
            let date = new Date(dateStr);
            let area = null;
            if (nearStr && nearStr.length > 0) {
                let nearArea = Document.SearchString(nearStr, page, x, y, w, h, true, false);
                if (nearArea && nearArea.length > 0) {
                    x = nearArea[0].x;
                    y = nearArea[0].y;
                    w = nearArea[0].width * 3;
                    h = nearArea[0].height * 3;
                    area = Document.SearchString(dateSearchStr, page, x, y, w, h, true, false);
                }
            }
            if (!area || area.length === 0) {
                area = Document.SearchString(dateStr, page, x, y, w, h, true, false);
            }
            if (area && area.length > 0) {
                //get the last reference, trust me.
                this.TrySetValueWithArea(dateField, area[area.length - 1], date);
                Data.SetComputedValueSource(dateField, "Extracted from EDI file");
            }
            else {
                this.TrySetValue(dateField, date);
                Data.SetComputedValueSource(dateField, "Extracted from EDI file");
            }
        }
    },
    formatDateSearchStringFromCulture: function (extractedDateStrFromJson) {
        let culture = Sys.OM.Helpers.GetConfiguration().EdiCulture;
        if (!culture) {
            return extractedDateStrFromJson;
        }
        try {
            let date = new Date(extractedDateStrFromJson);
            return Sys.Helpers.Date.ToLocaleDateEx(date, culture);
        }
        catch (error) {
            let date = Sys.Helpers.Date.ISOSTringToDateEx(extractedDateStrFromJson) || Sys.Helpers.Date.ShortDateStringToDate(extractedDateStrFromJson);
            if (!date) {
                return extractedDateStrFromJson;
            }
            return Sys.Helpers.Date.ToLocaleDateEx(date, culture);
        }
    },
    SetLineitemFieldFromEDI: function (item, dataField, str, x, y, w, h, page) {
        if (item && str && item.IsNullOrEmpty(dataField)) {
            str = "" + str; //force string
            let area = Document.SearchString(str, page, x, y, w, h, true, false);
            if (area && area.length > 0) {
                //get the last reference, trust me.
                item.SetValue(dataField, area[area.length - 1], str);
                item.SetComputedValueSource(dataField, "Extracted from EDI file");
            }
            else {
                item.SetValue(dataField, str);
                item.SetComputedValueSource(dataField, "Extracted from EDI file");
            }
        }
    },
    SetLineitemDateFieldFromEDI: function (item, dataField, str, x, y, w, h, page) {
        //for the moment the date value is always in us culture
        //convert it to the document culture
        if (item && str && item.IsNullOrEmpty(dataField)) {
            let date = new Date(str);
            let area = Document.SearchString(str, page, x, y, w, h, true, false);
            if (area && area.length > 0) {
                //get the last reference, trust me.
                item.SetValue(dataField, area[area.length - 1], date);
                item.SetComputedValueSource(dataField, "Extracted from EDI file");
            }
            else {
                item.SetValue(dataField, date);
                item.SetComputedValueSource(dataField, "Extracted from EDI file");
            }
        }
    },
    SetStringFieldFromEDI: function (datafield, str, x, y, w, h, page, nearStr) {
        if (str && str.length > 0) {
            let area = null;
            if (nearStr && nearStr.length > 0) {
                let nearArea = Document.SearchString(nearStr, page, x, y, w, h, true, false);
                if (nearArea && nearArea.length > 0) {
                    x = nearArea[0].x;
                    y = nearArea[0].y;
                    w = nearArea[0].width * 3;
                    h = nearArea[0].height * 3;
                    area = Document.SearchString(str, page, x, y, w, h, true, false);
                }
            }
            if (!area) {
                area = Document.SearchString(str, page, x, y, w, h, true, false);
            }
            if (area && area.length > 0) {
                //get the last reference, trust me.
                this.TrySetValueWithArea(datafield, area[area.length - 1], str);
                Data.SetComputedValueSource(datafield, "Extracted from EDI file");
            }
            else {
                this.TrySetValue(datafield, str);
                Data.SetComputedValueSource(datafield, "Extracted from EDI file");
            }
        }
    },
    TrySetValue: function (fieldName, fieldValue, tableName) {
        if (Data.IsNullOrEmpty(fieldName)) {
            Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, fieldName, fieldValue, tableName);
            return true;
        }
        return false;
    },
    TrySetValueWithArea: function (fieldName, fieldArea, fieldValue) {
        if (Data.IsNullOrEmpty(fieldName)) {
            Data.SetValue(fieldName, fieldArea, fieldValue);
        }
    }
};
//In order to avoid automatic adding of an item in custom script when table is empty, add one item here (not audited)
function PreventEmptySAPTextsTable() {
    let sapTextsTable = Data.GetTable("SAPTextsTable__");
    if (sapTextsTable && sapTextsTable.GetItemCount() === 0) {
        sapTextsTable.AddItem();
    }
}
//In order to avoid automatic adding of an item in custom script when table is empty, add one item here (not audited)
function PreventEmptyPartnersTable() {
    let partnersTable = Data.GetTable("Partners__");
    let partnersCount = partnersTable.GetItemCount();
    if (partnersCount === 0) {
        partnersTable.AddItem();
    }
}
//In order to avoid automatic adding of an item in custom script when table is empty, add one item here (not audited)
function PreventEmptyDocumentsTable() {
    let dispatchTable = Data.GetTable("Dispatch_table__");
    let dispatchCount = dispatchTable.GetItemCount();
    if (dispatchCount === 0) {
        dispatchTable.AddItem();
    }
}
function RetrieveSAPAdditionalPartnersImpl(number, salesOrg, distChan, businessArea, allowedPartnerFunctions) {
    let partnerRecords = [];
    if (allowedPartnerFunctions) {
        Log.Info("Retrieve partners '" + allowedPartnerFunctions + "'");
        let partnerFunctionsFromConfigTranslated = Lib.SOP.SAP.PartnersTable.GetGenericPartnerFunctionsFromConfigTranslatedFunctions(allowedPartnerFunctions);
        if (partnerFunctionsFromConfigTranslated.length === 0) {
            Log.Warn("Not possible to retrieve SAP additional partners, since no partner functions were configured.");
            return;
        }
        let partnerGenericFunctions = partnerFunctionsFromConfigTranslated.map(f => f.PARVW);
        partnerRecords = Lib.SOP.SAP.PartnersTable.GetPartners(number, salesOrg, distChan, businessArea, partnerGenericFunctions);
        partnerRecords.forEach(function (partner) {
            partner.functionTranslated = partnerFunctionsFromConfigTranslated.filter(pffct => pffct.PARVW === partner.PARVW)[0].PABEZ;
        });
        Log.Info("Found " + (partnerRecords ? partnerRecords.length : "0") + " partner(s)");
    }
    else {
        Log.Info("No additional partner set, skipping");
    }
    return partnerRecords;
}
function RetrieveSAPAdditionalPartners() {
    if (Sys.OM.Helpers.GetConfiguration().Display_additional_partners === "0") {
        Log.Info("Additional partners disabled");
        return;
    }
    let customerNumber = Data.GetValue("CustomerNumber__");
    let shipToNumber = Data.GetValue("ShipToNumber__");
    let salesOrg = Data.GetValue("Sales_organization__");
    let distChan = Data.GetValue("Distribution_channel__");
    let businessArea = Data.GetValue("Business_area__");
    if (!(customerNumber && salesOrg && distChan && businessArea)) {
        Log.Info("Not possible to retrieve SAP additional partners, since customerNumber and/or element(s) of Sales Area missing.");
        return;
    }
    Log.Info("Retrieve partners for SoldTo number '" + customerNumber + "'");
    let partnerRecords = RetrieveSAPAdditionalPartnersImpl(customerNumber, salesOrg, distChan, businessArea, Lib.SOP.Helpers.GetConfiguration().Allowed_partner_functions);
    if (shipToNumber && Lib.SOP.Helpers.GetConfiguration().Allowed_shipTo_partner_functions) {
        Log.Info("Retrieve partners for ShipTo number '" + shipToNumber + "'");
        let ShipToRecords = RetrieveSAPAdditionalPartnersImpl(shipToNumber, salesOrg, distChan, businessArea, Lib.SOP.Helpers.GetConfiguration().Allowed_shipTo_partner_functions);
        partnerRecords = partnerRecords.concat(ShipToRecords);
    }
    if (!partnerRecords) {
        return;
    }
    let partnersTableData = partnerRecords.map(partnerRecord => {
        let partnerId = Lib.SOP.SAP.Helpers.RemoveSpacesFromString(partnerRecord.KUNN2) || Lib.SOP.SAP.Helpers.RemoveSpacesFromString(partnerRecord.LIFNR);
        if (!partnerId && !Sys.Helpers.IsEmpty(partnerRecord.PERNR)) {
            partnerId = Lib.SOP.SAP.Helpers.RemoveSpacesFromString(partnerRecord.PERNR);
        }
        if ((!partnerId || partnerId === "00000000") && !Sys.Helpers.IsEmpty(partnerRecord.PARNR)) {
            partnerId = Lib.SOP.SAP.Helpers.RemoveSpacesFromString(partnerRecord.PARNR);
        }
        return {
            affiliate: partnerRecord.KUNNR,
            partnerID: partnerId,
            partnerFunctionGeneric: partnerRecord.PARVW,
            partnerFunctionTranslated: partnerRecord.functionTranslated
        };
    });
    Lib.SOP.SAP.PartnersTable.FillSapPartnersData(partnersTableData, Lib.SOP.SAP.Helpers.GetCurrentSAPConnectionLanguage());
    let defaultPartners = Lib.SOP.SAP.Partners.GetDefaultPartners(partnerRecords);
    Lib.SOP.SAP.Partners.FillAdditionalPartnersTable(customerNumber, partnersTableData, defaultPartners);
}
function RetrieveAndSetCurrencyAndHeaderPaymentTermsAndCompleteDeliveryFlag() {
    if (!Data.GetValue("CustomerNumber__")) {
        return;
    }
    let salesArea = Lib.SOP.SAP.Helpers.GetSplitSalesArea();
    CustomerOrderProcessing.Extraction.UserExit.CustomizeSalesArea(salesArea, false);
    let customerSalesDataTable = Lib.SOP.SAP.Tables.customerSalesDataTable;
    if (!salesArea.IsValid()) {
        return;
    }
    let customerSalesDataExtraFields = CustomerOrderProcessing.Extraction.UserExit.GetCustomerSalesDataExtraFields();
    let filter = customerSalesDataTable.customerNumber + " = '" + Sys.Helpers.String.SAP.NormalizeID(Data.GetValue("CustomerNumber__"), 10, false, true) + "'";
    filter += "\n AND " + customerSalesDataTable.salesOrg + " = '" + salesArea.salesOrg + "'";
    filter += "\n AND " + customerSalesDataTable.distChannel + " = '" + salesArea.distChan + "'";
    filter += "\n AND " + customerSalesDataTable.division + " = '" + salesArea.businessArea + "'";
    let fields = customerSalesDataTable.currency + "|" + customerSalesDataTable.paymentTerms + "|" + customerSalesDataTable.completeDelivery;
    if (customerSalesDataExtraFields !== null) {
        for (const [EoDField, SAPField] of Object.entries(customerSalesDataExtraFields)) {
            fields += "|" + SAPField;
        }
    }
    let tableName = customerSalesDataTable.tableName;
    let results = Sys.OM.SAP.Query(tableName, fields, filter, 1);
    if (!results[0]) {
        return;
    }
    let result = results[0];
    // the Currency__ is set regardless of the value of DisplayCurrency set in the configuration
    Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "Currency__", result[customerSalesDataTable.currency], tableName);
    if (Sys.OM.Helpers.GetConfiguration().DisplayPaymentTerms === "1") {
        Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "Payment_Terms__", result[customerSalesDataTable.paymentTerms], tableName);
    }
    if (Sys.OM.Helpers.GetConfiguration().DisplayShipComplete === "1") {
        let completeDelivery = result[customerSalesDataTable.completeDelivery] === "X" ? "1" : "0";
        Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "CompleteDelivery__", completeDelivery, tableName);
        Log.Info("Complete Delivery flag set from default value in SAP");
    }
    if (customerSalesDataExtraFields !== null) {
        for (const [EoDField, SAPField] of Object.entries(customerSalesDataExtraFields)) {
            Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, EoDField, result[SAPField], tableName);
        }
    }
}
function RetrieveAndSetCompleteDeliveryFlag() {
    if (Sys.OM.Helpers.GetConfiguration().DisplayShipComplete === "0" || !Data.GetValue("CustomerNumber__")) {
        return;
    }
    if (Data.GetValue("CompleteDelivery__") !== "1") {
        RetrieveCompleteDeliveryFlagFromKeyword();
    }
}
function RetrieveCompleteDeliveryFlagFromKeyword() {
    let customerNumber = Data.GetValue("CustomerNumber__");
    let completeDeliveryKeyword = Data.GetValue("CompleteDeliveryKeyword__");
    Log.Info("Trying to set complete delivery flag from keyword " + completeDeliveryKeyword);
    let filter = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.CompleteDeliveryMapping.customerNumber, customerNumber), Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.CompleteDeliveryMapping.completeDeliveryText, completeDeliveryKeyword));
    let tableName = Lib.SOP.Tables.CompleteDeliveryMapping.tableName;
    let results = Lib.SOP.Helpers.QueryDB(tableName, filter, "");
    if (results.length === 0) {
        Log.Info("No results when querying Complete Delivery Mapping table");
        return;
    }
    let completeDelivery = results[0].GetValue_String(Lib.SOP.Tables.CompleteDeliveryMapping.completeDelivery, 0);
    Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "CompleteDelivery__", completeDelivery, tableName);
    Log.Info("Complete delivery flag set from keyword");
}
function TryReconciliateOrderAndChangeOrder() {
    if (Data.GetValue("SalesDocumentType__") === Lib.SOP.Helpers.SalesDocumentType.ChangeOrder) {
        Log.Info("Detected ChangeOrder");
        g_erpOrderDocument.QuerySAPNumberFromPONumber();
        let changeOrderSAPNumber = Data.GetValue("SAPOrderNumber__");
        if (changeOrderSAPNumber) {
            g_erpOrderDocument.LoadOrder();
        }
    }
}
function TryReconciliationOrderAndQuoteLineItems() {
    const quotationNumberExtracted = Data.GetValue("QuotationNumber__");
    if (Sys.OM.Helpers.GetConfiguration().DisplayQuotationFields === "0" || !quotationNumberExtracted) {
        return;
    }
    const quotationNumberPadded = Sys.Helpers.String.SAP.NormalizeID(quotationNumberExtracted, 10, false, true);
    const errorMsg = RetrieveQuotationCheckErrorMsg(quotationNumberPadded);
    if (errorMsg) {
        Data.SetError("QuotationNumber__", errorMsg);
    }
    else {
        const loadQuotationPromise = g_erpOrderDocument.LoadQuotation();
        if (loadQuotationPromise) {
            loadQuotationPromise.Then((quote) => {
                if (quote) {
                    CustomerOrderProcessing.Extraction.UserExit.OnLoadQuotationEndServer(quote.rawData);
                }
            });
        }
    }
}
function RetrieveQuotationCheckErrorMsg(quotationNumberPadded) {
    const ERROR_MSG = {
        quoteExpired: "The validity date of the quote is exceeded",
        quoteCompleted: "The quote is completed",
        noStatus: "Could not retrieve status of quote",
        customerNumberDifferent: "The quotation is linked to customer {0}"
    };
    const sapQueryResults = Sys.OM.SAP.Query("VBAKUK", "KUNNR|RFGSK|BNDDT", `VBELN = '${quotationNumberPadded}'`, 1);
    if (sapQueryResults[0]) {
        const validityDate = sapQueryResults[0].BNDDT;
        const status = sapQueryResults[0].RFGSK;
        const customerNumberQuote = sapQueryResults[0].KUNNR;
        if (customerNumberQuote !== Sys.Helpers.String.SAP.NormalizeID(Data.GetValue("CustomerNumber__"), 10, false, true)) {
            return Language.Translate(ERROR_MSG.customerNumberDifferent, true, customerNumberQuote.replace(/^0+/, ""));
        }
        if (validityDate && status) {
            const today = Sys.Helpers.SAP.FormatToSAPDateTimeFormat(new Date());
            if (status === "C") {
                return ERROR_MSG.quoteCompleted;
            }
            if (validityDate < today && validityDate !== "00000000") {
                return ERROR_MSG.quoteExpired;
            }
            return null;
        }
    }
    return ERROR_MSG.noStatus;
}
/************************************ ShipToAndSoldToSearchService ************************************/
class ShipToSoldToAddress {
    constructor() {
        this.Number = null;
        // CustomerNumber only applies if this is a SoldTo address
        this.CustomerNumber = null;
        this.Name = null;
        this.Name2 = null;
        this.Street = null;
        this.ZipCode = null;
        this.City = null;
        this.Region = null;
        this.CountryCode = null;
        this.FromSAP = false;
        this.tableName = null;
    }
    IsFound() {
        return this.Number !== null;
    }
    toString() {
        return this.Name +
            " " +
            this.Street +
            " " +
            this.ZipCode +
            " " +
            this.City +
            " " +
            this.Region +
            " " +
            this.CountryCode;
    }
}
let SoldToShipToDocumentSource = {
    PhoneFaxOrVat: "PhoneFaxOrVat",
    PostalCode: "PostalCode",
    Keywords: "Keywords"
};
function ShipToSoldToFtsQueryResult(queryResult, isPartner, soldToShipToSearchSource) {
    let self = this;
    let queryVars = queryResult.QueryVars;
    self.SoldToShipToDocumentSource = soldToShipToSearchSource;
    self.Number = queryVars.GetValue_String("Number__", 0);
    if (isPartner) {
        self.CustomerNumber = queryVars.GetValue_String("Customer_number__", 0);
    }
    if (isPartner) {
        self.Name = queryVars.GetValue_String("Name_1__", 0);
    }
    else {
        self.Name = queryVars.GetValue_String("Name__", 0);
    }
    self.Street = queryVars.GetValue_String("Street__", 0);
    self.City = queryVars.GetValue_String("City__", 0);
    self.ZipCode = queryVars.GetValue_String("Zip_code__", 0);
    self.Region = queryVars.GetValue_String("Region__", 0);
    self.CountryCode = queryVars.GetValue_String("Country_code__", 0);
    self.OrganizationID = queryVars.GetValue_String("OrgId__", 0);
    self.HighlightingAreas = queryResult.HighlightingAreas;
    self.QueryVars = queryVars;
    self.toString = function () {
        return "Number__: " + self.Number + ", "
            + (isPartner ? "Customer_number__: " + self.CustomerNumber + ", " : "")
            + "Name__: " + self.Name + ", "
            + "Street__: " + self.Street + ", "
            + "City__: " + self.City + ", "
            + "Zip_code__: " + self.ZipCode + ", "
            + "Region__: " + self.Region + ", "
            + "Country_code__: " + self.CountryCode + ", "
            + "SoldToShipToDocumentSource:" + self.SoldToShipToDocumentSource;
    };
    self.GetArea = function () {
        if (self.HighlightingAreas && self.HighlightingAreas.length > 0 && self.HighlightingAreas[0].zone) {
            return self.HighlightingAreas[0].zone;
        }
        return null;
    };
    self.HasComparableHighlightArea = function (other) {
        if (!other
            || !other.HighlightingAreas
            || !self.HighlightingAreas
            || self.HighlightingAreas.length <= 0
            || other.HighlightingAreas.length <= 0) {
            return false;
        }
        let selfArea = self.HighlightingAreas[0].zone;
        let otherArea = other.HighlightingAreas[0].zone;
        if (!selfArea || !otherArea) {
            return false;
        }
        return true;
    };
    self.IsOnSamePage = function (other) {
        return self.HasComparableHighlightArea(other)
            && self.GetArea().page === other.GetArea().page;
    };
    self.HasSameHighlightArea = function (other) {
        return self.HasComparableHighlightArea(other)
            && self.GetArea().page === other.GetArea().page
            && self.GetArea().width === other.GetArea().width
            && self.GetArea().height === other.GetArea().height
            && self.GetArea().x === other.GetArea().x
            && self.GetArea().y === other.GetArea().y;
    };
    self.HasSameHighlightAreaInList = function (others) {
        for (let i = 0; i < others.length; i++) {
            if (self.HasSameHighlightArea(others[i])) {
                return true;
            }
        }
        return false;
    };
}
let ShipToSearchZoneOffsets = {
    // Size of the zone we're looking in
    XMax: 12,
    YMax: 1,
    VertTol: 0.2,
    HorzTolLeft: 0.2,
    HorzTolRight: 2
};
let ShipToSearchZoneForKeyWordsOnlyOffsets = {
    // Size of the zone we're looking in
    XMax: 11.15,
    YMax: 3.1,
    VertTol: 0.2,
    HorzTolLeft: 0.2,
    HorzTolRight: 2
};
function SoldToShipToMatchResult(soldToCandidates, shipToCandidates, matches) {
    let self = this;
    self.SoldToCandidates = soldToCandidates;
    self.ShipToCandidates = shipToCandidates;
    self.Matches = matches;
    self.Priority = 0;
}
class Logger {
    constructor() {
        this._level = 0;
        this._method = [];
    }
    Enter(method) {
        Log.Info(this.lvl() + ">[" + method + "]");
        this._level = this._level + 2;
        this._method.push(method);
    }
    Info(s, ...messageElement) {
        Log.Info(this.lvl() + s, messageElement);
    }
    Warn(s, ...messageElement) {
        Log.Warn(this.lvl() + s, messageElement);
    }
    Verbose(s, ...messageElement) {
        Log.Verbose(this.lvl() + s, messageElement);
    }
    Error(s, ...messageElement) {
        Log.Error(this.lvl() + s, messageElement);
    }
    Exit() {
        this._level = this._level - 2;
        let method = this._method.pop();
        Log.Info("<" + this.lvl() + "[" + method + "]");
    }
    lvl() {
        let s = "";
        for (let i = 0; i < this._level; i++) {
            s += "_";
        }
        return s;
    }
}
const ShipToAndSoldToSearchService = {
    CountryCode: null,
    CultureCode: null,
    InputSoldToNumber: null,
    InputSoldToAddress: null,
    InputShipToAddress: null,
    InputShipToNumber: null,
    FoundShipToAddress: new ShipToSoldToAddress(),
    FoundSoldToAddress: new ShipToSoldToAddress(),
    FoundDropShipAddress: new ShipToSoldToAddress(),
    FoundSoldToExtraFields: null,
    FoundShipToExtraFields: null,
    ShipToSoldToRelationFoundInMappingTable: false,
    _logger: new Logger(),
    IsShipToSoldToFound: function () {
        return this.FoundShipToAddress.IsFound() && this.FoundSoldToAddress.IsFound();
    },
    IsFoundSoldToConsistentWithFoundShipTo: function () {
        return CustomerOrderProcessing.Extraction.UserExit.UnlinkSoldToShipTo() || g_erpOrderDocument.isShipToSoldToMatchable(this.FoundShipToAddress, this.FoundSoldToAddress);
    },
    GetFieldSourceLabelForLog: function (fieldName, fieldValue) {
        if (fieldValue) {
            if (Data.IsComputed(fieldName)) {
                return " (computed)";
            }
            return " (autolearning " + Data.GetConfidenceType(fieldName) + ")";
        }
        return "";
    },
    RemoveCustomerAndPartnerDataForLayoutTeaching: function () {
        // Reset the customer an shipTo if the soldToAddress or shipToaddress was taught with a multi-layout template.
        // Fix multi-template handling, In that case search soldTo/shipTo from address mapping
        if (IsMultiLayoutTeaching() && (Data.IsComputed("SoldToAddress__") || Data.IsComputed("ShipToAddress__"))) {
            Data.SetValue("CustomerNumber__", "");
            Data.SetValue("CustomerName__", "");
            CustomerOrderProcessing.Extraction.UserExit.OnCustomerChange();
            Data.SetValue("ShipToNumber__", "");
            Data.SetValue("ShipToName__", "");
            CustomerOrderProcessing.Extraction.UserExit.OnShipToChange();
            this._logger.Info("Clean Customer and Partner data because SoldTo or ShipTo address have been taught or autolearned.");
        }
    },
    InitInputsFromData: function () {
        ShipToAndSoldToSearchService.RemoveCustomerAndPartnerDataForLayoutTeaching();
        // Inputs : data filled by Teaching or AutoLearn; priority : Teaching > AutoLearn
        let inputSoldToNumber = Data.GetValue("CustomerNumber__");
        this.InputSoldToNumber = inputSoldToNumber ? inputSoldToNumber.trim() : null;
        let inputShipToNumber = Data.GetValue("ShipToNumber__");
        this.InputShipToNumber = inputShipToNumber ? inputShipToNumber.trim() : null;
        let inputSoldToAddress = Data.GetValue("SoldToAddress__");
        this.InputSoldToAddress = inputSoldToAddress ? inputSoldToAddress.trim() : null;
        this.InputSoldToAddress = Sys.Helpers.String.ReplaceEndLinesAndCommaBySpaces(this.InputSoldToAddress);
        let inputShipToAddress = Data.GetValue("ShipToAddress__");
        this.InputShipToAddress = inputShipToAddress ? inputShipToAddress.trim() : null;
        this.InputShipToAddress = Sys.Helpers.String.ReplaceEndLinesAndCommaBySpaces(this.InputShipToAddress);
        let inputSoldToNumberSource = this.GetFieldSourceLabelForLog("CustomerNumber__", this.InputSoldToNumber);
        let inputShipToNumberSource = this.GetFieldSourceLabelForLog("ShipToNumber__", this.InputShipToNumber);
        let inputSoldToAddressSource = this.GetFieldSourceLabelForLog("SoldToAddress__", this.InputSoldToAddress);
        let inputShipToAddressSource = this.GetFieldSourceLabelForLog("ShipToAddress__", this.InputShipToAddress);
        this._logger.Info("InputSoldToNumber: " + this.InputSoldToNumber + inputSoldToNumberSource);
        this._logger.Info("InputShipToNumber: " + this.InputShipToNumber + inputShipToNumberSource);
        this._logger.Info("InputSoldToAddress: " + this.InputSoldToAddress + inputSoldToAddressSource);
        this._logger.Info("InputShipToAddress: " + this.InputShipToAddress + inputShipToAddressSource);
    },
    ResetFoundShipToSoldToAddresses: function () {
        this._logger.Info("ResetFoundShipToSoldToAddresses");
        this.FoundShipToAddress = new ShipToSoldToAddress();
        this.FoundSoldToAddress = new ShipToSoldToAddress();
    },
    GetSoldToShipToExtractionRules: () => {
        // This is a "rule engine". Each of these following "TryXXX" functions is a rule.
        // They are prioritised by order and NOT exclusive:
        // - one or more rules can apply
        // - each rule applies as long as the customer number ans shipto number are not both filled
        return [
            ShipToAndSoldToSearchService.TryFillSoldToFromMapping,
            ShipToAndSoldToSearchService.TryFillBySoldToAddressAlone,
            ShipToAndSoldToSearchService.TryFillShipToAndSoldToFromMapping,
            ShipToAndSoldToSearchService.TryFillBySoldToNumberAlone,
            ShipToAndSoldToSearchService.TryFillByShipToAddressAlone,
            ShipToAndSoldToSearchService.TryFillByShipToNumberAlone,
            ShipToAndSoldToSearchService.TryFillBySoldToNumberAndShipToAddress,
            ShipToAndSoldToSearchService.TryFillBySoldToNumberAndShipToNumber,
            ShipToAndSoldToSearchService.TryFillShipToAndSoldToWithFirstTimeRecognition
        ];
    },
    Run: function (countryCode, cultureCode) {
        this._logger.Enter("ShipToAndSoldToSearchService");
        this._logger.Info("UnlinkSoldToShipTo set to " + CustomerOrderProcessing.Extraction.UserExit.UnlinkSoldToShipTo());
        this.ShipToSoldToRelationFoundInMappingTable = false;
        this.CountryCode = countryCode;
        this.CultureCode = cultureCode;
        this.InitInputsFromData();
        let extractionRules = ShipToAndSoldToSearchService.GetSoldToShipToExtractionRules();
        extractionRules.forEach((extractionRule) => {
            if (this.IsShipToSoldToFound()) {
                if (this.IsFoundSoldToConsistentWithFoundShipTo()) {
                    this._logger.Info("match found");
                    return;
                }
                // mismatch
                this._logger.Info("Mismatch between SoldTo '" + this.FoundSoldToAddress.Number + "' and ShipTo '" + this.FoundShipToAddress.Number + "'");
            }
            extractionRule.call(ShipToAndSoldToSearchService);
        });
        if (!this.IsShipToSoldToFound()) {
            this._logger.Info("ShipToAndSoldToSearchService : data NOT found!");
        }
        else if (this.IsFoundSoldToConsistentWithFoundShipTo()) {
            Data.SetError("CustomerNumber__", "");
            Data.SetError("ShipToNumber__", "");
        }
        this.TryFillDropShip();
        this.TryFillSalesArea();
        this.SetErrorOrWarningOnSoldToShipTo();
        if (this.InputShipToNumber && !ShipToAndSoldToSearchService.FoundShipToAddress.IsFound()) {
            this._logger.Info("There is a ShipToNumber__ but data hasn't been retrieved. We try to fill ShipTo data with this number.");
            let partnersCount = this.FindShipToAddressInPartners({ Number: this.InputShipToNumber });
            if (partnersCount === 1) {
                this.FillDataForShipToAddress();
            }
        }
        this._logger.Info("ShipToAndSoldToSearchService ended");
        this._logger.Exit();
    },
    TryFillSalesArea: function () {
        this._logger.Enter("TryFillSalesArea");
        let isSAP = Lib.SOP.Helpers.IsERP("SAP");
        let isSAPS4Cloud = Lib.SOP.Helpers.IsERP("SAPS4Cloud");
        let isSAPAsync = Lib.SOP.Helpers.IsERP("Asynchronous SAP Integration");
        if (!this.IsShipToSoldToFound() || !(isSAP || isSAPS4Cloud || isSAPAsync)) {
            this._logger.Info("IsShipToSoldToFound returned false or not SAP. Skip");
            this._logger.Exit();
            return;
        }
        const currentSalesAreaIsSetFromConfig = Data.IsComputed("Sales_Area__") && Data.GetComputedValueSource("Sales_Area__").indexOf("configuration") !== -1;
        //shipTo from teaching/AL
        let salesAreaIsComputed = Data.IsComputed("Sales_Area__");
        let isShiptoNumberExctractedOrAutolearned = Data.GetValue("ShipToNumber__") !== "" && ((Data.GetComputedValueSource("ShipToNumber__") && Data.GetComputedValueSource("ShipToNumber__").toLowerCase() === "teaching") || Data.GetConfidenceType("ShipToNumber__") === "extracted");
        let isShiptoAddressExtracted = Data.GetValue("ShipToNumber__") !== "" && Data.GetValue("ShipToAddress__") !== "";
        const isShiptoReliable = isShiptoNumberExctractedOrAutolearned || isShiptoAddressExtracted;
        this._logger.Info("current sales area is set from configuration : " + currentSalesAreaIsSetFromConfig);
        this._logger.Info("shipto is reliable (from teaching/extracted from document) : " + isShiptoReliable + "(" + isShiptoNumberExctractedOrAutolearned + "/" + isShiptoAddressExtracted + ")");
        // If the sales area is computed (but not from config) and the shipTo is not reliable
        // We don't try to find the matching sales area
        if (salesAreaIsComputed && !currentSalesAreaIsSetFromConfig && !isShiptoReliable) {
            this._logger.Info("salesArea not set from config or shipto not reliable : abord search");
            this._logger.Exit();
            return;
        }
        // Otherwise we try to set the sales area corresponding to the ship to
        let partnerNumber = this.FoundShipToAddress.Number;
        let salesOrganization;
        let distributionChannel;
        let businessArea;
        let tableName;
        let partnerChosen = this.IdentifyCorrectPartner(partnerNumber);
        if (partnerChosen) {
            salesOrganization = partnerChosen.GetValue_String(Lib.SOP.Tables.Partners.salesOrganization, 0);
            distributionChannel = partnerChosen.GetValue_String(Lib.SOP.Tables.Partners.distributionChannel, 0);
            businessArea = partnerChosen.GetValue_String(Lib.SOP.Tables.Partners.businessArea, 0);
            tableName = Lib.SOP.Tables.Partners.tableName;
        }
        else if (isSAP) {
            this._logger.Info("Retrying in SAP...");
            partnerChosen = this.IdentifyCorrectPartnerInSAP(partnerNumber);
            if (partnerChosen) {
                salesOrganization = partnerChosen[Lib.SOP.SAP.Tables.partnerTable.salesOrganization];
                distributionChannel = partnerChosen[Lib.SOP.SAP.Tables.partnerTable.distributionChannel];
                businessArea = partnerChosen[Lib.SOP.SAP.Tables.partnerTable.businessArea];
                tableName = Lib.SOP.SAP.Tables.partnerTable.tableName;
            }
        }
        if (!partnerChosen) {
            this._logger.Warn("Partner can't be chosen, sales area not set");
            this._logger.Exit();
            return;
        }
        let salesArea = Lib.SOP.SAP.Helpers.GetSplitSalesArea(salesOrganization + "/" + distributionChannel + "/" + businessArea);
        CustomerOrderProcessing.Extraction.UserExit.CustomizeSalesArea(salesArea, false);
        if (Lib.SOP.SAP.Helpers.SetSalesArea(salesArea, tableName)) {
            this._logger.Info("Updated salesArea value");
        }
        else {
            this._logger.Info("No valid sales are found. Try to find one from mapping.");
            this.GetShipToNumberMapping();
        }
        this._logger.Exit();
    },
    GetShipToNumberMapping() {
        this._logger.Enter("GetShipToNumberMapping");
        const shipToAddressRaw = Data.GetValue("ShipToAddress__");
        if (!shipToAddressRaw) {
            return;
        }
        const shipToAddress = Sys.Helpers.String.ReplaceEndLinesAndCommaBySpaces(shipToAddressRaw.trim());
        const customerNumber = Data.GetValue("CustomerNumber__");
        const shipToNumber = Data.GetValue("ShipToNumber__");
        if (!customerNumber || !shipToNumber) {
            return;
        }
        const tableName = "SO - Ship to address/number mapping__";
        const filter = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual("CustomerNumber__", customerNumber.toString()), Sys.Helpers.LdapUtil.FilterEqual("ShipToAddress__", shipToAddress));
        let records = Lib.SOP.Helpers.QueryDB(tableName, filter, "Sales_Area__");
        if (records.length === 0) {
            this._logger.Info("Found no mapping. Keep default one.");
            return;
        }
        this.SetSalesAreaWithRecord(records[0], tableName);
    },
    SetSalesAreaWithRecord(rec, tableName) {
        const newSalesArea = rec.GetValue_String("Sales_Area__", 0);
        this._logger.Info("Found a mapping with salesArea:" + newSalesArea + ".");
        const salesArea = Lib.SOP.SAP.Helpers.GetSplitSalesArea(newSalesArea);
        CustomerOrderProcessing.Extraction.UserExit.CustomizeSalesArea(salesArea, false);
        if (Lib.SOP.SAP.Helpers.SetSalesArea(salesArea, tableName)) {
            this._logger.Info("Updated salesArea value.");
        }
        else {
            this._logger.Info("Update salesArea failed. Keep default one.");
        }
    },
    IdentifyCorrectPartner: function (partnerNumber) {
        this._logger.Enter("identifyCorrectPartner");
        let config = Sys.OM.Helpers.GetConfiguration();
        let partnerTable = Lib.SOP.Tables.Partners;
        let tableName = partnerTable.tableName;
        let partnerFilter = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.Partners.number, partnerNumber), Lib.SOP.SAP.Helpers.GetPossibleSalesAreasFilter(true));
        let fields = "Sales_organization__, Distribution_channel__, Business_area__";
        let partnerQueryVars = Lib.SOP.Helpers.QueryDB(tableName, partnerFilter, fields, 50);
        if (partnerQueryVars.length === 1) {
            //One partner with allowed sales area found, we choose this partner's sales area
            this._logger.Info("One partner found with allowed sales area");
            this._logger.Exit();
            return partnerQueryVars[0];
        }
        else if (partnerQueryVars.length > 1) {
            //Multiple partners with allowed sales area found, we check if one of these partners has the default sales area.
            //If not, we don't know which sales area we have to set
            this._logger.Info("Multiple partners found with allowed sales area");
            for (let i = 0; i < partnerQueryVars.length; i++) {
                let partner = partnerQueryVars[i];
                let currentSalesOrg = partner.GetValue_String(partnerTable.salesOrganization, 0);
                let currentDistChannel = partner.GetValue_String(partnerTable.distributionChannel, 0);
                let currentBusinessArea = partner.GetValue_String(partnerTable.businessArea, 0);
                if (currentSalesOrg === config.SalesOrganization && currentDistChannel === config.DistributionChannel && currentBusinessArea === config.BusinessArea) {
                    this._logger.Info("The partner with default sales area has been selected");
                    this._logger.Exit();
                    return partner;
                }
            }
        }
        this._logger.Exit();
        return null;
    },
    IdentifyCorrectPartnerInSAP: function (partnerNumber) {
        this._logger.Enter("IdentifyCorrectPartnerInSAP");
        let config = Sys.OM.Helpers.GetConfiguration();
        let partnerSAPTable = Lib.SOP.SAP.Tables.partnerTable;
        let customerNumber = this.FoundSoldToAddress.Number;
        let partnerQueryVars = this.QuerySAPPartnerTable(partnerNumber, customerNumber);
        if (partnerQueryVars.length === 1) {
            //One partner with allowed sales area found, we choose this partner's sales area
            this._logger.Info("One partner found with allowed sales area");
            this._logger.Exit();
            return partnerQueryVars[0];
        }
        else if (partnerQueryVars.length > 1) {
            //Multiple partners with allowed sales area found, we check if one of these partners has the default sales area.
            //If not, we don't know which sales area we have to set
            this._logger.Info("Multiple partners found with allowed sales area");
            for (let i = 0; i < partnerQueryVars.length; i++) {
                let partner = partnerQueryVars[i];
                let currentSalesOrg = partner[partnerSAPTable.salesOrganization];
                let currentDistChannel = partner[partnerSAPTable.distributionChannel];
                let currentBusinessArea = partner[partnerSAPTable.businessArea];
                if (currentSalesOrg === config.SalesOrganization && currentDistChannel === config.DistributionChannel && currentBusinessArea === config.BusinessArea) {
                    this._logger.Info("The partner with default sales area has been selected");
                    this._logger.Exit();
                    return partner;
                }
            }
        }
        else {
            this._logger.Error("Error during partner query on SAP table " + partnerSAPTable.tableName + " with customer number " + customerNumber);
        }
        this._logger.Exit();
        return null;
    },
    IsSoldToAddressAndNoSoldToNumber: function () {
        return this.InputSoldToAddress && (!this.InputSoldToNumber || !Data.IsComputed("CustomerNumber__"));
    },
    TryFillSoldToFromMapping: function () {
        this._logger.Enter("TryFillSoldToFromMapping");
        if (!this.IsSoldToAddressAndNoSoldToNumber()) {
            this._logger.Info("IsSoldToAddressAndNoSoldToNumber returned false, exit");
            this._logger.Exit();
            return;
        }
        this.FoundSoldToAddress = new ShipToSoldToAddress();
        let soldToAddress = this.InputSoldToAddress;
        let table = Lib.SOP.Tables.SoldToAddressNumberMapping;
        let mappingTableFilter = Sys.Helpers.LdapUtil.FilterStrictEqual("SoldToAddress__", soldToAddress);
        if (Lib.SOP.Helpers.IsERP("SAP") || Lib.SOP.Helpers.IsERP("Asynchronous SAP Integration")) {
            mappingTableFilter = Sys.Helpers.LdapUtil.FilterAnd(mappingTableFilter, Lib.SOP.SAP.Helpers.GetPossibleSalesAreasFilter(false));
        }
        let mappingQueryVars = Lib.SOP.Helpers.QueryDB(table.tableName, mappingTableFilter, table.customerNumber, 1);
        if (mappingQueryVars.length === 0) {
            this._logger.Info("SoldToNumber/CustomerNumber mapping not found");
            this._logger.Exit();
            return;
        }
        let customerNumber = mappingQueryVars[0].GetValue_String("Customernumber__", 0);
        this.QuerySoldToAddressByCustomerNumber(customerNumber);
        this.FillDataForSoldToAddress();
        this.InputSoldToNumber = customerNumber;
        this._logger.Exit();
    },
    TryFillBySoldToAddressAlone: function () {
        this._logger.Enter("TryFillBySoldToAddressAlone");
        if (!this.IsSoldToAddressAlone()) {
            this._logger.Exit();
            this._logger.Info("Sold to address not alone");
            return;
        }
        this.ResetFoundShipToSoldToAddresses();
        let extractedData = this.ExtractDataFromSoldToAddress();
        this.GetSoldToAddressByFtsWithAddressWordsAndZipCodes(extractedData.AddressWords, extractedData.ZipCodes);
        this.HighlightSoldToAreas(Data.GetArea("SoldToAddress__"));
        this.FillDataForSoldToAddress();
        if (this.FoundSoldToAddress.Number && !this.InputShipToNumber && !this.InputShipToAddress) {
            let partnerInfo = { CustomerNumber: this.FoundSoldToAddress.Number };
            let partnersCount = this.FindShipToAddressInPartners(partnerInfo);
            this.FillDataForShipToAddress();
            if (partnersCount > 1) {
                this._logger.Info("Multiple candidates for customer " + partnerInfo.CustomerNumber);
                Data.SetWarning("ShipToNumber__", "Multiple candidates");
            }
            else {
                this._logger.Info("no partner found");
            }
        }
        this._logger.Exit();
    },
    IsSoldToAddressAlone: function () {
        return !this.InputSoldToNumber && this.InputSoldToAddress;
    },
    GetSoldToAddressByFtsWithAddressWordsAndZipCodes: function (addressWords, extractedZipCodes) {
        this._logger.Enter("GetSoldToAddressByFtsWithAddressWordsAndZipCodes");
        let tablename = Lib.SOP.Tables.Customers.tableName;
        if (extractedZipCodes.length == 0) {
            this._logger.Info("No extracted zipcodes, as the returned addresses could not be verified, we do not make any query on " + tablename);
            this._logger.Exit();
            return;
        }
        let filter = FormattingTools.BuildFtsFilterWithAddressWordsAndZipcodes(addressWords, extractedZipCodes, this.CultureCode);
        let extraFilter = CustomerOrderProcessing.Extraction.UserExit.GetSoldToFTSExtraFilter();
        if (!Sys.Helpers.IsEmpty(extraFilter) && typeof (extraFilter) == "string") {
            this._logger.Info("Applying extra filter: " + extraFilter);
            filter = Sys.Helpers.LdapUtil.FilterAnd(filter, extraFilter);
        }
        this._logger.Info("FTS filter: " + filter);
        let partnerResultVars = Lib.SOP.Helpers.QueryDB(tablename, filter, "*", 1);
        if (partnerResultVars.length === 0) {
            this._logger.Info("'" + tablename + "' query returned no result");
            this._logger.Exit();
            return;
        }
        let zipCodeOfQuery = partnerResultVars[0].GetValue_String("Zip_code__", 0);
        if (extractedZipCodes.length > 0 && !this.IsQueryZipCodeMatchWithAnyOfExtractedZipCodes(zipCodeOfQuery, extractedZipCodes)) {
            this._logger.Info("No zipcode valid result after query on " + tablename);
            this._logger.Exit();
            return;
        }
        let customerNumber = partnerResultVars[0].GetValue_String("Number__", 0);
        this._logger.Info("Customer found: " + customerNumber);
        this.SetSoldToAddressFromQuery(partnerResultVars[0]);
    },
    ExtractDataFromSoldToAddress: function () {
        let addressWords = FormattingTools.SplitWords(this.InputSoldToAddress);
        let zipCodes = this.ExtractZipCodes(this.InputSoldToAddress, this.CultureCode);
        return {
            AddressWords: addressWords,
            ZipCodes: zipCodes
        };
    },
    TryFillShipToAndSoldToFromMapping: function () {
        this._logger.Enter("TryFillShipToAndSoldToFromMapping");
        const shipToDriven = Sys.OM.Helpers.GetConfiguration().PartnerEntry === "shipToFirst";
        const shipToDrivenAndShipToAddressFound = shipToDriven && this.InputShipToAddress;
        if (!shipToDrivenAndShipToAddressFound && !this.IsSoldToNumberAndShipToAddress()) {
            this._logger.Exit();
            return;
        }
        this.ResetFoundShipToSoldToAddresses();
        let shipToAddress = this.InputShipToAddress;
        let customerNumber = this.InputSoldToNumber;
        let tablename = Lib.SOP.Tables.ShipToAddressAndNumberMapping.tableName;
        let mappingTableFilter;
        let filters = [];
        if (shipToDrivenAndShipToAddressFound) {
            filters.push(Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.ShipToAddressAndNumberMapping.shipToAddress, shipToAddress));
            // If ship-to number has been extracted using a teaching rule or from document by auto-learning (no ambiguity), filter on this ship-to
            if (this.InputShipToNumber && ((Data.GetComputedValueSource("ShipToNumber__") && Data.GetComputedValueSource("ShipToNumber__").toLowerCase() === "teaching") || Data.GetConfidenceType("ShipToNumber__") === "extracted")) {
                filters.push(Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.ShipToAddressAndNumberMapping.shipToNumber, this.InputShipToNumber));
            }
        }
        else {
            filters.push(Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.ShipToAddressAndNumberMapping.customerNumber, customerNumber));
            filters.push(Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.ShipToAddressAndNumberMapping.shipToAddress, shipToAddress));
        }
        if (Lib.SOP.Helpers.IsERP("SAP") || Lib.SOP.Helpers.IsERP("Asynchronous SAP Integration")) {
            filters.push(Lib.SOP.SAP.Helpers.GetPossibleSalesAreasFilter(false));
        }
        mappingTableFilter = Sys.Helpers.LdapUtil.FilterAnd(...filters);
        let mappingQueryVars = Lib.SOP.Helpers.QueryDB(tablename, mappingTableFilter, "*", 10);
        if (mappingQueryVars.length === 0) {
            if (Sys.OM.Helpers.GetConfiguration().PreventTouchlessIfNoShiptoMappingFound === "1") {
                Data.SetWarning("ShipToNumber__", "No partner related to this delivery address found");
            }
            this._logger.Info("ShipToNumber/CustomerNumber mapping not found");
            this._logger.Exit();
            return;
        }
        if (mappingQueryVars.length > 1) {
            Data.SetWarning("ShipToNumber__", "There is more than one partner related to this delivery address");
            Log.Info("Several ShipTo found with address '" + shipToAddress + "'");
            this._logger.Exit();
            return;
        }
        this.ShipToSoldToRelationFoundInMappingTable = true;
        let shipToNumber = mappingQueryVars[0].GetValue_String("ShipToNumber__", 0);
        customerNumber = mappingQueryVars[0].GetValue_String("CustomerNumber__", 0);
        let partnerInfo = { Number: shipToNumber, CustomerNumber: customerNumber };
        let partnersCount = this.FindShipToAddressInPartners(partnerInfo);
        if (partnersCount === 0) {
            this._logger.Info("Partner not found with Number__=" + shipToNumber);
            this._logger.Exit();
            return;
        }
        if (partnersCount > 1) {
            this._logger.Info("Several partners found with Number__=" + shipToNumber);
            Data.SetWarning("CustomerNumber__", "There is more than one partner for this ShipTo number");
            this._logger.Exit();
            return;
        }
        this.QuerySoldToAddressByCustomerNumber(customerNumber);
        if (!this.FoundSoldToAddress.IsFound()) {
            this._logger.Info("Customer not found with CustomerNumber__=" + customerNumber);
            this._logger.Exit();
            return;
        }
        this.FillDataForShipToAddress();
        this.FillDataForSoldToAddress();
        this._logger.Exit();
    },
    TryFillByShipToNumberAlone: function () {
        this._logger.Enter("TryFillByShipToNumberAlone");
        if (!this.IsShipToNumberAlone()) {
            this._logger.Info("Ship to number not set alone");
            this._logger.Exit();
            return;
        }
        this.ResetFoundShipToSoldToAddresses();
        let partnerInfo = { Number: this.InputShipToNumber };
        this.FindShipToAddressInPartners(partnerInfo);
        this.FillDataForShipToAddress();
        this.QuerySoldToAddressByCustomerNumber(this.FoundShipToAddress.CustomerNumber);
        this.FillDataForSoldToAddress();
        this._logger.Exit();
    },
    TryFillBySoldToNumberAlone: function () {
        this._logger.Enter("TryFillBySoldToNumberAlone");
        if (!this.IsSoldToNumberAlone()) {
            this._logger.Info("Sold to number not set alone");
            this._logger.Exit();
            return;
        }
        this.ResetFoundShipToSoldToAddresses();
        this.QuerySoldToAddressByCustomerNumber(this.InputSoldToNumber);
        let partnerInfo = { CustomerNumber: this.FoundSoldToAddress.Number };
        let partnersCount = this.FindShipToAddressInPartners(partnerInfo);
        this.FillDataForShipToAddress();
        this.FillDataForSoldToAddress();
        if (partnersCount > 1) {
            this._logger.Info("Multiple candidates for customer " + partnerInfo.CustomerNumber);
            Data.SetWarning("ShipToNumber__", "Multiple candidates");
        }
        else {
            this._logger.Info("0 or 1 partner found");
        }
        this._logger.Exit();
    },
    IsSoldToNumberAlone: function () {
        return this.InputSoldToNumber && !this.InputShipToAddress && !this.InputShipToNumber;
    },
    IsShipToNumberAlone: function () {
        return !this.InputSoldToNumber && !this.InputShipToAddress && this.InputShipToNumber;
    },
    TryFillByShipToAddressAlone: function () {
        this._logger.Enter("TryFillByShipToAddressAlone");
        if (!this.IsShipToAddressAlone()) {
            this._logger.Info("skip (no shipToAdress alone)");
            this._logger.Exit();
            return;
        }
        if (!(this.InputSoldToAddress || this.InputSoldToNumber)) {
            this.ResetFoundShipToSoldToAddresses();
        }
        let extractedData = this.ExtractDataFromShipToAddress();
        let res = this.GetShipToAddressByFtsWithAddressWordsAndZipCodes(extractedData.AddressWords, extractedData.ZipCodes, true);
        if (!res) {
            this.GetShipToAddressByFtsWithAddressWordsAndZipCodes(extractedData.AddressWords, extractedData.ZipCodes, false);
        }
        this.FillDataForShipToAddress();
        this.HighlightShipToAreas(Data.GetArea("ShipToAddress__"));
        if (!(this.InputSoldToAddress || this.InputSoldToNumber)) {
            this.FindSoldToAddressWithShipToAddressCustomerNumber();
            this.FillDataForSoldToAddress();
        }
        this.SetErrorOrWarningOnSoldToShipTo();
        this._logger.Exit();
    },
    IsShipToAddressAlone: function () {
        return !this.InputSoldToNumber && this.InputShipToAddress;
    },
    ExtractDataFromShipToAddress: function () {
        let addressWords = FormattingTools.SplitWords(this.InputShipToAddress);
        let zipCodes = this.ExtractZipCodes(this.InputShipToAddress, this.CultureCode);
        return {
            AddressWords: addressWords,
            ZipCodes: zipCodes
        };
    },
    ExtractZipCodes: function (address, cultureCode) {
        let addressWords = FormattingTools.SplitWords(address);
        let postalCodeRegExp = GetPostalCodeRegExp(cultureCode);
        let validZipCodes = [];
        if (!postalCodeRegExp) {
            return validZipCodes;
        }
        for (let index = 0; index < addressWords.length; index++) {
            let addressWord = addressWords[index];
            let matches = postalCodeRegExp.exec(addressWord);
            if (matches) {
                validZipCodes.push(matches[0]);
            }
        }
        return validZipCodes;
    },
    TryFillBySoldToNumberAndShipToAddress: function () {
        this._logger.Enter("TryFillBySoldToNumberAndShipToAddress");
        if (!this.IsSoldToNumberAndShipToAddress()) {
            this._logger.Info("IsSoldToNumberAndShipToAddress return false");
            this._logger.Exit();
            return;
        }
        this.ResetFoundShipToSoldToAddresses();
        this.QuerySoldToAddressByCustomerNumber(this.InputSoldToNumber);
        let extractedData = this.ExtractDataFromShipToAddress();
        this.FillDataForSoldToAddress();
        this.GetShipToAddressByFtsWithAddressWordsAndZipCodes(extractedData.AddressWords, extractedData.ZipCodes, true);
        this.FillDataForShipToAddress();
        if (!this.FoundShipToAddress.IsFound()) {
            this._logger.Info("ShipTo not found");
            this._logger.Exit();
            return;
        }
        this.HighlightShipToAreas(Data.GetArea("ShipToAddress__"));
        this.SetErrorOrWarningOnSoldToShipTo();
        this._logger.Exit();
    },
    SetErrorOrWarningOnSoldToShipTo: function () {
        if (!this.IsFoundSoldToConsistentWithFoundShipTo()) {
            //FT-029333
            if (this.ArePartners(Data.GetValue("CustomerNumber__"), Data.GetValue("ShipToNumber__"))) {
                Data.SetWarning("ShipToNumber__", "There is no existing mapping between the shipping address and the ship-to number");
            }
            else if (!this.InputShipToAddress) {
                ShipToAndSoldToSearchService.SetInconsistencyErrorOnCustomerNumberAndShipToNumber(this.FoundSoldToAddress.Number, this.FoundShipToAddress.Number);
            }
            else if (this.ShipToSoldToRelationFoundInMappingTable) {
                Data.SetWarning("ShipToNumber__", "There is no relation between the sold-to number and ship-to number");
            }
            else {
                Data.SetError("ShipToNumber__", "This ShipTo address is not related to the SoldTo.");
            }
        }
    },
    SetInconsistencyErrorOnCustomerNumberAndShipToNumber: function (customerNumber, shipToNumber) {
        if (customerNumber && shipToNumber) {
            let errorMessage = "Customer '{0}' is inconsistent with partner '{1}'.";
            Data.SetError("ShipToNumber__", errorMessage, customerNumber, shipToNumber);
            this._logger.Warn("ShipToNumber__ inconsistency error: " + Data.GetError("ShipToNumber__"));
        }
    },
    IsSoldToNumberAndShipToAddress: function () {
        return this.InputSoldToNumber && this.InputShipToAddress;
    },
    TryFillBySoldToNumberAndShipToNumber: function () {
        this._logger.Enter("TryFillBySoldToNumberAndShipToNumber");
        if (!this.IsSoldToNumberAndShipToNumber()) {
            this._logger.Info("IsSoldToNumberAndShipToNumbe returned false");
            this._logger.Exit();
            return;
        }
        if (this.InputShipToAddress) {
            this._logger.Info("InputShipToAddress not empty");
            this._logger.Exit();
            return;
        }
        this.ResetFoundShipToSoldToAddresses();
        this.QuerySoldToAddressByCustomerNumber(this.InputSoldToNumber);
        this.FillDataForSoldToAddress();
        let partnersCount = this.FindShipToAddressInPartners({
            Number: this.InputShipToNumber,
            CustomerNumber: this.InputSoldToNumber
        });
        if (partnersCount > 1) {
            this._logger.Info("Multiple candidates for customer " + this.InputShipToNumber);
            Data.SetWarning("ShipToNumber__", "Multiple candidates");
        }
        else if (partnersCount === 0) {
            this._logger.Info("No partner found");
            this.FindShipToAddressInPartners({ Number: this.InputShipToNumber });
            if (!this.FoundShipToAddress.FromSAP && !this.IsFoundSoldToConsistentWithFoundShipTo()) {
                ShipToAndSoldToSearchService.SetInconsistencyErrorOnCustomerNumberAndShipToNumber(this.FoundSoldToAddress.Number, this.FoundShipToAddress.CustomerNumber);
            }
        }
        this.FillDataForShipToAddress();
        this._logger.Exit();
    },
    IsSoldToNumberAndShipToNumber: function () {
        return this.InputSoldToNumber && this.InputShipToNumber;
    },
    HighLightAreas: function (areas, h, c, b, f) {
        for (let i = 0; i < areas.length; i++) {
            if (areas[i]) {
                areas[i].Highlight(h, c, b, f);
            }
        }
    },
    GetShipToAddressByFtsWithAddressWordsAndZipCodes: function (addressWords, extractedZipCodes, useSoldToNumber) {
        this._logger.Enter("GetShipToAddressByFtsWithAddressWordsAndZipCodes");
        this._logger.Info("use soldTo number : " + useSoldToNumber);
        let tablename = Lib.SOP.Tables.Partners.tableName;
        let filter = FormattingTools.BuildFtsFilterWithAddressWordsAndZipcodes(addressWords, extractedZipCodes, this.CultureCode);
        // RD00009289: Handling multiple soldTo for 1 shipTo
        if (useSoldToNumber && this.InputSoldToNumber) {
            let customerNumber = this.InputSoldToNumber;
            if (Lib.SOP.Helpers.IsERP("Oracle EBS")) {
                customerNumber = g_erpOrderDocument.getCustomerNumberWithoutLocation(customerNumber);
            }
            let resultFilter = Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.Partners.customerNumber, customerNumber);
            if (filter) {
                resultFilter = Sys.Helpers.LdapUtil.FilterAnd(filter, resultFilter);
            }
            filter = resultFilter;
        }
        if (Lib.SOP.Helpers.IsERP("SAP") || Lib.SOP.Helpers.IsERP("Asynchronous SAP Integration")) {
            filter = Sys.Helpers.LdapUtil.FilterAnd(filter, Lib.SOP.SAP.Helpers.GetPossibleSalesAreasFilter(true));
        }
        let extraFilter = CustomerOrderProcessing.Extraction.UserExit.GetShipToFTSExtraFilter();
        if (!Sys.Helpers.IsEmpty(extraFilter) && typeof (extraFilter) == "string") {
            this._logger.Info("Applying extra filter: " + extraFilter);
            filter = Sys.Helpers.LdapUtil.FilterAnd(filter, extraFilter);
        }
        this._logger.Verbose("FTS filter: " + filter.toString());
        let partnerResultVars = Lib.SOP.Helpers.QueryDB(tablename, filter, "*", 1);
        if (partnerResultVars.length === 0) {
            if (CustomerOrderProcessing.Extraction.UserExit.UnlinkSoldToShipTo() && !this.InputShipToNumber) {
                this._logger.Info("[UnlinkSoldToShipTo] try with soldTo and shipTo unlinked.");
                filter = FormattingTools.BuildFtsFilterWithAddressWordsAndZipcodes(addressWords, extractedZipCodes, this.CultureCode);
                if (this.InputSoldToNumber) {
                    let resultFilter = Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.Partners.customerNumber, "*");
                    if (filter) {
                        resultFilter = Sys.Helpers.LdapUtil.FilterAnd(filter, resultFilter);
                    }
                    filter = resultFilter;
                    partnerResultVars = Lib.SOP.Helpers.QueryDB(tablename, filter, "*", 1);
                    if (partnerResultVars.length === 0) {
                        this._logger.Info("With InputSoldToNumber: '" + tablename + "' query returned no result");
                        this._logger.Exit();
                        return false;
                    }
                }
                else {
                    this._logger.Info("without InputSoldToNumber: '" + tablename + "' query returned no result");
                    this._logger.Exit();
                    return false;
                }
            }
            else {
                this._logger.Info("Query on '" + tablename + "' returned no result");
                this._logger.Exit();
                return false;
            }
        }
        let zipCodeOfQuery = partnerResultVars[0].GetValue_String("Zip_code__", 0);
        if (extractedZipCodes.length > 0 && !this.IsQueryZipCodeMatchWithAnyOfExtractedZipCodes(zipCodeOfQuery, extractedZipCodes)) {
            this._logger.Info("No zipcode valid result after query on " + tablename);
            this._logger.Exit();
            return false;
        }
        let partnerNumber = partnerResultVars[0].GetValue_String("Number__", 0);
        this._logger.Info("Partner found: " + partnerNumber);
        this.SetFoundShipToAddressFromQuery(partnerResultVars[0]);
        this._logger.Exit();
        return true;
    },
    IsQueryZipCodeMatchWithAnyOfExtractedZipCodes: function (zipCodeOfQuery, extractedZipCodes) {
        for (let index = 0; index < extractedZipCodes.length; index++) {
            let zipCode = extractedZipCodes[index];
            if (FormattingTools.ZipCodesAreEqual(zipCodeOfQuery, zipCode, this.CultureCode)) {
                return true;
            }
        }
        return false;
    },
    SetFoundShipToAddressFromQuery: function (partnerQueryVars) {
        let customerTable = Lib.SOP.Tables.Partners;
        this.FoundShipToAddress.Number = partnerQueryVars.GetValue_String(customerTable.number, 0);
        this.FoundShipToAddress.CustomerNumber = partnerQueryVars.GetValue_String(customerTable.customerNumber, 0);
        this.FoundShipToAddress.Name = partnerQueryVars.GetValue_String(customerTable.name, 0);
        this.FoundShipToAddress.tableName = customerTable.tableName;
        this.FoundShipToStandardFields = Lib.SOP.GetExtraFieldsValues(Lib.SOP.Helpers.GetOrder().GetShipToStandardFields(customerTable), partnerQueryVars, false);
        this.FoundShipToExtraFields = Lib.SOP.GetExtraFieldsValues(Lib.SOP.Helpers.GetOrder().GetShipToExtraFields(customerTable.tableName), partnerQueryVars, false);
    },
    SetFoundShipToAddressFromSAPQuery: function (partnerQueryVars, customerNumber) {
        let customerSAPTable = Lib.SOP.SAP.Tables.customerTable;
        this.FoundShipToAddress.Number = Lib.SOP.SAP.Helpers.FormatID(partnerQueryVars[customerSAPTable.number]);
        this.FoundShipToAddress.CustomerNumber = customerNumber || this.FoundShipToAddress.Number;
        this.FoundShipToAddress.Name = partnerQueryVars[customerSAPTable.name];
        this.FoundShipToAddress.tableName = customerSAPTable.tableName;
        this.FoundShipToStandardFields = Lib.SOP.GetExtraFieldsValues(Lib.SOP.Helpers.GetOrder().GetShipToStandardFields(customerSAPTable), partnerQueryVars, true);
        this.FoundShipToExtraFields = Lib.SOP.GetExtraFieldsValues(Lib.SOP.Helpers.GetOrder().GetShipToExtraFields(customerSAPTable.tableName), partnerQueryVars, true);
        this.FoundShipToAddress.FromSAP = true;
    },
    HighlightShipToAreas: function (areas) {
        if (!this.FoundShipToAddress.IsFound() || !areas || areas.length === 0) {
            return;
        }
        this.HighLightAreas(areas, true, this.HlcColorCode, this.HlbcColorCode, "ShipToName__");
        this.HighLightAreas(areas, true, this.HlcColorCode, this.HlbcColorCode, "ShipToNumber__");
        this.FoundShipToAddress.HighLightAreas = areas;
    },
    FindSoldToAddressWithShipToAddressCustomerNumber: function () {
        this._logger.Enter("FindSoldToAddressWithShipToAddressCustomerNumber");
        if (!this.FoundShipToAddress.IsFound()) {
            this._logger.Info("No customer number");
            this._logger.Exit();
            return;
        }
        let customerNumber = this.FoundShipToAddress.CustomerNumber;
        this.QuerySoldToAddressByCustomerNumber(customerNumber);
        if (!this.FoundSoldToAddress.IsFound()) {
            this._logger.Info("Customer '" + customerNumber + "' not found");
            Data.SetError("CustomerNumber__", "Customer '{0}' not found", customerNumber);
        }
        this._logger.Exit();
    },
    ArePartners(customerNumber, shipToNumber) {
        let b = false;
        this._logger.Info("ArePartners shipToNumber = '" + shipToNumber + "' soldToNumber = '" + customerNumber + "'");
        if (customerNumber && shipToNumber) {
            if (Lib.SOP.Helpers.IsERP("Oracle EBS") && customerNumber) {
                customerNumber = g_erpOrderDocument.getCustomerNumberWithoutLocation(customerNumber);
            }
            let queryFilter = Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.Partners.number, shipToNumber);
            queryFilter = Sys.Helpers.LdapUtil.FilterAnd(queryFilter, Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.Partners.customerNumber, customerNumber));
            if (Lib.SOP.Helpers.IsERP("SAP") || Lib.SOP.Helpers.IsERP("Asynchronous SAP Integration")) {
                queryFilter = Sys.Helpers.LdapUtil.FilterAnd(queryFilter, Lib.SOP.SAP.Helpers.GetPossibleSalesAreasFilter(true));
            }
            let queryFilterString = queryFilter.toString();
            let results = Lib.SOP.Helpers.QueryDB(Lib.SOP.Tables.Partners.tableName, queryFilterString, "*", 1);
            b = results.length > 0;
        }
        this._logger.Info("ArePartners returned " + b);
        return b;
    },
    QuerySoldToAddressByCustomerNumber: function (customerNumber) {
        this._logger.Enter("QuerySoldToAddressByCustomerNumber");
        let queryFilter = Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.Customers.number, customerNumber);
        if (Lib.SOP.Helpers.IsERP("SAP") || Lib.SOP.Helpers.IsERP("Asynchronous SAP Integration")) {
            queryFilter = Sys.Helpers.LdapUtil.FilterAnd(queryFilter, Lib.SOP.SAP.Helpers.GetPossibleSalesAreasFilter(true));
        }
        queryFilter = Lib.SOP.Helpers.joinFilterWithExtraFilter(queryFilter, CustomerOrderProcessing.Extraction.UserExit.GetSoldToExtraFilter(false), true);
        this._logger.Info("filter: " + queryFilter);
        let results = Lib.SOP.Helpers.QueryDB(Lib.SOP.Tables.Customers.tableName, queryFilter, "*", 2);
        let count = results.length;
        if (results.length === 0) {
            this._logger.Info("'" + Lib.SOP.Tables.Customers.tableName + "' query returned no result for customer " + customerNumber);
            if (Lib.SOP.Helpers.IsERP("SAP")) {
                // QUERY SAP
                this._logger.Info("Retrying in SAP...");
                let soldToExtraFilter = CustomerOrderProcessing.Extraction.UserExit.GetSoldToExtraFilter(true);
                let analyseResultSoldToExtraFilter = Sys.Helpers.LDAPFilterAnalyzer.AnalyzeLDAPFilter(soldToExtraFilter);
                // We expect to have a SAP filter, but we got a LDAP one
                if (analyseResultSoldToExtraFilter && !analyseResultSoldToExtraFilter.ErrorMessage) {
                    this._logger.Warn("Exclude LDAP extra filter for SAP query. You should update GetSoldToExtraFilter user exit implementation.");
                    soldToExtraFilter = "";
                }
                results = this.QuerySAPCustomerTableByNumber(customerNumber, Lib.SOP.Helpers.GetOrder().GetSoldToExtraFields, soldToExtraFilter);
                if (Sys.Helpers.SAP.GetLastError() === "SQL_SYNTAX_ERROR" && soldToExtraFilter) {
                    this._logger.Warn("Exclude bad extra filter for SAP query. You should update GetSoldToExtraFilter user exit implementation.");
                    results = this.QuerySAPCustomerTableByNumber(customerNumber, Lib.SOP.Helpers.GetOrder().GetSoldToExtraFields);
                }
                let filteredResults = this.GetOnlyCustomersInAllowedSalesAreas(results);
                count = filteredResults.length;
                if (filteredResults[0]) {
                    this.SetSoldToAddressFromSAPQuery(filteredResults[0]);
                }
                else {
                    this._logger.Info("Query in SAP returned no result");
                }
            }
        }
        else {
            this.SetSoldToAddressFromQuery(results[0]);
        }
        this._logger.Exit();
        return count;
    },
    QuerySAPCustomerTableByNumber: function (customerNumber, getExtraFields, extraFilter) {
        let customerSAPTable = Lib.SOP.SAP.Tables.customerTable;
        let filter = customerSAPTable.number + " = '" + Sys.Helpers.String.SAP.NormalizeID(customerNumber, 10, false, true) + "'";
        filter = Lib.SOP.Helpers.joinFilterWithExtraFilter(filter, extraFilter, false).toString();
        let fields = [customerSAPTable.number, customerSAPTable.name, customerSAPTable.name2, customerSAPTable.street, customerSAPTable.zipCode, customerSAPTable.city, customerSAPTable.region, customerSAPTable.countryCode];
        let extraFields = getExtraFields ? getExtraFields(customerSAPTable.tableName) : null;
        return Sys.OM.SAP.Query(customerSAPTable.tableName, Lib.SOP.MergeExtraFields(fields, extraFields), filter, 1);
    },
    QuerySAPPartnerTable: function (partnerNumber, customerNumber) {
        let partnerSAPTable = Lib.SOP.SAP.Tables.partnerTable;
        let filter;
        if (CustomerOrderProcessing.Extraction.UserExit.UnlinkSoldToShipTo()) {
            filter = partnerSAPTable.customerPartnerNumber + " = '" + Sys.Helpers.String.SAP.NormalizeID(partnerNumber, 10, false, true)
                + "' AND " + partnerSAPTable.partnerFunction + " = 'WE'";
        }
        else {
            filter = partnerSAPTable.customerPartnerNumber + " = '" + Sys.Helpers.String.SAP.NormalizeID(partnerNumber, 10, false, true)
                + "' AND " + partnerSAPTable.customerNumber + " = '" + Sys.Helpers.String.SAP.NormalizeID(customerNumber, 10, false, true)
                + "' AND " + partnerSAPTable.partnerFunction + " = 'WE'";
        }
        let fields = [
            partnerSAPTable.salesOrganization,
            partnerSAPTable.distributionChannel,
            partnerSAPTable.businessArea
        ].join("|");
        return Sys.OM.SAP.Query(partnerSAPTable.tableName, fields, filter, 50);
    },
    GetOnlyCustomersInAllowedSalesAreas: function (customersQueryResults) {
        let customerFilteredQueryResults = [];
        let customerSalesDataTable = Lib.SOP.SAP.Tables.customerSalesDataTable;
        let authorizedSalesAreas = Lib.SOP.SAP.Helpers.GetPossibleSalesAreasArray();
        for (let i = 0; i < customersQueryResults.length; i++) {
            let customerQueryVars = customersQueryResults[i];
            let filter = "";
            for (let salesAreaIndex = 0; salesAreaIndex < authorizedSalesAreas.length; salesAreaIndex++) {
                filter += "(" + customerSalesDataTable.customerNumber + " = '" + customerQueryVars[Lib.SOP.SAP.Tables.customerTable.number]
                    + "'\n AND " + customerSalesDataTable.salesOrg + " = '" + authorizedSalesAreas[salesAreaIndex].salesOrg
                    + "'\n AND " + customerSalesDataTable.distChannel + " = '" + authorizedSalesAreas[salesAreaIndex].distChan
                    + "'\n AND " + customerSalesDataTable.division + " = '" + authorizedSalesAreas[salesAreaIndex].businessArea;
                if (salesAreaIndex === authorizedSalesAreas.length - 1) {
                    filter += "')";
                }
                else {
                    filter += "') OR ";
                }
            }
            let fields = customerSalesDataTable.customerNumber;
            let queryResults = Sys.OM.SAP.Query(customerSalesDataTable.tableName, fields, filter, 1);
            if (queryResults.length <= 0) {
                continue;
            }
            customerFilteredQueryResults.push(customerQueryVars);
        }
        return customerFilteredQueryResults;
    },
    SetSoldToAddressFromQuery: function (customerQueryVars) {
        let customerTable = Lib.SOP.Tables.Customers;
        this.FoundSoldToAddress.Number = customerQueryVars.GetValue_String(customerTable.number, 0);
        this.FoundSoldToAddress.Name = customerQueryVars.GetValue_String(customerTable.name, 0);
        this.FoundSoldToAddress.tableName = customerTable.tableName;
        this.FoundSoldToAddress.salesRepID = customerQueryVars.GetValue_String(customerTable.salesRepID, 0);
        this.FoundSoldToStandardFields = Lib.SOP.GetExtraFieldsValues(Lib.SOP.Helpers.GetOrder().GetSoldToStandardFields(customerTable), customerQueryVars, false);
        this.FoundSoldToExtraFields = Lib.SOP.GetExtraFieldsValues(Lib.SOP.Helpers.GetOrder().GetSoldToExtraFields(customerTable.tableName), customerQueryVars, false);
    },
    SetSoldToAddressFromSAPQuery: function (customerQueryVars) {
        let customerSAPTable = Lib.SOP.SAP.Tables.customerTable;
        this.FoundSoldToAddress.Number = Lib.SOP.SAP.Helpers.FormatID(customerQueryVars[customerSAPTable.number]);
        this.FoundSoldToAddress.Name = customerQueryVars[customerSAPTable.name];
        this.FoundSoldToAddress.tableName = customerSAPTable.tableName;
        this.FoundSoldToStandardFields = Lib.SOP.GetExtraFieldsValues(Lib.SOP.Helpers.GetOrder().GetSoldToStandardFields(customerSAPTable), customerQueryVars, true);
        this.FoundSoldToExtraFields = Lib.SOP.GetExtraFieldsValues(Lib.SOP.Helpers.GetOrder().GetSoldToExtraFields(customerSAPTable.tableName), customerQueryVars, true);
    },
    FindShipToAddressInPartners: function (partnerSearchInfo) {
        this._logger.Enter("FindShipToAddressInPartners");
        if (!partnerSearchInfo ||
            (partnerSearchInfo.CustomerNumber == null && partnerSearchInfo.Number == null) ||
            (partnerSearchInfo.Number == null && CustomerOrderProcessing.Extraction.UserExit.UnlinkSoldToShipTo())) {
            this._logger.Info("Arguments are invalid");
            return 0;
        }
        let tableName = Lib.SOP.Tables.Partners.tableName;
        let customerNumber = partnerSearchInfo.CustomerNumber;
        let partnerNumber = partnerSearchInfo.Number;
        if (Lib.SOP.Helpers.IsERP("Oracle EBS") && customerNumber) {
            customerNumber = g_erpOrderDocument.getCustomerNumberWithoutLocation(customerNumber);
        }
        const filterList = [];
        if (partnerNumber != null) {
            filterList.push(Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.Partners.number, partnerNumber));
        }
        if (customerNumber != null && !CustomerOrderProcessing.Extraction.UserExit.UnlinkSoldToShipTo()) {
            filterList.push(Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.Partners.customerNumber, customerNumber));
        }
        if (Lib.SOP.Helpers.IsERP("SAP") || Lib.SOP.Helpers.IsERP("Asynchronous SAP Integration")) {
            filterList.push(Lib.SOP.SAP.Helpers.GetPossibleSalesAreasFilter(true));
        }
        let queryFilter = filterList.length === 1 ? filterList[0] : Sys.Helpers.LdapUtil.FilterAnd(...filterList);
        queryFilter = Lib.SOP.Helpers.joinFilterWithExtraFilter(queryFilter, CustomerOrderProcessing.Extraction.UserExit.GetShipToExtraFilter(false), true);
        this._logger.Info("filter: " + queryFilter);
        let partners = Lib.SOP.Helpers.QueryDB(tableName, queryFilter.toString(), "*", 2);
        let partnersCount = partners.length;
        if (partnersCount === 0) {
            this._logger.Info("'" + tableName + "' query returned no result");
            if (Lib.SOP.Helpers.IsERP("SAP")) {
                // QUERY SAP
                this._logger.Info("Retrying in SAP...");
                let sapNumber = partnerNumber != null ? partnerNumber : customerNumber;
                let shipToExtraFilter = CustomerOrderProcessing.Extraction.UserExit.GetShipToExtraFilter(true);
                let analyseResultShipToExtraFilter = Sys.Helpers.LDAPFilterAnalyzer.AnalyzeLDAPFilter(shipToExtraFilter);
                // We expect to have a SAP filter, but we got a LDAP one
                if (analyseResultShipToExtraFilter && !analyseResultShipToExtraFilter.ErrorMessage) {
                    this._logger.Warn("Exclude LDAP filter for SAP query. You should update GetShipToExtraFilter user exit implementation.");
                    shipToExtraFilter = "";
                }
                partners = this.QuerySAPCustomerTableByNumber(sapNumber, Lib.SOP.Helpers.GetOrder().GetShipToExtraFields, shipToExtraFilter);
                if (Sys.Helpers.SAP.GetLastError() === "SQL_SYNTAX_ERROR" && shipToExtraFilter) {
                    this._logger.Warn("Exclude bad extra filter for SAP query. You should update GetShipToExtraFilter user exit implementation.");
                    partners = this.QuerySAPCustomerTableByNumber(sapNumber, Lib.SOP.Helpers.GetOrder().GetShipToExtraFields);
                }
                let filteredPartners = this.GetOnlyCustomersInAllowedSalesAreas(partners);
                partnersCount = filteredPartners.length;
                if (partnersCount > 0 && partnerNumber != null && customerNumber != null) {
                    let shipToSoldToRelationship = this.QuerySAPPartnerTable(partnerNumber, customerNumber);
                    if (shipToSoldToRelationship.length <= 0) {
                        this._logger.Info("No relationship in between partner and customer...");
                        filteredPartners = [];
                        partnersCount = 0;
                    }
                }
                if (filteredPartners[0]) {
                    this.SetFoundShipToAddressFromSAPQuery(filteredPartners[0], customerNumber);
                }
                else {
                    this._logger.Info("Query in SAP returned no result");
                }
            }
        }
        else {
            this._logger.Info("" + tableName + "' query returned " + partnersCount + " results");
            this.SetFoundShipToAddressFromQuery(partners[0]);
        }
        this._logger.Exit();
        return partnersCount;
    },
    FillDataForShipToAddress: function () {
        if (!this.FoundShipToAddress.IsFound()) {
            return;
        }
        this._logger.Info("Set shipto : ", this.FoundShipToAddress.Number);
        Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "ShipToNumber__", this.FoundShipToAddress.Number, this.FoundShipToAddress.tableName);
        Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "ShipToName__", this.FoundShipToAddress.Name, this.FoundShipToAddress.tableName);
        Lib.SOP.Helpers.FillExtraFieldsValues(this.FoundShipToStandardFields, this.FoundShipToAddress.tableName);
        Lib.SOP.Helpers.FillExtraFieldsValues(this.FoundShipToExtraFields, this.FoundShipToAddress.tableName);
        CustomerOrderProcessing.Extraction.UserExit.OnShipToChange();
    },
    FillDataForSoldToAddress: function () {
        if (!this.FoundSoldToAddress.IsFound()) {
            return;
        }
        this._logger.Info("Set SoldTo : ", this.FoundSoldToAddress.Number);
        Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "CustomerNumber__", this.FoundSoldToAddress.Number, this.FoundSoldToAddress.tableName);
        Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "CustomerName__", this.FoundSoldToAddress.Name, this.FoundSoldToAddress.tableName);
        Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "SalesRepID__", this.FoundSoldToAddress.salesRepID, this.FoundSoldToAddress.tableName);
        Lib.SOP.Helpers.FillExtraFieldsValues(this.FoundSoldToStandardFields, this.FoundSoldToAddress.tableName);
        Lib.SOP.Helpers.FillExtraFieldsValues(this.FoundSoldToExtraFields, this.FoundSoldToAddress.tableName);
        CustomerOrderProcessing.Extraction.UserExit.OnCustomerChange();
    },
    HlcColorCode: 0xff0000,
    HlbcColorCode: 0xffffff,
    HighlightSoldToAreas: function (areas) {
        if (!this.FoundSoldToAddress.IsFound() || !areas) {
            return;
        }
        this.HighLightAreas(areas, true, this.HlcColorCode, this.HlbcColorCode, "CustomerName__");
        this.HighLightAreas(areas, true, this.HlcColorCode, this.HlbcColorCode, "CustomerNumber__");
    },
    FillAndHighlightDropShipAddress: function (dropShipAddress, addressDocumentArea) {
        this.FillAndHighlightDropShipAddressElement("DropShipToAddress_Name__", dropShipAddress.Name, addressDocumentArea);
        if (Lib.SOP.Helpers.IsERP("SAP")) {
            this.FillAndHighlightDropShipAddressElement("DropShipToAddress_Name2__", dropShipAddress.Name2, addressDocumentArea);
        }
        this.FillAndHighlightDropShipAddressElement("DropShipToAddress_Street__", dropShipAddress.Street, addressDocumentArea);
        this.FillAndHighlightDropShipAddressElement("DropShipToAddress_PostalCode__", dropShipAddress.ZipCode, addressDocumentArea);
        this.FillAndHighlightDropShipAddressElement("DropShipToAddress_City__", dropShipAddress.City, addressDocumentArea);
        this.FillAndHighlightDropShipAddressElement("DropShipToAddress_Region__", dropShipAddress.Region, addressDocumentArea);
        this.FillAndHighlightDropShipAddressElement("DropShipToAddress_Country__", dropShipAddress.CountryCode, addressDocumentArea);
    },
    FillAndHighlightDropShipAddressElement: function (addressElementName, addressElementValue, addressDocumentArea) {
        if (!Data.GetValue(addressElementName)) {
            Data.SetValue(addressElementName, addressElementValue ? addressElementValue : "");
        }
        if (addressDocumentArea && addressDocumentArea.Highlight) {
            addressDocumentArea.Highlight(true, this.HlcColorCode, this.HlbcColorCode, addressElementName);
        }
    },
    CreateMatchingInfoFromExtractedText: function (pageNumber, extractedText, column, normalizeNumber) {
        let sTelOrFax;
        if (normalizeNumber) {
            sTelOrFax = FormattingTools.NormalizeTelephoneNumber(FormattingTools.FilterIncluding(extractedText, "+0123456789"), this.CultureCode);
        }
        else {
            sTelOrFax = FormattingTools.FilterIncluding(extractedText, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        }
        return {
            zone: Document.SearchString(extractedText.substr(0, 200), pageNumber, true, false)[0],
            columns: [column],
            lookupText: [sTelOrFax]
        };
    },
    FindTelFaxVatMatchingAreasWithKeywordsAndRegEx: function (pageNumber, keywords, telOrFaxRegEx, column) {
        let areasMatching = [];
        this._logger.Verbose("FindTelFaxVatMatchingAreasWithKeywordsAndRegEx " + pageNumber);
        let documentAddressZonesParams = this.GetAddressSearchZoneParams(pageNumber, ShipToSearchZoneOffsets);
        let telOrFaxZones = this.GetAddressAreasWithKeywords(pageNumber, keywords, documentAddressZonesParams);
        for (let i = 0; i < telOrFaxZones.length; i++) {
            let textOfZone = telOrFaxZones[i].toString();
            if (textOfZone != null && textOfZone.length) {
                let telOrFaxResults = telOrFaxRegEx.exec(textOfZone);
                if (telOrFaxResults != null && telOrFaxResults[0].length) {
                    let telOrFax = telOrFaxResults[0];
                    areasMatching.push(this.CreateMatchingInfoFromExtractedText(pageNumber, telOrFax, column, true));
                }
            }
        }
        return areasMatching;
    },
    FindTelFaxVatMatchingAreasWithRegEx: function (pageNumber, telFaxVatRegEx, columns, normalizeNumber) {
        let telFaxVatAreasMatching = [];
        this._logger.Verbose("FindTelFaxVatMatchingAreasWithRegEx " + pageNumber);
        let pageText = Document.GetArea(pageNumber).toString();
        let telFaxVatMatches;
        while ((telFaxVatMatches = telFaxVatRegEx.exec(pageText)) != null) {
            for (let i = 0; i < columns.length; i++) {
                telFaxVatAreasMatching.push(this.CreateMatchingInfoFromExtractedText(pageNumber, telFaxVatMatches[0], columns[i], normalizeNumber));
            }
        }
        return telFaxVatAreasMatching;
    },
    FilterValidSIRETCode: function (area) {
        return FormattingTools.ValidateSirenOrSiret(area.lookupText[0]);
    },
    GetDocumentFindTelFaxVatMatchingAreas: function () {
        let telFaxVatRules = this.GetSoldToIdentifiersExtractionRules(this.CountryCode);
        let telFaxVatMatchingAreas = [];
        if (!telFaxVatRules) {
            return telFaxVatMatchingAreas;
        }
        for (let pageNumber = 0; pageNumber < BlockAddressesInDocument.GetDocumentLastSearchPage(); pageNumber++) {
            telFaxVatMatchingAreas = telFaxVatMatchingAreas.concat(this.FindTelFaxVatMatchingAreasWithKeywordsAndRegEx(pageNumber, telFaxVatRules.keywordsFax, telFaxVatRules.telRegExp, "Fax__"));
            telFaxVatMatchingAreas = telFaxVatMatchingAreas.concat(this.FindTelFaxVatMatchingAreasWithKeywordsAndRegEx(pageNumber, telFaxVatRules.keywordsTel, telFaxVatRules.telRegExp, "Phone__"));
            telFaxVatMatchingAreas = telFaxVatMatchingAreas.concat(this.FindTelFaxVatMatchingAreasWithRegEx(pageNumber, telFaxVatRules.faxOrTelRegExp, ["Phone__", "Fax__"], true));
            telFaxVatMatchingAreas = telFaxVatMatchingAreas.concat(this.FindTelFaxVatMatchingAreasWithRegEx(pageNumber, telFaxVatRules.vatCodeRegExp, ["VAT_number__"], false));
            if (this.CountryCode === "FR") {
                telFaxVatMatchingAreas = telFaxVatMatchingAreas.concat(this.FindTelFaxVatMatchingAreasWithRegEx(pageNumber, telFaxVatRules.SIRENRegExp, ["Tax_code_1__"], false).filter(this.FilterValidSIRETCode));
            }
        }
        return telFaxVatMatchingAreas;
    },
    GetSoldToIdentifiersExtractionRules: function (sCountryCode) {
        let keywordsTel;
        let keywordsFax;
        let telRegExp;
        let faxOrTelRegExp;
        let vatCodeRegExp;
        switch (sCountryCode) {
            case "US":
            case "CA":
                {
                    telRegExp = /[0-9\+\-\(\)/ \.]{9,}[0-9]/mg;
                    keywordsTel = ["right:Telephone", "right:Phone", "right:Tel", "right:P:"];
                    keywordsFax = ["right:FACSIMILE", "right:Fax", "right:F:"];
                    faxOrTelRegExp = /\(?[0-9]{3}\)?[\- \.]?[0-9]{3}[\- \.]?[0-9]{4}/mg;
                    vatCodeRegExp = /(GB)[ ]?(([0-9]{3}[ ]?[0-9]{4}[ ]?[0-9]{2}[ ]?([0-9]{3})?)|(((GD)|(HA))[0-9]{3}))/mg;
                }
                break;
            case "MX":
                {
                    telRegExp = /[0-9\+\-\(\)/ \.]{9,}[0-9]/mg;
                    keywordsTel = ["right:Telefono", "below:Telefono", "right:Teléfono", "below:Teléfono", "right:Telef", "below:Telef"];
                    keywordsFax = ["right:Fax", "below:Fax"];
                    faxOrTelRegExp = /((\+?(52))|0)[0-9\-\(\)/ \.]{9,}[0-9]/mg;
                    vatCodeRegExp = /[0-9a-zA-Z]{3}[ \-]?[0-9]{6}[ \-]?[0-9a-zA-Z]{3}/mg;
                }
                break;
            case "FR":
                {
                    telRegExp = /[0-9\+\-\(\)/ \.]{9,}[0-9]/mg;
                    keywordsTel = ["right:Téléphone", "below:Téléphone", "right:Tel", "below:Tel", "right:Tél", "below:Tél"];
                    keywordsFax = ["right:Télécopie", "below:Télécopie", "right:Fax", "below:Fax"];
                    faxOrTelRegExp = /((\+?(33))|0)[0-9\-\(\)/ \.]{9,}[0-9]/mg;
                    vatCodeRegExp = /((FR)[ ]?([0-9]{2}[ ]?)?[0-9]{3}[ ]?[0-9]{3}[ ]?[0-9]{3})|((BE)0?[0-9]{3}[ \.]?[0-9]{3}[ \.]?[0-9]{3})/mg;
                }
                break;
            case "GB":
                {
                    telRegExp = /[0-9\+\-\(\)/ \.]{9,}[0-9]/mg;
                    keywordsTel = ["right:Telephone", "right:Phone", "right:Tel", "right:Tel. :", "right:P:"];
                    keywordsFax = ["right:FACSIMILE", "right:Fax", "right:Fax. :", "right:F:"];
                    faxOrTelRegExp = /((\+?(44))|0)[0-9\-\(\)/ \.]{9,}[0-9]/mg;
                    vatCodeRegExp = /(GB)[ ]?(([0-9]{3}[ ]?[0-9]{4}[ ]?[0-9]{2}[ ]?([0-9]{3})?)|(((GD)|(HA))[0-9]{3}))/mg;
                }
                break;
            case "AU":
                {
                    telRegExp = /[0-9\+\-\(\)/ \.]{9,}[0-9]/mg;
                    keywordsTel = ["right:Telephone", "right:Phone", "right:Tel", "right:P:", "right:Ph:", "right:P", "right:Ph", "right:Contact Number", "right:Contact [N]o"];
                    keywordsFax = ["right:FACSIMILE", "right:Fax", "right:F:", "right:Fx:"];
                    faxOrTelRegExp = /((\+?(61))|0)[0-9\-\(\)\/ \.]{9,}[0-9]/mg;
                    vatCodeRegExp = /[0-9]{2}[ \-]?[0-9]{3}[ \-]?[0-9]{3}[ \-]?[0-9]{3}/mg;
                }
                break;
            case "NZ":
                {
                    telRegExp = /[0-9\+\-\(\)/ \.]{9,}[0-9]/mg;
                    keywordsTel = ["right:Telephone", "right:Phone", "right:Tel", "right:P:", "right:Ph:", "right:P", "right:Ph", "right:Contact Number", "right:Contact [N]o"];
                    keywordsFax = ["right:FACSIMILE", "right:Fax", "right:F:", "right:Fx:"];
                    faxOrTelRegExp = /((\+?(64))|0)[0-9\-\(\)\/ \.]{8,}[0-9]/mg;
                    vatCodeRegExp = /[0-9]{2,3}[ \-]?[0-9]{3}[ \-]?[0-9]{3}/mg;
                }
                break;
            case "DE":
                {
                    keywordsTel = ["right:Telefon Nummer", "right:Telefonnummer", "right:Telefonnr.", "right:Telefon-Nr.", "right:Telefon Nr.", "right:Tel. Nummer", "right:Tel Nummer", "right:Tel.nummer", "right:Tel.-Nr.", "right:Tel. Nr.", "below:Telefonnummer", "below:Telefonnr.", "below:Telefon Nummer", "below:Telefon Nr.", "below:Telefon-Nr.", "below:Telefon", "below:Tel. Nummer", "below:Tel.-Nr.", "below:Tel. Nr.", "below:Tel."];
                    keywordsFax = ["right:Telefax Nummer", "right:Telefaxnummer", "right:Telefaxnr.", "right:Telefax", "right:faxnummer", "right:Faxnr.", "right:Fax Nummer", "right:Fax Nr.", "right:fax. Nummer", "right:fax. Nr.", "right:fax.-Nr.", "right:Fax-Nr.", "right:fax.", "right:Fax", "below:Unsere telefaxnummer", "below:Unsere faxnummer", "below:Unsere Telefaxnr.", "below:Unsere Faxnr.", "below:Telefax Nummer", "below:Telefaxnummer", "below:Telefaxnr.", "below:faxnummer", "below:Faxnr.", "below:Fax Nummer", "below:Fax Nr.", "below:fax. Nummer", "below:fax. Nr.", "below:fax.-Nr.", "below:Fax-Nr.", "below:Telefax", "below:fax.", "below:Fax"];
                    telRegExp = /[0-9\+\-\(\)/ \.]{5,}[0-9]/mg;
                    faxOrTelRegExp = /((\+?(49))|0)[0-9\-\(\)/ \.]{5,}[0-9]/mg;
                    vatCodeRegExp = /((DE)[ ]?[0-9]{3}[ ]?[0-9]{3}[ ]?[0-9]{3})|((ATU)[ ]?[0-9]{8})/mg;
                }
                break;
            case "IT":
                {
                    keywordsTel = ["right:Telefono", "below:Telefono", "right:Tel.", "below:Tele."];
                    keywordsFax = ["right:telefax", "right:fax", "below:telefax", "below:fax"];
                    telRegExp = /[0-9\+\-\(\)/ \.]{7,}[0-9]/mg;
                    faxOrTelRegExp = /((\+?(39))|0)[0-9\-\(\)/ \.]{7,}[0-9]/mg;
                    vatCodeRegExp = /(IT)?[ ]?[0-9]{11}/mg;
                }
                break;
            case "ES":
                {
                    keywordsFax = ["right:Telephone", "below:fax numero", "right:fax nÂº", "below:fax nÂº", "right:fax", "below:fax"];
                    keywordsTel = ["right:Telefono", "below:Telefono", "right:Telef", "below:Telef"];
                    telRegExp = /[0-9\+\-\(\)/ \.]{8,}[0-9]/mg;
                    faxOrTelRegExp = /((\+?(34))|0)[0-9\-\(\)/ \.]{8,}[0-9]/mg;
                    vatCodeRegExp = /(ES)[ ]?(([A-Z][0-9]{7}[A-Z0-9])|([0-9]{8}[A-Z]))/mg;
                }
                break;
            default:
                Log.Error("Unknown ContryCode:" + sCountryCode);
                return null;
        }
        return {
            keywordsTel: keywordsTel,
            keywordsFax: keywordsFax,
            telRegExp: telRegExp,
            faxOrTelRegExp: faxOrTelRegExp,
            vatCodeRegExp: vatCodeRegExp,
            SIRENRegExp: /([0-9]{14})|([0-9]{3}[ ]?[0-9]{3}[ ]?[0-9]{3})/mg
        };
    },
    FtsAdvancedQuery: {
        GetDocumentAreasValidatingFtsQueryResults: function (queryVars, documentAreas) {
            // Finds the document areas with words that are contained in any column of the query data
            // Reminder, columns : ["Zip_code__", "Street__", "Region__", "City__", "Name__"]
            let areas = [];
            for (let i = 0; i < documentAreas.length; i++) {
                let documentArea = documentAreas[i];
                for (let j = 0; j < documentArea.columns.length; j++) {
                    let columnName = documentArea.columns[j];
                    let columnValue = queryVars.GetValue_String(columnName, 0);
                    let areaWords = FormattingTools.SplitWords(documentArea.lookupText[j]);
                    for (let k = 0; k < areaWords.length; k++) {
                        let word = areaWords[k];
                        if (columnValue.indexOf(word) !== -1) {
                            areas.push(documentArea);
                        }
                    }
                }
            }
            return areas;
        },
        GetQueryFilter: function (matchingAreas) {
            let words = [];
            for (let i = 0; i < matchingAreas.length; i++) {
                let matchingArea = matchingAreas[i];
                for (let j = 0; j < matchingArea.lookupText.length; j++) {
                    let text = matchingArea.lookupText[j];
                    words.push(...FormattingTools.SplitWords(text));
                }
            }
            const filter = Sys.Helpers.LdapUtil.FilterFuzzy(words, {
                strictEscape: true,
                splitWords: true,
                removeOneLetterWord: true
            });
            if (g_logDebugFtsQueryFilter) {
                this._logger.Verbose("Query Filter = " + filter);
            }
            return filter;
        },
        QueryWithDocumentData: function (tableName, matchingAreas, resultsLimit) {
            let results = [];
            let noResults = {
                QueryVars: null,
                HighlightingAreas: []
            };
            if (matchingAreas.length <= 0) {
                return noResults;
            }
            if (g_logDebugFtsQueryFilter) {
                this._logger.Verbose("FtsAdvancedQuery.QueryWithDocumentData");
            }
            let queryFilter = this.GetQueryFilter(matchingAreas);
            queryFilter = Lib.SOP.Helpers.GetOrder().getFTRQueryFilter(queryFilter);
            if (Lib.SOP.Helpers.IsERP("SAP") || Lib.SOP.Helpers.IsERP("Asynchronous SAP Integration")) {
                queryFilter = Lib.SOP.Helpers.joinFilterWithExtraFilter(queryFilter, Lib.SOP.SAP.Helpers.GetPossibleSalesAreasFilter(true), true);
            }
            if (tableName === "SO - Customers__") {
                queryFilter = Lib.SOP.Helpers.joinFilterWithExtraFilter(queryFilter, CustomerOrderProcessing.Extraction.UserExit.GetSoldToExtraFilter(false), true);
            }
            else if (tableName === "SO - Partners__") {
                queryFilter = Lib.SOP.Helpers.joinFilterWithExtraFilter(queryFilter, CustomerOrderProcessing.Extraction.UserExit.GetShipToExtraFilter(false), true);
            }
            Query.Reset();
            Query.SetAttributesList("*");
            Query.SetSpecificTable(tableName);
            Query.SetFilter(Lib.SOP.DataFilteringKey.ExtendFilterWithDataFilteringKey(tableName, queryFilter).toString());
            if (!Query.MoveFirst()) {
                return noResults;
            }
            let queryResult;
            let readRecordCount = 0;
            while ((queryResult = Query.MoveNextRecord()) != null && readRecordCount < g_MaxReadRecord) {
                readRecordCount++;
                let queryVars = queryResult.GetVars();
                let validatingAreas = this.GetDocumentAreasValidatingFtsQueryResults(queryVars, matchingAreas);
                if (validatingAreas.length > 0 && results.length < resultsLimit) {
                    results.push({
                        QueryVars: queryVars,
                        HighlightingAreas: validatingAreas
                    });
                }
            }
            return results;
        }
    },
    TryFillShipToAndSoldToWithFirstTimeRecognition: function () {
        this._logger.Enter("TryFillShipToAndSoldToWithFirstTimeRecognition");
        if (this.InputShipToAddress || this.InputSoldToAddress) {
            this._logger.Info("Don't run FTR if address helpers are utilized");
            this._logger.Exit();
            return;
        }
        this.ResetFoundShipToSoldToAddresses();
        let soldToShipToMatchResult = this.FindShipToSoldToWithFtrMatch();
        let matches = soldToShipToMatchResult.Matches;
        let matchesCount = matches.length;
        this._logger.Info("matchesCount=" + matchesCount);
        if (matchesCount !== 0) {
            let match = matches[0];
            this.FillSoldToAndShipToWithFtrMatch(match.SoldTo, match.ShipTo, matches);
            this._logger.Exit();
            return;
        }
        this.FillSoldToAndShipToWithoutFtrMatch(soldToShipToMatchResult.SoldToCandidates, soldToShipToMatchResult.ShipToCandidates);
        this._logger.Exit();
    },
    FillSoldToAndShipToWithFtrMatch: function (soldTo, shipTo, matches) {
        this._logger.Enter("FillSoldToAndShipToWithFtrMatch");
        this._logger.Verbose("FillSoldToAndShipToWithFtrMatch: Customer found: " + soldTo.Number);
        this.SetSoldToAddressFromQuery(soldTo.QueryVars);
        this.FillDataForSoldToAddress();
        this.HighlightSoldToAreas(soldTo.HighlightingAreas.map(function (x) {
            return x.zone;
        }));
        this._logger.Verbose("FillSoldToAndShipToWithFtrMatch: Partner found: " + shipTo.Number);
        this.SetFoundShipToAddressFromQuery(shipTo.QueryVars);
        this.FillDataForShipToAddress();
        this.HighlightShipToAreas(shipTo.HighlightingAreas.map(function (x) {
            return x.zone;
        }));
        if (matches.length > 1) {
            let uniqueSoldTo = this.IsUniqueSoldToFromCandidateMatches(matches);
            if (uniqueSoldTo) {
                // multiple candidates having all the same soldTo and and at least 2 different shipTos
                this._logger.Info("FillSoldToAndShipToWithFtrMatch: Multiple candidates");
                Data.SetWarning("ShipToNumber__", "Multiple candidates");
            }
            else {
                // multiple candidates having at least 2 different soldTos
                this._logger.Info("FillSoldToAndShipToWithFtrMatch: Multiple SoldTo and ShipTo candidates");
                Data.SetWarning("ShipToNumber__", "_Multiple shipping addresses");
                Data.SetWarning("CustomerNumber__", "_Multiple customers");
            }
        }
        this._logger.Exit();
    },
    IsUniqueSoldToFromCandidateMatches: function (matches) {
        if (matches.length === 0) {
            return false;
        }
        if (matches.length === 1) {
            return true;
        }
        let soldTo0 = matches[0].SoldTo;
        for (let index = 1; index < matches.length; index++) {
            if (matches[index].SoldTo !== soldTo0) {
                return false;
            }
        }
        return true;
    },
    GetCountAndFirstSoldToWithPhoneFaxOrVatSource: function (soldToCandidates) {
        let result = {
            Count: 0,
            First: null
        };
        for (let i = 0; i < soldToCandidates.length; i++) {
            if (soldToCandidates[i].SoldToShipToDocumentSource === SoldToShipToDocumentSource.PhoneFaxOrVat) {
                result.Count++;
                if (!result.First) {
                    result.First = soldToCandidates[i];
                }
            }
        }
        return result;
    },
    FillSoldToAndShipToWithoutFtrMatch: function (soldToCandidates, shipToCandidates) {
        this._logger.Enter("FillSoldToAndShipToWithoutFtrMatch");
        let shipToCandidatesCount = shipToCandidates.length;
        let shipToCandidateFirst = shipToCandidates[0];
        let soldToWithPhoneFaxOrVatSource = this.GetCountAndFirstSoldToWithPhoneFaxOrVatSource(soldToCandidates);
        let soldToCandidatesCount = soldToWithPhoneFaxOrVatSource.Count;
        let soldToCandidateFirst = soldToWithPhoneFaxOrVatSource.First;
        if (soldToCandidatesCount === 1) {
            let customerNumber = soldToCandidateFirst.Number;
            this._logger.Info("Customer found: " + customerNumber);
            this.SetSoldToAddressFromQuery(soldToCandidateFirst.QueryVars);
            this.HighlightSoldToAreas(soldToCandidateFirst.HighlightingAreas.map(function (x) {
                return x.zone;
            }));
            this.FillDataForSoldToAddress();
            let filterInfo = { CustomerNumber: customerNumber };
            let partnersCount = this.FindShipToAddressInPartners(filterInfo);
            if (partnersCount === 1) {
                this._logger.Info("One partner found for customer number " + customerNumber);
                this.FillDataForShipToAddress();
            }
            else if (partnersCount > 1) {
                this._logger.Info("Several partners found for customer number " + customerNumber);
            }
            this._logger.Exit();
            return;
        }
        if (shipToCandidatesCount >= 1) {
            this._logger.Info("found " + shipToCandidatesCount + " ShipTo candidates");
            this.FindAndFillShipToAndSoldToFromShipToFtsResult(shipToCandidateFirst);
            this._logger.Exit();
            return;
        }
        if (shipToCandidatesCount === 0) {
            this._logger.Info("No ShipTo candidate");
            let shipToByKeyWord = this.GetFtrShipToFirstCandidateNearKeywordsWithoutPostalCode();
            if (shipToByKeyWord) {
                this.FindAndFillShipToAndSoldToFromShipToFtsResult(shipToByKeyWord);
            }
        }
        this._logger.Exit();
    },
    FindAllSoldToFromAccountNumberInOracle: function (customerNumber) {
        let customerNumberWithLocation = customerNumber + "/*";
        let filter = Sys.Helpers.LdapUtil.FilterAnd(Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.Customers.number, customerNumberWithLocation), Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.Customers.organizationID, Data.GetValue("OrgId__")));
        // Get all the customers that can be linked to this Partner
        let queryRes = Lib.SOP.Helpers.QueryDB(Lib.SOP.Tables.Customers.tableName, filter, Lib.SOP.Tables.Customers.number, 10);
        let customerNumberList = [];
        for (let resIndex = 0; resIndex < queryRes.length; resIndex++) {
            customerNumberList.push(queryRes[resIndex].GetValue_String(Lib.SOP.Tables.Customers.number, 0));
        }
        return customerNumberList;
    },
    FindAndFillShipToAndSoldToFromShipToFtsResult: function (shipToFtQueryResult) {
        Log.Info("[FindAndFillShipToAndSoldToFromShipToFtsResult] begin");
        let customerNumber = shipToFtQueryResult.CustomerNumber;
        if (Lib.SOP.Helpers.IsERP("Oracle EBS")) {
            let customerNumberList = this.FindAllSoldToFromAccountNumberInOracle(customerNumber);
            if (customerNumberList.length === 0) {
                Log.Info("[FindAndFillShipToAndSoldToFromShipToFtsResult] No customer found with customer number: " + customerNumber);
                return;
            }
            if (customerNumberList.length > 1) {
                Data.SetError("CustomerNumber__", "Multiple SoldTo and ShipTo candidates");
            }
            customerNumber = customerNumberList[0];
            Log.Info("[FindAndFillShipToAndSoldToFromShipToFtsResult] " + customerNumberList.length + " customers found with customer number: " + customerNumber);
        }
        Log.Info("[FindAndFillShipToAndSoldToFromShipToFtsResult] Parner found: " + shipToFtQueryResult.Number);
        this.SetFoundShipToAddressFromQuery(shipToFtQueryResult.QueryVars);
        this.FillDataForShipToAddress();
        this.HighlightShipToAreas(shipToFtQueryResult.HighlightingAreas.map(function (x) {
            return x.zone;
        }));
        Log.Info("[FindAndFillShipToAndSoldToFromShipToFtsResult] Customer found: " + customerNumber);
        this.QuerySoldToAddressByCustomerNumber(customerNumber);
        this.FillDataForSoldToAddress();
        Log.Info("[FindAndFillShipToAndSoldToFromShipToFtsResult] end");
    },
    ComputeShipToSoldToFtsQueryResultScore: function (ftsQueryResult, lookupWords) {
        let addressKeyPropertiesValue = [];
        if (ftsQueryResult.Name) {
            addressKeyPropertiesValue.push(ftsQueryResult.Name.toUpperCase());
            // double name weighting in computing score
            addressKeyPropertiesValue.push(addressKeyPropertiesValue[0]);
        }
        if (ftsQueryResult.Street) {
            addressKeyPropertiesValue.push(ftsQueryResult.Street.toUpperCase());
        }
        if (ftsQueryResult.ZipCode) {
            addressKeyPropertiesValue.push(ftsQueryResult.ZipCode.toUpperCase());
        }
        if (ftsQueryResult.City) {
            addressKeyPropertiesValue.push(ftsQueryResult.City.toUpperCase());
        }
        let addressWords = FormattingTools.SplitWords(addressKeyPropertiesValue.join(" "));
        let nbMatchingWords = 0;
        let nbTotalWords = 0;
        for (let i = 0; i < addressWords.length; i++) {
            if (addressWords[i].length >= 2) {
                if (lookupWords.indexOf(addressWords[i]) !== -1) {
                    nbMatchingWords++;
                }
                nbTotalWords++;
            }
        }
        return nbMatchingWords / nbTotalWords;
    },
    CompareAddressBlocksScores: function (a, b) {
        return b.score - a.score;
    },
    SortShipToSoldToFtsQueryResult: function (ftsQueryResult) {
        for (let i = 0; i < ftsQueryResult.length; i++) {
            let lookupText = "";
            let areas = ftsQueryResult[i].HighlightingAreas;
            if (areas && areas[0].lookupText && areas[0].lookupText.length) {
                for (let j = 0; j < areas[0].lookupText.length; j++) {
                    lookupText = lookupText.concat(areas[0].lookupText[j].toUpperCase()).concat(" ");
                }
            }
            let lookupWords = FormattingTools.SplitWords(lookupText);
            ftsQueryResult[i].score = this.ComputeShipToSoldToFtsQueryResultScore(ftsQueryResult[i], lookupWords);
        }
        return ftsQueryResult.sort(this.CompareAddressBlocksScores);
    },
    FindShipToSoldToWithFtrMatch: function () {
        this._logger.Enter("FindShipToSoldToWithFtrMatch");
        let soldShipToCandidates = this.GetFtrSoldShipToCandidates();
        let soldToCandidates = soldShipToCandidates.SoldToCandidates;
        let shipToCandidates = soldShipToCandidates.ShipToCandidates;
        let matches = [];
        this._logger.Info("Trying to match " + soldToCandidates.length + " soldToCandidates with " + shipToCandidates.length + " shipToCandidates");
        for (let soldToIndex = 0; soldToIndex < soldToCandidates.length; soldToIndex++) {
            let soldToCandidate = soldToCandidates[soldToIndex];
            for (let shipToIndex = 0; shipToIndex < shipToCandidates.length; shipToIndex++) {
                let shipToCandidate = shipToCandidates[shipToIndex];
                this.DistributeSoldToShipEventualMatch(shipToCandidate, soldToCandidate, matches);
            }
        }
        matches = this.MatchesPriority.ComputeMatchesPriority(matches, soldToCandidates);
        matches = this.MatchesPriority.SortByPriority(matches);
        matches = FormattingTools.Distinct(matches, this.GetSoldToShipToMatchKey);
        this._logger.Info("return SoldToShipToMatchResult");
        this._logger.Exit();
        return new SoldToShipToMatchResult(soldToCandidates, shipToCandidates, matches);
    },
    MatchesPriority: {
        Priority: {
            DifferentArea: 4,
            ShipToFromAnotherSoldToArea: 3,
            SameArea: 2,
            DifferentPages: 1
        },
        MatchOffsetKeyword: 10,
        CompareMatches: function (match1, match2) {
            return match2.Priority - match1.Priority;
        },
        SortByPriority: function (matches) {
            return matches.sort(this.CompareMatches);
        },
        ComputeMatchesPriority: function (matches, soldToCandidates) {
            for (let matchIndex = 0; matchIndex < matches.length; matchIndex++) {
                this.ComputeMatchPriority(matches[matchIndex], soldToCandidates);
            }
            return matches;
        },
        ComputeMatchPriority: function (match) {
            Log.Verbose("SoldTo: " + match.SoldTo.toString());
            Log.Verbose("ShipTo:" + match.ShipTo.toString());
            if (match.ShipTo.HighlightingAreas[0].IsLinkedToKeyword) {
                Log.Verbose("ShipTo keyword detected!");
                match.Priority = this.MatchOffsetKeyword;
            }
            if (!match.ShipTo.IsOnSamePage(match.SoldTo)) {
                Log.Verbose("Different pages match!");
                match.Priority += this.Priority.DifferentPages;
                return;
            }
            if (match.ShipTo.HasSameHighlightArea(match.SoldTo)) {
                Log.Verbose("Same area match!");
                match.Priority += this.Priority.SameArea;
                return;
            }
            if (match.ShipTo.HasSameHighlightAreaInList(match.SoldTo)) {
                Log.Verbose("SoldTo area match!");
                match.Priority += this.Priority.ShipToFromAnotherSoldToArea;
                return;
            }
            Log.Verbose("Different area match!");
            match.Priority += this.Priority.DifferentArea;
        }
    },
    GetFtrSoldShipToCandidates: function () {
        let postalCodeCandidates = this.GetFtrMatchCandidatesByPostalCodes();
        let soldToCandidates = [].concat(this.GetFtrSoldToCandidatesByPhoneFaxOrVat()).concat(postalCodeCandidates.SoldToCandidates);
        soldToCandidates = FormattingTools.Distinct(soldToCandidates, this.GetShipToSoldToFtsQueryResultKey);
        let shipToCandidates = FormattingTools.Distinct(postalCodeCandidates.ShipToCandidates, this.GetShipToSoldToFtsQueryResultKey);
        soldToCandidates = this.SortShipToSoldToFtsQueryResult(soldToCandidates);
        shipToCandidates = this.SortShipToSoldToFtsQueryResult(shipToCandidates);
        this._logger.Verbose("Found soldTo candidates : " + soldToCandidates.length);
        this._logger.Verbose("Found shipTo candidates : " + shipToCandidates.length);
        return {
            SoldToCandidates: soldToCandidates,
            ShipToCandidates: shipToCandidates
        };
    },
    DistributeSoldToShipEventualMatch: function (shipToCandidate, soldToCandidate, matches) {
        if (!g_erpOrderDocument.isShipToSoldToMatchable(shipToCandidate, soldToCandidate)) {
            return;
        }
        matches.push({
            ShipTo: shipToCandidate,
            SoldTo: soldToCandidate,
            Priority: 0
        });
    },
    GetShipToSoldToFtsQueryResultKey: function (shipToSoldToFtsQueryResult) {
        let area = shipToSoldToFtsQueryResult.GetArea();
        if (area) {
            return shipToSoldToFtsQueryResult.Number + " " + area.x + " " + area.y + " " + area.width + " " + area.height + " " + area.page;
        }
        return shipToSoldToFtsQueryResult.Number;
    },
    GetSoldToShipToMatchKey: function (soldToShipToMatch) {
        return soldToShipToMatch.SoldTo.Number + ":" + soldToShipToMatch.ShipTo.Number;
    },
    GetFtrCultureCodes: function () {
        let cultureCodes = null;
        this._logger.Verbose("[GetFtrCultureCodes] CultureCode from configuration: " + this.CultureCode);
        switch (this.CultureCode) {
            case "en-US":
                cultureCodes = ["en-US", "en-CA", "es-MX"];
                break;
            case "en-CA":
                cultureCodes = ["en-CA", "en-US", "es-MX"];
                break;
            case "es-MX":
                cultureCodes = ["es-MX", "en-US", "en-CA"];
                break;
            default:
                // If there are no fallbacks defined, we just use the culture defined in the config
                cultureCodes = [this.CultureCode];
                break;
        }
        this._logger.Verbose("[GetFtrCultureCodes] Culture codes to use: " + JSON.stringify(cultureCodes));
        return cultureCodes;
    },
    RunLookupBlockAddressInDocumentByCulture(pageIndex) {
        let cultureCodes = this.GetFtrCultureCodes();
        let blockAddresses = [];
        cultureCodes.forEach((cultureCode) => {
            if (blockAddresses.length > 0) {
                return;
            }
            blockAddresses = BlockAddressesInDocument.LookupBlockAddressInDocument(cultureCode, pageIndex);
            if (blockAddresses.length > 0) {
                this._logger.Verbose("[RunLookupBlockAddressInDocumentByCulture] Found " + blockAddresses.length + " block addresses with culture code '" + cultureCode + "'");
            }
        });
        return blockAddresses;
    },
    GetFtrMatchCandidatesByPostalCodes: function () {
        this._logger.Verbose("GetFtrShipToCandidatesByPostalCodes");
        let shipToCandidates = [];
        let soldToCandidates = [];
        let partnersTable = Lib.SOP.Tables.Partners.tableName;
        let customersTable = Lib.SOP.Tables.Customers.tableName;
        for (let pageIndex = 0; pageIndex < BlockAddressesInDocument.GetDocumentLastSearchPage(); pageIndex++) {
            let blockAddresses = this.RunLookupBlockAddressInDocumentByCulture(pageIndex);
            blockAddresses = blockAddresses.filter(BlockAddressesInDocument.BlockAddressFilter);
            this.LookForKeywordLinks(blockAddresses, g_KeyWordsShipToAddress);
            for (let numBlock = 0; numBlock < blockAddresses.length; numBlock++) {
                let blockAddress = blockAddresses[numBlock];
                this.QueryBlockAddressForMatchCandidate(customersTable, blockAddress, soldToCandidates, false);
                this.QueryBlockAddressForMatchCandidate(partnersTable, blockAddress, shipToCandidates, true);
            }
        }
        return {
            ShipToCandidates: shipToCandidates,
            SoldToCandidates: soldToCandidates
        };
    },
    QueryBlockAddressForMatchCandidate: function (tableName, blockAddress, candidates, isPartner) {
        let queryResults = this.FtsAdvancedQuery.QueryWithDocumentData(tableName, [blockAddress], 10);
        for (let resultIndex = 0; resultIndex < queryResults.length; resultIndex++) {
            let customerResult = queryResults[resultIndex];
            customerResult = this.CheckQueryResultPostalCode(customerResult, blockAddress.lookupText[0]);
            if (customerResult.QueryVars) {
                candidates.push(new ShipToSoldToFtsQueryResult(customerResult, isPartner, SoldToShipToDocumentSource.PostalCode));
            }
        }
    },
    GetFtrSoldToCandidatesByPhoneFaxOrVat: function () {
        this._logger.Verbose("GetFtrSoldToCandidatesByPhoneFaxOrVat");
        let soldToResults = [];
        let telFaxVatMatchingAreas = this.GetDocumentFindTelFaxVatMatchingAreas();
        let queryResults = this.FtsAdvancedQuery.QueryWithDocumentData(Lib.SOP.Tables.Customers.tableName, telFaxVatMatchingAreas, 10);
        for (let resultIndex = 0; resultIndex < queryResults.length; resultIndex++) {
            soldToResults.push(new ShipToSoldToFtsQueryResult(queryResults[resultIndex], false, SoldToShipToDocumentSource.PhoneFaxOrVat));
        }
        this._logger.Verbose("Found soldTo candidates : " + soldToResults.length);
        return soldToResults;
    },
    CheckQueryResultPostalCode: function (queryResult, expectedPostalCode) {
        if (!queryResult.QueryVars) {
            return queryResult;
        }
        let queryZipCode = queryResult.QueryVars.GetValue_String("Zip_code__", 0);
        if (queryZipCode && queryZipCode.length > 0 && FormattingTools.ZipCodesAfterSplittingAreEqual(queryZipCode, expectedPostalCode, this.CultureCode)) {
            return queryResult;
        }
        return {
            QueryVars: null,
            HighlightingAreas: []
        };
    },
    IsValidAddressUsingCityOrZipCode: function (shipTo) {
        let lookupText = "";
        let areas = shipTo.HighlightingAreas;
        for (let j = 0; j < areas[0].lookupText.length; j++) {
            lookupText = lookupText.concat(areas[0].lookupText[j].toUpperCase()).concat(" ");
        }
        let lookupWords = FormattingTools.SplitWords(lookupText);
        if (lookupWords.indexOf(shipTo.City.toUpperCase()) !== -1 || lookupWords.indexOf(shipTo.ZipCode.toUpperCase()) !== -1) {
            return true;
        }
        return false;
    },
    GetFtrShipToFirstCandidateNearKeywordsWithoutPostalCode: function () {
        this._logger.Verbose("GetFtrShipToFirstCandidateNearKeywordsWithoutPostalCode");
        let blockAddress = null;
        for (let pageNumber = 0; pageNumber < BlockAddressesInDocument.GetDocumentLastSearchPage(); pageNumber++) {
            let relativeZonesParams = this.GetAddressSearchZoneParams(pageNumber, ShipToSearchZoneForKeyWordsOnlyOffsets);
            let addressAreasFromKeywords = this.GetAddressAreasWithKeywords(pageNumber, g_KeyWordsShipToAddress, relativeZonesParams);
            for (let blockID = 0; blockID < addressAreasFromKeywords.length; blockID++) {
                let currentBlock = BlockAddressesInDocument.BuildMatchingInfo(addressAreasFromKeywords[blockID], addressAreasFromKeywords[blockID]);
                if (BlockAddressesInDocument.BlockAddressFilter(currentBlock)) {
                    blockAddress = currentBlock;
                    break;
                }
            }
            if (blockAddress) {
                break;
            }
        }
        if (blockAddress) {
            let firstQueryResult = this.FtsAdvancedQuery.QueryWithDocumentData(Lib.SOP.Tables.Partners.tableName, [blockAddress], 1)[0];
            if (firstQueryResult) {
                let shipTo = new ShipToSoldToFtsQueryResult(firstQueryResult, true, SoldToShipToDocumentSource.Keywords);
                if (this.IsValidAddressUsingCityOrZipCode(shipTo)) {
                    return shipTo;
                }
            }
        }
        return null;
    },
    GetClosestDropShipToBlockAddressByKeyWords: function (useExtractPostalAddress) {
        this._logger.Verbose("GetClosestDropShipToBlockAddressByKeyWords");
        let foundAddress;
        for (let pageNumber = 0; pageNumber < BlockAddressesInDocument.GetDocumentLastSearchPage(); pageNumber++) {
            let relativeZonesParams = this.GetAddressSearchZoneParams(pageNumber, ShipToSearchZoneOffsets);
            let addressAreasFromKeywords = this.GetAddressAreasWithKeywords(pageNumber, g_KeyWordsShipToAddress, relativeZonesParams);
            let arrayBlockAddress = BlockAddressesInDocument.LookupBlockAddressInDocument(this.CultureCode, pageNumber);
            arrayBlockAddress = arrayBlockAddress.filter(BlockAddressesInDocument.BlockAddressFilter);
            foundAddress = this.GetClosestValidAddressByKeywords(arrayBlockAddress, addressAreasFromKeywords, useExtractPostalAddress);
            if (foundAddress.Area) {
                return foundAddress;
            }
        }
        return null;
    },
    TryFillDropShip: function () {
        this._logger.Verbose("TryFillDropShip");
        let closestBlockAddress = this.GetClosestDropShipToBlockAddressByKeyWords(true);
        if (closestBlockAddress && closestBlockAddress.Address) {
            this.SetFoundDropShipAddress(closestBlockAddress.Address);
            this.FillAndHighlightDropShipAddress(this.FoundDropShipAddress, closestBlockAddress.Area.zone);
        }
        else if (this.FoundShipToAddress.IsFound() && this.FoundShipToAddress.HighLightAreas && this.FoundShipToAddress.HighLightAreas.length > 0) {
            this.FillAndHighlightDropShipAddress(this.FoundShipToAddress, this.FoundShipToAddress.HighLightAreas[0]);
        }
    },
    GetAddressAreasWithKeywords: function (pageNumber, keywords, addressOffsets) {
        let validDocumentAreas = [];
        if (!keywords) {
            return validDocumentAreas;
        }
        for (let i = 0; i < keywords.length; i++) {
            let keywordSplits = keywords[i].split(":");
            // Keyword looks like "right:Tel:", "meaning on the right of 'Tel:'"
            let keyWord = keywordSplits[1];
            let direction = keywordSplits[0];
            let areas = Document.SearchString(keyWord, pageNumber, true, true);
            if (areas == null || areas.length <= 0) {
                continue;
            }
            for (let j = 0; j < areas.length; j++) {
                let validDocumentArea = this.GetValidAreaFromDocument(pageNumber, direction, areas[j], addressOffsets);
                if (validDocumentArea && validDocumentArea.toString()) {
                    validDocumentAreas.push(validDocumentArea);
                }
            }
        }
        return validDocumentAreas;
    },
    GetValidAreaFromDocument: function (pageNumber, direction, area, addressOffsets) {
        let documentArea;
        if (area.searchConfidenceLevel < 80) {
            return null;
        }
        if (direction === "right") {
            documentArea = Document.GetArea(pageNumber, area.x + area.width, area.y - addressOffsets.VertTol, addressOffsets.XMaxDist, area.height + 2 * addressOffsets.VertTol);
        }
        else if (direction === "below") {
            documentArea = Document.GetArea(pageNumber, area.x - addressOffsets.HorzTolLeft, area.y + area.height, area.width + addressOffsets.HorzTolLeft + addressOffsets.HorzTolRight, addressOffsets.YMaxDist);
        }
        else {
            Log.Error("Unknown Direction:" + direction);
            return null;
        }
        if (documentArea.toString()) {
            return documentArea;
        }
        return null;
    },
    GetAddressSearchZoneParams: function (documentPageNumber, offSets) {
        let feetToCmFactor = 2.54;
        let xPageResolution = Document.GetPageResolutionX(documentPageNumber);
        let yPageResolution = Document.GetPageResolutionY(documentPageNumber);
        return {
            // offSets.XMax cm on the right of the keyword
            XMaxDist: offSets.XMax / feetToCmFactor * xPageResolution,
            // offSets.YMax cm below the keyword
            YMaxDist: offSets.YMax / feetToCmFactor * yPageResolution,
            // offSets.VertTol cm above & below, when looking on the right
            VertTol: offSets.VertTol / feetToCmFactor * yPageResolution,
            // offSets.HorzTolLeft cm on the left, when looking below
            HorzTolLeft: offSets.HorzTolLeft / feetToCmFactor * xPageResolution,
            // offSets.HorzTolRight cm on the right, when looking below
            HorzTolRight: offSets.HorzTolRight / feetToCmFactor * xPageResolution
        };
    },
    SetFoundDropShipAddress: function (normalizedAddressObject) {
        this.FoundDropShipAddress.Name = normalizedAddressObject.name;
        this.FoundDropShipAddress.Name2 = normalizedAddressObject.name2;
        this.FoundDropShipAddress.Street = normalizedAddressObject.street;
        this.FoundDropShipAddress.ZipCode = normalizedAddressObject.zipcode;
        this.FoundDropShipAddress.City = normalizedAddressObject.city;
        this.FoundDropShipAddress.Region = normalizedAddressObject.region;
        this.FoundDropShipAddress.CountryCode = normalizedAddressObject.country;
    },
    GetClosestValidAddressByKeywords: function (arrayBlockAddress, arrayShipToKeyWords, useExtractPostalAddress) {
        if (!arrayBlockAddress) {
            return null;
        }
        let foundAddress = {};
        let minimumDistance = Number.MAX_VALUE;
        for (let i = 0; i < arrayBlockAddress.length; i++) {
            if (arrayBlockAddress[i].zone) {
                let distance = this.ComputeMinimumDistance(arrayBlockAddress[i].zone, arrayShipToKeyWords);
                if (!foundAddress.hasOwnProperty("Area") || distance < minimumDistance) {
                    let extractedAddress = null;
                    if (useExtractPostalAddress) {
                        let cleanedBlockAddress = this.CleanAreaOfKeywords(arrayBlockAddress[i].zone.toString(), g_KeyWordsShipToAddress);
                        extractedAddress = Data.ExtractPostalAddress(cleanedBlockAddress, this.CountryCode);
                    }
                    foundAddress.Address = extractedAddress;
                    foundAddress.Area = arrayBlockAddress[i];
                    minimumDistance = distance;
                }
            }
        }
        return foundAddress;
    },
    ComputeDistance: function (area1, area2) {
        let area1CenterX = area1.x + area1.width / 2.0;
        let area1CenterY = area1.y + area1.height / 2.0;
        let area2CenterX = area2.x + area2.width / 2.0;
        let area2CenterY = area2.y + area2.height / 2.0;
        let deltaX = area1CenterX - area2CenterX;
        let deltaY = area1CenterY - area2CenterY;
        return deltaX * deltaX + deltaY * deltaY;
    },
    ComputeMinimumDistance: function (area1, areaArray) {
        let minimumDistance = Number.MAX_VALUE;
        for (let numArea = 0; numArea < areaArray.length; numArea++) {
            let distance = this.ComputeDistance(area1, areaArray[numArea]);
            if (distance < minimumDistance) {
                minimumDistance = distance;
            }
        }
        return minimumDistance;
    },
    CleanAreaOfKeywords: function (textOfArea, keywords) {
        for (let i = 0; i < keywords.length; i++) {
            let currentKeyword = keywords[i].replace("right:", "").replace("below:", "");
            textOfArea = FormattingTools.ReplaceCaseInsensitive(textOfArea, currentKeyword, "");
            textOfArea = textOfArea.replace(":", "");
        }
        return textOfArea;
    },
    LookForKeywordLinks: function (blockAddresses, keywords) {
        this._logger.Verbose("LookForKeywordLinks");
        for (let pageNumber = 0; pageNumber < BlockAddressesInDocument.GetDocumentLastSearchPage(); pageNumber++) {
            let relativeZonesParams = this.GetAddressSearchZoneParams(pageNumber, ShipToSearchZoneOffsets);
            let addressAreasFromKeywords = this.GetAddressAreasWithKeywords(pageNumber, keywords, relativeZonesParams);
            for (let keywordIndex = 0; keywordIndex < addressAreasFromKeywords.length; keywordIndex++) {
                let keywordArea = addressAreasFromKeywords[keywordIndex];
                this.FindBlockAddressesLinkedToKeywordArea(blockAddresses, keywordArea);
            }
        }
        return null;
    },
    FindBlockAddressesLinkedToKeywordArea: function (blockAddresses, keywordArea) {
        for (let blockAddressIndex = 0; blockAddressIndex < blockAddresses.length; blockAddressIndex++) {
            let blockAddress = blockAddresses[blockAddressIndex];
            if (blockAddress.IsLinkedToKeyword) {
                continue;
            }
            let areaIntersections = AreaCalculator.GetIntersectionBoxBetweenAreas(blockAddress.zone, keywordArea);
            if (areaIntersections.isIntersection) {
                blockAddress.IsLinkedToKeyword = true;
                this._logger.Verbose("This block address is linked to the keyword : " + keywordArea.toString());
                this._logger.Verbose(blockAddress);
            }
        }
    }
};
/************************************ End of ShipToAndSoldToSearchService ************************************/
/************************************ Oracle Specific section ************************************/
function ComputeItemValidationOrganization() {
    let tableName = "SO - Organizations__";
    let attributes = "ItemValidationOrg__";
    let filter = Sys.Helpers.LdapUtil.FilterEqual("OrgId__", Data.GetValue("OrgId__"));
    let res = Lib.SOP.Helpers.QueryDB(tableName, filter, attributes);
    if (res && res.length > 0) {
        let itemValidationOrg = res[0].GetValue_String("ItemValidationOrg__", 0);
        Data.SetValue("ItemValidationOrg__", itemValidationOrg);
    }
    else {
        Data.SetValue("ItemValidationOrg__", "");
    }
}
function SetOrgIDFromCustomerExtracted() {
    let tableName = Lib.SOP.Tables.Customers.tableName;
    let customerNumber = Data.GetValue("CustomerNumber__");
    let filter = Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.Customers.number, customerNumber);
    let attributes = "OrgId__";
    let vars = Lib.SOP.Helpers.QueryDB(tableName, filter, attributes);
    let orgID = vars.length > 0 ? vars[0].GetValue_String("OrgId__", 0) : null;
    if (orgID && Sys.OM.Helpers.GetConfiguration().OrgIDList.indexOf(orgID) >= 0) {
        Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "OrgId__", orgID, tableName);
        Log.Info("Found OrgID " + orgID + " for customer " + customerNumber);
    }
    else {
        Log.Info("OrgID not found!");
    }
}
function SetPriceListFromCustomerExtracted() {
    function ClearPriceList() {
        Data.SetValue("Price_list__", "");
        Data.SetValue("PriceList_Id__", "");
    }
    let LdapUtil = Sys.Helpers.LdapUtil;
    let customerNumber = Data.GetValue("CustomerNumber__");
    let vars = Lib.SOP.Helpers.QueryDB(Lib.SOP.Tables.Customers.tableName, LdapUtil.FilterEqual(Lib.SOP.Tables.Customers.number, customerNumber), "PriceListId__");
    let priceListId = vars.length > 0 ? vars[0].GetValue_String("PriceListId__", 0) : null;
    if (priceListId !== "") {
        let tableName = "SO - PriceLists__";
        let priceListResult = Lib.SOP.Helpers.QueryDB(tableName, LdapUtil.FilterEqual("List_header_id__", priceListId), "List_header_id__,Name__,OrgId__,Global_flag__");
        if (priceListResult.length > 0) {
            let priceListName = priceListResult[0].GetValue_String("Name__", 0);
            let orgId = priceListResult[0].GetValue_String("OrgId__", 0);
            let isGlobal = priceListResult[0].GetValue_String("Global_flag__", 0);
            isGlobal = isGlobal != null ? isGlobal.toLowerCase() === "y" : false;
            let extractedOrgId = Data.GetValue("OrgId__");
            if (orgId === extractedOrgId || isGlobal) {
                Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "Price_list__", priceListName, tableName);
                Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "PriceList_Id__", priceListId, tableName);
                Log.Info("Found PriceListId " + priceListId + " for customer " + customerNumber);
                Log.Info("Found PriceList '" + priceListName + "' for customer " + customerNumber);
            }
            else {
                Log.Warn("Found PriceList '" + priceListName + "' for customer " + customerNumber + " but OrgId mismatch (" + orgId + " vs. " + extractedOrgId + ")");
                ClearPriceList();
            }
        }
        else {
            Log.Warn("No PriceList Name found");
            ClearPriceList();
        }
    }
    else {
        Log.Info("No PriceListId found for Customer " + customerNumber);
        ClearPriceList();
    }
}
function SetOrderTypeIfExtracted() {
    let tableName = Lib.SOP.Tables.OrderTypes.tableName;
    let orderTypeName = Data.GetValue("OrderType__");
    if (orderTypeName) {
        let filter = Sys.Helpers.LdapUtil.FilterEqual(Lib.SOP.Tables.OrderTypes.name, orderTypeName);
        let attributes = "TransactionTypeId__";
        let vars = Lib.SOP.Helpers.QueryDB(tableName, filter, attributes);
        let orderTypeID = vars.length > 0 ? vars[0].GetValue_String("TransactionTypeId__", 0) : null;
        if (orderTypeID) {
            Lib.SOP.Helpers.SetValueWithSourceFromTable(Data, "OrderTypeID__", orderTypeID, tableName);
            Log.Info("Found OrderTypeID " + orderTypeID);
        }
        else {
            Log.Info("OrderTypeId not found");
        }
    }
}
function IsMultiLayoutTeaching() {
    let suppRule = Data.GetValue("LayoutIdentifier__");
    return suppRule && suppRule.indexOf("Layout_") === 0;
}
function CheckGenericLayoutTeaching() {
    Log.Info("[CheckGenericLayoutTeaching]");
    let suppRule = Data.GetValue("LayoutIdentifier__");
    // If supplementary rule is not for a generic layout, set Partner number
    if (suppRule && !IsMultiLayoutTeaching()) {
        Data.SetValue("CustomerNumber__", suppRule);
        CustomerOrderProcessing.Extraction.UserExit.OnCustomerChange();
    }
}
function CopyItemNumberToCustomerMaterialIdField() {
    Log.Info("[CopyItemNumberToCustomerMaterialIdField]");
    let table = Data.GetTable("Product_List__");
    let count = table.GetItemCount();
    for (let i = 0; i < count; i++) {
        let row = table.GetItem(i);
        if (!row.GetValue("CustomerMaterialId__")) {
            row.SetValue("CustomerMaterialId__", row.GetValue("ItemNumber__"));
        }
    }
}
/************************************  Enf of Oracle specific section ************************************/
/********************************************************************
Entry Points Definition
 ********************************************************************/
async function ClassicExtraction() {
    if (ShouldRecognizeSalesDocumentTypeWithChatGPT()) {
        RecognizeSalesDocumentTypeFromChatGPT();
    }
    else if (Variable.GetValueAsString("SDADocTypeSource")) {
        if (!Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Extraction.OnSetSalesDocumentTypeFromSDA")) {
            SetSalesDocumentTypeFromSDA(Variable.GetValueAsString("SDADocTypeSource"));
        }
    }
    SpreadsheetDataExtraction();
    if (Lib.SOP.Helpers.IsERP("SAP") && !Data.GetValue("DocumentType__")) {
        Lib.SOP.Helpers.SetValueWithSourceFromConfig(Data, "DocumentType__", Sys.OM.Helpers.GetConfiguration().DocumentType);
    }
    let processEmailWithChatGPT = getShouldProcessEmailWithChatGPT();
    if (processEmailWithChatGPT) {
        FillFromChatGPT();
    }
    let currentAction = Data.GetActionType();
    let isDetectingTableNextLines = currentAction === "autocomplete";
    if (!isDetectingTableNextLines) {
        CheckGenericLayoutTeaching();
        if (Lib.SOP.SynergyNeuralNetwork.IsSynergyForHeaderEnabled() && !processEmailWithChatGPT) {
            Lib.SOP.SynergyNeuralNetwork.HeaderExtraction();
        }
        ShipToAndSoldToSearchService.Run(g_sCountryCode, g_sDocumentCulture);
        SearchHeaderFieldsByKeywords();
    }
    // Fill line items
    if (processEmailWithChatGPT) {
        Log.Info("[ClassicExtraction] Email already processed with ChatGPT, products list table won't be filled by SynergyNeuralNetwork");
    }
    await FillProductListTable(processEmailWithChatGPT);
    SetRunningTotal();
    Lib.SOP.TablesUpdater.FillItemsCount();
    return "ocr_extraction";
}
/****************************************
Portal management
 *****************************************/
function FillCustomerOrder() {
    Log.Info("Generating Customer Order");
    let jsonData = Data.GetValue("JsonData__");
    let jsonString = jsonData || Data.GetValue("JsonFromPortal__") || Lib.SOP.Helpers.GetJsonSplitData();
    if (jsonString) {
        let flexibleDeserializer = Lib.SOP.Deserializer.GetInstance(Data, Log);
        if (jsonData || !flexibleDeserializer.copoRuidCreatedFromConversation) {
            if (!jsonData) {
                flexibleDeserializer.CustomTableFill = FillProductListTable;
            }
            flexibleDeserializer.SetJSON(jsonString);
            Log.Info("Generating Customer Order returns true");
            return true;
        }
    }
    Log.Info("Generating Customer Order returns false");
    return false;
}
/********************************************************************
Extraction
 ********************************************************************/
async function runExtraction() {
    Data.SetValue("ERP__", Sys.OM.Helpers.GetConfiguration().ERP);
    let extracted;
    if (!FillCustomerOrder()) {
        extracted = await EDIExtraction.TryEDIExtraction();
        if (!extracted) {
            Log.Info("It's not an EDI document. Starting classic extraction");
            let dataSource = SearchForClassicSource();
            if (dataSource) {
                Data.SetValue("Source__", dataSource);
            }
            extracted = await ClassicExtraction();
        }
        else {
            Data.SetValue("Source__", "EDI");
            Variable.SetValueAsString("AutoLearningSynergy", "-1");
        }
    }
    else {
        extracted = FillCustomerOrderAlternativeSource();
        CopyItemNumberToCustomerMaterialIdField();
    }
    if (Lib.SOP.isFromPunchout()) {
        ShipToAndSoldToSearchService.Run(g_sCountryCode, g_sDocumentCulture);
    }
    if (Sys.OM.Helpers.GetConfiguration().EnableAutolearnOnShiptoAddress === "1"
        && !CustomerOrderProcessing.Extraction.UserExit.DisableDropShipAddressFromExtractedShipToAddress()) {
        let shippingAddress = Data.GetValue("ShipToAddress__");
        let docCultures = g_sDocumentCulture.split("-");
        if (docCultures && docCultures.length >= 2) {
            let docCulture = Lib.SOP.PostalAddress.TryDetermineCountryCodeFromAddress(shippingAddress) || docCultures[1];
            if (!Sys.Helpers.IsEmpty(shippingAddress)) {
                let addressObj = Lib.SOP.PostalAddress.ExtractPostalAddress(shippingAddress, docCulture);
                if (!addressObj || Object.keys(addressObj).length <= 0) {
                    addressObj = Data.ExtractPostalAddress(shippingAddress, docCulture);
                    addressObj = Lib.SOP.PostalAddress.TransformObjectForFillingDropShipFields(addressObj);
                }
                Lib.SOP.PostalAddress.SetDropShipAddressWithPostalAddress(addressObj, false);
            }
        }
    }
    SetInboundChannelName();
    SetOrderReceptionDateTime();
    let currentAction = Data.GetActionType();
    let isDetectingTableNextLines = currentAction === "autocomplete";
    if (!isDetectingTableNextLines) {
        CustomerOrderProcessing.Extraction.UserExit.OnPartnerExtractionEnd();
        if (Lib.SOP.Helpers.IsERP("SAP")) {
            GetSAPTexts();
            RetrieveSAPAdditionalPartners();
            RetrieveAndSetCurrencyAndHeaderPaymentTermsAndCompleteDeliveryFlag();
            TryReconciliateOrderAndChangeOrder();
            if (!Sys.Helpers.IsEmpty(Data.GetValue("ShipToNumber__")) && (Sys.Helpers.IsEmpty(Data.GetValue("DropShipToAddress_TransportationZone__")) || Sys.Helpers.IsEmpty(Data.GetValue("DropShipToAddress_Language__")))) {
                g_erpOrderDocument.GetAndSetTransportationZoneAndLanguage();
            }
        }
        if (Sys.OM.Helpers.GetConfiguration().ERP === "Oracle EBS") {
            if (!Data.IsComputed("OrgId__")) {
                SetOrgIDFromCustomerExtracted();
            }
            let priceListName = Data.GetValue("Price_list__");
            if (priceListName == "" || priceListName == null) {
                SetPriceListFromCustomerExtracted();
            }
            SetOrderTypeIfExtracted();
        }
        RetrieveAndSetCompleteDeliveryFlag();
        PreventEmptySAPTextsTable();
        PreventEmptyPartnersTable();
        PreventEmptyDocumentsTable();
    }
    if (Lib.SOP.Helpers.IsERP("SAP")) {
        SetSAPCheckValues();
    }
    else if (!EDIExtraction.currencySetFromEDI) {
        Lib.SOP.SetCurrencyValue(Data.GetValue("CustomerNumber__"));
    }
    if (Data.GetValue("EDI_Format__") === "NSO") {
        let ediJsonMappedDocument = Variable.GetValueAsString("EDIJsonMappedDocument");
        let documentWorkflowId = Lib.SOP.NSO.getEDIWorkflowIDFromMappedJSON(ediJsonMappedDocument);
        Data.SetValue("DocumentEDIWorkflowID__", documentWorkflowId);
        Data.SetValue("NSOProcessType__", Lib.SOP.NSO.getProcessTypeFromMappedJSON(ediJsonMappedDocument));
        let parentWorflowId = Lib.SOP.NSO.getParentIDFromMappedJSON(ediJsonMappedDocument);
        if (parentWorflowId) {
            let baseWorkflowId = Lib.SOP.NSO.getEDIWorkflowIDIfExists(parentWorflowId);
            if (baseWorkflowId) {
                Data.SetValue("EDIWorkflowID__", baseWorkflowId);
                Data.SetWarning("EDIWorkflowID__", Language.Translate("NSORelatedOrderExists : {0}", true, baseWorkflowId));
                Log.Warn("[NSO] : order is linked to one or more other orders with EDIWorkflowID__ = " + baseWorkflowId);
            }
            else {
                Log.Error("[NSO] : order is linked to one or more other orders, but none of them were found in base");
                Data.SetWarning("EDIWorkflowID__", Language.Translate("NSOLinkedOrderNotFound"));
            }
        }
        else {
            Data.SetValue("EDIWorkflowID__", documentWorkflowId);
        }
    }
    InitExtractionInformationsData();
    if (!currentAction || currentAction === "reprocess" || currentAction === "reprocess_asynchronous") {
        if (Sys.OM.Helpers.GetConfiguration().ManualDuplicateCheck && Sys.OM.Helpers.GetConfiguration().ManualDuplicateCheck === "0") {
            QueryDuplicateCheckAlertLevel();
        }
        QueryAllowTouchless();
    }
    if (Lib.SOP.isFromPunchout()) {
        Lib.SOP.PORTAL.SetSendConfirmationNotification(Data.GetValue("ShortOwnerID"));
    }
    else {
        Lib.SOP.PORTAL.GetCustomerContactNotification(true);
    }
    if (Lib.SOP.Helpers.IsERP("SAP")) {
        TryReconciliationOrderAndQuoteLineItems();
    }
    SuggestAndReconcileContract();
    return extracted;
}
function FillCustomerOrderAlternativeSource() {
    if (Variable.GetValueAsString("SubmittedFromMobileApp") === "1") {
        Data.SetValue("Source__", "MobileApp");
        return "Customer Order extraction from Mobile App";
    }
    else if (Variable.GetValueAsString("SubmittedFromPunchOut") === "1") {
        Data.SetValue("Source__", "cXML");
        return "Customer Order extraction from cXML";
    }
    else if (Lib.SOP.Helpers.IsSplitOrder()) {
        Data.SetValue("Source__", "SplitOrder");
        return "Customer Order from parent split order";
    }
    Data.SetValue("Source__", "Portal");
    return "Customer Order Portal extraction";
}
function SetInboundChannelName() {
    let source = Data.GetValue("Source__");
    if (source === "Email" || source === "SDA") {
        let inboundProcessId = Variable.GetValueAsString("InboundChannelName");
        if (inboundProcessId) {
            let query = Process.CreateQuery();
            query.SetSpecificTable("EDD_PROCESS");
            query.SetAttributesList("NAME");
            query.SetFilter(Sys.Helpers.LdapUtil.FilterEqual("ID", inboundProcessId).toString());
            if (query.MoveFirst()) {
                let record = query.MoveNextRecord();
                if (record) {
                    let vars = record.GetVars();
                    Data.SetValue("InboundChannelName__", vars.GetValue_String("NAME", 0));
                }
            }
        }
    }
}
function GetSAPTexts() {
    // Gets the SAP Texts if we extracted the sufficient info for it during the extraction script
    // Saves a query when launching the custom script
    let config = Sys.OM.Helpers.GetConfiguration();
    function UpdateSAPTexts(sapTexts, defaultLanguage, languages, bapiParams) {
        Data.SetValue("ExtractedSAPTexts__", JSON.stringify(bapiParams));
        Lib.SOP.SAP.Texts.UpdateSAPTextCore(sapTexts, defaultLanguage, languages, function (item, textCurrentCopy) {
            let bapi = "Z_ESK_READ_SAPTEXTS";
            Lib.SOP.Helpers.SetValueWithSourceFromTable(item, "Label__", textCurrentCopy.LABELID, bapi);
            Lib.SOP.Helpers.SetValueWithSourceFromTable(item, "Language__", textCurrentCopy.LANG, bapi);
            Lib.SOP.Helpers.SetValueWithSourceFromTable(item, "Text__", textCurrentCopy.TEXT_LINES, bapi);
        }, function () {
        });
    }
    if (config.Display_default_SAP_texts === "1" || config.Allow_SAP_texts_modifications === "1") {
        Lib.SOP.SAP.Texts.GetSAPTexts(config.DocumentType, UpdateSAPTexts, true);
    }
}
function InitConfig() {
    CustomerOrderProcessing.Extraction.UserExit.OnInitConfigurationBegin();
    let config = Lib.SOP.Configuration.initializeConfigurationServer();
    Lib.SOP.Configuration.saveConfigAsExternalVars(config);
    Sys.OM.Helpers.SetConfiguration(config);
    let scriptUseCase = Lib.SOP.Configuration.getScriptUseCase("Extraction");
    if (scriptUseCase && scriptUseCase.configurationFromTableMandatory && !Lib.SOP.Configuration.hasConfigurationRecordBeenFound()) {
        if ((Process.GetScriptRetryCount() + 1) == Process.GetScriptMaxRetryCount()) {
            Log.Error("The configuration was not retrieved from the record as expected in this context");
        }
        else {
            throw "The configuration was not retrieved from the record as expected in this context";
        }
    }
    Lib.SOP.Helpers.CheckIfConfigurationReachable();
    g_ClearMaterialWhenConfidenceBelow = config.minConfidenceForMatID;
    g_addressExclusionKeywords = GetExclusionKeywords();
}
function RecognizeSalesDocumentTypeFromChatGPT() {
    let emailData = Sys.Helpers.Email.GetEmailDataFromIsm(Data.GetValue("WorkflowID"));
    if (!emailData.Body) {
        emailData.Body = Document.GetArea().toString();
        // No body found in the email, no need to extract anything
        if (!emailData.Body) {
            Log.Info("[RecognizeSalesDocumentTypeFromChatGPT] No email body, cancel chatGpt");
            return;
        }
        // Remove the two first lines which are the subject and the sender
        let endOfFirstLine = emailData.Body.indexOf("\n");
        let endOfSecondLine = emailData.Body.indexOf("\n", endOfFirstLine + 1);
        emailData.Body = emailData.Body.substring(endOfSecondLine + 1);
    }
    let userContent = Sys.ML.EskerGpt.FormatEmailForGPT(emailData.Subject, emailData.Body);
    let gptSettings = Sys.OM.GptSettings.CreateGptSettingsSalesDocumentType(
    /*config*/ Sys.OM.Helpers.GetConfiguration(), 
    /*availableSalesDocumentTypes*/ Lib.SOP.Helpers.SalesDocumentType);
    Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Extraction.AddFieldsDescriptions", gptSettings);
    const initialSalesDocumentType = Data.GetValue("SalesDocumentType__");
    Sys.Helpers.CacheForRetries.Try(cacheForRetries, "RecognizeSalesDocumentTypeFromChatGPT Sys.ML.EskerGpt.Extract", Sys.ML.EskerGpt.Extract, [gptSettings, userContent, result => result], { maxTry: Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Common.getGptRetriesNumber", "Extract") || 3 })
        .then(function (extractedData) {
        Sys.ML.EskerGpt.ProcessAIExtractResult(extractedData, gptSettings, userContent);
        ResetBadlyRecognizedDocumentType();
        const extractedSalesDocumentType = Data.GetValue("SalesDocumentType__");
        if (initialSalesDocumentType !== extractedSalesDocumentType) {
            Data.SetValue("Extracted_Using_Gpt__", true);
        }
    });
}
function SetSalesDocumentTypeFromSDA(SDASalesDocumentType) {
    if (Lib.SOP.Helpers.mappingSalesDocumentType[SDASalesDocumentType]) {
        let salesDocumentType = GetAvailableSalesDocumentTypeValues(Sys.OM.Helpers.GetConfiguration());
        if (salesDocumentType.indexOf(Lib.SOP.Helpers.mappingSalesDocumentType[SDASalesDocumentType]) !== -1) {
            Data.SetValue("SalesDocumentType__", Lib.SOP.Helpers.mappingSalesDocumentType[SDASalesDocumentType]);
            g_bDocumentTypeRecognizedByKeywords = true;
        }
    }
}
function ResetBadlyRecognizedDocumentType() {
    //Weird old usage because nothing else than expected or computed can be extracted so doesn't matter
    let config = Sys.OM.Helpers.GetConfiguration();
    let salesDocumentTypeValues = GetAvailableSalesDocumentTypeValues(config);
    let salesDocumentType = Data.GetValue("SalesDocumentType__");
    Variable.SetValueAsString("ExtractedDocumentType", "");
    if (!salesDocumentType || (salesDocumentType !== "" && salesDocumentTypeValues.indexOf(salesDocumentType) === -1)) {
        Lib.SOP.Helpers.SetValueWithSourceFromConfig(Data, "SalesDocumentType__", Lib.SOP.Helpers.SalesDocumentType.Order);
    }
    let documentTypeValues = Lib.SOP.Helpers.RetrieveDocumentTypeComboBoxList(config);
    let documentType = Data.GetValue("DocumentType__");
    if (!documentType || (documentType !== "" && documentTypeValues.indexOf(documentType + "=") === -1)) {
        let firstDocumentType = documentTypeValues.substring(0, documentTypeValues.indexOf("="));
        Log.Info("[ResetBadlyRecognizedDocumentType] Incorrect Document Type found '" + documentType + "' replaced by '" + firstDocumentType + "'");
        Variable.SetValueAsString("ExtractedDocumentType", documentType);
        Lib.SOP.Helpers.SetValueWithSourceFromConfig(Data, "DocumentType__", firstDocumentType);
    }
    salesDocumentType = Data.GetValue("SalesDocumentType__");
    if (salesDocumentType && salesDocumentType !== Lib.SOP.Helpers.SalesDocumentType.ChangeOrder) {
        Data.SetValue("Revised_Order__", false); // backward compatibility: the Revised_Order__ field has been removed but we still keep it in sync  (change order views in auto-update and upgrade mode)
    }
}
function GetAvailableSalesDocumentTypeValues(config) {
    let recognizableTypes = [Lib.SOP.Helpers.SalesDocumentType.Order];
    if (config.ActivateChangeOrders === "1") {
        recognizableTypes.push(Lib.SOP.Helpers.SalesDocumentType.ChangeOrder);
    }
    if (config.ActivateQuotes === "1") {
        recognizableTypes.push(Lib.SOP.Helpers.SalesDocumentType.QuoteRequest);
    }
    if (config.ActivateSAPReturnOrders === "1") {
        recognizableTypes.push(Lib.SOP.Helpers.SalesDocumentType.ReturnOrder);
    }
    return recognizableTypes.join(",");
}
function FillFromChatGPT() {
    let emailData = Sys.Helpers.Email.GetEmailDataFromIsm(Data.GetValue("WorkflowID"));
    let userContent = Sys.ML.EskerGpt.FormatEmailForGPT(emailData.Subject, emailData.Body);
    const includeCancelSAPOrder = Data.GetValue("SalesDocumentType__") === Lib.SOP.Helpers.SalesDocumentType.ChangeOrder;
    const excludeDueDate = Lib.SOP.Helpers.GetConfiguration().DisplayRequestedDeliveryDate === "0";
    let gptSettings = Sys.OM.GptSettings.CreateGptSettingsHeaderFields(includeCancelSAPOrder, excludeDueDate);
    let extractedDescriptionFieldName = "ExtractedDescription__";
    // Check if the extracted description field is present in the table
    const result = Sys.OM.Helpers.Server.checkTableFieldExistence("Customer Order Processing", "Product_List__", ["ExtractedDescription__"]);
    if (!result || !result["ExtractedDescription__"] || !result["ExtractedDescription__"].exists) {
        // If the field is not present, we use the old description field name
        extractedDescriptionFieldName = "Description__";
        Log.Info("[FillFromChatGPT] ExtractedDescription__ field not found in Product_List__ table, using Description__ field instead");
    }
    gptSettings.lineItems = Sys.OM.GptSettings.CreateGptSettingsLineItemFields(
    /*includeChangeOrderLineItemAction*/ Data.GetValue("SalesDocumentType__") === Lib.SOP.Helpers.SalesDocumentType.ChangeOrder, 
    /*includeUnitPrice*/ Sys.OM.Helpers.GetConfiguration().DisplayUnitPrice === "1", 
    /*isQuantityConversionEnabled*/ Lib.SOP.QuantityConversion.IsQuantityConversionEnabled(), 
    /*Description field name*/ extractedDescriptionFieldName).lineItems;
    let GptExtractionCallback = (extractedData, config, emailContent) => {
        // Field OverridePreviousOrder does not correspond to a data
        if ((extractedData === null || extractedData === void 0 ? void 0 : extractedData.fields.Cancel_SAP_Order__) != null) {
            let value = typeof extractedData.fields.Cancel_SAP_Order__ === "object" ? extractedData.fields.Cancel_SAP_Order__.value : extractedData.fields.Cancel_SAP_Order__;
            if (value === true) {
                Data.SetValue("Cancel_SAP_Order__", true);
            }
            delete extractedData.fields.Cancel_SAP_Order__;
        }
        Sys.ML.EskerGpt.ProcessAIExtractResult(extractedData, config, emailContent);
        //Setting recognition method indicators
        Data.SetValue("Extracted_Using_Gpt__", true);
        // Conditionner à si aucun resultat n'est déjà présent pour le customer number (teaching par ex)
        let customerNumber = Data.GetValue("CustomerNumber__");
        if (!customerNumber) {
            let contactSetCorrectly = SetCustomerNumberFromContactEmail();
            if (!contactSetCorrectly) {
                FuzzySearchCustomerNumberFromNameAndAddress();
            }
        }
    };
    Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Extraction.AddFieldsDescriptions", gptSettings);
    Sys.Helpers.CacheForRetries.Try(cacheForRetries, "FillFromChatGPT Sys.ML.EskerGpt.Extract", Sys.ML.EskerGpt.Extract, [gptSettings, userContent, result => result], { maxTry: Sys.Helpers.TryCallFunction("Lib.DD.Customization.Common.getGptRetriesNumber", "Extract") || 3 })
        .then(function (extractedData) {
        GptExtractionCallback(extractedData, gptSettings, userContent);
    });
}
// The ShouldExtractWithGPT__ field is populated in the pre-extraction script.
function getShouldProcessEmailWithChatGPT() {
    if (Data.GetActionType() === "autocomplete") {
        return false;
    }
    let shouldExtractWithGPT = Variable.GetValueAsString("ShouldExtractWithGPT");
    if (!shouldExtractWithGPT) {
        return Lib.SOP.Configuration.ShouldProcessEmailWithChatGPT(Attach);
    }
    return shouldExtractWithGPT === "1";
}
function ShouldRecognizeSalesDocumentTypeWithChatGPT() {
    let processEmail = true;
    let recognizeSalesDocumentTypeWithChatGpt = Sys.OM.Helpers.GetConfiguration().SalesDocumentTypeRecognition === "1";
    let emailContent = Sys.Helpers.Email.GetEmailDataFromIsm(Data.GetValue("WorkflowID")).Body;
    if (Variable.GetValueAsString("SDADocTypeSource")) {
        processEmail = false;
        Log.Info("[ShouldRecognizeSalesDocumentTypeWithChatGPT] Sales document type already defined by SDA");
    }
    else if (Data.GetComputedValueSource("SalesDocumentType__") === "teaching") {
        processEmail = false;
        Log.Info("[ShouldRecognizeSalesDocumentTypeWithChatGPT] Teaching extracted a value for Sales Document Type");
    }
    else if (g_bDocumentTypeRecognizedByKeywords) {
        processEmail = false;
        Log.Info("[ShouldRecognizeSalesDocumentTypeWithChatGPT] Document type already detected by keywords. ");
    }
    else if (!recognizeSalesDocumentTypeWithChatGpt) {
        processEmail = false;
        Log.Info("[ShouldRecognizeSalesDocumentTypeWithChatGPT] Sales document type recognition disabled");
    }
    else if (!emailContent) {
        processEmail = false;
        Log.Info("[ShouldRecognizeSalesDocumentTypeWithChatGPT] No email content found. Nothing to extract");
    }
    Log.Info("[ShouldRecognizeSalesDocumentTypeWithChatGPT] processEmail: " + processEmail);
    return processEmail;
}
function InitExtractionInformationsData() {
    var recognitionMethod = Data.GetValue("RecognitionMethod");
    var gptIsUsed = Data.GetValue("Extracted_Using_Gpt__");
    var teachingID = Data.GetValue("SupplementaryRule");
    var AutoLearningTemplateInstance = Data.GetValue("AutoLearningTemplateInstance");
    if ((!recognitionMethod || (recognitionMethod != "Teaching" && recognitionMethod != "AL")) && gptIsUsed) {
        Data.SetValue("RecognitionMethod", "Synergy/GPT");
    }
    if (recognitionMethod === "Teaching" || (teachingID && teachingID != '0')) {
        Data.SetValue("Extracted_Using_Teaching__", true);
    }
    if (recognitionMethod === "AL" || (AutoLearningTemplateInstance && AutoLearningTemplateInstance != '0')) {
        Data.SetValue("Extracted_Using_Autolearning__", true);
    }
    recognitionMethod = Data.GetValue("RecognitionMethod");
    if (recognitionMethod === "AL" || recognitionMethod === "Teaching" || recognitionMethod === "Synergy/GPT") {
        Variable.SetValueAsString("DisplayExtractionInformationsPane", "1");
    }
}
function SpreadsheetDataExtraction() {
    if (Sys.OM.Helpers.GetConfiguration().EnableCsvExtraction !== "1") {
        return;
    }
    let mappingManager = new Sys.Spreadsheets.MappingManager_Server("Customer Order Processing");
    const excludeDueDate = Lib.SOP.Helpers.GetConfiguration().DisplayRequestedDeliveryDate === "0";
    let gptSettings = Sys.OM.GptSettings.CreateGptSettingsHeaderFields(false, excludeDueDate);
    Sys.Helpers.TryCallFunction("Lib.SOP.Customization.Extraction.AddFieldsDescriptions", gptSettings);
    let ExtractGptDataCallback = function (extractedData, config, emailContent) {
        Sys.ML.EskerGpt.ProcessAIExtractResult(extractedData, gptSettings, emailContent);
        ResetBadlyRecognizedDocumentType();
        Data.SetValue("Extracted_Using_Gpt__", true);
    };
    const custNumber = Data.GetValue("CustomerNumber__");
    mappingManager.AutoFillFromCsv(custNumber ? custNumber : null, Data.GetTable("Product_List__"), gptSettings, ExtractGptDataCallback)
        .Catch((errorMessage) => {
        Log.Error("[SpreadsheetDataExtraction]: Error during initialisation : " + errorMessage);
    });
}
//**************************************************************************************************************************
//#region Entry Point
//**************************************************************************************************************************
let cacheForRetries = null;
async function ExtractionScriptEntryPointWithCacheForRetries() {
    Sys.Helpers.EnableSmartSilentChange();
    g_logDebugFtsQueryFilter = false;
    g_MaxReadRecord = 10;
    Variable.SetValueAsString("EmailPreviewFormat", "HTML");
    InitConfig();
    Sys.Helpers.Email.GetEmailDataFromIsm(Data.GetValue("WorkflowID"));
    Lib.SOP.Archiving.SetArchivingParameters();
    if (Sys.OM.Helpers.GetConfiguration().EnableReportingOnItems === "1") {
        let cdlActivation = "Product_List__," + Data.GetTable("Product_List__").GetLocalUniqueId();
        Variable.SetValueAsString("InternalDataTablesToIndex", cdlActivation);
    }
    g_erpOrderDocument = Lib.SOP.ERP.InitializeERPManager(Sys.OM.Helpers.GetConfiguration().ERP);
    if (Sys.OM.Helpers.GetConfiguration().DisplayRequestedDeliveryDate === "0") {
        Data.SetValue("Due_date__", "");
    }
    if (CustomerOrderProcessing.Extraction.UserExit.OnExtractionScriptBegin().stop) {
        return;
    }
    InitInternationalization();
    InitDocAttached();
    SetOwnerToParentProcessOwnerIfSplitOrderChild();
    let isNotAutocomplete = Data.GetActionType() !== "autocomplete";
    if (isNotAutocomplete) {
        InitPriority();
        InitRevisedOrder();
    }
    Lib.SOP.Helpers.GetOrder().setValuesFromConfig();
    if (Sys.OM.Helpers.GetConfiguration().ERP === "Oracle EBS") {
        ComputeItemValidationOrganization();
    }
    await runExtraction();
    if (Data.GetValue("SynergyTemplateID")) {
        Variable.SetValueAsString("SynergyTemplateID", Data.GetValue("SynergyTemplateID"));
    }
    if (Data.GetValue("SynergyPowered")) {
        Variable.SetValueAsString("SynergyPowered", Data.GetValue("SynergyPowered"));
    }
    CustomerOrderProcessing.Extraction.UserExit.OnExtractionScriptEnd();
    Lib.SOP.Salesforce.CreateOrUpdateCase(Lib.SOP.Salesforce.eStages.AtReception, null);
}
async function ExtractionScriptEntryPoint() {
    cacheForRetries = Sys.Helpers.CacheForRetries.CreateCache([
        "RecognizeSalesDocumentTypeFromChatGPT Sys.ML.EskerGpt.Extract",
        "FillFromChatGPT Sys.ML.EskerGpt.Extract"
    ]);
    await ExtractionScriptEntryPointWithCacheForRetries();
    Sys.Helpers.CacheForRetries.ClearCache(cacheForRetries);
    cacheForRetries = null;
}
Sys.Helpers.Promise.GlobalExceptionOnReject(ExtractionScriptEntryPoint().then(() => {
    // BAPI managers must be finalized all the time. Leave this call at the end of the script.
    Lib.SOP.SAP.Helpers.FinalizeAllBapiManagers();
}));
//# sourceMappingURL=extractionscript.js.map