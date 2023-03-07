# Lesson 4 - Update and import new data that links to old data

> **_NOTE:_** from version 10.1.0 the CLI command is `tdbpy` instead of `terminusdb`

Remember our imaginary Awesome Startup that has their Phonebook stored in TerminusDB? It has been a few months and they have a new recruit:

| Employee id | Name           | Title               | Team        | Manager     |
| ----------- | -------------- | ------------------- | ----------- | ----------- |
| 005         | Ethan Abbott   | Backend Developer   | IT          | 004         |

| Employee id | Contact number  | Home address                  | Postcode |
| ----------- | --------------- | ----------------------------- | -------- |
| 005         | 070 7796 8035   | 84 Shore Street, Stoer        | IV27 2TG |

Also, our Marketing Manager Destiny has moved to a new address:

| Employee id | Contact number  | Home address                  | Postcode |
| ----------- | --------------- | ----------------------------- | -------- |
| 001         | (01986) 113367  | 73 Lairg Road, Newbigging     | PH12 3RP |

How are we going to update the records?

## Getting data objects back from TerminusDB/ TerminusCMS

Let's look at how to update Destiny's Address. We will make our changes in the file [update_data.py](update_data.py). The first step after connecting with the client is to get back the schema of the database. In the terminal we can use:

`$ tdbpy sync`

This will update the `schema.py` with the latest schema from TerimnusDB for easy inspection. However, since we want to work with a script we will create a `WOQLSchema` object and sync that object with the database's schema:

```python
data_schema = WOQLSchema()
data_schema.from_db(client)
```

Now we can import the Employee document that represents Destiny. Since we know the id, we will just use get_document to do so:

```python
destiny_raw = client.get_document("Employee/001")
```

`destiny_raw` would be a dictionary, we can update it directly, however, in many cases, converting back to an `Employee` object would make updating it a bit easier:

```python
destiny = data_schema.import_objects(destiny_raw)
```

Notice `import_objects` will also take a list of dictionaries and return back a list of objects.

## Update a document

Now `destiny` is an `Employee` object we can go ahead and update the details:

```python
destiny.address.postcode = "PH12 3RP"
destiny.address.street = "Lairg Road"
destiny.address.street_num = 73
destiny.address.town = "Newbigging"
```

Let's send `destiny` back to the database with `update_document`, the difference between `insert_document` and `update_document` is that if an object already exists `update_docuemnt` with replace the old with the new. It will also insert the document if it does not exist:

```python
client.update_document(destiny, commit_msg="Update Destiny")
```

## Linking a new document to an old document

Now let's work on our new recruit. First we need to get the schema objects. Instead of importing it from `schema.py` like we did in [lesson 3](lesson_3.md), as the objects are already in the `data_schema`, we will get them out from there:

```python
Employee = data_schema.object.get('Employee')
Address = data_schema.object.get('Address')
Team = data_schema.object.get('Team')
```

Next, we know that all the properties of `Employee` are datatypes (e.g. str, int) excpet `address` and `manager`. For `address`, we will create a new object:

```python
ethan_address = Address(
    postcode="IV27 2TG", street="Shore Street", street_num=84, town="Stoer"
)
```

And for the manager, we will get that person from the database just like we did with Destiny:

```python
manager_raw = client.get_document("Employee/004")
ethan_manager = data_schema.import_objects(manager_raw)
```

We can now create `ethan`:

```python
ethan = Employee(
    _id="Employee/005",
    name="Ethan Abbott",
    title="Backend Developer",
    team=Team.it,
    contact_number="070 7796 8035",
    address=ethan_address,
    manager=ethan_manager,
)
```

We're ready, let's put `ethan` into the database. To prove `update_document` works, we will use it to insert `ethan`:

```python
client.update_document(ethan, commit_msg="Adding Ethan")
```

Or if you like, you can update `destiny` and insert `ethan` all at once like this:

```python
client.update_document([destiny, ethan], commit_msg="Update Destiny and adding Ethan")
```

Run the scripts:

`$ python update_data.py`

Check the database is up-to-date in the terminal like we did before:

`$ tdbpy alldocs`

Or if you are using TerminusCMS, check it in the dashboard.

---

[Lesson 5 - Query the database and get results back as a CSV or DataFrame](lesson_5.md)
