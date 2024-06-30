import { HaltError, Interpreter, State } from "../src/Interpreter";
import { Tape } from "../src/Tape";

import { Program } from "../src/Program";
import { Package } from "../src/Package";

import { CommandType } from "../src/Command";


const program_sum = `R0 := R1 \n if R2 = 0 goto 5 \n inc R0
                 dec R2 \n goto 1 \n R1 := 0
`;

test("(Interpreter) checking the interpretation of simple programs", () => {

    let main_program = new Program(program_sum);

    let $package = new Package(new Map([ ["Main", main_program] ]));

    let $tape: Tape;
    let states: State[];

    for (let i = 0; i < 50; i++) {
        for (let j = 0; j < 50; j++) {

            $tape = new Tape(new Map([ [1, i], [2, j] ]));
            states = Interpreter.run($package, $tape);

            expect(states[0].tape.get(0)).toEqual(i + j);
            expect(states[0].tape.get(1)).toEqual(0);
            expect(states[0].tape.get(2)).toEqual(0);
        }
    }
});


test("(Interpreter) checking the processing of uncountable programs", () => {

    let main_program = new Program("goto 0");

    let $package = new Package(new Map([ ["Main", main_program] ]));

    let $tape = new Tape();
    
    expect(() => Interpreter.run($package, $tape)).toThrow(HaltError);
});


test("(Interpreter) checking the interpretation of additional commands defined by the environment", () => {

    let main_program = new Program("R0 := Sum(R1, R2, R3)");
    let defined_commands = new Map([ ["Sum", (tape: Tape) => tape.get(1) + tape.get(2) + tape.get(3)] ])

    let $package = new Package(new Map([ ["Main", main_program] ]), defined_commands);

    let $tape = new Tape(new Map([ [1, 3], [2, 4], [3, 5] ]));

    let states = Interpreter.run($package, $tape);

    expect(states[0].tape.get(0)).toEqual(12);
});


test("(Interpreter) checking the interpretation of certain programmatically additional commands", () => {

    let main_program = new Program("R0 := Sum(R1, R2)");
    let sum_program = new Program(program_sum);

    let $package = new Package(new Map([ ["Main", main_program], ["Sum", sum_program] ]));

    let $tape = new Tape(new Map([ [1, 3], [2, 4], [3, 5] ]));

    let states = Interpreter.run($package, $tape);

    expect(states[0].tape.get(0)).toEqual(7);
    expect(states[0].tape.get(1)).toEqual(3);
    expect(states[0].tape.get(2)).toEqual(4);
    expect(states[0].tape.get(3)).toEqual(5);
});


test("(Interpreter) checking for saving states", () => {

    let main_program = new Program("inc R0 \n dec R0 \n incR0");

    let $package = new Package(new Map([ ["Main", main_program] ]));

    let $tape = new Tape();

    let states = Interpreter.run($package, $tape, "Main", true);

    expect(states.length).toEqual(5);
    expect(states[0].tape.values).toEqual($tape.values);
    expect(states[1].tape.values).toEqual(new Map([ [0, 1] ]));
    expect(states[2].tape.values).toEqual(new Map([ [0, 0] ]));
    expect(states[3].tape.values).toEqual(new Map([ [0, 1] ]));
    expect(states[4].tape.values).toEqual(new Map([ [0, 1] ]));
    
    expect(states[1].command?.type).toEqual(CommandType.Inc);
    expect(states[2].command?.type).toEqual(CommandType.Dec);
    expect(states[3].command?.type).toEqual(CommandType.Inc)
});