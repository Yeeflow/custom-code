import { MODULE_REQUEST } from './constants';


export class CodeInApplication implements CodeInComp {
    async execute(context: CodeInContext, fieldsValues: any) {
        const request = context.modules[MODULE_REQUEST];
        try {
            console.log("test request.get")
            var res = await request.get("https://api.yeeflow.com/v1/lists/41/1168816360516620288");
            console.log("request success", res);
        } catch (ex) {
            console.log("request error", ex);
        }

        try {
            console.log("test request()")
            var res = await request("https://api.yeeflow.com/v1/lists/41/1168816360516620288");
            console.log("request success", res);
        } catch (ex) {
            console.log("request error", ex);
        }

        let id;
        try {
            console.log("test request.post")
            var res = await request.post("https://api.yeeflow.com/v1/lists/41/1168816360516620288/items", { Data: { Title: "ABCD" + Math.random() } });
            if (res.ok) {
                id = res.body.Data;
            }
            console.log("request success", res, id);
        } catch (ex) {
            console.log("request error", ex);
        }

        if (id) {
            try {
                console.log("test request.delete")
                var res = await request.del("https://api.yeeflow.com/v1/lists/41/1168816360516620288/items/" + id);                
                console.log("request success", res, id);
            } catch (ex) {
                console.log("request error", ex);
            }
        }
        
    }

    requiredFields() {
        return [];
    }

    requiredModules() {
        return [];
    }
}