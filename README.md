# custom-code
Build your script for custom code control and action in [Yeeflow](https://www.yeeflow.com)


# Why

The document is used to describe how to implement your custom scription in:
- Application Form/Content List Layout - page control
- Application Form/Content List Layout - actions
- Application Page - Code Script block

# How
According to the scene used, there are two types of Custom Code: Script Execution and UI Rendering.  Script Execution is used in actions.  UI Rendering as described, will be rendered as a component on the page.

Please note that Script Execution can also interact with UI by pop-up dialogs or change form values.

## Interface CodeInComp
To create your custom code script, you need to implement CodeInComp interface.  There are five methods to be implemented optionally.

- `render` is how to render your component
- `execute` is what to do when action performed
- `requiredFields` returns an array of field ids.  These fields and values will be passed by fieldsValues parameter. Re-render will be triggered if any changes to the registered fields.
- `requiredModules` returns an array of module names.  Currently, we support `['moment', 'bizcharts']` [moment](https://momentjs.com/) [bizcharts](https://bizcharts.net/)
- `onLoaded` Event to notify custom page to calculate height for Page Widget with auto height setting

```
interface CodeInContext {
    /** Retrieve modules registered in requiredModules */
    modules: any;
    /** Get field value of Form or List Item */
    getFieldValue: (field: string) => any;
    /** Set field value of Form or List Item */
    setFieldValue: (field: string, value: any) => void;
    formContext?: AkFCFormContext;
}

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
    requiredFields?: () => string[];
    
    /**
     * Required Modules will be injected via modules in CodeInContext
     */
    requiredModules?: () => string[];

    /**
     * Event to notify custom page to calculate height for Page Widget with auto height setting
     */
    onLoaded?: () => void;
}
```

## Code Sample
codeInExecute.tsx is the sample for Script Execution.
codeInSample.tsx is the sample for UI Rendering.

In webpack.config.js, section entry defines the build entries of each component.  Add entry for your component here.
```
entry: {
        codeInSample: './src/codeInSample.tsx',
        codeInExecute: './src/codeInExecute.tsx',
    },
```

Compiled components will be available in dist folder.

## How To Compile
1. Run `npm install` to install required packages
1. Run `npm run compile` to compile components
1. Copy the content of corresponding js file in **dist** folder
1. Paste the content to Code script field of your Custom Code control.
1. Then you can preview the result

![image.png](/.attachments/image-ba6cf6b8-8148-4cec-9710-b95782bb336d.png)
