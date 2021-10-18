from terminusdb_client import WOQLClient
from terminusdb_client.woqlschema import WOQLSchema
from terminusdb_client.woqldataframe import result_to_df

# For Terminus X, use the following
# client = WOQLClient("https://cloud.terminusdb.com/<Your Team>/")
# client.connect(db="demo_workshop", team="<Your Team>", use_token=True)

client = WOQLClient("http://127.0.0.1:6363/")
client.connect(db="getting_started")

team_it_raw = client.query_document({"@type": "Employee", "team": "it"})
team_marketing_raw = client.query_document({"@type": "Employee", "team": "marketing"})

team_it = result_to_df(team_it_raw)
team_marketing = result_to_df(team_marketing_raw)

team_it_avg = team_it["name"].apply(len).sum() / len(team_it)
team_marketing_avg = team_it["name"].apply(len).sum() / len(team_marketing)

print(f"Average name length of IT team is {team_it_avg}")
print(f"Average name length of Marketing team is {team_marketing_avg}")
