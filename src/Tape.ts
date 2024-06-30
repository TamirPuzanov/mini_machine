class Tape {

    protected registers: Map<number, number>;

    constructor(registers?: Map<number, number>) {
        this.registers = registers ? registers : new Map();

        for (let value of this.registers.values()) {
            if (!isFinite(value) || isNaN(value)) {
                throw new RangeError("the value argument must be defined and finite!");
            }
        }
    }

    public get(register: number): number {
        let value = this.registers.get(register);
        return value !== undefined && value > 0 ? value : 0;
    }

    public set(register: number, value: number) : void {
        if (!isFinite(value) || isNaN(value)) {
            throw new RangeError("the value argument must be defined and finite!");
        }
        this.registers.set(register, value > 0 ? value : 0);
    }

    public sum(register: number, value: number) : void {
        this.set(register, this.get(register) + value);
    }
}


export { Tape };