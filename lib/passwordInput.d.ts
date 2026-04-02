export declare class CodeInApplication implements CodeInComp {
    render(context: CodeInContext, fieldsValues: any, readonly: boolean): JSX.Element;
    requiredFields(): string[];
    requiredModules(): string[];
}
