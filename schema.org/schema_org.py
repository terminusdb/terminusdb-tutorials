from woqlclient import WOQLClient, WOQLQuery
import pandas as pd
import json

server_url = "http://localhost:6363"
key = "root"
dbId = "schema_org"

def construct_prop_docs(series):
    result = WOQLQuery().\
             doctype(series.id).\
             label(series.label).\
             description(series.comment)
    return result

def construct_type_docs(series, properties):
    result = WOQLQuery().\
             doctype(series.id).\
             label(series.label).\
             description(series.comment)
    if type(series.properties) == str:
        for prop in series.properties.split(','):
            prop = prop.strip()
            if prop in list(properties.id):
                prop_label = properties["label"][prop]
                result.property(f"{prop}_{series.id}", prop).label(f"{prop_label} of {series.label}")
    return result

def create_schema_from_queries(client, queries):
    schema = WOQLQuery().when(True).woql_and(*queries)
    return schema.execute(client)

print("read perperties from csv and construct WOQL objects")
properties = pd.read_csv("all-layers-properties.csv").head(20)
properties["WOQLObject"] = properties.apply(construct_prop_docs, axis=1)
properties.index = properties.id

print("read types from csv and construct WOQL objects")
types = pd.read_csv("all-layers-types.csv").head(20)
types["WOQLObject"] = types.apply(construct_type_docs,
                                  axis=1,
                                  properties=properties)
types.index = types.id

print("create db and schema")
client = WOQLClient()
client.connect(server_url, key)
client.createDatabase(dbId, "Schema.org")
create_schema_from_queries(client, list(properties["WOQLObject"]))
create_schema_from_queries(client, list(types["WOQLObject"]))
