import ASTNode from "../ast_node";

/**
 * Base class for all functions in FlowQuery.
 * 
 * Functions can have parameters and may support the DISTINCT modifier.
 * Subclasses implement specific function logic.
 * 
 * @example
 * ```typescript
 * const func = FunctionFactory.create("sum");
 * func.parameters = [expression1, expression2];
 * ```
 */
class Function extends ASTNode {
    protected _name: string;
    protected _expectedParameterCount: number | null = null;
    protected _supports_distinct: boolean = false;

    /**
     * Creates a new Function with the given name.
     * 
     * @param name - The function name
     */
    constructor(name: string) {
        super();
        this._name = name;
    }

    /**
     * Sets the function parameters.
     * 
     * @param nodes - Array of AST nodes representing the function arguments
     * @throws {Error} If the number of parameters doesn't match expected count
     */
    public set parameters(nodes: ASTNode[]) {
        if (this._expectedParameterCount !== null && this._expectedParameterCount !== nodes.length) {
            throw new Error(`Function ${this._name} expected ${this._expectedParameterCount} parameters, but got ${nodes.length}`);
        }
        this.children = nodes;
    }

    public get name(): string {
        return this._name;
    }

    public toString(): string {
        return `Function (${this._name})`;
    }

    public set distinct(distinct: boolean) {
        if (this._supports_distinct) {
            this._supports_distinct = distinct;
        } else {
            throw new Error(`Function ${this._name} does not support distinct`);
        }
    }
}

export default Function;