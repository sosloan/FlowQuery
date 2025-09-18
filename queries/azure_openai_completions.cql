// Test completion from Azure OpenAI API
with
    '$AZURE_OPENAI_API_KEY' as AZURE_OPENAI_API_KEY
load json from '$AZURE_OPENAI_ENDPOINT'
headers {
    `Content-Type`: 'application/json',
    `api-key`: AZURE_OPENAI_API_KEY,
}
post {
    messages: [{role: 'user', content: 'Answer with this is a test!'}],
    temperature: 0.7
} as data
return data