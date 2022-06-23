/**
 * This script can be used in an action to format a list varaible to a table in text variable. The text variable can be used in email notification to show list details.
 */


import { MODULE_COMMON } from "./constants";

export class CodeInApplication implements CodeInComp {
    execute(context: CodeInContext, fieldsValues: any) {
        var table = "<style>table.my, .my th, .my td {border:1px solid red; font-size: 16px}</style><table class='my'><tr><th>Name</th><th>Number</th><th>Desc</th></tr>";

        var l = fieldsValues["list"];
        if (l && l.length > 0) {
            table += l.map(d=>{
                return `<tr><td>${d.field_1}</td><td>${d.field_2}</td><td>${d.field_3}</td></tr>`;
            }).join("");
        }
        context.setFieldValue("formated", table + "</table>");
    }

    requiredFields() {
        return ["list"];
    }

    requiredModules() {
        return [];
    }
}