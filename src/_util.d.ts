interface ColumnDef {
    id: string,
    label: string,
    type?: "string" | "number" | "currency",
    opt?: any;
    formater?: (d, def: ColumnDef) => string;
}