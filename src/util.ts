import { MODULE_COMMON } from "./constants";

export const buildTh = (context, columns: ColumnDef[]) => {
    return "<tr>" + columns.reduce((pre, cur) => {
        return `${pre}<th>${cur.label}</th>`;
    }, "") + "</tr>";
}

const formatCell = (context, data: any, def: ColumnDef) => {
    
    if (def.formater) {
        return def.formater(data, def);
    }

    const common = context.modules[MODULE_COMMON]
    const { AkUtil } = common;
    let d = data && data[def.id];
    let rs = "";
    if (d !== null && d !== undefined) {
        if (def.type === "number" || def.type === "currency") {
            rs = AkUtil.formatNumber(d, 2, true);
        } else {
            rs = d;
        }
    }
    return rs;
}

export const buildTd = (context, data: any[], columns: ColumnDef[]) => {
    if (data && data.length) {
        return data.reduce((pred, d) => {
            return `${pred}<tr>${columns.reduce((pre, cur) => {
                return `${pre}<td>${formatCell(context, d, cur)}</td>`
            }, "")}</tr>`
        }, "");
    }
}