# Lesson 4 - Query on the database and get result back as json

In the past lessons, we have learnt how to build schema and import data. Now the database has all the data we wanted, what we will do after is to get information out of the data we have in the database.

In this lesson, we will learn how to query the database, get the information that we wanted.


## Query data in Javascript script

Let's have a look at [query_data.js](query_data.js).

Querying would be done by `queryDocument`, you will have to provide a template json that has `type` and the specific requirement(s) (in our case, `"team": "it"` or `"team": "marketing"`).

```javascript
const team_it = await client.queryDocument(
    { type: "Employee", query: { team: "IT" } },
    { as_list: true }
);

const team_marketing = await client.queryDocument(
    { type: "Employee", query: { team: "Marketing" } },
    { as_list: true }
);
```

Get to know who lives in `Stockport` town

```javascript
const result = await client.queryDocument({ type: "Employee", query: { address: { town: "Stockport" } }});
```

I won't spoil the results for you, you have to find it out yourself :-)

`$ node query_data.js`

---

[Move on to Lesson 5 - Version control: time travel, branching and rebase](lesson_5.md)
