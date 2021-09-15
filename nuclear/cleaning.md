# Verification and Cleaning your Data Product

In this tutorial we will look at what we have created and find
problems with it.

The fact that we have a rich and well specified schema which enforces
the kinds of links we have in our document graph is a good start, but
data can be dirty in complex ways. If it was already clean, we
wouldn't need to make data products!

## Preliminaries

Of course we need the client so we can talk to the server...

```python
#!/usr/bin/python3
from terminusdb_client import WOQLClient
```

## Finding the problems

As it turns out, some of the reported output quantities look very
reasonable, but perhaps in browsing around in TerminusX we found some
suspicious values. The `St. Alban` reactor record for instance has a
reported capacity of `2670.0 MWe` in our data. To a nuclear engineer
it is obvious that this is too high to be electrical capacity, and is
likely the thermal capacity.

We can get the `St. Alban` record with the following:

```python

result = client.query_document({ '@type' : 'PowerReactor',
                                 'name' : 'ST ALBAN' })
print(json.dumps(list(result), indent=4, sort_keys=True))


```
