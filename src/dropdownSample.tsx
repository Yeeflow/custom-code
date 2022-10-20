import * as React from "react";
import { MODULE_COMMON, MODULE_BIZCHARTS, MODULE_MOMENT } from "./constants";

// const FIELD_OPTION = "selectedOption";

interface DropdownSampleProps {
    context: CodeInContext;
    fieldsValues: any;
    readonly: boolean;
}

interface DropdownSampleStates {
    options?: string[];
}

class DropdownSample extends React.Component<DropdownSampleProps, DropdownSampleStates> {

    constructor(props, context) {
        super(props, context);
        this.state = {}
    }


    componentWillMount() {
        this.setState({ options: ["a", "b", "c"] });
    }

    onChange(v) {
        const { context } = this.props;
        context.setFieldValue(context.params["varId"], v);
    }

    render() {
        const { context } = this.props;
        const common = context.modules[MODULE_COMMON]
        const { AkSelect, AkSpin, AkTooltip } = common;
        const { options } = this.state;
        let fieldId = context.params["varId"];
        if (!fieldId) {
            return <div>Please configure input parameter: varId</div>;
        }

        const value = context.getFieldValue(fieldId);
        const desc = context.params["tips"];
        if (options) {
            let control = <AkSelect allowClear value={value} onChange={v => this.onChange(v)}>
                {options.map((o, i) => {
                    return <AkSelect.Option key={i} value={o}>{o}</AkSelect.Option>
                })}
            </AkSelect>
            if (desc) {
                control = <AkTooltip title={desc}><div>{control}</div></AkTooltip>
            }
            return control;
        } else {
            return <AkSpin spinning></AkSpin>
        }
    }
}


export class CodeInApplication implements CodeInComp {
    render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
        return <DropdownSample context={context} fieldsValues={fieldsValues} readonly={readonly} />;
    }

    requiredFields(params) {
        return [params["varId"]];
    }

    requiredModules() {
        return [];
    }

    description() {
        return "Draw a drowdown control on form.";
    }

    inputParameters() {
        return [{
            id: "varId",
            type: "string",
            desc: "Varaible ID of the dropdown control"
        }, {
            id: "tips",
            type: "string",
            desc: "Tips for control"
        }] as InputParameter[];
    }
}