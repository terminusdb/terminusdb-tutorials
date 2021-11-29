import csv

from schema import Address, Employee, Team
from terminusdb_client import WOQLClient

# we keep all the information in dictionaries with Employee id as keys
employees = {}
contact_numbers = {}
addresses = {}
managers = {}

with open("Contact.csv") as file:
    csv_file = csv.reader(file)
    next(csv_file)  # skiping header
    for row in csv_file:
        contact_numbers[row[0]] = row[1]
        street = row[2].split(",")[0]
        street_num = int(street.split(" ")[0])
        street_name = " ".join(street.split(" ")[1:])
        town = row[2].split(",")[1]
        addresses[row[0]] = Address(
            street_num=street_num, street=street_name, town=town, postcode=row[3]
        )

with open("Employees.csv") as file:
    csv_file = csv.reader(file)
    next(csv_file)  # skiping header
    for row in csv_file:
        team = eval(f"Team.{row[3].lower()}")
        employees[row[0]] = Employee(
            _id="Employee/" + row[0],
            name=row[1],
            title=row[2],
            address=addresses[row[0]],
            contact_number=contact_numbers[row[0]],
            team = team
        )
        managers[row[0]] = row[4]

for emp_id, man_id in managers.items():
    if man_id:
        employees[emp_id].manager = employees[man_id]

# For Terminus X, use the following
# client = WOQLClient("https://cloud.terminusdb.com/<Your Team>/")
# client.connect(db="demo_workshop", team="<Your Team>", use_token=True)

client = WOQLClient("http://127.0.0.1:6363/")
client.connect(db="getting_started")

client.insert_document(list(employees.values()), commit_msg="Adding 4 Employees")
