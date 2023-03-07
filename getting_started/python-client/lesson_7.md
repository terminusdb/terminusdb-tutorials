# Lesson 7 - Logical query using triple and WOQL

In this lesson we are exploring more advanced territories. We will do logical queries with WOQL query. In many cases we only need to make document queries with the document interface that we covered in lessons 1 to 5. But on rare occasions, logical queries maybe the more straight forward and easy way to find information from the data we stored in our database

## Triples - Subject, Predicate and Object

In TerminusDB things are stored as triples, each consists of 'Subject', 'Predicate' and 'Object'. We can inspect all of the triples in a graph (in the following example, the instance graph) by using `star()` in `WOQLQuery`:

```
import pprint as pp

from terminusdb_client import WOQLClient
from terminusdb_client import WOQLQuery as wq

client = WOQLClient("http://127.0.0.1:6363/")
client.connect(db="getting_started")

pp.pprint(wq().star().execute(client))
```

By inspecting the output of the above code, we see all the triples within our instance graph.

With a bit of understanding about how triples are related to each other, we can link triples, leaving some "variables" that we want to find the answer to. We can make WOQL queries that harness the power of logical programming in Prolog. We will explain it all with examples.

## WOQLQuery - Making logical queries with triples

Let's imagine you are working with our example company, Awesome Startup. You would like to find the contact number of Darci, the creative writer, to discuss the next article publication. Here is how it is done:

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

A few things to note here, first we have to create a WOQLQuery object with the string `"Darci Prosser"` as it needed to be stated explicitly as a string in the database, not a string that we used to construct the query like `"v:person"` or `"@schema:name"`.

Secondly, the prefix before the `:` is telling TerminusDB how to treat the strings in the query. For example, a `v:` denotes a variable so `v:person` is a variable that we don't know and would like to find what it is in the query. On the other hand, `@schema:` denotes that it is a property that is defined in the schema, so `@schema:name` says that `name` is the property that we stated for the `Employee` documents in the schema.

Finally, we can link the triples we created with [`wq().triple`](https://terminusdb.github.io/terminusdb-client-python/woqlQuery.html#terminusdb_client.WOQLQuery.triple) with either [`wq().woql_and`](https://terminusdb.github.io/terminusdb-client-python/woqlQuery.html#terminusdb_client.WOQLQuery.woql_and) or a simple `+` like we did above.

So the query above can be interpreted as:

`There is a person who's name is "Darci Prosser" and I would like to know that person's contact number.`

As you see, making WOQL queries is quite logical, you just need to think about what question you are asking and how to link all the questions and parts of the triple. With some practice you will get used to it. Let's try another example.

Let's say you have called Darci and unfortunately she is on holiday and you cannot wait for her to get back. You decided to contact her manager instead. However, you do not know who her manager is or their contact number either. But fear not! With WOQL query it is a logical query similar to the example above.

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

As you can see, when the questions get more complicated, more triples are added to link the extra information. The structure of the query reamins the same and is much easier and more efficient than joining tables many times in SQL queries to get the same answer.

Feel free to practice and play with the WOQL query. The code we showed in this lesson can be found in the file [woql_query.py](woql_query.py)

---

[Check out other tutorials](README.md)
