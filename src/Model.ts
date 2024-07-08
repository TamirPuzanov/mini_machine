import { CommandType } from "./Command";

import { Value } from "./Value";
import { Tape } from "./Tape";


type Reducer<V extends Value, T extends Tape<V>> = (cr: number, tape: T, args: number[]) => number;


abstract class Model <V extends Value, T extends Tape<V>> {
    
    abstract defined_commands: Map<string, (tape: T) => V>;
    abstract reducers: Map<CommandType, Reducer<V, T>>;

    abstract use_command(name: string, tape: T) : T;

    abstract create_tape(registers?: Map<number, V>) : T;

    command_names() : Set<string> {
        return new Set(this.defined_commands.keys());
    }
}


export { Model, Reducer };