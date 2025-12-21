/**
 * Plugin registry for loading and managing FlowQuery async data loader plugins.
 */

import { FlowQuery } from 'flowquery';
import { AsyncLoaderPlugin, PluginModule } from './types';

/**
 * Registry for managing FlowQuery plugins.
 */
class PluginRegistry {
    private loadedPlugins: Map<string, AsyncLoaderPlugin> = new Map();

    /**
     * Register a single plugin.
     * 
     * @param plugin - The plugin to register
     */
    public register(plugin: AsyncLoaderPlugin): void {
        const lowerName = plugin.name.toLowerCase();
        
        if (this.loadedPlugins.has(lowerName)) {
            console.warn(`Plugin '${plugin.name}' is already registered. Overwriting.`);
        }

        // Register with FlowQuery
        if (plugin.metadata) {
            FlowQuery.registerAsyncProvider(plugin.name, {
                provider: plugin.provider,
                metadata: {
                    name: plugin.name,
                    ...plugin.metadata
                }
            });
        } else {
            FlowQuery.registerAsyncProvider(plugin.name, plugin.provider);
        }

        this.loadedPlugins.set(lowerName, plugin);
        console.log(`Registered plugin: ${plugin.name}`);
    }

    /**
     * Register multiple plugins at once.
     * 
     * @param plugins - Array of plugins to register
     */
    public registerAll(plugins: AsyncLoaderPlugin[]): void {
        for (const plugin of plugins) {
            this.register(plugin);
        }
    }

    /**
     * Load plugins from a plugin module.
     * 
     * @param module - The plugin module to load
     */
    public loadModule(module: PluginModule): void {
        this.registerAll(module.plugins);
    }

    /**
     * Unregister a plugin by name.
     * 
     * @param name - The plugin name to unregister
     */
    public unregister(name: string): void {
        const lowerName = name.toLowerCase();
        if (this.loadedPlugins.has(lowerName)) {
            FlowQuery.unregisterAsyncProvider(name);
            this.loadedPlugins.delete(lowerName);
            console.log(`Unregistered plugin: ${name}`);
        }
    }

    /**
     * Get all loaded plugin names.
     * 
     * @returns Array of registered plugin names
     */
    public getLoadedPlugins(): string[] {
        return Array.from(this.loadedPlugins.keys());
    }

    /**
     * Check if a plugin is registered.
     * 
     * @param name - The plugin name to check
     * @returns True if the plugin is registered
     */
    public isRegistered(name: string): boolean {
        return this.loadedPlugins.has(name.toLowerCase());
    }

    /**
     * Clear all registered plugins.
     */
    public clear(): void {
        for (const name of this.loadedPlugins.keys()) {
            FlowQuery.unregisterAsyncProvider(name);
        }
        this.loadedPlugins.clear();
        console.log('Cleared all plugins');
    }
}

/**
 * Global plugin registry instance.
 */
export const pluginRegistry = new PluginRegistry();

export default pluginRegistry;
