import { Command, CommandType } from "./Command";
import type { Package } from "./Package";
import { Tape } from "./Tape";
declare class HaltError extends Error {
    constructor(limit: number | string);
}
interface State {
    tape: Tape;
    command: Command | null;
}
type Reducer = (command_register: number, tape: Tape, args: number[]) => number;
declare class Interpreter {
    protected static reducers: Map<CommandType, Reducer>;
    static run($package: Package, $tape: Tape, program?: string, save_states?: boolean, operations_limit?: number): State[];
    protected static inc_reducer(command_register: number, tape: Tape, args: number[]): number;
    protected static dec_reducer(command_register: number, tape: Tape, args: number[]): number;
    protected static rsr_reducer(command_register: number, tape: Tape, args: number[]): number;
    protected static rsv_reducer(command_register: number, tape: Tape, args: number[]): number;
    protected static goto_reducer(command_register: number, tape: Tape, args: number[]): number;
    protected static if_reducer(command_register: number, tape: Tape, args: number[]): number;
}
export { Interpreter, State };
export { HaltError };
//# sourceMappingURL=Interpreter.d.ts.map