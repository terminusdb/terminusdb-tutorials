# Diff and Patch with TerminusDB/ TerminusCMS Demo

In this demo tutorial, we will show how the diff and patch operation can be applied to monitor changes in TerminusDB schema, TerminusDB documents, JSON schema and with other document database like MongoDB.

To install the Python client, [check out here](https://github.com/terminusdb/terminusdb-client-python#installation).

Make sure you have the [docker container running on `localhost`](https://github.com/terminusdb/terminusdb-bootstrap).

## Using Diff and Patch with TerminusDB (Python)

In [this script](./diff_demo.py) we demonstrate in parts with various objects (TerminusDB schema, TerminusDB documents or just a JSON schema) that `diff` will give you a `Patch` object back and with that object you can apply `patch` to modify an object.

In terminusDB all documents and schemas are represented in JSON-LD format. With diff and patch, we can easily compare any documents and schemas to see what has been changed. Consider documents as a Python object:

```
class Person(DocumentTemplate):
    name: str
    age: int

jane = Person(name="Jane", age=18)
janine = Person(name="Janine", age=18)
```

You can directly apply diff to get a patch object:

```
result_patch = client.diff(jane, janine)

pprint(result_patch.content)
```
With the patch object (`result_patch` here), you can either review it's content or you can apply it to an object and you can get an after object back.

```
after_patch = client.patch(jane, result_patch)

pprint(after_patch)
assert after_patch == janine._obj_to_dict()
```

As you see, the `after_patch` object (document) is the same as `janine`. In other application, you can put this document back in the database using `replace_document` to commit this change.

Diff and patch also works with JSON-LD documents:

```
jane = { "@id" : "Person/Jane", "@type" : "Person", "name" : "Jane"}
janine = { "@id" : "Person/Jane", "@type" : "Person", "name" : "Janine"}

result_patch = client.diff(jane, janine)

pprint(result_patch.content)
```

It is also not limited to JSON-LD, it can works with schemas:

```
class Company(DocumentTemplate):
    name: str
    director: Person

schema1 = WOQLSchema()
schema1.add_obj("Person", Person)
schema2 = WOQLSchema()
schema2.add_obj("Person", Person)
schema2.add_obj("Company", Company)

result_patch = client.diff(schema1, schema2)

pprint(result_patch.content)
```

Note that diff and patch will work on most JSON formats. Another application is to compare 2 JSON schemas:

```
schema1 = {
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "birthday": { "type": "string", "format": "date" },
    "address": { "type": "string" },
  }
}

schema2 = {
  "type": "object",
  "properties": {
    "first_name": { "type": "string" },
    "last_name": { "type": "string" },
    "birthday": { "type": "string", "format": "date" },
    "address": {
      "type": "object",
      "properties": {
        "street_address": { "type": "string" },
        "city": { "type": "string" },
        "state": { "type": "string" },
        "country": { "type" : "string" }
      }
    }
  }
}

result_patch = client.diff(schema1, schema2)

pprint(result_patch.content)
```

See the [full script here](./diff_demo.py)

## Using Diff and Patch with MongoDB

In [this script](./mongo_demo.py) we demonstrate how this can be used in your MongoDB workflow. The first part of the script is just the [tutorial here on how to use Pymongo](https://www.mongodb.com/languages/python) and in the second part we demonstrate an extra step to review the changes before apply to your collection on MongoDB.

As we discover in the last session, diff and patch can apply to any JSON format. Since MongoBD also use JSON format to describe their data, we can use diff and patch to do the similar thing. Here we use the tutorial for Pymongo as an example:

```
client = MongoClient(os.environ["MONGO_CONNECTION_STRING"])

# Create the database for our example (we will use the same database throughout the tutorial
connection = client['user_shopping_list']

collection_name = connection["user_1_items"]

item_1 = {
"_id" : "U1IT00001",
"item_name" : "Blender",
"max_discount" : "10%",
"batch_number" : "RR450020FRG",
"price" : 340,
"category" : "kitchen appliance"
}

item_2 = {
"_id" : "U1IT00002",
"item_name" : "Egg",
"category" : "food",
"quantity" : 12,
"price" : 36,
"item_description" : "brown country eggs"
}
collection_name.insert_many([item_1,item_2])

expiry_date = '2021-07-13T00:00:00.000'
expiry = dt.datetime.fromisoformat(expiry_date)
item_3 = {
"item_name" : "Bread",
"quantity" : 2,
"ingredients" : "all-purpose flour",
"expiry_date" : expiry
}
collection_name.insert_one(item_3)
```

Imagine we want to change item_1:

```
new_item_1 = {
"_id" : "U1IT00001",
"item_name" : "Blender",
"max_discount" : "50%",
"batch_number" : "RR450020FRG",
"price" : 450,
"category" : "kitchen appliance"
}
```

We can compare the old and new item 1 with diff and patch:

```
tbd_endpoint = WOQLClient("http://localhost:6363/")

# Find the item back from database in case someone already changed it
item_1 = collection_name.find_one({"item_name" : "Blender"})
patch = tbd_endpoint.diff(item_1, new_item_1)

pprint(patch.content)
```

Again, we can review before making the change at MongoDB:

```
collection_name.update_one(patch.before, {"$set": patch.update})
```

There's also another more complicated example:

```
expiry_date = '2021-07-15T00:00:00.000'
expiry = dt.datetime.fromisoformat(expiry_date)
new_item_3 = {
"item_name" : "Bread",
"quantity" : 5,
"ingredients" : "all-purpose flour",
"expiry_date" : expiry
}

item_3 = collection_name.find_one({"item_name" : "Bread"})
item_id = item_3.pop('_id') # We wnat to pop it out and optionally we can add it back
patch = tbd_endpoint.diff(item_3, new_item_3)

pprint(patch.content)

# Add _id back, though it still works without
before = patch.before
before['_id'] = item_id

collection_name.update_one(before, {"$set": patch.update})
```

See the [full script here](./mongo_demo.py)

## Using Diff and Patch with TerminusDB (JavaScript)

Just like last session, diff and patch can be used to compare any documents and schemas to see what has been changed with the JavaScript client. In [this script](./diff_patch.js) we will demonstrate it.

In here we created a function called `patchMongo`:

```
const mongoPatch = function(patch){
    let query = {};
    let set = {};

    if('object' === typeof patch){
        for(var key in patch){
            const entry = patch[key];

            if( entry['@op'] == 'SwapValue'){
                query[key] = entry['@before'];
                set[key] = entry['@after'];
            }else if(key === '_id'){
                query[key] = ObjectId(entry);
            }else{
                let [sub_query,sub_set] = mongoPatch(entry);
                query[key] = sub_query;
                if(! sub_set === null){
                    set[key] = sub_set;
                }
            }
        }
        return [query,set]
    }else{
        return [patch,null]
    }
}
```

Where we create an object that we can put back to update the data in MongoDB:

```
let patchPromise = client.getDiff(jane,janine,{});
patchPromise.then( patch => {
    let [q,s] = mongoPatch(patch)
    console.log([q,s]);

    const res = db.inventory.updateOne(q, { $set : s});
    console.log(res);
    if (res.modifiedCount == 1){
        console.log("yay!")
    }else{
        console.log("boo!")
    }
    console.log(patch);
});
```

See the [full script here](./diff_patch.js)
