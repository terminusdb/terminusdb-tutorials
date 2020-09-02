#!/usr/bin/python3

import os
import time
from terminusdb_client import WOQLClient
from terminusdb_client import WOQLQuery as WQ

server_url = "https://127.0.0.1:6363"
db = "wordnet"
user = "admin"
account = "admin"
key = "root"
client = WOQLClient(server_url)
client.connect(user=user, account=account, key=key, db=db)
#client.delete_database(db)

try:
    client.create_database(db,account,label="WordNet",
                           description="WordNet in TerminusDB", include_schema=False)
except:
    pass

times = []
directory = 'wordnet_chunks'
for f in os.listdir(directory):
    filename = f'{directory}/{f}'
    ttl_file = open(filename)
    contents = ttl_file.read()
    ttl_file.close()
    before = time.time()
    print(f"Loading WordNet in chunks ({f})")
    client.insert_triples(
        "instance","main",
        contents,
        f"Adding WordNet in chunks ({f})")
    after = time.time()
    total = (after - before)
    times.append(total)
    print(f"Update took {total} seconds")

print(f"Squashing main")
before = time.time()
client.checkout("main")
result = client.squash('Squash commit of properties and types')
after = time.time()
total = (after - before)
print(f"Squash took {total} seconds")

commit = result['api:commit']
print(f"Branch reset to {commit}")
client.reset(commit)
