# Nuclear Reactor Data Product

This is a multipart tutorial which will help to teach you the chops
you need to build real world data products.

To run the full code for the tutorial, you need to follow the instructions below.

## Getting the Python Client

First you should go and see how to get installed with the [Python Client](https://terminusdb.com/docs/terminusdb/install-client/install-python-client) in our documentation.

## Running the Tutorial

This tutorial series is structured as literate programming
tutorials. This means you can either copy-paste the snippets and run
them yourself or you can clone the repository and run the files
directly using our short script in our `make`-file.

To clone the repository and run it, however, first you'll need a [key from
TerminusCMS](https://terminusdb.com/docs/terminuscms/get-api-key).

You will also need to copy your *team name* into the environment variable

```shell
$ git clone https://github.com/terminusdb/terminusdb-tutorials/
$ cd terminusdb-tutorials/nuclear
$ export TERMINUSDB_TEAM="TerminatorsX"
$ export TERMINUSDB_ACCESS_TOKEN="eyJhbG..."
$ make nuclear
$ make enrichment
$ make scraping
```

# Nuclear Reactor Data Product (Part 1)

[Nuclear](./nuclear.md)

# Data Product Enrichment (Part 2)

[Enrichment](./enrichment.md)

# Scraping Data (Part 3)

[Scraping](./scraping.md)
