#!/usr/bin/python3

import os
import sys
import time
import math

from terminusdb_client import WOQLClient
from terminusdb_client import WOQLQuery as WQ


# openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout localhost.key -out localhost.crt
server_url = "https://127.0.0.1:6363"
db = "bands"
db_label = "Bands from DBPedia"
db_comment = "Band and related data extracted from DBPedia"
user = "admin"
account = "admin"
key = "root"

client = WOQLClient(server_url, insecure=True)
client.connect(user=user, account=account, key=key, db=db, insecure=True)

try:
    client.delete_database(db,account)
except Exception as E:
    print(E)

client.create_database(db,account,label=db_label,
                       prefixes = {'doc': 'http://dbpedia.org/resource/',
                                   'scm': 'http://dbpedia.org/ontology/'},
                       description=db_comment,
                       include_schema=False)

# WARNING! Requires that dbpedia already be cloned

query_band_obj = WQ().woql_and(
    WQ().using("admin/dbpedia_1",
               WQ().triple("v:X","rdf:type", "scm:Band")
               + WQ().triple("v:X", "scm:activeYearsStartYear", "v:Start_Year")
               + WQ().triple("v:X", "scm:activeYearsEndYear", "v:End_Year"))
    + WQ().add_triple("v:X","rdf:type", "scm:Band")
    + WQ().add_triple("v:X", "scm:activeYearsStartYear", "v:Start_Year")
    + WQ().add_triple("v:X", "scm:activeYearsEndYear", "v:End_Year")
)

res = client.query(query_band_obj, "Adding bands")
print(res)

# Adding alias
query_band_obj = WQ().woql_and(
    WQ().using("admin/dbpedia_1",
               WQ().triple("v:X","rdf:type", "scm:Band")
               + WQ().triple("v:X", "scm:alias", "v:alias"))
    + WQ().add_triple("v:X","rdf:type", "scm:Band")
    + WQ().add_triple("v:X", "scm:alias", "v:alias")
)

res = client.query(query_band_obj, "Adding aliases")
print(res)


# Adding bandMember
given_name = "http://xmlns.com/foaf/0.1/givenName"
query_band_obj = WQ().select("v:X","v:BandMember","v:Name").woql_and(
    WQ().using("admin/dbpedia_1",
               WQ().triple("v:X","scm:bandMember", "v:BandMember")
                + WQ().triple("v:BandMember", given_name, "v:Name")
                + WQ().triple("v:BandMember", "scm:birthDate", "v:Date")
                )
    + WQ().add_triple("v:X","scm:bandMember", "v:BandMember")
    + WQ().add_triple("v:BandMember","rdf:type", "scm:MusicalArtist")
    + WQ().add_triple("v:BandMember", given_name, "v:Name")
    + WQ().add_triple("v:BandMember", "scm:birthDate", "v:Date")
)

res = client.query(query_band_obj, "Adding band members")
print(res)

# Adding formerBandMember
given_name = "http://xmlns.com/foaf/0.1/givenName"
query_band_obj = WQ().select("v:X","v:BandMember","v:Name").woql_and(
    WQ().using("admin/dbpedia_1",
               WQ().triple("v:X","scm:formerBandMember", "v:BandMember")
                + WQ().triple("v:BandMember", given_name, "v:Name")
                + WQ().triple("v:BandMember", "scm:birthDate", "v:Date")
                )
    + WQ().add_triple("v:X","scm:formerBandMember", "v:BandMember")
    + WQ().add_triple("v:BandMember","rdf:type", "scm:MusicalArtist")
    + WQ().add_triple("v:BandMember", given_name, "v:Name")
    + WQ().add_triple("v:BandMember", "scm:birthDate", "v:Date")
)

res = client.query(query_band_obj, "Adding former band members")
print(res)
