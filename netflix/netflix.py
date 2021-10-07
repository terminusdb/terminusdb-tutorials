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
    cast: str
    country: "Country"
    release_year: int
    rating: "Rating"
    duration: str
    listed_in: str
    description: str
    date_added: str

class Content_Type(EnumTemplate):
    _schema = my_schema
    TV_Show = "TV Show"
    Movie = "Movie"

class Rating(EnumTemplate):
    _schema = my_schema
    TV_MA = "TV-MA"
    R = ()
    PG_13 = "PG-13"
    TV_14 = "TV-14"
    TV_PG = "TV-PG"
    NR = ()
    TV_G = "TV-G"
    TV_Y = "TV-Y"
    TV_Y7 = "TV-Y7"
    TY = ()
    TY_7 = "TY-7"
    PG = ()
    G = ()
    NC_17 = "NC-17"
    TV_Y7_FV = "TV-Y7-FV"
    UR = ()

class Country(DocumentTemplate):
    _subdocument = []
    _schema = my_schema
    name: str

def insert_data(client, url):
    df = pd.read_csv(url, chunksize=1000)
    for chunk in tqdm(df, desc='Transfering data'):
        csv = tempfile.NamedTemporaryFile()
        chunk.to_csv(csv)
        netflix_content = read_data(csv.name)
        client.insert_document(netflix_content,
                               commit_msg="Adding all Netflix content")

def read_data(csv):
    records = []
    df = pd.read_csv(csv)
    selection = df.fillna('')
    for index, row in selection.iterrows():

        type_of = row['type'].replace(" ", "_")
        rating = "NR" if row['rating'] == "" else row['rating'].replace("-", "_")

        #Country
        country = Country()
        country.name = row['country']
        records.append(country)

        # Netflix
        netflix = Netflix()
        netflix.title = row['title']
        netflix.type_of = Content_Type[type_of]
        netflix.director = row['director']
        netflix.cast = row['cast']
        netflix.country = country
        netflix.release_year = row['release_year']
        netflix.rating = Rating[rating]
        netflix.duration = row['duration']
        netflix.listed_in = row['listed_in']
        netflix.description = row['description']
        netflix.date_added = row['date_added']
        records.append(netflix)

    return records

if __name__ == "__main__":
    db_id = "Netflix"
    url = "netflix.csv"
    #client = WOQLClient("http://127.0.0.1:6363")
    #client.connect()

    team = "team"
    client = WOQLClient("https://cloud.terminusdb.com/team/")

    client.connect(team=team, use_token=True)
    
    try:
        client.create_database(db_id, team=team, label = "Netflix Graph", description = "Create a graph with Netflix data")
    except Exception:
        client.set_db(db_id)
    client.insert_document(my_schema.to_dict(),
                           graph_type="schema",
                           commit_msg="I am checking in the schema")
    insert_data(client, url)
    results = client.get_all_documents(graph_type="instance", count=10)
    print("\nRESULTS\n", list(results))
