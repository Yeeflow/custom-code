/**
 * This script can be used in an action to format a list varaible to a table in text variable. The text variable can be used in email notification to show list details.
 */


import { MODULE_COMMON } from "./constants";
import { buildTd, buildTh } from "./util";


const DEF_TABLE: ColumnDef[] = [
    { id: "field_1", label: "Name" },
    { id: "field_2", label: "Number", type: "number" },
    { id: "field_3", label: "Desc" }
]

export class CodeInApplication implements CodeInComp {
    execute(context: CodeInContext, fieldsValues: any) {
        console.log("format Sub list to a table");
        var table = "<style>table.my, .my th, .my td {border:1px solid red; font-size: 16px}</style><table class='my'>" + buildTh(context, DEF_TABLE);

        var l = fieldsValues["list"];
        table += buildTd(context, l, DEF_TABLE);
        context.setFieldValue("formatted", table + "</table>");
    }

    requiredFields() {
        return ["list"];
    }

    requiredModules() {
        return [];
    }
}