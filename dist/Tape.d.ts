declare class Tape {
    protected registers: Map<number, number>;
    constructor(registers?: Map<number, number>);
    get(register: number): number;
    set(register: number, value: number): void;
    sum(register: number, value: number): void;
}
export { Tape };
//# sourceMappingURL=Tape.d.ts.map