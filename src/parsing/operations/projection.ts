import Expression from "../expressions/expression";
import Operation from "./operation";

class Projection extends Operation {
    constructor(expressions: Expression[]) {
        super();
        this.children = expressions;
    }
    protected *expressions(): Generator<[Expression, string]> {
        for (let i = 0; i < this.children.length; i++) {
            const expression: Expression = this.children[i] as Expression;
            const alias = expression.alias || `expr${i}`;
            yield [expression, alias];
        }
    }
}

export default Projection;
