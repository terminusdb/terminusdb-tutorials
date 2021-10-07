# Lesson 4 - Update and import new data that links to old data

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

## Getting data objects back from TerminusDB/ TerminusX

Let's look at how to update Destiny's Address. We did it with the [update_data.py](update_data.py). The first step after connecting with the client is to get back the schema of the database. In the terminal we can use:

`$ terminusdb sync`

To update the `schema.py` for easy inspection. However, since we have to do it in the script and import the documents, we will create a `WOQLSchema` object and sync up that object with the database's schema:

```python
data_schema = WOQLSchema()
data_schema.from_db(client)
```

Now we can import the Employee document that represent Destiny. Since we know the id, we will just use get_document to do so:

```python
destiny_raw = client.get_document("Employee/001")
```

`destiny_raw` would be a dictionary, we can update it directly, however, is many cases, converting back to a `Employee` object would make updating it a bit easier:

```python
destiny = data_schema.import_objects([destiny_raw])[0]
```

Notice `import_objects` will take a list of dictionaries and return back a list of objects.

## Update a document

Now `destiny` is an `Employee` object we can go ahead and update the details:

```python
destiny.address.postcode = "PH12 3RP"
destiny.address.street = "Lairg Road"
destiny.address.street_num = 73
destiny.address.town = "Newbigging"
```

Let's send `destiny` back to the database with `update_document`, the difference between `insert_document` and `update_document` is that, is an object(s) is already exist, `update_docuemnt` with replace the old with the new. It will also insert the document if it does not exist:

```python
client.update_document(destiny)
```

## Linking a new document to an old document

Now let's work on our new recruit. First we need to get the schema objects. Instead of importing it form `schema.py` like we did in [lesson 3](lesson_3.md), since we have them all the the `data_schema`, we will get them out from there:

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
ethan_manager = data_schema.import_objects([manager_raw])[0]
```

We can now create `ethan`:

```python
ethan = Employee(
    name="Ethan Abbott",
    title="Backend Developer",
    team=Team.it,
    contact_number="070 7796 8035",
    address=ethan_address,
    manager=ethan_manager,
)
```

All is ready, let's put `ethan` into the database. To prove `update_document` will also work, we will use it to insert `ethan`:

```python
client.update_document(ethan)
```

Or if you like, you can update `destiny` and insert `ethan` all at once like this:

```python
client.update_document([destiny, ethan])
```

To check if the database is up-to-date, you can do in the terminal like we did before:

`$ terminusdb alldocs`

Or if you are using TerminusX, you can also check it in the dashboard.

---

[Move on to Lesson 5 - Query on the database and get result back as CSV](lesson_5.md)
