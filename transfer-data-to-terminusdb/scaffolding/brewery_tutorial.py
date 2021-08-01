from typing import List, Optional
from terminusdb_client import WOQLQuery, WOQLClient
import pandas as pd
from tqdm import tqdm
import schema

def insert_data(client, url):
    all_breweries = []
    df = pd.read_csv(url)
    print("HEADERS\n", list(df.columns.values))
    print("\nSTATS\n", df.describe(include='all'), "\n\nPROGRESS")
    selection = df.loc[:, ['name', 'brewery_type', 'street', 'city', 'state', 'postal_code', 'website_url','phone', 'country', 'longitude', 'latitude']]
    selection = selection.fillna('')
    for index, row in tqdm(selection.iterrows(), total=df.shape[0], desc='Reading data'):
        country = schema.Country()
        country.name = row['country']
        state = schema.State()
        state.name = row['state']
        state.country = country
        city = schema.City()
        city.name = row['city']
        city.state = state
        address = schema.Address()
        address.street = row['street']
        address.city = city
        address.postal_code = row['postal_code']
        address.coordinates = [str(row['longitude']), str(row['latitude'])]
        brewery = schema.Brewery()
        brewery.type_of = schema.Brewery_Type[row['brewery_type']]
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
    client.set_db(db_id)
    insert_data(client, url)
    results = client.get_all_documents(graph_type="instance", count=2)
    print("\nRESULTS\n", list(results))