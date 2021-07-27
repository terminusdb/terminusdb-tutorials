from typing import List, Optional
from terminusdb_client import WOQLQuery, WOQLClient
import pandas as pd
import schema

def insert_data(client, url):
    all_breweries = []
    df = pd.read_csv(url, usecols = ['name', 'brewery_type', 'street', 'city', 'state', 'postal_code', 'website_url','phone', 'country', 'longitude', 'latitude'])
    df = df.fillna('')
    for index, row in df.iterrows():
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
        brewery_type = schema.Brewery_Type()
        brewery_type.name = row['brewery_type']
        brewery = schema.Brewery()
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
    client.set_db(db_id)
    insert_data(client, url)
    results = client.get_all_documents(graph_type="instance", count=2)
    print(list(results))