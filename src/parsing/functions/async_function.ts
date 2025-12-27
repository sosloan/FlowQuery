import ASTNode from "../ast_node";
import Function from "./function";

/**
 * Represents an async data provider function call for use in LOAD operations.
 * 
 * This class holds the function name and arguments, and provides async iteration
 * over the results from a registered async data provider.
 * 
 * @example
 * ```typescript
 * // Used in: LOAD JSON FROM myDataSource('arg1', 'arg2') AS data
 * const asyncFunc = new AsyncFunction("myDataSource");
 * asyncFunc.parameters = [arg1Node, arg2Node];
 * for await (const item of asyncFunc.execute()) {
 *     console.log(item);
 * }
 * ```
 */
class AsyncFunction extends Function {
    /**
     * Sets the function parameters.
     * 
     * @param nodes - Array of AST nodes representing the function arguments
     */
    public set parameters(nodes: ASTNode[]) {
        this.children = nodes;
    }

    /**
     * Evaluates all parameters and returns their values.
     * 
     * @returns Array of parameter values
     */
    private getArguments(): any[] {
        return this.children.map(child => child.value());
    }

    /**
     * Generates the async data provider function results.
     * 
     * @yields Data items from the async provider
     * @throws {Error} If the function is not registered as an async provider
     */
    public async *generate(): AsyncGenerator<any, void, unknown> {
        throw new Error("Not implemented: generate method must be overridden in subclasses.");
    }
}

export default AsyncFunction;
