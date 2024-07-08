"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HaltError = exports.Interpreter = void 0;
const Command_1 = require("./Command");
class HaltError extends Error {
    constructor(limit) {
        super(`the program has performed more than ${limit} operations!`);
        this.name = "HaltError";
    }
}
exports.HaltError = HaltError;
class Interpreter {
    // protected static reducers: Map<CommandType, Reducer> = 
    static run($model, $package, $tape, program = "Main", save_states = false, operations_limit = 100000) {
        $tape = $tape.clone();
        let states = [];
        if (save_states) {
            states.push({
                tape: $tape.clone(),
                command: null
            });
        }
        if ($model.defined_commands.has(program)) {
            states.push({
                tape: $model.use_command(program, $tape),
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
                let input_tape = $model.create_tape();
                for (let i = 1; i < current_command.args.length; i++) {
                    input_tape.set(i, $tape.get(current_command.args[i]));
                }
                let states = Interpreter.run($model, $package, input_tape, current_command.link, false, operations_limit - operation_count);
                $tape.set(current_command.args[0], states[0].tape.get(0));
                command_register += 1;
            }
            else {
                let current_reducer = $model.reducers.get(current_command.type);
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
}
exports.Interpreter = Interpreter;
//# sourceMappingURL=Interpreter.js.map