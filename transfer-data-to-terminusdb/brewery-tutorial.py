from typing import List, Optional
from terminusdb_client import WOQLQuery, WOQLClient
from terminusdb_client.woqlschema.woql_schema import (
    DocumentTemplate,
    WOQLSchema,
    ValueHashKey,
    HashKey,
)

import pandas as pd

my_schema = WOQLSchema()

class Coordinates(DocumentTemplate):
    _schema = my_schema
    longitude: float
    latitude: float

class Brewery_Type(DocumentTemplate):
    _schema = my_schema
    _key = ValueHashKey()
    name: str

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

    _key = HashKey(["street", "postal_code"])
    _subdocument = []

    street: str
    city = City
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
    df = pd.read_csv(url, usecols = ['name', 'brewery_type', 'street', 'city', 'state', 'postal_code', 'website_url','phone', 'country', 'longitude', 'latitude'])
    df = df.fillna('')
    for index, row in df.iterrows():
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
        brewery_type = Brewery_Type()
        brewery_type.name = row['brewery_type']
        brewery = Brewery()
        brewery.type_of = brewery_type
        brewery.address_of = address
        brewery.phone = row['phone']
        brewery.website_url = row['website_url']
        all_breweries.append(brewery)
    client.insert_document(all_breweries,
                           commit_msg="Adding all breweries")

if __name__ == "__main__":
    db_id = "open_brewery"
    url = "https://raw.githubusercontent.com/openbrewerydb/openbrewerydb/master/breweries.csv"
    client = WOQLClient("http://127.0.0.1:6363")
    client.connect(key="root", account="admin", user="admin")
    try:
        client.create_database(db_id, accountid="admin", label = "Open Brewery Graph", description = "Create a graph with brewery data")
    except Exception:
        client.set_db(db_id)
    client.insert_document(my_schema.to_dict(),
                           graph_type="schema",
                           commit_msg="I am checking in the schema")
    insert_data(client, url)
    results = client.get_all_documents(graph_type="instance", count=2)
    print(list(results))
