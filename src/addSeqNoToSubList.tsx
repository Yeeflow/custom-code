
/**
 * Fill in sequence number in first column of a Sub List
 */

import * as React from "react";
import { LIST_ROW_DELETE } from "./constants";

export class CodeInApplication implements CodeInComp {

    description() {
        return "Fill in sequence number in first column of a Sub List";
    }

    inputParameters() {
        return [{
            id: "listId",
            type: "string",
            desc: "Varaible ID of the Sub List, use to monitor the change of the list."
        }, {
            id: "snField",
            type: "string",
            desc: "Field ID of Sub List to store sequence number."
        }] as InputParameter[];
    }

    requiredFields(params) {
        return [params["listId"]];
    }

    render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
        return <ListChangeComp data={fieldsValues[context.params["listId"]]} context={context} readonly={readonly} />;
    }
}


interface ListChangeCompProps {
    data: any[];
    context: CodeInContext;
    readonly: boolean;
}
export class ListChangeComp extends React.Component<ListChangeCompProps, any> {

    cache;

    constructor(props, context) {
        super(props, context)
        console.log("Init addSeqNoToSubList...");
        this.process(props);
    }

    process(props: ListChangeCompProps) {
        const { context, readonly, data } = props;
        if (readonly)
            return;

        if (data && data.length) {
            const { params } = context;
            let idx = 1;
            let changed = false;
            data.forEach((d, i) => {
                if (d && !d[LIST_ROW_DELETE]) {
                    context.setFieldValue(`${params["listId"]}[${i}].${params["snField"]}`, idx++);
                    changed = true;
                }
            });
            if (changed) {
                this.cache = [...data];
                context.setFieldValue(params["listId"], this.cache);
            }
        }
    }

    componentWillReceiveProps(nextProps: ListChangeCompProps) {
        if ("data" in nextProps && nextProps.data !== this.props.data && nextProps.data !== this.cache) {
            this.process(nextProps);
        }
    }

    render() {
        return null;
    }
}