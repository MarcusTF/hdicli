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
const prettier_1 = __importDefault(require("prettier"));
const generateTypes_1 = __importDefault(require("./generateTypes"));
const initialize_1 = __importDefault(require("./initialize"));
const utils_1 = require("./utils");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = yield (0, initialize_1.default)();
        yield (0, utils_1.validateDirectory)(options);
        const { outPathTS, outPathSS, outPathGD } = (0, utils_1.generateOutputPaths)(options);
        const types = yield (0, utils_1.parseSchema)(options);
        if (!types || typeof types !== "object")
            return;
        let typescript = "";
        let superstruct = "import { object, string, number, boolean, enums } from 'superstruct'\n";
        console.log("\nGenerating typescript types and superstruct validators...");
        for (const [typeName, type] of Object.entries(types)) {
            const { typescript: ts, superstruct: ss } = (0, generateTypes_1.default)(type, typescript, typeName, superstruct);
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
        let guards = (0, utils_1.generateGuards)(typeNames, superstructNames);
        console.log("\nFormatting files...");
        guards = prettier_1.default.format(guards, { parser: "typescript" });
        typescript = prettier_1.default.format(typescript, { parser: "typescript" });
        superstruct = prettier_1.default.format(superstruct, { parser: "typescript" });
        console.log("\nWriting files...");
        yield fs.writeFile(outPathTS, typescript);
        yield fs.writeFile(outPathSS, superstruct);
        yield fs.writeFile(outPathGD, guards);
        console.log(`\nSuccess! Files written:\n  - ${outPathTS}\n  - ${outPathSS}\n  - ${outPathGD}\n`);
    }
    catch (error) {
        console.error(error);
    }
});
main();
