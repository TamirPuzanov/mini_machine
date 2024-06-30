import { Tape } from "../src/Tape";


test("(Tape) checking the correctness of the processing of register values", () => {

    let tapeA = new Tape(new Map([[1, 1]]));

    tapeA.set(0, -10);
    tapeA.sum(0, 100);

    expect(tapeA.get(0)).toEqual(100);

    expect(() => {
        let tapeB = new Tape();
        tapeB.set(0, NaN);
    }).toThrow(RangeError);

    expect(() => {
        let tapeB = new Tape();
        tapeB.set(0, Infinity);
    }).toThrow(RangeError);

    expect(() => {
        new Tape(new Map([
            [0, 0], [0, NaN]
        ]));
    }).toThrow(RangeError);

    expect(() => {
        new Tape(new Map([
            [0, 0], [0, Infinity]
        ]));
    }).toThrow(RangeError);

    
    let tapeB = tapeA.clone();

    tapeB.set(0, 0);

    expect([tapeA.get(0), tapeB.get(0)]).toEqual([100, 0]);
})