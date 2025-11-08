import ASTNode from "../ast_node";

/**
 * Represents a numeric literal in the AST.
 * 
 * Parses string representations of numbers into integer or float values.
 * 
 * @example
 * ```typescript
 * const num = new Number("42");
 * console.log(num.value()); // 42
 * ```
 */
class Number extends ASTNode {
    private _value: number;

    /**
     * Creates a new Number node by parsing the string value.
     * 
     * @param value - The string representation of the number
     */
    constructor(value: string) {
        super();
        if(value.indexOf('.') !== -1) {
            this._value = parseFloat(value);
        } else {
            this._value = parseInt(value);
        }
    }

    public value(): number {
        return this._value;
    }

    protected toString(): string {
        return `${this.constructor.name} (${this._value})`;
    }
}

export default Number;