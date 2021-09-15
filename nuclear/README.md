# Nuclear Reactor Data Product

This is a multipart tutorial which will help to teach you the chops
you need to build real world data products.

To run the full code for the tutorial, you

## Getting the Python Client

First you should go and see how to get installed with the [Python Client](https://docs.terminusdb.com/v10.0/#/terminusx/start-with-a-client) in our documentation.

## Running the Tutorial

This tutorial series is structured as literate programming
tutorials. This means you can either copy-paste the snippets and run
them yourself or you can clone the repository and run the files
directly using our short script in our `make`-file.

To clone the repository and run it, however, first you'll need a [key from
TerminusX](https://docs.terminusdb.com/v10.0/#/terminusx/get-your-api-key).

You will also need to copy your *team name* into the enviornment variable

```shell
$ git clone https://github.com/terminusdb/terminusdb-tutorials/
$ cd terminusdb-tutorials/nuclear
$ export TERMINUSDB_TEAM="TerminatorsX"
$ export TERMINUSDB_ACCESS_TOKEN="eyJhbG..."
$ make nuclear
$ make cleaning
```

# Nuclear Reactor Data Product (Part 1)

[Nuclear.md](./nuclear.md)

# Data Product Query and Verification (Part 2)

[Cleaning.md](./cleaning.md)

# Data Product Cleaning (Part 3)

TBD

