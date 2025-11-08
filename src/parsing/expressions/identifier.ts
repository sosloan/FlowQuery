import String from "./string";

/**
 * Represents an identifier in the AST.
 * 
 * Identifiers are used for variable names, property names, and similar constructs.
 * 
 * @example
 * ```typescript
 * const id = new Identifier("myVariable");
 * ```
 */
class Identifier extends String {
    public toString(): string {
        return `Identifier (${this._value})`;
    }
    public value(): any {
        return super.value();
    }
}

export default Identifier;