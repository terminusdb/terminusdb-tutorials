# How-to: Loading RDF data from DBpedia

TerminusDB can be used both as a database enabling query but also as a content sharing platform. In this tutorial we'll show how you can load a relatively large RDF dataset and prepare it for distribution.

In order to set up the files for import etc, you can first run [the setup script](./setup.py). This uses a few utilties that are requirements: `wget`, `bzip2` and `split`.

This script downloads the files from dbpedia and splits each of them into 200k line chunks in separate directories, which allows us to load the turtle a bit at a time.

Once you've successfully run setup, you'll be able to work through the tutorial programme.  We also include the complete source for the [dbpedia import script](./dbpedia.py) which effectively runs through this tutorial.

## Boiler plate

First, we have to set up the connection to the server. This involves creating a WOQL client object and calling connect with the appropriate parameters to connect to the database of interest. In this case, "dbpedia".

We'll also save a list of branches which we intend to create along the way.

```python
server_url = "https://127.0.0.1:6363"
db = "dbpedia"
db_label = "DBpedia"
db_comment = "The mapped literal, object and types from DBpedia core"
user = "admin"
account = "admin"
key = "root"
branches = ["literal","object","type"]

client = WOQLClient(server_url, insecure=True)
client.connect(user=user, account=account, key=key, db=db, insecure=True)
```

Then we have to create the database. Here we also delete it if it already existed. This might be convenient for you if you make a few false starts.

```python
try:
    client.delete_database(db)
except Exception as E:
    print(E)

client.create_database(db,account,label=db_label,
                       description=db_comment,
                       include_schema=False)
```

## Ingesting Turtle

The setup script split a number of files into separate directories. We've named the directories so they each correspond with a different branch.

The branching structure helps us to keep distinct data separate if we want to use it independently. You can combine branches using rebase, or push or pull individual branches rather than all of the content in the database.

We therefore load each branch in turn in a for loop as follows:

```python
for branch in branches:
    client.branch(branch, empty=True)
    client.checkout(branch)
```

First, we create the branch with `client.branch(branch, empty=True)`. We pass the name of the branch as a parameter, but we also want to create a completely empty branch rather than starting from the current commit as is the default. For the first branch it doesn't matter, but subsequently we want the data going into a fresh branch.

The second line simply tells the client we want to view `branch` as our current working branch.


---
**NOTE**

You can branch from any commit you'd like simply by using `client.checkout(ref)` and then calling branch.

---

```python
    print(f"Importing from {branch}")
    for f in os.listdir(branch):
        filename = f'{branch}/{f}'
        ttl_file = open(filename)
        contents = ttl_file.read()
        ttl_file.close()
```

Now we loop over the files in the subdirectory containing the split turtle files. We load each file into a string `contents`.

```python
        # start the chunk work
        before = time.time()
        client.insert_triples(
            "instance","main",
            contents,
            f"Adding {branch} in 200k chunk ({f})")
        after = time.time()
        total = (after - before)
        print(f"Update took {total} seconds")
```

Here we call `client.insert_triples`. This will add every triple that it encounters in the string `contents` to the database in an `instance` graph called `main`. This is the default data graph (as opposed to the schema graph) for a branch.

## Rebase: Putting data together

After this has run (*Warning: this should take a while! perhaps a few hours*), we can create a single branch composed out of the other ingests. We do this with rebase.

Again we'll loop over the branches we created and do a rebase.

```python
for branch in branches:
    print("Rebasing {branch}")
    client.checkout('main')
    before = time.time()
    client.rebase({"rebase_from": f'{user}/{db}/local/branch/{branch}',
                   "author": user,
                   "message": "Merging {branch} into main"})
    after = time.time()
    total = (after - before)
    print(f"Rebase took {total} seconds")
    report_total([total])
```
We check out main to signify that it will be the target of the rebase. Then we call `client.rebase` with a dictionary describing what we would like to rebase from, along with a commit message and author. This will merge the data in the `"rebase_from"` branch, replaying the commits of what was already there.

## Making it smaller / faster

If you are trying to create a curated dataset for the first time, you aren't interested in the commit history at the moment, or if you want to create another fresh branch for analytic purposes without provenance, you can use a squash.

---
**NOTE**

Squash is currently memory hungry. While TerminusDB is very parsimonious, requiring about 1/10th the amount of memory of the turtle file which is loaded, you can expect with squash to need twice as much memory as is required by the branch you are squashing.

---


```python
print(f"Squashing main")
before = time.time()
result = client.squash('Squash all commits')
after = time.time()
total = (after - before)
print(f"Squash took {total} seconds")
report_total([total])
```

The command `client.squash` simply uses the current checked out branch as the starting point and will return a result object which contains the address of the final squash commit at `result['api:commit]`. We can then either simply remember this is where we kept our commit, or we can set a branch to hold it.


```python
commit = result['api:commit']
print(f"Branch reset to {commit}")
client.reset(commit)
```

To set the resulting squash commit to the current checked out branch we can simply call `client.reset` with the commit address.

Alternatively we could create a new branch, check out the branch and then reset the head of our new branch to that commit. Here we just reuse main for simplicity.

---
**NOTE**

Squash may not be the best for consumable publishing as regular data consumers may already have had much of your data and could be best served with updates from new commits, rather than having to re-download the entire dataset each time. Instead users can squash locally

---

## Final remarks

And if you've managed to run this much of the program you should have a database which you can play with. You should be able to reuse much of this for any turtle database you'd like to load and play with.

If you have data in XML-RDF, you can use one of the many tool sets (such as rapper) to transform it into turtle.

If all you really want to do is play with DBpedia, then you should simply clone the pre-prepared data from TerminusHub!
