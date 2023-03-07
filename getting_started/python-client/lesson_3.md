# Lesson 3 - Importing data form Python script

> **_NOTE:_** from version 10.1.0 the cli command is `tdbpy` instead of `terminusdb`

In last lesson, we have import the [Employees.csv](Employees.csv) with the `tdbpy` commmand. It auto generate the schema for you and pipe in the data form the CSV. Let's check the [schema.py](schema.py), you can see the schema that is generate from the CSV:

```python
class EmployeesFromCSV(DocumentTemplate):
    employee_id: str
    manager: Optional["EmployeesFromCSV"]
    name: Optional[str]
    team: Optional[str]
    title: Optional[str]
```

It is not the same as the one we have planned in [Lesson 1](lesson_1.md):

```python
class Employee(DocumentTemplate):
    """Employee of the Company"""

    address: "Address"
    contact_number: str
    manager: Optional["Employee"]
    name: str
    team: "Team"
    title: str
```

because we have some data in the [Contact.csv](Contact.csv). Fetching data from different CSVs and combining them according to our schema requires more customization and it can be done by creating a Python script with the [TerminusDB Python Client](https://github.com/terminusdb/terminusdb-client-python).

## Creating the Python script

Let's start a new `.py` file [insert_data.py](insert_data.py). You can copy and paste the one we have in this repo or build one yourself. We will explain the one we have so you have an idea what it does.

In the first half of the script, we have to manage and import the data form CSV. In Python there is the [`csv` standard library](https://docs.python.org/3/library/csv.html) where can aid reading of CSV files. Go ahead and import that:

```python
import csv
```

Also we need to import `WOQLClient` which is the client that communitcate with the TerminusDB/ TerminusCMS and `schema.py`:

```python
from terminusdb_client import WOQLClient
from schema import *
```

At the top of the script, we prepare a few empty dictionaries to hold the data, we use dictionaries cause the keys can be the `Employees id` for easy mapping:

```python
employees = {}
contact_numbers = {}
addresses = {}
managers = {}
```

The goal is to populate the `employees` dictionaries with the `Employee` objects. To help, we also need `contact_numbers` to hold the contact numbers while reading the `Contact.csv`. The rest of the information in `Contact.csv` will be used to construct `Address` objects and stored in `addresses`. `managers` is used to store the employee id in the `Manager` column in the `Employees.csv`. We store the id at first and make the linking later cause the manager of that employee may have not been "created" yet.

Then we go head and read the CSVs and do the corresponding data managing:

```python
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
            team=team
        )
        managers[row[0]] = row[4]
```

Last, we have to make the manager links:

```python
for emp_id, man_id in managers.items():
    if man_id:
        employees[emp_id].manager = employees[man_id]
```

Now, the `employees` dictionary should be populated with the `Employee` objects that is ready to be insert into the database.

## Using the Python client

The next step is the insert all `Employees` into the database. But before, we need to create a client with our endpoint:

```python
client = WOQLClient("http://127.0.0.1:6363/")
```

Then we will connect the client to our database. If you are connecting locally and use default setting, just provide the database you are connecting to:

```python
client.connect(db="getting_started")
```

If you are using TerminusCMS, you can find the information of your endpoint, team, and API token from the [TerminusCMS dashboard](https://dashboard.terminusdb.com/) under profile.

Now we are all ready, the last thing to do is to insert the documents:

```python
client.insert_document(list(employees.values()), commit_msg="Adding 4 Employees")
```

## Running the script

Do back to our terminal, we can run the script. Make sure you are in a Python environment that has `terminusdb-client` installed.

```
$ python insert_data.py
```

To check if the data is insert correctly, we can use the `tdbpy alldocs` command again:

```
$ tdbpy alldocs --type Employee
```

Or if the data is on TerminusCMS, you can check it in the [TerminusCMS dashboard](https://dashboard.terminusdb.com/)

---

[Move on to Lesson 4 - Update and import new data that links to old data](lesson_4.md)
