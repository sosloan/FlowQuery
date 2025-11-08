import ASTNode from "../ast_node";
import Expression from "./expression";

/**
 * Represents a formatted string (f-string) in the AST.
 * 
 * F-strings allow embedding expressions within string literals.
 * Child nodes represent the parts of the f-string (literal strings and expressions).
 * 
 * @example
 * ```typescript
 * // For f"Hello {name}!"
 * const fstr = new FString();
 * fstr.addChild(new String("Hello "));
 * fstr.addChild(nameExpression);
 * fstr.addChild(new String("!"));
 * ```
 */
class FString extends ASTNode {
    public value(): string {
        const parts: Expression[] = this.getChildren() as Array<Expression>;
        return parts.map((part) => part.value()).join("");
    }
}

export default FString;