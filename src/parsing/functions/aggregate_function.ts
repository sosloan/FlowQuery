import Function from "./function";
import ReducerElement from "./reducer_element";

/**
 * Base class for aggregate functions that reduce multiple values to a single value.
 * 
 * Aggregate functions like SUM, AVG, and COLLECT process multiple input values
 * and produce a single output. They cannot be nested within other aggregate functions.
 * 
 * @example
 * ```typescript
 * const sumFunc = new Sum();
 * // Used in: RETURN SUM(values)
 * ```
 */
class AggregateFunction extends Function {
    private _overridden: any | null = null;
    
    /**
     * Creates a new AggregateFunction with the given name.
     * 
     * @param name - The function name
     */
    constructor(name: string) {
        super(name);
    }
    
    /**
     * Processes a value during the aggregation phase.
     * 
     * @param value - The element to aggregate
     * @throws {Error} If not implemented by subclass
     */
    public reduce(value: ReducerElement): void {
        throw new Error("Method not implemented.");
    }
    
    /**
     * Creates a reducer element for this aggregate function.
     * 
     * @returns A ReducerElement instance
     * @throws {Error} If not implemented by subclass
     */
    public element(): ReducerElement {
        throw new Error("Method not implemented.");
    }
    public get overridden(): any | null {
        return this._overridden;
    }
    public set overridden(value: any | null) {
        this._overridden = value;
    }
    public value(): any {
        return this._overridden;
    }
}

export default AggregateFunction;