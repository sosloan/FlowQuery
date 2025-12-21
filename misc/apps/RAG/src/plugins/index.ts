/**
 * Plugin loader - automatically discovers and loads all plugins.
 * 
 * To add a new plugin:
 * 1. Create a new file in the `loaders/` directory
 * 2. Export your plugin(s) following the AsyncLoaderPlugin interface
 * 3. Import and add to the plugins array in this file
 */

import pluginRegistry from './registry';
import { AsyncLoaderPlugin } from './types';

// Import individual plugins
import fetchJsonPlugin from './loaders/fetch-json';
import catFactsPlugin from './loaders/cat-facts';
import mockDataPlugins from './loaders/mock-data';

/**
 * All plugins to be loaded on startup.
 * Add new plugins here as they are created.
 */
const allPlugins: AsyncLoaderPlugin[] = [
    fetchJsonPlugin,
    catFactsPlugin,
    ...mockDataPlugins,
];

/**
 * Initialize and load all plugins.
 * Call this function once on app startup.
 */
export function initializePlugins(): void {
    console.log('Initializing FlowQuery plugins...');
    pluginRegistry.registerAll(allPlugins);
    console.log(`Loaded ${pluginRegistry.getLoadedPlugins().length} plugins`);
}

/**
 * Get the list of loaded plugin names.
 */
export function getLoadedPluginNames(): string[] {
    return pluginRegistry.getLoadedPlugins();
}

// Re-export types and registry for external use
export { pluginRegistry } from './registry';
export type { AsyncLoaderPlugin, PluginModule, PluginMetadata, AsyncDataProvider } from './types';
