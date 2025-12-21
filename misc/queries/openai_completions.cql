// Test completion from OpenAI API
with
    '$OPENAI_API_KEY' as OPENAI_API_KEY
load json from 'https://api.openai.com/v1/chat/completions'
headers {
    `Content-Type`: 'application/json',
    Authorization: f'Bearer {OPENAI_API_KEY}',
    `OpenAI-Organization`: '$OPENAI_ORGANIZATION_ID' // Must be set to the organization ID
}
post {
    model: 'gpt-4o-mini',
    messages: [{role: 'user', content: 'Answer with this is a test!'}],
    temperature: 0.7
} as data
return data