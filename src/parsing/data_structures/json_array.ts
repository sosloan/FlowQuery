import ASTNode from "../ast_node";

/**
 * Represents a JSON array in the AST.
 * 
 * JSON arrays are ordered collections of values.
 * 
 * @example
 * ```typescript
 * // For [1, 2, 3]
 * const arr = new JSONArray();
 * arr.addValue(new Number("1"));
 * arr.addValue(new Number("2"));
 * arr.addValue(new Number("3"));
 * ```
 */
class JSONArray extends ASTNode {
    /**
     * Adds a value to the array.
     * 
     * @param value - The AST node representing the value to add
     */
    public addValue(value: ASTNode): void {
        this.addChild(value);
    }
    public value(): any[] {
        return this.children.map(child => child.value());
    }
}

export default JSONArray;