from typing import List, Optional
from terminusdb_client import WOQLQuery, WOQLClient
from terminusdb_client.woqlschema.woql_schema import (
    DocumentTemplate,
    EnumTemplate,
    WOQLSchema,
)

import pandas as pd
from tqdm import tqdm

my_schema = WOQLSchema()

class Address(DocumentTemplate):
    """This is address"""

    _subdocument = []
    _schema = my_schema
    city: "City"
    state: Optional["State"]
    country: "Country"
    coordinates: List["Coordinates"]
    postal_code: str
    street: str

class Brewery(DocumentTemplate):
    _schema = my_schema
    address_of: "Address"
    name: str
    phone: str
    type_of: "Brewery_Type"
    website_url: str

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

class City(DocumentTemplate):
    _schema = my_schema
    name: str

class Coordinates(DocumentTemplate):
    _schema = my_schema
    latitude: float
    longitude: float

class Country(DocumentTemplate):
    _schema = my_schema
    name: str

class State(DocumentTemplate):
    _schema = my_schema
    name: str

def insert_data(client, url):
    breweries = []
    df = pd.read_csv(url, nrows=4000)
    print("HEADERS\n", list(df.columns.values))
    print("\nSTATS\n", df.describe(include='all'), "\n\nPROGRESS")
    selection = df.loc[:, ['name', 'brewery_type', 'street', 'city', 'state', 'postal_code', 'website_url', 'phone', 'country', 'longitude', 'latitude']]
    selection = selection.fillna('')
    for index, row in tqdm(selection.iterrows(), total=df.shape[0], desc='Reading data'):

        # City
        city = City()
        city.name = row['city']
        breweries.append(city)

        # State
        state = State()
        state.name = row['state']
        breweries.append(state)

        # Country
        country = Country()
        country.name = row['country']
        breweries.append(country)
        
        # Coordinates
        coordinates = Coordinates()
        coordinates.latitude = 0 if row['latitude']=='' else row['latitude']
        coordinates.longitude = 0 if row['longitude']=='' else row['longitude']
        breweries.append(coordinates)

        # Address
        address = Address()
        address.street = row['street']
        address.city = city
        address.state = state
        address.country = country
        address.postal_code = row['postal_code']
        address.coordinates = [coordinates]
        breweries.append(address)

        # Brewery
        brewery = Brewery()
        brewery.name = row['name']
        brewery.type_of = Brewery_Type[row['brewery_type']]
        brewery.address_of = address
        brewery.phone = str(row['phone'])
        brewery.website_url = row['website_url']
        breweries.append(brewery)
    
    with tqdm(total=1, desc='Transfering data') as pbar:
        client.insert_document(breweries,
                               commit_msg="Adding all breweries")
        pbar.update(1)

if __name__ == "__main__":
    db_id = "Brewery"
    url = "https://raw.githubusercontent.com/openbrewerydb/openbrewerydb/master/breweries.csv"
    client = WOQLClient("http://127.0.0.1:6363")
    client.connect()
    try:
        client.create_database(db_id, team="admin", label = "Open Brewery Graph", description = "Create a graph with brewery data")
    except Exception:
        client.set_db(db_id)
    client.insert_document(my_schema.to_dict(),
                           graph_type="schema",
                           commit_msg="I am checking in the schema")
    insert_data(client, url)
    results = client.get_all_documents(graph_type="instance", count=10)
    print("\nRESULTS\n", list(results))
