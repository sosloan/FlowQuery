import ASTNode from "../ast_node";
import KeyValuePair from "./key_value_pair";

/**
 * Represents an associative array (object/dictionary) in the AST.
 * 
 * Associative arrays map string keys to values, similar to JSON objects.
 * 
 * @example
 * ```typescript
 * // For { name: "Alice", age: 30 }
 * const obj = new AssociativeArray();
 * obj.addKeyValue(new KeyValuePair("name", nameExpr));
 * obj.addKeyValue(new KeyValuePair("age", ageExpr));
 * ```
 */
class AssociativeArray extends ASTNode {
    /**
     * Adds a key-value pair to the associative array.
     * 
     * @param keyValuePair - The key-value pair to add
     */
    public addKeyValue(keyValuePair: KeyValuePair): void {
        this.addChild(keyValuePair);
    }

    public toString(): string {
        return 'AssociativeArray';
    }
    private *_value(): Iterable<Record<PropertyKey, any>> {
        for(const child of this.children) {
            const key_value = child as KeyValuePair;
            yield {
                [key_value.key]: key_value._value
            };
        }
    }
    public value(): Record<string, any> {
        return Object.assign({}, ...this._value());
    }
}

export default AssociativeArray;