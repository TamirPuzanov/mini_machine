import { Command } from "./Command";
import type { Package } from "./Package";
import { Value } from "./Value";
import { Tape } from "./Tape";
import { Model } from "./Model";
declare class HaltError extends Error {
    constructor(limit: number | string);
}
interface State<V extends Value, T extends Tape<V>> {
    tape: T;
    command: Command | null;
}
declare class Interpreter {
    static run<V extends Value, T extends Tape<V>, M extends Model<V, T>>($model: M, $package: Package, $tape: T, program?: string, save_states?: boolean, operations_limit?: number): State<V, T>[];
}
export { Interpreter, State };
export { HaltError };
//# sourceMappingURL=Interpreter.d.ts.map