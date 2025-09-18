// Return models from Azure OpenAI API
with
    '$AZURE_OPENAI_API_KEY' as AZURE_OPENAI_API_KEY
load json from '$AZURE_OPENAI_MODELS_LIST_ENDPOINT'
headers {
    `api-key`: f'{AZURE_OPENAI_API_KEY}'
} as l
unwind l.data as model
return model