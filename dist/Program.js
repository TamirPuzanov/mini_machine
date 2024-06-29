"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = void 0;
const Command_1 = require("./Command");
const Parser_1 = __importDefault(require("./Parser"));
class Program {
    constructor(program_text) {
        let [command_list, length] = Parser_1.default.parse(program_text);
        this.command_list = command_list;
        this.length = length;
        {
            let links = new Set();
            for (let current_command of command_list.values()) {
                if (current_command.type !== Command_1.CommandType.Fn) {
                    continue;
                }
                links.add(current_command.link);
            }
            this.links = links;
        }
    }
}
exports.Program = Program;
//# sourceMappingURL=Program.js.map