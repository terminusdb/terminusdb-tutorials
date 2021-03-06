#!/usr/bin/python3

import os
import sys
import time
import math

from terminusdb_client import WOQLClient
from terminusdb_client import WOQLQuery as WQ


# openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout localhost.key -out localhost.crt
server_url = "https://127.0.0.1:6363"
db = "woql"
user = "admin"
account = "admin"
key = "root"

client = WOQLClient(server_url, insecure=True)
client.connect(user=user, account=account, key=key, db=db, insecure=True)

query = WQ().triple("v:X", "v:Y", "v:Z").to_dict()
print(query)

# Just stick the query in there...
WQ().update_object(query).execute(client)
print("Inserted query")

# Instead give the query a name to aid retrieval
query['@id'] = 'doc:my_triple_query'
WQ().update_object(query).execute(client)
print("Inserted named query")

# Get the object back
results = WQ().read_object('doc:my_triple_query', "v:Query").execute(client)
my_triple_query = results['bindings'][0]['Query']
print(f"And here it is: {my_triple_query}")

results = client.query(my_triple_query)['bindings']

print(f"And results are us looking at ourselves: {results}")
