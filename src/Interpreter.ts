import { Command, CommandType } from "./Command";
import type { defined_command_fn } from "./DefinedCommands";

import type { Package } from "./Package";
import type { Program } from "./Program";

import { Tape } from "./Tape";


class HaltError extends Error {
    constructor(limit: number | string) {
        super(`the program has performed more than ${limit} operations!`);
        this.name = "HaltError";
    }
}


interface State {
    tape: Tape,
    command: Command | null
}

type Reducer = (command_register: number, tape: Tape, args: number[]) => number;


class Interpreter {

    protected static reducers: Map<CommandType, Reducer> = new Map([
        [CommandType.Inc , Interpreter.inc_reducer],
        [CommandType.Dec,  Interpreter.dec_reducer],
        [CommandType.RsR , Interpreter.rsr_reducer],
        [CommandType.RsV,  Interpreter.rsv_reducer],
        [CommandType.Goto, Interpreter.goto_reducer],
        [CommandType.If,   Interpreter.if_reducer]
    ]);

    public static run(
        $package: Package, $tape: Tape, program: string = "Main", 
        save_states: boolean = false, operations_limit: number = 100_000
    ): State[] {

        $tape = $tape.clone();

        let states: State[] = [];

        if (save_states) {
            states.push({
                tape: $tape.clone(),
                command: null
            })
        }

        if ($package.defined_commands.has(program)) {

            let $program = $package.defined_commands.get(program) as defined_command_fn;

            states.push({
                tape: new Tape(new Map([ [ 0, $program($tape) ] ])),
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
                
                let input_tape = new Tape();

                for (let i = 1; i < current_command.args.length; i++) {
                    input_tape.set(i, $tape.get(current_command.args[i]));
                }

                let states = Interpreter.run($package, input_tape, current_command.link as string, false, operations_limit);

                $tape.set(current_command.args[0], states[0].tape.get(0));

                command_register += 1;

            } else {

                let current_reducer = Interpreter.reducers.get(current_command.type) as Reducer;

                command_register = current_reducer(command_register, $tape, current_command.args);
            }

            if (save_states) {
                states.push({
                    tape: $tape.clone(),
                    command: Object.assign({}, current_command)
                })
            }
        }

        states.push({
            tape: $tape.clone(),
            command: null
        })

        return states;
    }

    protected static inc_reducer(command_register: number, tape: Tape, args: number[]) : number {
        tape.sum(args[0], +1);
        return command_register + 1;
    }

    protected static dec_reducer(command_register: number, tape: Tape, args: number[]) : number {
        tape.sum(args[0], -1);
        return command_register + 1;
    }

    protected static rsr_reducer(command_register: number, tape: Tape, args: number[]) : number {
        tape.set(args[0], tape.get(args[1]));
        return command_register + 1;
    }

    protected static rsv_reducer(command_register: number, tape: Tape, args: number[]) : number {
        tape.set(args[0], args[1]);
        return command_register + 1;
    }

    protected static goto_reducer(command_register: number, tape: Tape, args: number[]) : number {
        return args[0];
    }

    protected static if_reducer(command_register: number, tape: Tape, args: number[]) : number {
        if (tape.get(args[0]) === 0) return args[1];
        return command_register + 1;
    }
}


export { Interpreter, State };
export { HaltError };