import * as React from "react";
export declare class CodeInApplication implements CodeInComp {
    description(): string;
    inputParameters(): InputParameter[];
    requiredFields(params: any): any[];
    render(context: CodeInContext, fieldsValues: any, readonly: boolean): JSX.Element;
}
interface ListChangeCompProps {
    data: any[];
    context: CodeInContext;
    readonly: boolean;
    startNo?: number;
}
export declare class ListChangeComp extends React.Component<ListChangeCompProps, any> {
    cache: any;
    constructor(props: any, context: any);
    process(props: ListChangeCompProps): void;
    componentWillReceiveProps(nextProps: ListChangeCompProps): void;
    render(): any;
}
export {};
