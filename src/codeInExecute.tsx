import { MODULE_COMMON } from "./constants";

export class CodeInApplication implements CodeInComp {
    execute(context: CodeInContext, fieldsValues: any) {
        return new Promise((resolve, reject) => {
            const common = context.modules[MODULE_COMMON];
            const { AkModal } = common;
            AkModal.confirm({
                title: "Script sample",
                content: "Do you want to execute script?",
                onOk: () => {
                    context.setFieldValue("field_2", !fieldsValues["field_2"]);
                    resolve(true);
                },
                onCancel: () => {
                    resolve(false);
                }
            });
        });
    }

    requiredFields() {
        return ["field_2"];
    }

    requiredModules() {
        return [];
    }
}