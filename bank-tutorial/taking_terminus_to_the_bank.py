#!/usr/bin/python3

from terminusdb_client.woqlquery.woql_query import WOQLQuery as WQ
from terminusdb_client.woqlclient.woqlClient import WOQLClient

server_url = "https://127.0.0.1:6363"
user = "admin"
account = "admin"
key = "root"
dbid = "bank_balance_example"
repository = "local"
label = "Bank Balance Example"
description = "An example database for playing with bank accounts"

client = WOQLClient(server_url)
client.connect(user=user,account=account,key=key,db=dbid)

# Uncomment this to delete your old database first
# client.delete_database(dbid)

# Create the database
try:
    client.create_database(dbid,user,label=label, description=description)
except Exception as E:
    error_obj = E.error_obj
    if "api:DatabaseAlreadyExists" == error_obj.get("api:error",{}).get("@type",None):
        print(f'Warning: Database "{dbid}" already exists!\n')
    else:
        raise(E)

# Add the schema (there is no harm in adding repeatedly as it is idempotent)
WQ().woql_and(
    WQ().doctype("scm:BankAccount")
        .label("Bank Account")
        .description("A bank account")
        .property("scm:owner", "xsd:string")
            .label("owner")
            .cardinality(1)
        .property("scm:balance","xsd:nonNegativeInteger")
            .label("owner")
).execute(client, "Adding bank account object to schema")

# Fix bug in schema
WQ().woql_and(
    WQ().delete_quad("scm:balance", "label", "owner", "schema/main"),
    WQ().add_quad("scm:balance", "label", "balance", "schema/main")
).execute(client, "Label for balance was wrong")

# Add the data from csv to the main branch (again idempotent as widget ids are chosen from sku)
WQ().woql_and(
    WQ().insert("doc:mike", "scm:BankAccount")
        .property("scm:owner", "mike")
        .property("scm:balance", 123)
).execute(client, "Add mike")

# try to make mike go below zero
balance, new_balance = WQ().vars("Balance", "New Balance")
try:
    WQ().woql_and(
        WQ().triple("doc:mike", "scm:balance", balance),
        WQ().delete_triple("doc:mike", "scm:balance", balance),
        WQ().eval(WQ().minus(balance, 130), new_balance),
        WQ().add_triple("doc:mike", "scm:balance", new_balance)
    ).execute(client, "Update mike")
except Exception as E:
    error_obj = E.error_obj
    print(f'Witness of failure for mike: {error_obj}')

# Subtract less
WQ().woql_and(
    WQ().triple("doc:mike", "scm:balance", balance),
    WQ().delete_triple("doc:mike", "scm:balance", balance),
    WQ().eval(WQ().minus(balance, 110), new_balance),
    WQ().add_triple("doc:mike", "scm:balance", new_balance)
).execute(client, "Update mike")

# Make the "branch_office" branch
branch = "branch_office"
try:
    client.branch(branch)
except Exception as E:
    error_obj = E.error_obj
    if "api:BranchExistsError" == error_obj.get("api:error",{}).get("@type",None):
        print(f'Warning: Branch "{branch}" already exists!\n')
    else:
        raise(E)

# Add some data to the branch
client.checkout(branch)
WQ().woql_and(
  WQ().insert("doc:jim", "scm:BankAccount")
      .property("owner", "jim")
      .property("balance", 8)
).execute(client,"Adding Jim")


# Return to the 'main' branch and add Jane
client.checkout('main')
WQ().woql_and(
  WQ().insert("doc:jane", "scm:BankAccount")
      .property("owner", "jim")
      .property("balance", 887)
).execute(client,"Adding Jane")

try:
    client.rebase({"rebase_from": f'{user}/{dbid}/{repository}/branch/{branch}',
                   "author": user,
                   "message": "Merging jim in from branch_office"})
except Exception as E:
    error_obj = E.errorObj
    print(f'{error_obj}\n')
