import * as React from "react";
import { MODULE_COMMON, MODULE_BIZCHARTS, MODULE_MOMENT } from "./constants";

const FIELD_OPTION = "selectedOption";

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
        context.setFieldValue(FIELD_OPTION, v);
    }

    render() {
        const { context } = this.props;
        const common = context.modules[MODULE_COMMON]
        const { AkSelect, AkSpin } = common;
        const { options } = this.state;
        const value = context.getFieldValue(FIELD_OPTION);
        if (options) {
            return <AkSelect allowClear value={value} onChange={v => this.onChange(v)}>
                {options.map((o, i) => {
                    return <AkSelect.Option key={i} value={o}>{o}</AkSelect.Option>
                })}
            </AkSelect>
        } else {
            return <AkSpin spinning></AkSpin>
        }
    }
}


export class CodeInApplication implements CodeInComp {
    render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
        return <DropdownSample context={context} fieldsValues={fieldsValues} readonly={readonly} />;
    }

    requiredFields() {
        return [FIELD_OPTION];
    }

    requiredModules() {
        return [MODULE_BIZCHARTS, MODULE_MOMENT];
    }
}