# Lesson 3 - Update and import new data that links to old data

Remember the company phonebook stored in TerminusDB? It has been a few months and there is a new recruit:

| Employee id | Name           | Title               | Team        | Manager     |
| ----------- | -------------- | ------------------- | ----------- | ----------- |
| 005         | Ethan Abbott   | Backend Developer   | IT          | 004         |

| Employee id | Contact number  | Home address                  | Postcode |
| ----------- | --------------- | ----------------------------- | -------- |
| 005         | 070 7796 8035   | 84 Shore Street, Stoer        | IV27 2TG |

Also, the Marketing Manager Destiny has moved to a new address:

| Employee id | Contact number  | Home address                  | Postcode |
| ----------- | --------------- | ----------------------------- | -------- |
| 001         | (01986) 113367  | 73 Lairg Road, Newbigging     | PH12 3RP |

How are we going to update the records?

## Getting data objects back from TerminusDB/ TerminusCMS

Let us first look at how to update Destiny's Address. We will use a script called [update_data.js](update_data.js). 

Let's examine the parts of the script. We import the Employee document that represents Destiny. Since we know the id, we will use getDocument:

```javascript
const destiny = await client.getDocument({"id":"Employee/001"});
```

## Update a document

We know `destiny` is an `Employee` object so we can go ahead and update the details:

```javascript
  // will have to delete "@id" because the database will create a new one
  delete destiny.address['@id'];

  destiny.address.postcode = "PH12 3RP";
  destiny.address.street = "Lairg Road";
  destiny.address.street_num = 73;
  destiny.address.town = "Newbigging";
  
```

The script then sends `destiny` back to the database with `updateDocument`. The difference between `addDocument` and `updateDocument` is that if an object already exists `updateDocument` will replace the old with the new.

```javascript
await client.updateDocument(destiny);
```

## Linking a new document to an old document

Now let's work on our new recruit. We now create `ethan` and link Ethan's manager as `Employee/004`:

```javascript
const ethan = {
    "@type": "Employee",
    "employee_id": "005",
    name: "Ethan Abbott",
    title: "Backend Developer",
    team: "IT",
    contact_number: "070 7796 8035",
    address: {
        "@type": "Address",
        postcode: "IV27 2TG",
        street: "Shore Street",
        street_num: 84,
        town: "Stoer"
    },
    manager: "Employee/004",
}
```

All is ready so we'll put `ethan` into the database. Use `addDocument` to insert `ethan`:

```javascript
await client.addDocument(ethan);
```

Before running the script ensure to set the end point, team and user credentials.

Run the scripts:

`$ node update_data.js`

Use the terminal to check if the database is up-to-date:

```javascript
const result = await client.getDocument({"as_list":true});
console.log(result);
```

If you are using TerminusCMS, you can also check it in the dashboard.

---

[Lesson 4 - Query the database and get result back as JSON](lesson_4.md)
