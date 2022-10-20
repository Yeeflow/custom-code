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
     * Event to notify custom page to calculate height for Page Widget with auto height setting
     */
    onLoaded?: () => void;

    /**
     * return description of the custom code
     */
    description?: () => string;
    /**
     * Define the input parameters for the custom code component.
     */
    inputParameters?: () => InputParameter[];
}

interface CodeInContext {
    /** Retrieve modules registered in requiredModules */
    modules: any;
    /** Get field value of a Form or List Item */
    getFieldValue: (field: string) => any;
    /** Set field value of a Form or List Item */
    setFieldValue: (field: string, value: any) => void;
    formContext?: AkFCFormContext;
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


interface Request {
    /** HTTP GET Method  */
    get(url: string, data?: any, emptyData?: any);
    /** HTTP POST Method  */
    post(url: string, data?: any, emptyData?: any);
    /** HTTP DELETE Method  */
    del(url: string, data?: any, emptyData?: any);
    /** HTTP PUT Method  */
    put(url: string, data?: any, emptyData?: any);
}

interface InputParameter {
    id: string;
    type?: "string" | "number";
    desc?: string;
}

/**
 * An object holds the key value pair of input parameters.
 */
interface CodeInParams {
    [key: string]: any;
}