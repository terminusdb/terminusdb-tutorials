from terminusdb_client import Client
from terminusdb_client.woqlschema import WOQLSchema

# For Terminus X, use the following
# client = Client("https://cloud.terminusdb.com/<Your Team>/")
# client.connect(db="demo_workshop", team="<Your Team>", use_token=True)

client = Client("http://127.0.0.1:6363/")
client.connect(db="getting_started")

data_schema = WOQLSchema()
data_schema.from_db(client)

# Update a document

destiny_raw = client.get_document("Employee/001")
destiny = data_schema.import_objects(destiny_raw)

destiny.address.postcode = "PH12 3RP"
destiny.address.street = "Lairg Road"
destiny.address.street_num = 73
destiny.address.town = "Newbigging"

client.update_document(destiny, commit_msg="Update Destiny")

# Linking a new document to an old document

Employee = data_schema.object.get("Employee")
Address = data_schema.object.get("Address")
Team = data_schema.object.get("Team")

ethan_address = Address(
    postcode="IV27 2TG", street="Shore Street", street_num=84, town="Stoer"
)

manager_raw = client.get_document("Employee/004")
ethan_manager = data_schema.import_objects(manager_raw)

ethan = Employee(
    _id="Employee/005",
    name="Ethan Abbott",
    title="Backend Developer",
    team=Team.it,
    contact_number="070 7796 8035",
    address=ethan_address,
    manager=ethan_manager,
)

client.update_document(ethan, commit_msg="Adding Ethan")
