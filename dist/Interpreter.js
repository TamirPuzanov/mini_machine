"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HaltError = exports.Interpreter = void 0;
const Command_1 = require("./Command");
const Tape_1 = require("./Tape");
class HaltError extends Error {
    constructor(limit) {
        super(`the program has performed more than ${limit} operations!`);
        this.name = "HaltError";
    }
}
exports.HaltError = HaltError;
class Interpreter {
    static run($package, $tape, program = "Main", save_states = false, operations_limit = 100000) {
        $tape = $tape.clone();
        let states = [];
        if (save_states) {
            states.push({
                tape: $tape.clone(),
                command: null
            });
        }
        if ($package.defined_commands.has(program)) {
            let $program = $package.defined_commands.get(program);
            states.push({
                tape: new Tape_1.Tape(new Map([[0, $program($tape)]])),
                command: null
            });
            return states;
        }
        let $program = $package.programs.get(program);
        let command_register = 0;
        let current_command;
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
            current_command = $program.command_list.get(command_register);
            if (current_command.type === Command_1.CommandType.Fn) {
                let input_tape = new Tape_1.Tape();
                for (let i = 1; i < current_command.args.length; i++) {
                    input_tape.set(i, $tape.get(current_command.args[i]));
                }
                let states = Interpreter.run($package, input_tape, current_command.link, false, operations_limit);
                $tape.set(current_command.args[0], states[0].tape.get(0));
                command_register += 1;
            }
            else {
                let current_reducer = Interpreter.reducers.get(current_command.type);
                command_register = current_reducer(command_register, $tape, current_command.args);
            }
            if (save_states) {
                states.push({
                    tape: $tape.clone(),
                    command: Object.assign({}, current_command)
                });
            }
        }
        states.push({
            tape: $tape.clone(),
            command: null
        });
        return states;
    }
    static inc_reducer(command_register, tape, args) {
        tape.sum(args[0], +1);
        return command_register + 1;
    }
    static dec_reducer(command_register, tape, args) {
        tape.sum(args[0], -1);
        return command_register + 1;
    }
    static rsr_reducer(command_register, tape, args) {
        tape.set(args[0], tape.get(args[1]));
        return command_register + 1;
    }
    static rsv_reducer(command_register, tape, args) {
        tape.set(args[0], args[1]);
        return command_register + 1;
    }
    static goto_reducer(command_register, tape, args) {
        return args[0];
    }
    static if_reducer(command_register, tape, args) {
        if (tape.get(args[0]) === 0)
            return args[1];
        return command_register + 1;
    }
}
exports.Interpreter = Interpreter;
Interpreter.reducers = new Map([
    [Command_1.CommandType.Inc, Interpreter.inc_reducer],
    [Command_1.CommandType.Dec, Interpreter.dec_reducer],
    [Command_1.CommandType.RsR, Interpreter.rsr_reducer],
    [Command_1.CommandType.RsV, Interpreter.rsv_reducer],
    [Command_1.CommandType.Goto, Interpreter.goto_reducer],
    [Command_1.CommandType.If, Interpreter.if_reducer]
]);
//# sourceMappingURL=Interpreter.js.map