import { run } from 'flowquery';

/**
 * RAG (Retrieval Augmented Generation) loop using FlowQuery.
 * 
 * This is a starter template - customize it for your RAG implementation.
 */
async function main() {
    // Example: Run a simple FlowQuery query
    const query = `return 1`;

    try {
        const result = await run(query);
        console.log('Result:', result);
    } catch (error) {
        console.error('Error running query:', error);
    }
}

main();
