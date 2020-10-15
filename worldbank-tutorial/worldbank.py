#!/usr/bin/python3

import os
import sys
import time
import math

from terminusdb_client import WOQLClient
from terminusdb_client import WOQLQuery as WQ


# openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout localhost.key -out localhost.crt
server_url = "https://127.0.0.1:6363"
db = "worldbank_ireland"
db_label = "WorldBank Ireland"
db_comment = "Data from the WorldBank on Ireland"
user = "admin"
account = "admin"
key = "root"

client = WOQLClient(server_url, insecure=True)
client.connect(user=user, account=account, key=key, db=db, insecure=True)

try:
    client.delete_database(db)
except Exception as E:
    print(E)

client.create_database(db,account,label=db_label,
                       description=db_comment,
                       include_schema=False)

# Append
client.insert_csv(['WorldBank_Ireland.csv'], "Adding WorldBank data for Ireland")

client.get_csv('WorldBank_Ireland.csv', csv_directory='./output/')
