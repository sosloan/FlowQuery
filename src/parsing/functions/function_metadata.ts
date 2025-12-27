/**
 * Category types for functions.
 * Core categories: scalar, aggregate, predicate, async
 * Additional categories for organization: string, math, data, etc.
 */
export type FunctionCategory = "scalar" | "aggregate" | "predicate" | "async" | string;

/**
 * Schema definition for function arguments and outputs.
 * Compatible with JSON Schema for LLM consumption.
 */
export interface ParameterSchema {
    /** The parameter name */
    name: string;
    /** Description of the parameter */
    description: string;
    /** JSON Schema type: string, number, boolean, object, array, null */
    type: "string" | "number" | "boolean" | "object" | "array" | "null" | string;
    /** Whether the parameter is required (default: true) */
    required?: boolean;
    /** Default value if not provided */
    default?: any;
    /** For arrays, the schema of items */
    items?: Omit<ParameterSchema, 'name' | 'required' | 'default'>;
    /** For objects, the properties schema */
    properties?: Record<string, Omit<ParameterSchema, 'name' | 'required'>>;
    /** Enum of allowed values */
    enum?: any[];
    /** Example value */
    example?: any;
}

/**
 * Schema definition for function output.
 */
export interface OutputSchema {
    /** Description of the output */
    description: string;
    /** JSON Schema type */
    type: "string" | "number" | "boolean" | "object" | "array" | "null" | string;
    /** For arrays, the schema of items */
    items?: Omit<OutputSchema, 'description'>;
    /** For objects, the properties schema */
    properties?: Record<string, Omit<ParameterSchema, 'name' | 'required'>>;
    /** Example output value */
    example?: any;
}

/**
 * Metadata for a registered function, designed for LLM consumption.
 */
export interface FunctionMetadata {
    /** The function name */
    name: string;
    /** Human-readable description of what the function does */
    description: string;
    /** Category that determines function type and behavior */
    category: FunctionCategory;
    /** Array of parameter schemas */
    parameters: ParameterSchema[];
    /** Output schema */
    output: OutputSchema;
    /** Example usage in FlowQuery syntax */
    examples?: string[];
    /** Additional notes or caveats */
    notes?: string;
}

/**
 * Type for async data provider functions used in LOAD operations.
 */
export type AsyncDataProvider = (...args: any[]) => AsyncGenerator<any, void, unknown> | Promise<any>;

/**
 * Centralized registry for function metadata, factories, and async providers.
 * Encapsulates all registration logic for the @FunctionDef decorator.
 */
class FunctionRegistry {
    private static metadata: Map<string, FunctionMetadata> = new Map<string, FunctionMetadata>();
    private static factories: Map<string, () => any> = new Map<string, () => any>();

    /** Registers a regular function class. */
    static register<T extends new (...args: any[]) => any>(constructor: T, options: FunctionDefOptions): void {
        const instance: any = new constructor();
        const displayName: string = (instance.name?.toLowerCase() || constructor.name.toLowerCase());
        const registryKey: string = options.category ? `${displayName}:${options.category}` : displayName;

        this.metadata.set(registryKey, { name: displayName, ...options });
        
        if (options.category !== 'predicate') {
            this.factories.set(displayName, () => new constructor());
        }
        this.factories.set(registryKey, () => new constructor());
    }

    static getAllMetadata(): FunctionMetadata[] {
        return Array.from(this.metadata.values());
    }

    static getMetadata(name: string, category?: string): FunctionMetadata | undefined {
        const lowerName: string = name.toLowerCase();
        if (category) return this.metadata.get(`${lowerName}:${category}`);
        for (const meta of this.metadata.values()) {
            if (meta.name.toLowerCase() === lowerName) return meta;
        }
        return undefined;
    }

    static getFactory(name: string, category?: string): (() => any) | undefined {
        const lowerName: string = name.toLowerCase();
        if (category) return this.factories.get(`${lowerName}:${category}`);
        return this.factories.get(lowerName);
    }
}

/**
 * Decorator options - metadata without the name (derived from class).
 */
export type FunctionDefOptions = Omit<FunctionMetadata, 'name'>;

/**
 * Class decorator that registers function metadata.
 * The function name is derived from the class's constructor call to super() for regular functions,
 * or from the class name for async providers.
 * 
 * For async providers (category: "async"), the class must have a `generate` method that returns
 * an AsyncGenerator. This allows the function to be used as a data source in LOAD operations.
 * 
 * @param options - Function metadata (excluding name)
 * @returns Class decorator
 * 
 * @example
 * ```typescript
 * // Scalar function example
 * @FunctionDef({
 *   description: "Adds two numbers",
 *   category: "scalar",
 *   parameters: [
 *     { name: "a", description: "First number", type: "number" },
 *     { name: "b", description: "Second number", type: "number" }
 *   ],
 *   output: { description: "Sum of a and b", type: "number" },
 *   examples: ["ADD(2, 3) // returns 5"]
 * })
 * class AddFunction extends Function {
 *   constructor() {
 *     super("add");
 *   }
 *   public execute(a: number, b: number): number {
 *    return a + b;
 *  }
 * }
 * // Aggregate function example
 * @FunctionDef({
 *   description: "Calculates the average of a list of numbers",
 *  category: "aggregate",
 *  parameters: [
 *    { name: "values", description: "Array of numbers", type: "array", items: { type: "number" } }
 *  ],
 *  output: { description: "Average value", type: "number" },
 *  examples: ["AVERAGE([1, 2, 3, 4, 5]) // returns 3"]
 * })
 * class AverageFunction extends AggregateFunction {
 *   constructor() {
 *    super("average");
 *  }
 *  public execute(values: number[]): number {
 *   const sum = values.reduce((acc, val) => acc + val, 0);
 *   return sum / values.length;
 * }
 * }
 * // Async data provider example
 * @FunctionDef({
 *  description: "Fetches data from an external API",
 * category: "async",
 * parameters: [
 *   { name: "endpoint", description: "API endpoint URL", type: "string" }
 * ],
 * output: { description: "Data object", type: "object" },
 * examples: ["MyAsyncDataProvider('https://api.example.com/data')"]
 * })
 * class MyAsyncDataProvider extends AsyncFunction {
 *   public async *generate(endpoint: string): AsyncGenerator<any> {
 *    const response = await fetch(endpoint);
 *   const data = await response.json();
 *   for (const item of data) {
 *    yield item;
 *  }
 * }
 */
export function FunctionDef(options: FunctionDefOptions) {
    return function <T extends new (...args: any[]) => any>(constructor: T): T {
        FunctionRegistry.register(constructor, options);
        return constructor;
    };
}

/**
 * Gets all registered function metadata from decorators.
 */
export function getRegisteredFunctionMetadata(): FunctionMetadata[] {
    return FunctionRegistry.getAllMetadata();
}

/**
 * Gets a registered function factory by name.
 */
export function getRegisteredFunctionFactory(name: string, category?: string): (() => any) | undefined {
    return FunctionRegistry.getFactory(name, category);
}

/**
 * Gets metadata for a specific function by name.
 */
export function getFunctionMetadata(name: string, category?: string): FunctionMetadata | undefined {
    return FunctionRegistry.getMetadata(name, category);
}
