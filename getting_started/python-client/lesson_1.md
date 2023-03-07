# Lesson 1 - Install, start a project, and create an empty database with a schema

## Installing

You can download the TerminusDB Docker image to work locally ([TerminusDB Bootstrap](https://github.com/terminusdb/terminusdb-bootstrap)) or you can connect to TerminusCMS. If you are using the Docker image, make sure that your TerminusDB container is running at localhost (https://127.0.0.1). If you are using TerminusCMS, you will need the endpoint, team, and API token available from the [TerminusCMS dashboard](https://dashboard.terminusdb.com/) under profile.

It is recommended that you install the TerminusDB Python client (which works with
[Python >= 3.7](https://www.python.org/downloads)) in a [separate
Python environment](https://docs.python.org/3/tutorial/venv.html). In the example below we use `venv` which comes with the standard installation of
Python 3. 

We create the new environment:

```
$ python3 -m venv ~/.virtualenvs/terminusdb
$ source ~/.virtualenvs/terminusdb/bin/activate
```

Then we can install the TerminusDB Python client using pip:

`$ python3 -m pip install terminusdb-client`

## Start Project

> **_NOTE:_** from version 10.1.0 the CLI command is `tdbpy` instead of `terminusdb`

Go to the project directory (or start a new one):

`$ cd terminusdb-tutorials/getting_started/python_client`

In the project directory, start a TerminusDB project:

`$ tdbpy startproject`

You will be asked a few questions. Pick a project name (or the database name if you already have a working database). If you are running the localhost server with default port you can just press Enter. If you're using TerminusCMS you need to provide the endpoint and other login information.

This is what I did:

```
Please enter a project name (this is also the database name): getting_started
Please enter an endpoint location (press enter to use the localhost default) [http://127.0.0.1:6363/]:
config.json and schema.py created, please customize them to start your project.
```

## Create an Empty Database with Schema

Now with `schema.py` you can build a schema for the new database. If you open the `schema.py` you will see an example. You can commit the example as it is but I want to make changes to it before I commit so it is useful to us in a future lesson.

In this tutorial series, we will use a company phonebook database as an example. It consists of only 2 tables, the first is the structure of the company ([Employees.csv](Employees.csv)):

| Employee id | Name           | Title               | Team        | Manager     |
| ----------- | -------------- | ------------------- | ----------- | ----------- |
| 001         | Destiny Norris | Marketing Manager   | Marketing   |             |
| 002         | Darci Prosser  | Creative Writer     | Marketing   | 001         |
| 003         | Alanah Bloggs  | Frontend Developer  | IT          | 004         |
| 004         | Fabian Dalby   | Web Service Manager | IT          |             |

And the second is the contact details of the employees ([Contact.csv](Contact.csv)):

| Employee id | Contact number  | Home address                  | Postcode |
| ----------- | --------------- | ----------------------------- | -------- |
| 001         | (01986) 113367  | 1 Market Place, Bungay        | NR35 1AP |
| 002         | (01925) 682388  | 200 Manchester Road, Woolston | WA1 4HJ  |
| 003         | (01274) 708080  | 139 Otley Road, Shipley       | BD18 2PT |
| 004         | (0161) 532 7302 | 2 Ansdell Road, Stockport     | SK5 6SY  |

The schema for looks like this:

```python
"""
Title: Phonebook for Awesome Startup
Description: Database storing all the contact details of all employees in Awesome Startup
Authors: Destiny Norris, Fabian Dalby
"""
from typing import Optional

from terminusdb_client.woqlschema import DocumentTemplate, EnumTemplate


class Address(DocumentTemplate):
    """Home address of Employee

    Attributes
    ----------
    postcode : str
        Postal Code
    street : str
        Street name.
    street_num : int
        Street number.
    town : str
        Town name.
    """

    _subdocument = []
    postcode: str
    street: str
    street_num: int
    town: str


class Employee(DocumentTemplate):
    """Employee of the Company"""

    address: "Address"
    contact_number: str
    manager: Optional["Employee"]
    name: str
    team: "Team"
    title: str


class Team(EnumTemplate):
    marketing = ()
    it = ()
```

Now we have the right schema plan, let's commit it to be database:

```
$ tdbpy commit -m "update phonebook schema"
getting_started created.
getting_started schema updated.
```

To verify the schema has been committed we can look at the logs using the example below. If you are using TerminusCMS, you can see the changes in the dashboard:

```
$ tdbpy log
========
Connecting to 'getting_started' at 'http://127.0.0.1:6363/'
on branch 'main'
with team 'admin'
========

commit c3b0nqwl87z92suvpobqtpzr552vzqs
Author: admin
Date: 2021-10-01 11:38:49

    update phonebook schema


```

You can also look at the objects in the schema graph like this:

```
$ tdbpy alldocs --schema
[{'@base': 'terminusdb:///data/', '@documentation': {'@authors': ['Destiny Norris', 'Fabian Dalby'], '@description': 'Database storing all the contact details of all employees in Awesome Startup', '@title': 'Phonebook for Awesome Startup'}, '@schema': 'terminusdb:///schema#', '@type': '@context'}, {'@documentation': {'@comment': 'Home address of Employee', '@properties': {'postcode': 'Postal Code', 'street': 'Street name.', 'street_num': 'Street number.', 'town': 'Town name.'}}, '@id': 'Address', '@key': {'@type': 'Random'}, '@subdocument': [], '@type': 'Class', 'postcode': 'xsd:string', 'street': 'xsd:string', 'street_num': 'xsd:integer', 'town': 'xsd:string'}, {'@documentation': {'@comment': 'Employee of the Company'}, '@id': 'Employee', '@type': 'Class', 'address': 'Address', 'contact_number': 'xsd:string', 'manager': {'@class': 'Employee', '@type': 'Optional'}, 'name': 'xsd:string', 'title': 'xsd:string'}, {'@id': 'Team', '@type': 'Enum', '@value': ['Marketing', 'Information Technology']}]
```

---

[Lesson 2 - Importing a CSV into the database](lesson_2.md)
