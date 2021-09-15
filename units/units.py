#!/usr/bin/python3
from terminusdb_client import WOQLClient
import json
import re
import csv

team = "TerminatorsX"
client = WOQLClient("https://cloud.terminusdb.com/TerminatorsX/")
# make sure you have put the token in environment variable
# https://docs.terminusdb.com/beta/#/terminusx/get-your-api-key
client.connect(team=team, use_token=True)

dbid = "units"
label = "Units"
description = "Units data product for dimensional analysis."
prefixes = {'@base' : 'http://lib.terminusdb.com/units/',
            '@schema' : 'http://lib.terminusdb.com/units#'}

try:
    client.delete_database(dbid, team=team, force=True)
except Exception as E:
    print(E.error_obj)


def import_units(client):

    # Opening JSON file
    schema = open('unit_schema.json',)
    instance = open('units.json',)

    schema_objects = json.load(schema)

    instance_objects = json.load(instance)

    try:
        results = client.insert_document(schema_objects,
                                         graph_type="schema")
        print(f"success on classes! {results}")
        results = client.insert_document(instance_objects)
        print(f"success on instance! {results}")
    except Exception as E:
        print(E)
        print(E.error_obj)

if __name__ == "__main__":

    exists = client.get_database(dbid)

    if not exists:
        client.create_database(dbid,
                               team,
                               label=label,
                               description=description,
                               prefixes=prefixes)
    else:
        pass

    import_units(client)
