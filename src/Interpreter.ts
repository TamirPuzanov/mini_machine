import { Command, CommandType } from "./Command";

import type { Package } from "./Package";
import type { Program } from "./Program";

import { Value } from "./Value";
import { Tape } from "./Tape";

import { Model, Reducer } from "./Model";


class HaltError extends Error {
    constructor(limit: number | string) {
        super(`the program has performed more than ${limit} operations!`);
        this.name = "HaltError";
    }
}


interface State <V extends Value, T extends Tape<V>> {
    tape: T,
    command: Command | null
}


class Interpreter {

    // protected static reducers: Map<CommandType, Reducer> = 

    public static run <V extends Value, T extends Tape<V>, M extends Model<V, T>> (
        $model: M, $package: Package, $tape: T, program: string = "Main", 
        save_states: boolean = false, operations_limit: number = 100_000
    ): State<V, T>[] {

        $tape = $tape.clone() as T;

        let states: State<V, T>[] = [];

        if (save_states) {
            states.push({
                tape: $tape.clone() as T,
                command: null
            })
        }

        if ($model.defined_commands.has(program)) {

            states.push({
                tape: $model.use_command(program, $tape),
                command: null
            });

            return states;
        }


        let $program = $package.programs.get(program) as Program;
        let command_register = 0;

        let current_command: Command;
        let operation_count = 0;


        while (command_register < $program.length) {

            operation_count += 1;

            if (operation_count > operations_limit) {
                throw new HaltError(operations_limit);
            }

            if (!$program.command_list.has(command_register)) {
                command_register += 1;
                continue;
            }

            current_command = $program.command_list.get(command_register) as Command;

            if (current_command.type === CommandType.Fn) {
                
                let input_tape = $model.create_tape();

                for (let i = 1; i < current_command.args.length; i++) {
                    input_tape.set(i, $tape.get(current_command.args[i]));
                }

                let states = Interpreter.run($model, $package, input_tape, current_command.link as string, false, operations_limit - operation_count);

                $tape.set(current_command.args[0], states[0].tape.get(0));

                command_register += 1;

            } else {

                let current_reducer = $model.reducers.get(current_command.type) as Reducer<V, T>;

                command_register = current_reducer(command_register, $tape, current_command.args);
            }

            if (save_states) {
                states.push({
                    tape: $tape.clone() as T,
                    command: Object.assign({}, current_command)
                })
            }
        }

        states.push({
            tape: $tape.clone() as T,
            command: null
        })

        return states;
    }

    // protected static inc_reducer(command_register: number, tape: Tape, args: number[]) : number {
    //     tape.sum(args[0], +1);
    //     return command_register + 1;
    // }

    // protected static dec_reducer(command_register: number, tape: Tape, args: number[]) : number {
    //     tape.sum(args[0], -1);
    //     return command_register + 1;
    // }

    // protected static rsr_reducer(command_register: number, tape: Tape, args: number[]) : number {
    //     tape.set(args[0], tape.get(args[1]));
    //     return command_register + 1;
    // }

    // protected static rsv_reducer(command_register: number, tape: Tape, args: number[]) : number {
    //     tape.set(args[0], args[1]);
    //     return command_register + 1;
    // }

    // protected static goto_reducer(command_register: number, tape: Tape, args: number[]) : number {
    //     return args[0];
    // }

    // protected static if_reducer(command_register: number, tape: Tape, args: number[]) : number {
    //     if (tape.get(args[0]) === 0) return args[1];
    //     return command_register + 1;
    // }
}


export { Interpreter, State };
export { HaltError };