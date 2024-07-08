abstract class Value {

    abstract toString() : string;
    abstract toNumber() : number;

    abstract clone() : Value;
}


export { Value };