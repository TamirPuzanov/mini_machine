import { Program } from "../src/Program";


test("(Program) checking the definition of links", () => {

    let prog = new Program("inc R1 \n R1 := A(R0) \n R2 := B(R1, R2, R3) \n R3 := C()");

    expect(prog.links).toEqual(new Set([ "A", "B", "C" ]));
    expect(prog.length).toEqual(4);
})