#!/usr/bin/python3

from terminusdb_client.woqlquery.woql_query import WOQLQuery as WQ
from terminusdb_client.woqlclient.woqlClient import WOQLClient

server_url = "https://127.0.0.1:6363"
user = "admin"
account = "admin"
key = "root"
dbid = "unwarbled_widgets"
repository = "local"
label = "Unwarbled Widgets"
description = "The database for storage of the unwarbled widgets"
result_csv = '/app/local_files/unwarbled_widgets.csv'
widgets_url = 'http://terminusdb.github.io/terminusdb-web-assets/tutorials/episode_1/items.csv'

client = WOQLClient(server_url)
client.connect(user=user,account=account,key=key,db=dbid)

try:
    client.create_database(dbid,user,label=label, description=description)
except Exception as E:
    error_obj = E.errorObj
    if "api:DatabaseAlreadyExists" == error_obj.get("api:error",{}).get("@type",None):
        print(f'Warning: Database "{dbid}" already exists!\n')
    else:
        raise(E)

# Add the schema (there is no harm in adding repeatedly as it is idempotent)
WQ().woql_and(
    WQ().doctype("scm:Widget")
        .label("Widget")
        .description("A widget")
        .property("sku", "xsd:string")
            .label("sku")
            .cardinality(1)
        .property("date_added","xsd:dateTime")
            .label("date_added")
        .property("category","xsd:string")
            .label("category")
).execute(client, "Adding schema")

# Make the production branch
production = "production"
try:
    client.branch(production)
except Exception as E:
    error_obj = E.errorObj
    if "api:BranchExistsError" == error_obj.get("api:error",{}).get("@type",None):
        print(f'Warning: Branch "{production}" already exists!\n')
    else:
        raise(E)

# Return to the 'main' branch
client.checkout('main')


# Add the data from csv to the main branch (again idempotent as widget ids are chosen from sku)
sku, date, category, widget_ID = WQ().vars('Sku','Date','Category', 'Widget_ID')
WQ().woql_and(
    WQ().get(
        WQ().woql_as('sku', sku)
            .woql_as('date_added', date, "xsd:dateTime")
            .woql_as('category', category),
        WQ().remote(widgets_url)),
    WQ().idgen("doc:Widget",[sku],widget_ID),
    WQ().insert(widget_ID, "scm:Widget")
    .property("sku", sku)
    .property("date_added", date)
    .property("category", category)
).execute(client, "Insert from CSV")

# Move widgets data from main to production
WQ().woql_and(
    WQ().node(widget_ID,"Widget")
    .property("sku", sku)
    .property("date_added", date)
    .property("category", category),
    WQ().eq(date, WQ().literal('1970-01-01T00:00:00','xsd:dateTime')),
    WQ().eq(category, 'widgets'),
    WQ().using(
        f'{account}/{dbid}/{repository}/branch/{production}',
        WQ().woql_and(
            WQ().insert(widget_ID, "scm:Widget")
            .property("sku",sku)
            .property("date_added", date)
            .property("category", category)
        )
    )
).execute(client, "Add to production branch")

