import { FlowQuery } from 'flowquery';

/**
 * RAG (Retrieval Augmented Generation) loop using FlowQuery.
 * 
 * This is a starter template - customize it for your RAG implementation.
 */
async function main() {
    // Example: Run a simple FlowQuery query
    const query = new FlowQuery('WITH 1 AS x RETURN x + 1');

    try {
        await query.run();
        console.log('Result:', query.results); // [ { expr0: 2 } ]
    } catch (error) {
        console.error('Error running query:', error);
    }
}

main();
