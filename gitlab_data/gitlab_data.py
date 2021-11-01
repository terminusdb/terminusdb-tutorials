import singer
from tqdm import tqdm
import requests

schema = {
    'properties': {
        'id': {'type': 'string'},
        'short_id': {'type': 'string'},
        'created_at': {'type': 'string'},
        'title': {'type': 'string'},
        'message': {'type': 'string'},
        'author_name': {'type': 'string'},
        'author_email': {'type': 'string'},
        'authored_date': {'type': 'string'},
        'committer_name': {'type': 'string'},
        'committer_email': {'type': 'string'},
        'committed_date': {'type': 'string'},
        'web_url': {'type': 'string'},
    }
}

singer.write_schema('gitlab_data', schema, 'id')
response = requests.get('https://gitlab.com/api/v4/projects/11941964/repository/commits?since2018-03-01T00:00:00Z&per_page=100')
df = response.json()
for item in tqdm(df, desc='Transfering data'):
    singer.write_records('gitlab_data', [{'id': item['id'], 'short_id': item['short_id'], 'created_at': item['created_at'], 'title': item['title'], 'message': item['message'], 'author_name': item['author_name'], 'author_email': item['author_email'], 'authored_date': item['authored_date'], 'committer_name': item['committer_name'], 'committer_email': item['committer_email'], 'committed_date': item['committed_date'], 'web_url': item['web_url']}])