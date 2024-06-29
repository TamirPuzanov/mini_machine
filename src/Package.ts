import { CommandType, Command, CommandList } from "./Command";
import type { Program } from "./Program";


class ConnectednessError extends Error {
    constructor(stack: string[]) {
        super(stack.join(" -> "));
        this.name = "ConnectednessError";
    }
}


class CompletenessError extends Error {
    constructor(program_name: string) {
        super(program_name);
        this.name = "CompletenessError";
    }
}


class Package {

    public programs: Map<string, Program>;

    constructor(programs: Map<string, Program>) {
        this.programs = programs;
        this.check([], "Main");
    }

    private check(path: string[], program_name: string) {

        if (path.includes(program_name)) {
            throw new ConnectednessError(path);
        }

        if (!this.programs.has(program_name)) {
            throw new CompletenessError(program_name)
        }

        let prog = this.programs.get(program_name) as Program;

        path = path.concat([program_name]);

        for (let link of prog.links.values()) {
            this.check(path, link);
        }
    }
}


export { Package };
export { ConnectednessError, CompletenessError };