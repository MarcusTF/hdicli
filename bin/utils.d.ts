export type Options = {
    [x: string]: unknown;
    u: string;
    o: string;
    t: string;
    s: string;
    g: string;
    _: (string | number)[];
    $0: string;
} | {
    [x: string]: unknown;
    u: string;
    o: string;
    t: string;
    s: string;
    g: string;
    _: (string | number)[];
    $0: string;
};
export declare function parseString(typescript: string, exportTS: string, typeName: string, assignmentOperator: string, superstruct: string, exportSS: string, comma: string): {
    typescript: string;
    superstruct: string;
};
export declare function parseEnum(typescript: string, exportTS: string, typeName: string, assignmentOperator: string, type: any, superstruct: string, exportSS: string, comma: string): {
    typescript: string;
    superstruct: string;
};
export declare function parseNumber(typescript: string, exportTS: string, typeName: string, assignmentOperator: string, superstruct: string, exportSS: string, comma: string): {
    typescript: string;
    superstruct: string;
};
export declare function parseBool(typescript: string, exportTS: string, typeName: string, assignmentOperator: string, superstruct: string, exportSS: string, comma: string): {
    typescript: string;
    superstruct: string;
};
export declare function parseArray(typescript: string, exportTS: string, typeName: string, assignmentOperator: string, superstruct: string, exportSS: string, type: any, comma: string): void;
export declare function parseObject(typescript: string, exportTS: string, typeName: string, assignmentOperator: string, superstruct: string, exportSS: string, type: any): void;
export declare function generateOutputPaths(options: Options): {
    outPathTS: string;
    outPathSS: string;
    outPathGD: string;
};
export declare function validateDirectory(options: Options): Promise<void>;
export declare function parseSchema(options: Options): Promise<{
    [key: string]: import("openapi-types").OpenAPIV3.ReferenceObject | import("openapi-types").OpenAPIV3.SchemaObject;
} | Record<string, import("openapi-types").OpenAPIV3_1.SchemaObject> | undefined>;
export declare function generateGuards(typeNames: string[], superstructNames: string[]): string;
