import woqlclient.woqlClient as woql
import json

client = woql.WOQLClient()
server_url ="http://195.201.12.87:6365" 
#"http://localhost:6363"
key = "connectors wanna plans compressed"
dburl = server_url + "/pybike"

client.connect(server_url, key)
client.directCreateDatabase(dburl, "Bike Graph", key)

with open('./createschema.json') as json_file:
	json_data = json.load(json_file)

json_data["@context"]["doc"] = dburl + "/document/"
json_data["@context"]["scm"] = dburl + "/schema#"
json_data["@context"]["db"] = dburl + "/"

save_context = json_data["@context"]

client.directSelect(json_data, dburl, key)

with open('./loaddata.json') as json_file:
	json_data = json.load(json_file)

json_data["@context"] = save_context
client.directSelect(json_data, dburl, key)
