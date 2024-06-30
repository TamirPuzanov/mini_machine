"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverflowError = exports.InferiorityError = exports.ConnectednessError = exports.Package = void 0;
class ConnectednessError extends Error {
    constructor(stack) {
        super(stack.join(" -> "));
        this.name = "ConnectednessError";
    }
}
exports.ConnectednessError = ConnectednessError;
class InferiorityError extends Error {
    constructor(program_name) {
        super(program_name);
        this.name = "InferiorityError";
    }
}
exports.InferiorityError = InferiorityError;
class OverflowError extends Error {
    constructor(program_name) {
        super(program_name);
        this.name = "OverflowError";
    }
}
exports.OverflowError = OverflowError;
class Package {
    constructor(programs, defined_commands) {
        this.programs = programs;
        this.defined_commands = defined_commands ? defined_commands : new Map();
        this.check([], "Main");
    }
    check(path, program_name) {
        if (this.defined_commands.has(program_name)) {
            if (this.programs.has(program_name)) {
                throw new OverflowError(program_name);
            }
            return;
        }
        if (path.includes(program_name)) {
            throw new ConnectednessError(path);
        }
        if (!this.programs.has(program_name)) {
            throw new InferiorityError(program_name);
        }
        let prog = this.programs.get(program_name);
        path = path.concat([program_name]);
        for (let link of prog.links.values()) {
            this.check(path, link);
        }
    }
}
exports.Package = Package;
//# sourceMappingURL=Package.js.map