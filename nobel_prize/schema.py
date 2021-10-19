####
# This is the script for storing the schema of your TerminusDB
# database for your project.
# Use 'terminusdb commit' to commit changes to the database and
# use 'terminusdb sync' to change this file according to
# the exsisting database schema
####
from terminusdb_client.woqlschema import DocumentTemplate


class nobel_prize(DocumentTemplate):
    born: str
    bornCity: str
    bornCountry: str
    bornCountryCode: str
    category: str
    city: str
    country: str
    died: str
    diedCity: str
    diedCountry: str
    diedCountryCode: str
    firstname: str
    gender: str
    motivation: str
    name: str
    overallMotivation: str
    share: str
    surname: str
    year: str
