from terminusdb_client.woqlclient import WOQLClient
from terminusdb_client.woqlquery import WOQLQuery
import json

def create_schema(client):
    """The query which creates the schema
        Parameters - it uses variables rather than the fluent style as an example
        ==========
        client : a WOQLClient() connection

    """
    base = WOQLQuery().doctype("EphemeralEntity").label("Ephemeral Entity").description("An entity that has a lifespan")
    base.property("lifespan_start", "dateTime").label("Existed From")
    base.property("lifespan_end", "dateTime").label("Existed To")

    country = WOQLQuery().add_class("Country").label("Country").description("A nation state").parent("EphemeralEntity")
    country.property("iso_code", "string").label("ISO Code")
    country.property("fip_code", "string").label("FIP Code")

    airline = WOQLQuery().add_class("Airline").label("Airline").description("An operator of airplane flights").parent("EphemeralEntity")
    airline.property("registered_in", "Country").label("Registered In"),

    airport = WOQLQuery().add_class("Airport").label("Airport").description("An airport where flights terminate").parent("EphemeralEntity")
    airport.property("situated_in", "Country").label("Situated In"),

    flight = WOQLQuery().add_class("Flight").label("Flight").description("A flight between airports").parent("EphemeralEntity")
    flight.property("departs", "Airport").label("Departs")
    flight.property("arrives", "Airport").label("Arrives")
    flight .property("operated_by", "Airline").label("Operated By")

    schema = WOQLQuery().when(True).woql_and(base, country, airline, airport, flight)
    return schema.execute(client)

def generateMatchClause(code, type, i):
    """ Bug in python string conversion - have to do it automatically
    """
    match = WOQLQuery().woql_and(
        WOQLQuery().idgen("doc:" + type, [{"@value": code, "@type": "xsd:string"}], "v:ID_"+str(i)),
        WOQLQuery().cast({"@value": code, "@type": "xsd:string"}, "xsd:string", "v:Label_"+ str(i))
    )
    return match

def generateInsertClause(code, type, i):
    insert = WOQLQuery().woql_and(
        WOQLQuery().insert("v:ID_"+str(i), type).label("v:Label_"+str(i))
    )
    return insert

def generateMultiInsertQuery(codes, type):
    matches = []
    inserts = []
    index = 0
    for code in codes:
        matches.append(generateMatchClause(code, type, index))
        inserts.append(generateInsertClause(code, type, index))
        index = index+1
    return WOQLQuery().when(
        WOQLQuery().woql_and(*matches),
        WOQLQuery().woql_and(*inserts)
    )

db_id = "pyplane"
client = WOQLClient(server_url = "http://localhost:6363")
client.connect(key="root", account="admin", user="admin")
existing = client.conCapabilities._get_db_metadata(db_id, client.uid())
if not existing:
    client.create_database(db_id, "admin", { "label": "Dublin Council Graph", "comment": "Create a graph with Open Flights data"})
else:
    client.db(db_id)
create_schema(client)
