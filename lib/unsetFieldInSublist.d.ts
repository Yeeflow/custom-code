export declare class CodeInApplication implements CodeInComp {
    execute(context: CodeInContext, fieldsValues: any): Promise<unknown>;
    requiredFields(params: any): any[];
    requiredModules(): any[];
    description(): string;
    inputParameters(): InputParameter[];
}
