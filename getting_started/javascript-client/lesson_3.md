# Lesson 3 - Update and import new data that links to old data

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

Let's look at how to update Destiny's Address. We did it with the [update_data.js](update_data.js). 

Now we import the Employee document that represent Destiny. Since we know the id, we will just use getDocument to do so:

```javascript
const destiny = await client.getDocument({"id":"Employee/001"});
```

## Update a document

Now `destiny` is an `Employee` object we can go ahead and update the details:

```javascript
  // will have to delete "@id" because database will create a new one
  delete destiny.address['@id'];

  destiny.address.postcode = "PH12 3RP";
  destiny.address.street = "Lairg Road";
  destiny.address.street_num = 73;
  destiny.address.town = "Newbigging";
  
```

Let's send `destiny` back to the database with `updateDocument`, the difference between `addDocument` and `updateDocument` is that, if an object(s) is already exist, `updateDocument` with replace the old with the new.

```javascript
await client.updateDocument(destiny);
```

## Linking a new document to an old document

Now let's work on our new recruit. We now create `ethan` and link manager as `Employee/004`:

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

All is ready, let's put `ethan` into the database. we will use `addDocument` to insert `ethan`:

```javascript
await client.addDocument(ethan);
```

Run the scripts:

`$ node update_data.js`

To check if the database is up-to-date, you can do in the terminal like we did before:

```javascript
const result = await client.getDocument({"as_list":true});
console.log(result);
```

Or if you are using TerminusCMS, you can also check it in the dashboard.

---

[Move on to Lesson 4 - Query on the database and get result back as json](lesson_4.md)
