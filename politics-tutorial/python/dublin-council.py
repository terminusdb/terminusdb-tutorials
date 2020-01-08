import woqlclient.woqlClient as woql
from woqlclient import WOQLQuery
import json

CSVS = {"OverallSimilarity" : "https://terminusdb.com/t/data/council/weighted_similarity.csv"}

server_url = "http://localhost:6363"
dbId= "mydb"
key = "root"
dburl = server_url + "/mydb"

def create_schema(client):
    """The query which creates the schema
        Parameters
        ==========
        client : a WOQLClient() connection
    """
    schema = WOQLQuery().when(True).woql_and(
        WOQLQuery().add_class("scm:Party"),
        WOQLQuery().add_quad("scm:Party", "rdfs:label", "Party", "db:schema"),
        WOQLQuery().add_quad("scm:Party", "rdfs:subClassOf", "tcs:Document", "db:schema"),
        WOQLQuery().add_quad("scm:Party", "rdfs:comment", "Political Party", "db:schema"),
        WOQLQuery().add_quad("scm:Representative", "rdf:type", "owl:Class", "db:schema"),
        WOQLQuery().add_quad("scm:Representative", "rdfs:label", {"@value": "Representative", "@language": "en"}, "db:schema"),
        WOQLQuery().add_quad("scm:Representative", "rdfs:comment", {"@value": "An elected member of the US congress", "@type": "xsd:string"}, "db:schema"),
        WOQLQuery().add_property("member_of", "Party"),
        WOQLQuery().add_quad("scm:member_of", "rdfs:label", {"@value": "Member of", "@type": "xsd:string"}, "db:schema"),
        WOQLQuery().add_quad("scm:member_of","rdfs:domain", "scm:Representative", "db:schema"),
        WOQLQuery().add_class("Similarity"),
        WOQLQuery().add_quad("scm:Similarity", "rdfs:label", {"@value": "Similarity", "@type": "xsd:string"}, "db:schema"),
        WOQLQuery().add_property("similarity", "decimal"),
        WOQLQuery().add_quad("scm:similarity", "label", {"@value": "Similarity", "@type": "xsd:string"}, "db:schema"),
        WOQLQuery().add_quad("scm:similarity", "rdfs:domain", "scm:Similarity", "db:schema"),
        WOQLQuery().add_property("similar_to", "scm:Representative"),
        WOQLQuery().add_quad("scm:similar_to", "rdfs:domain", "scm:Similarity", "db:schema"),
        WOQLQuery().add_quad("scm:similarity", "label", {"@value": "Similar To", "@type": "xsd:string"}, "db:schema"),
        WOQLQuery().add_quad("scm:similarity", "rdfs:domain","scm:Similarity", "db:schema"),
        WOQLQuery().add_class("ArmedForcesSimilarity").label("Armed Forces").parent("Similarity"),
        WOQLQuery().add_class("CivilRightsSimilarity").label("Civil Rights").parent("Similarity"),
        WOQLQuery().add_class("HealthSimilarity").label("Health").parent("Similarity"),
        WOQLQuery().add_class("ImmigrationSimilarity").label("Immigration").parent("Similarity"),
        WOQLQuery().add_class("InternationalAffairsSimilarity").\
                    label("International Affairs").parent("Similarity"),
        WOQLQuery().add_class("TaxationSimilarity").label("Taxation").parent("Similarity"),
        WOQLQuery().add_class("OverallSimilarity").label("Overall").parent("Similarity")
        )
    return schema.execute(client)

def get_inserts(relation):
    inserts = WOQLQuery().woql_and(
        WOQLQuery().add_triple("v:Party_A_ID","type","scm:Party"),  
        WOQLQuery().add_triple("v:Party_A_ID","label","v:Party_A"),
        WOQLQuery().add_triple("v:Party_B_ID","type","scm:Party"),
        WOQLQuery().add_triple("v:Party_B_ID","label","v:Party_B"),
        WOQLQuery().add_triple("v:Rep_A_ID","type","scm:Representative"),
        WOQLQuery().add_triple("v:Rep_A_ID","label","v:Rep_A"),
        WOQLQuery().add_triple("v:Rep_A_ID","member_of","v:Party_A_ID"),
        WOQLQuery().add_triple("v:Rep_B_ID","type","scm:Representative"),
        WOQLQuery().add_triple("v:Rep_B_ID","label","v:Rep_B"),
        WOQLQuery().add_triple("v:Rep_B_ID","member_of","v:Party_B_ID"),
        WOQLQuery().add_triple("v:Rel_ID","type","scm:Similarity"),
        WOQLQuery().add_triple("v:Rel_ID","label",{"@value": "Similarity", "@type": "xsd:string"}),
        WOQLQuery().add_triple("v:Rel_ID","similar_to","v:Rep_A_ID"),
        WOQLQuery().add_triple("v:Rel_ID","similar_to","v:Rep_B_ID"),
        WOQLQuery().add_triple("v:Rel_ID","similarity","v:Similarity")
    )  
    '''inserts = WOQLQuery().woql_and(
        WOQLQuery().insert("v:Party_A_ID", "Party").label("v:Party_A"),
        WOQLQuery().insert("v:Party_B_ID", "Party").label("v:Party_B"),
        WOQLQuery().insert("v:Rep_A_ID", "Representative").label("v:Rep_A").\
                    property("member_of", "v:Party_A_ID"),
        WOQLQuery().insert("v:Rep_B_ID", "Representative").label("v:Rep_B").\
                    property("member_of", "v:Party_B_ID"),
        WOQLQuery().insert("v:Rel_ID", "Similarity").label("v:Rel_Label").\
                    property("similar_to", "v:Rep_A_ID").\
                    property("similar_to", "v:Rep_B_ID").\
                    property("similarity", "v:Similarity")
      )'''
    return inserts

def get_csv_variables(url):
    """Extracting the data from a CSV and binding it to variables
       Parameters
       ==========
       client : a WOQLClient() connection
       url : string, the URL of the CSV
       """
    csv = WOQLQuery().get(
        WOQLQuery().woql_as("councillor_a","v:Rep_A").\
                    woql_as("councillor_b", "v:Rep_B").\
                    woql_as("party_a", "v:Party_A").\
                    woql_as("party_b", "v:Party_B").\
                    woql_as("distance", "v:Distance")
        ).remote(url)
    return csv

def get_wrangles(relation):
    wrangles = [
         WOQLQuery().idgen("doc:Party", ["v:Party_A"], "v:Party_A_ID"),
         WOQLQuery().idgen("doc:Party", ["v:Party_B"], "v:Party_B_ID"),
         WOQLQuery().idgen("doc:Representative", ["v:Rep_A"], "v:Rep_A_ID"),
         WOQLQuery().idgen("doc:Representative", ["v:Rep_B"], "v:Rep_B_ID"),
         WOQLQuery().typecast("v:Distance", "xsd:decimal", "v:Similarity"),
         WOQLQuery().idgen("doc:Similarity", ["v:Rep_A", "v:Rep_B"], "v:Rel_ID")
    ]
    return wrangles

def load_csvs(client, csvs):
    """Load the CSVs as input
       Parameters
       ==========
       client : a WOQLClient() connection
       csvs : a dict of all csvs to be input
    """
    for key, url in csvs.items():
        csv = get_csv_variables(url)
        wrangles = get_wrangles(key)
        inputs = WOQLQuery().woql_and(csv, *wrangles)
        inserts = get_inserts(key)
        answer = WOQLQuery().when(inputs, inserts)
        #print(json.dumps(answer.json()))
        answer.execute(client)

# run tutorial
client = woql.WOQLClient()
client.connect(server_url, key)
client.createDatabase(dbId, "Politics Graph")
create_schema(client)
load_csvs(client, CSVS)
