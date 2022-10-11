# Lesson 1 - Installing, start project and create an empty database with schema

## Installing

You can download the TerminusDB docker image to work locally (recommended to use [Bootstrap here](https://github.com/terminusdb/terminusdb-bootstrap)) or you can connect to TerminusX. If you are using docker image, make sure that your TerminusDB container is running at localhost (https://127.0.0.1). If you are using TerminusX, get the information of the endpoint, team, and API token ready (it should be accessible in the [TerminusX dashboard](https://dashboard.terminusdb.com/) under profile.)

It is recommended to install the TerminusDB Python client (works with [Python >= 3.7](https://www.python.org/downloads)) in a [separate Python environment](https://docs.python.org/3/tutorial/venv.html). For example, if we use `venv` which comes with standard installation of Python 3. First we create new environment:

```
$ python3 -m venv ~/.virtualenvs/terminusdb
$ source ~/.virtualenvs/terminusdb/bin/activate
```

Then we can install using pip:

`$ python3 -m pip install terminusdb-client`

## Start Project

Now make a new directory go to the project directory (or start a new one):

`$ mkdir -p getting_started && cd ../getting_started`

In the project directory start a TerminusDB project:

`$ tdbpy startproject`

You will be prompt with a few questions. Pick a project name (or the database name if you already have a working database) and if you are running the localhost server with default port you can just press Enter. You have to provide the endpoint and other login information if you are using TerminusX or otherwise.

This is what I did:

```
Please enter a project name (this will also be the database name): getting_started
Please enter a endpoint location (press enter to use localhost default) [http://127.0.0.1:6363/]:
config.json and schema.py created, please customize them to start your project.
```

## Create an Empty Database with Schema

Now with `schema.py` you can build a schema for our new database. If you open the `schema.py` you will see an example. You can commit the example as is (with the example schema) but I would make changes to it before I commit so it could be useful to us in the future lessons.

In this tutorial series, we will use a fabricated phone book database of a company as an example. It consists of only 2 tables, the first one is the structure of the company ([Employees.csv](Employees.csv)):

| Employee id | Name           | Title               | Team        | Manager     |
| ----------- | -------------- | ------------------- | ----------- | ----------- |
| 001         | Destiny Norris | Marketing Manager   | Marketing   |             |
| 002         | Darci Prosser  | Creative Writer     | Marketing   | 001         |
| 003         | Alanah Bloggs  | Frontend Developer  | IT          | 004         |
| 004         | Fabian Dalby   | Web Service Manager | IT          |             |

And the other is the contact details of the employees ([Contact.csv](Contact.csv)):

| Employee id | Contact number  | Home address                  | Postcode |
| ----------- | --------------- | ----------------------------- | -------- |
| 001         | (01986) 113367  | 1 Market Place, Bungay        | NR35 1AP |
| 002         | (01925) 682388  | 200 Manchester Road, Woolston | WA1 4HJ  |
| 003         | (01274) 708080  | 139 Otley Road, Shipley       | BD18 2PT |
| 004         | (0161) 532 7302 | 2 Ansdell Road, Stockport     | SK5 6SY  |

The schema that I created will be something like this:

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

To verify the schema is committed, if you are using TerminusX, you can see changes in the dashboard. Since we are using TerminusDB locally (it works with TerminusX as well), we can look at the logs by:

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

Also, you can look at the objects in the schema graph like this:

```
$ tdbpy alldocs --schema
[{'@base': 'terminusdb:///data/', '@documentation': {'@authors': ['Destiny Norris', 'Fabian Dalby'], '@description': 'Database storing all the contact details of all employees in Awesome Startup', '@title': 'Phonebook for Awesome Startup'}, '@schema': 'terminusdb:///schema#', '@type': '@context'}, {'@documentation': {'@comment': 'Home address of Employee', '@properties': {'postcode': 'Postal Code', 'street': 'Street name.', 'street_num': 'Street number.', 'town': 'Town name.'}}, '@id': 'Address', '@key': {'@type': 'Random'}, '@subdocument': [], '@type': 'Class', 'postcode': 'xsd:string', 'street': 'xsd:string', 'street_num': 'xsd:integer', 'town': 'xsd:string'}, {'@documentation': {'@comment': 'Employee of the Company'}, '@id': 'Employee', '@type': 'Class', 'address': 'Address', 'contact_number': 'xsd:string', 'manager': {'@class': 'Employee', '@type': 'Optional'}, 'name': 'xsd:string', 'title': 'xsd:string'}, {'@id': 'Team', '@type': 'Enum', '@value': ['Marketing', 'Information Technology']}]
```

---

[Move on to Lesson 2 - Importing a CSV into the database](lesson_2.md)
