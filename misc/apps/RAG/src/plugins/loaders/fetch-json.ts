/**
 * Example plugin: Fetch JSON data from a URL.
 * 
 * Usage in FlowQuery:
 *   LOAD JSON FROM fetchJson('https://api.example.com/data') AS item
 *   RETURN item.name, item.value
 */

import { AsyncLoaderPlugin } from '../types';

/**
 * Fetches JSON data from a URL and yields each item if array, or the object itself.
 */
async function* fetchJsonProvider(url: string, options?: RequestInit): AsyncGenerator<any, void, unknown> {
    const response = await fetch(url, options);
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (Array.isArray(data)) {
        for (const item of data) {
            yield item;
        }
    } else {
        yield data;
    }
}

export const fetchJsonPlugin: AsyncLoaderPlugin = {
    name: 'fetchJson',
    provider: fetchJsonProvider,
    metadata: {
        description: 'Fetches JSON data from a URL. If the response is an array, yields each item individually.',
        category: 'data',
        parameters: [
            {
                name: 'url',
                description: 'The URL to fetch JSON from',
                type: 'string',
                required: true
            },
            {
                name: 'options',
                description: 'Optional fetch options (headers, method, etc.)',
                type: 'object',
                required: false
            }
        ],
        output: {
            description: 'JSON data items',
            type: 'object'
        },
        examples: [
            "LOAD JSON FROM fetchJson('https://api.example.com/users') AS user RETURN user.name",
            "LOAD JSON FROM fetchJson('https://api.example.com/data') AS item WHERE item.active = true RETURN item"
        ]
    }
};

export default fetchJsonPlugin;
