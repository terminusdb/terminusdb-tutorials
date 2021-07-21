from typing import List, Optional

from terminusdb_client import WOQLQuery, WOQLClient

from terminusdb_client.woqlschema.woql_schema import (
    DocumentTemplate,
    ObjectTemplate,
    WOQLSchema,
    ValueHashKey,
    HashKey,
)

my_schema = WOQLSchema()

class Coordinates(ObjectTemplate):
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
    brewery_type: Brewery_Type 
    address_of: Address
    phone: str
    website_url: str
    created_at: str
    updated_at: str

def get_csv_variables(file_url):
    """Extracting the data from a CSV and binding it to variables
       Parameters
       ==========
       client : a WOQLClient() connection
       url : string, the URL of the CSV
       """
    csv = WOQLQuery().get(
        WOQLQuery().woql_as("name", "v:name_raw").
        woql_as("brewery_type", "v:brewery_type_raw").
        woql_as("street", "v:street_raw").
        woql_as("city", "v:city_raw").
        woql_as("state", "v:state_raw").
        woql_as("postal_code", "v:postal_code_raw").
        woql_as("country", "v:country_raw").
        woql_as("longitude", "v:longitude_raw").
        woql_as("latitude", "v:latitude_raw").
        woql_as("phone", "v:phone_raw").
        woql_as("website_url","v:website_url_raw").
		woql_as("created_at","v:created_at_raw").
		woql_as("updated_at","v:updated_at_raw")
    ).remote(file_url)
    return csv

def get_wrangles():
    wrangles = [
        WOQLQuery().idgen("doc:Brewery", ["v:name_raw"], "v:brewery_id"),
        WOQLQuery().cast("v:phone_raw", "xsd:integer", "v:phone_cast"),
        WOQLQuery().cast("v:created_at_raw", "xsd:dateTime", "v:created_at_cast"),
        WOQLQuery().cast("v:updated_at_raw", "xsd:dateTime", "v:updated_at_cast"),
        WOQLQuery().cast("v:longitude_raw", "xsd:float", "v:longitude_cast"),
        WOQLQuery().cast("v:latitude_raw", "xsd:float", "v:latitude_cast"),
        WOQLQuery().idgen("doc:Brewery_Type", ["v:brewery_type_raw"], "v:brewery_type_id"),
        WOQLQuery().idgen("doc:City", ["v:city_raw"], "v:city_id"),
        WOQLQuery().idgen("doc:State", ["v:state_raw"], "v:state_id"),
        WOQLQuery().idgen("doc:Country", ["v:country_raw"], "v:country_id"),
        WOQLQuery().idgen("doc:Address", ["v:street_raw", "v:postal_code_raw"], "v:address_id")
    ]
    return wrangles

def get_inserts():
    inserts = WOQLQuery().woql_and(
        WOQLQuery().insert("v:brewery_id", "Brewery",
            label="v:Brewery_Label",
            description="v:Brewery_Description").
            property("name", "v:name_raw").
            property("brewery_type", "v:brewery_type_id").
            property("address_of", "v:address_id").
            property("website_url", "v:website_url_raw").
            property("created_at", "v:created_at_cast").
            property("updated_at", "v:updated_at_cast"),
        WOQLQuery().insert("v:brewery_type_id", "Brewery_Type",
            label="v:Brewery_Type_Label",).
            property("name", "v:brewery_type_raw"),
        WOQLQuery().insert("v:city_id", "City",
            label="v:City_Label").
            property("name", "v:city_raw").
            property("state", "v:state_id"),
        WOQLQuery().insert("v:state_id", "State",
            label="v:State_Label").
            property("name", "v:state_raw").
            property("country", "v:country_id"),
        WOQLQuery().insert("v:country_id", "Country",
            label="v:Country_Label").
            property("name", "v:country_raw"),
        WOQLQuery().insert("v:address_id", "Address",
            label="v:Address_Label").
            property("street", "v:street_raw").
            property("city", "v:city_id").
            property("postal_code", "v:postal_code_raw").
            property("coordinates", ["v:longitude_cast", "v:latitude_cast"]),
    )    

    return inserts

def load_csv(client, url, wrangle, insert):
    csv = get_csv_variables(url)
    inputs = WOQLQuery().woql_and(csv, *wrangle)
    answer = WOQLQuery().when(inputs, insert)
    answer.execute(client, f"loading {url} into the graph")

if __name__ == "__main__":
    db_id = "open_brewery"
    url = "https://raw.githubusercontent.com/openbrewerydb/openbrewerydb/master/breweries.csv"
    client = WOQLClient("http://127.0.0.1:6363")
    client.connect(key="root", account="admin", user="admin")
    client.create_database(db_id, accountid="admin", label = "Open Brewery Graph", description = "Create a graph with brewery data")
    client.insert_document(my_schema.to_dict(),
                           graph_type="schema",
                           commit_msg="I am checking in the schema")
    load_csv(client, url, get_wrangles(), get_inserts())
    print(my_schema.to_dict())
    #client.delete_database(db_id, accountid="admin")
