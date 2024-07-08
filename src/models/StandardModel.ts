import { CommandType } from "../Command";

import { Value } from "../Value";
import { Tape } from "../Tape";

import { Model, Reducer } from "../Model";


class StandardValue extends Value {

    protected value: number;

    constructor(v: number = 0) {
        super();

        this.value = !isNaN(v) && isFinite(v) && v > 0 ? Math.ceil(v) : 0;
    }

    public get(): number {
        return this.value;
    }

    public set(v: number) {
        this.value = !isNaN(v) && isFinite(v) && v > 0 ? Math.ceil(v) : 0;
    }

    public toString(): string {
        return String(this.value);
    }

    public toNumber(): number {
        return this.value;
    }

    public clone() : StandardValue {
        return new StandardValue(this.value);
    }
}


class StandardTape extends Tape<StandardValue> {

    constructor(values?: Map<number, number>, registers?: Map<number, StandardValue>) {

        if (registers) {
            super(registers);
            return;
        }

        if (!values) {
            super();
            return;
        }

        registers = new Map();

        for (let key of values.keys()) {
            registers.set(key, new StandardValue(values.get(key)));
        }

        super(registers);
    }

    public get(register: number): StandardValue {

        let register_value = this.registers.get(register);

        if (register_value) {
            return register_value;
        }

        register_value = new StandardValue(0);

        this.set(register, register_value);

        return register_value;
    }

    public set(register: number, value: StandardValue): void {
        this.registers.set(register, value);
    }

    public assign(register: number, value: StandardValue): void {
        
        let register_value = this.get(register);

        register_value.set(value.get());
    }

    public clone(): StandardTape {

        let registers = new Map<number, number>();

        for (let key of this.registers.keys()) {
            registers.set(key, this.get(key).get());
        }

        return new StandardTape(registers);
    }
}


class StandardModel extends Model<StandardValue, StandardTape> {

    protected static commands: Map<string, (tape: StandardTape) => StandardValue> = new Map([

    ]);

    public reducers: Map<CommandType, Reducer<StandardValue, StandardTape>> = new Map([
        [CommandType.Inc , StandardModel.inc_reducer],
        [CommandType.Dec,  StandardModel.dec_reducer],
        [CommandType.RsR , StandardModel.rsr_reducer],
        [CommandType.RsV,  StandardModel.rsv_reducer],
        [CommandType.Goto, StandardModel.goto_reducer],
        [CommandType.If,   StandardModel.if_reducer]
    ]);

    public defined_commands: Map<string, (tape: StandardTape) => StandardValue> = new Map();


    constructor(allow: string[] = [], allow_all: boolean = true) {
        super();

        if (allow_all) {
            this.defined_commands = new Map(StandardModel.commands);
            return;
        }

        for (let command_name of allow) {
            if (StandardModel.commands.has(command_name)) {
                throw new Error("command '" + command_name + "' not found!")
            }

            this.defined_commands.set(command_name, StandardModel.commands.get(command_name)!);
        }
    }

    public use_command(name: string, tape: StandardTape): StandardTape {

        if (!this.defined_commands.has(name)) {
            throw new Error("command '" + name + "' not found!");
        }
        
        let output_tape = new StandardTape();

        output_tape.assign(0, this.defined_commands.get(name)!(tape));

        return output_tape;
    }

    public create_tape(registers?: Map<number, StandardValue>): StandardTape {
        return new StandardTape(undefined, registers);
    }
    
    static inc_reducer(cr: number, tape: StandardTape, args: number[]) : number {
        let register = tape.get(args[0]);
        register.set(register.get() + 1);
        return cr + 1;
    }

    static dec_reducer(cr: number, tape: StandardTape, args: number[]) : number {
        let register = tape.get(args[0]);
        register.set(register.get() - 1);
        return cr + 1;
    }

    static rsr_reducer(cr: number, tape: StandardTape, args: number[]) : number {
        tape.get(args[0]).set(tape.get(args[1]).get());
        return cr + 1;
    }

    static rsv_reducer(cr: number, tape: StandardTape, args: number[]) : number {
        tape.get(args[0]).set(args[1]);
        return cr + 1;
    }

    static goto_reducer(cr: number, tape: StandardTape, args: number[]) : number {
        return args[0];
    }

    static if_reducer(cr: number, tape: StandardTape, args: number[]) : number {
        if (tape.get(args[0]).get() === 0) return args[1];
        return cr + 1;
    }
}


export { StandardModel, StandardTape, StandardValue };