/**
 * Draw a modal dialog display a web page in iframe
 */


import * as React from "react";
import { MODULE_COMMON } from "./constants";

// const FIELD_OPTION = "selectedOption";

interface ModalDialogIframeProps {
    title?: string;
    url?: string;
    visible?: boolean;
    onClose?: () => void;
    context: CodeInContext;
    fieldsValues: any;
    readonly: boolean;
}

interface DropdownSampleStates {
    options?: string[];
}

class ModalDialogIframe extends React.Component<ModalDialogIframeProps, DropdownSampleStates> {

    constructor(props, context) {
        super(props, context);
    }


    render() {
        const { context, visible, url, title, onClose } = this.props;
        const common = context.modules[MODULE_COMMON]
        const { AkModal } = common;
        if (visible && url) {
            return <AkModal wrapClassName="nopadding" visible fullscreen title={title} footer={null} onCancel={onClose}>
                <iframe width="100%" height="99%" frameBorder="0" src={url}></iframe>
            </AkModal>
        } else {
            return null;
        }
    }
}


export class CodeInApplication implements CodeInComp {
    render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
        const { title, urlVar, visibleVar } = context.params;
        return <ModalDialogIframe onClose={() => { context.setFieldValue(visibleVar, false) }} title={title} visible={fieldsValues[visibleVar]} url={fieldsValues[urlVar]} context={context} fieldsValues={fieldsValues} readonly={readonly} />;
    }

    requiredFields(params) {
        return [params["visibleVar"], params["urlVar"]];
    }

    requiredModules() {
        return [];
    }

    description() {
        return "Draw a modal dialog display a web page in iframe";
    }

    inputParameters() {
        return [
            {
                id: "title",
                type: "string",
                desc: "Title of the dialog"
            }, {
                id: "visibleVar",
                type: "string",
                desc: "Varaible to control visible of the dialog"
            }, {
                id: "urlVar",
                type: "string",
                desc: "Variable ID of the web page URL"
            }] as InputParameter[];
    }
}