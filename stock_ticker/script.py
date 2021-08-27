#!/usr/bin/python3
from terminusdb_client import WOQLClient
from terminusdb_client import WOQLQuery as WQ
import csv

#key = "Your Key Here"
#team = "ubf40420team"
#endpoint = f"https://cloud-dev.dcm.ist/{team}/"

# TerminusDB
endpoint = "http://127.0.0.1:6363/"
user = 'admin'
team = "admin"
db = "sed"
key = 'root'

# TerminusX
#client = WOQLClient(endpoint)
#client.connect(account=team,jwt_token=key)
# TerminusDB
client = WOQLClient(endpoint)
client.connect(account=team,user=user,key=key)

exists = client.get_database(db)

if not exists:
    client.create_database(db,
                           team,
                           "Stock Exchange Data",
                           "Data from various Stock Exchanges",
                           { '@base' : "terminusdb:///stock_exchange/",
                             '@schema' : "terminusdb:///stock_exchange/schema#" },
                           True)
    schema = [
        { '@type' : 'Class',
          '@id' : 'StockExchangeTicker',
          '@key' : { '@type' : 'ValueHash' },
          'index' : 'xsd:string',
          'date' : 'xsd:date',
          'open' : 'xsd:decimal',
          'high' : 'xsd:decimal',
          'low' : 'xsd:decimal',
          'close' : 'xsd:decimal',
          'adjusted_close' : 'xsd:decimal',
          'volume' : 'xsd:decimal'
         }
    ]
    client.insert_document(schema,
                           graph_type="schema",
                           commit_msg = "Adding initial schema")

else:
    # TerminusX
    #client.connect(account=team,db=db,jwt_token=key)
    client.connect(account=team,db=db,user=user,key=key)

def load_file(f):
    with open(f, newline='') as csvfile:
        # extract header...
        next(csvfile)
        ticker_rows = csv.reader(csvfile, delimiter=',')
        chunk_size = 1000
        objects = []
        chunk = 0
        for row in ticker_rows:
            index,date,open_val,high,low,close,adj,volume = row
            if (index == 'null' or
                date == 'null' or
                open_val == 'null' or
                high == 'null' or
                low == 'null' or
                close == 'null' or
                adj == 'null' or
                volume == 'null'):
                pass
            else:
                obj = { '@type' : 'StockExchangeTicker',
                        'index' : index,
                        'date' : date,
                        'open' : open_val,
                        'high' : high,
                        'low' : low,
                        'close' : close,
                        'adjusted_close' : adj,
                        'volume' : volume }
                if len(objects) >= chunk_size:
                    print(f"Running chunk {chunk}")
                    client.insert_document(objects,commit_msg = f"Inserting stock exchange ticker chunk {chunk}")
                    objects = []
                    chunk+=1
                else:
                    objects.append(obj)

        if not (objects == []):
            client.insert_document(objects,commit_msg = "Adding initial schema")

load_file('indexData.csv')

branch = "second"
client.create_branch(branch)
client.branch = branch

load_file('other.csv')

print("About to rebase")
client.branch = "main"
client.rebase(f"{team}/{db}/local/branch/second")
print("About to query")

client.optimize(f"{team}/{db}")
documents = client.query_document({'@type' : 'StockExchangeTicker',
                                   'date' : '2021-07-01'})

print(list(documents))
