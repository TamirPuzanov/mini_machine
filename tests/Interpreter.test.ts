import { Interpreter, State, HaltError } from "../src/Interpreter";
import { StandardModel, StandardTape, StandardValue } from "../src/models/StandardModel";

import { Program } from "../src/Program";
import { Package } from "../src/Package";


const program_sum = `R0 := R1 \n if R2 = 0 goto 5 \n inc R0
                 dec R2 \n goto 1 \n R1 := 0
`;

test("(Interpreter) checking the interpretation of simple programs", () => {

    let $model = new StandardModel();

    let main_program = new Program(program_sum);

    let $package = new Package(
        new Map([ ["Main", main_program] ]), 
        $model.command_names()
    );

    let $tape: StandardTape;
    let states: State<StandardValue, StandardTape>[];


    for (let i = 0; i < 50; i++) {
        for (let j = 0; j < 50; j++) {

            $tape = new StandardTape(new Map([ [1, i], [2, j] ]));
            states = Interpreter.run($model, $package, $tape);

            expect(states[0].tape.get(0).toNumber()).toEqual(i + j);
            expect(states[0].tape.get(1).toNumber()).toEqual(0);
            expect(states[0].tape.get(2).toNumber()).toEqual(0);
        }
    }
});