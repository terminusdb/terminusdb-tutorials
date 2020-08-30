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
db = "DBpedia_import_rebase_squash_reset"
db_label = "DBpedia: import/rebase/squash/reset"
db_comment = "A test of various pipeline operations"
user = "admin"
account = "admin"
key = "root"
literal_properties_directory = 'literal_properties_xa_200k_test'
object_properties_directory = 'object_properties_xa_200k_test'
types_directory = 'instance_types_xa_200k_test'

if len(sys.argv) > 1 and (sys.argv[1] == '-optimize'
                          or sys.argv[1] == '--optimize'):
    optimize = True
else:
    optimize = False

space = "" if optimize else " "
client = WOQLClient(server_url, insecure=True)
client.connect(user=user, account=account, key=key, db=db, insecure=True)

def optimizer(client):
    client.optimize(f'{account}/{db}/_meta')
    client.optimize(f'{account}/{db}/local/_commits')

def report_total(times):
    total = sum(times)
    hours = math.floor(total / 3600)
    minutes = math.floor((total - hours * 3600) / 60)
    seconds = math.floor((total - hours * 3600 - minutes * 60))
    print(f"Total time {hours}:{minutes}:{seconds}")

try:
    client.delete_database(db)
except Exception as E:
    print(E)

client.create_database(db,account,label=db_label,
                       description=db_comment,
                       include_schema=False)

print("##########################################################")
print("#                                                        #")
print(f"# Starting run with optimization == {optimize}{space}                 #")
print("#                                                        #")
print("##########################################################")
print("")

# Load the perties branch
client.branch('literal_properties')
client.checkout('literal_properties')
times = []
print(f"Importing literal properties from {literal_properties_directory}")
for f in os.listdir(literal_properties_directory):
    filename = f'{literal_properties_directory}/{f}'
    ttl_file = open(filename)
    contents = ttl_file.read()
    ttl_file.close()

    # start the chunk work
    before = time.time()
    if optimize == True:
        optimizer(client)
    client.insert_triples(
        "instance","main",
        contents,
        f"Adding literal properties in 100k chunk ({f})")
    after = time.time()


    total = (after - before)
    times.append(total)
    print(f"Update took {total} seconds")
print(times)
report_total(times)

client.branch('object_properties', empty=True)
client.checkout('object_properties')
times = []
print(f"Importing object properties from {object_properties_directory}")
for f in os.listdir(object_properties_directory):
    filename = f'{object_properties_directory}/{f}'
    ttl_file = open(filename)
    contents = ttl_file.read()
    ttl_file.close()

    # start the chunk work
    before = time.time()
    if optimize == True:
        optimizer(client)
    client.insert_triples(
        "instance","main",
        contents,
        f"Adding object properties in 100k chunk ({f})")
    after = time.time()

    total = (after - before)
    times.append(total)
    print(f"Update took {total} seconds")
print(times)
report_total(times)

client.branch('types', empty=True)
client.checkout('types')
times = []
print(f"Importing types from {types_directory}")
for f in os.listdir(types_directory):
    filename = f'{types_directory}/{f}'
    ttl_file = open(filename)
    contents = ttl_file.read()
    ttl_file.close()

    # start the chunk work
    before = time.time()
    if optimize == True:
        optimizer(client)
    client.insert_triples(
        "instance","main",
        contents,
        f"Adding types in 100k chunk ({f})")
    after = time.time()


    total = (after - before)
    times.append(total)
    print(f"Update took {total} seconds")
print(times)
report_total(times)

print("Rebasing instance properties")
client.checkout('main')
before = time.time()
client.rebase({"rebase_from": f'{user}/{db}/local/branch/literal_properties',
               "author": user,
               "message": "Merging instance properties into main"})
after = time.time()
total = (after - before)
print(f"Rebase took {total} seconds")
report_total([total])


print("Rebasing object properties")
client.checkout('main')
before = time.time()
client.rebase({"rebase_from": f'{user}/{db}/local/branch/object_properties',
               "author": user,
               "message": "Merging object properties into main"})
after = time.time()
total = (after - before)
print(f"Rebase took {total} seconds")
report_total([total])

print("Rebasing types")
client.checkout('main')
before = time.time()
client.checkout('main')
client.rebase({"rebase_from": f'{user}/{db}/local/branch/types',
               "author": user,
               "message": "Merging types into main"})
after = time.time()
total = (after - before)
print(f"Rebase took {total} seconds")
report_total([total])


print(f"Squashing main")
before = time.time()
result = client.squash('Squash commit of properties and types')
after = time.time()
total = (after - before)
print(f"Squash took {total} seconds")
report_total([total])

commit = result['api:commit']
print(f"Branch reset to {commit}")
client.reset(commit)
