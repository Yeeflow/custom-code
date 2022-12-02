import * as React from "react";
import { FILTER_VAR_PREFIX, MODULE_BIZCHARTS, MODULE_COMMON, MODULE_MOMENT } from "./constants";
import * as ReactDOM from 'react-dom';


interface FilterSampleProps {
    context: CodeInContext;
}

interface FilterSampleStates {
    filterVar?: string;
    triggerOnChange?: boolean;
    titleValues?: string[];
}

class FilterSample extends React.Component<FilterSampleProps, FilterSampleStates> {

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    renderInit() {
        const { context } = this.props;
        const common = context.modules[MODULE_COMMON]
        const { AkSwitch, AkUtil } = common;
        const { filterVar, triggerOnChange } = this.state;
        return <div style={{ borderBottom: "1px solid #ccc", marginBottom: 20 }}>
            <label>Filter varaible</label>
            <input value={filterVar} onChange={e => this.setState({ filterVar: e.target.value })} />
            <label>Trigger onChange?</label>
            <AkSwitch value={triggerOnChange} onChange={v => this.setState({ triggerOnChange: v })} />
        </div>
    }

    filterChange(key, v) {
        this.setState({ [key]: v }, () => {
            if (this.state.triggerOnChange) {
                this.search();
            }
        })
    }

    search() {
        const { titleValues, filterVar } = this.state;
        let filter: FilterObj[] = [];
        if (titleValues && titleValues.length > 0) {
            filter.push({ Pre: "and", WhereName: "Title", Type: 9, Value: JSON.stringify(titleValues) });
        }
        this.props.context.setFieldValue(FILTER_VAR_PREFIX + filterVar, filter);
    }

    render() {
        const { context } = this.props;
        const common = context.modules[MODULE_COMMON]
        const { titleValues, triggerOnChange } = this.state;
        const { AkCheckboxGroup } = common;
        return <div>
            {this.renderInit()}
            <div>
                <label>Title</label>
                <div>
                    <AkCheckboxGroup value={titleValues} options={["a", "b", "c", "d"]} onChange={v => this.filterChange("titleValues", v)} />
                </div>
                {!triggerOnChange && <button onClick={() => this.search()}>Search</button>}
            </div>
        </div>
    }
}


export class CodeInApplication implements CodeInComp {
    render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
        return <FilterSample context={context} />;
    }

    requiredFields() {
        return [];
    }

    requiredModules() {
        return [];
    }
}