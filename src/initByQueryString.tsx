import * as React from "react";


interface InitByQueryStringProps {
    context: CodeInContext;
    readonly: boolean;
}


class InitByQueryString extends React.Component<InitByQueryStringProps, any> {

    constructor(props, context) {
        super(props, context);
        console.log("InitByQueryString constructor");
    }

    componentDidMount () {
        const {context} = this.props;
        //load parameters from query string;
        let url_params = new URLSearchParams(window.location.search);
        if (url_params.has('ids')) {
            context.setFieldValue("Title", url_params.get('ids'));
        }
    }
    

    render() {
        return null;
    }
}


export class CodeInApplication implements CodeInComp {
    render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
        return <InitByQueryString context={context} readonly={readonly} />;
    }

    requiredFields() {
        return [];
    }

    requiredModules() {
        return [];
    }
}