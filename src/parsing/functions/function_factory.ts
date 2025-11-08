import Sum from "./sum";
import Collect from "./collect";
import Avg from "./avg";
import Range from "./range";
import Rand from "./rand";
import Round from "./round";
import Split from "./split";
import Join from "./join";
import ToJson from "./to_json";
import Replace from "./replace";
import Stringify from "./stringify";
import Size from "./size";
import Function from "./function";

/**
 * Factory for creating function instances by name.
 * 
 * Maps function names (case-insensitive) to their corresponding implementation classes.
 * Supports built-in functions like sum, avg, collect, range, split, join, etc.
 * 
 * @example
 * ```typescript
 * const sumFunc = FunctionFactory.create("sum");
 * const avgFunc = FunctionFactory.create("AVG");
 * ```
 */
class FunctionFactory {
    /**
     * Creates a function instance by name.
     * 
     * @param name - The function name (case-insensitive)
     * @returns A Function instance of the appropriate type
     */
    public static create(name: string): Function {
        switch (name.toLowerCase()) {
            case "sum":
                return new Sum();
            case "collect":
                return new Collect();
            case "avg":
                return new Avg();
            case "range":
                return new Range();
            case "rand":
                return new Rand();
            case "round":
                return new Round();
            case "split":
                return new Split();
            case "join":
                return new Join();
            case "tojson":
                return new ToJson();
            case "replace":
                return new Replace();
            case "stringify":
                return new Stringify();
            case "size":
                return new Size();
            default:
                return new Function(name);
        }
    }
}

export default FunctionFactory;