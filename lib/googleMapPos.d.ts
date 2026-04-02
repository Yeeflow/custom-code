export declare class CodeInApplication implements CodeInComp {
    render(context: CodeInContext, fieldsValues: any, readonly: boolean): JSX.Element;
    requiredFields(params: any): any[];
    requiredModules(): any[];
    inputParameters(): InputParameter[];
}
