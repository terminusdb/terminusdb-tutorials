# Lesson 4 - Query the database and get result back as JSON

In previous lessons, we have learnt how to build a schema and import data. Now the database has all the data we need, we will learn how to query the database to get information out.


## Query data with a JavaScript script

Let's have a look at the [query_data.js](query_data.js) script.

Querying is achieved with `queryDocument`, you need to provide a JSON template that has `type` and the specific requirement(s). In our case we're looking for  `"team": "it"` or `"team": "marketing"`.

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

This query shows how to find an employee who lives in `Stockport`.

```javascript
const result = await client.queryDocument({ type: "Employee", query: { address: { town: "Stockport" } }});
```

We won't spoil the results for you, you have to find it out yourself :-)

`$ node query_data.js`

---

[Lesson 5 - Version control: time travel, branching and rebase](lesson_5.md)
