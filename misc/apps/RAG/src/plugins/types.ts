/**
 * Plugin type definitions for FlowQuery async data loaders.
 */

/**
 * Schema for function parameter descriptions.
 */
export interface ParameterSchema {
    name: string;
    description: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null' | string;
    required?: boolean;
    default?: any;
    items?: Omit<ParameterSchema, 'name' | 'required' | 'default'>;
    properties?: Record<string, Omit<ParameterSchema, 'name' | 'required'>>;
    enum?: any[];
    example?: any;
}

/**
 * Schema for function output descriptions.
 */
export interface OutputSchema {
    description: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null' | string;
    items?: Omit<OutputSchema, 'description'>;
    properties?: Record<string, Omit<ParameterSchema, 'name' | 'required'>>;
    example?: any;
}

/**
 * Metadata for describing a plugin function.
 * This metadata can be used by LLMs to understand available functions.
 */
export interface PluginMetadata {
    name: string;
    description: string;
    category?: string;
    parameters: ParameterSchema[];  // Required to match FunctionMetadata
    output: OutputSchema;           // Required to match FunctionMetadata
    examples?: string[];
    notes?: string;
}

/**
 * Type for async data provider functions used in LOAD operations.
 */
export type AsyncDataProvider = (...args: any[]) => AsyncGenerator<any, void, unknown> | Promise<any>;

/**
 * A plugin definition for an async data loader.
 */
export interface AsyncLoaderPlugin {
    /**
     * The name of the function as it will be used in FlowQuery.
     * Will be lowercased when registered.
     */
    name: string;

    /**
     * The async data provider function.
     */
    provider: AsyncDataProvider;

    /**
     * Optional metadata describing the function for LLM consumption.
     */
    metadata?: Omit<PluginMetadata, 'name'>;
}

/**
 * Interface that plugin modules should export.
 */
export interface PluginModule {
    /**
     * Array of plugins defined in this module.
     */
    plugins: AsyncLoaderPlugin[];
}
