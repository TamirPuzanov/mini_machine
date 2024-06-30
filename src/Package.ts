import type { DefinedCommands } from "./DefinedCommands";
import type { Program } from "./Program";


class ConnectednessError extends Error {
    constructor(stack: string[]) {
        super(stack.join(" -> "));
        this.name = "ConnectednessError";
    }
}

class InferiorityError extends Error {
    constructor(program_name: string) {
        super(program_name);
        this.name = "InferiorityError";
    }
}

class OverflowError extends Error {
    constructor(program_name: string) {
        super(program_name);
        this.name = "OverflowError";
    }
}


class Package {

    public programs: Map<string, Program>;

    public defined_commands: DefinedCommands;


    constructor(programs: Map<string, Program>, defined_commands?: DefinedCommands) {
        this.programs = programs;
        this.defined_commands = defined_commands ? defined_commands : new Map();

        this.check([], "Main");
    }

    private check(path: string[], program_name: string) {

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
            throw new InferiorityError(program_name)
        }

        let prog = this.programs.get(program_name) as Program;

        path = path.concat([program_name]);

        for (let link of prog.links.values()) {
            this.check(path, link);
        }
    }
}


export { Package };
export { ConnectednessError, InferiorityError, OverflowError };