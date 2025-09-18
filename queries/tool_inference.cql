with
    '$OPENAI_API_KEY' as OPENAI_API_KEY,
    '$OPENAI_ORGANIZATION_ID' as OPENAI_ORG_ID
unwind ["Where is my document?", "Who is Niclas?", "Who is my manager?"] as query
with f`
If query is people-related, then output:
people_search('query')
Otherwise, output:
search('query')

Here is the query: "{query}"
` as instruction
load json from 'https://api.openai.com/v1/chat/completions'
headers {
    `Content-Type`: 'application/json',
    Authorization: f'Bearer {OPENAI_API_KEY}',
    `OpenAI-Organization`: OPENAI_ORG_ID
}
post {
    model: 'gpt-4o-mini',
    messages: [{role: 'user', content: instruction}],
    temperature: 0.7
} as data
return query, data.choices[0].message.content as tool