"use strict";
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
const yargs_1 = __importDefault(require("yargs"));
function initialize() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = yield yargs_1.default
            .scriptName("hdicli")
            .version()
            .usage("\nHow to use:\n$0 -u <url> [options]")
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
            default: "./",
            demandOption: false,
        })
            .option("t", {
            alias: "types",
            describe: "The name for the generated types file. (Default: 'types.ts')",
            type: "string",
            demandOption: false,
            default: "types.ts",
        })
            .option("s", {
            alias: "superstruct",
            describe: "The name for the generated superstruct file. (Default: 'superstruct.ts')",
            type: "string",
            demandOption: false,
            default: "superstruct.ts",
        })
            .options("g", {
            alias: "guards",
            describe: "The name for the generated guards file. (Default: 'guards.ts')",
            type: "string",
            demandOption: false,
            default: "guards.ts",
        })
            .help(true)
            .alias({
            h: "help",
            v: "version",
        }).argv;
        if (!options)
            throw new Error("No options provided");
        if (!options.u)
            throw new Error("No URL provided");
        return options;
    });
}
exports.default = initialize;
