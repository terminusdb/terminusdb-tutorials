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


nodes = client.query_document({ '@type' : 'Node' })
links = client.query_document({ '@type' : 'Edge' })

with open('data.txt', 'w') as outfile:
    json.dump(data, outfile)

write

from terminusdb_client.woqlquery.woql_query import WOQLQuery as WQ



"""
[Links,Seed,Id,Type,Class,
 Nodes,Document,Source,Target] = vars("Links","Seed","Id","Type","Class",
                                      "Nodes","Document","Source","Target")
query = (WQ().select([Links],
                     WQ().group_by(
                         True,
                         { "source" : Seed, "target": Target },
                         ( WQ().member(Seed, Seeds)
                         & WQ().path(Seed,"edge",Id)
                         & WQ().triple(Id, "rdf:type", Type)
                         & WQ().triple(Type, "rdf:type", "sys:Class", schema)),
                         Links))
         && WQ().select([Nodes],
                        WQ().group_by(
                            True,
                            Document,
                            ( WQ().distinct(Node,
                                            ( WQ().member(Link,Links)
                                            & WQ().dot(Link, source, Source),
                                            & WQ().dot(Link, target, Target),
                                            & ( Node = Source
                                              | Node = Target )
                                             )),
                             & WQ()get_document(Node, Document)
                             ),
                            Nodes
                        )
                        )
         )
"""
