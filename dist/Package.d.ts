import type { Program } from "./Program";
declare class ConnectednessError extends Error {
    constructor(stack: string[]);
}
declare class InferiorityError extends Error {
    constructor(program_name: string);
}
declare class OverflowError extends Error {
    constructor(program_name: string);
}
declare class Package {
    programs: Map<string, Program>;
    defined_commands: Set<string>;
    constructor(programs: Map<string, Program>, defined_commands?: Set<string>);
    private check;
}
export { Package };
export { ConnectednessError, InferiorityError, OverflowError };
//# sourceMappingURL=Package.d.ts.map