import requests
import json
user = requests.post('http://localhost:3000/bbql',
  headers= {"content-type": "application/json"},
  data=json.dumps({
    "query": 'query userById ($id: String!, $refresh: Boolean) { user: userById (id: $id, refresh: $refresh) { _id id uuid externalId userName contact { email } } }',
    "variables": { "id": "userName:bbqluser" }
  })
)

print(user.text)