/**
 * Example plugin: Generate mock data for testing.
 * 
 * Usage in FlowQuery:
 *   LOAD JSON FROM mockUsers(10) AS user
 *   RETURN user.name, user.email
 */

import { AsyncLoaderPlugin } from '../types';

/**
 * Generates mock user data.
 * 
 * @param count - Number of mock users to generate
 */
async function* mockUsersProvider(count: number = 5): AsyncGenerator<any, void, unknown> {
    const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const domains = ['example.com', 'test.org', 'demo.net'];

    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const domain = domains[Math.floor(Math.random() * domains.length)];
        
        yield {
            id: i + 1,
            name: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
            age: Math.floor(Math.random() * 50) + 18,
            active: Math.random() > 0.3
        };
    }
}

/**
 * Generates mock product data.
 * 
 * @param count - Number of mock products to generate
 */
async function* mockProductsProvider(count: number = 5): AsyncGenerator<any, void, unknown> {
    const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];
    const adjectives = ['Premium', 'Basic', 'Pro', 'Ultra', 'Classic'];
    const nouns = ['Widget', 'Gadget', 'Item', 'Product', 'Thing'];

    for (let i = 0; i < count; i++) {
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        yield {
            id: i + 1,
            name: `${adj} ${noun} ${i + 1}`,
            category,
            price: Math.round(Math.random() * 1000 * 100) / 100,
            inStock: Math.random() > 0.2,
            rating: Math.round(Math.random() * 50) / 10
        };
    }
}

export const mockUsersPlugin: AsyncLoaderPlugin = {
    name: 'mockUsers',
    provider: mockUsersProvider,
    metadata: {
        description: 'Generates mock user data for testing purposes',
        category: 'testing',
        parameters: [
            {
                name: 'count',
                description: 'Number of mock users to generate',
                type: 'number',
                required: false,
                default: 5
            }
        ],
        output: {
            description: 'Mock user object',
            type: 'object',
            properties: {
                id: { description: 'User ID', type: 'number' },
                name: { description: 'Full name', type: 'string' },
                email: { description: 'Email address', type: 'string' },
                age: { description: 'Age in years', type: 'number' },
                active: { description: 'Whether user is active', type: 'boolean' }
            }
        },
        examples: [
            "LOAD JSON FROM mockUsers(10) AS user RETURN user.name, user.email",
            "LOAD JSON FROM mockUsers(20) AS user WHERE user.active = true RETURN user"
        ]
    }
};

export const mockProductsPlugin: AsyncLoaderPlugin = {
    name: 'mockProducts',
    provider: mockProductsProvider,
    metadata: {
        description: 'Generates mock product data for testing purposes',
        category: 'testing',
        parameters: [
            {
                name: 'count',
                description: 'Number of mock products to generate',
                type: 'number',
                required: false,
                default: 5
            }
        ],
        output: {
            description: 'Mock product object',
            type: 'object',
            properties: {
                id: { description: 'Product ID', type: 'number' },
                name: { description: 'Product name', type: 'string' },
                category: { description: 'Product category', type: 'string' },
                price: { description: 'Price in dollars', type: 'number' },
                inStock: { description: 'Whether product is in stock', type: 'boolean' },
                rating: { description: 'Customer rating (0-5)', type: 'number' }
            }
        },
        examples: [
            "LOAD JSON FROM mockProducts(10) AS p RETURN p.name, p.price",
            "LOAD JSON FROM mockProducts(50) AS p WHERE p.category = 'Electronics' RETURN p"
        ]
    }
};

export const plugins = [mockUsersPlugin, mockProductsPlugin];

export default plugins;
