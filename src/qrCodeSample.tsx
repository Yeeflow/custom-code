import * as React from "react";
import { MODULE_BIZCHARTS, MODULE_COMMON, MODULE_MOMENT } from "./constants";
import * as ReactDOM from 'react-dom';


interface ChartSampleProps {
    context: CodeInContext;
    fieldsValues: any;
    readonly: boolean;
}

interface ChartSampleStates {
    data?: any[];
}

class QRSample extends React.Component<ChartSampleProps, ChartSampleStates> {

    constructor(props, context) {
        super(props, context);
    }


    render() {
        // const ReactDOM = require('react-dom');
        console.log("ReactDOM", ReactDOM);
        const { context } = this.props;
        const common = context.modules[MODULE_COMMON]
        const { AkQRCodeLoadable, AkUtil } = common;

        let tracking = AkUtil.get(context, "formContext.taskDetail.ApplicationInfo.FlowNo");
        if (tracking) {
            return <AkQRCodeLoadable size={256} value={tracking} />
        } else {
            return null;
        }
    }
}


export class CodeInApplication implements CodeInComp {
    render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
        return <QRSample context={context} fieldsValues={fieldsValues} readonly={readonly} />;
    }

    requiredFields() {
        return [];
    }

    requiredModules() {
        return [];
    }
}