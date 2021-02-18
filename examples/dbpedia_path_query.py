#!/usr/bin/python3

import os
import time
import datetime
from terminusdb_client import WOQLClient
from terminusdb_client import WOQLQuery as WOQL

# Connect to the server
server_url = "https://127.0.0.1:6363"
db = "dbpedia_1"
user = "admin"
account = "admin"
key = "root"
client = WOQLClient(server_url)
client.connect(user=user, account=account, key=key, db=db)

# Example of a single hop
query = WOQL().limit(1,
    WOQL.woql_and(
        WOQL().path("doc:Whitesnake", "scm:bandMember", "v:Member", "v:Path"),
    ))
result = client.query(query)
print(f"Band member: {result['bindings'][0]['Member']}")

query = WOQL().limit(1,
    WOQL.woql_and(
        WOQL().path("doc:Whitesnake", "scm:bandMember,scm:birthPlace", "v:Place", "v:Path"),
    ))
result = client.query(query)
print(result['bindings'][0])

query = WOQL().limit(3,
        WOQL().select("v:P", "v:Result").woql_and(
          WOQL().path("doc:Whitesnake", "scm:bandMember,scm:birthPlace,(scm:country,scm:officialLanguage,scm:spokenIn)+", "v:Place", "v:Path"),
          WOQL().triple("v:Place", "v:P", "v:Result")
    ))
result = client.query(query)
print(result['bindings'])

query = WOQL().limit(3,
        WOQL().select("v:Band", "v:Path").woql_and(
            WOQL().path("doc:The_Beatles", "scm:associatedBand+", "v:Band", "v:Path"),
    ))
result = client.query(query)
print(result['bindings'])


"""
query = WOQL().limit(1,
    WOQL.woql_and(
        WOQL().path("doc:Whitesnake", "(scm:bandMember>,<scm:bandMember)+", "v:Band","v:Path"),
        WOQL().triple("v:Band", "scm:genre", "doc:Country_music"),
    ))
result = client.query(query)
print(result['bindings'][0]['Band'])
print(result['bindings'][0]['Path'])

"""
