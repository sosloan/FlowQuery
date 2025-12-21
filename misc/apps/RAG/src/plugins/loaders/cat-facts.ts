/**
 * Example plugin: Fetch random cat facts from the Cat Facts API.
 * 
 * Usage in FlowQuery:
 *   LOAD JSON FROM catFacts(5) AS fact
 *   RETURN fact.text
 */

import { AsyncLoaderPlugin } from '../types';

const CAT_FACTS_API = 'https://cat-fact.herokuapp.com/facts/random';

/**
 * Fetches random cat facts from the Cat Facts API.
 * 
 * @param count - Number of cat facts to fetch (default: 1)
 */
async function* catFactsProvider(count: number = 1): AsyncGenerator<any, void, unknown> {
    const url = `${CAT_FACTS_API}?amount=${count}`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch cat facts: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (Array.isArray(data)) {
        for (const fact of data) {
            yield fact;
        }
    } else {
        yield data;
    }
}

export const catFactsPlugin: AsyncLoaderPlugin = {
    name: 'catFacts',
    provider: catFactsProvider,
    metadata: {
        description: 'Fetches random cat facts from the Cat Facts API',
        category: 'examples',
        parameters: [
            {
                name: 'count',
                description: 'Number of cat facts to fetch',
                type: 'number',
                required: false,
                default: 1
            }
        ],
        output: {
            description: 'Cat fact object',
            type: 'object',
            properties: {
                text: { description: 'The cat fact text', type: 'string' },
                type: { description: 'Type of fact', type: 'string' },
                user: { description: 'User who submitted the fact', type: 'object' }
            }
        },
        examples: [
            "LOAD JSON FROM catFacts() AS fact RETURN fact.text",
            "LOAD JSON FROM catFacts(5) AS fact RETURN fact.text, size(fact.text) AS length"
        ]
    }
};

export default catFactsPlugin;
