"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGuards = exports.parseSchema = exports.validateDirectory = exports.generateOutputPaths = exports.parseObject = exports.parseArray = exports.parseBool = exports.parseNumber = exports.parseEnum = exports.parseString = void 0;
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("node:fs/promises"));
const generateTypes_1 = __importDefault(require("./generateTypes"));
const swagger_parser_1 = __importDefault(require("@apidevtools/swagger-parser"));
function parseString(typescript, exportTS, typeName, assignmentOperator, superstruct, exportSS, comma) {
    typescript += `${exportTS}${typeName}${assignmentOperator} string\n`;
    superstruct += `${exportSS}${typeName}Checker${assignmentOperator} string()${comma}\n`;
    return { typescript, superstruct };
}
exports.parseString = parseString;
function parseEnum(typescript, exportTS, typeName, assignmentOperator, type, superstruct, exportSS, comma) {
    typescript += `${exportTS}${typeName}${assignmentOperator} ${type.enum.map((e) => `"${e}"`).join(" | ")}\n`;
    superstruct += `${exportSS}${typeName}Checker${assignmentOperator} enums(${type.enum
        .map((e) => `"${e}"`)
        .join(", ")})${comma}\n`;
    return { typescript, superstruct };
}
exports.parseEnum = parseEnum;
function parseNumber(typescript, exportTS, typeName, assignmentOperator, superstruct, exportSS, comma) {
    typescript += `${exportTS}${typeName}${assignmentOperator} number\n`;
    superstruct += `${exportSS}${typeName}Checker${assignmentOperator} number()${comma}\n`;
    return { typescript, superstruct };
}
exports.parseNumber = parseNumber;
function parseBool(typescript, exportTS, typeName, assignmentOperator, superstruct, exportSS, comma) {
    typescript += `${exportTS} ${typeName}${assignmentOperator} boolean\n`;
    superstruct += `${exportSS}${typeName}Checker${assignmentOperator} boolean()${comma}\n`;
    return { typescript, superstruct };
}
exports.parseBool = parseBool;
function parseArray(typescript, exportTS, typeName, assignmentOperator, superstruct, exportSS, type, comma) {
    typescript += `${exportTS}${typeName}${assignmentOperator} [\n`;
    superstruct += `${exportSS}${typeName}Checker${assignmentOperator} array(`;
    for (const item of type.items) {
        const { typescript: ts, superstruct: ss } = (0, generateTypes_1.default)(item, typescript, typeName, superstruct, true);
        typescript = ts;
        superstruct = ss;
    }
    typescript += `]\n`;
    superstruct += `)${comma}\n`;
}
exports.parseArray = parseArray;
function parseObject(typescript, exportTS, typeName, assignmentOperator, superstruct, exportSS, type) {
    typescript += `${exportTS}${typeName}${assignmentOperator} {\n`;
    superstruct += `${exportSS}${typeName}Checker${assignmentOperator} object({\n`;
    for (const [propertyName, property] of Object.entries(type.properties)) {
        const { typescript: ts, superstruct: ss } = (0, generateTypes_1.default)(property, typescript, propertyName, superstruct, true);
        typescript = ts;
        superstruct = ss;
    }
    typescript += `}\n`;
    superstruct += `})\n`;
}
exports.parseObject = parseObject;
function generateOutputPaths(options) {
    const outPathTS = path_1.default.join(options.o, options.t);
    const outPathSS = path_1.default.join(options.o, options.s);
    const outPathGD = path_1.default.join(options.o, options.g);
    return { outPathTS, outPathSS, outPathGD };
}
exports.generateOutputPaths = generateOutputPaths;
function validateDirectory(options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs.access(options.o);
        }
        catch (e) {
            console.log(`\nOutput directory ${options.o} does not exist, creating...`);
            yield fs.mkdir(options.o);
        }
    });
}
exports.validateDirectory = validateDirectory;
function parseSchema(options) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`\nFetching schema from ${options.u} and parsing...`);
        const schema = yield swagger_parser_1.default.parse(options.u);
        if (!("components" in schema && schema.components && "schemas" in schema.components))
            throw new Error("No schemas found in schema");
        const types = schema.components.schemas;
        return types;
    });
}
exports.parseSchema = parseSchema;
function generateGuards(typeNames, superstructNames) {
    console.log("\nGenerating type guards...");
    let guards = typeNames
        .map(typeName => `export const is${typeName} = (value: any): value is ${typeName} => ${typeName}Checker.is(value)`)
        .join("\n");
    const guardsSuperstructImports = `import { ${superstructNames.join(", ")} } from "./superstruct"\n\n`;
    const guardsTypesImports = `import { ${typeNames.join(", ")} } from "./types"\n\n`;
    guards = guardsTypesImports + guardsSuperstructImports + guards;
    return guards;
}
exports.generateGuards = generateGuards;
