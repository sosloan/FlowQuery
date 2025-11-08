import ASTNode from "../ast_node";
import String from "../expressions/string";

/**
 * Represents a key-value pair in an associative array.
 * 
 * Used to build object literals in FlowQuery.
 * 
 * @example
 * ```typescript
 * const kvp = new KeyValuePair("name", new String("Alice"));
 * ```
 */
class KeyValuePair extends ASTNode {
    /**
     * Creates a new key-value pair.
     * 
     * @param key - The key string
     * @param value - The AST node representing the value
     */
    constructor(key: string, value: ASTNode) {
        super();
        this.addChild(new String(key));
        this.addChild(value);
    }
    public get key(): string {
        return this.children[0].value();
    }
    public get _value(): any {
        return this.children[1].value();
    }
    public toString(): string {
        return `KeyValuePair`;
    }
}

export default KeyValuePair;