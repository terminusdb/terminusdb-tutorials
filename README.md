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


#### JavaScript Client

Install using npm following:
https://github.com/terminusdb/terminus-client

## Stock Index Data

An example showing how to load stock index data from CSV.

Details: [index](https://github.com/terminusdb/terminusdb-tutorials/tree/master/stock_index)


## Python Brewery Example

Shows how you can build a complex schema in Python and load it.

Details: [index](https://github.com/terminusdb/terminusdb-tutorials/tree/master/brewery)


## Nuclear Power Plant Example

An example data product which holds information about all operating nuclear power reactors.

Details: [index](https://github.com/terminusdb/terminusdb-tutorials/tree/master/nuclear)


## The COVID-19 Public Data with Singer.io

Example of showing how to import data (COVID-19 Public Data) from a Singer.io tap to TerminusDB/ TerminusX.

Details: [README](https://github.com/terminusdb/terminusdb-tutorials/tree/master/covid_data/README.md)


## Exporting Data to Google Sheets with Singer.io

Example of showing how to export data from TerminusDB/ TerminusX to Google Sheets with Singer.io target.

Details: [README](https://github.com/terminusdb/terminusdb-tutorials/tree/master/google_sheets/README.md)
