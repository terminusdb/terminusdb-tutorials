# Diff and Patch with TerminusDB/ TerminusX Demo

In this demo tutorial, we will show how the diff and patch operation can be applied to monitor changes in TerminusDB schema, TerminusDB documents, JSON schema and with other document database like MongoDB.

To install the Python client, [check out here](https://github.com/terminusdb/terminusdb-client-python#installation).

## Using Diff and Patch with TerminusDB

In [this script](./diff_demo.py) we demonstrate in parts with various objects (TerminusDB schema, TerminusDB documents or just a JSON schema) that `diff` will give you a `Patch` object back and with that object you can apply `patch` to modify an object.

## Using Diff and Patch with MongoDB

In [this script](./mongo_demo.py) we demonstrate how this can be used in your MongoDB workflow. The first part of the script is just the [tutorial here on how to use Pymongo](https://www.mongodb.com/languages/python) and in the second part we demonstrate an extra step to review the changes before apply to your collection on MongoDB.
