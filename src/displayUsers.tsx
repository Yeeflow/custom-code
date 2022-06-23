/**
 * A component load users and display in a table
 */

import * as React from "react";
import { MODULE_BIZCHARTS, MODULE_COMMON, MODULE_REQUEST } from "./constants";


interface ChartSampleProps {
    context: CodeInContext;
    fieldsValues: any;
    readonly: boolean;
}

interface ChartSampleStates {
    data?: any[];
}

class ChartSample extends React.Component<ChartSampleProps, ChartSampleStates> {

    constructor(props, context) {
        super(props, context);
        this.state = {}
    }

    
    componentWillReceiveProps(nextProps: Readonly<ChartSampleProps>, nextContext: any): void {
        this.loadUsers();
    }
    
    loadUsers() {
        const { context } = this.props;
        const request = context.modules[MODULE_REQUEST];
        request.post("https://api.yeeflow.com/v1/users/search", { PageIndex: 0, PageSize: 1000 }).then(
            r => {
                console.log("Query result", r);
                if (r.ok) {
                    var rs = JSON.parse(r.text);
                    if (rs.Status === 0) {
                        this.setState({ data: rs.Data });
                    }
                } else {
                    alert("Query user error!");
                }
            }
        );
    }

    componentDidMount() {
        this.loadUsers();
    }



    render() {
        // const ReactDOM = require('react-dom');
        const { context } = this.props;
        const common = context.modules[MODULE_COMMON]
        const { AkSpin } = common;
        const { data } = this.state;
        return <AkSpin spinning={!data}>
            <table>
                <tr><th>Photo</th><th>Name</th><th>Email</th><th>Manager</th></tr>
                {data && data.map(d=>{
                    return <tr><td><img width={50} height={50} src={d.Photo}></img></td><td>{d.Name}</td><td>{d.Email}</td><td>{d.LineManager}</td></tr>
                })}
            </table>
        </AkSpin>;
    }
}


export class CodeInApplication implements CodeInComp {
    render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
        return <ChartSample context={context} fieldsValues={fieldsValues} readonly={readonly} />;
    }

    requiredFields() {
        return ["mgr"];
    }

    requiredModules() {
        return [];
    }
}