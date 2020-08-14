#!/usr/bin/python3

from terminusdb_client.woqlquery.woql_query import WOQLQuery as WQ
from terminusdb_client.woqlclient.woqlClient import WOQLClient

server_url = "https://127.0.0.1:6363"
user = "admin"
account = "admin"
key = "root"
dbid = "Bank_Balance_Example"
repository = "local"
label = "Bank Balance Example"
description = "An example database for playing with bank accounts"

client = WOQLClient(server_url)
client.connect(user=user,account=account,key=key,db=dbid)

