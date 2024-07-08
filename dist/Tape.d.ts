import { Value } from "./Value";
declare abstract class Tape<V extends Value> {
    protected registers: Map<number, V>;
    constructor(registers?: Map<number, V>);
    abstract get(register: number): V;
    abstract set(register: number, value: V): void;
    abstract assign(register: number, value: V): void;
    abstract clone(): Tape<V>;
}
export { Tape };
//# sourceMappingURL=Tape.d.ts.map