import { CommandType } from "../Command";
import { Value } from "../Value";
import { Tape } from "../Tape";
import { Model, Reducer } from "../Model";
declare class StandardValue extends Value {
    protected value: number;
    constructor(v?: number);
    get(): number;
    set(v: number): void;
    toString(): string;
    toNumber(): number;
    clone(): StandardValue;
}
declare class StandardTape extends Tape<StandardValue> {
    constructor(values?: Map<number, number>, registers?: Map<number, StandardValue>);
    get(register: number): StandardValue;
    set(register: number, value: StandardValue): void;
    assign(register: number, value: StandardValue): void;
    clone(): StandardTape;
}
declare class StandardModel extends Model<StandardValue, StandardTape> {
    protected static commands: Map<string, (tape: StandardTape) => StandardValue>;
    reducers: Map<CommandType, Reducer<StandardValue, StandardTape>>;
    defined_commands: Map<string, (tape: StandardTape) => StandardValue>;
    constructor(allow?: string[], allow_all?: boolean);
    use_command(name: string, tape: StandardTape): StandardTape;
    create_tape(registers?: Map<number, StandardValue>): StandardTape;
    static inc_reducer(cr: number, tape: StandardTape, args: number[]): number;
    static dec_reducer(cr: number, tape: StandardTape, args: number[]): number;
    static rsr_reducer(cr: number, tape: StandardTape, args: number[]): number;
    static rsv_reducer(cr: number, tape: StandardTape, args: number[]): number;
    static goto_reducer(cr: number, tape: StandardTape, args: number[]): number;
    static if_reducer(cr: number, tape: StandardTape, args: number[]): number;
}
export { StandardModel, StandardTape, StandardValue };
//# sourceMappingURL=StandardModel.d.ts.map