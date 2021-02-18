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
db_label = "WOQL"
db_comment = "WOQL Queries"
user = "admin"
account = "admin"
key = "root"

client = WOQLClient(server_url, insecure=True)
client.connect(user=user, account=account, key=key, db=db, insecure=True)

filename = f'woql.owl.ttl'
ttl_file = open(filename)
contents = ttl_file.read()
ttl_file.close()

before = time.time()
print(f"Loading WOQL schema")
client.update_triples(
    "schema","main",
    contents,
    f"Adding WOQL schema")
after = time.time()
total = (after - before)
print(f"Load took {total} seconds")


