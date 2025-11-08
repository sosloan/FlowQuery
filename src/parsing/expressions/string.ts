import ASTNode from "../ast_node";

/**
 * Represents a string literal in the AST.
 * 
 * @example
 * ```typescript
 * const str = new String("hello");
 * console.log(str.value()); // "hello"
 * ```
 */
class String extends ASTNode {
    protected _value: string;

    /**
     * Creates a new String node with the given value.
     * 
     * @param value - The string value
     */
    constructor(value: string) {
        super();
        this._value = value;
    }

    public value(): string {
        return this._value;
    }

    public toString(): string {
        return `String (${this._value})`;
    }
}

export default String;