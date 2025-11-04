/* LIB_DEFINITION{
  "name": "Lib_CM_WorkflowDefinition",
  "libraryType": "Lib",
  "scriptType": "COMMON",
  "comment": "CM library",
  "versionable": false,
  "require": [
    "Sys/Sys_CM_WorkflowDefinition"
  ]
}*/
///#GLOBALS Lib Sys

var Lib = Lib || {};
Lib.CM = Lib.CM || {};

Lib.CM.WorkflowDefinition = (function ()
{
	return {
		AddJSONTo: function (definitions)
		{
			definitions.push(Sys.CM.WorkflowDefinition.GetJSON(2));
		}
	};
})();
