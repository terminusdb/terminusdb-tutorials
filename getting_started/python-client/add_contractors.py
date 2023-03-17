from terminusdb_client import Client
from terminusdb_client.woqlschema import WOQLSchema

# For Terminus X, use the following
# client = Client("https://cloud.terminusdb.com/<Your Team>/")
# client.connect(db="demo_workshop", team="<Your Team>", use_token=True)

client = Client("http://127.0.0.1:6363/")
client.connect(db="getting_started", branch="contractors")

data_schema = WOQLSchema()
data_schema.from_db(client)

Employee = data_schema.object.get("Employee")
Address = data_schema.object.get("Address")
Team = data_schema.object.get("Team")

# Contractor 1

rhys_address = Address(
    postcode="DG4 2ZQ", street="Helland Bridge", street_num=1, town="Ulzieside"
)

rhys = Employee(
    _id="Employee/006",
    name="Rhys Arnold",
    title="UX Designer",
    team=Team.it,
    contact_number="078 3951 7569",
    address=rhys_address,
)

# Contractor 2

maya_address = Address(
    postcode="GU3 3AF", street="Tadcaster Rd", street_num=24, town="Pitch Place"
)

maya = Employee(
    _id="Employee/007",
    name="Maya O'Brien",
    title="Creative Content Creator",
    team=Team.marketing,
    contact_number="078 1788 9177",
    address=maya_address,
)

client.update_document([rhys, maya], commit_msg="Adding contractors")
