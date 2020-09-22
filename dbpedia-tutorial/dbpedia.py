#!/usr/bin/python3

import os
import sys
import time
import math

from terminusdb_client import WOQLClient
from terminusdb_client import WOQLQuery as WQ


# Assumes database already exists.

# openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout localhost.key -out localhost.crt
server_url = "https://127.0.0.1:6363"
#server_url = "https://195.201.12.87:6366"
db = "dbpedia"
db_label = "DBpedia"
db_comment = "Mapped object, property and types from DBpedia's core dataset"
user = "admin"
account = "admin"
key = "root"
branches = ["literals","types","objects", "geo"]

client = WOQLClient(server_url, insecure=True)
client.connect(user=user, account=account, key=key, db=db, insecure=True)

try:
    client.delete_database(db)
except Exception as E:
    print(E)

client.create_database(db,account,label=db_label,
                       description=db_comment,
                       include_schema=False)


for branch in branches:
    # Load the perties branch
    client.branch(branch, empty=True)
    client.checkout(branch)

    print(f"Importing from {branch}")
    for f in os.listdir(branch):
        filename = f'{branch}/{f}'
        ttl_file = open(filename)
        contents = ttl_file.read()
        ttl_file.close()

        # start the chunk work
        before = time.time()
        client.insert_triples(
            "instance","main",
            contents,
            f"Adding {branch} in 200k chunk ({f})")
        after = time.time()

        total = (after - before)
        print(f"Update took {total} seconds")

for branch in branches:
    print(f"Rebasing {branch}")
    client.checkout('main')
    before = time.time()
    client.rebase({"rebase_from": f'{user}/{db}/local/branch/{branch}',
                   "author": user,
                   "message": f"Merging {branch} into main"})
    after = time.time()
    total = (after - before)
    print(f"Rebase took {total} seconds")


print(f"Squashing main")
before = time.time()
result = client.squash('Squash commit of properties and types')
after = time.time()
total = (after - before)
print(f"Squash took {total} seconds")


commit = result['api:commit']
print(f"Branch reset to {commit}")
client.reset(commit)
