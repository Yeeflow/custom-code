
/**
 * Fill in sequence number in first column of a Sub List
 */

import * as React from "react";

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
            id: "HTMLId",
            type: "string",
            desc: "HTML element id of Sub List.  Use 'listId' if this is empty."
        }] as InputParameter[];
    }

    requiredFields(params) {
        return [params["listId"]];
    }

    render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
        return <ListChangeComp context={context} />;
    }
}

export class ListChangeComp extends React.Component<any, any> {
    unmount;
    constructor(props, context) {
        super(props, context)
        this.unmount = false;
    }

    componentWillReceiveProps(nextProps) {
        setTimeout(() => {
            if (this.unmount) {
                return;
            }
            const { context: { params } } = nextProps;

            let eleId = params["HTMLId"] || params["listId"];

            const list = document.getElementById(eleId);
            if (list) {
                const table = list.getElementsByClassName("ant-table-tbody")[0];
                const array = Array.from(table.children);
                array.forEach((item, index) => {
                    (item.childNodes[0] as any).innerHTML = `<div style="text-align: center">${index + 1}</div>`;
                })
            }
        })
    }

    componentWillUnmount() {
        this.unmount = true;
    }

    render() {
        return <div></div>;
    }
}