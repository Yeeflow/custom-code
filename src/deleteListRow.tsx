import { LIST_ROW_DELETE, MODULE_COMMON } from "./constants";

export class CodeInApplication implements CodeInComp {
    execute(context: CodeInContext, fieldsValues: any) {
        return new Promise((resolve, reject) => {
            const params = context.params;
            const fieldId = params["varId"];
            if (!fieldId) {
                alert("Please configure input parameter: varId");
                resolve(false);
            }

            let list = fieldsValues[fieldId];

            if (list && list.length > 0) {
                //delete last row from list
                list[list.length - 1][LIST_ROW_DELETE] = true;
                context.setFieldValue(fieldId, [...list]); //form a new object otherwise the list will not be refreshed.
            }

            resolve(true);
        });
    }

    requiredFields(params) {
        return [params["varId"]];
    }

    requiredModules() {
        return [];
    }

    description() {
        return "Delete last row of a list";
    }

    inputParameters() {
        return [{
            id: "varId",
            type: "string",
            desc: "Varaible ID of the list"
        }] as InputParameter[];
    }
}