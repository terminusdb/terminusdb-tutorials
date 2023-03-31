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
from typing import Optional

from terminusdb_client.woqlschema import DocumentTemplate, EnumTemplate


class Address(DocumentTemplate):
    """Home address of Employee

    Attributes
    ----------
    postcode : str
        Postal Code
    street : str
        Street name.
    street_num : int
        Street number.
    town : str
        Town name.
    """

    _subdocument = []
    postcode: str
    street: str
    street_num: int
    town: str


class Employee(DocumentTemplate):
    """Employee of the Company"""

    address: "Address"
    contact_number: str
    manager: Optional["Employee"]
    name: str
    team: "Team"
    title: str


class Team(EnumTemplate):
    marketing = ()
    it = ()
