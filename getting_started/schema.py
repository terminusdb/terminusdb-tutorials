####
# This is the script for storing the schema of your TerminusDB
# database for your project.
# Use 'terminusdb commit' to commit changes to the database and
# use 'terminusdb sync' to change this file according to
# the exsisting database schema
####
"""
Title: Phonebook for Awesome Startup
Description: Database storing all the contact details of all employees in Awesome Startup
Authors: Destiny Norris, Fabian Dalby
"""
from typing import List, Optional, Set

from terminusdb_client.woqlschema import (
    DocumentTemplate,
    EnumTemplate,
    HashKey,
    TaggedUnion,
)


class Team(EnumTemplate):
    """Team within the company"""
    marketing = "Marketing"
    it = "Information Technology"


class Address(DocumentTemplate):
    """Home address of Employee

    Attributes
    ----------
    street_num : int
        Street number.
    street : str
        Street name.
    town : str
        Town name.
    postcode : str
        Postal Code
    """
    _subdocument = []
    street_num: int
    street: str
    town: str
    postcode: str


class Employee(DocumentTemplate):
    """Employee of the Company"""
    name: str
    title: str
    manager: Optional['Employee']
    address: Address
    contact_number: str
