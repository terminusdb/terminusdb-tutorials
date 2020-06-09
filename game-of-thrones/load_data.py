from woqlclient import WOQLClient, WOQLQuery
import json

server_url="http://localhost:6363"
key="root"
db_id="game_of_thrones"

with open('houses.json') as json_file:
    houses = json.load(json_file)

print(len(houses))
print(houses[:3])
