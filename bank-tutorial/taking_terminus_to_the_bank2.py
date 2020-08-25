#!/usr/bin/python3
from terminusdb_client import WOQLClient
from terminusdb_client import WOQLQuery as WQ

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

