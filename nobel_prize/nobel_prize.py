import singer
import pandas as pd
from tqdm import tqdm
import tempfile

schema = {
    'properties': {
        'firstname': {'type': 'string'},
        'surname': {'type': 'string'},
        'born': {'type': 'string'},
        'died': {'type': 'string'},
        'bornCountry': {'type': 'string'},
        'bornCountryCode': {'type': 'string'},
        'bornCity': {'type': 'string'},
        'diedCountry': {'type': 'string'},
        'diedCountryCode': {'type': 'string'},
        'diedCity': {'type': 'string'},
        'gender': {'type': 'string'},
        'year': {'type': 'string'},
        'category': {'type': 'string'},
        'overallMotivation': {'type': 'string'},
        'share': {'type': 'string'},
        'motivation': {'type': 'string'},
        'name': {'type': 'string'},
        'city': {'type': 'string'},
        'country': {'type': 'string'},
    }
}

def read_data(url):
    df = pd.read_csv(url, encoding='latin1', chunksize=500)
    singer.write_schema('nobel_prize', schema, 'firstname')
    for chunk in tqdm(df, desc='Transfering data'):
        csv = tempfile.NamedTemporaryFile()
        chunk.to_csv(csv)
        write_data(csv.name)

def write_data(csv):
    df = pd.read_csv(csv)
    selection = df.fillna('')
    for index, row in selection.iterrows():
        singer.write_records('nobel_prize', [{'firstname': row['firstname'], 'surname': row['surname'], 'born': row['born'], 'died': row['died'], 'bornCountry': row['bornCountry'], 'bornCountryCode': row['bornCountryCode'], 'bornCity': row['bornCity'], 'diedCountry': row['diedCountry'], 'diedCountryCode': row['diedCountryCode'], 'diedCity': row['diedCity'], 'gender': row['gender'], 'year': str(row['year']), 'category': row['category'], 'overallMotivation': row['overallMotivation'], 'share': str(row['share']), 'motivation': row['motivation'], 'name': row['name'], 'city': row['city'], 'country': row['country']}])

url='nobel_prize.csv'
read_data(url)