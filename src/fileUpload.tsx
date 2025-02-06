import * as React from "react";
import { MODULE_COMMON, MODULE_BIZCHARTS, MODULE_MOMENT } from "./constants";


interface FileUploadCompProps {
    context: CodeInContext;
    fieldsValues: any;
    readonly: boolean;
}

interface FileUploadCompState {
    loading?: boolean;
    file?: any;
}

class FileUploadComp extends React.Component<FileUploadCompProps, FileUploadCompState> {

    constructor(props, context) {
        super(props, context);
        this.state = { loading: false }
        console.log("File upload comp");
    }

    render() {
        const { context } = this.props;
        const common = context.modules[MODULE_COMMON]
        const { FileUploadMethod, AkSpin, AkButton, AkNotification } = common;
        const { loading, file } = this.state;
        let fieldId = context.params["varId"];
        if (!fieldId) {
            return <div>Please configure input parameter: varId</div>;
        }

        const change = (e) => {
            if (e.target.files.length) {
                this.setState({ file: e.target.files[0] });
            } else {
                this.setState({ file: null });
            }
        }

        const upload = () => {
            this.setState({ loading: true });

            FileUploadMethod.UpLoadFile({ file: this.state.file }).then((d) => {
                console.log("upload complete", d)
                context.setFieldValue(context.params["varId"], d);
                this.setState({ loading: false });
            }, (onrejected) => {
                let msg = onrejected.Message ? onrejected.Message : "Upload failed!";
                AkNotification.error({
                    message: "Tip",
                    description: msg
                });
                this.setState({ loading: false });
            });
        }


        return <AkSpin spinning={loading}>
            <input type="file" onChange={change} />
            <AkButton disabled={!file} onClick={upload}>Upload</AkButton>
        </AkSpin>
    }
}


export class CodeInApplication implements CodeInComp {
    render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
        return <FileUploadComp context={context} fieldsValues={fieldsValues} readonly={readonly} />;
    }

    requiredFields(params) {
        return [];
    }

    requiredModules() {
        return [];
    }

    description() {
        return "Select a file and upload to attachment field";
    }

    inputParameters() {
        return [{
            id: "varId",
            type: "string",
            desc: "Varaible ID of the attachment field"
        }] as InputParameter[];
    }
}