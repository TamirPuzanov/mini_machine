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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandType = exports.OverflowError = exports.InferiorityError = exports.ConnectednessError = exports.Package = exports.Tape = exports.Program = exports.ParseError = exports.Parser = void 0;
const Parser_1 = __importStar(require("./Parser"));
exports.Parser = Parser_1.default;
Object.defineProperty(exports, "ParseError", { enumerable: true, get: function () { return Parser_1.ParseError; } });
const Program_1 = require("./Program");
Object.defineProperty(exports, "Program", { enumerable: true, get: function () { return Program_1.Program; } });
const Package_1 = require("./Package");
Object.defineProperty(exports, "Package", { enumerable: true, get: function () { return Package_1.Package; } });
Object.defineProperty(exports, "ConnectednessError", { enumerable: true, get: function () { return Package_1.ConnectednessError; } });
Object.defineProperty(exports, "InferiorityError", { enumerable: true, get: function () { return Package_1.InferiorityError; } });
Object.defineProperty(exports, "OverflowError", { enumerable: true, get: function () { return Package_1.OverflowError; } });
const Command_1 = require("./Command");
Object.defineProperty(exports, "CommandType", { enumerable: true, get: function () { return Command_1.CommandType; } });
const Tape_1 = require("./Tape");
Object.defineProperty(exports, "Tape", { enumerable: true, get: function () { return Tape_1.Tape; } });
//# sourceMappingURL=index.js.map