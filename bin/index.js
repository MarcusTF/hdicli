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
const fs = __importStar(require("node:fs/promises"));
const path_1 = __importDefault(require("path"));
const prettier_1 = __importDefault(require("prettier"));
const swagger_parser_1 = __importDefault(require("@apidevtools/swagger-parser"));
const yargs_1 = __importDefault(require("yargs"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = yield yargs_1.default
            .scriptName("hdicli")
            .version()
            .usage("\nHow to use:\n$0 -u <url> -o <outdir> -n <name>")
            .option("u", {
            alias: "url",
            describe: "The URL of the OpenAPI schema (Required)",
            type: "string",
            demandOption: true,
        })
            .option("o", {
            alias: "outdir",
            describe: "The output directory for the generated files (Default: './')",
            type: "string",
            demandOption: false,
        })
            .option("t", {
            alias: "types",
            describe: "The name for the generated types file. (Default: 'types.ts')",
            type: "string",
            demandOption: false,
        })
            .option("s", {
            alias: "superstruct",
            describe: "The name for the generated superstruct file. (Default: 'superstruct.ts')",
            type: "string",
            demandOption: false,
        })
            .options("g", {
            alias: "guards",
            describe: "The name for the generated guards file. (Default: 'guards.ts')",
            type: "string",
            demandOption: false,
        })
            .help(true)
            .alias({
            h: "help",
            v: "version",
        }).argv;
        if (!options.u) {
            console.error("\nNo URL provided");
            return;
        }
        if (!options.o) {
            console.log("\nNo output directory provided, using './'");
            options.o = "./";
        }
        if (!options.t) {
            console.log("\nNo types name provided, using 'types.ts'");
            options.t = "types.ts";
        }
        if (!options.s) {
            console.log("\nNo superstruct name provided, using 'superstruct.ts'");
            options.s = "superstruct.ts";
        }
        if (!options.g) {
            console.log("\nNo guards name provided, using 'guards.ts'");
            options.g = "guards.ts";
        }
        try {
            yield fs.access(options.o);
        }
        catch (e) {
            console.log(`\nOutput directory ${options.o} does not exist, creating...`);
            yield fs.mkdir(options.o);
        }
        const outPathTS = path_1.default.join(options.o, options.t);
        const outPathSS = path_1.default.join(options.o, options.s);
        const outPathGD = path_1.default.join(options.o, options.g);
        console.log(`\nFetching schema from ${options.u} and parsing...`);
        const schema = yield swagger_parser_1.default.parse(options.u);
        if (!("components" in schema && schema.components && "schemas" in schema.components))
            return;
        const types = schema.components.schemas;
        if (!types || typeof types !== "object")
            return;
        let typescript = "";
        let superstruct = "import { object, string, number, boolean, enums } from 'superstruct'\n";
        console.log("\nGenerating typescript types and superstruct validators...");
        for (const [typeName, type] of Object.entries(types)) {
            const { typescript: ts, superstruct: ss } = generateTypes(type, typescript, typeName, superstruct);
            typescript = ts;
            superstruct = ss;
        }
        const superstructNames = superstruct
            .split("export const")
            .map(s => s.trim().split(" =")[0])
            .slice(1);
        const typeNames = typescript
            .split("export type")
            .map(s => s.trim().split(" =")[0])
            .slice(1);
        console.log("\nGenerating type guards...");
        let guards = typeNames
            .map(typeName => `export const is${typeName} = (value: any): value is ${typeName} => ${typeName}Checker.is(value)`)
            .join("\n");
        const guardsSuperstructImports = `import { ${superstructNames.join(", ")} } from "./superstruct"\n\n`;
        const guardsTypesImports = `import { ${typeNames.join(", ")} } from "./types"\n\n`;
        guards = guardsTypesImports + guardsSuperstructImports + guards;
        guards = prettier_1.default.format(guards, { parser: "typescript" });
        typescript = prettier_1.default.format(typescript, { parser: "typescript" });
        superstruct = prettier_1.default.format(superstruct, { parser: "typescript" });
        console.log("\nWriting files...");
        yield fs.writeFile(outPathTS, typescript);
        yield fs.writeFile(outPathSS, superstruct);
        yield fs.writeFile(outPathGD, guards);
        console.log(`\nSuccess! Files written:\n${outPathTS}\n${outPathSS}\n${outPathGD}\n`);
    }
    catch (error) {
        console.error(error);
    }
});
function generateTypes(type, typescript, typeName, superstruct, isProperty = false) {
    if (!("type" in type) || typeof type.type !== "string")
        return { typescript, superstruct };
    const exportTS = isProperty ? "" : "export type ";
    const exportSS = isProperty ? "" : "export const ";
    const assignmentOperator = isProperty ? ":" : " =";
    const comma = isProperty ? "," : "";
    switch (type.type) {
        case "string":
            if ("enum" in type) {
                typescript += `${exportTS}${typeName}${assignmentOperator} ${type.enum
                    .map((e) => `"${e}"`)
                    .join(" | ")}\n`;
                superstruct += `${exportSS}${typeName}Checker${assignmentOperator} enums(${type.enum
                    .map((e) => `"${e}"`)
                    .join(", ")})${comma}\n`;
                break;
            }
            typescript += `${exportTS}${typeName}${assignmentOperator} string\n`;
            superstruct += `${exportSS}${typeName}Checker${assignmentOperator} string()${comma}\n`;
            break;
        case "integer":
        case "number":
            typescript += `${exportTS}${typeName}${assignmentOperator} number\n`;
            superstruct += `${exportSS}${typeName}Checker${assignmentOperator} number()${comma}\n`;
            break;
        case "boolean":
            typescript += `${exportTS} ${typeName}${assignmentOperator} boolean\n`;
            superstruct += `${exportSS}${typeName}Checker${assignmentOperator} boolean()${comma}\n`;
            break;
        case "array":
            if (!("items" in type))
                return { typescript, superstruct };
            const { typescript: ts, superstruct: ss } = generateTypes(type.items, typescript, typeName, superstruct, true);
            typescript = ts;
            superstruct = ss;
            break;
        case "object":
            if (!("properties" in type))
                return { typescript, superstruct };
            typescript += `${exportTS}${typeName}${assignmentOperator} {\n`;
            superstruct += `${exportSS}${typeName}Checker${assignmentOperator} object({\n`;
            for (const [propertyName, property] of Object.entries(type.properties)) {
                const { typescript: ts, superstruct: ss } = generateTypes(property, typescript, propertyName, superstruct, true);
                typescript = ts;
                superstruct = ss;
            }
            typescript += `}\n`;
            superstruct += `})\n`;
            break;
        default:
            break;
    }
    return { typescript, superstruct };
}
main();
