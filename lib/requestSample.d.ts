export declare class CodeInApplication implements CodeInComp {
    execute(context: CodeInContext, fieldsValues: any): Promise<void>;
    requiredFields(): any[];
    requiredModules(): any[];
}
