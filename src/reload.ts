/**
 * Reload current page
 */

export class CodeInApplication implements CodeInComp {
    execute(context: CodeInContext, fieldsValues: any) {
        window.location.reload();
    }

    requiredFields() {
        return [];
    }

    requiredModules() {
        return [];
    }
}