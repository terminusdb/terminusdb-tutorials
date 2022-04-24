import pprint as pp

from terminusdb_client import WOQLClient
from terminusdb_client import WOQLQuery as wq

client = WOQLClient("http://127.0.0.1:6363/")
client.connect(db="getting_started")

### Uncomment to see all triples ##
# pp.pprint(wq().star().execute(client))

darci = wq().string("Darci Prosser")

query = wq().triple("v:person", "@schema:name", darci) + wq().triple(
    "v:person", "@schema:contact_number", "v:phone_num"
)

result = query.execute(client)

if result["bindings"]:
    print("Darci's contact number:")
    print(result["bindings"][0]["phone_num"]["@value"])
else:
    print("Cannot find result.")

print("=== Darci is on holiday ===")

query = (
    wq().triple("v:person", "@schema:name", darci)
    + wq().triple("v:person", "@schema:manager", "v:manager")
    + wq().triple("v:manager", "@schema:contact_number", "v:phone_num")
    + wq().triple("v:manager", "@schema:name", "v:manager_name")
)

result = query.execute(client)

if result["bindings"]:
    print("Manager's name:")
    print(result["bindings"][0]["manager_name"]["@value"])
    print("Manager's contact number:")
    print(result["bindings"][0]["phone_num"]["@value"])
else:
    print("Cannot find result.")
