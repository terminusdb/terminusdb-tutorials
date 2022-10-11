# Lesson 7 - Logical query using triple and WOQL

In this lesson we are exploring to a more advance territories. We will make some logical query with WOQL query. In may cases we only need to make document queries with the document interface that we covered in lesson 1 to 5. But in rare occasions, logical queries maybe the more straight forward and easy way to find information form the data we stored in our database

## Triples - Subject, Predicate and Object

In TerminusDB as store things as triples, each of them is consists of 'Subject', 'Predicate' and 'Object'. We can inspect all the the triples in a graph (in the following example, the instance graph) by using `star()` in `WOQLQuery`:

```
import pprint as pp

from terminusdb_client import WOQLClient
from terminusdb_client import WOQLQuery as wq

client = WOQLClient("http://127.0.0.1:6363/")
client.connect(db="getting_started")

pp.pprint(wq().star().execute(client))
```

By inspecting the output of the above code, we see all the triples within our instance graph.

With a bit of understand of how triples are related to each other, we can link up a few triples, leaving some "variables" which we wants to find the answer with, we can make WOQL queries which harness the power of logical programming in Prolog. We will explain all of it with examples.

## WOQLQuery - Making logical queries with triples

Let's imagine you are working with Awesome Startup in the example. You would like to find our the contact number of Darci, our creative writer to discuss about the next article publication. Here is how it is done:

```
from terminusdb_client import WOQLClient
from terminusdb_client import WOQLQuery as wq

client = WOQLClient("http://127.0.0.1:6363/")
client.connect(db="getting_started")

darci = wq().string("Darci Prosser")

query = wq().triple("v:person", "@schema:name", darci) + wq().triple("v:person", "@schema:contact_number", "v:phone_num")

result = query.execute(client)

if result["bindings"]:
    print("Darci's contact number:")
    print(result["bindings"][0]["phone_num"]["@value"])
else:
    print("Cannot find result.")

```

A few things to note here, first we have to create a WOQLQuery object with the string `"Darci Prosser"` as it needed to be started explicitly as a string in the database, not a string that we used to construct the query like `"v:person"` or `"@schema:name"`.

Second, the prefix before the `:` is telling TerminusDB how to treat the strings in the query. For example, a `v:` denote a variable so `v:person` is a variable that we don't know and would like to find what it is in the query. On the other hand, `@schema:` denote that it is a property that is defined in the schema, so `@schema:name` says that `name` is the property that we stated for the `Employee` documents in the schema.

Third, we can linked up the triples that we created with [`wq().triple`](https://terminusdb.com/docs/guides/reference-guides/python-client-reference/terminusdb_client.woqlquery) with either [`wq().woql_and`](https://terminusdb.com/docs/guides/reference-guides/python-client-reference/terminusdb_client.woqlquery) or a simple `+` like we did above.

So the query above can be interpreted as:

`There is a person who's name is "Darci Prosser" and I would like to know that person's contact number.`

As you see, making WOQL queries is quite logical, just need to think what questions you are asking and how to link up all the questions and informations with triple. With some practice you can get use to it. Let's try another one in the next example.

Let's say you have called Darci and unfortunately she is on holiday and you cannot wait for her to be back to talk about it. You decided to contact her manager instead. However, you do not know who her manager is and don't know the manager's contact number either. But fear not! With WOQL query it is not more complicated that making our previous query.

```
query = wq().triple("v:person", "@schema:name", darci) + wq().triple("v:person", "@schema:manager", "v:manager") + wq().triple("v:manager", "@schema:contact_number", "v:phone_num") + wq().triple("v:manager", "@schema:name", "v:manager_name")

result = query.execute(client)

if result["bindings"]:
    print("Manager's name:")
    print(result["bindings"][0]["manager_name"]["@value"])
    print("Manager's contact number:")
    print(result["bindings"][0]["phone_num"]["@value"])
else:
    print("Cannot find result.")
```

This time, instead of asking for Darci's contact number, you ask `who is the manager` and set the manager as a variable `v:manager`. Then with `v:manager` you can find out the `name` and `contact_number` of the manager.

As you can see, when the question get more complicated, more triple is added to link up extra information. But the structure of the query is the same and it is much efficient and easier than joining tables many times in SQL queries to get the same answer.

Feel free to practice and play with the WOQL query. The code we showed in this lesson can be found in the file [woql_query.py](woql_query.py)

---

[Check out other tutorials](README.md)
