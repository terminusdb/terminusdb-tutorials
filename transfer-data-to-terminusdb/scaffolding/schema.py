####
# This is the script for storing the schema of your TerminusDB
# database for your project.
# Use 'terminusdb commit' to commit changes to the database and
# use 'terminusdb sync' to change this file according to
# the exsisting database schema
####

from typing import List

from terminusdb_client.woqlschema import DocumentTemplate, RandomKey, ValueHashKey


class Address(DocumentTemplate):
    _subdocument = []
    city: "City"
    coordinates: List["Coordinates"]
    postal_code: str
    street: str


class Brewery(DocumentTemplate):
    _key = RandomKey()
    address_of: "Address"
    name: str
    phone: str
    type_of: "Brewery_Type"
    website_url: str


class Brewery_Type(DocumentTemplate):
    _key = ValueHashKey()
    name: str


class City(DocumentTemplate):
    _key = ValueHashKey()
    name: str
    state: "State"


class Coordinates(DocumentTemplate):
    _key = RandomKey()
    latitude: float
    longitude: float


class Country(DocumentTemplate):
    _key = ValueHashKey()
    name: str


class State(DocumentTemplate):
    _key = ValueHashKey()
    country: "Country"
    name: str
