"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseError = void 0;
const Command_1 = require("./Command");
class ParseError extends Error {
    constructor(line) {
        super("invalid format string in line " + line);
        this.name = "ParseError";
    }
}
exports.ParseError = ParseError;
class Parser {
    static parse(str) {
        let lines = str.split("\n");
        let command_list = new Map();
        let current_command;
        let current_command_type;
        let current_command_reducer;
        for (let i = 0; i < lines.length; i++) {
            if (Parser.empty_string_template.test(lines[i])) {
                continue;
            }
            current_command_type = null;
            for (let command_type of Parser.templates.keys()) {
                if (Parser.templates.get(command_type).test(lines[i])) {
                    current_command_type = command_type;
                    break;
                }
            }
            if (current_command_type === null) {
                throw new ParseError(i);
            }
            current_command_reducer = Parser.reducers.get(current_command_type);
            current_command = current_command_reducer(current_command_type, lines[i]);
            command_list.set(i, current_command);
        }
        return [command_list, lines.length];
    }
    static extract_args(str) {
        let parts = str.match(Parser.arg_template);
        let args = [];
        if (parts !== null) {
            args = parts.map((v) => Number(v));
        }
        return args;
    }
    static standard_reducer(type, line) {
        return { type, args: Parser.extract_args(line), link: null };
    }
    static conditional_command_reducer(type, line) {
        let args = Parser.extract_args(line);
        return { type, args: [args[0], args[2]], link: null };
    }
    static function_command_reducer(type, line) {
        let parts = line.match(/([a-z]+[0-9]*)\(/i);
        let link = null;
        if (parts !== null && parts.length >= 2) {
            link = parts[1];
        }
        return { type, link, args: Parser.extract_args(line) };
    }
}
Parser.reducers = new Map([
    [Command_1.CommandType.Inc, Parser.standard_reducer],
    [Command_1.CommandType.Dec, Parser.standard_reducer],
    [Command_1.CommandType.RsR, Parser.standard_reducer],
    [Command_1.CommandType.RsV, Parser.standard_reducer],
    [Command_1.CommandType.Goto, Parser.standard_reducer],
    [Command_1.CommandType.If, Parser.conditional_command_reducer],
    [Command_1.CommandType.Fn, Parser.function_command_reducer]
]);
Parser.templates = new Map([
    [Command_1.CommandType.Inc, /^\s*inc\s*R(0|[1-9]([0-9]{0,10}))\s*$/i],
    [Command_1.CommandType.Dec, /^\s*dec\s*R(0|[1-9]([0-9]{0,10}))\s*$/i],
    [Command_1.CommandType.RsR, /^\s*R(0|[1-9]([0-9]{0,10}))\s*:=\s*R(0|[1-9]([0-9]{0,10}))\s*$/i],
    [Command_1.CommandType.RsV, /^\s*R(0|[1-9]([0-9]{0,10}))\s*:=\s*(0|[1-9]([0-9]{0,10}))\s*$/i],
    [Command_1.CommandType.Goto, /^\s*goto\s*(0|[1-9]([0-9]{0,10}))\s*$/i],
    [Command_1.CommandType.If, /^\s*if\s*R(0|[1-9]([0-9]{0,10}))\s*=\s*0\s*goto\s*(0|[1-9]([0-9]{0,10}))\s*$/i],
    [Command_1.CommandType.Fn, /^\s*R(0|[1-9]([0-9]{0,10}))\s*:=\s*([a-z]+)\s*\(\s*((R(0|[1-9]([0-9]{0,10}))\s*,\s*)*R(0|[1-9]([0-9]{0,10})))?\s*\)\s*$/i]
]);
Parser.arg_template = /0|[1-9]([0-9]{0,10})/g;
Parser.empty_string_template = /^\s*$/;
exports.default = Parser;
//# sourceMappingURL=Parser.js.map