from typing import List, Optional
from terminusdb_client import WOQLQuery, WOQLClient
import pandas as pd
from tqdm import tqdm
import schema

def insert_data(client, url):
    breweries = []
    df = pd.read_csv(url, nrows=3000)
    print("HEADERS\n", list(df.columns.values))
    print("\nSTATS\n", df.describe(include='all'), "\n\nPROGRESS")
    selection = df.loc[:, ['name', 'brewery_type', 'street', 'city', 'state', 'postal_code', 'website_url', 'phone', 'country', 'longitude', 'latitude']]
    selection = selection.fillna('')
    for index, row in tqdm(selection.iterrows(), total=df.shape[0], desc='Reading data'):

        # City
        city = schema.City()
        city.name = row['city']
        breweries.append(city)

        # State
        state = schema.State()
        state.name = row['state']
        breweries.append(state)

        # Country
        country = schema.Country()
        country.name = row['country']
        breweries.append(country)
        
        # Coordinates
        coordinates = schema.Coordinates()
        coordinates.latitude = 0 if row['latitude']=='' else row['latitude']
        coordinates.longitude = 0 if row['longitude']=='' else row['longitude']
        breweries.append(coordinates)

        # Address
        address = schema.Address()
        address.street = row['street']
        address.city = city
        address.state = state
        address.country = country
        address.postal_code = row['postal_code']
        address.coordinates = [coordinates]
        breweries.append(address)

        # Brewery
        brewery = schema.Brewery()
        brewery.name = row['name']
        brewery.type_of = schema.Brewery_Type[row['brewery_type']]
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
    client.set_db(db_id)
    insert_data(client, url)
    results = client.get_all_documents(graph_type="instance", count=10)
    print("\nRESULTS\n", list(results))
