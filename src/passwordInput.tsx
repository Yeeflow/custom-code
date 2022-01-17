import * as React from "react";
import { MODULE_BIZCHARTS, MODULE_COMMON, MODULE_MOMENT } from "./constants";


export class CodeInApplication implements CodeInComp {
    render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
        var v = fieldsValues["pwd"];
        return <input type="password" value={v} onChange={d=> context.setFieldValue("pwd", d.target.value)} />
    }

    requiredFields() {
        return ["pwd"];
    }

    requiredModules() {
        return [MODULE_BIZCHARTS, MODULE_MOMENT];
    }
}