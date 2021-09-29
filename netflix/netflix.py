from typing import List, Optional
from terminusdb_client import WOQLQuery, WOQLClient
from terminusdb_client.woqlschema.woql_schema import (
    DocumentTemplate,
    EnumTemplate,
    WOQLSchema,
)

import pandas as pd
from tqdm import tqdm
import tempfile

my_schema = WOQLSchema()

class Netflix(DocumentTemplate):
    _schema = my_schema
    title: str
    type_of: "Content_Type"
    director: str
    release_year: int

class Content_Type(EnumTemplate):
    _schema = my_schema
    TV_Show = "TV Show"
    Movie = "Movie"

def insert_data(client, url):
    df = pd.read_csv(url, chunksize=1000, usecols = ['type', 'title', 'director', 'release_year'])
    for chunk in tqdm(df, desc='Transfering data'):
        csv = tempfile.NamedTemporaryFile()
        chunk.to_csv(csv)
        netflix_content = read_data(csv.name)
        client.insert_document(netflix_content,
                               commit_msg="Adding all breweries")

def read_data(csv):
    records = []
    df = pd.read_csv(csv)
    selection = df.fillna('')
    for index, row in selection.iterrows():

        type_of = row['type'].replace(" ", "_")
        # Netflix
        netflix = Netflix()
        netflix.title = row['title']
        netflix.type_of = Content_Type[type_of]
        netflix.director = row['director']
        netflix.release_year = row['release_year']
        records.append(netflix)
    
    return records

if __name__ == "__main__":
    db_id = "Netflix"
    url = "netflix.csv"
    client = WOQLClient("http://127.0.0.1:6363")
    client.connect()
    try:
        client.create_database(db_id, team="admin", label = "Netflix Graph", description = "Create a graph with Netflix data")
    except Exception:
        client.set_db(db_id)
    client.insert_document(my_schema.to_dict(),
                           graph_type="schema",
                           commit_msg="I am checking in the schema")
    #csv_info(url)
    insert_data(client, url)
    results = client.get_all_documents(graph_type="instance", count=10)
    print("\nRESULTS\n", list(results))