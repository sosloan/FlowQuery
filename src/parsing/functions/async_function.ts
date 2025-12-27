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
     * Used by the framework to pass arguments to generate().
     * 
     * @returns Array of parameter values
     */
    public getArguments(): any[] {
        return this.children.map(child => child.value());
    }

    /**
     * Generates the async data provider function results.
     * 
     * Subclasses override this method with their own typed parameters.
     * The framework automatically evaluates the AST children and spreads
     * them as arguments when calling this method.
     * 
     * @param args - Arguments passed from the query (e.g., myFunc(arg1, arg2))
     * @yields Data items from the async provider
     * @throws {Error} If the function is not registered as an async provider
     * 
     * @example
     * ```typescript
     * // Subclass with typed parameters:
     * async *generate(count: number = 1, filter?: string): AsyncGenerator<any> {
     *     // Implementation
     * }
     * ```
     */
    public async *generate(...args: any[]): AsyncGenerator<any, void, unknown> {
        throw new Error("Not implemented: generate method must be overridden in subclasses.");
    }
}

export default AsyncFunction;
