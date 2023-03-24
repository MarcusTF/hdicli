"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function generateTypes(typeObject, typescript, typeName, superstruct, isProperty = false) {
    if (!("type" in typeObject) || typeof typeObject.type !== "string")
        return { typescript, superstruct };
    const exportTS = isProperty ? "" : "export type ";
    const exportSS = isProperty ? "" : "export const ";
    const assignmentOperator = isProperty ? ":" : " =";
    const comma = isProperty ? "," : "";
    switch (typeObject.type) {
        case "string":
            if ("enum" in typeObject) {
                (0, utils_1.parseEnum)(typescript, exportTS, typeName, assignmentOperator, typeObject, superstruct, exportSS, comma);
                break;
            }
            (0, utils_1.parseString)(typescript, exportTS, typeName, assignmentOperator, superstruct, exportSS, comma);
            break;
        case "integer":
        case "number":
            (0, utils_1.parseNumber)(typescript, exportTS, typeName, assignmentOperator, superstruct, exportSS, comma);
            break;
        case "boolean":
            (0, utils_1.parseBool)(typescript, exportTS, typeName, assignmentOperator, superstruct, exportSS, comma);
            break;
        case "array":
            if (!("items" in typeObject))
                return { typescript, superstruct };
            (0, utils_1.parseArray)(typescript, exportTS, typeName, assignmentOperator, superstruct, exportSS, typeObject, comma);
            break;
        case "object":
            if (!("properties" in typeObject))
                return { typescript, superstruct };
            (0, utils_1.parseObject)(typescript, exportTS, typeName, assignmentOperator, superstruct, exportSS, typeObject);
            break;
        default:
            break;
    }
    return { typescript, superstruct };
}
exports.default = generateTypes;
