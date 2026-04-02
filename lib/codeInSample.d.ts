export declare class CodeInApplication implements CodeInComp {
    description(): string;
    requiredFields(): string[];
    inputParameters(): InputParameter[];
    render(context: CodeInContext, fieldsValues: any, readonly: boolean): JSX.Element;
}
