#!/usr/bin/python3
from terminusdb_client import WOQLClient
import re
import csv
import json
import math
import os
import urllib.parse

team = 'admin'
#team = os.environ['TERMINUSDB_TEAM']
team_quoted = urllib.parse.quote(team)
client = WOQLClient(f"http://localhost:6363")
# make sure you have put the token in environment variable
client.connect()

dbid = "graph"
label = "Document Graph"
description = "A knowledge graph of documents."
prefixes = {'@base' : 'iri://graph',
            '@schema' : 'iri://graph#'}

if client.get_database(dbid):
    client.delete_database(dbid, team=team, force=True)
client.create_database(dbid,
                       team,
                       label=label,
                       description=description,
                       prefixes=prefixes)

schema = [
    { '@type' : 'Class',
      '@id' : 'Node',
      '@key' : { '@type' : 'Lexical', '@fields' : [ 'name' ] },
      'name' : 'xsd:string' },
    { '@type' : 'Class',
      '@id' : 'Edge',
      '@key' : { '@type' : 'Lexical', '@fields' : [ 'source', 'target' ] },
      'source' : 'Node',
      'target' : 'Node',
      'weight' : 'xsd:integer' }
]

client.message="Adding Graph Schema."
results = client.insert_document(schema,graph_type="schema")
print(f"Inserted schema objects: {results}")

objects = [
    { '@type' : "Node",
      "name" : "a" },
    { '@type' : "Node",
      "name" : "b" },
    { '@type' : "Node",
      "name" : "c" },
    { '@type' : 'Edge',
      'source' : 'Node/a',
      'target' : 'Node/b',
      'weight' : 10 },
    { '@type' : 'Edge',
      'source' : 'Node/a',
      'target' : 'Node/c',
      'weight' : 5 },
    { '@type' : 'Edge',
      'source' : 'Node/b',
      'target' : 'Node/a',
      'weight' : 3 },
    { '@type' : 'Edge',
      'source' : 'Node/b',
      'target' : 'Node/c',
      'weight' : 12 }
]

results = client.insert_document(objects)
print(f"Inserted edge and node objects: {results}")


nodes = list(client.query_document({ '@type' : 'Node' }))
links = list(client.query_document({ '@type' : 'Edge' }))

with open('data.json', 'w') as outfile:
    json.dump({'nodes' : nodes, 'links' : links}, outfile)
