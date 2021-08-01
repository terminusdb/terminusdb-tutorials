from typing import List, Optional
from terminusdb_client import WOQLQuery, WOQLClient
from terminusdb_client.woqlschema.woql_schema import (
    DocumentTemplate,
    EnumTemplate,
    WOQLSchema,
    ValueHashKey,
    HashKey,
)

import pandas as pd
from tqdm import tqdm

my_schema = WOQLSchema()

class Coordinates(DocumentTemplate):
    _schema = my_schema
    longitude: float
    latitude: float

class Brewery_Type(EnumTemplate):
    _schema = my_schema
    micro = ()
    nano = ()
    regional = ()
    brewpub = ()
    large = ()
    planning = ()
    bar = ()
    contract = ()
    proprietor = ()
    closed = ()
    taproom = ()

class Country(DocumentTemplate):
    _schema = my_schema
    _key = ValueHashKey()
    name: str

class State(DocumentTemplate):
    _schema = my_schema
    _key = ValueHashKey()
    name: str
    country: Country

class City(DocumentTemplate):
    _schema = my_schema
    _key = ValueHashKey()
    name: str
    state: State

class Address(DocumentTemplate):
    _schema = my_schema
    """This is address"""

    _subdocument = []

    street: str
    city: City
    postal_code: str
    coordinates: List[Coordinates]

class Brewery(DocumentTemplate):
    _schema = my_schema
    name: str
    type_of: Brewery_Type 
    address_of: Address
    phone: str
    website_url: str

def insert_data(client, url):
    all_breweries = []
    df = pd.read_csv(url)
    print("HEADERS\n", list(df.columns.values))
    print("\nSTATS\n", df.describe(include='all'), "\n\nPROGRESS")
    selection = df.loc[:, ['name', 'brewery_type', 'street', 'city', 'state', 'postal_code', 'website_url','phone', 'country', 'longitude', 'latitude']]
    selection = selection.fillna('')
    for index, row in tqdm(selection.iterrows(), total=df.shape[0], desc='Reading data'):
        country = Country()
        country.name = row['country']
        state = State()
        state.name = row['state']
        state.country = country
        city = City()
        city.name = row['city']
        city.state = state
        address = Address()
        address.street = row['street']
        address.city = city
        address.postal_code = row['postal_code']
        address.coordinates = [str(row['longitude']), str(row['latitude'])]
        brewery = Brewery()
        brewery.type_of = Brewery_Type[row['brewery_type']]
        brewery.address_of = address
        brewery.phone = row['phone']
        brewery.website_url = row['website_url']
        all_breweries.append(brewery)
    with tqdm(total=1, desc='Transfering data') as pbar:
        client.insert_document(all_breweries,
                               commit_msg="Adding all breweries")
        pbar.update(1)

if __name__ == "__main__":
    db_id = "open_brewery"
    url = "https://raw.githubusercontent.com/openbrewerydb/openbrewerydb/master/breweries.csv"
    client = WOQLClient("http://127.0.0.1:6363")
    client.connect()
    try:
        client.create_database(db_id, accountid="admin", label = "Open Brewery Graph", description = "Create a graph with brewery data")
    except Exception:
        client.set_db(db_id)
    client.insert_document(my_schema.to_dict(),
                           graph_type="schema",
                           commit_msg="I am checking in the schema")
    insert_data(client, url)
    results = client.get_all_documents(graph_type="instance", count=2)
    print("\nRESULTS\n", list(results))