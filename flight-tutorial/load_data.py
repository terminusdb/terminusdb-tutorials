from terminusdb_client.woqlquery import WOQLQuery
from terminusdb_client.woqlclient import WOQLClient
import json
import pandas as pd

countries_header = ['Name',
                    'ISO Code',
                    'FIP Code']
airlines_header = ['Airline ID',
                   'Name',
                   'Alias',
                   'IATA',
                   'ICAO',
                   'Callsign',
                   'Country',
                   'Active']
airports_header = ['Airport ID',
                   'Name',
                   'City',
                   'Country',
                   'IATA',
                   'ICAO',
                   'Latitude',
                   'Longitude',
                   'Altitude',
                   'Timezone',
                   'DST',
                   'Tz database time zone',
                   'Type',
                   'Source']
routes_header = ['Airline Code',
                 'Airline ID',
                 'Source Airport ID',
                 'Source Airport Code',
                 'Destination Airport ID',
                 'Destination Airport Code',
                 'Codeshare',
                 'Number of stops']

countries = pd.read_csv('countries.dat', sep=',', names=countries_header, index_col=False)
#print(countries.head())

airlines = pd.read_csv('airlines.dat', sep=',', names=airlines_header, index_col=False)
#print(airlines.head())

airports = pd.read_csv('airports.dat', sep=',', names=airports_header, index_col=False)
#print(airports.head())

routes = pd.read_csv('routes.dat', sep=',', names=routes_header, index_col=False)
#print(routes.head())

def _clean_id(input, prefix=None):
    if pd.isna(input):
        return None
    keepcharacters = (' ','_')
    clean_id = "".join(c for c in input if c.isalnum() or c in keepcharacters).rstrip().replace(' ','_').lower()
    if prefix is None:
        return clean_id
    else:
        return prefix.lower() + '_' + clean_id

def load_country(series):
    if pd.isna(series['Country ID']):
        return None
    query_obj = WOQLQuery().insert(series['Country ID'],'Country').label(series['Name'])
    if pd.notna(series['ISO Code']):
        data_obj = {"@value" : series['ISO Code'], "@type" : "xsd:string"}
        query_obj.property('iso_code', data_obj)
    if pd.notna(series['FIP Code']):
        data_obj = {"@value" : series['FIP Code'], "@type" : "xsd:string"}
        query_obj.property('fip_code', data_obj)
    return query_obj

countries['Country ID'] = countries['Name'].apply(_clean_id, prefix='country')
countries_query = countries.apply(load_country, axis=1).dropna()

def load_airline(series, countries_list):
    if (series['Airline ID'] == -1) or (pd.isna(series['Clean ID'])):
        return None
    query_obj = WOQLQuery().insert(series['Clean ID'],'Airline').label(series['Name'])

    clean_country = _clean_id(series['Country'], prefix='country')
    if clean_country in countries_list:
        query_obj.property('registered_in', "doc:"+clean_country)
    return query_obj

airlines['Clean ID'] = airlines['Name'].apply(_clean_id, prefix='airline')
airlines_query = airlines.apply(load_airline, axis=1, countries_list=list(countries['Country ID'])).dropna()

def load_airport(series, countries_list):
    if (series['Airport ID'] == -1) or (pd.isna(series['Clean ID'])):
        return None
    query_obj = WOQLQuery().insert(series['Clean ID'],'Airport').label(series['Name'])

    clean_country = _clean_id(series['Country'], prefix='country')
    if clean_country in countries_list:
        query_obj.property('situated_in', "doc:"+clean_country)

    return query_obj

airports['Clean ID'] = airports['Name'].apply(_clean_id, prefix='airport')
airports_query = airports.apply(load_airport, axis=1, countries_list=list(countries['Country ID'])).dropna()

def load_flight(series, airports, airlines):
    clean_id = f"{series['Airline Code']}_{series['Source Airport ID']}_{series['Destination Airport ID']}"
    query_obj = WOQLQuery().insert(clean_id,'Flight').label(f"Flight by {series['Airline Code']} from {series['Source Airport ID']} to {series['Destination Airport ID']}")

    # departs
    if len(series['Source Airport ID']) == 3:
        lookup = 'IATA'
    elif len(series['Source Airport ID']) == 4:
        lookup = 'ICAO'
    else:
        lookup = None

    if lookup is not None:
        filter = airports[lookup]==series['Source Airport ID']
        if filter.any():
            airport_id = airports[filter]['Clean ID'].iloc[0]
            query_obj.property('departs', "doc:"+airport_id)

    # arrives
    if len(series['Destination Airport ID']) == 3:
        lookup = 'IATA'
    elif len(series['Destination Airport ID']) == 4:
        lookup = 'ICAO'
    else:
        lookup = None

    if lookup is not None:
        filter = airports[lookup]==series['Destination Airport ID']
        if filter.any():
            airport_id = airports[filter]['Clean ID'].iloc[0]
            query_obj.property('arrives', "doc:"+airport_id)

    # operated_by
    if len(series['Airline Code']) == 2:
        lookup = 'IATA'
    elif len(series['Airline Code']) == 3:
        lookup = 'ICAO'
    else:
        lookup = None

    if lookup is not None:
        filter = (airlines[lookup]==series['Airline Code'])
        if filter.any():
            airline_id = airlines[filter]['Clean ID'].iloc[0]
            query_obj.property('operated_by', "doc:"+airline_id)

    return query_obj

flights_query = routes.apply(load_flight, axis=1, airports=airports, airlines=airlines).dropna()

db_id = "pyplane"
client = WOQLClient(server_url = "http://localhost:6363")
client.connect(key="root", account="admin", user="admin")
existing = client.get_metadata(db_id, client.uid())
if not existing:
    client.create_database(db_id, "admin", { "label": "Flight Graph", "comment": "Create a graph with Open Flights data"})
else:
    client.db(db_id)
WOQLQuery().woql_and(*countries_query).execute(client)
WOQLQuery().woql_and(*airlines_query).execute(client)
WOQLQuery().woql_and(*airports_query).execute(client)
WOQLQuery().woql_and(*flights_query).execute(client)
