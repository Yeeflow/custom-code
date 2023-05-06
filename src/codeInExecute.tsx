import { MODULE_COMMON } from "./constants";

export class CodeInApplication implements CodeInComp {
    execute(context: CodeInContext, fieldsValues: any) {
        return new Promise((resolve, reject) => {
            const params = context.params;
            const fieldId = params["varId"];
            if (!fieldId) {
                alert("Please configure input parameter: varId");
                resolve(false);
            }

            const common = context.modules[MODULE_COMMON];
            const { AkModal } = common;
            AkModal.confirm({
                title: "Script sample",
                content: params["content"],
                onOk: () => {
                    let obj = {};
                    obj[fieldId] = !fieldsValues[fieldId];
                    context.setFieldsValue(obj);
                    resolve(true);
                },
                onCancel: () => {
                    resolve(false);
                }
            });
        });
    }

    requiredFields(params) {
        return [params["varId"]];
    }

    requiredModules() {
        return [];
    }

    description() {
        return "Show a modal dialog.  And toggle the swtich value of provided varId.";
    }

    inputParameters() {
        return [{
            id: "varId",
            type: "string",
            desc: "Varaible ID of the switch control"
        }, {
            id: "content",
            type: "string",
            desc: "Modal dialog content"
        }] as InputParameter[];
    }
}