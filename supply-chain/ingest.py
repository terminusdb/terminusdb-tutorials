#!/usr/bin/env python3
from terminusdb_client import Client
# import re
# import csv
# import json
# import math
# import os
import urllib.parse
import openpyxl
import itertools

team = "admin" # os.environ['TERMINUSDB_TEAM']
team_quoted = urllib.parse.quote(team)

#client = Client(f"https://cloud.terminusdb.com/{team_quoted}/")
client = Client("http://127.0.0.1:6363")
# make sure you have put the token in environment variable
# https://terminusdb.com/docs/terminuscms/get-started
client.connect(team=team)
dbid = "supply_chain"
label = "Supply Chain"
description = "A knowledge graph of supply chain information."
prefixes = {'@base' : 'http://lib.terminusdb.com/SupplyChain/',
            '@schema' : 'http://lib.terminusdb.com/SupplyChain#'}


# Give the location of the file
path = "data/SupplyChainLogisticsProblem.xlsx"

# To open the workbook
# workbook object is created
wb_obj = openpyxl.load_workbook(path)

type_map = {
    's' : 'xsd:string',
    'd' : 'xsd:dateTime',
    'n' : 'xsd:decimal'
}

object_types = ['']
objects = []
for sheet_name in wb_obj.sheetnames:
    object_type = sheet_name
    property_types = []
    # Collect header
    for i in itertools.count(start=1):
        property_type = sheet_obj.cell(row = 1, column = i).value
        if property_type == None:
            break
        else:
            property_types.append(property_type)
    print(property_types)
    for i, property_type in enumerate(property_types, 1):
        obj = { '@type' : property_type }
        for j in itertools.count(start=2):
            print(f"{i} {j}")
            value_cell = sheet_obj.cell(row = j, column = i)
            dt = value_cell.data_type
            value = value_cell.value
            print(f"{object_type}.{property_type}: {value}:{dt}")
            if value == None:
                break
            else:
                pass
        objects.append(obj)
