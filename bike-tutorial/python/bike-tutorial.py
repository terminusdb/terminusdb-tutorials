import woqlclient.woqlClient as woql
import json

client = woql.WOQLClient()
myurl = "http://195.201.12.87:6365/mypythondb667"

client.connect("http://195.201.12.87:6365",'connectors wanna plans compressed')

client.directCreateDatabase(myurl, "Python Test", 'connectors wanna plans compressed')

with open('./createschema.json') as json_file:
	json_data = json.load(json_file)

json_data["@context"]["doc"] = myurl + "/document/"
json_data["@context"]["scm"] = myurl + "/schema#"
json_data["@context"]["db"] = myurl + "/"

save_context = json_data["@context"]

client.directSelect(json_data, myurl, 'connectors wanna plans compressed')

with open('./loaddata.json') as json_file:
	json_data = json.load(json_file)

json_data["@context"] = save_context
client.directSelect(json_data, myurl, 'connectors wanna plans compressed')
