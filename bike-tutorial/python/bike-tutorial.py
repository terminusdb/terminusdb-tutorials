import woqlclient.woqlClient as woql
import json

client = woql.WOQLClient()
server_url = "http://localhost:6363"
key = "root"
dburl = server_url + "/mydb"

client.connect(server_url, key)
client.directCreateDatabase(dburl, "Bike Graph", key)

with open('./createschema.json') as json_file:
	json_data = json.load(json_file)

json_data["@context"]["doc"] = myurl + "/document/"
json_data["@context"]["scm"] = myurl + "/schema#"
json_data["@context"]["db"] = myurl + "/"

save_context = json_data["@context"]

client.directSelect(json_data, dburl, key)

with open('./loaddata.json') as json_file:
	json_data = json.load(json_file)

json_data["@context"] = save_context
client.directSelect(json_data, dburl, key)
