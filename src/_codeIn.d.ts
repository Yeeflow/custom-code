interface CodeInComp {
    /**
     * UI rendering method for Form Control or Page Widget
     */
    render?: (context: CodeInContext, fieldsValues: any, readonly: boolean) => any;

    /**
     * Script execution method for Form Action
     */
    async execute?: (context: CodeInContext, fieldsValues: any) => void;

    /**
     * Required fields will be passed by fieldsValues.  Re-render will be triggered if any changes to the registered fields.
     */
    requiredFields?: (params: CodeInParams) => string[];

    /**
     * Required Modules will be injected via modules in CodeInContext
     */
    requiredModules?: (params: CodeInParams) => string[];

    /**
     * return description of the custom code
     */
    description?: () => string;
    /**
     * Define the input parameters for the custom code component.
     */
    inputParameters?: () => InputParameter[];
}

/**
 * Context interface for script execution.
 * 1. For HTTP requests, use \`context.modules.request\` (which is a Superagent instance).
 * 2. Use \`context.getFieldValue\` / \`context.setFieldsValue\` to interact with form data.
 */
interface CodeInContext {
    /** * Access to pre-registered external libraries.
     * @property {any} request - A Superagent instance for making HTTP calls.
     * @property {(src: string, cb?: () => void) => Promise<null>} loadScript - Load an external script by URL.
     */
    modules: {
        request: any; // Superagent library instance. Example: context.modules.request.get(url).query(params).then(res => ...)
        loadScript: (src: string, cb?: () => void) => Promise<null>; // Example: await context.modules.loadScript(src)
        [key: string]: any;
    };

    /** Retrieves the current value of a specific field from a Form or List Item */
    getFieldValue: (field: string) => any;

    /** Updates the value of a single field in a Form or List Item */
    setFieldValue: (field: string, value: any) => void;

    /** Updates multiple fields simultaneously using a key-value object */
    setFieldsValue: (object: { [key: string]: any }) => void;

    /** Retrieves the value of a filter variable */
    getFilterVar: (varId: string) => any;

    /** Sets the value of a filter variable */
    setFilterVar: (varId: string, value: any) => void;

    /** Retrieves a runtime temporary variable */
    getTempVar: (varId: string) => any;

    /** Sets a runtime temporary variable for cross-script data sharing */
    setTempVar: (varId: string, value: any) => void;

    /** Raw form context object (optional) */
    formContext?: AkFCFormContext;

    /** Additional parameters passed to the script execution */
    params: CodeInParams;
}

interface AkFCFormContext {
    form?: FastFormContext;
    defKey?: string;
    appID?: string;
    draftID?: string;
    setLoading?: (loading: boolean) => void;//set loading for current form
    router?: InjectedRouter;
}

interface FastFormContext {
    /** Get fields values, return all if fieldNames is null */
    getFieldsValue(fieldNames?: Array<string>): Object;
    /** Get field value */
    getFieldValue(fieldName: string): any;
    /** Set fields values with a key value object */
    setFieldsValue(obj: Object): void;

    /** Get form item props */
    getItemProps(fieldName: string): FormItemProps;

    /** Set form item props */
    setItemProps(fieldName: string, props: FormItemProps, noTrigger?: boolean);

    /** Set props of the wrapped component */
    setComponentProps(fieldName: string, props: any);

    /** Get props of the wrapped component */
    getComponentProps(fieldName: string);

    validateFields(callback?: ValidateCallback): void;

    // Validate form fields.  names an options parameters take no effects right now.
    validateFieldsAndScroll(names, options?, callback?: ValidateCallback): void;

    /**
     * Subscribe field change events, return a method to unscribe.
     * @param fieldName 
     * @param listner 
     */
    subscribeFieldChange(fieldName: string, listner: () => void): () => void;
    subscribeFieldPropsChange(fieldName: string, listner: () => void): () => void;
    subscribeRulePropsChange(fieldName: string, listner: () => void): () => void;

    /** Render a form item */
    renderFormItem(key: string, fieldName: string, options: FormItemOptions): (node: React.ReactNode) => React.ReactNode;
}

interface InputParameter {
    id: string;
    type?: "string" | "number" | "variable";
    desc?: string;
}

/**
 * An object holds the key value pair of input parameters.
 */
interface CodeInParams {
    [key: string]: any;
}


interface FilterObj {
    WhereName?: string;
    Type?: number;
    Value?: string; //must be string. use JSON.stringfy to convert array
    Pre?: "and" | "or"; //relation to previous condition
    Child?: FilterObj[]; //grouped conditions
}