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
const openapi_zod_client_1 = require("openapi-zod-client");
const axios_1 = __importDefault(require("axios"));
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
            .option("n", {
            alias: "name",
            describe: "The name of the generated files. (Default: 'interfaces.ts')",
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
        if (!options.n) {
            console.log("\nNo name provided, using 'interfaces.ts'");
            options.n = "interfaces.ts";
        }
        const outpath = path_1.default.join(options.o, options.n);
        console.log(`\nFetching schema from ${options.u}...`);
        const { data: schema } = yield axios_1.default.get(options.u);
        console.log('\nGenerating interfaces with "openapi-zod-client"...');
        const openApiDoc = (yield swagger_parser_1.default.parse(schema));
        console;
        const generated = yield (0, openapi_zod_client_1.generateZodClientFromOpenAPI)({
            openApiDoc,
            distPath: outpath,
        });
        console.log("\nCleaning up generated interfaces...");
        const removeEverythingBelowInterfaces = (s) => s.replace(/export const schemas.*/gms, "");
        const removeZodios = (s) => s.replace(/^import.*"@zodios\/core";$\n/gm, "");
        const exportAllInterfaces = (s) => s.replace(/(const)/gm, "export $1");
        const endpointsRemoved = removeEverythingBelowInterfaces(generated);
        const zodiosRemoved = removeZodios(endpointsRemoved);
        const interfaces = exportAllInterfaces(zodiosRemoved);
        console.log(`\nWriting interfaces to "${outpath}"...`);
        fs.writeFile(outpath, interfaces).then(() => console.log(`\nSuccess!\n\nGenerated interfaces can be found in: "${outpath}". You can now import them in your code.\n`));
    }
    catch (e) {
        console.error(e);
    }
});
main();
