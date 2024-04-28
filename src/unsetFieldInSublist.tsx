import { LIST_ROW_DELETE, MODULE_COMMON } from "./constants";

export class CodeInApplication implements CodeInComp {
    execute(context: CodeInContext, fieldsValues: any) {
        return new Promise((resolve, reject) => {
            console.log("Execute unset sub list values")
            const params = context.params;
            const fieldId = params["sublistID"];
            let field: string = params["field"];
            if (!fieldId || !field) {
                alert("Please configure input parameter: sublistID and field");
                resolve(false);
            }
            field = field.trim();
            const ctxObj = context.formContext["ctxObj"];
            if (ctxObj) {
                const row = ctxObj[fieldId];
                if (row && row[field]) {
                    const common = context.modules[MODULE_COMMON];
                    const list = fieldsValues[fieldId];
                    let obj = {};
                    list.forEach((ele, idx) => {
                        if (ele["_id"] !== row["_id"] && !ele[LIST_ROW_DELETE]) {
                            obj[`${fieldId}[${idx}].${field}`] = null;
                        }
                    });
                    context.setFieldsValue(obj);
                }
            }
            resolve(true);
        });
    }

    requiredFields(params) {
        return [params["sublistID"]];
    }

    requiredModules() {
        return [];
    }

    description() {
        return "Trigger by sublist field action, unset field in other rows if field has value or true";
    }

    inputParameters() {
        return [{
            id: "sublistID",
            type: "string",
            desc: "Variable ID of the Sub list"
        }, {
            id: "field",
            type: "string",
            desc: "Field to clear"
        }] as InputParameter[];
    }
}