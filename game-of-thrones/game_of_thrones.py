from terminusdb_client.woqlquery import WOQLQuery
from terminusdb_client.woqlclient import WOQLClient
import json

server_url="http://localhost:6363"
key="root"
db_id="game_of_thrones"

with open('houses.json') as json_file:
    houses = json.load(json_file)

with open('characters.json') as json_file:
    characters = json.load(json_file)

def create_schema(client):
    region = WOQLQuery().doctype("Region").label("Region")
    seat = WOQLQuery().doctype("Seats").label("Seats")
    house = WOQLQuery().doctype("House").label("House").\
            property("founder", "Person").\
            property("words",  "string").\
            property("region", "Region").\
            property("heir", "Person").\
            property("overlord", "Person").\
            property("seats", "Seats")
    person = WOQLQuery().doctype("Person").label("Person").\
    property("gender", "string").\
    property("father", "Person").\
    property("mother", "Person").\
    property("aliases", "string").\
    property("spouse", "Person").\
    property("children", "Person")

    return WOQLQuery().when(True).woql_and(region, seat, house, person).execute(client)

def load_data(client, houses, characters):
    results = []

    for ppl in characters:
        ppl_obj = WOQLQuery().insert("Person_"+str(ppl["Id"]), "Person")
        if len(ppl["Name"]) == 0:
            ppl_obj.label("Unknown")
        else:
            ppl_obj.label(ppl["Name"])
        if ppl["IsFemale"]:
            ppl_obj.property("gender", {"@value" : "Female", "@type" : "xsd:string"})
        else:
            ppl_obj.property("gender", {"@value" : "Male", "@type" : "xsd:string"})
        if ppl["Father"] is not None:
            ppl_obj.property("father", "doc:Person_"+str(ppl["Father"]))
        if ppl["Mother"] is not None:
            ppl_obj.property("mother", "doc:Person_"+str(ppl["Mother"]))
        if ppl["Spouse"] is not None:
            ppl_obj.property("spouse", "doc:Person_"+str(ppl["Spouse"]))
        for child in ppl["Children"]:
            ppl_obj.property("children", "doc:Person_"+str(child))
        for alias in ppl["Aliases"]:
            ppl_obj.property("aliases", {"@value" : alias, "@type" : "xsd:string"})
        results.append(ppl_obj)

    for hus in houses:
        if hus["Region"] is not None:
            results.append(WOQLQuery().insert("Region_"+hus["Region"], "Region").label(hus["Region"]))
        for seat in hus["Seats"]:
            results.append(WOQLQuery().insert("Seats_"+seat, "Seats").label(seat))

        hus_obj = WOQLQuery().insert("hus"+str(hus["Id"]), "House").label(hus["Name"])
        if hus["Region"] is not None:
            hus_obj.property("region", "doc:Region_"+hus["Region"])
        for seat in hus["Seats"]:
            hus_obj.property("seats", "doc:Seats_"+seat)
        if hus["Founder"] is not None:
            hus_obj.property("founder", "doc:Person_"+str(hus["Founder"]))
        if hus["Words"] is not None:
            data_obj = {"@value" : hus["Words"], "@type" : "xsd:string"}
            hus_obj.property("words", data_obj)
        if hus["Heir"] is not None:
            hus_obj.property("heir", "doc:Person_"+str(hus["Heir"]))
        if hus["Overlord"] is not None:
            hus_obj.property("overlord", "doc:Person_"+str(hus["Overlord"]))
        results.append(hus_obj)


    return WOQLQuery().when(True).woql_and(*results).execute(client)

db_id = "game_of_thrones"
client = woql.WOQLClient(server_url = "http://localhost:6363")
client.connect(key="root", account="admin", user="admin")
existing = client.conCapabilities._get_db_metadata(db_id, client.uid())
if not existing:
    client.create_database(db_id, "admin", { "label": "Dublin Council Graph", "comment": "Create a graph with Game of Thrones data"})
else:
    client.db(db_id)
create_schema(client)
load_data(client, houses, characters)
