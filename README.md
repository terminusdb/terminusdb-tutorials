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

## Getting Started using TerminusDB/ TerminusX with Python client

A tutorial series to help anyone who's new to TerminusDB/ TerminusX to start working using the Python client.

Details: [README](./getting_started/python-client/README.md)

## Stock Index Data

An example showing how to load stock index data from CSV.

Details: [index](./stock_index)


## Python Brewery Example

Shows how you can build a complex schema in Python and load it.

Details: [index](./brewery)


## Nuclear Power Plant Example

An example data product which holds information about all operating nuclear power reactors.

Details: [index](./nuclear)

## Using TerminusX in React App

Use TerminusX to build a React app that serves as a simple content management app.

Details: [README](./react-example/README.md)
