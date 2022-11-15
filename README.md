# Tutorials for using TerminusDB

## Installation

#### TerminusDB

Docker image available at https://github.com/terminusdb/terminusdb-bootstrap

#### Python Client

Latest version: [![PyPI version shields.io](https://img.shields.io/pypi/v/terminusdb-client.svg?logo=pypi)](https://pypi.python.org/pypi/terminusdb-client/)

Create new environment (optional but recommended):

```
$ python3 -m venv ~/.virtualenvs/terminusdb
$ source ~/.virtualenvs/terminusdb/bin/activate
```

Install using pip:

`$ python3 -m pip install terminusdb-client`

If you are new to TerminusDB/ TerminusX and will use Python client, you are recommended to check out the [Getting Started tutorial series](./getting_started/python-client).


#### JavaScript Client

Install using npm following:
https://github.com/terminusdb/terminus-client

---

## GraphQL Tutorials

For more details about how to use GraphQL with TerminusDB, please refer to the [GraphQL section of our documentation](https://terminusdb.com/docs/guides/reference-guides/graphql_query).

### Building a Blog-Focused CMS with TerminusDB

This project is designed to show how you can build a custom web-app using TerminusDB from scratch with little effort.

Details: [README](./terminusBlog)

### Playing with Star Wars RDF Data Set Using GraphQL

Taking you through the process of loading RDF into TerminusDB and then using GraphQL to query the Star Wars data.

Details: [README](./star-wars)

## Getting Started using TerminusDB/ TerminusX with the Python client

A tutorial series to help anyone who's new to TerminusDB/ TerminusX to start working using the Python client.

Details: [README](./getting_started/python-client/README.md)

## Getting Started using TerminusDB/ TerminusX with the JavaScript client

A tutorial series to help anyone who's new to TerminusDB/ TerminusX to start working using the JavaScript client.

Details: [README](./getting_started/javascript-client)

## Stock Index Data

An example showing how to load stock index data from CSV.

Details: [index](./stock_index)

## Nuclear Power Plant Example

An example data product which holds information about all operating nuclear power reactors.

Details: [index](./nuclear)

## Using TerminusX in React App

Use TerminusX to build a React app that serves as a simple content management app.

Details: [README](./react-example/README.md)
